document.addEventListener("DOMContentLoaded", function () {
  let indexSlide = 0;
  showSlide();

  function showSlide() {
    let i;
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    indexSlide++;
    if (indexSlide > slides.length) {
      indexSlide = 1;
    }
    slides[indexSlide - 1].style.display = "block";
    setTimeout(showSlide, 4000);
  }
});
