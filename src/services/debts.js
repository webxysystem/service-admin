import Debts from "../models/debts";
import AccountMaster from "../models/accountMaster";
import Model from "../models/model";
var ObjectId = require("mongoose").Types.ObjectId;

export const createDebst = async (payload) => {
  let debts;
  if (payload.isModel) {
    debts = {
      amount: payload.amount,
      weeklyDiscount: payload.weeklyDiscount,
      payments: [],
      model: payload.userId,
      reason: payload.reason,
      isActive: true
    }
  } else {
      debts = {
      amount: payload.amount,
      weeklyDiscount: payload.weeklyDiscount,
      payments: [],
      moderator: payload.userId,
      reason: payload.reason,
      isActive: true
    }
  }

  return await Debts.create(debts);
}

export const findDebts = async (page,size) => {
  return await Debts.find({isActive: true}, {},
    { skip: page * size, limit: size }).sort({ updatedAt: -1, _id: -1 })
}

export const findDebtsByUSer = async (page, size, userId) => {

  const isModel = await Model.findById(userId);
  if (isModel) {
      return await Debts.find({ model: new ObjectId(userId), isActive: true}, {},
    { skip: page * size, limit: size }).sort({ updatedAt: -1, _id: -1 })
  } else {
      return await Debts.find({moderator: new ObjectId(userId), isActive: true}, {},
    { skip: page * size, limit: size }).sort({ updatedAt: -1, _id: -1 })
  }
}


export const addPayment = async (userId, paymentAmount) => {
  
  const isModel = await Model.findById(userId);
  if (isModel) {

    const debts = await Debts.find({ model: new ObjectId(userId), isActive: true });
    let amountDiscount = debts.amount < debts.weeklyDiscount ? debts.amount : debts.weeklyDiscount;

    if (paymentAmount) {
      amountDiscount = paymentAmount;
    }

    await Debts.findOneAndUpdate(
      { model: new ObjectId(userId), isActive: true },
      {
        $inc: {
          amount: -amountDiscount,
        },
      },
      { new: true })
    
    await addTheAmountOfTheDebt(amountDiscount);
  } else {

    const debts = await Debts.find({ moderator: new ObjectId(userId), isActive: true });
    let amountDiscount = debts.amount < debts.weeklyDiscount ? debts.amount : debts.weeklyDiscount;

    if (paymentAmount) {
      amountDiscount = paymentAmount;
    }

    await Debts.findOneAndUpdate(
      { moderator: new ObjectId(userId), isActive: true },
      {
        $inc: {
          amount: -amountDiscount,
        },
      },
      { new: true })
    await addTheAmountOfTheDebt(amountDiscount);
  }
}

const addTheAmountOfTheDebt = async (amount) => {
  
  const businessName = process.env.BUSINESS_NAME;
  await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $inc: {
        amountOrganization: amount,
      },
    },
    { new: true })
}