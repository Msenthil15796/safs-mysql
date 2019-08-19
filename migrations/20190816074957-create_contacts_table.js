//'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   
      return queryInterface.createTable("contacts", {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // autoIncrement:true,
          primaryKey: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        village: {
          type: Sequelize.STRING,
          allowNull: false
        },
        district: {
          type: Sequelize.STRING,
          allowNull: false
        },
        contactNo: {
          type: Sequelize.STRING,
          allowNull: false
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false
        },
        crop: {
          type: Sequelize.STRING,
          allowNull: false
        },
        fieldSize: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        latlang: {
          type: Sequelize.INTEGER
        },
        nextDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        reason: {
          type: Sequelize.STRING,
          allowNull: false
        },
        remarks: {
          type: Sequelize.STRING,
          allowNull: false
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      });
  
  },

  down: (queryInterface, Sequelize) => {
   
    
      return queryInterface.dropTable('contacts');
    
  }
};
