module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Clients', 'ClientGender', {
        type: Sequelize.STRING,
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Clients', 'ClientGender')
  }
};
