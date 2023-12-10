const crypto = require("crypto");
const db = require("../models/database.js");
const { code } = require("statuses");
// Fonction pour générer un identifiant unique pour une commande d'invité
function generateGuestOrderId() {
  // Combinaison de la date actuelle et d'un nombre aléatoire
  const uniqueString =
    Date.now().toString() + Math.random().toString(36).substring(7);

  // Utilisation de la fonction de hachage SHA-256
  const orderId = crypto
    .createHash("sha256")
    .update(uniqueString)
    .digest("hex");

  return orderId;
}

async function guestOrder(req, res) {
  const id = generateGuestOrderId();

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const adresse = req.body.adresse;
  const codePostale = req.body.codePostale;
  const city = req.body.city;

  req.session.isGuest = true;
  req.session.guestInfo = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    adresse: adresse,
    codePostale: codePostale,
    city: city,
    id: id,
  };
  const guestInfo = req.session.guestInfo;

  console.log(guestInfo);

  const guestSql = `INSERT INTO guest_order (guest_id , order_date , guest_email , guest_address , guest_city , guest_postal_code , guest_phone , guest_first_name , guest_last_name) VALUES (? , NOW() ,? , ? ,? , ? , ? , ?,? )`;
  let [guestSqlRows] = await db.query(guestSql, [
    id,
    email,
    adresse,
    city,
    codePostale,
    phone,
    firstName,
    lastName,
  ]);
  res.redirect("/payment");
}

module.exports.guestOrder = guestOrder;
