
import express from "express";
import auth from "../middlewares/validateToken";
import { getAccounts, registerPaymentInAccount } from "../services/account";

let router = express.Router();

router.get("/payments",  async (req, res) => {
  try {
    
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getAccounts(page, size).catch(e => {
      console.log(e);
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
    res.status(200).send(response)
  } catch (error) {
    if (error.code && error.message) {
      res.status(error.code).json(error.message);
    } else {
      //TODO: send notification support
      res.status(500).json(error);
    }
  }
})


router.post("/register-payment",  async (req, res) => {
  try {
    
    const payload = req.body;

    if (!payload.userId ) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }

    const response = await registerPaymentInAccount(userId).catch(e => {
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
    res.status(200).send(response)
  } catch (error) {
    if (error.code && error.message) {
      res.status(error.code).json(error.message);
    } else {
      //TODO: send notification support
      res.status(500).json(error);
    }
  }
})

module.exports = router;