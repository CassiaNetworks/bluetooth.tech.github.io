// Constants
const EXCLUDE_MODEL = ['S2000', 'X2000', 'M500', 'M1000', 'M1500', 'M2000'];
const WIFI_CHANNEL_INDEX = [
	0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
];
const QUALITY_THRESHOLDS = {
	highest: [-100, -70],
	high: [-70, -60],
	medium: [-60, -50],
	low: [-50, -30],
};
const RSSI_NO_DATA = -100;
const PERIODIC_UPDATE_INTERVAL = 3000;
const UPDATE_DELAY = 500;
const ASSESSMENT_DURATION = 180000; // 3 minutes in milliseconds

// Global state
let max = [],
	avg,
	current = [],
	currentTable = 'ble_table',
	table_mapping = {},
	stack = 'rssi',
	wifiRaw = {},
	fetchData = 1,
	wifiData = [],
	wifiTableData = [],
	myChart,
	option;

let timeBtn = $('#timeBtn');
const hash = $(location).prop('hash');
let getwayIpInput; // Will be initialized in document.ready
let localModelSelect; // Will be initialized in document.ready
let updateInterval = null; // Global interval reference for periodic updates
let wifiUpdateInterval = null; // Global interval reference for Wi-Fi periodic updates
let wifiRequestInFlight = false; // Prevent overlapping Wi-Fi polling requests
let assessmentTimeout = null; // Global timeout reference for 3-minute auto-stop
let isInitialLoad = true; // Flag to track first data load
let elapsedSeconds = 0; // Timer seconds counter (counts up internally)
const TOTAL_SECONDS = 180; // 3 minutes total

function getInterferenceConfig() {
	try {
		const savedConfig = localStorage.getItem('interferenceMonitorConfig');
		if (savedConfig) {
			return JSON.parse(savedConfig);
		}
	} catch (e) {
		console.error('Error parsing interference monitor config:', e);
	}
	return { mode: 'local' };
}

function getHashModel() {
	return hash ? hash.replaceAll('#', '').toUpperCase() : '';
}

function getConfiguredLocalIp() {
	const inputValue =
		getwayIpInput && getwayIpInput.length ? getwayIpInput.val() : '';
	const config = getInterferenceConfig();
	return inputValue || config.localIp || localStorage.getItem('gatewayIP') || '';
}

function getConfiguredModel(config = getInterferenceConfig()) {
	if (config.mode === 'ac') {
		return (config.acModel || sessionStorage.getItem('acModel') || getHashModel()).toUpperCase();
	}
	const inputValue =
		localModelSelect && localModelSelect.length ? localModelSelect.val() : '';
	return (
		inputValue ||
		localStorage.getItem('localModel') ||
		sessionStorage.getItem('localModel') ||
		getHashModel()
	).toUpperCase();
}

function normalizeAcAddress(address) {
	return (address || '').replace(/\/+$/, '');
}

function getAssessmentRequest(wifi = false) {
	const config = getInterferenceConfig();
	const mode = config.mode || 'local';

	if (mode === 'ac') {
		const acAddress = normalizeAcAddress(
			config.acAddress || sessionStorage.getItem('acAddress'),
		);
		const token = config.acAuthToken || sessionStorage.getItem('acToken');
		const gatewayMac = config.acGateway || sessionStorage.getItem('acGateway');

		if (!acAddress || !token || !gatewayMac) {
			console.error('AC configuration incomplete');
			if (typeof notificationManager !== 'undefined') {
				notificationManager.error(
					'Configuration Required',
					'Please configure the AC Server, test the connection, and select a gateway.',
					5000,
				);
			}
			return null;
		}

		sessionStorage.setItem('acAddress', acAddress);
		sessionStorage.setItem('acToken', token);
		sessionStorage.setItem('acGateway', gatewayMac);

		let url = `${acAddress}/api/gap/channel/assessment?mac=${encodeURIComponent(
			gatewayMac,
		)}&access_token=${encodeURIComponent(token)}`;
		if (wifi) {
			url += '&wifi=1';
		}

		return {
			mode,
			url,
			model: getConfiguredModel(config),
		};
	}

	const currentIp = getConfiguredLocalIp();
	const baseUrl = currentIp ? `http://${currentIp}` : '';
	if (currentIp) {
		localStorage.setItem('gatewayIP', currentIp);
	}

	return {
		mode,
		url: `${baseUrl}/gap/channel/assessment${wifi ? '?wifi=1' : ''}`,
		nodesUrl: `${baseUrl}/gap/nodes/?connection_state=connected`,
		model: getConfiguredModel(config),
		currentIp,
	};
}

// Timer display helpers
function formatTime(totalSeconds) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function updateTimerDisplay(seconds) {
	elapsedSeconds = seconds;
	const remaining = Math.max(TOTAL_SECONDS - seconds, 0);
	timeBtn.html(formatTime(remaining));

	// Update progress bar
	const progressFill = document.getElementById('timerProgressFill');
	const timerDisplay = document.getElementById('timerDisplay');
	if (progressFill) {
		const percent = Math.min((seconds / TOTAL_SECONDS) * 100, 100);
		progressFill.style.width = percent + '%';
	}

	// Update color state based on remaining time
	if (timerDisplay) {
		timerDisplay.classList.remove('warning', 'danger', 'stopped');
		timerDisplay.classList.add('running');
		if (remaining <= 30) {
			timerDisplay.classList.add('danger');
		} else if (remaining <= 60) {
			timerDisplay.classList.add('warning');
		}
	}
}

function resetTimerDisplay() {
	elapsedSeconds = 0;
	timeBtn.html(formatTime(TOTAL_SECONDS));
	const progressFill = document.getElementById('timerProgressFill');
	const timerDisplay = document.getElementById('timerDisplay');
	if (progressFill) {
		progressFill.style.width = '0%';
	}
	if (timerDisplay) {
		timerDisplay.classList.remove('warning', 'danger', 'stopped', 'running');
	}
}

function stopTimerDisplay() {
	const timerDisplay = document.getElementById('timerDisplay');
	if (timerDisplay) {
		timerDisplay.classList.remove('running');
		timerDisplay.classList.add('stopped');
	}
	timeBtn.html('0:00');
	// Switch play/pause button to play (stopped) state
	const playPauseBtn = $('#btnPlayPause');
	if (playPauseBtn.length) {
		playPauseBtn.html('&#9654;');
		playPauseBtn.addClass('paused');
		playPauseBtn.attr('title', 'Resume');
	}
}

// Loading overlay helpers
function showLoading(text = 'Loading...') {
	const overlay = document.getElementById('loadingOverlay');
	const loadingText = document.getElementById('loadingText');
	if (overlay) {
		if (loadingText) {
			loadingText.textContent = text;
		}
		overlay.classList.add('active');
	}
}

