'use strict';

// Texts of the app page, English and German. The page follows the browser language.
const TEXT = {
  en: {
    recheck: 'Check again',
    rechecking: 'Checking…',
    copy: 'Copy',
    copied: 'Copied',
    starting: 'The app is starting. This page updates in a moment…',
    checkedAt: 'Last checked {0}',
    preRelease: 'Pre-release {0}',
    problems: 'Needs attention',
    connection: 'Gitea connection',
    noGitea: 'No Gitea configured',
    noGiteaDetail: 'Install the Gitea app, or enter the address of your Gitea in the app configuration.',
    giteaOk: 'Gitea {0} is reachable',
    giteaApp: '{0} (found the Gitea app automatically)',
    giteaUrl: '{0} (address from the app configuration)',
    giteaBad: 'Gitea does not answer',
    tokenOk: 'Signed in as {0}',
    tokenOkDetail: 'The access token works.',
    tokenNone: 'No access token yet',
    tokenNoneDetail: 'Only public data can be read. Create a token in Gitea under Settings → Applications and enter it as “Access token” in the app configuration.',
    tokenBad: 'The access token does not work',
    readOnly: 'Read-only',
    readOnlyDetail: 'Tools that change something are switched off.',
    readWrite: 'Read and write',
    readWriteDetail: 'Tools can create and change issues, files and more. Give the token only the permissions you want to allow.',
    allToolsets: 'All toolsets',
    someToolsets: 'Toolsets: {0}',
    toolsetsDetail: 'A short list keeps the tool list small, which helps voice assistants.',
    homeAssistant: 'Home Assistant',
    haIntro: 'Add the “Model Context Protocol” integration and enter this address. Then select it as tool provider in your Assist conversation agent.',
    mcpAddress: 'MCP address',
    addIntegration: 'Add integration',
    remote: 'claude.ai and ChatGPT',
    remoteOff: 'Not set up. Both services reach your MCP server over the internet and sign in to Gitea with OAuth. To enable it, enter the public HTTPS addresses under “Remote access” in the app configuration and restart the app. The documentation shows how to publish the app with a tunnel.',
    openConfig: 'Open app configuration',
    checkMcp: 'The public MCP address answers',
    checkGitea: 'The public Gitea address answers',
    checkHint: 'These checks run from inside your network. A failed check can still work from outside when your router does not loop requests back.',
    step1: '1. Create an OAuth application in Gitea',
    step1Text: 'Open {0}, create an OAuth2 application with the values below and leave “Confidential Client” unchecked. Then copy its client ID.',
    appName: 'Application name',
    redirectUris: 'Redirect URIs (one per line)',
    step2: '2. Connect claude.ai',
    step2Text: 'In claude.ai open Settings → Connectors → Add custom connector. Paste the address, open the advanced settings and enter the client ID.',
    step3: '3. Connect ChatGPT',
    step3Text: 'With developer mode switched on, create a connector with OAuth, the same address and the client ID. ChatGPT shows a callback address of its own: add it as one more redirect URI to the Gitea application.',
  },
  de: {
    recheck: 'Erneut prüfen',
    rechecking: 'Prüfe…',
    copy: 'Kopieren',
    copied: 'Kopiert',
    starting: 'Die App startet. Diese Seite aktualisiert sich gleich…',
    checkedAt: 'Zuletzt geprüft {0}',
    preRelease: 'Vorabversion {0}',
    problems: 'Das braucht Aufmerksamkeit',
    connection: 'Verbindung zu Gitea',
    noGitea: 'Kein Gitea eingerichtet',
    noGiteaDetail: 'Installiere die Gitea-App oder trage die Adresse deines Gitea in der App-Konfiguration ein.',
    giteaOk: 'Gitea {0} ist erreichbar',
    giteaApp: '{0} (Gitea-App automatisch gefunden)',
    giteaUrl: '{0} (Adresse aus der App-Konfiguration)',
    giteaBad: 'Gitea antwortet nicht',
    tokenOk: 'Angemeldet als {0}',
    tokenOkDetail: 'Der Zugriffstoken funktioniert.',
    tokenNone: 'Noch kein Zugriffstoken',
    tokenNoneDetail: 'Es sind nur öffentliche Daten lesbar. Erstelle in Gitea unter Einstellungen → Anwendungen einen Token und trage ihn in der App-Konfiguration als „Zugriffstoken“ ein.',
    tokenBad: 'Der Zugriffstoken funktioniert nicht',
    readOnly: 'Nur lesen',
    readOnlyDetail: 'Werkzeuge, die etwas ändern, sind abgeschaltet.',
    readWrite: 'Lesen und schreiben',
    readWriteDetail: 'Werkzeuge können Issues, Dateien und mehr anlegen und ändern. Gib dem Token nur die Rechte, die du erlauben willst.',
    allToolsets: 'Alle Werkzeuggruppen',
    someToolsets: 'Werkzeuggruppen: {0}',
    toolsetsDetail: 'Eine kurze Auswahl hält die Werkzeugliste klein, das hilft Sprachassistenten.',
    homeAssistant: 'Home Assistant',
    haIntro: 'Füge die Integration „Model Context Protocol“ hinzu und trage diese Adresse ein. Wähle sie danach im Assist-Konversationsagenten als Werkzeuganbieter aus.',
    mcpAddress: 'MCP-Adresse',
    addIntegration: 'Integration hinzufügen',
    remote: 'claude.ai und ChatGPT',
    remoteOff: 'Nicht eingerichtet. Beide Dienste erreichen deinen MCP-Server über das Internet und melden sich per OAuth bei Gitea an. Zum Aktivieren trägst du die öffentlichen HTTPS-Adressen unter „Fernzugriff“ in der App-Konfiguration ein und startest die App neu. Die Dokumentation zeigt, wie du die App mit einem Tunnel veröffentlichst.',
    openConfig: 'App-Konfiguration öffnen',
    checkMcp: 'Die öffentliche MCP-Adresse antwortet',
    checkGitea: 'Die öffentliche Gitea-Adresse antwortet',
    checkHint: 'Diese Prüfungen laufen innerhalb deines Netzwerks. Eine fehlgeschlagene Prüfung kann von außen trotzdem funktionieren, wenn dein Router Anfragen nicht zurückleitet.',
    step1: '1. OAuth-Anwendung in Gitea anlegen',
    step1Text: 'Öffne {0}, lege eine OAuth2-Anwendung mit den Werten unten an und lass „Vertraulicher Client“ abgewählt. Kopiere danach die Client-ID.',
    appName: 'Anwendungsname',
    redirectUris: 'Weiterleitungs-URIs (eine pro Zeile)',
    step2: '2. claude.ai verbinden',
    step2Text: 'Öffne in claude.ai Einstellungen → Konnektoren → Benutzerdefinierten Konnektor hinzufügen. Füge die Adresse ein, öffne die erweiterten Einstellungen und trage die Client-ID ein.',
    step3: '3. ChatGPT verbinden',
    step3Text: 'Lege bei eingeschaltetem Entwicklermodus einen Konnektor mit OAuth, derselben Adresse und der Client-ID an. ChatGPT zeigt eine eigene Callback-Adresse: Füge sie der Gitea-Anwendung als weitere Weiterleitungs-URI hinzu.',
  },
};

