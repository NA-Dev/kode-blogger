module.exports = (sequelize, DataTypes) => {
    return sequelize.define('notes', {
      id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }, {
      timestamps: true 
    });
  };