function hideLoading() {
	const overlay = document.getElementById('loadingOverlay');
	if (overlay) {
		overlay.classList.remove('active');
	}
}

function resizeAssessmentChart() {
	const chartWrapper = document.querySelector('.chartWrapper');
	if (chartWrapper) {
		const viewportHeight =
			window.innerHeight || document.documentElement.clientHeight;
		const minHeight = window.matchMedia('(max-width: 768px)').matches
			? 360
			: 420;
		const targetHeight = Math.max(viewportHeight - 128, minHeight);
		chartWrapper.style.height = targetHeight + 'px';
	}
	myChart && myChart.resize();
}

// Helper: Get quality level based on RSSI average
function getQualityLevel(avg) {
	if (
		avg >= QUALITY_THRESHOLDS.highest[0] &&
		avg < QUALITY_THRESHOLDS.highest[1]
	)
		return 'highest';
	if (avg >= QUALITY_THRESHOLDS.high[0] && avg < QUALITY_THRESHOLDS.high[1])
		return 'high';
	if (avg >= QUALITY_THRESHOLDS.medium[0] && avg < QUALITY_THRESHOLDS.medium[1])
		return 'medium';
	if (avg >= QUALITY_THRESHOLDS.low[0] && avg < QUALITY_THRESHOLDS.low[1])
		return 'low';
	return '-';
}

// Helper: Check if model uses single chip
function isSingleChipModel(model) {
	return model && EXCLUDE_MODEL.includes(model);
}

// Helper: Process and rearrange channels
function processChannels(data, model) {
	let channels;
	if (isSingleChipModel(model)) {
		channels = _.concat(data?.chip0?.channels.map((item) => item));
	} else {
		channels = _.concat(
			data?.chip0?.channels.slice(0, 20).map((item) => item),
			data?.chip1?.channels.slice(20).map((item) => item),
		);
	}

	// Rearrange channels: move 37, 38, 39 to their correct positions
	channels.splice(0, 0, channels[37]);
	channels.splice(38, 1);
	channels.splice(12, 0, channels[38]);
	channels.splice(39, 1);

	return channels;
}

// Helper: Get display index for channel
function getChannelDisplayIndex(k) {
	if (k === 0) return 37;
	if (k === 12) return 38;
	if (k === 39) return 39;
	if (k < 13) return k - 1;
	return k - 2;
}

// Helper: Check if PRR should be shown for channel
function shouldShowPRR(k, data, model) {
	if (k < 20) {
		return data.chip0.mode === 1 && ![0, 12, 18, 19].includes(k);
	} else {
		const chipData = isSingleChipModel(model) ? data.chip0 : data.chip1;
		return chipData.mode === 1 && ![22, 39].includes(k);
	}
}

// Helper: Format cell value (handle -100 as no data)
function formatCellValue(value) {
	return value === RSSI_NO_DATA ? '-' : value;
}

// Helper: Clear all assessment data (but preserve Wi-Fi data)
function clearAssessmentData() {
	// Preserve Wi-Fi data by saving it before clearing
	const preservedWifiRaw = wifiRaw;
	const preservedWifiData = wifiData;
	const preservedWifiTableData = wifiTableData;

	// Clear Bluetooth assessment data only
	max = [];
	avg = undefined;
	current = [];
	table_mapping = {};
	fetchData = 1;
	isInitialLoad = true;

	// Restore preserved Wi-Fi data
	wifiRaw = preservedWifiRaw;
	wifiData = preservedWifiData;
	wifiTableData = preservedWifiTableData;

	// Clear timers
	if (updateInterval) {
		clearInterval(updateInterval);
		updateInterval = null;
	}
	if (wifiUpdateInterval) {
		clearInterval(wifiUpdateInterval);
		wifiUpdateInterval = null;
	}
	if (assessmentTimeout) {
		clearTimeout(assessmentTimeout);
		assessmentTimeout = null;
	}
	// Clear Bluetooth table DOM only (preserve Wi-Fi table data)
	$('#ble_table tbody').empty();
	resetTimerDisplay();
	// Reset play/pause button to pause state (running)
	const playPauseBtn = $('#btnPlayPause');
	if (playPauseBtn.length) {
		playPauseBtn.html('&#9646;&#9646;');
		playPauseBtn.removeClass('paused');
		playPauseBtn.attr('title', 'Pause');
	}
}

// Stop assessment: clear interval and send disable commands
function stopAssessment() {
	if (updateInterval) {
		clearInterval(updateInterval);
		updateInterval = null;
	}
	if (wifiUpdateInterval) {
		clearInterval(wifiUpdateInterval);
		wifiUpdateInterval = null;
	}
	if (assessmentTimeout) {
		clearTimeout(assessmentTimeout);
		assessmentTimeout = null;
	}
	fetchData = 0;
	wifiRequestInFlight = false;

	const request = getAssessmentRequest();
	if (!request) {
		stopTimerDisplay();
		return;
	}
	const model = request.model || '';
	const chipCount = isSingleChipModel(model) ? 1 : 2;

	for (let i = 0; i < chipCount; i++) {
		$.ajax({
			url: request.url,
			method: 'POST',
			timeout: 5000,
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({ chip: i + '', enable: '0', mode: '0' }),
		}).fail((error) => {
			console.error(`Failed to disable assessment for chip ${i}:`, error);
		});
	}

	console.log('Assessment complete (3-minute duration reached)');
	if (typeof notificationManager !== 'undefined') {
		notificationManager.info(
			'Assessment Complete',
			'The interference assessment has finished. The gateway has returned to normal working status.',
			10000,
		);
	}
	stopTimerDisplay();
}

// Global function for starting assessment - accessible from outside
function startAssessment() {
	// Show pre-assessment warning dialog
	const overlay = document.getElementById('preAssessmentDialogOverlay');
	const confirmBtn = document.getElementById('preAssessmentConfirmBtn');
	const cancelBtn = document.getElementById('preAssessmentCancelBtn');

	if (!overlay) {
		// Fallback: proceed directly if dialog not found
		executeAssessment();
		return;
	}

	overlay.classList.add('active');

	// Remove previous listeners to avoid duplicates
	const newConfirmBtn = confirmBtn.cloneNode(true);
	confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
	const newCancelBtn = cancelBtn.cloneNode(true);
	cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

	newConfirmBtn.addEventListener('click', function () {
		overlay.classList.remove('active');
		executeAssessment();
	});

	newCancelBtn.addEventListener('click', function () {
		overlay.classList.remove('active');
	});
}

