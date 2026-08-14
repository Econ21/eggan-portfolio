// Content + translations for the Eggan Nachson portfolio rebuild.
// Every UI string and content block carries nl/en/id — nl is the site default.
// Consumed by build-portfolio.js, which has no other source of truth for copy.

const LANGS = ['nl', 'en', 'id'];

const UI = {
  navHome:      { nl: 'Home',           en: 'Home',           id: 'Beranda' },
  navEducation: { nl: 'Opleiding',      en: 'Education',      id: 'Pendidikan' },
  navWork:      { nl: 'Werk',           en: 'Work',            id: 'Karya' },
  navResearch:  { nl: 'Onderzoek',      en: 'Research',        id: 'Riset' },
  navLeadership:{ nl: 'Leiderschap',    en: 'Leadership',      id: 'Kepemimpinan' },
  navContact:   { nl: 'Contact',        en: 'Contact',         id: 'Kontak' },

  heroEyebrow:  { nl: 'TECHNOLOGIE × STRATEGIE × LEIDERSCHAP', en: 'TECHNOLOGY × STRATEGY × LEADERSHIP', id: 'TEKNOLOGI × STRATEGI × KEPEMIMPINAN' },
  heroHeadline: { nl: 'IK BOUW SYSTEMEN DIE ECHT WERKEN.', en: 'I BUILD SYSTEMS THAT ACTUALLY WORK.', id: 'SAYA MEMBANGUN SISTEM YANG BENAR-BENAR JALAN.' },
  heroSub: {
    nl: 'Ik bouw digitale producten en AI-gedreven systemen, leid gemeenschappen, en zet ideeën om in dingen die echte impact maken.',
    en: 'I build digital products and AI-powered systems, lead communities, and turn ideas into things that create real impact.',
    id: 'Saya membangun produk digital dan sistem berbasis AI, memimpin komunitas, dan mengubah ide menjadi sesuatu yang berdampak nyata.',
  },
  heroCtaWork:    { nl: 'BEKIJK MIJN WERK', en: 'EXPLORE MY WORK', id: 'LIHAT KARYA SAYA' },
  heroCtaContact: { nl: 'NEEM CONTACT OP', en: "LET'S CONNECT", id: 'HUBUNGI SAYA' },
  metaBasedIn:  { nl: 'GEVESTIGD IN', en: 'BASED IN', id: 'BERBASIS DI' },
  metaEducation:{ nl: 'OPLEIDING', en: 'EDUCATION', id: 'PENDIDIKAN' },
  metaBuilt:    { nl: 'GEBOUWD', en: 'BUILT', id: 'DIBANGUN' },
  metaCommunity:{ nl: 'GEMEENSCHAP', en: 'COMMUNITY', id: 'KOMUNITAS' },
  metaBasedInVal:   { nl: 'Den Haag, Nederland', en: 'The Hague, Netherlands', id: 'Den Haag, Belanda' },
  metaEducationVal: { nl: '2× Masterdiploma\'s', en: '2× Master\'s Degrees', id: '2× Gelar Master' },
  metaBuiltVal:     { nl: '4 productiesystemen', en: '4 Production Systems', id: '4 Sistem Produksi' },
  metaCommunityVal: { nl: '20K+ netwerk in Indonesië', en: '20K+ Network Across Indonesia', id: '20K+ Jaringan di Indonesia' },

  homeSectionWork:       { nl: 'GESELECTEERD WERK', en: 'SELECTED WORK', id: 'KARYA PILIHAN' },
  homeSectionLeadership: { nl: 'VOORBIJ DE CODE', en: 'BEYOND THE CODE', id: 'LEBIH DARI SEKADAR KODE' },
  homeSectionResearch:   { nl: 'ONDERZOEK', en: 'RESEARCH', id: 'RISET' },
  viewAll:      { nl: 'Bekijk alles', en: 'View all', id: 'Lihat semua' },
  readMore:     { nl: 'Meer lezen', en: 'Read more', id: 'Baca selengkapnya' },
  viewCaseStudy:{ nl: 'Bekijk case study', en: 'View case study', id: 'Lihat studi kasus' },
  close:        { nl: 'SLUITEN', en: 'CLOSE', id: 'TUTUP' },

  eduPageEyebrow: { nl: 'OVER MIJ', en: 'ABOUT ME', id: 'TENTANG SAYA' },
  eduPageTitle:   { nl: 'IK WERK TUSSEN TECHNOLOGIE EN MENSEN.', en: 'I WORK BETWEEN TECHNOLOGY AND PEOPLE.', id: 'SAYA BEKERJA DI ANTARA TEKNOLOGI DAN MANUSIA.' },
  eduPageBody: {
    nl: 'Mijn werk bevindt zich op het snijvlak van technologie, strategie en gemeenschap. Ik bouw digitale producten en AI-gedreven systemen, en werk tegelijk aan onderwijs, publieke initiatieven en nationale gemeenschappen.',
    en: 'My work sits at the intersection of technology, strategy and community. I build digital products and AI-powered systems, while also working across education, public initiatives and national communities.',
    id: 'Pekerjaan saya berada di persimpangan teknologi, strategi, dan komunitas. Saya membangun produk digital dan sistem berbasis AI, sambil juga aktif di bidang pendidikan, inisiatif publik, dan komunitas nasional.',
  },
  eduPagePullquote: {
    nl: 'Hoe kan technologie iets nuttigs creëren voorbij het scherm?',
    en: 'How can technology create something useful beyond the screen?',
    id: 'Bagaimana teknologi bisa menciptakan sesuatu yang berguna melampaui layar?',
  },
  eduTimelineTitle: { nl: 'OPLEIDINGSTRAJECT', en: 'EDUCATION TIMELINE', id: 'RIWAYAT PENDIDIKAN' },
  skillsTitle:  { nl: 'VAARDIGHEDEN & EXPERTISE', en: 'SKILLS & EXPERTISE', id: 'KEAHLIAN & KEPAKARAN' },
  skillBuild:   { nl: 'BOUWEN', en: 'BUILD', id: 'BUILD' },
  skillAi:      { nl: 'AI', en: 'AI', id: 'AI' },
  skillData:    { nl: 'DATA', en: 'DATA', id: 'DATA' },
  skillStrategy:{ nl: 'STRATEGIE', en: 'STRATEGY', id: 'STRATEGI' },

  workPageEyebrow: { nl: 'SYSTEMEN DIE IK HEB GEBOUWD', en: 'SYSTEMS I\'VE BUILT', id: 'SISTEM YANG SUDAH SAYA BANGUN' },
  workPageNote: {
    nl: 'Geen mockups — alles hieronder draait in productie. Klik op een kaart voor de volledige case study.',
    en: 'No mockups — everything below runs in production. Click a card for the full case study.',
    id: 'Bukan mockup — semua yang di bawah ini berjalan di produksi. Klik kartu untuk studi kasus lengkap.',
  },
  servicesTitle: { nl: 'DIENSTEN', en: 'SERVICES', id: 'LAYANAN' },

  researchPageEyebrow: { nl: 'GEPUBLICEERD & LOPEND ONDERZOEK', en: 'PUBLISHED & ONGOING RESEARCH', id: 'RISET TERBIT & BERJALAN' },
  researchPageNote: {
    nl: 'Klik op een paper om de pagina\'s te bladeren. Handmatige navigatie — geen download.',
    en: 'Click a paper to browse its pages. Manual navigation — no download.',
    id: 'Klik paper untuk membuka halaman-halamannya. Navigasi manual — tanpa unduhan.',
  },
  openReader:  { nl: 'Paper openen', en: 'Open paper', id: 'Buka paper' },
  pageOf:      { nl: 'pagina', en: 'page', id: 'halaman' },

  leadershipPageEyebrow: { nl: 'VOORBIJ DE CODE', en: 'BEYOND THE CODE', id: 'LEBIH DARI SEKADAR KODE' },
  leadershipPageTitle:   { nl: 'LEIDERSCHAP & GEMEENSCHAP', en: 'LEADERSHIP & COMMUNITY', id: 'KEPEMIMPINAN & KOMUNITAS' },
  galleryTitle: { nl: 'MOMENTEN UIT HET VELD', en: 'MOMENTS FROM THE FIELD', id: 'MOMEN DARI LAPANGAN' },
  galleryNote: {
    nl: 'Handmatige navigatie — blader door alle foto\'s met de pijlen.',
    en: 'Manual navigation — browse every photo with the arrows.',
    id: 'Navigasi manual — jelajahi semua foto dengan tombol panah.',
  },

  contactTitle: { nl: 'LATEN WE IETS NUTTIGS BOUWEN.', en: "LET'S BUILD SOMETHING USEFUL.", id: 'MARI BANGUN SESUATU YANG BERGUNA.' },
  contactBody: {
    nl: 'Beschikbaar voor geselecteerde opdrachten, projecten en samenwerkingen.',
    en: 'Available for selected opportunities, projects and collaborations.',
    id: 'Terbuka untuk peluang, proyek, dan kolaborasi terpilih.',
  },
  contactLocation: { nl: 'LOCATIE', en: 'LOCATION', id: 'LOKASI' },
  contactEmail:    { nl: 'E-MAIL', en: 'EMAIL', id: 'EMAIL' },
  contactPhone:    { nl: 'TELEFOON / WHATSAPP', en: 'PHONE / WHATSAPP', id: 'TELEPON / WHATSAPP' },
  contactCta:      { nl: 'NEEM CONTACT OP', en: 'GET IN TOUCH', id: 'HUBUNGI SAYA' },

  footerTagline: { nl: 'Technologie · Strategie · Leiderschap', en: 'Technology · Strategy · Leadership', id: 'Teknologi · Strategi · Kepemimpinan' },
  footerRights:  { nl: 'Alle rechten voorbehouden.', en: 'All rights reserved.', id: 'Hak cipta dilindungi.' },
};

