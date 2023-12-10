const addToCart = JSON.parse(localStorage.getItem("addCart"));
const itemList = document.getElementById("item-list");
const aside = document.getElementById("side-total");

let totalCart = 0;
if (addToCart && addToCart.length) {
  addToCart.forEach((cart) => {
    const containListItem = document.createElement("div");

    containListItem.innerHTML += `
                        <div> 
                            <img src="${cart.img}" width="50px">
                        </div>
                        <div>
                            <h5>${cart.tittle} </h5> 
                        </div>   
                        <div>
                        <span> Qté x <input  type="number" value="${
                          cart.quantity
                        }" class="addMoreProduct">  </span>
                        </div>      
                        <div>
                            <p>${cart.price * cart.quantity}€</p>
                        </div>
                        <div>
                            <i class="fas fa-trash remove-item" style="color: #000000;" ></i> 
                        </div>       
                    `;

    itemList.appendChild(containListItem);
    containListItem.classList.add("product");

    let totalItem = cart.quantity * cart.price;
    totalCart += totalItem;

    aside.innerHTML = "";
    aside.innerHTML += `
                <section class="aside-cart">
                        <div>
                                <div>
                                    <p>Produit :  </p>  
                                </div>
                                <div>
                                    <p>Frais de livraison : </p>
                                </div>
                                <div>
                                        <p>Total : </p>  
                                </div>
                            </div>
                            <div>   
                                <div>
                                    <p> ${totalCart}€</p>
                                </div>
                                <div>
                                    <div>
                                        <p>4€</p>
                                    </div>
                                    <div>
                                        <p>${totalCart + 4}€</p>
                                    </div>
                            </div>
                </section>  
                
            `;
  });
} else {
  aside.style.display = "none";

  const productMsg = document.createElement("p");

  productMsg.classList.add("no-product");
  productMsg.innerHTML += ` <h3>Vous n'avez pas d'article dans votre panier </h3>`;

  itemList.appendChild(productMsg);
}

const moreProduct = document.getElementsByClassName("addMoreProduct");
for (let i = 0; i < moreProduct.length; i++) {
  moreProduct[i].addEventListener("change", function () {
    moreProduct[i].setAttribute("data-index", i);

    const newQuantity = parseInt(moreProduct[i].value);
    const indexItem = moreProduct[i].getAttribute("data-index");
    let addCart = JSON.parse(localStorage.getItem("addCart"));

    addCart[indexItem].quantity = newQuantity;
    if (newQuantity === 0) {
      addCart.splice(indexItem, 1);
    } else {
      addCart[indexItem].quantity = newQuantity;
    }

    localStorage.setItem("addCart", JSON.stringify(addCart));
    location.reload();
  });
}

const itemDelete = document.getElementsByClassName("remove-item");

for (let i = 0; i < itemDelete.length; i++) {
  itemDelete[i].setAttribute("data-index", i);

  itemDelete[i].addEventListener("click", function () {
    const itemIndex = itemDelete[i].getAttribute("data-index");
    const addCart = JSON.parse(localStorage.getItem("addCart"));

    addCart.splice(itemIndex, 1);
    localStorage.setItem("addCart", JSON.stringify(addCart));
    location.reload();
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const btnModal = document.getElementById("btn-modal");
  const modal = document.getElementById("modal");

  btnModal.addEventListener("click", function (e) {
    e.preventDefault();
    modal.style.display = "block";
  });

  const closeModal = document.getElementById("close-modal");
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
});
