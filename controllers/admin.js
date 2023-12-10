const db = require("../models/database.js");

async function homeAdmin(req, res) {
  const sql = `SELECT
user_order.id AS id_commande,
user_order.user_id,
user_order.order_date,
user_order.total_amount,
user_order.status,
user.first_name AS user_first_name, 
user.last_name AS user_last_name,
user.email AS user_email,
user.adresse AS user_adresse,
user.city AS user_city,
user.code_postale AS user_code_postale,
user.phone AS user_phone,
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
JOIN
user ON user_order.user_id = user.id
GROUP BY
user_order.id

UNION

SELECT
go.guest_id AS id_commande,
0 AS user_id,
MIN(go.order_date) AS order_date,
SUM(go.total_amount) AS total_amount,
go.guest_status_order AS status,
go.guest_first_name AS user_first_name,
go.guest_last_name AS user_last_name,
go.guest_email AS user_email,
go.guest_address AS user_adresse,
go.guest_city AS user_city,
go.guest_postal_code AS user_code_postale,
go.guest_phone AS user_phone,
GROUP_CONCAT(od.guest_order_id) AS id_detail_commande,
GROUP_CONCAT(od.product_id) AS product_ids,
GROUP_CONCAT(p.name) AS product_names,
GROUP_CONCAT(od.quantity) AS quantities,
GROUP_CONCAT(od.price) AS prices
FROM
guest_order go
LEFT JOIN
order_details od ON go.guest_id = od.guest_order_id
LEFT JOIN
product p ON od.product_id = p.id
WHERE 
go.guest_status_order = 'payée'
GROUP BY
go.guest_id, go.guest_status_order, go.guest_first_name, go.guest_last_name,
go.guest_email, go.guest_address, go.guest_city, go.guest_postal_code, go.guest_phone

ORDER BY
id_commande DESC;
`;

  let [orderManagement] = await db.query(sql);
  let [orderUser] = await db.query(` SELECT * FROM user `);
  
  res.render("admin.ejs", { orders: orderManagement, userInfo: orderUser });
}

async function showAdminProduct(req, res) {
  let [showUpdateProduct] = await db.query(`SELECT *  FROM product `);
  let [categorieAdminRows] = await db.query(` SELECT * FROM product_categorie`);
  res.render("admin_product.ejs", {
    products: showUpdateProduct,
    categorieName: categorieAdminRows,
  });
}

async function addProduct(req, res) {
  const productName = req.body.name;
  const productDescription = req.body.description;
  const productPrice = req.body.price;
  const productCount = req.body.count;
  const productCategorie = req.body.categorie;
  const productquantity = req.body.quantity;
  const images = req.body.images;

  const sqlProduct = `
  INSERT INTO product (name, description, price, count, categorie_id)
  VALUES (?, ?, ?, ?, ?)
`;
  let [productRows] = await db.query(sqlProduct, [
    productName,
    productDescription,
    productPrice,
    productquantity,
    productCount,
    productCategorie,
  ]);
  const productId = productRows.insertId;

  const imgInsertPromises = images.map(async (image) => {
    const sqlImage = `
      INSERT INTO product_img (img_url, caption_img)
      VALUES (?, ?)
                `;
    const [imgRows] = await db.query(sqlImage, [image.img_url, image.caption]);
    return imgRows.insertId;
  });

  const imgIds = await Promise.all(imgInsertPromises);

  const linkImagesSql = `
                INSERT INTO list_product_img (product_id, product_img_id)
                VALUES (?, ?)
            `;
  const linkPromises = imgIds.map(async (imgId) => {
    const [linkRows] = await db.query(linkImagesSql, [productId, imgId]);
    return linkRows.insertId;
  });

  await Promise.all(linkPromises);

  res.redirect("/admin-product");
}

async function updateStatusProduct(req, res) {
  const productId = req.body.productId;
  const statusProduct = req.body.statusProduct;
  const sql = `UPDATE product SET  display_product 	= ?  WHERE id = ? `;

  let [updateProductStatus] = await db.query(sql, [statusProduct, productId]);

}

async function updateStatusOrder(req, res) {
  const statuswaiting = req.body.statusOrder;
  const orderId = req.body.orderId;
  const updateStatus = `
            UPDATE user_order 
            JOIN order_details ON user_order.id = order_details.order_id
            SET status = ? 
            WHERE  order_details.order_id = ? `;

  const [updateStatusRows] = await db.query(updateStatus, [
    statuswaiting,
    orderId,
  ]);
  res.redirect("/admin");
}

