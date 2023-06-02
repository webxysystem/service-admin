import User from "../models/user";
import Model from "../models/model";
import Account from "../models/account";
import PaymentMethod from "../models/paymentMethod";
import bcrypt from "bcryptjs";
import { findTimesRecordModelsToday } from "./management";
var ObjectId = require("mongoose").Types.ObjectId;

export const getAccountDetail = async (accountId, page, size) => {
  return await Account.findById(accountId).populate({
    path: "commissions",
    select: ["_id", "amountIncome"],
    options: { skip: page * size, limit: size },
    }).populate({
    path: "transactions",
    select: ["_id", "amount","createdAt"],
    options: { skip: page * size, limit: size },
    })
}

export const getModelFindId = async (modelId) => {
  return await Model.findById(modelId).populate({
    path: "accountId",
    select:["amount"]
  })
}

export const createUser = async (user) => {
  const userEncrypt = await encryptPass(user);
  return await User.create(userEncrypt);
}

export const login = async (user) => {
  const { email, password } = user;
  const userInDataBase = await getUserForEmail(email);
  if (!userInDataBase) {
    throw {
      code: 404,
      message: "Usuario no registrado",
    };
  } else {
    if (!userInDataBase.enabled) {
      throw {
        code: 404,
        message:
          "Usuario no habilitado",
      };
    }
    const validatePassword = compareEncryptPassword(
      password,
      userInDataBase.password
    );
    if (!validatePassword) {
      throw {
        code: 404,
        message: "Password incorrecto",
      };
    } else {
      return userInDataBase;
    }
  }
};

export const registerModel = async (model) => {
  return await Model.create(model);
}

export const getAccountByUserId = async (userId) => {
  return (await User.findById(userId))?.accountId?.toString()
}

export const getAccountByModelId = async (modelId) => {
  return (await Model.findById(modelId))?.accountId?.toString()
}

const encryptPass = async (user) => {
  const salt = await bcrypt.genSalt(10);
  const passEncript = await bcrypt.hash(user.password, salt);
  user.password = passEncript;
  return user;
};

const compareEncryptPassword = (userPass, encryptPass) => {
  return bcrypt.compareSync(userPass, encryptPass);
};

const getUserForEmail = async (email) =>
  await User.findOne({ email });

export const getUsers = async () => {
  return await User.find();
}

export const getModerators = async (page,size) => {
  return await User.find().skip(page * size).limit(size).populate({
      path: "accountId"
    })
}

export const getModelsByModeratorId = async (moderatorId, page, size) => {
let models = await Model.find(
    { moderatorId: new ObjectId(moderatorId)},
    {},
    { skip: page * size, limit: size })
  const modelsIds = models.map(model => model._id);
  let times = await findTimesRecordModelsToday(modelsIds);
  models = models.map(model => model.toObject());
  times = times.map(time => time.toObject());

  return models.map(model => {
    const time = times.find(t => t.model.toString() == new ObjectId(model._id).toString());
    const timeWork = time ? getTime(time.seconds) : '0h';

    model.timeWork = timeWork;
    return model;
  });
}

export const getModels = async (page, size) => {
  return await Model.find().skip(page * size).limit(size).populate({
      path: "moderatorId"
    }).populate({
      path: "accountId"
    })
}

export const getMethodsPaymentAsigne = async (userId) => {
  return await PaymentMethod.find({ assignedTo: { $in: [ new ObjectId(userId)] } });
}

const getTime = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let horas = Math.floor(minutes / 60);

  minutes %= 60;
  seconds %= 60;

  let result = '';

  if (horas > 0) {
    result += `${horas} h${horas !== 1 ? 's' : ''}`;
    if (minutes > 0) {
      result += ` ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
  } else if (minutes > 0) {
    result += `${minutes} min${minutes !== 1 ? 's' : ''}`;
  } else {
    result += `${seconds} seg${seconds !== 1 ? 's' : ''}`;
  }

  return result;
}