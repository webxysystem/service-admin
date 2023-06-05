import express from "express";
import { createUser, login, registerModel, getUsers, getModerators, getModelsByModeratorId, getAccountDetail, getMethodsPaymentAsigne, getModels, getModelFindId } from "../services/user";
import { createAccount } from "../services/account";
import { activateOrDeactivateModel } from "../services/management"
import auth from "../middlewares/validateToken";
import { generateJWT, generateRefreshJWT } from "../services/token";

let router = express.Router();

router.get("/", async (req, res) => {
  try {
    
    const response = await getUsers().catch(e => {
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

router.get("/moderators", async (req, res) => {
  try {
    
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getModerators(page,size).catch(e => {
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

router.get("/models/:moderatorId", async (req, res) => {
  try {
    
    const moderatorId = req.params.moderatorId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getModelsByModeratorId(moderatorId, page, size).catch(e => {
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

    const response = await getModelFindId(modelId).catch(e => {
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

router.get("/models", async (req, res) => {
  try {
    
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getModels( page, size).catch(e => {
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

router.get("/account/:accountId", async (req, res) => {
  try {
    
    const accountId = req.params.accountId;
    let { page, size } = req.query;
    page ? page : (page = 0);
    size ? size : (size = 10);

    const response = await getAccountDetail(accountId, page, size).catch(e => {
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

router.get("/get-accounts/:userId", async (req, res) => {
  try {
    
    const userId = req.params.userId;
    const response = await getMethodsPaymentAsigne(userId).catch(e => {
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

    if (!payload.name || !payload.email || !payload.password) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }
  
    const accountId = (await createAccount())?._id;
    payload.accountId = accountId;
    payload.enabled = true;
    payload.moderator = true;

    const response = await createUser(payload).catch(e => {
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
router.post("/login", async (req, res) => {
  try {
    
    const payload = req.body;

    if (!payload.email || !payload.password) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }
  

    const userValidate = await login(payload).catch(e => {
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
      const token = generateJWT(userValidate);
      const refresh_token = generateRefreshJWT(userValidate);
     const response = {
        auht: true,
        token: token,
        user: userValidate,
        refresh_token: refresh_token,
      };
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

router.post("/register-model", auth, async (req, res) => {
  try {
    
    const userId = req.userId;
    const payload = req.body;

    if (!payload.name || !payload.email) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }
  
    const accountId = (await createAccount())?._id;
    payload.accountId = accountId;
    payload.moderatorId = userId;

    const response = await registerModel(payload).catch(e => {
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
    res.status(200).send(response)
  } catch (error) {
    console.error(error);
  }
})

router.put('/activate-or-deactivate-model', auth, async (req, res) => {
    try {
    
    const payload = req.body;
    if (!payload.modelId || payload.active == undefined) {
      throw { code: 400, message: 'Revise su peticion e intente nuevamente'}
    }
      
      const response = await activateOrDeactivateModel(payload.modelId, payload.active).catch(e => {
      throw { code: 400, message: "Error en la consulta a la base de datos, por favor revisa los parametros e intenta nuevamente" }
    });
    res.status(200).send(response)
  } catch (error) {
    console.error(error);
  }
})

module.exports = router;