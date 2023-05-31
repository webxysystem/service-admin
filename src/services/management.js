import AccountBusiness from "../models/accountBusiness";
import PaymentMethod from "../models/paymentMethod";
var ObjectId = require("mongoose").Types.ObjectId;

export const getAccountBusiness = async (page, size) => {
  return await AccountBusiness.find().skip(page * size).limit(size);
}

export const getAccountBusinessDetail = async (id) => {
  return await AccountBusiness.findById(id);
}

export const getPaymentMethodByAccountBusiness = async (accountBusinessId, page, size) => {
  return await PaymentMethod.find(
    { accountBusiness: new ObjectId(accountBusinessId)},
    {},
    { skip: page * size, limit: size }).populate({
      path: "assignedTo"
    })
}
