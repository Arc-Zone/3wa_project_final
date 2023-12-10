const db = require("../models/database.js");

async function showGuestOrder(req, res) {
  res.render("order_guest.ejs");
}

async function showOrder(req, res) {
  const userAccount = req.session.user;
  res.render("order.ejs", { userAccount });
}

async function showpaymentpage(req, res) {
  res.render("payment.ejs");
}
async function postOrder(req, res) {
  const userId = req.session.user.id;
  const updateOrderFirstName = req.body.firstName;
  const updateOrderLastName = req.body.lastName;
  const updateOrderEmail = req.body.email;
  const updateOrderPhone = req.body.phone;
  const updateOrderAdresse = req.body.adresse;
  const updateOrderpostale = req.body.postale;
  const updateOrderCity = req.body.city;
  const sql = `UPDATE  user SET first_name = ?  , last_name = ? , email = ? , phone = ? , adresse = ?  , city = ? , code_postale = ?  WHERE id = ? `;

  let [oderRows] = await db.query(sql, [
    updateOrderFirstName,
    updateOrderLastName,
    updateOrderEmail,
    updateOrderPhone,
    updateOrderAdresse,
    updateOrderCity,
    updateOrderpostale,
    userId,
  ]);
  res.render("payment.ejs");
}

module.exports.showGuestOrder = showGuestOrder;
module.exports.showOrder = showOrder;
module.exports.postOrder = postOrder;
module.exports.showpaymentpage = showpaymentpage;
