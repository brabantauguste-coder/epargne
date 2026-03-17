// ══════════════════════════════════════════════════════
// DONNEES DU PORTEFEUILLE — modifie ici tes positions
// ══════════════════════════════════════════════════════
var P = {
  pea: [
    { n: 'PEA Nasdaq 100 EUR',         tk: 'PUST.PA',  sh: 1,       bp: 85.14,    cp: 85.30  },
    { n: 'MSCI Emerging Asia ESG',     tk: 'PAASI.PA', sh: 2,       bp: 29.92,    cp: 33.03  },
    { n: 'PEA S&P 500 EUR',            tk: 'PE500.PA', sh: 1,       bp: 50.04,    cp: 50.51  },
    { n: 'PEA MSCI Emerging Mkts ESG', tk: 'PAEEM.PA', sh: 1,       bp: 28.40,    cp: 30.83  },
    { n: 'PEA Monde MSCI World EUR',   tk: 'WPEA.PA',  sh: 5,       bp: 5.427,    cp: 5.43   },
    { n: 'Stoxx Europe 600 EUR',       tk: 'ETZ.PA',   sh: 1,       bp: 18.33,    cp: 19.48  },
    { n: 'EURO STOXX Banks 30-15',     tk: 'EXV1.DE',  sh: 1,       bp: 17.05,    cp: 15.58  },
    { n: 'Bloomberg Europe Defense',   tk: 'EDEF.PA',  sh: 1,       bp: 11.21,    cp: 11.77  },
    { n: 'S&P 500 Swap PEA EUR',       tk: 'SPUS.PA',  sh: 1,       bp: 5.52,     cp: 5.63   }
  ],
  ct: [
    { n: 'PEA Nasdaq 100 EUR',         tk: 'PUST.PA',  sh: 0.05391, bp: 85.14,    cp: 85.30  }
  ],
  cry: [
    { n: 'Solana',  id: 'solana',  sym: 'SOL', q: 0.1137,   bp: 111.90,   cp: 82.34    },
    { n: 'Bitcoin', id: 'bitcoin', sym: 'BTC', q: 0.0001174, bp: 84937.38, cp: 64687.50 }
  ],
  spl: {
    total: 671.92,
    invested: 650,
    items: [
      { k: 'ronaldo',    l: 'Ronaldo 2021 Immaculate 1/1 PSA 7',  cat: 'Collectibles', v: 101.06, inv: 100 },
      { k: 'pokemon_neo',l: 'Pokemon Neo Discovery 1st Ed.',       cat: 'Collectibles', v: 100.00, inv: 100 },
      { k: 'zidane',     l: 'Zidane 2024 FIFA Kaboom 1/1 PSA 8',  cat: 'Collectibles', v: 56.23,  inv: 50  },
      { k: 'pokemon_tu', l: 'Pokemon S&M Team Up Case P.2',        cat: 'Collectibles', v: 54.80,  inv: 50  },
      { k: 'yaoming',    l: 'Yao Ming 2005 UD Mirror Auto 1/2',   cat: 'Collectibles', v: 51.23,  inv: 50  },
      { k: 'manning',    l: 'Peyton Manning Prizm Gold PSA 9',     cat: 'Collectibles', v: 50.00,  inv: 50  },
      { k: 'daley',      l: 'Antony Daley, Herefrom',              cat: 'Art',          v: 53.66,  inv: 50  },
      { k: 'botero',     l: 'Fernando Botero, Flautista 2023',     cat: 'Art',          v: 53.49,  inv: 50  },
      { k: 'kahlo',      l: 'Frida Kahlo, Corporeal field 1946',   cat: 'Art',          v: 50.00,  inv: 50  },
      { k: 'watt',       l: 'Amanda Watt, California Dreaming',    cat: 'Art',          v: 50.00,  inv: 50  },
      { k: 'hermes',     l: 'Hermes Kelly 28 Gris Pantin',         cat: 'Sacs a main',  v: 51.45,  inv: 50  }
    ]
  },
  pe: { total: 15.29, invested: 15.00 }
};

// ══════════════════════════════════════════════════════
// PREFERENCES & ETAT
// ══════════════════════════════════════════════════════
var PREFS   = { dark: true, confetti: true, anim: true, goal: 2000, streak: 2, accent: 'violet' };
var VERSEMENTS = [];
var JOURNAL    = [];
var LAST_TOTAL = 0;
var CH = {};

// ══════════════════════════════════════════════════════
// PERSISTANCE LOCALE
// ══════════════════════════════════════════════════════
function loadSt() {
  try { var s = localStorage.getItem('spl');   if (s) P.spl = JSON.parse(s); } catch(e) {}
  try { var p = localStorage.getItem('pe2');   if (p) P.pe  = JSON.parse(p); } catch(e) {}
  try { var r = localStorage.getItem('prefs'); if (r) PREFS = Object.assign(PREFS, JSON.parse(r)); } catch(e) {}
  try { var v = localStorage.getItem('vers');  if (v) VERSEMENTS = JSON.parse(v); } catch(e) {}
  try { var j = localStorage.getItem('jour');  if (j) JOURNAL    = JSON.parse(j); } catch(e) {}
}
function saveSt() {
  try {
    localStorage.setItem('prefs', JSON.stringify(PREFS));
    localStorage.setItem('vers',  JSON.stringify(VERSEMENTS));
    localStorage.setItem('jour',  JSON.stringify(JOURNAL));
  } catch(e) {}
}

