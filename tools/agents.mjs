// AI agent detail pages (/data-modeling/<slug>). One page per production agent: why it exists, the path of one
// request (clickable), the tools it may call, code, the data it keeps, guardrails and how it is measured.
// Owner rule (22 Nov 2026): show everything behind the scenes that is safe to show. Identifiers, endpoints,
// table names, keys and thresholds that matter for security are renamed or generalised in the snippets below.
// Never put real secrets, header names, project refs, internal hosts or exact rate limits here.
import { esc, hl } from './data-modeling.mjs';

const t = (en, id, nl) => [en, id, nl];

export const AGENTS_DETAIL = [
  {
    slug: 'ask-matchi', name: 'Ask Matchi', product: 'MatchupSkills',
    tag: t('An AI tutor that grades, quizzes and researches inside one chat that remembers the learner.',
      'Tutor AI yang menilai, memberi kuis, dan meriset dalam satu chat yang mengingat pelajarnya.',
      'Een AI-tutor die beoordeelt, overhoort en onderzoekt in één chat die de leerling onthoudt.'),
    facts: [
      ['12', t('learning tracks it can drive', 'jalur belajar yang bisa dijalankan', 'leertrajecten die hij aanstuurt')],
      ['73%', t('of input tokens come from the prompt cache', 'token input berasal dari prompt cache', 'van de inputtokens komt uit de promptcache')],
      ['3', t('interface languages', 'bahasa antarmuka', 'interfacetalen')],
      ['0', t('unchecked links shown to a learner', 'link yang belum dicek ditampilkan ke pelajar', 'ongecontroleerde links getoond aan een leerling')],
    ],
    why: t('Students preparing for IELTS, a scholarship or an entrance test were juggling five tools: a chatbot, a quiz app, a grader, a search engine and a notebook. Ask Matchi puts all five in one conversation. It knows the learner’s goal, level and history, so every answer starts from where they are, not from zero.',
      'Pelajar yang menyiapkan IELTS, beasiswa, atau tes masuk memakai lima alat sekaligus: chatbot, aplikasi kuis, penilai, mesin pencari, dan catatan. Ask Matchi menggabungkan kelimanya dalam satu percakapan. Ia tahu tujuan, level, dan riwayat pelajar, jadi setiap jawaban berangkat dari posisi pelajar, bukan dari nol.',
      'Studenten die zich voorbereiden op IELTS, een beurs of een toelatingstoets gebruikten vijf tools: een chatbot, een quiz-app, een beoordelaar, een zoekmachine en een notitieboek. Ask Matchi zet ze in één gesprek. Hij kent het doel, niveau en verleden van de leerling, dus elk antwoord begint waar de leerling staat.'),
    who: t('Learners on the MatchupSkills app (web and phone), in English, Indonesian or Dutch.', 'Pelajar di aplikasi MatchupSkills (web dan HP), dalam bahasa Inggris, Indonesia, atau Belanda.', 'Leerlingen in de MatchupSkills-app (web en telefoon), in het Engels, Indonesisch of Nederlands.'),
    nodes: ['Learner app', 'Gateway', 'Context', 'Claude', 'Tools', 'Database', 'Stream'],
    flow: [
      { n: 0, t: t('The learner asks', 'Pelajar bertanya', 'De leerling vraagt'), d: t('“Grade my IELTS Task 2 essay and give me a two-week plan.” The essay is attached as text.', '“Nilai esai IELTS Task 2 saya dan buatkan rencana dua minggu.” Esainya dilampirkan sebagai teks.', '“Beoordeel mijn IELTS Task 2-essay en maak een plan voor twee weken.” Het essay zit erbij als tekst.'), lang: 'js',
        code: `POST /chat
{
  "thread": "th_8f2…",
  "text": "Grade my IELTS Task 2 essay and give me a two-week plan.",
  "attachments": [{ "kind": "essay", "words": 287 }],
  "lang": "en"
}` },
      { n: 1, t: t('Gateway: who, and can they pay?', 'Gateway: siapa, dan apakah saldonya cukup?', 'Gateway: wie, en kan hij betalen?'), d: t('The session is verified and the plan and credit balance are checked before any paid model call. A learner without credits gets a clear message, never a half answer.', 'Sesi diverifikasi, lalu paket dan saldo kredit dicek sebelum ada panggilan model berbayar. Pelajar tanpa kredit mendapat pesan yang jelas, bukan jawaban setengah jadi.', 'De sessie wordt gecontroleerd en het abonnement en tegoed worden nagekeken vóór elke betaalde modelcall. Zonder tegoed krijgt de leerling een duidelijke melding, nooit een half antwoord.'), lang: 'js',
        code: `const learner = await requireLearner(req);          // signed session only
const estimate = estimateTurnCost(body, learner.plan);
if (!(await canSpend(learner, estimate)))
  return reply(402, t('Top up to continue'));       // before any model call` },
      { n: 2, t: t('Context: who is this learner?', 'Konteks: siapa pelajar ini?', 'Context: wie is deze leerling?'), d: t('The prompt is built in layers. Fixed rules and the rubric come first and are cached, so they are not paid for again on every turn. Then a short profile card, a summary of earlier threads and the new message.', 'Prompt disusun berlapis. Aturan tetap dan rubrik di depan dan di-cache, jadi tidak dibayar ulang setiap giliran. Lalu kartu profil singkat, ringkasan percakapan sebelumnya, dan pesan baru.', 'De prompt wordt in lagen gebouwd. Vaste regels en de rubric staan vooraan en worden gecachet, zodat ze niet elke beurt opnieuw betaald worden. Dan een korte profielkaart, een samenvatting van eerdere gesprekken en het nieuwe bericht.'), lang: 'js',
        code: `system: [
  { type: 'text', text: TUTOR_RULES + RUBRICS,          // ~6k tokens, same for all
    cache_control: { type: 'ephemeral' } },
  { type: 'text', text: profileCard(learner) },        // goal, level, exam date
  { type: 'text', text: await memorySummary(learner) } // earlier threads, CV reviews
]` },
      { n: 3, t: t('The model plans', 'Model merencanakan', 'Het model plant'), d: t('Claude reads the request and decides which tools it needs: grade the essay first, then check the official test dates on the web, then draw the plan. Tokens stream to the screen while it works.', 'Claude membaca permintaan dan memutuskan alat yang dibutuhkan: menilai esai dulu, lalu mengecek tanggal tes resmi di web, lalu menggambar rencana. Token mengalir ke layar selama ia bekerja.', 'Claude leest het verzoek en kiest de tools: eerst het essay beoordelen, dan de officiële testdata op het web checken, dan het plan tekenen. Tokens stromen al naar het scherm terwijl hij werkt.'), lang: 'js',
        code: `→ tool_use  grade_writing   { exam: "ielts", task: 2 }
→ tool_use  web_search      { q: "IELTS test dates The Hague 2027" }
→ tool_use  show_chart      { kind: "plan", weeks: 2 }` },
      { n: 4, t: t('Tools do the real work', 'Alat mengerjakan tugas sebenarnya', 'Tools doen het echte werk'), d: t('The grader scores the four IELTS criteria against band descriptors. Web results only reach the learner after the page is opened and checked: it must load, stay on the same site and actually contain the claim.', 'Penilai memberi skor empat kriteria IELTS berdasarkan band descriptor. Hasil web baru sampai ke pelajar setelah halamannya dibuka dan dicek: harus terbuka, tetap di situs yang sama, dan benar-benar memuat klaimnya.', 'De beoordelaar scoort de vier IELTS-criteria op de banddescriptoren. Webresultaten bereiken de leerling pas nadat de pagina is geopend en gecontroleerd: hij moet laden, op dezelfde site blijven en de bewering echt bevatten.'), lang: 'js',
        code: `{ "task_response": 6.5, "coherence": 6.0,
  "lexical": 6.5, "grammar": 6.0, "overall": 6.5,
  "fix_first": ["topic sentences", "linking beyond 'moreover'"] }

sources: 2 found · 2 opened · 1 kept (1 redirected → dropped)` },
      { n: 5, t: t('Everything is recorded', 'Semua dicatat', 'Alles wordt vastgelegd'), d: t('The result lands in the learning activity index, so the dashboard, history and streak update without extra code. Every model call is logged with its cost, and research is billed at cost plus a fixed margin.', 'Hasilnya masuk ke indeks aktivitas belajar, jadi dashboard, riwayat, dan streak ikut berubah tanpa kode tambahan. Setiap panggilan model dicatat beserta biayanya, dan riset ditagih sesuai biaya plus margin tetap.', 'Het resultaat komt in de leeractiviteitsindex, zodat dashboard, geschiedenis en streak meeveranderen zonder extra code. Elke modelcall wordt met kosten gelogd en onderzoek wordt tegen kostprijs plus vaste marge gerekend.'), lang: 'sql',
        code: `insert into writing_results (learner, exam, overall, detail)
values ($1, 'ielts', 6.5, $2);
-- trigger → learning_activity (one row per session, any feature)

insert into ai_cost_log (feature, model, input_tokens, cached_tokens, usd)
values ('matchi', 'sonnet', 7412, 5980, 0.0213);` },
      { n: 6, t: t('The answer arrives', 'Jawaban sampai', 'Het antwoord komt binnen'), d: t('The learner sees the band score, the two things to fix first, a two-week plan chart and source cards they can open. Total time to first word: about one second.', 'Pelajar melihat skor band, dua hal yang harus diperbaiki dulu, grafik rencana dua minggu, dan kartu sumber yang bisa dibuka. Waktu sampai kata pertama: sekitar satu detik.', 'De leerling ziet de bandscore, de twee eerste verbeterpunten, een plan van twee weken en bronkaarten om te openen. Tijd tot het eerste woord: ongeveer een seconde.'), lang: 'js',
        code: `stream: text · card(score) · chart(plan) · sources[1]
first_token_ms: 980   total_ms: 11240   usd: 0.031` },
    ],
    tools: [
      ['grade_writing', t('Scores IELTS, Goethe or NT2 writing against the official criteria', 'Menilai writing IELTS, Goethe, atau NT2 dengan kriteria resmi', 'Scoort IELTS-, Goethe- of NT2-schrijfwerk op de officiële criteria'), 'read', t('rubric fixed in code, not in the prompt', 'rubrik tetap di kode, bukan di prompt', 'rubric vast in code, niet in de prompt')],
      ['quiz_start / quiz_answer', t('Runs a civil-service, entrance or language quiz inside the chat', 'Menjalankan kuis CPNS, masuk kampus, atau bahasa di chat', 'Doet een overheids-, toelatings- of taalquiz in de chat'), 'write', t('answers checked against the key, not by the model', 'jawaban dicek dengan kunci, bukan oleh model', 'antwoorden gecontroleerd met de sleutel, niet door het model')],
      ['web_search / web_fetch', t('Finds current dates, rules and scholarships with sources', 'Mencari tanggal, aturan, dan beasiswa terbaru dengan sumber', 'Zoekt actuele data, regels en beurzen met bronnen'), 'read', t('every link opened and checked before it is shown', 'setiap link dibuka dan dicek sebelum ditampilkan', 'elke link geopend en gecontroleerd vóór tonen')],
      ['show_chart', t('Draws progress, plans and comparisons', 'Menggambar progres, rencana, dan perbandingan', 'Tekent voortgang, plannen en vergelijkingen'), 'read', t('data comes from the database, not from the model', 'data dari database, bukan dari model', 'data uit de database, niet van het model')],
      ['save_opportunity', t('Saves a scholarship or job to the learner’s Finder', 'Menyimpan beasiswa atau lowongan ke Finder pelajar', 'Bewaart een beurs of vacature in de Finder van de leerling'), 'write', t('only to the learner’s own list', 'hanya ke daftar milik pelajar sendiri', 'alleen in de eigen lijst van de leerling')],
      ['recall', t('Opens an earlier thread or CV review when the learner refers to it', 'Membuka percakapan atau review CV sebelumnya bila pelajar menyebutnya', 'Opent een eerder gesprek of cv-review als de leerling ernaar verwijst'), 'read', t('scoped to one account', 'dibatasi pada satu akun', 'beperkt tot één account')],
    ],
    code: [
      { file: 'matchi/verify_link.js', lang: 'js', note: t('A cited source must survive four checks before the learner sees it.', 'Sumber yang dikutip harus lolos empat cek sebelum dilihat pelajar.', 'Een geciteerde bron moet vier controles doorstaan voordat de leerling hem ziet.'),
        src: `export async function verifyLink(url, claim) {
  const u = new URL(url);
  if (u.protocol !== 'https:' || isPrivateHost(u.hostname)) return drop('unsafe');

  const res = await fetch(u, { redirect: 'manual', signal: timeout(6000) });
  if (res.status >= 300 && res.status < 400) {
    const to = new URL(res.headers.get('location'), u);
    if (to.hostname !== u.hostname) return drop('redirects elsewhere');
  }
  if (!res.ok) return drop('dead link');

  const text = readable(await res.text()).slice(0, 40_000);
  if (!mentions(text, claim.keyTerms)) return drop('does not contain the claim');
  return keep({ url: u.href, title: titleOf(text) });
}` },
      { file: 'matchi/billing.js', lang: 'js', note: t('Research is charged at what it really cost, plus a fixed margin. Cached tokens are cheaper, so the learner pays less too.', 'Riset ditagih sesuai biaya sebenarnya plus margin tetap. Token dari cache lebih murah, jadi pelajar juga membayar lebih sedikit.', 'Onderzoek wordt gerekend tegen wat het echt kostte, plus een vaste marge. Gecachte tokens zijn goedkoper, dus de leerling betaalt ook minder.'),
        src: `export function creditsForTurn(usage, rates, margin = 0.5) {
  const usd =
      usage.input_fresh  * rates.input
    + usage.input_cached * rates.cached      // ~10% of the fresh price
    + usage.output       * rates.output
    + usage.searches     * rates.search;
  const charge = usd / (1 - margin);         // keep the margin on every turn
  return Math.ceil(charge * CREDITS_PER_USD);
}` },
    ],
    data: [
      ['threads · messages', t('the conversation, per learner', 'percakapan, per pelajar', 'het gesprek, per leerling'), t('kept while the account exists', 'disimpan selama akun ada', 'bewaard zolang het account bestaat')],
      ['learning_activity', t('one row per session in any feature, filled by triggers', 'satu baris per sesi di fitur apa pun, diisi trigger', 'één rij per sessie in elke functie, gevuld door triggers'), t('history and streaks', 'riwayat dan streak', 'geschiedenis en streaks')],
      ['writing_results · quiz_results', t('scores, criteria and feedback', 'skor, kriteria, dan umpan balik', 'scores, criteria en feedback'), t('kept for progress charts', 'disimpan untuk grafik progres', 'bewaard voor voortgangsgrafieken')],
      ['saved_opportunities', t('scholarships and jobs the agent found', 'beasiswa dan lowongan yang ditemukan agent', 'beurzen en vacatures die de agent vond'), t('until the learner removes them', 'sampai pelajar menghapusnya', 'tot de leerling ze verwijdert')],
      ['ai_cost_log', t('model, tokens and cost of every call', 'model, token, dan biaya setiap panggilan', 'model, tokens en kosten van elke call'), t('finance and margin reports', 'laporan keuangan dan margin', 'financiële en margerapporten')],
    ],
    guards: [
      [t('Pay before you think', 'Cek saldo sebelum berpikir', 'Eerst betalen, dan denken'), t('Credits are checked before a paid call and refunded if the call fails.', 'Kredit dicek sebelum panggilan berbayar dan dikembalikan bila gagal.', 'Tegoed wordt gecontroleerd vóór een betaalde call en teruggestort als die faalt.')],
      [t('No invented sources', 'Tidak ada sumber karangan', 'Geen verzonnen bronnen'), t('A link is shown only after it opened, stayed on its site and contained the claim.', 'Link hanya ditampilkan setelah terbuka, tetap di situsnya, dan memuat klaimnya.', 'Een link verschijnt pas als hij opende, op zijn site bleef en de bewering bevat.')],
      [t('One account, one memory', 'Satu akun, satu ingatan', 'Eén account, één geheugen'), t('Memory, recall and translations are keyed to the account, so one learner can never shape another’s answers.', 'Ingatan, recall, dan terjemahan terikat pada akun, sehingga satu pelajar tidak bisa memengaruhi jawaban pelajar lain.', 'Geheugen, recall en vertalingen hangen aan het account, dus de ene leerling kan de antwoorden van een ander nooit beïnvloeden.')],
      [t('The model proposes, the server decides', 'Model mengusulkan, server memutuskan', 'Het model stelt voor, de server beslist'), t('Every tool argument is validated on the server. The model cannot reach a table or a file directly.', 'Setiap argumen alat divalidasi di server. Model tidak bisa menyentuh tabel atau file secara langsung.', 'Elk toolargument wordt op de server gevalideerd. Het model kan nooit direct bij een tabel of bestand.')],
    ],
    quality: [
      ['73%', t('prompt-cache share of input', 'porsi prompt cache dari input', 'aandeel promptcache in input'), t('keeps a turn cheap at the same quality', 'membuat satu giliran murah dengan kualitas sama', 'houdt een beurt goedkoop bij gelijke kwaliteit')],
      ['~1 s', t('to the first streamed word', 'sampai kata pertama tampil', 'tot het eerste gestreamde woord'), t('measured per turn', 'diukur per giliran', 'per beurt gemeten')],
      ['100%', t('cited links checked', 'link sumber dicek', 'geciteerde links gecontroleerd'), t('dropped links are logged', 'link yang dibuang dicatat', 'verworpen links worden gelogd')],
    ],
    board: { title: t('What learners use it for (share of turns, last 30 days)', 'Untuk apa pelajar memakainya (porsi giliran, 30 hari terakhir)', 'Waarvoor leerlingen hem gebruiken (aandeel beurten, laatste 30 dagen)'), rows: [
      [t('Coaching chat', 'Chat pendampingan', 'Coachingchat'), 61, '61%'], [t('Quizzes', 'Kuis', 'Quizzen'), 14, '14%'], [t('Writing and speaking grades', 'Penilaian writing dan speaking', 'Schrijf- en spreekbeoordelingen'), 12, '12%'], [t('Web research with sources', 'Riset web dengan sumber', 'Webonderzoek met bronnen'), 9, '9%'], [t('Charts and plans', 'Grafik dan rencana', 'Grafieken en plannen'), 4, '4%']] },
    next: t('A voice-first speaking mock with feedback per sentence, and spaced review built on the activity index.', 'Simulasi speaking berbasis suara dengan umpan balik per kalimat, dan pengulangan berjarak dari indeks aktivitas.', 'Een spraakgestuurde speaking-oefening met feedback per zin, en gespreide herhaling op basis van de activiteitsindex.'),
  },

  {
    slug: 'career-agent', name: 'Career Agent', product: 'MatchupSkills',
    tag: t('Finds jobs, writes the documents and tracks every application until the offer.', 'Mencari lowongan, menulis dokumen, dan melacak setiap lamaran sampai tawaran kerja.', 'Zoekt vacatures, schrijft de documenten en volgt elke sollicitatie tot het aanbod.'),
    facts: [
      ['10', t('stages per application', 'tahap per lamaran', 'fases per sollicitatie')],
      ['2', t('models: small for chat, strong for documents', 'model: kecil untuk chat, kuat untuk dokumen', 'modellen: klein voor chat, sterk voor documenten')],
      ['$0.12', t('for a complete tailored CV request', 'untuk satu permintaan CV yang disesuaikan', 'voor een volledig afgestemd cv-verzoek')],
      ['0', t('facts the agent may invent', 'fakta yang boleh dikarang agent', 'feiten die de agent mag verzinnen')],
    ],
    why: t('People looking for work send dozens of applications, lose track of them and send the same generic CV everywhere. The Career Agent keeps one evidence bank of what the person really did, tailors every CV and letter from it, and keeps an honest tracker from “saved” to “hired”.', 'Pencari kerja mengirim puluhan lamaran, kehilangan jejaknya, dan mengirim CV yang sama ke mana-mana. Career Agent menyimpan satu bank bukti tentang apa yang benar-benar pernah dikerjakan orang itu, menyesuaikan setiap CV dan surat dari situ, dan menjaga tracker yang jujur dari “disimpan” sampai “diterima”.', 'Werkzoekenden sturen tientallen sollicitaties, raken het overzicht kwijt en sturen overal hetzelfde cv. De Career Agent houdt één bewijsbank bij van wat iemand echt deed, stemt elk cv en elke brief daarop af en houdt een eerlijke tracker bij van “bewaard” tot “aangenomen”.'),
    who: t('Job seekers on MatchupSkills, from students looking for an internship to professionals changing field.', 'Pencari kerja di MatchupSkills, dari mahasiswa yang mencari magang sampai profesional yang pindah bidang.', 'Werkzoekenden op MatchupSkills, van studenten die stage zoeken tot professionals die van vak wisselen.'),
    nodes: ['Job seeker', 'Gateway', 'State', 'Router', 'Tools', 'Tracker', 'Documents'],
    flow: [
      { n: 0, t: t('A job ad comes in', 'Iklan lowongan masuk', 'Er komt een vacature binnen'), d: t('The job seeker pastes an ad for a data analyst role and asks for a tailored CV.', 'Pencari kerja menempel iklan analis data dan meminta CV yang disesuaikan.', 'De werkzoekende plakt een vacature voor data-analist en vraagt een afgestemd cv.'), lang: 'js',
        code: `"Here's a Data Analyst ad (Rotterdam, hybrid). Tailor my CV and save it."` },
      { n: 2, t: t('Load the state', 'Memuat keadaan', 'De status laden'), d: t('The agent reads the profile, the evidence bank and the tracker, so it knows what was already sent and what the person can prove.', 'Agent membaca profil, bank bukti, dan tracker, jadi ia tahu apa yang sudah dikirim dan apa yang bisa dibuktikan orang itu.', 'De agent leest profiel, bewijsbank en tracker, zodat hij weet wat al verstuurd is en wat de persoon kan bewijzen.'), lang: 'js',
        code: `career_get_state() → { profile, evidence: 41 items, applications: 37,
  duplicates: ["same company, other role (applied 9 days ago)"] }` },
      { n: 4, t: t('Save and score the job', 'Simpan dan nilai lowongan', 'Vacature bewaren en scoren'), d: t('The job is saved and scored against the evidence: required skills found, missing and risky. Here the fit is 70/100 and the agent says which gap matters.', 'Lowongan disimpan dan dinilai terhadap bukti: keterampilan wajib yang ada, yang kurang, dan yang berisiko. Di sini kecocokannya 70/100 dan agent menyebut celah mana yang penting.', 'De vacature wordt bewaard en gescoord tegen het bewijs: gevraagde vaardigheden gevonden, ontbrekend en riskant. Hier is de match 70/100 en de agent zegt welk gat telt.'), lang: 'js',
        code: `save_jobs([{ title: "Data Analyst", city: "Rotterdam" }])
score_fit → { score: 70, band: "risky",
  matched: ["SQL", "Power BI", "stakeholders"],
  missing: ["dbt"], note: "say SQL pipelines, not dbt" }` },
      { n: 3, t: t('The router steps in', 'Router turun tangan', 'De router grijpt in'), d: t('The small, fast model starts writing the CV. The router sees a document call and stops it: documents are written by the stronger model. The small model’s attempt is discarded, not shown.', 'Model kecil yang cepat mulai menulis CV. Router melihat ini panggilan dokumen dan menghentikannya: dokumen ditulis oleh model yang lebih kuat. Percobaan model kecil dibuang, tidak ditampilkan.', 'Het kleine, snelle model begint het cv. De router ziet een documentcall en stopt hem: documenten schrijft het sterke model. De poging van het kleine model wordt weggegooid, niet getoond.'), lang: 'js',
        code: `if (engine.small && calls.some(isDocumentCall)) {
  usage.void(res);                // not shown, not billed to the user
  engine = STRONG;                 // replay the same turn
  continue;
}` },
      { n: 4, t: t('Write the documents', 'Menulis dokumen', 'De documenten schrijven'), d: t('The strong model writes the CV from the evidence bank only. Every line is mapped to an evidence item; anything that cannot be mapped is removed. The CV is rendered and must fit one page.', 'Model kuat menulis CV hanya dari bank bukti. Setiap baris dipetakan ke satu bukti; yang tidak bisa dipetakan dihapus. CV dirender dan harus muat satu halaman.', 'Het sterke model schrijft het cv alleen vanuit de bewijsbank. Elke regel hoort bij een bewijsstuk; wat niet te koppelen is, verdwijnt. Het cv wordt gerenderd en moet op één pagina passen.'), lang: 'js',
        code: `build_package({ job, cv_master }) →
  claims: 14 · mapped to evidence: 14 · removed: 0
  render: CV.pdf (1 page ✓) · CV.docx · letter.pdf (1 page ✓)` },
      { n: 5, t: t('Update the tracker', 'Memperbarui tracker', 'De tracker bijwerken'), d: t('The application moves to “ready” and the timeline gets an entry. Moving it to “applied” needs the job seeker’s own click: the agent never changes a status on its own.', 'Lamaran pindah ke “siap” dan timeline mendapat catatan. Memindahkannya ke “dikirim” perlu klik pencari kerja sendiri: agent tidak pernah mengubah status sendiri.', 'De sollicitatie gaat naar “klaar” en de tijdlijn krijgt een regel. Naar “verstuurd” zetten vraagt een eigen klik van de werkzoekende: de agent verandert nooit zelf een status.'), lang: 'sql',
        code: `update applications set stage = 'ready' where id = $1 and owner = $2;
insert into application_events (application, kind, note)
values ($1, 'package_built', 'CV + letter, 1 page each');
-- 'applied' only via the owner's confirm button` },
      { n: 6, t: t('Files are delivered', 'File dikirim', 'Bestanden worden geleverd'), d: t('The job seeker gets a PDF and an editable Word file through short-lived private links. Cost of the whole request: $0.12, of which 92% is the CV itself.', 'Pencari kerja menerima PDF dan file Word yang bisa diedit lewat link privat berumur pendek. Biaya seluruh permintaan: $0,12, dan 92% di antaranya untuk CV-nya.', 'De werkzoekende krijgt een pdf en een bewerkbaar Word-bestand via kortlevende privélinks. Kosten van het hele verzoek: $0,12, waarvan 92% het cv zelf.'), lang: 'js',
        code: `turns: haiku 0.0044 · 0.0027 · 0.0025 (void) · sonnet 0.1103
total: $0.120  ·  links expire after 1 hour` },
    ],
    tools: [
      ['career_get_state', t('Profile, evidence bank and tracker in one read', 'Profil, bank bukti, dan tracker dalam satu baca', 'Profiel, bewijsbank en tracker in één keer'), 'read', t('owner only', 'hanya pemilik', 'alleen eigenaar')],
      ['save_jobs', t('Saves job ads and removes duplicates', 'Menyimpan lowongan dan membuang duplikat', 'Bewaart vacatures en verwijdert dubbele'), 'write', t('one company, one active application', 'satu perusahaan, satu lamaran aktif', 'één bedrijf, één actieve sollicitatie')],
      ['score_fit', t('Matches the ad against the evidence bank', 'Mencocokkan iklan dengan bank bukti', 'Vergelijkt de vacature met de bewijsbank'), 'read', t('scores from evidence, not from the model’s opinion', 'skor dari bukti, bukan opini model', 'score uit bewijs, niet uit de mening van het model')],
      ['build_package', t('Writes and renders the CV and letter', 'Menulis dan merender CV serta surat', 'Schrijft en rendert cv en brief'), 'write', t('strong model only; must fit one page', 'hanya model kuat; harus satu halaman', 'alleen sterk model; moet op één pagina')],
      ['update_application', t('Proposes the next stage', 'Mengusulkan tahap berikutnya', 'Stelt de volgende fase voor'), 'write', t('owner confirms every status change', 'pemilik mengonfirmasi setiap perubahan status', 'eigenaar bevestigt elke statuswijziging')],
      ['interview_prep', t('Builds likely questions from the ad and the evidence', 'Menyusun pertanyaan yang mungkin dari iklan dan bukti', 'Maakt waarschijnlijke vragen uit vacature en bewijs'), 'read', t('read only', 'hanya baca', 'alleen lezen')],
    ],
    code: [
      { file: 'career/evidence_guard.js', lang: 'js', note: t('A CV line survives only if it points to something the person really did.', 'Baris CV hanya bertahan bila menunjuk sesuatu yang benar-benar pernah dikerjakan orang itu.', 'Een cv-regel blijft alleen staan als hij verwijst naar iets wat de persoon echt deed.'),
        src: `export function keepProvenClaims(draft, evidence) {
  const byId = new Map(evidence.map((e) => [e.id, e]));
  const kept = [], removed = [];
  for (const line of draft.lines) {
    const ok = line.evidence?.length &&
      line.evidence.every((id) => byId.has(id)) &&
      numbersMatch(line.text, line.evidence.map((id) => byId.get(id)));
    (ok ? kept : removed).push(line);
  }
  return { ...draft, lines: kept, removed };   // removed lines are logged, never shown
}` },
      { file: 'career/router.js', lang: 'js', note: t('Chat runs on the small model; any document call is replayed on the strong one.', 'Chat berjalan di model kecil; setiap panggilan dokumen diulang di model kuat.', 'Chat draait op het kleine model; elke documentcall wordt herhaald op het sterke model.'),
        src: `const isDocumentCall = (c) =>
  c.name === 'build_package' || Boolean(c.input?.cv_master);

for (let round = 0; round < MAX_ROUNDS; round++) {
  const res = await model(engine).send(messages, tools);
  usage.add(engine.id, res.usage);
  const calls = res.content.filter((b) => b.type === 'tool_use');
  if (engine === SMALL && calls.some(isDocumentCall)) {
    usage.void(res); engine = STRONG; continue;
  }
  if (!calls.length) return res;
  messages.push(res, await runTools(calls, ctx));
}` },
    ],
    data: [
      ['applications', t('company, role, stage (10), fit score', 'perusahaan, peran, tahap (10), skor kecocokan', 'bedrijf, rol, fase (10), matchscore'), t('owner’s own tracker', 'tracker milik pemilik', 'eigen tracker van de eigenaar')],
      ['application_events', t('timeline: every change with who did it', 'timeline: setiap perubahan dan pelakunya', 'tijdlijn: elke wijziging en wie hem deed'), t('full history', 'riwayat lengkap', 'volledige geschiedenis')],
      ['evidence', t('roles, results, numbers the person can prove', 'peran, hasil, angka yang bisa dibuktikan', 'rollen, resultaten, cijfers die de persoon kan bewijzen'), t('edited by the owner', 'diedit oleh pemilik', 'bewerkt door de eigenaar')],
      ['documents', t('CV and letter versions per application', 'versi CV dan surat per lamaran', 'cv- en briefversies per sollicitatie'), t('private storage, signed links', 'penyimpanan privat, link bertanda tangan', 'privé-opslag, ondertekende links')],
      ['text_i18n', t('translations of the owner’s own notes', 'terjemahan catatan pemilik', 'vertalingen van eigen notities'), t('per account', 'per akun', 'per account')],
    ],
    guards: [
      [t('Evidence or nothing', 'Bukti atau tidak sama sekali', 'Bewijs of niets'), t('A claim without evidence never reaches a document.', 'Klaim tanpa bukti tidak pernah masuk dokumen.', 'Een bewering zonder bewijs komt nooit in een document.')],
      [t('Humans move the status', 'Manusia yang memindah status', 'Mensen verplaatsen de status'), t('The agent may propose “applied” or “rejected”; only the owner confirms it.', 'Agent boleh mengusulkan “dikirim” atau “ditolak”; hanya pemilik yang mengonfirmasi.', 'De agent mag “verstuurd” of “afgewezen” voorstellen; alleen de eigenaar bevestigt.')],
      [t('One company, one shot', 'Satu perusahaan, satu lamaran', 'Eén bedrijf, één kans'), t('Duplicates are flagged before a second application to the same company.', 'Duplikat ditandai sebelum lamaran kedua ke perusahaan yang sama.', 'Dubbele worden gemeld vóór een tweede sollicitatie bij hetzelfde bedrijf.')],
      [t('Private files', 'File privat', 'Privébestanden'), t('CVs live in private storage and open through links that expire within the hour.', 'CV disimpan privat dan dibuka lewat link yang kedaluwarsa dalam satu jam.', 'Cv’s staan privé en openen via links die binnen het uur verlopen.')],
    ],
    quality: [
      ['1 page', t('every CV and letter is rendered and checked', 'setiap CV dan surat dirender dan dicek', 'elk cv en elke brief wordt gerenderd en gecontroleerd'), t('a longer draft is rebuilt', 'draf yang lebih panjang dibuat ulang', 'een langer concept wordt opnieuw gebouwd')],
      ['92%', t('of request cost is the document', 'biaya permintaan untuk dokumen', 'van de verzoekkosten is het document'), t('chat stays cheap', 'chat tetap murah', 'chat blijft goedkoop')],
      ['0', t('status changes made by the agent alone', 'perubahan status oleh agent sendiri', 'statuswijzigingen door de agent alleen'), t('audited in the timeline', 'diaudit di timeline', 'gecontroleerd in de tijdlijn')],
    ],
    board: { title: t('Cost per action (USD)', 'Biaya per aksi (USD)', 'Kosten per actie (USD)'), rows: [
      [t('Chat turn (small model)', 'Giliran chat (model kecil)', 'Chatbeurt (klein model)'), 0.003, '$0.003'], [t('Fit score', 'Skor kecocokan', 'Matchscore'), 0.004, '$0.004'], [t('Interview prep', 'Persiapan wawancara', 'Gespreksvoorbereiding'), 0.009, '$0.009'], [t('Cover letter', 'Surat lamaran', 'Motivatiebrief'), 0.062, '$0.062'], [t('Tailored CV', 'CV yang disesuaikan', 'Afgestemd cv'), 0.110, '$0.110']] },
    next: t('Reading confirmation and rejection emails to suggest the next stage, and a weekly report of which roles turn into interviews.', 'Membaca email konfirmasi dan penolakan untuk mengusulkan tahap berikutnya, dan laporan mingguan peran mana yang berujung wawancara.', 'Bevestigings- en afwijzingsmails lezen om de volgende fase voor te stellen, en een weekrapport van welke rollen tot gesprekken leiden.'),
  },

  {
    slug: 'ai-interviewer', name: 'AI interviewer', product: 'CAP · MatchupSkills',
    tag: t('A seven-minute voice interview a candidate can take from any laptop, any time within 24 hours.', 'Wawancara suara tujuh menit yang bisa diikuti kandidat dari laptop mana pun, kapan saja dalam 24 jam.', 'Een spraakinterview van zeven minuten dat een kandidaat vanaf elke laptop kan doen, wanneer hij wil binnen 24 uur.'),
    facts: [
      ['24 h', t('valid link, no login needed', 'link berlaku, tanpa login', 'geldige link, zonder inloggen')],
      ['~7 min', t('per interview', 'per wawancara', 'per interview')],
      ['~$0.17', t('AI cost per interview', 'biaya AI per wawancara', 'AI-kosten per interview')],
      ['0', t('hiring decisions made by the AI', 'keputusan rekrutmen oleh AI', 'wervingsbesluiten door de AI')],
    ],
    why: t('Screening 80 applicants by phone takes a week of calls across time zones. The AI interviewer gives every candidate the same structured first conversation whenever it suits them. The team then watches the recording and reads the transcript before they decide.', 'Menyaring 80 pelamar lewat telepon butuh seminggu panggilan di zona waktu berbeda. AI interviewer memberi setiap kandidat percakapan pertama yang sama dan terstruktur, kapan pun cocok bagi mereka. Tim lalu menonton rekaman dan membaca transkrip sebelum memutuskan.', 'Tachtig sollicitanten telefonisch screenen kost een week bellen over tijdzones heen. De AI-interviewer geeft elke kandidaat hetzelfde gestructureerde eerste gesprek wanneer het hem uitkomt. Het team bekijkt daarna de opname en leest het transcript vóór het besluit.'),
    who: t('Candidates for roles at CAP and MatchupSkills; the hiring team reviews in the monitoring dashboard.', 'Kandidat untuk posisi di CAP dan MatchupSkills; tim rekrutmen meninjau di dashboard monitoring.', 'Kandidaten voor rollen bij CAP en MatchupSkills; het wervingsteam beoordeelt in het monitoringdashboard.'),
    nodes: ['Candidate', 'Link gate', 'Recorder', 'Speech→text', 'Interviewer', 'Text→speech', 'Review'],
    flow: [
      { n: 1, t: t('The link opens', 'Link dibuka', 'De link opent'), d: t('The candidate opens a personal link. It works for 24 hours, needs no account and shows exactly what will be recorded. Nothing starts without consent.', 'Kandidat membuka link pribadi. Link berlaku 24 jam, tanpa akun, dan menjelaskan apa saja yang direkam. Tidak ada yang dimulai tanpa persetujuan.', 'De kandidaat opent een persoonlijke link. Die werkt 24 uur, vraagt geen account en toont precies wat er wordt opgenomen. Niets start zonder toestemming.'), lang: 'js',
        code: `const row = await findByTokenHash(sha256(token));   // the token itself is never stored
if (!row || row.expires_at < now()) return expired();
if (!row.consent_at) return showConsent(row.position);` },
      { n: 0, t: t('Camera and microphone check', 'Cek kamera dan mikrofon', 'Camera- en microfooncheck'), d: t('A short test confirms both devices work and the voice is loud enough, before the first question is asked.', 'Tes singkat memastikan kedua perangkat berfungsi dan suara cukup keras, sebelum pertanyaan pertama.', 'Een korte test bevestigt dat beide apparaten werken en de stem luid genoeg is, vóór de eerste vraag.'), lang: 'js',
        code: `level = rms(micFrames) → 0.21  ✓ above 0.05
video  = 1280×720 @ 30fps   ✓` },
      { n: 2, t: t('Answers are recorded in chunks', 'Jawaban direkam per potongan', 'Antwoorden worden in stukken opgenomen'), d: t('Video uploads in 10-second pieces straight to private storage. If the browser crashes, at most 10 seconds are lost and the candidate can reload and continue.', 'Video diunggah per 10 detik langsung ke penyimpanan privat. Bila browser mogok, paling banyak 10 detik hilang dan kandidat bisa memuat ulang lalu lanjut.', 'Video gaat in stukken van 10 seconden direct naar privé-opslag. Crasht de browser, dan gaat hooguit 10 seconden verloren en kan de kandidaat herladen en verder.'), lang: 'js',
        code: `recorder.ondataavailable = (e) =>
  putChunk(sessionId, seq++, e.data);   // signed upload URL, private bucket
// reload = new session; the last question is asked again` },
      { n: 3, t: t('Speech becomes text', 'Suara menjadi teks', 'Spraak wordt tekst'), d: t('When the candidate stops talking, the answer is transcribed. The transcript, not the audio, is what the interviewer model reads.', 'Saat kandidat berhenti bicara, jawabannya ditranskripsi. Transkrip, bukan audio, yang dibaca model pewawancara.', 'Als de kandidaat stopt met praten, wordt het antwoord uitgeschreven. Het transcript, niet de audio, gaat naar het interviewermodel.'), lang: 'js',
        code: `{ turn: 4, seconds: 52,
  text: "In my last project I cleaned 30 thousand rows of survey data…" }` },
      { n: 4, t: t('The interviewer asks the next question', 'Pewawancara mengajukan pertanyaan berikutnya', 'De interviewer stelt de volgende vraag'), d: t('Claude follows the role’s question plan and asks one follow-up based on what was just said. The role description and plan are cached, so each turn costs fractions of a cent. Hard brakes stop any runaway: a turn limit, a cost limit and a time limit.', 'Claude mengikuti rencana pertanyaan untuk posisi itu dan mengajukan satu pertanyaan lanjutan dari jawaban terakhir. Deskripsi posisi dan rencana di-cache, jadi setiap giliran hanya sepersekian sen. Rem keras menghentikan yang kebablasan: batas giliran, batas biaya, dan batas waktu.', 'Claude volgt het vragenplan van de rol en stelt één vervolgvraag op basis van wat net gezegd is. Rolbeschrijving en plan zijn gecachet, dus elke beurt kost een fractie van een cent. Harde remmen stoppen ontsporing: een beurt-, kosten- en tijdslimiet.'), lang: 'js',
        code: `if (s.turns >= MAX_TURNS || s.usd >= MAX_USD || s.elapsed >= MAX_TIME)
  return closeWith('Thank you, that is all for today.');
const q = await interviewer.next({ plan, transcript: s.transcript });` },
      { n: 5, t: t('The question is spoken', 'Pertanyaan diucapkan', 'De vraag wordt uitgesproken'), d: t('The question is read aloud in a natural voice. If the voice service fails, a second voice takes over; if both fail, the question appears as text and the interview goes on.', 'Pertanyaan dibacakan dengan suara alami. Bila layanan suara gagal, suara kedua mengambil alih; bila keduanya gagal, pertanyaan tampil sebagai teks dan wawancara tetap berjalan.', 'De vraag wordt voorgelezen met een natuurlijke stem. Valt die dienst uit, dan neemt een tweede stem over; vallen beide uit, dan verschijnt de vraag als tekst en gaat het interview door.'), lang: 'js',
        code: `audio = await speak(q, VOICE).catch(() => speak(q, BACKUP_VOICE)).catch(() => null);
render({ text: q, audio });     // text always shown as captions` },
      { n: 6, t: t('The team reviews', 'Tim meninjau', 'Het team beoordeelt'), d: t('At the end the chunks are joined into one video without re-encoding, a structured summary is written, and the team watches and reads. The AI never moves a candidate forward or rejects one.', 'Di akhir, potongan digabung menjadi satu video tanpa encode ulang, ringkasan terstruktur ditulis, lalu tim menonton dan membaca. AI tidak pernah meloloskan atau menolak kandidat.', 'Aan het eind worden de stukken zonder hercodering tot één video samengevoegd, wordt een gestructureerde samenvatting geschreven en kijkt en leest het team. De AI laat nooit een kandidaat door of wijst hem af.'), lang: 'js',
        code: `ffmpeg -f concat -i parts.txt -c copy interview.webm   # seekable, no quality loss
summary: { strengths: 3, concerns: 2, quotes: 4 }  ·  status: unchanged` },
    ],
    tools: [
      ['open_session', t('Validates the link, consent and attempts left', 'Memvalidasi link, persetujuan, dan sisa percobaan', 'Controleert link, toestemming en resterende pogingen'), 'read', t('hashed token, 24 h expiry', 'token di-hash, berlaku 24 jam', 'gehashte token, 24 u geldig')],
      ['put_chunk', t('Stores a 10-second piece of video', 'Menyimpan potongan video 10 detik', 'Slaat een videostuk van 10 seconden op'), 'write', t('private storage only', 'hanya penyimpanan privat', 'alleen privé-opslag')],
      ['transcribe', t('Turns one answer into text', 'Mengubah satu jawaban menjadi teks', 'Zet één antwoord om in tekst'), 'read', t('cost logged per call', 'biaya dicatat per panggilan', 'kosten per call gelogd')],
      ['next_question', t('Asks the next question from the plan', 'Mengajukan pertanyaan berikutnya dari rencana', 'Stelt de volgende vraag uit het plan'), 'read', t('turn, cost and time brakes', 'rem giliran, biaya, dan waktu', 'beurt-, kosten- en tijdremmen')],
      ['finalize', t('Joins the video, writes the summary', 'Menggabung video, menulis ringkasan', 'Voegt de video samen, schrijft de samenvatting'), 'write', t('never touches the application status', 'tidak pernah menyentuh status lamaran', 'raakt nooit de sollicitatiestatus')],
      ['sweep', t('Closes abandoned sessions, retries failed summaries, deletes old videos', 'Menutup sesi yang ditinggal, mengulang ringkasan gagal, menghapus video lama', 'Sluit verlaten sessies, herhaalt mislukte samenvattingen, wist oude video’s'), 'write', t('runs every 10 minutes', 'jalan tiap 10 menit', 'draait elke 10 minuten')],
    ],
    code: [
      { file: 'interview/sweep.js', lang: 'js', note: t('A scheduled job makes sure nothing is left half-done, and that video is not kept longer than promised.', 'Job terjadwal memastikan tidak ada yang tertinggal setengah jalan, dan video tidak disimpan lebih lama dari yang dijanjikan.', 'Een geplande job zorgt dat niets half blijft liggen en dat video niet langer bewaard wordt dan beloofd.'),
        src: `export async function sweep(db, store) {
  // 1. abandoned: no answer for 15 minutes → close and summarise what exists
  for (const s of await db.silentSessions({ minutes: 15 })) await finalize(s, { partial: true });

  // 2. summaries that failed get up to three more tries
  for (const s of await db.failedSummaries({ maxTries: 3 })) await summarise(s);

  // 3. retention: video, transcript and scores go after 90 days unless hired
  for (const s of await db.olderThan({ days: 90, exceptStatus: 'hired' })) {
    await store.removeFolder(s.id);
    await db.clearPersonalData(s.id);
  }
}` },
      { file: 'interview/claim.js', lang: 'js', note: t('Three triggers may finish the same interview at once; only one wins the claim.', 'Tiga pemicu bisa menyelesaikan wawancara yang sama bersamaan; hanya satu yang menang.', 'Drie triggers kunnen hetzelfde interview tegelijk afronden; maar één wint de claim.'),
        src: `const { data } = await db.from('interviews')
  .update({ status: 'finalizing', claimed_at: new Date() })
  .eq('id', id).eq('status', 'in_progress')        // compare-and-swap
  .select('id').maybeSingle();
if (!data) return;                                   // someone else is on it` },
    ],
    data: [
      ['interviews', t('position, status, token hash, costs, timing', 'posisi, status, hash token, biaya, waktu', 'positie, status, tokenhash, kosten, timing'), t('90 days unless hired', '90 hari kecuali diterima', '90 dagen tenzij aangenomen')],
      ['recording', t('one seekable video file per interview', 'satu file video yang bisa di-seek per wawancara', 'één doorzoekbaar videobestand per interview'), t('private storage, signed links', 'penyimpanan privat, link bertanda tangan', 'privé-opslag, ondertekende links')],
      ['transcript', t('every question and answer with timestamps', 'setiap pertanyaan dan jawaban beserta waktu', 'elke vraag en elk antwoord met tijdstempel'), t('90 days unless hired', '90 hari kecuali diterima', '90 dagen tenzij aangenomen')],
      ['scorecards', t('the human interviewers’ scores', 'nilai dari pewawancara manusia', 'de scores van de menselijke interviewers'), t('with the application', 'bersama lamaran', 'bij de sollicitatie')],
    ],
    guards: [
      [t('Consent first', 'Persetujuan dulu', 'Eerst toestemming'), t('Nothing is recorded before the candidate agrees to clear terms.', 'Tidak ada yang direkam sebelum kandidat menyetujui ketentuan yang jelas.', 'Er wordt niets opgenomen vóór de kandidaat instemt met duidelijke voorwaarden.')],
      [t('Hard brakes', 'Rem keras', 'Harde remmen'), t('Each interview has a turn, cost and time ceiling, so a loop can never run up a bill.', 'Setiap wawancara punya batas giliran, biaya, dan waktu, jadi loop tidak bisa menghabiskan biaya.', 'Elk interview heeft een plafond voor beurten, kosten en tijd, dus een lus kan nooit een rekening opdrijven.')],
      [t('Humans decide', 'Manusia memutuskan', 'Mensen beslissen'), t('The AI writes a summary. Only the team moves a candidate.', 'AI menulis ringkasan. Hanya tim yang memindahkan kandidat.', 'De AI schrijft een samenvatting. Alleen het team verplaatst een kandidaat.')],
      [t('Delete on time', 'Hapus tepat waktu', 'Op tijd wissen'), t('Video and transcripts are deleted after 90 days, as the consent text promises.', 'Video dan transkrip dihapus setelah 90 hari, sesuai janji di teks persetujuan.', 'Video en transcripten worden na 90 dagen gewist, zoals de toestemmingstekst belooft.')],
    ],
    quality: [
      ['~$0.17', t('per interview, all models included', 'per wawancara, semua model', 'per interview, alle modellen'), t('logged per call', 'dicatat per panggilan', 'per call gelogd')],
      ['≤10 s', t('lost if the browser crashes', 'hilang bila browser mogok', 'verloren bij een crash'), t('chunked recording', 'rekaman per potongan', 'opname in stukken')],
      ['0', t('statuses changed by the AI', 'status yang diubah AI', 'statussen gewijzigd door de AI'), t('by design', 'disengaja dari desain', 'zo ontworpen')],
    ],
    board: { title: t('Where the money goes in one interview', 'Ke mana biaya satu wawancara', 'Waar het geld van één interview heen gaat'), rows: [
      [t('Speech to text', 'Suara ke teks', 'Spraak naar tekst'), 0.04, '$0.04'], [t('Interviewer model', 'Model pewawancara', 'Interviewermodel'), 0.06, '$0.06'], [t('Voice', 'Suara', 'Stem'), 0.07, '$0.07'], [t('Total', 'Total', 'Totaal'), 0.17, '$0.17']] },
    next: t('Safari and phone support, and a calibration report that compares the AI summary with the human scorecards.', 'Dukungan Safari dan HP, dan laporan kalibrasi yang membandingkan ringkasan AI dengan nilai pewawancara manusia.', 'Ondersteuning voor Safari en telefoon, en een kalibratierapport dat de AI-samenvatting vergelijkt met de menselijke scores.'),
  },

  {
    slug: 'aria', name: 'ARIA', product: 'CAP · MatchupSkills ops',
    tag: t('One operations chat for two companies: reports, finance, marketing and code audits, each kept in its own lane.', 'Satu chat operasional untuk dua perusahaan: laporan, keuangan, marketing, dan audit kode, masing-masing di jalurnya sendiri.', 'Eén ops-chat voor twee bedrijven: rapporten, financiën, marketing en code-audits, elk in zijn eigen baan.'),
    facts: [
      ['2', t('companies, fully separated', 'perusahaan, terpisah penuh', 'bedrijven, volledig gescheiden')],
      ['~$0.08', t('per work report (was $0.30)', 'per laporan kerja (dulu $0,30)', 'per werkrapport (was $0,30)')],
      ['214', t('isolation checks on every deploy', 'cek isolasi di setiap deploy', 'isolatiechecks bij elke deploy')],
      ['100%', t('of writes wait for a human', 'penulisan menunggu manusia', 'van de schrijfacties wacht op een mens')],
    ],
    why: t('The team was opening ten dashboards to answer one question, and writing weekly reports by hand. ARIA answers in one chat with the live numbers, drafts the report, plans content and audits code. Two companies share the platform, so the hardest rule is that each one only ever sees its own data.', 'Tim membuka sepuluh dashboard untuk menjawab satu pertanyaan, dan menulis laporan mingguan secara manual. ARIA menjawab dalam satu chat dengan angka live, menyusun laporan, merencanakan konten, dan mengaudit kode. Dua perusahaan berbagi platform, jadi aturan terberatnya: masing-masing hanya pernah melihat datanya sendiri.', 'Het team opende tien dashboards voor één vraag en schreef weekrapporten met de hand. ARIA antwoordt in één chat met de live cijfers, maakt het rapport, plant content en controleert code. Twee bedrijven delen het platform, dus de strengste regel is dat elk alleen zijn eigen data ziet.'),
    who: t('Staff of CAP and MatchupSkills, from marketing to finance, each with their own role.', 'Staf CAP dan MatchupSkills, dari marketing sampai keuangan, masing-masing dengan perannya.', 'Medewerkers van CAP en MatchupSkills, van marketing tot financiën, elk met een eigen rol.'),
    nodes: ['Team member', 'Session', 'Tenant', 'Recall', 'Claude', 'Tools', 'Approval'],
    flow: [
      { n: 0, t: t('A request', 'Sebuah permintaan', 'Een verzoek'), d: t('“Write this week’s marketing report and suggest three posts for next week.”', '“Tulis laporan marketing minggu ini dan usulkan tiga postingan untuk minggu depan.”', '“Schrijf het marketingrapport van deze week en stel drie posts voor volgende week voor.”'), lang: 'js',
        code: `"Write this week's marketing report and suggest three posts for next week."` },
      { n: 1, t: t('Role check', 'Cek peran', 'Rolcheck'), d: t('The admin session says who is asking and which role they have. A marketing role can read marketing and content; finance tools are not even offered to the model.', 'Sesi admin menunjukkan siapa yang bertanya dan perannya. Peran marketing bisa membaca marketing dan konten; alat keuangan bahkan tidak ditawarkan ke model.', 'De adminsessie zegt wie vraagt en welke rol hij heeft. Een marketingrol mag marketing en content lezen; financiële tools worden het model niet eens aangeboden.'), lang: 'js',
        code: `const me = await requireStaff(req);                 // role: marketing
const tools = TOOLS.filter((x) => x.roles.includes(me.role));
// finance_summary, payroll, users → not in the list at all` },
      { n: 2, t: t('Lock the company', 'Kunci perusahaannya', 'Het bedrijf vastzetten'), d: t('The company is taken from the login, never from the chat. Every query in this request is pinned to that company’s data. A prompt that says “show me the other company” changes nothing.', 'Perusahaan diambil dari login, bukan dari chat. Setiap query dalam permintaan ini dikunci ke data perusahaan itu. Prompt yang bilang “tunjukkan perusahaan lain” tidak mengubah apa pun.', 'Het bedrijf komt uit de login, nooit uit de chat. Elke query in dit verzoek is vastgepind op de data van dat bedrijf. Een prompt die zegt “laat het andere bedrijf zien” verandert niets.'), lang: 'js',
        code: `const tenant = tenantFor(me);                        // from the session
const db = scopedClient(tenant);                      // one schema, one storage prefix
assertTenant(db, tenant);                             // refuses the sister company` },
      { n: 3, t: t('Recall', 'Mengingat', 'Herinneren'), d: t('ARIA pulls the last report, the content plan and earlier notes from this project, so the new report continues the old one instead of starting over.', 'ARIA mengambil laporan terakhir, content plan, dan catatan sebelumnya dari proyek ini, jadi laporan baru melanjutkan yang lama, bukan mulai dari awal.', 'ARIA haalt het vorige rapport, het contentplan en eerdere notities uit dit project, zodat het nieuwe rapport verdergaat in plaats van opnieuw te beginnen.'), lang: 'js',
        code: `recall({ project: 'weekly-marketing' }) →
  last_report: "w46", plan_rows: 18, open_actions: 3` },
      { n: 4, t: t('Read the live numbers', 'Membaca angka live', 'De live cijfers lezen'), d: t('The model calls read tools: content published this week, reach and engagement, sign-ups from campaigns. Numbers come from the database, the model only writes the words around them.', 'Model memanggil alat baca: konten yang terbit minggu ini, jangkauan dan engagement, pendaftaran dari kampanye. Angka berasal dari database; model hanya menulis kata-kata di sekitarnya.', 'Het model roept leestools aan: content van deze week, bereik en engagement, aanmeldingen uit campagnes. De cijfers komen uit de database; het model schrijft alleen de woorden eromheen.'), lang: 'js',
        code: `→ query_metrics { range: "this_week", metrics: ["posts","reach","signups"] }
← { posts: 11, reach: 48210, signups: 37, best: "REL-04" }` },
      { n: 5, t: t('Draft, then wait', 'Draf, lalu menunggu', 'Concept, dan wachten'), d: t('The report and three post ideas are written as drafts. The stable instructions are cached, which is why a report now costs about eight cents instead of thirty.', 'Laporan dan tiga ide postingan ditulis sebagai draf. Instruksi tetap di-cache, itulah sebabnya laporan kini sekitar delapan sen, bukan tiga puluh.', 'Het rapport en drie postideeën worden als concept geschreven. De vaste instructies zijn gecachet, daarom kost een rapport nu ongeveer acht cent in plaats van dertig.'), lang: 'js',
        code: `→ report_save   { status: "draft" }
→ content_plan  { add: 3, status: "proposed" }      // not published` },
      { n: 6, t: t('A human approves', 'Manusia menyetujui', 'Een mens keurt goed'), d: t('Anything that leaves the building, like an email, a post or a status change, goes to an approval queue. A person with the right role presses approve; the action and the approver are logged.', 'Apa pun yang keluar dari sistem, seperti email, postingan, atau perubahan status, masuk antrean persetujuan. Orang dengan peran yang tepat menekan setuju; aksi dan penyetujunya dicatat.', 'Alles wat naar buiten gaat, zoals een e-mail, post of statuswijziging, gaat naar een goedkeuringswachtrij. Iemand met de juiste rol keurt goed; actie en goedkeurder worden gelogd.'), lang: 'sql',
        code: `insert into approvals (tenant, action, payload, requested_by)
values ($1, 'publish_post', $2, $3);       -- waits
-- on approve: run action, write audit_log (who, what, when)` },
    ],
    tools: [
      ['query_metrics', t('Reads marketing, sales and product numbers', 'Membaca angka marketing, penjualan, dan produk', 'Leest marketing-, verkoop- en productcijfers'), 'read', t('role allow-list, own company only', 'daftar peran, hanya perusahaan sendiri', 'rollenlijst, alleen eigen bedrijf')],
      ['finance_summary', t('Cash, income and costs by period', 'Kas, pemasukan, dan biaya per periode', 'Kas, inkomsten en kosten per periode'), 'read', t('finance and leadership roles only', 'hanya peran keuangan dan pimpinan', 'alleen financiële en leidinggevende rollen')],
      ['report_save', t('Saves a work report as a draft', 'Menyimpan laporan kerja sebagai draf', 'Slaat een werkrapport op als concept'), 'write', t('draft until reviewed', 'draf sampai ditinjau', 'concept tot beoordeeld')],
      ['content_plan', t('Proposes rows in the content plan', 'Mengusulkan baris di content plan', 'Stelt rijen voor in het contentplan'), 'write', t('proposed, not published', 'diusulkan, tidak diterbitkan', 'voorgesteld, niet gepubliceerd')],
      ['draft_email', t('Writes an email for a person to send', 'Menulis email untuk dikirim seseorang', 'Schrijft een e-mail die een mens verstuurt'), 'write', t('approval queue', 'antrean persetujuan', 'goedkeuringswachtrij')],
      ['code_audit', t('Reads the repository and reports risks', 'Membaca repositori dan melaporkan risiko', 'Leest de repository en meldt risico’s'), 'read', t('read-only access', 'akses hanya baca', 'alleen-lezen toegang')],
      ['recall', t('Finds earlier threads, reports and files', 'Mencari percakapan, laporan, dan file sebelumnya', 'Vindt eerdere gesprekken, rapporten en bestanden'), 'read', t('own company only', 'hanya perusahaan sendiri', 'alleen eigen bedrijf')],
    ],
    code: [
      { file: 'aria/run_tool.js', lang: 'js', note: t('Every tool call passes the same gate: role, company, then approval for anything that writes.', 'Setiap panggilan alat melewati gerbang yang sama: peran, perusahaan, lalu persetujuan untuk apa pun yang menulis.', 'Elke toolcall gaat door dezelfde poort: rol, bedrijf, en goedkeuring voor alles wat schrijft.'),
        src: `export async function runAriaTool(call, session) {
  const tool = REGISTRY[call.name];
  if (!tool || !tool.roles.includes(session.role)) return deny('not allowed for this role');

  const input = tool.schema.parse(call.input);           // reject bad arguments
  const db = scopedClient(session.tenant);              // company comes from login

  if (tool.writes) {
    const id = await queueApproval(db, { tool: call.name, input, by: session.user });
    return { status: 'waiting_for_approval', id };
  }
  const result = await tool.run(db, input);
  await audit(db, session, call.name, input);
  return redact(result);                                // no keys, no personal data
}` },
      { file: 'aria/isolation.test.js', lang: 'js', note: t('Part of the isolation suite that runs on every deploy: company A must not reach company B in any way.', 'Bagian dari suite isolasi yang jalan di setiap deploy: perusahaan A tidak boleh menjangkau perusahaan B dengan cara apa pun.', 'Deel van de isolatiesuite die bij elke deploy draait: bedrijf A mag bedrijf B op geen enkele manier bereiken.'),
        src: `for (const [me, other] of [[CAP, MS], [MS, CAP]]) {
  const db = scopedClient(me);
  await expectDenied(() => db.schema(other.schema).from('users').select('*'));
  await expectDenied(() => db.storage.from(other.bucket('files')).list());
  await expectDenied(() => runAriaTool(
    { name: 'query_metrics', input: { tenant: other.id } }, sessionOf(me)));
}` },
    ],
    data: [
      ['conversations · projects', t('threads grouped per project', 'percakapan dikelompokkan per proyek', 'gesprekken gegroepeerd per project'), t('per company', 'per perusahaan', 'per bedrijf')],
      ['reports', t('daily, weekly and monthly work reports', 'laporan kerja harian, mingguan, bulanan', 'dagelijkse, wekelijkse en maandelijkse werkrapporten'), t('archive with approval status', 'arsip dengan status persetujuan', 'archief met goedkeuringsstatus')],
      ['approvals', t('pending actions waiting for a person', 'aksi tertunda menunggu manusia', 'acties die op een mens wachten'), t('until approved or rejected', 'sampai disetujui atau ditolak', 'tot goed- of afgekeurd')],
      ['audit_log', t('who asked what, which tool ran, who approved', 'siapa bertanya apa, alat apa jalan, siapa menyetujui', 'wie wat vroeg, welke tool draaide, wie goedkeurde'), t('kept for review', 'disimpan untuk peninjauan', 'bewaard voor controle')],
    ],
    guards: [
      [t('Company from login', 'Perusahaan dari login', 'Bedrijf uit de login'), t('The tenant is never read from the chat, so no prompt can switch companies.', 'Tenant tidak pernah dibaca dari chat, jadi tidak ada prompt yang bisa berpindah perusahaan.', 'De tenant komt nooit uit de chat, dus geen prompt kan van bedrijf wisselen.')],
      [t('Tools by role', 'Alat sesuai peran', 'Tools per rol'), t('A tool the role may not use is never offered to the model at all.', 'Alat yang tidak boleh dipakai suatu peran tidak pernah ditawarkan ke model.', 'Een tool die de rol niet mag gebruiken, wordt het model nooit aangeboden.')],
      [t('Writes wait', 'Penulisan menunggu', 'Schrijven wacht'), t('Emails, posts and status changes need a person to approve.', 'Email, postingan, dan perubahan status perlu persetujuan manusia.', 'E-mails, posts en statuswijzigingen vragen goedkeuring van een mens.')],
      [t('No secrets in context', 'Tidak ada rahasia di konteks', 'Geen geheimen in de context'), t('Keys and personal data are stripped from tool results before the model sees them.', 'Kunci dan data pribadi dibuang dari hasil alat sebelum dilihat model.', 'Sleutels en persoonsgegevens worden uit toolresultaten gehaald vóór het model ze ziet.')],
    ],
    quality: [
      ['214', t('isolation checks per deploy', 'cek isolasi per deploy', 'isolatiechecks per deploy'), t('a red check blocks the release', 'cek merah menahan rilis', 'een rode check blokkeert de release')],
      ['−73%', t('report cost after prompt caching', 'biaya laporan setelah prompt caching', 'rapportkosten na promptcaching'), t('$0.30 → about $0.08', '$0,30 → sekitar $0,08', '$0,30 → ongeveer $0,08')],
      ['0', t('cross-company reads found', 'pembacaan lintas perusahaan ditemukan', 'leesacties over bedrijven heen gevonden'), t('since the shared database move', 'sejak pindah ke database bersama', 'sinds de gedeelde database')],
    ],
    board: { title: t('Cost per job, before and after prompt caching (USD)', 'Biaya per tugas, sebelum dan sesudah prompt caching (USD)', 'Kosten per taak, vóór en na promptcaching (USD)'), rows: [
      [t('Weekly report, before', 'Laporan mingguan, sebelum', 'Weekrapport, vóór'), 0.30, '$0.30'], [t('Weekly report, after', 'Laporan mingguan, sesudah', 'Weekrapport, na'), 0.08, '$0.08'], [t('Monthly report, before', 'Laporan bulanan, sebelum', 'Maandrapport, vóór'), 0.52, '$0.52'], [t('Monthly report, after', 'Laporan bulanan, sesudah', 'Maandrapport, na'), 0.12, '$0.12']] },
    next: t('Scheduled reports that write themselves on Monday morning and wait for approval, and alerts when a number moves outside its usual range.', 'Laporan terjadwal yang menulis sendiri tiap Senin pagi dan menunggu persetujuan, dan peringatan bila angka keluar dari kisaran biasanya.', 'Geplande rapporten die zichzelf op maandagochtend schrijven en op goedkeuring wachten, en alerts als een cijfer buiten zijn gewone bereik valt.'),
  },

  {
    slug: 'market-desk', name: 'Market desk', product: 'Northstar',
    tag: t('A personal market desk that reads the market, proposes trade setups and grades itself later. It never places a trade.', 'Market desk pribadi yang membaca pasar, mengusulkan setup trading, lalu menilai dirinya sendiri. Ia tidak pernah menjalankan transaksi.', 'Een persoonlijke market desk die de markt leest, trade-setups voorstelt en zichzelf later beoordeelt. Hij plaatst nooit een trade.'),
    facts: [
      ['3', t('timeframes read together: 1 h, 4 h, 1 day', 'timeframe dibaca bersama: 1 jam, 4 jam, 1 hari', 'tijdframes samen gelezen: 1 u, 4 u, 1 dag')],
      ['4', t('analysts compared: one rule-based, three AI', 'analis dibandingkan: satu berbasis aturan, tiga AI', 'analisten vergeleken: één op regels, drie AI')],
      ['100%', t('of setups graded against real prices', 'setup dinilai dengan harga nyata', 'van de setups beoordeeld op echte koersen')],
      ['0', t('trades placed', 'transaksi dijalankan', 'geplaatste trades')],
    ],
    why: t('Market opinions are cheap; tracked opinions are rare. The desk writes every idea down as a precise setup (where to enter, where it is wrong, where to take profit) before the outcome is known, then checks the real prices afterwards. Over time it learns which kinds of setups deserve trust and which do not.', 'Opini pasar itu murah; opini yang dilacak itu langka. Desk menulis setiap ide sebagai setup yang tepat (di mana masuk, di mana salah, di mana ambil untung) sebelum hasilnya diketahui, lalu mengecek harga nyata sesudahnya. Lama-lama ia tahu jenis setup mana yang layak dipercaya dan mana yang tidak.', 'Marktmeningen zijn goedkoop; bijgehouden meningen zijn zeldzaam. De desk schrijft elk idee op als precieze setup (waar instappen, waar het fout is, waar winst nemen) vóór de uitkomst bekend is, en controleert daarna de echte koersen. Zo leert hij welke soorten setups vertrouwen verdienen.'),
    who: t('Me. It is a personal research tool inside Northstar, my planning app.', 'Saya sendiri. Ini alat riset pribadi di dalam Northstar, aplikasi perencanaan saya.', 'Ikzelf. Het is een persoonlijke onderzoekstool in Northstar, mijn planningsapp.'),
    nodes: ['Scheduler', 'Market data', 'Indicators', 'Rule engine', 'AI analysts', 'Grader', 'Journal'],
    flow: [
      { n: 0, t: t('A new packet', 'Paket baru', 'Een nieuw pakket'), d: t('On a fixed schedule the desk builds a packet: one snapshot of the market that every analyst will read.', 'Pada jadwal tetap, desk menyusun paket: satu potret pasar yang dibaca semua analis.', 'Op een vast schema bouwt de desk een pakket: één momentopname van de markt die elke analist leest.'), lang: 'js',
        code: `packet { slot: "2026-11-21T08:00Z", assets: ["BTC","ETH","SOL", …],
         macro: { dxy, us10y, fear_greed }, memory: {…} }` },
      { n: 1, t: t('Fetch prices', 'Mengambil harga', 'Koersen ophalen'), d: t('Candles for three timeframes come from public market data, plus funding rates for crypto. Missing or stale data marks the asset as “no read” instead of guessing.', 'Candle untuk tiga timeframe diambil dari data pasar publik, ditambah funding rate untuk kripto. Data yang hilang atau basi menandai aset sebagai “tidak dibaca”, bukan ditebak.', 'Candles voor drie tijdframes komen uit publieke marktdata, plus fundingrates voor crypto. Ontbrekende of verouderde data maakt het asset “niet gelezen” in plaats van te gokken.'), lang: 'js',
        code: `candles("BTC", "1h", 500) · candles("BTC", "4h", 500) · candles("BTC", "1d", 400)
if (ageMinutes(last) > 2 * tfMinutes) asset.read = null;   // no stale reads` },
      { n: 2, t: t('Compute indicators', 'Menghitung indikator', 'Indicatoren berekenen'), d: t('For each timeframe: 20- and 50-period averages, RSI, MACD, average true range (how much price usually moves), and the nearest support and resistance levels.', 'Untuk setiap timeframe: rata-rata 20 dan 50 periode, RSI, MACD, average true range (seberapa jauh harga biasanya bergerak), dan level support serta resistance terdekat.', 'Per tijdframe: gemiddelden over 20 en 50 perioden, RSI, MACD, average true range (hoeveel de koers meestal beweegt) en de dichtstbijzijnde steun- en weerstandsniveaus.'), lang: 'js',
        code: `1d: { ema20: 94120, ema50: 89870, rsi14: 61, atr14: 2840, trend_score: 0.6 }
4h: { rsi14: 55, macd_hist_rising: true, trend_score: 0.4 }
1h: { trend_score: -0.2 }` },
      { n: 3, t: t('The rule engine decides a stance', 'Mesin aturan menentukan sikap', 'De regelmotor kiest een standpunt'), d: t('The three trend scores are weighted 50 / 30 / 20 (day, 4 hours, hour) into one number. That gives a stance, long, short or wait, and a setup with an entry zone, a stop placed by volatility and two targets. No AI in this step.', 'Tiga skor tren diberi bobot 50 / 30 / 20 (harian, 4 jam, 1 jam) menjadi satu angka. Hasilnya sikap: long, short, atau tunggu, dan setup dengan zona masuk, stop berdasarkan volatilitas, dan dua target. Tidak ada AI di langkah ini.', 'De drie trendscores worden 50 / 30 / 20 (dag, 4 uur, uur) gewogen tot één getal. Dat geeft een standpunt, long, short of wachten, en een setup met instapzone, een stop op basis van volatiliteit en twee doelen. Geen AI in deze stap.'), lang: 'js',
        code: `composite = 0.5*0.6 + 0.3*0.4 + 0.2*(-0.2) = 0.38  → stance: long
setup { type: "trend_pullback", entry: 93.6k–94.7k, stop: 91.2k,
        tp1: 97.9k, tp2: 101.4k, rr: 1.6 }` },
      { n: 4, t: t('AI analysts add their view', 'Analis AI menambahkan pandangan', 'AI-analisten geven hun visie'), d: t('Three AI analysts read the same packet and write their own setups with reasons. Each setup is validated: the stop must be on the losing side, targets on the winning side, and the reward at least 1.2 times the risk. Invalid setups are rejected, not fixed.', 'Tiga analis AI membaca paket yang sama dan menulis setup mereka sendiri beserta alasannya. Setiap setup divalidasi: stop harus di sisi rugi, target di sisi untung, dan imbal hasil minimal 1,2 kali risikonya. Setup yang tidak valid ditolak, tidak diperbaiki.', 'Drie AI-analisten lezen hetzelfde pakket en schrijven eigen setups met redenen. Elke setup wordt gevalideerd: de stop aan de verlieskant, doelen aan de winstkant, en de beloning minstens 1,2 keer het risico. Ongeldige setups worden afgewezen, niet gerepareerd.'), lang: 'js',
        code: `cleanSetup(ai) → rejected: "stop above entry for a long"
cleanSetup(ai) → ok { type: "breakout", rr: 2.1, confidence: 0.55 }` },
      { n: 5, t: t('Grade with real prices', 'Dinilai dengan harga nyata', 'Beoordelen met echte koersen'), d: t('Later, every setup is replayed against the candles that actually came. Did price reach the entry? Then which came first: the stop or a target? The result is written in R, the profit or loss measured in units of the risk taken.', 'Kemudian setiap setup diputar ulang terhadap candle yang benar-benar terjadi. Apakah harga mencapai zona masuk? Lalu mana yang lebih dulu: stop atau target? Hasilnya ditulis dalam R, yaitu untung atau rugi dalam satuan risiko yang diambil.', 'Later wordt elke setup afgespeeld tegen de candles die echt kwamen. Raakte de koers de instap? Wat kwam eerst: de stop of een doel? Het resultaat staat in R: winst of verlies uitgedrukt in eenheden van het genomen risico.'), lang: 'js',
        code: `grade(setup, candlesAfter) → { outcome: "tp1", r: +1.6, hours: 31 }
grade(setup2, candlesAfter) → { outcome: "stopped", r: -1.0, hours: 9 }` },
      { n: 6, t: t('Memory feeds the next packet', 'Ingatan masuk ke paket berikutnya', 'Geheugen voedt het volgende pakket'), d: t('Win rate and average R per setup type and per analyst go into the next packet, so analysts see which of their ideas actually worked. The journal keeps every call with its outcome.', 'Win rate dan rata-rata R per jenis setup dan per analis masuk ke paket berikutnya, jadi analis melihat ide mana yang benar-benar berhasil. Jurnal menyimpan setiap call beserta hasilnya.', 'Winrate en gemiddelde R per setuptype en per analist gaan het volgende pakket in, zodat analisten zien welke ideeën echt werkten. Het journaal bewaart elke call met de uitkomst.'), lang: 'js',
        code: `memory.trend_pullback = { n: 46, win: 0.54, avgR: +0.31 }
memory.mean_reversion = { n: 29, win: 0.38, avgR: -0.12, note: "skip against the daily trend" }` },
    ],
    tools: [
      ['candles / funding', t('Reads public price and funding data', 'Membaca data harga dan funding publik', 'Leest publieke koers- en fundingdata'), 'read', t('read-only, no exchange account', 'hanya baca, tanpa akun bursa', 'alleen lezen, geen beursaccount')],
      ['indicators', t('EMA, RSI, MACD, ATR, support and resistance', 'EMA, RSI, MACD, ATR, support dan resistance', 'EMA, RSI, MACD, ATR, steun en weerstand'), 'read', t('pure functions, tested', 'fungsi murni, diuji', 'pure functies, getest')],
      ['rule_setup', t('Turns the read into a stance and a setup', 'Mengubah bacaan menjadi sikap dan setup', 'Zet de lezing om in standpunt en setup'), 'read', t('no AI, no invented numbers', 'tanpa AI, tanpa angka karangan', 'geen AI, geen verzonnen cijfers')],
      ['clean_setup', t('Validates every AI setup', 'Memvalidasi setiap setup AI', 'Valideert elke AI-setup'), 'read', t('reject, never repair', 'tolak, jangan diperbaiki', 'afwijzen, nooit repareren')],
      ['grade', t('Scores setups against later candles', 'Menilai setup dengan candle sesudahnya', 'Scoort setups op latere candles'), 'write', t('only after the outcome', 'hanya setelah hasilnya ada', 'pas na de uitkomst')],
      ['journal', t('Stores every call before the outcome is known', 'Menyimpan setiap call sebelum hasilnya diketahui', 'Bewaart elke call vóór de uitkomst bekend is'), 'write', t('append only', 'hanya menambah', 'alleen toevoegen')],
    ],
    code: [
      { file: 'markets/signal.js', lang: 'js', note: t('The rule engine: weights three timeframes into one score and builds a setup with a volatility-based stop.', 'Mesin aturan: memberi bobot tiga timeframe menjadi satu skor dan membangun setup dengan stop berbasis volatilitas.', 'De regelmotor: weegt drie tijdframes tot één score en bouwt een setup met een stop op basis van volatiliteit.'),
        src: `const WEIGHT = { '1d': 0.5, '4h': 0.3, '1h': 0.2 };

export function composite(tf) {
  let s = 0, w = 0;
  for (const [k, wt] of Object.entries(WEIGHT))
    if (tf[k]?.trend_score != null) { s += tf[k].trend_score * wt; w += wt; }
  return w ? s / w : 0;
}

function setup({ direction, entryLow, entryHigh, stop, targets }) {
  const entry = (entryLow + entryHigh) / 2, risk = Math.abs(entry - stop);
  if (!risk) return null;
  const sign = direction === 'long' ? 1 : -1;
  let [tp1, tp2] = targets;
  if (tp1 == null || (tp1 - entry) * sign < 1.2 * risk) tp1 = entry + sign * 1.5 * risk;
  if (tp2 == null || (tp2 - tp1) * sign <= 0) tp2 = entry + sign * 3 * risk;
  return { direction, entryLow, entryHigh, stop, tp1, tp2,
           rr: +(Math.abs(tp1 - entry) / risk).toFixed(2) };
}` },
      { file: 'markets/grade.js', lang: 'js', note: t('The grader walks forward through real candles. If one candle touches both the stop and a target, it counts as a loss: the honest assumption.', 'Penilai berjalan maju melewati candle nyata. Bila satu candle menyentuh stop dan target sekaligus, dihitung rugi: asumsi yang jujur.', 'De beoordelaar loopt vooruit door echte candles. Raakt één candle zowel de stop als een doel, dan telt dat als verlies: de eerlijke aanname.'),
        src: `export function grade(s, candles) {
  const long = s.direction === 'long';
  let entered = false;
  for (const c of candles) {
    if (c.time > s.expires_at) return { outcome: entered ? 'expired' : 'not_triggered', r: 0 };
    if (!entered) { entered = c.low <= s.entryHigh && c.high >= s.entryLow; if (!entered) continue; }
    const hitStop = long ? c.low <= s.stop : c.high >= s.stop;
    const hitTp1  = long ? c.high >= s.tp1 : c.low <= s.tp1;
    if (hitStop) return { outcome: 'stopped', r: -1 };          // stop first if both
    if (hitTp1)  return { outcome: hitsTp2(s, c) ? 'tp2' : 'tp1', r: rOf(s, hitsTp2(s, c)) };
  }
  return { outcome: 'open', r: null };
}` },
    ],
    data: [
      ['packets', t('one market snapshot per slot', 'satu potret pasar per slot', 'één marktmomentopname per slot'), t('kept for replay', 'disimpan untuk diputar ulang', 'bewaard om opnieuw af te spelen')],
      ['reports', t('each analyst’s written view', 'pandangan tertulis tiap analis', 'de geschreven visie van elke analist'), t('kept', 'disimpan', 'bewaard')],
      ['calls (setups)', t('entry, stop, targets, reason, source', 'masuk, stop, target, alasan, sumber', 'instap, stop, doelen, reden, bron'), t('append only, written before the outcome', 'hanya menambah, ditulis sebelum hasil', 'alleen toevoegen, vóór de uitkomst')],
      ['grades', t('outcome and R per call', 'hasil dan R per call', 'uitkomst en R per call'), t('feeds the memory', 'masuk ke ingatan', 'voedt het geheugen')],
    ],
    guards: [
      [t('Analysis only', 'Hanya analisis', 'Alleen analyse'), t('There is no exchange account with trading rights anywhere in the system.', 'Tidak ada akun bursa dengan hak trading di mana pun dalam sistem.', 'Er is nergens in het systeem een beursaccount met handelsrechten.')],
      [t('No hindsight', 'Tanpa melihat ke belakang', 'Geen achteraf'), t('A call is stored before its outcome is known and can never be edited.', 'Call disimpan sebelum hasilnya diketahui dan tidak bisa diedit.', 'Een call wordt opgeslagen vóór de uitkomst bekend is en kan nooit worden aangepast.')],
      [t('Sane numbers only', 'Hanya angka yang masuk akal', 'Alleen zinnige cijfers'), t('AI setups with a stop on the wrong side or a poor reward are rejected.', 'Setup AI dengan stop di sisi yang salah atau imbal hasil buruk ditolak.', 'AI-setups met een stop aan de verkeerde kant of een slechte beloning worden afgewezen.')],
      [t('Stale data is no data', 'Data basi bukan data', 'Verouderde data is geen data'), t('If prices are late, the asset is skipped instead of read from old candles.', 'Bila harga terlambat, aset dilewati, bukan dibaca dari candle lama.', 'Zijn koersen te laat, dan wordt het asset overgeslagen in plaats van oude candles te lezen.')],
    ],
    quality: [
      ['R', t('every result measured in units of risk', 'setiap hasil diukur dalam satuan risiko', 'elk resultaat gemeten in eenheden risico'), t('comparable across assets', 'bisa dibandingkan antar aset', 'vergelijkbaar tussen assets')],
      ['4', t('analysts on one leaderboard', 'analis di satu papan peringkat', 'analisten op één ranglijst'), t('rules vs three AI analysts', 'aturan vs tiga analis AI', 'regels vs drie AI-analisten')],
      ['1×', t('call per slot per analyst', 'call per slot per analis', 'call per slot per analist'), t('no cherry-picking', 'tanpa memilih yang enak saja', 'geen cherry-picking')],
    ],
    board: { title: t('Leaderboard: average result per setup, in R', 'Papan peringkat: rata-rata hasil per setup, dalam R', 'Ranglijst: gemiddeld resultaat per setup, in R'), rows: [
      [t('Rule engine · 46 setups · 54% hit', 'Mesin aturan · 46 setup · 54% kena', 'Regelmotor · 46 setups · 54% raak'), 0.31, '+0.31 R'], [t('AI analyst C · 35 setups · 51% hit', 'Analis AI C · 35 setup · 51% kena', 'AI-analist C · 35 setups · 51% raak'), 0.22, '+0.22 R'], [t('AI analyst A · 38 setups · 48% hit', 'Analis AI A · 38 setup · 48% kena', 'AI-analist A · 38 setups · 48% raak'), 0.12, '+0.12 R'], [t('AI analyst B · 41 setups · 44% hit', 'Analis AI B · 41 setup · 44% kena', 'AI-analist B · 41 setups · 44% raak'), -0.05, '−0.05 R']] },
    next: t('US equities with company fundamentals, and position sizing that follows each setup type’s track record.', 'Saham AS dengan fundamental perusahaan, dan ukuran posisi yang mengikuti rekam jejak tiap jenis setup.', 'Amerikaanse aandelen met fundamentals, en positiegrootte die het trackrecord van elk setuptype volgt.'),
  },
];

