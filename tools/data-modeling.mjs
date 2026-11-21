// Data Modeling page (added 21 Nov 2026). Everything shown is the real structure of systems Eggan built and runs
// (MatchupSkills, Creative AI Partner, the Career Agent, the AI interviewer, ARIA). Field names are simplified and
// every value is synthetic or an aggregate: no person, email, phone, order or amount from production appears here.
// Called from tools/build.mjs with the shared helpers so the page follows the site's language + routing rules.

const esc = (s) => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// ── ER diagram renderer (inline SVG, colours come from the site's CSS tokens via classes) ─────────────────────────
const ROW = 19, HEAD = 30;
function er({ w, h, entities, rels, label }) {
  const box = Object.fromEntries(entities.map((e) => [e.id, { ...e, h: HEAD + e.fields.length * ROW + 8 }]));
  const side = (b, s) => ({ l: [b.x, b.y + b.h / 2], r: [b.x + b.w, b.y + b.h / 2], t: [b.x + b.w / 2, b.y], b: [b.x + b.w / 2, b.y + b.h] }[s]);
  const notes = [];
  const lines = rels.map(([a, sa, b, sb, card, note]) => {
    const p = side(box[a], sa), q = side(box[b], sb);
    const horiz = 'lr'.includes(sa);
    const d = horiz
      ? `M${p[0]},${p[1]} H${(p[0] + q[0]) / 2} V${q[1]} H${q[0]}`
      : `M${p[0]},${p[1]} V${(p[1] + q[1]) / 2} H${q[0]} V${q[1]}`;
    // "one" end at a, "many" (crow's foot) or "one" at b
    const dir = { l: [-1, 0], r: [1, 0], t: [0, -1], b: [0, 1] };
    const [qx, qy] = dir[sb];
    const [px, py] = dir[sa];
    const bar = (x, y, dx, dy) => `<path class="er-mark" d="M${x + dx * 9 - dy * 6},${y + dy * 9 - dx * 6} L${x + dx * 9 + dy * 6},${y + dy * 9 + dx * 6}"/>`;
    const crow = (x, y, dx, dy) => `<path class="er-mark" d="M${x + dx * 12},${y + dy * 12} L${x - dy * 7},${y + dx * 7} M${x + dx * 12},${y + dy * 12} L${x},${y} M${x + dx * 12},${y + dy * 12} L${x + dy * 7},${y - dx * 7}"/>`;
    const end = card === '1:1' ? bar(q[0], q[1], qx, qy) : crow(q[0], q[1], qx, qy);
    const mid = horiz ? [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] : [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    if (note) notes.push(`<text class="er-note" x="${mid[0]}" y="${mid[1] - 7}" text-anchor="middle">${esc(note)}</text>`);
    return `<path class="er-line" d="${d}"/>${bar(p[0], p[1], px, py)}${end}`;
  }).join('');
  const boxes = Object.values(box).map((e) => {
    const rows = e.fields.map(([n, t, k], i) => {
      const y = e.y + HEAD + 14 + i * ROW;
      const key = k ? `<text class="er-key er-key-${k.toLowerCase()}" x="${e.x + e.w - 10}" y="${y}" text-anchor="end">${k}</text>` : '';
      return `<text class="er-field" x="${e.x + 12}" y="${y}">${esc(n)}<tspan class="er-type"> ${esc(t)}</tspan></text>${key}`;
    }).join('');
    return `<g class="er-entity${e.accent ? ' is-accent' : ''}"><rect class="er-box" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="4"/><rect class="er-head" x="${e.x}" y="${e.y}" width="${e.w}" height="${HEAD}" rx="4"/><rect class="er-head" x="${e.x}" y="${e.y + HEAD - 6}" width="${e.w}" height="6"/><text class="er-title" x="${e.x + 12}" y="${e.y + 20}">${esc(e.name)}</text>${rows}</g>`;
  }).join('');
  return `<div class="dm-scroll"><svg class="er" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${lines}${boxes}${notes.join('')}</svg></div>`;
}

const MODELS = [
  {
    id: 'learning',
    kicker: 'MatchupSkills',
    title: ['Learning & monetisation', 'Pembelajaran & monetisasi', 'Leren & monetisatie'],
    text: [
      'One learner, many products. Every practice session in twelve feature tables is mirrored by a database trigger into a single activity index, so progress, dashboards and the AI tutor read one source. Money flows through an append-only subscription event log; vouchers and referral commissions are idempotent per order.',
      'Satu pelajar, banyak produk. Setiap sesi latihan di dua belas tabel fitur dicerminkan oleh trigger database ke satu indeks aktivitas, jadi progres, dashboard, dan tutor AI membaca satu sumber. Alur uang lewat log event langganan yang hanya ditambah; voucher dan komisi referral idempoten per order.',
      'Eén leerling, veel producten. Elke oefensessie in twaalf featuretabellen wordt door een databasetrigger gespiegeld naar één activiteitenindex, zodat voortgang, dashboards en de AI-tutor één bron lezen. Geld loopt via een append-only log van abonnementsgebeurtenissen; vouchers en referralcommissies zijn idempotent per order.',
    ],
    facts: [['12 → 1', ['feature tables into one activity index', 'tabel fitur menjadi satu indeks aktivitas', 'featuretabellen naar één activiteitenindex']], ['148', ['tables in an isolated schema', 'tabel dalam schema terisolasi', 'tabellen in een geïsoleerd schema']], ['0', ['double-credited payments (atomic guards)', 'pembayaran terkredit ganda (penjaga atomik)', 'dubbel gecrediteerde betalingen (atomaire guards)']]],
    svg: {
      w: 940, h: 430, label: 'Learning and monetisation entity model',
      entities: [
        { id: 'l', name: 'learner', x: 360, y: 20, w: 210, accent: true, fields: [['learner_id', 'text', 'PK'], ['plan', 'enum'], ['credits', 'int'], ['addon_credits', 'int'], ['plan_expires_at', 'tstz'], ['subscribed_since', 'tstz']] },
        { id: 't', name: 'transaction', x: 20, y: 20, w: 230, fields: [['order_id', 'text', 'PK'], ['learner_id', 'text', 'FK'], ['voucher_id', 'uuid', 'FK'], ['amount_idr', 'bigint'], ['status', 'enum'], ['paid_at', 'tstz'], ['slot_released_at', 'tstz']] },
        { id: 'v', name: 'voucher', x: 20, y: 250, w: 230, fields: [['voucher_id', 'uuid', 'PK'], ['code', 'citext', 'UQ'], ['discount_pct', '1..99'], ['max_uses', 'int'], ['expires_at', '23:59 WIB']] },
        { id: 'a', name: 'learning_activity', x: 690, y: 20, w: 230, fields: [['activity_id', 'uuid', 'PK'], ['learner_id', 'text', 'FK'], ['feature', 'enum'], ['status', 'enum'], ['score / score_max', 'num'], ['ref_table, ref_id', 'text'], ['source', 'web|voice|ai']] },
        { id: 's', name: 'subscription_event', x: 360, y: 250, w: 210, fields: [['event_id', 'uuid', 'PK'], ['learner_id', 'text', 'FK'], ['event_type', 'enum'], ['order_id', 'text', 'UQ'], ['period_start', 'tstz'], ['period_end', 'tstz']] },
        { id: 'c', name: 'referral_commission', x: 690, y: 250, w: 230, fields: [['commission_id', 'uuid', 'PK'], ['code_id', 'uuid', 'FK'], ['funnel, reference_id', 'text', 'UQ'], ['net_idr', 'bigint'], ['commission_idr', 'bigint'], ['period_key', 'YYYY-MM']] },
      ],
      rels: [['l', 'l', 't', 'r', '1:n'], ['v', 't', 't', 'b', '1:n'], ['l', 'r', 'a', 'l', '1:n', 'trigger'], ['l', 'b', 's', 't', '1:n'], ['t', 'b', 'c', 'l', '1:1']],
    },
  },
  {
    id: 'generation',
    kicker: 'Creative AI Partner',
    title: ['AI generation pipeline', 'Pipeline generasi AI', 'AI-generatiepijplijn'],
    text: [
      'Renders take longer than a web request lives, so each image or video is a job with a state machine (submitting → processing → finalizing → completed | failed). Three independent triggers can finish a job; an atomic claim guarantees exactly one project row, one cost row and at most one refund.',
      'Render lebih lama dari umur satu request web, jadi setiap gambar atau video adalah job dengan state machine (submitting → processing → finalizing → completed | failed). Tiga pemicu independen bisa menyelesaikan job; klaim atomik menjamin tepat satu baris project, satu baris biaya, dan paling banyak satu refund.',
      'Renders duren langer dan een webrequest, dus elke afbeelding of video is een job met een state machine (submitting → processing → finalizing → completed | failed). Drie onafhankelijke triggers kunnen een job afronden; een atomaire claim garandeert precies één projectrij, één kostenrij en hooguit één terugbetaling.',
    ],
    facts: [['3 → 1', ['triggers, one guaranteed result', 'pemicu, satu hasil terjamin', 'triggers, één gegarandeerd resultaat']], ['100%', ['of renders copied to owned storage', 'render disalin ke storage sendiri', 'van renders naar eigen opslag gekopieerd']], ['real time', ['cost per render, per model', 'biaya per render, per model', 'kosten per render, per model']]],
    svg: {
      w: 940, h: 400, label: 'AI generation pipeline entity model',
      entities: [
        { id: 'u', name: 'user', x: 20, y: 30, w: 200, accent: true, fields: [['user_id', 'text', 'PK'], ['plan', 'enum'], ['credits', 'int'], ['plan_expires_at', 'tstz']] },
        { id: 'j', name: 'generation_job', x: 330, y: 30, w: 250, fields: [['job_id', 'uuid', 'PK'], ['user_id', 'text', 'FK'], ['status', 'state machine'], ['provider_request_id', 'text'], ['credits', 'int'], ['params', 'jsonb'], ['webhook_token', 'text'], ['refunded_at', 'tstz']] },
        { id: 'p', name: 'project', x: 690, y: 30, w: 230, fields: [['project_id', 'uuid', 'PK'], ['job_id', 'uuid', 'FK'], ['group_id', 'uuid'], ['file_url', 'owned storage'], ['studio_state', 'jsonb'], ['cost_usd', 'num']] },
        { id: 'c', name: 'ai_cost_log', x: 690, y: 240, w: 230, fields: [['log_id', 'uuid', 'PK'], ['project_id', 'uuid', 'FK'], ['model', 'text'], ['cost_usd', 'num'], ['amount_idr', 'live FX'], ['date', 'WIB']] },
        { id: 'k', name: 'api_key', x: 20, y: 230, w: 200, fields: [['key_hash', 'sha256', 'PK'], ['user_id', 'text', 'FK'], ['expires_at', 'tstz'], ['clients', 'jsonb']] },
        { id: 'e', name: 'subscription_event', x: 330, y: 260, w: 250, fields: [['event_id', 'uuid', 'PK'], ['user_id', 'text', 'FK'], ['event_type', 'enum'], ['period_end', 'tstz']] },
      ],
      rels: [['u', 'r', 'j', 'l', '1:n'], ['j', 'r', 'p', 'l', '1:n', 'n images'], ['p', 'b', 'c', 't', '1:1'], ['u', 'b', 'k', 't', '1:n'], ['u', 'b', 'e', 'l', '1:n']],
    },
  },
  {
    id: 'career',
    kicker: 'Career Agent',
    title: ['Agent memory & job tracker', 'Memori agent & tracker lamaran', 'Agentgeheugen & sollicitatietracker'],
    text: [
      'The agent never keeps state in the prompt. A profile with an evidence bank (every claim plus where it came from), reusable form answers and personal rules is stored once; each application carries its own stage, fit score, documents, answers and an append-only timeline. Documents are only ever built from stored evidence.',
      'Agent tidak pernah menyimpan state di prompt. Profil dengan bank bukti (setiap klaim beserta asalnya), jawaban formulir yang bisa dipakai ulang, dan aturan pribadi disimpan sekali; setiap lamaran membawa tahap, skor kecocokan, dokumen, jawaban, dan timeline yang hanya ditambah. Dokumen hanya dibuat dari bukti yang tersimpan.',
      'De agent bewaart nooit state in de prompt. Een profiel met een bewijsbank (elke claim plus de herkomst), herbruikbare formulierantwoorden en persoonlijke regels wordt één keer opgeslagen; elke sollicitatie heeft een eigen fase, fitscore, documenten, antwoorden en een append-only tijdlijn. Documenten worden alleen uit opgeslagen bewijs gebouwd.',
    ],
    facts: [['10', ['application stages, human-confirmed', 'tahap lamaran, dikonfirmasi pengguna', 'sollicitatiefasen, door mens bevestigd']], ['1 page', ['CV enforced by the tool for junior roles', 'CV dipaksa tool untuk peran junior', 'cv afgedwongen door de tool voor juniorrollen']], ['0', ['invented facts: evidence or nothing', 'fakta karangan: bukti atau tidak sama sekali', 'verzonnen feiten: bewijs of niets']]],
    svg: {
      w: 940, h: 420, label: 'Career Agent entity model',
      entities: [
        { id: 'l', name: 'learner', x: 20, y: 40, w: 190, accent: true, fields: [['learner_id', 'text', 'PK'], ['ui_lang', 'en|id|nl|tr'], ['plan', 'enum']] },
        { id: 'p', name: 'career_profile', x: 300, y: 20, w: 250, fields: [['learner_id', 'text', 'PK'], ['profile', 'jsonb'], ['evidence[]', 'claim, source, metric'], ['answers[]', 'q, a'], ['rules[]', 'text'], ['cv_master', 'jsonb']] },
        { id: 'a', name: 'job_application', x: 640, y: 20, w: 280, fields: [['application_id', 'uuid', 'PK'], ['learner_id', 'text', 'FK'], ['company, role', 'text'], ['fit_label, fit_score', 'enum, 0-100'], ['stage', '10 states'], ['documents[]', 'kind, path, sent'], ['form_answers[]', 'q, a'], ['interview', 'jsonb'], ['timeline[]', 'append-only'], ['thread_id', 'uuid', 'FK']] },
        { id: 't', name: 'agent_thread', x: 20, y: 250, w: 230, fields: [['thread_id', 'uuid', 'PK'], ['learner_id', 'text', 'FK'], ['agent', "'career'"], ['last_tier', 'enum']] },
        { id: 'm', name: 'agent_message', x: 330, y: 260, w: 230, fields: [['message_id', 'uuid', 'PK'], ['thread_id', 'uuid', 'FK'], ['role', 'enum'], ['blocks', 'jsonb'], ['credits_spent', 'int']] },
      ],
      rels: [['l', 'r', 'p', 'l', '1:1'], ['p', 'r', 'a', 'l', '1:n'], ['l', 'b', 't', 't', '1:n'], ['t', 'r', 'm', 'l', '1:n'], ['m', 'r', 'a', 'b', '1:n', 'tool calls']],
    },
  },
  {
    id: 'hiring',
    kicker: 'Recruitment',
    title: ['Hiring & bias-resistant scoring', 'Rekrutmen & penilaian anti-bias', 'Werving & bias-bestendige beoordeling'],
    text: [
      'Interviewers only enter eight 1–10 ratings. The weighted score, recommendation band, composite across reviewers, ranking and disagreement flag are computed at read time and never stored, so nobody can type a verdict. Scores of other reviewers stay hidden until you submit your own.',
      'Pewawancara hanya mengisi delapan nilai 1–10. Skor berbobot, kategori rekomendasi, gabungan antar penilai, ranking, dan tanda beda pendapat dihitung saat dibaca dan tidak pernah disimpan, jadi tidak ada yang bisa mengetik vonis. Nilai penilai lain tersembunyi sampai Anda mengirim nilai sendiri.',
      'Interviewers voeren alleen acht cijfers van 1–10 in. De gewogen score, aanbevelingsband, samengestelde score, ranking en de vlag voor onenigheid worden bij het lezen berekend en nooit opgeslagen, dus niemand kan een oordeel intypen. Scores van anderen blijven verborgen tot je je eigen score indient.',
    ],
    facts: [['8', ['weighted indicators per interviewer', 'indikator berbobot per pewawancara', 'gewogen indicatoren per interviewer']], ['≥ 3.0', ['spread triggers a calibration review', 'selisih memicu diskusi kalibrasi', 'spreiding start een kalibratiegesprek']], ['24 h', ['AI interview link lifetime', 'umur link wawancara AI', 'geldigheid AI-interviewlink']]],
    svg: {
      w: 940, h: 425, label: 'Recruitment and scoring entity model',
      entities: [
        { id: 'p', name: 'position', x: 20, y: 30, w: 200, fields: [['position_id', 'uuid', 'PK'], ['slug', 'text', 'UQ'], ['requires_portfolio', 'bool'], ['scoring_rubric', 'jsonb']] },
        { id: 'a', name: 'application', x: 330, y: 30, w: 270, accent: true, fields: [['application_id', 'uuid', 'PK'], ['position_id', 'uuid', 'FK'], ['status', 'pipeline enum'], ['interview_at', 'tstz'], ['interviewer_ids[]', 'invited'], ['actual_interviewer_ids[]', 'scored'], ['rsvp_status', 'enum']] },
        { id: 's', name: 'interview_score', x: 700, y: 30, w: 220, fields: [['application_id', 'uuid', 'PK'], ['interviewer_id', 'text', 'PK'], ['scores', '8 × 1..10'], ['highlight, concern', 'text'], ['submitted_at', 'tstz']] },
        { id: 'i', name: 'ai_interview', x: 330, y: 250, w: 270, fields: [['interview_id', 'uuid', 'PK'], ['application_id', 'uuid', 'FK'], ['token', 'text', 'UQ'], ['expires_at', '+24 h'], ['transcript', 'jsonb'], ['costs', 'jsonb']] },
        { id: 'r', name: 'reminder_log', x: 700, y: 250, w: 220, fields: [['application_id', 'uuid', 'FK'], ['phase', 't24h | t1h'], ['sent_at', 'tstz']] },
      ],
      rels: [['p', 'r', 'a', 'l', '1:n'], ['a', 'r', 's', 'l', '1:n', 'composite'], ['a', 'b', 'i', 't', '1:1'], ['a', 'b', 'r', 'l', '1:n']],
    },
  },
];

const STATS = [
  ['296', ['production tables', 'tabel produksi', 'productietabellen'], ['two schemas, one Postgres', 'dua schema, satu Postgres', 'twee schema’s, één Postgres']],
  ['44k+', ['rows modelled', 'baris data dimodelkan', 'rijen gemodelleerd'], ['checksummed weekly', 'di-checksum tiap minggu', 'wekelijks gecontroleerd']],
  ['600+', ['API routes', 'route API', 'API-routes'], ['each with an explicit access rule', 'masing-masing dengan aturan akses', 'elk met een expliciete toegangsregel']],
  ['30+', ['scheduled jobs', 'job terjadwal', 'geplande jobs'], ['idempotent by design', 'idempoten sejak desain', 'idempotent door ontwerp']],
  ['5', ['AI agents in production', 'agent AI di produksi', 'AI-agents in productie'], ['tutor, career, ops ×2, interviewer', 'tutor, karier, ops ×2, pewawancara', 'tutor, carrière, ops ×2, interviewer']],
  ['3', ['products on one data platform', 'produk di satu platform data', 'producten op één dataplatform'], ['isolated by schema + storage prefix', 'diisolasi per schema + prefix storage', 'gescheiden per schema + opslagprefix']],
];

const LAYERS = [
  [['Sources', 'Sumber', 'Bronnen'], ['Web & mobile apps', 'Payment webhooks', 'AI model providers', 'Public data crawlers', 'Email & calendar']],
  [['Ingestion', 'Ingesti', 'Inname'], ['Typed API routes', 'Signed webhooks', 'Cron & queues', 'Signed-URL uploads', 'Trigger-fed events']],
  [['Storage', 'Penyimpanan', 'Opslag'], ['Postgres, 2 schemas', 'Row-level security', 'Private buckets', 'Append-only logs', 'Weekly checksummed backups']],
  [['Intelligence', 'Kecerdasan', 'Intelligentie'], ['Tool-using agents', 'Model routing', 'Scoring models', 'Pricing engine', 'Data-quality monitors']],
  [['Consumption', 'Konsumsi', 'Gebruik'], ['Product UI (4 languages)', 'Monitoring dashboards', 'Reports & PDFs', 'Transactional email', 'Owner alerts']],
];

const AGENT_STEPS = [
  [['Intake', 'Intake', 'Intake'], ['Reads the CV, saves evidence, asks only what is missing', 'Membaca CV, menyimpan bukti, hanya menanyakan yang belum ada', 'Leest het cv, slaat bewijs op, vraagt alleen wat ontbreekt'], ['get_state', 'save_profile']],
  [['Search', 'Cari', 'Zoeken'], ['Official job pages only, ≤ 3 days old, eligibility per ad', 'Hanya halaman lowongan resmi, ≤ 3 hari, kelayakan per iklan', 'Alleen officiële vacaturepagina’s, ≤ 3 dagen, geschiktheid per vacature'], ['web_search', 'web_fetch', 'save_jobs']],
  [['Judge', 'Nilai', 'Beoordelen'], ['good / risky / skip with a one-line reason and a 0–100 fit', 'good / risky / skip dengan alasan satu kalimat dan skor 0–100', 'good / risky / skip met een reden van één regel en fit 0–100'], ['fit model', 'dedupe']],
  [['Build', 'Susun', 'Bouwen'], ['Tailored ATS CV + letter, facts only from the evidence bank', 'CV ATS + surat yang disesuaikan, fakta hanya dari bank bukti', 'Op maat gemaakt ATS-cv + brief, feiten alleen uit de bewijsbank'], ['build_package', 'page check']],
  [['Human submits', 'Manusia mengirim', 'Mens verstuurt'], ['The learner presses submit; the agent never logs in or sends', 'Pengguna yang menekan kirim; agent tidak pernah login atau mengirim', 'De leerling verstuurt; de agent logt nooit in en verstuurt niets'], ['apply kit']],
  [['Track & learn', 'Lacak & belajar', 'Volgen & leren'], ['Stage changes only on confirmation; one lesson per rejection', 'Tahap hanya berubah setelah konfirmasi; satu pelajaran per penolakan', 'Fase wijzigt alleen na bevestiging; één les per afwijzing'], ['update_stage']],
];

const ROUTES = [
  ['Haiku', ['Conversation, intake, tracking', 'Percakapan, intake, pelacakan', 'Gesprek, intake, tracking'], '≈ $0.004', ['per turn', 'per giliran', 'per beurt'], 18],
  ['Sonnet', ['Documents: CV, letter, master CV — auto-escalated when the agent calls a writing tool', 'Dokumen: CV, surat, CV utama — otomatis naik saat agent memanggil tool penulisan', 'Documenten: cv, brief, master-cv — automatisch opgeschaald bij een schrijftool'], '≈ $0.11', ['per package', 'per paket', 'per pakket'], 62],
  ['Opus', ['Deep planning, long essays, thick documents (user-chosen)', 'Perencanaan mendalam, esai panjang, dokumen tebal (dipilih pengguna)', 'Diepe planning, lange essays, dikke documenten (door gebruiker gekozen)'], ['tiered', 'berjenjang', 'gestaffeld'], ['price floor + real cost', 'harga dasar + biaya nyata', 'minimumprijs + echte kosten'], 100],
];

const FORMULAS = [
  {
    title: ['Cost-plus credit pricing', 'Harga kredit cost-plus', 'Cost-plus kredietprijs'],
    math: 'credits = ⌈ cost<sub>usd</sub> ÷ ( value<sub>credit</sub> × (1 − m) ) ⌉ ,&nbsp; m = 0.50',
    text: ['Every model, resolution and duration is priced from its measured provider cost, so margin holds when providers change prices. A turn is charged max(tier floor, real cost).', 'Setiap model, resolusi, dan durasi diberi harga dari biaya penyedia yang terukur, jadi margin tetap saat penyedia mengubah harga. Satu giliran ditagih max(harga dasar, biaya nyata).', 'Elk model, elke resolutie en duur krijgt een prijs uit de gemeten providerkosten, zodat de marge blijft als providers prijzen wijzigen. Een beurt kost max(minimum, echte kosten).'],
  },
  {
    title: ['Weighted interview score', 'Skor wawancara berbobot', 'Gewogen interviewscore'],
    math: 'S<sub>r</sub> = Σ<sub>i=1..8</sub> w<sub>i</sub>·x<sub>i</sub> ÷ 100 ,&nbsp; Ŝ = mean(S<sub>r</sub>) ,&nbsp; flag ⇔ max S<sub>r</sub> − min S<sub>r</sub> ≥ 3.0',
    text: ['Weights favour the craft skills of the role (23 + 23 of 100). Bands: ≥ 8.5 strongly recommend, ≥ 7.0 recommend, ≥ 5.5 neutral.', 'Bobot mengutamakan keahlian inti peran (23 + 23 dari 100). Kategori: ≥ 8,5 sangat direkomendasikan, ≥ 7,0 direkomendasikan, ≥ 5,5 netral.', 'Gewichten leggen nadruk op het vakmanschap van de rol (23 + 23 van 100). Banden: ≥ 8,5 sterk aanbevolen, ≥ 7,0 aanbevolen, ≥ 5,5 neutraal.'],
  },
  {
    title: ['Unit economics of an AI add-on', 'Unit economics add-on AI', 'Unit economics van een AI-add-on'],
    math: 'LTV = ARPU × gross margin × lifetime ,&nbsp; c<sub>break-even</sub> = cost<sub>free users</sub> ÷ ( LTV × N )',
    text: ['The Career Agent business case: at a 54 % gross margin the add-on breaks even at ≈ 5.6 % conversion against a 4 % assumption, which is why conversation now runs on a ~50× cheaper model and only documents use the stronger one.', 'Business case Career Agent: dengan margin kotor 54 % add-on impas pada konversi ≈ 5,6 % dibanding asumsi 4 %, karena itu percakapan kini memakai model ±50× lebih murah dan hanya dokumen yang memakai model kuat.', 'De businesscase van de Career Agent: bij 54 % brutomarge is de add-on break-even bij ≈ 5,6 % conversie tegenover een aanname van 4 %, daarom loopt het gesprek nu via een ±50× goedkoper model en gebruiken alleen documenten het sterkere model.'],
  },
  {
    title: ['Content performance model', 'Model performa konten', 'Contentprestatiemodel'],
    math: 'lift = median(views | collab) ÷ median(views | solo) ≈ 52×',
    text: ['109 Instagram posts classified by format, topic, era and partner from caption text, reproducible end to end. Collaborations outperformed solo posts by a median factor of about 52.', '109 postingan Instagram diklasifikasikan menurut format, topik, era, dan mitra dari teks caption, bisa diulang dari awal sampai akhir. Kolaborasi mengungguli postingan sendiri dengan median sekitar 52 kali.', '109 Instagramposts geclassificeerd op formaat, onderwerp, periode en partner uit de captiontekst, volledig reproduceerbaar. Samenwerkingen presteerden mediaan ongeveer 52× beter dan solo-posts.'],
  },
];

const SAMPLE = [
  ['app_7f3c…', 'Logistics scale-up', 'Data Analyst Intern', 'good', 86, 'interview', 'CV · Letter'],
  ['app_19ae…', 'Fintech, Series B', 'BI & Automation Student', 'good', 81, 'applied', 'CV'],
  ['app_c04d…', 'Retail group', 'Operations Analyst', 'risky', 64, 'ready', 'CV · Letter'],
  ['app_5b21…', 'Energy utility', 'AI Product Intern', 'risky', 58, 'saved', '—'],
  ['app_e8a0…', 'Consumer brand', 'Brand Marketing Intern', 'skip', 31, 'skipped', '—'],
];

const GOVERNANCE = [
  [['Isolation by design', 'Isolasi sejak desain', 'Isolatie door ontwerp'], ['Two products share one database; separation lives in schema, storage prefix and a scoped client, verified by an automated isolation suite.', 'Dua produk berbagi satu database; pemisahan ada di schema, prefix storage, dan client yang dikunci, diverifikasi oleh suite isolasi otomatis.', 'Twee producten delen één database; scheiding zit in schema, opslagprefix en een afgeschermde client, gecontroleerd door een automatische isolatietest.']],
  [['Least privilege', 'Hak akses minimum', 'Minimale rechten'], ['Row-level security on every table, public roles revoked by default, sensitive files in private buckets behind short-lived signed links.', 'Row-level security di setiap tabel, peran publik dicabut secara default, file sensitif di bucket privat dengan link bertanda tangan berumur pendek.', 'Row-level security op elke tabel, publieke rollen standaard ingetrokken, gevoelige bestanden in privébuckets achter kortlevende ondertekende links.']],
  [['Exactly-once money', 'Uang tepat sekali', 'Geld precies één keer'], ['Compare-and-swap status updates, unique keys per order and claim-before-send rows make webhooks, crons and retries safe to repeat.', 'Update status compare-and-swap, kunci unik per order, dan klaim sebelum kirim membuat webhook, cron, dan percobaan ulang aman diulang.', 'Compare-and-swap-statusupdates, unieke sleutels per order en claim-voor-verzenden maken webhooks, crons en retries veilig herhaalbaar.']],
  [['Time is a data type', 'Waktu adalah tipe data', 'Tijd is een datatype'], ['Business dates in the market’s time zone (WIB), periods closed at 23:59 local, never inferred from UTC.', 'Tanggal bisnis dalam zona waktu pasar (WIB), periode ditutup pukul 23.59 lokal, tidak pernah ditebak dari UTC.', 'Bedrijfsdatums in de tijdzone van de markt (WIB), periodes sluiten om 23:59 lokaal, nooit afgeleid uit UTC.']],
  [['Monitored quality', 'Kualitas terpantau', 'Bewaakte kwaliteit'], ['Daily health checks reconcile discounts, usage counters and orders; every outbound link in an AI answer is opened before it is kept.', 'Cek harian mencocokkan diskon, penghitung pemakaian, dan order; setiap link di jawaban AI dibuka dulu sebelum disimpan.', 'Dagelijkse controles stemmen kortingen, gebruikstellers en orders af; elke link in een AI-antwoord wordt geopend voordat hij blijft staan.']],
  [['Recoverable', 'Bisa dipulihkan', 'Herstelbaar'], ['Weekly numbered backups with per-table row counts and checksums, plus lossless storage compression verified pixel by pixel.', 'Backup mingguan bernomor dengan jumlah baris dan checksum per tabel, plus kompresi storage lossless yang diverifikasi piksel demi piksel.', 'Wekelijkse genummerde back-ups met rijtellingen en checksums per tabel, plus verliesvrije compressie die pixel voor pixel wordt gecontroleerd.']],
];

const TOOLKIT = [
  [['Data modeling', 'Pemodelan data', 'Datamodellering'], ['Relational & ER design', 'Event sourcing / append-only logs', 'JSONB document modeling', 'State machines', 'Multi-tenant schema isolation']],
  [['Engineering', 'Rekayasa', 'Engineering'], ['PostgreSQL / SQL', 'Supabase (RLS, RPC, triggers)', 'Node.js & Next.js APIs', 'Python (pandas, NumPy, OpenCV)', 'Webhooks, crons, queues']],
  [['AI systems', 'Sistem AI', 'AI-systemen'], ['Tool-using agents', 'Model routing & cost control', 'Prompt caching', 'Speech pipelines (STT → LLM → TTS)', 'Evaluation & guardrails']],
  [['Analytics', 'Analitik', 'Analytics'], ['Power BI', 'Google Analytics', 'Unit economics & pricing', 'fsQCA (research)', 'Survey & experiment design']],
];

export function dataModeling({ L, link }) {
  const T3 = (a) => L(a[0], a[1], a[2]);
  const stat = STATS.map(([n, k, s], i) => `<div class="dm-stat reveal" style="--i:${i}"><strong>${n}</strong><span>${T3(k)}</span><small>${T3(s)}</small></div>`).join('');
  const layers = LAYERS.map(([name, items], i) => `<div class="dm-layer reveal" style="--i:${i}"><span class="dm-layer-no">0${i + 1}</span><h3>${T3(name)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('<i class="dm-arrow" aria-hidden="true">→</i>');
  const models = MODELS.map((m, i) => `<article class="dm-model reveal" id="model-${m.id}"><div class="dm-model-copy"><span class="dm-kicker">${String(i + 1).padStart(2, '0')} · ${esc(m.kicker)}</span><h3>${T3(m.title)}</h3><p>${esc(T3(m.text))}</p><dl class="dm-facts">${m.facts.map(([n, t]) => `<div><dt>${esc(n)}</dt><dd>${esc(T3(t))}</dd></div>`).join('')}</dl></div>${er(m.svg)}</article>`).join('');
  const steps = AGENT_STEPS.map(([n, t, tools], i) => `<li class="dm-step reveal" style="--i:${i}"><span class="dm-step-no">${i + 1}</span><h4>${T3(n)}</h4><p>${esc(T3(t))}</p><div class="dm-tools">${tools.map((x) => `<code>${esc(x)}</code>`).join('')}</div></li>`).join('');
  const routes = ROUTES.map(([m, use, cost, unit, bar]) => `<div class="dm-route"><div class="dm-route-model">${m}</div><div class="dm-route-use">${esc(T3(use))}</div><div class="dm-route-cost"><strong>${typeof cost === 'string' ? cost : T3(cost)}</strong><small>${T3(unit)}</small></div><div class="dm-route-bar" aria-hidden="true"><i style="width:${bar}%"></i></div></div>`).join('');
  const formulas = FORMULAS.map((f, i) => `<article class="dm-formula reveal" style="--i:${i}"><span class="dm-kicker">${String(i + 1).padStart(2, '0')}</span><h3>${T3(f.title)}</h3><p class="dm-math">${f.math}</p><p>${esc(T3(f.text))}</p></article>`).join('');
  const sampleHead = [L('ID', 'ID', 'ID'), L('Employer (generalised)', 'Pemberi kerja (digeneralisasi)', 'Werkgever (gegeneraliseerd)'), L('Role', 'Peran', 'Rol'), L('Fit', 'Kecocokan', 'Fit'), L('Score', 'Skor', 'Score'), L('Stage', 'Tahap', 'Fase'), L('Documents', 'Dokumen', 'Documenten')];
  const sample = `<div class="dm-scroll"><table class="dm-table"><thead><tr>${sampleHead.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${SAMPLE.map((r) => `<tr><td><code>${r[0]}</code></td><td>${r[1]}</td><td>${r[2]}</td><td><span class="dm-pill dm-${r[3]}">${r[3]}</span></td><td><span class="dm-score"><i style="width:${r[4]}%"></i></span>${r[4]}</td><td>${r[5]}</td><td>${r[6]}</td></tr>`).join('')}</tbody></table></div>`;
  const gov = GOVERNANCE.map(([t, d], i) => `<div class="dm-gov reveal" style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span><h3>${T3(t)}</h3><p>${esc(T3(d))}</p></div>`).join('');
  const kit = TOOLKIT.map(([t, items]) => `<div class="dm-kit"><h3>${T3(t)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
  const head = (no, title) => `<div class="section-head reveal"><h2><span class="dm-sec-no">${no}</span>${title}</h2><span class="section-rule"></span></div>`;

  return `<section class="blue-paper-banner dm-banner"><div class="paper-planes" aria-hidden="true"><i></i><i></i><i></i></div><h1>${L('Data,<br>modelled.', 'Data,<br>dimodelkan.', 'Data,<br>gemodelleerd.')}</h1><i class="red-line"></i><p class="eyebrow">SCHEMAS.<br>AGENTS.<br>METRICS THAT<br>HOLD UP.</p></section>
<section class="section dm-intro"><p class="dm-lede reveal">${L('I design the data layer behind three live products, from the first entity diagram to the agents that read and write it. Below are the real structures of those systems, with field names simplified and every value synthetic or aggregated.', 'Saya merancang lapisan data di balik tiga produk yang sudah live, dari diagram entitas pertama sampai agent yang membaca dan menulisnya. Di bawah ini struktur asli sistem-sistem itu, dengan nama kolom disederhanakan dan semua nilai berupa data sintetis atau agregat.', 'Ik ontwerp de datalaag achter drie live producten, van het eerste entiteitendiagram tot de agents die ermee lezen en schrijven. Hieronder staan de echte structuren van die systemen, met vereenvoudigde veldnamen en alle waarden synthetisch of geaggregeerd.')}</p><div class="dm-stats">${stat}</div><p class="dm-privacy">${L('Privacy note: no personal data, order, amount or identifier from production is shown on this page.', 'Catatan privasi: tidak ada data pribadi, order, nominal, atau ID dari produksi yang ditampilkan di halaman ini.', 'Privacy: op deze pagina staat geen persoonsgegeven, order, bedrag of identificatie uit productie.')}</p></section>
<section class="section dm-arch">${head('01', L('Platform architecture', 'Arsitektur platform', 'Platformarchitectuur'))}<div class="dm-layers">${layers}</div></section>
<section class="section">${head('02', L('Entity models', 'Model entitas', 'Entiteitsmodellen'))}<p class="dm-legend"><span><b class="k-pk">PK</b> ${L('primary key', 'kunci utama', 'primaire sleutel')}</span><span><b class="k-fk">FK</b> ${L('foreign key', 'kunci asing', 'vreemde sleutel')}</span><span><b class="k-uq">UQ</b> ${L('unique', 'unik', 'uniek')}</span><span>⟞ ${L('one', 'satu', 'één')} · ⋲ ${L('many', 'banyak', 'veel')}</span></p>${models}<p class="dm-swipe">${L('Swipe the diagrams sideways on a phone.', 'Geser diagram ke samping di HP.', 'Veeg de diagrammen opzij op een telefoon.')}</p></section>
<section class="section dm-agent">${head('03', L('Modelling an agent', 'Memodelkan sebuah agent', 'Een agent modelleren'))}<p class="dm-sub reveal">${L('Career Agent, live in Ask Matchi: a tool-using model that turns a CV into tracked applications. The model decides; the data model and the tools enforce the rules.', 'Career Agent, live di Ask Matchi: model yang memakai tool untuk mengubah CV menjadi lamaran yang terlacak. Model yang memutuskan; model data dan tool yang menegakkan aturan.', 'Career Agent, live in Ask Matchi: een model met tools dat een cv omzet in gevolgde sollicitaties. Het model beslist; het datamodel en de tools handhaven de regels.')}</p><ol class="dm-steps">${steps}</ol><div class="dm-routing reveal"><div class="dm-routing-head"><h3>${L('Model routing by task', 'Routing model per tugas', 'Modelroutering per taak')}</h3><p>${L('A turn starts on the cheapest capable model. When the agent calls a document-writing tool, that round is discarded and replayed on a stronger model, so documents are never written by the small one. Costs are logged per model.', 'Satu giliran mulai di model termurah yang mampu. Saat agent memanggil tool penulisan dokumen, ronde itu dibuang dan diulang di model yang lebih kuat, jadi dokumen tidak pernah ditulis model kecil. Biaya dicatat per model.', 'Een beurt start op het goedkoopste geschikte model. Roept de agent een schrijftool aan, dan wordt die ronde verworpen en op een sterker model herhaald, zodat documenten nooit door het kleine model worden geschreven. Kosten worden per model gelogd.')}</p></div>${routes}</div><ul class="dm-guards reveal">${[L('Truth rule: claims only from the evidence bank', 'Aturan kebenaran: klaim hanya dari bank bukti', 'Waarheidsregel: claims alleen uit de bewijsbank'), L('One company, one application (enforced on save)', 'Satu perusahaan, satu lamaran (dipaksa saat simpan)', 'Eén bedrijf, één sollicitatie (afgedwongen bij opslaan)'), L('Human-in-the-loop for submitting and stage changes', 'Manusia tetap memegang kirim dan perubahan tahap', 'Mens beslist over versturen en fasewijzigingen'), L('Per-turn budget caps and rate limits', 'Batas biaya per giliran dan pembatas laju', 'Budgetlimieten per beurt en rate limits')].map((x) => `<li>${x}</li>`).join('')}</ul></section>
<section class="section">${head('04', L('Analytical models', 'Model analitik', 'Analytische modellen'))}<div class="dm-formulas">${formulas}</div></section>
<section class="section">${head('05', L('Sample output, anonymised', 'Contoh hasil, disamarkan', 'Voorbeelduitvoer, geanonimiseerd'))}<p class="dm-sub reveal">${L('What the tracker model produces. Rows are synthetic; employers are generalised to their sector.', 'Yang dihasilkan model tracker. Baris ini sintetis; pemberi kerja digeneralisasi ke sektornya.', 'Wat het trackermodel oplevert. Rijen zijn synthetisch; werkgevers zijn gegeneraliseerd naar hun sector.')}</p>${sample}</section>
<section class="section">${head('06', L('Data quality & governance', 'Kualitas & tata kelola data', 'Datakwaliteit & governance'))}<div class="dm-govs">${gov}</div></section>
<section class="section">${head('07', L('Toolkit', 'Perangkat', 'Gereedschap'))}<div class="dm-kits">${kit}</div><div class="dm-cta">${link('work', L('See the live products', 'Lihat produk live', 'Bekijk de live producten'))}${link('contact', L('Talk about a data role', 'Bicara soal peran data', 'Praat over een datarol'))}</div></section>`;
}