// ══════════════════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════════════════
function f(n)    { return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR'; }
function fp(n)   { return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'; }
function prf(c, b) { return (c - b) / b * 100; }
function set(id, v)  { var e = document.getElementById(id); if (e) e.textContent = v; }
function html(id, v) { var e = document.getElementById(id); if (e) e.innerHTML = v; }
function pb(p) { return '<span class="badge ' + (p >= 0 ? 'bg' : 'br') + '">' + fp(p) + '</span>'; }
function fdate(d) { if (!d) return '--'; try { var p = d.split('-'); return p[2]+'/'+p[1]+'/'+p[0]; } catch(e) { return d; } }

// ══════════════════════════════════════════════════════
// CALCULS PORTEFEUILLE
// ══════════════════════════════════════════════════════
function cPEA() { return P.pea.reduce(function(a,p){ return {v:a.v+p.sh*p.cp, i:a.i+p.sh*p.bp}; }, {v:0,i:0}); }
function cCT()  { return P.ct.reduce(function(a,p){  return {v:a.v+p.sh*p.cp, i:a.i+p.sh*p.bp}; }, {v:0,i:0}); }
function cCry() { return P.cry.reduce(function(a,c){ return {v:a.v+c.q*c.cp,  i:a.i+c.q*c.bp};  }, {v:0,i:0}); }
function cTot() {
  var pea=cPEA(), ct=cCT(), cry=cCry();
  return { v: pea.v+ct.v+P.spl.total+P.pe.total+cry.v, i: pea.i+ct.i+P.spl.invested+P.pe.invested+cry.i };
}
function calcDivScore() {
  var sc = 0;
  sc += (67.1 < 50) ? 3 : (67.1 < 65) ? 1.5 : 0;
  sc += (12.4 + 4.2 + 2.8 > 15) ? 2 : 1;
  sc += (10.8 > 8) ? 1.5 : 0.75;
  sc += P.pea.length >= 7 ? 2 : 1.5;
  sc += 1.5;
  return Math.min(10, sc);
}
function calcRisk() {
  var tot = cTot(), cryW = cCry().v / tot.v, nasdW = P.pea[0].sh * P.pea[0].cp / cPEA().v;
  return Math.max(10, Math.min(90, 42 + cryW * 30 + nasdW * 15));
}

// ══════════════════════════════════════════════════════
// FETCH APIS
// ══════════════════════════════════════════════════════
async function fetchCrypto() {
  try {
    var ids = P.cry.map(function(c){ return c.id; }).join(',');
    var r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=eur', { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error();
    var d = await r.json();
    P.cry.forEach(function(c){ if (d[c.id] && d[c.id].eur) c.cp = d[c.id].eur; });
    return true;
  } catch(e) { return false; }
}
async function fetchETF(tk) {
  try {
    var url = 'https://query1.finance.yahoo.com/v8/finance/chart/'+tk+'?interval=1d&range=1d';
    var proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
    var r = await fetch(proxy, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) throw new Error();
    var o = await r.json();
    var inner = JSON.parse(o.contents);
    var price = inner && inner.chart && inner.chart.result && inner.chart.result[0] && inner.chart.result[0].meta && inner.chart.result[0].meta.regularMarketPrice;
    if (!price) throw new Error();
    return price;
  } catch(e) { return null; }
}
async function fetchAll() {
  document.getElementById('lb').classList.add('on');
  setDot('loading', 'Actualisation...');
  var cok = await fetchCrypto();
  var tks = [...new Set([...P.pea.map(function(p){ return p.tk; }), ...P.ct.map(function(p){ return p.tk; })])];
  var cnt = 0;
  await Promise.all(tks.map(async function(tk) {
    var pr = await fetchETF(tk);
    if (pr) {
      P.pea.filter(function(p){ return p.tk===tk; }).forEach(function(p){ p.cp=pr; });
      P.ct.filter(function(p){  return p.tk===tk; }).forEach(function(p){ p.cp=pr; });
      cnt++;
    }
  }));
  var t = new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });
  setDot(cok||cnt>0 ? 'ok' : 'err', (cnt>0 ? cnt+' ETF' : 'ETF 17/03') + (cok ? ' · crypto live' : '') + ' · ' + t);
  document.getElementById('lb').classList.remove('on');
  set('k-time', t);
  ['lu-pea','lu-cry'].forEach(function(id){ set(id, 'Maj : '+t); });
  updateAll();
  redrawCh();
}
function setDot(s, m) { document.getElementById('dot').className = 'dot '+s; set('lbl', m); }

