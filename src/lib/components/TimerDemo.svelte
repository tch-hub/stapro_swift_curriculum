<script>
	import { onMount } from 'svelte';

	let timerInterval = null;
	let remainingTime = 0;
	let totalTime = 0;
	let isRunning = false;

	// DOM要素の参照
	let setupMode;
	let timerMode;
	let alertModal;
	let timeDisplay;
	let progressCircle;
	let startBtn;
	let pauseBtn;
	let resetBtn;
	let timerCancelBtn;
	let alertOkBtn;
	let notificationBanner;
	let notificationCloseBtn;
	let wheelPickers;

	onMount(() => {
		// DOM要素を取得
		setupMode = document.getElementById('setup-mode');
		timerMode = document.getElementById('timer-mode');
		alertModal = document.getElementById('alert-modal');
		timeDisplay = document.getElementById('time-display');
		progressCircle = document.getElementById('progress-circle');
		startBtn = document.getElementById('start-btn');
		pauseBtn = document.getElementById('pause-btn');
		resetBtn = document.getElementById('reset-btn');
		timerCancelBtn = document.getElementById('timer-cancel-btn');
		alertOkBtn = document.getElementById('alert-ok-btn');
		notificationBanner = document.getElementById('notification-banner');
		notificationCloseBtn = document.getElementById('notification-close-btn');
		wheelPickers = document.querySelectorAll('.wheel-picker');

		// イベントリスナーを設定
		if (startBtn) startBtn.addEventListener('click', startTimer);
		if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
		if (resetBtn) resetBtn.addEventListener('click', resetTimer);
		if (timerCancelBtn) timerCancelBtn.addEventListener('click', resetTimer);
		if (alertOkBtn) alertOkBtn.addEventListener('click', closeAlert);
		if (notificationCloseBtn) notificationCloseBtn.addEventListener('click', closeNotification);

		// ホイールピッカーの初期化
		wheelPickers.forEach((picker) => {
			initializeWheelPicker(picker);
		});
	});

	function formatTime(seconds) {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	function updateProgress() {
		if (totalTime === 0) return;
		const progress = remainingTime / totalTime;
		const circumference = 565.48; // 2 * π * 90
		const offset = circumference - progress * circumference;
		if (progressCircle) {
			progressCircle.style.strokeDashoffset = offset;
		}
	}

	function startTimer() {
		const hours = parseInt(document.querySelector('[data-unit="hours"]').dataset.value);
		const minutes = parseInt(document.querySelector('[data-unit="minutes"]').dataset.value);
		const seconds = parseInt(document.querySelector('[data-unit="seconds"]').dataset.value);
		totalTime = hours * 3600 + minutes * 60 + seconds;

		console.log('Timer values:', { hours, minutes, seconds, totalTime });

		if (totalTime === 0) {
			showNotification('時間を設定してください', '⚠️');
			return;
		}

		remainingTime = totalTime;
		isRunning = true;

		// UIを切り替え
		if (setupMode) setupMode.style.display = 'none';
		if (timerMode) timerMode.style.display = 'flex';
		if (pauseBtn) pauseBtn.textContent = '一時停止';

		// プログレスバーを満杯の状態に設定
		updateProgress();

		// タイマーを開始
		timerInterval = setInterval(() => {
			if (remainingTime > 0) {
				remainingTime--;
				if (timeDisplay) timeDisplay.textContent = formatTime(remainingTime);
				updateProgress();
			} else {
				// タイマー終了
				clearInterval(timerInterval);
				isRunning = false;
				showNotification('時間です！', '⏰');
				if (alertModal) alertModal.style.display = 'flex';
				playAlarm();
			}
		}, 1000);
	}

	function pauseTimer() {
		if (isRunning) {
			clearInterval(timerInterval);
			isRunning = false;
			if (pauseBtn) pauseBtn.textContent = '再開';
		} else {
			timerInterval = setInterval(() => {
				if (remainingTime > 0) {
					remainingTime--;
					if (timeDisplay) timeDisplay.textContent = formatTime(remainingTime);
					updateProgress();
				} else {
					clearInterval(timerInterval);
					isRunning = false;
					if (alertModal) alertModal.style.display = 'flex';
					playAlarm();
				}
			}, 1000);
			isRunning = true;
			if (pauseBtn) pauseBtn.textContent = '一時停止';
		}
	}

	function resetTimer() {
		clearInterval(timerInterval);
		isRunning = false;
		remainingTime = 0;
		totalTime = 0;

		// UIをリセット
		if (setupMode) setupMode.style.display = 'flex';
		if (timerMode) timerMode.style.display = 'none';
		if (timeDisplay) timeDisplay.textContent = '00:00:00';
		if (progressCircle) progressCircle.style.strokeDashoffset = '565.48';
	}

	function closeAlert() {
		if (alertModal) alertModal.style.display = 'none';
		resetTimer();
	}

	function showNotification(message = '時間です！', icon = '⏰', showButton = true) {
		if (notificationBanner) {
			// メッセージとアイコンを更新
			const iconElement = notificationBanner.querySelector('.notification-icon');
			const messageElement = notificationBanner.querySelector('.notification-message');
			const buttonElement = notificationBanner.querySelector('#notification-close-btn');

			if (iconElement) iconElement.textContent = icon;
			if (messageElement) messageElement.textContent = message;
			if (buttonElement) buttonElement.style.display = showButton ? 'block' : 'none';

			notificationBanner.style.display = 'block';
			// アニメーションで表示
			setTimeout(() => {
				notificationBanner.style.transform = 'translateY(0)';
			}, 100);

			// 警告通知の場合は自動で非表示にしない
			if (!showButton) {
				setTimeout(() => {
					notificationBanner.style.transform = 'translateY(-100%)';
					setTimeout(() => {
						notificationBanner.style.display = 'none';
					}, 300);
				}, 3000);
			}
		}
	}

	function closeNotification() {
		if (notificationBanner) {
			notificationBanner.style.transform = 'translateY(-100%)';
			setTimeout(() => {
				notificationBanner.style.display = 'none';
			}, 300);
		}
		resetTimer();
	}

	function playAlarm() {
		// Web Audio APIでビープ音を再生
		try {
			const audioContext = new (window.AudioContext || window.webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.5);
		} catch (error) {
			// Audio APIが利用できない場合は何もしない
			console.log('Audio not available', error);
		}
	}

	function initializeWheelPicker(picker) {
		const container = picker.querySelector('.wheel-container');
		let selectedIndex = 0;
		let startY = 0;
		let currentY = 0;
		let isDragging = false;
		let dragStartY = 0;

		// ユニットに基づいて項目を生成
		const unit = picker.dataset.unit;
		let maxValue, unitLabel;

		switch (unit) {
			case 'hours':
				maxValue = 24;
				unitLabel = '時間';
				break;
			case 'minutes':
			case 'seconds':
				maxValue = 59;
				unitLabel = unit === 'minutes' ? '分' : '秒';
				break;
			default:
				maxValue = 59;
				unitLabel = '';
		}

		// 項目を動的に生成
		for (let i = 0; i <= maxValue; i++) {
			const item = document.createElement('div');
			item.className = 'wheel-item';
			item.dataset.value = i;
			item.textContent = `${i} ${unitLabel}`;
			container.appendChild(item);
		}

		// 生成された項目を取得
		const newItems = container.querySelectorAll('.wheel-item');

		// 初期選択状態を設定
		updateSelection();

		// マウスイベント
		picker.addEventListener('mousedown', startDrag);
		document.addEventListener('mousemove', drag);
		document.addEventListener('mouseup', endDrag);

		// タッチイベント
		picker.addEventListener('touchstart', startDrag, { passive: false });
		document.addEventListener('touchmove', drag, { passive: false });
		document.addEventListener('touchend', endDrag);

		function startDrag(e) {
			e.preventDefault();
			isDragging = true;
			startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
			dragStartY = startY;
			// 現在のtransformを取得
			const currentTransform = container.style.transform || 'translateY(0px)';
			const match = currentTransform.match(/translateY\((-?\d+)px\)/);
			currentY = match ? parseInt(match[1]) : 0;
		}

		function drag(e) {
			if (!isDragging) return;
			e.preventDefault();
			const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
			const deltaY = clientY - startY;
			// ドラッグ中の位置を計算（スムーズに動かす）
			const newY = currentY + deltaY;
			container.style.transform = `translateY(${newY}px)`;
		}

		function endDrag(e) {
			if (!isDragging) return;
			isDragging = false;
			const clientY = e.type === 'mouseup' ? e.clientY : e.changedTouches[0].clientY;
			const totalDeltaY = clientY - dragStartY;
			const itemHeight = 30;

			// 最終的なインデックスを計算
			const indexDelta = Math.round(totalDeltaY / itemHeight);
			selectedIndex = Math.max(0, Math.min(newItems.length - 1, selectedIndex - indexDelta));

			// スナップして選択状態を更新
			updateSelection();
			snapToItem();
			setSelectedIndex(selectedIndex); // picker.dataset.valueを更新
		}

		function setSelectedIndex(index) {
			selectedIndex = index;
			updateSelection();
			picker.dataset.value = newItems[selectedIndex].dataset.value;
		}

		function updateSelection() {
			newItems.forEach((item, index) => {
				item.classList.toggle('selected', index === selectedIndex);
			});
		}

		function snapToItem() {
			const itemHeight = 30;
			const targetY = -selectedIndex * itemHeight + 45; // 中央に配置
			container.style.transform = `translateY(${targetY}px)`;
		}

		// 初期位置を設定
		snapToItem();
	}
</script>

<div class="mockup-phone">
	<div class="mockup-phone-camera"></div>
	<div class="mockup-phone-display bg-[#F2F2F7] text-black">
		<!-- タイマーデモ -->
		<div id="timer-demo" class="relative flex h-full flex-col items-center justify-center p-4">
			<!-- iOSスタイル通知バナー -->
			<div
				id="notification-banner"
				class="absolute top-4 right-4 left-4 z-50 -translate-y-full transform rounded-lg bg-white p-3 text-black shadow-lg transition-transform duration-300"
				style="display: none;"
			>
				<div class="flex items-center space-x-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
						<span class="notification-icon text-sm text-white">⏰</span>
					</div>
					<div class="flex-1">
						<div class="text-sm font-semibold">タイマー</div>
						<div class="notification-message text-xs text-gray-600">時間です！</div>
					</div>
					<button
						id="notification-close-btn"
						class="text-xs font-medium text-blue-600 hover:text-blue-800"
					>
						完了
					</button>
				</div>
			</div>
			<!-- 時間設定モード -->
			<div id="setup-mode" class="flex flex-col items-center space-y-6">
				<!-- 時間選択 -->
				<div class="flex space-x-4">
					<div class="flex flex-col items-center">
						<div class="wheel-picker" data-unit="hours" data-value="0">
							<div class="wheel-container"></div>
							<div class="wheel-overlay"></div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="wheel-picker" data-unit="minutes" data-value="0">
							<div class="wheel-container"></div>
							<div class="wheel-overlay"></div>
						</div>
					</div>
					<div class="flex flex-col items-center">
						<div class="wheel-picker" data-unit="seconds" data-value="0">
							<div class="wheel-container"></div>
							<div class="wheel-overlay"></div>
						</div>
					</div>
				</div>

				<!-- コントロールボタン -->
				<div class="flex space-x-12">
					<button
						id="reset-btn"
						class="large-circle-btn cancel-btn-custom btn btn-circle btn-lg"
						title="キャンセル"
					>
						<span class="text-xs font-bold">キャンセル</span>
					</button>
					<button
						id="start-btn"
						class="large-circle-btn start-btn-custom btn btn-circle btn-lg"
						title="開始"
					>
						<span class="text-xs font-bold">開始</span>
					</button>
				</div>
			</div>

			<!-- タイマー実行モード -->
			<div id="timer-mode" class="flex flex-col items-center space-y-6" style="display: none;">
				<!-- 円形プログレスバー -->
				<div class="relative">
					<svg width="200" height="200" class="-rotate-90 transform">
						<circle
							cx="100"
							cy="100"
							r="90"
							stroke="currentColor"
							stroke-width="10"
							fill="none"
							class="text-gray-300"
							opacity="1"
						/>
						<circle
							id="progress-circle"
							cx="100"
							cy="100"
							r="90"
							stroke="currentColor"
							stroke-width="10"
							fill="none"
							class="text-orange-500"
							stroke-linecap="round"
							stroke-dasharray="565.48"
							stroke-dashoffset="565.48"
							style="transition: stroke-dashoffset 1s linear;"
						/>
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<div id="time-display" class="text-4xl font-bold text-black">00:00:00</div>
					</div>
				</div>

				<!-- コントロールボタン -->
				<div class="flex space-x-12">
					<button
						id="timer-cancel-btn"
						class="large-circle-btn cancel-btn-custom btn btn-circle btn-lg"
						title="キャンセル"
					>
						<span class="text-xs font-bold">キャンセル</span>
					</button>
					<button
						id="pause-btn"
						class="large-circle-btn pause-btn-custom btn btn-circle btn-lg"
						title="一時停止"
					>
						<span class="text-xs font-bold">一時停止</span>
					</button>
				</div>
			</div>

			<!-- アラートモーダル -->
			<div id="alert-modal" class="modal" style="display: none;">
				<div class="modal-box bg-white text-black">
					<h3 class="text-lg font-bold">時間です！</h3>
					<p class="py-4">タイマーが終了しました。</p>
					<div class="modal-action">
						<button id="alert-ok-btn" class="btn">完了</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.wheel-picker {
		width: 80px;
		height: 120px;
		overflow: hidden;
		border-radius: 8px;
		background: transparent;
		position: relative;
		cursor: pointer;
	}

	.wheel-container {
		position: relative;
		height: 100%;
		transition: transform 0.2s ease-out;
	}

	:global(.wheel-item) {
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: rgba(0, 0, 0, 0.4);
		transition: all 0.2s ease;
		user-select: none;
	}

	:global(.wheel-item.selected) {
		font-size: 18px;
		font-weight: bold;
		color: #000000;
	}

	.wheel-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		background: linear-gradient(
			to bottom,
			rgba(242, 242, 247, 1) 0%,
			rgba(242, 242, 247, 0.3) 30%,
			rgba(242, 242, 247, 0.3) 70%,
			rgba(242, 242, 247, 1) 100%
		);
	}

	.wheel-overlay::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 30px;
		transform: translateY(-50%);
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		pointer-events: none;
	}

	.large-circle-btn {
		width: 5rem;
		height: 5rem;
		min-width: 5rem;
		font-size: 0.75rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		transition: all 0.2s;
	}

	.start-btn-custom {
		background-color: rgba(34, 197, 94, 0.15) !important;
		color: #15803d !important;
	}

	.start-btn-custom:hover {
		background-color: rgba(34, 197, 94, 0.25) !important;
	}

	.cancel-btn-custom {
		background-color: rgba(107, 114, 128, 0.15) !important;
		color: #374151 !important;
	}

	.cancel-btn-custom:hover {
		background-color: rgba(107, 114, 128, 0.25) !important;
	}

	.pause-btn-custom {
		background-color: rgba(249, 115, 22, 0.15) !important;
		color: #c2410c !important;
	}

	.pause-btn-custom:hover {
		background-color: rgba(249, 115, 22, 0.25) !important;
	}
</style>
