module.exports = (sequelize, DataTypes) => { //sequelize는 시퀄라이즈 라이브러리를 이용해 얻어낸 시퀄라이즈 연결 객체
  //'User'로 입력하면 mySQL에는 users 테이블이 생성된다.
  const User = sequelize.define('User', {
    //모델(테이블)의 속성(collumn)값 입력
    //id는 기본적으로 알아서 들어간다.
    level: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(30),//최대 30자인 문자(STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME)
      allowNull: false, //빈값 허용 X, 입력 필수
      unique: true //고유값
    },
    nickname: {
      type: DataTypes.STRING(30),
      allowNull: false, //빈값 허용 X, 입력 필수
      unique: true //고유값

    },
    password: {
      type: DataTypes.STRING(100),//암호화 된 값이 들어가기 때문에 100으로 길이제한
      allowNull: false //빈값 허용 X, 입력 필수
    },
    profilePic: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    usertext: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    //모델 세팅 값 입력
    //한글 포함
    charset: 'utf8',
    collate: 'utf8_general_ci',

    //한글 포함 이모티콘까지
    //charset: 'utf8mb4', 
    //collate: 'utf8mb4_general_ci',
  });

  //관계 설정
  User.associate = (db) => {
    //일대다 관계 [게시글, 댓글]
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);

    //다른 모델간 다대다 관계 [좋아요]
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' }); //중간 테이블 이름을 정해줄수있다

    //같은 모델간 다대다 관계 [팔로잉, 팔로워], 같은 모델간 다대다 관계가 존재할때 foreignKey를 입력해야 한다.
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowerId' });
  };

  return User;
}