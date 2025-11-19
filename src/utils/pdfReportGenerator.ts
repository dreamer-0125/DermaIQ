import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface AnalysisResult {
  id: string;
  imageUrl: string;
  originalImageUrl?: string;
  segmentedImageUrl?: string;
  woundType: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  confidence: number;
  isInfected: boolean;
  infectionType: string | null;
  woundArea: number;
  characteristics: string[];
  description: string;
  recommendations: string[];
  timestamp: string;
  analyzedBy: string;
  processingTime?: number;
  metadata?: {
    image_urls?: {
      original?: string;
      segmented?: string;
    };
    [key: string]: any;
  };
  treatmentPlan?: {
    name?: string;
    description?: string;
    duration?: string;
    materials?: string[];
    steps?: string[];
    precautions?: string[];
  };
  doctorRecommendations?: Array<{
    name: string;
    specialization: string;
    phone?: string;
    email?: string;
    address?: string;
    state?: string;
    rating?: number;
    availability?: string;
  }>;
}

/**
 * Normalize treatment plan data to ensure arrays are properly formatted
 */
const normalizeTreatmentPlan = (treatmentPlan: any) => {
  if (!treatmentPlan) return null;
  
  // Helper to ensure field is an array
  const ensureArray = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If it's a string but not JSON, split by common delimiters
        return field.split(/[,;\n]/).map((s: string) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };
  
  return {
    name: treatmentPlan.name || treatmentPlan.treatment_name || undefined,
    description: treatmentPlan.description || treatmentPlan.treatment_description || undefined,
    duration: treatmentPlan.duration || treatmentPlan.expected_duration || undefined,
    steps: ensureArray(treatmentPlan.steps || treatmentPlan.treatment_steps),
    materials: ensureArray(treatmentPlan.materials || treatmentPlan.required_materials),
    precautions: ensureArray(treatmentPlan.precautions || treatmentPlan.safety_precautions)
  };
};

/**
 * Generate a PDF report for wound analysis results
 */
