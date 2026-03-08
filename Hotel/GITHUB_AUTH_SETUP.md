# Setup Guide - GitHub Authentication Integration

## الخطوات اللازمة للتكامل مع GitHub

### 1. إعداد GitHub OAuth App

1. اذهب إلى [GitHub Developer Settings](https://github.com/settings/developers)
2. انقر على **"New OAuth App"**
3. ملء البيانات التالية:
   - **Application name**: Loving Homes Hotel
   - **Homepage URL**: `https://your-domain.com` (أو `http://localhost:3000` للتطوير)
   - **Authorization callback URL**: `https://your-domain.com/.netlify/functions/github-oauth-callback`

4. سيحصل على:
   - **Client ID**
   - **Client Secret**

### 2. إضافة متغيرات البيئة في Netlify

1. اذهب إلى **Site Settings** → **Environment variables**
2. أضف المتغيرات التالية:
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### 3. تحديث ملف auth.js

في ملف `js/auth.js`، ابحث عن السطر:
```javascript
const GITHUB_CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID';
```

واستبدله بـ:
```javascript
const GITHUB_CLIENT_ID = 'your_actual_client_id';
```

### 4. كيفية عمل المصادقة

#### برای تسجيل الدخول عبر GitHub من خلال اسم المستخدم:

1. المستخدم يضغط على زر "🔗 دخول عبر GitHub"
2. يُطلب منه إدخال اسم المستخدم على GitHub
3. يتم التحقق من صحة اسم المستخدم عبر GitHub API
4. إذا كان صحيحاً، يتم إنشاء/استرجاع حساب المستخدم
5. يتم حفظ بيانات المستخدم محلياً وعلى الخادم

#### البيانات المحفوظة:

```
{
  id: "user_id",
  name: "GitHub User Name",
  email: "user@github.com",
  githubUsername: "github_username",
  loginMethod: "github",
  createdAt: "2024-01-01T00:00:00Z",
  lastLogin: "2024-01-01T00:00:00Z"
}
```

### 5. Endpoints المتاحة

#### `/authenticate/signup` - إنشاء حساب جديد
```javascript
POST /authenticate/signup
{
  "name": "أحمد",
  "email": "ahmed@example.com",
  "password": "password123"
}
```

#### `/authenticate/login` - تسجيل دخول
```javascript
POST /authenticate/login
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

#### `/authenticate/github-auth` - مصادقة GitHub
```javascript
POST /authenticate/github-auth
{
  "githubUsername": "github_username",
  "email": "email@example.com",
  "name": "User Name",
  "accessToken": "github_access_token"
}
```

#### `/api/users` - إدارة بيانات المستخدم

**الحصول على بيانات المستخدم:**
```javascript
GET /api/users?id=user_id
GET /api/users?email=user_email
```

**إنشاء مستخدم:**
```javascript
POST /api/users
{
  "action": "create",
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "password": "hashed_password",
  "githubUsername": "github_username",
  "loginMethod": "github"
}
```

**تحديث بيانات المستخدم:**
```javascript
PUT /api/users
{
  "id": "user_id",
  "name": "New Name",
  "bio": "User bio",
  "avatar": "avatar_url"
}
```

### 6. ميزات الأمان

✅ **كلمات مرور معايير:**
- الحد الأدنى 6 أحرف
- تم التحقق منها على كل من الجانب الأمامي والخادم

✅ **معايير البريد الإلكتروني:**
- تحقق من صيغة البريد الإلكتروني
- التحقق من عدم تكرار البريد

✅ **إخفاء كلمات المرور:**
- لا يتم إرسال كلمات المرور في الردود
- يتم إرسال التوكن بدلاً من كلمات المرور

✅ **CORS Protection:**
- معالجة CORS على جميع الطلبات
- عمليات OPTIONS للتحقق المسبق

### 7. اختبار محلي

```bash
# تثبيت Netlify CLI
npm install -g netlify-cli

# تشغيل محلي
netlify dev

# سيعمل على http://localhost:8888
```

### 8. نصائح للإنتاج

- استخدم متغيرات البيئة لجميع المعلومات الحساسة
- قم بتشفير كلمات المرور بـ bcrypt قبل الحفظ
- استخدم قاعدة بيانات حقيقية (MongoDB, Firebase, إلخ)
- قم بتفعيل SSL/HTTPS
- أضف معدل تحديد (Rate Limiting)
- قم بتفعيل تسجيل الأحداث (Logging)

### 9. استكشاف الأخطاء

**المشكلة:** "Cannot find module 'fs'"
- الحل: تأكد من أنك تستخدم Node.js المدمج

**المشكلة:** CORS errors
- الحل: تحقق من رؤوس CORS في الدالة

**المشكلة:** GitHub username غير مقبول
- الحل: تحقق من وجود اسم المستخدم حقاً على GitHub

---

للمزيد من المساعدة، يرجى مراجعة:
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
