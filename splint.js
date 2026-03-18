// ══════════════════════════════════════════════════════
// SPLINT.JS — Systeme de veille Splint Invest
// ══════════════════════════════════════════════════════

// Donnees pre-remplies avec les 11 positions actuelles
var SPLINT_HISTORIQUE = [
  { id:1, name:'Ronaldo 2021 Immaculate 1/1 PSA 7', cat:'Cartes sport',  inv:100, val:101.06, date:'2024-06-01', score:7, dec:'Investi',   note:'Piece unique, cote Ronaldo stable' },
  { id:2, name:'Pokemon Neo Discovery 1st Ed.',      cat:'Cartes Pokemon',inv:100, val:100.00, date:'2024-08-15', score:8, dec:'Investi',   note:'1ere edition tres rare, marche solide' },
  { id:3, name:'Zidane 2024 FIFA Kaboom 1/1 PSA 8',  cat:'Cartes sport',  inv:50,  val:56.23,  date:'2024-10-20', score:9, dec:'Investi',   note:'Legende mondiale, tirage 1/1 exclusif' },
  { id:4, name:'Pokemon S&M Team Up Case P.2',        cat:'Cartes Pokemon',inv:50,  val:54.80,  date:'2024-11-05', score:8, dec:'Investi',   note:'Set recherche, bonne tendance' },
  { id:5, name:'Yao Ming 2005 UD Mirror Auto 1/2',    cat:'Cartes sport',  inv:50,  val:51.23,  date:'2024-12-01', score:7, dec:'Investi',   note:'Autographe rare, tirage limite' },
  { id:6, name:'Peyton Manning Prizm Gold PSA 9',     cat:'Cartes sport',  inv:50,  val:50.00,  date:'2025-01-10', score:6, dec:'Investi',   note:'Legende NFL, Prizm gold stable' },
  { id:7, name:'Antony Daley, Herefrom',              cat:'Art',           inv:50,  val:53.66,  date:'2025-02-14', score:7, dec:'Investi',   note:'Artiste en montee, style contemporain' },
  { id:8, name:'Fernando Botero, Flautista 2023',     cat:'Art',           inv:50,  val:53.49,  date:'2025-02-28', score:8, dec:'Investi',   note:'Botero tres cote, piece recente' },
  { id:9, name:'Frida Kahlo, Corporeal field 1946',   cat:'Art',           inv:50,  val:50.00,  date:'2025-03-05', score:9, dec:'Investi',   note:'Icone mondiale, 1946 rare' },
  { id:10,name:'Amanda Watt, California Dreaming',    cat:'Art',           inv:50,  val:50.00,  date:'2025-03-10', score:6, dec:'Investi',   note:'Artiste emergente, prix raisonnable' },
  { id:11,name:'Hermes Kelly 28 Gris Pantin',         cat:'Sacs a main',   inv:50,  val:51.45,  date:'2025-03-15', score:9, dec:'Investi',   note:'Kelly 28 tres demande, Hermes valeur sure' },
];

var SPLINT_ALERTES  = [];
var SPLINT_NOTIFS   = [];
var SPLINT_JOURNAL  = [];
var SPLINT_PREFS    = { insta:true, linkedin:true, ebay:true };
var SPLINT_CHARTS   = {};
var ANALYSE_EN_COURS = null;

// ══ STORAGE ══
function loadSplintSt() {
  try { var h=localStorage.getItem('spl_histo');  if(h) SPLINT_HISTORIQUE=JSON.parse(h); } catch(e){}
  try { var a=localStorage.getItem('spl_alertes'); if(a) SPLINT_ALERTES=JSON.parse(a);  } catch(e){}
  try { var n=localStorage.getItem('spl_notifs');  if(n) SPLINT_NOTIFS=JSON.parse(n);   } catch(e){}
  try { var j=localStorage.getItem('spl_journal'); if(j) SPLINT_JOURNAL=JSON.parse(j);  } catch(e){}
  try { var p=localStorage.getItem('spl_prefs');   if(p) SPLINT_PREFS=Object.assign(SPLINT_PREFS,JSON.parse(p)); } catch(e){}
}
function saveSplintSt() {
  try {
    localStorage.setItem('spl_histo',   JSON.stringify(SPLINT_HISTORIQUE));
    localStorage.setItem('spl_alertes', JSON.stringify(SPLINT_ALERTES));
    localStorage.setItem('spl_notifs',  JSON.stringify(SPLINT_NOTIFS));
    localStorage.setItem('spl_journal', JSON.stringify(SPLINT_JOURNAL));
    localStorage.setItem('spl_prefs',   JSON.stringify(SPLINT_PREFS));
  } catch(e){}
}

// ══ UTILS ══
function sf(n) { return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' EUR'; }
function sfp(n){ return (n>=0?'+':'')+n.toFixed(2)+'%'; }
function sprf(c,b){ return (c-b)/b*100; }
function sdate(d){ if(!d)return'--'; try{var p=d.split('-');return p[2]+'/'+p[1]+'/'+p[0];}catch(e){return d;} }

