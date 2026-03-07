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

document.addEventListener("DOMContentLoaded", function(){
  var form = document.getElementById("bookingForm");
  var formMessage = document.getElementById("formMessage");
  var successSound = document.getElementById("successSound");
  var errorSound = document.getElementById("errorSound");

  if(!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

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
      showError("الرجاء إدخال اسم صحيح من 3 إلى 20 حرف");
      return;
    }

    if(!phone || !/^\d{8,12}$/.test(phone)){
      showError("رقم الهاتف يجب أن يكون بين 8 و 12 رقم");
      return;
    }

    if(!email || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
      showError("البريد الإلكتروني يجب أن يكون بصيغة صحيحة وينتهي بـ gmail.com");
      return;
    }

    if(!pkg){
      showError("الرجاء اختيار الباقة");
      return;
    }

    if(!stayDays){
      showError("الرجاء اختيار عدد أيام الإقامة");
      return;
    }

    if(!dogSize){
      showError("الرجاء اختيار حجم الكلب");
      return;
    }

    if(!roomType){
      showError("الرجاء اختيار نوع الغرفة");
      return;
    }

    if(!checkin){
      showError("الرجاء اختيار تاريخ الوصول");
      return;
    }

    if(checkin < today){
      showError("تاريخ الوصول يجب أن يكون اليوم أو بعده");
      return;
    }

    if(notes.length > 150){
      showError("الملاحظات يجب ألا تتجاوز 150 حرف");
      return;
    }

    var formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(formData).toString()
    })
    .then(function(){
      showSuccess("تم إرسال طلب الحجز بنجاح");
      form.reset();
    })
    .catch(function(){
      showError("حدث خطأ أثناء إرسال الحجز");
    });
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

  function showSuccess(message){
    if(formMessage){
      formMessage.textContent = message;
      formMessage.style.color = "green";
    }

    if(successSound){
      successSound.currentTime = 0;
      successSound.play().catch(function(){});
    }
  }
});