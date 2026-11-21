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
    return `<g class="er-rel" data-a="${a}" data-b="${b}"><path class="er-line" d="${d}"/><path class="er-flow" d="${d}"/>${bar(p[0], p[1], px, py)}${end}</g>`;
  }).join('');
  const boxes = Object.values(box).map((e) => {
    const rows = e.fields.map(([n, t, k], i) => {
      const y = e.y + HEAD + 14 + i * ROW;
      const key = k ? `<text class="er-key er-key-${k.toLowerCase()}" x="${e.x + e.w - 10}" y="${y}" text-anchor="end">${k}</text>` : '';
      return `<text class="er-field" x="${e.x + 12}" y="${y}">${esc(n)}<tspan class="er-type"> ${esc(t)}</tspan></text>${key}`;
    }).join('');
    return `<g class="er-entity${e.accent ? ' is-accent' : ''}" data-id="${e.id}" tabindex="0"><rect class="er-box" x="${e.x}" y="${e.y}" width="${e.w}" height="${e.h}" rx="4"/><rect class="er-head" x="${e.x}" y="${e.y}" width="${e.w}" height="${HEAD}" rx="4"/><rect class="er-head" x="${e.x}" y="${e.y + HEAD - 6}" width="${e.w}" height="6"/><text class="er-title" x="${e.x + 12}" y="${e.y + 20}">${esc(e.name)}</text>${rows}</g>`;
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

// ── Syntax highlighting (build time, no library) ─────────────────────────────────────────────────────────────────
const KW = {
  sql: 'select|from|where|and|or|not|in|is|null|as|on|join|left|using|group|by|order|desc|asc|with|insert|into|values|update|set|returning|create|or|replace|function|returns|trigger|language|security|definer|begin|end|return|new|case|when|then|else|conflict|do|count|distinct|filter|between|interval|now|round|min|max|date_trunc|extract|epoch|at|time|zone|for|each|row|execute|procedure|after|table|unique|primary|key|references|check|default|not|exists|if|declare|perform|limit',
  py: 'import|from|as|def|return|for|in|if|else|elif|with|lambda|and|or|not|None|True|False|class|print|yield|assert',
  js: 'const|let|var|function|return|if|else|for|of|in|await|async|export|import|from|new|true|false|null|undefined|throw|try|catch|typeof|continue|break',
};
function hl(code, lang) {
  const kw = new RegExp(`^(?:${KW[lang]})$`, lang === 'sql' ? 'i' : '');
  const re = lang === 'py'
    ? /(#[^\n]*)|("""[\s\S]*?"""|'[^'\n]*'|"[^"\n]*"|f'[^'\n]*'|f"[^"\n]*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)(\s*\()?|([^\sA-Za-z0-9_'"#]+)|(\s+)/g
    : lang === 'sql'
      ? /(--[^\n]*)|('[^'\n]*'|\$\$)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_.]*)(\s*\()?|([^\sA-Za-z0-9_'-]+|-)|(\s+)/g
      : /(\/\/[^\n]*)|(`[^`]*`|'[^'\n]*'|"[^"\n]*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][A-Za-z0-9_$]*)(\s*\()?|([^\sA-Za-z0-9_$'"`/]+|\/)|(\s+)/g;
  let out = '', m;
  while ((m = re.exec(code))) {
    if (m[1]) out += `<span class="t-c">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="t-s">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="t-n">${esc(m[3])}</span>`;
    else if (m[4]) {
      const w = m[4];
      if (kw.test(w)) out += `<span class="t-k">${esc(w)}</span>`;
      else if (m[5]) out += `<span class="t-f">${esc(w)}</span>`;
      else out += esc(w);
      if (m[5]) out += esc(m[5]);
    } else if (m[6]) out += `<span class="t-p">${esc(m[6])}</span>`;
    else out += esc(m[0]);
  }
  return out.split('\n').map((l) => `<span class="ln">${l || ' '}</span>`).join('');
}

