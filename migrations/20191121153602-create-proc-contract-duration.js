module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        CREATE PROCEDURE CONTRACT_DURATION @ID INT
        AS
        SELECT DATEDIFF(day, BeginDate, EndDate) AS Duration FROM Contracts WHERE ContractId=@ID     
      `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS CONTRACT_DURATION')
  }
};