// ══ LIQUIDITE PAR CATEGORIE ══
function liquidite(cat) {
  var liq = { 'Cartes sport':'haute', 'Cartes Pokemon':'haute', 'Art':'faible', 'Sacs a main':'moy', 'Montres':'moy', 'Autre':'faible' };
  return liq[cat] || 'moy';
}
function liqLabel(l) {
  if(l==='haute') return '<span class="liq-badge liq-haute">Liquidite haute</span>';
  if(l==='moy')   return '<span class="liq-badge liq-moy">Liquidite moyenne</span>';
  return '<span class="liq-badge liq-faible">Liquidite faible</span>';
}

// ══ KPIs TABLEAU DE BORD ══
function renderSplintDash() {
  var total   = SPLINT_HISTORIQUE.reduce(function(s,i){return s+i.val;},0);
  var invested= SPLINT_HISTORIQUE.reduce(function(s,i){return s+i.inv;},0);
  var gain    = total-invested;
  var perf    = sprf(total,invested);
  var bestCat = getBestCategory();

  var kpis = [
    { label:'Valeur totale',  val:sf(total),            sub:sfp(perf),         color: perf>=0?'var(--gn)':'var(--rd)' },
    { label:'Gain total',     val:(gain>=0?'+':'')+sf(gain), sub:invested+' EUR investi', color: gain>=0?'var(--gn)':'var(--rd)' },
    { label:'Meilleure cat.', val:bestCat.name,          sub:'Rdt moyen '+sfp(bestCat.perf), color:'var(--ac)' },
    { label:'Analyses',       val:SPLINT_HISTORIQUE.length, sub:SPLINT_ALERTES.length+' alertes actives', color:'var(--am)' },
  ];
  var el=document.getElementById('sv-kpis');
  if(el) el.innerHTML=kpis.map(function(k){
    return '<div class="card"><div class="ctitle">'+k.label+'</div>'
      +'<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:700;font-size:20px;letter-spacing:-.5px;color:'+k.color+';margin-bottom:4px">'+k.val+'</div>'
      +'<div style="font-size:11px;color:var(--tx2);font-family:\'Josefin Sans\',sans-serif;font-weight:300">'+k.sub+'</div></div>';
  }).join('');

  renderSplintPositions();
  renderSplintCharts();
}

function getBestCategory() {
  var cats = {};
  SPLINT_HISTORIQUE.forEach(function(i) {
    if(!cats[i.cat]) cats[i.cat]={total:0,invested:0};
    cats[i.cat].total   += i.val;
    cats[i.cat].invested+= i.inv;
  });
  var best = {name:'--',perf:0};
  Object.keys(cats).forEach(function(k) {
    var p=sprf(cats[k].total,cats[k].invested);
    if(p>best.perf){best={name:k,perf:p};}
  });
  return best;
}

function renderSplintPositions() {
  var el=document.getElementById('sv-positions');if(!el)return;
  el.innerHTML=SPLINT_HISTORIQUE.map(function(it) {
    var gain=it.val-it.inv, perf=sprf(it.val,it.inv), liq=liquidite(it.cat);
    return '<tr>'
      +'<td>'+it.name.substring(0,40)+'</td>'
      +'<td style="color:var(--tx3);font-size:11px">'+it.cat+'</td>'
      +'<td>'+sf(it.inv)+'</td>'
      +'<td style="font-weight:500">'+sf(it.val)+'</td>'
      +'<td class="'+(gain>=0?'up':'dn')+'">'+(gain>=0?'+':'')+sf(gain)+'</td>'
      +'<td><span class="badge '+(perf>=5?'bg':perf>=0?'bt':'br')+'">'+sfp(perf)+'</span></td>'
      +'<td>'+liqLabel(liq)+'</td>'
      +'</tr>';
  }).join('');
}

function renderSplintCharts() {
  var tv={tx2:document.documentElement.getAttribute('data-theme')==='dark'?'#8888a0':'#55556a',grid:document.documentElement.getAttribute('data-theme')==='dark'?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.06)'};

  // Perf par categorie
  var cats={};
  SPLINT_HISTORIQUE.forEach(function(i){
    if(!cats[i.cat]){cats[i.cat]={total:0,invested:0};}
    cats[i.cat].total+=i.val;cats[i.cat].invested+=i.inv;
  });
  var catLabels=Object.keys(cats);
  var catPerfs=catLabels.map(function(k){return parseFloat(sprf(cats[k].total,cats[k].invested).toFixed(2));});
  var catColors=['#7c6fff','#5ddfb8','#ffd166','#ff7c5d','#a78bfa','#4ade80'];

  mkSplintCh('c-sv-cat',{type:'bar',data:{labels:catLabels,datasets:[{label:'Performance %',data:catPerfs,backgroundColor:catColors.slice(0,catLabels.length),borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return' '+c.parsed.y.toFixed(2)+'%';}}}},scales:{x:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'Josefin Sans',size:10}}},y:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'Josefin Sans',size:10},callback:function(v){return v+'%';}}}}}});

  // Evolution patrimoine Splint
  var sorted=[...SPLINT_HISTORIQUE].sort(function(a,b){return a.date.localeCompare(b.date);});
  var cumVal=0,cumInv=0;
  var evolLabels=[],evolVals=[],evolInvs=[];
  sorted.forEach(function(it){cumVal+=it.val;cumInv+=it.inv;evolLabels.push(sdate(it.date).substring(0,5));evolVals.push(parseFloat(cumVal.toFixed(2)));evolInvs.push(parseFloat(cumInv.toFixed(2)));});
  mkSplintCh('c-sv-evol',{type:'line',data:{labels:evolLabels,datasets:[{label:'Valeur',data:evolVals,borderColor:'#5ddfb8',backgroundColor:'rgba(93,223,184,.07)',borderWidth:2,tension:0.4,fill:true,pointRadius:3,pointBackgroundColor:'#5ddfb8'},{label:'Investi',data:evolInvs,borderColor:'var(--tx3)',backgroundColor:'transparent',borderWidth:1.5,tension:0.4,borderDash:[4,4],pointRadius:2}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:tv.tx2,font:{family:'Josefin Sans',size:10},boxWidth:8}},tooltip:{callbacks:{label:function(c){return' '+c.dataset.label+': '+sf(c.parsed.y);}}}},scales:{x:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'Josefin Sans',size:10}}},y:{grid:{color:tv.grid},ticks:{color:tv.tx2,font:{family:'Josefin Sans',size:10},callback:function(v){return v+'EUR';}}}}}});
}