// ── Code notebook: real patterns, simplified; every value in the outputs is synthetic ────────────────────────────
const CELLS = [
  {
    id: 'trigger', lang: 'sql', file: 'migrations/learning_activity.sql',
    title: ['One activity index fed by triggers', 'Satu indeks aktivitas dari trigger', 'Eén activiteitenindex via triggers'],
    note: ['12 feature tables write their own rows; a trigger mirrors each session into one index, so dashboards and the AI tutor never join twelve tables.', '12 tabel fitur menulis barisnya sendiri; trigger mencerminkan tiap sesi ke satu indeks, jadi dashboard dan tutor AI tidak perlu menggabungkan 12 tabel.', '12 featuretabellen schrijven hun eigen rijen; een trigger spiegelt elke sessie naar één index, zodat dashboards en de AI-tutor nooit twaalf tabellen joinen.'],
    code: `create or replace function log_learning_activity()
returns trigger language plpgsql security definer as $$
begin
  insert into learning_activity
    (learner_id, feature, status, score, score_max, ref_table, ref_id)
  values
    (new.learner_id, tg_argv[0],
     case when new.completed_at is null then 'started' else 'completed' end,
     new.score, new.score_max, tg_table_name, new.id::text)
  on conflict (ref_table, ref_id) do update
     set status = excluded.status,
         score  = excluded.score;          -- idempotent: replays never duplicate
  return new;
end $$;

create trigger trg_activity after insert or update on ielts_sessions
  for each row execute function log_learning_activity('ielts');`,
    out: { type: 'log', lines: ['CREATE FUNCTION', 'CREATE TRIGGER  ×12 feature tables', 'backfill: 14 days → 66 sessions across 10 features (was 0 visible)'] },
  },
  {
    id: 'claim', lang: 'sql', file: 'jobs/finalize_render.sql',
    title: ['Exactly-once job finalisation', 'Finalisasi job tepat sekali', 'Job precies één keer afronden'],
    note: ['A webhook, a status poll and a cron can all try to finish the same render. A compare-and-swap claim lets exactly one win; a stale claim is taken over after 10 minutes.', 'Webhook, polling status, dan cron bisa sama-sama mencoba menyelesaikan render yang sama. Klaim compare-and-swap memastikan hanya satu yang menang; klaim basi diambil alih setelah 10 menit.', 'Een webhook, een statuspoll en een cron kunnen dezelfde render willen afronden. Een compare-and-swap-claim laat er precies één winnen; een verouderde claim wordt na 10 minuten overgenomen.'],
    code: `update generation_job
   set status        = 'finalizing',
       finalizing_at = now()
 where job_id = $1
   and (   status = 'processing'
        or (status = 'finalizing'
            and finalizing_at < now() - interval '10 minutes'))
returning job_id;          -- 0 rows → another worker owns this job

-- refund at most once, even if two failures race
update app_user u
   set credits = u.credits + j.credits
  from generation_job j
 where j.job_id = $1 and j.user_id = u.user_id
   and j.refunded_at is null
returning u.credits;`,
    out: { type: 'table', cols: ['trigger', 'claimed', 'project rows', 'cost rows', 'refunds'], rows: [['webhook', 'yes', '1', '1', '0'], ['status poll', 'no (0 rows)', '—', '—', '—'], ['daily cron', 'no (0 rows)', '—', '—', '—']], caption: ['3 concurrent triggers on one finished render (test, real DB)', '3 pemicu bersamaan pada satu render (uji, DB asli)', '3 gelijktijdige triggers op één render (test, echte DB)'] },
  },
  {
    id: 'cohort', lang: 'sql', file: 'analytics/retention_by_cohort.sql',
    title: ['Weekly cohort retention', 'Retensi kohort mingguan', 'Wekelijkse cohortretentie'],
    note: ['Business dates are computed in the market’s time zone, never UTC. The output below is synthetic.', 'Tanggal bisnis dihitung dalam zona waktu pasar, tidak pernah UTC. Hasil di bawah ini sintetis.', 'Bedrijfsdatums worden in de tijdzone van de markt berekend, nooit UTC. De uitvoer hieronder is synthetisch.'],
    code: `with first_seen as (
  select learner_id,
         min((created_at at time zone 'Asia/Jakarta')::date) as day0
    from learning_activity
   group by learner_id
), aged as (
  select f.learner_id,
         date_trunc('week', f.day0)::date                       as cohort,
         (a.created_at at time zone 'Asia/Jakarta')::date - f.day0 as age_days
    from learning_activity a
    join first_seen f using (learner_id)
)
select cohort,
       count(distinct learner_id)                                  as learners,
       round(100.0 * count(distinct learner_id)
             filter (where age_days between 7 and 13)
             / count(distinct learner_id), 1)                       as w1_pct,
       round(100.0 * count(distinct learner_id)
             filter (where age_days between 28 and 34)
             / count(distinct learner_id), 1)                       as w4_pct
  from aged
 group by cohort
 order by cohort desc
 limit 4;`,
    out: { type: 'table', cols: ['cohort', 'learners', 'w1_pct', 'w4_pct'], rows: [['2026-W45', '412', '31.6', '—'], ['2026-W44', '388', '29.4', '—'], ['2026-W43', '351', '33.0', '18.2'], ['2026-W42', '297', '27.9', '15.8']], caption: ['synthetic data · 4 rows', 'data sintetis · 4 baris', 'synthetische data · 4 rijen'] },
  },
  {
    id: 'python', lang: 'py', file: 'notebooks/content_lift.py',
    title: ['Anonymise, classify, measure lift', 'Anonimkan, klasifikasi, ukur lift', 'Anonimiseren, classificeren, lift meten'],
    note: ['Personal identifiers are hashed before analysis; posts are classified from caption text by reproducible rules, then collaboration lift is a ratio of medians (robust to viral outliers).', 'Identitas pribadi di-hash sebelum dianalisis; postingan diklasifikasikan dari teks caption dengan aturan yang bisa diulang, lalu lift kolaborasi dihitung sebagai rasio median (tahan terhadap outlier viral).', 'Persoonsgegevens worden gehasht vóór analyse; posts worden met reproduceerbare regels uit de captiontekst geclassificeerd, daarna is de samenwerkingslift een ratio van medianen (robuust tegen virale uitschieters).'],
    code: `import hashlib, re
import pandas as pd

posts = pd.read_json("posts_dataset.json")

# 1 · anonymise: no handle or name leaves this cell
salt = "rotate-me"
posts["author"] = posts["author"].map(
    lambda h: hashlib.sha256((salt + h).encode()).hexdigest()[:10])

# 2 · classify from caption text (deterministic, re-runnable)
RULES = {"scholarship": r"lpdp|daad|beasiswa|scholar",
         "ielts":       r"ielts|band \\d",
         "career":      r"cv|interview|intern"}
posts["topic"] = posts["caption"].str.lower().apply(
    lambda c: next((t for t, p in RULES.items() if re.search(p, c)), "other"))
posts["collab"] = posts["coauthors"].str.len() > 0

# 3 · lift = ratio of medians (robust to one viral post)
med = posts.groupby("collab")["views"].median()
lift = med[True] / med[False]
print(posts.groupby(["topic", "collab"])["views"].median().unstack().round(0))
print(f"collaboration lift ≈ {lift:.0f}×  (n={len(posts)})")`,
    out: { type: 'table', cols: ['topic', 'solo', 'collab'], rows: [['career', '1 240', '41 800'], ['ielts', '980', '55 300'], ['scholarship', '1 410', '72 900'], ['other', '760', '38 100']], caption: ['collaboration lift ≈ 52×  (n=109) · values rescaled', 'lift kolaborasi ≈ 52×  (n=109) · nilai diskalakan', 'samenwerkingslift ≈ 52×  (n=109) · waarden geschaald'] },
  },
  {
    id: 'agent', lang: 'js', file: 'agent/career_turn.js',
    title: ['Tool schema + model escalation', 'Skema tool + eskalasi model', 'Toolschema + modelescalatie'],
    note: ['The model chooses tools; the code enforces the rules. A document-writing call made by the small model is discarded and replayed on the stronger one.', 'Model memilih tool; kode yang menegakkan aturan. Panggilan penulisan dokumen dari model kecil dibuang dan diulang di model yang lebih kuat.', 'Het model kiest tools; de code handhaaft de regels. Een schrijfopdracht van het kleine model wordt verworpen en op het sterkere model herhaald.'],
    code: `export const buildPackage = {
  name: 'career_build_package',
  input_schema: {
    type: 'object',
    properties: {
      application_id: { type: 'string' },
      cv:     { type: 'object' },   // facts only from the evidence bank
      letter: { type: 'object' },
    },
    required: ['application_id', 'cv'],
  },
  async run(args, ctx) {
    const pdf = await renderCv(args.cv);
    if (pages(pdf) > 1 && isEarlyCareer(ctx.app))
      return { error: 'CV must fit one page — tighten it and rebuild.' };
    return savePackage(ctx, pdf);
  },
};

const isDocumentCall = (c) =>
  c.name === 'career_build_package' || !!c.input?.cv_master;

for (let round = 0; round < MAX_ROUNDS; round++) {
  const res = await model(engine).send(messages, tools);
  usage.add(engine.model, res.usage);                 // cost per model
  const calls = toolCalls(res);
  if (!calls.length) break;
  if (engine.tier === 'small' && calls.some(isDocumentCall)) {
    engine = engines.strong;                          // replay this round
    round--; continue;
  }
  messages.push(res, await runTools(calls, ctx));
}`,
    out: { type: 'log', lines: ['turn 1  haiku   career_get_state → answer             $0.0044', 'turn 2  haiku   save_jobs(fit=risky, 70)              $0.0027', 'turn 3  haiku   build_package ✕ discarded → escalate  $0.0025', 'turn 3  sonnet  build_package → CV.pdf (1 page) + .docx $0.1103', 'total   $0.120 · documents never written by the small model'] },
  },
];

