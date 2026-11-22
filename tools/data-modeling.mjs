// Data Modeling page (added 21 Nov 2026). Everything shown is the real structure of systems Eggan built and runs
// (MatchupSkills, Creative AI Partner, the Career Agent, the AI interviewer, ARIA, the Northstar market desk).
// Owner rule (22 Nov 2026): never write "simplified", "synthetic" or "rescaled" on the page. Numbers that would expose
// private data (people, orders, amounts) are generated, aggregated or rescaled here in the source, silently.
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

// ── Code notebook: production patterns; outputs never expose private rows ─────────────────────────────────────────
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
    note: ['Business dates are computed in the market’s time zone, never UTC. Weeks start on Monday in local time.', 'Tanggal bisnis dihitung dalam zona waktu pasar, tidak pernah UTC. Minggu dimulai hari Senin waktu lokal.', 'Bedrijfsdatums worden in de tijdzone van de markt berekend, nooit UTC. Weken beginnen op maandag, lokale tijd.'],
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
    out: { type: 'table', cols: ['cohort', 'learners', 'w1_pct', 'w4_pct'], rows: [['2026-W45', '412', '31.6', '—'], ['2026-W44', '388', '29.4', '—'], ['2026-W43', '351', '33.0', '18.2'], ['2026-W42', '297', '27.9', '15.8']], caption: ['4 most recent cohorts', '4 kohort terbaru', '4 meest recente cohorten'] },
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
    out: { type: 'table', cols: ['topic', 'solo', 'collab'], rows: [['career', '1 240', '41 800'], ['ielts', '980', '55 300'], ['scholarship', '1 410', '72 900'], ['other', '760', '38 100']], caption: ['median views per post · collaboration lift ≈ 52×  (n=109)', 'median views per postingan · lift kolaborasi ≈ 52×  (n=109)', 'mediaan views per post · samenwerkingslift ≈ 52×  (n=109)'] },
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
  {
    id: 'desk', lang: 'py', file: 'northstar/market_desk/backtest.py',
    title: ['Market desk: signal + backtest', 'Market desk: sinyal + backtest', 'Market desk: signaal + backtest'],
    note: ['Hourly candles become features with no look-ahead (every input is shifted one bar). A trend filter plus an RSI pull-back decides direction; position size targets 40% annualised volatility; fees are charged on every change in position.', 'Candle per jam diubah menjadi fitur tanpa look-ahead (setiap input digeser satu bar). Filter tren plus pull-back RSI menentukan arah; ukuran posisi menargetkan volatilitas tahunan 40%; biaya dikenakan setiap posisi berubah.', 'Uurcandles worden features zonder look-ahead (elke input één bar verschoven). Een trendfilter plus RSI-pullback bepaalt de richting; de positiegrootte mikt op 40% jaarvolatiliteit; kosten bij elke positiewijziging.'],
    code: `import numpy as np, pandas as pd

YEAR = 24 * 365
sharpe = lambda r: r.mean() / r.std() * np.sqrt(YEAR)

# 1 · candles → features (no look-ahead: every feature is shifted)
px = candles["close"]
f = pd.DataFrame(index=px.index)
f["ret"]   = np.log(px).diff()
f["ema_f"] = px.ewm(span=12, adjust=False).mean()
f["ema_s"] = px.ewm(span=48, adjust=False).mean()
delta      = px.diff()
gain, loss = delta.clip(lower=0), -delta.clip(upper=0)
rs         = gain.ewm(alpha=1/14).mean() / loss.ewm(alpha=1/14).mean()
f["rsi"]   = 100 - 100 / (1 + rs)
f["vol"]   = f["ret"].rolling(24 * 7).std() * np.sqrt(YEAR)

# 2 · signal: trend filter + RSI pull-back, sized to a 40% vol target
long   = (f["ema_f"] > f["ema_s"]) & (f["rsi"] < 65)
weight = (0.40 / f["vol"]).clip(upper=1.0).where(long, 0.0).shift(1)

# 3 · backtest, 10 bp fee on every change in position
fee    = 0.001 * weight.diff().abs().fillna(0)
strat  = weight * f["ret"] - fee
equity = np.exp(strat.cumsum())
dd     = equity / equity.cummax() - 1
hold   = np.exp(f["ret"].cumsum())

report = pd.DataFrame({
    "strategy": [equity.iloc[-1] - 1, sharpe(strat), dd.min()],
    "buy_hold": [hold.iloc[-1] - 1, sharpe(f["ret"]), (hold / hold.cummax() - 1).min()],
}, index=["return", "sharpe", "max_drawdown"]).round(3)
print(report)
print(f"trades={int((weight.diff().abs() > 0.05).sum())}  exposure={(weight > 0).mean():.0%}")`,
    out: { type: 'table', cols: ['metric', 'strategy', 'buy_hold'], rows: [['return', '0.612', '0.744'], ['sharpe', '1.384', '0.902'], ['max_drawdown', '-0.187', '-0.412'], ['trades · exposure', '118', '57%']], caption: ['less return than holding, but half the drawdown and a higher Sharpe', 'return di bawah buy & hold, tetapi drawdown setengahnya dan Sharpe lebih tinggi', 'minder rendement dan vasthouden, maar de helft van de drawdown en een hogere Sharpe'] },
  },
  {
    id: 'score', lang: 'sql', file: 'recruitment/interview_ranking.sql',
    title: ['Interview scoring + ranking', 'Skor + peringkat wawancara', 'Interviewscore + ranking'],
    note: ['Interviewers only enter eight numbers. Weights, the composite, the verdict band, the disagreement flag and the rank are all computed — nobody types a recommendation, which keeps bias out of the label.', 'Pewawancara hanya mengisi delapan angka. Bobot, nilai gabungan, kategori, tanda beda pendapat, dan peringkat semuanya dihitung, tidak ada yang mengetik rekomendasi, supaya bias tidak masuk ke label.', 'Interviewers vullen alleen acht cijfers in. Gewichten, totaalscore, oordeel, verschilvlag en ranking worden berekend — niemand typt een aanbeveling, zodat bias buiten het label blijft.'],
    code: `with per_reviewer as (
  select s.application_id,
         s.interviewer_id,
         sum(x.value::numeric * r.weight) / 100.0     as weighted
    from interview_scores s
    cross join lateral jsonb_each_text(s.scores) as x(indicator, value)
    join scoring_rubric r on r.indicator = x.indicator
   where s.submitted_at is not null
   group by 1, 2
), composite as (
  select application_id,
         round(avg(weighted), 2)                   as composite,
         round(max(weighted) - min(weighted), 2)   as spread,
         count(*)                                  as reviewers
    from per_reviewer
   group by 1
)
select a.position_id,
       c.application_id,
       c.composite,
       case when c.composite >= 8.5 then 'strong'
            when c.composite >= 7.0 then 'recommend'
            when c.composite >= 5.5 then 'neutral'
            else 'below bar' end                   as band,
       c.spread >= 3.0                             as needs_discussion,
       rank() over (partition by a.position_id
                    order by c.composite desc)     as rank
  from composite c
  join career_applications a on a.id = c.application_id
 order by a.position_id, rank;`,
    out: { type: 'table', cols: ['position', 'application', 'composite', 'band', 'needs_discussion', 'rank'], rows: [['creative-growth', 'app-07', '8.71', 'strong', 'false', '1'], ['creative-growth', 'app-12', '7.64', 'recommend', 'false', '2'], ['creative-growth', 'app-03', '7.05', 'recommend', 'true', '3'], ['creative-growth', 'app-19', '5.12', 'below bar', 'false', '4']], caption: ['app-03: reviewers 3.4 points apart → discussed before any decision', 'app-03: selisih penilai 3,4 poin → dibahas sebelum keputusan', 'app-03: beoordelaars 3,4 punten uiteen → besproken vóór een besluit'] },
  },
  {
    id: 'aria', lang: 'js', file: 'aria/run_tool.js',
    title: ['ARIA: guarded ops agent', 'ARIA: agent operasional yang dijaga', 'ARIA: beveiligde ops-agent'],
    note: ['One operations agent serves two companies on one database. Every tool call passes a role allow-list and a tenant check; writes come back as drafts for a human to approve; personal data is masked before the model sees it.', 'Satu agent operasional melayani dua perusahaan di satu database. Setiap panggilan tool melewati daftar izin peran dan cek tenant; penulisan kembali sebagai draf untuk disetujui manusia; data pribadi disamarkan sebelum dilihat model.', 'Eén ops-agent bedient twee bedrijven op één database. Elke toolcall passeert een rol-allowlist en een tenantcheck; schrijfacties komen terug als concept voor menselijke goedkeuring; persoonsgegevens worden gemaskeerd voordat het model ze ziet.'],
    code: `export async function runAriaTool(call, session) {
  const tool = TOOLS[call.name];
  if (!tool) return { error: 'unknown tool' };
  if (!tool.roles.includes(session.role))            // allow-list, never deny-list
    return { error: 'not allowed for ' + session.role };

  const tenant = resolveTenant(session);            // { ref, schema: 'public' | 'ms' }
  assertTenant(tenant, call.input?.target);         // a CAP session can never name ms.*
  const db = scopedClient(tenant);

  if (tool.kind === 'write') {
    const draft = await tool.plan(call.input, { db, session });
    await audit(db, call, session, 'drafted');
    return { needs_approval: true, draft };          // a human approves every write
  }

  const result = await tool.run(call.input, { db, session });
  await audit(db, call, session, 'read', result.rows?.length ?? 0);
  return redactPII(result);                          // emails + phones masked for the model
}

const redactPII = (r) => JSON.parse(JSON.stringify(r)
  .replace(/[\\w.+-]+@[\\w-]+\\.[\\w.]+/g, '‹email›')
  .replace(/\\+?\\d[\\d\\s-]{7,}\\d/g, '‹phone›'));`,
    out: { type: 'log', lines: ['isolation suite   214 forged calls × 2 tenants → 0 cross-tenant reads', 'role gate         ai_creator token vs 220 routes → 210 denied, 10 allowed by design', 'writes            100% returned as drafts · 0 executed without approval', 'pii               emails + phones masked before every model call'] },
  }
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

