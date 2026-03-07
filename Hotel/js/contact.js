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

/* Validation + submit */
document.addEventListener("DOMContentLoaded", function(){
  var form = document.getElementById("contactForm");
  var formMessage = document.getElementById("formMessage");
  var successSound = document.getElementById("successSound");
  var errorSound = document.getElementById("errorSound");

  if(!form) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var email = document.getElementById("email").value.trim();
    var topic = document.getElementById("topic").value.trim();
    var message = document.getElementById("message").value.trim();

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

    if(!topic){
      showError("الرجاء اختيار سبب التواصل");
      return;
    }

    if(!message || message.length < 10){
      showError("الرجاء كتابة رسالة واضحة لا تقل عن 10 أحرف");
      return;
    }

    if(message.length > 200){
      showError("الرسالة يجب ألا تتجاوز 200 حرف");
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
      showSuccess("تم إرسال رسالتك بنجاح");
      form.reset();
    })
    .catch(function(){
      showError("حدث خطأ أثناء الإرسال");
    });
  });

  function showError(text){
    if(formMessage){
      formMessage.textContent = text;
      formMessage.style.color = "red";
    }

    if(errorSound){
      errorSound.currentTime = 0;
      errorSound.play().catch(function(){});
    }
  }

  function showSuccess(text){
    if(formMessage){
      formMessage.textContent = text;
      formMessage.style.color = "green";
    }

    if(successSound){
      successSound.currentTime = 0;
      successSound.play().catch(function(){});
    }
  }
});