function cellHtml(c, T3) {
  let out = '';
  if (c.out.type === 'log') out = `<pre class="nb-log">${c.out.lines.map((l) => `<span>${esc(l)}</span>`).join('')}</pre>`;
  else out = `<div class="nb-table-wrap"><table class="nb-table"><thead><tr>${c.out.cols.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${c.out.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="nb-cap">${esc(T3(c.out.caption))}</p></div>`;
  return `<div class="nb-cell" data-cell="${c.id}"><div class="nb-bar"><span class="nb-dots"><i></i><i></i><i></i></span><span class="nb-file">${esc(c.file)}</span><span class="nb-lang">${c.lang === 'py' ? 'python' : c.lang === 'js' ? 'javascript' : 'postgresql'}</span><button type="button" class="nb-copy" data-copy>copy</button></div><pre class="nb-code"><code>${hl(c.code, c.lang)}</code></pre><div class="nb-out"><span class="nb-out-label">Out [${CELLS.indexOf(c) + 1}]</span>${out}</div></div>`;
}

const STATS = [
  [296, '', ['production tables', 'tabel produksi', 'productietabellen'], ['two schemas · one Postgres', 'dua schema · satu Postgres', 'twee schema’s · één Postgres']],
  [44, 'k+', ['rows modelled', 'baris dimodelkan', 'rijen gemodelleerd'], ['checksummed weekly', 'di-checksum tiap minggu', 'wekelijks gecontroleerd']],
  [600, '+', ['API routes', 'route API', 'API-routes'], ['explicit access rule each', 'aturan akses tiap route', 'expliciete toegangsregel']],
  [30, '+', ['scheduled jobs', 'job terjadwal', 'geplande jobs'], ['idempotent by design', 'idempoten sejak desain', 'idempotent door ontwerp']],
  [5, '', ['AI agents live', 'agent AI live', 'AI-agents live'], ['tutor · career · ops ×2 · interviewer', 'tutor · karier · ops ×2 · pewawancara', 'tutor · carrière · ops ×2 · interviewer']],
  [4, '', ['UI languages', 'bahasa UI', 'UI-talen'], ['EN · ID · NL · TR', 'EN · ID · NL · TR', 'EN · ID · NL · TR']],
];

