const db = require("../models/database.js");

async function home(req, res) {
  let [sliderRows, sliderFields] = await db.query(
    `SELECT * FROM slider_images `
  );
  res.render("home.ejs", { sliderImg: sliderRows });
}

module.exports.home = home;
