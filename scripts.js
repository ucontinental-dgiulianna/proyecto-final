document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initTheme();
  updateProgress();
  renderCharts();
  window.addEventListener("scroll", updateProgress);
});

function initNavigation() {
  const buttons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".page-section");
  const ctaButtons = document.querySelectorAll("[data-page]");

  const activatePage = (pageId) => {
    sections.forEach((section) => section.classList.toggle("active", section.id === pageId));
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.page === pageId));
    if (window.location.hash !== `#${pageId}`) {
      window.location.hash = pageId;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => activatePage(button.dataset.page));
  });

  ctaButtons.forEach((button) => {
    if (button.dataset.page) {
      button.addEventListener("click", () => activatePage(button.dataset.page));
    }
  });

  const initialPage = window.location.hash.replace("#", "") || "presentacion";
  activatePage(initialPage);
  window.addEventListener("hashchange", () => {
    const page = window.location.hash.replace("#", "") || "presentacion";
    activatePage(page);
  });
}

function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("site-theme");
  if (stored === "dark") {
    document.body.classList.add("dark");
    if (toggle) toggle.textContent = "🌙";
  }

  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("site-theme", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "🌙" : "☀️";
  });
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? (scrollTop / height) * 100 : 0;
  const fill = document.getElementById("progressFill");
  if (fill) fill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function renderCharts() {
  const usageData = [12, 18, 28, 26, 16];
  const usageLabels = ["<1h", "1-2h", "2-3h", "3-4h", ">4h"];
  const usageColors = ["#6d7cff", "#5f5dfc", "#4CC9F0", "#77b8ff", "#9f8dff"];
  drawBarChart("usageChart", usageLabels, usageData, usageColors, "Uso diario de redes");

  const gradeData = [8, 14, 22, 18, 12];
  const gradeLabels = ["Excelente", "Bueno", "Regular", "Bajo", "Muy bajo"];
  const gradeColors = ["#47ca57", "#6bcf7d", "#8ed2a3", "#f4b266", "#ff7a59"];
  drawBarChart("gradesChart", gradeLabels, gradeData, gradeColors, "Impacto en calificaciones");
  document.getElementById("year")?.appendChild(document.createTextNode(new Date().getFullYear()));
}

function drawBarChart(id, labels, values, colors, title) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const padding = 40;
  const maxValue = Math.max(...values);
  const barWidth = (width - padding * 2) / values.length - 16;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7f8ff";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#22304f";
  ctx.font = "16px Inter, sans-serif";
  ctx.fillText(title, padding, 24);

  values.forEach((value, index) => {
    const x = padding + index * (barWidth + 16);
    const barHeight = (value / maxValue) * (height - padding * 2);
    const y = height - padding - barHeight;
    ctx.fillStyle = colors[index] || "#5f5dfc";
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "#22304f";
    ctx.fillText(`${value}%`, x, y - 8);
    ctx.fillText(labels[index], x, height - padding + 22);
  });
}