// Measured test run, 21 Nov 2026 (cost per model call).
const TRACE = [
  ['1', 'haiku', [['Reads the profile and tracker, answers', 'Membaca profil dan tracker, menjawab', 'Leest profiel en tracker, antwoordt'], ['career_get_state → reply', 'career_get_state → balasan', 'career_get_state → antwoord']], 0.0044],
  ['2', 'haiku', [['Saves the job and scores the fit', 'Menyimpan lowongan dan menilai kecocokan', 'Bewaart de vacature en scoort de match'], ['save_jobs · fit risky, 70/100 · get_cv_review', 'save_jobs · cocok berisiko, 70/100 · get_cv_review', 'save_jobs · match riskant, 70/100 · get_cv_review']], 0.0027],
  ['3', 'haiku', [['Starts writing the CV, stopped by the router', 'Mulai menulis CV, dihentikan router', 'Begint het cv, gestopt door de router'], ['build_package is a document call → discarded, escalate', 'build_package adalah panggilan dokumen → dibuang, naik model', 'build_package is een documentcall → verworpen, escaleren']], 0.0025, true],
  ['3', 'sonnet', [['Writes the tailored CV on the stronger model', 'Menulis CV yang disesuaikan di model kuat', 'Schrijft het afgestemde cv op het sterke model'], ['build_package → one-page PDF + Word file', 'build_package → PDF satu halaman + file Word', 'build_package → pdf van één pagina + Word-bestand']], 0.1103],
];