// ── Education timeline ──────────────────────────────────────────────────────
// Only the two CONFIRMED degrees — a third (AI, Lübeck University) appears in
// one source card's bio but is unconfirmed as of this build; do not add it
// until the user confirms status. See DESIGN_BRIEF.md "open questions".
const EDUCATION = [
  {
    period: '2026 — ' , periodSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' },
    school: 'The Hague University of Applied Sciences',
    degree: { nl: 'MSc Data-Driven Business', en: 'MSc Data-Driven Business', id: 'MSc Data-Driven Business' },
    place: { nl: 'Den Haag, Nederland', en: 'The Hague, Netherlands', id: 'Den Haag, Belanda' },
  },
  {
    period: '2023 — 2025',
    school: 'Universitas Indonesia',
    degree: { nl: 'MSc Strategic Intelligence', en: 'MSc Strategic Intelligence', id: 'MSc Strategic Intelligence' },
    place: { nl: 'Jakarta, Indonesië', en: 'Jakarta, Indonesia', id: 'Jakarta, Indonesia' },
  },
  {
    period: '2018 — 2022',
    school: 'ITB Swadharma',
    degree: { nl: 'BSc Informatics Engineering', en: 'BSc Informatics Engineering', id: 'BSc Informatics Engineering' },
    place: { nl: 'Jakarta, Indonesië', en: 'Jakarta, Indonesia', id: 'Jakarta, Indonesia' },
  },
];