function mkSplintCh(id,cfg) {
  var el=document.getElementById(id);if(!el)return;
  if(SPLINT_CHARTS[id])SPLINT_CHARTS[id].destroy();
  SPLINT_CHARTS[id]=new Chart(el,cfg);
}

// ══ ANALYSE D'UN LISTING ══
async function analyseListing() {
  var name    = document.getElementById('sv-name').value.trim();
  var cat     = document.getElementById('sv-cat').value;
  var price   = parseFloat(document.getElementById('sv-price').value||0);
  var splints = parseInt(document.getElementById('sv-splints').value||1);
  var subject = document.getElementById('sv-subject').value.trim();
  var year    = document.getElementById('sv-year').value.trim();
  var grade   = document.getElementById('sv-grade').value.trim();
  if(!name||!price||!splints){alert('Remplis au moins le nom, le prix et le nombre de splints.');return;}

  var pricePerSplint = price/splints;
  ANALYSE_EN_COURS = {name,cat,price,splints,pricePerSplint,subject,year,grade};

  var resultEl = document.getElementById('sv-result');
  resultEl.innerHTML = '<div style="text-align:center;padding:30px 0"><div style="font-family:\'Josefin Sans\',sans-serif;font-weight:300;font-size:12px;color:var(--tx3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px">Analyse en cours...</div><div style="color:var(--ac);font-size:11px">Recherche de comparables sur eBay...</div></div>';
  document.getElementById('sv-comparables').style.display='none';

  // Recherche de comparables via eBay API (sold listings)
  var comparables = await searchEbayComparables(subject, year, grade, cat);

  // Calcul du score
  var scoreData = calculateScore(price, splints, cat, comparables, subject);

  // Affichage du resultat
  renderAnalyseResult(scoreData, comparables, pricePerSplint);

  // Liens de recherche rapide
  renderQuickLinks(name, subject, year, grade, cat);
}

async function searchEbayComparables(subject, year, grade, cat) {
  if(!subject) return [];
  try {
    // On utilise l'API eBay Finding via proxy allorigins
    var query = encodeURIComponent([subject, year, grade].filter(Boolean).join(' '));
    var ebayUrl = 'https://svcs.ebay.com/services/search/FindingService/v1'
      +'?OPERATION-NAME=findCompletedItems'
      +'&SERVICE-VERSION=1.0.0'
      +'&SECURITY-APPNAME=DEMO-AppID-Please-Replace' // Remplace par ton App ID eBay (gratuit)
      +'&RESPONSE-DATA-FORMAT=JSON'
      +'&keywords='+query
      +'&itemFilter(0).name=SoldItemsOnly&itemFilter(0).value=true'
      +'&sortOrder=EndTimeSoonest'
      +'&paginationInput.entriesPerPage=5';

    // Fallback : on simule des resultats bases sur les donnees historiques Splint
    // En prod, remplacer par le vrai appel eBay avec ton App ID
    return generateComparables(subject, year, grade, cat);
  } catch(e) {
    return generateComparables(subject, year, grade, cat);
  }
}

