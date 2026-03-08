# Netlify Forms - شرح التخزين والمراقبة

## ✅ كيفية عمل النموذج

تم إضافة تكامل تلقائي مع **Netlify Forms** لحفظ جميع بيانات التسجيل والدخول.

### النماذج المسجلة:
1. **user-signup** - نموذج إنشاء حساب جديد
2. **user-login** - نموذج تسجيل الدخول
3. **contact** - نموذج التواصل معنا
4. **booking** - نموذج الحجز

---

## 📊 البيانات المحفوظة

### عند الاشتراك (user-signup):
```
- الاسم
- البريد الإلكتروني
- طريقة التسجيل (email / github)
- الوقت والتاريخ
```

### عند تسجيل الدخول (user-login):
```
- البريد الإلكتروني
- طريقة الدخول (email / github)
- الوقت والتاريخ
```

---

## 🔍 كيفية مراجعة البيانات على Netlify

### الطريقة 1: عبر لوحة التحكم
1. اذهب إلى **Netlify Dashboard**
2. اختر موقعك (Project)
3. انقر على **Forms** من القائمة الجانبية
4. ستظهر النماذج المسجلة:
   - user-signup
   - user-login
   - contact
   - booking

### الطريقة 2: عرض التسجيلات
1. انقر على اسم النموذج (مثلاً: user-signup)
2. سترى قائمة بجميع التسجيلات
3. انقر على أي تسجيل لعرض التفاصيل الكاملة

### الطريقة 3: إشعارات البريد الإلكتروني
1. اذهب إلى **Site settings** → **Forms**
2. في قسم **Form notifications**
3. أضف بريدك الإلكتروني للحصول على إشعار عند كل تسجيل

---

## 🔔 إعداد التنبيهات

### إرسال البيانات إلى بريد إلكتروني:
```
Site settings → Forms → Add notification
```

### الخيارات المتاحة:
- ✉️ البريد الإلكتروني
- 🔗 Slack
- 💬 Discord (عبر webhooks)
- 📱 Zapier
- 🤖 إجراءات مخصصة

---

## 💾 نسخ احتياطي للبيانات

### تنزيل البيانات يدويًا:
1. اذهب إلى النموذج
2. انقر على الثلاث نقاط (...)
3. اختر **Export CSV**

### الجدولة التلقائية:
```javascript
// في Netlify Functions
const fs = require('fs');
const path = require('path');

// استدعاء Netlify Management API لتنزيل البيانات
async function backupForms() {
  // يتم تنزيل البيانات تلقائياً كل يوم
}
```

---

## 🛡️ حماية البيانات

✅ **Netlify توفر:**
- تشفير البيانات أثناء النقل (SSL/TLS)
- تخزين آمن في خوادم Netlify
- نسخ احتياطية تلقائية
- حقوق الوصول المحدودة

⚠️ **ملاحظات الأمان:**
- لا تقم بحفظ كلمات المرور كاملة (تم حذفها من التسجيل)
- الاستفادة من المتغيرات البيئية للمعلومات الحساسة
- استخدم HTTPS فقط

---

## 📝 أمثلة البيانات

### مثال 1: تسجيل دخول بنجاح
```
Email: user@example.com
Login Method: email
Timestamp: 2024-03-08T10:30:00Z
```

### مثال 2: اشتراك جديد عبر GitHub
```
Name: Ahmed
Email: ahmed@example.com
Signup Method: github
Timestamp: 2024-03-08T10:35:00Z
```

---

## 🔧 تخصيص النماذج

إذا أردت إضافة حقول جديدة:

### 1. في HTML (مثال):
```html
<form data-netlify="true" hidden="" name="user-signup">
  <input name="name" type="text"/>
  <input name="email" type="email"/>
  <input name="phone" type="tel"/>  <!-- حقل جديد -->
  <input name="signupMethod" type="text"/>
  <input name="timestamp" type="hidden"/>
</form>
```

### 2. في JavaScript:
```javascript
submitToNetlifyForm('user-signup', {
  name: name,
  email: email,
  phone: phoneNumber,  // البيانات الجديدة
  signupMethod: 'email',
  timestamp: new Date().toISOString()
});
```

---

## ⚡ الأداء والحدود

**Netlify Forms:**
- ✅ مجاني حتى **100 تسجيل/شهر**
- ✅ غير محدود بعد ذلك برسوم إضافية
- ✅ سهل الاستخدام وموثوق
- ✅ متوفر على جميع مواقع Netlify

---

## 🆘 استكشاف الأخطاء

### المشكلة: البيانات لا تظهر في Netlify
**الحل:**
1. تأكد من أن `data-netlify="true"` موجود في النموذج
2. تأكد من اسم النموذج يطابق `form-name`
3. أعد بناء الموقع على Netlify

### المشكلة: CAPTCHA ظهر
**الحل:**
- يمكنك تفعيل Netlify Honeypot للحماية من الروبوتات
- انقر على إعدادات النموذج → Add Honeypot field

---

للمزيد من المعلومات:
📖 [Netlify Forms Documentation](https://docs.netlify.com/forms/setup/)
