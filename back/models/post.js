module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    warning: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    blind: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  Post.associate = (db) => {
    //post가 모델 하나를 가짐
    db.Post.belongsTo(db.User); //post.addUser, post.setUser, post.getUser

    //post가 모델 다수를 가짐
    db.Post.hasMany(db.Comment); //post.addComments
    db.Post.hasMany(db.Image); //post.addImages

    //post가 복수의 모델에 속함
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // PostHashtag 테이블 생성

    //좋아요는 유저와 포스트가 다대다 관계를 가지는 것
    db.Post.belongsToMany(db.User, {
      through: 'Like', as: 'Likers', foreignKey: "Post_id",
      sourceKey: "id",
    }); //post.addLikers, post.removeLikers 가능 , Like 테이블 생성
  };

  return Post;
}