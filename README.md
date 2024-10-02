<img width="1080" alt="everstamp_main" src="https://moseoree-s3.s3.ap-northeast-2.amazonaws.com/mainImage.png">

### 1. 프로젝트 개요
- **프로젝트 명**

	나만의 감성 더하기, **굿락갓락**

- **서비스 제공**
  - 웹사이트 :  [goodlock.site 🔗](https://goodlock.site)
- **프로젝트 설명**
  
	굿락갓락은 갤럭시와 굿락에 관한 팁을 공유하는 커뮤니티입니다. 이미지와 텍스트를 통해 커스텀 팁을 전달하고 굿락 GTS와 드랍십 기능을 활용하여 쉽게 공유할 수 있도록 도와줍니다.
	
	- **회원가입&로그인** : 
	- **정보 공유** :
		- 게시글
	 	- 사진
		- 댓글
  		- 좋아요
    	- 북마크 
	- **유저 관계** : 팔로잉, 팔로워
	- **안내 챗봇** :


- **[개발 회고 (velog)](https://velog.io/@eunocode/series/굿락갓락)**
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
  
- **Server**
  
	![amazonec2](https://img.shields.io/badge/EC2-ed8233?style=flat&logo=amazonec2&logoColor=white)
	![amazons3](https://img.shields.io/badge/S3-da5141?style=flat&logo=amazons3&logoColor=white)
	![awslambda](https://img.shields.io/badge/Lambda-d26214?style=flat&logo=awslambda&logoColor=white)
	![NginX](https://img.shields.io/badge/NginX-da5141?style=flat&logo=amazons3&logoColor=white)
	![Certbot](https://img.shields.io/badge/Certbot-da5141?style=flat&logo=amazons3&logoColor=white)

<br />

### 3. 프로젝트 미리보기

<br />

<img width="1080" alt="glgl_readme_1" src="https://github.com/user-attachments/assets/1b9505d7-98a9-4be4-bac4-ab970f41c8fc">
<h4 align=center > Mobile</h4>
<img width="1080" alt="glgl_readme_2" src="https://github.com/user-attachments/assets/f4423726-4837-485e-8afd-7e27b6625c0c">
<h4 align=center > Tablet & Desktop</h4>


<br />

### 4. 프로젝트 구조

<img width="1080" alt="everstamp 구조" src="https://github.com/user-attachments/assets/acd9fbd5-621b-4981-b8f6-edce5240fcb4">

#### front

```
front
├── public/
├── src
│   ├── Axios/
│   ├── app
│   │   ├── (error)/
│   │   ├── api/
│   │   ├── app
│   │   │   ├── (afterLogin)
│   │   │   │   ├── @modal/
│   │   │   │   ├── calendar/
│   │   │   │   ├── habit/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── list/
│   │   │   │   └── setting/
│   │   │   │   ├── inter
│   │   │   │   │   ├── habitInfo/
│   │   │   │   │   ├── habitOrder/
│   │   │   │   │   ├── input
│   │   │   │   │   │   ├── addDiary/
│   │   │   │   │   │   ├── addHabit/
│   │   │   │   │   │   ├── editDiary/
│   │   │   │   │   │   └── editHabit/
│   │   │   │   │   └── zoom/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── offline/
│   │   └── page.tsx
│   ├── auth.ts
│   ├── component/
│   ├── fonts/
│   ├── function/
│   ├── middleware.ts
│   └── style/
├── README.md
└── package.json
```

#### back

```
back
├── app.js
├── config
│   └── config.js
├── function
│   ├── decrypt.js
│   └── encrypt.js
├── middleware
│   └── tokenCheck.js
├── migrations/
├── models
│   ├── diary.js
│   ├── habit.js
│   ├── image.js
│   ├── index.js
│   └── user.js
├── package.json
├── pnpm-lock.yaml
├── routes
│   ├── diary.js
│   ├── habit.js
│   ├── image.js
│   └── user.js
└── seeders
```

<br />


### 5. 개선 예정 사항

- [ ] 앱 환경 구축
	- [ ] PWA(웹앱) 기능 추가
- [ ] 앱 최적화
	- [ ] 광고 차단 프로그램 버그 수정 
	- [ ] Styled Component 코드 정리
 	- [ ] 리렌더링 최적화