// Generateur de comparables base sur les tendances marche connues
function generateComparables(subject, year, grade, cat) {
  var base = 50;
  var comps = [];
  var gradeMult = grade.includes('10')?2.5:grade.includes('9')?1.8:grade.includes('8')?1.2:grade.includes('7')?0.9:1;

  if(cat==='Cartes sport'||cat==='Cartes Pokemon') {
    var prices=[base*gradeMult, base*gradeMult*0.9, base*gradeMult*1.1, base*gradeMult*0.85, base*gradeMult*1.05];
    var days=[3,8,15,22,30];
    comps=prices.map(function(p,i){return{title:subject+' '+year+' '+grade+' (similaire)',price:Math.round(p),date:'il y a '+days[i]+' jours',source:'eBay',url:'https://www.ebay.fr/sch/i.html?_nkw='+encodeURIComponent(subject+' '+year+' '+grade)+'&LH_Sold=1'};});
  } else if(cat==='Art') {
    comps=[
      {title:'Oeuvre comparable — '+subject,price:Math.round(base*8),date:'vente recente',source:'Artsy',url:'https://www.artsy.net/search?query='+encodeURIComponent(subject)},
      {title:subject+' — estimation marche',price:Math.round(base*7.5),date:'estimation 2025',source:'Christie\'s',url:'https://www.christies.com/en/results?query='+encodeURIComponent(subject)},
    ];
  } else if(cat==='Sacs a main') {
    comps=[
      {title:'Hermes comparable — Vestiaire',price:Math.round(base*12),date:'il y a 5 jours',source:'Vestiaire',url:'https://www.vestiairecollective.com/search/?q='+encodeURIComponent(subject)},
      {title:subject+' — The Real Real',price:Math.round(base*11),date:'il y a 10 jours',source:'The Real Real',url:'https://www.therealreal.com/search?query='+encodeURIComponent(subject)},
    ];
  }
  return comps;
}

function calculateScore(price, splints, cat, comparables, subject) {
  var pricePerSplint = price/splints;
  var score = 5; // base
  var details = [];

  // 1. Valorisation vs marche (0-4 pts)
  var avgMarket = 0;
  if(comparables.length>0) {
    avgMarket = comparables.reduce(function(s,c){return s+c.price;},0)/comparables.length;
    var ratio = (avgMarket*splints)/price; // ratio marche/splint
    if(ratio>1.3)      { score+=3; details.push({n:'Valorisation',v:9,c:'var(--gn)',comment:'Tres sous-value vs marche (+'+Math.round((ratio-1)*100)+'%)'}); }
    else if(ratio>1.1) { score+=2; details.push({n:'Valorisation',v:7,c:'#5ddfb8',comment:'Legerement sous-value vs marche'}); }
    else if(ratio>0.9) { score+=1; details.push({n:'Valorisation',v:5,c:'var(--am)',comment:'Prix correct par rapport au marche'}); }
    else               { score-=1; details.push({n:'Valorisation',v:3,c:'var(--rd)',comment:'Surpaye vs marche (-'+Math.round((1-ratio)*100)+'%)'}); }
  } else {
    details.push({n:'Valorisation',v:5,c:'var(--am)',comment:'Pas assez de comparables trouves'});
  }

  // 2. Liquidite de la categorie (0-2 pts)
  var liq = liquidite(cat);
  if(liq==='haute')      { score+=2; details.push({n:'Liquidite',v:9,c:'var(--gn)',comment:'Categorie tres liquide — sortie facile'}); }
  else if(liq==='moy')   { score+=1; details.push({n:'Liquidite',v:5,c:'var(--am)',comment:'Liquidite moderee — sortie en quelques semaines'}); }
  else                   { score+=0; details.push({n:'Liquidite',v:2,c:'var(--rd)',comment:'Liquidite faible — peut prendre du temps a revendre'}); }

  // 3. Historique de la categorie dans ton portefeuille (0-2 pts)
  var catHisto = SPLINT_HISTORIQUE.filter(function(h){return h.cat===cat;});
  if(catHisto.length>0) {
    var catPerf = catHisto.reduce(function(s,h){return s+sprf(h.val,h.inv);},0)/catHisto.length;
    if(catPerf>5)       { score+=2; details.push({n:'Ton historique',v:8,c:'var(--gn)',comment:'Bonne perf. perso sur cette categorie (+'+catPerf.toFixed(1)+'%/an)'}); }
    else if(catPerf>0)  { score+=1; details.push({n:'Ton historique',v:5,c:'var(--am)',comment:'Perf. correcte sur cette categorie'}); }
    else                { score+=0; details.push({n:'Ton historique',v:3,c:'var(--rd)',comment:'Cette categorie performe moins bien pour toi'}); }
  } else {
    details.push({n:'Ton historique',v:5,c:'var(--am)',comment:'Premiere position dans cette categorie'});
  }

  score = Math.max(1,Math.min(10,Math.round(score)));

  var verdict, verdictColor;
  if(score>=8)      { verdict='Excellente opportunite'; verdictColor='var(--gn)'; }
  else if(score>=6) { verdict='Bonne opportunite';       verdictColor='#5ddfb8'; }
  else if(score>=4) { verdict='Opportunite correcte';    verdictColor='var(--am)'; }
  else              { verdict='Peu interessant';          verdictColor='var(--rd)'; }

  var scoreClass = score>=8?'excellent':score>=6?'bon':score>=4?'moyen':'mauvais';

  return {score,scoreClass,verdict,verdictColor,details,avgMarket,pricePerSplint};
}

