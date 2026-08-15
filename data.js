// Content + translations for the Eggan Nachson portfolio rebuild.
// Every UI string and content block carries nl/en/id — nl is the site default.
// Consumed by build-portfolio.js, which has no other source of truth for copy.

const LANGS = ['nl', 'en', 'id'];

const UI = {
  navHome:      { nl: 'Home',           en: 'Home',           id: 'Beranda' },
  navEducation: { nl: 'Ervaring & Opleiding', en: 'Experience & Education', id: 'Pengalaman & Pendidikan' },
  navWork:      { nl: 'Werk',           en: 'Work',            id: 'Karya' },
  navResearch:  { nl: 'Onderzoek',      en: 'Research',        id: 'Riset' },
  navLeadership:{ nl: 'Leiderschap',    en: 'Leadership',      id: 'Kepemimpinan' },
  navContact:   { nl: 'Contact',        en: 'Contact',         id: 'Kontak' },

  heroEyebrow:  { nl: 'INDONESIË → NEDERLAND · AI & STRATEGIE', en: 'INDONESIA → NETHERLANDS · AI & STRATEGY', id: 'INDONESIA → BELANDA · AI & STRATEGI' },
  heroHeadline: { nl: 'HALLO, IK BEN EGGAN NACHSON SILUETA.', en: "HELLO, I'M EGGAN NACHSON SILUETA.", id: 'HALO, SAYA EGGAN NACHSON SILUETA.' },
  heroSub: {
    nl: 'Ik kom uit Indonesië en volg momenteel mijn derde masteropleiding in Nederland. Ik behaalde een master Strategic Intelligence aan de Universiteit van Indonesië, een master Artificial Intelligence aan de Universität zu Lübeck, en rond nu een master Data-Driven Business af aan The Hague University of Applied Sciences. Ik heb AI-producten en -programma\'s mee opgebouwd voor Indonesië\'s Ministerie van Creatieve Economie en Ministerie van Onderzoek & Hoger Onderwijs / LPDP, en leid vandaag AI-productstrategie bij MatchupSkills.',
    en: "I'm from Indonesia and currently pursuing my third master's degree in the Netherlands. I hold a master's in Strategic Intelligence from Universitas Indonesia, a master's in Artificial Intelligence from the University of Lübeck, and I'm now completing a master's in Data-Driven Business at The Hague University of Applied Sciences. I've helped build AI products and programs for Indonesia's Ministry of Creative Economy and Ministry of Research & Higher Education / LPDP, and I currently lead AI product strategy at MatchupSkills.",
    id: 'Saya berasal dari Indonesia dan sedang menempuh gelar master ketiga saya di Belanda. Saya meraih gelar master Strategic Intelligence dari Universitas Indonesia, master Artificial Intelligence dari Universität zu Lübeck, dan saat ini menyelesaikan master Data-Driven Business di The Hague University of Applied Sciences. Saya turut membangun produk dan program AI untuk Kementerian Ekonomi Kreatif Indonesia dan Kementerian Riset & Pendidikan Tinggi / LPDP, dan kini memimpin strategi produk AI di MatchupSkills.',
  },
  heroCtaWork:    { nl: 'BEKIJK MIJN WERK', en: 'EXPLORE MY WORK', id: 'LIHAT KARYA SAYA' },
  heroCtaContact: { nl: 'NEEM CONTACT OP', en: "LET'S CONNECT", id: 'HUBUNGI SAYA' },
  heroCtaCv:      { nl: 'DOWNLOAD CV', en: 'DOWNLOAD CV', id: 'UNDUH CV' },
  metaBasedIn:  { nl: 'GEVESTIGD IN', en: 'BASED IN', id: 'BERBASIS DI' },
  metaEducation:{ nl: 'OPLEIDING', en: 'EDUCATION', id: 'PENDIDIKAN' },
  metaBuilt:    { nl: 'GEBOUWD', en: 'BUILT', id: 'DIBANGUN' },
  metaCommunity:{ nl: 'GEMEENSCHAP', en: 'COMMUNITY', id: 'KOMUNITAS' },
  metaBasedInVal:   { nl: 'Den Haag, Nederland', en: 'The Hague, Netherlands', id: 'Den Haag, Belanda' },
  metaEducationVal: { nl: '3× Masterdiploma\'s', en: '3× Master\'s Degrees', id: '3× Gelar Master' },
  metaBuiltVal:     { nl: '4 productiesystemen', en: '4 Production Systems', id: '4 Sistem Produksi' },
  metaCommunityVal: { nl: '20K+ netwerk in Indonesië', en: '20K+ Network Across Indonesia', id: '20K+ Jaringan di Indonesia' },

  homeSectionWork:       { nl: 'GESELECTEERD WERK', en: 'SELECTED WORK', id: 'KARYA PILIHAN' },
  homeSectionLeadership: { nl: 'VOORBIJ DE CODE', en: 'BEYOND THE CODE', id: 'LEBIH DARI SEKADAR KODE' },
  ministriesEyebrow: { nl: 'NATIONALE IMPACT', en: 'NATIONAL IMPACT', id: 'DAMPAK NASIONAL' },
  ministriesTitle: { nl: 'Ik heb Indonesische ministeries geholpen AI-producten te bouwen', en: "I've helped Indonesian ministries build AI products", id: 'Saya membantu kementerian Indonesia membangun produk AI' },
  ministriesNote: { nl: 'Via de gemeenschappen die ik leid, heb ik meegewerkt aan AI-producten en -programma\'s voor twee Indonesische ministeries.', en: "Through the communities I lead, I've contributed AI products and programs for two Indonesian ministries.", id: 'Lewat komunitas yang saya pimpin, saya turut membangun produk dan program AI untuk dua kementerian Indonesia.' },
  viewOrg:  { nl: 'Bekijk organisatie', en: 'View organization', id: 'Lihat organisasi' },
  homeSectionResearch:   { nl: 'ONDERZOEK', en: 'RESEARCH', id: 'RISET' },
  viewAll:      { nl: 'Bekijk alles', en: 'View all', id: 'Lihat semua' },
  readMore:     { nl: 'Meer lezen', en: 'Read more', id: 'Baca selengkapnya' },
  viewCaseStudy:{ nl: 'Bekijk case study', en: 'View case study', id: 'Lihat studi kasus' },
  visitSite:    { nl: 'Bezoek live site', en: 'Visit live site', id: 'Kunjungi situs live' },
  viewScreens:  { nl: 'Bekijk screenshots', en: 'View screenshots', id: 'Lihat screenshot' },
  viewInstagram:{ nl: 'Instagram', en: 'Instagram', id: 'Instagram' },
  projectLabel: { nl: 'PROJECT', en: 'PROJECT', id: 'PROYEK' },
  close:        { nl: 'SLUITEN', en: 'CLOSE', id: 'TUTUP' },

  eduPageEyebrow: { nl: 'OVER MIJ', en: 'ABOUT ME', id: 'TENTANG SAYA' },
  eduPageTitle:   { nl: 'IK WERK TUSSEN <span class="text-accent">TECHNOLOGIE</span> EN MENSEN.', en: 'I WORK BETWEEN <span class="text-accent">TECHNOLOGY</span> AND PEOPLE.', id: 'SAYA BEKERJA DI ANTARA <span class="text-accent">TEKNOLOGI</span> DAN MANUSIA.' },
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
  experienceTitle: { nl: 'WERKERVARING', en: 'PROFESSIONAL EXPERIENCE', id: 'PENGALAMAN PROFESIONAL' },
  coursesTitle: { nl: 'CURSUSSEN & CERTIFICERINGEN', en: 'COURSES & CERTIFICATIONS', id: 'KURSUS & SERTIFIKASI' },
  achievementsTitle: { nl: 'PRESTATIES', en: 'ACHIEVEMENTS', id: 'PENCAPAIAN' },
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

  showcaseTeaserLabel: { nl: 'CONTENT & CAMPAGNE-ONTWERP', en: 'CONTENT & CAMPAIGN DESIGN', id: 'DESAIN KONTEN & KAMPANYE' },
  showcaseTeaserTitle: { nl: 'Posters, campagnes & video — door mij ontworpen en geregisseerd', en: 'Posters, campaigns & video — designed and directed by me', id: 'Poster, kampanye & video — saya rancang dan arahkan sendiri' },
  showcaseTeaserNote: { nl: 'Een blik op de content die ik maak met Creative AI Partner, het productieplatform dat ik heb gebouwd — elke poster, campagnevisual en video hieronder regisseer ik zelf, van concept tot eindresultaat.', en: 'A look at the content I create with Creative AI Partner, the production platform I built — every poster, campaign visual, and video below is directed by me, from concept to final output.', id: 'Sekilas konten yang saya buat dengan Creative AI Partner, platform produksi yang saya bangun sendiri — setiap poster, visual kampanye, dan video di bawah ini saya arahkan sendiri dari konsep sampai hasil akhir.' },
  showcaseTeaserCta: { nl: 'BEKIJK AL HET WERK', en: 'VIEW ALL THE WORK', id: 'LIHAT SEMUA KARYA' },
  showcasePageEyebrow: { nl: 'CREATIVE AI PARTNER', en: 'CREATIVE AI PARTNER', id: 'CREATIVE AI PARTNER' },
  showcasePageTitle: { nl: 'Posters, campagnes & video die ik maak', en: 'Posters, Campaigns & Video I Create', id: 'Poster, Kampanye & Video yang Saya Buat' },
  showcasePageNote: {
    nl: 'Productvisuals, campagneposters en korte video\'s die ik van concept tot eindresultaat ontwerp en regisseer — met Creative AI Partner, het productieplatform dat ik heb gebouwd.',
    en: 'Product visuals, campaign posters, and short-form video I design and direct end-to-end — from concept and art direction to final output, using Creative AI Partner, the production platform I built.',
    id: 'Visual produk, poster kampanye, dan video pendek yang saya rancang dan arahkan dari konsep sampai hasil akhir — menggunakan Creative AI Partner, platform produksi yang saya bangun sendiri.',
  },
  showcaseFilterAll: { nl: 'ALLES', en: 'ALL', id: 'SEMUA' },
  showcaseFilterVideo: { nl: 'VIDEO', en: 'VIDEO', id: 'VIDEO' },
  showcaseFilterImage: { nl: 'AFBEELDING', en: 'IMAGE', id: 'GAMBAR' },
  showcaseBadgeVideo: { nl: 'VIDEO', en: 'VIDEO', id: 'VIDEO' },
  showcaseBadgeImage: { nl: 'BEELD', en: 'IMAGE', id: 'GAMBAR' },

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
// Source of truth: CV - EGGAN NACHSON.pdf (supplied by user 2026-08-14). This
// replaces the earlier 3-entry version — the CV confirms only 2 master's-level
// items exist (no Lübeck AI degree, that VP-card bio detail is not on the CV
// and stays excluded), but adds a 4th entry (Diploma in Administration) that
// wasn't on the site at all before. Hague program hasn't started yet — CV
// marks it "Perkiraan" (estimated/expected), Sep 2026 – Aug 2027.
const EDUCATION = [
  {
    period: '2026 — 2027', periodSuffix: { nl: 'VERWACHT', en: 'EXPECTED', id: 'PERKIRAAN' },
    school: 'The Hague University of Applied Sciences', logo: 'the-hague.svg',
    degree: { nl: 'MSc Data-Driven Business', en: 'MSc Data-Driven Business', id: 'MSc Data-Driven Business' },
    place: { nl: 'Den Haag, Nederland', en: 'The Hague, Netherlands', id: 'Den Haag, Belanda' },
  },
  {
    // Confirmed by user 2026-08-15 (period April 2026 – March 2029), corroborated
    // earlier by the official Indonesia Mengglobal appointment card ("master's in
    // Artificial Intelligence from Lübeck University") — not on the CV itself, but
    // an online program the CV likely predates or omits. Explicitly noted as online
    // per user's own words, since it's a distance program, not on-campus in Germany.
    period: '2026 — 2029', periodSuffix: { nl: 'LOPEND', en: 'IN PROGRESS', id: 'SEDANG DITEMPUH' },
    school: 'Universität zu Lübeck', logo: 'uni-luebeck.svg',
    degree: { nl: 'MSc Artificial Intelligence (Online)', en: 'MSc Artificial Intelligence (Online)', id: 'MSc Artificial Intelligence (Online)' },
    place: { nl: 'Lübeck, Duitsland — online', en: 'Lübeck, Germany — online', id: 'Lübeck, Jerman — online' },
  },
  {
    period: '2023 — 2025',
    school: 'Universitas Indonesia', logo: 'universitas-indonesia.svg',
    degree: { nl: 'MSc Strategic Intelligence · GPA 3.80/4.00', en: 'MSc Strategic Intelligence · GPA 3.80/4.00', id: 'MSc Strategic Intelligence · IPK 3.80/4.00' },
    place: { nl: 'Jakarta, Indonesië', en: 'Jakarta, Indonesia', id: 'Jakarta, Indonesia' },
  },
  {
    period: '2018 — 2022',
    school: 'ITB Swadharma', logo: 'itb-swadharma.png',
    degree: { nl: 'BSc Informatics Engineering · GPA 3.18/4.00', en: 'BSc Informatics Engineering · GPA 3.18/4.00', id: 'BSc Informatics Engineering · IPK 3.18/4.00' },
    place: { nl: 'Jakarta, Indonesië', en: 'Jakarta, Indonesia', id: 'Jakarta, Indonesia' },
  },
  {
    period: '2017 — 2020',
    school: 'Universitas Indonesia', logo: 'universitas-indonesia.svg',
    degree: { nl: 'Diploma Bestuurskunde · GPA 3.42/4.00', en: 'Diploma in Administration · GPA 3.42/4.00', id: 'Diploma Administrasi · IPK 3.42/4.00' },
    place: { nl: 'Jakarta, Indonesië', en: 'Jakarta, Indonesia', id: 'Jakarta, Indonesia' },
  },
];

// ── Professional experience (Pengalaman Kerja) ──────────────────────────────
// NEW 2026-08-14, from CV — was entirely missing from the site before. Kept
// separate from LEADERSHIP below: this is paid employment, LEADERSHIP is
// volunteer/organizational roles. RISE Research Team entry is the formal
// employment record behind the P3/Reef-to-Welfare research entries already
// on /research and the LUMBUNG Jakut case study already on /work.
const EXPERIENCE = [
  {
    period: '2023 — ', periodSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' },
    org: 'MatchupSkills.id', role: { nl: 'AI Product Lead', en: 'AI Product Lead', id: 'AI Product Lead' },
    desc: {
      nl: 'AI-gedreven EdTech-platform gericht op gepersonaliseerde matching tussen vaardigheden en carrière. Herontwierp de AI content-generatiepipeline (parallel-chunk verwerking met automatische retry/fallback), wat generatiefouten met meer dan 90% verminderde over alle test-prep modules.',
      en: 'AI-driven EdTech platform focused on personalized skill-to-career matching. Redesigned the platform\'s AI content-generation pipeline (parallel-chunk processing with automatic retry/fallback), cutting generation failures by over 90% across all test-prep modules. Directs cross-functional operations for a four-division community and recruitment program.',
      id: 'Platform EdTech berbasis AI yang fokus pada pencocokan skill-ke-karier yang dipersonalisasi. Merancang ulang pipeline AI content-generation platform (pemrosesan parallel-chunk dengan retry/fallback otomatis), menurunkan kegagalan generate lebih dari 90% di semua modul test-prep. Memimpin operasi lintas-divisi untuk program komunitas & rekrutmen 4 divisi.',
    },
  },
  {
    period: '2025 — 2026',
    org: 'Universitas Indonesia — RISE Research Team', role: { nl: 'AI & Data Research Assistant (Parttime)', en: 'AI & Data Research Assistant (Part-Time)', id: 'AI & Data Research Assistant (Paruh Waktu)' },
    desc: {
      nl: 'Ontwierp en bouwde een AI- en OSINT-gebaseerd voedselzekerheid-monitoringdashboard voor zes districten in Noord-Jakarta. Droeg bij aan AI-systeemontwerp binnen twee gefinancierde onderzoeksinitiatieven — een universiteitsinnovatiebeurs en een nationale onderzoekscompetitie (zie /onderzoek). Schreef maandelijkse beleidsnota\'s en veerkracht-indexrapporten.',
      en: 'Designed and built an AI- and OSINT-based food-security monitoring dashboard for six districts in North Jakarta, integrating real-time spatial, pricing, and household-harvest data for a government food-security agency partner. Contributed AI-system design across two funded research initiatives — a university innovation grant and a national research competition (see /research) — aligned with FAO\'s Food Insecurity Experience Scale (FIES). Authored monthly policy briefs and resilience-index reports for public-sector partners.',
      id: 'Merancang dan membangun dashboard monitoring ketahanan pangan berbasis AI dan OSINT untuk enam kecamatan di Jakarta Utara, mengintegrasikan data spasial, harga, dan hasil panen rumah tangga real-time untuk mitra instansi ketahanan pangan pemerintah. Berkontribusi pada desain sistem AI di dua inisiatif riset yang didanai — hibah inovasi universitas dan kompetisi riset nasional (lihat /riset) — selaras dengan Food Insecurity Experience Scale (FIES) FAO. Menulis policy brief bulanan dan laporan indeks ketahanan.',
    },
  },
  {
    period: '2021 — 2025',
    org: 'Bank BRI', role: { nl: 'Relationship Manager, Banking Office', en: 'Relationship Manager, Banking Office', id: 'Relationship Manager, Banking Office' },
    desc: {
      nl: 'Beheerde een MKB-portefeuille van 500+ klanten in het retailsegment. Behaalde 98% claimgoedkeuring en 97% tijdige uitbetaling; verminderde verwerkingsfouten met 90% en verbeterde efficiëntie met 95%.',
      en: 'Managed an MSME portfolio of 500+ clients across the retail segment. Achieved 98% claim approval and 97% on-time disbursement; reduced processing errors by 90% and improved efficiency by 95%.',
      id: 'Mengelola portofolio UMKM 500+ klien di segmen retail. Meraih 98% persetujuan klaim dan 97% pencairan tepat waktu; menurunkan kesalahan proses 90% dan meningkatkan efisiensi 95%.',
    },
  },
];

// ── Courses & certifications (Keterampilan, Prestasi & pengalaman lain) ─────
// NEW 2026-08-14, from CV — the "just a degree list" gap the user flagged.
const COURSES = [
  { year: '2023', name: 'Product Vision', org: 'MySkill.id', score: '95%' },
  { year: '2022', name: { nl: 'Java Database & Stored Procedures', en: 'Java Database & Stored Procedures', id: 'Java Database & Store Procedure' }, org: 'Dibimbing Bootcamp', score: '86%' },
  { year: '2022', name: 'Java OOP', org: 'Dibimbing Bootcamp', score: '89%' },
  { year: '2022', name: { nl: 'Android-fundamenten met Kotlin', en: 'Fundamental Android with Kotlin', id: 'Fundamental Android dengan Kotlin' }, org: 'Codingstudio', score: '80%' },
  { year: '2022', name: { nl: 'Cybersecurity op de Linux command line', en: 'Cybersecurity on the Linux Command Line', id: 'Cyber Security via Command Line Linux' }, org: 'Codingstudio', score: '86%' },
  { year: '2022', name: { nl: 'Business Analyst met Power BI', en: 'Business Analyst with Power BI', id: 'Business Analyst dengan Power BI' }, org: 'Habis Kerja', score: '95%' },
];

// ── Achievements ──────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    year: '2025',
    title: { nl: 'Finalist, Universitas Indonesia Hackathon', en: 'Finalist, University of Indonesia Hackathon', id: 'Finalis, Hackathon Universitas Indonesia' },
    desc: {
      nl: 'Ontwikkelde AI Match, een AI-gedreven matchmaking-oplossing die gebruikers koppelt op basis van vaardigheden en leerdoelen.',
      en: 'Developed AI Match, an AI-powered matchmaking solution designed to connect users based on skills and learning goals.',
      id: 'Mengembangkan AI Match, solusi matchmaking berbasis AI yang menghubungkan pengguna berdasarkan skill dan tujuan belajar.',
    },
  },
  {
    year: '2025',
    title: { nl: 'Finalist, Indonesia Incubate (Kemenparekraf)', en: 'Finalist, Indonesia Incubate Program (Ministry of Tourism & Creative Economy)', id: 'Finalis, Program Indonesia Incubate (Kemenparekraf)' },
    desc: {
      nl: 'Ontwikkelde AI Match, een AI-gebaseerd platform dat lerenden koppelt aan relevante vaardigheden en groeipaden.',
      en: 'Developed AI Match, an AI-based platform designed to connect learners with relevant skills and growth pathways.',
      id: 'Mengembangkan AI Match, platform berbasis AI yang menghubungkan pembelajar dengan skill dan jalur pertumbuhan relevan.',
    },
  },
  {
    year: '2021',
    title: { nl: '1e Plaats, Business Competition FEB Yarsi', en: '1st Place, Business Competition FEB Yarsi', id: 'Juara 1, Business Competition FEB Yarsi' },
    desc: {
      nl: 'Creëerde een duurzaam bedrijfsmodel dat lage onderwijskwaliteit en job-mismatch oplost door een onderwijsplatform te combineren met een vacaturemarktplaats.',
      en: 'Created a sustainable business model addressing low education quality and job mismatch, by merging an education platform with a job-marketplace business model.',
      id: 'Menciptakan model bisnis berkelanjutan yang mengatasi rendahnya kualitas pendidikan dan job-mismatch, menggabungkan platform edukasi dengan marketplace lowongan kerja.',
    },
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
      nl: 'AI-platform voor het genereren van beeld-, video- en advertentiecontent, met een productiegraad kredietsysteem, abonnementen en een eigen MCP-server voor AI-assistenten.',
      en: 'AI-powered platform for generating image, video, and advertising content, with a production-grade credit system, subscriptions, and its own MCP server for AI assistants.',
      id: 'Platform berbasis AI untuk generate konten gambar, video, dan iklan, dengan sistem kredit production-grade, langganan, dan MCP server sendiri untuk AI assistant.',
    },
    highlights: {
      nl: [
        'Multi-model AI-orkestratie: fal.ai (Nano Banana Pro, GPT Image 2, Kling v3/2.5, Seedance) + Claude Vision voor referentiebeeld-analyse',
        'Atomisch kredietsysteem — optimistic locking voorkomt race conditions, deduct-before-generate met automatische terugbetaling bij falen',
        'MCP-server: gebruikers kunnen direct vanuit Claude Desktop/Code genereren met hun eigen account-krediet',
        'Abonnementsfacturering via Xendit — 30-dagen cycli, respijtperiode, geautomatiseerde herinneringsmails',
        '@mention referentiesysteem met AI-geanalyseerde stijl/kleur/mood-metadata',
        'Server-side ffmpeg audiomixing-pipeline voor video\'s met verteld verhaal',
      ],
      en: [
        'Multi-model AI orchestration: fal.ai (Nano Banana Pro, GPT Image 2, Kling v3/2.5, Seedance) + Claude Vision for reference-image analysis',
        'Atomic credit system — optimistic locking prevents race conditions, deduct-before-generate with automatic refund on failure',
        'MCP server — lets users generate directly from Claude Desktop/Code using their own account credits',
        'Subscription billing via Xendit — 30-day cycles, grace periods, automated reminder emails',
        '@mention reference system with AI-analyzed style/color/mood metadata',
        'Server-side ffmpeg audio-muxing pipeline for narrated video generation',
      ],
      id: [
        'Orkestrasi AI multi-model: fal.ai (Nano Banana Pro, GPT Image 2, Kling v3/2.5, Seedance) + Claude Vision untuk analisis gambar referensi',
        'Sistem kredit atomik — optimistic locking mencegah race condition, deduct-before-generate dengan refund otomatis saat gagal',
        'MCP server — user bisa generate langsung dari Claude Desktop/Code pakai kredit akun sendiri',
        'Billing langganan via Xendit — siklus 30 hari, masa tenggang, email pengingat otomatis',
        'Sistem referensi @mention dengan metadata gaya/warna/mood hasil analisis AI',
        'Pipeline audio-muxing ffmpeg server-side untuk video dengan narasi',
      ],
    },
    stack: ['Next.js', 'Supabase', 'Clerk', 'Xendit', 'fal.ai', 'Claude Vision', 'MCP', 'ffmpeg'],
    dir: 'cap', thumb: 'home.jpg', url: 'https://www.creativeaipartner.id',
  },
  {
    num: '02', slug: 'matchupskills',
    name: 'MatchupSkills',
    tag: { nl: 'AI-leerplatform', en: 'AI-Powered Learning Platform', id: 'Platform Belajar Berbasis AI' },
    desc: {
      nl: 'AI-gedreven edtech-platform dat studenten koppelt aan het juiste leerpad, met examensimulaties, een eigen PDF-rapportmotor en een community-programma van 4 divisies.',
      en: 'AI-driven EdTech platform that matches students with the right skills and learning path, with exam simulations, a custom PDF report engine, and a 4-division community program.',
      id: 'Platform edtech berbasis AI yang mencocokkan siswa dengan jalur belajar yang tepat, dengan simulasi ujian, PDF report engine sendiri, dan program komunitas 4 divisi.',
    },
    highlights: {
      nl: [
        'AI content-generatiepipeline herontworpen met parallel-chunk verwerking + automatische retry/fallback — generatiefouten met 90%+ verminderd',
        'IELTS/GRE/GMAT examensimulaties met adaptieve scoring',
        'Op maat gebouwde PDF-rapportmotor (eigen LaTeX-subset renderer) voor gedetailleerde scorerapporten',
        'OCR-gebaseerde financiële automatisering voor bonnetjes en administratie',
        'Community- en wervingsplatform met 4 divisies en autonome studiobeheer',
      ],
      en: [
        'Redesigned the AI content-generation pipeline with parallel-chunk processing + automatic retry/fallback — cut generation failures by 90%+',
        'IELTS/GRE/GMAT exam simulations with adaptive scoring',
        'Custom-built PDF report engine (proprietary LaTeX-subset renderer) for detailed score reports',
        'OCR-based finance automation for receipts and admin',
        'Community and recruitment platform spanning 4 divisions with autonomous studio management',
      ],
      id: [
        'Merancang ulang pipeline AI content-generation dengan pemrosesan parallel-chunk + retry/fallback otomatis — menurunkan kegagalan generate 90%+',
        'Simulasi ujian IELTS/GRE/GMAT dengan scoring adaptif',
        'PDF report engine buatan sendiri (custom LaTeX-subset renderer) untuk laporan skor detail',
        'Otomasi keuangan berbasis OCR untuk struk dan administrasi',
        'Platform komunitas & rekrutmen 4 divisi dengan manajemen studio otonom',
      ],
    },
    stack: ['Next.js', 'Supabase', 'Midtrans', 'OCR', 'PDF Engine'],
    dir: 'ms', thumb: 'home.jpg', url: 'https://www.matchupskills.id',
  },
  {
    num: '03', slug: 'lumbung-jakut',
    name: 'Lumbung Jakut',
    tag: { nl: 'Voedselzekerheidsplatform', en: 'Food Resilience Platform', id: 'Platform Ketahanan Pangan' },
    desc: {
      nl: 'AI- en OSINT-gebaseerd voedselzekerheid-dashboard voor de gemeente Jakarta Utara, uitgelijnd met de FAO Food Insecurity Experience Scale (FIES).',
      en: 'AI- and OSINT-based food-security dashboard for the North Jakarta city government, aligned with the FAO Food Insecurity Experience Scale (FIES).',
      id: 'Dashboard ketahanan pangan berbasis AI dan OSINT untuk Pemerintah Kota Jakarta Utara, selaras dengan Food Insecurity Experience Scale (FIES) FAO.',
    },
    highlights: {
      nl: [
        'Voedselzekerheid-monitoringdashboard voor 6 wijken in Noord-Jakarta, real-time spatiale, prijs- en oogstdata',
        'Voedselonzekerheidsindex volgens de FAO FIES-methodologie (SDG 2.1.2 standaard)',
        'Geautomatiseerde Word/PDF-rapportgeneratie voor maandelijkse beleidsnota\'s',
        'Excel data-invoerautomatisering voor lokale ambtenaren zonder technische achtergrond',
      ],
      en: [
        'Food-security monitoring dashboard for 6 districts in North Jakarta, integrating real-time spatial, pricing, and harvest data',
        'Food-insecurity index built on the FAO FIES methodology (SDG 2.1.2 standard)',
        'Automated Word/PDF report generation for monthly policy briefs',
        'Excel data-input automation for non-technical local government staff',
      ],
      id: [
        'Dashboard monitoring ketahanan pangan untuk 6 kecamatan di Jakarta Utara, mengintegrasikan data spasial, harga, dan hasil panen real-time',
        'Indeks ketahanan pangan berbasis metodologi FIES FAO (standar SDG 2.1.2)',
        'Generasi laporan Word/PDF otomatis untuk policy brief bulanan',
        'Otomasi input data Excel untuk staf pemerintah daerah non-teknis',
      ],
    },
    stack: ['Next.js', 'PWA', 'Report Automation'],
    dir: 'lumbung', thumb: 'home.jpg', url: 'https://lumbung.vercel.app',
  },
];

