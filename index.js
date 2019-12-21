const express = require('express');
const { 
  clients,
  employees,
  tours,
  countries,
  contracts,
  history,
  incomeSumByEmployees,
  clientsByAddress,
  toursByCountry,
  tourByPrice,
  popularServices,
  employeeContracts,
  females18_25,
  add3Countries,
  contractDuration,
  searchTours,
  searchData,
  createContract,
  createPayment,
  createPaymentSocket,
  searchByCountryName,
  firstContract,
  financeReport,
  toursSoldThisYear,
} = require('./queries');
const Http = require('http');
const SocketIO = require('socket.io');

const { History, sequelize } = require('./models');

const app = express(); 

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

const http = Http.Server(app);
const io = SocketIO(http);

app.get('/clients', clients);
app.get('/employees', employees);
app.get('/tours', tours);
app.get('/countries', countries);
app.get('/contracts', contracts);
app.get('/history', history);

app.get('/incomeSumByEmployees', incomeSumByEmployees);
app.get('/clientsByAddress', clientsByAddress);
app.get('/toursByCountry', toursByCountry);
app.get('/tourByPrice', tourByPrice);
app.get('/popularServices', popularServices);

//procedures
app.get('/employeeContracts', employeeContracts);
app.get('/females18_25', females18_25);
app.get('/add3Countries', add3Countries);
app.get('/contractDuration', contractDuration);

//search
app.get('/searchTours', searchTours);
app.get('/searchData', searchData);
app.get('/searchByCountryName', searchByCountryName);

app.post('/createContract', createContract);
app.post('/createPayment', createPayment);

//queries
app.get('/firstContract', firstContract);
app.get('/financeReport', financeReport);
app.get('/toursSoldThisYear', toursSoldThisYear)

http.listen(7777, function () {
  console.log('👍🏻 Tours server listening on port 7777!');
});

io.on('connection', socket => {
  socket.on('addPayment', params => {
    createPaymentSocket(params)
      .then(() => {
        History
          .findAll({ order: [['CreatedAt', 'DESC']] })
          .then(history => socket.emit('history', history));
      })
  })
});