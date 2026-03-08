// GitHub OAuth Handler - Save GitHub username to database
const crypto = require('crypto');

// In-memory user database (can be replaced with actual database)
let users = [];

// Load users from environment if available
if (process.env.USERS_DATA) {
  try {
    users = JSON.parse(process.env.USERS_DATA);
  } catch (e) {
    users = [];
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
    const { githubUsername, email, name, accessToken } = data;

    if (!githubUsername) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "اسم المستخدم على GitHub مطلوب" 
        })
      };
    }

    // Check if user already exists by GitHub username
    const existingUser = users.find(u => u.githubUsername === githubUsername);
    
    if (existingUser) {
      // User already exists, just return their info
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "تم تسجيل الدخول بنجاح",
          user: {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            githubUsername: existingUser.githubUsername
          },
          token: existingUser.token
        })
      };
    }

    // Create new user with GitHub info
    const userId = crypto.randomBytes(16).toString('hex');
    const token = Buffer.from(`${githubUsername}:${userId}`).toString('base64');

    const newUser = {
      id: userId,
      name: name || githubUsername,
      email: email || `${githubUsername}@github.com`,
      githubUsername,
      githubAccessToken: accessToken,
      createdAt: new Date().toISOString(),
      loginMethod: 'github',
      token
    };

    users.push(newUser);

    // Attempt to save to environment (if this were a real database)
    // In production, use your preferred database service
    try {
      // You could save users to a persistent storage here
      // Example: Netlify KV, MongoDB, Firebase, etc.
      console.log('New GitHub user registered:', githubUsername);
    } catch (saveError) {
      console.warn('Could not persist user data:', saveError);
      // Continue anyway - user data is in memory
    }

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        message: "تم إنشاء الحساب برقم GitHub بنجاح",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          githubUsername: newUser.githubUsername
        },
        token: newUser.token
      })
    };

  } catch (error) {
    console.error('GitHub auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "خطأ في الخادم: " + error.message 
      })
    };
  }
};