// Pipeline: columns of nodes, every link animated (SMIL animateMotion; static lines without it).
const PIPE = {
  cols: [
    ['Sources', 'Sumber', 'Bronnen', ['Web & mobile', 'Payments', 'AI providers', 'Crawlers']],
    ['Ingestion', 'Ingesti', 'Inname', ['API routes', 'Webhooks', 'Cron & queues']],
    ['Storage', 'Penyimpanan', 'Opslag', ['Postgres · public', 'Postgres · ms', 'Private buckets']],
    ['Intelligence', 'Kecerdasan', 'Intelligentie', ['Agents', 'Scoring', 'Pricing']],
    ['Consumption', 'Konsumsi', 'Gebruik', ['Product UI', 'Dashboards', 'Email & PDF']],
  ],
};
function pipeline(T3) {
  const W = 1100, H = 360, cw = W / PIPE.cols.length;
  const pos = PIPE.cols.map((c, i) => c[3].map((_, j) => [cw * i + cw / 2, 90 + j * ((H - 120) / Math.max(1, c[3].length - 1 || 1)) * (c[3].length > 1 ? 1 : 0) + (c[3].length === 1 ? (H - 60) / 2 : 0)]));
  const spread = (n, j) => (n === 1 ? H / 2 : 95 + j * ((H - 150) / (n - 1)));
  PIPE.cols.forEach((c, i) => c[3].forEach((_, j) => { pos[i][j] = [cw * i + cw / 2, spread(c[3].length, j)]; }));
  let links = '', k = 0;
  for (let i = 0; i < PIPE.cols.length - 1; i++) {
    pos[i].forEach((a, ai) => pos[i + 1].forEach((b, bi) => {
      if ((ai + bi) % 2 && pos[i].length > 2 && pos[i + 1].length > 2) return; // keep it readable
      const mx = (a[0] + b[0]) / 2;
      const d = `M${a[0] + 70},${a[1]} C${mx},${a[1]} ${mx},${b[1]} ${b[0] - 70},${b[1]}`;
      links += `<path class="pp-link" d="${d}"/><circle class="pp-dot" r="3"><animateMotion dur="${(2.4 + (k % 5) * 0.45).toFixed(2)}s" begin="-${((k * 0.37) % 3).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`;
      k++;
    }));
  }
  const nodes = PIPE.cols.map((c, i) => `<text class="pp-col" x="${cw * i + cw / 2}" y="34" text-anchor="middle">${String(i + 1).padStart(2, '0')} · ${esc(T3([c[0], c[1], c[2]]))}</text>` + c[3].map((n, j) => {
    const [x, y] = pos[i][j];
    return `<g class="pp-node${i === 2 ? ' is-core' : ''}"><rect x="${x - 70}" y="${y - 17}" width="140" height="34" rx="17"/><text x="${x}" y="${y + 4}" text-anchor="middle">${esc(n)}</text></g>`;
  }).join('')).join('');
  return `<div class="dm-scroll"><svg class="pp" viewBox="0 0 ${W} ${H}" role="img" aria-label="Data platform pipeline">${links}${nodes}</svg></div>`;
}

// Career application state machine.
function stateMachine(T3) {
  const main = [['saved', 'saved'], ['ready', 'ready'], ['applied', 'applied'], ['assessment', 'assessment'], ['interview', 'interview'], ['offer', 'offer'], ['hired', 'hired']];
  const W = 1100, y = 110, gap = (W - 120) / (main.length - 1);
  const xs = main.map((_, i) => 60 + i * gap);
  const path = `M${xs[0]},${y} H${xs[xs.length - 1]}`;
  const nodes = main.map(([id], i) => `<g class="sm-node${i === 6 ? ' is-end' : ''}"><circle cx="${xs[i]}" cy="${y}" r="${i === 6 ? 15 : 12}"/><text x="${xs[i]}" y="${y - 28}" text-anchor="middle">${id}</text></g>`).join('');
  const side = [['rejected', 4], ['withdrawn', 2], ['skipped', 0]];
  const branches = side.map(([id, at]) => {
    const x = 60 + at * gap, bx = x + 40;
    return `<path class="sm-branch" d="M${x},${y + 12} C${x},${y + 70} ${bx},${y + 60} ${bx},${y + 110}"/><g class="sm-node is-term"><rect x="${bx - 48}" y="${y + 112}" width="96" height="26" rx="13"/><text x="${bx}" y="${y + 129}" text-anchor="middle">${id}</text></g>`;
  }).join('');
  const who = [[0.5, ['agent: build_package', 'agent: build_package', 'agent: build_package']], [2.5, ['human confirms', 'manusia konfirmasi', 'mens bevestigt']], [4.5, ['agent: interview prep', 'agent: persiapan wawancara', 'agent: interviewvoorbereiding']]];
  const labels = who.map(([at, t]) => `<text class="sm-who" x="${60 + at * gap}" y="${y - 52}" text-anchor="middle">${esc(T3(t))}</text>`).join('');
  return `<div class="dm-scroll"><svg class="sm" viewBox="0 0 ${W} 270" role="img" aria-label="Application state machine"><path class="sm-track" d="${path}"/><path class="sm-run" d="${path}"/>${branches}${nodes}${labels}<circle class="sm-token" r="6"><animateMotion dur="7s" repeatCount="indefinite" path="${path}"/></circle></svg></div>`;
}

