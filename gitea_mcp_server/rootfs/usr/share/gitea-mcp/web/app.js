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
    checkAgent: 'Requests from Claude’s servers reach this app',
    checkGitea: 'The public Gitea address answers',
    checkOauth: 'Gitea’s sign-in is reachable from the internet',
    checkHint: 'These checks run from inside your network. A failed check can still work from outside when your router does not loop requests back.',
    step1: '1. Create an OAuth application in Gitea',
    step1Text: 'Open {0}, create an OAuth2 application with the values below and leave “Confidential Client” unchecked. Then copy its client ID.',
    appName: 'Application name',
    redirectUris: 'Redirect URIs (one per line)',
    step2: '2. Connect claude.ai',
    step2Text: 'In claude.ai open Settings → Connectors → Add custom connector. Paste the address, open the advanced settings and enter the client ID.',
    step3: '3. Connect ChatGPT',
    step3Text: 'With developer mode switched on, create a connector with OAuth, the same address and the client ID. ChatGPT shows a callback address of its own: add it as one more redirect URI to the Gitea application.',
    reason_host_unknown: 'the host name is unknown',
    reason_refused: 'the connection was refused (is the app started?)',
    reason_timeout: 'the request timed out',
    reason_tls: 'the TLS certificate is not trusted (see the advanced options)',
    reason_failed: 'the connection failed (curl error {rc})',
    who_cloudflare: 'Cloudflare',
    who_proxy: 'Something in front of it',
    how_cut_off: 'cut off ({reason})',
    how_refused: 'refused with HTTP {http}',
    m_no_answer: 'The address does not answer: {reason}.',
    m_blocked: '{who} refuses the request (HTTP {http}). Claude and ChatGPT would be refused the same way: check bot and AI-crawler protection, firewall rules and access policies for this host.',
    m_wrong_target: 'The public address answers, but not with this app (HTTP {http}). Point the tunnel or proxy at port {port} of this app.',
    m_http_status: 'The public Gitea address answers with HTTP {http}.',
    m_login_required: 'Gitea requires a login for everything; add an access token.',
    m_login_required_note: 'Gitea asks for a sign-in before it shows anything. That is fine for the sign-in of Claude and ChatGPT.',
    m_not_gitea: '{url} answers, but it does not look like Gitea (HTTP {http}). Check the address.',
    m_token_rejected: 'Gitea does not accept this access token.',
    m_token_http: 'The token could not be checked (HTTP {http}).',
    m_token_unreachable: 'The token could not be checked because Gitea is not reachable.',
    m_agent_blocked: 'Requests that identify as Claude (User-Agent Claude-User) are {how}, while an ordinary request reaches the app. Bot protection in front of it does this, for example Cloudflare’s blocking of AI crawlers. This test comes from your own network, so it is a hint and not proof: a service may treat a request that only claims to be Claude differently from Claude’s real servers. The security log of your firewall shows what the real requests (from 160.79.104.0/21) got.',
    m_agent_http: 'Requests from Claude get HTTP {http} instead of the sign-in challenge of this app.',
    m_root_url: 'Gitea announces its sign-in at {endpoint}. Set ROOT_URL in Gitea to {public}/ so that Claude and ChatGPT are sent to the public address.',
    m_oauth_http: 'The sign-in address of Gitea answers with HTTP {http}.',
    m_oauth_no_discovery: 'Gitea does not publish its sign-in addresses (HTTP {http}).',
    m_no_gitea: 'No Gitea was found. Install the Gitea app, or enter the address of your Gitea in “Gitea address”.',
    m_bad_gitea_url: 'The Gitea address “{url}” is not a web address. Use the form http://homeassistant.local:3000.',
    m_bad_public_url: 'The public MCP address “{url}” must look like https://mcp.example.com (HTTPS, no path).',
    m_need_gitea_public: 'Remote access needs the public address of your Gitea under “Public Gitea address”.',
    m_bad_gitea_public: 'The public Gitea address “{url}” is not a web address.',
    m_ca_missing: 'The certificate file “{name}” was not found in the /ssl folder.',
    step4: '4. Connect Claude Code (optional)',
    step4Text: 'Claude Code signs in through a small web server on your own computer. Gitea only accepts that return address with its exact port, so the port is fixed. The address with “localhost” is in the list of redirect URIs above. Replace the client ID in the command.',
    claudeCodeCommand: 'Command for your terminal',
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
    checkAgent: 'Anfragen von Claudes Servern erreichen diese App',
    checkGitea: 'Die öffentliche Gitea-Adresse antwortet',
    checkOauth: 'Die Anmeldung von Gitea ist aus dem Internet erreichbar',
    checkHint: 'Diese Prüfungen laufen innerhalb deines Netzwerks. Eine fehlgeschlagene Prüfung kann von außen trotzdem funktionieren, wenn dein Router Anfragen nicht zurückleitet.',
    step1: '1. OAuth-Anwendung in Gitea anlegen',
    step1Text: 'Öffne {0}, lege eine OAuth2-Anwendung mit den Werten unten an und lass „Vertraulicher Client“ abgewählt. Kopiere danach die Client-ID.',
    appName: 'Anwendungsname',
    redirectUris: 'Weiterleitungs-URIs (eine pro Zeile)',
    step2: '2. claude.ai verbinden',
    step2Text: 'Öffne in claude.ai Einstellungen → Konnektoren → Benutzerdefinierten Konnektor hinzufügen. Füge die Adresse ein, öffne die erweiterten Einstellungen und trage die Client-ID ein.',
    step3: '3. ChatGPT verbinden',
    step3Text: 'Lege bei eingeschaltetem Entwicklermodus einen Konnektor mit OAuth, derselben Adresse und der Client-ID an. ChatGPT zeigt eine eigene Callback-Adresse: Füge sie der Gitea-Anwendung als weitere Weiterleitungs-URI hinzu.',
    reason_host_unknown: 'der Hostname ist unbekannt',
    reason_refused: 'die Verbindung wurde abgelehnt (läuft die App?)',
    reason_timeout: 'die Anfrage hat das Zeitlimit überschritten',
    reason_tls: 'dem TLS-Zertifikat wird nicht vertraut (siehe Erweitert)',
    reason_failed: 'die Verbindung ist fehlgeschlagen (curl-Fehler {rc})',
    who_cloudflare: 'Cloudflare',
    who_proxy: 'Etwas davor',
    how_cut_off: 'abgebrochen ({reason})',
    how_refused: 'mit HTTP {http} abgewiesen',
    m_no_answer: 'Die Adresse antwortet nicht: {reason}.',
    m_blocked: '{who} weist die Anfrage ab (HTTP {http}). Claude und ChatGPT würden genauso abgewiesen: Prüfe Bot- und KI-Crawler-Schutz, Firewall-Regeln und Zugriffsrichtlinien für diesen Host.',
    m_wrong_target: 'Die öffentliche Adresse antwortet, aber nicht mit dieser App (HTTP {http}). Richte den Tunnel oder Proxy auf Port {port} dieser App.',
    m_http_status: 'Die öffentliche Gitea-Adresse antwortet mit HTTP {http}.',
    m_login_required: 'Gitea verlangt für alles eine Anmeldung; trage einen Zugriffstoken ein.',
    m_login_required_note: 'Gitea verlangt eine Anmeldung, bevor es etwas zeigt. Für die Anmeldung von Claude und ChatGPT ist das in Ordnung.',
    m_not_gitea: '{url} antwortet, sieht aber nicht nach Gitea aus (HTTP {http}). Prüfe die Adresse.',
    m_token_rejected: 'Gitea akzeptiert diesen Zugriffstoken nicht.',
    m_token_http: 'Der Token konnte nicht geprüft werden (HTTP {http}).',
    m_token_unreachable: 'Der Token konnte nicht geprüft werden, weil Gitea nicht erreichbar ist.',
    m_agent_blocked: 'Anfragen, die sich als Claude ausgeben (User-Agent Claude-User), werden {how}, während eine normale Anfrage die App erreicht. Ein Bot-Schutz davor macht das, zum Beispiel die KI-Crawler-Sperre von Cloudflare. Dieser Test kommt aus deinem eigenen Netz und ist deshalb ein Hinweis, kein Beweis: Ein Dienst kann eine Anfrage, die sich nur als Claude ausgibt, anders behandeln als Claudes echte Server. Das Sicherheitsprotokoll deiner Firewall zeigt, was die echten Anfragen (aus 160.79.104.0/21) bekommen haben.',
    m_agent_http: 'Anfragen von Claude bekommen HTTP {http} statt der Anmeldeaufforderung dieser App.',
    m_root_url: 'Gitea kündigt seine Anmeldung unter {endpoint} an. Setze ROOT_URL in Gitea auf {public}/, damit Claude und ChatGPT an die öffentliche Adresse geschickt werden.',
    m_oauth_http: 'Die Anmelde-Adresse von Gitea antwortet mit HTTP {http}.',
    m_oauth_no_discovery: 'Gitea veröffentlicht seine Anmelde-Adressen nicht (HTTP {http}).',
    m_no_gitea: 'Es wurde kein Gitea gefunden. Installiere die Gitea-App oder trage die Adresse deines Gitea unter „Gitea-Adresse“ ein.',
    m_bad_gitea_url: 'Die Gitea-Adresse „{url}“ ist keine Webadresse. Nutze die Form http://homeassistant.local:3000.',
    m_bad_public_url: 'Die öffentliche MCP-Adresse „{url}“ muss so aussehen: https://mcp.example.com (HTTPS, kein Pfad).',
    m_need_gitea_public: 'Der Fernzugriff braucht die öffentliche Adresse deines Gitea unter „Öffentliche Gitea-Adresse“.',
    m_bad_gitea_public: 'Die öffentliche Gitea-Adresse „{url}“ ist keine Webadresse.',
    m_ca_missing: 'Die Zertifikatsdatei „{name}“ wurde im Ordner /ssl nicht gefunden.',
    step4: '4. Claude Code verbinden (optional)',
    step4Text: 'Claude Code meldet sich über einen kleinen Webserver auf deinem eigenen Rechner an. Gitea akzeptiert diese Rücksprungadresse nur mit genau diesem Port, deshalb ist der Port fest. Die Adresse mit „localhost“ steht oben in der Liste der Weiterleitungs-URIs. Ersetze im Befehl die Client-ID.',
    claudeCodeCommand: 'Befehl für dein Terminal',
  },
};

