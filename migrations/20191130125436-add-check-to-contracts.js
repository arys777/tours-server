module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        ALTER TABLE Contracts
        ADD CONSTRAINT check_begin_date_end_date CHECK (BeginDate < EndDate)
      `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        ALTER TABLE Contracts
        DROP CONSTRAINT IF EXISTS check_begin_date_end_date
      `);
  }
};
