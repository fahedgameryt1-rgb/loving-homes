function toggleNav() {
  var nav = document.getElementById("myTopnav");
  var drop = document.getElementById("companyDrop");

  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
    if (drop) {
      drop.classList.remove("open");
    }
  }
}

function toggleCompanyDropdown(event) {
  event.preventDefault();

  var nav = document.getElementById("myTopnav");
  var dropdown = document.getElementById("companyDrop");

  if (nav.classList.contains("responsive")) {
    dropdown.classList.toggle("open");
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  var nav = document.getElementById("myTopnav");
  var dropdown = document.getElementById("companyDrop");

  if (
    nav.classList.contains("responsive") &&
    dropdown &&
    !dropdown.contains(event.target) &&
    !event.target.classList.contains("icon")
  ) {
    dropdown.classList.remove("open");
  }
});

// Handle "Forgot Password" link
document.addEventListener("DOMContentLoaded", () => {
  const forgotPasswordLink = document.getElementById("forgotPassword");
  
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function(e) {
      e.preventDefault();
      
      const email = prompt("أدخل بريدك الإلكتروني:");
      
      if (email && email.trim()) {
        // Show message (in real app, would send reset email)
        const msgElement = document.getElementById("loginMsg");
        if (msgElement) {
          msgElement.innerText = "✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني";
          msgElement.style.color = "#2e7d32";
          msgElement.style.padding = "12px";
          msgElement.style.borderRadius = "8px";
          msgElement.style.backgroundColor = "#e8f5e9";
          msgElement.style.border = "2px solid #2e7d32";
          
          // Play success sound if available
          const successSound = document.getElementById("successSound");
          if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(() => {});
          }
        }
      }
    });
  }
});