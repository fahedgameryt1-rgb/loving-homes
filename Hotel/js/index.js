function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function toggleCompanyDropdown(event) {
  event.preventDefault();
  var nav = document.getElementById("myTopnav");
  var dropdown = document.getElementById("companyDrop");

  if (nav.classList.contains("responsive")) {
    dropdown.classList.toggle("open");
  }
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown')) {
    var dropdown = document.getElementById("companyDrop");
    if (dropdown) {
      dropdown.classList.remove("open");
    }
  }
}