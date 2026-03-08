let users = JSON.parse(localStorage.getItem("users")) || [];

// Determine API base URL
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

// Check if we're running on Netlify
const isNetlify = window.location.hostname !== 'localhost';

// Get sound elements
const successSound = document.getElementById("successSound");
const errorSound = document.getElementById("errorSound");

// Helper function to play sound
function playSound(audio) {
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Silent catch for browser autoplay restrictions
    });
  }
}

// Helper function to display message
function displayMessage(element, message, isError = false) {
  if (element) {
    element.innerText = message;
    element.style.color = isError ? "#d32f2f" : "#2e7d32";
    element.style.padding = "12px";
    element.style.borderRadius = "8px";
    element.style.backgroundColor = isError ? "#ffebee" : "#e8f5e9";
    element.style.border = isError ? "2px solid #d32f2f" : "2px solid #2e7d32";
  }
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateName(name) {
  return name.trim().length >= 2;
}

document.addEventListener("DOMContentLoaded", () => {

  // SIGNUP FORM
  const signupForm = document.getElementById("signupForm");
  
  if(signupForm){
    signupForm.addEventListener("submit", async function(e){
      e.preventDefault();

      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value;
      const msgElement = document.getElementById("signupMsg");

      // Client-side validation
      if (!validateName(name)) {
        displayMessage(msgElement, "❌ الاسم يجب أن يكون حرفين على الأقل", true);
        playSound(errorSound);
        return;
      }

      if (!validateEmail(email)) {
        displayMessage(msgElement, "❌ البريد الإلكتروني غير صحيح", true);
        playSound(errorSound);
        return;
      }

      if (!validatePassword(password)) {
        displayMessage(msgElement, "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل", true);
        playSound(errorSound);
        return;
      }

      try {
        if (isNetlify) {
          // Use Netlify Functions
          const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
          });

          const result = await response.json();

          if (response.ok) {
            displayMessage(msgElement, "✅ تم إنشاء الحساب بنجاح! سيتم تحويلك قريباً...", false);
            playSound(successSound);
            setTimeout(() => {
              window.location.href = "login.html";
            }, 2000);
          } else {
            displayMessage(msgElement, `❌ ${result.error}`, true);
            playSound(errorSound);
          }
        } else {
          // Fallback to localStorage for development
          if (users.find(u => u.email === email)) {
            displayMessage(msgElement, "❌ هذا البريد الإلكتروني مسجل بالفعل", true);
            playSound(errorSound);
            return;
          }

          users.push({name, email, password});
          localStorage.setItem("users", JSON.stringify(users));

          displayMessage(msgElement, "✅ تم إنشاء الحساب بنجاح! سيتم تحويلك قريباً...", false);
          playSound(successSound);

          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        }
      } catch (error) {
        displayMessage(msgElement, "❌ حدث خطأ في الاتصال بالخادم", true);
        playSound(errorSound);
      }
    });
  }

  // LOGIN FORM
  const loginForm = document.getElementById("loginForm");

  if(loginForm){
    loginForm.addEventListener("submit", async function(e){
      e.preventDefault();

      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const msgElement = document.getElementById("loginMsg");

      if (!email || !password) {
        displayMessage(msgElement, "❌ الرجاء إدخال البريد وكلمة المرور", true);
        playSound(errorSound);
        return;
      }

      try {
        if (isNetlify) {
          // Use Netlify Functions
          const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (response.ok) {
            // Save user info to localStorage
            localStorage.setItem("currentUser", JSON.stringify(result.user));
            localStorage.setItem("authToken", result.token);

            displayMessage(msgElement, "✅ تم تسجيل الدخول بنجاح!", false);
            playSound(successSound);
            setTimeout(() => {
              window.location.href = "index.html";
            }, 1500);
          } else {
            displayMessage(msgElement, `❌ ${result.error}`, true);
            playSound(errorSound);
          }
        } else {
          // Fallback to localStorage for development
          const user = users.find(u => u.email === email && u.password === password);

          if(user){
            localStorage.setItem("currentUser", JSON.stringify(user));
            displayMessage(msgElement, "✅ تم تسجيل الدخول بنجاح!", false);
            playSound(successSound);
            setTimeout(() => {
              window.location.href = "index.html";
            }, 1500);
          } else {
            displayMessage(msgElement, "❌ البريد أو كلمة المرور غير صحيحة", true);
            playSound(errorSound);
          }
        }
      } catch (error) {
        displayMessage(msgElement, "❌ حدث خطأ في الاتصال بالخادم", true);
        playSound(errorSound);
      }
    });
  }

});