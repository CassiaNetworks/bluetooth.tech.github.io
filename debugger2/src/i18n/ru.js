const ru = {
  // header
  title: 'Инструмент отладки Cassia Bluetooth v2',
  
  // left
  configConnectParams: 'Параметры управления',
  connectStyle: 'Управление',
  serviceURI: 'Сервер',
  devKey: 'Имя пользователя',
  devSecret: 'Пароль',
  apMac: 'Маршрутизатор',
  configScanParams: 'Настройки сканирования',
  useChip: 'Микросхема',
  filterName: 'Фильтр имени',
  filterMac: 'MAC-фильтр',
  fitlerRSSI: 'Фильтр RSSI',
  restartAP: 'Перезагрузить маршрутизатор',
  startScan: 'Начать сканирование',
  stopScan: 'Остановить сканирование',

  configConnParams: 'Connect Settings',
  discovergatt: 'GATT',
  connTimeout: 'Timeout(s)',
  others: 'Others',

  // menu
  configParams: 'Настройки',
  scanList: 'Сканировать устройства',
  connectList: 'Соединение',
  notifyList: 'Уведомление',
  apiLogList: 'Журнал API',
  apiDebugger: 'Отладчик API',
  apiDemo: 'Демонстрация API',
  tools: 'Инструменты',
  resources: 'Ресурсы',

  // scan result tab
  scanResult: 'Результаты сканирования',
  devicesCount: 'Количество устройств',
  searchMacOrName: 'Искать MAC или имя',
  export: 'Экспорт',
  clear: 'Очистить',
  name: 'Имя',
  addr: 'Адрес',
  type: 'Тип',
  signal: 'RSSI',
  operation: 'Работа',
  connect: 'Подключиться',

  // rssi chart tab
  rssiChart: 'График RSSI',
  statsCycle: 'Статистический период',
  seconds60: '60 с',
  statsInterval: 'Статистический интервал',
  millseconds200: '200 мс',
  millseconds500: '500 мс',
  seconds1: '1 с',
  seconds2: '2 с',
  seconds5: '5 с',
  seconds10: '10 с',
  seconds30: '30 с',
  open: 'Открыть',
  stop: 'Stop',
  continue: 'Continue',
  close: 'Остановить',

  // connect list tab
  connectedDevices: 'Подключенные устройства',
  disconnectAll: 'Отключить все',
  chip: 'Микросхема',
  services: 'Услуги',
  disconnect: 'Отключить',
  pair: 'Сопряжение',
  unpair: 'Разорвать пару',
  noParser: 'Нет анализатора',
  field: 'Поле',
  parse: 'Разделенный',

  // notify list tab
  receivedNotifys: 'Количество уведомлений',
  searchMac: 'Искать MAC',
  timestamp: 'Отметка времени',

  // api log tab
  logsCount: 'Количество журналов',
  search: 'Поиск',
  time: 'Время',
  apiName: 'Имя API',
  reqContent: 'Запрос',

  // api debugger
  scanDevices: 'Сканировать устройства',
  scanDevicesInfo: 'Этот API - долгое соединение SSE. После вызова API маршрутизатор Bluetooth просканирует окружающие устройства и установит MAC-адрес (bdaddr), тип адреса (bdaddrType), широковещательные данные (adData / scanData) и имя устройства (имя) устройства Bluetooth, мощность сигнала ( rssi), а другая информация возвращается в виде ответа http.',
  more: 'Больше',
  chip0: 'Микросхема 0',
  chip1: 'Микросхема 1',
  chipAll: 'Both',
  startDebug: 'Отладка',
  genCode: 'Код',
  
  connectDevice: 'Подключить устройство',
  connectDeviceInfo: 'Этот API является интерфейсом синхронного подключения. После вызова API Bluetooth-роутер установит соединение с указанным устройством и вернет результат соединения.',
  addrType: 'Тип адреса',
  deviceAddr: 'MAC-адрес устройства',

  readData: 'Прочитать данные',
  readDataInfo: 'Этот API является основным интерфейсом, отвечающим за связь с устройством, и специально отвечает за чтение данных из указанной службы устройства Bluetooth.',

  writeData: 'Записать данные',
  writeDataInfo: 'Этот API является основным интерфейсом, отвечающим за связь с устройством, и специально отвечает за запись данных в назначенную службу устройства Bluetooth.',
  writeStyle: 'Стиль письма',
  wait: 'Подождите',
  noWait: 'Не ждать',

  disConnect: 'Отключить',
  disConnectInfo: 'Этот API является запросом Удаление. После вызова интерфейса Bluetooth-роутер отключится от Bluetooth-устройства с указанным MAC-адресом.',
  
  connectListInfo: 'Этот API - запрос Получение. После вызова интерфейса Bluetooth-маршрутизатор вернет список подключенных в данный момент устройств.',

  deviceServices: 'Службы устройства',
  deivceServicesInfo: 'Этот API - запрос Получение. После вызова интерфейса маршрутизатор Bluetooth запросит древовидный список своих служб у указанного устройства Bluetooth. Основная цель вызова субинтерфейса - получение характерного соответствия устройства Bluetooth при чтении и записи на устройство Bluetooth. Значение дескриптора или дескриптор.',

  openNotify: 'Открыть уведомление',
  openNotifyInfo: `Этот API представляет собой длинное соединение SSE. Когда уведомление / индикация устройства Bluetooth включены, устройство Bluetooth отправит уведомление на маршрутизатор Bluetooth.`,

  connectStatus: 'Состояние подключения',
  connectStatusInfo: 'Этот API представляет собой длинное соединение SSE. Когда состояние подключения устройства Bluetooth к маршрутизатору Bluetooth изменяется (происходит успешное подключение или отключение), ПК будет уведомлен о сообщении через этот интерфейс.',

  pairInfo: 'Через этот интерфейс вы можете установить соединение с устройствами Bluetooth.',
  ioCap: 'Возможности ввода-вывода',

  pairInput: 'Парный ввод',
  pairInputInfo: 'С помощью этого API вы можете завершить операцию сопряжения ввода с устройством Bluetooth.',
  inputType: 'Тип ввода',

  unpairInfo: 'Этот API представляет собой запрос Удаление. После вызова API Bluetooth-роутер разорвет соединение с Bluetooth-устройством с указанным MAC-адресом.',

  debugResult: 'Результаты отладки',
  connectWriteNotify: '[Одно устройство] Подключить->Записать->Подключить-> Написать-> Получать уведомления',
  test: 'Тест',
  historyApi: 'API история',

  writeCmd: 'Команда записи',

  receiveNotify: 'Получать уведомления',
  receiveDataBySSE: 'Получить данные по SSE',

  clearData: 'Очистить данные',

  scanConnectWriteNotify: '[Несколько устройств] Сканирование->Соединение->Запись',
  connectScannedDevices: 'Подключить отсканированные устройства',

  binaryConversion: 'Базовое преобразование',
  jsonFormatter: 'Форматирование JSON',

  cancel: 'Отмена',
  ok: 'OK',

  router: 'Маршрутизатор',
  noData: 'Нет данных',
  pleaseSelect: 'Пожалуйста, выберите',
  pleaseInput: 'Пожалуйста, введите',
  noMatchData: 'Нет сопоставленных данных',

  // vue.js
  noSupportByAp: 'В настоящее время не поддерживается, используйте режим AC',
  operationFail: 'Операция не удалась',
  operationOk: 'Успешная операция',
  getApInfoOk: 'Получение информации AP выполнено успешно',
  getApInfoFail: 'Не удалось получить информацию о AP',
  rebootApOk: 'AP перезапущен успешно',
  rebootApFail: 'Не удалось перезапустить AP',
  unpairOk: 'Сопряжение успешно выполнено',
  unpairFail: 'Не удалость выполнить сопряжение',
  pairOk: 'Успешное сопряжение',
  pairFail: 'Ошибка сопряжения',
  pairAbort: 'Завершение сопряжения',
  disconnectFail: 'Ошибка отключения',
  testScanOk: 'Тестовое сканирование выполнено успешно',
  testScanFail: 'Ошибка тестового сканирования',
  testWriteOk: 'Тестовая запись данных выполнена успешно',
  testWriteFail: 'Ошибка тестовой записи',
  testConnectFail: 'Ошибка проверки подключенного устройства',
  alreadyStopScan: 'Автоматически остановленное сканирование API',
  debuggerScanAlert: 'Когда API отладки сканирует результат, он автоматически останавливается, и обычный SSE всегда будет получать данные.',
  connectDeviceOk: 'Устройство успешно подключено',
  connectDeviceFail: 'Не удалось подключить устройство',
  readDataOk: 'Данные считаны успешно',
  readDataFail: 'Ошибка чтения данных',
  writeDataOk: 'Данные успешно записаны',
  writeDataFail: 'Ошибка записи данных',
  disconnectDeviceOk: 'Устройство успешно отключено',
  disconnectDeviceFail: 'Ошибка отключения устройства',
  getConnectListOk: 'Успешно получить список подключений',
  getConnectListFail: 'Не удалось получить список подключений',
  getDeviceServiceListOk: 'Успешное получение списка служб устройства',
  getDeviceServiceListFail: 'Не удалось получить список служб устройства',
  alreadyStopNotify: 'Уведомления API были автоматически остановлены',
  openNotifyFail: 'Ошибка уведомления',
  debuggerNotifyAlert: 'После включения API отладки он автоматически остановится после получения результата. Обычный SSE всегда будет получать данные.',
  openConnectStatusFail: 'Не удалось открыть статус подключения',
  openConnectStatusOk: 'Успешно открыт статус подключения',
  openApiResultOk: 'API включен успешно',
  closeApiResultOk: 'API успешно закрыт',
  functionToBeAdd: 'Возможности для добавления',
  clearApiResultOk: 'Успешно очистить результаты API',
  clearNotifyOk: 'Очистска уведомления выполнено успешно',
  openNotifyOk: 'Успешно открыть уведомление',
  closeNotifyOk: 'Успешно закрыть уведомление',
  alert: 'Предупреждение',
  openRssiChartOk: 'Успешно открыть график RSSI',
  openScanOk: 'Успешно открыть сканирование',
  tooManyDeviceScannedAlert: 'Текущее количество сканирующих устройств превышает 5. График RSSI был автоматически закрыт. Настройте соответствующие параметры фильтра сканирования, чтобы предотвратить прервывание.',

  // connect.js
  closeConnectStatusSSE: 'Закрытое состояние соединения SSE, SSE ненормально',

  // operation.js
  sendNotifyOk: 'Успешно отправить уведомление устройству',
  sendNotifyFail: 'Ошибка отправки уведомления устройства',

  // scan.js
  closeScanSSE: 'Остановить сканирование, сбой SSE',
  stopScanOk: 'Успешно остановить сканирование',

  // api
  apiGetToken: 'Получить токен',
  apiOpenNotify: 'Открыть уведомление',
  apiUnpair: 'Разорвать сопряжение',
  apiInfo: 'Информация',
  apiReboot: 'Перезагрузить',
  apiPair: 'Сопряжение',
  apiPairInput: 'Парный ввод',
  apiConnect: 'Подключить',
  apiDisconnect: 'Отключить',
  apiConnectList: 'Подключения',
  apiServiceList: 'Сервисы',
  apiRead: 'Читать',
  apiWrite: 'Запись',
  apiScan: 'Сканировать',
  apiConnectEvent: 'Событие подключения',

  replayApiOperation: 'повтор',
  replayApiOk: 'Воспроизведение API выполнено успешно',
  replayApiFail: 'Ошибка воспроизведения API',

  getAcRouterListFail: 'Не удалось получить список маршрутизации AC, проверьте соответствующие параметры доступа',

  apiDescription: 'Информация об API',
  apiDemoDescription: 'Демо-информация',
  demo1Info: 'Этот пример является примером устройства руководства по эксплуатации для подключения устройства, написания инструкций и получения уведомления устройства',
  demo2Info: 'Этот пример предназначен для работы с несколькими устройствами. Каждый раз, когда сканируется устройство с подходящими условиями, подключите устройство и напишите инструкции',

  demo1: 'Демо 1',
  demo2: 'Демо 2',

  getAccessTokenOk: 'Успешно полученный токен',
  getAccessTokenFail: 'Не удалось получить токен',
  authInfo: 'Когда этот интерфейс используется для отладки AC, он аутентифицируется именем пользователя и паролем для получения токена доступа, и каждый последующий вызов интерфейса должен нести этот токен',

  add2RssiChart: 'Добавить график',
  removeFromRssiChart: 'Удалить график',

  apConfigInfo: 'Пожалуйста, проверьте <span style="color: red; font-weight: bold;">URI маршрутизатора, Разрешить источник</span> configuration.<br>Вы хотите перейти на страницу конфигурации маршрутизатора?',
  acConfigInfo: 'Пожалуйста, проверьте <span style="color: red; font-weight: bold;">AC URI, аккаунт разработчика, Разрешить источник</span> configuration<br>Вы хотите перейти на страницу конфигурации AC?',

  configOrigin: 'Начиная с выпуска v2.0.3, CORS по умолчанию отключен для AC и Gateway. При использовании этого Bluetooth Debug Tool установите «Access Control Allow Origin» в настройках консоли. См. <a target="_blank" style="color: #2897ff; text-decoration: none;" href="https://www.cassianetworks.com/download/docs/Cassia_User_Manual.pdf">Руководство пользователя Cassia </a> для получения подробных инструкций. ',

  autoSelectionOn: 'Auto-Selection',
  on: 'ON',
  off: 'OFF',
  aps: 'Gateways',
  configAutoSelection: 'Please make sure that the AC configuration page has opened the Auto-Selection, by default its closed.',

  oldVersion: 'Old Version',
  auth: 'Auth Token',

  phy: 'PHY',
  secondaryPhy: 'Secondary PHY',
  readPhy: 'Read PHY',
  updatePhy: 'Update PHY',
  moreArgs: 'More Parameters',
  readPhyFail: 'Read PHY failed',
  readPhyOK: 'Read PHY successfully',
  updatePhyFail: 'Update PHY failed',
  updatePhyOK: 'Update PHY successfully',
  apiReadPhy: 'Read PHY',
  apiUpdatePhy: 'Update PHY',

  deviceScanData: 'Scan Data',
  filterDuplicate: 'Filter Duplicates',
  deviceScanDataRealTime: 'Realtime Data',
  scanDetailInfo: 'Data updates every 10ms with up to 2000 entries to avoid lag. See [Realtime Data] for live monitoring.',

  apiReadPhyInfo: 'This is a GET request. When called, the Bluetooth gateway retrieves the PHY information of the specified MAC address, primarily for BLE 5 scenarios.',
  apiUpdatePhyInfo: 'This is a POST request. When called, the Bluetooth gateway updates the PHY information of the specified MAC address, primarily for BLE 5 scenarios.',
};

export default {
  message: ru,
};