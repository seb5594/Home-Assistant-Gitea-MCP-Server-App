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
    openConfig: 'Open app configuration',
    ready: 'Ready',
    needsRemote: 'Needs remote access',
    checkFailed: 'See the checks',
    needsGitea: 'Needs Gitea',
    setUp: 'Set up',
    mcpAddress: 'MCP address',

    tab_overview: 'Overview',
    tab_assist: 'Home Assistant',
    tab_code: 'Claude Code',
    tab_claude: 'claude.ai',
    tab_chatgpt: 'ChatGPT',
    tab_other: 'Other agents',
    tab_remote: 'Remote access',
    openRemote: 'Open “Remote access”',

    overviewIntro: 'This app lets AI assistants work with your own Gitea: search repositories, read files, and look at or write issues and pull requests. It speaks the Model Context Protocol (MCP), which many assistants understand. You decide which ones to connect; nothing below is required.',
    connection: 'Connection',
    noGiteaDetail: 'Enter the address of your Gitea in the app configuration.',
    giteaOk: 'Gitea {0} is reachable',
    giteaOkNoVersion: 'Gitea is reachable',
    giteaDefault: '{0} (the Gitea app by alexbelgium, the default)',
    giteaUrl: '{0} (address from the app configuration)',
    giteaBad: 'Gitea does not answer',
    tokenOk: 'Signed in as {0}',
    tokenOkDetail: 'Every assistant that uses the local address works with the permissions of this access token.',
    tokenNone: 'No access token yet',
    tokenNoneDetail: 'Without a token only public data can be read. Create one in Gitea under Settings → Applications and enter it as “Access token” in the app configuration. Assistants that sign in themselves (claude.ai, ChatGPT, Claude Code) do not need it.',
    tokenBad: 'The access token does not work',
    readOnly: 'Read-only',
    readOnlyDetail: 'Tools that change something are switched off, for every assistant.',
    readWrite: 'Read and write',
    readWriteDetail: 'Tools can create and change issues, files and more. For the local address the access token decides what is allowed; for sign-in clients it is the Gitea account of whoever signs in.',
    allToolsets: 'All tool groups',
    someToolsets: 'Tool groups: {0}',
    toolsetsDetail: 'A short list keeps the tool list small, which helps voice assistants and saves tokens.',
    chooseTitle: 'What do you want to connect?',
    chooseIntro: 'Pick the assistants you use. Each one has its own tab with step-by-step instructions.',
    tileAssist: 'Use Gitea in your voice assistant and chats inside Home Assistant.',
    tileClaude: 'Claude in the browser and the apps, through a custom connector.',
    tileChatgpt: 'ChatGPT with developer mode, through a custom connector.',
    tileCode: 'The Claude Code command line, with your own sign-in.',
    tileOther: 'Cursor, OpenClaw and every other tool that understands MCP.',
    fitsTitle: 'How it fits together',
    fitsLocal: 'Local address: Home Assistant and other clients in your network use the access token from the app configuration. Nothing leaves your network.',
    fitsRemote: 'Remote address: AI services on the internet reach the app through a tunnel or reverse proxy that you set up, and sign in to your Gitea with OAuth, each person with their own account. Needs the “Remote access” tab.',

    assistTitle: 'Home Assistant and Assist',
    assistIntro: 'Home Assistant can use this app as a tool provider for its conversation agents (Assist). Then you can ask “which issues are open in my smart home repository?” by voice or chat. Home Assistant is the MCP client here.',
    assistStep1: 'Add the integration',
    assistStep1Text: 'Add the “Model Context Protocol” integration and enter this address. It is the local address, which works with the access token of the app.',
    addIntegration: 'Add integration',
    assistStep2: 'Give your assistant the tools',
    assistStep2Text: 'Open Settings → Voice assistants, select your assistant and open the settings of its conversation agent. Under “Control Home Assistant” enable the entry named after the integration (usually “Gitea MCP-Server” or the name you gave it). The conversation agent must support tools, for example the OpenAI, Anthropic, Google or Ollama integrations. The built-in Assist agent without a language model does not.',
    assistStep3: 'Try it',
    assistStep3Text: 'Ask in a chat with the assistant: “List the open issues of owner/repository.” or “Show the latest commits of the main branch.” If nothing happens, check that Gitea is reachable on the Overview tab.',
    assistTips: 'Tips',
    assistTip1: 'Keep the app read-only until you trust the setup. A voice assistant should rarely be allowed to change repositories.',
    assistTip2: 'Voice assistants work better with fewer tools. Choose only the tool groups you need under “Tool groups” in the app configuration, for example issue, pull_request and repository.',
    assistTip3: 'The access token decides everything the assistant can see and do. Create a token with only the permissions you want, ideally for a separate Gitea account.',
    assistTip4: 'Which Home Assistant entities an assistant may control is a different setting (Settings → Voice assistants → Expose). It does not affect these tools.',
    assistOwnPointer: 'Home Assistant has an MCP server of its own, which can offer these tools to agents outside as well. See the tab “Other agents”.',

    remoteTitle: 'Remote access for AI services',
    remoteOffIntro: 'claude.ai, ChatGPT and other online assistants cannot reach your home network. For them this app offers a second, public address. They sign in to Gitea with OAuth (each person with their own account) and need no access token.',
    remoteOffNeeds: 'What you need',
    remoteNeed1: 'A public HTTPS address that leads to port 8081 of this app, for example through a Cloudflare tunnel, a reverse proxy or Home Assistant’s remote access.',
    remoteNeed2: 'A Gitea whose sign-in is reachable from the internet over HTTPS (set ROOT_URL in Gitea to its public address).',
    remoteNeed3: 'Both addresses entered under “Remote access” in the app configuration. Restart the app afterwards.',
    remoteSecurity: 'This opens your Gitea sign-in to the internet. Use HTTPS only, keep Gitea up to date and think about who may register.',
    remoteOn: 'The public address is set up. The checks below look at it from inside your network.',
    checksTitle: 'Checks',
    checkMcp: 'The public MCP address answers',
    checkAgent: 'Requests that claim to be AI services (a hint)',
    checkGitea: 'The public Gitea address answers',
    checkOauth: 'Gitea’s sign-in is reachable from the internet',
    checkHint: 'These checks run from inside your network. A failed check can still work from outside when your router does not loop requests back. The test requests for AI services only claim to come from them: bot protection often lets the real services in by their address and turns look-alikes away, so a refusal here does not mean that the service is refused. If your connector works, ignore it.',
    agentsTitle: 'Test requests, one by one',
    agentOk: '{0} gets through',
    oauthTitle: 'The OAuth application in Gitea',
    oauthIntro: 'All assistants share one OAuth application in your Gitea. Create it once and copy its client ID; every assistant tab asks for it.',
    oauthStep1: 'Create the application',
    oauthStep1Text: 'Open {0}, create an OAuth2 application with the values below and leave “Confidential Client” unchecked. Copy its client ID.',
    appName: 'Application name',
    redirectUris: 'Redirect URIs (one per line)',
    redirectHint: 'These cover claude.ai and Claude Code. ChatGPT shows a callback address of its own for every connector, and other tools have theirs: add each one as one more line when you set the tool up.',
    needRemoteFirst: 'Set up the remote address first (tab “Remote access”). The steps below show the addresses to enter.',

    claudeTitle: 'claude.ai',
    claudeIntro: 'Adds this app as a custom connector. Works on claude.ai in the browser and in the Claude apps for the account that adds it.',
    claudeStep1: 'Create the OAuth application',
    claudeStep1Text: 'Once for all assistants, see the tab “Remote access”. You need its client ID.',
    claudeStep2: 'Add the connector',
    claudeStep2Text: 'In claude.ai open Settings → Connectors → Add custom connector. Enter a name and paste the address.',
    claudeStep3: 'Enter the client ID',
    claudeStep3Text: 'Open the advanced settings of the connector form and enter the client ID. Leave the secret empty.',
    claudeStep4: 'Sign in',
    claudeStep4Text: 'Click “Connect”, sign in to your Gitea and allow access. Afterwards the tools appear in your chats; switch them on per chat with the “+” menu.',
    claudeTrouble: 'If the sign-in works but the connection fails afterwards, a usual cause is bot protection in front of the app that refuses the requests Claude’s servers send. The test requests on the tab “Remote access” can point to it, but they come from your own network: only your firewall’s security log shows what the real requests got.',

    chatgptTitle: 'ChatGPT',
    chatgptIntro: 'Adds this app as a custom connector. Needs developer mode, which ChatGPT offers on paid plans.',
    chatgptStep1: 'Switch on developer mode',
    chatgptStep1Text: 'In the ChatGPT settings open Connectors → Advanced and switch on developer mode.',
    chatgptStep2: 'Start a new connector',
    chatgptStep2Text: 'Create a new connector, enter a name, paste the address and choose OAuth as authentication.',
    chatgptStep3: 'Add ChatGPT’s callback address to Gitea',
    chatgptStep3Text: 'ChatGPT now shows a callback address of its own, similar to https://chatgpt.com/connector/oauth/ followed by a random value. It is different for every connector and Gitea only accepts addresses it knows. Open your OAuth application in Gitea and add the address as one more redirect URI.',
    chatgptStep4: 'Enter the client ID and create the connector',
    chatgptStep4Text: 'Enter the client ID of the OAuth application, create the connector and sign in to Gitea when asked. Then switch the connector on in a chat.',
    chatgptTrouble: 'An error about a redirect URI that is not registered means step 3 is missing or the address differs in one character.',

    codeTitle: 'Claude Code',
    codeIntro: 'Adds this app to the Claude Code command line. Claude Code signs in through a small web server on your own computer.',
    codeStep1: 'Create the OAuth application',
    codeStep1Text: 'Once for all assistants, see the tab “Remote access”. Its redirect URIs already contain the address for Claude Code. Gitea only accepts this return address with its exact port, so the port is fixed.',
    codeStep2: 'Add the server',
    codeStep2Text: 'Run this in a terminal and replace the client ID.',
    claudeCodeCommand: 'Command for your terminal',
    codeStep3: 'Sign in',
    codeStep3Text: 'Start Claude Code, type /mcp, choose the server and sign in to Gitea in the browser window that opens.',

    otherTitle: 'Other agents',
    otherIntro: 'Anything that speaks MCP over HTTP can use this app, for example Cursor, OpenClaw, Codex or your own scripts. Which address it needs depends on where it runs.',
    otherAppsTitle: 'Agents in Home Assistant (apps)',
    otherAppsText: 'An agent that runs as an app on Home Assistant OS reaches this app by its host name on Home Assistant’s internal network. Nothing has to be opened; it uses the access token of this app.',
    otherLanTitle: 'Agents on another machine in your network',
    otherLanText: 'Open port 8080 of this app under Network in the app configuration. The other machine then reaches it through the IP address or the local host name of the machine that runs Home Assistant, with the port 8080. {0} is a guess from the address you used to open this page; replace it if the other machine knows your Home Assistant under another name.',
    otherLanWarn: 'The local address has no sign-in of its own: whoever reaches the port acts with the permissions of the access token. Use it only in a network you trust.',
    otherConfig: 'Example for tools with an “mcpServers” configuration',
    otherNetTitle: 'Agents on the internet',
    otherNetText: 'Set up the remote address (tab “Remote access”). The tool must support OAuth with a client ID that you enter yourself, because Gitea does not offer automatic registration. Add the callback address the tool shows as one more redirect URI to the OAuth application.',
    otherNote: 'Settings and menus differ between tools. If one does not work, the app log (switch on debug logging) shows which requests arrive.',
    ownServerTitle: 'Optional: through Home Assistant’s own MCP server',
    ownServerText: 'Instead of this app’s address, an agent can use the MCP Server integration of Home Assistant. It offers the tools of Home Assistant’s LLM APIs, and the Model Context Protocol integration (tab “Home Assistant”) registers this app as one of them, so the Gitea tools come along. This follows Home Assistant’s documentation; it has not been tested with this app.',
    ownServerAddress: 'Address of Home Assistant’s MCP server',
    ownServerFacts: 'What Home Assistant documents',
    ownServerFact1: 'Integration: “MCP Server” (Settings → Devices & services → Add integration).',
    ownServerFact2: 'Port 8123, the port of Home Assistant itself, path /api/mcp. Cloud agents need Home Assistant reachable from the internet over HTTPS; Claude Code requires HTTPS.',
    ownServerFact3: 'Sign-in: OAuth with a Home Assistant account (PKCE, no client secret). “Require an administrator account” is on by default.',
    ownServerFact4: 'The setting “Expose all LLM APIs” is on by default. Turn it off to choose which APIs the agents get, under “Control Home Assistant”.',
    ownServerTrade: 'The price: every Gitea action runs with the one access token of this app, not with the permissions of whoever asks, and Home Assistant itself becomes the public address. This app’s own remote address keeps Home Assistant out of it.',
    ownServerAdd: 'Add MCP Server integration',
    ownServerDocs: 'Home Assistant documentation',

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
    m_blocked: '{who} refuses the request (HTTP {http}). AI services would be refused the same way: check bot and AI-crawler protection, firewall rules and access policies for this host.',
    m_wrong_target: 'The public address answers, but not with this app (HTTP {http}). Point the tunnel or proxy at port {port} of this app.',
    m_http_status: 'The public Gitea address answers with HTTP {http}.',
    m_login_required: 'Gitea requires a login for everything; add an access token.',
    m_login_required_note: 'Gitea asks for a sign-in before it shows anything. That is fine for the sign-in of the AI services.',
    m_not_gitea: '{url} answers, but it does not look like Gitea (HTTP {http}). Check the address.',
    m_token_rejected: 'Gitea does not accept this access token.',
    m_token_http: 'The token could not be checked (HTTP {http}).',
    m_token_unreachable: 'The token could not be checked because Gitea is not reachable.',
    m_agent_blocked: 'A request that only claims to be {name} (User-Agent {agent}) is {how}, while an ordinary request reaches the app. That is usually bot protection, for example Cloudflare: it lets the real service in by its address and turns look-alikes away. If {name} connects, ignore this.',
    m_agents_blocked: '{count} test request(s) that only claim to be an AI service are refused or cut off, while an ordinary request reaches the app. The real services may still get through. See the list below.',
    m_agent_http: 'The MCP address does not answer with the sign-in challenge of this app (HTTP {http}).',
    m_root_url: 'Gitea announces its sign-in at {endpoint}. Set ROOT_URL in Gitea to {public}/ so that the AI services are sent to the public address.',
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
    preRelease: 'Vorabversion {0}',
    problems: 'Das braucht Aufmerksamkeit',
    openConfig: 'App-Konfiguration öffnen',
    ready: 'Bereit',
    needsRemote: 'Braucht Fernzugriff',
    checkFailed: 'Siehe Prüfungen',
    needsGitea: 'Braucht Gitea',
    setUp: 'Einrichten',
    mcpAddress: 'MCP-Adresse',

    tab_overview: 'Übersicht',
    tab_assist: 'Home Assistant',
    tab_code: 'Claude Code',
    tab_claude: 'claude.ai',
    tab_chatgpt: 'ChatGPT',
    tab_other: 'Andere Agenten',
    tab_remote: 'Fernzugriff',
    openRemote: '„Fernzugriff“ öffnen',

    overviewIntro: 'Diese App lässt KI-Assistenten mit deinem eigenen Gitea arbeiten: Repositories durchsuchen, Dateien lesen sowie Issues und Pull Requests ansehen oder schreiben. Sie spricht das Model Context Protocol (MCP), das viele Assistenten verstehen. Du entscheidest, welche du verbindest; nichts davon ist Pflicht.',
    connection: 'Verbindung',
    noGiteaDetail: 'Trage die Adresse deines Gitea in der App-Konfiguration ein.',
    giteaOk: 'Gitea {0} ist erreichbar',
    giteaOkNoVersion: 'Gitea ist erreichbar',
    giteaDefault: '{0} (die Gitea-App von alexbelgium, der Standard)',
    giteaUrl: '{0} (Adresse aus der App-Konfiguration)',
    giteaBad: 'Gitea antwortet nicht',
    tokenOk: 'Angemeldet als {0}',
    tokenOkDetail: 'Jeder Assistent, der die lokale Adresse nutzt, arbeitet mit den Rechten dieses Zugriffstokens.',
    tokenNone: 'Noch kein Zugriffstoken',
    tokenNoneDetail: 'Ohne Token sind nur öffentliche Daten lesbar. Erstelle in Gitea unter Einstellungen → Anwendungen einen Token und trage ihn in der App-Konfiguration als „Zugriffstoken“ ein. Assistenten, die sich selbst anmelden (claude.ai, ChatGPT, Claude Code), brauchen ihn nicht.',
    tokenBad: 'Der Zugriffstoken funktioniert nicht',
    readOnly: 'Nur lesen',
    readOnlyDetail: 'Werkzeuge, die etwas ändern, sind für jeden Assistenten abgeschaltet.',
    readWrite: 'Lesen und schreiben',
    readWriteDetail: 'Werkzeuge können Issues, Dateien und mehr anlegen und ändern. Bei der lokalen Adresse bestimmt der Zugriffstoken, was erlaubt ist; bei Clients mit Anmeldung ist es das Gitea-Konto dessen, der sich anmeldet.',
    allToolsets: 'Alle Werkzeuggruppen',
    someToolsets: 'Werkzeuggruppen: {0}',
    toolsetsDetail: 'Eine kurze Auswahl hält die Werkzeugliste klein, das hilft Sprachassistenten und spart Token.',
    chooseTitle: 'Was möchtest du verbinden?',
    chooseIntro: 'Such dir die Assistenten aus, die du nutzt. Jeder hat einen eigenen Reiter mit Schritt-für-Schritt-Anleitung.',
    tileAssist: 'Gitea im Sprachassistenten und in Chats innerhalb von Home Assistant nutzen.',
    tileClaude: 'Claude im Browser und in den Apps, über einen benutzerdefinierten Konnektor.',
    tileChatgpt: 'ChatGPT mit Entwicklermodus, über einen benutzerdefinierten Konnektor.',
    tileCode: 'Die Claude-Code-Kommandozeile, mit deiner eigenen Anmeldung.',
    tileOther: 'Cursor, OpenClaw und jedes andere Werkzeug, das MCP versteht.',
    fitsTitle: 'So hängt es zusammen',
    fitsLocal: 'Lokale Adresse: Home Assistant und andere Clients in deinem Netzwerk nutzen den Zugriffstoken aus der App-Konfiguration. Nichts verlässt dein Netzwerk.',
    fitsRemote: 'Öffentliche Adresse: KI-Dienste im Internet erreichen die App über einen Tunnel oder Reverse-Proxy, den du einrichtest, und melden sich per OAuth bei deinem Gitea an, jede Person mit dem eigenen Konto. Dafür ist der Reiter „Fernzugriff“ nötig.',

    assistTitle: 'Home Assistant und Assist',
    assistIntro: 'Home Assistant kann diese App als Werkzeuganbieter für seine Konversationsagenten (Assist) nutzen. Dann kannst du per Sprache oder Chat fragen: „Welche Issues sind in meinem Smart-Home-Repository offen?“ Home Assistant ist hier der MCP-Client.',
    assistStep1: 'Integration hinzufügen',
    assistStep1Text: 'Füge die Integration „Model Context Protocol“ hinzu und trage diese Adresse ein. Es ist die lokale Adresse, sie arbeitet mit dem Zugriffstoken der App.',
    addIntegration: 'Integration hinzufügen',
    assistStep2: 'Dem Assistenten die Werkzeuge geben',
    assistStep2Text: 'Öffne Einstellungen → Sprachassistenten, wähle deinen Assistenten und öffne die Einstellungen seines Konversationsagenten. Aktiviere unter „Home Assistant steuern“ den Eintrag, der nach der Integration benannt ist (meist „Gitea MCP-Server“ oder der Name, den du vergeben hast). Der Konversationsagent muss Werkzeuge unterstützen, zum Beispiel die Integrationen OpenAI, Anthropic, Google oder Ollama. Der eingebaute Assist-Agent ohne Sprachmodell kann das nicht.',
    assistStep3: 'Ausprobieren',
    assistStep3Text: 'Frag in einem Chat mit dem Assistenten: „Liste die offenen Issues von Besitzer/Repository auf.“ oder „Zeig die letzten Commits des Hauptzweigs.“ Passiert nichts, prüfe auf der Übersicht, ob Gitea erreichbar ist.',
    assistTips: 'Tipps',
    assistTip1: 'Lass die App nur lesen, bis du dem Aufbau vertraust. Ein Sprachassistent sollte selten Repositories ändern dürfen.',
    assistTip2: 'Sprachassistenten arbeiten mit weniger Werkzeugen besser. Wähle in der App-Konfiguration unter „Werkzeuggruppen“ nur, was du brauchst, zum Beispiel issue, pull_request und repository.',
    assistTip3: 'Der Zugriffstoken bestimmt alles, was der Assistent sehen und tun kann. Erstelle einen Token nur mit den Rechten, die du erlauben willst, am besten für ein eigenes Gitea-Konto.',
    assistTip4: 'Welche Home-Assistant-Entitäten ein Assistent steuern darf, ist eine andere Einstellung (Einstellungen → Sprachassistenten → Freigeben). Sie beeinflusst diese Werkzeuge nicht.',
    assistOwnPointer: 'Home Assistant hat einen MCP-Server von selbst, der diese Werkzeuge auch Agenten außerhalb anbieten kann. Siehe Reiter „Andere Agenten“.',

    remoteTitle: 'Fernzugriff für KI-Dienste',
    remoteOffIntro: 'claude.ai, ChatGPT und andere Online-Assistenten erreichen dein Heimnetz nicht. Für sie bietet diese App eine zweite, öffentliche Adresse. Sie melden sich per OAuth bei Gitea an (jede Person mit dem eigenen Konto) und brauchen keinen Zugriffstoken.',
    remoteOffNeeds: 'Was du brauchst',
    remoteNeed1: 'Eine öffentliche HTTPS-Adresse, die zu Port 8081 dieser App führt, zum Beispiel über einen Cloudflare-Tunnel, einen Reverse-Proxy oder den Fernzugriff von Home Assistant.',
    remoteNeed2: 'Ein Gitea, dessen Anmeldung aus dem Internet über HTTPS erreichbar ist (setze ROOT_URL in Gitea auf die öffentliche Adresse).',
    remoteNeed3: 'Beide Adressen unter „Fernzugriff“ in der App-Konfiguration. Starte die App danach neu.',
    remoteSecurity: 'Das öffnet die Anmeldung deines Gitea zum Internet. Nutze nur HTTPS, halte Gitea aktuell und überlege, wer sich registrieren darf.',
    remoteOn: 'Die öffentliche Adresse ist eingerichtet. Die Prüfungen unten sehen sie sich von innerhalb deines Netzwerks an.',
    checksTitle: 'Prüfungen',
    checkMcp: 'Die öffentliche MCP-Adresse antwortet',
    checkAgent: 'Anfragen, die sich als KI-Dienste ausgeben (ein Hinweis)',
    checkGitea: 'Die öffentliche Gitea-Adresse antwortet',
    checkOauth: 'Die Anmeldung von Gitea ist aus dem Internet erreichbar',
    checkHint: 'Diese Prüfungen laufen innerhalb deines Netzwerks. Eine fehlgeschlagene Prüfung kann von außen trotzdem funktionieren, wenn dein Router Anfragen nicht zurückleitet. Die Testanfragen für KI-Dienste geben nur vor, von ihnen zu kommen: Ein Bot-Schutz lässt die echten Dienste oft über ihre Adresse hinein und weist Nachahmer ab, eine Abweisung hier heißt also nicht, dass der Dienst abgewiesen wird. Funktioniert dein Konnektor, ignoriere sie.',
    agentsTitle: 'Testanfragen einzeln',
    agentOk: '{0} kommt durch',
    oauthTitle: 'Die OAuth-Anwendung in Gitea',
    oauthIntro: 'Alle Assistenten teilen sich eine OAuth-Anwendung in deinem Gitea. Lege sie einmal an und kopiere die Client-ID; jeder Assistenten-Reiter fragt danach.',
    oauthStep1: 'Anwendung anlegen',
    oauthStep1Text: 'Öffne {0}, lege eine OAuth2-Anwendung mit den Werten unten an und lass „Vertraulicher Client“ abgewählt. Kopiere ihre Client-ID.',
    appName: 'Anwendungsname',
    redirectUris: 'Weiterleitungs-URIs (eine pro Zeile)',
    redirectHint: 'Diese decken claude.ai und Claude Code ab. ChatGPT zeigt für jeden Konnektor eine eigene Callback-Adresse, und andere Werkzeuge haben ihre: Füge jede beim Einrichten des Werkzeugs als weitere Zeile hinzu.',
    needRemoteFirst: 'Richte zuerst die öffentliche Adresse ein (Reiter „Fernzugriff“). Die Schritte unten zeigen die Adressen zum Eintragen.',

    claudeTitle: 'claude.ai',
    claudeIntro: 'Fügt diese App als benutzerdefinierten Konnektor hinzu. Funktioniert auf claude.ai im Browser und in den Claude-Apps für das Konto, das ihn hinzufügt.',
    claudeStep1: 'OAuth-Anwendung anlegen',
    claudeStep1Text: 'Einmal für alle Assistenten, siehe Reiter „Fernzugriff“. Du brauchst ihre Client-ID.',
    claudeStep2: 'Konnektor hinzufügen',
    claudeStep2Text: 'Öffne in claude.ai Einstellungen → Konnektoren → Benutzerdefinierten Konnektor hinzufügen. Gib einen Namen ein und füge die Adresse ein.',
    claudeStep3: 'Client-ID eintragen',
    claudeStep3Text: 'Öffne die erweiterten Einstellungen des Konnektor-Formulars und trage die Client-ID ein. Lass das Secret leer.',
    claudeStep4: 'Anmelden',
    claudeStep4Text: 'Klicke auf „Verbinden“, melde dich bei deinem Gitea an und erlaube den Zugriff. Danach erscheinen die Werkzeuge in deinen Chats; schalte sie pro Chat über das „+“-Menü ein.',
    claudeTrouble: 'Funktioniert die Anmeldung, aber die Verbindung schlägt danach fehl, ist eine häufige Ursache ein Bot-Schutz vor der App, der die Anfragen von Claudes Servern abweist. Die Testanfragen im Reiter „Fernzugriff“ können darauf hinweisen, kommen aber aus deinem eigenen Netzwerk: Nur das Sicherheitsprotokoll deiner Firewall zeigt, was die echten Anfragen bekommen haben.',

    chatgptTitle: 'ChatGPT',
    chatgptIntro: 'Fügt diese App als benutzerdefinierten Konnektor hinzu. Braucht den Entwicklermodus, den ChatGPT in bezahlten Tarifen anbietet.',
    chatgptStep1: 'Entwicklermodus einschalten',
    chatgptStep1Text: 'Öffne in den ChatGPT-Einstellungen Konnektoren → Erweitert und schalte den Entwicklermodus ein.',
    chatgptStep2: 'Neuen Konnektor anlegen',
    chatgptStep2Text: 'Lege einen neuen Konnektor an, gib einen Namen ein, füge die Adresse ein und wähle OAuth als Authentifizierung.',
    chatgptStep3: 'Callback-Adresse von ChatGPT in Gitea eintragen',
    chatgptStep3Text: 'ChatGPT zeigt jetzt eine eigene Callback-Adresse, ähnlich wie https://chatgpt.com/connector/oauth/ gefolgt von einem Zufallswert. Sie ist für jeden Konnektor anders, und Gitea akzeptiert nur Adressen, die es kennt. Öffne deine OAuth-Anwendung in Gitea und füge die Adresse als weitere Weiterleitungs-URI hinzu.',
    chatgptStep4: 'Client-ID eintragen und Konnektor erstellen',
    chatgptStep4Text: 'Trage die Client-ID der OAuth-Anwendung ein, erstelle den Konnektor und melde dich auf Nachfrage bei Gitea an. Schalte den Konnektor danach in einem Chat ein.',
    chatgptTrouble: 'Eine Fehlermeldung über eine nicht registrierte Weiterleitungs-URI heißt: Schritt 3 fehlt, oder die Adresse weicht in einem Zeichen ab.',

    codeTitle: 'Claude Code',
    codeIntro: 'Fügt diese App der Claude-Code-Kommandozeile hinzu. Claude Code meldet sich über einen kleinen Webserver auf deinem eigenen Rechner an.',
    codeStep1: 'OAuth-Anwendung anlegen',
    codeStep1Text: 'Einmal für alle Assistenten, siehe Reiter „Fernzugriff“. Ihre Weiterleitungs-URIs enthalten schon die Adresse für Claude Code. Gitea akzeptiert diese Rücksprungadresse nur mit genau diesem Port, deshalb ist der Port fest.',
    codeStep2: 'Server hinzufügen',
    codeStep2Text: 'Führe das in einem Terminal aus und ersetze die Client-ID.',
    claudeCodeCommand: 'Befehl für dein Terminal',
    codeStep3: 'Anmelden',
    codeStep3Text: 'Starte Claude Code, tippe /mcp, wähle den Server und melde dich im Browserfenster, das sich öffnet, bei Gitea an.',

    otherTitle: 'Andere Agenten',
    otherIntro: 'Alles, was MCP über HTTP versteht, kann diese App nutzen, zum Beispiel Cursor, OpenClaw, Codex oder eigene Skripte. Welche Adresse es braucht, hängt davon ab, wo es läuft.',
    otherAppsTitle: 'Agenten in Home Assistant (Apps)',
    otherAppsText: 'Ein Agent, der als App auf Home Assistant OS läuft, erreicht diese App über ihren Hostnamen im internen Netzwerk von Home Assistant. Es muss nichts geöffnet werden; er nutzt den Zugriffstoken dieser App.',
    otherLanTitle: 'Agenten auf einem anderen Rechner im Netzwerk',
    otherLanText: 'Öffne Port 8080 dieser App unter Netzwerk in der App-Konfiguration. Der andere Rechner erreicht sie dann über die IP-Adresse oder den lokalen Hostnamen des Rechners, auf dem Home Assistant läuft, mit Port 8080. {0} ist eine Vermutung aus der Adresse, mit der du diese Seite geöffnet hast; ersetze sie, wenn der andere Rechner dein Home Assistant unter einem anderen Namen kennt.',
    otherLanWarn: 'Die lokale Adresse hat keine eigene Anmeldung: Wer den Port erreicht, arbeitet mit den Rechten des Zugriffstokens. Nutze sie nur in einem Netzwerk, dem du vertraust.',
    otherConfig: 'Beispiel für Werkzeuge mit „mcpServers“-Konfiguration',
    otherNetTitle: 'Agenten im Internet',
    otherNetText: 'Richte die öffentliche Adresse ein (Reiter „Fernzugriff“). Das Werkzeug muss OAuth mit einer Client-ID unterstützen, die du selbst einträgst, weil Gitea keine automatische Registrierung anbietet. Füge die Callback-Adresse, die das Werkzeug zeigt, der OAuth-Anwendung als weitere Weiterleitungs-URI hinzu.',
    otherNote: 'Einstellungen und Menüs unterscheiden sich je nach Werkzeug. Funktioniert eines nicht, zeigt das App-Protokoll (Debug-Protokoll einschalten), welche Anfragen ankommen.',
    ownServerTitle: 'Optional: über den MCP-Server von Home Assistant selbst',
    ownServerText: 'Statt der Adresse dieser App kann ein Agent die Integration „MCP Server“ von Home Assistant nutzen. Sie bietet die Werkzeuge der LLM-APIs von Home Assistant an, und die Integration „Model Context Protocol“ (Reiter „Home Assistant“) meldet diese App als eine davon an, die Gitea-Werkzeuge kommen also mit. Das folgt der Dokumentation von Home Assistant; mit dieser App wurde es nicht getestet.',
    ownServerAddress: 'Adresse des MCP-Servers von Home Assistant',
    ownServerFacts: 'Was Home Assistant dokumentiert',
    ownServerFact1: 'Integration: „MCP Server“ (Einstellungen → Geräte & Dienste → Integration hinzufügen).',
    ownServerFact2: 'Port 8123, der Port von Home Assistant selbst, Pfad /api/mcp. Cloud-Agenten brauchen ein aus dem Internet über HTTPS erreichbares Home Assistant; Claude Code verlangt HTTPS.',
    ownServerFact3: 'Anmeldung: OAuth mit einem Home-Assistant-Konto (PKCE, kein Client-Secret). „Administratorkonto verlangen“ ist standardmäßig an.',
    ownServerFact4: 'Die Einstellung „Alle LLM-APIs freigeben“ ist standardmäßig an. Schalte sie aus, um unter „Home Assistant steuern“ zu wählen, welche APIs die Agenten bekommen.',
    ownServerTrade: 'Der Preis: Jede Gitea-Aktion läuft mit dem einen Zugriffstoken dieser App, nicht mit den Rechten dessen, der fragt, und Home Assistant selbst wird zur öffentlichen Adresse. Die eigene öffentliche Adresse dieser App hält Home Assistant heraus.',
    ownServerAdd: 'Integration „MCP Server“ hinzufügen',
    ownServerDocs: 'Dokumentation von Home Assistant',

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
    m_blocked: '{who} weist die Anfrage ab (HTTP {http}). KI-Dienste würden genauso abgewiesen: Prüfe Bot- und KI-Crawler-Schutz, Firewall-Regeln und Zugriffsrichtlinien für diesen Host.',
    m_wrong_target: 'Die öffentliche Adresse antwortet, aber nicht mit dieser App (HTTP {http}). Richte den Tunnel oder Proxy auf Port {port} dieser App.',
    m_http_status: 'Die öffentliche Gitea-Adresse antwortet mit HTTP {http}.',
    m_login_required: 'Gitea verlangt für alles eine Anmeldung; trage einen Zugriffstoken ein.',
    m_login_required_note: 'Gitea verlangt eine Anmeldung, bevor es etwas zeigt. Für die Anmeldung der KI-Dienste ist das in Ordnung.',
    m_not_gitea: '{url} antwortet, sieht aber nicht nach Gitea aus (HTTP {http}). Prüfe die Adresse.',
    m_token_rejected: 'Gitea akzeptiert diesen Zugriffstoken nicht.',
    m_token_http: 'Der Token konnte nicht geprüft werden (HTTP {http}).',
    m_token_unreachable: 'Der Token konnte nicht geprüft werden, weil Gitea nicht erreichbar ist.',
    m_agent_blocked: 'Eine Anfrage, die nur vorgibt, von {name} zu kommen (User-Agent {agent}), wird {how}, während eine normale Anfrage die App erreicht. Das ist meist ein Bot-Schutz, zum Beispiel Cloudflare: Er lässt den echten Dienst über dessen Adresse hinein und weist Nachahmer ab. Verbindet sich {name}, ignoriere das.',
    m_agents_blocked: '{count} Testanfrage(n), die nur vorgeben, von einem KI-Dienst zu kommen, werden abgewiesen oder abgebrochen, während eine normale Anfrage die App erreicht. Die echten Dienste kommen womöglich trotzdem durch. Siehe die Liste unten.',
    m_agent_http: 'Die MCP-Adresse antwortet nicht mit der Anmeldeaufforderung dieser App (HTTP {http}).',
    m_root_url: 'Gitea kündigt seine Anmeldung unter {endpoint} an. Setze ROOT_URL in Gitea auf {public}/, damit die KI-Dienste an die öffentliche Adresse geschickt werden.',
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