// German only when the browser prefers German; everything else is English.
const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
const language = preferred.toLowerCase().startsWith('de') ? 'de' : 'en';
document.documentElement.lang = language;

function t(key, ...values) {
  return values.reduce((text, value, index) => text.replace(`{${index}}`, value), TEXT[language][key]);
}

// fill(template, values): replaces {name} with values.name.
function fill(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
}

// explain(entry, fallback): the message of a check or problem in the language of the page.
// The backend sends a code with arguments next to its English text; unknown codes show the text.
function explain(entry, fallback = '') {
  const template = entry && entry.code && TEXT[language][`m_${entry.code}`];
  if (!template) return fallback || (entry && (entry.error || entry.text)) || '';
  const args = { ...entry.args };
  if (args.reason) args.reason = fill(TEXT[language][`reason_${args.reason}`] || args.reason, args);
  if (args.who) args.who = TEXT[language][`who_${args.who}`] || args.who;
  if (args.how) args.how = fill(TEXT[language][`how_${args.how}`] || args.how, args);
  return fill(template, args);
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
  const details = status.problem_details && status.problem_details.length ? status.problem_details : null;
  const lines = details ? details.map((problem) => explain(problem)) : status.problems;
  banner.replaceChildren(el('h2', {}, t('problems')), ...lines.map((line) => el('p', {}, line)));
}

