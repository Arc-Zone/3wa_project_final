const express = require("express");
const routes = require("./routes/routes.js");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const orderController = require("./controllers/payment.js");
const guestOrderController = require("./controllers/guest_order.js");
const crypto = require("crypto");
const app = express();

app.use(express.static("public"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//initialisation du système de sessions

app.use(
  session({
    store: new FileStore({}),
    secret: "2IuFj-$B2P^T$A6@2",
    resave: false,
    saveUninitialized: true,
    httpOnly: true,
    secure: true,
    ephemeral: true,
  })
);

//verifie si session guest a etait crée depuis guest_order
app.get("/guestInfo", (req, res) => {
  if (req.session.isGuest) {
    res.send(
      "Informations de l'invité : " + JSON.stringify(req.session.guestInfo)
    );
  } else {
    res.send("Aucune session d'invité trouvée.");
  }
});

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use("/", routes.router);

app.use("/shop", routes.router);
app.use("/shop/:id", routes.router);
app.use("/shop/product/:id", routes.router);

app.use("/panier", routes.router);
app.use("/order-guest", routes.router);
app.use("/order", routes.router);
app.use("/order/payment", routes.router);

app.use("/inscription", routes.router);

app.use("/login", routes.router);
app.use("/account", routes.router);

app.use("/admin/slider-update/:id", routes.router);
app.use("/admin-delete-slider/:id ", routes.router);
app.use("/admin", routes.router);
app.use("/admin/update/:id", routes.router);
app.use("/admin/remove/:id", routes.router);


app.post("/process-paypal-order", async (req, res) => {
  try {
    let userId;
    let guestInfo;

    if (req.session.user) {
      userId = req.session.user.id;
    } else {
      guestInfo = req.session.guestInfo;
    }

    const addCart = req.body.addCart;
    const totalAmount = req.body.totalAmount;

    const orderProcessed = await orderController.processOrder(
      addCart,
      totalAmount,
      userId,
      guestInfo
    );
    if (orderProcessed) {
      res.json({ success: true });
    } else {
      res
        .status(500)
        .json({ error: "Erreur lors du traitement de la commande." });
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors du traitement de la commande.",
    });
  }
});

app.listen(3000, () => {
  console.log("Start server on port 3000");
});