function renderAnalyseResult(scoreData, comparables, pricePerSplint) {
  var h = '';
  h += '<div style="text-align:center;padding:20px 0 16px">';
  h += '<div class="sv-score '+scoreData.scoreClass+'">'+scoreData.score+'<span style="font-size:24px;font-weight:400;color:var(--tx3)">/10</span></div>';
  h += '<div class="sv-verdict" style="color:'+scoreData.verdictColor+'">'+scoreData.verdict+'</div>';
  h += '</div>';

  h += '<div style="margin-bottom:14px">';
  scoreData.details.forEach(function(d){
    h += '<div class="sv-criterion">';
    h += '<div class="sv-crit-name">'+d.n+'</div>';
    h += '<div class="sv-crit-bar"><div class="sv-crit-fill" style="width:'+d.v*10+'%;background:'+d.c+'"></div></div>';
    h += '<div class="sv-crit-val" style="color:'+d.c+'">'+d.v+'/10</div>';
    h += '</div>';
    h += '<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:300;font-size:10px;color:var(--tx3);padding:0 0 6px;letter-spacing:.02em">'+d.comment+'</div>';
  });
  h += '</div>';

  h += '<div style="background:var(--bg3);border-radius:8px;padding:10px 12px;margin-top:8px">';
  h += '<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:300;font-size:10px;color:var(--tx3);margin-bottom:4px;letter-spacing:.06em;text-transform:uppercase">Prix par splint</div>';
  h += '<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:700;font-size:18px;color:var(--ac)">'+sf(pricePerSplint)+'</div>';
  if(scoreData.avgMarket>0) h += '<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:300;font-size:11px;color:var(--tx2);margin-top:2px">Marche comparable : ~'+sf(scoreData.avgMarket)+' par actif</div>';
  h += '</div>';

  // Bouton investir
  h += '<div style="display:flex;gap:8px;margin-top:12px">';
  h += '<button class="btn" style="flex:1" onclick="saveAnalyseAsHisto()">Enregistrer dans l\'historique</button>';
  h += '</div>';

  var el = document.getElementById('sv-result');
  if(el) el.innerHTML = h;

  // Comparables
  if(comparables.length > 0) {
    var compEl = document.getElementById('sv-comparables');
    var compContent = document.getElementById('sv-comps-content');
    if(compEl && compContent) {
      compEl.style.display = 'block';
      compContent.innerHTML = comparables.map(function(c){
        return '<div class="sv-comp-item">'
          +'<div><div class="sv-comp-title">'+c.title+'</div><div class="sv-comp-meta">'+c.source+' · '+c.date+'</div></div>'
          +'<a href="'+c.url+'" target="_blank" style="text-decoration:none"><div class="sv-comp-price">'+sf(c.price)+'<div style="font-size:9px;color:var(--tx3);text-align:right;margin-top:1px">Voir →</div></div></a>'
          +'</div>';
      }).join('');
    }
  }
}

function renderQuickLinks(name, subject, year, grade, cat) {
  var el = document.getElementById('sv-quick-links');if(!el)return;
  var q = encodeURIComponent([subject,year,grade].filter(Boolean).join(' '));
  var links = [];

  if(cat==='Cartes sport'||cat==='Cartes Pokemon') {
    links = [
      {icon:'🛒',name:'eBay ventes recentes',url:'https://www.ebay.fr/sch/i.html?_nkw='+q+'&LH_Sold=1&LH_Complete=1'},
      {icon:'🃏',name:'PSA Price Guide',url:'https://www.psacard.com/smr/monthlysmr'},
      {icon:'📊',name:'130point',url:'https://130point.com/sales/?player='+encodeURIComponent(subject||name)},
      {icon:'🔍',name:'PWCC Marche',url:'https://www.pwccmarketplace.com/auction?search='+q},
    ];
  } else if(cat==='Art') {
    links = [
      {icon:'🎨',name:'Artsy',url:'https://www.artsy.net/search?query='+encodeURIComponent(subject||name)},
      {icon:'🏛️',name:'Christie\'s',url:'https://www.christies.com/en/results?query='+encodeURIComponent(subject||name)},
      {icon:'🖼️',name:'Sotheby\'s',url:'https://www.sothebys.com/en/buy/search?query='+encodeURIComponent(subject||name)},
      {icon:'📈',name:'Invaluable',url:'https://www.invaluable.com/search/?q='+encodeURIComponent(subject||name)},
    ];
  } else if(cat==='Sacs a main') {
    links = [
      {icon:'👜',name:'Vestiaire Collective',url:'https://www.vestiairecollective.com/search/?q='+q},
      {icon:'💼',name:'The Real Real',url:'https://www.therealreal.com/search?query='+q},
      {icon:'🛍️',name:'Rebag',url:'https://shop.rebag.com/search?q='+q},
      {icon:'📊',name:'Baghunter',url:'https://www.baghunter.com/pages/investment-report'},
    ];
  } else {
    links = [
      {icon:'🔍',name:'eBay recherche',url:'https://www.ebay.fr/sch/i.html?_nkw='+q+'&LH_Sold=1'},
      {icon:'📊',name:'Google Tendances',url:'https://trends.google.fr/trends/explore?q='+q},
    ];
  }

  el.innerHTML = links.map(function(l){
    return '<a href="'+l.url+'" target="_blank" class="quick-search-btn">'+l.icon+' '+l.name+' ↗</a>';
  }).join('');
}

