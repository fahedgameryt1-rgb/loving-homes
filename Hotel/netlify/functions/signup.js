// Simple in-memory user storage (can be replaced with database)
let users = [];

// Load users from environment or storage
if (process.env.USERS_DATA) {
  try {
    users = JSON.parse(process.env.USERS_DATA);
  } catch (e) {
    users = [];
  }
}

// Helper function to save users (can be enhanced with actual database)
function persistUsers() {
  try {
    // In a real application, save to Netlify KV, MongoDB, Firebase, etc.
    // For now, this is a placeholder for future database integration
    console.log('Persisting user data:', users.length, 'users');
    return true;
  } catch (error) {
    console.error('Error persisting users:', error);
    return false;
  }
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, password } = data;

    // Validation
    if (!name || name.trim().length < 2) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "الاسم يجب أن يكون حرفين على الأقل" 
        })
      };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "البريد الإلكتروني غير صحيح" 
        })
      };
    }

    if (!password || password.length < 6) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" 
        })
      };
    }

    // Check if email exists
    if (users.find(u => u.email === email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "هذا البريد الإلكتروني مسجل بالفعل" 
        })
      };
    }

    // Add user
    const newUser = { 
      id: Date.now().toString(),
      name: name.trim(), 
      email: email.trim(), 
      password,
      createdAt: new Date().toISOString(),
      loginMethod: 'email'
    };

    users.push(newUser);
    persistUsers();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: "تم إنشاء الحساب بنجاح",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
        token: Buffer.from(`${newUser.email}:${newUser.id}`).toString('base64')
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "خطأ في الخادم: " + error.message 
      })
    };
  }
};
