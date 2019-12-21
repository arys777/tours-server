module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        CREATE PROCEDURE EMPLOYEE_CONTRACTS @ID INT
        AS
        SELECT * FROM Contracts WHERE ClientId = @ID
      `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS EMPLOYEE_CONTRACTS')
  }
};
