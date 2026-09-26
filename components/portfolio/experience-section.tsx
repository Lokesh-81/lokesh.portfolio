'use client';

import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  ScrollText,
  FileCheck2,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { TextEffect } from '@/components/core/text-effect';
import { Spotlight } from '@/components/core/spotlight';
import { usePortfolio } from '@/lib/portfolio-context';
import { useLanguage } from '@/i18n';
import { BelvoLorModal } from '@/components/portfolio/belvo-lor-modal';

const experienceTranslations: Record<
  string,
  Record<
    string,
    {
      company?: string;
      role?: string;
      period?: string;
      location?: string;
      description?: string;
      responsibilities?: string[];
    }
  >
> = {
  te: {
    belvo: {
      company: 'BELVO',
      role: 'వెబ్ డెవలప్‌మెంట్ ఇంటర్న్ & లీడ్',
      period: 'జూన్ 2026 – సెప్టెంబర్ 2026',
      location: 'రిమోట్',
      description:
        'స్కేలబుల్ డిజిటల్ వ్యాపార ప్లాట్‌ఫారమ్‌లు మరియు హెల్త్‌కేర్ వర్క్‌ఫ్లో ఇంజిన్‌ల నిర్మాణం (నైవేద్యతో సహా), ఫ్రంటెండ్ ఆర్కిటెక్చర్ మరియు Supabaseతో రోగుల ప్రమాణీకరణ వ్యవస్థలు.',
      responsibilities: [
        'స్ప్రింట్ ప్లానింగ్, మాడ్యులర్ డిజైన్ సిస్టమ్స్ మరియు కోడ్ నాణ్యతా ప్రమాణాలలో ఫ్రంటెండ్ బృందానికి నాయకత్వం',
        'సురక్షిత OTP-ఆధారిత పేషెంట్ అథెంటికేషన్ మరియు అడ్మినిస్ట్రేటివ్ డ్యాష్‌బోర్డుల అమలు',
        'React, TypeScript మరియు Tailwind CSS ఉపయోగించి పునర్వినియోగ UI కాంపోనెంట్‌ల రూపకల్పన',
        'నిజ-సమయ డేటా పర్సిస్టెన్స్ మరియు RBAC యాక్సెస్ కంట్రోల్ కోసం Supabase మరియు REST APIల అనుసంధానం',
        'Vercel ఎడ్జ్ నెట్‌వర్క్‌లలో ప్రొడక్షన్ బిల్డ్ పనితీరు ఆప్టిమైజేషన్',
      ],
    },
    'google-ambassador': {
      company: 'గూగుల్ స్టూడెంట్ అంబాసిడర్ ప్రోగ్రామ్',
      role: 'గూగుల్ స్టూడెంట్ అంబాసిడర్',
      period: '2025',
      location: 'హైదరాబాద్ / రిమోట్',
      description:
        'జెమిని AI మరియు జెనరేటివ్ టూల్స్‌పై విద్యార్థి సమాజానికి వర్క్‌షాప్‌లు మరియు హ్యాండ్స్-ఆన్ సెషన్‌లను నిర్వహించడం.',
      responsibilities: [
        'Gemini AI APIలు మరియు GenAI అప్లికేషన్లపై సాంకేతిక వర్క్‌షాప్‌ల నిర్వహణ',
        'డెవలపర్ హ్యాకథాన్‌లు మరియు AI నైపుణ్య సెషన్ల ద్వారా విద్యార్థి సంఘం అభివృద్ధి',
        'నిజ జీవిత సాఫ్ట్‌వేర్ అప్లికేషన్ల నిర్మాణంలో సహచర విద్యార్థులకు మార్గదర్శకత్వం',
      ],
    },
  },
  hi: {
    belvo: {
      company: 'BELVO',
      role: 'वेब डेवलपमेंट इंटर्न एवं लीड',
      period: 'जून 2026 – सितंबर 2026',
      location: 'रिमोट',
      description:
        'स्केलेबल डिजिटल बिजनेस प्लेटफॉर्म और हेल्थकेयर वर्कफ़्लो इंजन का निर्माण (नैवेद्य सहित), फ्रंटएंड आर्किटेक्चर और Supabase के साथ मरीज प्रमाणीकरण प्रणाली।',
      responsibilities: [
        'स्प्रिंट योजना, मॉड्यूलर डिजाइन सिस्टम और कोड गुणवत्ता मानकों में फ्रंटएंड टीम का नेतृत्व',
        'सुरक्षित OTP-आधारित रोगी प्रमाणीकरण और प्रशासनिक वर्कफ़्लो डैशबोर्ड का कार्यान्वयन',
        'React, TypeScript और Tailwind CSS का उपयोग करके पुन: प्रयोज्य UI घटकों का निर्माण',
        'रीयल-टाइम डेटा दृढ़ता और RBAC एक्सेस नियंत्रण के लिए Supabase और REST API का एकीकरण',
        'Vercel एज नेटवर्क पर प्रोडक्शन बिल्ड प्रदर्शन अनुकूलन',
      ],
    },
    'google-ambassador': {
      company: 'गूगल स्टूडेंट एंबेसडर प्रोग्राम',
      role: 'गूगल स्टूडेंट एंबेसडर',
      period: '2025',
      location: 'हैदराबाद / रिमोट',
      description:
        'डेवलपर समुदाय का प्रतिनिधित्व, जेमिनी AI और जनरेटिव टूल्स पर व्यावहारिक कार्यशालाओं का आयोजन।',
      responsibilities: [
        'Gemini AI API, प्रॉम्प्ट इंजीनियरिंग और GenAI पर तकनीकी कार्यशालाओं का संचालन',
        'AI साक्षरता सत्रों और डेवलपर हैकाथॉन के माध्यम से छात्र समुदाय का विकास',
        'वास्तविक सॉफ्टवेयर अनुप्रयोगों के निर्माण में साथी छात्रों का मार्गदर्शन',
      ],
    },
  },
  es: {
    belvo: {
      company: 'BELVO',
      role: 'Pasante de Desarrollo Web y Líder',
      period: 'Junio 2026 – Septiembre 2026',
      location: 'Remoto',
      description:
        'Diseño de plataformas digitales empresariales y flujos de trabajo de salud (incluido Naivaidya), liderazgo de arquitectura frontend y autenticación con Supabase.',
      responsibilities: [
        'Liderazgo del equipo frontend en planificación de sprints y sistemas de diseño modulares',
        'Implementación de autenticación segura de pacientes mediante OTP y paneles de control',
        'Arquitectura de aplicaciones web full-stack con React, TypeScript y Tailwind CSS',
        'Integración de Supabase y APIs REST para persistencia en tiempo real y control RBAC',
        'Optimización del rendimiento de compilación de producción en Vercel Edge Networks',
      ],
    },
    'google-ambassador': {
      company: 'Programa de Embajadores Estudiantiles de Google',
      role: 'Embajador Estudiantil de Google',
      period: '2025',
      location: 'Hyderabad / Remoto',
      description:
        'Representación de ecosistemas de desarrolladores, organización de talleres sobre Gemini AI y herramientas generativas.',
      responsibilities: [
        'Talleres técnicos prácticos centrados en APIs de Gemini AI e ingeniería de prompts',
        'Fomento del crecimiento de la comunidad estudiantil a través de hackathons colaborativos',
        'Tutoría de compañeros en el desarrollo de software real y buenas prácticas de ingeniería',
      ],
    },
  },
  fr: {
    belvo: {
      company: 'BELVO',
      role: 'Stagiaire Développeur Web & Lead',
      period: 'Juin 2026 – Septembre 2026',
      location: 'À distance',
      description:
        'Conception de plateformes numériques d’entreprise et de moteurs de flux cliniques (notamment Naivaidya), direction de l’architecture frontend, flux d’authentification des patients avec Supabase et systèmes web réactifs.',
      responsibilities: [
        'Direction de l’équipe de développement frontend sur la planification des sprints et les systèmes de conception modulaires',
        'Implémentation de l’authentification sécurisée des patients par OTP et tableaux de bord d’administration',
        'Architecture d’applications web full-stack et de composants réutilisables avec React, TypeScript et Tailwind CSS',
        'Intégration de Supabase et d’API REST pour la persistance temps réel et le contrôle d’accès RBAC',
        'Optimisation des performances de build en production sur les réseaux périphériques Vercel',
      ],
    },
    'google-ambassador': {
      company: 'Programme des Ambassadeurs Étudiants Google',
      role: 'Ambassadeur Étudiant Google',
      period: '2025',
      location: 'Hyderabad / À distance',
      description:
        'Direction de programmes d’apprentissage cloud, organisation de Cloud Study Jams et accompagnement des pairs vers l’adoption de Gemini AI.',
      responsibilities: [
        'Organisation et animation d’ateliers techniques sur l’API Gemini AI et l’ingénierie de prompts',
        'Promotion des technologies IA et des pratiques logicielles au sein de la communauté étudiante',
        'Mentorat d’étudiants pour concevoir des applications concrètes et adopter les meilleures pratiques logicielles',
      ],
    },
  },
  de: {
    belvo: {
      company: 'BELVO',
      role: 'Webentwicklungs-Praktikant & Lead',
      period: 'Juni 2026 – September 2026',
      location: 'Remote',
      description:
        'Entwicklung skalierbarer digitaler Plattformen und Healthcare-Engines (einschließlich Naivaidya), Leitung der Frontend-Architektur und Supabase-Authentifizierung.',
      responsibilities: [
        'Leitung des Frontend-Entwicklungsteams bei Sprint-Planung und modularen Designsystemen',
        'Implementierung sicherer OTP-basierter Authentifizierung und Administrations-Dashboards',
        'Architektur von Full-Stack-Webanwendungen mit React, TypeScript und Tailwind CSS',
        'Integration von Supabase und REST-APIs für Echtzeit-Datenpersistenz und RBAC-Zugriffskontrolle',
        'Optimierung der Produktions-Build-Performance in Vercel-Edge-Netzwerken',
      ],
    },
    'google-ambassador': {
      company: 'Google Student Ambassador Program',
      role: 'Google Student Ambassador',
      period: '2025',
      location: 'Hyderabad / Remote',
      description:
        'Vertretung von Entwickler-Communitys, Organisation technischer Workshops rund um Gemini AI und generative Tools.',
      responsibilities: [
        'Praktische technische Workshops zu Gemini AI APIs und Prompt Engineering',
        'Förderung der Community durch KI-Schulungen und Entwickler-Hackathons',
        'Mentoring von Studierenden bei der Erstellung produktionsreifer Software',
      ],
    },
  },
  ja: {
    belvo: {
      company: 'BELVO',
      role: 'Web開発インターン ＆ リード',
      period: '2026年6月 – 2026年9月',
      location: 'リモート',
      description:
        'スケーラブルなデジタルビジネスプラットフォームおよび医療ワークフローエンジン（Naivaidya含む）の設計、フロントエンドアーキテクチャおよびSupabaseによる認証の実装。',
      responsibilities: [
        'スプリント計画、モジュール式デザインシステムにおけるフロントエンドチームの主導',
        '安全なOTPベースの患者認証および管理ダッシュボードの実装',
        'React、TypeScript、Tailwind CSSを使用したフルスタックWebアプリの設計',
        'リアルタイムデータ永続化とRBACアクセス制御のためのSupabaseおよびREST API統合',
        'Vercelエッジネットワーク上でのビルドパフォーマンスの最適化',
      ],
    },
    'google-ambassador': {
      company: 'Google 学生アンバサダー プログラム',
      role: 'Google 学生アンバサダー',
      period: '2025年',
      location: 'ハイデラバード / リモート',
      description:
        '学生コミュニティを牽引し、Gemini AIおよび生成AIツールに関する技術ワークショップを企画・運営。',
      responsibilities: [
        'Gemini AI APIおよびプロンプトエンジニアリングに関する実践的な技術ワークショップの開催',
        '開発者ハッカソンやAIセッションを通じたコミュニティの活性化',
        '実用的なソフトウェア開発における学生仲間へのメンター活動',
      ],
    },
  },
};

