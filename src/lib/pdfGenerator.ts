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
  ];

  // Table headers
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  const colWidths = [60, 30, 40, 40];
  const startX = 20;
  
  pdf.text('Status', startX, currentY);
  pdf.text('Count', startX + colWidths[0], currentY);
  pdf.text('Percentage', startX + colWidths[0] + colWidths[1], currentY);
  pdf.text('Progress', startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);
  
  currentY += 5;
  
  // Header line
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(startX, currentY, startX + colWidths.reduce((a, b) => a + b, 0), currentY);
  
  currentY += 8;
  
  // Summary data rows
  pdf.setFont('helvetica', 'normal');
  
  summaryData.forEach((row) => {
    pdf.setTextColor(...row.color);
    pdf.text(row.status, startX, currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.text(row.count.toString(), startX + colWidths[0], currentY);    pdf.text(`${row.percentage}%`, startX + colWidths[0] + colWidths[1], currentY);
    
    // Add simple progress indicator
    const progressText = `${row.percentage}%`;
    pdf.setTextColor(...row.color);
    pdf.text(progressText, startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);
    
    currentY += 8;
  });
  
  currentY += 10;
    // Check if we have space for detailed results on first page
  const spaceForDetails = pageHeight - currentY - 40; // Leave space for footer
  
  if (spaceForDetails > 40 && processedResults.length > 0) {    // Add detailed results header
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Detailed Results', 20, currentY);
    
    currentY += 12;
    
    // Detailed results table headers
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    
    const detailColWidths = [70, 70, 30];
    
    pdf.text('Drawing Name', startX, currentY);
    pdf.text('File Name', startX + detailColWidths[0], currentY);
    pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1], currentY);
    
    currentY += 5;
    
    // Header line
    pdf.line(startX, currentY, startX + detailColWidths.reduce((a, b) => a + b, 0), currentY);
    
    currentY += 6;
      // Add detail rows that fit on first page
    pdf.setFont('helvetica', 'normal');
    let rowsAddedOnFirstPage = 0;
    const firstPageResults = [];
    
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
      const lineHeight = 4;
      const rowHeight = maxLines * lineHeight + 2; // Add padding
      
      // Check if this row will fit
      if (currentY + rowHeight > pageHeight - 40) break;
      
      // Draw Drawing Name (multi-line)
      for (let i = 0; i < drawingNameLines.length; i++) {
        pdf.text(drawingNameLines[i], startX, currentY + (i * lineHeight));
      }
      
      // Draw File Name (multi-line)
      for (let i = 0; i < fileNameLines.length; i++) {
        pdf.text(fileNameLines[i], startX + detailColWidths[0], currentY + (i * lineHeight));
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
      pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1], statusY);
      
      currentY += rowHeight;
      rowsAddedOnFirstPage++;
      firstPageResults.push(row);
    }    // Add footer to first page
    const remainingResults = processedResults.slice(rowsAddedOnFirstPage);
    const totalPages = remainingResults.length > 0 ? Math.ceil(remainingResults.length / 15) + 1 : 1; // Estimate pages
    addFooter(1, totalPages);
    
    // Add continuation pages if needed
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
        
        // Table headers
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        
        pdf.text('Drawing Name', startX, currentY);
        pdf.text('File Name', startX + detailColWidths[0], currentY);
        pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1], currentY);
        
        currentY += 5;
        pdf.line(startX, currentY, startX + detailColWidths.reduce((a, b) => a + b, 0), currentY);
        currentY += 6;
        
        // Add results for this page with proper wrapping
        pdf.setFont('helvetica', 'normal');
        
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
          const lineHeight = 4;
          const rowHeight = maxLines * lineHeight + 2;
          
          // Check if this row will fit
          if (currentY + rowHeight > pageHeight - 40) break;
          
          // Draw Drawing Name (multi-line)
          for (let i = 0; i < drawingNameLines.length; i++) {
            pdf.text(drawingNameLines[i], startX, currentY + (i * lineHeight));
          }
          
          // Draw File Name (multi-line)
          for (let i = 0; i < fileNameLines.length; i++) {
            pdf.text(fileNameLines[i], startX + detailColWidths[0], currentY + (i * lineHeight));
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
          pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1], statusY);
          
          currentY += rowHeight;
          resultIndex++;
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
  ];

  // Table headers
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  const colWidths = [60, 30, 40, 40];
  const startX = 20;
  
  pdf.text('Status', startX, currentY);
  pdf.text('Count', startX + colWidths[0], currentY);
  pdf.text('Percentage', startX + colWidths[0] + colWidths[1], currentY);
  pdf.text('Progress', startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);
  
  currentY += 5;
  
  // Header line
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(startX, currentY, startX + colWidths.reduce((a, b) => a + b, 0), currentY);
  
  currentY += 8;
  
  // Summary data rows
  pdf.setFont('helvetica', 'normal');
  
  summaryData.forEach((row) => {
    pdf.setTextColor(...row.color);
    pdf.text(row.status, startX, currentY);
    pdf.setTextColor(0, 0, 0);
    pdf.text(row.count.toString(), startX + colWidths[0], currentY);
    pdf.text(`${row.percentage}%`, startX + colWidths[0] + colWidths[1], currentY);
    
    // Add simple progress indicator
    const progressText = `${row.percentage}%`;
    pdf.setTextColor(...row.color);
    pdf.text(progressText, startX + colWidths[0] + colWidths[1] + colWidths[2], currentY);
    
    currentY += 8;
  });
  
  currentY += 10;
  // Check if we have space for detailed results on first page
  const spaceForDetails = pageHeight - currentY - 40; // Leave space for footer
  
  // Status colors and texts
  const statusColors = {
    'Ok': [0, 150, 0] as [number, number, number],
    'Wrong': [200, 0, 0] as [number, number, number]
  };
  
  const statusTexts = {
    'Ok': 'Valid',
    'Wrong': 'Invalid'
  };
  
  if (spaceForDetails > 40 && validationResults.length > 0) {
    // Add detailed results header
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Detailed Results', 20, currentY);
    
    currentY += 12;
    
    // Detailed results table headers
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    
    const detailColWidths = [50, 50, 25, 45];
    
    pdf.text('Folder Path', startX, currentY);
    pdf.text('File Name', startX + detailColWidths[0], currentY);
    pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1], currentY);
    pdf.text('Details', startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2], currentY);
    
    currentY += 5;
    
    // Header line
    pdf.line(startX, currentY, startX + detailColWidths.reduce((a, b) => a + b, 0), currentY);
    
    currentY += 6;
      // Add detail rows that fit on first page
    pdf.setFont('helvetica', 'normal');
    let rowsAddedOnFirstPage = 0;
    const firstPageResults = [];
    
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
      const lineHeight = 4;
      const rowHeight = maxLines * lineHeight + 2; // Add padding
      
      // Check if this row will fit
      if (currentY + rowHeight > pageHeight - 40) break;
      
      // Draw Folder Path (multi-line)
      for (let i = 0; i < folderPathLines.length; i++) {
        pdf.text(folderPathLines[i], startX, currentY + (i * lineHeight));
      }
      
      // Draw File Name (multi-line)
      for (let i = 0; i < fileNameLines.length; i++) {
        pdf.text(fileNameLines[i], startX + detailColWidths[0], currentY + (i * lineHeight));
      }
      
      // Status with color (single line, centered vertically)
      const statusColor = statusColors[row.status as keyof typeof statusColors];
      if (statusColor) {
        pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      }
      const statusY = currentY + (maxLines > 1 ? (maxLines * lineHeight) / 2 : 0);
      pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1], statusY);
      
      // Details in black (multi-line)
      pdf.setTextColor(0, 0, 0);
      for (let i = 0; i < detailsLines.length; i++) {
        pdf.text(detailsLines[i], startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2], currentY + (i * lineHeight));
      }
      
      currentY += rowHeight;
      rowsAddedOnFirstPage++;
      firstPageResults.push(row);
    }
      // Add footer to first page
    const remainingResults = validationResults.slice(rowsAddedOnFirstPage);
    const totalPages = remainingResults.length > 0 ? Math.ceil(remainingResults.length / 10) + 1 : 1; // Estimate pages
    addFooter(1, totalPages);
    
    // Add continuation pages if needed
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
        
        // Table headers
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        
        pdf.text('Folder Path', startX, currentY);
        pdf.text('File Name', startX + detailColWidths[0], currentY);
        pdf.text('Status', startX + detailColWidths[0] + detailColWidths[1], currentY);
        pdf.text('Details', startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2], currentY);
        
        currentY += 5;
        pdf.line(startX, currentY, startX + detailColWidths.reduce((a, b) => a + b, 0), currentY);
        currentY += 6;
        
        // Add results for this page with proper wrapping
        pdf.setFont('helvetica', 'normal');
        
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
          const lineHeight = 4;
          const rowHeight = maxLines * lineHeight + 2;
          
          // Check if this row will fit
          if (currentY + rowHeight > pageHeight - 40) break;
          
          // Draw Folder Path (multi-line)
          for (let i = 0; i < folderPathLines.length; i++) {
            pdf.text(folderPathLines[i], startX, currentY + (i * lineHeight));
          }
          
          // Draw File Name (multi-line)
          for (let i = 0; i < fileNameLines.length; i++) {
            pdf.text(fileNameLines[i], startX + detailColWidths[0], currentY + (i * lineHeight));
          }
          
          // Status with color
          const statusColor = statusColors[row.status as keyof typeof statusColors];
          if (statusColor) {
            pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
          }
          const statusY = currentY + (maxLines > 1 ? (maxLines * lineHeight) / 2 : 0);
          pdf.text(statusTexts[row.status as keyof typeof statusTexts], startX + detailColWidths[0] + detailColWidths[1], statusY);
          
          // Details in black (multi-line)
          pdf.setTextColor(0, 0, 0);
          for (let i = 0; i < detailsLines.length; i++) {
            pdf.text(detailsLines[i], startX + detailColWidths[0] + detailColWidths[1] + detailColWidths[2], currentY + (i * lineHeight));
          }
          
          currentY += rowHeight;
          resultIndex++;
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