// ══════════════════════════════════════════════════════
// MISE A JOUR DE L'AFFICHAGE
// ══════════════════════════════════════════════════════
function updateAll() {
  var pea=cPEA(), ct=cCT(), cry=cCry(), tot=cTot();
  var tg=tot.v-tot.i, tp=prf(tot.v,tot.i), pp=prf(pea.v,pea.i), cp=prf(cry.v,cry.i);

  // KPIs
  set('k-total', f(tot.v));
  html('k-gain', '<span class="'+(tg>=0?'up':'dn')+'">'+(tg>=0?'+':'')+f(tg)+' ('+fp(tp)+')</span>');
  set('k-pea', f(pea.v));
  html('k-pea-p', '<span class="'+(pp>=0?'up':'dn')+'">'+fp(pp)+'</span>');
  set('k-splint', f(P.spl.total));
  html('k-splint-p', '<span class="'+(prf(P.spl.total,P.spl.invested)>=0?'up':'dn')+'">'+fp(prf(P.spl.total,P.spl.invested))+'</span>');
  set('k-crypto', f(cry.v));
  html('k-crypto-p', '<span class="'+(cp>=0?'up':'dn')+'">'+fp(cp)+'</span>');

  // Stacked bar
  var segs = [{v:pea.v,c:'#7c6fff',l:'PEA'},{v:ct.v,c:'#a78bfa',l:'CT'},{v:P.pe.total,c:'#ffd166',l:'PE'},{v:P.spl.total,c:'#5ddfb8',l:'Splint'},{v:cry.v,c:'#ff7c5d',l:'Crypto'}];
  var sb = document.getElementById('stacked'), lg = document.getElementById('stacked-leg');
  if (sb) {
    sb.innerHTML = ''; lg.innerHTML = '';
    segs.forEach(function(s) {
      var pct = (s.v/tot.v*100).toFixed(1);
      var d = document.createElement('div'); d.style.cssText = 'flex:'+pct+';background:'+s.c+';height:100%'; sb.appendChild(d);
      lg.innerHTML += '<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:var(--tx2)"><div style="width:8px;height:8px;border-radius:2px;background:'+s.c+'"></div>'+s.l+' '+pct+'%</div>';
    });
  }

  // Score diversification
  var sc = calcDivScore();
  set('div-score', sc.toFixed(1)+' / 10');
  var db = document.getElementById('div-bar'); if (db) db.style.width = (sc*10)+'%';
  set('div-detail', sc<5 ? 'Trop concentre US' : sc<7 ? 'Diversification correcte' : 'Bonne diversification');

  // Objectif
  var goal = PREFS.goal || 2000;
  var gpct = Math.min(100, tot.v/goal*100);
  html('goal-val', f(tot.v)+' <span style="font-size:13px;font-weight:400;color:var(--tx2)">/ '+f(goal)+'</span>');
  set('goal-lbl', goal);
  var gb = document.getElementById('goal-bar'); if (gb) gb.style.width = gpct.toFixed(1)+'%';
  set('goal-detail', gpct.toFixed(1)+'% atteint — encore '+f(goal-tot.v));

  // Streak
  set('streak-num', PREFS.streak || 2);

  // Résumé semaine
  var ws = document.getElementById('week-summary');
  if (ws) ws.innerHTML = [{n:'PEA',v:pp},{n:'Splint',v:prf(P.spl.total,P.spl.invested)},{n:'Crypto',v:cp},{n:'PE',v:prf(P.pe.total,P.pe.invested)}]
    .map(function(x){ return '<div class="week-item"><span>'+x.n+'</span><span class="'+(x.v>=0?'up':'dn')+'">'+fp(x.v)+'</span></div>'; }).join('');

  // Prochain palier confettis
  var ms = [100,150,200,250,300,400,500,600,700,800,900,1000,1100,1200,1500,2000,2500,3000];
  var next = ms.find(function(m){ return m > tot.v; }) || goal;
  html('next-milestone', '🎯 Prochain palier confettis : <strong style="color:var(--ac)">'+f(next)+'</strong> — encore '+f(next-tot.v));
  set('next-cf', f(next));

  // Confettis
  if (PREFS.confetti && LAST_TOTAL > 0) { ms.forEach(function(t){ if (LAST_TOTAL<t && tot.v>=t) confetti(); }); }
  LAST_TOTAL = tot.v;

  // Tableau PEA
  set('pea-v', f(pea.v));
  html('pea-p', '<span class="'+(pp>=0?'up':'dn')+'">'+fp(pp)+'</span>');
  var peaR = '';
  P.pea.forEach(function(p) {
    var val=p.sh*p.cp, gain=val-p.sh*p.bp, pf=prf(p.cp,p.bp);
    peaR += '<tr><td>'+p.n+'</td><td>'+p.sh+'</td><td>'+f(p.bp)+'</td><td style="font-weight:500">'+f(p.cp)+'</td><td>'+f(val)+'</td><td class="'+(gain>=0?'up':'dn')+'">'+(gain>=0?'+':'')+f(gain)+'</td><td>'+pb(pf)+'</td></tr>';
  });
  html('pea-rows', peaR);

  // CT
  set('ct-v', f(ct.v));
  html('ct-rows', P.ct.map(function(p){ return '<tr><td>'+p.n+'</td><td>'+p.sh.toFixed(5)+'</td><td>'+f(p.cp)+'</td><td>'+f(p.sh*p.cp)+'</td><td>'+pb(prf(p.cp,p.bp))+'</td></tr>'; }).join(''));

  // Crypto
  set('cry-v', f(cry.v));
  html('cry-p', '<span class="'+(cp>=0?'up':'dn')+'">'+fp(cp)+'</span>');
  var cryR = '';
  P.cry.forEach(function(c) {
    var val=c.q*c.cp, gain=val-c.q*c.bp, pf=prf(c.cp,c.bp);
    cryR += '<tr><td>'+c.n+'</td><td>'+c.q.toFixed(6)+'</td><td>'+c.bp.toLocaleString('fr-FR',{maximumFractionDigits:0})+' EUR</td><td style="font-weight:500">'+c.cp.toLocaleString('fr-FR',{maximumFractionDigits:0})+' EUR</td><td class="'+(gain>=0?'up':'dn')+'">'+(gain>=0?'+':'')+f(gain)+'</td><td>'+pb(pf)+'</td></tr>';
  });
  html('cry-rows', cryR);

  // PE
  set('pe-v', f(P.pe.total)); set('pe-v2', f(P.pe.total));
  html('pe-p', '<span class="'+(prf(P.pe.total,P.pe.invested)>=0?'up':'dn')+'">'+fp(prf(P.pe.total,P.pe.invested))+'</span>');
  html('pe-badge', pb(prf(P.pe.total, P.pe.invested)));

  // Splint
  set('spl-v', f(P.spl.total));
  html('spl-p', '<span class="'+(prf(P.spl.total,P.spl.invested)>=0?'up':'dn')+'">'+fp(prf(P.spl.total,P.spl.invested))+'</span>');
  html('spl-rows', P.spl.items.map(function(it){ return '<tr><td>'+it.l.substring(0,35)+'</td><td style="color:var(--tx3);font-size:11px">'+it.cat+'</td><td>'+f(it.v)+'</td><td>'+pb(prf(it.v,it.inv))+'</td></tr>'; }).join(''));

  // Barres géo
  var geos = [{n:'Etats-Unis',p:67.1,c:'#7c6fff'},{n:'Asie emergente',p:12.4,c:'#ffd166'},{n:'Europe',p:10.8,c:'#5ddfb8'},{n:'Chine',p:4.2,c:'#ff9f7c'},{n:'Taiwan',p:2.8,c:'#a78bfa'},{n:'Japon',p:2.3,c:'#ff7c5d'},{n:'Autres',p:0.4,c:'#55556a'}];
  html('geo-bars', geos.map(function(g){ return '<div class="geo-row"><div class="geo-top"><span style="font-size:12px">'+g.n+'</span><span style="font-family:Syne,sans-serif;font-weight:600;font-size:12px;color:'+g.c+'">'+g.p+'%</span></div><div class="prog-track"><div class="prog-fill" style="width:'+g.p+'%;background:'+g.c+'"></div></div></div>'; }).join(''));

  // Barres objectifs
  var targets = [{l:'Americain',a:67,t:35,c:'#7c6fff'},{l:'MSCI World',a:9,t:25,c:'#5ddfb8'},{l:'Marches emergents',a:17,t:20,c:'#ffd166'},{l:'Europe large',a:11,t:12,c:'#5ddfb8'},{l:'Defense/Sect.',a:4,t:8,c:'#ff7c5d'}];
  html('gap-bars', targets.map(function(x){ return '<div class="target-row"><div class="target-lbl">'+x.l+'</div><div class="target-bars"><div class="tbar-a" style="width:'+x.a+'%;background:'+x.c+'"></div><div class="tbar-t" style="width:'+x.t+'%;background:'+x.c+'"></div></div><div class="target-vals">'+x.a+'% → '+x.t+'%</div></div>'; }).join(''));

  // Risque
  var riskPct = calcRisk();
  var rn = document.getElementById('risk-needle'); if (rn) rn.style.left = riskPct+'%';
  var rl = document.getElementById('risk-label'), rd = document.getElementById('risk-desc');
  if (riskPct < 40)      { if(rl) rl.textContent='Risque faible';  if(rd) rd.textContent='Portefeuille defensif — bonne stabilite.'; }
  else if (riskPct < 65) { if(rl) rl.textContent='Risque modere'; if(rd) rd.textContent='Bon equilibre pour un horizon 5+ ans.'; }
  else                   { if(rl) rl.textContent='Risque eleve';  if(rd) rd.textContent='Offensif — potentiel eleve, volatilite importante.'; }

  renderCorrMatrix();
  renderFiscal(pea, ct, cry);
  renderBadges();
  renderVers();
  renderJour();
}

