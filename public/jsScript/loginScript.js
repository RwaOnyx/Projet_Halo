document.addEventListener("DOMContentLoaded", function() {
    const showInscriptionFormButton = document.querySelector(".showInscriptionForm");
    const inscriptionForm = document.querySelector(".inscriptionForm");
    const inscriptionQuestion = document.querySelector(".inscriptionQuestion");

    showInscriptionFormButton.addEventListener("click", function() {
        console.log("passage")
        inscriptionForm.classList.add('display-block');
        inscriptionForm.classList.remove('display-none');
        inscriptionQuestion.classList.add('display-none');
        inscriptionQuestion.classList.remove('display-block');
    });
})
