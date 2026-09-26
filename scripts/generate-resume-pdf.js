import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function generateResumePdf() {
  const pdfDoc = await PDFDocument.create();
  // Standard A4: 595.28 x 841.89
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const primaryBlue = rgb(37 / 255, 99 / 255, 235 / 255); // #2563EB
  const textDark = rgb(15 / 255, 23 / 255, 42 / 255); // #0F172A
  const textMuted = rgb(71 / 255, 85 / 255, 105 / 255); // #475569
  const borderGray = rgb(226 / 255, 232 / 255, 240 / 255); // #E2E8F0

  const margin = 48;
  const contentWidth = width - margin * 2;
  let curY = height - 48;

  // Header: Name & Title
  page.drawText('POOSALA LOKESH', {
    x: margin,
    y: curY,
    size: 22,
    font: fontBold,
    color: primaryBlue,
  });

  curY -= 18;
  page.drawText('Full Stack Engineer & Cloud Developer', {
    x: margin,
    y: curY,
    size: 11,
    font: fontBold,
    color: textDark,
  });

  // Contact line
  curY -= 16;
  const contactText = 'poosala15@gmail.com  |  Telangana, India  |  github.com/Lokesh-81  |  linkedin.com/in/poosala-lokesh';
  page.drawText(contactText, {
    x: margin,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });

  // Divider
  curY -= 12;
  page.drawLine({
    start: { x: margin, y: curY },
    end: { x: width - margin, y: curY },
    thickness: 1,
    color: borderGray,
  });

  // Section helper
  const drawSectionTitle = (title) => {
    curY -= 20;
    page.drawText(title.toUpperCase(), {
      x: margin,
      y: curY,
      size: 10,
      font: fontBold,
      color: primaryBlue,
    });
    curY -= 6;
    page.drawLine({
      start: { x: margin, y: curY },
      end: { x: width - margin, y: curY },
      thickness: 0.8,
      color: primaryBlue,
    });
    curY -= 12;
  };

  // 1. Professional Summary
  drawSectionTitle('Professional Summary');
  const summaryLines = [
    'Results-driven Full Stack Engineer and Google Cloud Certified Professional with proven expertise in building modern, scalable',
    'web applications. Skilled in React, Next.js, Node.js, TypeScript, PostgreSQL, and cloud deployments. Strong foundation in',
    'production web architectures, responsive front-end engineering, and API integration.',
  ];
  for (const line of summaryLines) {
    page.drawText(line, {
      x: margin,
      y: curY,
      size: 8.5,
      font: fontRegular,
      color: textDark,
    });
    curY -= 12;
  }

  // 2. Experience
  drawSectionTitle('Work Experience');

  // Job 1: Belvo
  page.drawText('Web Developer Intern', {
    x: margin,
    y: curY,
    size: 10,
    font: fontBold,
    color: textDark,
  });
  page.drawText('June 2026 – Sep 2026', {
    x: width - margin - 100,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });
  curY -= 13;
  page.drawText('Belvo Company — Mumbai, India (Remote)', {
    x: margin,
    y: curY,
    size: 8.5,
    font: fontOblique,
    color: textMuted,
  });
  curY -= 12;

  const expBullets = [
    'Engineered modern, responsive front-end web interfaces using React, Next.js, and TypeScript.',
    'Implemented client-side performance optimizations, achieving high responsiveness and smooth interactive UX.',
    'Collaborated directly with lead engineers on technical debugging, cross-browser compatibility, and code quality.',
    'Earned an official commendation Letter of Recommendation (LOR) from CEO Hrishikesh Mishra for excellence.',
  ];

  for (const b of expBullets) {
    page.drawText('•', { x: margin + 6, y: curY, size: 8, font: fontRegular, color: primaryBlue });
    page.drawText(b, { x: margin + 16, y: curY, size: 8.5, font: fontRegular, color: textDark });
    curY -= 12;
  }

  // 3. Technical Skills
  drawSectionTitle('Technical Skills & Expertise');
  const skills = [
    ['Frontend:', 'React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Framer Motion, HTML5, CSS3'],
    ['Backend & DB:', 'Node.js, Express, PostgreSQL, Cloud SQL, Supabase, Firebase Firestore, REST APIs'],
    ['Cloud & DevOps:', 'Google Cloud Platform (GCP), Cloud Run, Docker, Git, GitHub Actions, Vercel, Linux'],
    ['Practices:', 'Responsive UI/UX, Performance Optimization, Clean Architecture, CI/CD, Agile'],
  ];

  for (const [category, items] of skills) {
    page.drawText(category, { x: margin, y: curY, size: 8.5, font: fontBold, color: textDark });
    page.drawText(items, { x: margin + 85, y: curY, size: 8.5, font: fontRegular, color: textDark });
    curY -= 13;
  }

  // 4. Certifications & Badges
  drawSectionTitle('Certifications & Credentials');
  page.drawText('Google Cloud Certified — Professional Cloud Architect', {
    x: margin,
    y: curY,
    size: 9,
    font: fontBold,
    color: textDark,
  });
  page.drawText('Issued Sep 2023 | Google Cloud', {
    x: width - margin - 150,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });
  curY -= 12;
  page.drawText('• Demonstrated ability to design robust, secure, scalable, and highly available Google Cloud architectures.', {
    x: margin + 8,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textDark,
  });
  curY -= 14;

  page.drawText('Letter of Recommendation (LOR) — Web Development', {
    x: margin,
    y: curY,
    size: 9,
    font: fontBold,
    color: textDark,
  });
  page.drawText('Issued 22-09-2026 | Belvo Company', {
    x: width - margin - 165,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });
  curY -= 12;
  page.drawText('• Verified commendation by CEO Hrishikesh Mishra for outstanding web development and dedication.', {
    x: margin + 8,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textDark,
  });
  curY -= 14;

  // 5. Education
  drawSectionTitle('Education');
  page.drawText('Bachelor of Technology (B.Tech) in Computer Science & Engineering', {
    x: margin,
    y: curY,
    size: 9.5,
    font: fontBold,
    color: textDark,
  });
  page.drawText('Graduation: 2026', {
    x: width - margin - 85,
    y: curY,
    size: 8.5,
    font: fontRegular,
    color: textMuted,
  });
  curY -= 12;
  page.drawText('Telangana, India', {
    x: margin,
    y: curY,
    size: 8.5,
    font: fontOblique,
    color: textMuted,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve('./public/resume.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('Resume PDF generated at:', outputPath);
}

generateResumePdf().catch(console.error);
