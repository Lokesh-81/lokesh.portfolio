import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUp, ArrowUpRight, Download, Menu, NotebookPen, Sparkles, Star, X } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import './sketchbook.css';

const navigation = [
  ['about', 'About'], ['skills', 'Skills'], ['work', 'Work'],
  ['experience', 'Experience'], ['certifications', 'Badges'], ['resume', 'Résumé'], ['contact', 'Contact'],
];

const badges = [
  'Explore Generative AI in Agent Platform',
  'Analyze Images with the Cloud Vision API',
  'Develop AI-Powered Prototypes in Google AI Studio',
  'Build a Website on Google Cloud',
  'Create Your First Gemini Enterprise Application',
  'Store, Process, and Manage Data on Google Cloud – Console',
  'Using the Google Cloud Speech API',
  'Implement Speech and Language Solutions with Pre-trained APIs',
  'Configure Service Accounts and IAM Roles for Google Cloud',
  'The Basics of Google Cloud Compute',
];

const dates = [14, 14, 13, 13, 13, 13, 13, 11, 11, 11];

function Page({ id, number, label, title, description, children }: {
  id: string;
  number: number;
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="sk-page" aria-labelledby={id + '-title'}>
      <div className="sk-reveal">
        <p className="sk-label">{label}</p>
        <h2 id={id + '-title'}>{title}</h2>
        <p className="sk-description">{description}</p>
        {children}
      </div>
      <PageNumber number={number} />
    </section>
  );
}

function PageNumber({ number }: { number: number }) {
  return <div className="sk-page-number"><span>Poosala Lokesh / Creative Portfolio</span><span>{String(number).padStart(2, '0')} / 14</span></div>;
}

function Card({ tone, title, children }: { tone: string; title: string; children: ReactNode }) {
  return <article className={'sk-card sk-' + tone}><h3>{title}</h3>{children}</article>;
}

function BadgeList({ start }: { start: number }) {
  return (
    <ol className={'sk-badges ' + (start === 0 ? 'sk-badges-first' : 'sk-badges-second')} start={start + 1}>
      {badges.slice(start, start + 5).map((badge, index) => (
        <li key={badge}>
          <span aria-hidden="true">{String(start + index + 1).padStart(2, '0')}</span>
          <strong>{badge}</strong>
          <time dateTime={'2026-10-' + dates[start + index]}>Oct {dates[start + index]}</time>
        </li>
      ))}
    </ol>
  );
}

function ContactForm({ email }: { email: string }) {
  const [opened, setOpened] = useState(false);

  function openDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const entries = new FormData(event.currentTarget);
    const name = String(entries.get('name')).trim();
    const reply = String(entries.get('email')).trim();
    const message = String(entries.get('message')).trim();
    if (!name || !reply || !message) return;
    const subject = encodeURIComponent('Portfolio inquiry from ' + name);
    const body = encodeURIComponent(message + '\n\n' + name + '\n' + reply);
    window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
    setOpened(true);
  }

  return (
    <form className="sk-form sk-card sk-lilac" onSubmit={openDraft}>
      <label>Name<input name="name" autoComplete="name" placeholder="Your name" required maxLength={100} /></label>
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} /></label>
      <label>Message<textarea name="message" placeholder="What are you working on?" rows={3} required maxLength={1500} /></label>
      <button className="sk-button sk-button-dark" type="submit">Open email draft <ArrowUpRight size={18} /></button>
      {opened && <p role="status">Send the draft from your email app, or use the email address beside the form.</p>}
    </form>
  );
}

