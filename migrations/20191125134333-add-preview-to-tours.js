module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Tours', 'preview', {
        type: Sequelize.STRING
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .removeColumn('Tours', 'preview');
  }
};
