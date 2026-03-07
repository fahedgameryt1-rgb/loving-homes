function toggleTheme(){
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeButton();
}

function updateThemeButton(){
  const btns = document.querySelectorAll(".theme-toggle");
  btns.forEach(btn => {
    btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    btn.setAttribute("aria-label", document.body.classList.contains("dark-mode") ? "Light mode" : "Dark mode");
    btn.setAttribute("title", document.body.classList.contains("dark-mode") ? "Light mode" : "Dark mode");
  });
}

function initTheme(){
  const savedTheme = localStorage.getItem("theme");
  if(savedTheme === "dark") document.body.classList.add("dark-mode");
  updateThemeButton();
}

document.addEventListener("DOMContentLoaded", initTheme);
