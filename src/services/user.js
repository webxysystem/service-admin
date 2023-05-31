import User from "../models/user";
import Model from "../models/model"
import bcrypt from "bcryptjs";

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
  return await User.find().skip(page * size).limit(size);
}