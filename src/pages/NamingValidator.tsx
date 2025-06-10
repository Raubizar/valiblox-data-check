
import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/NamingValidator/HeroSection";
import { ProcessSteps } from "@/components/NamingValidator/ProcessSteps";
import { ValidationResults } from "@/components/NamingValidator/ValidationResults";
import { HowItWorks } from "@/components/NamingValidator/HowItWorks";
import { FeaturesSection } from "@/components/NamingValidator/FeaturesSection";
import { CompactProjectSelector } from "@/components/CompactProjectSelector";
import { ProjectContextSelector } from "@/components/ProjectContextSelector";
import { validateName, parseNamingRules, NamingRules } from "@/lib/naming";
import { ProjectService } from "@/lib/projectService";
import type { Project } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, Loader2, FolderOpen } from "lucide-react";
import { DownloadModal } from "@/components/DownloadModal";
import { useAuth } from "@/hooks/useAuth";
import { useFakeAuth } from "@/hooks/useFakeAuth";

const STEPS = [
  { id: 1, title: 'Upload Template', description: 'Select your naming standard template' },
  { id: 2, title: 'Select Files', description: 'Choose files to validate' },
  { id: 3, title: 'Review Results', description: 'Analyze validation results' }
];

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="w-full mb-8">
    <div className="flex items-center justify-between relative">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step.id < currentStep 
              ? 'bg-green-600 text-white' 
              : step.id === currentStep
              ? 'bg-green-500 text-white'
              : 'bg-gray-300 text-gray-600'
          }`}>
            {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : step.id}
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-900">{step.title}</div>
            <div className="text-xs text-gray-500">{step.description}</div>
          </div>
          {index < STEPS.length - 1 && (
            <div className={`absolute top-5 h-0.5 ${
              step.id < currentStep ? 'bg-green-600' : 'bg-gray-300'
            }`} style={{ 
              left: `${((index + 1) / STEPS.length) * 100}%`, 
              width: `${(1 / STEPS.length) * 100}%`,
              transform: 'translateX(-50%)'
            }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

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
  const [isProcessing, setIsProcessing] = useState(false);
    // Project management state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Timing and scroll state
  const [validationStartTime, setValidationStartTime] = useState<number | null>(null);
  const [validationDuration, setValidationDuration] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
    // Download modal state
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isFakeLoggedIn } = useFakeAuth();

  // Calculate current step
  const currentStep = validationComplete ? 4 : filesSelected ? 3 : templateUploaded ? 2 : 1;

  const handleDownloadRequest = () => {
    if (isAuthenticated) {
      // User is already authenticated, download immediately
      handleExportToCSV();
    } else {
      // Show auth modal
      setShowDownloadModal(true);
    }
  };

    const handleExportToCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add summary information
    csvContent += `"Total Files Verified","${complianceData.totalFiles}"\n`;
    csvContent += `"Names Comply","${complianceData.compliantFiles}"\n`;
    csvContent += `"Compliance Percentage","${complianceData.compliancePercentage}%"\n\n`;
    
    // Add headers
    csvContent += '"Folder Path","File Name","Status","Details"\n';
    
    // Add validation results
    validationResults.forEach(result => {
      // Remove HTML tags from details for CSV export
      const cleanDetails = result.details.replace(/<[^>]*>/g, '');
      csvContent += `"${result.folderPath}","${result.fileName}","${result.status}","${cleanDetails}"\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "naming_validation_results.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  // Handle save to project
  const handleSaveToProject = async () => {
    if (!validationComplete || !selectedProject) return;

    try {
      setIsSaving(true);

      // Create summary statistics
      const summary = {
        totalFiles: complianceData.totalFiles,
        compliantFiles: complianceData.compliantFiles,
        compliancePercentage: complianceData.compliancePercentage,
        processingTime: validationDuration
      };      // Save the report
      await ProjectService.saveReport({
        project_id: selectedProject.id,
        drawing_list_id: undefined,
        naming_standard_id: undefined, // We could save the naming standard file here in the future
        report_type: 'naming',
        title: `Naming Validation Report - ${new Date().toLocaleDateString()}`,
        results: {
          validationResults,
          complianceData,
          processingTime: validationDuration
        },
        summary
      });

      // Show success message (you can replace this with a toast notification)
      alert(`Validation report saved to project "${selectedProject.name}" successfully!`);
    } catch (error) {
      console.error('Error saving to project:', error);
      alert('Failed to save report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };const handleTemplateUpload = (namingConvention: any[][]) => {
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

    // Start timing
    const startTime = performance.now();
    setValidationStartTime(startTime);
    
    setIsProcessing(true);
    setFilesSelected(true);
    
    try {
      const results: ValidationResultItem[] = [];
      let compliantCount = 0;
      
      // Process files in batches to prevent UI freezing for large file sets
      const batchSize = 50;
      const totalFiles = files.length;
      
      for (let i = 0; i < totalFiles; i += batchSize) {
        const batch = Array.from(files).slice(i, i + batchSize);
        
        // Process this batch
        for (const file of batch) {
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
        
        // Allow UI to update between batches
        if (i + batchSize < totalFiles) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }      }
    
      // Group results by folder for better display
      const groupedResults = groupByFolder(results);
      const flatResults = groupedResults.flat();
      
      // Update state with validation results
      setValidationResults(flatResults);
      
      // Calculate and update compliance data
      const fileCount = files.length;
      const compliancePercentage = fileCount > 0 ? Math.round((compliantCount / fileCount) * 100) : 0;
        setComplianceData({
        totalFiles: fileCount,
        compliantFiles: compliantCount,
        compliancePercentage
      });
      
      // End timing and calculate duration
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // Convert to seconds
      setValidationDuration(duration);
      
      setValidationComplete(true);
      
      // Scroll to results with a small delay to ensure the component is rendered
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("Error processing files:", error);
      alert("There was an error processing the files. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
  };  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Fixed Timing Badge */}
      {validationComplete && validationDuration !== null && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top duration-500">
          <Badge className="bg-green-600 text-white px-4 py-2 text-sm font-medium shadow-lg">
            Generated in {validationDuration.toFixed(1)}s
          </Badge>
        </div>
      )}
      
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Naming Standard Validator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Ensure every file follows your project's Document Naming Standard — fast, consistent, and error-free.
            </p>
            {!validationComplete && (
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                onClick={() => document.getElementById('template-upload')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Upload className="w-5 h-5 mr-2" />
                Start Validating Files
              </Button>            )}
          </div>          {/* Project Context Selection - Only visible when logged in */}
          {isFakeLoggedIn && (
            <div className="flex justify-center mb-8">
              <div className="w-2/3">
                <ProjectContextSelector
                  selectedProjectId={selectedProject?.id || null}
                  selectedDisciplineId={selectedDiscipline || null}                  onProjectChange={(projectId, disciplineId, projectName) => {
                    if (projectId && projectName) {
                      // Create a basic project object with required fields
                      setSelectedProject({
                        id: projectId,
                        name: projectName,
                        description: '',
                        status: 'active' as const,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                      });
                    } else {
                      setSelectedProject(null);
                    }
                    setSelectedDiscipline(disciplineId || '');
                  }}
                />
              </div>
            </div>
          )}

          {/* Step Progress Indicator */}
          <StepIndicator currentStep={currentStep} />

          <ProcessSteps 
            onTemplateUpload={handleTemplateUpload}
            onFilesSelect={handleFilesSelect}
            templateUploaded={templateUploaded}
            isProcessing={isProcessing}
          />

          {validationComplete && (
            <div ref={resultsRef}>              <ValidationResults 
                complianceData={complianceData}
                validationResults={validationResults}
                onDownloadRequest={handleDownloadRequest}
                onSaveToProject={isFakeLoggedIn ? handleSaveToProject : undefined}
                selectedProject={isFakeLoggedIn ? selectedProject : undefined}
                selectedDiscipline={selectedDiscipline}
                isSaving={isSaving}
              />
            </div>
          )}

          {!validationComplete && <HowItWorks />}

          <FeaturesSection />
        </div>
      </main>
      
      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleExportToCSV}
        title="Download Validation Report"
        description="Enter your email to receive your naming validation report"
      />
      
      <Footer />
    </div>
  );
};

export default NamingValidator;