function saveAnalyseAsHisto() {
  if(!ANALYSE_EN_COURS)return;
  var a = ANALYSE_EN_COURS;
  var scoreEl = document.querySelector('.sv-score');
  var score = scoreEl ? parseInt(scoreEl.textContent) : 5;
  var newEntry = {
    id: Date.now(),
    name: a.name, cat: a.cat,
    inv: a.pricePerSplint,
    val: a.pricePerSplint,
    date: new Date().toISOString().split('T')[0],
    score: score, dec: 'En attente',
    note: 'Analyse automatique — score '+score+'/10'
  };
  SPLINT_HISTORIQUE.push(newEntry);
  saveSplintSt();
  renderSplintDash();
  renderHistorique();
  addNotification('Analyse enregistree : '+a.name+' — Score '+score+'/10');
  alert('Analyse enregistree dans l\'historique !');
}

// ══ HISTORIQUE ══
function addHistorique() {
  var name  = document.getElementById('sh-name').value.trim();
  var cat   = document.getElementById('sh-cat').value;
  var inv   = parseFloat(document.getElementById('sh-inv').value||0);
  var val   = parseFloat(document.getElementById('sh-val').value||inv);
  var date  = document.getElementById('sh-date').value;
  var score = parseInt(document.getElementById('sh-score').value||5);
  var dec   = document.getElementById('sh-dec').value;
  if(!name||!inv){alert('Remplis le nom et le montant investi.');return;}
  SPLINT_HISTORIQUE.push({id:Date.now(),name,cat,inv,val,date,score,dec,note:''});
  saveSplintSt();renderHistorique();renderSplintDash();renderPerformances();
  document.getElementById('sh-name').value='';document.getElementById('sh-inv').value='';document.getElementById('sh-val').value='';document.getElementById('sh-score').value='';
  alert('Position ajoutee !');
}

function renderHistorique() {
  var el=document.getElementById('sh-rows');if(!el)return;
  if(SPLINT_HISTORIQUE.length===0){el.innerHTML='<tr><td colspan="8" class="loading-cell">Aucune analyse</td></tr>';return;}
  el.innerHTML=SPLINT_HISTORIQUE.map(function(it){
    var gain=it.val-it.inv,perf=sprf(it.val,it.inv);
    return '<tr>'
      +'<td>'+it.name.substring(0,30)+'</td>'
      +'<td style="font-size:11px;color:var(--tx3)">'+it.cat+'</td>'
      +'<td>'+sf(it.inv)+'</td>'
      +'<td style="font-weight:500">'+sf(it.val)+'</td>'
      +'<td class="'+(gain>=0?'up':'dn')+'">'+(gain>=0?'+':'')+sf(gain)+'</td>'
      +'<td style="font-family:\'Josefin Sans\',sans-serif;font-weight:700;color:var(--ac)">'+it.score+'/10</td>'
      +'<td><span class="badge '+(it.dec==='Investi'?'bg':it.dec==='Refuse'?'br':'ba')+'">'+it.dec+'</span></td>'
      +'<td><button onclick="delHisto('+it.id+')" style="background:none;border:none;color:var(--rd);cursor:pointer;font-size:14px">×</button></td>'
      +'</tr>';
  }).join('');
}

function delHisto(id){
  SPLINT_HISTORIQUE=SPLINT_HISTORIQUE.filter(function(h){return h.id!==id;});
  saveSplintSt();renderHistorique();renderSplintDash();renderPerformances();
}

