module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize
      .query(`
        CREATE PROCEDURE ADD_3_COUNTRIES
        AS
        INSERT INTO Countries (CountryName) VALUES (SUBSTRING(CONVERT(varchar(40), NEWID()),0,9));
        INSERT INTO Countries (CountryName) VALUES (SUBSTRING(CONVERT(varchar(40), NEWID()),0,9));
        INSERT INTO Countries (CountryName) VALUES (SUBSTRING(CONVERT(varchar(40), NEWID()),0,9));
        SELECT TOP(3) * FROM Countries ORDER BY CountryId DESC;        
      `)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP PROCEDURE IF EXISTS ADD_3_COUNTRIES')
  }
};
