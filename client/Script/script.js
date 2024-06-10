// Importazione navbar
document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("navbar");

  if (navbarContainer) {
    fetch("../navbar.html")
      .then((response) => response.text())
      .then((html) => {
        navbarContainer.innerHTML = html;
      })
      .catch((error) => {
        console.warn("Errore nel caricamento della navbar:", error);
      });
  }
})

// Importazione footer
document.addEventListener("DOMContentLoaded", function () {
  const navbarContainer = document.getElementById("footer");

  if (navbarContainer) {
    fetch("../footer.html")
      .then((response) => response.text())
      .then((html) => {
        navbarContainer.innerHTML = html;
      })
      .catch((error) => {
        console.warn("Errore nel caricamento del footer:", error);
      });
  }
})

// Funzione per il menu a tendina
function hamburgerMenu() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

//slideshow
let slideIndex = 0;

function plusSlides(n) {
  slideIndex += n
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (slideIndex > slides.length) {
    slideIndex = 1 
  }
  if (slideIndex < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex - 1].style.display = "block";
}

timeout();
function timeout() {
  setTimeout(function () {
      plusSlides(1);
      timeout();
  }, 5000);
}
