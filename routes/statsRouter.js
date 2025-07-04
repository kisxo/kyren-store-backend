const express = require("express");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");


// router object
const router = express.Router();

router.get("/users",  async (req, res) => {
    try{
        let count = await userModel.countDocuments(); console.log(count);

        count = count + 1000;
        return res.json({"users": count})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/orders",  async (req, res) => {
    try{
        let count = await orderModel.countDocuments(); console.log(count);

        count = count + 40000;
        return res.json({"orders": count})
    }catch(error){
        console.log(error.message)
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/leaderboard", async (req, res) => {
  try {
    // Parse year and month from query parameters
    let year = parseInt(req.query.year);
    let month = parseInt(req.query.month);

    // Get current date
    const now = new Date();

    // Set default year/month to current if missing or invalid
    if (!year || year < 1970) {
      year = now.getFullYear();
    }
    if (!month || month < 1 || month > 12) {
      month = now.getMonth() + 1; // JS months are 0-based, so add 1
    }

    // Calculate start and end of the month for query
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // Aggregation pipeline to get top buyers grouped by email
    const topBuyers = await orderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          email: { $ne: null },
          status: { $ne: "failed" },
        },
      },
      {
        $addFields: {
          emailClean: { $trim: { input: "$email" } },
        },
      },
      {
        $group: {
          _id: "$emailClean",
          totalAmount: { $sum: { $toDouble: "$amount" } },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          let: { emailStr: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$email", "$$emailStr"] },
              },
            },
            {
              $project: { email: 1, fname: 1, mobile: 1 },
            },
          ],
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          email: "$_id",
          fname: "$user.fname",
          mobile: "$user.mobile",
          totalAmount: 1,
          totalOrders: 1,
        },
      },
    ]);

    res.status(200).send({ success: true, data: topBuyers });
  } catch (error) {
    console.error("Error fetching leaderboard by email:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
