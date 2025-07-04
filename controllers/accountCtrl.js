const accountModel = require("../models/accountModel");
const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const querystring = require("querystring");
const md5 = require("md5");

const addAccountController = async (req, res) => {
  try {
    const {
      name,
      price,
      desc,
      category,
      gameName,
      socialName,
      region,
      status
    } = req.body;

    let account = await accountModel.findOne({ name });
    if (account) {
      return res.status(200).send({
        success: false,
        message: "Account with this name already exists",
      });
    }
    // Create a new account if it doesn't exist
    account = new accountModel({
      name,
      price,
      desc,
      category,
      gameName,
      socialName,
      region,
      status,
      image: req.file.path,
    });
    await account.save();
    return res.status(200).send({
      message: "Account added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  addAccountController,
};
