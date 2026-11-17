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
    problems: 'Needs attention',
    openConfig: 'Open app configuration',
    ready: 'Ready',
    needsGitea: 'Needs Gitea',
    setUp: 'Set up',
    mcpAddress: 'MCP address',

    tab_overview: 'Overview',
    tab_assist: 'Home Assistant',
    tab_other: 'MCP clients',
    tab_remote: 'Remote access',
    openRemote: 'Open “Remote access”',

    overviewIntro: 'Connect MCP clients to your Gitea repositories, files, issues and pull requests.',
    connection: 'Connection',
    noGiteaDetail: 'Enter the address of your Gitea in the app configuration.',
    giteaOk: 'Gitea {0} is reachable',
    giteaOkNoVersion: 'Gitea is reachable',
    giteaDefault: '{0} (the Gitea app by alexbelgium, the default)',
    giteaUrl: '{0} (address from the app configuration)',
    giteaBad: 'Gitea does not answer',
    tokenOk: 'Signed in as {0}',
    tokenOkDetail: 'Local clients use the permissions of this access token.',
    tokenNone: 'No access token yet',
    tokenNoneDetail: 'Create a token in Gitea under Settings → Applications and enter it as “Access token” in the app configuration. Without a token, local clients can only read public data.',
    tokenBad: 'The access token does not work',
    readOnly: 'Read-only',
    readOnlyDetail: 'Tools that make changes are disabled.',
    readWrite: 'Read and write',
    readWriteDetail: 'Tools can create and change issues, files and more. For the local address the access token decides what is allowed; for sign-in clients it is the Gitea account of whoever signs in.',
    allToolsets: 'All tool groups',
    someToolsets: 'Tool groups: {0}',
    toolsetsDetail: 'Choose tool groups in the app configuration.',
    chooseTitle: 'What do you want to connect?',
    chooseIntro: 'Choose where to connect from.',
    tileAssist: 'Set up the Model Context Protocol integration.',
    tileOther: 'Find the addresses for local and remote MCP clients.',
    fitsTitle: 'How it fits together',
    fitsLocal: 'Local address: Home Assistant and other clients in your network use the access token from the app configuration. Nothing leaves your network.',
    fitsRemote: 'Remote clients reach the app over HTTPS through a tunnel or reverse proxy and sign in to Gitea with OAuth.',

    assistTitle: 'Home Assistant',
    assistIntro: 'Connect Home Assistant to the local MCP endpoint.',
    assistStep1: 'Add the integration',
    assistStep1Text: 'Add the “Model Context Protocol” integration and enter this address. It is the local address, which works with the access token of the app.',
    addIntegration: 'Add integration',
    assistStep2: 'Enable Gitea tools',
    assistStep2Text: 'Enable the named integration under “Control Home Assistant” wherever you want to use its tools.',
    assistStep3: 'Try it',
    assistStep3Text: 'Check that the integration loads and that Gitea is reachable on the Overview tab.',
    assistTips: 'Tips',
    assistTip1: 'Keep read-only enabled unless clients need to make changes.',
    assistTip2: 'Select the groups you need under “Tool groups”, for example issue, pull_request and repository.',
    assistTip3: 'Create a token with only the permissions the client needs.',
    assistTip4: 'Reload the integration after restarting the app with a new tool selection.',
    assistOwnPointer: 'See “MCP clients” for information about the MCP Server integration.',

    remoteTitle: 'Remote access',
    remoteOffIntro: 'Remote access gives MCP clients a public HTTPS endpoint. Each user signs in to Gitea with their own account.',
    remoteOffNeeds: 'What you need',
    remoteNeed1: 'A public HTTPS address that leads to port 8081 of this app, for example through a Cloudflare tunnel, a reverse proxy or Home Assistant’s remote access.',
    remoteNeed2: 'A Gitea whose sign-in is reachable from the internet over HTTPS (set ROOT_URL in Gitea to its public address).',
    remoteNeed3: 'Both addresses entered under “Remote access” in the app configuration. Restart the app afterwards.',
    remoteSecurity: 'This opens your Gitea sign-in to the internet. Use HTTPS only, keep Gitea up to date and think about who may register.',
    remoteOn: 'The public address is set up. The checks below look at it from inside your network.',
    checksTitle: 'Checks',
    checkMcp: 'The public MCP address answers',
    checkChallenge: 'The MCP endpoint requests authentication',
    checkGitea: 'The public Gitea address answers',
    checkOauth: 'Gitea’s sign-in is reachable from the internet',
    checkHint: 'The checks run from inside your network. A router that cannot loop requests back to your public address can cause failures here.',
    oauthTitle: 'The OAuth application in Gitea',
    oauthIntro: 'Register an OAuth application in Gitea and enter its client ID in your MCP client.',
    oauthStep1: 'Create the application',
    oauthStep1Text: 'Open {0}, create an OAuth2 application and leave “Confidential Client” unchecked. Copy its client ID.',
    appName: 'Application name',
    redirectHint: 'Add the exact callback URL shown by your MCP client to the OAuth application’s redirect URIs.',
    needRemoteFirst: 'Set up the remote address first (tab “Remote access”). The steps below show the addresses to enter.',

    otherTitle: 'MCP clients',
    otherIntro: 'Use a client that supports MCP over HTTP. The address depends on where the client runs.',
    otherAppsTitle: 'Clients on Home Assistant OS',
    otherAppsText: 'Apps on Home Assistant OS can reach this app by its host name on the internal network. They use the access token from this app.',
    otherLanTitle: 'Clients on your network',
    otherLanText: 'Open port 8080 of this app under Network in the app configuration. The other machine then reaches it through the IP address or the local host name of the machine that runs Home Assistant, with the port 8080. {0} is a guess from the address you used to open this page; replace it if the other machine knows your Home Assistant under another name.',
    otherLanWarn: 'The local address has no sign-in of its own: whoever reaches the port acts with the permissions of the access token. Use it only in a network you trust.',
    otherConfig: 'Example for tools with an “mcpServers” configuration',
    otherNetTitle: 'Clients on the internet',
    otherNetText: 'Set up the remote address (tab “Remote access”). The tool must support OAuth with a client ID that you enter yourself, because Gitea does not offer automatic registration. Add the callback address the tool shows as one more redirect URI to the OAuth application.',
    otherNote: 'Settings and menus differ between tools. If one does not work, the app log (switch on debug logging) shows which requests arrive.',
    ownServerTitle: 'Optional: through Home Assistant’s own MCP server',
    ownServerText: 'The MCP Server integration can expose tools registered with Home Assistant through its own MCP endpoint.',
    ownServerAddress: 'Address of Home Assistant’s MCP server',
    ownServerFacts: 'What Home Assistant documents',
    ownServerFact1: 'Integration: “MCP Server” (Settings → Devices & services → Add integration).',
    ownServerFact2: 'Use port 8123 and path /api/mcp.',
    ownServerFact3: 'Sign-in: OAuth with a Home Assistant account (PKCE, no client secret). “Require an administrator account” is on by default.',
    ownServerFact4: 'Configure the exposed tools under “Control Home Assistant”.',
    ownServerTrade: 'Gitea requests through Home Assistant use the access token configured in this app.',
    ownServerAdd: 'Add MCP Server integration',
    ownServerDocs: 'Home Assistant documentation',

    reason_host_unknown: 'the host name is unknown',
    reason_refused: 'the connection was refused (is the app started?)',
    reason_timeout: 'the request timed out',
    reason_tls: 'the TLS certificate is not trusted (see the advanced options)',
    reason_failed: 'the connection failed (curl error {rc})',
    who_cloudflare: 'Cloudflare',
    who_proxy: 'Something in front of it',
    m_no_answer: 'The address does not answer: {reason}.',
    m_blocked: '{who} refuses the request (HTTP {http}). Check firewall rules and access policies for this host.',
    m_wrong_target: 'The public address answers, but not with this app (HTTP {http}). Point the tunnel or proxy at port {port} of this app.',
    m_http_status: 'The public Gitea address answers with HTTP {http}.',
    m_login_required: 'Gitea requires a login for everything; add an access token.',
    m_login_required_note: 'Gitea requires users to sign in. OAuth sign-in is available.',
    m_not_gitea: '{url} answers, but it does not look like Gitea (HTTP {http}). Check the address.',
    m_token_rejected: 'Gitea does not accept this access token.',
    m_token_http: 'The token could not be checked (HTTP {http}).',
    m_token_unreachable: 'The token could not be checked because Gitea is not reachable.',
    m_challenge_http: 'The MCP address does not answer with the sign-in challenge of this app (HTTP {http}).',
    m_root_url: 'Gitea announces its sign-in at {endpoint}. Set ROOT_URL in Gitea to {public}/ so clients use the public address.',
    m_oauth_http: 'The sign-in address of Gitea answers with HTTP {http}.',
    m_oauth_no_discovery: 'Gitea does not publish its sign-in addresses (HTTP {http}).',
    m_bad_gitea_url: 'The Gitea address “{url}” is not a web address. Use the form http://db21ed7f-gitea:3000.',
    m_bad_public_url: 'The public MCP address “{url}” must look like https://mcp.example.com (HTTPS, no path).',
    m_need_gitea_public: 'Remote access needs the public address of your Gitea under “Public Gitea address”.',
    m_bad_gitea_public: 'The public Gitea address “{url}” is not a web address.',
  },
  de: {
    recheck: 'Erneut prüfen',
    rechecking: 'Prüfe…',
    copy: 'Kopieren',
    copied: 'Kopiert',
    starting: 'Die App startet. Diese Seite aktualisiert sich gleich…',
    checkedAt: 'Zuletzt geprüft {0}',
    problems: 'Das braucht Aufmerksamkeit',
    openConfig: 'App-Konfiguration öffnen',
    ready: 'Bereit',
    needsGitea: 'Braucht Gitea',
    setUp: 'Einrichten',
    mcpAddress: 'MCP-Adresse',

    tab_overview: 'Übersicht',
    tab_assist: 'Home Assistant',
    tab_other: 'MCP-Clients',
    tab_remote: 'Fernzugriff',
    openRemote: '„Fernzugriff“ öffnen',

    overviewIntro: 'Verbinde MCP-Clients mit deinen Gitea-Repositories, Dateien, Issues und Pull Requests.',
    connection: 'Verbindung',
    noGiteaDetail: 'Trage die Adresse deines Gitea in der App-Konfiguration ein.',
    giteaOk: 'Gitea {0} ist erreichbar',
    giteaOkNoVersion: 'Gitea ist erreichbar',
    giteaDefault: '{0} (die Gitea-App von alexbelgium, der Standard)',
    giteaUrl: '{0} (Adresse aus der App-Konfiguration)',
    giteaBad: 'Gitea antwortet nicht',
    tokenOk: 'Angemeldet als {0}',
    tokenOkDetail: 'Lokale Clients verwenden die Berechtigungen dieses Zugriffstokens.',
    tokenNone: 'Noch kein Zugriffstoken',
    tokenNoneDetail: 'Erstelle in Gitea unter Einstellungen → Anwendungen einen Token und trage ihn als „Zugriffstoken“ in der App-Konfiguration ein. Ohne Token können lokale Clients nur öffentliche Daten lesen.',
    tokenBad: 'Der Zugriffstoken funktioniert nicht',
    readOnly: 'Nur lesen',
    readOnlyDetail: 'Werkzeuge, die Änderungen vornehmen, sind deaktiviert.',
    readWrite: 'Lesen und schreiben',
    readWriteDetail: 'Werkzeuge können Issues, Dateien und mehr anlegen und ändern. Bei der lokalen Adresse bestimmt der Zugriffstoken, was erlaubt ist; bei Clients mit Anmeldung ist es das Gitea-Konto dessen, der sich anmeldet.',
    allToolsets: 'Alle Werkzeuggruppen',
    someToolsets: 'Werkzeuggruppen: {0}',
    toolsetsDetail: 'Wähle die Werkzeuggruppen in der App-Konfiguration.',
    chooseTitle: 'Was möchtest du verbinden?',
    chooseIntro: 'Wähle, von wo du dich verbinden möchtest.',
    tileAssist: 'Richte die Integration „Model Context Protocol“ ein.',
    tileOther: 'Hier findest du die Adressen für lokale und externe MCP-Clients.',
    fitsTitle: 'So hängt es zusammen',
    fitsLocal: 'Lokale Adresse: Home Assistant und andere Clients in deinem Netzwerk nutzen den Zugriffstoken aus der App-Konfiguration. Nichts verlässt dein Netzwerk.',
    fitsRemote: 'Externe Clients erreichen die App per HTTPS über einen Tunnel oder Reverse-Proxy und melden sich per OAuth bei Gitea an.',

    assistTitle: 'Home Assistant',
    assistIntro: 'Verbinde Home Assistant mit dem lokalen MCP-Endpunkt.',
    assistStep1: 'Integration hinzufügen',
    assistStep1Text: 'Füge die Integration „Model Context Protocol“ hinzu und trage diese Adresse ein. Es ist die lokale Adresse, sie arbeitet mit dem Zugriffstoken der App.',
    addIntegration: 'Integration hinzufügen',
    assistStep2: 'Gitea-Werkzeuge freigeben',
    assistStep2Text: 'Aktiviere den Eintrag der Integration unter „Home Assistant steuern“, wo du ihre Werkzeuge nutzen möchtest.',
    assistStep3: 'Ausprobieren',
    assistStep3Text: 'Prüfe, ob die Integration geladen wird und ob Gitea im Reiter „Übersicht“ erreichbar ist.',
    assistTips: 'Tipps',
    assistTip1: 'Lass den Schreibschutz aktiv, solange Clients keine Änderungen vornehmen müssen.',
    assistTip2: 'Wähle unter „Werkzeuggruppen“ die benötigten Gruppen, etwa issue, pull_request und repository.',
    assistTip3: 'Erstelle einen Token mit den Berechtigungen, die der Client benötigt.',
    assistTip4: 'Lade die Integration neu, nachdem du die App mit einer geänderten Werkzeugauswahl neu gestartet hast.',
    assistOwnPointer: 'Weitere Informationen zur Integration „MCP Server“ findest du unter „MCP-Clients“.',

    remoteTitle: 'Fernzugriff',
    remoteOffIntro: 'Der Fernzugriff stellt MCP-Clients einen öffentlichen HTTPS-Endpunkt bereit. Jede Person meldet sich mit ihrem eigenen Gitea-Konto an.',
    remoteOffNeeds: 'Was du brauchst',
    remoteNeed1: 'Eine öffentliche HTTPS-Adresse, die zu Port 8081 dieser App führt, zum Beispiel über einen Cloudflare-Tunnel, einen Reverse-Proxy oder den Fernzugriff von Home Assistant.',
    remoteNeed2: 'Ein Gitea, dessen Anmeldung aus dem Internet über HTTPS erreichbar ist (setze ROOT_URL in Gitea auf die öffentliche Adresse).',
    remoteNeed3: 'Beide Adressen unter „Fernzugriff“ in der App-Konfiguration. Starte die App danach neu.',
    remoteSecurity: 'Das öffnet die Anmeldung deines Gitea zum Internet. Nutze nur HTTPS, halte Gitea aktuell und überlege, wer sich registrieren darf.',
    remoteOn: 'Die öffentliche Adresse ist eingerichtet. Die Prüfungen unten sehen sie sich von innerhalb deines Netzwerks an.',
    checksTitle: 'Prüfungen',
    checkMcp: 'Die öffentliche MCP-Adresse antwortet',
    checkChallenge: 'Der MCP-Endpunkt fordert zur Anmeldung auf',
    checkGitea: 'Die öffentliche Gitea-Adresse antwortet',
    checkOauth: 'Die Anmeldung von Gitea ist aus dem Internet erreichbar',
    checkHint: 'Die Prüfungen laufen innerhalb deines Netzwerks. Sie können fehlschlagen, wenn dein Router Anfragen an deine öffentliche Adresse nicht zurückleitet.',
    oauthTitle: 'Die OAuth-Anwendung in Gitea',
    oauthIntro: 'Registriere eine OAuth-Anwendung in Gitea und trage ihre Client-ID in deinem MCP-Client ein.',
    oauthStep1: 'Anwendung anlegen',
    oauthStep1Text: 'Öffne {0}, lege eine OAuth2-Anwendung an und lass „Vertraulicher Client“ deaktiviert. Kopiere ihre Client-ID.',
    appName: 'Anwendungsname',
    redirectHint: 'Trage die Callback-Adresse deines MCP-Clients exakt als Weiterleitungs-URI in der OAuth-Anwendung ein.',
    needRemoteFirst: 'Richte zuerst die öffentliche Adresse ein (Reiter „Fernzugriff“). Die Schritte unten zeigen die Adressen zum Eintragen.',

    otherTitle: 'MCP-Clients',
    otherIntro: 'Verwende einen Client mit Unterstützung für MCP über HTTP. Die passende Adresse hängt davon ab, wo der Client läuft.',
    otherAppsTitle: 'Clients auf Home Assistant OS',
    otherAppsText: 'Apps auf Home Assistant OS erreichen diese App über ihren Hostnamen im internen Netzwerk. Sie verwenden den Zugriffstoken dieser App.',
    otherLanTitle: 'Clients im lokalen Netzwerk',
    otherLanText: 'Öffne Port 8080 dieser App unter Netzwerk in der App-Konfiguration. Der andere Rechner erreicht sie dann über die IP-Adresse oder den lokalen Hostnamen des Rechners, auf dem Home Assistant läuft, mit Port 8080. {0} ist eine Vermutung aus der Adresse, mit der du diese Seite geöffnet hast; ersetze sie, wenn der andere Rechner dein Home Assistant unter einem anderen Namen kennt.',
    otherLanWarn: 'Die lokale Adresse hat keine eigene Anmeldung: Wer den Port erreicht, arbeitet mit den Rechten des Zugriffstokens. Nutze sie nur in einem Netzwerk, dem du vertraust.',
    otherConfig: 'Beispiel für Werkzeuge mit „mcpServers“-Konfiguration',
    otherNetTitle: 'Clients im Internet',
    otherNetText: 'Richte die öffentliche Adresse ein (Reiter „Fernzugriff“). Das Werkzeug muss OAuth mit einer Client-ID unterstützen, die du selbst einträgst, weil Gitea keine automatische Registrierung anbietet. Füge die Callback-Adresse, die das Werkzeug zeigt, der OAuth-Anwendung als weitere Weiterleitungs-URI hinzu.',
    otherNote: 'Einstellungen und Menüs unterscheiden sich je nach Werkzeug. Funktioniert eines nicht, zeigt das App-Protokoll (Debug-Protokoll einschalten), welche Anfragen ankommen.',
    ownServerTitle: 'Optional: über den MCP-Server von Home Assistant selbst',
    ownServerText: 'Die Integration „MCP Server“ kann die in Home Assistant registrierten Werkzeuge über dessen eigenen MCP-Endpunkt bereitstellen.',
    ownServerAddress: 'Adresse des MCP-Servers von Home Assistant',
    ownServerFacts: 'Was Home Assistant dokumentiert',
    ownServerFact1: 'Integration: „MCP Server“ (Einstellungen → Geräte & Dienste → Integration hinzufügen).',
    ownServerFact2: 'Verwende Port 8123 und den Pfad /api/mcp.',
    ownServerFact3: 'Anmeldung: OAuth mit einem Home-Assistant-Konto (PKCE, kein Client-Secret). „Administratorkonto verlangen“ ist standardmäßig an.',
    ownServerFact4: 'Wähle die freigegebenen Werkzeuge unter „Home Assistant steuern“ aus.',
    ownServerTrade: 'Gitea-Anfragen über Home Assistant verwenden den in dieser App hinterlegten Zugriffstoken.',
    ownServerAdd: 'Integration „MCP Server“ hinzufügen',
    ownServerDocs: 'Dokumentation von Home Assistant',

    reason_host_unknown: 'der Hostname ist unbekannt',
    reason_refused: 'die Verbindung wurde abgelehnt (läuft die App?)',
    reason_timeout: 'die Anfrage hat das Zeitlimit überschritten',
    reason_tls: 'dem TLS-Zertifikat wird nicht vertraut (siehe Erweitert)',
    reason_failed: 'die Verbindung ist fehlgeschlagen (curl-Fehler {rc})',
    who_cloudflare: 'Cloudflare',
    who_proxy: 'Etwas davor',
    m_no_answer: 'Die Adresse antwortet nicht: {reason}.',
    m_blocked: '{who} weist die Anfrage ab (HTTP {http}). Prüfe Firewall-Regeln und Zugriffsrichtlinien für diesen Host.',
    m_wrong_target: 'Die öffentliche Adresse antwortet, aber nicht mit dieser App (HTTP {http}). Richte den Tunnel oder Proxy auf Port {port} dieser App.',
    m_http_status: 'Die öffentliche Gitea-Adresse antwortet mit HTTP {http}.',
    m_login_required: 'Gitea verlangt für alles eine Anmeldung; trage einen Zugriffstoken ein.',
    m_login_required_note: 'Gitea erfordert eine Anmeldung. Die Anmeldung per OAuth ist verfügbar.',
    m_not_gitea: '{url} antwortet, sieht aber nicht nach Gitea aus (HTTP {http}). Prüfe die Adresse.',
    m_token_rejected: 'Gitea akzeptiert diesen Zugriffstoken nicht.',
    m_token_http: 'Der Token konnte nicht geprüft werden (HTTP {http}).',
    m_token_unreachable: 'Der Token konnte nicht geprüft werden, weil Gitea nicht erreichbar ist.',
    m_challenge_http: 'Die MCP-Adresse antwortet nicht mit der Anmeldeaufforderung dieser App (HTTP {http}).',
    m_root_url: 'Gitea kündigt seine Anmeldung unter {endpoint} an. Setze ROOT_URL in Gitea auf {public}/, damit Clients die öffentliche Adresse verwenden.',
    m_oauth_http: 'Die Anmelde-Adresse von Gitea antwortet mit HTTP {http}.',
    m_oauth_no_discovery: 'Gitea veröffentlicht seine Anmelde-Adressen nicht (HTTP {http}).',
    m_bad_gitea_url: 'Die Gitea-Adresse „{url}“ ist keine Webadresse. Nutze die Form http://db21ed7f-gitea:3000.',
    m_bad_public_url: 'Die öffentliche MCP-Adresse „{url}“ muss so aussehen: https://mcp.example.com (HTTPS, kein Pfad).',
    m_need_gitea_public: 'Der Fernzugriff braucht die öffentliche Adresse deines Gitea unter „Öffentliche Gitea-Adresse“.',
    m_bad_gitea_public: 'Die öffentliche Gitea-Adresse „{url}“ ist keine Webadresse.',
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
  return el('a', { href, target: '_blank', rel: 'noopener', className: primary ? 'button primary' : 'button' }, text);
}