const language = (navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';

function t(key, ...values) {
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), TEXT[language][key]);
}

// el(tag, properties, ...children): a small helper that builds DOM nodes without parsing HTML,
// so values from the status file can never be interpreted as markup.
function el(tag, properties = {}, ...children) {
  const node = document.createElement(tag);
  Object.assign(node, properties);
  node.append(...children.flat().filter((child) => child !== null && child !== undefined && child !== false));
  return node;
}

function row(state, title, detail) {
  const icon = { ok: '✓', warn: '!', bad: '✗' }[state];
  return el('div', { className: `row ${state}` },
    el('span', { className: 'icon' }, icon),
    el('div', {}, el('div', { className: 'title' }, title), detail && el('div', { className: 'detail' }, detail)));
}

function copyButton(source) {
  const button = el('button', { type: 'button' }, t('copy'));
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(source.value);
    } catch {
      // Ingress frames may not use the clipboard API; selecting and copying still works.
      source.select();
      document.execCommand('copy');
    }
    button.textContent = t('copied');
    setTimeout(() => { button.textContent = t('copy'); }, 1500);
  });
  return button;
}

function field(label, value, rows = 0) {
  const input = rows
    ? el('textarea', { readOnly: true, rows, value })
    : el('input', { readOnly: true, value });
  return el('div', { className: 'field' }, el('label', {}, label), el('div', { className: 'line' }, input, copyButton(input)));
}

function link(href, text, primary) {
  return el('a', { href, target: '_blank', rel: 'noopener', className: primary ? 'button primary' : '' }, text);
}

function renderProblems(status) {
  const banner = document.getElementById('problems');
  banner.hidden = status.problems.length === 0;
  banner.replaceChildren(el('h2', {}, t('problems')), ...status.problems.map((problem) => el('p', {}, problem)));
}

