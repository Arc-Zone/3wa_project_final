const db = require("../models/database.js");

async function showCategorie(req, res) {
  const sql = ` SELECT * FROM product_categorie WHERE  display_categorie 	= "block"`;
  let [shopCategroiesRows] = await db.query(sql);

  res.render("shop.ejs", { categories: shopCategroiesRows });
}

async function showMatiereCategorie(req, res) {
  const categorieId = req.params.id;
  const sql = ` SELECT product.*, MIN(product_img.img_url) AS img_url
            FROM product
            LEFT JOIN list_product_img ON product.id = list_product_img.product_id
            LEFT JOIN product_img ON list_product_img.product_img_id = product_img.id
            WHERE product.categorie_id = ? AND
            product.display_product = "block"
            GROUP BY product.id
            ORDER BY product.id;
            `;
  let [matiereCategorie] = await db.query(sql, [categorieId]);
  res.render("product_per_categorie.ejs", { categorieData: matiereCategorie });
}

async function showProduct(req, res) {
  const productId = req.params.id;
  const sql = `SELECT * FROM  product WHERE id = ? `;
  const sqlImg = `SELECT product_img.*
                                        FROM list_product_img
                                        JOIN product_img ON list_product_img.product_img_id = product_img.id
                                        WHERE list_product_img.product_id = ?
                                        `;
  let [imgRows] = await db.query(sqlImg, [productId]);
  let [productRows] = await db.query(sql, [productId]);
  res.render("article.ejs", { articles: productRows, articlesImg: imgRows });
}

async function showCart(req, res) {
  res.render("cart.ejs");
}

module.exports.showCart = showCart;
module.exports.showCategorie = showCategorie;
module.exports.showMatiereCategorie = showMatiereCategorie;
module.exports.showProduct = showProduct;