function card(title, ...children) {
  return el('section', { className: 'card' }, title && el('h2', {}, title), ...children);
}

function callout(kind, ...children) {
  return el('div', { className: `callout ${kind}` }, ...children);
}

// steps([title, ...content], ...): numbered instructions.
function steps(...items) {
  return el('ol', { className: 'steps' }, items.map(([title, ...content]) => el('li', {}, el('h3', {}, title), ...content)));
}

function configLink(status) {
  const slug = status.app.hostname.replace(/-/g, '_');
  return link(`https://my.home-assistant.io/redirect/supervisor_addon/?addon=${slug}`, t('openConfig'));
}

// ---- state of the clients ------------------------------------------------------------------

function clientState(status) {
  return status.local.gitea && status.local.gitea.reachable
    ? ['ok', t('ready')]
    : ['warn', t('needsGitea')];
}

// ---- panels ----------------------------------------------------------------------------------

function connectionRows(status) {
  const gitea = status.local.gitea || { reachable: false, token: { state: 'none' } };
  const rows = [];
  if (!status.local.url) return [row('bad', t('giteaBad'), t('noGiteaDetail'))];

  const source = status.local.source === 'default' ? 'giteaDefault' : 'giteaUrl';
  rows.push(gitea.reachable
    ? row('ok', gitea.version ? t('giteaOk', gitea.version) : t('giteaOkNoVersion'), t(source, status.local.url))
    : row('bad', t('giteaBad'), `${status.local.url}: ${explain(gitea)}`));

  if (gitea.token.state === 'ok') rows.push(row('ok', t('tokenOk', gitea.token.login), t('tokenOkDetail')));
  else if (gitea.token.state === 'none') rows.push(row('warn', t('tokenNone'), t('tokenNoneDetail')));
  else rows.push(row('bad', t('tokenBad'), explain(gitea.token)));

  rows.push(status.read_only
    ? row('ok', t('readOnly'), t('readOnlyDetail'))
    : row('warn', t('readWrite'), t('readWriteDetail')));
  rows.push(row('ok', status.toolsets.length ? t('someToolsets', status.toolsets.join(', ')) : t('allToolsets'),
    status.toolsets.length ? null : t('toolsetsDetail')));
  return rows;
}

