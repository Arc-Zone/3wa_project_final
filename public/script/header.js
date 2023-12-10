document.addEventListener("DOMContentLoaded", function () {
  const burguer = document.getElementById("burger-menu");
  const menuBurgeur = document.getElementById("menu-burger");

  burguer.addEventListener("click", function () {
    if (menuBurgeur.style.display === "block") {
      menuBurgeur.style.display = "none";
    } else {
      menuBurgeur.style.display = "block";
    }
  });
});

const searchBar = document.getElementById("search-bar");
const articles = document.getElementsByClassName("search-article");
const categorie = document.getElementsByClassName("categorie");
searchBar.addEventListener("input", function () {
  const thermeSearch = searchBar.value.toLowerCase();

  for (let i = 0; i < articles.length; i++) {
    const textItem = articles[i].textContent.toLowerCase();

    if (textItem.includes(thermeSearch)) {
      articles[i].style.display = "block";
    } else {
      articles[i].style.display = "none";
    }
  }
  const productList = document.getElementsByClassName("product-list");
  for (let j = 0; j < productList.length; j++) {
    if (productList[j].style.display === "block") {
      productList[j].style.display = "flex";
    }
  }
  const order = document.getElementsByClassName("order");
  for (let k = 0; k < order.length; k++) {
    if (order[k].style.display === "block") {
      order[k].style.display = "flex";
    }
  }
});

const supItemCart = document.getElementById("sup-item-cart");
const addCart = JSON.parse(localStorage.getItem("addCart"));

let quantityItem = 0;

for (cart of addCart) {
  quantityItem += cart.quantity;
}
supItemCart.innerHTML += quantityItem;