// ══════════════════════════════════════════════════════
// MATRICE DE CORRELATION
// ══════════════════════════════════════════════════════
function renderCorrMatrix() {
  var el = document.getElementById('corr-matrix'); if (!el) return;
  var labels = ['Nasdaq','S&P500','MSCI W.','EM','EU'];
  var corr = [[1,.95,.8,.4,.3],[.95,1,.82,.42,.32],[.8,.82,1,.5,.4],[.4,.42,.5,1,.6],[.3,.32,.4,.6,1]];
  var s = '<div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:10px"><tr><td></td>';
  labels.forEach(function(l){ s += '<td style="padding:3px 5px;color:var(--tx3)">'+l+'</td>'; });
  s += '</tr>';
  labels.forEach(function(l, i) {
    s += '<tr><td style="padding:3px 5px;color:var(--tx3)">'+l+'</td>';
    labels.forEach(function(l2, j) {
      var v=corr[i][j], bg=v>=.9?'rgba(248,113,113,.3)':v>=.7?'rgba(255,209,102,.2)':'rgba(255,255,255,.05)', c=v>=.9?'#f87171':v>=.7?'#ffd166':'var(--tx2)';
      s += '<td style="padding:4px 6px;text-align:center;background:'+bg+';border-radius:3px;color:'+c+'">'+v.toFixed(2)+'</td>';
    });
    s += '</tr>';
  });
  html('corr-matrix', s+'</table></div>');
}

// ══════════════════════════════════════════════════════
// CALCULATEUR FISCAL (par compte)
// ══════════════════════════════════════════════════════
function renderFiscal(pea, ct, cry) {
  var el = document.getElementById('fiscal-content'); if (!el) return;
  var peaG=pea.v-pea.i, ctG=ct.v-ct.i, cryG=cry.v-cry.i, peG=P.pe.total-P.pe.invested, splG=P.spl.total-P.spl.invested;
  var h = '';

  // PEA — fiscalité spécifique
  h += '<div class="fiscal-acct"><div class="fis-name"><span class="badge bp">PEA</span> Plan Epargne en Actions</div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Plus-value latente</span><span class="'+(peaG>=0?'up':'dn')+'">'+(peaG>=0?'+':'')+f(peaG)+'</span></div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Retrait avant 5 ans — flat tax 30%</span><span class="dn">'+f(Math.max(0,peaG)*0.30)+'</span></div>';
  h += '<div class="fis-row"><span style="color:var(--gn)">Retrait apres 5 ans — seulement 17,2% PS</span><span class="dn">'+f(Math.max(0,peaG)*0.172)+'</span></div>';
  h += '<div class="fis-row fis-total"><span>Net si retrait aujourd\'hui</span><span>'+f(peaG-Math.max(0,peaG)*0.30)+'</span></div>';
  h += '<div style="font-size:10px;color:var(--gn);margin-top:8px;padding:8px;background:rgba(74,222,128,.06);border-radius:6px">💡 Attends 5 ans : tu passes de 30% a seulement 17,2% de prelevements sociaux — IR exonere.</div></div>';

  // Compte-titres
  h += '<div class="fiscal-acct"><div class="fis-name"><span class="badge bx">CT</span> Compte-Titres Ordinaire</div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Plus-value latente</span><span class="'+(ctG>=0?'up':'dn')+'">'+(ctG>=0?'+':'')+f(ctG)+'</span></div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Flat tax 30% (12,8% IR + 17,2% PS)</span><span class="dn">'+f(Math.max(0,ctG)*0.30)+'</span></div>';
  h += '<div class="fis-row fis-total"><span>Net apres cession</span><span>'+f(ctG-Math.max(0,ctG)*0.30)+'</span></div></div>';

  // Crypto
  h += '<div class="fiscal-acct"><div class="fis-name"><span class="badge br">Crypto</span> Bitcoin & Solana</div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Plus/moins-value latente</span><span class="'+(cryG>=0?'up':'dn')+'">'+(cryG>=0?'+':'')+f(cryG)+'</span></div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Flat tax 30% si cession EUR</span>'+(cryG>0?'<span class="dn">'+f(cryG*0.30)+'</span>':'<span style="color:var(--gn)">Moins-value reportable</span>')+'</div>';
  h += '<div class="fis-row fis-total"><span>Net apres cession</span><span>'+f(cryG-Math.max(0,cryG)*0.30)+'</span></div>';
  h += '<div style="font-size:10px;color:var(--am);margin-top:8px">Imposition uniquement lors de la conversion en EUR (pas crypto vers crypto).</div></div>';

  // Private Equity
  h += '<div class="fiscal-acct"><div class="fis-name"><span class="badge ba">PE</span> Private Equity Apollo</div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Plus-value latente</span><span class="'+(peG>=0?'up':'dn')+'">'+(peG>=0?'+':'')+f(peG)+'</span></div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Flat tax 30% sur distributions/plus-values</span><span class="dn">'+f(Math.max(0,peG)*0.30)+'</span></div>';
  h += '<div class="fis-row fis-total"><span>Net estime</span><span>'+f(peG-Math.max(0,peG)*0.30)+'</span></div></div>';

  // Splint
  h += '<div class="fiscal-acct"><div class="fis-name"><span class="badge bt">Splint</span> Splint Invest</div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Plus-value latente</span><span class="'+(splG>=0?'up':'dn')+'">'+(splG>=0?'+':'')+f(splG)+'</span></div>';
  h += '<div class="fis-row"><span style="color:var(--tx2)">Flat tax 30% sur plus-values</span><span class="dn">'+f(Math.max(0,splG)*0.30)+'</span></div>';
  h += '<div class="fis-row fis-total"><span>Net estime</span><span>'+f(splG-Math.max(0,splG)*0.30)+'</span></div></div>';

  el.innerHTML = h;
}

