module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        CREATE TABLE History
        (
            Id INT IDENTITY PRIMARY KEY,
            Reference NVARCHAR(16) NOT NULL,
            Operation NVARCHAR(200) NOT NULL,
            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        );
      `)
      .then(() => queryInterface.sequelize
          .query(`
            CREATE TRIGGER Payments_INSERT
            ON Payments
            AFTER INSERT
            AS
            INSERT INTO History (Reference, Operation)
            SELECT 'payment_' + (SELECT CONVERT(varchar(10), PaymentId)), N'Произведена оплата на сумму: ' + (SELECT CONVERT(varchar(10), Amount))
            FROM INSERTED
          `)
      )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query("DROP TABLE IF EXISTS History")
      .then(() => queryInterface.sequelize
        .query("DROP TRIGGER IF EXISTS Payments_INSERT"));
  }
};
