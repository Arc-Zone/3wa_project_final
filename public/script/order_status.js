const statusOrderElements = document.getElementsByClassName("status-order");

for (let i = 0; i < statusOrderElements.length; i++) {
  const statusText =
    statusOrderElements[i].textContent || statusOrderElements[i].innerText;

  if (statusText.trim().toUpperCase() === "EN ATTENTE") {
    statusOrderElements[i].style.color = "#FF0000";
  }
  if (statusText.trim().toUpperCase() === "EN COURS DE TRAITEMENT") {
    statusOrderElements[i].style.color = "#ff8000";
  }
  if (statusText.trim().toUpperCase() === "EN COURS DE LIVRAISON") {
    statusOrderElements[i].style.color = "#FFD700";
  }
  if (statusText.trim().toUpperCase() === "LIVREE") {
    statusOrderElements[i].style.color = "#00FF00";
  }
}
