import AccountBusiness from "../models/accountBusiness";
import PaymentMethod from "../models/paymentMethod";
import TimeRecord from "../models/timeRecord";
import Model from "../models/model";
import moment from "moment";

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


export const activateOrDeactivateModel = async (modelId, active) => {
  await Model.findOneAndUpdate({ _id: modelId }, {
    $set: {
      enabled: active
    }
  });
  
  const today = moment().format("YYYY-MM-DD");
  let timeRecordtoday = await TimeRecord.findOne({ day: today, model: new ObjectId(modelId) });

  if (!timeRecordtoday) {
    timeRecordtoday = await TimeRecord.create({
      model: modelId,
      day: today,
      seconds: 0,
      lastInteraction: new Date()
    })
  }

  // quiere decir que estuvo activo y ahora no 
  if (!active) {
    const secondsToAdd = (new Date().getTime() - new Date(timeRecordtoday.lastInteraction.getTime()))/1000; 

    timeRecordtoday = await TimeRecord.findOneAndUpdate({_id: timeRecordtoday._id }, {
      $set: {
        lastInteraction: new Date()
      },
      $inc: {
        seconds: secondsToAdd,
      }
    }, { new: true});

  }

  return timeRecordtoday;
}


export const findTimesRecordModelsToday = async (modelsIds) => {
  const today = moment().format("YYYY-MM-DD");
  const modelsIdsObjectIds = modelsIds.map(modelId => {
    return new ObjectId(modelId);
  })
  return await TimeRecord.find({ model: { $in: modelsIdsObjectIds }, day: today})
}

export const getPaymentMethodDetail = async (payId) => {
  return await PaymentMethod.findById(payId).populate({
    path: "assignedTo",
    /*  select: ["_id", "amount", "createdAt", "paymentMethod"],
    populate:"paymentMethod",*/
    })
}