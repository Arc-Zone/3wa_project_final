const express = require("express");

const homeController = require("../controllers/home.js");
const shopController = require("../controllers/shop.js");
const adminController = require("../controllers/admin.js");
const userController = require("../controllers/user.js");
const orderController = require("../controllers/order.js");
const guestOrderController = require("../controllers/guest_order.js");
const { body, validationResult } = require("express-validator");
const router = express.Router();

function connected(req, res, next) {
  if (req.session && req.session.connected) {
    return next();
  } else {
    return res.redirect("/");
  }
}
function admin(req, res, next) {
  if (
    req.session &&
    req.session.connected &&
    req.session.user &&
    req.session.admin
  ) {
    return next();
  } else {
    return res.redirect("/");
  }
}

router.get("/", homeController.home);
//Route pour le shop
router.get("/shop", shopController.showCategorie);
router.get("/shop/:id", shopController.showMatiereCategorie);
router.get("/shop/product/:id", shopController.showProduct);
router.get("/panier", shopController.showCart);

//Route user sans compte
router.get("/order-guest", orderController.showGuestOrder);
router.post("/order-guest", guestOrderController.guestOrder);

//rRoute commande user connected
router.get("/order", connected, orderController.showOrder);
router.post("/order", connected, orderController.postOrder);
router.get("/payment", orderController.showpaymentpage);

//Router Inscription
router.get("/inscription", userController.showInscriptionPage);
router.post( "/inscription",userController.userAdd);

//Route Connexion
router.get("/login", userController.showLoginPage);
router.post("/login", userController.sessionLogin);

//Route Account
router.post("/update-user", connected, userController.updateProfileUser);
router.get("/account", connected, userController.showaccountPage);
router.get("/order-page", connected, userController.showOrderPages);
router.get("/sing-out", connected, userController.destroySession);

//Route Admin
router.get("/admin", admin, adminController.homeAdmin);
//Status des commandes
router.post("/admin/order-status", admin, adminController.updateStatusOrder);

//Gestion du slider
router.post("/admin-slider", admin, adminController.addNewSliderImg);
router.get("/admin-slider", admin, adminController.showSliderPage);
router.get("/admin/slider/:id", admin, adminController.showUpdateSliderPage);
router.get("/admin-delete-slider/:id", admin, adminController.deleteSlid);
router.post("/admin/slider/:id", admin, adminController.updataSliderimg);

//Gestion des produit
router.get("/admin-product", admin, adminController.showAdminProduct);
router.post("/admin-product", admin, adminController.addProduct);
router.get("/admin/update/:id", admin, adminController.showUpdateProduct);
router.post("/admin/update/:id", admin, adminController.updateProduct);
router.post("/admin-product/remove/:id", admin, adminController.removeProduct);
router.get(
  "/admin/delete-img-product/:id",
  admin,
  adminController.deleteImgProduct
);
router.post(
  "/admin-product-display",
  admin,
  adminController.updateStatusProduct
);
//Gestion des Categorie
router.post('/admin/delete-categorie/:id' , admin , adminController.deleteCategorie);
router.get("/admin-categorie", admin, adminController.showCategoriePage);
router.post("/admin-categorie-display", admin, adminController.statusCategorie);
//Edit Categorie
router.post("/admin/create-categorie", admin, adminController.createCategorie);
router.get(
  "/admin/edit-categorie/:id",
  admin,
  adminController.showEditCategorie
);
router.post(
  "/admin/edit-categorie/:id",
  admin,
  adminController.updateCategorie
);

module.exports.router = router;
