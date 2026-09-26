import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateBelvoLorPdf() {
  const pdfDoc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Brand Colors
  const purpleDark = rgb(107 / 255, 33 / 255, 168 / 255); // #6B21A8
  const purpleTitle = rgb(59 / 255, 7 / 255, 100 / 255); // #3B0764
  const footerBg = rgb(243 / 255, 232 / 255, 255 / 255); // #F3E8FF
  const textDark = rgb(25 / 255, 30 / 255, 36 / 255);
  const textGray = rgb(70 / 255, 75 / 255, 85 / 255);

  // 1. Left Purple Accent Bars
  // Top bar
  page.drawRectangle({
    x: 0,
    y: height - 62,
    width: 28,
    height: 62,
    color: purpleDark,
  });

  // Long vertical bar
  page.drawRectangle({
    x: 0,
    y: 50,
    width: 28,
    height: height - 180,
    color: purpleDark,
  });

  // 2. Header
  // Date top right
  page.drawText('22-09-2026', {
    x: width - 110,
    y: height - 85,
    size: 10,
    font: fontRegular,
    color: textGray,
  });

  // Belvo Logo Mark & Company Text
  const logoX = 55;
  const logoY = height - 90;

  // Draw stylized Belvo loops glyph
  page.drawSvgPath(
    'M16 8 C12 4, 6 4, 3 8 C0 12, 1 18, 6 21 C1 24, 0 30, 3 34 C6 38, 12 38, 16 34 C20 38, 26 38, 29 34 C32 30, 31 24, 26 21 C31 18, 32 12, 29 8 C26 4, 20 4, 16 8 Z',
    {
      x: logoX - 5,
      y: logoY + 16,
      borderColor: purpleDark,
      borderWidth: 1.8,
      scale: 0.6,
    }
  );

  page.drawText('BELVO', {
    x: logoX - 4,
    y: logoY - 14,
    size: 6,
    font: fontBold,
    color: purpleDark,
  });

  page.drawText('BELVO COMPANY', {
    x: logoX + 28,
    y: logoY - 3,
    size: 19,
    font: fontBold,
    color: purpleTitle,
  });

  // 3. Recipient Info
  let curY = height - 165;
  const contentX = 55;

  page.drawText('Poosala Lokesh', {
    x: contentX,
    y: curY,
    size: 10.5,
    font: fontRegular,
    color: textDark,
  });
  curY -= 15;
  page.drawText('Web Developer Intern', {
    x: contentX,
    y: curY,
    size: 10.5,
    font: fontRegular,
    color: textDark,
  });
  curY -= 15;
  page.drawText('Belvo Company', {
    x: contentX,
    y: curY,
    size: 10.5,
    font: fontRegular,
    color: textDark,
  });
  curY -= 15;
  page.drawText('Goregaon, Mumbai', {
    x: contentX,
    y: curY,
    size: 10.5,
    font: fontRegular,
    color: textDark,
  });

  // 4. Salutation
  curY -= 35;
  page.drawText('Dear Poosala Lokesh,', {
    x: contentX,
    y: curY,
    size: 10.5,
    font: fontRegular,
    color: textDark,
  });

  // 5. Letter Paragraph 1
  curY -= 26;
  page.drawText(
    'It is my pleasure to recommend you for successfully completing a 3-month internship as a Web Developer',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText('at Belvo.', {
    x: contentX,
    y: curY,
    size: 9.5,
    font: fontRegular,
    color: textDark,
  });

  // Paragraph 2
  curY -= 22;
  page.drawText(
    'During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'in web development activities. Throughout the internship period, they gained practical exposure to',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'website development, implementation, debugging, and improving web-based solutions.',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );

  // Paragraph 3
  curY -= 22;
  page.drawText(
    'Poosala Lokesh contributed to assigned projects and responsibilities while working with the development team.',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'They showed dedication, adaptability, and a professional attitude while completing assigned tasks and',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'meeting project requirements. Their ability to learn new concepts and apply technical knowledge in',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'practical situations was appreciable.',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );

  // Bullets intro
  curY -= 22;
  page.drawText(
    'During their internship, Poosala Lokesh developed experience in areas such as:',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );

  const bullets = [
    'Web development and website implementation',
    'Front-end development and responsive design',
    'Debugging and resolving technical issues',
    'Understanding project requirements and development workflows',
    'Testing and improving web pages and features',
    'Collaborating with team members on development tasks',
  ];

  for (const b of bullets) {
    curY -= 14;
    page.drawText('•', {
      x: contentX + 5,
      y: curY,
      size: 9.5,
      font: fontRegular,
      color: textDark,
    });
    page.drawText(b, {
      x: contentX + 16,
      y: curY,
      size: 9.5,
      font: fontRegular,
      color: textDark,
    });
  }

  // Paragraph 4
  curY -= 22;
  page.drawText(
    'Poosala Lokesh successfully completed the 3-month internship program at Belvo and demonstrated',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'consistent commitment throughout the internship. We appreciate their contributions and wish them',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText(
    'continued success in their academic and professional career.',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );

  // Paragraph 5
  curY -= 22;
  page.drawText(
    'I am pleased to recommend Poosala Lokesh for future opportunities in the field of Web Development and',
    { x: contentX, y: curY, size: 9.5, font: fontRegular, color: textDark }
  );
  curY -= 14;
  page.drawText('related areas.', {
    x: contentX,
    y: curY,
    size: 9.5,
    font: fontRegular,
    color: textDark,
  });

  // 6. Signature Block (Bottom Right)
  const sigX = 360;
  const sigY = 160;

  // Draw Hrishikesh cursive signature path
  page.drawSvgPath(
    'M 10 10 L 10 50 M 10 30 Q 22 26, 32 26 M 30 14 L 30 48 M 30 32 Q 38 24, 46 32 T 54 36 M 54 26 L 54 48 M 57 22 C 57 20, 59 20, 59 22 M 60 40 Q 66 32, 72 46 M 74 26 L 74 48 M 77 22 C 77 20, 79 20, 79 22 M 82 40 Q 90 32, 96 46 M 98 12 L 98 48 Q 104 34, 112 48 M 116 40 Q 124 32, 130 46 M 134 42 Q 140 32, 148 46 M 152 14 L 152 56 Q 160 34, 172 48',
    {
      x: sigX,
      y: sigY,
      borderColor: textDark,
      borderWidth: 2.2,
      scale: 0.9,
    }
  );

  page.drawText('Hrishikesh Mishra', {
    x: sigX + 85,
    y: sigY - 25,
    size: 10,
    font: fontBold,
    color: textDark,
  });

  page.drawText('CEO, Belvo', {
    x: sigX + 115,
    y: sigY - 37,
    size: 9,
    font: fontRegular,
    color: textDark,
  });

  // 7. Footer Banner
  const footerHeight = 44;
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: footerHeight,
    color: footerBg,
  });

  // Footer Items
  const footY = 16;
  page.drawText('+918928466820', {
    x: 65,
    y: footY,
    size: 9,
    font: fontRegular,
    color: textDark,
  });

  page.drawText('contact.belvo@gmail.com', {
    x: 230,
    y: footY,
    size: 9,
    font: fontRegular,
    color: textDark,
  });

  page.drawText('Goregaon, Mumbai', {
    x: 420,
    y: footY,
    size: 9,
    font: fontRegular,
    color: textDark,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve('./public/belvo-lor.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF successfully generated at:', outputPath);
}

generateBelvoLorPdf().catch(console.error);
