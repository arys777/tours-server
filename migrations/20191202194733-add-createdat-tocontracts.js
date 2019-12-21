'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn('Contracts', 'CreatedAt', {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: '2019-12-03',
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Contracts', 'CreatedAt')
  }
};
