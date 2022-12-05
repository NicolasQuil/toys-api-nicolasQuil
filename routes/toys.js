const express = require("express");
const { ToysModel, validteToy } = require("../models/toysmodels")
const { auth } = require("../middleware/auth")
const router = express.Router();

router.get("/", async (req, res) => {
  let page = Number(req.query.page) || 1;
  let perPage = Number(req.query.perPage) || 10;

  let sort = req.query.sort || "price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await ToysModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })


    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.post("/", auth, async (req, res) => {
  let validBody = validteToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }

  try {
    let toy = new ToysModel(req.body)
    toy.user_id = req.tokenData._id;
    await toy.save();


    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
})

router.get("/search", async (req, res) => {
  let perPage = Number(req.query.perPage) || 4;
  let page = Number(req.query.page) || 1;
  let sort = req.query.sort || "price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let searchQ = req.query.s;

    let searchExp = new RegExp(searchQ, "i")
    let data = await ToysModel.find({ $or: [{ name: searchExp }, { info: searchExp }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

router.get("/price", async (req, res) => {

  try {
    let min = req.query.min || 5;
    let max = req.query.max || 20;

    let data = await ToysModel.find({ price: { $lte: max, $gte: min } })
      .limit(20)
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
router.put("/:idEdit", auth, async (req, res) => {
  let validBody = validteToy(req.body);

  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await ToysModel.updateOne({ _id: idEdit, user_id: req.tokenData._id }, req.body)

    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.delete("/:idDel", auth, async (req, res) => {
  let idDel = req.params.idDel;
  try {
    let data = await ToysModel.deleteOne({ _id: idDel, user_id: req.tokenData._id })

    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.get("/category/:catname", async (req, res) => {
  let perPage = Number(req.query.perPage || 10);
  let Page = Number(req.query.perPage || 1);
  let sort = req.query.sort || "price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let cat = req.params.catname;

    let categoExp = new RegExp(cat, "i")
    let data = await ToysModel.find({ category: categoExp })
      .limit(perPage)
      .skip((Page - 1) * perPage)
      .sort({ [sort]: reverse })
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router;

