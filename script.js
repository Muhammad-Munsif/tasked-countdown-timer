let interval;
let initialTarget = null;

window.onload = function () {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") setTheme("light");
  else setTheme("dark");

  const savedTarget = localStorage.getItem("countdownTarget");
  if (savedTarget) {
    document.getElementById("dateInput").value = savedTarget;
    startCountdown(savedTarget);
  }
};

function startCountdown(dateOverride) {
  clearInterval(interval);
  const input = dateOverride || document.getElementById("dateInput").value;

  if (!input) {
    alert("Please select a valid date.");
    return;
  }

  const targetTime = new Date(input).getTime();
  if (isNaN(targetTime) || targetTime <= Date.now()) {
    alert("Please select a future date.");
    return;
  }

  localStorage.setItem("countdownTarget", input);
  initialTarget = targetTime;

  interval = setInterval(() => {
    const now = new Date().getTime();
    const gap = targetTime - now;

    if (gap <= 0) {
      clearInterval(interval);
      localStorage.removeItem("countdownTarget");
      updateCountdown(0, 0, 0, 0);
      updateProgressBar(100);
      document.getElementById("alertSound").play();
      alert("Time's up!");
      return;
    }

    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;
    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);
    updateCountdown(d, h, m, s);

    // Progress Bar
    const total =
      targetTime - new Date(localStorage.getItem("countdownTarget")).getTime();
    const passed = total - gap;
    const percentage = Math.min((passed / total) * 100, 100);
    updateProgressBar(percentage);
  }, 1000);
}

function updateCountdown(d, h, m, s) {
  document.getElementById("days").textContent = d.toString().padStart(2, "0");
  document.getElementById("hours").textContent = h.toString().padStart(2, "0");
  document.getElementById("minutes").textContent = m
    .toString()
    .padStart(2, "0");
  document.getElementById("seconds").textContent = s
    .toString()
    .padStart(2, "0");
}

function updateProgressBar(percent) {
  document.getElementById("progressBar").style.width = `${percent}%`;
}

function resetCountdown() {
  clearInterval(interval);
  localStorage.removeItem("countdownTarget");
  document.getElementById("dateInput").value = "";
  updateCountdown(0, 0, 0, 0);
  updateProgressBar(0);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
}

function setTheme(mode) {
  const html = document.documentElement;
  if (mode === "light") {
    html.classList.remove("dark");
    document.body.classList.remove("bg-gray-900", "text-white");
    document.body.classList.add("bg-white", "text-black");
  } else {
    html.classList.add("dark");
    document.body.classList.add("bg-gray-900", "text-white");
    document.body.classList.remove("bg-white", "text-black");
  }
  localStorage.setItem("theme", mode);
}
