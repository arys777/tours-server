module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define('History', {
    Reference: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    Operation: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    CreatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'History',
    timestamps: false
  });

  return History;
};
