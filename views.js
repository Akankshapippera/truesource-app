/* TrueSource views: landing, founder, customer and partner interfaces. */
(function () {
  'use strict';
  var T = window.TS;
  var S = function () { return T.S(); };
  var app = document.getElementById('app');
  var charts = [];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }
  function f$(x) { x = Number(x); return (x < 0 ? '-$' : '$') + Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function f0(x) { return Number(x).toLocaleString('en-US', { maximumFractionDigits: 0 }); }
  function f1(x) { return Number(x).toFixed(1) + '%'; }
  function killCharts() { charts.forEach(function (c) { c.destroy(); }); charts = []; }
  function chart(id, cfg) { var el = document.getElementById(id); if (!el || !window.Chart) return null; var c = new Chart(el, cfg); charts.push(c); return c; }
  function chip(ch) { return '<span class="chip" style="background:' + T.COLOR[ch] + '">' + T.NAME[ch] + '</span>'; }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; t.setAttribute('role', 'status'); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2600); }
  var cur = location.hash || '#/';
  function go(h) { cur = h; try { if (location.hash !== h) location.hash = h; } catch (e) {} route(); }

  var IC = {
    home: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    tag: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.3"/></svg>',
    orders: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M4 9h16M9 9v11"/></svg>',
    advisor: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    season: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    loyal: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.6A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>',
    help: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.7M12 17h.01"/></svg>',
    swap: '<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h14l-3-3M20 16H6l3 3"/></svg>'
  };
  var LOGO = '<span class="logo"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.4" fill="#fff"/></svg></span>';

  /* ================= tour ================= */
  var TOURS = {
    founder: [
      { r: '/founder/home', t: 'Your live dashboard', p: 'Six KPIs and four charts show where orders, profit and repeat customers come from. Use the switch at the top to compare Dataset 1 with live orders.' },
      { r: '/founder/tags', t: 'Create a tag for a channel', p: 'Pick a channel, a name and a code. TrueSource builds the tracking link and QR code, and saves them to the library.' },
      { r: '/founder/orders', t: 'See the data flow', p: 'Press "Simulate orders" to add tagged orders. Every order shows how its channel was found: tag, code, checkout answer, or not found.' },
      { r: '/founder/advisor', t: 'Budget Advisor', p: 'Plain rules turn the numbers into suggestions. Move the sliders to change the thresholds. It only suggests, and never promises results.' },
      { r: '/founder/seasonal', t: 'Seasonal Planner and Loyalty Radar', p: 'The planner shows when each channel is busiest. The Loyalty Radar compares repeat customers across channels.' }
    ],
    customer: [
      { r: '/shop', t: 'Choose how the customer arrived', p: 'The dashed box lets you pretend to arrive from an ad, a creator post, a market QR code, a friend, or with no tag at all.' },
      { r: '/shop/checkout', t: 'Checkout captures the channel', p: 'A tag or code is picked up automatically. If neither exists, a one-click question asks how the customer heard about the shop.' }
    ],
    partner: [
      { r: '/partner', t: 'Your link, code and results', p: 'Choose your partnership. You get a link, a QR code, a promo code and the number of orders credited to you.' }
    ]
  };
  var tour = null;
  function tourCard() {
    if (!tour) return '';
    var steps = TOURS[tour.role], st = steps[tour.i];
    return '<div class="tour" role="dialog" aria-label="Guided tour"><div class="n">STEP ' + (tour.i + 1) + ' OF ' + steps.length + '</div><h3>' + esc(st.t) + '</h3><p>' + esc(st.p) + '</p>' +
      '<div class="row"><button class="btn sm ghost" style="color:#fff;border-color:#444" data-act="tour-close">Close</button><span class="row">' +
      (tour.i > 0 ? '<button class="btn sm" data-act="tour-back">Back</button>' : '') +
      '<button class="btn sm primary" data-act="tour-next">' + (tour.i === steps.length - 1 ? 'Finish' : 'Next') + '</button></span></div></div>';
  }
  function startTour(role) { tour = { role: role, i: 0 }; S().tourSeen[role] = true; T.save(); go('#' + TOURS[role][0].r); }
  function banner(role) {
    if (S().tourSeen[role] || tour) return '';
    return '<div class="banner"><div><b>New here?</b> Take the 2-minute guided tour of this ' + role + ' view.</div><div class="row"><button class="btn sm primary" data-act="tour-start" data-role="' + role + '">Start the tour</button><button class="btn sm" data-act="banner-close" data-role="' + role + '">Not now</button></div></div>';
  }

  /* ================= landing ================= */
  function vLanding() {
    app.innerHTML = '<div class="landing">' +
      '<div class="brand">' + LOGO + ' TrueSource</div>' +
      '<div class="hero"><h1>Know where every order <em>comes from</em>.</h1><p>A low-cost attribution app for a small hot sauce brand. It captures the channel behind each order, then shows the founder what is working and where the budget should go.</p></div>' +
      '<div class="flow-strip"><span class="st">Tag every channel</span><span class="ar">&rarr;</span><span class="st">Capture at checkout</span><span class="ar">&rarr;</span><span class="st">Resolve the channel</span><span class="ar">&rarr;</span><span class="st">Measure KPIs</span><span class="ar">&rarr;</span><span class="st">Decide the budget</span></div>' +
      '<h2 style="margin:34px 0 0;font-size:22px">Choose a role to explore (no password needed)</h2>' +
      '<div class="roles">' +
      role('founder', 'var(--red-soft)', 'var(--red)', '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>', 'Founder', 'Owner of the brand. Sees the dashboard and decides the budget.', ['Create tags, links and QR codes', 'Watch orders and the data flow', 'Get Budget Advisor guidance']) +
      role('customer', 'var(--blue-soft)', 'var(--blue)', '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14l-1.5 11h-11z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>', 'Customer', 'Shops for a bottle and checks out. TrueSource captures the channel.', ['Arrive from any channel', 'Use a code at checkout', 'Answer the one-click question']) +
      role('partner', 'var(--gold-soft)', 'var(--gold)', '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6M16 14c3 0 6 1.6 6 5"/></svg>', 'Channel Partner', 'An influencer, a market booth helper, or a referrer.', ['Get your link and QR code', 'See your promo code', 'Track orders credited to you']) +
      '</div>' +
      '<div class="note"><b>Prototype notes.</b> Data is synthetic: Dataset 1 holds 2,500 orders for a fictional brand. Orders you place here stay in your own browser only. The Budget Advisor gives guidance, not guaranteed results.</div></div>';
    function role(id, bg, fg, icon, name, desc, list) {
      return '<div class="role"><div class="ico" style="background:' + bg + ';color:' + fg + '">' + icon + '</div><h3>' + name + '</h3><p>' + desc + '</p><ul>' + list.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>' +
        '<button class="btn primary" data-act="role" data-role="' + id + '">Enter as ' + name + '</button></div>';
    }
  }

  /* ================= founder shell ================= */
  var NAV = [['/founder/home', 'Dashboard', 'home'], ['/founder/tags', 'Tag Builder', 'tag'], ['/founder/orders', 'Orders and Data Flow', 'orders'], ['/founder/advisor', 'Budget Advisor', 'advisor'], ['/founder/seasonal', 'Seasonal Planner', 'season'], ['/founder/loyalty', 'Loyalty Radar', 'loyal'], ['/founder/help', 'Tutorial', 'help']];
  function shell(path, title, sub, body, scope) {
    var nav = NAV.map(function (n) { return '<a class="nav ' + (n[0] === path ? 'on' : '') + '" href="#' + n[0] + '">' + IC[n[2]] + '<span>' + n[1] + '</span></a>'; }).join('');
    var seg = scope ? '<div class="seg" role="group" aria-label="Data shown">' + [['baseline', 'Dataset 1 (2,500)'], ['live', 'Live orders'], ['all', 'All']].map(function (s) { return '<button data-act="scope" data-scope="' + s[0] + '" class="' + (S().scope === s[0] ? 'on' : '') + '">' + s[1] + '</button>'; }).join('') + '</div>' : '';
    app.innerHTML = '<div class="shell"><aside class="side"><div class="brand">' + LOGO + ' TrueSource</div>' + nav + '<div class="grow"></div><a class="nav" href="#/">' + IC.swap + '<span>Switch role</span></a><div class="who">Viewing as Founder<br>Prototype, synthetic data</div></aside>' +
      '<main class="main"><div class="top"><div><h1>' + title + '</h1><div class="sub">' + sub + '</div></div>' + seg + '</div>' + banner('founder') + body + '</main></div>' + tourCard();
  }

  /* ---------- founder: dashboard ---------- */
  function vHome() {
    var sc = S().scope, K = T.kpis(sc), A = K.all, B = T.kpis('baseline').all, L = T.kpis('live').all;
    var attributed = T.CH.filter(function (c) { return c !== 'Unattributed'; });
    var bestCh = attributed.slice().sort(function (a, b) { return K.by[b].ppo - K.by[a].ppo; })[0];
    var base = sc !== 'baseline';
    var tiles = [
      ['Unattributed revenue rate', f1(A.unattr_rev), base ? 'Dataset 1: <b>' + f1(B.unattr_rev) + '</b> of net revenue' : 'Share of net revenue with no channel', 'var(--red)'],
      ['Profit per order', f$(A.ppo), 'Top channel: <b>' + (K.by[bestCh].n ? T.NAME[bestCh] : 'n/a') + '</b>', 'var(--green)'],
      ['Marketing return (ROI)', A.mkt ? (A.profit / A.mkt).toFixed(2) + 'x' : 'n/a', 'Profit for every $1 of marketing cost', 'var(--blue)'],
      ['UTM tagging coverage', f1(A.utm_cov_digital), 'Paid social and influencer orders with a UTM tag', 'var(--purple)'],
      ['Discount give-away rate', f1(A.give), 'Share of gross revenue given as discounts', 'var(--gold)'],
      ['Repeat customer rate', f1(A.rep_rate), 'Orders from returning customers', 'var(--gray)']
    ];
    var liveN = S().orders.length;
    var cmp = liveN ? '<div class="tablewrap"><table class="t"><thead><tr><th>Measure</th><th class="num">Dataset 1 (before)</th><th class="num">Live orders (after)</th><th class="num">Change</th></tr></thead><tbody>' +
      [['Orders with no channel', B.unattr_ord, L.unattr_ord], ['Revenue with no channel', B.unattr_rev, L.unattr_rev], ['Orders with a channel', 100 - B.unattr_ord, 100 - L.unattr_ord]].map(function (r) {
        var d = r[2] - r[1]; return '<tr><td>' + r[0] + '</td><td class="num">' + f1(r[1]) + '</td><td class="num">' + f1(r[2]) + '</td><td class="num"><b style="color:' + ((r[0] === 'Orders with a channel') === (d > 0) ? 'var(--green)' : 'var(--red)') + '">' + (d > 0 ? '+' : '') + d.toFixed(1) + ' pts</b></td></tr>'; }).join('') + '</tbody></table></div>' :
      '<p class="muted">No live orders yet. Place an order as a Customer, or press "Simulate orders" on the Orders page, to see the change.</p><a class="btn primary sm" href="#/founder/orders">Go to Orders and Data Flow</a>';
    var body = '<div class="grid g6" style="margin-bottom:16px">' + tiles.map(function (t) { return '<div class="kpi" style="--c:' + t[3] + '"><div class="k">' + t[0] + '</div><div class="v">' + t[1] + '</div><div class="d">' + t[2] + '</div></div>'; }).join('') + '</div>' +
      '<div class="grid g2" style="margin-bottom:16px">' +
      '<div class="card"><h3>Orders by channel</h3><div class="cap">How many orders each channel brought in</div><div class="chartbox"><canvas id="c1" role="img" aria-label="Bar chart of orders by channel"></canvas></div></div>' +
      '<div class="card"><h3>Profit per order by channel</h3><div class="cap">After cost of goods and marketing cost</div><div class="chartbox"><canvas id="c2" role="img" aria-label="Bar chart of profit per order by channel"></canvas></div></div>' +
      '<div class="card"><h3>Marketing return by channel</h3><div class="cap">Profit per $1 of marketing cost (paid channels only)</div><div class="chartbox"><canvas id="c3" role="img" aria-label="Bar chart of marketing return"></canvas></div></div>' +
      '<div class="card"><h3>Repeat customer rate by channel</h3><div class="cap">Percent of orders from returning customers</div><div class="chartbox"><canvas id="c4" role="img" aria-label="Bar chart of repeat rate"></canvas></div></div></div>' +
      '<div class="card"><h3>Before and after TrueSource</h3><div class="cap">Dataset 1 is the current state. Live orders are the ones captured with TrueSource in this app.</div>' + cmp + '</div>' +
      '<p class="muted small" style="margin-top:14px">Scope: ' + ({ baseline: 'Dataset 1 only', live: 'live orders only', all: 'Dataset 1 plus live orders' })[sc] + '. ' + f0(A.n) + ' orders, ' + f$(A.net) + ' net revenue, ' + f$(A.profit) + ' profit.</p>';
    shell('/founder/home', 'Dashboard', 'Where orders, profit and loyal customers come from', body, true);
    var chs = T.CH, cols = chs.map(function (c) { return T.COLOR[c]; }), labels = chs.map(function (c) { return T.NAME[c]; });
    var opt = function (fmt, max) { return { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return fmt(c.parsed.y); } } } }, scales: { y: { beginAtZero: true, suggestedMax: max, grid: { color: '#eee9dc' }, ticks: { callback: function (v) { return fmt(v); } } }, x: { grid: { display: false } } } }; };
    chart('c1', { type: 'bar', data: { labels: labels, datasets: [{ data: chs.map(function (c) { return K.by[c].n; }), backgroundColor: cols, borderRadius: 6 }] }, options: opt(f0) });
    chart('c2', { type: 'bar', data: { labels: labels, datasets: [{ data: chs.map(function (c) { return +K.by[c].ppo.toFixed(2); }), backgroundColor: cols, borderRadius: 6 }] }, options: opt(f$) });
    var paid = ['Paid_Social', 'Influencer', 'Farmers_Market'];
    chart('c3', { type: 'bar', data: { labels: paid.map(function (c) { return T.NAME[c]; }), datasets: [{ data: paid.map(function (c) { return K.by[c].roi == null ? 0 : +K.by[c].roi.toFixed(2); }), backgroundColor: paid.map(function (c) { return T.COLOR[c]; }), borderRadius: 6 }] }, options: opt(function (v) { return v + 'x'; }) });
    chart('c4', { type: 'bar', data: { labels: labels, datasets: [{ data: chs.map(function (c) { return +K.by[c].rep_rate.toFixed(1); }), backgroundColor: cols, borderRadius: 6 }] }, options: opt(function (v) { return v + '%'; }, 100) });
  }

  /* ---------- founder: tag builder ---------- */
  function qrSvg(text, cell) { try { var q = qrcode(0, 'M'); q.addData(text); q.make(); return q.createSvgTag({ cellSize: cell || 4, margin: 2, scalable: true }); } catch (e) { return '<div class="small">QR code could not be drawn for this link.</div>'; } }
  function vTags() {
    var tags = S().tags;
    var chOpts = ['Paid_Social', 'Influencer', 'Farmers_Market', 'Word_of_Mouth'].map(function (c) { return '<option value="' + c + '">' + T.NAME[c] + '</option>'; }).join('');
    var rows = tags.map(function (t) {
      return '<tr><td>' + chip(t.channel) + '</td><td>' + T.TYPE_LABEL[t.type] + '</td><td>' + esc(t.name) + '</td><td>' + esc(t.campaign || '-') + '</td><td class="mono">' + esc(t.code) + '</td><td class="num">' + t.disc + '%</td>' +
        '<td><button class="btn sm" data-act="copy" data-text="' + esc(T.tagLink(t)) + '">Copy link</button> <button class="btn sm" data-act="qr" data-id="' + t.id + '">QR</button> <button class="btn sm" data-act="test" data-id="' + t.id + '">Test</button></td></tr>';
    }).join('');
    var body = '<div class="grid g2" style="margin-bottom:16px">' +
      '<div class="card"><h3>New tag</h3><div class="cap">One tag per campaign, booth or referral card</div><form id="tagform" class="form" novalidate>' +
      '<label class="f">Channel<select id="tf-ch">' + chOpts + '</select><span class="h" id="tf-type"></span></label>' +
      '<label class="f">Name<input type="text" id="tf-name" maxlength="40" placeholder="Example: Summer story ads" autocomplete="off"></label>' +
      '<label class="f" id="tf-campwrap">Campaign ID<input type="text" id="tf-camp" maxlength="20" autocomplete="off"><span class="h">Used as utm_campaign in the link</span></label>' +
      '<label class="f">Promo code<input type="text" id="tf-code" maxlength="14" autocomplete="off"><span class="h">4 to 14 letters or numbers, saved in capitals</span></label>' +
      '<label class="f"><span>Discount: <b id="tf-dv">10%</b></span><input type="range" id="tf-disc" min="0" max="20" step="1" value="10"></label>' +
      '<div id="tf-msg"></div><div class="row"><button class="btn primary" type="submit">Save tag to library</button></div></form></div>' +
      '<div class="card"><h3>Link and QR preview</h3><div class="cap">What the customer will scan or click</div><div class="linkbox mono" id="tf-link"></div>' +
      '<div class="row" style="margin-top:12px;align-items:flex-start"><div class="qrbox" id="tf-qr"></div><div class="small muted" style="flex:1;min-width:160px">The Capture Layer reads this link when the customer arrives. The link carries the channel, and the code gives the discount.<br><br><button class="btn sm" id="tf-copy" type="button">Copy link</button></div></div></div></div>' +
      '<div class="card"><h3>Tag library (' + tags.length + ')</h3><div class="cap">Every active link and code. The first 11 match the codes found in Dataset 1.</div><div class="tablewrap"><table class="t"><thead><tr><th>Channel</th><th>Type</th><th>Name</th><th>Campaign</th><th>Code</th><th class="num">Discount</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
    shell('/founder/tags', 'Tag Builder', 'Create the links and codes that tell TrueSource where an order came from', body, false);
    var ch = $('#tf-ch'), nm = $('#tf-name'), camp = $('#tf-camp'), code = $('#tf-code'), disc = $('#tf-disc');
    var codeTouched = false, campTouched = false;
    function cur() { var c = ch.value; return { id: 'preview', channel: c, type: T.TAG_TYPE[c], name: nm.value.trim(), campaign: (camp.value || '').trim(), code: (code.value || '').trim().toUpperCase(), disc: +disc.value }; }
    function slug(s) { return s.toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 8); }
    function refresh() {
      var t = cur(); $('#tf-dv').textContent = t.disc + '%';
      $('#tf-type').textContent = 'This creates a ' + T.TYPE_LABEL[t.type] + '.';
      $('#tf-campwrap').classList.toggle('hide', t.type !== 'utm');
      var okLink = t.code && (t.type !== 'utm' || t.campaign);
      var link = okLink ? T.tagLink(t) : 'Fill in the form to see the link';
      $('#tf-link').textContent = link;
      $('#tf-qr').innerHTML = okLink ? qrSvg(link, 4) : '<div style="width:170px;height:170px;display:grid;place-items:center;color:#999;font-size:13px;line-height:1.3;text-align:center">QR code appears here</div>';
    }
    ch.addEventListener('change', function () { disc.value = T.DEFAULT_DISC[ch.value]; refresh(); });
    nm.addEventListener('input', function () { if (!codeTouched) code.value = slug(nm.value) + (disc.value > 0 ? disc.value : ''); if (!campTouched) camp.value = nm.value ? 'CMP-' + slug(nm.value).slice(0, 6) : ''; refresh(); });
    camp.addEventListener('input', function () { campTouched = true; refresh(); });
    code.addEventListener('input', function () { codeTouched = true; refresh(); });
    disc.addEventListener('input', refresh);
    $('#tf-copy').addEventListener('click', function () { copyText($('#tf-link').textContent); });
    disc.value = T.DEFAULT_DISC[ch.value]; refresh();
    $('#tagform').addEventListener('submit', function (e) {
      e.preventDefault(); var t = cur(), msg = $('#tf-msg'), err = '';
      if (!t.name) err = 'Give the tag a name.';
      else if (t.type === 'utm' && !t.campaign) err = 'A UTM link needs a campaign ID.';
      else if (!/^[A-Z0-9]{4,14}$/.test(t.code)) err = 'The code needs 4 to 14 letters or numbers.';
      else if (T.findTag(t.code) && !(t.type === 'utm' && T.findTag(t.code).channel === t.channel)) err = 'That code is already used by another channel. Pick a different one.';
      else if (t.type === 'utm' && S().tags.some(function (x) { return x.campaign && x.campaign.toLowerCase() === t.campaign.toLowerCase(); })) err = 'That campaign ID already exists.';
      if (err) { msg.innerHTML = '<div class="err" role="alert">' + err + '</div>'; return; }
      var s = S(); s.tagSeq++; t.id = 'T' + String(s.tagSeq).padStart(2, '0'); s.tags.push(t); T.save(); toast('Tag saved: ' + t.code); route();
    });
  }

  /* ---------- founder: orders and data flow ---------- */
  var METHOD = { utm: ['UTM tag', 'ok'], qr: ['QR + code', 'ok'], promo: ['Promo code', 'ok'], referral: ['Referral code', 'ok'], fallback: ['Checkout answer', 'med'], none: ['Not found', 'none'] };
  function vOrders() {
    var s = S(), o = s.orders, n = o.length;
    var cnt = { utm: 0, qr: 0, promo: 0, referral: 0, fallback: 0, none: 0 };
    o.forEach(function (x) { cnt[x.method]++; });
    var tagged = cnt.utm + cnt.qr + cnt.promo + cnt.referral;
    var live = T.kpis('live').all;
    var pipe = '<div class="pipe">' +
      '<div class="p"><div class="n">STEP 1</div><b>Capture Layer</b><div class="c">' + tagged + '</div><div class="small muted">orders arrived with a tag or code</div></div>' +
      '<div class="p"><div class="n">STEP 2</div><b>Checkout Question</b><div class="c">' + cnt.fallback + '</div><div class="small muted">channels found from the answer</div></div>' +
      '<div class="p"><div class="n">STEP 3</div><b>Channel Resolver</b><div class="c">' + (n - cnt.none) + '</div><div class="small muted">orders given a channel</div></div>' +
      '<div class="p"><div class="n">STEP 4</div><b>Orders table</b><div class="c">' + n + '</div><div class="small muted">live orders stored</div></div>' +
      '<div class="p"><div class="n">STEP 5</div><b>KPI Engine</b><div class="c">' + (n ? f1(live.unattr_ord) : '-') + '</div><div class="small muted">orders still without a channel</div></div></div>';
    var last = null; for (var i = o.length - 1; i >= 0; i--) { if (o[i].trace) { last = o[i]; break; } }
    var traceHtml = last ? '<div class="row" style="margin-bottom:12px"><b>' + last.id + '</b>' + chip(last.channel) + '<span class="pill ' + METHOD[last.method][1] + '">' + METHOD[last.method][0] + '</span></div><div class="trace">' + last.trace.map(function (t, i) { return '<div class="s"><div class="b">' + (i + 1) + '</div><div><b>' + esc(t.step) + '</b><span class="muted">' + esc(t.text) + '</span></div></div>'; }).join('') + '</div>' :
      '<p class="muted">No customer-placed order yet. Enter as a Customer, place an order, and the full trace of what TrueSource did appears here.</p><a class="btn sm" href="#/shop">Open the customer shop</a>';
    var rows = o.slice().reverse().slice(0, 100).map(function (x) {
      return '<tr><td class="mono">' + x.id + '</td><td>' + x.date.slice(0, 10) + '</td><td>' + chip(x.channel) + '</td><td><span class="pill ' + METHOD[x.method][1] + '">' + METHOD[x.method][0] + '</span></td><td class="mono">' + esc(x.promo || '-') + '</td><td class="num">' + x.units + '</td><td class="num">' + x.disc + '%</td><td class="num">' + f$(x.net) + '</td><td class="num">' + f$(x.profit) + '</td><td>' + (x.simulated ? '<span class="pill sim">simulated</span>' : '<span class="pill ok">placed</span>') + '</td></tr>';
    }).join('');
    var body = '<div class="card" style="margin-bottom:16px"><h3>How data moves through TrueSource</h3><div class="cap">Counts are for live orders in this browser</div>' + pipe + '</div>' +
      '<div class="grid g2" style="margin-bottom:16px"><div class="card"><h3>Simulate orders</h3><div class="cap">Adds demo orders as if TrueSource had been running for the last 30 days. They are labeled "simulated".</div><div class="form">' +
      '<label class="f">Number of orders<select id="sim-n"><option>25</option><option selected>100</option><option>250</option></select></label>' +
      '<label class="f"><span>Tag adoption: <b id="sim-av">85%</b></span><span class="h">How many orders arrive with a tag or code</span><input type="range" id="sim-a" min="0" max="100" value="85"></label>' +
      '<label class="f"><span>Checkout question answered: <b id="sim-bv">70%</b></span><span class="h">Of the orders that arrive without a tag</span><input type="range" id="sim-b" min="0" max="100" value="70"></label>' +
      '<div class="row"><button class="btn primary" data-act="sim">Simulate orders</button><button class="btn" data-act="export">Export CSV</button><button class="btn ghost" data-act="clear">Clear live orders</button></div></div></div>' +
      '<div class="card"><h3>Latest order trace</h3><div class="cap">Step by step, how one order became a record</div>' + traceHtml + '</div></div>' +
      '<div class="card"><h3>Live orders (' + n + ')</h3><div class="cap">Newest first, showing up to 100</div>' + (n ? '<div class="tablewrap" style="max-height:440px"><table class="t"><thead><tr><th>Order</th><th>Date</th><th>Channel</th><th>How found</th><th>Code</th><th class="num">Units</th><th class="num">Discount</th><th class="num">Net</th><th class="num">Profit</th><th>Type</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="muted">No live orders yet.</p>') + '</div>' +
      '<p class="muted small" style="margin-top:14px"><a href="#" data-act="resetall">Reset the whole prototype</a> (clears live orders and custom tags).</p>';
    shell('/founder/orders', 'Orders and Data Flow', 'How an order is entered, matched to a channel, stored and counted', body, false);
    var a = $('#sim-a'), b = $('#sim-b');
    a.addEventListener('input', function () { $('#sim-av').textContent = a.value + '%'; }); b.addEventListener('input', function () { $('#sim-bv').textContent = b.value + '%'; });
  }

  /* ---------- founder: advisor ---------- */
  function vAdvisor() {
    var s = S().settings;
    function slider(id, label, key, min, max, unit) { return '<label class="f"><span>' + label + ': <b id="v-' + id + '">' + s[key] + unit + '</b></span><input type="range" id="s-' + id + '" min="' + min + '" max="' + max + '" value="' + s[key] + '" data-key="' + key + '" data-unit="' + unit + '"></label>'; }
    var body = '<div class="card" style="margin-bottom:16px"><h3>Advisor thresholds</h3><div class="cap">The rules are plain and open. Change a threshold and the advice updates. Review these by hand as the business grows.</div><div class="grid g2">' +
      slider('u', 'A1 Unattributed orders limit', 'unattr', 1, 30, '%') + slider('c', 'A2 Cost share minus profit share', 'costGap', 5, 40, ' pts') + slider('r', 'A3 Repeat rate target', 'repeat', 20, 70, '%') + slider('d', 'A4 Discount give-away limit', 'disc', 5, 20, '%') + '</div></div>' +
      '<div id="advlist" class="grid"></div>' +
      '<div class="card" style="margin-top:16px"><h3>How the rules work</h3><div class="small muted"><b>A1</b> flags weak tracking. <b>A2</b> compares a paid channel\'s share of marketing cost with its share of profit. <b>A3</b> highlights channels with high repeat rates. <b>A4</b> flags big discounts on channels that earn less than the store average. The advisor only suggests what to test. It never promises results or exact budget amounts.</div></div>';
    shell('/founder/advisor', 'Budget Advisor', 'Rule-based guidance from the numbers on your dashboard', body, true);
    function draw() {
      var items = T.advise(S().scope);
      $('#advlist').innerHTML = items.map(function (a) { return '<div class="adv ' + a.lvl + '"><div class="bar"></div><div class="body"><span class="pill ' + (a.lvl === 'warn' ? 'warn' : (a.lvl === 'good' ? 'ok' : 'med')) + ' rule">Rule ' + a.rule + '</span><h3>' + esc(a.title) + '</h3><div class="small muted" style="margin:4px 0 6px">' + esc(a.evidence) + '</div><div>' + esc(a.action) + '</div></div></div>'; }).join('');
    }
    $$('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { S().settings[r.dataset.key] = +r.value; $('#v-' + r.id.slice(2)).textContent = r.value + r.dataset.unit; T.save(); draw(); }); });
    draw();
  }

  /* ---------- founder: seasonal ---------- */
  function vSeasonal() {
    var M = T.monthly();
    var peak = T.CH.filter(function (c) { return c !== 'Unattributed'; }).map(function (c) { var a = M[c], mx = Math.max.apply(null, a), i = a.indexOf(mx); return [c, i, mx]; });
    var rows = peak.map(function (p) { var prev = (p[1] + 11) % 12; return '<tr><td>' + chip(p[0]) + '</td><td>' + MONTHS[p[1]] + '</td><td class="num">' + p[2] + '</td><td>Start promotions in ' + MONTHS[prev] + '</td></tr>'; }).join('');
    var tot = new Array(12).fill(0); T.CH.forEach(function (c) { M[c].forEach(function (v, i) { tot[i] += v; }); });
    var busy = tot.indexOf(Math.max.apply(null, tot)), quiet = tot.indexOf(Math.min.apply(null, tot));
    var body = '<div class="card" style="margin-bottom:16px"><h3>Orders by month and channel</h3><div class="cap">From Dataset 1, calendar year 2025. Busiest month overall: <b>' + MONTHS[busy] + '</b> (' + tot[busy] + ' orders). Quietest: <b>' + MONTHS[quiet] + '</b> (' + tot[quiet] + ').</div><div class="chartbox" style="height:340px"><canvas id="sc1" role="img" aria-label="Stacked bar chart of monthly orders by channel"></canvas></div></div>' +
      '<div class="card"><h3>When to plan each channel</h3><div class="cap">Each channel\'s peak month, with a suggested start one month earlier</div><div class="tablewrap"><table class="t"><thead><tr><th>Channel</th><th>Peak month</th><th class="num">Orders</th><th>Suggested plan</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="small muted" style="margin-bottom:0">Seasonal patterns come from one year of synthetic data, so treat them as a starting point to test.</p></div>';
    shell('/founder/seasonal', 'Seasonal Planner', 'See when each channel is busiest so spending can lead the peak', body, false);
    chart('sc1', { type: 'bar', data: { labels: MONTHS.map(function (m) { return m.slice(0, 3); }), datasets: T.CH.map(function (c) { return { label: T.NAME[c], data: M[c], backgroundColor: T.COLOR[c], borderRadius: 3 }; }) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: '#eee9dc' } } } } });
  }

  /* ---------- founder: loyalty ---------- */
  function vLoyalty() {
    var K = T.kpis(S().scope), chs = T.CH;
    var metrics = [['Repeat rate', function (b) { return b.rep_rate; }], ['Lifetime orders', function (b) { return b.life_avg; }], ['Session time', function (b) { return b.sess_avg; }], ['Profit per order', function (b) { return b.ppo; }]];
    var mx = metrics.map(function (m) { return Math.max.apply(null, chs.map(function (c) { return m[1](K.by[c]) || 0; })) || 1; });
    var ds = chs.map(function (c) { return { label: T.NAME[c], data: metrics.map(function (m, i) { return Math.max(0, +(m[1](K.by[c]) / mx[i] * 100).toFixed(1)); }), borderColor: T.COLOR[c], backgroundColor: T.COLOR[c] + '22', pointBackgroundColor: T.COLOR[c], borderWidth: 2.5 }; });
    var ranked = chs.filter(function (c) { return c !== 'Unattributed' && K.by[c].n; }).sort(function (a, b) { return K.by[b].rep_rate - K.by[a].rep_rate; });
    var rows = ranked.map(function (c, i) { var b = K.by[c]; return '<tr><td>' + (i + 1) + '</td><td>' + chip(c) + '</td><td class="num">' + f1(b.rep_rate) + '</td><td class="num">' + b.life_avg.toFixed(2) + '</td><td class="num">' + (c === 'Farmers_Market' ? 'In person' : Math.round(b.sess_avg) + ' s') + '</td><td class="num">' + f$(b.ppo) + '</td></tr>'; }).join('');
    var body = '<div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1.2fr)"><div class="card"><h3>Loyalty by channel</h3><div class="cap">Each axis is scaled so the best channel is 100</div><div class="chartbox" style="height:380px"><canvas id="lr1" role="img" aria-label="Radar chart comparing channels on repeat rate, lifetime orders, session time and profit per order"></canvas></div></div>' +
      '<div class="card"><h3>Channel ranking by repeat rate</h3><div class="cap">Channels that bring customers back</div><div class="tablewrap"><table class="t"><thead><tr><th>#</th><th>Channel</th><th class="num">Repeat</th><th class="num">Lifetime</th><th class="num">Session</th><th class="num">Profit/order</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="small muted">Lifetime orders and session time come from Dataset 1. Farmers market sales happen in person, so they have no web session time. For live orders, a returning customer counts as 2 lifetime orders and a new one as 1.</p></div></div>';
    shell('/founder/loyalty', 'Loyalty Radar', 'Which channels bring customers who come back', body, true);
    chart('lr1', { type: 'radar', data: { labels: metrics.map(function (m) { return m[0]; }), datasets: ds }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } }, scales: { r: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { color: '#e6e1d3' } } } } });
  }

  /* ---------- founder: tutorial ---------- */
  function vHelp() {
    var maps = [['Capture Layer', 'Reads the UTM link, QR code, promo code or referral code when a customer arrives.', 'Customer shop, Tag Builder'], ['Checkout Fallback Capture', 'Asks one question when no tag was found.', 'Customer checkout'], ['KPI Engine', 'Turns orders into the six KPIs with the same formulas as the KPI deck.', 'Dashboard'], ['Live Attribution Dashboard', 'Shows KPIs and charts, before and after.', 'Dashboard'], ['Budget Advisor', 'Rule-based suggestions with editable thresholds.', 'Budget Advisor'], ['Seasonal Planner', 'Shows when each channel is busiest.', 'Seasonal Planner'], ['Loyalty Radar', 'Compares repeat customers by channel.', 'Loyalty Radar']];
    var steps = [['Open the Customer shop and pick how the customer arrived', 'Choose "Paid social ad", then press Open as this customer.'], ['Check out', 'The code is filled in for you. Place the order.'], ['Return as Founder and open Orders and Data Flow', 'The trace shows each step TrueSource took, and the order is in the table.'], ['Try a customer with no tag', 'Arrive by typing the address directly. The checkout asks "How did you hear about us?".'], ['Simulate a month of orders', 'Use the sliders to set how many orders carry a tag, then see the unattributed share fall on the Dashboard.'], ['Read the Budget Advisor', 'Change a threshold and watch the advice change.']];
    var body = '<div class="row" style="margin-bottom:16px"><button class="btn primary" data-act="tour-start" data-role="founder">Start the Founder tour</button><a class="btn" href="#/shop">Open the Customer shop</a><a class="btn" href="#/partner">Open the Partner view</a></div>' +
      '<div class="grid g2" style="margin-bottom:16px"><div class="card"><h3>Try the whole flow in six steps</h3><div class="cap">About two minutes</div><div class="trace">' + steps.map(function (s, i) { return '<div class="s"><div class="b">' + (i + 1) + '</div><div><b>' + s[0] + '</b><span class="muted">' + s[1] + '</span></div></div>'; }).join('') + '</div></div>' +
      '<div class="card"><h3>How the channel is decided</h3><div class="cap">The Channel Resolver checks these rules in order</div><div class="trace">' + [['Rule 1: UTM tag', 'A UTM source on the link names the channel (paid social or influencer).'], ['Rule 2: promo or referral code', 'A registered code names its channel (market QR, booth scan, referral).'], ['Rule 3: checkout answer', 'With no tag, the customer\'s answer to "How did you hear about us?" names it.'], ['Rule 4: not found', 'With no tag and no answer, the order stays Unattributed.']].map(function (s, i) { return '<div class="s"><div class="b">' + (i + 1) + '</div><div><b>' + s[0] + '</b><span class="muted">' + s[1] + '</span></div></div>'; }).join('') + '</div></div></div>' +
      '<div class="card"><h3>Where each architecture module lives in the app</h3><div class="cap">These are the Application Architecture components from the enterprise architecture</div><div class="mapgrid">' + maps.map(function (m) { return '<div class="map"><span class="tg">' + m[2].toUpperCase() + '</span><b>' + m[0] + '</b><span class="small muted">' + m[1] + '</span></div>'; }).join('') + '</div></div>';
    shell('/founder/help', 'Tutorial', 'Learn the prototype in a few minutes', body, false);
  }

  /* ================= customer ================= */
  function cart() { try { return Math.max(1, Math.min(12, +sessionStorage.getItem('ts.units') || 1)); } catch (e) { return 1; } }
  function setCart(n) { try { sessionStorage.setItem('ts.units', n); } catch (e) {} }
  function showInspector() { try { return sessionStorage.getItem('ts.insp') !== '0'; } catch (e) { return true; } }
  function inspector() {
    if (!showInspector()) return '';
    var t = T.getTouch();
    var txt = t ? Object.keys(t).filter(function (k) { return k !== 'at'; }).map(function (k) { return '<b>' + esc(k) + '</b>=' + esc(t[k]); }).join(' &nbsp; ') : 'No tag captured on this visit.';
    return '<div class="inspector" style="margin-top:14px"><b>TrueSource Capture Layer</b><br>' + txt + '</div>';
  }
  function shopHead(step) {
    var st = ['Shop', 'Checkout', 'Done'].map(function (s, i) { return '<span class="st ' + (i === step ? 'on' : '') + '">' + (i + 1) + '. ' + s + '</span>'; }).join('');
    return '<div class="shopwrap"><div class="shophead"><div class="brand">' + LOGO + ' Hot Sauce Shop</div><div class="row"><span class="pill med">Viewing as Customer</span><a class="btn sm" href="#/">Switch role</a><button class="btn sm" data-act="tour-start" data-role="customer">Tour</button></div></div>' + banner('customer') + '<div class="steps">' + st + '</div>';
  }
  function vShop() {
    var tags = S().tags;
    var opts = '<option value="">Typed the website address (no tag)</option>' + tags.map(function (t) { return '<option value="' + t.id + '">' + T.NAME[t.channel] + ': ' + esc(t.name) + ' (' + T.TYPE_LABEL[t.type] + ')</option>'; }).join('');
    var n = cart();
    app.innerHTML = shopHead(0) +
      '<div class="helper"><h3>Prototype helper: how did this customer arrive?</h3><div class="row"><select id="arrive" style="flex:1;min-width:240px" aria-label="How the customer arrived">' + opts + '</select><button class="btn dark" id="arrive-go">Open as this customer</button></div>' +
      '<label class="small muted" style="display:flex;gap:8px;margin-top:10px;align-items:center"><input type="checkbox" id="insp" ' + (showInspector() ? 'checked' : '') + '> Show the TrueSource Capture Layer inspector</label>' + inspector() + '</div>' +
      '<div class="card"><div class="product"><div class="bottle"><svg width="120" height="230" viewBox="0 0 120 230"><rect x="44" y="8" width="32" height="26" rx="6" fill="#16181f"/><rect x="38" y="30" width="44" height="18" rx="4" fill="#b3202a"/><path d="M34 52h52c10 0 18 8 18 18v128c0 10-8 18-18 18H34c-10 0-18-8-18-18V70c0-10 8-18 18-18z" fill="#b3202a"/><rect x="26" y="96" width="68" height="72" rx="8" fill="#f7f4ec"/><path d="M60 110c10 10 14 20 6 32-4 6-10 6-12 0-4-8 0-14 6-32z" fill="#b3202a"/><rect x="34" y="150" width="52" height="5" rx="2" fill="#16181f"/></svg></div>' +
      '<div><h2 style="font-size:30px">Hot Sauce Bottle</h2><p class="muted">Small-batch hot sauce from a family brand. One simple bottle, ' + f$(T.PRICE) + ' each.</p>' +
      '<label class="f" style="max-width:200px;margin:16px 0">Quantity<input type="number" id="qty" min="1" max="12" value="' + n + '"></label>' +
      '<button class="btn primary" id="tocheckout">Go to checkout</button></div></div></div></div>' + tourCard();
    $('#arrive-go').addEventListener('click', function () {
      var id = $('#arrive').value; T.clearTouch();
      if (!id) { go('#/shop'); toast('Arrived with no tag'); return; }
      var tag = S().tags.filter(function (t) { return t.id === id; })[0];
      go('#' + T.tagLink(tag).split('#')[1]);
    });
    $('#insp').addEventListener('change', function (e) { try { sessionStorage.setItem('ts.insp', e.target.checked ? '1' : '0'); } catch (x) {} route(); });
    $('#tocheckout').addEventListener('click', function () { setCart(Math.max(1, Math.min(12, parseInt($('#qty').value, 10) || 1))); go('#/shop/checkout'); });
  }
  function detectDevice() { return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'; }
  function vCheckout() {
    var touch = T.getTouch(), units = cart();
    var preCode = touch ? (touch.promo || touch.ref || '') : '';
    app.innerHTML = shopHead(1) +
      '<div class="grid" style="grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:18px" id="cogrid"><div class="card"><h3>Your details</h3><div class="cap">No name or email is collected in this prototype</div><form id="coform" class="form" novalidate>' +
      '<div class="grid g2"><label class="f">Quantity<input type="number" id="c-units" min="1" max="12" value="' + units + '"></label><label class="f">Region<select id="c-region">' + T.REGIONS.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select></label></div>' +
      '<label class="f" style="display:flex;gap:10px;align-items:center;font-weight:600"><input type="checkbox" id="c-repeat"> I have ordered from this shop before</label>' +
      '<label class="f">Promo code<input type="text" id="c-promo" maxlength="14" value="' + esc(preCode) + '" autocomplete="off" placeholder="Optional"><span id="c-promomsg" class="h"></span></label>' +
      '<div id="c-fb"></div><div id="c-err"></div><button class="btn primary" type="submit" style="justify-self:start">Place order</button></form></div>' +
      '<div><div class="card"><h3>Order summary</h3><div id="c-sum"></div></div>' + inspector() + '</div></div></div>' + tourCard();
    var t0 = performance.now();
    function entered() { return $('#c-promo').value.trim().toUpperCase(); }
    function update() {
      var u = Math.max(1, Math.min(12, parseInt($('#c-units').value, 10) || 1)), code = entered(), tag = T.findTag(code);
      var utmOk = touch && touch.utm_source && T.resolve(touch, '', null).method === 'utm';
      var disc = tag ? tag.disc : 0, gross = u * T.PRICE, net = gross * (1 - disc / 100);
      $('#c-sum').innerHTML = '<div class="sumrow"><span>' + u + ' x Hot Sauce Bottle</span><span>' + f$(gross) + '</span></div>' + (disc ? '<div class="sumrow"><span>Code ' + esc(tag.code) + ' (' + disc + '% off)</span><span>-' + f$(gross - net) + '</span></div>' : '') + '<div class="sumrow tot"><span>Total</span><span>' + f$(net) + '</span></div>';
      var pm = $('#c-promomsg'); pm.className = 'h'; pm.textContent = '';
      if (code && tag) { pm.className = 'okmsg'; pm.textContent = 'Code applied: ' + disc + '% off.'; }
      else if (code) { pm.className = 'err'; pm.textContent = 'That code is not recognised, so no discount is applied.'; }
      var ask = T.needsFallback(touch, code);
      var fb = $('#c-fb'), cur = ($('input[name=fb]:checked') || {}).value || '';
      if (ask) {
        fb.innerHTML = '<fieldset style="border:1px solid var(--line);border-radius:12px;padding:14px 16px"><legend style="font-weight:700;padding:0 6px">How did you hear about us?</legend><div class="small muted" style="margin-bottom:8px">One click helps the shop learn what works. This question appears because no tag or code was found.</div>' +
          T.FALLBACK.map(function (f) { return '<label style="display:flex;gap:10px;padding:6px 0;cursor:pointer"><input type="radio" name="fb" value="' + f.v + '"' + (cur === f.v ? ' checked' : '') + '> ' + f.label + '</label>'; }).join('') + '</fieldset>';
      } else if (utmOk || tag) { fb.innerHTML = '<div class="pill ok">Channel already captured. The checkout question is skipped.</div>'; }
    }
    ['c-units', 'c-promo'].forEach(function (id) { $('#' + id).addEventListener('input', update); });
    update();
    $('#coform').addEventListener('submit', function (e) {
      e.preventDefault();
      var u = parseInt($('#c-units').value, 10);
      if (!(u >= 1 && u <= 12)) { $('#c-err').innerHTML = '<div class="err" role="alert">Choose a quantity from 1 to 12.</div>'; return; }
      var code = entered(), ask = T.needsFallback(touch, code), fbv = ask ? (($('input[name=fb]:checked') || {}).value || '') : '';
      var order = T.buildOrder({ touch: touch, promo: code, fallback: fbv, askedFallback: ask, units: u, region: $('#c-region').value, device: detectDevice(), repeat: $('#c-repeat').checked, session: Math.round((performance.now() - t0) / 1000) + 20 });
      try { sessionStorage.setItem('ts.last', order.id); } catch (x) {}
      T.clearTouch(); go('#/shop/done');
    });
  }
  function vDone() {
    var id = ''; try { id = sessionStorage.getItem('ts.last') || ''; } catch (e) {}
    var o = S().orders.filter(function (x) { return x.id === id; })[0];
    if (!o) { go('#/shop'); return; }
    app.innerHTML = shopHead(2) + '<div class="card" style="margin-bottom:16px"><h2 style="font-size:28px">Thank you! Order ' + o.id + ' is placed.</h2><p class="muted">' + o.units + ' x Hot Sauce Bottle, total ' + f$(o.net) + '. This is a prototype, so nothing is shipped or charged.</p></div>' +
      '<div class="card"><h3>What TrueSource just did with this order</h3><div class="cap">Channel found: ' + chip(o.channel) + ' &nbsp; <span class="pill ' + METHOD[o.method][1] + '">' + METHOD[o.method][0] + '</span></div><div class="trace">' + o.trace.map(function (t, i) { return '<div class="s"><div class="b">' + (i + 1) + '</div><div><b>' + esc(t.step) + '</b><span class="muted">' + esc(t.text) + '</span></div></div>'; }).join('') + '</div></div>' +
      '<div class="row" style="margin-top:16px"><a class="btn primary" href="#/shop">Place another order</a><a class="btn" href="#/founder/orders">See it as the Founder</a></div></div>' + tourCard();
  }

  /* ================= partner ================= */
  function vPartner() {
    var tags = S().tags, sel = ''; try { sel = sessionStorage.getItem('ts.partner') || ''; } catch (e) {}
    if (!sel || !tags.some(function (t) { return t.id === sel; })) sel = tags[0].id;
    var opts = tags.map(function (t) { return '<option value="' + t.id + '"' + (t.id === sel ? ' selected' : '') + '>' + T.NAME[t.channel] + ': ' + esc(t.name) + '</option>'; }).join('');
    var t = tags.filter(function (x) { return x.id === sel; })[0], link = T.tagLink(t);
    var live = S().orders.filter(function (o) { return o.tagId === t.id || (o.promo === t.code && !t.campaign); });
    var base = T.BASE.filter(function (r) { return r.promo === t.code && (!t.campaign || r.campaign === t.campaign); });
    var nets = live.reduce(function (a, o) { return a + o.net; }, 0), bnet = base.reduce(function (a, r) { return a + r.net; }, 0);
    var total = T.BASE.length + S().orders.length, mine = base.length + live.length;
    var recent = live.slice().reverse().slice(0, 5).map(function (o) { return '<tr><td>' + o.date.slice(0, 10) + '</td><td class="num">' + o.units + '</td><td class="num">' + f$(o.net) + '</td></tr>'; }).join('');
    app.innerHTML = '<div class="shopwrap"><div class="shophead"><div class="brand">' + LOGO + ' Partner Portal</div><div class="row"><span class="pill med">Viewing as Channel Partner</span><a class="btn sm" href="#/">Switch role</a><button class="btn sm" data-act="tour-start" data-role="partner">Tour</button></div></div>' + banner('partner') +
      '<div class="card" style="margin-bottom:16px"><label class="f" style="max-width:520px">Which partnership are you?<select id="p-sel">' + opts + '</select></label></div>' +
      '<div class="grid g2" style="margin-bottom:16px"><div class="card"><h3>Your link and code</h3><div class="cap">' + chip(t.channel) + ' &nbsp; ' + T.TYPE_LABEL[t.type] + '</div>' +
      '<div class="row" style="margin-bottom:10px"><div><div class="small muted">Promo code</div><div style="font-size:28px;font-weight:800" class="mono">' + esc(t.code) + '</div></div><div><div class="small muted">Customer discount</div><div style="font-size:28px;font-weight:800">' + t.disc + '%</div></div></div>' +
      '<div class="linkbox mono">' + esc(link) + '</div><div class="row" style="margin-top:12px"><button class="btn sm" data-act="copy" data-text="' + esc(link) + '">Copy link</button><button class="btn sm" data-act="test" data-id="' + t.id + '">Test it as a customer</button></div></div>' +
      '<div class="card"><h3>Your QR code</h3><div class="cap">Print it or show it on a phone</div><div class="qrbox">' + qrSvg(link, 4) + '</div></div></div>' +
      '<div class="card"><h3>Orders credited to you</h3><div class="cap">Dataset 1 history plus new live orders</div><div class="grid g3"><div class="kpi" style="--c:var(--red)"><div class="k">Orders</div><div class="v">' + f0(mine) + '</div><div class="d">' + f1(mine / total * 100) + ' of all orders</div></div><div class="kpi" style="--c:var(--green)"><div class="k">Net revenue</div><div class="v">' + f$(bnet + nets) + '</div><div class="d">After the customer discount</div></div><div class="kpi" style="--c:var(--blue)"><div class="k">New live orders</div><div class="v">' + live.length + '</div><div class="d">Captured by TrueSource in this app</div></div></div>' +
      (recent ? '<div class="tablewrap" style="margin-top:14px"><table class="t"><thead><tr><th>Date</th><th class="num">Units</th><th class="num">Net</th></tr></thead><tbody>' + recent + '</tbody></table></div>' : '<p class="muted small" style="margin:14px 0 0">No live orders yet. Use "Test it as a customer" and place an order to see it appear here.</p>') + '</div></div>' + tourCard();
    $('#p-sel').addEventListener('change', function (e) { try { sessionStorage.setItem('ts.partner', e.target.value); } catch (x) {} route(); });
  }

  /* ================= helpers: modal, copy, csv ================= */
  function modal(html) {
    var m = document.createElement('div'); m.id = 'modal'; m.style.cssText = 'position:fixed;inset:0;background:rgba(22,24,31,.6);display:grid;place-items:center;z-index:70;padding:20px';
    m.innerHTML = '<div class="card" style="max-width:420px;width:100%" role="dialog" aria-modal="true">' + html + '<div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn" data-act="modal-close">Close</button></div></div>';
    m.addEventListener('click', function (e) { if (e.target === m) m.remove(); }); document.body.appendChild(m);
  }
  function copyText(t) {
    function ok() { toast('Link copied'); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(ok, function () { fallback(); }); else fallback();
    function fallback() { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Select the link and copy it'); } a.remove(); }
  }
  function exportCsv() {
    var o = S().orders; if (!o.length) { toast('No live orders to export'); return; }
    var cols = ['id', 'date', 'customer', 'channel', 'method', 'confidence', 'utm', 'promo', 'campaign', 'units', 'price', 'disc', 'gross', 'net', 'cogs', 'mkt', 'profit', 'repeat', 'region', 'device', 'simulated'];
    var csv = cols.join(',') + '\n' + o.map(function (r) { return cols.map(function (c) { return '"' + String(r[c]).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
    modal('<h3>Live orders as CSV</h3><div class="cap">Copy it into a spreadsheet, or use the download button where downloads are allowed.</div><textarea id="csvbox" readonly style="width:100%;height:180px;font-family:ui-monospace,Menlo,monospace;font-size:12px;border:1px solid #cfc8b6;border-radius:10px;padding:8px"></textarea><div class="row" style="margin-top:10px"><button class="btn sm" data-act="copy-csv">Copy CSV</button><a class="btn sm" id="csvdl" href="#" download="truesource_live_orders.csv">Download file</a></div>');
    $('#csvbox').value = csv; var dl = $('#csvdl'); dl.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); dl.dataset.act = 'dl';
  }

  /* ================= events ================= */
  document.addEventListener('click', function (e) {
    var an = e.target.closest('a[href^="#"]');
    if (an && !an.dataset.act) { e.preventDefault(); go(an.getAttribute('href')); return; }
    var el = e.target.closest('[data-act]'); if (!el) return; var act = el.dataset.act;
    if (act === 'role') { S().role = el.dataset.role; T.save(); go({ founder: '#/founder/home', customer: '#/shop', partner: '#/partner' }[el.dataset.role]); }
    else if (act === 'scope') { S().scope = el.dataset.scope; T.save(); route(); }
    else if (act === 'copy') { e.preventDefault(); copyText(el.dataset.text); }
    else if (act === 'qr') { var tag = S().tags.filter(function (t) { return t.id === el.dataset.id; })[0]; var l = T.tagLink(tag); var svg = qrSvg(l, 5); modal('<h3>' + esc(tag.name) + '</h3><div class="cap">' + T.NAME[tag.channel] + ' | code ' + esc(tag.code) + '</div><div class="qrbox" style="display:block;text-align:center">' + svg + '</div><div class="linkbox mono small" style="margin-top:10px">' + esc(l) + '</div>'); }
    else if (act === 'modal-close') { var m = $('#modal'); if (m) m.remove(); }
    else if (act === 'sim') { var n = +$('#sim-n').value; T.simulate(n, +$('#sim-a').value, +$('#sim-b').value); toast(n + ' simulated orders added'); route(); }
    else if (act === 'clear') { S().orders = []; S().seq = 0; T.save(); toast('Live orders cleared'); route(); }
    else if (act === 'export') exportCsv();
    else if (act === 'copy-csv') { var ta = $('#csvbox'); if (ta) { ta.select(); copyText(ta.value); } }
    else if (act === 'resetall') { e.preventDefault(); modal('<h3>Reset the prototype?</h3><div class="cap">This clears all live orders and any tags you created. Dataset 1 stays as it is.</div><div class="row"><button class="btn primary" data-act="reset-yes">Yes, reset</button></div>'); }
    else if (act === 'reset-yes') { var mm = $('#modal'); if (mm) mm.remove(); T.reset(); tour = null; toast('Prototype reset'); route(); }
    else if (act === 'test') { var tg = S().tags.filter(function (t) { return t.id === el.dataset.id; })[0]; T.clearTouch(); go('#' + T.tagLink(tg).split('#')[1]); toast('Now viewing as a customer who arrived with ' + tg.code); }
    else if (act === 'tour-start') startTour(el.dataset.role);
    else if (act === 'tour-close') { tour = null; route(); }
    else if (act === 'tour-next') { var steps = TOURS[tour.role]; if (tour.i >= steps.length - 1) { tour = null; route(); } else { tour.i++; go('#' + steps[tour.i].r); } }
    else if (act === 'tour-back') { tour.i--; go('#' + TOURS[tour.role][tour.i].r); }
    else if (act === 'banner-close') { S().tourSeen[el.dataset.role] = true; T.save(); route(); }
  });

  /* ================= router ================= */
  var ROUTES = { '/founder/home': vHome, '/founder/tags': vTags, '/founder/orders': vOrders, '/founder/advisor': vAdvisor, '/founder/seasonal': vSeasonal, '/founder/loyalty': vLoyalty, '/founder/help': vHelp, '/shop': vShop, '/shop/checkout': vCheckout, '/shop/done': vDone, '/partner': vPartner };
  function route() {
    killCharts();
    var h = cur || '#/', path = h.slice(1).split('?')[0] || '/';
    if (path.indexOf('/shop') === 0) T.captureFromHash(h);
    var fn = ROUTES[path];
    try { if (fn) fn(); else vLanding(); } catch (err) { console.error(err); app.innerHTML = '<div class="landing"><h2>Something went wrong</h2><p class="muted">' + esc(err.message) + '</p><a class="btn" href="#/">Back to start</a></div>'; }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { var h = location.hash || '#/'; if (h !== cur) { cur = h; route(); } });
  route();
})();