function tile(status, tab, title, text) {
  const [state, label] = clientState(status);
  const open = el('button', { type: 'button' }, t('setUp'));
  open.addEventListener('click', () => selectTab(tab));
  return el('div', { className: 'tile' }, el('h3', {}, title), el('p', {}, text),
    el('div', { className: 'foot' }, el('span', { className: `pill ${state}` }, label), open));
}

function overviewPanel(status) {
  return [
    card(null, el('p', {}, t('overviewIntro'))),
    card(t('connection'), ...connectionRows(status)),
    card(t('chooseTitle'), el('p', { className: 'muted' }, t('chooseIntro')),
      el('div', { className: 'grid' },
        tile(status, 'assist', 'Home Assistant', t('tileAssist')),
        tile(status, 'other', t('tab_other'), t('tileOther')))),
    card(t('fitsTitle'), el('ul', {}, el('li', {}, t('fitsLocal')), el('li', {}, t('fitsRemote'))),
      el('div', { className: 'actions' }, configLink(status))),
  ];
}

function assistPanel(status) {
  return [
    card(t('assistTitle'), el('p', {}, t('assistIntro')),
      steps(
        [t('assistStep1'), el('p', {}, t('assistStep1Text')),
          field(t('mcpAddress'), status.local.mcp_url),
          link('https://my.home-assistant.io/redirect/config_flow_start/?domain=mcp', t('addIntegration'), true)],
        [t('assistStep2'), el('p', {}, t('assistStep2Text'))],
        [t('assistStep3'), el('p', {}, t('assistStep3Text'))])),
    card(t('assistTips'), el('ul', {}, ['assistTip1', 'assistTip2', 'assistTip3', 'assistTip4'].map((key) => el('li', {}, t(key))))),
    card(null, el('p', {}, t('assistOwnPointer'))),
  ];
}

