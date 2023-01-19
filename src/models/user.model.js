const { number } = require("joi");
const mongoose = require("mongoose");
// NOTE - "validator" external library and not the custom middleware at src/middlewares/validate.js
const validator = require("validator");
const config = require("../config/config");
const bcrypt=require('bcryptjs')
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique:true,
      lowercase:true,
      validator(value){
        if( ! validator.isEmail(value)){
          throw new Error('Invalid Email');
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },
    walletMoney: {
      type :Number, 
      required :true,
      default:config.default_wallet_money,
    },
    address: {
      type: String,
      default: config.default_address,
    },
  },
  {
    timestamps: true,
  }
);

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement the isEmailTaken() static method
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email) {
  const user=await this.findOne({email})
  return !!user;
};
userSchema.methods.isPasswordMatch=async function (password){
  const user=this;
  return bcrypt.compare(password,user.password);
}
userSchema.methods.hasSetNonDefaultAddress=async function(){
  const user=this;
  return user.address!==config.default_address;
}
const User=mongoose.model('User',userSchema);
module.exports.User=User;
module.exports={User,}
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS
/*
 * Create a Mongoose model out of userSchema and export the model as "User"
 * Note: The model should be accessible in a different module when imported like below
 * const User = require("<user.model file path>").User;
 */
/**
 * @typedef User
 */
