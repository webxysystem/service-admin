import express from "express";
import { registerTransactionIncome, getTransactions, getTransactionsModerator, getTransactionsModel, getTransactionsByPaymentMethodId } from "../services/transactions"
import { registerNewPaymentMethod } from "../services/balance";
let router = express.Router();


router.get("/all", async (req, res) => {
  try {
    
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getTransactions( page, size).catch(e => {
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

router.get("/moderator/:moderatorId", async (req, res) => {
  try {
    
    const moderatorId = req.params.moderatorId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getTransactionsModerator(moderatorId, page, size).catch(e => {
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

router.get("/model/:modelId", async (req, res) => {
  try {
    
    const modelId = req.params.modelId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getTransactionsModel(modelId, page, size).catch(e => {
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

router.get("/payment-method/:payId", async (req, res) => {
  try {
    
    const payId = req.params.payId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getTransactionsByPaymentMethodId(payId, page, size).catch(e => {
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


router.post("/register", async (req, res) => {
  try {
    
    const payload = req.body;

    if (!payload.paymentMethod || !payload.moderator || !payload.model || !payload.amount || !payload.voucher) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }
  
    const response = await registerTransactionIncome(payload).catch(e => {
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
    res.status(200).send(response)
  } catch (error) {
    console.log(error);
    if (error.code && error.message) {
      res.status(error.code).json(error.message);
    } else {
      //TODO: send notification support
      res.status(500).json(error);
    }
  }
})

router.post("/register-payment-method", async (req, res) => {
  try {
    
    const payload = req.body;
    if (!payload.title || !payload.user || !payload.password || !payload.assignedTo || !payload.accountBusiness ) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }

    payload.private = payload.isPrivate;
    payload.amount = 0;

    const response = await registerNewPaymentMethod(payload).catch(e => {
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