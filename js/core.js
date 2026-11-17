/* TrueSource core: state, capture, channel resolver, KPI engine, advisor.
   Everything runs in the browser. localStorage stands in for the database. */
window.TS = (function () {
  'use strict';

  var CH = ['Paid_Social', 'Influencer', 'Farmers_Market', 'Word_of_Mouth', 'Unattributed'];
  var NAME = { Paid_Social: 'Paid Social', Influencer: 'Influencer', Farmers_Market: 'Farmers Market', Word_of_Mouth: 'Word of Mouth', Unattributed: 'Unattributed' };
  var COLOR = { Paid_Social: '#0b2a66', Influencer: '#1f5fbf', Farmers_Market: '#5b8fe0', Word_of_Mouth: '#9dbcf0', Unattributed: '#c3c9d6' };
  var UTM_SOURCE = { Paid_Social: 'paid_social', Influencer: 'influencer' };
  var UTM_MEDIUM = { Paid_Social: 'paid', Influencer: 'post' };
  var SRC_TO_CH = { paid_social: 'Paid_Social', influencer: 'Influencer' };
  var DEFAULT_DISC = { Paid_Social: 10, Influencer: 15, Farmers_Market: 5, Word_of_Mouth: 20 };
  var TAG_TYPE = { Paid_Social: 'utm', Influencer: 'utm', Farmers_Market: 'qr', Word_of_Mouth: 'referral' };
  var TYPE_LABEL = { utm: 'UTM link', qr: 'QR + promo code', referral: 'Referral code' };
  var PRICE = 10, COGS_UNIT = 3.1;
  var REGIONS = ['North', 'South', 'East', 'West', 'Central'];
  var DEVICES = ['Mobile', 'Desktop', 'Tablet', 'In_Person'];
  var FALLBACK = [
    { v: 'ad', label: 'I saw an ad on social media', ch: 'Paid_Social' },
    { v: 'creator', label: 'A creator or influencer post', ch: 'Influencer' },
    { v: 'booth', label: 'I met you at the farmers market', ch: 'Farmers_Market' },
    { v: 'friend', label: 'A friend or family member told me', ch: 'Word_of_Mouth' },
    { v: 'unsure', label: 'Not sure or something else', ch: 'Unattributed' }
  ];

  /* ---------- seed tags (the codes already present in Dataset 1) ---------- */
  var SEED_TAGS = [
    { id: 'T01', channel: 'Paid_Social', type: 'utm', name: 'Paid social ad set 1', campaign: 'CMP-SOC-01', code: 'SOCIAL10', disc: 10 },
    { id: 'T02', channel: 'Paid_Social', type: 'utm', name: 'Paid social ad set 2', campaign: 'CMP-SOC-02', code: 'ADCLICK10', disc: 10 },
    { id: 'T03', channel: 'Paid_Social', type: 'utm', name: 'Paid social ad set 3', campaign: 'CMP-SOC-03', code: 'SOCIAL10', disc: 10 },
    { id: 'T04', channel: 'Paid_Social', type: 'utm', name: 'Paid social ad set 4', campaign: 'CMP-SOC-04', code: 'ADCLICK10', disc: 10 },
    { id: 'T05', channel: 'Influencer', type: 'utm', name: 'Creator partnership 1', campaign: 'CMP-INF-01', code: 'INFLU15', disc: 15 },
    { id: 'T06', channel: 'Influencer', type: 'utm', name: 'Creator partnership 2', campaign: 'CMP-INF-02', code: 'INFLU15', disc: 15 },
    { id: 'T07', channel: 'Influencer', type: 'utm', name: 'Creator partnership 3', campaign: 'CMP-INF-03', code: 'INFLU15', disc: 15 },
    { id: 'T08', channel: 'Farmers_Market', type: 'qr', name: 'Market stall poster', campaign: '', code: 'MARKETQR', disc: 5 },
    { id: 'T09', channel: 'Farmers_Market', type: 'qr', name: 'Booth counter scan', campaign: '', code: 'BOOTHSCAN', disc: 5 },
    { id: 'T10', channel: 'Word_of_Mouth', type: 'referral', name: 'Refer a friend card', campaign: '', code: 'REFER20', disc: 20 },
    { id: 'T11', channel: 'Word_of_Mouth', type: 'referral', name: 'Friend share code', campaign: '', code: 'FRIEND20', disc: 20 }
  ];

  /* ---------- storage ---------- */
  var KEY = 'truesource.prototype.v1';
  var mem = null;
  function defaultState() {
    return { role: null, scope: 'all', tags: SEED_TAGS.map(function (t) { return Object.assign({}, t); }), orders: [], seq: 0, tagSeq: 11,
      settings: { unattr: 10, costGap: 15, repeat: 40, disc: 15 }, tourSeen: {} };
  }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); var d = defaultState(); return Object.assign(d, s, { settings: Object.assign(d.settings, s.settings || {}) }); } } catch (e) {}
    return mem || defaultState();
  }
  var S = load();
  function save() { mem = S; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function reset() { var role = S.role; S = defaultState(); S.role = role; save(); return S; }

  /* ---------- baseline (Dataset 1) ---------- */
  var BASE = (window.BASELINE_ROWS || []).map(function (r) {
    return { date: r[0], channel: CH[r[1]], promo: r[2], utm: r[3], units: r[4], price: r[5], disc: r[6], gross: r[7], net: r[8], cogs: r[9], mkt: r[10], profit: r[11],
      repeat: r[12], region: REGIONS[r[13]], device: DEVICES[r[14]], life: r[15], sess: r[16], campaign: r[17], src: 'baseline' };
  });
  var AVG_MKT = {}; CH.forEach(function (c) { var rows = BASE.filter(function (r) { return r.channel === c; }); AVG_MKT[c] = rows.length ? rows.reduce(function (a, r) { return a + r.mkt; }, 0) / rows.length : 0; });

  function rowsFor(scope) {
    var live = S.orders.map(function (o) { return { date: o.date, channel: o.channel, promo: o.promo, utm: o.utm ? 1 : 0, units: o.units, price: o.price, disc: o.disc, gross: o.gross, net: o.net, cogs: o.cogs, mkt: o.mkt, profit: o.profit, repeat: o.repeat ? 1 : 0, region: o.region, device: o.device, life: o.repeat ? 2 : 1, sess: o.session || 0, campaign: o.campaign || '', src: 'live' }; });
    if (scope === 'baseline') return BASE;
    if (scope === 'live') return live;
    return BASE.concat(live);
  }

  /* ---------- KPI engine (same formulas as the KPI deck) ---------- */
  function blank() { return { n: 0, gross: 0, net: 0, profit: 0, mkt: 0, utm: 0, rep: 0, life: 0, sess: 0 }; }
  function add(o, r) { o.n++; o.gross += r.gross; o.net += r.net; o.profit += r.profit; o.mkt += r.mkt; o.utm += r.utm; o.rep += r.repeat; o.life += r.life; o.sess += r.sess; }
  function aggregate(rows) {
    var by = {}; CH.forEach(function (c) { by[c] = blank(); }); var all = blank();
    rows.forEach(function (r) { add(by[r.channel], r); add(all, r); });
    function derive(o) {
      o.ppo = o.n ? o.profit / o.n : 0;
      o.roi = o.mkt > 0 ? o.profit / o.mkt : null;
      o.give = o.gross ? (o.gross - o.net) / o.gross * 100 : 0;
      o.rep_rate = o.n ? o.rep / o.n * 100 : 0;
      o.utm_cov = o.n ? o.utm / o.n * 100 : 0;
      o.life_avg = o.n ? o.life / o.n : 0;
      o.sess_avg = o.n ? o.sess / o.n : 0;
    }
    CH.forEach(function (c) { derive(by[c]); }); derive(all);
    all.unattr_rev = all.net ? by.Unattributed.net / all.net * 100 : 0;
    all.unattr_ord = all.n ? by.Unattributed.n / all.n * 100 : 0;
    var dn = by.Paid_Social.n + by.Influencer.n;
    all.utm_cov_digital = dn ? (by.Paid_Social.utm + by.Influencer.utm) / dn * 100 : 0;
    return { by: by, all: all };
  }
  function kpis(scope) { return aggregate(rowsFor(scope)); }

  function monthly() {
    var m = {}; CH.forEach(function (c) { m[c] = new Array(12).fill(0); });
    BASE.forEach(function (r) { m[r.channel][parseInt(r.date.slice(5, 7), 10) - 1]++; });
    return m;
  }

  /* ---------- capture layer ---------- */
  function parseQuery(hash) {
    var i = hash.indexOf('?'); var q = {}; if (i < 0) return q;
    hash.slice(i + 1).split('&').forEach(function (p) { if (!p) return; var kv = p.split('='); q[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' ')); });
    return q;
  }
  function captureFromHash(hash) {
    var q = parseQuery(hash);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'promo', 'ref', 'src'];
    var found = {}; var any = false;
    keys.forEach(function (k) { if (q[k]) { found[k] = q[k]; any = true; } });
    if (any) { found.at = new Date().toISOString(); try { sessionStorage.setItem('ts.touch', JSON.stringify(found)); } catch (e) { window.__touch = found; } }
    return any;
  }
  function getTouch() { try { var t = sessionStorage.getItem('ts.touch'); if (t) return JSON.parse(t); } catch (e) {} return window.__touch || null; }
  function clearTouch() { try { sessionStorage.removeItem('ts.touch'); } catch (e) {} window.__touch = null; }
  function setTouch(t) { try { sessionStorage.setItem('ts.touch', JSON.stringify(t)); } catch (e) { window.__touch = t; } }

  function baseUrl() { return location.origin === 'null' || location.protocol === 'file:' ? location.href.split('#')[0] : location.origin + location.pathname; }
  function tagLink(t) {
    var p = [];
    if (t.type === 'utm') { p.push('utm_source=' + UTM_SOURCE[t.channel], 'utm_medium=' + UTM_MEDIUM[t.channel], 'utm_campaign=' + encodeURIComponent(t.campaign)); if (t.code) p.push('promo=' + encodeURIComponent(t.code)); }
    else if (t.type === 'qr') { p.push('promo=' + encodeURIComponent(t.code), 'src=qr'); }
    else { p.push('ref=' + encodeURIComponent(t.code)); }
    return baseUrl() + '#/shop?' + p.join('&');
  }
  function tagToTouch(t) {
    if (t.type === 'utm') return { utm_source: UTM_SOURCE[t.channel], utm_medium: UTM_MEDIUM[t.channel], utm_campaign: t.campaign, promo: t.code };
    if (t.type === 'qr') return { promo: t.code, src: 'qr' };
    return { ref: t.code };
  }
  function findTag(code) { if (!code) return null; code = String(code).trim().toUpperCase(); for (var i = 0; i < S.tags.length; i++) if (S.tags[i].code === code) return S.tags[i]; return null; }

  /* ---------- channel resolver (data integration logic) ---------- */
  function resolve(touch, entered, fallbackV) {
    var utmCh = touch && touch.utm_source ? SRC_TO_CH[String(touch.utm_source).toLowerCase()] : null;
    var codeStr = (entered || (touch && (touch.promo || touch.ref)) || '').trim().toUpperCase();
    var tag = null;
    if (touch && touch.utm_campaign) { tag = S.tags.filter(function (t) { return t.campaign && t.campaign.toLowerCase() === String(touch.utm_campaign).toLowerCase(); })[0] || null; }
    if (!tag) tag = findTag(codeStr);
    var res = { channel: 'Unattributed', method: 'none', confidence: 'none', rule: 'Rule 4: no tag and no answer, so the order stays Unattributed.', tag: tag, code: codeStr, note: '' };
    if (utmCh) {
      res.channel = utmCh; res.method = 'utm'; res.confidence = 'high'; res.rule = 'Rule 1: a UTM tag on the link names the channel (utm_source=' + touch.utm_source + ').';
      if (tag && tag.channel !== utmCh) res.note = 'The code belongs to ' + NAME[tag.channel] + ' but the link says ' + NAME[utmCh] + '. The link wins.';
    } else if (tag) {
      res.channel = tag.channel; res.method = tag.type === 'referral' ? 'referral' : (tag.type === 'qr' ? 'qr' : 'promo'); res.confidence = 'high';
      res.rule = 'Rule 2: the code ' + tag.code + ' is registered to ' + NAME[tag.channel] + '.';
    } else if (fallbackV) {
      var fb = FALLBACK.filter(function (f) { return f.v === fallbackV; })[0];
      if (fb && fb.ch !== 'Unattributed') { res.channel = fb.ch; res.method = 'fallback'; res.confidence = 'medium'; res.rule = 'Rule 3: no tag found, so the checkout answer "' + fb.label + '" is used.'; }
      else { res.rule = 'Rule 4: the customer was not sure, so the order stays Unattributed.'; }
    }
    return res;
  }
  function needsFallback(touch, entered) {
    var utmCh = touch && touch.utm_source ? SRC_TO_CH[String(touch.utm_source).toLowerCase()] : null;
    if (utmCh) return false;
    var codeStr = (entered || (touch && (touch.promo || touch.ref)) || '').trim();
    return !findTag(codeStr);
  }

  /* ---------- order builder ---------- */
  function money(x) { return Math.round(x * 100) / 100; }
  function buildOrder(o) {
    var touch = o.touch || null;
    var res = resolve(touch, o.promo, o.fallback);
    var tag = res.tag; var disc = tag ? tag.disc : 0;
    // a code only gives a discount when it is a registered tag
    var units = o.units; var gross = money(units * PRICE); var net = money(gross * (1 - disc / 100));
    var cogs = money(units * COGS_UNIT); var mkt = money(AVG_MKT[res.channel] || 0);
    var profit = money(net - cogs - mkt);
    S.seq++;
    var id = 'TS-' + String(S.seq).padStart(5, '0');
    var utm = !!(touch && touch.utm_source && SRC_TO_CH[String(touch.utm_source).toLowerCase()]);
    var order = {
      id: id, date: o.date || new Date().toISOString(), customer: o.customer || ('CUST' + String(Math.floor(1000 + Math.random() * 9000))),
      channel: res.channel, method: res.method, confidence: res.confidence, utm: utm, promo: tag ? tag.code : '', campaign: tag && tag.campaign ? tag.campaign : (touch && touch.utm_campaign) || '',
      tagId: tag ? tag.id : '', units: units, price: PRICE, disc: disc, gross: gross, net: net, cogs: cogs, mkt: mkt, profit: profit,
      repeat: !!o.repeat, region: o.region || 'Central', device: o.device || 'Desktop', session: o.session || 0, simulated: !!o.simulated, rule: res.rule, note: res.note, trace: null
    };
    if (!o.simulated) {
      var fbLabel = o.fallback ? (FALLBACK.filter(function (f) { return f.v === o.fallback; })[0] || {}).label : '';
      var touchTxt = touch ? Object.keys(touch).filter(function (k) { return k !== 'at'; }).map(function (k) { return k + '=' + touch[k]; }).join(', ') : '';
      order.trace = [
        { step: 'Capture Layer', text: touch && touchTxt ? 'Read from the visit: ' + touchTxt + '.' : 'No tag was found on this visit (the customer arrived without a tracking link).' },
        { step: 'Checkout Question', text: o.askedFallback ? (fbLabel ? 'Asked "How did you hear about us?" Answer: ' + fbLabel + '.' : 'Asked "How did you hear about us?" and the customer skipped it.') : 'Skipped, because a valid tag or code was already captured.' },
        { step: 'Channel Resolver', text: res.rule + (res.note ? ' ' + res.note : '') + ' Result: ' + NAME[res.channel] + ' (' + res.method + ', confidence ' + res.confidence + ').' },
        { step: 'Order Record', text: units + ' bottle(s) at $' + PRICE.toFixed(2) + ', discount ' + disc + '%, net $' + net.toFixed(2) + ', cost of goods $' + cogs.toFixed(2) + ', marketing cost $' + mkt.toFixed(2) + ' (average for ' + NAME[res.channel] + ' in Dataset 1), profit $' + profit.toFixed(2) + '.' },
        { step: 'Stored', text: 'Saved to the orders table as ' + id + ' (the browser stores it, standing in for the database).' }
      ];
    }
    S.orders.push(order); save();
    if (!o.simulated) {
      var lv = aggregate(rowsFor('live')), bl = aggregate(BASE);
      order.trace.push({ step: 'KPI Engine', text: 'Recomputed. Live orders without a channel: ' + lv.by.Unattributed.n + ' of ' + lv.all.n + ' (' + lv.all.unattr_ord.toFixed(1) + '%). Dataset 1 before TrueSource: ' + bl.all.unattr_ord.toFixed(1) + '%.' });
      save();
    }
    return order;
  }

  /* ---------- order simulator (demo helper) ---------- */
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  var CHMIX = (function () { var c = {}; BASE.forEach(function (r) { if (r.channel !== 'Unattributed') c[r.channel] = (c[r.channel] || 0) + 1; }); return c; })();
  function weightedChannel() { var tot = 0, k; for (k in CHMIX) tot += CHMIX[k]; var x = Math.random() * tot; for (k in CHMIX) { x -= CHMIX[k]; if (x <= 0) return k; } return 'Paid_Social'; }
  var BASEAGG = aggregate(BASE);
  function simulate(n, adopt, answer) {
    var made = [];
    for (var i = 0; i < n; i++) {
      var ch = weightedChannel();
      var tags = S.tags.filter(function (t) { return t.channel === ch; });
      if (!tags.length) { ch = 'Paid_Social'; tags = S.tags.filter(function (t) { return t.channel === ch; }); }
      var tag = pick(tags); var touch = null, fb = null, asked = false;
      if (Math.random() * 100 < adopt) { touch = tagToTouch(tag); }
      else { asked = true; if (Math.random() * 100 < answer) { fb = FALLBACK.filter(function (f) { return f.ch === ch; })[0].v; } }
      var pool = BASE.filter(function (r) { return r.channel === ch; });
      var ref = pick(pool);
      var d = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000 - Math.floor(Math.random() * 86400000));
      made.push(buildOrder({ touch: touch, promo: null, fallback: fb, askedFallback: asked, units: ref.units, region: pick(REGIONS), device: ch === 'Farmers_Market' ? 'In_Person' : ref.device, repeat: Math.random() < (BASEAGG.by[ch].rep_rate / 100), session: ref.sess, simulated: true, date: d.toISOString() }));
    }
    return made;
  }

  /* ---------- advisor (rule based, thresholds editable) ---------- */
  function advise(scope) {
    var K = kpis(scope), s = S.settings, out = [];
    var all = K.all, by = K.by;
    var liveN = S.orders.length;
    if (scope !== 'baseline' && liveN < 30) out.push({ lvl: 'info', rule: 'A0', title: 'Few live orders so far', evidence: liveN + ' live order(s) are included.', action: 'Advice leans on Dataset 1 until more orders are tagged. Use "Simulate orders" on the Orders page to see how it changes.' });
    if (all.unattr_ord > s.unattr) out.push({ lvl: 'warn', rule: 'A1', title: 'Fix tracking before moving budget', evidence: all.unattr_ord.toFixed(1) + '% of orders and ' + all.unattr_rev.toFixed(1) + '% of revenue have no channel (limit ' + s.unattr + '%).', action: 'Add tags to every channel and keep the one-click checkout question switched on. Decisions are safer once this number is below the limit.' });
    else out.push({ lvl: 'good', rule: 'A1', title: 'Tracking is in good shape', evidence: all.unattr_ord.toFixed(1) + '% of orders have no channel (limit ' + s.unattr + '%).', action: 'Channel numbers are reliable enough to guide budget decisions.' });
    var totMkt = all.mkt, totProfit = all.profit;
    ['Paid_Social', 'Influencer'].forEach(function (c) {
      var b = by[c]; if (!b.n || !totMkt) return;
      var costShare = b.mkt / totMkt * 100, profShare = b.profit / totProfit * 100;
      if (costShare - profShare > s.costGap) out.push({ lvl: 'warn', rule: 'A2', title: NAME[c] + ' costs more than it returns', evidence: costShare.toFixed(0) + '% of marketing cost but ' + profShare.toFixed(0) + '% of profit (gap above ' + s.costGap + ' points). Profit per order $' + b.ppo.toFixed(2) + '.', action: 'Consider testing a smaller ' + NAME[c] + ' budget and watch what happens to total orders. This is a suggestion to test, not a promised result.' });
    });
    CH.filter(function (c) { return c !== 'Unattributed'; }).forEach(function (c) {
      var b = by[c]; if (b.n && b.rep_rate >= s.repeat) {
        var strong = b.ppo >= all.ppo;
        out.push({ lvl: 'good', rule: 'A3', title: NAME[c] + ' builds loyal customers', evidence: b.rep_rate.toFixed(1) + '% repeat rate (target ' + s.repeat + '% or more), profit per order $' + b.ppo.toFixed(2) + (strong ? ', above the store average.' : ', a little below the store average of $' + all.ppo.toFixed(2) + '.'),
          action: c === 'Farmers_Market' ? 'Consider more booth days and a reason for market customers to reorder online.' : (c === 'Word_of_Mouth' ? 'Consider a small reward for referrers, and check the discount in rule A4.' : 'Consider keeping this channel funded while you grow its repeat buyers.') });
      }
    });
    CH.filter(function (c) { return c !== 'Unattributed'; }).forEach(function (c) {
      var b = by[c]; if (b.n && b.give >= s.disc && b.ppo < all.ppo) out.push({ lvl: 'warn', rule: 'A4', title: 'Review the ' + NAME[c] + ' discount', evidence: b.give.toFixed(1) + '% of gross revenue is given away (limit ' + s.disc + '%), and profit per order is $' + b.ppo.toFixed(2) + ' against a store average of $' + all.ppo.toFixed(2) + '.', action: 'Consider a smaller discount or a minimum order size, then compare profit per order again.' });
    });
    return out;
  }

  return { CH: CH, NAME: NAME, COLOR: COLOR, UTM_SOURCE: UTM_SOURCE, DEFAULT_DISC: DEFAULT_DISC, TAG_TYPE: TAG_TYPE, TYPE_LABEL: TYPE_LABEL, FALLBACK: FALLBACK, PRICE: PRICE, REGIONS: REGIONS, DEVICES: DEVICES,
    S: function () { return S; }, save: save, reset: reset, kpis: kpis, rowsFor: rowsFor, monthly: monthly, captureFromHash: captureFromHash, getTouch: getTouch, setTouch: setTouch, clearTouch: clearTouch,
    parseQuery: parseQuery, tagLink: tagLink, tagToTouch: tagToTouch, findTag: findTag, resolve: resolve, needsFallback: needsFallback, buildOrder: buildOrder, simulate: simulate, advise: advise, baseUrl: baseUrl, AVG_MKT: AVG_MKT, BASE: BASE };
})();
