function toggleNav(){
  var x = document.getElementById("myTopnav");
  if(x.className === "topnav"){
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

/* Dropdown على الموبايل */
document.addEventListener("DOMContentLoaded", function(){
  var drop = document.querySelector(".dropdown");
  var btn  = document.querySelector(".dropbtn");

  if(drop && btn){
    btn.addEventListener("click", function(e){
      var nav = document.getElementById("myTopnav");
      if(nav && nav.className.indexOf("responsive") !== -1){
        e.preventDefault();
        drop.classList.toggle("open");
      }
    });
  }
});