function checkRows(status) {
  const checks = status.remote.checks;
  return [
    row(checks.mcp.ok ? 'ok' : 'bad', t('checkMcp'), explain(checks.mcp)),
    row(checks.challenge.ok ? 'ok' : 'bad', t('checkChallenge'), explain(checks.challenge)),
    row(checks.gitea.ok ? 'ok' : 'bad', t('checkGitea'),
      checks.gitea.error ? explain(checks.gitea) : explain({ code: checks.gitea.note_code }, checks.gitea.note)),
    row(checks.oauth.ok ? 'ok' : 'bad', t('checkOauth'), explain(checks.oauth)),
  ];
}

function oauthCard(status) {
  const remote = status.remote;
  return card(t('oauthTitle'), el('p', {}, t('oauthIntro')),
    steps([t('oauthStep1'), el('p', {}, t('oauthStep1Text', `${remote.gitea_url}/user/settings/applications`)),
      field(t('appName'), remote.app_name),
      el('p', { className: 'muted' }, t('redirectHint'))]));
}

function remotePanel(status) {
  const remote = status.remote;
  if (!remote.public_url) {
    return [card(t('remoteTitle'), el('p', {}, t('remoteOffIntro')),
      el('h3', {}, t('remoteOffNeeds')),
      el('ol', {}, ['remoteNeed1', 'remoteNeed2', 'remoteNeed3'].map((key) => el('li', {}, t(key)))),
      callout('warn', el('p', {}, t('remoteSecurity'))),
      el('div', { className: 'actions' }, configLink(status)))];
  }
  const checks = status.remote.checks;
  return [
    card(t('remoteTitle'), el('p', {}, t('remoteOn')), field(t('mcpAddress'), remote.mcp_url)),
    checks && card(t('checksTitle'), ...checkRows(status), el('p', { className: 'muted' }, t('checkHint'))),
    oauthCard(status),
  ];
}

