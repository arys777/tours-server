const { sequelize, Sequelize, History } = require('./models');

const searchTours = (req, res) => {
  const { country_id, tour_id, duration, max_price=10000000 } = req.query;
  const where = [
    { query: 'Countries.CountryId=', value: country_id },
    { query: 'Tours.TourId=', value: tour_id },
    { query: 'Tours.TourDuration=', value: duration },
    { query: 'Tours.TourPrice<', value: max_price }
  ]
    .filter(el => el.value)
    .map(el => `${el.query}${el.value}`);
  sequelize
    .query(
      `
        SELECT Tours.*, Countries.CountryId, Countries.CountryName 
        FROM ((
          Tours LEFT JOIN ToursToCountries AS ttc ON Tours.TourId=ttc.TourId)
          INNER JOIN Countries ON Countries.CountryId=ttc.CountryId)
        ${tour_id || country_id || duration || max_price ? 'WHERE' : ''} 
          ${where.join(" AND ")}
      `,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

const searchData = (req, res) => {
  return Promise
    .all([
      sequelize.query('SELECT * FROM Tours', { type: Sequelize.QueryTypes.SELECT }),
      sequelize.query('SELECT * FROM Countries', { type: Sequelize.QueryTypes.SELECT }),
      sequelize.query('SELECT TourDuration FROM Tours GROUP BY TourDuration', { type: Sequelize.QueryTypes.SELECT })
    ])
    .then(values => ({
      tours: values[0],
      countries: values[1],
      durations: values[2].map(el => el.TourDuration),
    }))
    .then(result => res.send(result))
    .catch(err => res.status(400).send(err));
}

const searchByCountryName = (req, res) => {
  const { country_name } = req.query;
  sequelize
    .query(`SELECT * FROM Countries WHERE CountryName LIKE '${country_name}%'`, { type: Sequelize.QueryTypes.SELECT })
    .then(countries => res.send(countries))
    .catch(({ message }) => res.status(400).send({ message }));
}

const clients = (req, res) => {
  sequelize
    .query('SELECT * FROM Clients ORDER BY ClientId', { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result));
};

const countries = (req, res) => {
  sequelize
    .query('SELECT * FROM Countries ORDER BY CountryId', { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result));
};

const tours = (req, res) => {
  sequelize
    .query('SELECT * FROM Tours ORDER BY TourId', { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result));
};

const employees = (req, res) => {
  sequelize
    .query('SELECT * FROM Employees ORDER BY EmployeeId', { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result));
};

const contracts = (req, res) => {
  sequelize
    .query('SELECT * FROM Contracts ORDER BY ContractId', { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result));
}

const history = (req, res) => {
  sequelize
    .query('SELECT * FROM History ORDER BY CreatedAt DESC', { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result));
}

const incomeSumByEmployees = (req, res) => {
  sequelize
    .query(
      `
        SELECT 
          Employees.EmployeeId, 
          Employees.EmployeeFullName,
          SUM(Payments.Amount) AS total
        FROM 
          (Payments INNER JOIN Employees ON Payments.EmployeeId = Employees.EmployeeId) 
        GROUP BY Employees.EmployeeFullName, Employees.EmployeeId;
      `,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

const clientsByAddress = (req, res) => {
  const address = req.query.address || 'Address 1';
  sequelize
    .query(`SELECT * FROM Clients WHERE ClientAddress = '${address}'`, { type: Sequelize.QueryTypes.SELECT })
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

const toursByCountry = (req, res) => {
  const country = req.query.country || 'Baku';
  sequelize
    .query(
      `
        SELECT
          ToursToCountries.TourId,
          Tours.TourName,
          ToursToCountries.CountryId,
          Countries.CountryName
        FROM (
          ToursToCountries 
            INNER JOIN 
              Tours 
            ON 
              ToursToCountries.TourId = Tours.TourId
            INNER JOIN
              Countries
            ON
              ToursToCountries.CountryId = Countries.CountryId
        )
        WHERE 
          Countries.CountryName = '${country}'
      `,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

const tourByPrice = (req, res) => {
  const { from, to } = req.query;
  sequelize
    .query(
      `SELECT * FROM tours WHERE TourPrice > ${from} AND TourPrice < ${to}`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

const popularServices = (req, res) => {
  sequelize
    .query(
      `
        SELECT 
          COUNT(Services.ServiceName) as ServiceCount,
          Services.ServiceName
        FROM 
          ContractsToServices 
            INNER JOIN 
              Contracts 
            ON 
              ContractsToServices.ContractId = Contracts.ContractId
            INNER JOIN
              Services
            ON
              ContractsToServices.ServiceId = Services.ServiceId
        GROUP BY Services.ServiceName
        ORDER BY ServiceCount DESC
      `,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(result => res.send(result))
    .catch(err => res.send(err));
};

//procedures
const employeeContracts = (req, res) => {
  const { id } = req.query;
  if(!id) {
    res.status(400).send({ message: 'Введите код сотрудника' })
  } else {
    sequelize
      .query(`exec employee_contracts @id=${id}`, { type: Sequelize.QueryTypes.SELECT })
      .then(contracts => res.send(contracts));
  }
}

const females18_25 = (req, res) => {
  sequelize
    .query(`exec females_18_25`, { type: Sequelize.QueryTypes.SELECT })
    .then(clients => res.send(clients));
}

const add3Countries = (req, res) => {
  sequelize
    .query('exec add_3_countries', { type: Sequelize.QueryTypes.SELECT })
    .then(countries => res.send(countries));
};

const contractDuration = (req, res) => {
  const { id } = req.query;
  if(!id) {
    res.status(400).send({ message: 'Введите код контракта' })
  } else {
    sequelize
      .query(`exec contract_duration @id=${id}`, { type: Sequelize.QueryTypes.SELECT })
      .then(result => res.send(result[0]));
  }
};

const createContract = (req, res) => {
  const { client_id, employee_id, tour_id, begin_date, end_date } = req.body;
  sequelize
    .query(
      `
        INSERT INTO 
          Contracts (ClientId, EmployeeId, TourId, BeginDate, EndDate) 
          VALUES (${client_id}, ${employee_id}, ${tour_id}, '${begin_date}', '${end_date}')
      `
    )
    .then(() => res.send({ message: 'success' }))
    .catch(({ message }) => res.status(400).send({ message }));
}

const createPayment = (req, res) => {
  const { employee_id, client_id, amount, tour_id } = req.body;
  sequelize
    .query(
      `
        INSERT INTO
          Payments (EmployeeId, ClientId, Amount, TourId, DateCreated)
          VALUES (${employee_id}, ${client_id}, ${amount}, ${tour_id}, GETDATE())
      `
    )
    .then(() => res.send({ message: 'ok' }))
    .catch(err => res.status(500).send(err))
}

const createPaymentSocket = params => {
  const { employee_id, client_id, amount, tour_id } = params;
  return sequelize.query(
    `
      INSERT INTO
        Payments (EmployeeId, ClientId, Amount, TourId, DateCreated)
        VALUES (${employee_id}, ${client_id}, ${amount}, ${tour_id}, GETDATE())
    `
  );
}

//reports
const firstContract = (req, res) => {
  sequelize
    .query('SELECT TOP 1 * FROM Contracts', { type: Sequelize.QueryTypes.SELECT })
    .then(contracts => res.send(contracts))
    .catch(err => res.status(500).send(err));
}

const financeReport = (req, res) => {
  const { employee_id, date_start, date_end } = req.query;
  sequelize
    .query(
      `SELECT * FROM Payments WHERE EmployeeId=${employee_id} AND DateCreated>'${date_start}' AND DateCreated<'${date_end}'`,
      { type: Sequelize.QueryTypes.SELECT }
    )
    .then(payments => res.send({
      sum: payments.reduce((acc, el) => acc + el.Amount, 0),
      history: payments
    }))
    .catch(err => res.status(500).send(err));
}

const toursSoldThisYear = (req, res) => {
  sequelize
    .query('SELECT * FROM Contracts WHERE YEAR(CreatedAt)=YEAR(GETDATE())', { type: Sequelize.QueryTypes.SELECT })
    .then(contracts => res.send(contracts))
    .catch(err => res.status(500).send(err));
}

module.exports = {
  clients,
  countries,
  tours,
  employees,
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
};