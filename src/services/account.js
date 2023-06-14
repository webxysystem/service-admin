import Account from "../models/account"
import Commission from "../models/commission"
import PaymentMethod from "../models/paymentMethod";
import Payment from "../models/payment";
import Model from "../models/model";
import User from "../models/user";
import AccountMaster from "../models/accountMaster";
import { getAccountByUserId, getAccountByModelId } from "./user"
import { registerTransactionPaymentMethod, registerAdminCommsision, getPlataformComissionByPaymentMethod, registerPaymentIntoBalance, getBalanceActive } from "./balance"
var ObjectId = require("mongoose").Types.ObjectId;
import { getAccountBusinessDetail } from "./management";

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
    enabled: true,
    lastPayment: new Date()
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

/*
export const getAccounts = async (page, size) => {
  const models = (await Model.find())?.map(model => model.toObject());
  const moderators = (await User.find())?.map(user => user.toObject());

  let accounts = (await Account.find({}, {},
    { skip: page * size, limit: size }))?.map(acc => acc.toObject());
  

  
  for (const model of models) {
    const index = accounts.findIndex(acc => acc?._id.toString() == model.accountId.toString());

    accounts[index].user = model;
  }

  for (const moderator of moderators) {
    const index = accounts.findIndex(acc => acc?._id.toString() == moderator.accountId.toString())
    accounts[index].user = moderator;
  }

  return accounts;
} */

export const registerPaymentInAccount = async (userId, voucher) => {

  let user = await Model.findById(userId);
  if (user) {
    await payFeeForWeekScurityComputer(user);
  } else {
    user = await User.findById(userId);
  }

  const accountId = user.accountId.toString();
  const account = await Account.findById(accountId);

  let payment = {
    amount: account.amount,
    account: account._id,
    commissions: account.commissions,
    transactions: account.transactions,
    voucher,
    date: new Date()
  }

  payment = await Payment.create(payment);

  await registerPaymentIntoBalance(payment)
  
  return await Account.findOneAndUpdate(
    { _id: new ObjectId(accountId) },
    {
      $set: {
        amount: 0,
        commissions: [],
        transactions: [],
        lastPayment: new Date()
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

const payFeeForWeekScurityComputer = async (model) => {

  const payFeeForWeek = 30;
  const moderator = await User.findById(model.moderatorId.toString());

  /** fee for admin */
  const adminFee = (distributionMoney['admin'] * payFeeForWeek);
  const organizationFee = (distributionMoney['organization'] * payFeeForWeek);
  const businessName = process.env.BUSINESS_NAME;
  await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $inc: {
        amountOrganization: - organizationFee,
        amountAdmin: - adminFee,
        computerSecurityFee: payFeeForWeek
      },
    },
    { new: true })
      
  /** fee for moderator */
  const moderatorFee = (distributionMoney['moderator'] * payFeeForWeek);
  await Account.findOneAndUpdate(
    { _id: new ObjectId(moderator.accountId.toString()) },
    {
      $inc: {
        amount: - moderatorFee,
      },
    },
    { new: true }
  )
    
  /** fee for model */
  const modelFee = (distributionMoney['model'] * payFeeForWeek);
  await Account.findOneAndUpdate(
    { _id: new ObjectId(model.accountId.toString()) },
    {
      $inc: {
        amount: - modelFee,
      },
    },
    { new: true }
  )
    
}

export const getPaymentsIntoBalanceActive = async (page, size) => {
  
  const models = (await Model.find())?.map(model => model.toObject());
  const moderators = (await User.find())?.map(user => user.toObject());

  const balance = await getBalanceActive(page, size);
  let payments = balance?.payments?.map(pay => pay.toObject());
  
  if (payments && payments.length > 0) {
      const paymentsIds = payments.map(payment => {
      return new ObjectId(payment._id);
    })

    let accounts = (await Account.find({ payments: { $in: paymentsIds } }))?.map(acc => acc.toObject());

    for (const model of models) {
      const index = accounts.findIndex(acc => acc?._id.toString() == model.accountId.toString());
      if (index >= 0) {
        accounts[index].user = model;
      }
      
    }

    for (const moderator of moderators) {
      const index = accounts.findIndex(acc => acc?._id.toString() == moderator.accountId.toString())
      if (index >= 0) {
        accounts[index].user = moderator;
      }
    }


    for (const account of accounts) {
      const index = payments.findIndex(pay => pay?.account.toString() == account._id.toString())
      payments[index].user = account.user;
    }
  } else {
    payments = [];
  }

  return payments;
}

export const getPayments = async (page, size) => {
  const models = (await Model.find())?.map(model => model.toObject());
  const moderators = (await User.find())?.map(user => user.toObject());

  
  let payments = (await Payment.find({}, {},
    { skip: page * size, limit: size }))?.map(pay => pay.toObject());
  
  if (payments && payments.length > 0) {
      const paymentsIds = payments.map(payment => {
      return new ObjectId(payment._id);
    })

    let accounts = (await Account.find({ payments: { $in: paymentsIds } }))?.map(acc => acc.toObject());

    for (const model of models) {
      const index = accounts.findIndex(acc => acc?._id.toString() == model.accountId.toString());
      if (index >= 0) {
        accounts[index].user = model;
      }
      
    }

    for (const moderator of moderators) {
      const index = accounts.findIndex(acc => acc?._id.toString() == moderator.accountId.toString())
      if (index >= 0) {
        accounts[index].user = moderator;
      }
    }


    for (const account of accounts) {
      const index = payments.findIndex(pay => pay?.account.toString() == account._id.toString())
      payments[index].user = account.user;
    }
  } else {
    payments = [];
  }

  return payments;
}