// Internal function that actually starts the assessment
function executeAssessment() {
	// Reset any existing data
	clearAssessmentData();

	const config = getInterferenceConfig();
	if ((config.mode || 'local') === 'ac') {
		startAssessmentWithAC(config);
		return;
	}

	startAssessmentLocal();
}

function startAssessmentWithAC(config) {
	const request = getAssessmentRequest();
	if (!request) {
		stopTimerDisplay();
		return;
	}

	const model = getConfiguredModel(config);
	sessionStorage.setItem('acModel', model);
	showLoading('Starting interference assessment on AC Server...');
	proceedWithAssessmentAC(request.url, model);
}

function proceedWithAssessmentAC(assessmentUrl, model = '') {
	const chipCount = isSingleChipModel(model) ? 1 : 2;
	isInitialLoad = true;

	if (updateInterval) {
		clearInterval(updateInterval);
		updateInterval = null;
	}

	let completedChips = 0;
	let hasError = false;

	for (let i = 0; i < chipCount; i++) {
		$.ajax({
			url: assessmentUrl,
			method: 'POST',
			timeout: 5000,
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({
				chip: i + '',
				enable: '1',
				mode: '0',
			}),
		})
			.fail((error) => {
				completedChips++;
				hasError = true;
				console.error(`AC Assessment start failed for chip ${i}:`, error);
				if (completedChips >= chipCount) {
					hideLoading();
					stopTimerDisplay();
				}
				if (typeof notificationManager !== 'undefined') {
					notificationManager.error(
						'AC Assessment Failed',
						error.statusText || 'Failed to start assessment on AC Server.',
						5000,
					);
				}
			})
			.done((response) => {
				completedChips++;
				console.log(`Assessment started on AC Server for chip ${i}:`, response);
				if (completedChips >= chipCount) {
					hideLoading();
					if (!hasError) {
						startPeriodicUpdate();
					}
				}
			});
	}
}

// Local mode assessment
function startAssessmentLocal() {
	// Get the gateway IP input element if not already stored
	if (!getwayIpInput) {
		getwayIpInput = $('#gateway_ip');
	}
	if (!localModelSelect) {
		localModelSelect = $('#localModel');
	}

	// Get the current IP from input field (empty means use relative URL on gateway)
	const currentIp = getConfiguredLocalIp();
	const model =
		localModelSelect.val() ||
		getConfiguredModel();

	// Build base URL: use relative path if no IP configured (running on gateway)
	const baseUrl = currentIp ? `http://${currentIp}` : '';

	// First check local API availability, then check connected devices
	$.ajax({
		url: `${baseUrl}/gap/channel/assessment`,
		method: 'GET',
		timeout: 5000,
	})
		.done(() => {
			// Local API is available, now check connected devices
			$.get(`${baseUrl}/gap/nodes/?connection_state=connected`)
				.done((response) => {
					if (response?.nodes.length > 0) {
						// Show the pre-assessment warning dialog so user can fix and retry
						stopTimerDisplay();
						startAssessment();
						return;
					}
					proceedWithAssessment(currentIp, model);
				})
				.fail((error) => {
					console.error('Error checking connected devices:', error);
					// Connected devices check failed but API is up, proceed
					proceedWithAssessment(currentIp, model);
				});
		})
		.fail((error) => {
			console.error('Local API check failed:', error);
			hideLoading();
			stopTimerDisplay();
			if (error.status === 404) {
				notificationManager.error(
					'API Not Enabled',
					'The gateway local API is not enabled. Please enable it in the gateway settings.',
					5000,
				);
			} else if (error.status === 500) {
				const respText = error.responseText || '';
				if (respText.indexOf('incorrect mode') !== -1) {
					// Show the pre-assessment warning dialog so user can fix and retry
					startAssessment();
				} else {
					notificationManager.error(
						'Gateway Error',
						'The gateway returned an error: ' + respText,
						5000,
					);
				}
			} else {
				notificationManager.error(
					'Connection Failed',
					'Cannot connect to the gateway. Please verify it is powered on and accessible.',
					5000,
				);
			}
		});
}

// Helper function to actually start the assessment
function proceedWithAssessment(currentIp = '', model = '') {
	// Determine model from hash if not provided (for local mode)
	if (!model) {
		model = getConfiguredModel();
	}

	const chipCount = isSingleChipModel(model) ? 1 : 2;

	// Store model for periodic updates
	localStorage.setItem('localModel', model);

	// Reset initial load flag
	isInitialLoad = true;

	// Show loading while starting assessment
	showLoading('Evaluating environmental interference...');

	// Stop any existing update interval
	if (updateInterval) {
		clearInterval(updateInterval);
		updateInterval = null;
	}

	// Track how many chip requests have completed
	let completedChips = 0;
	let hasError = false;

	for (let i = 0; i < chipCount; i++) {
		const chipIndex = i;
		const baseUrl = currentIp ? `http://${currentIp}` : '';
		const settings = {
			url: `${baseUrl}/gap/channel/assessment`,
			method: 'POST',
			timeout: 5000,
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({
				chip: chipIndex + '',
				enable: '1',
				mode: '0',
			}),
		};

		$.ajax(settings)
			.fail((error) => {
				completedChips++;
				hasError = true;
				console.error(error);
				if (completedChips >= chipCount) {
					hideLoading();
					stopTimerDisplay();
				}
				if (error.status === 404) {
					notificationManager.error(
						'API Not Enabled',
						'The gateway local API is not enabled. Please enable it in the gateway settings.',
						5000,
					);
				} else if (error.status === 500) {
					// "incorrect mode" means gateway is scanning or has connected devices
					const respText = error.responseText || '';
					if (respText.indexOf('incorrect mode') !== -1) {
						// Show the pre-assessment warning dialog so user can fix and retry
						startAssessment();
					} else {
						notificationManager.error(
							'Gateway Error',
							'The gateway returned an error: ' + respText,
							5000,
						);
					}
				}
			})
			.done(function (response) {
				completedChips++;
				console.log('Assessment started:', response);
				// Start periodic update after all chips have responded
				if (completedChips >= chipCount) {
					hideLoading();
					if (!hasError) {
						startPeriodicUpdate();
					}
				}
			});
	}
}

