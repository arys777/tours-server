module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        CREATE INDEX index_country
        ON Countries (CountryName);
      `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        DROP INDEX index_country ON Countries;
      `)
  }
};