export const generatePDFReport = async (result: AnalysisResult): Promise<jsPDF> => {
  // Normalize treatment plan data to handle different formats
  const normalizedResult = {
    ...result,
    treatmentPlan: result.treatmentPlan ? normalizeTreatmentPlan(result.treatmentPlan) : undefined
  };
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // ========== HEADER ==========
  // DermaIQ Logo/Title
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('DermaIQ', margin, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Wound Analysis Report', margin, 30);

  yPosition = 50;

  // ========== REPORT INFO ==========
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const reportDate = new Date(result.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.text(`Report Date: ${reportDate}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Analysis ID: ${result.id}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Analyzed By: ${result.analyzedBy}`, margin, yPosition);
  yPosition += 12;

  // ========== WOUND IMAGE ==========
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Wound Image Analysis', margin, yPosition);
  yPosition += 8;

  try {
    // Load and add the segmented wound image
    // Priority order for image selection:
    // 1. segmentedImageUrl (explicitly set segmented image)
    // 2. metadata.image_urls.segmented (from backend analysis)
    // 3. imageUrl (general image, could be segmented)
    // 4. originalImageUrl (fallback to original)
    
    let imageUrl: string | undefined;
    
    // console.log('PDF Image Debug - All available URLs:');
    // console.log('  segmentedImageUrl:', result.segmentedImageUrl);
    // console.log('  metadata?.image_urls?.segmented:', result.metadata?.image_urls?.segmented);
    // console.log('  imageUrl:', result.imageUrl);
    // console.log('  originalImageUrl:', result.originalImageUrl);
    
    // First check for explicit segmented image URL
    if (result.segmentedImageUrl) {
      imageUrl = result.segmentedImageUrl;
      // console.log('✓ Using segmentedImageUrl:', imageUrl);
    }
    // Then check metadata
    else if (result.metadata?.image_urls?.segmented) {
      imageUrl = result.metadata.image_urls.segmented;
      // console.log('✓ Using metadata segmented URL:', imageUrl);
    }
    // Then use imageUrl
    else if (result.imageUrl) {
      imageUrl = result.imageUrl;
      // console.log('✓ Using imageUrl:', imageUrl);
    }
    // Finally fallback to original
    else if (result.originalImageUrl) {
      imageUrl = result.originalImageUrl;
      // console.log('✓ Using originalImageUrl:', imageUrl);
    }
    
    if (imageUrl) {
      // console.log('Loading image from URL:', imageUrl.substring(0, 100) + '...');
      
      // Convert image to base64 if it's a URL
      const imageData = await loadImageAsBase64(imageUrl);
      
      if (imageData) {
        // console.log('✓ Image loaded successfully, data length:', imageData.length);
        
        const imgWidth = contentWidth * 0.6; // 60% of content width
        const imgHeight = imgWidth * 0.75; // 4:3 aspect ratio
        
        checkPageBreak(imgHeight + 10);
        
        // Center the image
        const imgX = margin + (contentWidth - imgWidth) / 2;
        
        doc.addImage(imageData, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
        // console.log('✓ Image added to PDF at position:', yPosition);
        yPosition += imgHeight + 10;
      } else {
        // console.error('✗ Failed to load image data - loadImageAsBase64 returned null');
        throw new Error('Failed to load image data');
      }
    } else {
      // console.error('✗ No image URL available in result object');
      throw new Error('No image URL available');
    }
  } catch (error) {
    // console.error('✗ Failed to add image to PDF:', error);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Image not available', margin, yPosition);
    yPosition += 10;
  }

  // ========== ANALYSIS SUMMARY ==========
  checkPageBreak(60);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Summary', margin, yPosition);
  yPosition += 8;

  // Summary box
  const summaryBoxY = yPosition;
  const summaryBoxHeight = 50;
  
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.setFillColor(249, 250, 251); // Gray-50
  doc.roundedRect(margin, summaryBoxY, contentWidth, summaryBoxHeight, 3, 3, 'FD');
  
  yPosition += 8;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Wound Type:', margin + 5, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(result.woundType, margin + 40, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Severity:', margin + 5, yPosition);
  doc.setFont('helvetica', 'normal');
  
  // Color-code severity
  const severityColors: Record<string, [number, number, number]> = {
    mild: [22, 163, 74], // Green-600
    moderate: [234, 179, 8], // Yellow-600
    severe: [249, 115, 22], // Orange-600
    critical: [220, 38, 38] // Red-600
  };
  
  const severityColor = severityColors[result.severity] || [0, 0, 0];
  doc.setTextColor(...severityColor);
  doc.text(result.severity.toUpperCase(), margin + 40, yPosition);
  doc.setTextColor(0, 0, 0);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Confidence:', margin + 5, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.confidence}%`, margin + 40, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Wound Area:', margin + 5, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(`${result.woundArea.toFixed(2)} cm²`, margin + 40, yPosition);
  yPosition += 8;
  
  doc.setFont('helvetica', 'bold');
  doc.text('Infection Status:', margin + 5, yPosition);
  doc.setFont('helvetica', 'normal');
  
  if (result.isInfected) {
    doc.setTextColor(220, 38, 38); // Red-600
    doc.text('INFECTED', margin + 40, yPosition);
    if (result.infectionType) {
      doc.setTextColor(0, 0, 0);
      doc.text(`(${result.infectionType})`, margin + 65, yPosition);
    }
  } else {
    doc.setTextColor(22, 163, 74); // Green-600
    doc.text('NOT INFECTED', margin + 40, yPosition);
  }
  doc.setTextColor(0, 0, 0);
  
  yPosition = summaryBoxY + summaryBoxHeight + 12;

  // ========== WOUND DESCRIPTION ==========
  checkPageBreak(40);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Wound Description', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const descriptionLines = doc.splitTextToSize(result.description, contentWidth);
  doc.text(descriptionLines, margin, yPosition);
  yPosition += (descriptionLines.length * 5) + 10;

  // ========== WOUND CHARACTERISTICS ==========
  checkPageBreak(30);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Wound Characteristics', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  result.characteristics.forEach((characteristic) => {
    checkPageBreak(8);
    
    // Bullet point
    doc.circle(margin + 2, yPosition - 1, 0.8, 'F');
    
    const charLines = doc.splitTextToSize(characteristic, contentWidth - 10);
    doc.text(charLines, margin + 6, yPosition);
    yPosition += (charLines.length * 5) + 2;
  });
  
  yPosition += 5;

  // ========== RECOMMENDATIONS ==========
  checkPageBreak(30);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  if (result.recommendations && result.recommendations.length > 0) {
    result.recommendations.forEach((recommendation, index) => {
      checkPageBreak(10);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}.`, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      
      const recLines = doc.splitTextToSize(recommendation, contentWidth - 10);
      doc.text(recLines, margin + 6, yPosition);
      yPosition += (recLines.length * 5) + 3;
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('No specific recommendations available', margin, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;
  }

  // ========== TREATMENT PLAN ==========
  if (normalizedResult.treatmentPlan) {
    checkPageBreak(40);
    yPosition += 5;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Treatment Plan', margin, yPosition);
    yPosition += 8;

    // Treatment plan box
    const treatmentBoxY = yPosition;
    doc.setDrawColor(220, 252, 231); // Green-100
    doc.setFillColor(240, 253, 244); // Green-50
    
    // Calculate box height dynamically
    let boxContentHeight = 10;
    
    if (normalizedResult.treatmentPlan.name) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      const nameLines = doc.splitTextToSize(normalizedResult.treatmentPlan.name, contentWidth - 10);
      boxContentHeight += (nameLines.length * 6) + 3;
    }
    
    if (normalizedResult.treatmentPlan.description) {
      doc.setFontSize(10);
      const descLines = doc.splitTextToSize(normalizedResult.treatmentPlan.description, contentWidth - 10);
      boxContentHeight += (descLines.length * 5) + 3;
    }
    
    if (normalizedResult.treatmentPlan.duration) {
      boxContentHeight += 8;
    }
    
    // Draw box
    doc.roundedRect(margin, treatmentBoxY, contentWidth, Math.min(boxContentHeight + 10, 60), 3, 3, 'FD');
    
    yPosition += 5;
    
    // Treatment plan name
    if (normalizedResult.treatmentPlan.name) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 163, 74); // Green-600
      const nameLines = doc.splitTextToSize(normalizedResult.treatmentPlan.name, contentWidth - 10);
      doc.text(nameLines, margin + 5, yPosition);
      yPosition += (nameLines.length * 6) + 3;
    }
    
    doc.setTextColor(0, 0, 0);
    
    // Treatment plan description
    if (normalizedResult.treatmentPlan.description) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(normalizedResult.treatmentPlan.description, contentWidth - 10);
      doc.text(descLines, margin + 5, yPosition);
      yPosition += (descLines.length * 5) + 3;
    }
    
    // Duration
    if (normalizedResult.treatmentPlan.duration) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Duration:', margin + 5, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(normalizedResult.treatmentPlan.duration, margin + 28, yPosition);
      yPosition += 6;
    }
    
    yPosition = treatmentBoxY + Math.min(boxContentHeight + 10, 60) + 8;
    
    // Treatment steps
    if (normalizedResult.treatmentPlan.steps && Array.isArray(normalizedResult.treatmentPlan.steps) && normalizedResult.treatmentPlan.steps.length > 0) {
      checkPageBreak(30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Treatment Steps:', margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      normalizedResult.treatmentPlan.steps.forEach((step, index) => {
        checkPageBreak(10);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}.`, margin + 2, yPosition);
        doc.setFont('helvetica', 'normal');
        
        const stepLines = doc.splitTextToSize(step, contentWidth - 12);
        doc.text(stepLines, margin + 8, yPosition);
        yPosition += (stepLines.length * 5) + 2;
      });
      
      yPosition += 5;
    }
    
    // Required materials
    if (normalizedResult.treatmentPlan.materials && Array.isArray(normalizedResult.treatmentPlan.materials) && normalizedResult.treatmentPlan.materials.length > 0) {
      checkPageBreak(30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Required Materials:', margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      normalizedResult.treatmentPlan.materials.forEach((material) => {
        checkPageBreak(8);
        
        doc.circle(margin + 3, yPosition - 1, 0.8, 'F');
        const matLines = doc.splitTextToSize(material, contentWidth - 10);
        doc.text(matLines, margin + 8, yPosition);
        yPosition += (matLines.length * 5) + 1;
      });
      
      yPosition += 5;
    }
    
    // Precautions
    if (normalizedResult.treatmentPlan.precautions && Array.isArray(normalizedResult.treatmentPlan.precautions) && normalizedResult.treatmentPlan.precautions.length > 0) {
      checkPageBreak(30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(234, 179, 8); // Yellow-600
      doc.text('⚠ Precautions:', margin, yPosition);
      yPosition += 6;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      normalizedResult.treatmentPlan.precautions.forEach((precaution) => {
        checkPageBreak(8);
        
        doc.circle(margin + 3, yPosition - 1, 0.8, 'F');
        const precLines = doc.splitTextToSize(precaution, contentWidth - 10);
        doc.text(precLines, margin + 8, yPosition);
        yPosition += (precLines.length * 5) + 1;
      });
      
      yPosition += 5;
    }
  }

  // ========== DOCTOR RECOMMENDATIONS ==========
  if (result.doctorRecommendations && result.doctorRecommendations.length > 0) {
    checkPageBreak(40);
    yPosition += 5;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Recommended Healthcare Providers', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`${result.doctorRecommendations.length} specialist${result.doctorRecommendations.length > 1 ? 's' : ''} recommended for your wound care needs`, margin, yPosition);
    yPosition += 8;
    
    doc.setTextColor(0, 0, 0);
    
    // Create table data for doctors
    const doctorTableData = result.doctorRecommendations.map((doctor, index) => {
      const contact = [];
      if (doctor.phone) contact.push(`📞 ${doctor.phone}`);
      if (doctor.email) contact.push(`✉️ ${doctor.email}`);
      
      return [
        `${index + 1}`,
        doctor.name || 'N/A',
        doctor.specialization || 'N/A',
        contact.join('\n') || 'N/A',
        doctor.address || 'N/A',
        doctor.rating ? `⭐ ${doctor.rating.toFixed(1)}` : 'N/A'
      ];
    });
    
    autoTable(doc, {
      startY: yPosition,
      head: [['#', 'Doctor Name', 'Specialization', 'Contact', 'Address', 'Rating']],
      body: doctorTableData,
      theme: 'striped',
      headStyles: {
        fillColor: [147, 51, 234], // Purple-600
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [250, 245, 255] // Purple-50
      },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 40 },
        4: { cellWidth: 45 },
        5: { cellWidth: 15 }
      },
      margin: { left: margin, right: margin }
    });
    
    // @ts-ignore - autoTable adds finalY property
    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // ========== TECHNICAL DETAILS TABLE ==========
  checkPageBreak(40);
  yPosition += 5;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Details', margin, yPosition);
  yPosition += 8;

  const technicalData = [
    ['Analysis ID', result.id],
    ['Wound Type', result.woundType],
    ['Severity Level', result.severity.toUpperCase()],
    ['Confidence Score', `${result.confidence}%`],
    ['Wound Area', `${result.woundArea.toFixed(2)} cm²`],
    ['Infection Status', result.isInfected ? 'Infected' : 'Not Infected'],
  ];

  if (result.infectionType) {
    technicalData.push(['Infection Type', result.infectionType]);
  }

  if (result.processingTime) {
    technicalData.push(['Processing Time', `${(result.processingTime / 1000).toFixed(2)} seconds`]);
  }

  autoTable(doc, {
    startY: yPosition,
    head: [['Parameter', 'Value']],
    body: technicalData,
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235], // Blue-600
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // Gray-50
    },
    margin: { left: margin, right: margin }
  });

  // @ts-ignore - autoTable adds finalY property
  yPosition = doc.lastAutoTable.finalY + 15;

  // ========== DISCLAIMER ==========
  // Add disclaimer on a new page or at bottom
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setDrawColor(234, 179, 8); // Yellow-600
  doc.setFillColor(254, 252, 232); // Yellow-50
  doc.roundedRect(margin, yPosition, contentWidth, 35, 3, 3, 'FD');
  
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(161, 98, 7); // Yellow-700
  doc.text('⚠ Important Disclaimer', margin + 5, yPosition);
  yPosition += 6;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const disclaimerText = 'This report is generated by AI and should be used as a supplementary tool only. It does not replace professional medical diagnosis or treatment. Always consult with a qualified healthcare provider for medical advice and treatment decisions.';
  const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth - 10);
  doc.text(disclaimerLines, margin + 5, yPosition);
  
  doc.setTextColor(0, 0, 0);

  // ========== FOOTER ==========
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Footer line
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128); // Gray-500
    
    doc.text(
      'DermaIQ - AI-Powered Wound Analysis System',
      margin,
      pageHeight - 10
    );
    
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin - 20,
      pageHeight - 10
    );
    
    doc.text(
      reportDate,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return doc;
};

