import express from "express";
import auth from "../middlewares/validateToken";
import { getAccountBusiness, getAccountBusinessDetail, getPaymentMethodByAccountBusiness, getPaymentMethodDetail, managementUsersInPaymentMethod, getAllpaymentMethods, closeBalance } from "../services/management"
import { getAccountMaster, updateAccountMaster } from "../services/balance";

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

router.get("/payment-methods",  async (req, res) => {
  try {

    const response = await getAllpaymentMethods().catch(e => {
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

router.post("/close-balance",  async (req, res) => {
  try {

    const response = await closeBalance().catch(e => {
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


router.put("/management-users-payment-method", async (req, res) => {
  try {
    
    const payload = req.body;
    if (!payload.payId || !payload.usersId || payload.usersId.length < 1 ) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }

    const response = await managementUsersInPaymentMethod(payload.payId, payload.usersId).catch(e => {
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

router.put("/update-account-master", async (req, res) => {
  try {
    
    const payload = req.body;
    if (payload.amountOrganization < 0 || payload.amountAdmin < 0 || payload.computerSecurityFee < 0  ) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }

    const response = await updateAccountMaster(payload).catch(e => {
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