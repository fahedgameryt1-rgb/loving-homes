function toggleNav(){
  var x = document.getElementById("myTopnav");
  if(x.className === "topnav"){
    x.className += " responsive";
  } else {
    x.className = "topnav";
    var drop = document.getElementById("companyDrop");
    if(drop) drop.classList.remove("open");
  }
}

/* Dropdown للموبايل */
function toggleCompanyDropdown(e){
  var nav = document.getElementById("myTopnav");
  if(!nav || nav.className.indexOf("responsive") === -1) return;
  e.preventDefault();
  var drop = document.getElementById("companyDrop");
  if(drop) drop.classList.toggle("open");
}

/* إغلاق dropdown إذا ضغطت برا */
document.addEventListener("click", function(e){
  var nav = document.getElementById("myTopnav");
  if(!nav || nav.className.indexOf("responsive") === -1) return;
  var drop = document.getElementById("companyDrop");
  if(drop && !drop.contains(e.target)) drop.classList.remove("open");
});

/* قلب مفيد */
function toggleHeart(el){
  el.classList.toggle("liked");
}

/* تفاصيل النصائح */
function showTip(type){
  var msg = "";

  if(type === "vaccines"){
    msg = "قبل الإقامة تأكد من التطعيمات وبلغنا عن أي حساسية أو أدوية أو حالات خاصة.";
  } else if(type === "bring"){
    msg = "يفضل إحضار تعليمات الطعام أو طعامه الخاص ولعبة صغيرة أو بطانية تعطيه راحة.";
  } else if(type === "package"){
    msg = "اختيار الباقة يعتمد على نشاط الكلب: النشيط يناسبه مميزة أو كلاسيكية والهادئ يناسبه يومية أو كلاسيكية.";
  } else if(type === "behavior"){
    msg = "إذا كلبك لا يحب الاختلاط أو يقلق بسرعة أخبرنا لنرتب مكان مناسب له ونقلل التوتر.";
  } else if(type === "food"){
    msg = "اكتب لنا كمية الطعام وعدد الوجبات وأي ممنوعات غذائية أو جدول أدوية إن وجد.";
  } else if(type === "updates"){
    msg = "حسب الباقة يمكن إرسال تحديثات وصور يومية للمالك حتى يكون مطمئن على كلبه.";
  } else {
    msg = "معلومة عامة: تواصل معنا لأي تفاصيل تخص حالة كلبك.";
  }

  alert("📌 " + msg);
}