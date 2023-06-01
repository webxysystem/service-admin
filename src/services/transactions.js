import Transaction from "../models/transaction"
const ObjectId = require("mongoose").Types.ObjectId;
import { registerCommission } from "./account";

export const registerTransactionIncome = async (transaction) => {
  transaction.createdAt = new Date();
  transaction.type = {
    type: 1,
    title:'income'
  };
  
  const transactionRegister = await Transaction.create(transaction);
  await registerCommission(transactionRegister);
  return transactionRegister;
}

export const getTransactionsModerator = async (moderatorId, page, size) => {
  return await Transaction.find(
    { moderator: ObjectId(moderatorId) }, null,
    { skip: page * size, limit: size }).sort({ date: 1, _id: 1 })
}

export const getTransactionsModel = async (modelId, page, size) => {
  return await Transaction.find(
    { model: ObjectId(modelId) }, null,
    { skip: page * size, limit: size }).sort({ date: 1, _id: 1 })
}

export const getTransactions = async (page, size) => {
  return await Transaction.find().skip(page * size).limit(size)
}