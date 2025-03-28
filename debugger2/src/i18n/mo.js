const mo = {
  // header
  title: 'Cassia Bluetooth Debug Tool v2 (Beta)',
  
  // left
  configConnectParams: 'Setari control',
  connectStyle: 'Control',
  serviceURI: 'Server',
  devKey: 'Cheie',
  devSecret: 'Parola',
  apMac: 'Router',
  configScanParams: 'Setari scanare',
  useChip: 'Cip',
  filterName: 'Filtru nume',
  filterMac: 'Filtru MAC',
  fitlerRSSI: 'Filtru RSSI',
  restartAP: 'Repornire Router',
  startScan: 'Start Scanare',
  stopScan: 'Stop Scanare',

  configConnParams: 'Connect Settings',
  discovergatt: 'GATT',
  connTimeout: 'Timeout(s)',
  others: 'Others',

  // menu
  configParams: 'Setari',
  scanList: 'Scanare dispozitive',
  connectList: 'Conexiune',
  notifyList: 'Notificare',
  apiLogList: 'API Log',
  apiDebugger: 'Debugger API',
  apiDemo: 'Demo API',
  tools: 'Unelte',
  resources: 'Resurse',

  // scan result tab
  scanResult: 'Rezultatele scanarii',
  devicesCount: 'Contor dispozitive',
  searchMacOrName: 'Cauta MAC sau nume',
  export: 'Exportare',
  clear: 'Sterge',
  name: 'Nume',
  addr: 'Adresa',
  type: 'Tip',
  signal: 'RSSI',
  operation: 'Operare',
  connect: 'Conectare',

  // rssi chart tab
  rssiChart: 'Grafic RSSI',
  statsCycle: 'Perioada de statistica',
  seconds60: '60s',
  statsInterval: 'Intervalul de statistica',
  millseconds200: '200ms',
  millseconds500: '500ms',
  seconds1: '1s',
  seconds2: '2s',
  seconds5: '5s',
  seconds10: '10s',
  seconds30: '30s',
  open: 'Deschide',
  stop: 'Stop',
  continue: 'Continua',
  close: 'Inchide',

  // connect list tab
  connectedDevices: 'Dispozitive conectate',
  disconnectAll: 'Deconecteaza toate',
  chip: 'Cip',
  services: 'Servicii',
  disconnect: 'Deconectare',
  pair: 'Cuplare',
  unpair: 'Decuplare',
  noParser: 'Fara Parser',
  field: 'Camp',
  parse: 'Parsat',

  // notify list tab
  receivedNotifys: 'Contor notificari',
  searchMac: 'Cauta MAC',
  timestamp: 'Marcaj de timp',

  // api log tab
  logsCount: 'Contor log-uri',
  search: 'Cautare',
  time: 'Timp',
  apiName: 'Nume API',
  reqContent: 'Request',

  // api debugger
  scanDevices: 'Scanare dispozitive',
  scanDevicesInfo: 'Acest API foloseste o conexiune continua prin intermediul protocolului SSE. Dupa apelarea API-ului, routerul Bluetooth va scana dispozitivele din apropiere si va seta adresa MAC (bdaddr), tipul adresei (bdaddrType), datele difuzate (adData / scanData), si numele (name) dispozitivului Bluetooth, puterea semnalului (rssi) si alte informatii sunt returnate sub forma unor raspunsuri http.',
  more: 'Mai mult',
  chip0: 'Cip0',
  chip1: 'Cip1',
  chipAll: 'Both',
  startDebug: 'Debug',
  genCode: 'Cod',
  
  connectDevice: 'Conectare dispozitiv',
  connectDeviceInfo: 'Acest API este o interfață de conexiune sincronă. Dupa apelarea API-ului, routerul Bluetooth va stabili o conexiune cu dispozitivul specificat si va returna rezultatul conexiunii.',
  addrType: 'Tip adresa',
  deviceAddr: 'MAC dispozitiv',

  readData: 'Citire date',
  readDataInfo: 'Acest API este interfata principala responsabila de comunicarea cu dispozitivul, si este in mod specific responsabila de citirea datelor de la serviciile specificate ale dispozitivului Bluetooth.',

  writeData: 'Scriere date',
  writeDataInfo: 'Acest API este interfata principala responsabila de comunicarea cu dispozitivul, si este in mod specific responsabila de scrierea datelor catre serviciile specificate ale dispozitivului Bluetooth.',
  writeStyle: 'Stil scriere',
  wait: 'Asteptare',
  noWait: 'Fara asteptare',

  disConnect: 'Deconectare',
  disConnectInfo: 'Acest API este un DELETE request. Dupa apelarea interfetei, routerul Bluetooth se va deconecta de la dispozitivul Bluetooth cu adresa MAC specificata.',
  
  connectListInfo: 'Acest API este un GET request. Dupa apelarea interfetei, routerul Bluetooth va returna o lista a dispozitivelor conectate actual.',

  deviceServices: 'Servicii dispozitiv',
  deivceServicesInfo: 'Acest API este un GET request. Dupa apelarea interfetei, routerul Bluetooth va solicita un arbore al serviciilor de la dispozitivul Bluetooth specificat. Scopul principal al apelarii interfetei secundare este de a obtine corespondenta caracteristica a dispozitivului Bluetooth, atunci cand se citeste si se scrie la dispozitivul Bluetooth. ValueHandle sau handle.',

  openNotify: 'Deschide notificare',
  openNotifyInfo: `Acest API foloseste o conexiune continua prin intermediul protocolului SSE. Atunci cand sunt pornite notificarile / indicatiile dispozitivului Bluetooth, acesta va raporta un mesaj de notificare catre routerul Bluetooth.`,

  connectStatus: 'Starea conexiunii',
  connectStatusInfo: 'Acest API foloseste o conexiune continua prin intermediul protocolului SSE. Atunci cand se modifica starea conexiunii dispozitivului Bluetooth pe routerul Bluetooth (conexiune realizata cu succes sau deconectare), PC-ul este notificat cu mesaj prin aceasta interfata.',

  pairInfo: 'Prin aceasta interfata, puteti efectua cuplari cu dispozitive Bluetooth.',
  ioCap: 'Capabilitate IO',

  pairInput: 'Input cuplaj',
  pairInputInfo: 'Prin acest API, puteti efectua operatiunea de input cuplaj cu dispozitivul Bluetooth.',
  inputType: 'Tip input',

  unpairInfo: 'Acest API este un DELETE request. Dupa apelarea API-ului, routerul Bluetooth se va decupla de la dispozitivul Bluetooth cu adresa Mac specificata.',

  debugResult: 'Rezultate Debug',
  connectWriteNotify: '[Dispozitiv unic] Conectare->Scriere->Primire notificari',
  test: 'Test',
  historyApi: 'API istoric',

  writeCmd: 'Scriere Cmd',

  receiveNotify: 'Primire notificari',
  receiveDataBySSE: 'Primire date prin SSE',

  clearData: 'Stergere date',

  scanConnectWriteNotify: '[Dispozitive multiple] Scanare->Conectare->Scriere',
  connectScannedDevices: 'Conectare dispozitive scanate',

  binaryConversion: 'Conversie de baza',
  jsonFormatter: 'Formatter JSON',

  cancel: 'Anulare',
  ok: 'OK',

  router: 'Router',
  noData: 'Nu exista date',
  pleaseSelect: 'Va rugam, selectati',
  pleaseInput: 'Va rugam, introduceti',
  noMatchData: 'Nu exista date corespunzatoare',

  // vue.js
  noSupportByAp: 'In prezent nu este suportat, va rugam folositi modul AC',
  operationFail: 'Operatiunea a esuat',
  operationOk: 'Operatiune efectuata cu succes',
  getApInfoOk: 'Obtinerea informatiilor AP efectuata cu succes',
  getApInfoFail: 'Obtinerea informatiilor AP a esuat',
  rebootApOk: 'AP a fost repornit cu succes',
  rebootApFail: 'Repornirea AP a esuat',
  unpairOk: 'Decuplare efectuata cu succes',
  unpairFail: 'Decuplarea a esuat',
  pairOk: 'Cuplare efectuata cu succes',
  pairFail: 'Cuplarea a esuat',
  pairAbort: 'Terminare cuplaj',
  disconnectFail: 'Deconectarea a esuat',
  testScanOk: 'Test de scanare efectuat cu succes',
  testScanFail: 'Testul de scanare a esuat',
  testWriteOk: 'Test de scriere date efectuat cu succes',
  testWriteFail: 'Testul de scriere date a esuat',
  testConnectFail: 'Testul de dispozitiv conectat a esuat',
  alreadyStopScan: 'Scanarea API a fost oprita automat',
  debuggerScanAlert: 'Atuni cand API-ul de debugging scaneaza rezultatele, acesta se opreste automat, iar SSE normal va primi intotdeauna date.',
  connectDeviceOk: 'Dispozitiv conectat cu succes',
  connectDeviceFail: 'Conectarea dispozitivului a esuat',
  readDataOk: 'Citire date efectuata cu succes',
  readDataFail: 'Citirea datelor a esuat',
  writeDataOk: 'Scriere date efectuata cu succes',
  writeDataFail: 'Scrierea datelor a esuat',
  disconnectDeviceOk: 'Dispozitivul a fost deconectat cu succes',
  disconnectDeviceFail: 'Deconectarea dispozitivului a esuat',
  getConnectListOk: 'Lista conexiunilor obtinuta cu succes',
  getConnectListFail: 'Obtienrea listei conexiunilor a esuat',
  getDeviceServiceListOk: 'Lista serviciilor dispozitivului obtinuta cu succes',
  getDeviceServiceListFail: 'Obtinerea listei serviciilor dispozitivului a esuat',
  alreadyStopNotify: 'Notificarile API au fost oprite automat',
  openNotifyFail: 'Notificarea a esuat',
  debuggerNotifyAlert: 'Dupa pornirea API-ului de debugging, acesta se va opri automat dupa obtinerea rezultatului. SSE normal va primi intotdeauna date.',
  openConnectStatusFail: 'Deschiderea starii de conexiune a esuat',
  openConnectStatusOk: 'Stare conexiune deschisa cu succes',
  openApiResultOk: 'API pornit cu succes',
  closeApiResultOk: 'API inchis cu succes',
  functionToBeAdd: 'Functionalitati de adaugat',
  clearApiResultOk: 'Rezultate API sterse cu succes',
  clearNotifyOk: 'Stergere notificare efectuata cu succes',
  openNotifyOk: 'Notificare deschisa cu succes',
  closeNotifyOk: 'Notificare inchisa cu succes',
  alert: 'Alerta',
  openRssiChartOk: 'Graficul RSSI a fost deschis cu succes',
  openScanOk: 'Scanarea a fost deschisa cu succes',
  tooManyDeviceScannedAlert: 'Numarul actual al dispozitivelor de scanare este de peste 5. Graficul RSSI a fost inchis automat. Va rugam, configurati parametrii de filtrare corecti pentru scanare, pentru a preveni fluctuatiile.',

  // connect.js
  closeConnectStatusSSE: 'SSE stare conexiune inchisa, SSE anormal',

  // operation.js
  sendNotifyOk: 'Notificare dispozitiv trimisa cu succes',
  sendNotifyFail: 'Trimiterea notificarii dispozitivului a esuat',

  // scan.js
  closeScanSSE: 'Oprire scanare, SSE anormal',
  stopScanOk: 'Scanarea a fost oprita cu succes',

  // api
  apiGetToken: 'Obtinere Token',
  apiOpenNotify: 'Deschidere notificare',
  apiUnpair: 'Decuplare',
  apiInfo: 'Info',
  apiReboot: 'Repornire',
  apiPair: 'Cuplare',
  apiPairInput: 'Input cuplaj',
  apiConnect: 'Conectare',
  apiDisconnect: 'Deconectare',
  apiConnectList: 'Conexiuni',
  apiServiceList: 'Servicii',
  apiRead: 'Citire',
  apiWrite: 'Scriere',
  apiScan: 'Scanare',
  apiConnectEvent: 'Event de conexiune',

  replayApiOperation: 'reluare',
  replayApiOk: 'Reluare API efectuata cu succes',
  replayApiFail: 'Reluare API a esuat',

  getAcRouterListFail: 'Obtinerea listei de routing AC a esuat, va rugam, verificati parametrii de acces asociati',

  apiDescription: 'Info API',
  apiDemoDescription: 'Demo Info',
  demo1Info: 'Acesta esta un exemplu, un ghid de operare pentru conectarea unui dispozitiv, scrierea instructiunilor si primirea notificarilor de la dispozitiv',
  demo2Info: 'Acest exemplu arata operatiunea cu dispozitive multiple. Atunci cand un dispozitiv avand conditii potrivite este scanat, conectati dispozitivul si scrieti intructiuni',

  demo1: 'Demo 1',
  demo2: 'Demo 2',

  getAccessTokenOk: 'Token obtinut cu succes',
  getAccessTokenFail: 'Obtinerea token-ului a esuat',
  authInfo: 'Atunci cand aceasta interfata este folosita pentru AC debugging, ea este autentificata prin cheia si parola utilizatorului pentru a obtine access_token, si fiecare apel ulterior la interfata trebuie sa contina acest token.',

  add2RssiChart: 'Adaugare grafic',
  removeFromRssiChart: 'Indepartare grafic',

  apConfigInfo: 'Va rugam, verificati configurarea <span style="color: red; font-weight: bold;">Router URI, Allow Origin</span>. <a target="_blank" style="color: #2897ff; " href="./Debugger2-Troubleshooting.pdf">Debugger2-Troubleshooting</a><br>Doriti sa treceti la pagina de configurare a routerului?',
  acConfigInfo: 'Va rugam, verificati configurarea <span style="color: red; font-weight: bold;">AC URI, cont utilizator, Allow Origin</span>.<br>Doriti sa treceti la pagina de configurare a AC-ului?',

  configOrigin: 'Incepand cu versiunea v2.0.3, CORS este dezactivat implicit pe AC si router. La utilizarea acestui Bluetooth Debug Tool, va rugam sa setati ‘Access Control Allow Origin’ in setarile de consola. Pentru instructiuni detaliate, va puteti referi la <a target="_blank" style="color: #2897ff; text-decoration: none;" href="https://www.cassianetworks.com/download/docs/Cassia_User_Manual.pdf">manualul de utilizare Cassia</a>. ',

  autoSelectionOn: 'Auto-Selection',
  on: 'ON',
  off: 'OFF',
  aps: 'Routers',
  configAutoSelection: 'Please make sure that the AC configuration page has opened the Auto-Selection, by default its closed.',
};

export default {
  message: mo,
};