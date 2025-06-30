const ja = {
  // header
  title: 'Cassia Bluetooth Debug Tool v2',
  
  // left
  configConnectParams: '操作設定',
  connectStyle: '操作',
  serviceURI: 'サーバー',
  devKey: 'キー',
  devSecret: 'シークレット',
  apMac: 'ルーター',
  configScanParams: 'スキャン設定',
  useChip: 'チップ',
  filterName: '名前フィルター',
  filterMac: 'MAC フィルター',
  fitlerRSSI: 'RSSI フィルター',
  restartAP: 'ルーター再起動',
  startScan: 'スキャン開始',
  stopScan: 'スキャン停止',

  configConnParams: 'Connect Setting',
  discovergatt: 'GATT',
  connTimeout: 'Timeout(s)',
  others: 'Other',

  // menu
  configParams: '設定',
  scanList: 'デバイススキャン',
  connectList: '接続',
  notifyList: '通知',
  apiLogList: 'APIログ',
  apiDebugger: 'APIデバッガー',
  apiDemo: 'APIデモ',
  tools: 'ツール',
  resources: 'リソース',

  // scan result tab
  scanResult: 'スキャン結果',
  devicesCount: 'デバイス数',
  searchMacOrName: 'MACかNameを探す',
  export: '出力',
  clear: 'クリア',
  name: '名前',
  addr: 'アドレス',
  type: 'タイプ',
  signal: 'RSSI',
  operation: '操作',
  connect: '接続',

  // rssi chart tab
  rssiChart: 'RSSI チャート',
  statsCycle: '統計期間',
  seconds60: '60s',
  statsInterval: '統計インターバル',
  millseconds200: '200ms',
  millseconds500: '500ms',
  seconds1: '1s',
  seconds2: '2s',
  seconds5: '5s',
  seconds10: '10s',
  seconds30: '30s',
  open: 'オープン',
  stop: 'ストップ',
  continue: '続ける',
  close: 'クローズ',

  // connect list tab
  connectedDevices: '接続済みのデバイス',
  disconnectAll: '全接続を切る',
  chip: 'チップ',
  services: 'サービス',
  disconnect: '切断',
  pair: 'ペア',
  unpair: 'アンペア',
  noParser: 'No parser',
  field: 'フィールド',
  parse: 'Parsed',

  // notify list tab
  receivedNotifys: '通知数',
  searchMac: 'MAC検索',
  timestamp: 'タイムスタンプ',

  // api log tab
  logsCount: 'ログ数',
  search: '探す',
  time: '時間',
  apiName: 'API名',
  reqContent: 'リクエスト',

  // api debugger
  scanDevices: 'デバイススキャン',
  scanDevicesInfo: 'このAPIはSSEによるロング接続をしております。API呼出し後、Bluetoothルーターは周囲のデバイスと設定したMACアドレス、アドレスタイプ、をスキャンします。(bdaddr), address type (bdaddrType), broadcast data (adData / scanData), and device name (name) of the Bluetooth device, Signal strength (rssi) and other information are returned in the form of その他情報はhttpレスポンスの形式で戻ります。',
  more: 'More',
  chip0: 'Chip0',
  chip1: 'Chip1',
  chipAll: 'Both',
  startDebug: 'デバッグ',
  genCode: 'コード',
  
  connectDevice: '接続デバイス',
  connectDeviceInfo: 'このAPIインタ-フェース接続に同期しています。APIを呼び出した後にBluetoothルータが特定の接続を確立し接続結果に戻ります。',
  addrType: 'アドレスタイプ',
  deviceAddr: 'MACデバイス',

  readData: 'データ読み込み',
  readDataInfo: 'このAPIは、デバイスとの通信を行うメインインターフェースであり、特にBluetoothデバイスの指定したサービスからデータを読み出すことを行います。',

  writeData: 'データ書き込み',
  writeDataInfo: 'このAPIは、デバイスとの通信を行うメインインターフェースであり、特にBluetoothデバイスの指定サービスのデータ書き込みを行います。',
  writeStyle: '書き込み形式',
  wait: '待つ',
  noWait: '待たない',

  disConnect: '未接続',
  disConnectInfo: 'このAPIはDELETEリクエストです。インターフェースを呼び出した後、指定したMACアドレスを持つBluetooth機器との接続を切断します。',
  
  connectListInfo: 'このAPIはGETリクエストです。インターフェースを呼び出した後、Bluetoothルータは現在接続されているデバイスリストを戻します。',

  deviceServices: 'デバイスサービス',
  deivceServicesInfo: 'このAPIはGETリクエストです。インタフェースを呼び出した後、Bluetoothルータは指定されたBluetooth機器に自社サービスのツリーリストを要求します。サブインタフェースを呼び出す主な目的は、Bluetoothデバイスへの読み書きの際に、そのBluetoothデバイスの特性対応を取得することです。バリューハンドルまたはハンドル。',

  openNotify: '通知を開く',
  openNotifyInfo: `本APIはSSEロング接続です。Bluetoothデバイスの通知/表示がONになると、BluetoothデバイスはBluetoothルータに通知メッセージを通知します。`,

  connectStatus: '接続状況',
  connectStatusInfo: 'このAPIはSSEロング接続です。Bluetoothルータ上のBluetooth機器の接続状態を変更した場合(接続成功または切断が発生した場合)に、このインタフェースを介してPCにメッセージを通知します。',

  pairInfo: 'このインターフェイスを介して、Bluetoothデバイスとのペアリングができます。',
  ioCap: 'IO Capability',

  pairInput: 'ペアの入力',
  pairInputInfo: 'このAPIを通じて、Bluetoothデバイスとのペアリング入力操作を完了させることができます。',
  inputType: '入力タイプ',

  unpairInfo: 'このAPIはDELETEリクエストです。このAPIを呼び出した後、Bluetoothルータは指定したMACアドレスを持つBluetoothデバイスとのペアリングを解除します。',

  debugResult: 'デバッグの結果',
  connectWriteNotify: '[シングルデバイス] 接続->書き込み->通知を受け取る',
  test: 'テスト',
  historyApi: 'APIの履歴',

  writeCmd: 'Cmdを書く',

  receiveNotify: '通知を受け取る',
  receiveDataBySSE: 'SSEによってデータを受け取る',

  clearData: 'データをクリア',

  scanConnectWriteNotify: '[複数デバイス] スキャン->接続->書き込み',
  connectScannedDevices: '標準デバイス接続',

  binaryConversion: 'ベースコンバージョン',
  jsonFormatter: 'JSON フォーマッター',

  cancel: 'キャンセル',
  ok: 'OK',

  router: 'ルーター',
  noData: 'データなし',
  pleaseSelect: '選択してください',
  pleaseInput: '入力してください',
  noMatchData: '整合データなし',

  // vue.js
  noSupportByAp: '現在サポートされていません、ACモードをご使用ください',
  operationFail: '操作に失敗',
  operationOk: '操作に成功',
  getApInfoOk: 'AP情報の入手に成功',
  getApInfoFail: 'AP情報の入手に失敗',
  rebootApOk: 'APリスタートに成功',
  rebootApFail: 'APリスタートに失敗',
  unpairOk: '接続解除に成功',
  unpairFail: '接続解除に失敗',
  pairOk: 'ペアリングに成功',
  pairFail: 'ペアリング失敗',
  pairAbort: 'ペアリングの終了',
  disconnectFail: '切断失敗',
  testScanOk: 'テストスキャンに成功',
  testScanFail: 'テストスキャンに失敗',
  testWriteOk: 'データ書き込みテストに成功',
  testWriteFail: 'データ書き込みテストに失敗',
  testConnectFail: 'デバイス接続テストに失敗',
  alreadyStopScan: 'APIスキャンが自動停止',
  debuggerScanAlert: 'デバッグAPIが結果をスキャンすると自動的に停止し、通常のSSEは常にデータを受信します。',
  connectDeviceOk: 'デバイス接続に成功',
  connectDeviceFail: 'デバイス接続に失敗',
  readDataOk: 'データの読み込みに成功',
  readDataFail: 'データの読み込みに失敗',
  writeDataOk: 'データ書き込みに成功',
  writeDataFail: 'データ書き込みに失敗',
  disconnectDeviceOk: 'デバイスの切断に成功',
  disconnectDeviceFail: 'デバイスの切断に失敗',
  getConnectListOk: '接続リストの入手に成功',
  getConnectListFail: '接続リストの入手に失敗',
  getDeviceServiceListOk: 'デバイスサービスリストの入手に成功',
  getDeviceServiceListFail: 'デバイスサービスリストの入手に失敗',
  alreadyStopNotify: 'APIの通知が自動停止',
  openNotifyFail: '通知失敗',
  debuggerNotifyAlert: 'APIデバッグが作動後、結果を入手した後に自動的に停止します。ノーマルSSEがデータを取得します。',
  openConnectStatusFail: '接続ステータスの開始に失敗',
  openConnectStatusOk: '接続ステータスの開始に成功',
  openApiResultOk: 'APIの起動に成功',
  closeApiResultOk: 'APIの終了に成功',
  functionToBeAdd: '追加されました',
  clearApiResultOk: 'API結果のクリアに成功',
  clearNotifyOk: '通知のクリアに成功',
  openNotifyOk: '通知を開くことに成功',
  closeNotifyOk: '通知を閉じることに成功',
  alert: 'Alert',
  openRssiChartOk: 'RSSIチャートが開けました',
  openScanOk: 'スキャンが開けました',
  tooManyDeviceScannedAlert: '現在のスキャン機器数が5を超えています。RSSIチャートは自動的に閉じられています。スタッタリングを防ぐために、適切なスキャンフィルタのパラメータを設定してください。',

  // connect.js
  closeConnectStatusSSE: 'SSE接続状態を終了、SSEが異常',

  // operation.js
  sendNotifyOk: '通知の送信に成功',
  sendNotifyFail: '通知の送信に失敗',

  // scan.js
  closeScanSSE: 'スキャンの中断、SSEが異常',
  stopScanOk: 'スキャンの中断に成功',

  // api
  apiGetToken: 'トークンの入手',
  apiOpenNotify: '通知を開く',
  apiUnpair: 'アンペア',
  apiInfo: '情報',
  apiReboot: 'リブート',
  apiPair: 'ペア',
  apiPairInput: 'ペア入力',
  apiConnect: '接続',
  apiDisconnect: '切断',
  apiConnectList: '接続中',
  apiServiceList: 'サービス',
  apiRead: '読み込む',
  apiWrite: '書き込む',
  apiScan: 'スキャン',
  apiConnectEvent: '接続イベント',

  replayApiOperation: 'リプレイ',
  replayApiOk: 'APIのリプレイに成功',
  replayApiFail: 'APIのリプレイに失敗',

  getAcRouterListFail: 'AC ルーティングリストの取得に失敗しました。アクセスパラメータをチェックしてください',

  apiDescription: 'API情報',
  apiDemoDescription: 'デモ情報',
  demo1Info: 'この実施例は、機器の接続、指示書の作成、機器の通知を受信するための操作ガイド装置の一例であります。',
  demo2Info: 'この実施例では、複数のデバイスを操作する場合を想定しています。適した条件のデバイスがスキャンされるたびに、デバイスを接続して指示を書き込みます',

  demo1: 'デモ1',
  demo2: 'デモ2',

  getAccessTokenOk: 'トークンの取得に成功',
  getAccessTokenFail: 'トークンの取得に失敗',
  authInfo: 'このインタフェースをACデバッグに使用する場合は、開発者キーと開発者シークレットで認証してアクセストークンを取得し、インタフェース呼び出しの度にこのアクセストークンを運ぶ必要があります。',

  add2RssiChart: 'チャートの追加',
  removeFromRssiChart: 'チャートの削除',

  apConfigInfo: '<span style="color: red; font-weight: bold;">Gateway URI, Allow Origin</span>の設定を確認してくださいルーター構成ページへ飛びますか?',
  acConfigInfo: '<span style="color: red; font-weight: bold;">AC URIの設定を確認してください, デヴェロッパーアカウント, 許可する</span> 構成<br>AC構成ページへ飛びますか?',

  configOrigin: 'v2.0.3リリースが開始, CORSはACとルータのデフォルトで表示されます。When using this Bluetoothデバッグツールを使用するとき、コンソールの設定で‘Access Control Allow Origin’を設定してください。 Please refer to <a target="_blank" style="color: #2897ff; text-decoration: none;" href="https://www.cassianetworks.com/download/docs/Cassia_User_Manual.pdf">Cassia User Manual</a> for detailed instruction. ',

  autoSelectionOn: 'Auto-Selection',
  on: 'ON',
  off: 'OFF',
  aps: 'Gateway',
  configAutoSelection: 'Please make sure that the AC configuration page has opened the Auto-Selection, by default its closed.',

  oldVersion: 'Old Version',
  auth: 'Auth Token',

  phy: 'PHY',
  secondaryPhy: 'セカンダリPHY',
  readPhy: 'PHYを読み取る',
  updatePhy: 'PHYを更新',
  moreArgs: '詳細パラメータ',
  readPhyFail: 'PHYの読み取りに失敗',
  readPhyOK: 'PHYの読み取り成功',
  updatePhyFail: 'PHYの更新に失敗',
  updatePhyOK: 'PHYの更新成功',
  apiReadPhy: 'PHY読み取り',
  apiUpdatePhy: 'PHY更新',

  deviceScanData: 'スキャンデータ',
  filterDuplicate: 'Filter Duplicates',
  newTab: 'リアルタイムデータ',
  scanDetailInfo: 'ページの遅延を防ぐため、10ミリ秒ごとにデータを更新し、最大2000件まで対応します。リアルタイムデータを取得するには【リアルタイムデータ】をご覧ください。',

  apiReadPhyInfo: 'このインターフェースはGETリクエストです。呼び出すと、Bluetoothゲートウェイが指定されたMACアドレスのPHY情報を取得します（主にBLE5のシナリオ向け）。',
  apiUpdatePhyInfo: 'このインターフェースはPOSTリクエストです。呼び出すと、Bluetoothゲートウェイが指定されたMACアドレスのPHY情報を更新します（主にBLE5のシナリオ向け）。',
};

export default {
  message: ja,
};