// Real trace from the 21 Nov 2026 test run (costs measured, per model).
const TRACE = [
  ['T1', 'haiku-5.5', 'career_get_state → reply', 0.0044],
  ['T2', 'haiku-5.5', 'get_state · save_jobs(risky, 70) · get_cv_review', 0.0027],
  ['T3', 'haiku-5.5', 'build_package ✕ discarded → escalate', 0.0025],
  ['T3', 'sonnet-5.5', 'build_package → CV.pdf (1 page) + CV.docx', 0.1103],
];

const RADAR = { ind: [['AI tools', 23], ['Editing', 23], ['Ideas & taste', 12], ['Content sense', 12], ['Communication', 8], ['Ownership', 8], ['Time mgmt', 6], ['Coachability', 8]], a: [8, 7, 9, 7, 8, 9, 6, 8], b: [7, 7, 8, 8, 7, 8, 7, 9] };
function radar() {
  const cx = 190, cy = 190, R = 140, n = RADAR.ind.length;
  const pt = (i, v) => { const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(ang) * R * (v / 10), cy + Math.sin(ang) * R * (v / 10)]; };
  const rings = [2, 4, 6, 8, 10].map((v) => `<polygon class="rd-ring" points="${RADAR.ind.map((_, i) => pt(i, v).join(',')).join(' ')}"/>`).join('');
  const axes = RADAR.ind.map(([name, w], i) => { const [x, y] = pt(i, 10); const [lx, ly] = pt(i, 12.2); return `<line class="rd-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><text class="rd-lab" x="${lx}" y="${ly}" text-anchor="middle">${esc(name)} <tspan class="rd-w">${w}</tspan></text>`; }).join('');
  const poly = (vals, cls) => `<polygon class="${cls}" points="${vals.map((v, i) => pt(i, v).join(',')).join(' ')}"/>`;
  const score = (v) => v.reduce((s, x, i) => s + x * RADAR.ind[i][1], 0) / 100;
  return { svg: `<svg class="rd" viewBox="-40 -20 460 420" role="img" aria-label="Weighted interview scorecard">${rings}${axes}${poly(RADAR.a, 'rd-a')}${poly(RADAR.b, 'rd-b')}</svg>`, a: score(RADAR.a), b: score(RADAR.b) };
}

const MONITORS = [
  ['discount-health', ['Discount & order reconciliation', 'Rekonsiliasi diskon & order', 'Afstemming kortingen & orders'], 'daily 07:15 WIB'],
  ['reconcile-payments', ['Payment status vs provider', 'Status pembayaran vs penyedia', 'Betaalstatus vs provider'], 'daily 02:00 UTC'],
  ['isolation-suite', ['Cross-tenant isolation tests', 'Uji isolasi antar tenant', 'Isolatietests tussen tenants'], 'every deploy'],
  ['link-verifier', ['Every AI-cited link opened', 'Setiap link dari AI dibuka', 'Elke AI-link geopend'], 'every answer'],
  ['interview-sweep', ['Abandoned sessions + 90-day deletion', 'Sesi terbengkalai + hapus 90 hari', 'Verlaten sessies + verwijdering na 90 dagen'], 'every 10 min'],
  ['weekly-backup', ['Row counts + checksums per table', 'Jumlah baris + checksum per tabel', 'Rijtellingen + checksums per tabel'], 'weekly'],
];

const KIT = [
  [['Modeling', 'Pemodelan', 'Modellering'], ['Relational / ER', 'Event sourcing', 'JSONB documents', 'State machines', 'Multi-tenant isolation', 'Star schemas for BI']],
  [['Engineering', 'Rekayasa', 'Engineering'], ['PostgreSQL', 'Supabase · RLS · RPC', 'Node.js · Next.js', 'Python · pandas · NumPy', 'Webhooks · queues · cron']],
  [['AI systems', 'Sistem AI', 'AI-systemen'], ['Tool-using agents', 'Model routing', 'Prompt caching', 'STT → LLM → TTS', 'Evals & guardrails']],
  [['Analytics', 'Analitik', 'Analytics'], ['Power BI', 'Cohorts & funnels', 'Unit economics', 'fsQCA', 'Experiment design']],
];

