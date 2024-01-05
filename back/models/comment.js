module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  });

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);

    //reply
    db.Comment.belongsToMany(db.Comment, { through: 'Reply', as: 'ReplyParent', foreignKey: 'ReplyChildId' });
    db.Comment.belongsToMany(db.Comment, { through: 'Reply', as: 'ReplyChild', foreignKey: 'ReplyParentId' });
  };

  return Comment;
}