function giteaRows(status) {
  const gitea = status.local.gitea;
  if (!status.local.url) return [row('bad', t('noGitea'), t('noGiteaDetail'))];

  const source = status.local.source.startsWith('app:') ? 'giteaApp' : 'giteaUrl';
  const rows = [gitea.reachable
    ? row('ok', t('giteaOk', gitea.version || ''), t(source, status.local.url))
    : row('bad', t('giteaBad'), `${status.local.url}: ${gitea.error}`)];

  if (gitea.token.state === 'ok') rows.push(row('ok', t('tokenOk', gitea.token.login), t('tokenOkDetail')));
  else if (gitea.token.state === 'none') rows.push(row('warn', t('tokenNone'), t('tokenNoneDetail')));
  else rows.push(row('bad', t('tokenBad'), gitea.token.error));
  return rows;
}

function accessRows(status) {
  const toolsets = status.toolsets.length ? t('someToolsets', status.toolsets.join(', ')) : t('allToolsets');
  return [
    status.read_only
      ? row('ok', t('readOnly'), t('readOnlyDetail'))
      : row('warn', t('readWrite'), t('readWriteDetail')),
    row('ok', toolsets, status.toolsets.length ? null : t('toolsetsDetail')),
  ];
}

function renderConnection(status) {
  const rows = status.local.url ? [...giteaRows(status), ...accessRows(status)] : giteaRows(status);
  document.getElementById('connection').replaceChildren(el('h2', {}, t('connection')), ...rows);
}

function renderHomeAssistant(status) {
  const card = document.getElementById('homeassistant');
  card.hidden = !status.local.mcp_url;
  card.replaceChildren(
    el('h2', {}, t('homeAssistant')),
    el('p', {}, t('haIntro')),
    field(t('mcpAddress'), status.local.mcp_url),
    link('https://my.home-assistant.io/redirect/config_flow_start/?domain=mcp', t('addIntegration'), true));
}

function renderRemote(status) {
  const card = document.getElementById('remote');
  const remote = status.remote;
  if (!remote.public_url) {
    card.replaceChildren(
      el('h2', {}, t('remote')),
      el('p', {}, t('remoteOff')),
      link('https://my.home-assistant.io/redirect/supervisor_addon/?addon=gitea_mcp_server', t('openConfig')));
    return;
  }

  const checks = remote.checks;
  card.replaceChildren(
    el('h2', {}, t('remote')),
    checks && row(checks.mcp.ok ? 'ok' : 'bad', t('checkMcp'), checks.mcp.error),
    checks && row(checks.gitea.ok ? 'ok' : 'bad', t('checkGitea'), checks.gitea.error),
    el('p', { className: 'muted' }, t('checkHint')),
    el('h3', {}, t('step1')),
    el('p', {}, t('step1Text', `${remote.gitea_url}/user/settings/applications`)),
    field(t('appName'), 'Claude and ChatGPT'),
    field(t('redirectUris'), remote.redirect_uris.join('\n'), remote.redirect_uris.length),
    el('h3', {}, t('step2')),
    el('p', {}, t('step2Text')),
    field(t('mcpAddress'), remote.mcp_url),
    el('h3', {}, t('step3')),
    el('p', {}, t('step3Text')));
}

function render(status) {
  const release = document.getElementById('release');
  const prerelease = status.app.version.includes('-') ? status.app.version.split('-').slice(1).join('-') : '';
  release.hidden = !prerelease;
  release.textContent = t('preRelease', prerelease);
  document.getElementById('checked').textContent = t('checkedAt', new Date(status.checked_at).toLocaleString());
  renderProblems(status);
  renderConnection(status);
  renderHomeAssistant(status);
  renderRemote(status);
}

async function load(attempt = 0) {
  const reply = await fetch('status.json', { cache: 'no-store' });
  if (reply.ok) return render(await reply.json());
  // The start script writes the status a moment after the page server is up.
  document.getElementById('checked').textContent = t('starting');
  if (attempt < 30) setTimeout(() => load(attempt + 1), 2000);
}

async function recheck() {
  const button = document.getElementById('recheck');
  button.disabled = true;
  button.textContent = t('rechecking');
  try {
    const reply = await fetch('cgi-bin/recheck', { method: 'POST' });
    if (reply.ok) render(await reply.json());
  } finally {
    button.disabled = false;
    button.textContent = t('recheck');
  }
}

document.getElementById('recheck').textContent = t('recheck');
document.getElementById('recheck').addEventListener('click', recheck);
document.title = 'Gitea MCP Server';
load();