// Function to start periodic data updates every 3 seconds
function startPeriodicUpdate() {
	if (updateInterval) {
		clearInterval(updateInterval);
	}
	if (assessmentTimeout) {
		clearTimeout(assessmentTimeout);
	}

	console.log('startPeriodicUpdate called, fetchData:', fetchData);

	// Initial update after delay
	setTimeout(() => {
		console.log('Executing initial update');
		if (fetchData === 1) {
			try {
				updateAssessmentData();
				console.log('Initial update executed successfully');
			} catch (error) {
				console.error('Error during initial update:', error);
			}
		}
	}, UPDATE_DELAY);

	// Then update every 3 seconds
	updateInterval = setInterval(() => {
		console.log('Executing periodic update, fetchData:', fetchData);
		if (fetchData === 1) {
			try {
				updateAssessmentData();
			} catch (error) {
				console.error('Error during periodic update:', error);
			}
		}
	}, PERIODIC_UPDATE_INTERVAL);

	// Auto-stop after 3 minutes
	assessmentTimeout = setTimeout(() => {
		stopAssessment();
	}, ASSESSMENT_DURATION);

	console.log(
		'Periodic update started - updating every 3 seconds, auto-stop in 3 minutes',
	);

	// Start Wi-Fi data periodic update
	startWiFiPeriodicUpdate();
}

// Function to start periodic Wi-Fi data updates every 3 seconds
function startWiFiPeriodicUpdate() {
	if (wifiUpdateInterval) {
		clearInterval(wifiUpdateInterval);
	}

	console.log('startWiFiPeriodicUpdate called');

	// Initial Wi-Fi data fetch after delay
	setTimeout(() => {
		if (typeof window.refreshWiFiData === 'function') {
			console.log('Executing initial Wi-Fi data fetch');
			try {
				window.refreshWiFiData();
			} catch (error) {
				console.error('Error during initial Wi-Fi data fetch:', error);
			}
		}
	}, UPDATE_DELAY);

	// Then update Wi-Fi data every 3 seconds
	wifiUpdateInterval = setInterval(() => {
		console.log('Executing periodic Wi-Fi data update');
		if (typeof window.refreshWiFiData === 'function') {
			try {
				window.refreshWiFiData();
			} catch (error) {
				console.error('Error during periodic Wi-Fi data update:', error);
			}
		}
	}, PERIODIC_UPDATE_INTERVAL);

	console.log('Wi-Fi periodic update started - updating every 3 seconds');
}

function isTableViewActive() {
	return $('#tableView').is(':visible');
}

function shouldFetchBleAssessment() {
	if (!isTableViewActive()) return true;
	return currentTable === 'ble_table';
}

function shouldFetchWifiAssessment() {
	if (!isTableViewActive()) return true;
	return currentTable === 'wifi_table';
}

// Global update function for assessment data
function updateAssessmentData() {
	// Ensure getwayIpInput is initialized
	if (!getwayIpInput) {
		getwayIpInput = $('#gateway_ip');
	}

	const request = getAssessmentRequest();
	if (!request) {
		stopTimerDisplay();
		return;
	}

	console.log(
		'updateAssessmentData executing in mode:',
		request.mode,
	);

	elapsedSeconds += 3;
	updateTimerDisplay(elapsedSeconds);

	if (!shouldFetchBleAssessment()) {
		return;
	}

	// Only show loading on initial load, not on periodic updates
	if (isInitialLoad) {
		showLoading('Collecting interference data...');
	}

	$.ajax({
		url: request.url,
		method: 'GET',
		timeout: 5000,
	})
		.done(function (data) {
			if (current.length >= 20) {
				current.shift();
			}

			let channels;
			const model = request.model || '';

			if (isSingleChipModel(model)) {
				channels = _.concat(
					data?.chip0?.channels.map((item) => {
						return item;
					}),
				);
			} else if (
				Array.isArray(data?.chip0?.channels) &&
				data.chip0.channels.length > 0 &&
				Array.isArray(data?.chip1?.channels) &&
				data.chip1.channels.length > 0
			) {
				channels = _.concat(
					data.chip0.channels.slice(0, 20).map((item) => {
						return item;
					}),
					data.chip1.channels.slice(20).map((item) => {
						return item;
					}),
				);
			} else if (
				Array.isArray(data?.chip0?.channels) &&
				data.chip0.channels.length > 0
			) {
				channels = [...data.chip0.channels];
			} else if (
				Array.isArray(data?.chip1?.channels) &&
				data.chip1.channels.length > 0
			) {
				channels = [...data.chip1.channels];
			} else {
				channels = [];
			}

			channels.splice(0, 0, channels[37]);
			channels.splice(38, 1);
			channels.splice(12, 0, channels[38]);
			channels.splice(39, 1);
			current.push(channels);

			avg = _.zipWith(...current, (...items) => {
				return _.ceil(_.sum(items) / items.length);
			});
			max = _.zipWith(...current, (...items) => {
				return _.max(items);
			});
			let tableView = $(`#${currentTable} tbody`);
			if (currentTable === 'ble_table') {
				let quality = '',
					currentData = _.last(current);
				for (let k in currentData) {
					k = Number(k);
					if (avg[k] >= -100 && avg[k] < -70) {
						quality = 'highest';
					} else if (avg[k] >= -70 && avg[k] < -60) {
						quality = 'high';
					} else if (avg[k] >= -60 && avg[k] < -50) {
						quality = 'medium';
					} else if (avg[k] >= -50 && avg[k] < -30) {
						quality = 'low';
					}

					let prr = '-',
						currentText,
						maxText,
						avgText;
					if (k < 20) {
						if (
							((data.chip0 && data.chip0.mode === 1) ||
								(data.chip1 && data.chip1.mode === 1)) &&
							k !== 0 &&
							k !== 12 &&
							k !== 18 &&
							k !== 19
						) {
							prr = Math.abs(currentData[k]) + '%';
							currentText = '-';
							maxText = '-';
							avgText = '-';
							quality = '-';
						}
					} else {
						if (model && _.includes(EXCLUDE_MODEL, model)) {
							if (data.chip0 && data.chip0.mode === 1 && k !== 22 && k !== 39) {
								prr = Math.abs(currentData[k]) + '%';
								currentText = '-';
								maxText = '-';
								avgText = '-';
								quality = '-';
							}
						} else {
							if (data.chip1 && data.chip1.mode === 1 && k !== 22 && k !== 39) {
								prr = Math.abs(currentData[k]) + '%';
								currentText = '-';
								maxText = '-';
								avgText = '-';
								quality = '-';
							}
						}
					}

					if (currentData[k] === -100) {
						currentText = '-';
					} else {
						currentText = currentData[k];
					}
					if (max[k] === -100) {
						maxText = '-';
					} else {
						maxText = max[k];
					}

					if (avg[k] === -100) {
						avgText = '-';
						quality = '-';
					} else {
						avgText = avg[k];
					}

					let index = '';
					if (k === 0) {
						index = 37;
					} else if (k === 12) {
						index = 38;
					} else if (k === 39) {
						index = 39;
					} else {
						if (k < 13) index = k - 1;
						else index = k - 2;
					}
					let rawHtml = `<tr>
                        <td>${index}</td>
                        <td>${maxText}</td>
                        <td>${currentText}</td>
                        <td>${avgText}</td>
                        <td>${prr}</td>
                        <td><div class="${
													quality === '-' ? '' : quality
												}">${quality}</div></td>
                    </tr>`;
					if (table_mapping[k] !== undefined) {
						let qualityView = $(
							`#ble_table > tbody > tr:nth-child(${k + 1}) > td:nth-child(6)`,
						);
						tableView[0].rows[k].cells[1].innerText = maxText;

						tableView[0].rows[k].cells[2].innerText = currentText;

						tableView[0].rows[k].cells[3].innerText = avgText;

						tableView[0].rows[k].cells[4].innerText = prr;

						qualityView.text('');
						qualityView.append(
							`<div class="${quality === '-' ? '' : quality}">${quality}</div>`,
						);
					} else {
						tableView.append(rawHtml);
						table_mapping[k] = max[k];
					}
				}
			}

			myChart &&
				myChart.setOption({
					yAxis: {
						max: -30,
						type: 'value',
						interval: 5,
					},
					series: [
						{
							data: max,
							stack: stack,
							smooth: true,
						},
						{
							data: avg,
							stack: stack,
							smooth: true,
							areaStyle: {
								origin: 'start',
								color: {
									type: 'linear',
									x: 0,
									y: 1,
									x2: 0,
									y2: 0,
									colorStops: [
										{
											offset: 0,
											color: '#4C84FF',
										},
										{
											offset: 0.4,
											color: '#90cc7d',
										},
										{
											offset: 0.6,
											color: '#f3aa3d',
										},
										{
											offset: 1,
											color: '#e4514b',
										},
									],
									globalCoord: false,
								},
							},
						},
						{
							data: _.last(current),
							stack: stack,
							smooth: true,
						},
						{
							type: 'scatter',
							name: 'Wi-Fi AP',
							xAxisIndex: 1,
							data: wifiData,
							symbolSize: 12,
							colorBy: 'data',
							symbol:
								'image://data:image/jpeg;base64,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',
							label: {
								show: true,
								position: 'right',
								formatter: (params) => params.name,
								color: '#636466',
								fontSize: 12,
							},
						},
					],
				});
			if (isInitialLoad) {
				hideLoading();
				isInitialLoad = false;
			}
		})
		.fail(function (error) {
			console.error('Error fetching assessment data:', error);
			if (error.status === 404) {
				if (request.mode === 'local') {
					notificationManager.error(
						'API Not Enabled',
						'The gateway local API is not enabled. Please enable it in the gateway settings.',
						5000,
					);
				} else {
					notificationManager.error(
						'AC Request Failed',
						'The AC Server did not return interference assessment data for the selected gateway.',
						5000,
					);
				}
				// Stop periodic updates since API is not available
				if (updateInterval) {
					clearInterval(updateInterval);
					updateInterval = null;
				}
				if (assessmentTimeout) {
					clearTimeout(assessmentTimeout);
					assessmentTimeout = null;
				}
				stopTimerDisplay();
			} else if (request.mode === 'local' && error.status === 500) {
				const respText = error.responseText || '';
				if (respText.indexOf('incorrect mode') !== -1) {
					// Stop assessment since gateway state changed
					if (updateInterval) {
						clearInterval(updateInterval);
						updateInterval = null;
					}
					if (assessmentTimeout) {
						clearTimeout(assessmentTimeout);
						assessmentTimeout = null;
					}
					fetchData = 0;
					stopTimerDisplay();
					// Show the pre-assessment warning dialog so user can fix and retry
					startAssessment();
				}
			}
			if (isInitialLoad) {
				hideLoading();
				isInitialLoad = false;
			}
		});
}