// ══════════════════════════════════════════════════════
// BADGES
// ══════════════════════════════════════════════════════
var ALL_BADGES = [
  { icon:'🚀', name:'1er invest.',  cond:'Premier versement',    check:function(){ return VERSEMENTS.length>0; } },
  { icon:'🔥', name:'2 mois',       cond:'2 mois consecutifs',   check:function(){ return (PREFS.streak||0)>=2; } },
  { icon:'💎', name:'500 EUR',      cond:'Patrimoine > 500 EUR', check:function(){ return cTot().v>=500; } },
  { icon:'🌍', name:'Diversifie',   cond:'Score > 7/10',         check:function(){ return calcDivScore()>=7; } },
  { icon:'📈', name:'10 versements',cond:'10 versements',        check:function(){ return VERSEMENTS.length>=10; } },
  { icon:'🏆', name:'1 000 EUR',    cond:'Patrimoine > 1000',    check:function(){ return cTot().v>=1000; } },
  { icon:'⚡', name:'6 mois',       cond:'6 mois consecutifs',   check:function(){ return (PREFS.streak||0)>=6; } },
  { icon:'🎯', name:'Score 8+',     cond:'Diversification 8/10', check:function(){ return calcDivScore()>=8; } },
  { icon:'🌟', name:'2 000 EUR',    cond:'Patrimoine > 2000',    check:function(){ return cTot().v>=2000; } },
  { icon:'📚', name:'Journal',      cond:'5 entrees journal',    check:function(){ return JOURNAL.length>=5; } },
  { icon:'🤝', name:'Parrainage',   cond:'Splint > 700 EUR',     check:function(){ return P.spl.total>=700; } },
  { icon:'⏳', name:'Long terme',   cond:'Horizon 5 ans',        check:function(){ return true; } },
];
function renderBadges() {
  var h = ALL_BADGES.map(function(b) {
    var u = b.check();
    return '<div class="bdg'+(u?'':' locked')+'"><div class="bdg-icon">'+b.icon+'</div><div class="bdg-name">'+b.name+'</div><div class="bdg-cond">'+b.cond+'</div></div>';
  }).join('');
  html('badge-home', h); html('badge-full', h);
}

// ══════════════════════════════════════════════════════
// CARTE DU MONDE
// ══════════════════════════════════════════════════════
function buildMap() {
  var el = document.getElementById('world-map'); if (!el || el.children.length > 0) return;
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var sc = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.4)';
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox','0 0 1000 500'); svg.setAttribute('width','100%'); svg.setAttribute('height','100%');
  svg.style.cssText = 'position:absolute;top:0;left:0;opacity:.1;pointer-events:none';
  svg.innerHTML = '<g fill="none" stroke="'+sc+'" stroke-width="1" stroke-linejoin="round">'
    + '<path d="M120,180 L140,170 L160,175 L155,190 L135,195 Z"/>'
    + '<path d="M150,200 L170,190 L200,195 L210,215 L195,230 L165,225 L150,210 Z"/>'
    + '<path d="M175,230 L200,235 L205,260 L185,270 L170,255 Z"/>'
    + '<path d="M250,140 L320,135 L340,150 L350,170 L335,185 L300,190 L270,185 L245,170 Z"/>'
    + '<path d="M260,195 L330,192 L345,210 L340,230 L310,240 L275,235 L255,218 Z"/>'
    + '<path d="M270,245 L315,240 L330,260 L320,290 L295,300 L270,290 L258,268 Z"/>'
    + '<path d="M340,165 L390,155 L420,165 L430,185 L415,200 L375,205 L345,195 Z"/>'
    + '<path d="M350,215 L400,208 L425,225 L420,248 L390,258 L355,250 Z"/>'
    + '<path d="M440,175 L490,165 L530,170 L545,190 L535,210 L500,220 L460,215 L435,198 Z"/>'
    + '<path d="M450,230 L510,222 L540,238 L535,260 L505,272 L465,265 L445,248 Z"/>'
    + '<path d="M480,278 L530,270 L555,285 L550,310 L520,325 L485,318 L468,298 Z"/>'
    + '<path d="M545,175 L610,165 L655,170 L670,188 L660,210 L625,225 L580,228 L545,215 Z"/>'
    + '<path d="M555,235 L625,228 L665,242 L668,268 L640,285 L595,290 L555,278 Z"/>'
    + '<path d="M565,298 L630,290 L668,305 L665,335 L635,355 L590,358 L558,342 L548,318 Z"/>'
    + '<path d="M675,170 L740,162 L780,170 L795,192 L780,215 L740,225 L685,220 Z"/>'
    + '<path d="M685,232 L750,225 L790,240 L790,268 L755,285 L700,282 L678,260 Z"/>'
    + '<path d="M690,295 L755,288 L792,305 L790,338 L758,358 L705,355 L678,330 Z"/>'
    + '<path d="M800,165 L860,158 L895,168 L905,188 L890,208 L848,218 L805,212 Z"/>'
    + '<path d="M810,225 L870,218 L905,235 L902,262 L868,278 L815,272 Z"/>'
    + '<path d="M820,285 L875,278 L905,295 L900,325 L865,345 L820,338 Z"/>'
    + '<path d="M680,355 L730,348 L765,362 L760,395 L725,412 L685,405 Z"/>'
    + '<path d="M595,368 L640,360 L665,378 L658,410 L628,428 L592,420 Z"/>'
    + '<line x1="0" y1="250" x2="1000" y2="250" stroke-dasharray="4,6" stroke-width="0.5"/>'
    + '<line x1="500" y1="0" x2="500" y2="500" stroke-dasharray="4,6" stroke-width="0.5"/>'
    + '</g>';
  el.appendChild(svg);
  var bubbles = [
    ['US\n67%',21,39,90,'#7c6fff'], ['Asie EM\n12%',73,44,56,'#ffd166'], ['Europe\n11%',47,31,52,'#5ddfb8'],
    ['Chine\n4%',74,38,33,'#ff9f7c'], ['Inde\n4%',67,49,33,'#4ade80'], ['Japon\n2%',79,35,26,'#ff7c5d'],
    ['Coree\n2%',81,44,24,'#a78bfa'], ['TW\n3%',77,51,28,'#ffd166'], ['UK\n2%',45,24,22,'#7c6fff']
  ];
  bubbles.forEach(function(b) {
    var d = document.createElement('div'); d.className = 'bubble';
    d.style.cssText = 'left:'+b[1]+'%;top:'+b[2]+'%;width:'+b[3]+'px;height:'+b[3]+'px;background:'+b[4]+'20;border:1.5px solid '+b[4]+'60;';
    d.innerHTML = '<div class="blbl" style="color:'+b[4]+';font-size:'+Math.max(8,b[3]/8.5)+'px">'+b[0].replace('\n','<br>')+'</div>';
    el.appendChild(d);
  });
}

