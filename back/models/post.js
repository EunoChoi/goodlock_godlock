module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
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
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' }); //post.addLikers, post.removeLikers 가능 , Like 테이블 생성

    //리트윗, 특정 포스트가 하나의 포스트에게 속한 경우, 원본 게시글 하나에 여러 리트윗이 가능하므로 1대다 관계
    //속하는 상대방 모델[포스트]를 Retweet이라 명명한다. 포스트 내부 column에 PostId 대신 RetweetId로 추가된다.
    // db.Post.belongsTo(db.Post, { as: 'Retweet' });
  };

  return Post;
}