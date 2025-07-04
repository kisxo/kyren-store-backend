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

const getAllAccountsController = async (req, res) => {
  try {
    const allAccounts = await accountModel.find();
    if (allAccounts.length === 0) {
      return res
        .status(200)
        .send({ success: false, message: "No Accounts Found" });
    }
    res.status(201).send({
      success: true,
      message: "Accounts Fetched Success",
      data: allAccounts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Get All Accounts Controller ${error.message}`,
    });
  }
};

module.exports = {
  addAccountController,
  getAllAccountsController,
};
