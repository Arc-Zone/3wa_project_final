const db = require("../models/database.js");
const crypto = require("crypto");

async function processOrder(
  cartItems,
  totalAmount,
  userId,
  guestInfo,
  req,
  res
) {
  try {
    let orderId;
    let guestOrderId; // Ajout de la variable pour l'ID de la commande d'invité

    if (userId) {
      // Créer la commande principale pour un utilisateur connecté
      const insertUserOrderSql = `INSERT INTO user_order (user_id, order_date, total_amount, status) VALUES (?, NOW(), ?, 'en attente')`;
      const [userOrderResult] = await db.query(insertUserOrderSql, [
        userId,
        totalAmount,
      ]);
      orderId = userOrderResult.insertId;
      // Pour chaque article dans le panier
      for (const cartItem of cartItems) {
        // Vérifier si le produit existe
        const sql = `SELECT * FROM product WHERE id = ?`;
        const [compareRows] = await db.query(sql, [cartItem.id]);

        if (!compareRows.length) {
          console.error(
            `Produit avec l'ID ${cartItem.id} non trouvé dans la base de données.`
          );
          return false;
        }

        if (compareRows[0].price !== cartItem.price) {
          console.error(
            `Le prix du produit avec l'ID ${cartItem.id} ne correspond pas.`
          );
          return false;
        }

        // Insérer les détails de la commande
        const insertOrderDetailsSql = `
                INSERT INTO order_details (order_id, product_id, quantity, price )
                VALUES (?, ?, ?, ?)`;
        await db.query(insertOrderDetailsSql, [
          orderId , 
          cartItem.id,
          cartItem.quantity,
          cartItem.price,
        ]);
      }
      return true;
    } else if (guestInfo) {
      // Créer la commande principale pour un invité
      const updateGuestOrderSql = `
            UPDATE guest_order
            SET 
                order_date = NOW(),
                total_amount = ?,
                guest_status_order = 'payée',
                guest_email = ?,
                guest_address = ?,
                guest_city = ?,
                guest_postal_code = ?,
                guest_phone = ?,
                guest_first_name = ?,
                guest_last_name = ?
            WHERE
                guest_id = ?`;

      const [guestOrderRows] = await db.query(updateGuestOrderSql, [
        totalAmount,
        guestInfo.email,
        guestInfo.adresse,
        guestInfo.city,
        guestInfo.codePostale,
        guestInfo.phone,
        guestInfo.firstName,
        guestInfo.lastName,
        guestInfo.id,
      ]);
      orderId = guestOrderRows.insertId;
      guestOrderId = guestInfo.id;
      // Pour chaque article dans le panier
      for (const cartItem of cartItems) {
        // Vérifier si le produit existe
        const sql = `SELECT * FROM product WHERE id = ?`;
        const [compareRows] = await db.query(sql, [cartItem.id]);

        if (!compareRows.length) {
          console.error(
            `Produit avec l'ID ${cartItem.id} non trouvé dans la base de données.`
          );
          return false;
        }

        if (compareRows[0].price !== cartItem.price) {
          console.error(
            `Le prix du produit avec l'ID ${cartItem.id} ne correspond pas.`
          );
          return false;
        }

        // Insérer les détails de la commande
        const insertOrderDetailsSql = `
                INSERT INTO order_details (guest_order_id, product_id, quantity, price )
                VALUES (?, ?, ?, ?)`;
        await db.query(insertOrderDetailsSql, [
          guestOrderId,
          cartItem.id,
          cartItem.quantity,
          cartItem.price,
        ]);
      }
      return true;
    } else {
      console.error("guest Info " + guestInfo + " userId" + userId);
      return false;
    }
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors du traitement de la commande :",
      error
    );
    return false;
  }
}

module.exports.processOrder = processOrder;