// ══════════════════════════════════════════════════════
// GRAPHIQUES
// ══════════════════════════════════════════════════════
function mkCh(id, cfg) {
  var el = document.getElementById(id); if (!el) return;
  if (CH[id]) CH[id].destroy();
  CH[id] = new Chart(el, cfg);
}
function themeVars() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return { tx2: isDark?'#8888a0':'#55556a', grid: isDark?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.06)' };
}
function redrawCh() {
  var tv = themeVars();
  mkCh('c-radar', { type:'radar', data:{ labels:['US','MSCI World','Emergents','Europe','Defense'], datasets:[
    { label:'Actuel', data:[67,9,17,11,4], backgroundColor:'rgba(124,111,255,.15)', borderColor:'#7c6fff', borderWidth:2, pointBackgroundColor:'#7c6fff', pointRadius:3 },
    { label:'Cible',  data:[35,25,20,12,8], backgroundColor:'rgba(93,223,184,.1)',  borderColor:'#5ddfb8', borderWidth:2, borderDash:[5,4], pointBackgroundColor:'#5ddfb8', pointRadius:3 }
  ]}, options:{ responsive:true, maintainAspectRatio:false, scales:{ r:{ min:0, max:70, ticks:{ color:tv.tx2, font:{size:9,family:'DM Mono'}, stepSize:20, backdropColor:'transparent' }, grid:{ color:tv.grid }, pointLabels:{ color:tv.tx2, font:{size:10,family:'DM Mono'} }, angleLines:{ color:tv.grid } } }, plugins:{ legend:{ labels:{ color:tv.tx2, font:{family:'DM Mono',size:10}, boxWidth:8 } } } } });
  updateProj();
  if (VERSEMENTS.length > 0) {
    var sorted = [...VERSEMENTS].sort(function(a,b){ return a.date.localeCompare(b.date); });
    mkCh('c-hist', { type:'bar', data:{ labels:sorted.map(function(v){ return fdate(v.date); }), datasets:[{ label:'Versement', data:sorted.map(function(v){ return v.amount; }), backgroundColor:'#7c6fff', borderRadius:4 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{color:tv.grid}, ticks:{color:tv.tx2,font:{family:'DM Mono',size:10}} }, y:{ grid:{color:tv.grid}, ticks:{color:tv.tx2,font:{family:'DM Mono',size:10},callback:function(v){ return v+'EUR'; }} } } } });
  }
}

