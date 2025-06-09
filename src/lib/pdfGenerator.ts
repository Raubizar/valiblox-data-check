import jsPDF from 'jspdf';

// Helper function to format date and time
const formatDateTime = () => {
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return { date, time };
};

// Helper function to load image as data URL
const loadImageAsDataUrl = async (imagePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imagePath;
  });
};

// Helper function to draw table row with web-like styling
const drawTableRow = (
  pdf: jsPDF, 
  y: number, 
  data: string[], 
  colWidths: number[], 
  startX: number, 
  isHeader: boolean = false,
  alternateBackground: boolean = false
) => {
  const rowHeight = 8;
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  
  // Add row background (like web table)
  if (alternateBackground && !isHeader) {
    pdf.setFillColor(249, 250, 251); // Light gray background
    pdf.rect(startX, y - 6, totalWidth, rowHeight, 'F');
  }
  
  // Add cell borders
  let currentX = startX;
  pdf.setDrawColor(229, 231, 235); // Light border color
  pdf.setLineWidth(0.3);
  
  colWidths.forEach((width, index) => {
    pdf.rect(currentX, y - 6, width, rowHeight, 'S');
    currentX += width;
  });
  
  return rowHeight;
};

// Helper function to draw detail table headers
const drawDetailTableHeaders = (pdf: jsPDF, y: number, startX: number, detailColWidths: number[]) => {
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  // Draw header background
  const totalWidth = detailColWidths.reduce((a, b) => a + b, 0);
  pdf.setFillColor(249, 250, 251);
  pdf.rect(startX, y - 6, totalWidth, 8, 'F');
  
  // Draw header borders
  let currentX = startX;
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  
  detailColWidths.forEach((width) => {
    pdf.rect(currentX, y - 6, width, 8, 'S');
    currentX += width;
  });
  
  // Header text
  pdf.text('Drawing Name', startX + 2, y);
  pdf.text('File Name', startX + detailColWidths[0] + 2, y);
  pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1] + 2, y);
  
  return y + 8;
};

// Helper function to draw speedometer chart
const drawSpeedometer = (pdf: jsPDF, x: number, y: number, percentage: number, label: string) => {
  const radius = 15; // 30mm diameter = 15mm radius (smaller to fit better)
  const centerX = x + radius;
  const centerY = y + radius;
  
  // Save graphics state
  pdf.saveGraphicsState();
    // Draw arc segments for color coding using line segments
  const segments = 72; // Number of line segments to approximate arc (more for smoother curves)
  const angleStep = Math.PI / segments; // 180° in segments
  const arcThickness = 3;
  
  // Red zone (0-40%) - 180° to 108° (left to center-left) - HORIZONTAL ORIENTATION
  pdf.setDrawColor(220, 38, 127);
  pdf.setLineWidth(arcThickness);
  for (let i = 0; i < Math.floor(segments * 0.4); i++) {
    const angle1 = Math.PI - (i * angleStep); // Start from 180° (left) and go clockwise
    const angle2 = Math.PI - ((i + 1) * angleStep);
    const x1 = centerX + Math.cos(angle1) * radius;
    const y1 = centerY - Math.sin(angle1) * radius;
    const x2 = centerX + Math.cos(angle2) * radius;
    const y2 = centerY - Math.sin(angle2) * radius;
    pdf.line(x1, y1, x2, y2);
  }
  
  // Yellow zone (40-80%) - 108° to 36°
  pdf.setDrawColor(234, 179, 8);
  for (let i = Math.floor(segments * 0.4); i < Math.floor(segments * 0.8); i++) {
    const angle1 = Math.PI - (i * angleStep);
    const angle2 = Math.PI - ((i + 1) * angleStep);
    const x1 = centerX + Math.cos(angle1) * radius;
    const y1 = centerY - Math.sin(angle1) * radius;
    const x2 = centerX + Math.cos(angle2) * radius;
    const y2 = centerY - Math.sin(angle2) * radius;
    pdf.line(x1, y1, x2, y2);
  }
  
  // Green zone (80-100%) - 36° to 0° (center-right to right side)
  pdf.setDrawColor(34, 197, 94);
  for (let i = Math.floor(segments * 0.8); i < segments; i++) {
    const angle1 = Math.PI - (i * angleStep);
    const angle2 = Math.PI - ((i + 1) * angleStep);
    const x1 = centerX + Math.cos(angle1) * radius;
    const y1 = centerY - Math.sin(angle1) * radius;
    const x2 = centerX + Math.cos(angle2) * radius;
    const y2 = centerY - Math.sin(angle2) * radius;
    pdf.line(x1, y1, x2, y2);
  }
  
  // Draw needle - HORIZONTAL ORIENTATION (0% = left, 100% = right)
  const needleAngle = Math.PI - (percentage / 100) * Math.PI; // 0% = 180° (left), 100% = 0° (right)
  const needleLength = radius - 3;
  const needleEndX = centerX + Math.cos(needleAngle) * needleLength;
  const needleEndY = centerY - Math.sin(needleAngle) * needleLength;
  
  pdf.setDrawColor(60, 60, 60);
  pdf.setLineWidth(2);
  pdf.line(centerX, centerY, needleEndX, needleEndY);
  
  // Draw center circle
  pdf.setFillColor(60, 60, 60);
  pdf.circle(centerX, centerY, 2, 'F');
    // Add percentage text
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12); // Reduced from 14 to fit smaller speedometer
  pdf.setFont('helvetica', 'bold');
  const percentText = `${percentage}%`;
  const textWidth = pdf.getTextWidth(percentText);
  pdf.text(percentText, centerX - textWidth/2, centerY + 6); // Adjusted Y position
  
  // Add label
  pdf.setFontSize(7); // Reduced from 8 to fit smaller speedometer
  pdf.setFont('helvetica', 'normal');
  const labelWidth = pdf.getTextWidth(label);
  pdf.text(label, centerX - labelWidth/2, centerY + 14); // Adjusted Y position
  
  // Restore graphics state
  pdf.restoreGraphicsState();
};

