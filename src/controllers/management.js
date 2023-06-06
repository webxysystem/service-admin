import express from "express";
import auth from "../middlewares/validateToken";
import { getAccountBusiness, getAccountBusinessDetail, getPaymentMethodByAccountBusiness, getPaymentMethodDetail } from "../services/management"
import { getAccountMaster } from "../services/balance";

let router = express.Router();

router.get("/account-business",  async (req, res) => {
  try {
    
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getAccountBusiness(page, size).catch(e => {
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

router.get("/account-master",  async (req, res) => {
  try {
    
    const response = await getAccountMaster().catch(e => {
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

router.get("/account-business/:accountId",  async (req, res) => {
  try {
    
    const accountId = req.params.accountId;
    const response = await getAccountBusinessDetail(accountId).catch(e => {
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

router.get("/payment-methods/:accountId",  async (req, res) => {
  try {
    
    const accountId = req.params.accountId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getPaymentMethodByAccountBusiness(accountId, page, size).catch(e => {
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

router.get("/payment-method/:payId",  async (req, res) => {
  try {

    const payId = req.params.payId;

    const response = await getPaymentMethodDetail(payId).catch(e => {
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


module.exports = router;