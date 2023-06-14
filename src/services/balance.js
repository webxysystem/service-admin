import Commission from "../models/commission";
import BalanceSheet from "../models/balanceSheet";
import AccountBusiness from "../models/accountBusiness";
//import Account from "../models/account";
import PaymentMethod from "../models/paymentMethod";
import AccountMaster from "../models/accountMaster";
import Income from "../models/income";
import moment from "moment";
var ObjectId = require("mongoose").Types.ObjectId;

/*export const openNewDay = async () => {
  let income = await getIncomeToday();
  if (!income) {
    income = await createNewIncome();
    await closeIncomeToday();
  }
  return income;
};


export const getTaxToday = async () => {
  const today = moment().format("YYYY-MM-DD");
  let tax = (await Income.findOne({ date: today }))?.tax;
  if (!tax) {
    tax = (await openNewDay()).tax;
  }
  return tax;
};


export const registerCommission = async (transactionId, income) => {
  const today = moment().format("YYYY-MM-DD");
  let commission = { transaction: transactionId, amountIncome: income };
  commission = await Commision.create(commission);
  await Income.findOneAndUpdate(
    { date: today },
    {
      $push: {
        transactions: {
          $each: [transactionId],
          $position: 0,
        },
        commissions: {
          $each: [commission._id],
          $position: 0,
        },
      },
      $inc: {
        totalProfit: income,
        amount: income,
      },
    },
    { new: true }
  );
};

const closeIncomeToday = async () => {
  const yesterday = moment().add(-1, "days").format("YYYY-MM-DD");
  const income = await Income.findOne({ date: yesterday, closed: false });

  if (income) {
    await getCurrentBalance();
    const { clientAmoutTotalAvailable, clientAmoutTotalFrozen } =
      await getAllAmountsClients();
    const currentMonth = moment().format("YYYY-MM");

    await BalanceSheet.findOneAndUpdate(
      { date: currentMonth },
      {
        $set: {
          clientAmoutTotalAvailable,
          clientAmoutTotalFrozen,
        },
        $inc: {
          amount: income.amount,
          totalProfit: income.totalProfit,
        },
        $push: {
          incomes: {
            $each: [income._id],
            $position: 0,
          },
        },
      },
      { new: true }
    );

    await addNewProfitAccountMaster(income.totalProfit);

    await Income.findOneAndUpdate(
      { date: yesterday, closed: false },
      { closed: true },
      { new: true }
    );
  }
};

const getCurrentBalance = async () => {
  
  const currentMonth = moment().format("YYYY-MM");
  let currentBalance = await BalanceSheet.findOne({ date: currentMonth });
  if (!currentBalance) {
    currentBalance = await createNewBalance();
  }
  return currentBalance;
};

const createNewBalance = async () => {
  const lastMont = moment().add(-1, "month").format("YYYY-MM");
  const lastBalance = await BalanceSheet.findOne({
    date: lastMont,
    closed: false,
  });
  const lastAmount = lastBalance ? lastBalance.amount : 0;
  const amount = lastBalance ? lastBalance.amount : 0;
  const accountsAvailable = (await AccountBusiness.find({ enabled: true })).map(
    (account) => account._id
  );

  const { clientAmoutTotalAvailable, clientAmoutTotalFrozen } =
    await getAllAmountsClients();

  let newBalance = {
    lastAmount: lastAmount,
    totalProfit: 0,
    amount: amount,
    accounts: accountsAvailable,
    clientAmoutTotalAvailable,
    clientAmoutTotalFrozen,
    incomes: [],
    withdrawals: [],
    date: moment().format("YYYY-MM"),
    closed: false,
  };

  newBalance = await BalanceSheet.create(newBalance);

  if (lastBalance) {
    await closeLastBalanceSheet();
  }

  return newBalance;
};

const getAllAmountsClients = async () => {
  const allAccounts = await Account.find();
  let amounts = {
    clientAmoutTotalAvailable: 0,
    clientAmoutTotalFrozen: 0,
  };
  allAccounts.forEach((account) => {
    (amounts.clientAmoutTotalAvailable =
      amounts.clientAmoutTotalAvailable + account.amount),
      (amounts.clientAmoutTotalFrozen =
        amounts.clientAmoutTotalFrozen + account.frozenAmount ? account.frozenAmount : 0);
  });

  return amounts;
};

export const addPaymentToAccountBusiness = async (paymentMethod, revenue) => {
  return await AccountBusiness.findOneAndUpdate(
    { paymentMethod: ObjectId(paymentMethod) },
    {
      $inc: {
        amount: revenue,
      },
    },
    { new: true }
  );
};

export const payWithdrawalWhitAccountBusiness = async (paymentMethod, pay) => {
  return await AccountBusiness.findOneAndUpdate(
    { paymentMethod: ObjectId(paymentMethod) },
    {
      $inc: {
        amount: -pay,
      },
    },
    { new: true }
  );
};



const addNewProfitAccountMaster = async (profit) => {
  const businessName = process.env.BUSINESS_NAME;

  return await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $inc: {
        amount: profit,
      },
    },
    { new: true }
  );
};

const addNewBalanceSeetAccountMaster = async (balanceId) => {
  const businessName = process.env.BUSINESS_NAME;

  return await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $push: {
        incomes: {
          $each: [balanceId],
          $position: 0,
        },
      },
    },
    { new: true }
  );
};

export const addAccountBusiness = async (
  name,
  initialAmount,
  paymentMethodId
) => {
  const data = {
    name,
    amount: initialAmount,
    paymentMethod: paymentMethodId,
    enabled: true,
  };
  const newAccountBusiness = await AccountBusiness.create(data);
  const businessName = process.env.BUSINESS_NAME;

  await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $push: {
        incomes: {
          $each: [newAccountBusiness._id],
          $position: 0,
        },
      },
    },
    { new: true }
  );
}; 

const closeLastBalanceSheet = async () => {
  //check if the balance is correct
  const lastMont = moment().add(-1, "month").format("YYYY-MM");
  const lastBalance = await BalanceSheet.findOne({
    date: lastMont,
    closed: false,
  })
    .populate({
      path: "accounts",
      select: ["name", "amount"],
    })
    .populate({
      path: "withdrawals",
      select: ["reason", "amount"],
    })
    .populate({
      path: "incomes",
      select: ["lastAmount", "totalProfit", "amount", "tax", "commissions"],
      populate: {
        path: "commissions",
        select: ["amountIncome", "transaction"],
      },
    }); 

  //  1) get all amounts accountsBusiness
  const allAmountsInAccountsBusiness = lastBalance.accounts
    .map((account) => account.amount)
    .reduce((a, b) => a + b, 0);

  // 2) get all amounts of clients and amount total system
  const { clientAmoutTotalAvailable, clientAmoutTotalFrozen, amount } =
    lastBalance;

  // 3) get all amounts withdrawals
  const allAmountsWithdrawalsBusiness = lastBalance.withdrawals
    .map((account) => account.amount)
    .reduce((a, b) => a + b, 0);

  // 4) evaluate if diference in all register is 0
  const amountDiference =
    allAmountsInAccountsBusiness -
    (clientAmoutTotalAvailable +
      clientAmoutTotalFrozen +
      amount -
      allAmountsWithdrawalsBusiness);

  // 5) evaluate whit account master register
  const amountAccountMaster = (await getAccountMaster()).amount;
  const diferenceWhitAccountMaster = amountAccountMaster - amount;

  if (diferenceWhitAccountMaster == 0 && amountDiference == 0) {
    console.log("balance cerro correctamente");
    await addNewBalanceSeetAccountMaster(lastBalance._id);
    sendReportStatusSystem(lastBalance);
  } else {
    sendReportForReviewLastBalanceAmount(
      lastBalance,
      diferenceWhitAccountMaster,
      amountDiference
    );
  }

  await BalanceSheet.findOneAndUpdate(
    { date: lastMont, closed: false },
    { closed: true },
    { new: true }
  );
}; */

