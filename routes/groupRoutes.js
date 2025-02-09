const express = require("express");
const multer = require("multer");
const fs = require("fs");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const productModel = require("../models/productModel");

// router object
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media/groupIcon");
  },
  filename: (req, file, cb) => {
    cb(null, "group--" + file.originalname );
  },
});

const addGroupIcon = multer({ storage: storage });

router.post("/add", addGroupIcon.single('image'), async (req, res) => {
    try{
        const {
            groupName,
            productId,
            image
        } = req.body
    
        const product = await productModel.find({ _id: productId});
        if (product.length === 0) {
          return res.status(200).send({ success: false, message: "No Product Found" });
        }
        
        newGroup = {
            "name": groupName,
            "productId": productId,
            "image": "/media/groupIcon/group--"+ productId + "--" + product[0].groups.length + ".jpeg"
        }

        var groups = product[0].groups

        groups.push(newGroup)

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,{groups},{ new: true }
        );

        await updatedProduct.save();
        res.send({"stauts": "true"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/item-add", addGroupIcon.single('image'), async (req, res) => {
    try{
        const {
            groupName,
            itemId,
            image
        } = req.body
    
        const product = await productModel.find({ _id: productId});
        if (product.length === 0) {
          return res.status(200).send({ success: false, message: "No Product Found" });
        }

        newGroup = {
            "name": groupName,
            "productId": productId,
            "image": "/media/groupIcon/group--"+ productId + "--" + product[0].groups.length + ".jpeg"
        }

        var groups = product[0].groups

        groups.push(newGroup)

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,{groups},{ new: true }
        );

        await updatedProduct.save();
        const product1 = await productModel.find({ _id: productId});
        console.log(product1[0].groups)

        console.log(product[0].cost)
        // console.log(groupName)
        // console.log(image)

        res.send({"stauts": "true"})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({ error: "Internal Server Error" });
    }
});




router.get("/", (req, res) => {
    res.send("Grooup API running..");
});

module.exports = router;
