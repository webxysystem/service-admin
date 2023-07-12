import {
  userRegisterSchema,
  bodyRegisterSchema,
  userLoginSchema,
} from "../schemas/auth";
import validateSchema from "../services/validatorSchema";

const validateLogin = (req, res, next) => {
  try {
    const { valid, errors } = validateSchema(req.body, userLoginSchema);
    !valid ? res.status(403).send(errors) : next();
  } catch (error) {
    console.error(error);
  }
};

const validateRegister = (req, res, next) => {
  try {
    const { valid, errors } = validateSchema(req.body, bodyRegisterSchema);

    if (!valid) res.status(403).send(errors);

    if (valid) {
      const validUser = validateSchema(req.body.user, userRegisterSchema);
      !validUser.valid ? res.status(403).send(validUser.errors) : next();
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { validateLogin, validateRegister };