function remoteGate(status) {
  if (status.remote.public_url) return null;
  const open = el('button', { type: 'button' }, t('openRemote'));
  open.addEventListener('click', () => selectTab('remote'));
  return callout('warn', el('p', {}, t('needRemoteFirst')), open);
}

// The name under which another machine probably knows Home Assistant: the address this page was
// opened with, when it is a local one.
function hostGuess() {
  const host = location.hostname;
  const local = /^(\d+\.){3}\d+$/.test(host) || !host.includes('.') || host.endsWith('.local');
  return host && local ? host : 'homeassistant.local';
}

function otherPanel(status) {
  const host = hostGuess();
  const lanAddress = `http://${host}:${status.local.port}/mcp`;
  const snippet = (url) => JSON.stringify({ mcpServers: { gitea: { url } } }, null, 2);
  return [
    card(t('otherTitle'), el('p', {}, t('otherIntro'))),
    card(t('otherAppsTitle'), el('p', {}, t('otherAppsText')), field(t('mcpAddress'), status.local.mcp_url),
      field(t('otherConfig'), snippet(status.local.mcp_url), 7)),
    card(t('otherLanTitle'), el('p', {}, t('otherLanText', host)), field(t('mcpAddress'), lanAddress),
      callout('warn', el('p', {}, t('otherLanWarn')))),
    card(t('otherNetTitle'), el('p', {}, t('otherNetText')),
      status.remote.public_url ? field(t('mcpAddress'), status.remote.mcp_url) : remoteGate(status)),
    card(t('ownServerTitle'), el('p', {}, t('ownServerText')),
      field(t('ownServerAddress'), `http://${host}:8123/api/mcp`),
      el('h3', {}, t('ownServerFacts')),
      el('ul', {}, ['ownServerFact1', 'ownServerFact2', 'ownServerFact3', 'ownServerFact4'].map((key) => el('li', {}, t(key)))),
      callout('warn', el('p', {}, t('ownServerTrade'))),
      el('div', { className: 'actions' },
        link('https://my.home-assistant.io/redirect/config_flow_start/?domain=mcp_server', t('ownServerAdd'), true),
        link('https://www.home-assistant.io/integrations/mcp_server/', t('ownServerDocs')))),
    el('p', { className: 'muted' }, t('otherNote')),
  ];
}