// Enhanced PDF generator for Deliverables Tracker with improved branding
export const generateDeliverablesTrackerPDF = async (comparisonResult: any, unifiedResults: any[]) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
    // Process and normalize the results data
  const processedResults = [
    // Matched files
    ...comparisonResult.matched.map((item: any) => ({
      drawingName: item.listItem || item.drawingName || item.name || '-',
      fileName: item.matchedFile || item.fileName || item.name || '-',
      status: 'matched'
    })),
    // Missing files (in list but not in uploaded files)
    ...comparisonResult.unmatchedInList.map((item: any) => ({
      drawingName: typeof item === 'string' ? item : (item.listItem || item.drawingName || item.name || '-'),
      fileName: '-',
      status: 'missing'
    })),
    // Extra files (in uploaded files but not in list)
    ...comparisonResult.unmatchedInFiles.map((item: any) => ({
      drawingName: '-',
      fileName: typeof item === 'string' ? item : (item.fileName || item.name || '-'),
      status: 'extra'
    }))
  ];
  
  // Load the icon logo
  let iconDataUrl: string | null = null;
  try {
    iconDataUrl = await loadImageAsDataUrl('/Valiblox_v3.1-icon-removebg-preview.png');
  } catch (error) {
    console.warn('Could not load icon logo, continuing without it');
  }
  // Helper function to add watermark to each page
  const addWatermark = () => {
    if (iconDataUrl) {
      // Save current graphics state
      pdf.saveGraphicsState();
      
      // Set transparency for watermark
      pdf.setGState(pdf.GState({ opacity: 0.04 }));
      
      // Add multiple subtle watermarks across the page in a grid pattern
      const watermarkSize = 40;
      const spacing = 120;
      
      for (let x = 40; x < pageWidth - 40; x += spacing) {
        for (let y = 100; y < pageHeight - 100; y += spacing) {
          try {
            // Add logo watermark
            pdf.addImage(iconDataUrl, 'PNG', x, y, watermarkSize, watermarkSize * 0.25);
            
            // Add text watermark below logo
            pdf.setTextColor(120, 120, 120);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            const text = 'VALIBLOX';
            const textWidth = pdf.getTextWidth(text);
            pdf.text(text, x + (watermarkSize - textWidth) / 2, y + watermarkSize * 0.25 + 8);
          } catch (e) {
            console.warn('Error adding watermark element:', e);
          }
        }
      }
      
      // Restore graphics state
      pdf.restoreGraphicsState();
    }
  };

  // Helper function to add header
  const addHeader = (title: string, subtitle: string) => {
    // Add watermark first
    addWatermark();
    
    // Add icon and VALIBLOX text centered
    if (iconDataUrl) {
      const iconSize = 25;
      const valibloxText = 'VALIBLOX';
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      const textWidth = pdf.getTextWidth(valibloxText);
      const totalWidth = iconSize + 5 + textWidth; // icon + spacing + text
      const startX = (pageWidth - totalWidth) / 2;
      
      // Add icon
      try {
        pdf.addImage(iconDataUrl, 'PNG', startX, 15, iconSize, iconSize);
      } catch (e) {
        console.warn('Error adding header logo:', e);
      }
      
      // Add VALIBLOX text next to icon
      pdf.setTextColor(0, 0, 0);
      pdf.text(valibloxText, startX + iconSize + 5, 32);
    }
    
    // Add report title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 50);
    
    // Add subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 60);
    
    // Add generation date
    const { date, time } = formatDateTime();
    const dateText = `Generated on: ${date} at ${time}`;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, 70);
    
    // Add separator line
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(150, 150, 150);
    pdf.line(20, 77, pageWidth - 20, 77);
  };

  // Helper function to add footer
  const addFooter = (pageNumber: number, totalPages: number) => {
    const footerY = pageHeight - 15;
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    
    // Left side - Generated by VALIBLOX
    const leftText = 'Generated by VALIBLOX';
    pdf.text(leftText, 20, footerY);
    
    // Center - Website and email
    const centerText = 'www.valiblox.com | info@valiblox.com';
    const centerWidth = pdf.getTextWidth(centerText);
    pdf.text(centerText, (pageWidth - centerWidth) / 2, footerY);
    
    // Right side - Date and page number
    const { date } = formatDateTime();
    const rightText = `${date} - Page ${pageNumber} of ${totalPages}`;
    const rightWidth = pdf.getTextWidth(rightText);
    pdf.text(rightText, pageWidth - 20 - rightWidth, footerY);
  };

  // Calculate total files
  const totalFiles = comparisonResult.matched.length + comparisonResult.unmatchedInList.length;
  
  // Add first page with header
  addHeader('Deliverables Tracker Report', `${totalFiles} files verified`);

  // Add summary section
  let currentY = 85;
    // Summary title
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Deliverables Summary', 20, currentY);
  
  currentY += 10;
    // Summary table
  const summaryData = [
    {
      status: 'Matched',
      count: comparisonResult.matched.length,
      percentage: Math.round((comparisonResult.matched.length / totalFiles) * 100),
      color: [0, 150, 0] as [number, number, number]
    },
    {
      status: 'Missing', 
      count: comparisonResult.unmatchedInList.length,
      percentage: Math.round((comparisonResult.unmatchedInList.length / totalFiles) * 100),
      color: [200, 0, 0] as [number, number, number]
    },
    {
      status: 'Extra',
      count: comparisonResult.unmatchedInFiles.length,
      percentage: comparisonResult.unmatchedInFiles.length > 0 ? 
        Math.round((comparisonResult.unmatchedInFiles.length / (totalFiles + comparisonResult.unmatchedInFiles.length)) * 100) : 0,
      color: [200, 150, 0] as [number, number, number]
    }
  ];  // Calculate match rate (overall success percentage)
  const matchRate = Math.round((comparisonResult.matched.length / totalFiles) * 100);
  
  // Draw summary table with web-like styling (3 columns - removed Match Rate column)
  const colWidths = [60, 30, 40]; // Removed the 4th column (40mm)
  const startX = 20;
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const rowHeight = 8;
  
  // Draw table header background
  pdf.setFillColor(249, 250, 251);
  pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
  
  // Draw table header borders
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  let currentX = startX;
  colWidths.forEach((width) => {
    pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
    currentX += width;
  });
    // Table headers (3 columns - removed Match Rate)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  pdf.text('Status', startX + 2, currentY);
  pdf.text('Count', startX + colWidths[0] + 2, currentY);
  pdf.text('Percentage', startX + colWidths[0] + colWidths[1] + 2, currentY);
  
  const tableStartY = currentY;
  currentY += rowHeight;
  
  // Summary data rows with alternating backgrounds
  pdf.setFont('helvetica', 'normal');
  
  summaryData.forEach((row, index) => {
    // Draw row background (alternating)
    if (index % 2 === 1) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
    }
    
    // Draw row borders
    currentX = startX;
    colWidths.forEach((width) => {
      pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
      currentX += width;
    });
      // Row data (3 columns - removed Match Rate column data)
    pdf.setTextColor(...row.color);
    pdf.text(row.status, startX + 2, currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.text(row.count.toString(), startX + colWidths[0] + 2, currentY);
    pdf.text(`${row.percentage}%`, startX + colWidths[0] + colWidths[1] + 2, currentY);
    
    currentY += rowHeight;
  });  // Add speedometer chart in place of the removed Match Rate column
  const speedometerX = startX + tableWidth + 5; // Position right after the 3-column table
  const speedometerY = tableStartY - 2; // Align with table top, slightly higher
  drawSpeedometer(pdf, speedometerX, speedometerY, matchRate, 'Match Rate');
  
  currentY += 10;
  // Start detail table immediately after summary with smart flow
  if (processedResults.length > 0) {
    // Add detailed results header
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Detailed Results', 20, currentY);
    
    currentY += 12;
    
    // Detailed results table headers using helper function
    const detailColWidths = [70, 70, 30];
    currentY = drawDetailTableHeaders(pdf, currentY, startX, detailColWidths);
    
    // Add detail rows with smart page management
    pdf.setFont('helvetica', 'normal');
    let rowsAddedOnFirstPage = 0;
    
    for (const row of processedResults) {
      if (currentY > pageHeight - 60) break; // Stop if we're too close to footer
      
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      
      // Use jsPDF's splitTextToSize for proper text wrapping
      const columnWidthInMM = detailColWidths[0] * 0.75; // Convert to approximate mm
      const drawingNameLines = pdf.splitTextToSize(row.drawingName || '-', columnWidthInMM);
      const fileNameLines = pdf.splitTextToSize(row.fileName || '-', detailColWidths[1] * 0.75);
        // Calculate row height based on maximum lines needed
      const maxLines = Math.max(drawingNameLines.length, fileNameLines.length, 1);
      const lineHeight = 5; // Increased from 4 to give more space for text
      const rowHeight = maxLines * lineHeight + 3; // Increased padding from 2 to 3
      
      // Check if this row will fit
      if (currentY + rowHeight > pageHeight - 40) break;
      
      // Draw row with alternating background using helper function
      drawTableRow(pdf, currentY, [], detailColWidths, startX, false, rowsAddedOnFirstPage % 2 === 1);
      
      // Draw Drawing Name (multi-line)
      for (let i = 0; i < drawingNameLines.length; i++) {
        pdf.text(drawingNameLines[i], startX + 2, currentY + (i * lineHeight));
      }
      
      // Draw File Name (multi-line)
      for (let i = 0; i < fileNameLines.length; i++) {
        pdf.text(fileNameLines[i], startX + detailColWidths[0] + 2, currentY + (i * lineHeight));
      }
      
      // Status with color (single line, centered vertically)
      const statusColors = {
        matched: [0, 150, 0] as [number, number, number],
        missing: [200, 0, 0] as [number, number, number], 
        extra: [200, 150, 0] as [number, number, number]
      };
      
      const statusTexts = {
        matched: '✓ Match',
        missing: '✗ Missing',
        extra: '+ Extra'
      };
      
      pdf.setTextColor(...statusColors[row.status as keyof typeof statusColors]);
      const statusY = currentY + (maxLines > 1 ? (maxLines * lineHeight) / 2 : 0);
      pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1] + 2, statusY);
      
      currentY += rowHeight;
      rowsAddedOnFirstPage++;
    }    // Add footer to first page
    const remainingResults = processedResults.slice(rowsAddedOnFirstPage);
    const totalPages = remainingResults.length > 0 ? Math.ceil(remainingResults.length / 20) + 1 : 1; // Estimate pages more accurately
    addFooter(1, totalPages);
    
    // Add continuation pages if needed with improved flow
    if (remainingResults.length > 0) {
      let pageNumber = 2;
      let resultIndex = 0;
      
      while (resultIndex < remainingResults.length) {
        pdf.addPage();
        addWatermark();
        
        currentY = 30;
        
        // Page header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Detailed Results (continued)', 20, currentY);
        
        currentY += 12;
        
        // Table headers using helper function
        currentY = drawDetailTableHeaders(pdf, currentY, startX, detailColWidths);
        
        // Add results for this page with proper wrapping
        pdf.setFont('helvetica', 'normal');
        let rowsOnThisPage = 0;
        
        while (resultIndex < remainingResults.length && currentY < pageHeight - 60) {
          const row = remainingResults[resultIndex];
          
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
          
          // Use jsPDF's splitTextToSize for proper text wrapping
          const columnWidthInMM = detailColWidths[0] * 0.75;
          const drawingNameLines = pdf.splitTextToSize(row.drawingName || '-', columnWidthInMM);
          const fileNameLines = pdf.splitTextToSize(row.fileName || '-', detailColWidths[1] * 0.75);
            // Calculate row height
          const maxLines = Math.max(drawingNameLines.length, fileNameLines.length, 1);
          const lineHeight = 5; // Increased from 4 to give more space for text
          const rowHeight = maxLines * lineHeight + 3; // Increased padding from 2 to 3
          
          // Check if this row will fit
          if (currentY + rowHeight > pageHeight - 40) break;
          
          // Draw row with alternating background using helper function
          drawTableRow(pdf, currentY, [], detailColWidths, startX, false, rowsOnThisPage % 2 === 1);
          
          // Draw Drawing Name (multi-line)
          for (let i = 0; i < drawingNameLines.length; i++) {
            pdf.text(drawingNameLines[i], startX + 2, currentY + (i * lineHeight));
          }
          
          // Draw File Name (multi-line)
          for (let i = 0; i < fileNameLines.length; i++) {
            pdf.text(fileNameLines[i], startX + detailColWidths[0] + 2, currentY + (i * lineHeight));
          }
          
          // Status with color
          const statusColors = {
            matched: [0, 150, 0] as [number, number, number],
            missing: [200, 0, 0] as [number, number, number], 
            extra: [200, 150, 0] as [number, number, number]
          };
          
          const statusTexts = {
            matched: '✓ Match',
            missing: '✗ Missing',
            extra: '+ Extra'
          };
          
          pdf.setTextColor(...statusColors[row.status as keyof typeof statusColors]);
          const statusY = currentY + (maxLines > 1 ? (maxLines * lineHeight) / 2 : 0);
          pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1] + 2, statusY);
          
          currentY += rowHeight;
          resultIndex++;
          rowsOnThisPage++;
        }
        
        addFooter(pageNumber, totalPages);
        pageNumber++;
      }
    }
  } else {
    // Just add footer to single page
    addFooter(1, 1);
  }

  // Generate filename and save
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `deliverables-tracker-report-${timestamp}.pdf`;
  
  pdf.save(filename);
};

