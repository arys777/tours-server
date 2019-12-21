module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        CREATE PROCEDURE FEMALES_18_25
        AS
        SELECT * 
        FROM Clients 
        WHERE 
          DATEDIFF(year, ClientBirthday, GETDATE()) >= 18 AND 
          DATEDIFF(year, ClientBirthday, GETDATE()) <= 25 AND
          ClientGender = 'female'
      `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS FEMALES_18_25')
  }
};
