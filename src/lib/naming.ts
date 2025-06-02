/**
 * File Naming Validation Module
 * Ported from check-file-naming repository
 */
import * as XLSX from 'xlsx';

export interface NamingRules {
  partsCount: number;
  delimiter: string;
  partRules: string[][];
}

export interface ValidationResult {
  compliance: 'Ok' | 'Wrong';
  details: string;
  nonCompliantParts?: string[];
}

/**
 * Validates a filename against provided naming rules
 * @param fileName The filename to validate (with or without extension)
 * @param rules The naming convention rules to validate against
 * @returns Validation result with compliance status and details
 */
export function validateName(fileName: string, rules: NamingRules): ValidationResult {
  let delimiterCompliance: 'Ok' | 'Wrong' = 'Ok';
  let partsCountCompliance: 'Ok' | 'Wrong' = 'Ok';
  let partsCompliance: 'Ok' | 'Wrong' = 'Ok';
  let details = '';
  
  // Remove file extension if present
  const dotPosition = fileName.lastIndexOf('.');
  if (dotPosition > 0) {
    fileName = fileName.substring(0, dotPosition);
  }
  
  const partsCount = rules.partsCount;
  const delimiter = rules.delimiter;
  const nameParts = fileName.split(delimiter);
  
  // Check delimiter count
  const expectedDelimiters = partsCount - 1;
  const actualDelimiters = (fileName.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
  
  if (actualDelimiters === expectedDelimiters) {
    details += 'Delimiter correct; ';
  } else {
    delimiterCompliance = 'Wrong';
    details += 'Delimiter wrong; ';
  }
  
  // Check parts count
  if (nameParts.length === partsCount) {
    details += 'Number of parts correct; ';
  } else {
    partsCountCompliance = 'Wrong';
    details += `Number of parts wrong (${nameParts.length}); `;
  }
  
  // Check individual parts
  const nonCompliantParts: string[] = [];
  
  for (let j = 0; j < nameParts.length; j++) {
    // Skip if the rules don't include this part (more parts than expected)
    if (j >= rules.partRules.length) {
      nonCompliantParts.push(nameParts[j]);
      continue;
    }
    
    const allowedParts = rules.partRules[j];
    let partAllowed = false;
    
    // No rules defined for this part
    if (!allowedParts || allowedParts.length === 0) {
      nonCompliantParts.push(nameParts[j]);
      continue;
    }
    
    // First rule is a number - check length
    if (!isNaN(Number(allowedParts[0]))) {
      if (nameParts[j].length === parseInt(allowedParts[0], 10)) {
        partAllowed = true;
      }
    } 
    // "Description" rule - just check minimum length
    else if (allowedParts[0] === "Description") {
      if (nameParts[j].length >= 3) {
        partAllowed = true;
      }
    } 
    // Otherwise check if part matches any allowed values
    else {
      for (const allowedPart of allowedParts) {
        if (allowedPart === nameParts[j]) {
          partAllowed = true;
          break;
        }
      }
    }
    
    if (!partAllowed) {
      nonCompliantParts.push(nameParts[j]);
    }
  }
  
  if (nonCompliantParts.length > 0) {
    partsCompliance = 'Wrong';
    details += `Parts not compliant: ${nonCompliantParts.join(', ')}`;
  }
  
  // Final compliance check
  let compliance: 'Ok' | 'Wrong' = 'Ok';
  if (delimiterCompliance === 'Wrong' || partsCountCompliance === 'Wrong' || partsCompliance === 'Wrong') {
    compliance = 'Wrong';
  }
  
  details = details.trim().replace(/; $/, '');
  
  return { 
    compliance, 
    details, 
    nonCompliantParts: nonCompliantParts.length > 0 ? nonCompliantParts : undefined 
  };
}

/**
 * Parses an Excel naming convention sheet into NamingRules
 * @param namingConvention Array representation of Excel sheet
 * @returns Structured naming rules
 */
export function parseNamingRules(namingConvention: any[][]): NamingRules {
  // Extract basic rules from the first row
  const partsCount = parseInt(namingConvention[0][1], 10);
  const delimiter = namingConvention[0][3];
  
  // Extract part rules from remaining rows
  const partRules: string[][] = [];
  
  // For each possible part (column)
  for (let j = 0; j < partsCount; j++) {
    const allowedValues: string[] = [];
    
    // For each rule row (starting from row 1)
    for (let i = 1; i < namingConvention.length; i++) {
      if (namingConvention[i][j] && !allowedValues.includes(namingConvention[i][j])) {
        allowedValues.push(namingConvention[i][j]);
      }
    }
    
    partRules.push(allowedValues);
  }
    return { partsCount, delimiter, partRules };
}

/**
 * Creates a blank naming convention template in Excel format
 * @returns Binary data for an Excel file that can be saved
 */
export function createTemplateFile(): Blob {
  try {
    // Create a basic workbook
    const wb = XLSX.utils.book_new();
    
    // Create a template worksheet
    const wsData = [
      ["Number of parts", 3, "", "Delimiter", "_"],
      ["Part 1", "Part 2", "Part 3"],
      ["PRJ", "001", "Description"],
      ["TST", "002", ""],
      ["DEV", "003", ""],
      ["", "004", ""],
      ["", "005", ""]
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Naming Convention");
    
    // Convert to binary Excel format
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    
    // Create a Blob from the data
    return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  } catch (error) {
    console.error("Error creating template file:", error);
    throw new Error("Failed to create template file");
  }
}
