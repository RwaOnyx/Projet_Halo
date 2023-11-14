document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function showSlide(slideIndex) {
  if (slideIndex < 0) {
    currentSlide = slides.length - 1;
  } else if (slideIndex >= slides.length) {
    currentSlide = 0;
  }

  slides.forEach((slide) => (slide.style.display = "none"));
  dots.forEach((dot) => dot.classList.remove("active"));

  slides[currentSlide].style.display = "block";
  dots[currentSlide].classList.add("active");
}

function nextSlide() {
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }
  showSlide(currentSlide);
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index;
    showSlide(currentSlide);
  });
});

document.querySelectorAll(".left-arrow").forEach((arrow) => {
  arrow.addEventListener("click", prevSlide);
});

document.querySelectorAll(".right-arrow").forEach((arrow) => {
  arrow.addEventListener("click", nextSlide);
});

showSlide(currentSlide);

})