// ── Skills ───────────────────────────────────────────────────────────────────
const SKILLS = {
  build:    ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'APIs', 'System Design'],
  ai:       ['LLM Integration', 'AI Agents', 'Automation', 'Prompt Engineering', 'AI Product Architecture'],
  data:     ['Data Analytics', 'Business Intelligence', 'Data Visualization', 'Data-driven Decision Making'],
  strategy: ['Product Strategy', 'Project Management', 'Partnerships', 'Community Development', 'Public Speaking'],
};

// ── Selected work (case studies) ────────────────────────────────────────────
const PROJECTS = [
  {
    num: '01', slug: 'creative-ai-partner',
    name: 'Creative AI Partner',
    tag: { nl: 'AI-productieplatform', en: 'AI Production Platform', id: 'Platform Produksi AI' },
    desc: {
      nl: 'AI-platform voor het genereren van beeld-, video- en advertentiecontent. Geïntegreerd met meerdere AI-modellen, een kredietsysteem en abonnementen via Xendit.',
      en: 'AI-powered platform for generating image, video, and advertising content. Integrated with multiple AI models, a credit system, and subscriptions via Xendit.',
      id: 'Platform berbasis AI untuk generate konten gambar, video, dan iklan. Terintegrasi dengan berbagai model AI, sistem kredit, dan langganan via Xendit.',
    },
    stack: ['Next.js', 'Supabase', 'Clerk', 'Xendit', 'fal.ai'],
    dir: 'cap', thumb: 'home.jpg',
  },
  {
    num: '02', slug: 'matchupskills',
    name: 'MatchupSkills',
    tag: { nl: 'AI-leerplatform', en: 'AI-Powered Learning Platform', id: 'Platform Belajar Berbasis AI' },
    desc: {
      nl: 'AI-gedreven edtech-platform dat studenten koppelt aan het juiste leerpad. Inclusief AI-tutor, leerbeheer en voortgangsanalyse.',
      en: 'AI-driven EdTech platform that matches students with the right skills and learning path. Includes an AI tutor, learning management, and progress analytics.',
      id: 'Platform edtech berbasis AI yang mencocokkan siswa dengan jalur belajar yang tepat. Termasuk AI tutor, manajemen pembelajaran, dan analitik progres.',
    },
    stack: ['Next.js', 'Supabase', 'Midtrans'],
    dir: 'ms', thumb: 'home.jpg',
  },
  {
    num: '03', slug: 'operations-system',
    name: { nl: 'Operationeel systeem', en: 'Operations System', id: 'Sistem Operasional' },
    tag: { nl: 'Intern bedrijfsdashboard', en: 'Internal Business Dashboard', id: 'Dashboard Bisnis Internal' },
    desc: {
      nl: 'Intern systeem voor het beheren van operaties, projecten, klanten en teamprestaties in één centraal dashboard.',
      en: 'Internal system to manage operations, projects, clients, and team performance in one centralized dashboard.',
      id: 'Sistem internal untuk mengelola operasional, proyek, klien, dan performa tim dalam satu dashboard terpusat.',
    },
    stack: ['Next.js', 'PostgreSQL', 'Role-Based Access'],
    dir: null, thumb: 'msadmin-login.jpg',
  },
  {
    num: '04', slug: 'lumbung-jakut',
    name: 'Lumbung Jakut',
    tag: { nl: 'Voedselzekerheidsplatform', en: 'Food Resilience Platform', id: 'Platform Ketahanan Pangan' },
    desc: {
      nl: 'Platform voor de gemeente Jakarta Utara om voedselvoorraad, distributie en gemeenschapsgegevens voor voedselzekerheid te beheren.',
      en: 'Platform for the North Jakarta city government to manage food stock, distribution, and community data for food resilience.',
      id: 'Platform untuk Pemerintah Kota Jakarta Utara mengelola stok pangan, distribusi, dan data komunitas untuk ketahanan pangan.',
    },
    stack: ['Next.js', 'PWA', 'Report Automation'],
    dir: 'lumbung', thumb: 'home.jpg',
  },
];

