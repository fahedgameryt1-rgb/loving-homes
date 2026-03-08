// User Data Management - Store and retrieve user information
const fs = require('fs');
const path = require('path');

// In-memory cache for users
let usersCache = new Map();

// Data file location (using function's tmp directory)
const DATA_DIR = '/tmp';
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Initialize from file on startup
function loadUsersFromFile() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      const users = JSON.parse(data);
      users.forEach(user => {
        usersCache.set(user.id, user);
      });
      console.log(`Loaded ${users.length} users from file`);
    }
  } catch (error) {
    console.warn('Could not load users from file:', error.message);
  }
}

// Save users to file
function saveUsersToFile() {
  try {
    const users = Array.from(usersCache.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    console.log('Users saved to file');
  } catch (error) {
    console.error('Could not save users to file:', error.message);
  }
}

// Load users on module initialization
loadUsersFromFile();

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const action = body.action || event.queryStringParameters?.action;

    // GET - Retrieve user by ID or email
    if (event.httpMethod === "GET") {
      const userId = event.queryStringParameters?.id;
      const userEmail = event.queryStringParameters?.email;

      if (userId) {
        const user = usersCache.get(userId);
        if (user) {
          // Don't send password
          const { password, ...safeUser } = user;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, user: safeUser })
          };
        }
      }

      if (userEmail) {
        let user = null;
        for (const u of usersCache.values()) {
          if (u.email === userEmail) {
            user = u;
            break;
          }
        }
        if (user) {
          const { password, ...safeUser } = user;
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, user: safeUser })
          };
        }
      }

      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "لم يتم العثور على المستخدم" })
      };
    }

    // POST - Create or verify user
    if (event.httpMethod === "POST") {
      if (action === "create") {
        const { id, name, email, password, githubUsername, loginMethod } = body;

        if (!id || !email) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: "بيانات المستخدم ناقصة" })
          };
        }

        const user = {
          id,
          name,
          email,
          password,
          githubUsername,
          loginMethod,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        usersCache.set(id, user);
        saveUsersToFile();

        const { password: _, ...safeUser } = user;
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: "تم إنشاء المستخدم بنجاح",
            user: safeUser 
          })
        };
      }

      if (action === "verify") {
        const { email, password } = body;

        for (const user of usersCache.values()) {
          if (user.email === email && user.password === password) {
            user.lastLogin = new Date().toISOString();
            saveUsersToFile();

            const { password: _, ...safeUser } = user;
            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({ 
                success: true,
                user: safeUser,
                token: Buffer.from(`${email}:${user.id}`).toString('base64')
              })
            };
          }
        }

        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: "بيانات الدخول غير صحيحة" })
        };
      }
    }

    // PUT - Update user
    if (event.httpMethod === "PUT") {
      const { id, name, email, bio, avatar } = body;

      const user = usersCache.get(id);
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: "المستخدم غير موجود" })
        };
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (bio) user.bio = bio;
      if (avatar) user.avatar = avatar;
      user.updatedAt = new Date().toISOString();

      usersCache.set(id, user);
      saveUsersToFile();

      const { password: _, ...safeUser } = user;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true,
          message: "تم تحديث بيانات المستخدم",
          user: safeUser 
        })
      };
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "طلب غير صحيح" })
    };

  } catch (error) {
    console.error('User management error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "خطأ في الخادم: " + error.message 
      })
    };
  }
};