function remoteChecksOk(status) {
  const checks = status.remote.checks;
  // The test requests for AI services are only a hint, they do not decide whether a client is ready.
  return Boolean(checks) && ['mcp', 'gitea', 'oauth'].every((name) => checks[name].ok);
}

function clientState(status, client) {
  if (client === 'assist' || client === 'other') {
    return status.local.gitea && status.local.gitea.reachable ? ['ok', t('ready')] : ['warn', t('needsGitea')];
  }
  if (!status.remote.public_url) return ['off', t('needsRemote')];
  return remoteChecksOk(status) ? ['ok', t('ready')] : ['warn', t('checkFailed')];
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
  const [state, label] = clientState(status, tab);
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
        tile(status, 'code', 'Claude Code', t('tileCode')),
        tile(status, 'claude', 'claude.ai', t('tileClaude')),
        tile(status, 'chatgpt', 'ChatGPT', t('tileChatgpt')),
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

function agentRows(status, ids) {
  const checks = status.remote.checks;
  if (!checks) return [];
  return checks.agent.agents.filter((agent) => !ids || ids.includes(agent.id))
    .map((agent) => (agent.ok ? row('ok', t('agentOk', agent.name)) : row('warn', agent.name, explain(agent))));
}

function checkRows(status) {
  const checks = status.remote.checks;
  const agentDetail = checks.agent.ok ? null : explain(checks.agent);
  return [
    row(checks.mcp.ok ? 'ok' : 'bad', t('checkMcp'), explain(checks.mcp)),
    row(checks.agent.ok ? 'ok' : 'warn', t('checkAgent'), agentDetail),
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
      field(t('redirectUris'), remote.redirect_uris.join('\n'), remote.redirect_uris.length),
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
    checks && card(t('checksTitle'), ...checkRows(status), el('p', { className: 'muted' }, t('checkHint')),
      checks.agent.agents.length > 0 && el('h3', {}, t('agentsTitle')), ...agentRows(status)),
    oauthCard(status),
  ];
}

// The panels of the assistants that sign in through the public address.
function remoteGate(status) {
  if (status.remote.public_url) return null;
  const open = el('button', { type: 'button' }, t('openRemote'));
  open.addEventListener('click', () => selectTab('remote'));
  return callout('warn', el('p', {}, t('needRemoteFirst')), open);
}

function claudePanel(status) {
  const remote = status.remote;
  return [card(t('claudeTitle'), el('p', {}, t('claudeIntro')), remoteGate(status),
    steps(
      [t('claudeStep1'), el('p', {}, t('claudeStep1Text'))],
      [t('claudeStep2'), el('p', {}, t('claudeStep2Text')), field(t('mcpAddress'), remote.mcp_url || '…')],
      [t('claudeStep3'), el('p', {}, t('claudeStep3Text'))],
      [t('claudeStep4'), el('p', {}, t('claudeStep4Text'))]),
    callout('info', el('p', {}, t('claudeTrouble'))),
    ...agentRows(status, ['claude', 'claude_signin']))];
}

function chatgptPanel(status) {
  return [card(t('chatgptTitle'), el('p', {}, t('chatgptIntro')), remoteGate(status),
    steps(
      [t('chatgptStep1'), el('p', {}, t('chatgptStep1Text'))],
      [t('chatgptStep2'), el('p', {}, t('chatgptStep2Text')), field(t('mcpAddress'), status.remote.mcp_url || '…')],
      [t('chatgptStep3'), el('p', {}, t('chatgptStep3Text'))],
      [t('chatgptStep4'), el('p', {}, t('chatgptStep4Text'))]),
    callout('info', el('p', {}, t('chatgptTrouble'))),
    ...agentRows(status, ['chatgpt', 'openai']))];
}

function codePanel(status) {
  const remote = status.remote;
  const command = `claude mcp add --transport http gitea ${remote.mcp_url || 'https://mcp.example.com/mcp'} --client-id <client-id> --callback-port ${status.claude_code_port}`;
  return [card(t('codeTitle'), el('p', {}, t('codeIntro')), remoteGate(status),
    steps(
      [t('codeStep1'), el('p', {}, t('codeStep1Text'))],
      [t('codeStep2'), el('p', {}, t('codeStep2Text')), field(t('claudeCodeCommand'), command, 3)],
      [t('codeStep3'), el('p', {}, t('codeStep3Text'))]),
    ...agentRows(status, ['claude_code']))];
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
  ['overview', overviewPanel], ['assist', assistPanel], ['code', codePanel], ['claude', claudePanel],
  ['chatgpt', chatgptPanel], ['other', otherPanel], ['remote', remotePanel],
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
  const release = document.getElementById('release');
  const prerelease = status.app.version.includes('-') ? status.app.version.split('-').slice(1).join('-') : '';
  release.hidden = !prerelease;
  release.textContent = t('preRelease', prerelease);
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