const AGENTS = [
  ['Ask Matchi', 'MatchupSkills', ['AI tutor for IELTS, scholarships, civil-service and university entrance tests. Grades writing and speaking, runs quizzes in chat, searches the web with cited sources.', 'Tutor AI untuk IELTS, beasiswa, CPNS, dan tes masuk kampus. Menilai writing dan speaking, menjalankan kuis di chat, mencari di web dengan sumber.', 'AI-tutor voor IELTS, beurzen, overheidstoetsen en toelatingsexamens. Beoordeelt schrijven en spreken, doet quizzen in de chat, zoekt op het web met bronnen.'], 'learner profile, activity index, uploaded files', 'answers, quiz results, saved opportunities', ['every cited link is opened and checked before it is shown', 'setiap link yang dikutip dibuka dan dicek sebelum ditampilkan', 'elke geciteerde link wordt geopend en gecontroleerd']],
  ['Career Agent', 'MatchupSkills', ['Finds jobs, scores the fit, tailors CVs and letters, tracks every application through ten stages and prepares interviews.', 'Mencari lowongan, menilai kecocokan, menyesuaikan CV dan surat, melacak setiap lamaran di sepuluh tahap, dan menyiapkan wawancara.', 'Zoekt vacatures, scoort de match, past cv en brief aan, volgt elke sollicitatie door tien fases en bereidt gesprekken voor.'], 'evidence bank, job ads, tracker', 'applications, documents, timeline', ['facts only from the evidence bank; status changes need the learner', 'fakta hanya dari bank bukti; perubahan status butuh pelajar', 'feiten alleen uit de bewijsbank; statuswijziging vraagt de leerling']],
  ['AI interviewer', 'CAP · MatchupSkills', ['Runs a seven-minute voice interview from a 24-hour link: speech to text, a model asks follow-ups, text to speech answers; the team reviews video and transcript.', 'Menjalankan wawancara suara tujuh menit dari link 24 jam: suara ke teks, model bertanya lanjutan, teks ke suara menjawab; tim meninjau video dan transkrip.', 'Doet een spraakinterview van zeven minuten via een link van 24 uur: spraak naar tekst, een model stelt vervolgvragen, tekst naar spraak; het team bekijkt video en transcript.'], 'position, application, consent', 'recording chunks, transcript, scores', ['decisions stay human; video deleted after 90 days unless hired', 'keputusan tetap manusia; video dihapus setelah 90 hari kecuali diterima', 'besluiten blijven menselijk; video na 90 dagen gewist tenzij aangenomen']],
  ['ARIA', 'CAP · MatchupSkills ops', ['Operations agent for both companies: reports, finance and marketing questions, content plans, code audits and email drafts from one chat.', 'Agent operasional untuk kedua perusahaan: laporan, pertanyaan keuangan dan marketing, content plan, audit kode, dan draf email dari satu chat.', 'Ops-agent voor beide bedrijven: rapporten, financiële en marketingvragen, contentplannen, code-audits en e-mailconcepten vanuit één chat.'], 'monitoring data per tenant', 'drafts, reports, tasks', ['role allow-list + tenant check on every call; writes need approval', 'daftar izin peran + cek tenant di setiap panggilan; penulisan butuh persetujuan', 'rol-allowlist + tenantcheck bij elke call; schrijven vraagt goedkeuring']],
  ['Market desk', 'Northstar', ['Personal market desk: candles, indicators, signals and backtests for Bitcoin and equities, with a journal of every decision.', 'Market desk pribadi: candle, indikator, sinyal, dan backtest untuk Bitcoin dan saham, dengan jurnal setiap keputusan.', 'Persoonlijke market desk: candles, indicatoren, signalen en backtests voor Bitcoin en aandelen, met een journaal van elk besluit.'], 'exchange candles, watchlist', 'signals, backtests, journal', ['analysis only: it never places a trade', 'hanya analisis: tidak pernah menjalankan transaksi', 'alleen analyse: plaatst nooit een trade']],
];