function giteaRows(status) {
  const gitea = status.local.gitea;
  if (!status.local.url) return [row('bad', t('noGitea'), t('noGiteaDetail'))];

  const source = status.local.source.startsWith('app:') ? 'giteaApp' : 'giteaUrl';
  const rows = [gitea.reachable
    ? row('ok', t('giteaOk', gitea.version || ''), t(source, status.local.url))
    : row('bad', t('giteaBad'), `${status.local.url}: ${explain(gitea)}`)];

  if (gitea.token.state === 'ok') rows.push(row('ok', t('tokenOk', gitea.token.login), t('tokenOkDetail')));
  else if (gitea.token.state === 'none') rows.push(row('warn', t('tokenNone'), t('tokenNoneDetail')));
  else rows.push(row('bad', t('tokenBad'), explain(gitea.token)));
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
      link(`https://my.home-assistant.io/redirect/supervisor_addon/?addon=${status.app.hostname.replace(/-/g, '_')}`, t('openConfig')));
    return;
  }

  const checks = remote.checks;
  card.replaceChildren(
    el('h2', {}, t('remote')),
    checks && row(checks.mcp.ok ? 'ok' : 'bad', t('checkMcp'), explain(checks.mcp)),
    checks && row(checks.agent.ok ? 'ok' : 'bad', t('checkAgent'), explain(checks.agent)),
    checks && row(checks.gitea.ok ? 'ok' : 'bad', t('checkGitea'), checks.gitea.error ? explain(checks.gitea) : explain({ code: checks.gitea.note_code }, checks.gitea.note)),
    checks && row(checks.oauth.ok ? 'ok' : 'bad', t('checkOauth'), explain(checks.oauth)),
    el('p', { className: 'muted' }, t('checkHint')),
    el('h3', {}, t('step1')),
    el('p', {}, t('step1Text', `${remote.gitea_url}/user/settings/applications`)),
    field(t('appName'), 'Claude and ChatGPT'),
    field(t('redirectUris'), remote.redirect_uris.join('\n'), remote.redirect_uris.length),
    el('h3', {}, t('step2')),
    el('p', {}, t('step2Text')),
    field(t('mcpAddress'), remote.mcp_url),
    el('h3', {}, t('step3')),
    el('p', {}, t('step3Text')),
    el('h3', {}, t('step4')),
    el('p', {}, t('step4Text')),
    field(t('claudeCodeCommand'),
      `claude mcp add --transport http gitea ${remote.mcp_url} --client-id <client-id> --callback-port ${status.claude_code_port}`, 3));
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
