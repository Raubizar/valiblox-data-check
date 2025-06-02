import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BarChart3, Upload, FileCheck, AlertTriangle, Download, FolderOpen, FileSpreadsheet, Search, Filter, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";
import * as XLSX from 'xlsx';
import { compare, ComparisonResult } from "@/lib/drawingList";
import { supportsFileSystemAccessAPI } from "@/lib/utils";

const STEPS = [
  { id: 1, title: 'Upload Excel', description: 'Select your deliverables list' },
  { id: 2, title: 'Configure Columns', description: 'Choose sheet and drawing column' },
  { id: 3, title: 'Upload Files', description: 'Select files to compare' },
  { id: 4, title: 'Review Results', description: 'Analyze comparison results' }
];

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="w-full mb-8">
    <div className="flex items-center justify-between relative">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step.id < currentStep 
              ? 'bg-blue-600 text-white' 
              : step.id === currentStep
              ? 'bg-blue-500 text-white'
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
              step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300'
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
  const [isProcessing, setIsProcessing] = useState(false);  const [currentWorkbook, setCurrentWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'matched' | 'missing' | 'extra'>('all');
  const [includeSubfolders, setIncludeSubfolders] = useState<boolean>(true);

  // Create unified results table data
  const unifiedResults = useMemo(() => {
    if (!comparisonResult) return [];
    
    const results = [
      // Drawing list items first (matched and missing)
      ...comparisonResult.matched.map(item => ({
        drawingName: item.listItem,
        fileName: item.matchedFile || '',
        status: 'matched' as const
      })),
      ...comparisonResult.unmatchedInList.map(item => ({
        drawingName: item,
        fileName: '',
        status: 'missing' as const
      })),
      // Extra files
      ...comparisonResult.unmatchedInFiles.map(item => ({
        drawingName: '',
        fileName: item,
        status: 'extra' as const
      }))
    ];
    
    // Apply filters
    let filteredResults = results;
    if (selectedFilter !== 'all') {
      filteredResults = results.filter(item => item.status === selectedFilter);
    }
    
    // Apply search
    if (searchQuery) {
      filteredResults = filteredResults.filter(item => 
        item.drawingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filteredResults;
  }, [comparisonResult, selectedFilter, searchQuery]);
  // Compute current step
  const currentStep = useMemo(() => {
    if (comparisonResult) return 5; // All steps completed
    if (uploadedFiles.length > 0 && drawingList.length > 0) return 4; // Files uploaded and ready for comparison
    if (drawingList.length > 0 && selectedColumn && selectedSheet) return 3; // Column configured, ready for file upload
    if (excelFile && sheets.length > 0) return 2; // Excel loaded, ready for configuration
    if (excelFile) return 1; // Excel file selected, still processing
    return 0; // No file selected yet
  }, [excelFile, sheets, selectedSheet, selectedColumn, drawingList, uploadedFiles, comparisonResult]);

  // Export functions
  const exportToCSV = (data: any[], filename: string) => {
    const csvContent = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' && val.includes(',') ? `"${val}"` : val
      ).join(',')
    ).join('\n');
    
    const header = Object.keys(data[0] || {}).join(',');
    const fullContent = header + '\n' + csvContent;
    
    const blob = new Blob([fullContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportResults = () => {
    if (!comparisonResult) return;
    
    const exportData = [
      ...comparisonResult.matched.map(item => ({
        Status: 'Matched',
        'Drawing Name': item.listItem,
        'File Name': item.matchedFile,
        Notes: 'Successfully matched'
      })),
      ...comparisonResult.unmatchedInList.map(item => ({
        Status: 'Missing',
        'Drawing Name': item,
        'File Name': '',
        Notes: 'File not found in submission'
      })),
      ...comparisonResult.unmatchedInFiles.map(item => ({
        Status: 'Extra',
        'Drawing Name': '',
        'File Name': item,
        Notes: 'File not in deliverables list'
      }))
    ];
    
    exportToCSV(exportData, `deliverables-comparison-${new Date().toISOString().split('T')[0]}.csv`);
  };

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
          } else if (entry.kind === 'directory' && includeSubfolders) {
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

          {/* Step Progress Indicator */}
          <StepIndicator currentStep={currentStep} />{/* Compact Steps Layout - Horizontal Grid */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload & Validate Deliverables</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">              {/* Step 1: Excel Upload */}
              <div className="relative">
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  currentStep > 1 ? 'bg-blue-600 text-white' : currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-4 h-full">
                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Upload Excel List
                  </h3>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                    id="excel-upload"
                  />
                  <div className="space-y-3">
                    <Button
                      onClick={() => document.getElementById('excel-upload')?.click()}
                      disabled={isProcessing}
                      size="sm"
                      className="w-full"
                    >
                      {isProcessing ? 'Processing...' : 'Choose File'}
                    </Button>
                    {excelFile && (
                      <div className="p-2 bg-green-50 rounded text-center">
                        <p className="text-xs text-green-800 font-medium">
                          ✓ {excelFile.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>              {/* Step 2: Sheet and Column Selection */}
              <div className="relative">
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  currentStep > 2 ? 'bg-blue-600 text-white' : currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>                <div className={`border-2 rounded-lg p-4 h-full ${
                  currentStep >= 2 ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">
                    Configure Columns
                  </h3>
                  {currentStep >= 2 ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Sheet:</label>
                        <Select value={selectedSheet} onValueChange={handleSheetChange}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Choose sheet" />
                          </SelectTrigger>
                          <SelectContent>
                            {sheets.map(sheet => (
                              <SelectItem key={sheet} value={sheet}>{sheet}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Column:</label>
                        <Select value={selectedColumn} onValueChange={handleColumnChange}>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="Choose column" />
                          </SelectTrigger>
                          <SelectContent>
                            {columns.map(column => (
                              <SelectItem key={column} value={column}>{column}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {drawingList.length > 0 && (
                        <div className="p-2 bg-green-50 rounded text-center">
                          <p className="text-xs text-green-800 font-medium">
                            ✓ {drawingList.length} drawings found
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Upload Excel file first</p>
                  )}
                </div>
              </div>              {/* Step 3: File Upload */}
              <div className="relative">
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  currentStep > 3 ? 'bg-blue-600 text-white' : currentStep === 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > 3 ? '✓' : '3'}
                </div>                <div className={`border-2 rounded-lg p-4 h-full ${
                  currentStep >= 3 ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}>
                  <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </h3>
                  {currentStep >= 3 ? (
                    <div className="space-y-3">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Select Files
                      </Button>
                      <div className="text-center text-xs text-gray-500">or</div>
                      <Button
                        onClick={handleFolderSelect}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={isProcessing}
                      >
                        <FolderOpen className="w-3 h-3 mr-1" />
                        Select Folder
                      </Button>
                      <div className="flex items-center space-x-1">
                        <Checkbox
                          id="include-subfolders"
                          checked={includeSubfolders}
                          onCheckedChange={(checked) => setIncludeSubfolders(checked as boolean)}
                        />
                        <label htmlFor="include-subfolders" className="text-xs text-gray-600 cursor-pointer">
                          Include subfolders
                        </label>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="p-2 bg-green-50 rounded text-center">
                          <p className="text-xs text-green-800 font-medium">
                            ✓ {uploadedFiles.length} files uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Configure columns first</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Table */}
          {comparisonResult && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Deliverables Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">Matched</span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {comparisonResult.matched.length}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">
                        {Math.round((comparisonResult.matched.length / (comparisonResult.matched.length + comparisonResult.unmatchedInList.length)) * 100)}%
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">Missing</span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">
                        {comparisonResult.unmatchedInList.length}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-red-600">
                        {Math.round((comparisonResult.unmatchedInList.length / (comparisonResult.matched.length + comparisonResult.unmatchedInList.length)) * 100)}%
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="font-medium text-gray-900">Extra</span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-yellow-600">
                        {comparisonResult.unmatchedInFiles.length}
                      </td>                      <td className="py-3 px-4 text-right font-semibold text-yellow-600">
                        {comparisonResult.unmatchedInFiles.length > 0 ? 
                          Math.round((comparisonResult.unmatchedInFiles.length / (comparisonResult.matched.length + comparisonResult.unmatchedInList.length + comparisonResult.unmatchedInFiles.length)) * 100) : 0}%
                      </td>
                    </tr>                    <tr className="border-t-2 border-gray-200 bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">Files Verified</td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        {comparisonResult.matched.length + comparisonResult.unmatchedInList.length}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-blue-600">
                        {Math.round(comparisonResult.percentageFound)}% Complete
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}          {/* Results Section with Unified Table */}
          {comparisonResult && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Detailed Results
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={selectedFilter} onValueChange={(value: any) => setSelectedFilter(value)}>
                    <SelectTrigger className="w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Files</SelectItem>
                      <SelectItem value="matched">Matched</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                      <SelectItem value="extra">Extra Files</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={exportResults} variant="outline" className="flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </div>

              {/* Unified Results Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Drawing Name
                        </th>
                        <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {unifiedResults.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                            No results found for the current filter and search criteria.
                          </td>
                        </tr>
                      ) : (
                        unifiedResults.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900 break-words">
                              <div className="break-all">
                                {item.drawingName || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 break-words">
                              <div className="break-all">
                                {item.fileName || '-'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {item.status === 'matched' && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <FileCheck className="w-3 h-3 mr-1" />
                                  Match
                                </Badge>
                              )}
                              {item.status === 'missing' && (
                                <Badge className="bg-red-100 text-red-800 border-red-200">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Missing
                                </Badge>
                              )}
                              {item.status === 'extra' && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                  <Upload className="w-3 h-3 mr-1" />
                                  Extra
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mt-4 text-sm text-gray-600">
                Showing {unifiedResults.length} of {
                  comparisonResult.matched.length + 
                  comparisonResult.unmatchedInList.length + 
                  comparisonResult.unmatchedInFiles.length
                } total results
              </div>
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
