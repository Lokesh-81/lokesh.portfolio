-- ==============================================================================
-- LOKESH PERSONAL PORTFOLIO - INITIAL AUTHENTIC SEED DATA
-- ==============================================================================

-- Profiles Seed
INSERT INTO public.profiles (
  id, name, display_name, title, short_bio, about_hero, about_description, about_sub_description,
  location, graduation_year, education, recognition, languages, photo_url, email, phone, availability
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Poosala Lokesh',
  'Poosala Lokesh',
  'Full Stack Developer / AI Enthusiast',
  'Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India. Focused on pristine craft, type safety, and real-world execution.',
  'Curious by nature.',
  'I''m Poosala Lokesh, a Full Stack Developer and Computer Science student based in Hyderabad, India, driven by the craft of building resilient web products and AI integrations.',
  'I work across the entire software development lifecycle—from responsive, accessible user interfaces and design systems to scalable backend APIs, database schemas, cloud deployments, and AI pipelines.',
  'Hyderabad, India',
  '2027',
  'B.Sc. MSCS · 2027',
  'Google Cloud Certified Professional Cloud Architect · Google Student Ambassador',
  '["Telugu", "English", "Hindi", "French"]'::jsonb,
  '',
  'poosala15@gmail.com',
  '+91 8885674172',
  'Available for Summer 2026 Internships & High-Impact Roles'
) ON CONFLICT (id) DO NOTHING;

-- Hero Settings Seed
INSERT INTO public.hero_settings (
  id, greeting, name, headline, bio, im_a, rotating_words, cta_work, cta_contact,
  availability_badge, show_availability, featured_credential_title, featured_credential_date, featured_credential_link
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Hello, I am',
  'Poosala Lokesh.',
  'Full Stack Developer / AI Enthusiast',
  'Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India. Focused on pristine craft, type safety, and real-world execution.',
  'I''m a',
  '["Full Stack Developer", "Google Cloud Architect", "AI Engineer", "Creative Problem Solver"]'::jsonb,
  'Selected Works',
  'Get in Touch',
  'Available for Summer 2026 Internships & High-Impact Roles',
  true,
  'Google Cloud Certified Professional Cloud Architect',
  'Sep 2026',
  'certifications'
) ON CONFLICT (id) DO NOTHING;

