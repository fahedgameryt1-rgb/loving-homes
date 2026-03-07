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