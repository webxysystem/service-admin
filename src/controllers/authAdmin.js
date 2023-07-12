import express from "express";
import {
  loginAdmin,
  registerNewOperator
} from "../services/admin";
import { generateJWT, generateRefreshJWT } from "../services/tokens";

import { validateLogin } from "../middlewares/authValidate";
import { getUser } from "../services/users";
import { registerError } from "../middlewares/error.handler.js"
let router = express.Router();

router.post("/login", validateLogin, async (req, res) => {
  try {
    const credentials = req.body;
    if (!credentials.email || !credentials.password) {
      throw { code: 400, message: 'es necesario enviar email y password' }
    }
    const userValidate = await loginAdmin(credentials).catch(e => {
      throw { code: e.code, message: e.message };
    })
    const token = generateJWT(userValidate);
    const refresh_token = generateRefreshJWT(userValidate);
    const response = {
      auht: true,
      token: token,
      user: userValidate,
      refresh_token: refresh_token,
    };
    
    res.status(200).send(response);

  } catch (error) {
    console.log(error)
    registerError(error, req, res);
  }
});


router.post("/refresh-token", async (req, res) => {
  try {
    const userId = req.userId;
    const userValidate = await getUser(userId);
    const token = generateJWT(userValidate);
    const refresh_token = generateRefreshJWT(userValidate);
    const response = {
      token,
      refresh_token,
    };
    res.send(response);
  } catch (error) {
    registerError(error, req, res);
  }
});

router.post("/create-operator", async (req, res) => {
  console.log('hola')
  try {
    const informationOperator = req.body;
    const newOperator = registerNewOperator(informationOperator).catch(e => {
      throw { code: 400, message: "error en la insercion a base de datos revise sus paramnetros e intente de nuevo" };
    })
    res.status(200).send(newOperator);
  } catch (error) {
    console.log(error)
    registerError(error, req, res);
  }
});


module.exports = router;