export interface ExperienceSectionProps {
  onNavigate?: (section: string) => void;
}

export function ExperienceSection({ onNavigate }: ExperienceSectionProps = {}) {
  const { experiences } = usePortfolio();
  const { t, language } = useLanguage();
  const [isLorModalOpen, setIsLorModalOpen] = useState(false);

  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 py-8 sm:py-12">
      {/* Spotlight on Experience Section */}
      <Spotlight
        className="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.22)_0%,rgba(192,132,252,0.12)_40%,transparent_70%)] blur-2xl pointer-events-none"
        size={450}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Header with TextEffect */}
        <div className="flex flex-col justify-between gap-4 border-b border-[#1F2937] pb-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[#60A5FA] font-semibold">
              <TextEffect key={`tag-${language}`} per="char" delay={0.05}>
                {t('experience.tag')}
              </TextEffect>
            </div>
            <h2 className="mt-1 text-3xl font-light tracking-tight text-[#E0E7FF] sm:text-5xl md:text-6xl">
              <TextEffect key={`title-${language}`} per="word" delay={0.15}>
                {t('experience.title')}
              </TextEffect>{' '}
              <span className="instrument italic font-normal text-[#60A5FA]">
                {t('experience.titleAccent')}
              </span>
            </h2>
          </div>
          <div className="max-w-md text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
            <TextEffect key={`sub-${language}`} per="word" delay={0.25}>
              {t('experience.subtitle')}
            </TextEffect>
          </div>
        </div>

        {/* Quick Navigation / Counter Pill */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1F2937] bg-[#111827]/80 px-3.5 py-1.5 text-xs text-[#CBD5E1]">
            <ScrollText className="h-3.5 w-3.5 text-[#60A5FA]" />
            <span>Work History ({experiences.length})</span>
          </div>
        </div>

        {/* Timeline List */}
        <div id="experience-timeline" className="mt-8 space-y-6 pb-12">
          {experiences.map((exp) => {
            const tr = experienceTranslations[language]?.[exp.id];
            const company = tr?.company || exp.company;
            const role = tr?.role || exp.role;
            const period = tr?.period || exp.period;
            const location = tr?.location || exp.location;
            const description = tr?.description || exp.description;
            const responsibilities = tr?.responsibilities || exp.responsibilities;

            return (
              <div
                key={exp.id}
                className="group relative rounded-2xl border border-[#1F2937] bg-[#111827]/90 p-6 sm:p-7 shadow-xs transition-all hover:border-[#60A5FA] hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#1F2937] pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#60A5FA] font-semibold">
                      {company}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#E0E7FF] mt-0.5">
                      {role}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#CBD5E1]">
                    <span className="flex items-center gap-1 font-mono rounded-full bg-[#0B132B] px-3 py-1 border border-[#1F2937] text-[#A5B4FC]">
                      <Calendar className="h-3 w-3 text-[#60A5FA]" />
                      {period}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-[#0B132B] px-3 py-1 border border-[#1F2937] text-[#CBD5E1]">
                      <MapPin className="h-3 w-3 text-[#A5B4FC]/80" />
                      {location}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#CBD5E1]">
                  {description}
                </p>

                {responsibilities && responsibilities.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]/70">
                      {t('experience.highlights')}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                      {responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60A5FA]" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-[#1F2937] pt-4">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-[#1F2937] bg-[#1F2937]/70 px-2.5 py-0.5 font-mono text-[11px] text-[#E0E7FF]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Special Belvo Letter of Recommendation (LOR) Showcase Box */}
                {exp.id === 'belvo' && (
                  <div className="mt-6 rounded-2xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 via-[#111827] to-indigo-950/30 p-5 shadow-lg backdrop-blur-md relative overflow-hidden group/lor">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-purple-500/10 to-transparent pointer-events-none" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                      <div className="flex items-start gap-3.5">
                        <div className="h-12 w-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0 text-purple-300 shadow-inner">
                          <FileCheck2 className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                              <span>Official Letter of Recommendation (LOR)</span>
                              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
                              <ShieldCheck className="h-3 w-3" />
                              Issued by CEO
                            </span>
                          </div>
                          <p className="text-xs text-[#CBD5E1] mt-1 leading-snug">
                            Issued by <strong className="text-white">Hrishikesh Mishra</strong>, CEO of Belvo Company · Goregaon, Mumbai · Dated 22-09-2026
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setIsLorModalOpen(true)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                          title="View authentic Belvo Company Letter of Recommendation"
                        >
                          <FileText className="h-4 w-4" />
                          <span>View Official LOR (PDF)</span>
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-purple-500/20 text-xs text-[#CBD5E1] leading-relaxed italic bg-purple-950/20 rounded-xl p-3 border border-purple-500/10">
                      &ldquo;It is my pleasure to recommend you for successfully completing a 3-month internship as a Web Developer at Belvo. During the internship, Poosala Lokesh demonstrated a strong willingness to learn and actively participated in web development activities... Poosala Lokesh contributed to assigned projects and responsibilities while working with the development team. They showed dedication, adaptability, and a professional attitude while completing assigned tasks and meeting project requirements.&rdquo;
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Belvo Letter of Recommendation Viewer Modal */}
      <BelvoLorModal isOpen={isLorModalOpen} onClose={() => setIsLorModalOpen(false)} />
    </div>
  );
}

export default ExperienceSection;
