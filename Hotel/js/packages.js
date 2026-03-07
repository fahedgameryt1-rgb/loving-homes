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

/* dropdown للموبايل */
function toggleCompanyDropdown(e){
  var nav = document.getElementById("myTopnav");
  if(!nav || nav.className.indexOf("responsive") === -1) return;
  e.preventDefault();
  var drop = document.getElementById("companyDrop");
  if(drop) drop.classList.toggle("open");
}

document.addEventListener("click", function(e){
  var nav = document.getElementById("myTopnav");
  if(!nav || nav.className.indexOf("responsive") === -1) return;
  var drop = document.getElementById("companyDrop");
  if(drop && !drop.contains(e.target)) drop.classList.remove("open");
});

/* زر حجز الباقة */
function bookPackage(name){
  alert("✅ تم اختيار " + name + " بنجاح! انتقل لصفحة (احجز إقامة) لإكمال التفاصيل.");
}

/* فحص نموذج الحزمة المخصصة */
document.addEventListener("DOMContentLoaded", function(){
  var form = document.getElementById("bookingForm");
  if(!form) return;

  form.addEventListener("submit", function(event){
    event.preventDefault();

    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var stayDays = document.getElementById("stayDays").value.trim();
    var dogSize = document.getElementById("dogSize").value.trim();
    var comments = document.getElementById("comments").value.trim();

    if(!name || name.length < 3 || name.length > 20){
      alert("❌ الرجاء إدخال اسم صحيح (من 3 إلى 20 حرف).");
      return;
    }

    if(!phone || !/^\d{8,12}$/.test(phone)){
      alert("❌ رقم الهاتف يجب أن يكون بين 8 و 12 رقم.");
      return;
    }

    if(!email || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
      alert("❌ البريد الإلكتروني لازم يكون بصيغة ...@gmail.com");
      return;
    }

    if(!stayDays){
      alert("❌ الرجاء اختيار عدد أيام الإقامة.");
      return;
    }

    if(!dogSize){
      alert("❌ الرجاء اختيار حجم الكلب.");
      return;
    }

    if(comments.length > 150){
      alert("❌ الملاحظات يجب ألا تتجاوز 150 حرف.");
      return;
    }

    alert("✅ تم إرسال طلب الحزمة المخصصة بنجاح!");
    form.reset();
  });
});