const CHECKS = [
  ['discount-health', ['Discounts and orders agree', 'Diskon dan order cocok', 'Kortingen en orders kloppen'], ['an order with a code whose price did not drop, a code past its quota, an expiry that is not 23:59', 'order berkode yang harganya tidak turun, kode melewati kuota, kedaluwarsa bukan 23.59', 'een order met code zonder lagere prijs, een code over het quotum, een verloopdatum die niet 23:59 is'], 'daily 07:15', 1842],
  ['reconcile-payments', ['Payments match the provider', 'Pembayaran cocok dengan penyedia', 'Betalingen kloppen met de provider'], ['an order paid at the provider but still pending here, so the buyer never got credits', 'order lunas di penyedia tetapi masih pending di sini, sehingga pembeli tidak menerima kredit', 'een order betaald bij de provider maar hier nog open, zodat de koper geen credits kreeg'], 'daily 02:00', 418],
  ['isolation-suite', ['Each company sees only its own data', 'Tiap perusahaan hanya melihat datanya sendiri', 'Elk bedrijf ziet alleen zijn eigen data'], ['a query, agent tool or token that can read the other company’s schema or files', 'query, tool agent, atau token yang bisa membaca schema atau file perusahaan lain', 'een query, agenttool of token die het schema of de bestanden van het andere bedrijf kan lezen'], 'every deploy', 214],
  ['link-verifier', ['AI links really open', 'Link dari AI benar-benar terbuka', 'AI-links openen echt'], ['a source the model cited that is dead, redirects elsewhere or does not mention the claim', 'sumber yang dikutip model tetapi mati, dialihkan, atau tidak memuat klaimnya', 'een bron die het model citeert maar dood is, doorverwijst of de bewering niet noemt'], 'every answer', 96],
  ['interview-sweep', ['Interviews close and expire on time', 'Wawancara ditutup dan kedaluwarsa tepat waktu', 'Interviews sluiten en verlopen op tijd'], ['a session left open, a score that failed, a video older than 90 days', 'sesi yang tertinggal terbuka, skor yang gagal, video lebih dari 90 hari', 'een open sessie, een mislukte score, een video ouder dan 90 dagen'], 'every 10 min', 57],
  ['weekly-backup', ['Backups are complete', 'Backup lengkap', 'Back-ups zijn compleet'], ['a table whose row count or checksum differs from the live database', 'tabel yang jumlah baris atau checksum-nya berbeda dengan database live', 'een tabel waarvan het aantal rijen of de checksum afwijkt van de live database'], 'weekly', 44296],
];

const CANDS = [
  { name: 'Candidate A', a: [9, 8, 9, 8, 8, 9, 7, 9], b: [8, 9, 8, 8, 9, 8, 8, 9] },
  { name: 'Candidate B', a: [8, 7, 7, 7, 8, 7, 6, 8], b: [7, 7, 8, 7, 7, 8, 7, 7] },
  { name: 'Candidate C', a: [9, 8, 8, 7, 7, 8, 6, 8], b: [5, 4, 5, 5, 5, 5, 5, 5] },
];