// ══════════════════════════════════════════════════════
// PROJECTION
// ══════════════════════════════════════════════════════
function updateProj() {
  var monthly = parseFloat(document.getElementById('sl-monthly') && document.getElementById('sl-monthly').value || 50);
  var rate    = parseFloat(document.getElementById('sl-rate')    && document.getElementById('sl-rate').value    || 10) / 100;
  var years   = parseInt(document.getElementById('sl-years')   && document.getElementById('sl-years').value   || 5);
  set('sl-mv', monthly+' EUR/mois'); set('sl-rv', (rate*100).toFixed(1)+'%'); set('sl-yv', years+' an'+(years>1?'s':''));
  var cap = cTot().v, data = [], labels = [];
  for (var y = 0; y <= years; y++) {
    var v = rate > 0 ? cap*Math.pow(1+rate,y) + monthly*12*((Math.pow(1+rate,y)-1)/rate) : cap + monthly*12*y;
    data.push(Math.round(v)); labels.push(y===0 ? 'Auj.' : 'An '+y);
  }
  var final = data[data.length-1], totalInv = cap+monthly*12*years, interests = final-totalInv;
  set('proj-final', f(final)); set('proj-invested', f(totalInv));
  html('proj-interest', '<span class="up">+'+f(Math.max(0,interests))+'</span>');
  var tv = themeVars();
  mkCh('c-proj', { type:'line', data:{ labels:labels, datasets:[{ label:'Capital', data:data, borderColor:'#7c6fff', backgroundColor:'rgba(124,111,255,.08)', borderWidth:2.5, tension:0.4, pointRadius:4, pointBackgroundColor:'#7c6fff', fill:true }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{callbacks:{label:function(c){ return ' '+f(c.parsed.y); }}} }, scales:{ x:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'DM Mono',size:11}}}, y:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'DM Mono',size:10},callback:function(v){ return v+'EUR'; }}} } } });
  var sc = [{l:'+6%',r:.06,c:'#5ddfb8'},{l:'+8%',r:.08,c:'#7c6fff'},{l:'+10%',r:.1,c:'#ffd166'},{l:'+12%',r:.12,c:'#ff7c5d'}];
  var yrs = [0,1,2,3,4,5];
  mkCh('c-scen', { type:'line', data:{ labels:yrs.map(function(y){ return y===0?'Auj.':'An '+y; }), datasets:sc.map(function(s){ return { label:s.l, data:yrs.map(function(y){ return Math.round(cap*Math.pow(1+s.r,y)+monthly*12*((Math.pow(1+s.r,y)-1)/s.r)); }), borderColor:s.c, backgroundColor:'transparent', borderWidth:2, tension:0.4, pointRadius:3, pointBackgroundColor:s.c }; }) }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{labels:{color:tv.tx2,font:{family:'DM Mono',size:10},boxWidth:8}}, tooltip:{callbacks:{label:function(c){ return ' '+c.dataset.label+': '+f(c.parsed.y); }}} }, scales:{ x:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'DM Mono',size:11}}}, y:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'DM Mono',size:10},callback:function(v){ return v+'EUR'; }}} } } });
}

// ══════════════════════════════════════════════════════
// SIMULATEUR
// ══════════════════════════════════════════════════════
function runSim() {
  var amount = parseFloat(document.getElementById('sim-amount').value || 50);
  if (isNaN(amount) || amount <= 0) return;
  var targets = [{n:'MSCI World PEA',gap:16,c:'#5ddfb8'},{n:'MSCI EM Global',gap:3,c:'#ffd166'},{n:'Europe Defense',gap:4,c:'#ff7c5d'},{n:'Stoxx Europe 600',gap:1,c:'#a78bfa'}];
  var tg = targets.reduce(function(s,t){ return s+t.gap; }, 0);
  var h = '<div style="font-size:11px;color:var(--gn);margin-bottom:10px">Repartition optimale de '+f(amount)+' selon tes objectifs :</div>';
  targets.forEach(function(t) {
    var alloc = (t.gap/tg)*amount;
    h += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--bd3)"><div><div style="font-size:12px">'+t.n+'</div><div style="font-size:10px;color:var(--tx3)">Sous-pondere par rapport a l\'objectif</div></div><div style="font-family:Syne,sans-serif;font-weight:700;font-size:15px;color:'+t.c+'">+'+f(alloc)+'</div></div>';
  });
  h += '<div style="margin-top:10px;font-size:11px;color:var(--tx3)">Ne renforce pas Nasdaq/S&P 500 — deja surponderes a 67% vs objectif 35%</div>';
  html('sim-result', h);
}

// ══════════════════════════════════════════════════════
// VERSEMENTS
// ══════════════════════════════════════════════════════
function addV() {
  var date = document.getElementById('h-date').value;
  var amount = parseFloat(document.getElementById('h-amount').value);
  var etf = document.getElementById('h-etf').value;
  if (!date || isNaN(amount) || amount <= 0) { alert('Remplis tous les champs.'); return; }
  VERSEMENTS.unshift({ date:date, amount:amount, etf:etf, id:Date.now() });
  PREFS.streak = Math.max(PREFS.streak||0, Math.min(12, Math.floor(VERSEMENTS.length)));
  saveSt(); renderVers(); updateAll();
  document.getElementById('h-amount').value = '';
}
function delV(id) { VERSEMENTS = VERSEMENTS.filter(function(v){ return v.id!==id; }); saveSt(); renderVers(); }
function renderVers() {
  var el = document.getElementById('hist-rows'); if (!el) return;
  if (VERSEMENTS.length === 0) { el.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--tx3);padding:16px">Aucun versement</td></tr>'; return; }
  el.innerHTML = VERSEMENTS.map(function(v) {
    return '<tr><td>'+fdate(v.date)+'</td><td>'+v.etf+'</td><td style="color:var(--gn);font-weight:500">+'+f(v.amount)+'</td><td><button onclick="delV('+v.id+')" style="background:none;border:none;color:var(--rd);cursor:pointer;font-size:13px">x</button></td></tr>';
  }).join('');
}

// ══════════════════════════════════════════════════════
// JOURNAL
// ══════════════════════════════════════════════════════
function addJ() {
  var date = document.getElementById('j-date').value;
  var etf  = document.getElementById('j-etf').value;
  var type = document.getElementById('j-type').value;
  var note = document.getElementById('j-note').value;
  if (!date || !note.trim()) { alert('Remplis la date et la note.'); return; }
  JOURNAL.unshift({ date:date, etf:etf, type:type, note:note, id:Date.now() });
  saveSt(); renderJour();
  document.getElementById('j-etf').value = '';
  document.getElementById('j-note').value = '';
}
function delJ(id) { JOURNAL = JOURNAL.filter(function(j){ return j.id!==id; }); saveSt(); renderJour(); }
function renderJour() {
  var el = document.getElementById('journal-list'); if (!el) return;
  if (JOURNAL.length === 0) { el.innerHTML = '<div style="text-align:center;color:var(--tx3);padding:20px;font-size:12px">Aucune entree</div>'; return; }
  var typeColor = { 'Achat':'var(--gn)', 'Vente':'var(--rd)', 'Reflexion':'var(--ac)', 'Objectif':'var(--am)' };
  el.innerHTML = JOURNAL.map(function(j) {
    var c = typeColor[j.type] || 'var(--ac)';
    return '<div class="jentry" style="border-left-color:'+c+'"><div class="je-date">'+fdate(j.date)+' · <span style="color:'+c+'">'+j.type+'</span><button onclick="delJ('+j.id+')" style="float:right;background:none;border:none;color:var(--tx3);cursor:pointer;font-size:11px">x</button></div><div class="je-etf">'+j.etf+'</div><div class="je-note">'+j.note+'</div></div>';
  }).join('');
}