// ── Leadership & Community ──────────────────────────────────────────────────
// Synthesized from Portofolio_Eggan Nachson.pdf (11 slides) + the ICCN and
// Indonesia Mengglobal appointment cards. Entries without a clean personal
// photo (Titik Terang, YouthRanger.id) render as text/stat-forward cards
// instead of forcing a mismatched image.
const LEADERSHIP = [
  {
    year: '2025 — 2028', img: 'iccn-director.jpg',
    org: 'Indonesian Creative Cities Network',
    role: { nl: 'Directeur Talentontwikkeling & Certificering', en: 'Director of Talent Development & Certification', id: 'Direktur Pengembangan Talenta & Sertifikasi' },
    stat: '20K+',
    statLabel: { nl: 'Netwerk & gemeenschap', en: 'Network & Community', id: 'Jaringan & Komunitas' },
    desc: {
      nl: 'Leidt landelijke initiatieven om creatief menselijk kapitaal in heel Indonesië te versterken — talentontwikkeling, professionele training, certificering en samenwerking met de industrie.',
      en: 'Leading national initiatives to strengthen creative human capital across Indonesia — talent development, professional training, certification pathways, and industry linkage.',
      id: 'Memimpin inisiatif nasional untuk memperkuat SDM kreatif di seluruh Indonesia — pengembangan talenta, pelatihan profesional, jalur sertifikasi, dan kolaborasi industri.',
    },
  },
  {
    year: '2026 — 2028', img: 'indonesia-mengglobal.jpg',
    org: 'Indonesia Mengglobal',
    role: { nl: 'VP Strategische Partnerschappen & Communicatie', en: 'VP Strategic Partnerships & Communications', id: 'VP Kemitraan Strategis & Komunikasi' },
    stat: '10K+',
    statLabel: { nl: 'Studenten & leden', en: 'Scholars & Members', id: 'Scholars & Anggota' },
    desc: {
      nl: 'Beheert partnerschappen en communicatie voor Indonesië\'s grootste mentorschapsgemeenschap voor studeren in het buitenland — "Connected, Empowered, Educated".',
      en: 'Managing partnerships and communications for Indonesia\'s largest overseas-education mentorship community — "Connected, Empowered, Educated".',
      id: 'Mengelola kemitraan dan komunikasi untuk komunitas mentorship studi luar negeri terbesar di Indonesia — "Connected, Empowered, Educated".',
    },
  },
  {
    year: '2025', img: 'unesco-undp.jpg',
    org: 'UNESCO & UNDP Indonesia',
    role: { nl: 'Spreker, Digitale Geletterdheid Forum', en: 'Speaker, Digital Literacy Forum', id: 'Pembicara, Forum Literasi Digital' },
    stat: '100+',
    statLabel: { nl: 'Aanwezigen — internationaal forum', en: 'Attendance — International Forum', id: 'Peserta — Forum Internasional' },
    desc: {
      nl: 'Sprak over het opbouwen van een inclusief digitaal ecosysteem voor Indonesië\'s 3T-gebieden (afgelegen, grens- en achtergestelde regio\'s).',
      en: 'Spoke on building an inclusive digital ecosystem for Indonesia\'s "3T" — underdeveloped, frontier and outermost — regions.',
      id: 'Berbicara soal membangun ekosistem digital inklusif untuk wilayah 3T (Tertinggal, Terdepan, Terluar) di Indonesia.',
    },
  },
  {
    year: '2026', img: 'timur-growth.jpg',
    org: 'Timur Growth 2 Startup Competition',
    role: { nl: 'Spreker & Jurylid', en: 'Speaker & Panelist', id: 'Pembicara & Panelis' },
    stat: null, statLabel: null,
    desc: {
      nl: 'Deelde inzichten over duurzame startup-ecosystemen en gaf strategische feedback aan deelnemende startups in Oost-Indonesië.',
      en: 'Shared insights on building sustainable startup ecosystems and gave strategic feedback to participating startups across Eastern Indonesia.',
      id: 'Berbagi wawasan soal membangun ekosistem startup berkelanjutan dan memberi masukan strategis ke startup peserta di Indonesia Timur.',
    },
  },
  {
    year: '2024 — heden', img: null,
    org: 'Titik Terang',
    role: { nl: 'Chief Branding & Creative', en: 'Chief Branding & Creative', id: 'Chief Branding & Creative' },
    stat: '218K+',
    statLabel: { nl: 'Views bereikt', en: 'Content Reach', id: 'Jangkauan Konten' },
    desc: {
      nl: 'Leidt merkpositionering en creatieve strategie — content bereikte 123.508 views met 99,1% van de impressies afkomstig van niet-volgers.',
      en: 'Leading brand positioning and creative strategy — content generated 123,508 views, with 99.1% of impressions coming from non-followers.',
      id: 'Memimpin positioning brand dan strategi kreatif — konten meraih 123.508 views, 99,1% impresi berasal dari non-follower.',
    },
  },
  {
    year: '2024 — heden', img: null,
    org: 'YouthRanger.id',
    role: { nl: 'Creatief Consultant', en: 'Creative Consultant', id: 'Konsultan Kreatif' },
    stat: '218K+',
    statLabel: { nl: 'Volgers — landelijke jeugdbeweging', en: 'Followers — Nationwide Youth Movement', id: 'Followers — Gerakan Pemuda Nasional' },
    desc: {
      nl: 'Adviseert over campagnestrategie en verhaalarchitectuur; maandelijkse content bereikt 2–4 miljoen views met 50%+ groei in betrokkenheid.',
      en: 'Advising on campaign strategy and narrative architecture; monthly content performance consistently reaches 2–4 million views, with 50%+ engagement growth.',
      id: 'Memberi arahan strategi kampanye dan narasi; performa konten bulanan konsisten meraih 2–4 juta views, pertumbuhan engagement 50%+.',
    },
  },
  {
    year: '2025', img: 'biru-muda.jpg',
    org: 'Biru Muda Project Community',
    role: { nl: 'Chief Branding & Creative', en: 'Chief Branding & Creative', id: 'Chief Branding & Creative' },
    stat: '1M+',
    statLabel: { nl: 'Maandelijkse impressies', en: 'Monthly Impressions', id: 'Impresi Bulanan' },
    desc: {
      nl: 'Leidt merkstrategie en storytelling voor jongerengerichte initiatieven — inclusief het "Critical Grounds" podiumgesprek voor een volle zaal.',
      en: 'Leading branding strategy and cross-platform storytelling for youth-focused initiatives — including the "Critical Grounds" on-stage conversation to a full house.',
      id: 'Memimpin strategi branding dan storytelling lintas platform untuk inisiatif pemuda — termasuk sesi panggung "Critical Grounds" di depan audiens penuh.',
    },
  },
  {
    year: '2023', img: 'pt-pindad.jpg',
    org: 'Studi Ekskursi PT Pindad',
    role: { nl: 'Chief Project', en: 'Chief Project', id: 'Chief Project' },
    stat: '55',
    statLabel: { nl: 'Onderzoekers betrokken', en: 'Researchers Involved', id: 'Peneliti Terlibat' },
    desc: {
      nl: 'Ontwikkelde een wetenschappelijke studie als roadmap voor de nationale defensie-industrie, onder toezicht van de VP van PT Pindad.',
      en: 'Developed a scientific study serving as a government roadmap for Indonesia\'s defense industry, conducted under the direct supervision of the VP of PT Pindad.',
      id: 'Menyusun studi ilmiah sebagai roadmap pemerintah untuk industri pertahanan Indonesia, di bawah supervisi langsung VP PT Pindad.',
    },
  },
  {
    year: '2022', img: 'study-hub.jpg',
    org: 'Study Hub — PUSAT AHLI × PT Sentra Solusi',
    role: { nl: 'BD Mentor', en: 'BD Mentor', id: 'BD Mentor' },
    stat: '225',
    statLabel: { nl: 'Deelnemers', en: 'Attendance', id: 'Peserta' },
    desc: {
      nl: 'Mentor voor Business Development binnen een samenwerkingsprogramma met klassen in BD, webontwikkeling, data science en Figma.',
      en: 'Mentored Business Development within a collaborative learning program spanning BD, web development, data science, and Figma classes.',
      id: 'Menjadi mentor Business Development dalam program belajar kolaboratif yang mencakup kelas BD, web development, data science, dan Figma.',
    },
  },
  {
    year: '2021', img: 'kutu-it.jpg',
    org: 'Project KUTU IT',
    role: { nl: 'Technopreneurship-mentor', en: 'Technopreneurship Mentor', id: 'Mentor Technopreneurship' },
    stat: '45',
    statLabel: { nl: 'Deelnemers — Digital Skills Bootcamp', en: 'Attendance — Digital Skills Bootcamp', id: 'Peserta — Digital Skills Bootcamp' },
    desc: {
      nl: 'Zijn vroegste mentorproject: een digitale-vaardighedenbootcamp voor universiteitsstudenten, in samenwerking met HIMTI ITB Swadharma.',
      en: 'His earliest mentorship project — a digital skills bootcamp for university students, run with HIMTI at ITB Swadharma.',
      id: 'Proyek mentorship paling awal — bootcamp keterampilan digital untuk mahasiswa, diselenggarakan bersama HIMTI ITB Swadharma.',
    },
  },
];

