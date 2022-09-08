const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//static register method - custom mongoose method
// NOTE: we can't use arrow function because we need the "this" keyword
userSchema.statics.register = async function (email, password) {
  //validation
  if (!email || !password) {
    throw Error("Please enter all credentials");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  //check if email exists
  const exists = await this.findOne({ email }); //this refers to this model

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  //input validation
  if (!email || !password) {
    throw Error("Please enter all credentials");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  //fetch user
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect credentials");
  }

  //does password match
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect credentials");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
