<img width="1080" alt="glglmain" src="https://github.com/user-attachments/assets/0ad04659-fecc-4272-b627-b7e2e726a9aa">

### 1. 프로젝트 개요
- **프로젝트 명**

	나만의 감성 더하기, **굿락갓락**

- **서비스 제공**
  - 웹사이트 :  [glgl.site 🔗](https://glgl.site) (goodlock.site -> glgl.site로 변경되었습니다.)
- **프로젝트 설명**
  
	‘굿락갓락’은 갤럭시 디바이스의 커스텀 설정 앱인 ‘Goodlock’에 대한 팁을 공유하는 커뮤니티입니다. 팁 게시판에서 나만의 Goodlock 활용법을 작성하고, 게시글 북마크 및 유저 팔로우 기능으로 마음에 드는 게시글을 모아 쉽게 확인하세요.


	- **회원가입 & 로그인**
		- 메일 인증을 통한 회원가입 및 로그인
  		- SNS 간편 회원가입 및 로그인 (카카오, 네이버, 구글)
	- **커뮤니티 기능** 
		- 공유일, 링크, 이미지를 포함한 게시글 (팁, 자유)
		- 댓글 및 대댓글
		- 특정 게시글 페이지 링크 공유
	- **게시글 모아보기**
 		- 북마크 & 좋아요
   		- 유저 팔로우
		- 갤러리 
	- **안내 챗봇** : 기본적인 사이트 이용 방법을 안내


- **개발 회고 (velog)**
	- [🔗 회원가입 구현(로컬,구글,카카오,네이버)+이메일 인증](https://velog.io/@eunocode/굿락갓락-회원가입-이메일인증)
	- [🔗 로그인 구현(Json Web Token)](https://velog.io/@eunocode/굿락갓락-로그인-구현-JWT)
	- [🔗 이미지 onError 무한루프 문제 해결](https://velog.io/@eunocode/굿락갓락-이미지-onError-무한루프-해결)
	- [🔗 이미지 순서 문제 해결](https://velog.io/@eunocode/굿락갓락-이미지순서-문제해결)
	- [🔗 뒤로가기 언마운트 구현](https://velog.io/@eunocode/굿락갓락-뒤로가기시-컴포넌트-언마운트-처리)
	- [🔗 포스트 작성중 나가기 방지](https://velog.io/@eunocode/굿락갓락-나가기-방지-구현)
	- [🔗 애니메이션 1 - 언마운트](https://velog.io/@eunocode/굿락갓락-애니메이션-1-언마운트)
	- [🔗 애니메이션 2 - 사파리 환경 최적화](https://velog.io/@eunocode/굿락갓락-애니메이션-2-사파리-환경-최적화)		


<br />


### 2. 프로젝트 기술 스택



- **Front-End**

  ![TypeScript](https://img.shields.io/badge/TypeScript-2f73bf?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-5ed2f3?style=flat&logo=React&logoColor=white)
	![css3](https://img.shields.io/badge/CSS-244bdd?style=flat&logo=css3&logoColor=white)
	![mui](https://img.shields.io/badge/MUI-244bdd?style=flat&logo=mui&logoColor=white)
  ![styledcomponent](https://img.shields.io/badge/StyledComponent-244bdd?style=flat&logo=css3&logoColor=white)

- **Back-End**
  
	![nodedotjs](https://img.shields.io/badge/Node.js-ebd81b?style=flat&logo=nodedotjs&logoColor=white)
	![express](https://img.shields.io/badge/Express.js-7ab800?style=flat&logo=express&logoColor=white)
	![mysql](https://img.shields.io/badge/MySQL-01718b?style=flat&logo=mysql&logoColor=white)
	![sequelize](https://img.shields.io/badge/Sequelize-0ca9e7?style=flat&logo=sequelize&logoColor=white)

- **State Management**
  
	![reactquery](https://img.shields.io/badge/ReactQuery-f73e51?style=flat&logo=reactquery&logoColor=white)
	![zustand](https://img.shields.io/badge/Zustand-453837?style=flat&logo=&logoColor=white)


- **Server & Security**
  
	![amazonec2](https://img.shields.io/badge/EC2-ed8233?style=flat&logo=amazonec2&logoColor=white)
	![amazons3](https://img.shields.io/badge/S3-da5141?style=flat&logo=amazons3&logoColor=white)
	![awslambda](https://img.shields.io/badge/Lambda-d26214?style=flat&logo=awslambda&logoColor=white)
	![NginX](https://img.shields.io/badge/NginX-green?style=flat&logo=nginx&logoColor=white)
	![letsEncrypt](https://img.shields.io/badge/Let's_Encrypt-blue.svg?logo=let%E2%80%99s-encrypt)


<br />


### 3. 프로젝트 미리보기

<br />

<img width="1080" alt="glgl_readme_1" src="https://github.com/user-attachments/assets/1b9505d7-98a9-4be4-bac4-ab970f41c8fc">
<h4 align=center > Mobile</h4>
<img width="1080" alt="glgl_readme_2" src="https://github.com/user-attachments/assets/f4423726-4837-485e-8afd-7e27b6625c0c">
<h4 align=center > Tablet & Desktop</h4>

- 더 많은 프로젝트 정보 및 이미지는 [노션 페이지](https://eunonote.notion.site/FE-Developer-7fe46851557d45038a8b756146d98929?pvs=4) 참조

<br />


### 4. 프로젝트 구조

<img width="1080" alt="glgl_structure" src="https://github.com/user-attachments/assets/f1e6efa4-80c5-41d8-a172-631e3325823a">

#### front

```
front
├── public
│   ├── img/
├── src
│   ├── App.tsx
│   ├── apis/
│   ├── components
│   │   ├── AppLayout.tsx
│   │   ├── AuthRoute.tsx
│   │   ├── MobileSide.tsx
│   │   ├── PCSide.tsx
│   │   ├── PasswordChangeConfirm.tsx
│   │   ├── PostZoom.tsx
│   │   ├── UserDeleteConfirm.tsx
│   │   ├── chatbot/
│   │   ├── common/
│   │   ├── mainPage/
│   │   └── startPage/
│   ├── functions/
│   ├── index.tsx
│   ├── pages
│   │   ├── Loading.tsx
│   │   ├── Main.tsx
│   │   ├── NotFound.tsx
│   │   ├── PostView.tsx
│   │   ├── Start.tsx
│   │   ├── UserInfo.tsx
│   │   └── auth/
│   ├── store/
│   └── styles/
├── tsconfig.json
├── README.md
├── package-lock.json
└── package.json
```

#### back

```
back
├── app.js
├── config
│   └── config.js
├── controller
│   └── userController.js
├── middleware
│   └── tokenCheck.js
├── models
│   ├── comment.js
│   ├── hashtag.js
│   ├── image.js
│   ├── index.js
│   ├── post.js
│   └── user.js
├── package-lock.json
├── package.json
├── routes
│   ├── auth.js
│   ├── bot.js
│   ├── comment.js
│   ├── hashtag.js
│   ├── image.js
│   ├── post.js
│   └── user.js
└── uploads/
```

<br />


### 5. 개선 예정 사항

- [ ] 앱 환경 구축
	- [ ] PWA(웹앱) 기능 추가
- [ ] 앱 최적화
	- [x] 광고 차단 프로그램 버그 수정 
	- [ ] Styled Component 코드 정리
 	- [ ] 리렌더링 최적화