/**
 * Load an image from URL and convert to base64
 */
const loadImageAsBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    // console.log('loadImageAsBase64 called with URL type:', imageUrl.startsWith('data:') ? 'data URL' : 'HTTP URL');
    
    // If it's already a data URL, return it
    if (imageUrl.startsWith('data:')) {
      // console.log('✓ Already a data URL, length:', imageUrl.length);
      return imageUrl;
    }

    // console.log('Fetching image from URL...');
    // Fetch the image
    const response = await fetch(imageUrl);
    // console.log('Fetch response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    // console.log('✓ Blob received, size:', blob.size, 'type:', blob.type);
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // console.log('✓ Converted to base64, length:', result?.length || 0);
        resolve(result);
      };
      reader.onerror = (error) => {
        // console.error('✗ FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // console.error('✗ Failed to load image:', error);
    return null;
  }
};

/**
 * Download the PDF report
 */
export const downloadPDFReport = async (result: AnalysisResult): Promise<void> => {
  try {
    const doc = await generatePDFReport(result);
    const filename = `DermaIQ-Report-${result.id}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  } catch (error) {
    // console.error('Failed to download PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
};

/**
 * Print the PDF report
 */
export const printPDFReport = async (result: AnalysisResult): Promise<void> => {
  try {
    const doc = await generatePDFReport(result);
    
    // Open print dialog
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Open in new window for printing
    const printWindow = window.open(pdfUrl, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        // Clean up the blob URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
        }, 1000);
      };
    } else {
      // Fallback: download if popup blocked
      throw new Error('Print window blocked. Please allow popups or use the Export button.');
    }
  } catch (error) {
    // console.error('Failed to print PDF report:', error);
    throw error;
  }
};
