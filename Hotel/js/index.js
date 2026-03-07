function toggleNav() {
  var nav = document.getElementById("myTopnav");
  var drop = document.getElementById("companyDrop");

  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
    if (drop) {
      drop.classList.remove("open");
    }
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

document.addEventListener("click", function (event) {
  var nav = document.getElementById("myTopnav");
  var dropdown = document.getElementById("companyDrop");

  if (
    nav.classList.contains("responsive") &&
    dropdown &&
    !dropdown.contains(event.target) &&
    !event.target.classList.contains("icon")
  ) {
    dropdown.classList.remove("open");
  }
});