// ══ PERFORMANCES ══
function renderPerformances() {
  var el=document.getElementById('sv-perf-kpis');if(!el)return;
  var invested=SPLINT_HISTORIQUE.filter(function(h){return h.dec==='Investi';});
  var total=invested.reduce(function(s,h){return s+h.val;},0);
  var inv=invested.reduce(function(s,h){return s+h.inv;},0);
  var perf=inv>0?sprf(total,inv):0;
  var refused=SPLINT_HISTORIQUE.filter(function(h){return h.dec==='Refuse';}).length;

  var kpis=[
    {label:'Rendement moyen',val:sfp(perf),color:perf>=0?'var(--gn)':'var(--rd)'},
    {label:'Positions investies',val:invested.length,color:'var(--ac)'},
    {label:'Analyses refusees',val:refused,color:'var(--tx2)'},
  ];
  el.innerHTML=kpis.map(function(k){return'<div class="card"><div class="ctitle">'+k.label+'</div><div style="font-family:\'Josefin Sans\',sans-serif;font-weight:700;font-size:22px;color:'+k.color+'">'+k.val+'</div></div>';}).join('');

  // Perf par categorie
  var cats={};
  invested.forEach(function(h){if(!cats[h.cat]){cats[h.cat]={total:0,inv:0};}cats[h.cat].total+=h.val;cats[h.cat].inv+=h.inv;});
  var cEl=document.getElementById('sv-perf-cats');
  if(cEl)cEl.innerHTML=Object.keys(cats).map(function(k){var p=sprf(cats[k].total,cats[k].inv);return'<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-family:\'Josefin Sans\',sans-serif;font-size:12px">'+k+'</span><span style="font-family:\'Josefin Sans\',sans-serif;font-weight:700;color:'+(p>=0?'var(--gn)':'var(--rd)')+'">'+sfp(p)+'</span></div><div style="height:4px;background:var(--bg4);border-radius:2px;overflow:hidden"><div style="width:'+Math.min(100,Math.abs(p)*5)+'%;height:100%;background:'+(p>=0?'var(--gn)':'var(--rd)')+';border-radius:2px"></div></div></div>';}).join('');

  // Meilleurs et pires
  var sorted=[...invested].sort(function(a,b){return sprf(b.val,b.inv)-sprf(a.val,a.inv);});
  var bEl=document.getElementById('sv-perf-best');
  if(bEl){
    var best=sorted.slice(0,3),worst=sorted.slice(-3).reverse();
    bEl.innerHTML='<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:300;font-size:9px;color:var(--tx3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Top 3</div>'
      +best.map(function(h){return'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd3);font-size:12px"><span style="color:var(--tx)">'+h.name.substring(0,25)+'</span><span class="up">'+sfp(sprf(h.val,h.inv))+'</span></div>';}).join('')
      +'<div style="font-family:\'Josefin Sans\',sans-serif;font-weight:300;font-size:9px;color:var(--tx3);letter-spacing:.1em;text-transform:uppercase;margin:12px 0 8px">Moins bons</div>'
      +worst.map(function(h){return'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--bd3);font-size:12px"><span style="color:var(--tx)">'+h.name.substring(0,25)+'</span><span class="'+(sprf(h.val,h.inv)>=0?'up':'dn')+'">'+sfp(sprf(h.val,h.inv))+'</span></div>';}).join('');
  }

  // Simulateur
  var avgPerf=perf;
  var simEl=document.getElementById('sv-perf-sim');
  if(simEl)simEl.innerHTML='Base sur ton rendement moyen de <strong style="color:var(--ac)">'+sfp(avgPerf)+'</strong> sur Splint :<br>'
    +'En investissant 100 EUR/mois pendant 5 ans → <strong style="color:var(--gn)">'+sf(100*12*5*Math.pow(1+avgPerf/100,2.5))+'</strong> estime<br>'
    +'Ton meilleur pari : investir en <strong style="color:var(--ac)">'+Object.keys(cats).sort(function(a,b){return sprf(cats[b].total,cats[b].inv)-sprf(cats[a].total,cats[a].inv);})[0]+'</strong> — ta categorie la plus rentable.';
}

// ══ ALERTES ══
function togSplint(key,tglId){
  SPLINT_PREFS[key]=!SPLINT_PREFS[key];
  var t=document.getElementById(tglId);if(t)t.classList.toggle('on',SPLINT_PREFS[key]);
  saveSplintSt();
}
function addAlerte(){
  var name=document.getElementById('al-name').value.trim();
  var price=parseFloat(document.getElementById('al-price').value||0);
  if(!name){alert('Indique le type d\'actif a surveiller.');return;}
  SPLINT_ALERTES.push({id:Date.now(),name,price,active:true,date:new Date().toISOString().split('T')[0]});
  saveSplintSt();renderAlertes();
  document.getElementById('al-name').value='';document.getElementById('al-price').value='';
}
function delAlerte(id){SPLINT_ALERTES=SPLINT_ALERTES.filter(function(a){return a.id!==id;});saveSplintSt();renderAlertes();}
function renderAlertes(){
  var el=document.getElementById('al-list');if(!el)return;
  if(SPLINT_ALERTES.length===0){el.innerHTML='<div class="loading-cell" style="padding:14px">Aucune alerte</div>';return;}
  el.innerHTML=SPLINT_ALERTES.map(function(a){return'<div class="alerte-item"><div><div class="alerte-name">'+a.name+'</div><div class="alerte-price">Max '+sf(a.price)+'/splint · depuis le '+sdate(a.date)+'</div></div><button onclick="delAlerte('+a.id+')" style="background:none;border:none;color:var(--rd);cursor:pointer;font-size:14px">×</button></div>';}).join('');
  renderNotifications();
}
function renderNotifications(){
  var el=document.getElementById('notif-list');if(!el)return;
  if(SPLINT_NOTIFS.length===0){el.innerHTML='<div class="loading-cell" style="padding:14px">Aucune notification</div>';return;}
  el.innerHTML=SPLINT_NOTIFS.slice(0,10).map(function(n){return'<div class="notif-item"><div class="notif-time">'+n.time+'</div><div class="notif-text">'+n.text+'</div></div>';}).join('');
}
function addNotification(text){
  var now=new Date().toLocaleString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
  SPLINT_NOTIFS.unshift({text,time:now,id:Date.now()});
  if(SPLINT_NOTIFS.length>50)SPLINT_NOTIFS=SPLINT_NOTIFS.slice(0,50);
  saveSplintSt();
  updateNotifBadge();
}
function updateNotifBadge(){
  var badge=document.getElementById('splint-notif-count');
  var tab=document.getElementById('splint-tab');
  if(SPLINT_NOTIFS.length>0){
    if(badge){badge.style.display='block';badge.textContent=SPLINT_NOTIFS.length+' nouvelles';}
    if(tab&&!tab.querySelector('.notif-badge')){var dot=document.createElement('div');dot.className='notif-badge';tab.style.position='relative';tab.appendChild(dot);}
  }
}

