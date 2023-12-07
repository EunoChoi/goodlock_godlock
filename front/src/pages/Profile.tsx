import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import Axios from "../apis/Axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { confirmAlert } from "react-confirm-alert";
import moment from "moment";
import "moment/locale/ko";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";
import ProfileChangePopup from "../components/common/ProfileChangePopup";

//style
import Animation from "../styles/Animation";

//mui
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Badge from "@mui/material/Badge";
import InsertEmoticonRoundedIcon from "@mui/icons-material/InsertEmoticonRounded";
import InsertEmoticonOutlinedIcon from "@mui/icons-material/InsertEmoticonOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CancelIcon from "@mui/icons-material/Cancel";
import User from "../functions/reactQuery/User";
import UserDeleteConfirm from "../components/UserDeleteConfirm";
import PasswordChangeConfirm from "../components/PasswordChangeConfirm";
import CircularProgress from "@mui/material/CircularProgress";

interface userProps {
  email: string;
  id: number;
  nickname: string;
}
interface imageProps {
  src: string;
}
interface postProps {
  User: userProps;
  Images: imageProps[];
  content: string;
  createdAt: string;
}
interface user {
  nickname: string;
  id: number;
  profilePic: string;
}

const Profile = () => {
  moment.locale("ko");

  const navigate = useNavigate();

  //state
  const [nicknameInputToggle, setNicknameInputToggle] = useState<boolean>(false);
  const [usertextInputToggle, setUsertextInputToggle] = useState<boolean>(false);
  const [userDeleteModal, setUserDeleteModal] = useState<boolean>(false);
  const [imageChangeModal, setImageChangeModal] = useState<boolean>(false);
  const [passwordChangeModal, setPasswordChangeModal] = useState<boolean>(false);

  const params = useParams();
  const categoryNum = params.cat ? parseInt(params.cat) : -1;

  //input state
  const [nickname, setNickname] = useState<string>("");
  const [usertext, setUsertext] = useState<string>("");

  const scrollTarget = useRef<HTMLDivElement>(null);
  const category = ["My Info", "Followings", "Followers", "Tip Posts", "Free Posts"];

  //function
  const profilePicChangeModalClose = () => {
    setImageChangeModal(false);
    history.back();
  };
  const userDeleteModalClose = () => {
    setUserDeleteModal(false);
    history.back();
  };
  const passwordChangeModalClose = () => {
    setPasswordChangeModal(false);
    history.back();
  };
  const scrollToPill = () => {
    window.scrollTo({
      top: scrollTarget.current?.scrollHeight,
      left: 0,
      behavior: "smooth"
    });
  };
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  };
  const nickUpdateConfirm = (nickname: string) => {
    const pattern = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,10}$/;
    nickname = nickname.toLowerCase();
    if (!nickname.match(pattern)) {
      toast.warning("2자 이상 10자 이하, 소문자 또는 숫자 또는 한글로 구성되어야 합니다.");
    } else {
      confirmAlert({
        // title: "",
        message: "닉네임을 변경하시겠습니까?",
        buttons: [
          {
            label: "취소",
            onClick: () => console.log("닉네임 변경 취소")
          },
          {
            label: "확인",
            onClick: () =>
              editNickname.mutate(
                { nickname },
                {
                  onSuccess: () => {
                    setNicknameInputToggle(false);
                  }
                }
              )
          }
        ]
      });
    }
  };
  const usertestUpdateConfirm = () => {
    if (usertext.length > 30) {
      toast.warning("상태메세지는 최대 30자까지 가능합니다.");
    } else {
      confirmAlert({
        // title: "",
        message: "상태메세지를 변경하시겠습니까?",
        buttons: [
          {
            label: "취소",
            onClick: () => console.log("상태메세지 변경 취소")
          },
          {
            label: "확인",
            onClick: () =>
              editUsertext.mutate(
                { usertext },
                {
                  onSuccess: () => {
                    setUsertextInputToggle(false);
                  }
                }
              )
          }
        ]
      });
    }
  };
  const logoutConfirm = () => {
    confirmAlert({
      // title: "",
      message: "로그아웃 하시겠습니까?",
      buttons: [
        {
          label: "취소",
          onClick: () => console.log("로그아웃 취소")
        },
        {
          label: "확인",
          onClick: () => logout.mutate()
        }
      ]
    });
  };
  const unFollowConfirm = (userId: number) => {
    confirmAlert({
      // title: "",
      message: "언팔로우 하시겠습니까?",
      buttons: [
        {
          label: "취소",
          onClick: () => console.log("취소")
        },
        {
          label: "확인",
          onClick: () => unFollow.mutate({ userId })
        }
      ]
    });
  };
  const followerDeleteConfirm = (userId: number) => {
    confirmAlert({
      // title: "",
      message: "팔로워를 삭제하시겠습니까?",
      buttons: [
        {
          label: "취소",
          onClick: () => console.log("취소")
        },
        {
          label: "확인",
          onClick: () => deleteFollower.mutate({ userId })
        }
      ]
    });
  };

  //모달 열린 상태에서 새로고침시 history.back 처리
  useEffect(() => {
    if (history.state.page === "modal") {
      history.back();
    }
    scrollTop();
  }, []);
  useEffect(() => {
    if (categoryNum >= 0 && categoryNum < 5) {
      console.log("올바른 링크 접근");
    } else {
      navigate("/404");
    }
  }, [categoryNum]);
  //프로필 이미지 변경 팝업 뜬 경우 배경 스크롤 방지
  useEffect(() => {
    if (imageChangeModal) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [imageChangeModal]);

  //useQuery
  const user = User.getData();
  //useInfiniteQuery
  const myInfoPosts = useInfiniteQuery(
    ["myInfoPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/my", { params: { type: 1, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
  const myCommPosts = useInfiniteQuery(
    ["myCommPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/my", { params: { type: 2, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );

  //useMutation
  const logout = User.logout();
  const editNickname = User.editNick();
  const editUsertext = User.editText();
  const unFollow = User.unFollow();
  const deleteFollower = User.deleteFollower();

  //뒤로가기시 이벤트 발생
  window.addEventListener("popstate", () => {
    setUserDeleteModal(false);
    setImageChangeModal(false);
    setUsertextInputToggle(false);
    setNicknameInputToggle(false);
    setPasswordChangeModal(false);
  });

  return (
    <AppLayout>
      <ProfileWrapper>
        {imageChangeModal && <ProfileChangePopup modalClose={profilePicChangeModalClose} />}
        {userDeleteModal && <UserDeleteConfirm modalClose={userDeleteModalClose} />}
        {passwordChangeModal && <PasswordChangeConfirm modalClose={passwordChangeModalClose} />}
        <ProfileTitle ref={scrollTarget}>
          <Title>Profile</Title>
          <span>정보 수정 및 작성 글 확인이 가능합니다.</span>
          <span>마지막 수정 ⋯ {moment(user?.updatedAt).fromNow()}</span>
        </ProfileTitle>
        <MenuWrapper>
          {category.map((v, i) => (
            <Pill
              catNum={categoryNum}
              key={"catNum" + i}
              onClick={() => {
                scrollToPill();
                setTimeout(() => {
                  navigate(`/profile/${i}`);
                }, 0);
              }}
            >
              {v}
            </Pill>
          ))}
        </MenuWrapper>

        {categoryNum === 0 && (
          <ContentWrapper>
            <ContentBox width={500} padding={30}>
              <ProfilePicWrapper>
                {user?.profilePic ? (
                  <ProfilePic
                    width={100}
                    alt="userProfilePic"
                    src={`${user?.profilePic}`}
                    onError={(e) => {
                      e.currentTarget.src = `/img/defaultProfilePic.png`;
                    }}
                  />
                ) : (
                  <ProfilePic
                    width={100}
                    alt="userProfilePic"
                    src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                  />
                )}

                <Button
                  color="inherit"
                  onClick={() => {
                    const url = document.URL + "/modal";
                    history.pushState({ page: "modal" }, "", url);
                    setImageChangeModal((c) => !c);
                  }}
                >
                  <EditIcon />
                </Button>
              </ProfilePicWrapper>

              <InfoAttribute>
                <InfoTitle>
                  <span>닉네임</span>
                  <Button
                    color="inherit"
                    onClick={() => {
                      setNicknameInputToggle((c) => !c);
                    }}
                  >
                    <EditIcon />
                  </Button>
                </InfoTitle>

                {nicknameInputToggle || (
                  <InfoValue>
                    <span>{user?.nickname}</span>
                  </InfoValue>
                )}
                {nicknameInputToggle && (
                  <InfoValue>
                    <div>
                      <input
                        placeholder="닉네임 입력..."
                        value={nickname}
                        onChange={(e) => {
                          setNickname(e.target.value);
                        }}
                      />
                      <Button onClick={() => nickUpdateConfirm(nickname)}>
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          setNicknameInputToggle((c) => !c);
                        }}
                      >
                        <CancelIcon color="error" />
                      </Button>
                    </div>
                  </InfoValue>
                )}
              </InfoAttribute>

              <InfoAttribute>
                <InfoTitle>
                  <span>이메일</span>
                </InfoTitle>
                <InfoValue>
                  <span>{user?.email}</span>
                </InfoValue>
              </InfoAttribute>

              <InfoAttribute>
                <InfoTitle>
                  <span>상태 메세지</span>
                  <Button
                    color="inherit"
                    onClick={() => {
                      setUsertextInputToggle((c) => !c);
                    }}
                  >
                    <EditIcon />
                  </Button>
                </InfoTitle>

                {usertextInputToggle || (
                  <InfoValue>
                    <span>{user?.usertext ? user?.usertext : "-"}</span>
                  </InfoValue>
                )}
                {usertextInputToggle && (
                  <InfoValue>
                    <div>
                      <input
                        placeholder="상태 메세지 입력..."
                        value={usertext}
                        onChange={(e) => {
                          setUsertext(e.target.value);
                        }}
                      />
                      <Button onClick={() => usertestUpdateConfirm()}>
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          setUsertextInputToggle((c) => !c);
                        }}
                      >
                        <CancelIcon color="error" />
                      </Button>
                    </div>
                  </InfoValue>
                )}
              </InfoAttribute>

              <ButtonWrapper>
                {user?.level === 1 && (
                  <Button
                    onClick={() => {
                      const url = document.URL + "/modal";
                      history.pushState({ page: "modal" }, "", url);
                      setPasswordChangeModal(true);
                    }}
                  >
                    <span>비밀번호 변경</span>
                  </Button>
                )}
                <Button
                  onClick={() => {
                    const url = document.URL + "/modal";
                    history.pushState({ page: "modal" }, "", url);
                    setUserDeleteModal(true);
                  }}
                >
                  <span>회원 탈퇴</span>
                </Button>

                <Button onClick={() => logoutConfirm()}>
                  <span>로그아웃</span>
                </Button>
              </ButtonWrapper>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 1 && (
          <ContentWrapper>
            <ContentBox width={500} padding={0}>
              <ListTitle>
                <Badge badgeContent={user?.Followings?.length} color="info" max={999} showZero>
                  <InsertEmoticonRoundedIcon fontSize="inherit" />
                </Badge>
                <div>Followings</div>
              </ListTitle>

              <List>
                {user?.Followings?.length === 0 ? (
                  <EmptyUserNoti>
                    <span>팔로잉 목록이 존재하지 않습니다.</span>
                  </EmptyUserNoti>
                ) : (
                  user?.Followings?.map((v: user, i: number) => (
                    <ListItem key={v.nickname + i}>
                      <div>
                        <Link to={`/userinfo/${v?.id}/cat/0`}>
                          {v.profilePic ? (
                            <ProfilePic width={32} alt="ProfilePic" src={`${v.profilePic}`} />
                          ) : (
                            <ProfilePic
                              width={32}
                              alt="defaultProfilePic"
                              src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                            />
                          )}
                        </Link>
                        <span>{v.nickname}</span>
                      </div>

                      <Button onClick={() => unFollowConfirm(v.id)}>
                        <PersonRemoveIcon color="error" />
                      </Button>
                    </ListItem>
                  ))
                )}
              </List>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 2 && (
          <ContentWrapper>
            <ContentBox width={500} padding={0}>
              <ListTitle>
                <Badge badgeContent={user?.Followers?.length} color="info" max={999} showZero>
                  <InsertEmoticonOutlinedIcon fontSize="inherit" />
                </Badge>
                <div>Followers</div>
              </ListTitle>

              <List>
                {user?.Followers?.length === 0 ? (
                  <EmptyUserNoti>
                    <span>팔로워 목록이 존재하지 않습니다.</span>
                  </EmptyUserNoti>
                ) : (
                  user?.Followers?.map((v: user, i: number) => (
                    <ListItem key={v.nickname + i}>
                      <div>
                        <Link to={`/userinfo/${v?.id}/cat/0`}>
                          {v.profilePic ? (
                            <ProfilePic width={32} alt="ProfilePic" src={`${v.profilePic}`} />
                          ) : (
                            <ProfilePic
                              width={32}
                              alt="ProfilePic"
                              src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                            />
                          )}
                        </Link>
                        <span>{v.nickname}</span>
                      </div>

                      <Button onClick={() => followerDeleteConfirm(v.id)}>
                        <RemoveCircleOutlinedIcon color="error" />
                      </Button>
                    </ListItem>
                  ))
                )}
              </List>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 3 && (
          <ContentWrapper>
            <Posts>
              {myInfoPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {myInfoPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  hasMore={myInfoPosts.hasNextPage || false}
                  loader={
                    <LoadingIconWrapper>
                      <CircularProgress size={96} color="inherit" />
                    </LoadingIconWrapper>
                  }
                  next={() => myInfoPosts.fetchNextPage()}
                  dataLength={myInfoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {myInfoPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
        {categoryNum === 4 && (
          <ContentWrapper>
            <Posts>
              {myCommPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {myCommPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  hasMore={myCommPosts.hasNextPage || false}
                  loader={
                    <LoadingIconWrapper>
                      <CircularProgress size={96} color="inherit" />
                    </LoadingIconWrapper>
                  }
                  next={() => myCommPosts.fetchNextPage()}
                  dataLength={myCommPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {myCommPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={"post" + i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
      </ProfileWrapper>
    </AppLayout>
  );
};

export default Profile;

const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  animation: ${Animation.smoothAppear} 1s ease-in-out;
`;
const LoadingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #f3e0f1;
  margin: 32px 0;
`;

const Pill = styled.button<{ catNum: number }>`
  transition: all ease-in-out 0.5s;
  height: 32px;
  margin-right: 12px;
  padding: 6px 20px;
  border-radius: 100px;
  border: solid 2px rgba(0, 0, 0, 0.05);

  font-weight: 500;
  font-size: 18px;

  cursor: pointer;

  display: flex;
  align-items: center;

  color: #464b53;
  background-color: #e3ecf9;
  &:nth-child(${(props) => props.catNum + 1}) {
    background-color: #f3e0f1;
  }

  @media (orientation: portrait) or (max-height: 480px) {
    margin-right: 8px;
    &:first-child {
      margin-left: 4vw;
    }
    &:last-child {
      margin-right: 4vw;
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    &:first-child {
      margin-left: 4px;
    }
    &:last-child {
      margin-right: 4px;
    }
  }
`;
const ProfileTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 500px;

  margin-top: 0px;
  padding-top: 64px;

  > span:nth-child(2) {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 24px;
    font-weight: 500;
  }
  > span:nth-child(3) {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.5);
    margin-top: 8px;
    margin-bottom: 12px;
    font-weight: 500;
  }

  @media (orientation: portrait) or (max-height: 480px) {
    margin-top: 48px; //header
    width: 100vw;
    > span {
      padding-left: 5vw;
    }
  }
  @media (orientation: landscape) and (max-height: 480px) {
    padding-top: 32px;
    margin-top: 0;
    width: 500px;
    span {
      padding-left: 0;
    }
  }
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 44px;
  line-height: 36px;
  color: rgba(0, 0, 0, 0.8);
  color: #cf9dc9;
  color: #bc9dcf;
  @media (orientation: portrait) or (max-height: 480px) {
    padding-left: 5vw;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    padding-left: 0;
  }
`;
const MenuWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: auto;
  width: 500px;

  position: sticky;
  top: 0px;

  padding: 36px 0;
  z-index: 85;
  /* background: rgb(255, 255, 255);
  background: linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(245, 245, 245, 1) 11%, rgba(245, 245, 245, 1) 100%); */
  background-color: #fff;

  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  @media (orientation: portrait) or (max-height: 480px) {
    top: 48px;
    width: 100%;
    /* background: rgb(255, 255, 255);
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(200, 218, 243, 1) 11%,
      rgba(200, 218, 243, 1) 100%
    ); */
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 500px;
    top: 0px;
    padding: 18px 0;
  }
`;
const ContentWrapper = styled.div`
  animation: ${Animation.smoothAppear} 1s ease-in-out;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  width: 100%;
  //header : 48px
  //pill wrapper : 104px
  min-height: calc(100vh - 104px);

  @media (orientation: portrait) or (max-height: 480px) {
    //haeder height : 48px
    //pill wrapper : 104px
    min-height: calc(100vh - 48px - 104px);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 60vw;
  }
`;
const ContentBox = styled.div<{ width: number; padding: number }>`
  width: ${(props) => props.width + "px"};
  border-radius: 6px;
  min-height: calc(100vh - 104px - 24px);
  padding: 40px ${(props) => props.padding + "px"};

  /* box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); */
  background-color: rgba(0, 0, 0, 0.02);
  background-color: #fafafa;
  border: 2px rgba(0, 0, 0, 0.07) solid;

  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  * {
    flex-shrink: 0;
  }
  button {
    color: #aaa7d4;
  }
  @media (orientation: portrait) or (max-height: 480px) {
    transition: all ease-in-out 0.3s;
    width: 92vw;
    padding: 20px ${(props) => props.padding + "px"};
    //header : 48px
    //pill wrapper : 104px
    min-height: calc(var(--vh, 1vh) * 100 - 48px - 104px - 24px);
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 500px;
    min-height: 400px;
    margin-bottom: 32px;
  }
`;

const EmptyNoti = styled.div`
  width: 100%;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 72px;
  color: rgba(0, 0, 0, 0.5);
  /* font-weight: 600; */
  span {
    margin-top: 20px;
    font-size: 24px;
  }
`;
const EmptyUserNoti = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 48px;
  color: rgba(0, 0, 0, 0.5);
  /* font-weight: 600; */
  span {
    margin-top: 20px;
    font-size: 18px;
  }
`;

const ListTitle = styled.div`
  font-size: 60px;
  color: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div {
    margin-top: 5px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
  @media (orientation: portrait) or (max-height: 480px) {
    font-size: 40px;
    > div {
      font-size: 18px;
    }
  }
`;
const ButtonWrapper = styled.div`
  span {
    font-weight: 500;
  }
`;
const List = styled.div`
  padding: 20px 0;
  width: 80%;
  height: 50%;

  flex-grow: 1;
  -webkit-box-flex: 1;

  overflow-y: scroll;
`;
const ListItem = styled.div`
  width: 100%;
  padding: 5px 5px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      margin-left: 10px;
      font-weight: 500;
    }
  }
  > button {
    min-width: 0;
  }
`;

const ProfilePic = styled.img<{ width: number }>`
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.width + "px"};
  border-radius: ${(props) => props.width + "px"};

  object-fit: cover;
  background-color: #fff;

  /* box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2); */
  border: 2px solid rgba(0, 0, 0, 0.15);
  /* margin-right: 12px; */
`;

const InfoAttribute = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  margin-bottom: 24px;
`;
const InfoTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    font-size: 1.5em;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 500;
  }
`;
const InfoValue = styled.div`
  display: -webkit-box;
  display: flex;
  align-items: center;
  width: 100%;
  /* padding: 10px 0px; */
  /* height: 36px;
  line-height: 36px; */
  margin-top: 8px;
  line-height: 32px;

  input {
    width: 50%;
    flex-grow: 1;
    -webkit-box-flex: 1;

    border: none;
    outline-style: none;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0);
  }
  input::placeholder {
    font-size: 16px;
  }
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border: 2px solid #aaa7d4;
    border-radius: 32px;
    padding: 0 10px;
    padding-right: 0;
    > button {
      min-width: 0;
      border-radius: 100px;
      padding: 6px;
      &:last-child {
        padding-left: 0px;
      }
    }
  }
  > span {
    color: rgba(0, 0, 0, 0.6);

    width: 100%;

    font-size: 18px;
    white-space: nowrap;
    overflow: auto;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera*/
    }
  }
`;

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  padding-top: 4px;

  width: 100%;
  height: auto;
  * {
    flex-shrink: 0;
  }
`;
const ProfilePicWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 10px;
  padding-bottom: 30px;

  overflow: auto;
  * {
    flex-shrink: 0;
  }
`;