// ── Gallery (Field Notes) ───────────────────────────────────────────────────
const GALLERY = [
  { img: 'critical-grounds-stage.jpg', caption: { nl: 'Critical Grounds — gesprek op het podium', en: 'Critical Grounds — on-stage conversation', id: 'Critical Grounds — sesi panggung' } },
  { img: 'iccn-fgd-palembang.jpg', caption: { nl: 'Focus-groepdiscussie, Palembang', en: 'Focus group discussion, Palembang', id: 'Focus group discussion, Palembang' } },
  { img: 'river-cleanup-1.jpg', caption: { nl: 'Musi-rivier schoonmaakactie', en: 'Musi River cleanup movement', id: 'Gerakan bersih Sungai Musi' } },
  { img: 'river-cleanup-2.jpg', caption: { nl: 'Nationale Rivierdag 2026', en: 'National River Day 2026', id: 'Hari Sungai Nasional 2026' } },
  { img: 'timur-growth-panel.jpg', caption: { nl: 'Timur Growth 2 — panel', en: 'Timur Growth 2 — panel', id: 'Timur Growth 2 — panel' } },
  { img: 'unesco-forum.jpg', caption: { nl: 'UNESCO & UNDP forum', en: 'UNESCO & UNDP forum', id: 'Forum UNESCO & UNDP' } },
  { img: 'pindad-visit.jpg', caption: { nl: 'PT Pindad studiebezoek', en: 'PT Pindad study visit', id: 'Kunjungan studi PT Pindad' } },
  { img: 'studyhub-class.jpg', caption: { nl: 'Study Hub — mentorklas', en: 'Study Hub — mentoring class', id: 'Study Hub — kelas mentoring' } },
];

