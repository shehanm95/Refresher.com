(function () {
    const timerDisplay = document.getElementById("timerDisplay");
    const timerLabel = document.getElementById("timerLabel");
    const takeRestBtn = document.getElementById("takeRestBtn");
    const startWorkBtn = document.getElementById("startWorkBtn");
    const stopTimersBtn = document.getElementById("stopTimersBtn");
    const startTimersBtn = document.getElementById("startTimersBtn");
    const workTimeInput = document.getElementById("workTimeInput");
    const intervalTimeInput = document.getElementById("intervalTimeInput");
    const alarm = document.getElementById("timerAlarm");
    alarm.src = "alarmSound.wav";

    // Load saved values from localStorage
    function loadSavedTimes() {
        const savedWorkTime = localStorage.getItem("workTime");
        const savedIntervalTime = localStorage.getItem("intervalTime");

        if (savedWorkTime) {
            workTimeInput.value = savedWorkTime;
        }
        if (savedIntervalTime) {
            intervalTimeInput.value = savedIntervalTime;
        }
    }

    // Save values to localStorage
    function saveTimes() {
        localStorage.setItem("workTime", workTimeInput.value);
        localStorage.setItem("intervalTime", intervalTimeInput.value);
    }

    // Add event listeners to save when inputs change
    workTimeInput.addEventListener("input", saveTimes);
    intervalTimeInput.addEventListener("input", saveTimes);

    if (!timerDisplay) return;

    let mode = "work"; // "work" | "rest"
    let secondsRemaining = 0;
    let tickIntervalId = null;
    let alarmPlaying = false;
    let startTime = null;

    function parseTimeStringToSeconds(value) {
        if (!value) return 0;
        const parts = value.split(":");
        if (parts.length !== 2) return 0;
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        if (Number.isNaN(minutes) || Number.isNaN(seconds)) return 0;
        return Math.max(0, minutes) * 60 + Math.max(0, seconds);
    }

    function formatSeconds(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function setLabelAndButtons() {
        if (mode === "work") {
            timerLabel.textContent = "Working Time";
            takeRestBtn.classList.remove("d-none");
            startWorkBtn.classList.add("d-none");
        } else {
            timerLabel.textContent = "Interval Time";
            takeRestBtn.classList.add("d-none");
            startWorkBtn.classList.remove("d-none");
        }
    }

    function startTicking() {
        clearInterval(tickIntervalId);
        startTime = Date.now();

        tickIntervalId = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, secondsRemaining - elapsed);

            if (remaining <= 0) {
                ring();
                clearInterval(tickIntervalId);
                tickIntervalId = null;
                // Don't automatically switch modes - wait for user to press button
            }
            timerDisplay.textContent = formatSeconds(remaining);
        }, 100); // Update more frequently for better accuracy
    }

    function ring() {
        try {
            alarm.currentTime = 0;
            alarm.loop = true; // Enable looping
            alarm.play();
            alarmPlaying = true;
        } catch (e) { }
    }

    function stopAlarm() {
        try {
            alarm.pause();
            alarm.currentTime = 0;
            alarm.loop = false; // Disable looping
            alarmPlaying = false;
        } catch (e) { }
    }

    function stopTimers() {
        clearInterval(tickIntervalId);
        tickIntervalId = null;
        stopAlarm(); // Stop any playing alarm
        stopTimersBtn.classList.add("d-none");
        startTimersBtn.classList.remove("d-none");
    }

    function startTimers() {
        if (tickIntervalId) return;
        stopTimersBtn.classList.remove("d-none");
        startTimersBtn.classList.add("d-none");
        setLabelAndButtons(); // Show the appropriate button
        startTicking();
    }

    function switchToWork() {
        stopAlarm();
        mode = "work";
        secondsRemaining = parseTimeStringToSeconds(workTimeInput.value || "30:00");
        setLabelAndButtons();
        timerDisplay.textContent = formatSeconds(secondsRemaining);
        // Always start ticking when switching modes
        startTicking();
    }

    function switchToRest() {
        stopAlarm();
        mode = "rest";
        secondsRemaining = parseTimeStringToSeconds(intervalTimeInput.value || "10:00");
        setLabelAndButtons();
        timerDisplay.textContent = formatSeconds(secondsRemaining);
        // Always start ticking when switching modes
        startTicking();
    }

    // Button handlers
    takeRestBtn?.addEventListener("click", () => {
        switchToRest();
    });

    startWorkBtn?.addEventListener("click", () => {
        switchToWork();
    });

    stopTimersBtn?.addEventListener("click", stopTimers);
    startTimersBtn?.addEventListener("click", startTimers);

    // Initialize from inputs
    loadSavedTimes(); // Load saved values first
    switchToWork();
    // Auto-start the work timer when page loads
    stopTimersBtn.classList.remove("d-none");
    startTimersBtn.classList.add("d-none");
    startTicking();
})();


