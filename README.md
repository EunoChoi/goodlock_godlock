<img src="https://moseoree-s3.s3.ap-northeast-2.amazonaws.com/mainImage.png" style="margin-top: 40px; width: 100%;object-fit: contain;">

<br />

## 나만의 감성 더하기, 굿락갓락
---
### 📄 개요
- **서비스명**

	나만의 감성 더하기, 굿락갓락

- **프로젝트 설명**

	굿락갓락은 갤럭시와 굿락에 관한 팁을 공유하는 커뮤니티입니다. <br />
	이미지와 텍스트를 통해 커스텀 팁을 전달하고 굿락 GTS와 드랍십 기능을 활용하여 쉽게 공유할 수 있도록 도와줍니다.

- **관련 문서**

	🔗 Front-end README.md
	<br />
	🔗 Back-end README.md

- **서비스 URL**

	🔗 https://goodlock.site

- **개발 회고 (velog)**

	<div>
		<a>🔗 https://</a> <br />
		<a>🔗 https://</a> <br />
		<a>🔗 https://</a> <br />
		<a>🔗 https://</a> <br />
		<a>🔗 https://</a> <br />
	</div>


---
### 🧰 기술 스택
**Front-End**

 
<div>
	
![react](https://img.shields.io/badge/React-5ed2f3?style=flat&logo=React&logoColor=white)
![react](https://img.shields.io/badge/typescript-2f73bf?style=flat&logo=typescript&logoColor=white)
![react](https://img.shields.io/badge/css-244bdd?style=flat&logo=React&logoColor=white)
![react](https://img.shields.io/badge/mui-244bdd?style=flat&logo=React&logoColor=white)

</div>

**Back-End**
<div>

![react](https://img.shields.io/badge/node-ebd81b?style=flat&logo=React&logoColor=white)
![react](https://img.shields.io/badge/express-7ab800?style=flat&logo=typescript&logoColor=white)
![react](https://img.shields.io/badge/mysql-01718b?style=flat&logo=React&logoColor=white)
![react](https://img.shields.io/badge/sequelize-0ca9e7?style=flat&logo=React&logoColor=white)

</div>

**State Management**
<div>

![react](https://img.shields.io/badge/reactQuery-f73e51?style=flat&logo=React&logoColor=white)
![react](https://img.shields.io/badge/zustand-453837?style=flat&logo=typescript&logoColor=white)

</div>

**Server**
<div>

![react](https://img.shields.io/badge/ec2-ed8233?style=flat&logo=typescript&logoColor=white)
![react](https://img.shields.io/badge/s3-da5141?style=flat&logo=React&logoColor=white)
![react](https://img.shields.io/badge/lambda-d26214?style=flat&logo=React&logoColor=white)

</div>


---
### 💡 주요 기능 미리보기

![[signup.png]]


![[Pasted image 20240113154831.png]]

- **SignUp & LogIn**

	> 일반가입과 간편가입, 두가지 방식의 회원가입을 지원합니다. <br /><br />
	> 💡 일반가입시 이메일, 비밀번호, 닉네임 정보를 요구합니다. 이후 입력한 이메일 주소로 전송된 인증코드를 올바르게 입력해야 가입이 완료됩니다. <br />
	> 💡 구글, 카카오 ,네이버 계정으로 간편가입을 지원합니다. 계정으로부터 가입에 필요한 이메일, 프로필 이미지의 정보만을 요구합니다. <br />
	> 💡 굿락갓락의 게시글을 읽기만하고 싶은 경우 게스트 유저로 로그인이 가능합니다. <br /> <br />
	> **⚙️⚙️⚙️ 로그인은 JWT를 이용하여 구현되었습니다.** 

 <br />

![[home.png]]

- **Main Page(Home, Tip Board, Free Board)**

	> 공지사항, 팁 포스트, 자유 포스트, 인기 포스트를 보여주는 메인페이지입니다. 포스트는 내림차순으로 정렬됩니다. (최신 포스트가 상단에 위치)  <br /> <br />
	> 💡 포스트 카드의 하트, 북마크 아이콘을 통해 좋아요와 북마크 처리가 가능하며 링크 아이콘을 통해 공유 URL 복사가 가능합니다. <br />
	> 💡 각 페이지마다 Feed, Ongoing 등 의 필터를 지원하며 포스트 내용으로 검색도 가능합니다. <br />
	> 💡 데스크탑 환경에선 우측에 많이 사용된 태그가 보여집니다. (등록 횟수로 정렬, 최대 10개) <br /> <br />
	> ⚙️⚙️⚙️ 포스트는 인피니트 쿼리와 인피니트 스크롤 컴포넌트를 이용하여 불러옵니다. (무한 스크롤)

 <br />
 

![[gallery 1.png]]

- **Gallery Page**
  
	> 게시글의 등록된 이미지를 한번에 보여주는 페이지입니다.  <br />  <br />
	> 💡 이미지들은 팁 포스트, 자유 포스트로 분류되어있습니다.  <br />  <br />
	> ⚙️⚙️⚙️ 이미지들은 인피니트 쿼리와 인피니트 스크롤 컴포넌트를 사용하여 불러옵니다. (인피니트 스크롤)  <br />

 <br />
 

![[profile.png]]

- **Profile Page**
  
	> 로그인 유저 정보가 나타나는 프로필 페이지입니다. <br /><br />
	> 💡 닉네임 및 유저 텍스트 변경이 가능합니다. <br />
	> 💡 비밀번호 변경, 회원 탈퇴가 가능합니다. <br />
	> -> 일반 회원가입 유저만 비밀번호 변경이 가능합니다. 간편 로그인 유저는 비밀번호 변경 불가 <br />
	> 💡 작성한 팁 포스트, 자유 포스트와 북마크한 포스트, 좋아요한 포스트 확인이 가능합니다. <br />
	> -> 포스트 클릭 시 해당하는 포스트만 보여주는 페이지로 이동합니다. <br />
	> 💡 내 팔로잉, 팔로워 확인이 가능합니다. <br />
	> -> 유저 포로필 이미지 클릭 시 유저 정보 페이지로 이동합니다. <br />

<br />


![[otherUserInfo.png]]

- **Other User Info Page**
  
	> 다른 유저의 정보를 보여주는 페이지입니다. <br /><br />
	> 💡 팔로우, 언팔로우가 가능합니다. <br />
	> 💡 유저가 작성한 팁 포스트, 자유 포스트와 북마크한 포스트, 좋아요한 포스트 확인이 가능합니다. <br />
	> -> 포스트 클릭 시 해당하는 포스트만 보여주는 페이지로 이동합니다. <br />
	> 💡 유저의 팔로잉, 팔로워 목록 확인이 가능합니다. <br />
	> -> 유저 포로필 이미지 클릭 시 유저 정보 페이지로 이동합니다. <br />

 <br />
 

![[sidebar.png]]

- **Sidebar(Mobile)**
  
	> 모바일 환경에서 토글 버튼을 이용해 사이드바를 열고 닫을 수 있습니다. <br />
	> 사이드바 내부에서 간단한 유저 정보 확인이 가능합니다. <br />
	> 홈, 팁 보드, 자유 보드, 프로필 페이지 이동이 가능하며 유저 로그아웃이 가능합니다. <br /><br />
	>💡 사이드바 닫기 <br />
	> -> 모바일 뒤로가기 제스처로 언마운트 가능합니다. <br />
	> -> 블러 배경을 클릭해 언마운트 가능합니다. <br />
	>💡 열기, 닫기 모두 애니메이션이 존재합니다. <br />
	> -> 사파리 환경에서 블러 배경 클릭시 닫기 애니메이션이 존재하지만 뒤로가기 제스처시 애니메이션이 스킵됩니다. <br />
 	> -> 사파리 뒤로가기 애니메이션과 충돌... 매우 어색 <br />

 <br />
 

![[postAdd.png]]
![[postCancel 1.png]]
![[postAddImage.png]]

- **Add Post**
  
	> 포스트 등록 시 포스트 내용, 공유기간, 링크 입력이 가능합니다. <br />
	> -> 포스트 내용은 8자~2200자의 값을 가져야합니다. <br />
	> -> 공유기간 및 링크는 필수 입력 값이 아닙니다. <br />
	> 
	> 💡 취소 버튼 클릭, 배경 블러 클릭, 뒤로가기 제스처 시 확인 팝업을 통해 나가기가 방지 됩니다. <br />
	> 💡 5MB 미만 크기를 가진 이미지를 최대 10개까지 첨부 가능합니다. <br />
	> -> 이미지는 AWS S3에 저장됩니다. 이미지 저장시 lambda 함수로 사이즈를 줄인 이미지 파일이 추가로 저장되어 썸네일로 사용됩니다. <br />


<br />

![]

- **Post Zoom**
  
	> 포스트 클릭시 확대된 화면으로 볼 수 있습니다. <br />
	> 클릭시 contain -> cover로 변경 <br />
	> 데스크탑 이미지+텍스트, 데스크탑 텍스트, 모바일 세로, 모바일 가로<br />
	> 모두 다름 <br />

![[moretoggle.png]]

- **Post More Popup**
  
	> 자신의 포스트의 경우 more 버튼이 나타납니다. more 버튼 클릭 시 수정, 삭제 버튼을 품은 팝업이 나타나면 일정 시간 이후 팝업이 자동으로 닫힙니다.

<br />


![[comment.png]]

 - **Comment List**
   
	> 포스트의 댓글 아이콘을 클릭해서 댓글 목록을 열 수 있습니다. 댓글들은 포스트와 다르게 오름차순으로 정렬되어 나타납니다. (최근 댓글이 아래로) <br />
	> 배경 블러 및 화살표를 클릭, 뒤로가기 제스처로 댓글 목록을 닫을 수 있습니다. <br /><br />
	> 💡 로그인 상태에선 댓글 입력창이 나타나 댓글 입력이 가능합니다.
	> 💡 로그인 상태에선 댓글 클릭 시 답글 입력창이 나타나 답글 입력이 가능합니다.


<br />


![[chatbot.png]]

- **Simple Chatbot**
  
	> 굿락갓락 소개 및 사용 팁, 문의하기가 가능한 간단한 챗봇입니다. <br />
	> 우측 하단 챗봇 토글로 열기가 가능하며 배경 블러 클릭 및 뒤로가기 제스처로 닫을 수 있습니다. <br />
	> -> 모바일의 경우 뒤로가기 제스처로 닫기만 가능합니다. <br />
	> 
	> 💡 문의하기 기능을 이용하면 관리자에게 문의 이메일 전송되며 로그인한 유저에게 문의 확인 메일이 전송됩니다. <br />
	> -> 확인 메일 : goodlockgodlock@gmail.com -> 유저 이메일 <br />
	> -> 문의 메일 : goodlockgodlock@gmail.com -> godlock.info@gmail.com <br />

<br />


![[admin.png]]

- **admin page**
  
	> 관리자 페이지입니다. <br /><br />
	> 💡 현재 forest admin을 사용해서 구현되었습니다. <br />
	> 💡 무료 기간이 종료되면 react admin으로 구현 예정입니다. <br />



---
### ⚒️ 개선 예정 사항


- **개선 완료**
- - [ ] ...
- **기능 개선 예정**
	- [ ] 포스트 컴포넌트 내부 링크 인식
	- [ ] 포스트 줌 컴포넌트 이미지 줌 구현
	- [ ] 다크 모드 추가
	- [ ] 언어 설정 추가
	- [ ] 댓글 불러오기 최적화
	- [ ] 리렌더링 최적화
	- [ ] 신고&블라인드 기능 추가
- **코드 개선**
	- [ ] 미디어 쿼리 조건 정리
	- [ ] 인피니티 쿼리 코드 정리
	- [ ] 컴포넌트 이름 정리

---
### 💻 프로젝트 구조
```
goodlock_godlock
ㄴfront
	ㄴpublic
		ㄴimg/
	ㄴsrc
		ㄴapis/
		ㄴcomponents/
			ㄴchatbot/
			ㄴcommon/
			ㄴmainPage/
			ㄴstartPage/
		ㄴfont/
		ㄴfunctions/
			ㄴreactQuery/
			ㄴinfinityQuery/
		ㄴpages/
			ㄴauth/
		ㄴstore/
		ㄴstyles/
ㄴback
	ㄴconfig/
	ㄴcontroller/
	ㄴmiddleware/
	ㄴmodels/
	ㄴroutes/
```