// ── National impact: ministries & institutions ──────────────────────────────
// NEW 2026-08-15 — home-page proof that the community-leadership work (ICCN,
// MatchupSkills) isn't just volunteering, it's building real AI products and
// programs alongside Indonesian government ministries and institutions.
const MINISTRIES = [
  {
    logos: [{ img: 'ekraf.png', name: 'Kementerian Ekonomi Kreatif RI' }],
    photo: 'iccn-1-headline.jpg',
    photoRatio: '1502:1870',
    ministryName: { nl: 'Ministerie van Creatieve Economie (Kemenparekraf/EKRAF)', en: 'Ministry of Creative Economy (Kemenparekraf/EKRAF)', id: 'Kementerian Ekonomi Kreatif RI (Kemenparekraf/EKRAF)' },
    desc: {
      nl: 'Als Community Director bij de Indonesian Creative Cities Network (ICCN) help ik het Ministerie van Creatieve Economie met talentontwikkeling en AI-certificering voor jonge creatieven in 38 provincies. Ik bouwde mee aan het platform daarvoor via Creative AI Partner.',
      en: 'As Community Director at the Indonesian Creative Cities Network (ICCN), I support the Ministry of Creative Economy on talent development and AI certification for young creatives across 38 provinces. I helped build the platform for it through Creative AI Partner.',
      id: 'Sebagai Community Director di Indonesian Creative Cities Network (ICCN), saya membantu Kementerian Ekonomi Kreatif dalam pengembangan talenta dan sertifikasi AI untuk kreator muda di 38 provinsi. Saya turut membangun wadahnya lewat Creative AI Partner.',
    },
    org: { name: 'Indonesian Creative Cities Network (ICCN)', url: 'https://www.instagram.com/iccnmedia/?hl=en' },
    product: { name: 'Creative AI Partner', url: 'https://www.creativeaipartner.id' },
  },
  {
    logos: [
      { text: 'Kemendiktisaintek', name: 'Kementerian Pendidikan Tinggi, Sains & Teknologi RI' },
      { img: 'lpdp.png', name: 'LPDP — Lembaga Pengelola Dana Pendidikan' },
    ],
    photo: 'ms-home.jpg',
    photoRatio: '760:475',
    ministryName: { nl: 'Ministerie van Hoger Onderwijs, Wetenschap & Technologie + LPDP', en: 'Ministry of Higher Education, Science & Technology + LPDP', id: 'Kementerian Pendidikan Tinggi, Sains & Teknologi + LPDP' },
    desc: {
      nl: 'Bij MatchupSkills bouw ik als AI Product Lead een leerplatform dat mensen helpt zich voor te bereiden op IELTS, scholarship-aanvragen, en thesis/dissertatie-schrijven — direct relevant voor het werk van het Ministerie van Hoger Onderwijs en LPDP-beursstudenten.',
      en: 'At MatchupSkills, as AI Product Lead, I build a learning platform that helps people prepare for IELTS, scholarship applications, and thesis/dissertation writing — directly relevant to the Ministry of Higher Education\'s mission and LPDP scholarship awardees.',
      id: 'Di MatchupSkills, sebagai AI Product Lead, saya membangun platform belajar yang membantu orang mempersiapkan IELTS, aplikasi beasiswa, dan penulisan tesis/disertasi — relevan langsung dengan misi Kementerian Pendidikan Tinggi dan para awardee beasiswa LPDP.',
    },
    org: null,
    product: { name: 'MatchupSkills', url: 'https://www.matchupskills.id' },
  },
];