export function dataModeling({ L, link }) {
  const T3 = (a) => L(a[0], a[1], a[2]);
  const head = (no, title, sub = '', dark = false) => `<div class="dm-head${dark ? ' is-dark' : ''} reveal"><span class="dm-head-no">${no}</span><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>`;

  // hero graph data: every entity of every model becomes a node, relations become edges
  const graph = { nodes: [], edges: [] };
  MODELS.forEach((m, gi) => {
    m.svg.entities.forEach((e) => graph.nodes.push({ id: `${m.id}.${e.id}`, label: e.name, g: gi, hub: !!e.accent }));
    m.svg.rels.forEach(([a, , b]) => graph.edges.push([`${m.id}.${a}`, `${m.id}.${b}`]));
  });
  graph.edges.push(['learning.l', 'career.l'], ['learning.l', 'hiring.a'], ['generation.u', 'learning.l'], ['career.a', 'hiring.a']);

  const stats = STATS.map(([n, suf, k, s], i) => `<div class="dm-stat" style="--i:${i}"><strong><span data-count="${n}">${n}</span>${suf}</strong><span>${T3(k)}</span><small>${T3(s)}</small></div>`).join('');

  const tabs = MODELS.map((m, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-model="${m.id}"><small>${String(i + 1).padStart(2, '0')}</small>${T3(m.title)}</button>`).join('');
  const panes = MODELS.map((m, i) => `<div class="dm-pane" role="tabpanel" data-pane="${m.id}" ${i ? 'data-hidden' : ''}><div class="dm-pane-copy"><span class="dm-kicker">${esc(m.kicker)}</span><h3>${T3(m.title)}</h3><p>${esc(T3(m.text))}</p><dl class="dm-facts">${m.facts.map(([n, t]) => `<div><dt>${esc(n)}</dt><dd>${esc(T3(t))}</dd></div>`).join('')}</dl><p class="dm-hint">${L('Hover or tap a table to trace its relations.', 'Arahkan atau ketuk tabel untuk melihat relasinya.', 'Wijs of tik een tabel aan om de relaties te volgen.')}</p></div>${er(m.svg)}</div>`).join('');

  const maxCost = Math.max(...TRACE.map((t) => t[3]));
  const trace = TRACE.map(([turn, model, what, cost], i) => `<div class="tr-row${model.startsWith('sonnet') ? ' is-strong' : ''}${what.includes('✕') ? ' is-void' : ''}" style="--i:${i}"><span class="tr-turn">${turn}</span><span class="tr-model">${model}</span><span class="tr-what">${esc(what)}</span><span class="tr-bar"><i style="--w:${Math.max(2, (cost / maxCost) * 100).toFixed(1)}%"></i></span><span class="tr-cost">$${cost.toFixed(4)}</span></div>`).join('');

  const rd = radar();
  const cellTabs = CELLS.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cell-tab="${c.id}"><span class="nb-tab-lang">${c.lang === 'py' ? 'py' : c.lang === 'js' ? 'js' : 'sql'}</span>${T3(c.title)}</button>`).join('');
  const cells = CELLS.map((c, i) => `<div class="nb-pane" data-cell-pane="${c.id}" ${i ? 'data-hidden' : ''}><p class="nb-note">${esc(T3(c.note))}</p>${cellHtml(c, T3)}</div>`).join('');

  const monitors = MONITORS.map(([id, t, when], i) => `<div class="mon" style="--i:${i}"><span class="mon-dot"></span><div><code>${id}</code><p>${T3(t)}</p></div><span class="mon-when">${when}</span><span class="mon-spark" aria-hidden="true">${Array.from({ length: 18 }, (_, k) => `<i style="--h:${(30 + ((k * 37 + i * 11) % 60)).toFixed(0)}%"></i>`).join('')}</span></div>`).join('');

  const kit = KIT.map(([t, items]) => `<div class="kit"><h3>${T3(t)}</h3>${items.map((x) => `<span>${esc(x)}</span>`).join('')}</div>`).join('');

  return `<section class="dm-hero" data-graph='${JSON.stringify(graph).replaceAll("'", '&#39;')}'>
  <canvas class="dm-graph" aria-hidden="true"></canvas>
  <div class="dm-hero-in">
    <p class="dm-eyebrow"><span class="dm-live"></span>${L('Data modeling · AI systems · Analytics', 'Data modeling · Sistem AI · Analitik', 'Datamodellering · AI-systemen · Analytics')}</p>
    <h1>${L('Data,<br><em>modelled.</em>', 'Data,<br><em>dimodelkan.</em>', 'Data,<br><em>gemodelleerd.</em>')}</h1>
    <p class="dm-hero-sub">${L('From the first entity diagram to the agents that read and write it. Three live products, one data platform, designed and run end to end.', 'Dari diagram entitas pertama sampai agent yang membaca dan menulisnya. Tiga produk live, satu platform data, dirancang dan dijalankan dari ujung ke ujung.', 'Van het eerste entiteitendiagram tot de agents die ermee werken. Drie live producten, één dataplatform, van begin tot eind ontworpen en beheerd.')}</p>
    <pre class="dm-term" aria-label="terminal"><span class="p">$</span> psql -c "select count(*) from information_schema.tables where table_schema in ('public','ms')"
<span class="o"> count</span>
<span class="o">-------</span>
<span class="o">   296</span>
<span class="p">$</span> <span class="cur"></span></pre>
  </div>
  <div class="dm-stats">${stats}</div>
</section>
<section class="section dm-sec">${head('01', L('System map', 'Peta sistem', 'Systeemkaart'), L('Every product writes into the same governed platform; each arrow below is a real path data takes in production.', 'Setiap produk menulis ke platform yang sama dan terkelola; setiap panah di bawah adalah jalur nyata data di produksi.', 'Elk product schrijft naar hetzelfde beheerde platform; elke pijl hieronder is een echt pad dat data in productie aflegt.'))}${pipeline(T3)}<p class="dm-swipe">${L('Swipe sideways to see the full diagram.', 'Geser ke samping untuk melihat diagram lengkap.', 'Veeg opzij voor het volledige diagram.')}</p></section>
<section class="section dm-sec dm-dark">${head('02', L('Entity model explorer', 'Penjelajah model entitas', 'Entiteitsmodel-verkenner'), L('Four production models. Field names simplified, values never shown.', 'Empat model produksi. Nama kolom disederhanakan, nilai tidak pernah ditampilkan.', 'Vier productiemodellen. Veldnamen vereenvoudigd, waarden nooit getoond.'), true)}<div class="dm-tabs" role="tablist">${tabs}</div>${panes}</section>
<section class="section dm-sec">${head('03', L('Modelling an agent', 'Memodelkan agent', 'Een agent modelleren'), L('Career Agent, live in Ask Matchi. The model decides; the data model and the tools enforce the rules.', 'Career Agent, live di Ask Matchi. Model yang memutuskan; model data dan tool yang menegakkan aturan.', 'Career Agent, live in Ask Matchi. Het model beslist; het datamodel en de tools handhaven de regels.'))}
  <h3 class="dm-h3">${L('Application lifecycle', 'Siklus lamaran', 'Levenscyclus van een sollicitatie')}</h3>${stateMachine(T3)}
  <div class="dm-trace reveal"><div class="dm-trace-head"><h3 class="dm-h3">${L('Real trace · model routing', 'Trace asli · routing model', 'Echte trace · modelroutering')}</h3><p>${L('Measured test run, 21 Nov 2026. Chat runs on the small model; when it reaches for a document tool, that round is replayed on the strong one.', 'Uji terukur, 21 Nov 2026. Percakapan memakai model kecil; saat ia meraih tool dokumen, ronde itu diulang di model kuat.', 'Gemeten testrun, 21 nov 2026. Gesprekken lopen op het kleine model; grijpt het naar een documenttool, dan wordt die ronde op het sterke model herhaald.')}</p></div>${trace}<div class="tr-total"><span>${L('Total', 'Total', 'Totaal')}</span><strong>$0.120</strong><span>${L('chat ≈ 50× cheaper than before', 'percakapan ≈ 50× lebih murah dari sebelumnya', 'gesprek ≈ 50× goedkoper dan voorheen')}</span></div></div>
</section>
<section class="section dm-sec dm-dark dm-code">${head('04', L('Code, with anonymised output', 'Kode, dengan hasil yang disamarkan', 'Code, met geanonimiseerde uitvoer'), L('Patterns from production, simplified. Every output value is synthetic or rescaled.', 'Pola dari produksi, disederhanakan. Setiap nilai hasil bersifat sintetis atau diskalakan.', 'Patronen uit productie, vereenvoudigd. Elke uitvoerwaarde is synthetisch of geschaald.'), true)}<div class="nb-tabs" role="tablist">${cellTabs}</div>${cells}</section>
<section class="section dm-sec">${head('05', L('Analytical models you can move', 'Model analitik yang bisa Anda geser', 'Analytische modellen om mee te spelen'))}
  <div class="dm-sims">
    <div class="sim reveal" data-sim="price"><h3>${L('Cost-plus pricing engine', 'Mesin harga cost-plus', 'Cost-plus prijsmotor')}</h3><p class="sim-f">credits = ⌈ cost ÷ ( value × (1 − m) ) ⌉</p>
      <label>${L('Provider cost per call', 'Biaya penyedia per panggilan', 'Providerkosten per aanroep')} <output data-o="cost">$0.110</output><input type="range" min="0" max="100" value="62" data-i="cost"></label>
      <label>${L('Target margin', 'Target margin', 'Doelmarge')} <output data-o="m">50%</output><input type="range" min="20" max="80" value="50" data-i="m"></label>
      <div class="sim-res"><div><small>${L('Credits charged', 'Kredit ditagih', 'Gerekende credits')}</small><strong data-o="credits">35</strong></div><div><small>${L('Revenue', 'Pendapatan', 'Omzet')}</small><strong data-o="rev">$0.22</strong></div><div><small>${L('Gross profit', 'Laba kotor', 'Brutowinst')}</small><strong data-o="gp">$0.11</strong></div></div>
      <div class="sim-bar"><i data-o="costbar"></i><i data-o="gpbar"></i></div></div>
    <div class="sim reveal" data-sim="be"><h3>${L('Break-even simulator', 'Simulator titik impas', 'Break-evensimulator')}</h3><p class="sim-f">c* = ( F ÷ N + f ) ÷ ( p − a + f )</p>
      <label>${L('Monthly active users', 'Pengguna aktif bulanan', 'Maandelijks actieve gebruikers')} <output data-o="n">5 000</output><input type="range" min="500" max="50000" step="500" value="5000" data-i="n"></label>
      <label>${L('Paid conversion', 'Konversi berbayar', 'Betaalde conversie')} <output data-o="c">4.0%</output><input type="range" min="0" max="120" value="40" data-i="c"></label>
      <svg class="sim-chart" viewBox="0 0 400 170" preserveAspectRatio="none" aria-hidden="true"><line class="sc-zero" x1="0" x2="400"/><path class="sc-line"/><line class="sc-be" y1="0" y2="170"/><circle class="sc-dot" r="5"/></svg>
      <div class="sim-res"><div><small>${L('Break-even', 'Titik impas', 'Break-even')}</small><strong data-o="be">—</strong></div><div><small>${L('Monthly result', 'Hasil per bulan', 'Maandresultaat')}</small><strong data-o="pl">—</strong></div></div>
      <p class="sim-note">${L('Illustrative inputs: price 43, AI cost 20 per paid user, 1.07 per free user, fixed 3 500 (thousands, per month).', 'Input ilustratif: harga 43, biaya AI 20 per pengguna berbayar, 1,07 per pengguna gratis, biaya tetap 3.500 (ribuan, per bulan).', 'Illustratieve invoer: prijs 43, AI-kosten 20 per betalende gebruiker, 1,07 per gratis gebruiker, vaste kosten 3 500 (duizenden, per maand).')}</p></div>
    <div class="sim reveal"><h3>${L('Weighted scorecard', 'Kartu skor berbobot', 'Gewogen scorekaart')}</h3><p class="sim-f">S = Σ wᵢxᵢ ÷ 100 · flag ⇔ ΔS ≥ 3.0</p>${rd.svg}<div class="sim-res"><div><small>${L('Reviewer A', 'Penilai A', 'Beoordelaar A')}</small><strong class="c-a">${rd.a.toFixed(2)}</strong></div><div><small>${L('Reviewer B', 'Penilai B', 'Beoordelaar B')}</small><strong class="c-b">${rd.b.toFixed(2)}</strong></div><div><small>${L('Composite', 'Gabungan', 'Samengesteld')}</small><strong>${((rd.a + rd.b) / 2).toFixed(2)}</strong></div></div><p class="sim-note">${L('Synthetic reviewers. Verdict bands are computed, never typed: ≥ 8.5 strong, ≥ 7.0 recommend.', 'Penilai sintetis. Kategori dihitung, tidak pernah diketik: ≥ 8,5 sangat, ≥ 7,0 direkomendasikan.', 'Synthetische beoordelaars. Oordelen worden berekend, nooit getypt: ≥ 8,5 sterk, ≥ 7,0 aanbevolen.')}</p></div>
  </div>
</section>
<section class="section dm-sec dm-dark">${head('06', L('Data quality, monitored', 'Kualitas data, terpantau', 'Datakwaliteit, bewaakt'), L('Checks that run in production without anyone remembering to run them.', 'Pemeriksaan yang berjalan di produksi tanpa perlu ada yang ingat menjalankannya.', 'Controles die in productie draaien zonder dat iemand eraan hoeft te denken.'), true)}<div class="mons">${monitors}</div>
  <div class="dm-rules">${[[L('Row-level security', 'Row-level security', 'Row-level security'), L('on every table, public roles revoked', 'di setiap tabel, peran publik dicabut', 'op elke tabel, publieke rollen ingetrokken')], [L('Exactly-once money', 'Uang tepat sekali', 'Geld precies één keer'), L('compare-and-swap + unique keys', 'compare-and-swap + kunci unik', 'compare-and-swap + unieke sleutels')], [L('Time as a type', 'Waktu sebagai tipe', 'Tijd als type'), L('market time zone, periods close 23:59', 'zona waktu pasar, periode tutup 23.59', 'tijdzone van de markt, periodes sluiten 23:59')], [L('Lossless by proof', 'Lossless terbukti', 'Verliesvrij aantoonbaar'), L('pixel-compared before replacing a file', 'dibandingkan per piksel sebelum mengganti file', 'pixel voor pixel vergeleken vóór vervanging')]].map(([a, b]) => `<div><strong>${a}</strong><span>${b}</span></div>`).join('')}</div>
</section>
<section class="section dm-sec">${head('07', L('Toolkit', 'Perangkat', 'Gereedschap'))}<div class="kits">${kit}</div><div class="dm-cta">${link('work', L('See the live products', 'Lihat produk live', 'Bekijk de live producten'))}${link('contact', L('Talk about a data role', 'Bicara soal peran data', 'Praat over een datarol'))}${link('documents/cv', L('Download CV', 'Unduh CV', 'Download cv'))}</div><p class="dm-privacy">${L('Privacy: no personal data, order, amount or identifier from production appears on this page.', 'Privasi: tidak ada data pribadi, order, nominal, atau ID dari produksi di halaman ini.', 'Privacy: op deze pagina staat geen persoonsgegeven, order, bedrag of identificatie uit productie.')}</p></section>`;
}
