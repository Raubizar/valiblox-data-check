/**
 * Drawing List Comparison Module
 * Ported from check-drawing-list repository
 */

export interface ComparisonResult {
  matched: MatchResult[];
  unmatchedInList: string[];
  unmatchedInFiles: string[];
  matchedCount: number;
  totalListItems: number;
  totalFiles: number;
  percentageFound: number;
}

export interface MatchResult {
  listItem: string;
  matchedFile: string | null;
  status: 'Done' | 'To Do' | 'Not in List';
}

/**
 * Compares a drawing list against a list of files
 * @param drawingList Array of names from the drawing/deliverables list
 * @param files Array of filenames to check against the drawing list
 * @returns Detailed comparison results
 */
export function compare(drawingList: string[], files: string[]): ComparisonResult {
  // Ensure both arrays contain valid strings
  drawingList = drawingList.filter(item => typeof item === 'string' && item.trim() !== '');
  files = files.filter(file => typeof file === 'string' && file.trim() !== '');
  
  const matched: MatchResult[] = [];
  let matchedCount = 0;
  const unmatchedInList: string[] = [];
  let unmatchedInFiles = [...files]; // Assume all files are unmatched initially
  
  // Process each drawing list item
  drawingList.forEach(listItem => {
    // Find a match in the file list
    const matchedFile = findMatchingFile(listItem, files);
    
    if (matchedFile) {
      matched.push({
        listItem,
        matchedFile,
        status: 'Done'
      });
      matchedCount++;
      
      // Remove the matched file from the unmatchedInFiles array
      unmatchedInFiles = unmatchedInFiles.filter(file => file !== matchedFile);
    } else {
      matched.push({
        listItem,
        matchedFile: null,
        status: 'To Do'
      });
      unmatchedInList.push(listItem);
    }
  });
  
  // Add files that aren't in the drawing list
  unmatchedInFiles.forEach(file => {
    matched.push({
      listItem: '',
      matchedFile: file,
      status: 'Not in List'
    });
  });
  
  // Calculate percentage found
  const percentageFound = drawingList.length > 0 
    ? (matchedCount / drawingList.length) * 100 
    : 0;
  
  return {
    matched,
    unmatchedInList,
    unmatchedInFiles,
    matchedCount,
    totalListItems: drawingList.length,
    totalFiles: files.length,
    percentageFound
  };
}

/**
 * Finds a matching file for a drawing list item
 * @param listItem The drawing list item name
 * @param files Array of files to search through
 * @returns The matching filename or null if no match
 */
function findMatchingFile(listItem: string, files: string[]): string | null {
  // Normalize the list item for comparison
  const normalizedListItem = normalizeForComparison(listItem);
  
  // Find the first matching file
  const match = files.find(file => {
    const normalizedFile = normalizeForComparison(file);
    return normalizedFile === normalizedListItem;
  });
  
  return match || null;
}

/**
 * Normalizes a filename for comparison by removing extension, trimming,
 * converting to lowercase, normalizing unicode, and standardizing whitespace
 * @param filename The filename to normalize
 * @returns Normalized string for comparison
 */
function normalizeForComparison(filename: string): string {
  return stripExtension(filename)
    .trim()
    .toLowerCase()
    .normalize()
    .replace(/\s+/g, ' ');
}

/**
 * Strips the file extension from a filename
 * @param filename The filename with possible extension
 * @returns Filename without extension
 */
function stripExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

/**
 * Extracts filenames from file objects (useful when dealing with File API)
 * @param fileObjects Array of File objects or objects with name property
 * @returns Array of filenames
 */
export function extractFilenames(fileObjects: { name: string }[]): string[] {
  return fileObjects.map(file => file.name);
}
