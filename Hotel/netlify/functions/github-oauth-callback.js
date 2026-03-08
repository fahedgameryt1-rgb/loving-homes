// GitHub OAuth Callback Handler
// This function handles the redirect from GitHub after user authorization

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    // Extract authorization code and state from query params
    const code = event.queryStringParameters?.code;
    const state = event.queryStringParameters?.state;
    const error = event.queryStringParameters?.error;

    // Handle errors from GitHub
    if (error) {
      return {
        statusCode: 400,
        headers,
        body: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8">
            <title>خطأ في التحقق</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #47797A; margin: 0; }
              .error-box { background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h2 { color: #d32f2f; margin-top: 0; }
              p { color: #666; line-height: 1.6; }
              a { color: #1976d2; text-decoration: none; font-weight: bold; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h2>⚠️ حدث خطأ</h2>
              <p>${error === 'access_denied' ? 'تم رفض الوصول إلى GitHub' : 'حدث خطأ أثناء التحقق'}</p>
              <p><a href="/login.html">العودة إلى صفحة تسجيل الدخول</a></p>
            </div>
          </body>
          </html>
        `
      };
    }

    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: `
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="utf-8">
            <title>خطأ في المصادقة</title>
            <style>
              body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #47797A; margin: 0; }
              .error-box { background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              h2 { color: #d32f2f; margin-top: 0; }
              p { color: #666; line-height: 1.6; }
              a { color: #1976d2; text-decoration: none; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h2>❌ فشل التحقق</h2>
              <p>كود المصادقة غير موجود. يرجى المحاولة مرة أخرى.</p>
              <p><a href="/login.html">العودة إلى صفحة تسجيل الدخول</a></p>
            </div>
          </body>
          </html>
        `
      };
    }

    // Exchange code for access token with GitHub
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get access token from GitHub');
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Failed to authenticate with GitHub');
    }

    const accessToken = tokenData.access_token;

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data from GitHub');
    }

    const githubUser = await userResponse.json();

    // Redirect back to login with username
    const redirectUrl = `/login.html?code=${code}&username=${encodeURIComponent(githubUser.login)}`;

    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': redirectUrl
      },
      body: ''
    };

  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8">
          <title>خطأ في الخادم</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #47797A; margin: 0; }
            .error-box { background: white; padding: 30px; border-radius: 10px; text-align: center; max-width: 400px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h2 { color: #d32f2f; margin-top: 0; }
            p { color: #666; line-height: 1.6; }
            .details { background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px; color: #333; margin: 10px 0; text-align: left; }
            a { color: #1976d2; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="error-box">
            <h2>❌ حدث خطأ في المصادقة</h2>
            <p>لم نتمكن من التحقق من حسابك على GitHub.</p>
            <div class="details">الخطأ: ${error.message}</div>
            <p><a href="/login.html">العودة إلى صفحة تسجيل الدخول</a></p>
          </div>
        </body>
        </html>
      `
    };
  }
};