export const AGENT_SLUGS = AGENTS_DETAIL.map((a) => a.slug);

function flowSvg(nodes) {
  const W = 980, gap = W / nodes.length, y = 70;
  const edges = nodes.slice(1).map((_, i) => `<line class="af-edge" data-edge="${i}" x1="${gap * i + gap / 2 + 50}" y1="${y}" x2="${gap * (i + 1) + gap / 2 - 50}" y2="${y}"/>`).join('');
  const boxes = nodes.map((n, i) => `<g class="af-node" data-node="${i}" transform="translate(${gap * i + gap / 2},${y})"><rect x="-58" y="-28" width="116" height="56" rx="6"/><text y="5" text-anchor="middle">${esc(n)}</text><text class="af-idx" y="-38" text-anchor="middle">${String(i + 1).padStart(2, '0')}</text></g>`).join('');
  return `<div class="dm-scroll af-svg-wrap"><svg class="af-svg" viewBox="0 0 ${W} 120" role="img" aria-label="Request path">${edges}${boxes}<circle class="af-dot" r="6" cx="${gap / 2}" cy="${y}"/></svg></div>`;
}

export function agentPage({ L, link, slug }) {
  const T3 = (a) => L(a[0], a[1], a[2]);
  const i = AGENTS_DETAIL.findIndex((a) => a.slug === slug);
  const a = AGENTS_DETAIL[i];
  const prev = AGENTS_DETAIL[(i + AGENTS_DETAIL.length - 1) % AGENTS_DETAIL.length], nxt = AGENTS_DETAIL[(i + 1) % AGENTS_DETAIL.length];
  const head = (no, title, sub = '', dark = false) => `<div class="dm-head${dark ? ' is-dark' : ''} reveal"><span class="dm-head-no">${no}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;
  const RW = { read: L('reads', 'membaca', 'leest'), write: L('writes', 'menulis', 'schrijft') };

  const facts = a.facts.map(([v, k]) => `<div class="agp-fact"><strong>${esc(v)}</strong><span>${esc(T3(k))}</span></div>`).join('');
  const steps = a.flow.map((s, k) => `<li><button type="button" data-step="${k}" data-node-ref="${s.n}" aria-pressed="${k === 0}"><span class="af-no">${String(k + 1).padStart(2, '0')}</span><span class="af-st">${esc(T3(s.t))}</span><span class="af-at">${esc(a.nodes[s.n])}</span></button></li>`).join('');
  const panels = a.flow.map((s, k) => `<div class="af-panel" data-panel="${k}" ${k ? 'hidden' : ''}><p class="af-where">${L('Step', 'Langkah', 'Stap')} ${k + 1} / ${a.flow.length} · ${esc(a.nodes[s.n])}</p><h3>${esc(T3(s.t))}</h3><p class="af-d">${esc(T3(s.d))}</p><div class="nb-cell"><div class="nb-bar"><span class="nb-dots"><i></i><i></i><i></i></span><span class="nb-file">${s.lang === 'sql' ? 'postgresql' : 'trace'}</span><button type="button" class="nb-copy" data-copy>copy</button></div><pre class="nb-code af-code"><code>${hl(s.code, s.lang)}</code></pre></div></div>`).join('');
  const tools = a.tools.map(([n, p, rw, g]) => `<tr><td><code>${esc(n)}</code></td><td>${esc(T3(p))}</td><td><span class="agp-rw is-${rw}">${RW[rw]}</span></td><td>${esc(T3(g))}</td></tr>`).join('');
  const codeTabs = a.code.map((c, k) => `<button type="button" role="tab" data-agc="${k}" aria-selected="${k === 0}"><span class="nb-tab-lang">${c.lang === 'sql' ? 'sql' : c.lang}</span>${esc(c.file)}</button>`).join('');
  const codePanes = a.code.map((c, k) => `<div class="agp-code" data-agc-pane="${k}" ${k ? 'hidden' : ''}><p class="nb-note">${esc(T3(c.note))}</p><div class="nb-cell"><div class="nb-bar"><span class="nb-dots"><i></i><i></i><i></i></span><span class="nb-file">${esc(c.file)}</span><span class="nb-lang">${c.lang === 'py' ? 'python' : c.lang === 'sql' ? 'postgresql' : 'javascript'}</span><button type="button" class="nb-copy" data-copy>copy</button></div><pre class="nb-code"><code>${hl(c.src, c.lang)}</code></pre></div></div>`).join('');
  const data = a.data.map(([n, w, k]) => `<li><code>${esc(n)}</code><span>${esc(T3(w))}</span><small>${esc(T3(k))}</small></li>`).join('');
  const guards = a.guards.map(([g, d], k) => `<li style="--i:${k}"><strong>${esc(T3(g))}</strong><span>${esc(T3(d))}</span></li>`).join('');
  const bmax = a.board ? Math.max(...a.board.rows.map((r) => Math.abs(r[1]))) : 1;
  const board = a.board ? `<div class="agp-board reveal"><p class="viz-t">${esc(T3(a.board.title))}</p>${a.board.rows.map(([k, v, d]) => `<div class="agp-brow${v < 0 ? ' is-neg' : ''}"><span>${esc(T3(k))}</span><span class="agp-bbar"><i style="width:${Math.max(2, (Math.abs(v) / bmax) * 100).toFixed(1)}%"></i></span><b>${esc(d)}</b></div>`).join('')}</div>` : '';
  const quality = a.quality.map(([v, k, n]) => `<div class="agp-q"><strong>${esc(v)}</strong><span>${esc(T3(k))}</span><small>${esc(T3(n))}</small></div>`).join('');
  const others = AGENTS_DETAIL.map((x, k) => `<a href="../${x.slug}/index.html" ${x.slug === slug ? 'aria-current="page"' : ''}><small>${String(k + 1).padStart(2, '0')}</small>${esc(x.name)}</a>`).join('');

  return `<section class="agp-hero">
  <div class="agp-crumbs">${link('data-modeling', L('Data', 'Data', 'Data'))}<span>/</span><span>${L('AI agents', 'Agent AI', 'AI-agents')}</span><span>/</span><span>${esc(a.name)}</span></div>
  <nav class="agp-switch" aria-label="${L('Other agents', 'Agent lain', 'Andere agents')}">${others}</nav>
  <p class="dm-eyebrow"><span class="dm-live"></span>${String(i + 1).padStart(2, '0')} · ${esc(a.product)} · ${L('in production', 'di produksi', 'in productie')}</p>
  <h1>${esc(a.name)}</h1>
  <p class="agp-tag">${esc(T3(a.tag))}</p>
  <div class="agp-facts">${facts}</div>
</section>
<section class="section dm-sec">${head('01', L('Why it exists', 'Mengapa dibuat', 'Waarom hij bestaat'))}
  <div class="agp-why reveal"><p>${esc(T3(a.why))}</p><aside><small>${L('Used by', 'Dipakai oleh', 'Gebruikt door')}</small><span>${esc(T3(a.who))}</span></aside></div>
</section>
<section class="section dm-sec dm-dark">${head('02', L('One request, step by step', 'Satu permintaan, langkah demi langkah', 'Eén verzoek, stap voor stap'), L('Click a step, or press play, to follow one real request through the system.', 'Klik sebuah langkah, atau tekan putar, untuk mengikuti satu permintaan nyata melewati sistem.', 'Klik op een stap, of druk op afspelen, om één echt verzoek door het systeem te volgen.'), true)}
  <div class="af" data-agent-flow>
    ${flowSvg(a.nodes)}
    <div class="af-bar"><button type="button" class="af-play" data-af-play data-l-play="${L('Play the request', 'Putar permintaannya', 'Speel het verzoek af')}" data-l-pause="${L('Pause', 'Jeda', 'Pauze')}">${L('Play the request', 'Putar permintaannya', 'Speel het verzoek af')}</button><button type="button" class="af-nav" data-af-step="-1" aria-label="${L('Previous step', 'Langkah sebelumnya', 'Vorige stap')}">←</button><button type="button" class="af-nav" data-af-step="1" aria-label="${L('Next step', 'Langkah berikutnya', 'Volgende stap')}">→</button></div>
    <div class="af-body"><ol class="af-steps">${steps}</ol><div class="af-panels" aria-live="polite">${panels}</div></div>
  </div>
</section>
<section class="section dm-sec">${head('03', L('Tools it can call', 'Alat yang bisa dipanggil', 'Tools die hij kan aanroepen'), L('The model can only act through these tools. Each one has its own rule, checked on the server.', 'Model hanya bisa bertindak lewat alat-alat ini. Masing-masing punya aturan sendiri yang dicek di server.', 'Het model kan alleen via deze tools handelen. Elke tool heeft een eigen regel, gecontroleerd op de server.'))}
  <div class="dm-scroll reveal"><table class="agp-tools"><thead><tr><th>${L('Tool', 'Alat', 'Tool')}</th><th>${L('What it does', 'Fungsinya', 'Wat hij doet')}</th><th>${L('Access', 'Akses', 'Toegang')}</th><th>${L('Rule', 'Aturan', 'Regel')}</th></tr></thead><tbody>${tools}</tbody></table></div>
</section>
<section class="section dm-sec dm-dark dm-code">${head('04', L('Code', 'Kode', 'Code'), L('Two pieces that carry the most weight in this agent.', 'Dua bagian yang paling menentukan di agent ini.', 'Twee stukken die in deze agent het zwaarst wegen.'), true)}
  <div class="nb-tabs" role="tablist" data-agc-tabs>${codeTabs}</div>${codePanes}
</section>
<section class="section dm-sec">${head('05', L('Data and guardrails', 'Data dan pengaman', 'Data en vangrails'))}
  <div class="agp-two">
    <div class="reveal"><h3 class="dm-h3">${L('What it keeps', 'Yang disimpan', 'Wat hij bewaart')}</h3><ul class="agp-data">${data}</ul></div>
    <div class="reveal"><h3 class="dm-h3">${L('What keeps it safe', 'Yang menjaganya aman', 'Wat hem veilig houdt')}</h3><ul class="agp-guards">${guards}</ul></div>
  </div>
</section>
<section class="section dm-sec">${head('06', L('How I measure it', 'Cara saya mengukurnya', 'Hoe ik hem meet'))}
  <div class="agp-qs reveal">${quality}</div>${board}
  <div class="agp-next reveal"><small>${L('Next on the roadmap', 'Berikutnya di roadmap', 'Volgende op de roadmap')}</small><p>${esc(T3(a.next))}</p></div>
  <div class="agp-pager"><a href="../${prev.slug}/index.html"><small>← ${L('Previous agent', 'Agent sebelumnya', 'Vorige agent')}</small><strong>${esc(prev.name)}</strong></a><a href="../${nxt.slug}/index.html"><small>${L('Next agent', 'Agent berikutnya', 'Volgende agent')} →</small><strong>${esc(nxt.name)}</strong></a></div>
  <div class="dm-cta">${link('data-modeling', L('Back to Data', 'Kembali ke Data', 'Terug naar Data'))}${link('contact', L('Talk about a data or AI role', 'Bicara soal peran data atau AI', 'Praat over een data- of AI-rol'))}</div>
</section>`;
}
