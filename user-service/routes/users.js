const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res
          .status(400)
          .json({ message: "No user found with the given id" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.post("/", async (req, res) => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      phoneNumber: req.body.phoneNumber,
    });
    try {
      // let existingUser = await User.find({firstName: user.firstName, lastName: user.lastName, emailId: user.emailId, phoneNumber: user.phoneNumber});
      // if(existingUser.length !== 0){
      //   console.log(existingUser)
      //   return res
      //     .status(400)
      //     .json({ message: "User already exists with the given information with id " + existingUser[0]._id});
      // }
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  router.patch("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res
          .status(400)
          .send("No user found with id " + req.params.id);
      }
      if(req.body.firstName != null)
        user.firstName = req.body.firstName;
      if(req.body.lastName != null)
        user.lastName = req.body.lastName;
      if(req.body.emailId != null)
        user.emailId = req.body.emailId;
      if(req.body.phoneNumber != null)
        user.phoneNumber = req.body.phoneNumber;
  
      const newUser = await user.save();
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.delete("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user == null) {
        return res
          .status(400)
          .send("No user found with id " + req.params.id);
      }
  
      await user.deleteOne();
  
      res.status(200).json({message: "Successfully removed"});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  module.exports = router;