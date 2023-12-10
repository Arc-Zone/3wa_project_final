function slider() {
  let indexSlide = 1;
  document.getElementById("next-slide").addEventListener("click", function (e) {
    e.preventDefault();
    let slide = document.getElementsByClassName("slider-article");
    for (let i = 0; i < slide.length; i++) {
      slide[i].style.display = "none";
    }
    indexSlide += 1;

    if (indexSlide > slide.length) {
      indexSlide = 1;
    }
    slide[indexSlide - 1].style.display = "block";
  });
  document
    .getElementById("previous-slide")
    .addEventListener("click", function (e) {
      e.preventDefault();
      let slide = document.getElementsByClassName("slider-article");

      for (let i = 0; i < slide.length; i++) {
        slide[i].style.display = "none";
      }
      indexSlide -= 1;
      if (indexSlide < 1) {
        indexSlide = slide.length;
      }
      slide[indexSlide - 1].style.display = "block";
    });
}
slider();
