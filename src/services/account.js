import Account from "../models/account"
import Commission from "../models/commission"
import PaymentMethod from "../models/paymentMethod";
import Payment from "../models/payment";
import { getAccountByUserId, getAccountByModelId } from "./user"
import { registerTransactionPaymentMethod, registerAdminCommsision, getPlataformComissionByPaymentMethod } from "./balance"
var ObjectId = require("mongoose").Types.ObjectId;
import moment from "moment";

const distributionMoney =  {
  admin: 0.1,
  organization: 0.3,
  moderator: 0.3,
  model: 0.3
}

export const createAccount = async () => {
  const account = {
    amount: 0,
    frozenAmount: 0,
    transactions: [],
    enabled: true
  }
  return await Account.create(account)
}

export const registerCommission = async (transaction) => {

  let amount = transaction.amount;
  const plataformCommision = await getPlataformComissionByPaymentMethod(transaction.paymentMethod.toString());
  if (plataformCommision > 0) {
    const percent = (100 - plataformCommision) / 100;
    const newAmount = amount * percent;
    const payTax = amount - newAmount;
    await PaymentMethod.findOneAndUpdate({ _id: transaction.paymentMethod.toString() }, {
      $inc: {
        paymentTax: payTax,
      },
    }, { new: true });
    amount = newAmount;
  }
  
  //register commision model
  const accountIdModel = await getAccountByModelId(transaction.model.toString());
  const commissionModel = (amount * distributionMoney['model']);
  await registerIncomeAccount(accountIdModel, transaction._id, commissionModel);

  //register commision moderator
  const accountIdModerator = await getAccountByUserId(transaction.moderator.toString());
  const commissionModerator = (amount * distributionMoney['moderator']);
  await registerIncomeAccount(accountIdModerator, transaction._id, commissionModerator);

  //register commision organization
  const commissionAdmin = (amount * distributionMoney['admin']);
  const commissionOrganization = (amount * distributionMoney['organization']);

  await registerAdminCommsision(commissionAdmin, commissionOrganization, transaction._id);

  await registerTransactionPaymentMethod(amount, transaction.paymentMethod)
}

const registerIncomeAccount = async (accountId, transactionId, amount) => {
     
  const commission = await Commission.create({
      amountIncome: amount,
      transaction: transactionId
  });
  
  return await Account.findOneAndUpdate(
    { _id: accountId },
    {
      $push: {
        transactions: {
          $each: [transactionId],
          $position: 0,
        },
        commissions: {
          $each: [commission._id],
          $position: 0,
        },
      },
      $inc: {
        amount: amount,
      },
    },
    { new: true }
  )
}

export const getAccounts = async (page, size) => {
  return await Account.find( {}, {},
    { skip: page * size, limit: size })
}

export const registerPaymentInAccount = async (accountId) => {

  const account = await Account.findById(accountId);

  let payment = {
    amount: account.amount,
    account: account._id,
    commissions: account.commissions,
    transactions: account.transactions,
  }

  payment = await Payment.create(payment);
  const today = moment().format("YYYY-MM-DD");
  
  return await Account.findOneAndUpdate(
    { _id: new ObjectId(accountId) },
    {
      $set: {
        commissions: [],
        transactions: [],
        lastPayment: today
      },
      $push: {
        payments: {
          $each: [payment._id],
          $position: 0,
        },
      },
    },
    { new: true }
  )
}