import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BarChart3, Upload, FileCheck, AlertTriangle, Download, FolderOpen, FileSpreadsheet } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import * as XLSX from 'xlsx';
import { compare, ComparisonResult } from "@/lib/drawingList";
import { supportsFileSystemAccessAPI } from "@/lib/utils";

const DeliverablesTracker = () => {
  // State management
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [drawingList, setDrawingList] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWorkbook, setCurrentWorkbook] = useState<XLSX.WorkBook | null>(null);

  // Handle Excel file upload
  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      setCurrentWorkbook(workbook);
      setExcelFile(file);
      setSheets(workbook.SheetNames);
      setSelectedSheet(workbook.SheetNames[0]);
      
      // Automatically process first sheet
      processSheet(workbook, workbook.SheetNames[0]);
    } catch (error) {
      console.error('Error reading Excel file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process selected sheet to extract column headers
  const processSheet = (workbook: XLSX.WorkBook, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');
    const columnHeaders: string[] = [];
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_col(C) + '1';
      const cell = sheet[cellAddress];
      const header = cell ? cell.v : `Column ${C + 1}`;
      columnHeaders.push(header);
    }
    
    setColumns(columnHeaders);
    setSelectedColumn(columnHeaders[0]);
    
    // Automatically load first column data
    loadDrawingList(sheet, 0);
  };

  // Load drawing list from selected column
  const loadDrawingList = (sheet: XLSX.WorkSheet, columnIndex: number) => {
    try {
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      const list = data
        .slice(1) // Skip header row
        .map(row => row[columnIndex])
        .filter(name => typeof name === 'string' && name.trim() !== '');
      
      setDrawingList(list);
    } catch (error) {
      console.error('Error loading drawing list:', error);
    }
  };

  // Handle sheet selection change
  const handleSheetChange = (sheetName: string) => {
    setSelectedSheet(sheetName);
    if (currentWorkbook) {
      processSheet(currentWorkbook, sheetName);
    }
  };

  // Handle column selection change
  const handleColumnChange = (columnHeader: string) => {
    setSelectedColumn(columnHeader);
    const columnIndex = columns.indexOf(columnHeader);
    if (currentWorkbook && selectedSheet) {
      const sheet = currentWorkbook.Sheets[selectedSheet];
      loadDrawingList(sheet, columnIndex);
    }
  };

  // Handle file upload for comparison
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const fileNames = files.map(file => file.name);
    setUploadedFiles(fileNames);
    
    if (drawingList.length > 0) {
      const result = compare(drawingList, fileNames);
      setComparisonResult(result);
    }
  };

  // Handle folder selection (if supported)
  const handleFolderSelect = async () => {
    if (!supportsFileSystemAccessAPI()) {
      alert('Folder selection is not supported in this browser. Please use file upload instead.');
      return;
    }

    try {
      setIsProcessing(true);
      // @ts-ignore - File System Access API
      const directoryHandle = await window.showDirectoryPicker();
      const files: string[] = [];
      
      // Traverse directory
      const traverseDirectory = async (dirHandle: any, path = '') => {
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            files.push(entry.name);
          } else if (entry.kind === 'directory') {
            await traverseDirectory(entry, `${path}${entry.name}/`);
          }
        }
      };
      
      await traverseDirectory(directoryHandle);
      setUploadedFiles(files);
      
      if (drawingList.length > 0) {
        const result = compare(drawingList, files);
        setComparisonResult(result);
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Deliverables Tracker
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Instantly compare your deliverables list with the files submitted. Spot missing files, duplicates, and naming issues in seconds.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              onClick={() => document.getElementById('excel-upload')?.click()}
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Tracking Deliverables
            </Button>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload & Validate Deliverables</h2>
            
            {/* Step 1: Excel Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Step 1: Upload Deliverables List (Excel)
              </h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label htmlFor="excel-upload" className="cursor-pointer">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload Excel file with deliverables list</p>
                    {excelFile && (
                      <p className="text-sm text-green-600 mt-2">✓ {excelFile.name}</p>
                    )}
                  </div>
                </label>
              </div>

              {/* Sheet and Column Selection */}
              {sheets.length > 0 && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Sheet</label>
                    <Select value={selectedSheet} onValueChange={handleSheetChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose sheet" />
                      </SelectTrigger>
                      <SelectContent>
                        {sheets.map((sheet) => (
                          <SelectItem key={sheet} value={sheet}>{sheet}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Column</label>
                    <Select value={selectedColumn} onValueChange={handleColumnChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose column" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column} value={column}>{column}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {drawingList.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✓ Loaded {drawingList.length} items from column "{selectedColumn}"
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: File Upload */}
            {drawingList.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  Step 2: Upload Files to Compare
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="files-upload"
                    />
                    <label htmlFor="files-upload">
                      <Button className="w-full" variant="outline" asChild>
                        <div className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Files
                        </div>
                      </Button>
                    </label>
                  </div>
                  {supportsFileSystemAccessAPI() && (
                    <div>
                      <Button 
                        onClick={handleFolderSelect} 
                        className="w-full" 
                        variant="outline"
                        disabled={isProcessing}
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Select Folder
                      </Button>
                    </div>
                  )}
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      ✓ {uploadedFiles.length} files uploaded for comparison
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Dashboard */}
          {comparisonResult && (
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Validation Results</h2>
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{comparisonResult.matchedCount}</div>
                  <div className="text-sm text-green-700">Files Found</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{comparisonResult.unmatchedInList.length}</div>
                  <div className="text-sm text-red-700">Missing Files</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{comparisonResult.unmatchedInFiles.length}</div>
                  <div className="text-sm text-yellow-700">Extra Files</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{Math.round(comparisonResult.percentageFound)}%</div>
                  <div className="text-sm text-blue-700">Complete</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {comparisonResult.matched.slice(0, 5).map((match, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">{match.listItem}</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Found: {match.matchedFile}
                    </span>
                  </div>
                ))}
                {comparisonResult.unmatchedInList.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">{item}</span>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Missing</span>
                  </div>
                ))}
              </div>

              {(comparisonResult.matched.length > 5 || comparisonResult.unmatchedInList.length > 3) && (
                <div className="mt-4 text-center">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Report
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Monitor deliverable status in real-time with live updates and notifications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <FileCheck className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Smart Matching</CardTitle>
                <CardDescription>
                  Automatically match submitted files with your deliverables list
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Issue Detection</CardTitle>
                <CardDescription>
                  Identify missing files, duplicates, and naming inconsistencies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Custom Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports for stakeholders and project teams
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Upload className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <CardTitle>Bulk Upload</CardTitle>
                <CardDescription>
                  Upload and process hundreds of files simultaneously
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Track completion rates and identify bottlenecks in your workflow
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Deliverables?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start tracking your project deliverables with unprecedented accuracy and speed.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started Today
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliverablesTracker;