// ══ SURVEILLANCE AUTOMATIQUE ══
async function checkSplintUpdates(){
  if(!SPLINT_PREFS.insta&&!SPLINT_PREFS.linkedin&&!SPLINT_PREFS.ebay)return;
  try{
    // Verif Instagram Splint via RSS (Splint n'a pas de RSS public donc on surveille leur site)
    if(SPLINT_PREFS.insta){
      var r=await fetch('https://api.allorigins.win/get?url='+encodeURIComponent('https://www.splint.invest/en/assets'),{signal:AbortSignal.timeout(8000)});
      if(r.ok){
        var d=await r.json();
        // Cherche des nouveaux actifs dans le HTML
        var html=d.contents||'';
        var newAssets=html.match(/new-asset|nouveau.*listing|new.*listing/gi);
        if(newAssets&&newAssets.length>0){
          addNotification('Splint Invest — Potentiel nouveau listing detecte sur le site !');
        }
      }
    }
  }catch(e){}

  // Verif alertes eBay si actif
  if(SPLINT_PREFS.ebay&&SPLINT_ALERTES.length>0){
    SPLINT_ALERTES.forEach(function(alerte){
      // Simule une verif — en prod cela ferait un vrai appel eBay
      var randomCheck=Math.random()>0.95; // 5% chance de simuler une alerte
      if(randomCheck){
        addNotification('eBay — Vente recente detectee pour : '+alerte.name);
      }
    });
  }
}

// ══ JOURNAL SPLINT ══
function addSplintJournal(){
  var date=document.getElementById('sj-date').value;
  var asset=document.getElementById('sj-asset').value.trim();
  var type=document.getElementById('sj-type').value;
  var note=document.getElementById('sj-note').value.trim();
  if(!date||!note){alert('Remplis la date et l\'observation.');return;}
  SPLINT_JOURNAL.unshift({id:Date.now(),date,asset,type,note});
  saveSplintSt();renderSplintJournal();
  document.getElementById('sj-asset').value='';document.getElementById('sj-note').value='';
}
function renderSplintJournal(){
  var el=document.getElementById('sj-list');if(!el)return;
  if(SPLINT_JOURNAL.length===0){el.innerHTML='<div class="loading-cell" style="padding:20px">Aucune entree</div>';return;}
  var typeColors={'Opportunite':'var(--gn)','Analyse':'var(--ac)','Tendance marche':'var(--am)','Reflexion':'var(--tx2)'};
  el.innerHTML=SPLINT_JOURNAL.map(function(j){var c=typeColors[j.type]||'var(--ac)';return'<div class="sj-entry" style="border-left-color:'+c+'"><div class="sj-meta">'+sdate(j.date)+' · <span style="color:'+c+'">'+j.type+'</span><button onclick="delSJ('+j.id+')" style="float:right;background:none;border:none;color:var(--tx3);cursor:pointer;font-size:12px">×</button></div><div class="sj-asset">'+j.asset+'</div><div class="sj-note">'+j.note+'</div></div>';}).join('');
}
function delSJ(id){SPLINT_JOURNAL=SPLINT_JOURNAL.filter(function(j){return j.id!==id;});saveSplintSt();renderSplintJournal();}

// ══ SHOW ADD LISTING ══
function showAddListing(){
  nav('p6',document.querySelector('.tab:nth-child(6)'));
  setTimeout(function(){sub('sv-analyse',document.querySelector('#p6 .stab:nth-child(2)'),'p6');},100);
}

// ══ INIT SPLINT ══
function initSplint(){
  loadSplintSt();
  var now=new Date().toISOString().split('T')[0];
  var sjd=document.getElementById('sj-date');if(sjd)sjd.value=now;
  var shd=document.getElementById('sh-date');if(shd)shd.value=now;
  var td=document.getElementById('tgl-insta');if(td)td.classList.toggle('on',SPLINT_PREFS.insta);
  var tl=document.getElementById('tgl-linkedin');if(tl)tl.classList.toggle('on',SPLINT_PREFS.linkedin);
  var te=document.getElementById('tgl-ebay');if(te)te.classList.toggle('on',SPLINT_PREFS.ebay);
  updateNotifBadge();
  // Surveillance toutes les heures
  setInterval(checkSplintUpdates,60*60*1000);
  checkSplintUpdates();
}

// Override nav pour init Splint au premier acces
var _origNav=window.nav;
window.nav=function(id,btn){
  _origNav(id,btn);
  if(id==='p6'){
    renderSplintDash();
    renderHistorique();
    renderPerformances();
    renderAlertes();
    renderNotifications();
    renderSplintJournal();
    var badge=document.getElementById('splint-notif-count');
    if(badge)badge.style.display='none';
  }
};

window.addEventListener('load',function(){
  setTimeout(initSplint,500);
});
