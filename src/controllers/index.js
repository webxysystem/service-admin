import express from "express";
import userRouter from "./user"
import transactionRouter from "./transactions"
import managementRouter from "./management"
import accontRouter from "./accounts"
import debstRouter from "./debts"
const router = express.Router();

function createRouter(app) {
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "X-Requested-With")
    next();
  });

  app.use('/api/v1', router);
  router.use('/users', userRouter);
  router.use('/transactions', transactionRouter);
  router.use('/management', managementRouter);
  router.use('/accounts', accontRouter);
  router.use('/debts', debstRouter);
}


module.exports = createRouter;
