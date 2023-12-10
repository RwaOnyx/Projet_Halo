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
});
