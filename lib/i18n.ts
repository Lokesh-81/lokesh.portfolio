export type Language = 'en' | 'hi' | 'es' | 'te';

export const TRANSLATIONS: Record<Language, {
  name: string;
  nativeName: string;
  nav: {
    about: string;
    experience: string;
    certifications: string;
    projects: string;
    skills: string;
    resume: string;
    lor: string;
    contact: string;
    studio: string;
  };
  hero: {
    greeting: string;
    role: string;
    viewLor: string;
    viewResume: string;
    exploreWork: string;
    contactMe: string;
    availableBadge: string;
  };
  metrics: {
    exp: string;
    projects: string;
    sla: string;
    certs: string;
  };
  sections: {
    aboutTitle: string;
    aboutSubtitle: string;
    experienceTitle: string;
    experienceSubtitle: string;
    certsTitle: string;
    certsSubtitle: string;
    projectsTitle: string;
    projectsSubtitle: string;
    skillsTitle: string;
    skillsSubtitle: string;
    resumeTitle: string;
    resumeSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
  actions: {
    copyText: string;
    copied: string;
    downloadPdf: string;
    print: string;
    verifyCredential: string;
    viewFullLor: string;
    loginToStudio: string;
    sendMessage: string;
    sending: string;
    sentSuccess: string;
  };
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    nav: {
      about: 'About',
      experience: 'Experience',
      certifications: 'Cloud Certs',
      projects: 'Projects',
      skills: 'Skills',
      resume: 'ATS Resume',
      lor: 'Belvo LOR',
      contact: 'Contact',
      studio: 'Developer Studio',
    },
    hero: {
      greeting: "Hello, I'm",
      role: 'Senior Full Stack & Cloud Architect',
      viewLor: 'View Belvo LOR',
      viewResume: 'ATS Resume',
      exploreWork: 'Explore Projects',
      contactMe: 'Get In Touch',
      availableBadge: 'Open for Senior / Staff / Cloud Roles',
    },
    metrics: {
      exp: 'Production Experience',
      projects: 'Delivered Projects',
      sla: 'System Availability SLA',
      certs: 'Google Cloud Certified',
    },
    sections: {
      aboutTitle: 'Architectural Philosophy & Bio',
      aboutSubtitle: 'Engineering high-throughput cloud architectures and responsive modern user experiences.',
      experienceTitle: 'Work Experience & Timeline',
      experienceSubtitle: 'Proven execution at Belvo Company and global cloud consulting initiatives.',
      certsTitle: 'Google Cloud Certifications',
      certsSubtitle: 'Verified enterprise cloud architecture and production engineering credentials.',
      projectsTitle: 'Featured Engineered Systems',
      projectsSubtitle: 'Production-grade software architectures with live demos and technical breakdowns.',
      skillsTitle: 'Technical Taxonomy & Stack',
      skillsSubtitle: 'Deep competencies across frontend systems, cloud orchestration, and databases.',
      resumeTitle: 'Live ATS-Optimized Resume',
      resumeSubtitle: 'Standard A4 sheet format with one-click plain text ATS copying and vector download.',
      contactTitle: 'Initiate Contact & Inquiries',
      contactSubtitle: 'Reach out directly for senior roles, architecture consulting, or engineering collaboration.',
    },
    actions: {
      copyText: 'Copy Formatted Text (ATS)',
      copied: 'Copied to Clipboard!',
      downloadPdf: 'Download PDF Resume',
      print: 'Print Document',
      verifyCredential: 'Verify Credential',
      viewFullLor: 'Read Full Belvo Letter of Recommendation',
      loginToStudio: 'Studio Login',
      sendMessage: 'Send Message',
      sending: 'Transmitting...',
      sentSuccess: 'Message received! Lokesh will reply promptly.',
    },
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिंदी',
    nav: {
      about: 'परिचय',
      experience: 'अनुभव',
      certifications: 'क्लाउड प्रमाणन',
      projects: 'प्रोजेक्ट्स',
      skills: 'कौशल',
      resume: 'बायोडाटा (ATS)',
      lor: 'बेल्वो LOR',
      contact: 'संपर्क',
      studio: 'स्टूडियो CMS',
    },
    hero: {
      greeting: 'नमस्ते, मैं हूँ',
      role: 'सीनियर फुल स्टैक एवं क्लाउड आर्किटेक्ट',
      viewLor: 'बेल्वो LOR देखें',
      viewResume: 'ATS बायोडाटा',
      exploreWork: 'प्रोजेक्ट्स देखें',
      contactMe: 'संपर्क करें',
      availableBadge: 'सीनियर रोल्स हेतु उपलब्ध',
    },
    metrics: {
      exp: 'प्रोडक्शन अनुभव',
      projects: 'सफल प्रोजेक्ट्स',
      sla: 'सिस्टम अपटाइम',
      certs: 'गूगल क्लाउड प्रमाणित',
    },
    sections: {
      aboutTitle: 'वास्तुकला दर्शन एवं परिचय',
      aboutSubtitle: 'उच्च गति वाले क्लाउड आर्किटेक्चर एवं आधुनिक यूजर इंटरफेस का निर्माण।',
      experienceTitle: 'कार्य अनुभव एवं यात्रा',
      experienceSubtitle: 'बेल्वो कंपनी एवं वैश्विक क्लाउड परामर्श पहलों में सिद्ध नेतृत्व।',
      certsTitle: 'गूगल क्लाउड प्रमाणन',
      certsSubtitle: 'सत्यापित एंटरप्राइज क्लाउड आर्किटेक्ट प्रमाण-पत्र।',
      projectsTitle: 'विशेष इंजीनियरिंग प्रोजेक्ट्स',
      projectsSubtitle: 'लाइव डेमो एवं तकनीकी विवरणों के साथ सॉफ्टवेयर सिस्टम।',
      skillsTitle: 'तकनीकी कौशल',
      skillsSubtitle: 'फ्रंटएंड, क्लाउड ऑर्केस्ट्रेशन एवं डेटाबेस में गहन विशेषज्ञता।',
      resumeTitle: 'ATS-अनुकूलित बायोडाटा',
      resumeSubtitle: 'एक-क्लिक प्लेन टेक्स्ट कॉपी और पीडीएफ डाउनलोड के साथ।',
      contactTitle: 'संपर्क प्रारंभ करें',
      contactSubtitle: 'इंजीनियरिंग सहयोग या परामर्श हेतु सीधे संपर्क करें।',
    },
    actions: {
      copyText: 'फॉर्मेटेड टेक्स्ट कॉपी करें (ATS)',
      copied: 'क्लिपबोर्ड में कॉपी हो गया!',
      downloadPdf: 'पीडीएफ डाउनलोड करें',
      print: 'प्रिंट करें',
      verifyCredential: 'प्रमाणपत्र सत्यापित करें',
      viewFullLor: 'बेल्वो सिफारिश पत्र पढ़ें',
      loginToStudio: 'स्टूडियो लॉगिन',
      sendMessage: 'संदेश भेजें',
      sending: 'भेजा जा रहा है...',
      sentSuccess: 'संदेश प्राप्त हुआ! लोकेश शीघ्र उत्तर देंगे।',
    },
  },
  te: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    nav: {
      about: 'గురించి',
      experience: 'అనుభవం',
      certifications: 'క్లౌడ్ సర్టిఫికేట్లు',
      projects: 'ప్రాజెక్టులు',
      skills: 'నైపుణ్యాలు',
      resume: 'ATS రెజ్యూమ్',
      lor: 'బెల్వో LOR',
      contact: 'సంప్రదించండి',
      studio: 'స్టూడియో CMS',
    },
    hero: {
      greeting: 'నమస్కారం, నేను',
      role: 'సీనియర్ ఫుల్ స్టాక్ & క్లౌడ్ ఆర్కిటెక్ట్',
      viewLor: 'బెల్వో LOR చూడండి',
      viewResume: 'ATS రెజ్యూమ్',
      exploreWork: 'ప్రాజెక్టులు',
      contactMe: 'సంప్రదించండి',
      availableBadge: 'సీనియర్ ఉద్యోగాలకు అందుబాటులో ఉన్నారు',
    },
    metrics: {
      exp: 'ప్రొడక్షన్ అనుభవం',
      projects: 'పూర్తయిన ప్రాజెక్టులు',
      sla: 'సిస్టమ్ అప్‌టైమ్',
      certs: 'గూగుల్ క్లౌడ్ సర్టిఫైడ్',
    },
    sections: {
      aboutTitle: 'వ్యక్తిగత పరిచయం & సాంకేతిక దృక్పథం',
      aboutSubtitle: 'అత్యున్నత క్లౌడ్ ఆర్కిటెక్చర్ మరియు వేగవంతమైన యూజర్ ఇంటర్‌ఫేస్ ఇంజనీరింగ్.',
      experienceTitle: 'పని అనుభవం & టైమ్‌లైన్',
      experienceSubtitle: 'బెల్వో కంపెనీ మరియు గ్లోబల్ క్లౌడ్ ప్రాజెక్టులలో ఘనమైన అనుభవం.',
      certsTitle: 'గూగుల్ క్లౌడ్ సర్టిఫికేషన్లు',
      certsSubtitle: 'ధృవీకరించబడిన ఎంటర్‌ప్రైజ్ క్లౌడ్ ఆర్కిటెక్ట్ ఆధారాలు.',
      projectsTitle: 'ప్రధాన ఇంజనీరింగ్ ప్రాజెక్టులు',
      projectsSubtitle: 'లైవ్ డెమోలు మరియు సాంకేతిక వివరణలతో కూడిన ప్రాజెక్టులు.',
      skillsTitle: 'సాంకేతిక నైపుణ్యాలు',
      skillsSubtitle: 'ఫ్రంటెండ్, క్లౌడ్ మరియు డేటాబేస్ టెక్నాలజీలలో విస్తృత నైపుణ్యం.',
      resumeTitle: 'లైవ్ ATS రెజ్యూమ్',
      resumeSubtitle: 'సింగిల్ క్లిక్ కాపీ మరియు పీడీఎఫ్ డౌన్‌లోడ్ తో.',
      contactTitle: 'సంప్రదించండి',
      contactSubtitle: 'సీనియర్ రోల్స్ లేదా సాంకేతిక సలహాల కొరకు సంప్రదించండి.',
    },
    actions: {
      copyText: 'ఫార్మాట్ చేసిన టెక్స్ట్ కాపీ (ATS)',
      copied: 'కాపీ చేయబడింది!',
      downloadPdf: 'రెజ్యూమ్ డౌన్‌లోడ్',
      print: 'ప్రింట్',
      verifyCredential: 'సర్టిఫికేట్ ధృవీకరించు',
      viewFullLor: 'పూర్తి బెల్వో సిఫార్సు లేఖ చూడండి',
      loginToStudio: 'స్టూడియో లాగిన్',
      sendMessage: 'సందేశం పంపండి',
      sending: 'పంపుతున్నాము...',
      sentSuccess: 'సందేశం అందింది! లోకేష్ త్వరలో స్పందిస్తారు.',
    },
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    nav: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      certifications: 'Certificaciones Cloud',
      projects: 'Proyectos',
      skills: 'Habilidades',
      resume: 'CV ATS',
      lor: 'Carta Belvo (LOR)',
      contact: 'Contacto',
      studio: 'Studio CMS',
    },
    hero: {
      greeting: 'Hola, soy',
      role: 'Arquitecto Cloud & Full Stack Senior',
      viewLor: 'Ver Carta Belvo (LOR)',
      viewResume: 'Currículum ATS',
      exploreWork: 'Explorar Proyectos',
      contactMe: 'Contactar',
      availableBadge: 'Disponible para Roles Senior / Staff',
    },
    metrics: {
      exp: 'Años de Experiencia',
      projects: 'Proyectos Completados',
      sla: 'SLA de Disponibilidad',
      certs: 'Certificado Google Cloud',
    },
    sections: {
      aboutTitle: 'Filosofía y Biografía',
      aboutSubtitle: 'Ingeniería de sistemas en la nube de alto rendimiento e interfaces modernas.',
      experienceTitle: 'Trayectoria y Experiencia',
      experienceSubtitle: 'Liderazgo probado en Belvo Company y consultoría cloud internacional.',
      certsTitle: 'Certificaciones Google Cloud',
      certsSubtitle: 'Credenciales oficiales verificables de arquitecto de nube profesional.',
      projectsTitle: 'Proyectos Destacados',
      projectsSubtitle: 'Arquitecturas de nivel de producción con demostraciones en vivo.',
      skillsTitle: 'Taxonomía Técnica',
      skillsSubtitle: 'Dominio de frontend moderno, orquestación en la nube y bases de datos.',
      resumeTitle: 'Currículum Optimizado para ATS',
      resumeSubtitle: 'Formato A4 con copia de texto plano con un clic y descarga en PDF.',
      contactTitle: 'Contacto e Inversión',
      contactSubtitle: 'Contácteme para oportunidades senior o consultoría de arquitectura.',
    },
    actions: {
      copyText: 'Copiar Texto Formateado (ATS)',
      copied: '¡Copiado al Portapapeles!',
      downloadPdf: 'Descargar CV en PDF',
      print: 'Imprimir',
      verifyCredential: 'Verificar Credencial',
      viewFullLor: 'Leer Carta de Recomendación Belvo Completa',
      loginToStudio: 'Acceder a Studio',
      sendMessage: 'Enviar Mensaje',
      sending: 'Enviando...',
      sentSuccess: '¡Mensaje recibido! Lokesh responderá pronto.',
    },
  },
};
