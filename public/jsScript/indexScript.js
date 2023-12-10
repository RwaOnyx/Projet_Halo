document.addEventListener("DOMContentLoaded", function() {
  
  const scrollToTopButton = document.getElementById("scrollToTopButton");

  // Afficher le bouton quand l'utilisateur fait défiler vers le bas
  window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      scrollToTopButton.style.display = "block";
    }
    else {
      scrollToTopButton.style.display = "none";
    }
  };

  // Faites défiler la page vers le haut lorsque le bouton est cliqué
  scrollToTopButton.addEventListener("click", function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  const gradeElement = document.querySelector('.index-div-messages');

  setTimeout(function() {
    gradeElement.classList.add('hidden');
  }, 5000);

  const h1 = document.querySelector('.h1-animation');
  console.log(window.orientation);
  if (window.innerWidth >= 1024 && (window.orientation === 90 || window.orientation === -90)) {
    setTimeout(function() {
      h1.classList.remove('h1-animation-hide');
    }, 2000);

    setTimeout(function() {
      h1.classList.add('h1-animation-hide');
    }, 8000);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth === 1200) {
      if (window.innerWidth >= 1024 && (window.orientation === 90 || window.orientation === -90)) {
        setTimeout(function() {
          h1.classList.remove('h1-animation-hide');
        }, 2000);

        setTimeout(function() {
          h1.classList.add('h1-animation-hide');
        }, 8000);
      }
    }
  });
});
