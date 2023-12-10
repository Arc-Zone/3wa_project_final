document.addEventListener("DOMContentLoaded", function () {
  const optionValue = document.getElementsByClassName("option-value");
  const order = document.getElementsByClassName("order");

  for (let i = 0; i < optionValue.length; i++) {
    const dataIndex = optionValue[i].getAttribute("data-index");
    if (dataIndex === "Livrée") {
      order[i].style.display = "none";
    }
  }
});
