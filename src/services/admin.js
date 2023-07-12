import Admin from "../models/admin";
import bcrypt from "bcryptjs";

const getType = (type) => {
  let typeReturn = {
    type,
    name: "",
  };
  switch (type) {
    case 1:
      typeReturn.name = "admin";
      break;
    case 2:
      typeReturn.name = "administrator";
      break;
    case 3:
      typeReturn.name = "operator";
      break;
    default:
      typeReturn.name = "administrator";
      break;
  }
  return typeReturn;
};

const getAdminForEmail = async (email) => {
  return await Admin.findOne({ email }).populate("imageProfile");
};


const registerNewOperator = async (operator) => {
  operator.roles = getType(operator.roles);
  operator.companies = [
    {
      id: "",
      name: "webxy",
    },
  ];
  return await Admin.create(await encryptPass(operator));
};
const loginAdmin = async (credentials) => {
  const { email, password } = credentials;
  const adminInDatabase = await getAdminForEmail(email);
  if (!adminInDatabase) {
    throw { code: 404, message: "Admin no registrado en el base de datos" };
  }
  const validatePassword = compareEncryptPassword(
    password,
    adminInDatabase.password
  );
  if (!validatePassword) {
    throw { code: 404, message: "password incorrecto" };
  }

  return adminInDatabase;
};
const compareEncryptPassword = (userPass, encryptPass) => {
  return bcrypt.compareSync(userPass, encryptPass);
};


const encryptPass = async (user) => {
  const salt = await bcrypt.genSalt(10);
  const passEncript = await bcrypt.hash(user.password, salt);
  user.password = passEncript;
  return user;
};

export const creteNewAccountBussines = async () => {
  
}

module.exports = {
  loginAdmin,
  getAdminForEmail,
  registerNewOperator,
}