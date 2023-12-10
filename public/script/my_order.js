document
  .getElementById("check-data-modal")
  .addEventListener("click", function () {
    document.getElementById("modal-order-data").style.display = "block";
  });
document.getElementById("close-modal").addEventListener("click", function () {
  document.getElementById("modal-order-data").style.display = "none";
});
function submitPostFormOrder() {
  const postFormOrder = document.getElementById("post-form-order");
  postFormOrder.submit();
}
