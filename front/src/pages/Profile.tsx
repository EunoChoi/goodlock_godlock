import React, { useEffect, useState } from "react";
import styled from "styled-components/macro";
import Axios from "../apis/Axios";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";
import { confirmAlert } from "react-confirm-alert";

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
interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}
interface Toggles {
  image: boolean;
  nickname: boolean;
  usertext: boolean;
}

const Profile = () => {
  const queryClient = useQueryClient();
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const navigate = useNavigate();

  //state
  const [toggles, setToggles] = useState<Toggles>({ image: false, nickname: false, usertext: false });
  const params = useParams();
  const categoryNum = params.cat ? parseInt(params.cat) : -1;

  useEffect(() => {
    if (categoryNum < 0 || categoryNum >= 5) {
      navigate("/404");
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [categoryNum]);

  //input state
  const [nickname, setNickname] = useState<string>("");
  const [usertext, setUsertext] = useState<string>("");

  //useQuery, useInfiniteQuery
  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

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
  const logout = useMutation(() => Axios.get("user/logout"), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const editNickname = useMutation((data: { nickname: string }) => Axios.patch("user/edit/nickname", data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("닉네임 변경이 완료되었습니다.");
      // alert("닉네임 변경이 완료되었습니다.");

      const temp = { ...toggles };
      temp.nickname = false;
      setToggles(temp);
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const editUsertext = useMutation((data: { usertext: string }) => Axios.patch("user/edit/usertext", data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("상태메세지 변경이 완료되었습니다.");
      // alert("상태메세지 변경이 완료되었습니다.");

      const temp = { ...toggles };
      temp.usertext = false;
      setToggles(temp);
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });
  const unFollow = useMutation((data: { userId: number }) => Axios.delete(`user/${data.userId}/follow`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });

  const category = ["정보", "팔로잉", "팔로워", "내 모집공고", "내 소통글"];

  return (
    <AppLayout>
      <>
        {toggles.image && <ProfileChangePopup setToggles={setToggles} />}
        <ProfileTitle>
          <Nickname>마이 페이지</Nickname>
          <span>내 정보 수정 및 작성 글 확인이 가능합니다.</span>
          <MenuWrapper>
            {category.map((v, i) => (
              <Pill catNum={categoryNum} key={"catNum" + i} onClick={() => navigate(`/profile/${i}`)}>
                {v}
              </Pill>
            ))}
          </MenuWrapper>
        </ProfileTitle>

        {categoryNum === 0 && (
          <ContentWrapper>
            <ContentBox width={500} padding={30}>
              <ProfilePicWrapper>
                {user?.profilePic ? (
                  <ProfilePic width={100} alt="userProfilePic" src={`${BACK_SERVER}/${user?.profilePic}`} />
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
                    setToggles({ nickname: false, usertext: false, image: !toggles.image });
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
                      setToggles({ nickname: !toggles.nickname, usertext: false, image: false });
                    }}
                  >
                    <EditIcon />
                  </Button>
                </InfoTitle>

                {toggles.nickname || (
                  <InfoValue>
                    <span>{user?.nickname}</span>
                  </InfoValue>
                )}
                {toggles.nickname && (
                  <InfoValue>
                    <div>
                      <input
                        placeholder="닉네임 입력..."
                        value={nickname}
                        onChange={(e) => {
                          setNickname(e.target.value);
                        }}
                      />
                      <Button
                        onClick={() => {
                          console.log();
                          if (nickname.split(" ").length >= 2) {
                            toast.warning("닉네임에 공백이 포함될 수 없습니다.");
                          } else if (nickname.length > 11 || nickname.length < 2) {
                            toast.warning("닉네임은 2자 이상 10자 이하, 영어 또는 숫자 또는 한글로 가능합니다.");
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
                                  onClick: () => editNickname.mutate({ nickname })
                                }
                              ]
                            });
                          }
                        }}
                      >
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          setToggles({ nickname: !toggles.nickname, usertext: false, image: false });
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
                      setToggles({ usertext: !toggles.usertext, nickname: false, image: false });
                    }}
                  >
                    <EditIcon />
                  </Button>
                </InfoTitle>

                {toggles.usertext || (
                  <InfoValue>
                    <span>{user?.usertext ? user?.usertext : "-"}</span>
                  </InfoValue>
                )}
                {toggles.usertext && (
                  <InfoValue>
                    <div>
                      <input
                        placeholder="상태 메세지 입력..."
                        value={usertext}
                        onChange={(e) => {
                          setUsertext(e.target.value);
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (usertext.length > 30) {
                            toast.warning("상태메세지는 최대 30자까지 가능합니다.");
                          } else {
                            confirmAlert({
                              // title: "",
                              message: "상태메시지를 변경하시겠습니까?",
                              buttons: [
                                {
                                  label: "취소",
                                  onClick: () => console.log("상태메세지 변경 취소")
                                },
                                {
                                  label: "확인",
                                  onClick: () => editUsertext.mutate({ usertext })
                                }
                              ]
                            });
                          }
                        }}
                      >
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          setToggles({ usertext: !toggles.usertext, nickname: false, image: false });
                        }}
                      >
                        <CancelIcon color="error" />
                      </Button>
                    </div>
                  </InfoValue>
                )}
              </InfoAttribute>

              <ButtonWrapper>
                <Button
                  onClick={() => {
                    toast.warning("구현 예정");
                    // const password = prompt("현재 사용중인 비밀번호를 입력해주세요.");
                  }}
                >
                  비밀번호 변경
                </Button>
                <Button
                  onClick={() => {
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
                  }}
                >
                  로그아웃
                </Button>
              </ButtonWrapper>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 1 && (
          <ContentWrapper>
            <ContentBox width={500} padding={0}>
              <ListWrapper>
                <ListTitle>
                  <Badge badgeContent={user?.Followings?.length} color="info" max={999} showZero>
                    <InsertEmoticonRoundedIcon fontSize="inherit" />
                  </Badge>
                  <div>팔로잉</div>
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
                              <ProfilePic width={32} alt="ProfilePic" src={`${BACK_SERVER}/${v.profilePic}`} />
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

                        <Button
                          onClick={() => {
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
                                  onClick: () => unFollow.mutate({ userId: v.id })
                                }
                              ]
                            });
                          }}
                        >
                          <PersonRemoveIcon color="error" />
                        </Button>
                      </ListItem>
                    ))
                  )}
                </List>
              </ListWrapper>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 2 && (
          <ContentWrapper>
            <ContentBox width={500} padding={0}>
              <ListWrapper>
                <ListTitle>
                  <Badge badgeContent={user?.Followers?.length} color="info" max={999} showZero>
                    <InsertEmoticonOutlinedIcon fontSize="inherit" />
                  </Badge>
                  <div>팔로워</div>
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
                              <ProfilePic width={32} alt="ProfilePic" src={`${BACK_SERVER}/${v.profilePic}`} />
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

                        <Button onClick={() => toast.error("구현 예정")}>
                          <RemoveCircleOutlinedIcon color="error" />
                        </Button>
                      </ListItem>
                    ))
                  )}
                </List>
              </ListWrapper>
            </ContentBox>
          </ContentWrapper>
        )}
        {categoryNum === 3 && (
          <ContentWrapper>
            <Posts id="profileScrollWrapper">
              {myInfoPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {myInfoPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  // scrollableTarget="profileScrollWrapper"
                  hasMore={myInfoPosts.hasNextPage || false}
                  loader={
                    <LoadingIcon>
                      <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`} alt="loading" />
                    </LoadingIcon>
                  }
                  next={() => myInfoPosts.fetchNextPage()}
                  dataLength={myInfoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {myInfoPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
        {categoryNum === 4 && (
          <ContentWrapper>
            <Posts id="profileScrollWrapper">
              {myCommPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {myCommPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  // scrollableTarget="profileScrollWrapper"
                  hasMore={myCommPosts.hasNextPage || false}
                  // loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
                  loader="로딩"
                  next={() => myCommPosts.fetchNextPage()}
                  dataLength={myCommPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {myCommPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentWrapper>
        )}
      </>
    </AppLayout>
  );
};

export default Profile;

const Pill = styled.div<{ catNum: number }>`
  transition: all ease-in-out 0.5s;
  height: 32px;
  margin-right: 12px;
  padding: 6px 20px;
  border-radius: 100px;

  font-size: 18px;

  cursor: pointer;

  display: flex;
  align-items: center;

  color: #464b53;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);

  background-color: #e0d9eb;
  &:nth-child(${(props) => props.catNum + 1}) {
    background-color: #d5dbf1;
  }

  @media screen and (max-width: 720px) {
    margin-right: 8px;
    &:first-child {
      margin-left: 4vw;
    }
    &:last-child {
      margin-right: 4vw;
    }

    background-color: white;
    &:nth-child(${(props) => props.catNum + 1}) {
      background-color: #f2e1f6;
    }
  }
`;
const ProfileTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 500px;

  padding-top: 64px;
  padding-bottom: 20px;

  span:nth-child(2) {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.5);
    margin: 24px 0;
  }

  @media screen and (max-width: 720px) {
    width: 100vw;
    > span {
      padding-left: 4vw;
    }
  }
`;
const Nickname = styled.div`
  font-size: 32px;
  line-height: 36px;
  color: rgba(0, 0, 0, 0.8);
  @media screen and (max-width: 720px) {
    padding-left: 4vw;
  }
`;
const MenuWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  height: auto;
  width: 100%;

  position: sticky;
  top: 36px;

  padding: 4px 2px;

  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
`;
const ContentWrapper = styled.div`
  animation: ${Animation.smoothAppear} 0.7s;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: auto;
`;
const ContentBox = styled.div<{ width: number; padding: number }>`
  width: ${(props) => props.width + "px"};
  height: 550px;
  padding: 40px ${(props) => props.padding + "px"};
  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  * {
    flex-shrink: 0;
  }
  button {
    color: #aaa7d4;
  }
  @media screen and (max-width: 720px) {
    width: 92vw;
    padding: 20px ${(props) => props.padding + "px"};
    /* background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px); */
  }
`;
const LoadingIcon = styled.div`
  display: flex;
  justify-content: center;
`;

const EmptyNoti = styled.div`
  width: 100%;
  height: 100%;
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
    /* font-weight: 600; */
    color: rgba(0, 0, 0, 0.7);
  }
  @media screen and (max-width: 720px) {
    font-size: 40px;
    > div {
      font-size: 18px;
    }
  }
`;
const ButtonWrapper = styled.div``;
const List = styled.div`
  padding: 20px;
  width: 100%;
  height: 0;

  flex-grow: 1;
  -webkit-box-flex: 1;

  overflow-y: scroll;
`;
const ListItem = styled.div`
  width: 100%;
  padding: 5px 0px;
  font-size: 18px;
  color: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      margin-left: 10px;
    }
  }
  > button {
    min-width: 0;
  }
`;
const ListWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  @media screen and (max-width: 720px) {
    width: 90%;
    height: 95%;
  }
`;
const ProfilePic = styled.img<{ width: number }>`
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.width + "px"};
  border-radius: ${(props) => props.width + "px"};

  object-fit: cover;
  background-color: #fff;

  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  /* margin-right: 12px; */
`;

const InfoAttribute = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  margin-bottom: 30px;
`;
const InfoTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  > span {
    font-size: 1.5em;
    color: rgba(0, 0, 0, 0.8);
    /* font-weight: 600; */
  }
`;
const InfoValue = styled.div`
  display: -webkit-box;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0px;
  height: 36px;
  line-height: 36px;
  margin-top: 8px;

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
  > div {
    animation: ${Animation.smoothAppear} 0.7s;
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
