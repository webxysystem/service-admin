import express from "express"
import { createDebst, findDebts, findDebtsByUSer, addPayment } from "../services/debts"
let router = express.Router();

router.get("/all", async (req, res) => {
  try {
    
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await findDebts(page, size).catch(e => {
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
});

router.get("/by-user/:userId", async (req, res) => {
  try {
    
    const userId = req.params.userId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await findDebtsByUSer(page, size, userId).catch(e => {
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
    res.status(200).send(response);
  } catch (error) {
    if (error.code && error.message) {
      res.status(error.code).json(error.message);
    } else {
      //TODO: send notification support
      res.status(500).json(error);
    }
  }
});

router.post("/create", async (req, res) => {
  try {

    const payload = req.body;
    if (!payload.amount || !payload.weeklyDiscount || !payload.userId) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente' }
    }

    const response = await createDebst(payload).catch(e => {
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
});

router.post("/payment",  async (req, res) => {
  try {

    const payload = req.body;
    if (!payload.userId) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }

    const response = await addPayment(payload.userId, payload.paymentAmount).catch(e => {
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