import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/NamingValidator/HeroSection";
import { ProcessSteps } from "@/components/NamingValidator/ProcessSteps";
import { ValidationResults } from "@/components/NamingValidator/ValidationResults";
import { HowItWorks } from "@/components/NamingValidator/HowItWorks";
import { FeaturesSection } from "@/components/NamingValidator/FeaturesSection";
import { validateName, parseNamingRules, NamingRules } from "@/lib/naming";
import * as XLSX from 'xlsx';

// File validation result type
interface FileValidationResult {
  folderPath: string;
  fileName: string;
  status: 'Ok' | 'Wrong';
  details: string;
}

const NamingValidator = () => {
  const [templateUploaded, setTemplateUploaded] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [namingRules, setNamingRules] = useState<NamingRules | null>(null);
  const [validationResults, setValidationResults] = useState<FileValidationResult[]>([]);
  const [complianceData, setComplianceData] = useState({
    totalFiles: 0,
    compliantFiles: 0,
    compliancePercentage: 0
  });
  
  // References for file inputs
  const templateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handler for template file upload
  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      // Parse the naming rules
      const rules = parseNamingRules(data as any[][]);
      setNamingRules(rules);
      setTemplateUploaded(true);
      
      console.log("Naming rules loaded:", rules);
    } catch (error) {
      console.error("Error reading template file:", error);
      alert("There was an error reading the naming convention template. Please make sure it's in the correct format.");
    }
  };
  
  // Handler for folder selection
  const handleFolderSelect = async () => {
    if (!namingRules) {
      alert("Please upload a naming convention template first.");
      return;
    }
    
    try {
      // Try to use the File System Access API if available
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        const files: { name: string; path: string }[] = [];
        
        // Function to recursively read directory
        const readDirectory = async (
          dirHandle: any, 
          path = ""
        ) => {
          try {
            for await (const entry of dirHandle.values()) {
              const entryPath = path ? `${path}/${dirHandle.name}` : dirHandle.name;
              
              if (entry.kind === 'file') {
                files.push({
                  name: entry.name,
                  path: entryPath
                });
              } else if (entry.kind === 'directory') {
                await readDirectory(entry, entryPath);
              }
            }
          } catch (err) {
            console.error("Error reading directory:", err);
          }
        };
        
        await readDirectory(dirHandle);
        
        if (files.length === 0) {
          alert("No files found in the selected folder.");
          return;
        }
        
        // Validate each file
        processFiles(files);
      } else {
        // Fallback for browsers without directory picker
        alert("Your browser doesn't support folder selection. Please try using Chrome, Edge, or another modern browser.");
      }
    } catch (error) {
      console.error("Error selecting folder:", error);
      alert("There was an error accessing the selected folder.");
    }
  };
  
  // Handler for individual file selection
  const handleFilesSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Process the selected files
  const handleFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!namingRules) {
      alert("Please upload a naming convention template first.");
      return;
    }
    
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;
    
    const files = Array.from(fileList).map(file => ({
      name: file.name,
      path: "Uploaded Files" // Default path for directly uploaded files
    }));
    
    processFiles(files);
  };
  
  // Process and validate files
  const processFiles = (files: { name: string; path: string }[]) => {
    if (!namingRules) return;
    
    // Validate the files
    let compliantCount = 0;
    
    const results = files.map(file => {
      const result = validateName(file.name, namingRules);
      
      if (result.compliance === 'Ok') {
        compliantCount++;
      }
      
      return {
        folderPath: file.path,
        fileName: file.name,
        status: result.compliance,
        details: result.details
      };
    });
    
    const compliancePercentage = files.length > 0 
      ? Math.round((compliantCount / files.length) * 100) 
      : 0;
    
    setValidationResults(results);
    setComplianceData({
      totalFiles: files.length,
      compliantFiles: compliantCount,
      compliancePercentage
    });
    
    setFilesSelected(true);
    setValidationComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection validationComplete={validationComplete} />

          {/* Hidden file inputs for direct control */}
          <input 
            type="file" 
            ref={templateInputRef}
            style={{ display: 'none' }}
            accept=".xlsx,.xls"
            onChange={handleTemplateUpload}
          />
          
          <input 
            type="file" 
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
            onChange={handleFilesUpload}
          />

          <ProcessSteps 
            onTemplateUpload={() => templateInputRef.current?.click()}
            onFilesSelect={handleFolderSelect}
            templateUploaded={templateUploaded}
          />

          {validationComplete && (
            <ValidationResults 
              complianceData={complianceData}
              validationResults={validationResults}
            />
          )}

          {!validationComplete && <HowItWorks />}

          <FeaturesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NamingValidator;