// Specific function for Naming Validation report
export const generateNamingValidationPDF = async (complianceData: any, validationResults: any[]) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Load the icon logo
  let iconDataUrl: string | null = null;
  try {
    iconDataUrl = await loadImageAsDataUrl('/Valiblox_v3.1-icon-removebg-preview.png');
  } catch (error) {
    console.warn('Could not load icon logo, continuing without it');
  }
  // Helper function to add watermark (same as deliverables)
  const addWatermark = () => {
    if (iconDataUrl) {
      // Save current graphics state
      pdf.saveGraphicsState();
      
      // Set transparency for watermark
      pdf.setGState(pdf.GState({ opacity: 0.04 }));
      
      // Add multiple subtle watermarks across the page in a grid pattern
      const watermarkSize = 40;
      const spacing = 120;
      
      for (let x = 40; x < pageWidth - 40; x += spacing) {
        for (let y = 100; y < pageHeight - 100; y += spacing) {
          try {
            // Add logo watermark
            pdf.addImage(iconDataUrl, 'PNG', x, y, watermarkSize, watermarkSize * 0.25);
            
            // Add text watermark below logo
            pdf.setTextColor(120, 120, 120);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            const text = 'VALIBLOX';
            const textWidth = pdf.getTextWidth(text);
            pdf.text(text, x + (watermarkSize - textWidth) / 2, y + watermarkSize * 0.25 + 8);
          } catch (e) {
            console.warn('Error adding watermark element:', e);
          }
        }
      }
      
      // Restore graphics state
      pdf.restoreGraphicsState();
    }
  };

  // Helper function to add header (same structure as deliverables)
  const addHeader = (title: string, subtitle: string) => {
    addWatermark();
    
    if (iconDataUrl) {
      const iconSize = 25;
      const valibloxText = 'VALIBLOX';
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      const textWidth = pdf.getTextWidth(valibloxText);
      const totalWidth = iconSize + 5 + textWidth;
      const startX = (pageWidth - totalWidth) / 2;
      
      try {
        pdf.addImage(iconDataUrl, 'PNG', startX, 15, iconSize, iconSize);
      } catch (e) {
        console.warn('Error adding header logo:', e);
      }
      
      pdf.setTextColor(0, 0, 0);
      pdf.text(valibloxText, startX + iconSize + 5, 32);
    }
    
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 50);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    const subtitleWidth = pdf.getTextWidth(subtitle);
    pdf.text(subtitle, (pageWidth - subtitleWidth) / 2, 60);
    
    const { date, time } = formatDateTime();
    const dateText = `Generated on: ${date} at ${time}`;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.text(dateText, (pageWidth - dateWidth) / 2, 70);
    
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(150, 150, 150);
    pdf.line(20, 77, pageWidth - 20, 77);
  };

  // Helper function to add footer (same as deliverables)
  const addFooter = (pageNumber: number, totalPages: number) => {
    const footerY = pageHeight - 15;
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    
    const leftText = 'Generated by VALIBLOX';
    pdf.text(leftText, 20, footerY);
    
    const centerText = 'www.valiblox.com | info@valiblox.com';
    const centerWidth = pdf.getTextWidth(centerText);
    pdf.text(centerText, (pageWidth - centerWidth) / 2, footerY);
    
    const { date } = formatDateTime();
    const rightText = `${date} - Page ${pageNumber} of ${totalPages}`;
    const rightWidth = pdf.getTextWidth(rightText);
    pdf.text(rightText, pageWidth - 20 - rightWidth, footerY);
  };
  // Add header
  addHeader('Naming Validation Report', `${complianceData.totalFiles} files verified - ${complianceData.compliancePercentage}% compliant`);
  
  // Add summary and details (similar structure to deliverables)
  let currentY = 85;
  
  // Summary title
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Compliance Summary', 20, currentY);
  
  currentY += 10;
  
  // Summary table
  const summaryData = [
    {
      status: 'Compliant',
      count: complianceData.compliantFiles,
      percentage: complianceData.compliancePercentage,
      color: [0, 150, 0] as [number, number, number]
    },
    {
      status: 'Non-Compliant', 
      count: complianceData.totalFiles - complianceData.compliantFiles,
      percentage: 100 - complianceData.compliancePercentage,
      color: [200, 0, 0] as [number, number, number]
    }
  ];  // Draw summary table with web-like styling (3 columns - removed Compliance Rate column)
  const colWidths = [60, 30, 40]; // Removed the 4th column (40mm)
  const startX = 20;
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const rowHeight = 8;
  
  // Draw table header background
  pdf.setFillColor(249, 250, 251);
  pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
  
  // Draw table header borders
  pdf.setDrawColor(229, 231, 235);
  pdf.setLineWidth(0.3);
  let currentX = startX;
  colWidths.forEach((width) => {
    pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
    currentX += width;
  });
    // Table headers (3 columns - removed Compliance Rate)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  pdf.text('Status', startX + 2, currentY);
  pdf.text('Count', startX + colWidths[0] + 2, currentY);
  pdf.text('Percentage', startX + colWidths[0] + colWidths[1] + 2, currentY);
  
  const tableStartY = currentY;
  currentY += rowHeight;
  
  // Summary data rows with alternating backgrounds
  pdf.setFont('helvetica', 'normal');
  
  summaryData.forEach((row, index) => {
    // Draw row background (alternating)
    if (index % 2 === 1) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
    }
    
    // Draw row borders
    currentX = startX;
    colWidths.forEach((width) => {
      pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
      currentX += width;
    });
      // Row data (3 columns - removed Compliance Rate column data)
    pdf.setTextColor(...row.color);
    pdf.text(row.status, startX + 2, currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.text(row.count.toString(), startX + colWidths[0] + 2, currentY);
    pdf.text(`${row.percentage}%`, startX + colWidths[0] + colWidths[1] + 2, currentY);
    
    currentY += rowHeight;
  });  // Add speedometer chart in place of the removed Compliance Rate column
  const speedometerX = startX + tableWidth + 5; // Position right after the 3-column table
  const speedometerY = tableStartY - 2; // Align with table top, slightly higher
  drawSpeedometer(pdf, speedometerX, speedometerY, complianceData.compliancePercentage, 'Compliance Rate');
  
  currentY += 10;
  
  // Status colors and texts
  const statusColors = {
    'Ok': [0, 150, 0] as [number, number, number],
    'Wrong': [200, 0, 0] as [number, number, number]
  };
  
  const statusTexts = {
    'Ok': 'Valid',
    'Wrong': 'Invalid'
  };
  
  // Start detail table immediately after summary with smart flow
  if (validationResults.length > 0) {
    // Add detailed results header
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Detailed Results', 20, currentY);
    
    currentY += 12;
    
    // Detailed results table headers with web-like styling
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    
    const detailColWidths = [50, 50, 25, 45];
    const tableWidth = detailColWidths.reduce((a, b) => a + b, 0);
    const rowHeight = 8;
    
    // Draw header background
    pdf.setFillColor(249, 250, 251);
    pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
    
    // Draw header borders
    pdf.setDrawColor(229, 231, 235);
    pdf.setLineWidth(0.3);
    let currentX = startX;
    detailColWidths.forEach((width) => {
      pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
      currentX += width;
    });
    
    pdf.text('Folder Path', startX + 2, currentY);
    pdf.text('File Name', startX + detailColWidths[0] + 2, currentY);
    pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1] + 2, currentY);
    pdf.text('Details', startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2] + 2, currentY);
    
    currentY += rowHeight;
    
    // Add detail rows with smart page management
    pdf.setFont('helvetica', 'normal');
    let rowsAddedOnFirstPage = 0;
    
    for (const row of validationResults) {
      if (currentY > pageHeight - 60) break; // Stop if we're too close to footer
      
      pdf.setFontSize(8);
      pdf.setTextColor(0, 0, 0);
      
      // Use jsPDF's splitTextToSize for proper text wrapping
      const folderPathLines = pdf.splitTextToSize(row.folderPath || '-', detailColWidths[0] * 0.75);
      const fileNameLines = pdf.splitTextToSize(row.fileName || '-', detailColWidths[1] * 0.75);
      const detailsLines = pdf.splitTextToSize(row.details || '-', detailColWidths[3] * 0.75);
        // Calculate row height based on maximum lines needed
      const maxLines = Math.max(folderPathLines.length, fileNameLines.length, detailsLines.length, 1);
      const lineHeight = 5; // Increased from 4 to give more space for text
      const rowHeight = maxLines * lineHeight + 3; // Increased padding from 2 to 3
      
      // Check if this row will fit
      if (currentY + rowHeight > pageHeight - 40) break;
      
      // Draw row background (alternating)
      if (rowsAddedOnFirstPage % 2 === 1) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
      }
      
      // Draw row borders
      currentX = startX;
      detailColWidths.forEach((width) => {
        pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
        currentX += width;
      });
      
      // Draw Folder Path (multi-line)
      for (let i = 0; i < folderPathLines.length; i++) {
        pdf.text(folderPathLines[i], startX + 2, currentY + (i * lineHeight));
      }
      
      // Draw File Name (multi-line)
      for (let i = 0; i < fileNameLines.length; i++) {
        pdf.text(fileNameLines[i], startX + detailColWidths[0] + 2, currentY + (i * lineHeight));
      }
      
      // Status with color (single line, centered vertically)
      const statusColor = statusColors[row.status as keyof typeof statusColors];
      if (statusColor) {
        pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      }
      const statusY = currentY + (maxLines > 1 ? (maxLines * lineHeight) / 2 : 0);
      pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1] + 2, statusY);
      
      // Details in black (multi-line)
      pdf.setTextColor(0, 0, 0);
      for (let i = 0; i < detailsLines.length; i++) {
        pdf.text(detailsLines[i], startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2] + 2, currentY + (i * lineHeight));
      }
      
      currentY += rowHeight;
      rowsAddedOnFirstPage++;
    }    // Add footer to first page
    const remainingResults = validationResults.slice(rowsAddedOnFirstPage);
    const totalPages = remainingResults.length > 0 ? Math.ceil(remainingResults.length / 15) + 1 : 1; // Estimate pages more accurately
    addFooter(1, totalPages);
    
    // Add continuation pages if needed with improved styling
    if (remainingResults.length > 0) {
      let pageNumber = 2;
      let resultIndex = 0;
      
      while (resultIndex < remainingResults.length) {
        pdf.addPage();
        addWatermark();
        
        currentY = 30;
        
        // Page header
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Detailed Results (continued)', 20, currentY);
        
        currentY += 12;
        
        // Table headers with web-like styling
        pdf.setFillColor(249, 250, 251);
        pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
        
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.3);
        currentX = startX;
        detailColWidths.forEach((width) => {
          pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
          currentX += width;
        });
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Folder Path', startX + 2, currentY);
        pdf.text('File Name', startX + detailColWidths[0] + 2, currentY);
        pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1] + 2, currentY);
        pdf.text('Details', startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2] + 2, currentY);
        
        currentY += rowHeight;
        
        // Add results for this page with proper wrapping
        pdf.setFont('helvetica', 'normal');
        let rowsOnThisPage = 0;
        
        while (resultIndex < remainingResults.length && currentY < pageHeight - 60) {
          const row = remainingResults[resultIndex];
          
          pdf.setFontSize(8);
          pdf.setTextColor(0, 0, 0);
          
          // Use jsPDF's splitTextToSize for proper text wrapping
          const folderPathLines = pdf.splitTextToSize(row.folderPath || '-', detailColWidths[0] * 0.75);
          const fileNameLines = pdf.splitTextToSize(row.fileName || '-', detailColWidths[1] * 0.75);
          const detailsLines = pdf.splitTextToSize(row.details || '-', detailColWidths[3] * 0.75);
            // Calculate row height
          const maxLines = Math.max(folderPathLines.length, fileNameLines.length, detailsLines.length, 1);
          const lineHeight = 5; // Increased from 4 to give more space for text
          const rowHeight = maxLines * lineHeight + 3; // Increased padding from 2 to 3
          
          // Check if this row will fit
          if (currentY + rowHeight > pageHeight - 40) break;
          
          // Draw row background (alternating)
          if (rowsOnThisPage % 2 === 1) {
            pdf.setFillColor(249, 250, 251);
            pdf.rect(startX, currentY - 6, tableWidth, rowHeight, 'F');
          }
          
          // Draw row borders
          currentX = startX;
          detailColWidths.forEach((width) => {
            pdf.rect(currentX, currentY - 6, width, rowHeight, 'S');
            currentX += width;
          });
          
          // Draw Folder Path (multi-line)
          for (let i = 0; i < folderPathLines.length; i++) {
            pdf.text(folderPathLines[i], startX + 2, currentY + (i * lineHeight));
          }
          
          // Draw File Name (multi-line)
          for (let i = 0; i < fileNameLines.length; i++) {
            pdf.text(fileNameLines[i], startX + detailColWidths[0] + 2, currentY + (i * lineHeight));
          }
          
          // Status with color
          const statusColor = statusColors[row.status as keyof typeof statusColors];
          if (statusColor) {
            pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
          }
          const statusY = currentY + (maxLines > 1 ? (maxLines * lineHeight) / 2 : 0);
          pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1] + 2, statusY);
          
          // Details in black (multi-line)
          pdf.setTextColor(0, 0, 0);
          for (let i = 0; i < detailsLines.length; i++) {
            pdf.text(detailsLines[i], startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2] + 2, currentY + (i * lineHeight));
          }
          
          currentY += rowHeight;
          resultIndex++;
          rowsOnThisPage++;
        }
        
        addFooter(pageNumber, totalPages);
        pageNumber++;
      }
    }
  } else {
    // Just add footer to single page
    addFooter(1, 1);
  }
  
  // Generate filename and save
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `naming-validation-report-${timestamp}.pdf`;
  
  pdf.save(filename);
};
