// ══════════════════════════════════════════════════════
// NEWS.JS — Actualites & Calendrier economique
// ══════════════════════════════════════════════════════

var NEWS_LOADED = false;

// Flux RSS via allorigins proxy
var RSS_FEEDS = [
  { url: 'https://feeds.reuters.com/reuters/businessNews', name: 'Reuters', color: '#ff7c5d' },
  { url: 'https://finance.yahoo.com/news/rssindex', name: 'Yahoo Finance', color: '#7c6fff' },
  { url: 'https://www.lefigaro.fr/rss/figaro_economie.xml', name: 'Le Figaro', color: '#5ddfb8' },
];

// Calendrier économique fixe (mis a jour manuellement ou via API)
var ECO_CALENDAR = [
  { date: '19 mars', event: 'Decision taux Fed', impact: 'fort', color: '#f87171' },
  { date: '21 mars', event: 'PMI Zone Euro flash', impact: 'moyen', color: '#ffd166' },
  { date: '25 mars', event: 'PIB US Q4 final', impact: 'fort', color: '#f87171' },
  { date: '28 mars', event: 'Inflation France (CPI)', impact: 'faible', color: '#4ade80' },
  { date: '3 avr.', event: 'Reunion BCE', impact: 'fort', color: '#f87171' },
  { date: '4 avr.', event: 'Emploi US (NFP)', impact: 'fort', color: '#f87171' },
  { date: '10 avr.', event: 'Inflation US (CPI)', impact: 'moyen', color: '#ffd166' },
  { date: '16 avr.', event: 'Ventes detail US', impact: 'faible', color: '#4ade80' },
  { date: '24 avr.', event: 'PMI Zone Euro', impact: 'moyen', color: '#ffd166' },
  { date: '7 mai', event: 'Decision Fed', impact: 'fort', color: '#f87171' },
];

async function fetchRSS(feed) {
  try {
    var proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(feed.url);
    var r = await fetch(proxy, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error();
    var data = await r.json();
    var parser = new DOMParser();
    var xml = parser.parseFromString(data.contents, 'text/xml');
    var items = xml.querySelectorAll('item');
    var articles = [];
    items.forEach(function(item, i) {
      if (i >= 4) return;
      var title = item.querySelector('title');
      var desc  = item.querySelector('description');
      var link  = item.querySelector('link');
      var pub   = item.querySelector('pubDate');
      if (title) {
        articles.push({
          title: title.textContent.trim(),
          desc:  desc  ? desc.textContent.replace(/<[^>]*>/g,'').trim().substring(0,120)+'...' : '',
          link:  link  ? link.textContent.trim() : '#',
          pub:   pub   ? timeAgo(new Date(pub.textContent)) : '',
          source: feed.name,
          color: feed.color,
        });
      }
    });
    return articles;
  } catch(e) {
    return [];
  }
}

function timeAgo(date) {
  var now = new Date();
  var diff = Math.floor((now - date) / 1000 / 60);
  if (diff < 60) return 'il y a ' + diff + ' min';
  if (diff < 1440) return 'il y a ' + Math.floor(diff/60) + 'h';
  return 'il y a ' + Math.floor(diff/1440) + 'j';
}

// Mots-cles lies au portefeuille pour filtrer les articles pertinents
var KEYWORDS = ['ETF', 'MSCI', 'marche', 'bourse', 'taux', 'Fed', 'BCE', 'inflation', 'crypto', 'bitcoin', 'emergent', 'defense', 'europe', 'nasdaq', 'CAC', 'S&P', 'action'];

function isRelevant(article) {
  var text = (article.title + ' ' + article.desc).toLowerCase();
  return KEYWORDS.some(function(kw) { return text.includes(kw.toLowerCase()); });
}

async function loadNews() {
  if (NEWS_LOADED) return;

  // Calendrier economique
  var calEl = document.getElementById('eco-calendar');
  if (calEl) {
    calEl.innerHTML = ECO_CALENDAR.map(function(ev) {
      var impactBadge = ev.impact === 'fort'
        ? '<span class="badge br">Impact fort</span>'
        : ev.impact === 'moyen'
        ? '<span class="badge ba">Moyen</span>'
        : '<span class="badge bg">Faible</span>';
      return '<div class="cal-item">'
        + '<div class="cal-date">' + ev.date + '</div>'
        + '<div class="cal-impact" style="background:' + ev.color + '"></div>'
        + '<div class="cal-event">' + ev.event + ' ' + impactBadge + '</div>'
        + '</div>';
    }).join('');
  }

  // Flux RSS
  var feedEl = document.getElementById('news-feed');
  if (feedEl) {
    feedEl.innerHTML = '<div class="loading-cell" style="padding:20px">Chargement des articles...</div>';
  }

  // Fetch tous les feeds en parallele
  var allArticles = [];
  await Promise.all(RSS_FEEDS.map(async function(feed) {
    var articles = await fetchRSS(feed);
    allArticles = allArticles.concat(articles);
  }));

  // Filtrer et trier par pertinence
  var relevant = allArticles.filter(isRelevant);
  var others   = allArticles.filter(function(a) { return !isRelevant(a); });
  var sorted   = relevant.concat(others).slice(0, 12);

  if (feedEl) {
    if (sorted.length === 0) {
      feedEl.innerHTML = '<div class="ibox">Impossible de charger les actualites. Verifie ta connexion ou utilise les liens directs ci-dessous.</div>';
    } else {
      feedEl.innerHTML = sorted.map(function(a) {
        return '<div class="news-item">'
          + '<div class="news-src"><div class="news-src-dot" style="background:' + a.color + '"></div>'
          + a.source + (a.pub ? ' · ' + a.pub : '') + '</div>'
          + '<a href="' + a.link + '" target="_blank" class="news-title">' + a.title + '</a>'
          + (a.desc ? '<div class="news-desc">' + a.desc + '</div>' : '')
          + '</div>';
      }).join('');
    }
  }

  NEWS_LOADED = true;

  // Rafraichissement toutes les heures
  setTimeout(function() { NEWS_LOADED = false; }, 60 * 60 * 1000);
}
