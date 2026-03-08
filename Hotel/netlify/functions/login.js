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

// Helper function to verify user (can be enhanced with actual database)
function findUserByEmail(email, password) {
  return users.find(u => u.email === email && u.password === password);
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
    const { email, password } = data;

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "الرجاء إدخال البريد وكلمة المرور" 
        })
      };
    }

    // Find user
    const user = findUserByEmail(email, password);

    if (!user) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          error: "البريد أو كلمة المرور غير صحيحة" 
        })
      };
    }

    const token = Buffer.from(`${user.email}:${user.id}`).toString('base64');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: "تم تسجيل الدخول بنجاح",
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        },
        token: token
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