// ══════════════════════════════════════════════════════
// MISE A JOUR MANUELLE SPLINT & PE
// ══════════════════════════════════════════════════════
function buildSplintForm() {
  var g = document.getElementById('splint-form'); if (!g || g.children.length > 0) return;
  P.spl.items.forEach(function(it) {
    g.innerHTML += '<div><div style="font-size:10px;color:var(--tx3);margin-bottom:4px">'+it.l.substring(0,24)+'</div><input class="inp" type="number" id="sf_'+it.k+'" step="0.01" value="'+it.v+'"></div>';
  });
}
function saveSplint() {
  var newItems = P.spl.items.map(function(it) {
    var v = parseFloat(document.getElementById('sf_'+it.k) && document.getElementById('sf_'+it.k).value || it.v);
    return Object.assign({}, it, { v:v });
  });
  var total    = newItems.reduce(function(s,i){ return s+i.v; }, 0);
  var invested = newItems.reduce(function(s,i){ return s+i.inv; }, 0);
  P.spl = { total:total, invested:invested, items:newItems };
  try { localStorage.setItem('spl', JSON.stringify(P.spl)); } catch(e) {}
  var btn = document.getElementById('spl-btn');
  if (btn) { btn.textContent = 'Enregistre !'; setTimeout(function(){ btn.textContent = 'Enregistrer Splint'; }, 2000); }
  updateAll(); redrawCh();
}
function savePE() {
  var v = parseFloat(document.getElementById('pe-input').value || 15.29);
  P.pe = { total:v, invested:15.00 };
  try { localStorage.setItem('pe2', JSON.stringify(P.pe)); } catch(e) {}
  updateAll();
  var btn = event.target; btn.textContent = 'OK !'; setTimeout(function(){ btn.textContent = 'Enregistrer PE'; }, 1500);
}

// ══════════════════════════════════════════════════════
// CONFETTI
// ══════════════════════════════════════════════════════
function confetti() {
  if (!PREFS.confetti) return;
  var colors = ['#7c6fff','#5ddfb8','#ffd166','#ff7c5d','#a78bfa','#4ade80','#f87171'];
  for (var i = 0; i < 80; i++) {
    var p = document.createElement('div'); p.className = 'confetti-piece';
    p.style.cssText = 'left:'+Math.random()*100+'%;background:'+colors[Math.floor(Math.random()*colors.length)]+';animation-duration:'+(1.5+Math.random()*2)+'s;animation-delay:'+Math.random()*0.5+'s';
    document.body.appendChild(p);
    setTimeout(function(e){ if (e.parentNode) e.parentNode.removeChild(e); }, 3500, p);
  }
}

// ══════════════════════════════════════════════════════
// PARAMETRES
// ══════════════════════════════════════════════════════
function setAccent(name, el) {
  document.documentElement.setAttribute('data-accent', name);
  document.querySelectorAll('.swatch').forEach(function(s){ s.classList.remove('sel'); });
  if (el) el.classList.add('sel');
  PREFS.accent = name; saveSt(); redrawCh();
}
function toggleDark() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  var t = document.getElementById('tgl-dark'); if (t) t.classList.toggle('on', !isDark);
  PREFS.dark = !isDark; saveSt();
  var mapEl = document.getElementById('world-map'); if (mapEl) mapEl.innerHTML = '';
  buildMap(); redrawCh();
}
function togPref(key, tglId) {
  PREFS[key] = !PREFS[key];
  var t = document.getElementById(tglId); if (t) t.classList.toggle('on', PREFS[key]);
  saveSt();
}
function setGoal() {
  var v = parseFloat(document.getElementById('goal-input').value || 2000);
  PREFS.goal = v; saveSt(); updateAll();
}

// ══════════════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════════════
function nav(id, btn) {
  document.querySelectorAll('.page').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  if (id === 'p2') buildMap();
  if (id === 'p3') { buildSplintForm(); setTimeout(updateProj, 100); }
  if (id === 'p4') buildSplintForm();
  setTimeout(redrawCh, 100);
}
function sub(id, btn, page) {
  document.querySelectorAll('#'+page+' .subpage').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('#'+page+' .stab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  if (btn) btn.classList.add('active');
  if (id === 's-geo')  setTimeout(buildMap, 50);
  if (id === 's-proj') setTimeout(updateProj, 100);
  if (id === 's-maj')  buildSplintForm();
  setTimeout(redrawCh, 100);
}

// ══════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════
function initPrefs() {
  document.documentElement.setAttribute('data-theme',  PREFS.dark   ? 'dark' : 'light');
  document.documentElement.setAttribute('data-accent', PREFS.accent || 'violet');
  var td = document.getElementById('tgl-dark'); if (td) td.classList.toggle('on', PREFS.dark);
  var tc = document.getElementById('tgl-conf'); if (tc) tc.classList.toggle('on', PREFS.confetti);
  var ta = document.getElementById('tgl-anim'); if (ta) ta.classList.toggle('on', PREFS.anim);
  var gi = document.getElementById('goal-input'); if (gi) gi.value = PREFS.goal || 2000;
  var now = new Date().toISOString().split('T')[0];
  var hd = document.getElementById('h-date'); if (hd) hd.value = now;
  var jd = document.getElementById('j-date'); if (jd) jd.value = now;
  document.querySelectorAll('.swatch').forEach(function(s) {
    var oc = s.getAttribute('onclick') || '';
    if (oc.includes("'"+PREFS.accent+"'")) s.classList.add('sel'); else s.classList.remove('sel');
  });
}

window.addEventListener('load', function() {
  loadSt();
  initPrefs();
  updateAll();
  redrawCh();
  fetchAll();
  setInterval(fetchAll, 5 * 60 * 1000);
});