async function showUpdateProduct(req, res) {
  const productId = req.params.id;

  let [rowsProduct] = await db.query(
    `SELECT * FROM product WHERE product.id = ?`,
    [productId]
  );
  let [rowsCategorie] = await db.query(`SELECT * FROM product_categorie`);

  let [rowsImg] = await db.query(
    `
                SELECT product_img.*
                FROM list_product_img
                INNER JOIN product_img ON list_product_img.product_img_id = product_img.id
                WHERE list_product_img.product_id = ?;
            `,
    [productId]
  );

  res.render("admin_edit_product.ejs", {
    product: rowsProduct[0],
    categories: rowsCategorie,
    images: rowsImg,
  });
}

async function updateProduct(req, res) {
  const productId = req.params.id;
  const updateName = req.body.name;
  const updateDescription = req.body.description;
  const updatePrice = req.body.price;
  const updateCategorie = req.body.categorie;

  // Vérification des champs requis
  if (!updateName || !updateDescription || !updatePrice || !updateCategorie) {
    return res.status(400).send("Tous les champs requis doivent être remplis.");
  }

  try {
    // Mise à jour des informations principales
    const sql = `
                    UPDATE product
                    SET name = ?, description = ?, price = ?, categorie_id = ?
                    WHERE id = ?
                `;
    await db.query(sql, [
      updateName,
      updateDescription,
      updatePrice,
      updateCategorie,
      productId,
    ]);

    // Sélectionnez les images existantes liées au produit
    let [rowsImg] = await db.query(
      `
                    SELECT product_img.id, product_img.img_url
                    FROM list_product_img
                    INNER JOIN product_img ON list_product_img.product_img_id = product_img.id
                    WHERE list_product_img.product_id = ?;
                `,
      [productId]
    );

    // Mettre à jour les images existantes
    const updateImgPromises = rowsImg.map(async (row, index) => {
      const updatedImg = req.body[`img_1_${index}`];

      // Mettre à jour l'URL de l'image dans la table product_img
      await db.query(
        `
                            UPDATE product_img
                            SET img_url = ?
                            WHERE id = ?;
                        `,
        [updatedImg, row.id]
      );
    });

    // Attendez que toutes les mises à jour d'images soient terminées
    await Promise.all(updateImgPromises);

    // Ajout des nouvelles images liées au produit
    const imagesToAdd = req.body.add_images || [];
    const imgInsertPromises = imagesToAdd.map(async (image) => {
      if (image.img_url && image.caption) {
        const sqlImage = `
                            INSERT INTO product_img (img_url, caption_img)
                            VALUES (?, ?)
                        `;
        const [imgRows] = await db.query(sqlImage, [
          image.img_url,
          image.caption,
        ]);

        const insertIntoListProductImg = `
                            INSERT INTO list_product_img (product_id, product_img_id)
                            VALUES (?, ?)
                        `;
        await db.query(insertIntoListProductImg, [productId, imgRows.insertId]);

        return imgRows.insertId;
      }
      return null; // Ignorer les entrées sans URL d'image ou légende
    });

    const imgIds = (await Promise.all(imgInsertPromises)).filter(
      (id) => id !== null
    );

    res.redirect("/admin-product");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function removeProduct(req, res) {
  const productId = req.params.id;

  try {
    let [deletProdcutRows] = await db.query(
      `DELETE FROM product WHERE id = ?; `,
      [productId]
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
  res.redirect("/admin-product");
}

async function deleteImgProduct(req, res) {
  const imgId = req.params.id;
  const sql = `DELETE FROM product_img WHERE id = ? `;
  let [deleteImgRows] = await db.query(sql, [imgId]);
  res.redirect("/admin-product");
}

async function showSliderPage(req, res) {
  let [ShowSliderImageRows] = await db.query(` SELECT *  FROM slider_images `);
  res.render("admin_slider.ejs", { imageSliders: ShowSliderImageRows });
}

async function addNewSliderImg(req, res) {
  const urlImg = req.body.url;
  const captionImg = req.body.caption;
  const sql = `INSERT INTO slider_images (image_url , caption ) VALUES (? , ? )`;
  let [newSliderImgRows] = await db.query(sql, [urlImg, captionImg]);

  res.redirect("/admin-slider");
}

async function showUpdateSliderPage(req, res) {
  const sliderId = req.params.id;
  let [rowsSlider, fieldsProduct] = await db.query(
    `SELECT * FROM slider_images WHERE slider_images.id = ? `,
    [sliderId]
  );
  res.render("updateslider.ejs", { updateData: rowsSlider[0] });
}

async function updataSliderimg(req, res) {
  const sliderId = req.params.id;
  const updateUrl = req.body.url;
  const updatecaption = req.body.caption;
  const sql = `UPDATE  slider_images  SET image_url = ? , caption = ? WHERE id = ?  `;

  let [updateSliderrows] = await db.query(sql, [
    updateUrl,
    updatecaption,
    sliderId,
  ]);
  res.redirect("/admin-slider");
}

async function deleteSlid(req, res) {
  const slideId = req.params.id;
  const sql = `DELETE FROM Slider_images WHERE id = ? `;

  let [deleteSlideRow] = await db.query(sql, [slideId]);
}

async function showCategoriePage(req, res) {
  const sql = `SELECT * FROM product_categorie`;
  let [showCategorieRows] = await db.query(sql);
  res.render("admin_categorie.ejs", { categories: showCategorieRows });
 
}

async function statusCategorie(req, res) {
  const categorieId = req.body.categorieId;
  const statusCategorie = req.body.statusCategorie;
  const sql = `UPDATE product_categorie SET display_categorie = ?  WHERE product_categorie.id = ? ; `;
  let [updateStatusCategorie] = await db.query(sql, [
    statusCategorie,
    categorieId,
  ]);
  res.redirect("/admin-categorie");
}

async function showEditCategorie(req, res) {
  const categorieId = req.params.id;
  const sql = `SELECT * FROM product_categorie WHERE id = ? `;
  let [updateCategorieRows] = await db.query(sql, [categorieId]);
  res.render("admin_edit_categorie.ejs", {
    updateCategorie: updateCategorieRows,
  });
}

async function updateCategorie(req, res) {
  const categorieId = req.params.id;
  const categorieName = req.body.categorieName;
  const img = req.body.img;
  const description = req.body.description;
  const sql = `UPDATE product_categorie set name_categorie = ? , image_categorie = ? , caption_categorie_img = ?  WHERE id = ? `;

  let [updateCategorie] = await db.query(sql, [
    categorieName,
    img,
    description,
    categorieId,
  ]);
  res.redirect("/admin-categorie");
}

async function createCategorie(req, res) {
  const categorieName = req.body.categorieName;
  const imgCategorie = req.body.imgCategorie;
  const caption = req.body.caption;
  const status = req.body.status;
  const sql = `INSERT INTO product_categorie (name_categorie, image_categorie , caption_categorie_img , display_categorie) VALUES ( ? , ?  , ? , ?)`;

  let [insertCategorieRows] = await db.query(sql, [
    categorieName,
    imgCategorie,
    caption,
    status,
  ]);
  res.redirect("/admin-categorie");
}

async function deleteCategorie (req , res ){
  const categorieId = req.body.id
  console.log(categorieId)
  const sql = ` DELETE FROM product_categorie WHERE id = ? `
  let [deleteCategorie] = await db.query (sql  , [categorieId])
  console.log(categorieId)
console.log(deleteCategorie)
res.redirect('/admin-categorie')
}

async function removeProduct (req , res ){
  const productId = req.body.id
 
  const sql = ` DELETE FROM product WHERE id = ? `
  let [deleteProduct] = await db.query (sql  , [productId])
res.redirect('/admin-product')
}


module.exports.homeAdmin = homeAdmin;
module.exports.deleteSlid = deleteSlid;
module.exports.showSliderPage = showSliderPage;
module.exports.updataSliderimg = updataSliderimg;
module.exports.showUpdateSliderPage = showUpdateSliderPage;
module.exports.addNewSliderImg = addNewSliderImg;
module.exports.showAdminProduct = showAdminProduct;
module.exports.addProduct = addProduct;
module.exports.showUpdateProduct = showUpdateProduct;
module.exports.updateProduct = updateProduct;
module.exports.removeProduct = removeProduct;
module.exports.updateStatusOrder = updateStatusOrder;
module.exports.showCategoriePage = showCategoriePage;
module.exports.statusCategorie = statusCategorie;
module.exports.showEditCategorie = showEditCategorie;
module.exports.updateCategorie = updateCategorie;
module.exports.createCategorie = createCategorie;
module.exports.deleteImgProduct = deleteImgProduct;
module.exports.updateStatusProduct = updateStatusProduct;
module.exports.deleteCategorie = deleteCategorie