/** TODO: create reports in excell and send for email */
/*
const sendReportStatusSystem = (lastBalance) => {
  console.log(lastBalance);
};

const sendReportForReviewLastBalanceAmount = (
  lastBalance,
  diferenceWhitAccountMaster,
  amountDiference
) => {
  console.log(lastBalance, diferenceWhitAccountMaster, amountDiference);
};*/

const getIncomeToday = async () => {
  const today = moment().format("YYYY-MM-DD");
  let incomeToday = await Income.findOne({ date: today });
  if (!incomeToday) {
    incomeToday = await createNewIncome() 
  }
  return incomeToday;
};

const createNewIncome = async () => {
  const yesterday = moment().add(-1, "days").format("YYYY-MM-DD");
  const lastIncome = await Income.findOne({ date: yesterday });
  const lastAmount = lastIncome ? lastIncome.amount : 0;
  const amount = lastIncome ? lastIncome.amount : 0;
  const newIncome = {
    lastAmount: lastAmount,
    totalProfit: 0,
    amount: amount,
    commissions: [],
    transactions: [],
    date: moment().format("YYYY-MM-DD"),
    closed: false,
  };
  const income = await Income.create(newIncome);
  await registerIncomeIntoBalance(income);
  return income;
};

const registerIncomeIntoBalance = async (income) => {
  const balanceActive = await BalanceSheet.findOne({ closed: false });
  if (balanceActive) {

    await BalanceSheet.findOneAndUpdate(
      {  closed: false },
      {
        $inc: {
          totalProfit: income.totalProfit,
        },
        $push: {
          incomes: {
            $each: [income._id],
            $position: 0,
          },
        },
      },
      { new: true }
    );
  } else {
    
    const newBalance = {
      totalProfit: 0,
      incomes: [income._id],
      payments: [],
      dateOpen: new Date(), 
      closed: false,
    };

    await BalanceSheet.create(newBalance);
  }
}