const TABS = [
  ['overview', overviewPanel], ['assist', assistPanel],
  ['other', otherPanel], ['remote', remotePanel],
];

// ---- tabs and rendering ----------------------------------------------------------------------

let currentTab = TABS.some(([name]) => name === location.hash.slice(1)) ? location.hash.slice(1) : 'overview';

function showTab(name) {
  currentTab = name;
  history.replaceState(null, '', `#${name}`);
  for (const [tab] of TABS) {
    document.getElementById(`panel-${tab}`).hidden = tab !== name;
    document.getElementById(`tab-${tab}`).setAttribute('aria-selected', String(tab === name));
  }
}

function selectTab(name) {
  showTab(name);
  window.scrollTo({ top: 0 });
}

function buildTabs() {
  const nav = document.getElementById('tabs');
  const panels = document.getElementById('panels');
  for (const [name] of TABS) {
    const button = el('button', { type: 'button', id: `tab-${name}`, role: 'tab' }, t(`tab_${name}`));
    button.addEventListener('click', () => selectTab(name));
    nav.append(button);
    panels.append(el('div', { id: `panel-${name}`, className: 'panel', role: 'tabpanel' }));
  }
}

function renderProblems(status) {
  const banner = document.getElementById('problems');
  banner.hidden = status.problems.length === 0;
  const details = status.problem_details && status.problem_details.length ? status.problem_details : null;
  const lines = details ? details.map((problem) => explain(problem)) : status.problems;
  banner.replaceChildren(el('h2', {}, t('problems')), ...lines.map((line) => el('p', {}, line)));
}

// What the panels show, without the time of the check: they are only drawn again when it changes,
// so that text the user is selecting or has copied stays untouched by the regular recheck.
let lastContent = '';

function render(status) {
  const version = document.getElementById('version');
  version.textContent = status.app.version;
  version.hidden = !status.app.version;
  document.getElementById('checked').textContent = t('checkedAt', new Date(status.checked_at).toLocaleString());
  renderProblems(status);

  const content = JSON.stringify({ ...status, checked_at: '' });
  if (content === lastContent) return;
  lastContent = content;
  for (const [name, build] of TABS) {
    document.getElementById(`panel-${name}`).replaceChildren(...build(status).filter(Boolean));
  }
  showTab(currentTab);
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
document.title = 'Gitea MCP-Server';
buildTabs();
load();
