import { useState, useCallback } from 'react';
import JSZip from 'jszip';

export interface SampleFile {
  name: string;
  content: ArrayBuffer;
  folderPath?: string;
}

export interface SampleLoadResult {
  files: File[];
  templateData?: any[][];
}

export const useSampleLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');

  const loadSampleZip = useCallback(async (samplePath: string): Promise<SampleLoadResult> => {
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingStatus('Downloading sample files...');

    try {
      // Fetch the ZIP file
      const response = await fetch(samplePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch sample: ${response.statusText}`);
      }

      setLoadingProgress(25);
      setLoadingStatus('Extracting files...');

      const zipArrayBuffer = await response.arrayBuffer();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipArrayBuffer);

      setLoadingProgress(50);
      setLoadingStatus('Processing files...');

      const files: File[] = [];
      let templateData: any[][] | undefined;

      // Process each file in the ZIP
      const filePromises = Object.keys(zipContent.files).map(async (fileName) => {
        const file = zipContent.files[fileName];
        
        // Skip directories
        if (file.dir) return;

        setLoadingStatus(`Processing: ${fileName}`);

        const content = await file.async('arraybuffer');
        
        // Create File object with folder path
        const fileBlob = new Blob([content]);
        const createdFile = new File([fileBlob], fileName, { 
          type: getFileType(fileName),
          lastModified: Date.now()
        });

        // Add folder path property for organization
        const folderPath = fileName.includes('/') 
          ? fileName.substring(0, fileName.lastIndexOf('/'))
          : 'Sample Files';
          
        Object.defineProperty(createdFile, 'folderPath', {
          value: folderPath,
          writable: false
        });        // Check if this is a naming convention template (Excel or CSV file with specific pattern)
        if ((fileName.toLowerCase().includes('template') || fileName.toLowerCase().includes('convention')) && 
            (fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls') || fileName.toLowerCase().endsWith('.csv'))) {
          try {
            if (fileName.toLowerCase().endsWith('.csv')) {
              // Parse CSV content
              const text = new TextDecoder().decode(content);
              const lines = text.split('\n').filter(line => line.trim());
              const csvData = lines.map(line => {
                // Simple CSV parsing - split by comma and trim
                return line.split(',').map(cell => cell.trim());
              });
              templateData = csvData;
            } else {
              // Parse Excel file
              const XLSX = await import('xlsx');
              const workbook = XLSX.read(content, { type: 'array' });
              const sheetName = workbook.SheetNames[0];
              const sheet = workbook.Sheets[sheetName];
              templateData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
            }
          } catch (error) {
            console.warn('Failed to parse template file:', error);
          }
        }

        files.push(createdFile);
      });

      await Promise.all(filePromises);

      setLoadingProgress(100);
      setLoadingStatus('Complete!');

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      return { files, templateData };

    } catch (error) {
      console.error('Error loading sample:', error);
      throw new Error(`Failed to load sample files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
      setLoadingStatus('');
    }
  }, []);

  return {
    loadSampleZip,
    isLoading,
    loadingProgress,
    loadingStatus
  };
};

// Helper function to determine file MIME type
function getFileType(fileName: string): string {
  const ext = fileName.toLowerCase().split('.').pop();
  
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'dwg': 'application/acad',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'txt': 'text/plain'
  };

  return mimeTypes[ext || ''] || 'application/octet-stream';
}