-- About Settings Seed
INSERT INTO public.about_settings (
  id, tag, title, title_accent, intro_greeting, intro_suffix, intro_goal, sub_description,
  verified_profiles, highlights
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'BACKGROUND & PHILOSOPHY',
  'Curious',
  'by nature.',
  'I''m',
  'a Full Stack Developer and Computer Science student based in',
  'driven by the craft of building resilient web products and AI integrations.',
  'I work across the entire software development lifecycle—from responsive, accessible user interfaces and design systems to scalable backend APIs, database schemas, cloud deployments, and AI pipelines.',
  '[{"handle": "Lokesh-81", "url": "https://github.com/Lokesh-81", "label": "Primary GitHub"}, {"handle": "lokeshnaivaidya-max", "url": "https://github.com/lokeshnaivaidya-max", "label": "Professional / Organization GitHub"}]'::jsonb,
  '[{"title": "Degree", "subtitle": "B.Sc. MSCS (2024–2027)"}, {"title": "Location", "subtitle": "Hyderabad, India"}, {"title": "Accreditation", "subtitle": "Google Cloud Certified PCA"}, {"title": "Leadership", "subtitle": "Google Student Ambassador"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Educations Seed
INSERT INTO public.educations (
  id, institution, degree, field_of_study, start_year, end_year, grade, description, location, institution_url, display_order, is_published
) VALUES (
  'edu-1',
  'Aurora''s Degree & PG College (Osmania University)',
  'Bachelor of Science (B.Sc.)',
  'Mathematics, Statistics, Computer Science (MSCS)',
  '2024',
  '2027',
  'First Class Distinction',
  'Rigorous coursework in computational statistics, discrete mathematics, algorithmic optimization, data structures, and database systems.',
  'Hyderabad, India',
  'https://aurora.edu.in',
  0,
  true
) ON CONFLICT (id) DO NOTHING;

-- Experiences Seed
INSERT INTO public.experiences (
  id, company, role, period, start_date, end_date, is_current, location, type, description, responsibilities, technologies, link, display_order, is_featured, is_published
) VALUES
(
  'belvo',
  'BELVO',
  'Web Development Intern',
  'June 2026 – September 2026',
  'June 2026',
  'September 2026',
  false,
  'Remote',
  'Web Development Internship',
  'Engineered scalable digital business platforms and healthcare workflow engines (including Naivaidya), leading frontend architecture, patient authentication flows with Supabase, and responsive web systems.',
  '["Led the frontend development team across sprint planning, modular design systems, and code quality standards", "Implemented secure OTP-based patient authentication and administrative workflow management dashboards", "Architected full-stack web applications and reusable UI components using React, TypeScript, and Tailwind CSS", "Integrated Supabase and RESTful APIs for real-time data persistence, query optimization, and RBAC access control", "Optimized production build performance and delivery latency"]'::jsonb,
  '["React", "TypeScript", "Tailwind CSS", "Supabase", "Node.js", "REST APIs", "Vite"]'::jsonb,
  '',
  0,
  true,
  true
),
(
  'google-ambassador',
  'Google Student Ambassador Program',
  'Google Student Ambassador',
  '2025 – 2026',
  '2025',
  '2026',
  false,
  'Remote',
  'Community & Tech Leadership',
  'Represented developer ecosystems and the student community, organizing technical workshops and driving engagement and hands-on literacy around Gemini AI and generative tools.',
  '["Conducted hands-on technical workshops focused on Gemini AI APIs, prompt engineering, and GenAI applications", "Fostered student community growth through AI literacy sessions and collaborative developer hackathons", "Mentored peers in building real-world software applications and adopting best engineering practices"]'::jsonb,
  '["Gemini AI", "Technical Workshops", "Student Community", "AI Literacy", "GenAI"]'::jsonb,
  '',
  1,
  true,
  true
) ON CONFLICT (id) DO NOTHING;

-- Projects Seed
INSERT INTO public.projects (
  id, number, name, category, tagline, short_description, description, what_i_worked_on, technologies, status, live_url, github_url, year, accent_color, gradient, is_featured, is_published, display_order
) VALUES
(
  'lumora-ai',
  '01',
  'Lumora AI',
  'AI & FinTech Platform',
  'AI-driven financial intelligence & investment research engine',
  'An intelligent investment research platform leveraging modern LLMs for market synthesis.',
  'An intelligent investment research platform leveraging modern LLMs to extract insights from financial reports, synthesize market trends, and deliver actionable executive summaries.',
  '["Integrated Gemini AI API for contextual financial document synthesis", "Built resilient caching and fast retrieval workflows using MongoDB and Redis", "Designed clean financial charts and high-density analytical dashboards", "Implemented streaming AI response components with Markdown and citation support"]'::jsonb,
  '["Next.js", "TypeScript", "Gemini AI API", "MongoDB", "Redis", "Tailwind CSS"]'::jsonb,
  'Live',
  'https://www.lumoraai.in/',
  'https://github.com/Lokesh-81',
  '2026',
  '#ec4899',
  'from-pink-900/40 via-rose-950/20 to-black/60',
  true,
  true,
  0
),
(
  'belvo',
  '02',
  'Belvo',
  'Business & Startup Platform',
  'Modern business operations & digital client onboarding platform',
  'A high-performance business and startup platform designed to streamline client interaction.',
  'A high-performance business and startup platform designed to streamline client interaction, present service solutions, and provide a polished digital touchpoint for modern enterprise needs.',
  '["Engineered responsive full-stack frontend architecture using React, Vite, and Tailwind CSS", "Designed and implemented modular, reusable UI components for seamless service presentation", "Integrated secure client communication channels and structured API request handling", "Optimized production build performance, reducing initial load latency"]'::jsonb,
  '["React", "Vite", "Tailwind CSS", "Node.js", "REST APIs"]'::jsonb,
  'Live',
  'https://www.belvo.buzz/',
  'https://github.com/Lokesh-81',
  '2026',
  '#a78bfa',
  'from-purple-900/40 via-violet-950/20 to-black/60',
  true,
  true,
  1
),
(
  'indira-thakur-photography',
  '03',
  'Indira Thakur Photography',
  'Photography & Creative Showcase',
  'Editorial photography showcase & artistic client gallery',
  'A visual-first creative portfolio engineered for high-resolution visual storytelling.',
  'A visual-first creative portfolio engineered for high-resolution visual storytelling, featuring fluid masonry layouts, editorial lightbox experiences, and client booking inquiry flows.',
  '["Engineered fluid masonry image galleries with adaptive layout recalculations", "Implemented responsive image optimization and lazy-loading for heavy media assets", "Designed seamless full-screen photo inspection and modal transitions", "Integrated direct photoshoot booking and consultation inquiry forms"]'::jsonb,
  '["React", "Vite", "Tailwind CSS", "Framer Motion", "Cloudinary CDN"]'::jsonb,
  'Live',
  'https://www.indirathakur.com/',
  'https://github.com/Lokesh-81',
  '2025',
  '#c084fc',
  'from-fuchsia-900/40 via-purple-950/20 to-black/60',
  true,
  true,
  2
),
(
  'jv-ed-tech',
  '04',
  'JV EdTech',
  'Education & EdTech Portal',
  'Interactive digital learning portal & student course manager',
  'An educational platform built to facilitate structured digital courses and learning modules.',
  'An educational platform built to facilitate structured digital courses, interactive student learning modules, progress tracking, and assessment evaluation.',
  '["Developed structured course exploration and modular lesson player interfaces", "Implemented client-side progress tracking and module completion persistence", "Engineered interactive assessment quizzes with instant scoring and feedback", "Structured scalable PostgreSQL / Supabase schemas for course materials and users"]'::jsonb,
  '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase / PostgreSQL"]'::jsonb,
  'Live',
  'https://jv-ed-tech.vercel.app/',
  'https://github.com/Lokesh-81',
  '2025',
  '#60a5fa',
  'from-blue-900/40 via-indigo-950/20 to-black/60',
  true,
  true,
  3
),
(
  'naivaidya',
  '05',
  'Naivaidya',
  'Healthcare & Technology',
  'Healthcare portal & patient management workflow engine',
  'A comprehensive digital healthcare management platform facilitating patient coordination.',
  'A comprehensive digital healthcare management platform facilitating patient coordination, appointment authentication, and administrative hospital workflows with high reliability.',
  '["Served as Frontend Developer and Team Lead, directing UI architecture and sprint deliverables", "Implemented secure OTP-based authentication and user verification flows", "Engineered comprehensive administrative dashboards for patient records and scheduling", "Integrated Supabase backend services for real-time data persistence and query optimization"]'::jsonb,
  '["React", "Supabase", "Tailwind CSS", "OTP Auth", "REST APIs"]'::jsonb,
  'Live',
  'https://naivaidya-naivaidya.vercel.app/',
  'https://github.com/lokeshnaivaidya-max',
  '2025 - 2026',
  '#38bdf8',
  'from-sky-900/40 via-blue-950/20 to-black/60',
  true,
  true,
  4
),
(
  'antara-global',
  '06',
  'Antara Global',
  'Corporate & Global Commerce',
  'Enterprise international business & corporate trade portal',
  'An enterprise-scale corporate platform designed for global commerce and international trade.',
  'An enterprise-scale corporate platform designed for global commerce and international trade representation, delivering high-trust corporate storytelling and global inquiry workflows.',
  '["Built modern editorial pages with Next.js App Router and server-rendered optimizations", "Crafted smooth scroll-driven micro-interactions and transitions with Framer Motion", "Constructed multi-locale corporate inquiry forms and structured lead routing", "Executed comprehensive Core Web Vitals optimizations and semantic SEO metadata"]'::jsonb,
  '["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]'::jsonb,
  'Live',
  'https://anatara-global.vercel.app/',
  'https://github.com/Lokesh-81',
  '2025',
  '#f59e0b',
  'from-amber-900/40 via-orange-950/20 to-black/60',
  true,
  true,
  5
) ON CONFLICT (id) DO NOTHING;

-- Site Settings Seed
INSERT INTO public.site_settings (
  id, site_title, site_description, seo_title, seo_description, favicon_url, og_image_url, copyright_text, footer_text, availability_status
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'Poosala Lokesh | Full Stack Developer & GCP Cloud Architect',
  'Portfolio of Poosala Lokesh - Full Stack Developer, Google Cloud Certified Professional Cloud Architect & recipient of 37 Google Cloud Skill Badges based in Hyderabad, India.',
  'Poosala Lokesh Portfolio',
  'Engineering high-performance web applications, scalable digital platforms, and AI-powered products from Hyderabad, India.',
  '/icon.svg',
  '/icon.svg',
  '© 2026 Poosala Lokesh. Crafted with pride.',
  'Available for exciting full-stack engineering and cloud architecture challenges.',
  'Available for high-impact roles & internships'
) ON CONFLICT (id) DO NOTHING;

-- Testimonials Seed
INSERT INTO public.testimonials (id, name, role, company, testimonial, project_url, display_order, is_published)
VALUES (
  'test-foundarly',
  'Foundarly Business World Owner',
  'Founder & Business Owner',
  'Foundarly Business World',
  'Super fast execution and very satisfying results every single time! Lokesh is highly reliable, technically solid, and always ready to tackle any challenge on the website. A pleasure to work with!',
  'https://foundarlybusinessworld.in',
  0,
  true
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    company = EXCLUDED.company,
    testimonial = EXCLUDED.testimonial,
    project_url = EXCLUDED.project_url,
    is_published = true;
