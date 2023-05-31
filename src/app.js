import  express  from "express";
import  path  from "path";
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config' 
import cors from './configurations/cors'
import createRouter from "./controllers/index"
import mongoose from './configurations/database';
import bodyParser from "body-parser";

import { getAccountMaster } from './services/balance';

var app = express();
app.use(cors());

// view engine setup
// view engine setup and send static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port',process.env.PORT|| 3002)

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//create router
createRouter(app);

const server = app.listen(app.get('port'),()=>{
  console.log('server on port ' +  app.get('port'))
}) 

getAccountMaster();

module.exports = app;
