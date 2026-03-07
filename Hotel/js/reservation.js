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

document.addEventListener("DOMContentLoaded", function(){
  var form = document.getElementById("bookingForm");
  var formMessage = document.getElementById("formMessage");
  var errorSound = document.getElementById("errorSound");

  if(!form) return;

  form.addEventListener("submit", function(e){
    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var pkg = document.getElementById("package").value.trim();
    var stayDays = document.getElementById("stayDays").value.trim();
    var dogSize = document.getElementById("dogSize").value.trim();
    var roomType = document.getElementById("roomType").value.trim();
    var checkin = document.getElementById("checkin").value.trim();
    var notes = document.getElementById("notes").value.trim();

    var today = new Date().toISOString().split("T")[0];

    if(!name || name.length < 3 || name.length > 20){
      e.preventDefault();
      showError("الرجاء إدخال اسم صحيح من 3 إلى 20 حرف");
      return;
    }

    if(!phone || !/^\d{8,12}$/.test(phone)){
      e.preventDefault();
      showError("رقم الهاتف يجب أن يكون بين 8 و 12 رقم");
      return;
    }

    if(!email || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
      e.preventDefault();
      showError("البريد الإلكتروني يجب أن يكون بصيغة صحيحة وينتهي بـ gmail.com");
      return;
    }

    if(!pkg){
      e.preventDefault();
      showError("الرجاء اختيار الباقة");
      return;
    }

    if(!stayDays){
      e.preventDefault();
      showError("الرجاء اختيار عدد أيام الإقامة");
      return;
    }

    if(!dogSize){
      e.preventDefault();
      showError("الرجاء اختيار حجم الكلب");
      return;
    }

    if(!roomType){
      e.preventDefault();
      showError("الرجاء اختيار نوع الغرفة");
      return;
    }

    if(!checkin){
      e.preventDefault();
      showError("الرجاء اختيار تاريخ الوصول");
      return;
    }

    if(checkin < today){
      e.preventDefault();
      showError("تاريخ الوصول يجب أن يكون اليوم أو بعده");
      return;
    }

    if(notes.length > 150){
      e.preventDefault();
      showError("الملاحظات يجب ألا تتجاوز 150 حرف");
      return;
    }
  });

  function showError(message){
    if(formMessage){
      formMessage.textContent = message;
      formMessage.style.color = "red";
    }

    if(errorSound){
      errorSound.currentTime = 0;
      errorSound.play().catch(function(){});
    }
  }
});