// ── AI creative work samples (Creative AI Partner) ──────────────────────────
// Real CAP-made images/videos, referenced directly from CAP's public Supabase
// Storage bucket (permanent public URLs, not fal.ai's ~48h-expiring CDN) —
// same source data as CAP's own homepage "See What's Possible" section
// (src/data/showcaseSamples.js in the website-CAP repo). Kept out of this
// repo's own asset folder deliberately: 61 items, several tens of MB of
// video, would bloat a portfolio repo that should stay lightweight.
const SHOWCASE = [
  { type: 'image', file: '/assets/showcase-mine/3-woman-cap.png', poster: '/assets/showcase-mine/3-woman-cap.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/build-a-brand-4k.png', poster: '/assets/showcase-mine/build-a-brand-4k.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-black-spiderman-4k.png', poster: '/assets/showcase-mine/cap-black-spiderman-4k.png', ratio: '1122:1402' },
  { type: 'video', file: '/assets/showcase-mine/create-your-content-with-cap.mp4', poster: '/assets/showcase-mine/posters/create-your-content-with-cap.jpg', ratio: '720:1280' },
  { type: 'image', file: '/assets/showcase-mine/fadeaway-man.png', poster: '/assets/showcase-mine/fadeaway-man.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/man-on-the-ocean.png', poster: '/assets/showcase-mine/man-on-the-ocean.png', ratio: '1003:1568' },
  { type: 'image', file: '/assets/showcase-mine/spiderman-coffee.png', poster: '/assets/showcase-mine/spiderman-coffee.png', ratio: '1122:1402' },
  { type: 'video', file: '/assets/showcase-mine/video-ai-agency-cap-4k.mp4', poster: '/assets/showcase-mine/posters/video-ai-agency-cap-4k.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/berikut-adalah-master-prompt-y.mp4', poster: '/assets/showcase-mine/posters/berikut-adalah-master-prompt-y.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/buatkan-lagi-dengan-konsep-yan.mp4', poster: '/assets/showcase-mine/posters/buatkan-lagi-dengan-konsep-yan.jpg', ratio: '720:1280' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-11-06.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-11-06.png', ratio: '1086:1448' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-15-39.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-15-39.png', ratio: '1086:1448' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-17-41.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-17-41.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-22-08.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-22-08.png', ratio: '1023:1537' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-26-10.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-26-10.png', ratio: '1086:1448' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-27-38.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-27-38.png', ratio: '1086:1448' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-29-55.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-29-55.png', ratio: '1086:1448' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-31-43.png', poster: '/assets/showcase-mine/chatgpt-image-14-agu-2026-20-31-43.png', ratio: '1023:1537' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-7-agu-2026-17-23-06.png', poster: '/assets/showcase-mine/chatgpt-image-7-agu-2026-17-23-06.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-7-agu-2026-17-40-46.png', poster: '/assets/showcase-mine/chatgpt-image-7-agu-2026-17-40-46.png', ratio: '1003:1568' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-7-agu-2026-18-11-12.png', poster: '/assets/showcase-mine/chatgpt-image-7-agu-2026-18-11-12.png', ratio: '1122:1402' },
  { type: 'video', file: '/assets/showcase-mine/create-a-second-luxury-beve.mp4', poster: '/assets/showcase-mine/posters/create-a-second-luxury-beve.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/create-a-second-premium-cin.mp4', poster: '/assets/showcase-mine/posters/create-a-second-premium-cin.jpg', ratio: '1280:720' },
  { type: 'video', file: '/assets/showcase-mine/create-a-second-ultra-reali.mp4', poster: '/assets/showcase-mine/posters/create-a-second-ultra-reali.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/master-prompt-create-a-premium.mp4', poster: '/assets/showcase-mine/posters/master-prompt-create-a-premium.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/master-prompt-ultra-photoreali.mp4', poster: '/assets/showcase-mine/posters/master-prompt-ultra-photoreali.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/style-cinematic-pixar-inspire.mp4', poster: '/assets/showcase-mine/posters/style-cinematic-pixar-inspire.jpg', ratio: '720:1280' },
  { type: 'video', file: '/assets/showcase-mine/buatkan-vidio-lagi-dengan-kons.mp4', poster: '/assets/showcase-mine/posters/buatkan-vidio-lagi-dengan-kons.jpg', ratio: '720:1280' },
  { type: 'image', file: '/assets/showcase-mine/cap-campaign-5.png', poster: '/assets/showcase-mine/cap-campaign-5.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-cammpaign-4.png', poster: '/assets/showcase-mine/cap-cammpaign-4.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-campaign-4.png', poster: '/assets/showcase-mine/cap-campaign-4.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-campaing-1.png', poster: '/assets/showcase-mine/cap-campaing-1.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-00.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-00.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18-1.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18-1.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18-2.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18-2.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18-3.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18-3.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-18.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-19.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-26-19.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-cmapaign-2.png', poster: '/assets/showcase-mine/cap-cmapaign-2.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-build-the-scene.png', poster: '/assets/showcase-mine/cap-build-the-scene.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-frame-by-frame.png', poster: '/assets/showcase-mine/cap-frame-by-frame.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-imagine-in-motion.png', poster: '/assets/showcase-mine/cap-imagine-in-motion.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-motion-made-visible.png', poster: '/assets/showcase-mine/cap-motion-made-visible.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/cap-still-to-cinematic.png', poster: '/assets/showcase-mine/cap-still-to-cinematic.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/create-without-limits-cap.png', poster: '/assets/showcase-mine/create-without-limits-cap.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-13-17.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-13-17.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-15-17.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-15-17.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-45-51.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-45-51.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-52-01.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-14-52-01.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-15-12-13.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-15-12-13.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-15-37-46.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-15-37-46.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/chatgpt-image-11-jul-2026-16-11-24.png', poster: '/assets/showcase-mine/chatgpt-image-11-jul-2026-16-11-24.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/from-idea-to-image-cap.png', poster: '/assets/showcase-mine/from-idea-to-image-cap.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/make-every-frame-move.png', poster: '/assets/showcase-mine/make-every-frame-move.png', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-07-19-1.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-07-19-1.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-07-19.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-07-19.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-10-34.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-10-34.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-14-32.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-14-32.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-19-43.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-19-43.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-24-04.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-10-at-23-24-04.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-22-1.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-22-1.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-22.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-22.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-23.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-23.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-24.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-20-at-20-27-24.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-01-1.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-01-1.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-01.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-01.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-02.jpeg', poster: '/assets/showcase-mine/whatsapp-image-2026-07-22-at-12-20-02.jpeg', ratio: '1122:1402' },
  { type: 'image', file: '/assets/showcase-mine/agent-cap.png', poster: '/assets/showcase-mine/agent-cap.png', ratio: '1086:1448' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-bab2df.jpg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-bab2df.jpg', ratio: '681:380' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-1ae99b.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-1ae99b.jpeg', ratio: '1331:750' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-2-06efe7.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-2-06efe7.jpeg', ratio: '665:381' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-1-b378ef.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-kegiatan-masyarakat-1-b378ef.jpeg', ratio: '85:47' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-35-04-32b6de.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-35-04-32b6de.jpeg', ratio: '527:746' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-02-35-6c314d.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-02-35-6c314d.jpeg', ratio: '561:701' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-07-04-b8efe2.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-07-04-b8efe2.jpeg', ratio: '561:701' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-12-37-a309e8.jpeg', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/whatsapp-image-2026-06-20-at-11-12-37-a309e8.jpeg', ratio: '64:85' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/whatsapp-video-2026-06-07-at-6-51-51-am-2b796c.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/whatsapp-video-2026-06-07-at-6-51-51-am-a98bb8.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/coconi-5c3f88.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/coconi-0770b8.jpg', ratio: '29:52' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-4-87dac5.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-4-87dac5.png', ratio: '3:4' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-1-10d885.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-1-10d885.png', ratio: '3:4' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-5-45bcd1.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-5-45bcd1.png', ratio: '398:439' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-3-e57ade.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-3-e57ade.png', ratio: '1163:1353' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-7-a53c64.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-7-a53c64.png', ratio: '1199:1312' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/chatgpt-image-20-jun-2026-18-20-11-7b1ac0.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/chatgpt-image-20-jun-2026-18-20-11-7b1ac0.png', ratio: '3:4' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-landscape-gunung-b944d8.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-landscape-gunung-b944d8.png', ratio: '1673:940' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-6-ba6883.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-image-6-ba6883.png', ratio: '1268:1241' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-man-group-bd5f3c.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/footage-man-group-bd5f3c.png', ratio: '1672:941' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/anak-kecil-footage-368ea5.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/anak-kecil-footage-368ea5.png', ratio: '3:2' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/009fd443-0664-4223-81fa-d6fd820f489e-e9413a.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/009fd443-0664-4223-81fa-d6fd820f489e-e9413a.png', ratio: '527:746' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-gambar-2-f7b34c.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/sample-gambar-2-f7b34c.png', ratio: '561:701' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/d890d8e4-51fa-4bc3-ad9b-9c936b9ee2ae-731ccb.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/d890d8e4-51fa-4bc3-ad9b-9c936b9ee2ae-731ccb.png', ratio: '1055:1491' },
  { type: 'image', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/rumah-adat-footage-d7323f.png', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/images/rumah-adat-footage-d7323f.png', ratio: '1672:941' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/smart-door-1-f81447.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/smart-door-1-87f2f0.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/dompet-hugo-6c5738.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/dompet-hugo-b305b3.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-2-df5dcf.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-2-53bca6.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-2-d80d79.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-2-48d8e2.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-bardi-lite-2-0fc04b.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-bardi-lite-2-c78a08.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-1-96cf5f.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-1-f244d0.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-mouse-ajazz-2-3-e38f6c.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-mouse-ajazz-2-3-f8648f.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-3-889cb9.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-3-df1295.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-1-0f482b.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-1-c2c992.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/viceo-mouse-ajazz-2-2-9e966a.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/viceo-mouse-ajazz-2-2-fee8f8.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-1-5349f3.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-1-b5ec1a.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/ajazz-keys-1-41fbfd.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/ajazz-keys-1-f05a17.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/bardi-cctv-2-2-3cc639.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/bardi-cctv-2-2-b6e87b.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-1-0b85d3.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-1-ab0e5b.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/mic-ks-5-b5df97.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/mic-ks-5-9890b5.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-ajazz-mouse-2-15199c.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-ajazz-mouse-2-63e813.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/ajazz-keys-2-501855.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/ajazz-keys-2-2453da.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/ajazz-mouse-1-d7005d.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/ajazz-mouse-1-d1b527.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-mouse-ajazz-2-1-0eb493.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-mouse-ajazz-2-1-8242f3.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-bardi-sino-1-85ca17.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-bardi-sino-1-3bbf15.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/whatsapp-video-2026-05-31-at-6-41-59-pm-0d4c0a.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/whatsapp-video-2026-05-31-at-6-41-59-pm-fa76b8.jpg', ratio: '161:201' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/bardi-cctv-2-3-a1f31b.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/bardi-cctv-2-3-92a38b.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/smile-kids-and-family-4448ae.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/smile-kids-and-family-9ec407.jpg', ratio: '3:2' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/group-shot-medium-shot-dolly-in-movement-keluarga-bastem-ber-d539a4.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/group-shot-medium-shot-dolly-in-movement-keluarga-bastem-ber-281de1.jpg', ratio: '479:270' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-1-broke-my-heart-cfb4c2.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-1-broke-my-heart-233c58.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/after-enhance-4k-7ae620.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/after-enhance-4k-a0f5c5.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-3-8ef732.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-3-01bc6d.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/super-mama-ads-042eb0.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/super-mama-ads-c32cdc.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/inilah-tanah-basse-sangtempe-9cceb4.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/inilah-tanah-basse-sangtempe-0081f7.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/bagian-1-5-7f39f5.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/bagian-1-5-5dfd9f.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/drone-view-ff708f.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/drone-view-2507f6.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/forest-culture-kids-7f1d6d.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/forest-culture-kids-3b84de.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/bardi-sino-2-067f57.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/bardi-sino-2-0bced0.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/bardi-outdorr-lite-1-481ed5.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/bardi-outdorr-lite-1-523bed.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/after-enhance-4k-2-6bde89.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/after-enhance-4k-2-e59d7b.jpg', ratio: '16:9' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/video-1-980cfd.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/video-1-dd1a53.jpg', ratio: '9:16' },
  { type: 'video', file: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/videos/bastem-profile-fin-154b9e.mp4', poster: 'https://faabmvnowljdgnnvrnwh.supabase.co/storage/v1/object/public/showcase-samples/posters/bastem-profile-fin-7d97a7.jpg', ratio: '16:9' },
];

// ── Leadership & Community ──────────────────────────────────────────────────
// Synthesized from Portofolio_Eggan Nachson.pdf (11 slides) + the ICCN and
// Indonesia Mengglobal appointment cards. Entries without a clean personal
// photo (Titik Terang, YouthRanger.id) render as text/stat-forward cards
// instead of forcing a mismatched image.
const LEADERSHIP = [
  {
    year: '2025 — ', yearSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' },
    images: ['iccn-1-headline.jpg', 'iccn-2-programs.jpg', 'iccn-3-fgd-events.jpg', 'iccn-4-river.jpg'],
    link: 'https://www.instagram.com/iccnmedia/?hl=en',
    org: 'Indonesian Creative Cities Network',
    role: { nl: 'Directeur Talentontwikkeling & Certificering', en: 'Director of Talent Development & Certification', id: 'Direktur Pengembangan Talenta & Sertifikasi' },
    stat: '25K+',
    statLabel: { nl: 'Leden in het ecosysteem', en: 'Ecosystem Members', id: 'Anggota Ekosistem' },
    desc: {
      nl: 'ICCN is waar ik het Indonesische Ministerie van Creatieve Economie (Kemenparekraf) ondersteun als Community Director voor jong creatief talent — ik bouwde het platform daarvoor mee via Creative AI Partner. Leidt nationale AI- en digitale-economiecertificeringsinitiatieven in 38 provincies, beheert 120+ regionale leiders en schaalde ecosysteembetrokkenheid naar 25.000+ leden.',
      en: 'ICCN is where I support Indonesia\'s Ministry of Creative Economy (Kemenparekraf) as Community Director for young creative talent — I helped build the platform for it through Creative AI Partner. Leading national AI and digital-economy certification initiatives across 38 provinces, managing 120+ regional leaders and scaling ecosystem engagement to 25,000+ members.',
      id: 'ICCN adalah tempat saya membantu Kementerian Ekonomi Kreatif Indonesia (Kemenparekraf) sebagai Community Director untuk talenta kreatif muda — saya turut membangun wadahnya lewat Creative AI Partner. Memimpin inisiatif sertifikasi AI dan ekonomi digital nasional di 38 provinsi, mengelola 120+ pemimpin regional, dan menskalakan keterlibatan ekosistem hingga 25.000+ anggota.',
    },
  },
  {
    year: '2026', yearSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' },
    images: ['mengglobal-1-headline.jpg', 'mengglobal-2-programs.jpg', 'mengglobal-3-programs.jpg'],
    link: 'https://www.instagram.com/indonesiamengglobal/?hl=en',
    org: 'Indonesia Mengglobal',
    role: { nl: 'VP Strategische Partnerschappen & Communicatie', en: 'VP Strategic Partnerships & Communications', id: 'VP Kemitraan Strategis & Komunikasi' },
    stat: '10K+',
    statLabel: { nl: 'Studenten & leden', en: 'Scholars & Members', id: 'Scholars & Anggota' },
    desc: {
      nl: 'Leidt de divisies Partnerschappen, Events, en Branding & Communicatie. Ontwikkelt strategische samenwerkingen met universiteiten, bedrijven, NGO\'s en internationale organisaties voor Indonesië\'s grootste mentorschapsgemeenschap voor studeren in het buitenland — "Connected, Empowered, Educated".',
      en: 'Leading the Partnerships, Events, and Branding & Communications divisions. Developing strategic collaborations with universities, corporations, NGOs, and international organizations for Indonesia\'s largest overseas-education mentorship community — "Connected, Empowered, Educated".',
      id: 'Memimpin divisi Partnerships, Events, dan Branding & Communications. Mengembangkan kolaborasi strategis dengan universitas, korporasi, NGO, dan organisasi internasional untuk komunitas mentorship studi luar negeri terbesar di Indonesia — "Connected, Empowered, Educated".',
    },
  },
  {
    year: '2025', images: ['unesco-undp-1.jpg', 'unesco-undp-2.jpg'],
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
    year: '2026', images: ['timur-growth-1.jpg', 'timur-growth-2.jpg', 'timur-growth-3.jpg', 'timur-growth-4.jpg'],
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
    // Role corrected 2026-08-14 from user's CV: he's COO there, not "Chief
    // Branding & Creative" (that title came from an older self-made slide
    // deck and undersold his actual scope — CV is the authoritative source).
    year: '2024', yearSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' }, img: null,
    link: 'https://www.instagram.com/titikterangmedia/?hl=en',
    org: 'Titik Terang Community',
    role: { nl: 'Chief Operating Officer', en: 'Chief Operating Officer', id: 'Chief Operating Officer' },
    stat: '1.000+',
    statLabel: { nl: 'Community-leden', en: 'Community Members', id: 'Anggota Komunitas' },
    desc: {
      nl: 'Leidt 3 divisies met 102 medewerkers binnen creatieve en projectinitiatieven. Bouwde en beheert een creatieve-economie- en AI-community van 1.000+ leden; voerde 5+ strategische programma\'s uit met een voltooiingsgraad van 95%+.',
      en: 'Leading 3 divisions managing 102 contributors across creative and project initiatives. Grew and manages a 1,000+ member creative-economy and AI community; executed 5+ strategic programs with a 95%+ completion rate.',
      id: 'Memimpin 3 divisi dengan 102 kontributor di berbagai inisiatif kreatif dan proyek. Membangun dan mengelola komunitas ekonomi kreatif & AI dengan 1.000+ anggota; menjalankan 5+ program strategis dengan tingkat penyelesaian 95%+.',
    },
  },
  {
    year: '2025', yearSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' }, img: null,
    org: 'ILUNI UI',
    role: { nl: 'Kesekjenan (Secretariaat-Generaal)', en: 'Secretariat-General', id: 'Kesekjenan' },
    stat: '11',
    statLabel: { nl: 'Divisies onder toezicht', en: 'Divisions Overseen', id: 'Divisi Diawasi' },
    desc: {
      nl: 'Officiële alumnivereniging van Universitas Indonesia. Leidt monitoring & evaluatie over 11 divisies en 100+ organisatorische events; ontwierp een gestructureerd project-monitoringsysteem dat de coördinatie-efficiëntie tot 2× verbeterde.',
      en: 'Official alumni association of Universitas Indonesia. Leads monitoring & evaluation across 11 divisions and 100+ organizational events; designed a structured project-monitoring and reporting system that improved coordination efficiency by up to 2×.',
      id: 'Asosiasi alumni resmi Universitas Indonesia. Memimpin monitoring & evaluasi lintas 11 divisi dan 100+ event organisasi; merancang sistem monitoring & pelaporan proyek terstruktur yang meningkatkan efisiensi koordinasi hingga 2×.',
    },
  },
  {
    year: '2024', yearSuffix: { nl: 'HEDEN', en: 'PRESENT', id: 'SEKARANG' }, img: null,
    link: 'https://www.instagram.com/youthranger.id/?hl=en',
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
    year: '2023', images: ['pt-pindad-1.jpg', 'pt-pindad-2.jpg', 'pt-pindad-3.jpg', 'pt-pindad-4.jpg'],
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
    year: '2022', images: ['study-hub-1.jpg', 'study-hub-2.jpg'],
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
];

// ── Gallery (Field Notes) ───────────────────────────────────────────────────
const GALLERY = [
  { img: 'critical-grounds-stage.jpg', caption: { nl: 'Critical Grounds — gesprek op het podium', en: 'Critical Grounds — on-stage conversation', id: 'Critical Grounds — sesi panggung' } },
  { img: 'iccn-fgd-palembang.jpg', caption: { nl: 'ICCN Sumsel — focus-groepdiscussie, Palembang', en: 'ICCN Sumsel — focus group discussion, Palembang', id: 'ICCN Sumsel — focus group discussion, Palembang' } },
  { img: 'river-cleanup.jpg', caption: { nl: '"Guardians of the River" — Musi-rivier schoonmaakactie', en: '"Guardians of the River" — Musi River cleanup movement', id: '"Guardians of the River" — gerakan bersih Sungai Musi' } },
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
  {
    slug: 'proposal-p3', pages: 29,
    title: 'Smart Monitoring Food System Resilience — AI-Based Urban Farming Community in North Jakarta',
    meta: { nl: 'P3 Innovatie Financieringsprogramma, Universitas Indonesia · Rp200.000.000 toegekend', en: 'P3 Innovation Funding Program, Universitas Indonesia · Rp200,000,000 awarded', id: 'Program Pendanaan Inovasi P3, Universitas Indonesia · Rp200.000.000 disetujui' },
    authors: 'Dr. Palupi Lindiasari Samputra (Ketua), Dr. Stanislaus Riyanta, Eggan Nachson, et al. — Universitas Indonesia, dengan Sudin KPKP Jakarta Utara',
    badge: { nl: 'ONDERZOEKSVOORSTEL', en: 'RESEARCH PROPOSAL', id: 'PROPOSAL RISET' },
    abstract: {
      nl: 'De onderzoeksbasis achter LUMBUNG — het AI-dashboard voor voedselsysteemveerkracht dat hij bouwde voor de gemeente Jakarta Utara. Als research assistant ontwierp hij het AI/OSINT-gedreven monitoringsysteem, de food security-index en de maandelijkse beleidsrapportage samen met Sudin KPKP.',
      en: 'The research proposal behind LUMBUNG — the AI-powered food-system resilience dashboard he built for the North Jakarta city government. As research assistant, he designed the AI/OSINT-driven monitoring system, the food security index formula, and monthly policy reporting with partner agency Sudin KPKP.',
      id: 'Proposal riset yang menjadi dasar LUMBUNG — dashboard ketahanan pangan berbasis AI yang ia bangun untuk Pemerintah Kota Jakarta Utara. Sebagai asisten peneliti, ia merancang sistem monitoring berbasis AI/OSINT, formula indeks ketahanan pangan, dan laporan kebijakan bulanan bersama mitra Sudin KPKP.',
    },
  },
  {
    slug: 'reef-welfare', pages: 39,
    title: 'Reef to Welfare: Integrating Marine Conservation and Coastal Food-Water Security for Sustainable Livelihoods in Indonesia\'s Coral Triangle (Wakatobi)',
    meta: { nl: 'RIIM-onderzoekscompetitie (BRIN × LPDP) · Voorgesteld budget Rp500.000.000 · Internationale partner: Tokyo University of Science', en: 'RIIM Research Competition (BRIN × LPDP) · Rp500,000,000 proposed budget · International partner: Tokyo University of Science', id: 'Kompetisi Riset RIIM (BRIN × LPDP) · Anggaran diajukan Rp500.000.000 · Mitra internasional: Tokyo University of Science' },
    authors: 'Dr. Palupi Lindiasari Samputra (Ketua), Dr. Yuna Seo (Tokyo University of Science), Deden Habibi Ali Alfathimy (BRIN), Eggan Nachson — Universitas Indonesia',
    badge: { nl: 'INGEDIEND VOORSTEL', en: 'SUBMITTED PROPOSAL', id: 'PROPOSAL DIAJUKAN' },
    abstract: {
      nl: 'Nationale onderzoekscompetitie over de spanning tussen mariene bescherming en kustwelvaart in Wakatobi (Koraaldriehoek) — armoede van 14,81% naast een mariene economisch potentieel van USD 1,3 miljard/jaar. Combineert conservatiebeleid, FIES-voedselzekerheidsmeting en duurzame visserij-investering in één Resilience Water-Food-Climate-raamwerk, in samenwerking met Tokyo University of Science.',
      en: 'A national research-funding competition entry on the tension between marine conservation and coastal welfare in Wakatobi (Coral Triangle) — 14.81% poverty alongside a USD 1.3B/year marine economic potential. Combines conservation governance, FIES-based food security measurement, and sustainable fisheries investment into one Resilience Water-Food-Climate framework, in partnership with Tokyo University of Science.',
      id: 'Proposal kompetisi pendanaan riset nasional tentang ketegangan antara konservasi laut dan kesejahteraan pesisir di Wakatobi (Segitiga Karang) — kemiskinan 14,81% berdampingan dengan potensi ekonomi laut USD 1,3 miliar/tahun. Menggabungkan tata kelola konservasi, pengukuran ketahanan pangan berbasis FIES, dan investasi perikanan berkelanjutan dalam satu kerangka Resilience Water-Food-Climate, bekerja sama dengan Tokyo University of Science.',
    },
  },
];

const CONTACT = {
  location: { nl: 'Den Haag, Nederland · Jakarta, Indonesië', en: 'The Hague, Netherlands · Jakarta, Indonesia', id: 'Den Haag, Belanda · Jakarta, Indonesia' },
  email: 'nachson21@gmail.com',
  // Two separate WhatsApp lines — Indonesian number for Indonesia-based
  // contacts, Dutch number for Netherlands-based contacts (both from CV /
  // user's explicit instruction 2026-08-14, replacing the single old number).
  waIndonesia: { phone: '+62 814-0198-1855', link: 'https://wa.me/6281401981855', label: { nl: 'WhatsApp (Indonesië)', en: 'WhatsApp (Indonesia)', id: 'WhatsApp (Indonesia)' } },
  waNetherlands: { phone: '+31 6 85527266', link: 'https://wa.me/31685527266', label: { nl: 'WhatsApp (Nederland)', en: 'WhatsApp (Netherlands)', id: 'WhatsApp (Belanda)' } },
};

module.exports = { LANGS, UI, EDUCATION, EXPERIENCE, COURSES, ACHIEVEMENTS, SKILLS, PROJECTS, MINISTRIES, SHOWCASE, LEADERSHIP, GALLERY, RESEARCH, CONTACT };