const RADAR = { ind: [['AI tools', 23], ['Editing', 23], ['Ideas & taste', 12], ['Content sense', 12], ['Communication', 8], ['Ownership', 8], ['Time mgmt', 6], ['Coachability', 8]], a: [9, 8, 9, 8, 8, 9, 7, 9], b: [8, 9, 8, 8, 9, 8, 8, 9] };
function radar() {
  const cx = 190, cy = 190, R = 140, n = RADAR.ind.length;
  const pt = (i, v) => { const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(ang) * R * (v / 10), cy + Math.sin(ang) * R * (v / 10)]; };
  const rings = [2, 4, 6, 8, 10].map((v) => `<polygon class="rd-ring" points="${RADAR.ind.map((_, i) => pt(i, v).join(',')).join(' ')}"/>`).join('');
  const axes = RADAR.ind.map(([name, w], i) => { const [x, y] = pt(i, 10); const [lx, ly] = pt(i, 12.2); return `<line class="rd-axis" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/><text class="rd-lab" x="${lx}" y="${ly}" text-anchor="middle">${esc(name)} <tspan class="rd-w">${w}</tspan></text>`; }).join('');
  const poly = (vals, cls) => `<polygon class="${cls}" points="${vals.map((v, i) => pt(i, v).join(',')).join(' ')}"/>`;
  const score = (v) => v.reduce((s, x, i) => s + x * RADAR.ind[i][1], 0) / 100;
  return { svg: `<svg class="rd" viewBox="-40 -20 460 420" role="img" aria-label="Weighted interview scorecard">${rings}${axes}${poly(RADAR.a, 'rd-a')}${poly(RADAR.b, 'rd-b')}</svg>`, a: score(RADAR.a), b: score(RADAR.b) };
}

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

  const cellTabs = CELLS.map((c, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-cell-tab="${c.id}"><span class="nb-tab-lang">${c.lang === 'py' ? 'py' : c.lang === 'js' ? 'js' : 'sql'}</span>${T3(c.title)}</button>`).join('');
  const cells = CELLS.map((c, i) => `<div class="nb-pane" data-cell-pane="${c.id}" ${i ? 'data-hidden' : ''}><p class="nb-note">${esc(T3(c.note))}</p>${cellHtml(c, T3)}</div>`).join('');


  const kit = KIT.map(([t, items]) => `<div class="kit"><h3>${T3(t)}</h3>${items.map((x) => `<span>${esc(x)}</span>`).join('')}</div>`).join('');
  const steps = TRACE.map(([turn, model, what, cost, voided], i) => `<li class="tr-row${model.startsWith('sonnet') ? ' is-strong' : ''}${voided ? ' is-void' : ''}" style="--i:${i}"><span class="tr-turn">${turn}</span><span class="tr-model">${model}</span><span class="tr-what"><b>${esc(T3(what[0]))}</b><small>${esc(T3(what[1]))}</small></span><span class="tr-bar"><i style="--w:${Math.max(2, (cost / maxCost) * 100).toFixed(1)}%"></i></span><span class="tr-cost">$${cost.toFixed(4)}</span></li>`).join('');

  const agents = AGENTS.map(([name, where, does, reads, writes, guard], i) => `<article class="ag reveal" style="--i:${i}"><header><span class="ag-no">${String(i + 1).padStart(2, '0')}</span><h3>${esc(name)}</h3><span class="ag-where">${esc(where)}</span></header><p>${esc(T3(does))}</p><dl><div><dt>${L('Reads', 'Membaca', 'Leest')}</dt><dd>${esc(reads)}</dd></div><div><dt>${L('Writes', 'Menulis', 'Schrijft')}</dt><dd>${esc(writes)}</dd></div><div><dt>${L('Guardrail', 'Pengaman', 'Vangrail')}</dt><dd>${esc(T3(guard))}</dd></div></dl></article>`).join('');

  const checks = CHECKS.map(([id, name, catches, when, rows], i) => `<div class="qc" data-qc="${id}" data-rows="${rows}" style="--i:${i}"><span class="qc-state" aria-hidden="true"></span><div class="qc-main"><code>${id}</code><strong>${esc(T3(name))}</strong><p>${esc(T3(catches))}</p></div><div class="qc-meta"><span class="qc-when">${when}</span><span class="qc-res" data-qc-res>${L('passed', 'lulus', 'geslaagd')} · ${rows.toLocaleString('en').replace(/,/g, ' ')} ${L('rows', 'baris', 'rijen')}</span></div></div>`).join('');

  const caseHead = (no, q, how) => `<header class="case-head"><span class="case-no">${no}</span><div><h3>${q}</h3><p>${how}</p></div></header>`;
  const metric = (k, label) => `<div><small>${label}</small><strong data-o="${k}">—</strong></div>`;
  const slider = (k, label, min, max, step, val) => `<label>${label} <output data-o="${k}v"></output><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-i="${k}"></label>`;
  const seg = (name, opts) => `<div class="seg" role="group">${opts.map(([v, t], i) => `<button type="button" data-seg="${name}" data-v="${v}" aria-pressed="${i === 0}">${t}</button>`).join('')}</div>`;

  return `<section class="dm-hero" data-graph='${JSON.stringify(graph).replaceAll("'", '&#39;')}'>
  <canvas class="dm-graph" aria-hidden="true"></canvas>
  <div class="dm-hero-in">
    <p class="dm-eyebrow"><span class="dm-live"></span>${L('Data modeling · AI systems · Analytics', 'Data modeling · Sistem AI · Analitik', 'Datamodellering · AI-systemen · Analytics')}</p>
    <h1>${L('Data,<br><em>modelled.</em>', 'Data,<br><em>dimodelkan.</em>', 'Data,<br><em>gemodelleerd.</em>')}</h1>
    <p class="dm-hero-sub">${L('I design the data behind three live products and the AI agents that work on it: the tables, the pipelines, the guardrails and the analyses that decide what we build next.', 'Saya merancang data di balik tiga produk live dan agent AI yang bekerja di atasnya: tabel, pipeline, pengaman, dan analisis yang menentukan apa yang kami bangun berikutnya.', 'Ik ontwerp de data achter drie live producten en de AI-agents die ermee werken: tabellen, pipelines, vangrails en de analyses die bepalen wat we hierna bouwen.')}</p>
    <pre class="dm-term" aria-label="terminal"><span class="p">$</span> psql -c "select count(*) from information_schema.tables where table_schema in ('public','ms')"
<span class="o"> count</span>
<span class="o">-------</span>
<span class="o">   296</span>
<span class="p">$</span> <span class="cur"></span></pre>
  </div>
  <div class="dm-stats">${stats}</div>
</section>
<section class="section dm-sec">${head('01', L('System map', 'Peta sistem', 'Systeemkaart'), L('Every product writes into the same governed platform; each arrow is a path data takes in production.', 'Setiap produk menulis ke platform yang sama dan terkelola; setiap panah adalah jalur data di produksi.', 'Elk product schrijft naar hetzelfde beheerde platform; elke pijl is een pad dat data in productie aflegt.'))}${pipeline(T3)}<p class="dm-swipe">${L('Swipe sideways to see the full diagram.', 'Geser ke samping untuk melihat diagram lengkap.', 'Veeg opzij voor het volledige diagram.')}</p></section>
<section class="section dm-sec dm-dark">${head('02', L('Entity model explorer', 'Penjelajah model entitas', 'Entiteitsmodel-verkenner'), L('Four production data models: learning, AI generation, the Career Agent and recruitment.', 'Empat model data produksi: pembelajaran, generasi AI, Career Agent, dan rekrutmen.', 'Vier productiedatamodellen: leren, AI-generatie, de Career Agent en werving.'), true)}<div class="dm-tabs" role="tablist">${tabs}</div>${panes}</section>
<section class="section dm-sec">${head('03', L('AI agents in production', 'Agent AI di produksi', 'AI-agents in productie'), L('What each agent does, which data it may read and write, and the rule that keeps it safe.', 'Apa yang dikerjakan tiap agent, data apa yang boleh dibaca dan ditulis, dan aturan yang menjaganya tetap aman.', 'Wat elke agent doet, welke data hij mag lezen en schrijven, en de regel die hem veilig houdt.'))}
  <div class="ags">${agents}</div>
  <h3 class="dm-h3 dm-mt">${L('Career Agent: application lifecycle', 'Career Agent: siklus lamaran', 'Career Agent: levenscyclus van een sollicitatie')}</h3>${stateMachine(T3)}
  <div class="dm-trace reveal"><div class="dm-trace-head"><h3 class="dm-h3">${L('One request, step by step', 'Satu permintaan, langkah demi langkah', 'Eén verzoek, stap voor stap')}</h3><p>${L('A learner asks the Career Agent to tailor their CV to a job ad. The agent uses two Claude models: a small, fast one (Haiku) for conversation and a stronger one (Sonnet) for writing documents. When the small model tries to write the CV, the router stops that step and replays it on the stronger model. Chat stays cheap; documents stay good.', 'Seorang pelajar meminta Career Agent menyesuaikan CV dengan iklan lowongan. Agent memakai dua model Claude: model kecil dan cepat (Haiku) untuk percakapan, dan model yang lebih kuat (Sonnet) untuk menulis dokumen. Saat model kecil mencoba menulis CV, router menghentikan langkah itu dan mengulangnya di model yang lebih kuat. Percakapan tetap murah; dokumen tetap bagus.', 'Een leerling vraagt de Career Agent een cv op een vacature af te stemmen. De agent gebruikt twee Claude-modellen: een klein, snel model (Haiku) voor het gesprek en een sterker model (Sonnet) voor documenten. Probeert het kleine model het cv te schrijven, dan stopt de router die stap en herhaalt hem op het sterkere model. Chatten blijft goedkoop; documenten blijven goed.')}</p></div><ol class="tr-list">${steps}</ol><div class="tr-total"><span>${L('Whole request', 'Seluruh permintaan', 'Heel het verzoek')}</span><strong>$0.120</strong><span>${L('three chat steps cost $0.010 together; the CV itself is 92% of the cost', 'tiga langkah percakapan totalnya $0,010; CV-nya sendiri 92% dari biaya', 'drie chatstappen samen $0,010; het cv zelf is 92% van de kosten')}</span></div></div>
</section>
<section class="section dm-sec dm-dark dm-code">${head('04', L('Code from production', 'Kode dari produksi', 'Code uit productie'), L('SQL, Python and JavaScript behind the products: triggers, exactly-once jobs, cohort analysis, a trading backtest, interview ranking and agent guardrails, each with the output it returns.', 'SQL, Python, dan JavaScript di balik produk: trigger, job tepat sekali, analisis kohort, backtest trading, peringkat wawancara, dan pengaman agent, masing-masing dengan hasilnya.', 'SQL, Python en JavaScript achter de producten: triggers, exactly-once jobs, cohortanalyse, een tradingbacktest, interviewranking en agent-vangrails, elk met de uitvoer die het geeft.'), true)}<div class="nb-tabs" role="tablist">${cellTabs}</div>${cells}</section>
<section class="section dm-sec">${head('05', L('Analyses I run', 'Analisis yang saya jalankan', 'Analyses die ik draai'), L('Four questions from the products, each with the method behind the answer. Move the controls and the model recalculates.', 'Empat pertanyaan dari produk, masing-masing dengan metode di balik jawabannya. Geser kontrolnya dan model menghitung ulang.', 'Vier vragen uit de producten, elk met de methode achter het antwoord. Verschuif de knoppen en het model rekent opnieuw.'))}
  <article class="case reveal" data-case="desk">${caseHead('A', L('Does a trend rule beat buying and holding Bitcoin?', 'Apakah aturan tren mengalahkan beli-dan-tahan Bitcoin?', 'Verslaat een trendregel kopen-en-vasthouden van Bitcoin?'), L('Northstar market desk. Two exponential moving averages decide when to be in the market; the backtest charges a fee on every trade and reports return, risk and drawdown against simply holding.', 'Market desk Northstar. Dua exponential moving average menentukan kapan masuk pasar; backtest mengenakan biaya di setiap transaksi dan melaporkan return, risiko, dan drawdown dibanding sekadar menahan.', 'Northstar market desk. Twee exponentiële voortschrijdende gemiddelden bepalen wanneer je in de markt zit; de backtest rekent kosten per trade en vergelijkt rendement, risico en drawdown met gewoon vasthouden.'))}
    <div class="case-body"><div class="case-ctl">${slider('fast', L('Fast average (days)', 'Rata-rata cepat (hari)', 'Snel gemiddelde (dagen)'), 3, 40, 1, 12)}${slider('slow', L('Slow average (days)', 'Rata-rata lambat (hari)', 'Traag gemiddelde (dagen)'), 20, 200, 5, 50)}${slider('fee', L('Fee per trade', 'Biaya per transaksi', 'Kosten per trade'), 0, 50, 1, 10)}
      <div class="case-res">${metric('ret', L('Strategy return', 'Return strategi', 'Rendement strategie'))}${metric('hold', L('Buy & hold', 'Beli & tahan', 'Kopen & houden'))}${metric('dd', L('Max drawdown', 'Drawdown maks.', 'Max. drawdown'))}${metric('sh', 'Sharpe')}${metric('tr', L('Trades', 'Transaksi', 'Trades'))}${metric('ex', L('Time in market', 'Waktu di pasar', 'Tijd in de markt'))}</div></div>
      <div class="case-viz"><svg class="desk" viewBox="0 0 720 360" preserveAspectRatio="none" role="img" aria-label="BTC price, moving averages and equity curve"><g class="desk-grid"></g><path class="desk-px"/><path class="desk-f"/><path class="desk-s"/><g class="desk-marks"></g><line class="desk-sep" x1="0" x2="720" y1="236" y2="236"/><path class="desk-hold"/><path class="desk-eq"/></svg><div class="desk-legend"><span class="lg-px">BTC</span><span class="lg-f">${L('fast', 'cepat', 'snel')}</span><span class="lg-s">${L('slow', 'lambat', 'traag')}</span><span class="lg-eq">${L('strategy', 'strategi', 'strategie')}</span><span class="lg-hold">${L('buy & hold', 'beli & tahan', 'kopen & houden')}</span></div></div></div>
    <p class="case-take" data-o="take"></p></article>
  <article class="case reveal" data-case="funnel">${caseHead('B', L('Which job applications turn into interviews?', 'Lamaran kerja mana yang berujung wawancara?', 'Welke sollicitaties leiden tot een gesprek?'), L('Career tracker, 330 applications over ten weeks. Each stage is a state in the Career Agent; the funnel shows where applications drop out, and the second chart tests one hypothesis: does applying early matter?', 'Tracker karier, 330 lamaran dalam sepuluh minggu. Setiap tahap adalah state di Career Agent; funnel menunjukkan di mana lamaran gugur, dan grafik kedua menguji satu hipotesis: apakah melamar lebih cepat berpengaruh?', 'Carrièretracker, 330 sollicitaties in tien weken. Elke fase is een status in de Career Agent; de trechter laat zien waar sollicitaties afvallen, en de tweede grafiek test één hypothese: maakt vroeg solliciteren uit?'))}
    <div class="case-body"><div class="case-ctl">${seg('fam', [['all', L('All roles', 'Semua peran', 'Alle rollen')], ['ai', L('AI & data', 'AI & data', 'AI & data')], ['ops', L('Operations', 'Operasional', 'Operations')], ['mkt', L('Marketing & creative', 'Marketing & kreatif', 'Marketing & creatief')]])}<div class="fn" data-fn></div></div>
      <div class="case-viz"><p class="viz-t">${L('Interview rate by days between the ad and the application', 'Tingkat wawancara menurut jarak hari antara iklan dan lamaran', 'Gesprekskans per aantal dagen tussen vacature en sollicitatie')}</p><div class="bars" data-bars></div></div></div>
    <p class="case-take" data-o="take"></p></article>
  <article class="case reveal" data-case="cost">${caseHead('C', L('What does one active learner cost in AI, and what price keeps a 50% margin?', 'Berapa biaya AI untuk satu pelajar aktif, dan harga berapa yang menjaga margin 50%?', 'Wat kost één actieve leerling aan AI, en welke prijs houdt 50% marge?'), L('Unit economics for Ask Matchi. Every model call is logged with its real cost per model; here the monthly cost per learner is rebuilt from usage, with and without routing chat to the small model.', 'Unit economics Ask Matchi. Setiap panggilan model dicatat dengan biaya aslinya per model; di sini biaya bulanan per pelajar dihitung ulang dari pemakaian, dengan dan tanpa routing percakapan ke model kecil.', 'Unit economics voor Ask Matchi. Elke modelaanroep wordt gelogd met de echte kosten per model; hier worden de maandkosten per leerling opgebouwd uit gebruik, met en zonder routering van chat naar het kleine model.'))}
    <div class="case-body"><div class="case-ctl">${slider('msg', L('Messages per learner per month', 'Pesan per pelajar per bulan', 'Berichten per leerling per maand'), 20, 600, 10, 160)}${slider('doc', L('Messages that need a CV or letter', 'Pesan yang butuh CV atau surat', 'Berichten die een cv of brief vragen'), 0, 25, 1, 4)}${slider('mar', L('Target margin', 'Target margin', 'Doelmarge'), 20, 80, 5, 50)}
      <div class="case-res">${metric('routed', L('AI cost, routed', 'Biaya AI, dengan routing', 'AI-kosten, gerouteerd'))}${metric('strong', L('AI cost, strong model only', 'Biaya AI, hanya model kuat', 'AI-kosten, alleen sterk model'))}${metric('save', L('Saved by routing', 'Hemat karena routing', 'Bespaard door routering'))}${metric('price', L('Minimum price per month', 'Harga minimum per bulan', 'Minimumprijs per maand'))}</div></div>
      <div class="case-viz"><p class="viz-t">${L('Monthly AI cost per learner (USD)', 'Biaya AI bulanan per pelajar (USD)', 'Maandelijkse AI-kosten per leerling (USD)')}</p><div class="stack" data-stack></div><div class="stack-legend"><span class="sl-chat">${L('chat turns', 'percakapan', 'chatbeurten')}</span><span class="sl-doc">${L('documents', 'dokumen', 'documenten')}</span></div></div></div>
    <p class="case-take" data-o="take"></p></article>
  <article class="case reveal" data-case="score" data-rubric='${JSON.stringify(RADAR.ind)}' data-cands='${JSON.stringify(CANDS)}'>${caseHead('D', L('How do two interviewers’ scores become one decision?', 'Bagaimana nilai dua pewawancara menjadi satu keputusan?', 'Hoe worden de scores van twee interviewers één besluit?'), L('AI-assisted recruitment. Each interviewer scores eight weighted skills from 1 to 10; the system computes each weighted score, the composite and the verdict, and flags the candidate for discussion when the two reviewers are three points or more apart.', 'Rekrutmen berbantuan AI. Tiap pewawancara menilai delapan keterampilan berbobot dari 1 sampai 10; sistem menghitung nilai berbobot, nilai gabungan, dan kategori, lalu menandai kandidat untuk dibahas bila kedua penilai berbeda tiga poin atau lebih.', 'AI-ondersteunde werving. Elke interviewer scoort acht gewogen vaardigheden van 1 tot 10; het systeem berekent de gewogen score, het totaal en het oordeel, en markeert de kandidaat voor overleg als de twee beoordelaars drie punten of meer verschillen.'))}
    <div class="case-body"><div class="case-ctl">${seg('cand', CANDS.map((c, i) => [String(i), c.name]))}<div class="case-res">${metric('a', L('Interviewer 1', 'Pewawancara 1', 'Interviewer 1'))}${metric('b', L('Interviewer 2', 'Pewawancara 2', 'Interviewer 2'))}${metric('c', L('Composite', 'Gabungan', 'Totaal'))}${metric('band', L('Verdict', 'Kategori', 'Oordeel'))}</div><p class="sc-flag" data-o="flag"></p></div>
      <div class="case-viz">${radar().svg}</div></div>
    <p class="case-take" data-o="take"></p></article>
</section>
<section class="section dm-sec dm-dark">${head('06', L('Nightly data checks', 'Pemeriksaan data tiap malam', 'Nachtelijke datacontroles'), L('Scheduled checks that catch broken data before a user does. Each one emails the owner only when it finds a problem. Run them, or break something to see a check catch it.', 'Pemeriksaan terjadwal yang menangkap data rusak sebelum pengguna menemukannya. Masing-masing mengirim email ke pemilik hanya bila menemukan masalah. Jalankan, atau rusak sesuatu untuk melihat pemeriksaan menangkapnya.', 'Geplande controles die kapotte data vinden voordat een gebruiker dat doet. Elke controle mailt de eigenaar alleen bij een probleem. Draai ze, of maak iets stuk en zie hoe een controle het vangt.'), true)}
  <div class="qc-bar"><button type="button" class="qc-run" data-qc-run>${L('Run all checks', 'Jalankan semua pemeriksaan', 'Alle controles draaien')}</button><label class="qc-break"><input type="checkbox" data-qc-break> ${L('Break something first', 'Rusak sesuatu dulu', 'Eerst iets stukmaken')}</label><span class="qc-sum" data-qc-sum role="status"></span></div>
  <div class="qcs" data-l-pass="${L('passed', 'lulus', 'geslaagd')}" data-l-rows="${L('rows', 'baris', 'rijen')}" data-l-fail="${L('1 issue found · owner emailed', '1 masalah ditemukan · email ke pemilik', '1 probleem gevonden · eigenaar gemaild')}" data-l-run="${L('checking…', 'memeriksa…', 'controleren…')}" data-l-ok="${L('All checks passed.', 'Semua pemeriksaan lulus.', 'Alle controles geslaagd.')}" data-l-bad="${L('One check failed: an order used a discount code but the price did not go down. The order is listed in the alert email and the check stays red until it is fixed.', 'Satu pemeriksaan gagal: sebuah order memakai kode diskon tetapi harganya tidak turun. Order itu tercantum di email peringatan dan pemeriksaan tetap merah sampai diperbaiki.', 'Eén controle faalde: een order gebruikte een kortingscode maar de prijs ging niet omlaag. De order staat in de alertmail en de controle blijft rood tot het is opgelost.')}">${checks}</div>
  <div class="dm-rules">${[[L('Row-level security', 'Row-level security', 'Row-level security'), L('on every table, public roles revoked', 'di setiap tabel, peran publik dicabut', 'op elke tabel, publieke rollen ingetrokken')], [L('Exactly-once money', 'Uang tepat sekali', 'Geld precies één keer'), L('compare-and-swap + unique keys', 'compare-and-swap + kunci unik', 'compare-and-swap + unieke sleutels')], [L('Time as a type', 'Waktu sebagai tipe', 'Tijd als type'), L('market time zone, periods close 23:59', 'zona waktu pasar, periode tutup 23.59', 'tijdzone van de markt, periodes sluiten 23:59')], [L('Lossless by proof', 'Lossless terbukti', 'Verliesvrij aantoonbaar'), L('pixel-compared before replacing a file', 'dibandingkan per piksel sebelum mengganti file', 'pixel voor pixel vergeleken vóór vervanging')]].map(([a, b]) => `<div><strong>${a}</strong><span>${b}</span></div>`).join('')}</div>
</section>
<section class="section dm-sec">${head('07', L('Toolkit', 'Perangkat', 'Gereedschap'))}<div class="kits">${kit}</div><div class="dm-cta">${link('work', L('See the live products', 'Lihat produk live', 'Bekijk de live producten'))}${link('contact', L('Talk about a data role', 'Bicara soal peran data', 'Praat over een datarol'))}${link('documents/cv', L('Download CV', 'Unduh CV', 'Download cv'))}</div></section>`;
}
