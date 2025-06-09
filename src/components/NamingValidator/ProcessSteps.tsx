import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(false);
  const [browserCompatible, setBrowserCompatible] = useState<boolean>(true);
  const [browserInfo, setBrowserInfo] = useState<{ name: string, version: string }>({ name: "", version: "" });
  const [showSampleLoader, setShowSampleLoader] = useState<boolean>(true);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  const { loadSampleZip, isLoading, loadingProgress, loadingStatus } = useSampleLoader();// Check browser compatibility on mount
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
          } else if (entry.kind === 'directory' && includeSubfolders) {
            // Recursively process subdirectories only if includeSubfolders is true
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

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setFilesSelected(files.length);
      setShowSampleLoader(false); // Hide sample loader once files are selected
      
      // Create a default folder path for uploaded files
      const fileArray = Array.from(files).map(file => {
        // Add a custom property for folder path
        Object.defineProperty(file, 'folderPath', {
          value: 'Uploaded Files',
          writable: false
        });
        return file;
      });
      
      onFilesSelect(fileArray);
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
  };  return (
    <div className="mb-16">
      {/* Progressive Steps Layout */}
      <div className="space-y-6">
        {/* Step 1: Template Upload - Always visible */}
        <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                templateUploaded ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
              }`}>
                {templateUploaded ? '✓' : '1'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Upload Naming Convention Template</h3>
              {!templateUploaded && showSampleLoader && (
                <button
                  onClick={handleLoadSample}
                  disabled={isLoading}
                  className="ml-4 text-xs text-green-600 hover:text-green-700 underline transition-colors"
                >
                  {isLoading ? 'Loading sample...' : 'try sample'}
                </button>
              )}
            </div>
            {templateUploaded && (
              <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
            )}
          </div>
          
          {!templateUploaded ? (
            <div className="space-y-4">
              <p className="text-gray-600">Upload your Excel naming convention template to get started.</p>
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
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={isProcessing}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {templateFileName ? `${templateFileName.length > 30 ? templateFileName.substring(0, 30) + '...' : templateFileName}` : 'Choose Template File'}
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
              
              {templateFileName && (
                <div className="p-3 bg-green-50 rounded-lg animate-in fade-in duration-300">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Template loaded successfully
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-600">
              <Upload className="w-4 h-4 mr-2" />
              <span>{templateFileName}</span>
            </div>
          )}
        </div>

        {/* Step 2: File Selection - Only visible after template upload */}
        {templateUploaded && (
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                  filesSelected > 0 ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
                }`}>
                  {filesSelected > 0 ? '✓' : '2'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Select Files to Validate</h3>
              </div>
              {filesSelected > 0 && (
                <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
              )}
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">Choose files or folders to validate against your naming convention.</p>              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    multiple 
                    accept=".pdf,.dwg,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect} 
                  />
                  <Button 
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    disabled={isProcessing}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <File className="w-4 h-4 mr-2" />
                    Select Files
                  </Button>
                </div>
                <div>
                  <Button 
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    disabled={isProcessing || !browserCompatible}
                    onClick={handleFolderSelect}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    Select Folder
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-subfolders"
                  checked={includeSubfolders}
                  onCheckedChange={(checked) => setIncludeSubfolders(checked as boolean)}
                />
                <label htmlFor="include-subfolders" className="text-sm text-gray-600 cursor-pointer">
                  Include subfolders in search
                </label>
              </div>
              
              {filesSelected > 0 && (
                <div className="p-3 bg-green-50 rounded-lg animate-in fade-in duration-300">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ {filesSelected} files selected for validation
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Browser compatibility warning */}
      {!browserCompatible && (
        <Alert variant="destructive" className="mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Browser Compatibility Issue</AlertTitle>
          <AlertDescription>
            <p>Your browser ({browserInfo.name} {browserInfo.version}) doesn't fully support all features needed for folder selection.</p>
            <p className="mt-2">For the best experience, please use Chrome, Edge, or another modern browser.</p>
            <p className="mt-2 text-sm">You can still use the file upload option, but folder selection will not work.</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
