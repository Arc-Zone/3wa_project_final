const db = require("../models/database.js");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

async function userAdd(req, res) {
  const saltRound = 10;
  const userMail = req.body.email;
  const userPassword = req.body.motdepasse;
  const userFirstName = req.body.prenom;
  const userLastName = req.body.nom;
  const userAdresse = req.body.adresse;
  const userCity = req.body.city;
  const userPostal = req.body.postale;
  const userPhone = req.body.phone;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.redirect("/inscription");
  }
  bcrypt.hash(userPassword, saltRound, async (err, hash) => {
    try {
      const sql = ` INSERT INTO user (id, first_name, last_name, email, password , adresse , city , code_postale , phone) VALUES ( null , ? , ? , ? , ? , ? , ? ,? ,?);`;
      let [userRows, userFields] = await db.query(sql, [
        userFirstName,
        userLastName,
        userMail,
        hash,
        userAdresse,
        userCity,
        userPostal,
        userPhone,
      ]);
      if (userRows.email > 0) {
        return res.redirect("/");
      } else {
        res.redirect("/inscription");
      }
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });
}

async function showInscriptionPage(req, res) {
  res.render("inscription.ejs");
}

async function showLoginPage(req, res) {
  res.render("login.ejs");
}

async function sessionLogin(req, res) {
  try {
    const userPassword = req.body.password;
    const userEmail = req.body.email;
    const bddPassword = ` SELECT * FROM user WHERE email = ? `;

    let [users] = await db.query(bddPassword, [userEmail]);

    for (let user of users) {
      const match = await bcrypt.compare(userPassword, user.password);

      if (match) {
        req.session.connected = true;
        req.session.user = user;
        if (user.admin) {
          req.session.admin = user.admin;
          return res.redirect("/admin");
        }
        return res.redirect("/");
      }
    }
  } catch (err) {
    return res.redirect("/inscription");
  }
}

async function destroySession(req, res) {
  if (req.session) {
    req.session.destroy((err) => {
      res.redirect("/");
      return;
    });
  } else {
    res.redirect("/");
  }
}

async function showaccountPage(req, res) {
  const userAccount = req.session.user;
  res.render("account.ejs", { userAccount });
}

async function showOrderPages(req, res) {
  const userId = req.session.user.id;

  const sql = `SELECT
            user_order.id AS id_commande,
            user_order.user_id,
            user_order.order_date,
            user_order.total_amount,
            user_order.status,
            GROUP_CONCAT(order_details.id) AS id_detail_commande,
            GROUP_CONCAT(order_details.product_id) AS product_ids,
            GROUP_CONCAT(product.name) AS product_names,
            GROUP_CONCAT(order_details.quantity) AS quantities,
            GROUP_CONCAT(order_details.price) AS prices
        FROM
            user_order
        JOIN
            order_details ON user_order.id = order_details.order_id
        JOIN
            product ON order_details.product_id = product.id
        WHERE
            user_order.user_id = ?
        GROUP BY
            user_order.id
        ORDER BY
        user_order.id DESC
            `;
  const userSql = `SELECT * FROM user WHERE id = ? `;

  try {
    let [orderRows] = await db.query(sql, [userId]);
    let [userRows] = await db.query(userSql, [userId]);

    res.render("my_order.ejs", { myOrder: orderRows, userInfo: userRows });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Erreur lors de la récupération des données des commandes");
  }
}

async function updateProfileUser(req, res) {
  const userId = req.session.user.id;
  
  const firstName = req.body.prenom;
  const lastName = req.body.nom;
  const adresse = req.body.adresse;
  const city = req.body.city;
  const codePostale = req.body.codePostale;
  const phone = req.body.phone;
  const sql = `UPDATE  user SET  first_name = ? , last_name = ? , adresse = ? , city = ? ,code_postale = ? , phone = ?  WHERE id = ? `;
  let [updateProfileUserRows] = await db.query(sql, [
    firstName,
    lastName,
    adresse,
    city,
    codePostale,
    phone,
    userId,
  ]);

  res.redirect("/account");
}

module.exports.userAdd = userAdd;
module.exports.sessionLogin = sessionLogin;
module.exports.showInscriptionPage = showInscriptionPage;
module.exports.showLoginPage = showLoginPage;
module.exports.showaccountPage = showaccountPage;
module.exports.destroySession = destroySession;
module.exports.showOrderPages = showOrderPages;
module.exports.updateProfileUser = updateProfileUser;
