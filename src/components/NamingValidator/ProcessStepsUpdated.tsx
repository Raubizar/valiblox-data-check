import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, Folder, File, AlertCircle } from "lucide-react";
import * as XLSX from 'xlsx';
import { createTemplateFile } from "@/lib/naming";
import { supportsFileSystemAccessAPI, isModernBrowser, getBrowserInfo } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SampleLoadBox } from "@/components/SampleLoadBox";
import { useSampleLoader } from "@/hooks/useSampleLoader";

interface ProcessStepsProps {
  onTemplateUpload: (rules: any[][]) => void;
  onFilesSelect: (files: FileList | File[]) => void;
  templateUploaded: boolean;
  isProcessing?: boolean;
}

export const ProcessSteps = ({ onTemplateUpload, onFilesSelect, templateUploaded, isProcessing = false }: ProcessStepsProps) => {
  const [templateFileName, setTemplateFileName] = useState<string>("");
  const [folderName, setFolderName] = useState<string>("");
  const [filesSelected, setFilesSelected] = useState<number>(0);
  const [browserCompatible, setBrowserCompatible] = useState<boolean>(true);
  const [browserInfo, setBrowserInfo] = useState<{ name: string, version: string }>({ name: "", version: "" });
  const [showSampleLoader, setShowSampleLoader] = useState<boolean>(true);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const { loadSampleZip, isLoading, loadingProgress, loadingStatus } = useSampleLoader();

  // Check browser compatibility on mount
  useEffect(() => {
    const fsApiSupported = supportsFileSystemAccessAPI();
    const isModern = isModernBrowser();
    setBrowserCompatible(fsApiSupported && isModern);
    setBrowserInfo(getBrowserInfo());
  }, []);

  // Handle sample loading
  const handleLoadSample = async () => {
    try {
      const result = await loadSampleZip('/sample/naming.zip');
      
      // If template data is included, load it automatically
      if (result.templateData) {
        onTemplateUpload(result.templateData);
        setTemplateFileName('Sample-Naming-Convention.xlsx');
      }
      
      // Load the sample files
      if (result.files.length > 0) {
        onFilesSelect(result.files);
        setFilesSelected(result.files.length);
        setShowSampleLoader(false);
      }
    } catch (error) {
      console.error('Error loading sample:', error);
      alert('Failed to load sample files. Please try uploading your own files instead.');
    }
  };
  
  const handleTemplateFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setTemplateFileName(file.name);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const namingConvention = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      onTemplateUpload(namingConvention as any[][]);
    } catch (error) {
      console.error('Error reading naming convention file:', error);
      alert('Error reading the naming convention file. Please check the format and try again.');
    }
  };

  const handleFolderSelect = async () => {
    try {
      // Check if File System Access API is supported
      if (!supportsFileSystemAccessAPI()) {
        alert("Your browser doesn't support folder selection. Please use the file upload option instead or try with Chrome, Edge, or another modern browser.");
        return;
      }
      
      // Use the File System Access API to select a folder
      const directoryHandle = await window.showDirectoryPicker();
      setFolderName(directoryHandle.name);
      
      // Collect files from the folder
      const files: File[] = [];
      const traverseDirectory = async (dirHandle: FileSystemDirectoryHandle, path = "") => {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const fileHandle = entry as FileSystemFileHandle;
            const file = await fileHandle.getFile();
            // Add custom property to track the folder path
            Object.defineProperty(file, 'folderPath', {
              value: path || dirHandle.name,
              writable: false
            });
            files.push(file);
          } else if (entry.kind === 'directory') {
            // Recursively process subdirectories
            const dirEntry = entry as FileSystemDirectoryHandle;
            await traverseDirectory(
              dirEntry, 
              path ? `${path}/${entry.name}` : entry.name
            );
          }
        }
      };

      await traverseDirectory(directoryHandle);
      
      if (files.length === 0) {
        alert("No files found in the selected folder. Please select a folder with files to validate.");
        return;
      }
      
      setShowSampleLoader(false); // Hide sample loader once folder is selected
      onFilesSelect(files);
      setFilesSelected(files.length);
    } catch (error) {
      console.error('Error selecting folder:', error);
      if (error instanceof Error && error.name !== 'AbortError') {
        alert('Error selecting folder. Try using the file upload option instead.');
      }
    }
  };

  // Function to generate a template directly in the browser
  const generateTemplate = () => {
    try {
      const blob = createTemplateFile();
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Naming-Convention-Template.xlsx';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error generating template:', error);
      alert('There was an error generating the template. Please try the download link instead.');
    }
  };

  return (
    <div className="mb-16">
      {/* Sample Loader */}
      {showSampleLoader && !templateUploaded && (
        <div className="mb-8">
          <SampleLoadBox
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
            loadingProgress={loadingProgress}
            loadingStatus={loadingStatus}
            title="Load Sample Naming Convention Project"
            description="Try our demo with a sample naming convention and project files to see how validation works"
            sampleButtonText="Load Sample Project"
          />
        </div>
      )}

      {/* Browser compatibility warning */}
      {!browserCompatible && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Browser Compatibility Issue</AlertTitle>
          <AlertDescription>
            <p>Your browser ({browserInfo.name} {browserInfo.version}) doesn't fully support all features needed for folder selection.</p>
            <p className="mt-2">For the best experience, please use Chrome, Edge, or another modern browser.</p>
            <p className="mt-2 text-sm">You can still use the file upload option, but folder selection will not work.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Compact Steps Layout - Horizontal Grid */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upload & Validate Files</h2>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Step 1: Template Upload */}
          <div className="relative">
            <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
              templateUploaded ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            }`}>
              1
            </div>
            <Card className="p-6 h-full border-2 border-green-200 bg-green-50">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Upload Naming Convention</h3>
                  <p className="text-sm text-gray-600 mb-4">Upload your Excel naming standard template</p>
                </div>
                
                <div className="space-y-2">
                  <input 
                    id="template-upload"
                    type="file" 
                    ref={templateInputRef}
                    className="hidden" 
                    accept=".xlsx,.xls" 
                    onChange={handleTemplateFileChange} 
                  />
                  <Button 
                    onClick={() => templateInputRef.current?.click()}
                    className={`w-full ${templateUploaded ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    disabled={isProcessing}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {templateFileName ? `${templateFileName.substring(0, 20)}...` : 'Choose Template File'}
                  </Button>
                  
                  <div className="flex gap-2">
                    <a 
                      href="./Naming-Convention-Template.xlsx" 
                      download="Naming-Convention-Template.xlsx"
                      className="flex-1"
                    >
                      <Button variant="outline" size="sm" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                        <Download className="w-4 h-4 mr-1" />
                        Download Template
                      </Button>
                    </a>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="flex-1 text-green-600 hover:bg-green-50"
                      onClick={generateTemplate}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                {templateUploaded && (
                  <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                    ✓ Template loaded successfully
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Step 2: File Selection */}
          <div className="relative">
            <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
              !templateUploaded ? 'bg-gray-300 text-gray-600' : 'bg-green-500 text-white'
            }`}>
              2
            </div>
            <Card className={`p-6 h-full border-2 ${templateUploaded ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Select Files to Validate</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose files or folder to check naming compliance</p>
                </div>
                
                <div className="space-y-2">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    multiple 
                    onChange={(e) => {
                      if (e.target.files) {
                        onFilesSelect(e.target.files);
                        setFilesSelected(e.target.files.length);
                      }
                    }} 
                  />
                  <input 
                    type="file" 
                    ref={folderInputRef}
                    className="hidden" 
                    webkitdirectory="true"
                    onChange={(e) => {
                      if (e.target.files) {
                        onFilesSelect(e.target.files);
                        setFilesSelected(e.target.files.length);
                      }
                    }} 
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      disabled={!templateUploaded || isProcessing}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <File className="w-4 h-4 mr-1" />
                      Select Files
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                      disabled={!templateUploaded || isProcessing || !browserCompatible}
                      onClick={handleFolderSelect}
                    >
                      <Folder className="w-4 h-4 mr-1" />
                      Select Folder
                    </Button>
                  </div>
                </div>
                
                {filesSelected > 0 && (
                  <div className="text-xs text-green-600 bg-green-100 p-2 rounded">
                    ✓ {filesSelected} files selected
                  </div>
                )}
                
                {!templateUploaded && (
                  <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                    Upload template first to enable file selection
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
