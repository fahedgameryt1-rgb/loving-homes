# نشر موقع Loving Homes على Netlify

## خطوات النشر:

### 1. إعداد Git (إذا لم تفعل بالفعل):
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. إنشاء حساب على Netlify:
- اذهب إلى https://app.netlify.com
- سجل الدخول أو أنشئ حساباً جديداً

### 3. نشر الموقع:

#### الطريقة الأولى: GitHub Integration (الأفضل)
1. ادفع المشروع إلى GitHub
2. في Netlify: New site from Git → اختر GitHub
3. اختر المستودع الخاص بك
4. اختر Branch: main أو master
5. اضغط Deploy

#### الطريقة الثانية: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

### 4. التكوين:
تم تكوين الموقع تلقائياً مع:
- **netlify.toml** - ملف التكوين
- **netlify/functions/** - دوال Netlify Functions للبيانات
- **package.json** - مديرالحزم

## المميزات:

✅ البيانات محفوظة على Netlify Functions  
✅ توثيق آمن مع التحقق من البيانات  
✅ تطبيق هجين (يعمل محلياً وعلى Netlify)  
✅ معالجة أخطاء شاملة  
✅ تنبيهات صوتية وبصرية  

## اختبار محلياً قبل النشر:

```bash
npm install
npm start
```

ثم اذهب إلى: http://localhost:8888

## ملاحظات:
- البيانات الحالية مؤقتة (في الذاكرة)
- للتخزين الدائم: ادمج مع Firebase أو Supabase
- تحقق من logs في Netlify Dashboard عند حدوث مشاكل
