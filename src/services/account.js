import Account from "../models/account"
import Commission from "../models/commission"
import { getAccountByUserId, getAccountByModelId } from "./user"
import { registerTransactionPaymentMethod, registerAdminCommsision, getPlataformComissionByPaymentMethod } from "./balance"

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
    amount = amount * (100 - plataformCommision / 100);
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