export const registerPaymentIntoBalance = async (payment) => {
  const balanceActive = await BalanceSheet.findOne({ closed: false });
  if (balanceActive) {

    await BalanceSheet.findOneAndUpdate(
      {  closed: false },
      {
        $push: {
          payments: {
            $each: [payment._id],
            $position: 0,
          },
        },
      },
      { new: true }
    );
  } else {
    
    const newBalance = {
      totalProfit: 0,
      incomes: [],
      payments: [payment._id],
      dateOpen: new Date(), 
      closed: false,
    };

    await BalanceSheet.create(newBalance);
  }
}

export const closeBalance = async () => {
  await BalanceSheet.findOneAndUpdate(
    {  closed: false },
    {
      $set: {
        closed: false,
        dateClose: new Date()
      },
    },
    { new: true }
  );

  const newBalance = {
    totalProfit: 0,
    incomes: [],
    payments: [],
    dateOpen: new Date(), 
    closed: false,
  };

  return await BalanceSheet.create(newBalance);
}

export const getBalanceActive = async (page, size) => {
  return await BalanceSheet.findOne({ closed: false }).populate({
    path: "payments",
    options: { skip: page * size, limit: size }}).populate({
    path: "incomes",
    options: { skip: page * size, limit: size }})
}

/** Account master */
export const updateAccountMaster = async (payload) => {
  const businessName = process.env.BUSINESS_NAME;
  await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $set: {
        amountOrganization: payload.amountOrganization,
        amountAdmin: payload.amountAdmin,
        computerSecurityFee: payload.computerSecurityFee,
      }
    },
    { new: true}
  )
  return await getAccountMaster();
}

export const getAccountMaster = async () => {
  const businessName = process.env.BUSINESS_NAME;
  let accountMaster = await AccountMaster.findOne({ business: businessName });
  if (!accountMaster) {
    const accountsAvailable = (
      await AccountBusiness.find({ enabled: true })
    ).map((account) => account._id);
    const newAccountMasterLustList = {
      business: businessName,
      amountOrganization: 0,
      amountAdmin: 0,
      balance: [],
      accountBusiness: accountsAvailable,
      computerSecurityFee: 0,
      enabled: true,
    };
    if (businessName) {
      accountMaster = await AccountMaster.create(newAccountMasterLustList);
    }
  }

  const amountTotalToday = (await getIncomeToday()).amount;
  accountMaster = accountMaster.toObject()
  accountMaster.totalBilled = amountTotalToday;
  accountMaster.totalTax = await getAllTaxPaymentMethods();
  accountMaster.totalAvailable = accountMaster.totalBilled - accountMaster.totalTax;

  return accountMaster;
};

export const registerAdminCommsision = async (commissionAdmin, commissionOrganization, transactionId) => {

  const amount = commissionAdmin + commissionOrganization;
  const commission = await Commission.create({
      amountIncome: amount,
      transaction: transactionId
  });

  await addNewCommisionToIncome(amount, transactionId, commission._id);

  const businessName = process.env.BUSINESS_NAME;
  await AccountMaster.findOneAndUpdate(
    { business: businessName },
    {
      $inc: {
        amountOrganization: commissionOrganization,
        amountAdmin: commissionAdmin,
      },
    }
  )
}

const addNewCommisionToIncome = async (amount, transactionId, commissionId) => {
  //asegurarnos de que exista 
  await getIncomeToday();

  const today = moment().format("YYYY-MM-DD");
  await Income.findOneAndUpdate(
    { date: today },
    {
      $push: {
        transactions: {
          $each: [transactionId],
          $position: 0,
        },
        commissions: {
          $each: [commissionId],
          $position: 0,
        },
      },
      $inc: {
        amount: amount,
        totalProfit:amount
      },
    },
    { new: true }
  );
}

export const registerTransactionPaymentMethod = async (amount, paymentMethodId) => {
  const paymentMethod = await PaymentMethod.findOneAndUpdate({ _id: paymentMethodId },
  {
    $inc: {
      amount: amount,
    }
    },
  { new: true }
  )

  const accountBusinessId = paymentMethod.accountBusiness.toString();
  await AccountBusiness.findOneAndUpdate({ _id: accountBusinessId },
  {
    $inc: {
      amount: amount,
    }
    },
  { new: true }
  )
}

export const registerNewPaymentMethod = async (paymentMethod) => {
  return await PaymentMethod.create(paymentMethod);
}

export const getPlataformComissionByPaymentMethod = async (paymentMethodId) => {
  const paymentMethod = await PaymentMethod.findById(paymentMethodId);
  const accountBusiness = await AccountBusiness.findById(paymentMethod.accountBusiness.toString());
  return accountBusiness.platformCommission;
}

const getAllTaxPaymentMethods = async () => {
  const paymentMethods = await PaymentMethod.find();
  let amountTax = 0;
  for (const paymentMethod of paymentMethods) {
    if (paymentMethod.paymentTax) {
      amountTax = amountTax + paymentMethod.paymentTax
    }
  }
  return amountTax;
}