$(document).ready(function () {
	getwayIpInput = $('#gateway_ip'); // Initialize global variable (may not exist in DOM)
	localModelSelect = $('#localModel'); // Initialize global variable (may not exist in DOM)

	// Gateway login check - redirect to login page if not authenticated
	// $.ajax({
	// 	url: '/cassia/info',
	// 	type: 'GET',
	// 	dataType: 'json',
	// 	success: function (data) {},
	// 	error: function (jqXHR) {
	// 		console.error(
	// 			'Request failed: ' + jqXHR.status + ', ' + jqXHR.statusText,
	// 		);
	// 		window.location = '/cassia/login';
	// 	},
	// });

	// Auto-start assessment on page load
	setTimeout(() => {
		console.log('Auto-starting assessment on page load');
		executeAssessment();
	}, 500);

	$('#btnTable').bind('click', function () {
		$('#chartView').hide();
		$('#tableView').show();
		$('#control').show();
		$('#btnChart').removeAttr('disabled');
	});
	$('#btnChart').bind('click', function () {
		getWiFiData();
		$('#tableView').hide();
		$('#chartView').show();

		updateAssessmentData();

		resizeAssessmentChart();
		if (!myChart) myChart = echarts.init(document.querySelector('#chart'));
		myChart && myChart.setOption(option);
		myChart.resize();
		myChart.on('magictypechanged', (params) => {
			if (params.currentType === 'bar') {
				stack = 'rssi';
			} else {
				stack = undefined;
			}
		});
		$('#control').show();
		$('#btnTable').removeAttr('disabled');
	});
	$('#control').bind('click', function () {
		if ($('#control').hasClass('a')) {
			fetchData = 0;
			$('#control').removeClass('a');
			$('#control').addClass('b');
		} else {
			fetchData = 1;
			$('#control').removeClass('b');
			$('#control').addClass('a');
		}
	});
	$('#btnPlayPause').bind('click', function () {
		const btn = $(this);
		if (fetchData === 1 && updateInterval) {
			// Pause (assessment is running)
			fetchData = 0;
			btn.html('&#9654;'); // play triangle
			btn.addClass('paused');
			btn.attr('title', 'Resume');
			const timerDisplay = document.getElementById('timerDisplay');
			if (timerDisplay) {
				timerDisplay.classList.remove('running');
			}
		} else if (!updateInterval) {
			// Assessment has stopped — restart
			startAssessment();
		} else {
			// Resume (assessment is paused)
			fetchData = 1;
			btn.html('&#9646;&#9646;'); // pause bars
			btn.removeClass('paused');
			btn.attr('title', 'Pause');
			const timerDisplay = document.getElementById('timerDisplay');
			if (timerDisplay) {
				timerDisplay.classList.add('running');
			}
		}
	});

	$('#btnBle').bind('click', function () {
		$('#btnBle').addClass('active');
		$('#btnWifi').removeClass('active');
		$('#ble_table').removeClass('hidden');
		$('#wifi_table').addClass('hidden');
		$('#wifi_table tbody').text('');
		currentTable = 'ble_table';
	});

	$('#btnWifi').bind('click', function () {
		$('#btnWifi').addClass('active');
		$('#btnBle').removeClass('active');
		$('#wifi_table').removeClass('hidden');
		$('#ble_table').addClass('hidden');
		currentTable = 'wifi_table';
		getWiFiData();
	});

	const wifiChannelIndex = [
		0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
	];
	let wifi2g;

	function getWiFiData() {
		if (!shouldFetchWifiAssessment()) {
			return;
		}

		if (wifiRequestInFlight) {
			return;
		}
		wifiRequestInFlight = true;

		const request = getAssessmentRequest(true);
		if (!request) {
			wifiRequestInFlight = false;
			return;
		}
		const settings = {
			url: request.url,
			method: 'GET',
			timeout: 5000,
		};

		// Show loading only on first fetch
		const isFirstFetch = _.isEmpty(wifiRaw) || _.isEmpty(wifi2g);
		if (isFirstFetch) {
			showLoading('Scanning for Wi-Fi interference...');
		}

		$.ajax(settings)
			.done(function (response) {
				wifiRaw = response;
				wifi2g = wifiRaw.wifi.results.filter((item) => {
					return item.channel < 14;
				});

				// Clear previous data for fresh update
				wifiData.length = 0;
				wifiTableData.length = 0;

				wifi2g.forEach((item) => {
					// {value: [2,9.8] , name: 'value1'},
					wifiData.push({
						value: [wifiChannelIndex[item.channel], item.signal],
						name: item.ssid,
					});
					let wpaStr =
						'WPA' +
						(item?.encryption?.wpa && item.encryption?.wpa.length >= 2
							? '/WPA2'
							: '');
					let authenticationStr = `${
						(item.encryption?.authentication &&
							item.encryption?.authentication[0]) ||
						''
					} ${
						(item.encryption?.authentication &&
							item.encryption?.authentication[1]) ||
						''
					}`.toUpperCase();
					let ciphersStr = `${
						(item.encryption?.ciphers && item.encryption.ciphers[0]) || ''
					} ${
						(item.encryption?.ciphers && item.encryption.ciphers[1]) || ''
					}`.toUpperCase();

					wifiTableData.push({
						bssid: item.bssid,
						ssid: item.ssid || 'unknown',
						channel: item.channel,
						mode: item.mode,
						signal: item.signal,
						encryption: `${wpaStr} ${authenticationStr} (${ciphersStr})`,
					});
				});
				render();

				// Hide loading animation on first fetch
				if (isFirstFetch) {
					hideLoading();
				}
			})
			.fail(function (error) {
				console.error('Error fetching Wi-Fi data:', error);
				if (isFirstFetch) {
					hideLoading();
				}
				if (request.mode === 'local' && error.status === 404) {
					notificationManager.error(
						'API Not Enabled',
						'The gateway local API is not enabled. Please enable it in the gateway settings.',
						5000,
					);
				}
			})
			.always(function () {
				wifiRequestInFlight = false;
			});
	}

	// Expose getWiFiData globally for periodic updates
	window.refreshWiFiData = getWiFiData;

	function render() {
		if (currentTable === 'ble_table') return;
		let tableView = $(`#${currentTable} tbody`);
		tableView.html('');
		for (let k in wifiTableData) {
			k = Number(k);
			let rawHtml = `<tr>
                        <td>${k + 1}</td>
                        <td>${wifiTableData[k].bssid}</td>
                        <td>${wifiTableData[k].ssid}</td>
                        <td>${wifiTableData[k].channel}</td>
                        <td>${wifiTableData[k].mode}</td>
                        <td>${wifiTableData[k].signal}</td>
                        <td>${wifiTableData[k].encryption}</td>
                    </tr>`;
			tableView.append(rawHtml);
		}
	}

	const app = {};

	stack = undefined;

	option = {
		color: ['#e4514a', '#90cc7d', '#7599e4'],
		grid: {
			left: 30,
			right: 100,
			bottom: 5,
			containLabel: true,
		},
		legend: {
			itemWidth: 12,
			itemHeight: 12,
			top: '15',
			right: 100,
			textStyle: {
				color: '#797979',
				fontSize: 14,
			},
			tooltip: {
				show: true,
			},
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
			},
			backgroundColor: 'rgba(255, 255, 255, 0.8)',
			// position: function (pos, params, el, elRect, size) {
			//     var obj = { top: 10 };
			//     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
			//     return obj;
			// },
			extraCssText: 'width: 170px',
			formatter: function (param) {
				// console.log(param)
				let res = [];

				for (let x = 0; x < param.length; x++) {
					let xAxisIndex = param[x].axisIndex;
					if (!res[xAxisIndex]) {
						res[xAxisIndex] = `${param[x].axisValueLabel} <br/>`;
					}
					if (param[x].seriesIndex > 2) {
						res[xAxisIndex] +=
							`<img style='width:12px;height:12px; display: inline-block' src="data:image/png;base64,
iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAY
dpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKqADAAQAAAABAAAAKgAAAADUGqULAAAG
bElEQVRYCe1YaWxUVRS+5810I5RSYiBlsWqJsiRGBSOyuEAAUUNCf5RoAqE8OqWSahsTF1yCS+ISlyKEtsPMlI
AxsT/EIBRKBYzUuqIEExGCAakBQ4iKQIGZee/6nenc6Xtv3iwtaUIiN5l59571u+eeuwpxvfxPI0BX0++ampri
yxHzEWGKuZLEjULI0SRoNNuUQp4Sgk6RFCeFJjryc7QdjY2Nfw/U34CALq9auUiaZi2AzJJSerNxTkRRwN9Pmr
YutLFpazY6Vpl+AdX1lTNMab4thZhuNdLfOpx2aaQ9Eww2fZWtblZAW1tbPTvb97yL6D2VreFs5BDltQvmz3m6
oqLCyCSfEWhdXd3wc+cvtQLk3EzGBsIH2I6iwoKKhoaGf9LppwXaC7KnS0oxMZ2Rq+URicNFhUOmpwOrpXLCw9
0bycEFyf45EOyLfabCk5IxdNiI9zHcj6dSHAR62bHfjhcd/OnALjfbrkPPs9uQZqebwmDTPKTNdFsNXIeel6DB
BpTKfirfSRHlxdw0zE9SGUqm0wkY+VKQ7CZJfxDJP02iAuRdMWZ0sZDmJCnpfmTimGRdd4rm0cqdm0LSrtK747
gbsFB/1TQR0IS3LRDYcNhCT1n1+XxlEUNbiLx/EqBvSikIRhyDbfeyRTS2d4fNMzCW1AE2jH38F+zbr5eOLfl4
zZo1ptMZ9Ki+vr7owgWZN2/ejLNuC3ls89i9ZxFkX8CB4A6njZgfbLf5udpI69nABhSTaAkm0WanMta5CGCuLh
1X8p4VYGV19SQy5AIM833AOA1yNwCAynsD7dPQQ8RpJ9KiLRRqPKJsw4739+7TqxG/F6Gfo+jqi0m1FJNqi2rb
gC7TfZvRyyWKGfuSOOklz+JAoPEbbnPUVqyoftgQVI/GHJtshgacdeH3Sijk361EK32+u4RBH8HubYoW+5LYsi
noX6poqvfxNo1TDPXVpFivQOr6qtLl+srPDSm2u4HE5LmC/DgOMD8jTbph46Kyw18+zCBf2pfp1Z26/sR4prX4
/T8i4s1ctxc7FmdEj8DarXYFYWjCUy7JKAZ9HYapUPEBLAr5zzDj23I8Yndzc3M3aMDTVzCJJkQMMRNy5WA8BE
7cJ/1LmvAJoovSMD8F3b75kDiKiCaibANaqVefxxAM7XPTW+McteZRrE0UzPfSW01NTSec8qnaHEVTRJ+FLR0y
Md9O20oXHb7QEmxOBMV1dith9XWAPIaJ8RiM/KD4tbW1eT094XtwVrsX7seQlMMQwXOIVjcmRefYsaO+40kYDG
44Bp2qyqqaD4VpBGB3vNW2stf7BcdSbBHFZHIb+oQ456CHciYGAuuPMxHDWhI2qR7AdJgdkRB0VBC1s+CvL8jz
fKCWnKqqVZOjZvSQZZWwa6UbeiT5PkySB+wa9hZ69n1Bvnf25bCx2DTlO+AO75VAzpH4FoBOQoYn6Wjk7jS0i5
QF8P8CQ8/Pz9l/8VKkE/QJipf0JfpiU7D5QUV3DL3kmZq2YDzu7rkSPYqhLYkJkjioadqrXjK3+/1+rLd9hRf3
XR17F6JDWNzlFI460mNrz+UILn7oSJoSuxRa+DagHqF1GMJcYuG7V+MgkQpv4CrxktsOxIpx+lYA3oarzPMY5t
eYDsBpQbIM31xj3/ifDagQBTuIeqIw6KBbVax1WahALltRMwubNHfyFgz9EMA5QJqnLbSxcSfLVC73xVPEqu9e
RwCifL22cmHTXip13170OJEbdq5r600s7nfiHj/fjYu83IaV6CA6/7Ib340GnX0tQf9sKy8pcnzvxgLcH6DPAW
TMJhxEpKBDWAWAnSYDXB46vRDRxS/7whic0o4tVAg+ByLMXU7BTG0M19fYnUoxU6e2hPxTcjzyZqDdm0nPyWff
zrMoyyQBjRHxOOA0kKmN6N0ejVLicIw0H4U4T82k5+Tzw4STxm10wL1gO22A834+ONCZXK+cjuXKwJtUV2IJc3
eRRMWorMWOV5fEAME1oizILxhQtC0RbgbsNDkybIj2KxG5awAgO9in3V5fKyVQXlL4BQMTJKurRsKkFGUYicSp
J0FPU2Ef7EstdW6iKYGyML9c8AtG/yPr5sqdxrYzvZKwZsoctZqN3XOu9UcyK+Br/tnRCpbr1/xDrhMwX6/DYf
koDjJ4kuQ7TvLTOGjdfNjJzaXt6izqtHO9fT0CaSLwH/hOrkjjL5MnAAAAAElFTkSuQmCC" alt="" />` +
							' ' +
							param[x].name +
							'' +
							`<span style="float: right">${param[x].data.value[1]}</span><br/>`;
					} else {
						res[xAxisIndex] +=
							`<i style="width:10px;height:10px;border-radius:50%;background-color:${param[x].color};display: inline-block"></i>` +
							' ' +
							param[x].seriesName +
							'' +
							`<span style="float: right">${param[x].data}</span><br/>`;
					}
				}
				return res.reverse().join('<br/>');
			},
		},
		axisPointer: {
			link: {
				xAxisIndex: 'all',
			},
			label: {
				backgroundColor: '#777',
			},
		},
		dataZoom: [
			{
				type: 'inside',
				yAxisIndex: [0],
				start: 0,
				end: 100,
			},
			{
				type: 'slider',
				show: true,
				width: 20,
				right: 60,
				bottom: 83,
				orient: 'vertical',
				yAxisIndex: 0,
				filterMode: 'empty',
				showDataShadow: false,
			},
		],
		toolbox: {
			// padding: [0, 55, 0, 0],
			show: false,
			// orient: 'vertical',
			// left: 'right',
			// top: 'center',
			dataZoom: {},
			feature: {
				mark: {
					show: true,
				},
				dataView: {
					show: true,
					readOnly: true,
				},
				magicType: {
					show: true,
					type: ['line', 'bar'],
				},
				restore: {
					show: true,
				},
				saveAsImage: {
					show: true,
				},
			},
		},
		calculable: true,
		xAxis: [
			{
				name: 'Bluetooth',
				nameLocation: 'end',
				nameTextStyle: {
					padding: [0, 0, 0, 0],
					fontWeight: 'bold',
					fontSize: 13,
					verticalAlign: 'top',
					color: '#02060e',
				},
				nameGap: 20,
				type: 'category',
				data: [
					37, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 38, 11, 12, 13, 14, 15, 16, 17,
					18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
					35, 36, 39,
				],
				axisPointer: {
					show: true,
					type: 'shadow',
					label: {
						formatter: 'Bluetooth Channel {value}',
					},
				},
				boundaryGap: false,
				axisLine: {
					onZero: false,
				},
				// nameRotate: 10,    // 坐标轴名字旋转，角度值
				// boundaryGap: ['20%', '20%'],    // 坐标轴两边留白策略
				// axisTick: {
				//     show: true,    // 是否显示坐标轴刻度
				//     inside: false,     // 坐标轴刻度是否朝内，默认朝外
				//     length: 1,    // 坐标轴刻度的长度
				//     lineStyle: {
				//         color: '#FFF',     // 刻度线的颜色
				//         width: 1,    // 坐标轴刻度线宽
				//         type: 'dashed',     // 坐标轴线线的类型（'solid'，实线类型；'dashed'，虚线类型；'dotted',点状类型）
				//     },
				// }
			},
			{
				type: 'category',
				position: 'bottom', // 将分组x轴位置定至底部，不然默认在顶部
				name: 'Wi-Fi',
				nameLocation: 'end',
				nameTextStyle: {
					padding: [3, 0, 0, 0],
					fontWeight: 'bold',
					fontSize: 14,
					verticalAlign: 'top',
					backgroundColor: '#606266',
					color: '#fff',
					borderWidth: 3,
					borderColor: '606266',
					borderRadius: [4, 4, 4, 4],
				},
				nameGap: 20,
				boundaryGap: false,
				offset: 23, // 向下偏移，使分组文字显示位置不与原x轴重叠
				axisLine: {
					show: true, // 隐藏分组x轴的轴线
				},
				axisLabel: {
					margin: 3,
					backgroundColor: '#606266',
					color: 'rgba(255, 255, 255, 1)',
					fontSize: 12,
					width: 16,
					// padding: [1, 0],
					formatter: function (val, index) {
						if (parseInt(val) < 100) {
							return val;
						}
					},
				},
				girdIndex: 1,
				data: [
					'2402',
					'2403',
					'2404',
					'2405',
					'2406',
					'2407',
					'2408',
					'2409',
					'2410',
					'2411',
					'1',
					'2413',
					'2414',
					'2415',
					'2416',
					'2',
					'2418',
					'2419',
					'2420',
					'2421',
					'3',
					'2423',
					'2424',
					'2425',
					'2426',
					'4',
					'2428',
					'2429',
					'2430',
					'2431',
					'5',
					'2433',
					'2434',
					'2435',
					'2436',
					'6',
					'2438',
					'2439',
					'2440',
					'2441',
					'7',
					'2443',
					'2444',
					'2445',
					'2446',
					'8',
					'2448',
					'2449',
					'2450',
					'2451',
					'9',
					'2453',
					'2454',
					'2455',
					'2456',
					'10',
					'2458',
					'2459',
					'2460',
					'2461',
					'11',
					'2463',
					'2464',
					'2465',
					'2466',
					'12',
					'2468',
					'2469',
					'2470',
					'2471',
					'13',
					'2473',
					'2474',
					'2475',
					'2476',
					'2477',
					'2478',
					'2479',
					'2480',
				],
				axisPointer: {
					show: true,
					type: 'shadow',
					label: {
						formatter: function (params) {
							if (parseInt(params.value) < 20)
								return 'Wi-Fi Channel ' + params.value;
							else return null;
						},
					},
					// label: {
					//     formatter: "Wi-Fi Channel {value}",
					// },
				},
			},
			{
				type: 'category',
				name: 'Frequency',
				nameLocation: 'end',
				nameTextStyle: {
					padding: [6, 0, 0, 0],
					fontWeight: 'bold',
					fontSize: 13,
					height: 35,
					verticalAlign: 'top',
					color: '#02060e',
				},
				nameGap: 20,
				position: 'bottom', // 将分组x轴位置定至底部，不然默认在顶部
				offset: 45, // 向下偏移，使分组文字显示位置不与原x轴重叠
				axisLabel: {
					// rotate: 90,
					fontStyle: 'oblique',
					rotate: 30,
					formatter: function (value, index) {
						if (parseInt(value) % 2 === 0) {
							return value;
						}
					},
				},
				axisLine: {
					show: true,
				},
				boundaryGap: false,
				data: [
					'2402',
					'2403',
					'2404',
					'2405',
					'2406',
					'2407',
					'2408',
					'2409',
					'2410',
					'2411',
					'2412',
					'2413',
					'2414',
					'2415',
					'2416',
					'2417',
					'2418',
					'2419',
					'2420',
					'2421',
					'2422',
					'2423',
					'2424',
					'2425',
					'2426',
					'2427',
					'2428',
					'2429',
					'2430',
					'2431',
					'2432',
					'2433',
					'2434',
					'2435',
					'2436',
					'2437',
					'2438',
					'2439',
					'2440',
					'2441',
					'2442',
					'2443',
					'2444',
					'2445',
					'2446',
					'2447',
					'2448',
					'2449',
					'2450',
					'2451',
					'2452',
					'2453',
					'2454',
					'2455',
					'2456',
					'2457',
					'2458',
					'2459',
					'2460',
					'2461',
					'2462',
					'2463',
					'2464',
					'2465',
					'2466',
					'2467',
					'2468',
					'2469',
					'2470',
					'2471',
					'2472',
					'2473',
					'2474',
					'2475',
					'2476',
					'2477',
					'2478',
					'2479',
					'2480',
				],
			},
		],
		yAxis: [
			{
				offset: 0,
				// max: -30,
				min: -100,
				type: 'value',
				name: 'RSSI(dbm)',
				nameGap: 30,
				nameLocation: 'middle',
				nameTextStyle: {
					fontWeight: 'bold',
					fontSize: 16,
				},
				axisLine: {
					show: true,
					cap: 'butt',
					lineStyle: {
						// color: {
						//     type: 'linear',
						//     x: 0,
						//     y: 1,
						//     x2: 0,
						//     y2: 0,
						//     colorStops: [
						//         {
						//             offset: 0,
						//             color: '#4C84FF'
						//         },
						//         {
						//             offset: 0.4,
						//             color: '#90cc7d'
						//         },
						//         {
						//             offset: 0.6,
						//             color: '#f3aa3d' // 0% 处的颜色
						//         },
						//         {
						//             offset: 1,
						//             color: '#e4514b' // 100% 处的颜色
						//         }
						//     ],
						//     globalCoord: false // 缺省为 false
						// },
						color: function (value) {
							if (value >= -100 && value <= -70) {
								return '#90cc7d';
							} else if (value >= -70 && value <= -60) {
								return '#7599e4';
							} else if (value >= -60 && value <= -50) {
								return '#f3aa3d';
							} else if (value >= -50 && value <= -30) {
								return '#e4514b';
							}
						},
					},
					onZero: false,
				},
				axisTick: {
					//刻度线
					show: true,
					lineStyle: {
						color: '#7599e4',
					},
				},
				splitLine: {
					show: true,
				},
			},
		],
		series: [
			{
				data: [],
				name: 'Max',
				type: 'line',
				itemStyle: {
					normal: {
						lineStyle: {
							width: 2,
							type: 'dashed', //'dotted'虚线 'solid'实线 'dashed'
						},
					},
				},
			},
			{
				data: [],
				name: 'Average',
				type: 'line',
			},
			{
				data: [],
				name: 'Current',
				type: 'line',
			},
			{
				type: 'scatter',
				name: 'Wi-Fi AP',
				xAxisIndex: 1,
				data: wifiData,
				symbolSize: 12,
				colorBy: 'data',
				symbol:
					'image://data:image/jpeg;base64,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',
				label: {
					show: true,
					position: 'right',
					formatter: (params) => params.name,
					color: '#636466',
					fontSize: 12,
				},
			},
		],
	};

	window.onresize = function () {
		resizeAssessmentChart();
	};
});
