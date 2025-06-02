
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/NamingValidator/HeroSection";
import { ProcessSteps } from "@/components/NamingValidator/ProcessSteps";
import { ValidationResults } from "@/components/NamingValidator/ValidationResults";
import { HowItWorks } from "@/components/NamingValidator/HowItWorks";
import { FeaturesSection } from "@/components/NamingValidator/FeaturesSection";
import { validateName, parseNamingRules, NamingRules } from "@/lib/naming";

interface ValidationResultItem {
  folderPath: string;
  fileName: string;
  status: string;
  details: string;
}

interface ComplianceData {
  totalFiles: number;
  compliantFiles: number;
  compliancePercentage: number;
}

const NamingValidator = () => {
  const [templateUploaded, setTemplateUploaded] = useState(false);
  const [filesSelected, setFilesSelected] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [namingRules, setNamingRules] = useState<NamingRules | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResultItem[]>([]);
  const [complianceData, setComplianceData] = useState<ComplianceData>({
    totalFiles: 0,
    compliantFiles: 0,
    compliancePercentage: 0
  });
  const handleTemplateUpload = (namingConvention: any[][]) => {
    try {
      const rules = parseNamingRules(namingConvention);
      setNamingRules(rules);
      setTemplateUploaded(true);
      console.log("Naming rules loaded:", rules);
    } catch (error) {
      console.error("Error parsing naming convention:", error);
      alert("There was an error parsing the naming convention. Please check the file format.");
    }
  };

  const handleFilesSelect = async (files: FileList | File[]) => {
    if (!namingRules) {
      alert("Please upload a naming convention template first.");
      return;
    }

    setFilesSelected(true);
    
    const results: ValidationResultItem[] = [];
    let compliantCount = 0;
    
    // Process each file and validate its name
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = validateName(file.name, namingRules);
      
      // Get folder path from file if available
      // @ts-ignore - folderPath is a custom property we added
      const folderPath = file.folderPath || "Uploaded Files";
      
      results.push({
        folderPath,
        fileName: file.name,
        status: result.compliance,
        details: result.details
      });
      
      if (result.compliance === "Ok") {
        compliantCount++;
      }
    }
    
    // Group results by folder for better display
    const groupedResults = groupByFolder(results);
    const flatResults = groupedResults.flat();
    
    // Update state with validation results
    setValidationResults(flatResults);
    
    // Calculate and update compliance data
    const totalFiles = files.length;
    const compliancePercentage = totalFiles > 0 ? Math.round((compliantCount / totalFiles) * 100) : 0;
    
    setComplianceData({
      totalFiles,
      compliantFiles: compliantCount,
      compliancePercentage
    });
    
    setValidationComplete(true);
  };
  
  // Helper function to group results by folder
  const groupByFolder = (results: ValidationResultItem[]): ValidationResultItem[] => {
    const folderMap = new Map<string, ValidationResultItem[]>();
    
    // Group files by folder
    results.forEach(result => {
      if (!folderMap.has(result.folderPath)) {
        folderMap.set(result.folderPath, []);
      }
      folderMap.get(result.folderPath)!.push(result);
    });
    
    // Create a flat array with folder headers
    const flatResults: ValidationResultItem[] = [];
    
    folderMap.forEach((folderResults, folderPath) => {
      flatResults.push(...folderResults);
    });
    
    return flatResults;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-12 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection validationComplete={validationComplete} />

          <ProcessSteps 
            onTemplateUpload={handleTemplateUpload}
            onFilesSelect={handleFilesSelect}
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