export function Sketchbook() {
  const { contact, social, activeResume } = usePortfolio();
  const book = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const email = contact?.email1 || 'poosala15@gmail.com';

  useEffect(() => {
    const root = book.current;
    if (!root) return;

    const reveal = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('sk-visible');
          reveal.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -6% 0px' });
    const sections = Array.from(root.querySelectorAll('section')).reverse();
    for (const node of root.querySelectorAll('.sk-reveal')) reveal.observe(node);

    const updateActive = () => {
      const current = sections.find((section) => section.getBoundingClientRect().top <= window.innerHeight * .4);
      const group = current?.id === 'cloud' || current?.id === 'ai' ? 'skills'
        : current?.id === 'microservices' || current?.id === 'apis' ? 'work'
        : current?.id === 'more-badges' ? 'certifications'
        : current?.id === 'closing' ? 'contact' : current?.id;
      setActive(group || 'home');
    };
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView();

    return () => {
      reveal.disconnect();
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, []);

  return (
    <div className="sk">
      <a className="sk-skip" href="#main">Skip to content</a>
      <header className="sk-header">
        <div className="sk-header-inner">
          <a className="sk-brand" href="#home" onClick={() => setMenuOpen(false)}><NotebookPen size={20} /> Lokesh<span>.</span></a>
          <button className="sk-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="sk-nav" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
          <nav id="sk-nav" className={menuOpen ? 'sk-nav sk-nav-open' : 'sk-nav'} aria-label="Portfolio">
            {navigation.map(([id, label]) => <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}</a>)}
          </nav>
        </div>
      </header>

      <main id="main" ref={book} tabIndex={-1}>
        <section className="sk-page sk-hero" id="home" aria-labelledby="sk-title">
          <div className="sk-hero-grid">
            <div className="sk-hero-copy">
              <h1 id="sk-title">Hi there,<br /><span>I’m Lokesh.</span></h1>
              <div className="sk-wave" aria-hidden="true" />
              <p className="sk-role">Full Stack Web Developer</p>
              <p className="sk-interests">Cloud tinkering <b>+</b> creative code <b>+</b> AI experiments</p>
              <div className="sk-actions">
                <a className="sk-button sk-button-dark" href="#work">Explore my work <ArrowDownRight size={18} /></a>
                <a className="sk-text-link" href="#about">Open sketchbook <ArrowDown size={16} /></a>
              </div>
            </div>
            <div className="sk-cover" aria-hidden="true">
              <div className="sk-orbit" /><div className="sk-orbit sk-orbit-second" />
              <Star className="sk-cover-star" strokeWidth={1.15} />
              <span className="sk-spiral">꩜</span>
              <span className="sk-label">Built with curiosity</span>
            </div>
          </div>
          <PageNumber number={1} />
        </section>

        <Page id="about" number={2} label="A little about me" title="A developer with a sketchbook." description="Designing, testing and learning, one useful build at a time.">
          <div className="sk-grid sk-two">
            <Card tone="pink" title="Who I am"><p>I’m Poosala Lokesh, a Full Stack Web Developer. I enjoy connecting visual interfaces with practical logic and experimenting with new technical ideas.</p></Card>
            <Card tone="yellow" title="What I explore"><p>Web applications, Google Cloud, Gemini-powered prototypes and multimodal APIs.</p></Card>
          </div>
        </Page>
        <Page id="skills" number={3} label="Skill map" title="The things I build with." description="Skills I’ve applied in projects, prototypes and Google Cloud labs.">
          <div className="sk-grid sk-three">
            <Card tone="mint" title="Web & UX"><ul><li>Full-stack development</li><li>Responsive interfaces</li><li>React and TypeScript prototypes</li></ul></Card>
            <Card tone="lilac" title="Google Cloud"><ul><li>Compute, IAM and Cloud Run</li><li>Storage, Pub/Sub and Functions</li><li>GKE and Cloud Build</li></ul></Card>
            <Card tone="yellow" title="AI & APIs"><ul><li>Gemini API and AI Studio</li><li>Cloud Vision API</li><li>Speech and language services</li></ul></Card>
          </div>
        </Page>
        <Page id="cloud" number={4} label="The cloud side" title="From code to cloud." description="Hands-on practice with Google Cloud deployment and infrastructure.">
          <div className="sk-grid sk-two sk-compact">
            <Card tone="yellow" title="Deploy"><p>Cloud Run · Compute Engine</p></Card>
            <Card tone="mint" title="Containers"><p>Google Kubernetes Engine</p></Card>
            <Card tone="lilac" title="Build"><p>Cloud Build · Microservices</p></Card>
            <Card tone="pink" title="Events"><p>Cloud Storage · Pub/Sub · Functions</p></Card>
            <Card tone="sky" title="Access"><p>Service accounts · IAM</p></Card>
            <ArrowRight className="sk-cloud-arrow" aria-hidden="true" strokeWidth={1.2} />
          </div>
        </Page>
        <Page id="ai" number={5} label="The AI side" title="Prompt. Test. Create." description="Experiments with multimodal AI and pre-trained APIs.">
          <ul className="sk-tags">
            {['Google AI Studio', 'Gemini API', 'Gemini Enterprise', 'Vision API', 'Speech-to-Text', 'Text-to-Speech', 'Translation API', 'Vertex AI'].map((item, index) =>
              <li className={'sk-' + ['yellow', 'mint', 'pink', 'lilac', 'sky', 'mint', 'yellow', 'pink'][index]} key={item}>{item}</li>)}
          </ul>
          <p className="sk-handwriting">build → try → improve → repeat</p>
        </Page>
        <Page id="work" number={6} label="Build no. 01" title="Fantasy Character Generator" description="A prompt-driven prototype built in Google AI Studio.">
          <div className="sk-grid sk-project">
            <Card tone="yellow" title="The idea"><p>Generate a fantasy hero with a class, character details and a backstory, then add them to a roster. The prototype explores three classes: Mage, Rogue and Warrior.</p><p className="sk-stack">Google AI Studio · Gemini</p></Card>
            <div className="sk-card sk-lilac sk-mage"><strong>Mage</strong><Sparkles size={72} strokeWidth={1.05} aria-hidden="true" /><span>Character prototype</span></div>
          </div>
        </Page>
        <Page id="microservices" number={7} label="Build no. 02" title="Web to Microservices" description="A hands-on website deployment and container infrastructure lab.">
          <div className="sk-grid sk-two">
            <Card tone="mint" title="Start"><p>Containerized a monolithic website application and deployed it using Google Cloud tooling.</p></Card>
            <Card tone="pink" title="Scale the idea"><p>Explored migration toward microservices with GKE, Cloud Build and a Kubernetes LoadBalancer service.</p></Card>
          </div>
        </Page>
        <Page id="apis" number={8} label="Build no. 03" title="APIs in the Wild" description="Task-based projects that use Google Cloud APIs.">
          <div className="sk-grid sk-three">
            <Card tone="lilac" title="Vision"><p>Extracted text and detected landmarks in images with Cloud Vision API.</p></Card>
            <Card tone="yellow" title="Speech"><p>Transcribed audio and worked through speech and language API exercises.</p></Card>
            <Card tone="mint" title="Events"><p>Used Cloud Storage uploads to trigger a function that generates thumbnails.</p></Card>
          </div>
        </Page>
        <Page id="experience" number={9} label="Experience" title="Learning by shipping." description="Hands-on project, lab and prototype experience.">
          <ol className="sk-experience">
            <li><span>01</span><h3>AI prototyping</h3><p>Prompting, Gemini-powered application concepts and API testing.</p></li>
            <li><span>02</span><h3>Cloud deployments</h3><p>Website deployment, microservices and managed compute.</p></li>
            <li><span>03</span><h3>API integrations</h3><p>Vision, speech, text, cloud events and IAM workflows.</p></li>
          </ol>
        </Page>
        <Page id="certifications" number={10} label="Skill badges · 1 / 2" title="Ten Google Cloud skill badges" description="Earned October 2026 through hands-on Google Skills labs.">
          <BadgeList start={0} />
        </Page>
        <Page id="more-badges" number={11} label="Skill badges · 2 / 2" title="More badges, more builds." description="Practice with data, language services, access management and compute.">
          <BadgeList start={5} />
        </Page>
        <Page id="resume" number={12} label="Résumé overview" title="A one-page snapshot." description="My developer profile and recent highlights.">
          <div className="sk-grid sk-two">
            <Card tone="yellow" title="Profile"><p>Poosala Lokesh<br />Full Stack Web Developer</p><p>Interests include web development, Google Cloud and AI-powered applications.</p></Card>
            <Card tone="mint" title="Highlights"><ul><li>10 Google Cloud skill badges</li><li>Gemini AI Studio prototype</li><li>Cloud deployment and API projects</li></ul></Card>
          </div>
          <a className="sk-button sk-button-dark sk-resume" href={activeResume?.url || '/resume.pdf'} target="_blank" rel="noreferrer">View résumé PDF <Download size={17} /></a>
        </Page>
        <Page id="contact" number={13} label="Say hello" title="Let’s build something." description="Have a project in mind? Tell me what you’re working on.">
          <div className="sk-grid sk-contact">
            <ContactForm email={email} />
            <aside className="sk-contact-links">
              <Star aria-hidden="true" size={58} strokeWidth={1.15} />
              <a href={'mailto:' + email}>{email} <ArrowUpRight size={16} /></a>
              <a href={social?.linkedinUrl || 'https://www.linkedin.com/in/poosala-lokesh/'}>LinkedIn <ArrowUpRight size={16} /></a>
              <a href={'https://github.com/Lokesh-81'}>GitHub <ArrowUpRight size={16} /></a>
            </aside>
          </div>
        </Page>

        <section className="sk-page sk-closing" id="closing" aria-labelledby="sk-closing-title">
          <div className="sk-reveal sk-closing-grid">
            <div>
              <h2 id="sk-closing-title">That’s my<br /><span>sketchbook.</span></h2>
              <div className="sk-wave" aria-hidden="true" />
              <p>Poosala Lokesh · Full Stack Web Developer</p>
              <a className="sk-text-link" href="#home">Back to the top <ArrowUp size={16} /></a>
            </div>
            <div className="sk-closing-star" aria-hidden="true"><Star size={104} strokeWidth={.9} /></div>
          </div>
          <PageNumber number={14} />
        </section>
      </main>
      <footer className="sk-footer"><a href="/studio">Developer Studio <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