// ── Research / Publications ─────────────────────────────────────────────────
const RESEARCH = [
  {
    slug: 'jurnal', pages: 24,
    title: 'Strategic Intelligence Foresight on Ransomware Threats in State-Owned Bankings in Indonesia',
    meta: 'Jurnal Indonesia Sosial Teknologi (JIST), Vol. 6 No. 6 · Juni 2025 · DOI 10.36418/jist.v6i6.008',
    authors: 'Eggan Nachson, Puspitasari, Aloysius Mado — Universitas Indonesia',
    badge: { nl: 'GEPUBLICEERD', en: 'PUBLISHED', id: 'TERBIT' },
    abstract: {
      nl: 'Onderzoekt escalatiepatronen van AI-gestuurde ransomware-aanvallen tegen Indonesische staatsbanken en formuleert een strategisch foresight-raamwerk voor 2025–2029.',
      en: 'Identifies escalation patterns of AI-powered ransomware attacks against Indonesian state-owned banks and formulates a strategic foresight framework for 2025–2029.',
      id: 'Mengidentifikasi pola eskalasi serangan ransomware berbasis AI terhadap bank BUMN Indonesia dan merumuskan kerangka strategic foresight untuk 2025–2029.',
    },
  },
  {
    slug: 'tokyo', pages: 6,
    title: 'Digital Policy Bundles and Food-System Resilience in Rural Solo/Surakarta',
    meta: { nl: 'Gezamenlijk onderzoek met Tokyo University', en: 'Joint research with Tokyo University', id: 'Riset bersama Tokyo University' },
    authors: 'Eggan Nacson Silueta',
    badge: { nl: 'LOPEND ONDERZOEK', en: 'ONGOING RESEARCH', id: 'RISET BERJALAN' },
    abstract: {
      nl: 'Een ex-ante beoordeling van hoe digitale beleidsbundels de veerkracht van plattelandshuishoudens en regionale voedselsystemen kunnen versterken, met een fsQCA-methodologie.',
      en: 'An ex-ante assessment of how digital policy bundles can strengthen rural household and regional food-system resilience, using an fsQCA methodology.',
      id: 'Kajian ex-ante tentang bagaimana kebijakan digital dapat memperkuat ketahanan rumah tangga desa dan sistem pangan regional, menggunakan metodologi fsQCA.',
    },
  },
];

const CONTACT = {
  location: { nl: 'Den Haag, Nederland · Jakarta, Indonesië', en: 'The Hague, Netherlands · Jakarta, Indonesia', id: 'Den Haag, Belanda · Jakarta, Indonesia' },
  email: 'mahesacloude@gmail.com',
  phone: '+62 814-0198-1855',
  waLink: 'https://wa.me/6281401981855',
};

module.exports = { LANGS, UI, EDUCATION, SKILLS, PROJECTS, LEADERSHIP, GALLERY, RESEARCH, CONTACT };
