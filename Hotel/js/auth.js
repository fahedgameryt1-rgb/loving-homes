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

// Helper function to save form data to Netlify
async function submitToNetlifyForm(formName, formData) {
  try {
    // Create FormData object for Netlify
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'form-name': formName,
        ...formData
      })
    }).catch((error) => {
      // Silent catch - Netlify forms submission is fire-and-forget
      console.log('Form submitted to Netlify');
    });
  } catch (error) {
    console.warn('Could not submit to Netlify:', error);
  }
}

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

            // Submit to Netlify Forms
            submitToNetlifyForm('user-signup', {
              name: name,
              email: email,
              signupMethod: 'email',
              timestamp: new Date().toISOString()
            });

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

          // Submit to Netlify Forms
          submitToNetlifyForm('user-signup', {
            name: name,
            email: email,
            signupMethod: 'email',
            timestamp: new Date().toISOString()
          });

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

            // Submit to Netlify Forms
            submitToNetlifyForm('user-login', {
              email: email,
              loginMethod: 'email',
              timestamp: new Date().toISOString()
            });

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

            // Submit to Netlify Forms
            submitToNetlifyForm('user-login', {
              email: email,
              loginMethod: 'email',
              timestamp: new Date().toISOString()
            });

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

  // GITHUB AUTHENTICATION
  // GitHub OAuth Configuration
  const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'; // Need to be set in environment
  const GITHUB_REDIRECT_URI = window.location.origin + '/netlify/functions/github-oauth-callback';

  // Check if returning from GitHub OAuth
  const urlParams = new URLSearchParams(window.location.search);
  const githubCode = urlParams.get('code');
  const githubUsername = urlParams.get('username');

  if (githubCode && githubUsername) {
    // Handle GitHub OAuth callback
    handleGitHubOAuthCallback(githubUsername);
  }

  // GitHub Login Button Handler
  const githubLoginBtn = document.getElementById("githubLoginBtn");
  if (githubLoginBtn) {
    githubLoginBtn.addEventListener("click", function(e) {
      e.preventDefault();
      initiateGitHubLogin();
    });
  }

  // GitHub Signup Button Handler
  const githubSignupBtn = document.getElementById("githubSignupBtn");
  if (githubSignupBtn) {
    githubSignupBtn.addEventListener("click", function(e) {
      e.preventDefault();
      initiateGitHubSignup();
    });
  }

  // Function to get current GitHub user info
  async function getCurrentGitHubUser(accessToken) {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Error fetching GitHub user:', error);
      return null;
    }
  }

  // Handle GitHub OAuth redirect/iframe approach
  async function initiateGitHubLogin() {
    // Step 1: Prompt user for their GitHub username
    const githubUsername = prompt("أدخل اسم المستخدم على GitHub:");
    
    if (!githubUsername) {
      const msgElement = document.getElementById("loginMsg");
      if (msgElement) {
        displayMessage(msgElement, "❌ تم الإلغاء", true);
        playSound(errorSound);
      }
      return;
    }

    // Step 2: Authenticate with backend
    await authenticateWithGitHub(githubUsername, 'login');
  }

  async function initiateGitHubSignup() {
    // Step 1: Prompt user for their GitHub username
    const githubUsername = prompt("أدخل اسم المستخدم على GitHub الجديد:");
    
    if (!githubUsername) {
      const msgElement = document.getElementById("signupMsg");
      if (msgElement) {
        displayMessage(msgElement, "❌ تم الإلغاء", true);
        playSound(errorSound);
      }
      return;
    }

    // Step 2: Authenticate with backend
    await authenticateWithGitHub(githubUsername, 'signup');
  }

  // Main GitHub authentication function
  async function authenticateWithGitHub(githubUsername, action) {
    const msgElement = action === 'login' ? 
      document.getElementById("loginMsg") : 
      document.getElementById("signupMsg");

    try {
      displayMessage(msgElement, "⏳ جاري التحقق من اسم المستخدم...", false);

      // Verify GitHub username exists by making API call
      const userCheckResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
      
      if (!userCheckResponse.ok) {
        displayMessage(msgElement, `❌ اسم المستخدم "${githubUsername}" غير موجود على GitHub`, true);
        playSound(errorSound);
        return;
      }

      const githubUser = await userCheckResponse.json();
      const email = githubUser.email || `${githubUsername}@github.com`;
      const name = githubUser.name || githubUsername;

      // Send to backend for authentication
      const response = await fetch(`${API_URL}/github-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          githubUsername,
          email,
          name,
          action
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Save user info
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("loginMethod", "github");

        displayMessage(msgElement, "✅ تم التحقق من GitHub بنجاح! سيتم التحويل...", false);
        playSound(successSound);

        // Submit to Netlify Forms
        submitToNetlifyForm('user-signup', {
          name: result.user.name,
          email: result.user.email,
          signupMethod: 'github',
          timestamp: new Date().toISOString()
        });

        setTimeout(() => {
          window.location.href = action === 'login' ? "index.html" : "login.html";
        }, 1500);
      } else {
        displayMessage(msgElement, `❌ ${result.error}`, true);
        playSound(errorSound);
      }

    } catch (error) {
      console.error('GitHub auth error:', error);
      displayMessage(msgElement, "❌ حدث خطأ أثناء التحقق من GitHub", true);
      playSound(errorSound);
    }
  }

  // Handle GitHub OAuth callback
  async function handleGitHubOAuthCallback(username) {
    try {
      const response = await fetch(`${API_URL}/github-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          githubUsername: username
        })
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("loginMethod", "github");

        // Submit to Netlify Forms
        submitToNetlifyForm('user-signup', {
          name: result.user.name,
          email: result.user.email,
          signupMethod: 'github',
          timestamp: new Date().toISOString()
        });

        // Remove URL params and redirect
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.href = "index.html";
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      window.location.href = "login.html";
    }
  }

});