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
  nickname: boolean;
  usertext: boolean;
}

const Profile = () => {
  const queryClient = useQueryClient();
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const navigate = useNavigate();

  //state
  const [toggles, setToggles] = useState<Toggles>({ nickname: false, usertext: false });
  const [isImagePopupOpen, setImagePopupOpen] = useState<boolean>(false);
  const { cat } = useParams();
  const mainCat = cat ? parseInt(cat) : 0;
  const [subCat, setSubCat] = useState<number>(0);

  useEffect(() => {
    if (mainCat < 0 || mainCat >= 3) {
      navigate("/404");
    }
  }, [mainCat]);

  //input state
  const [nickname, setNickname] = useState<string>("");
  const [usertext, setUsertext] = useState<string>("");

  //useQuery, useInfiniteQuery
  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;

  const likedPosts = useInfiniteQuery(
    ["likedPosts"],
    ({ pageParam = 1 }) =>
      Axios.get("post/liked", { params: { type: 0, pageParam, tempDataNum: 5 } }).then((res) => res.data),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === 0 ? undefined : allPages.length + 1;
      }
    }
  );
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

  return (
    <AppLayout>
      <>
        {isImagePopupOpen && <ProfileChangePopup setImagePopupOpen={setImagePopupOpen} />}
        <MainCat selectedMenu={mainCat}>
          <Button>
            <Link to="/profile/0">나의 정보</Link>
          </Button>
          <Button>
            <Link to="/profile/1">관계</Link>
          </Button>
          <Button>
            <Link to="/profile/2">모아보기</Link>
          </Button>
        </MainCat>
        {mainCat === 0 && (
          <ContentArea>
            <ContentBox width={500} padding={30}>
              <ProfilePicWrapper>
                {user?.profilePic ? (
                  <ProfilePic width={150} alt="userProfilePic" src={`${BACK_SERVER}/${user?.profilePic}`} />
                ) : (
                  <ProfilePic
                    width={150}
                    alt="userProfilePic"
                    src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`}
                  />
                )}

                <Button
                  color="inherit"
                  onClick={() => {
                    setImagePopupOpen(true);
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
                      const temp = { ...toggles };
                      temp.nickname = !temp.nickname;
                      setToggles(temp);
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
                          if (nickname.length > 11 || nickname.length < 2) {
                            toast.warning("닉네임은 2자 이상 10자 이하, 영어 또는 숫자 또는 한글로 가능합니다.");
                          } else editNickname.mutate({ nickname });
                        }}
                      >
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          const temp = { ...toggles };
                          temp.nickname = !temp.nickname;
                          setToggles(temp);
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
                      const temp = { ...toggles };
                      temp.usertext = !temp.usertext;
                      setToggles(temp);
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
                          } else editUsertext.mutate({ usertext });
                        }}
                      >
                        <CheckCircleIcon />
                      </Button>
                      <Button
                        onClick={() => {
                          const temp = { ...toggles };
                          temp.usertext = !temp.usertext;
                          setToggles(temp);
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
                          label: "확인",
                          onClick: () => logout.mutate()
                        },
                        {
                          label: "취소",
                          onClick: () => console.log("로그아웃 취소")
                        }
                      ]
                    });
                  }}
                >
                  로그아웃
                </Button>
              </ButtonWrapper>
            </ContentBox>
          </ContentArea>
        )}
        {mainCat === 1 && (
          <ContentArea>
            <ContentBox width={700} padding={0}>
              <RowBox>
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
                              // const isDelete = confirm("언팔로우 하시겠습니까?");
                              // if (isDelete) unFollow.mutate({ userId: v.id });

                              confirmAlert({
                                // title: "",
                                message: "언팔로우 하시겠습니까?",
                                buttons: [
                                  {
                                    label: "확인",
                                    onClick: () => unFollow.mutate({ userId: v.id })
                                  },
                                  {
                                    label: "취소",
                                    onClick: () => console.log("취소")
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
              </RowBox>
            </ContentBox>
          </ContentArea>
        )}
        {mainCat === 2 && (
          <ContentArea>
            <SubCat myPostType={subCat + 1}>
              <Button
                onClick={() => {
                  setSubCat(0);
                }}
              >
                <span>작성 공고</span>
              </Button>
              <Button
                onClick={() => {
                  setSubCat(1);
                }}
              >
                <span>작성 소통</span>
              </Button>
              <Button
                onClick={() => {
                  setSubCat(2);
                }}
              >
                <span>관심 공고</span>
              </Button>
            </SubCat>
            <Posts id="profileScrollWrapper">
              {subCat === 0 && myInfoPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {subCat === 0 && myInfoPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  scrollableTarget="profileScrollWrapper"
                  hasMore={myInfoPosts.hasNextPage || false}
                  loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
                  next={() => myInfoPosts.fetchNextPage()}
                  dataLength={myInfoPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {myInfoPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}

              {subCat === 1 && myCommPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {subCat === 1 && myCommPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  scrollableTarget="profileScrollWrapper"
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

              {subCat === 2 && likedPosts?.data?.pages[0].length === 0 && (
                <EmptyNoti>
                  <SentimentVeryDissatisfiedIcon fontSize="inherit" />
                  <span>게시글이 존재하지 않습니다.</span>
                </EmptyNoti>
              )}
              {subCat === 2 && likedPosts?.data?.pages[0].length !== 0 && (
                <InfiniteScroll
                  scrollableTarget="profileScrollWrapper"
                  hasMore={likedPosts.hasNextPage || false}
                  loader={<img src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt="loading" />}
                  next={() => likedPosts.fetchNextPage()}
                  dataLength={likedPosts.data?.pages.reduce((total, page) => total + page.length, 0) || 0}
                >
                  {likedPosts?.data?.pages.map((p) =>
                    p.map((v: postProps, i: number) => <Post key={i} postProps={v} />)
                  )}
                </InfiniteScroll>
              )}
            </Posts>
          </ContentArea>
        )}
      </>
    </AppLayout>
  );
};

export default Profile;

const EmptyNoti = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-size: 72px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
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
  font-weight: 600;
  span {
    margin-top: 20px;
    font-size: 18px;
  }
`;

const SubCat = styled.div<{ myPostType: number }>`
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    padding: 0px 16px;
    border-radius: 20px;
    margin: 5px;
    flex-shrink: 0;

    font-size: 18px;
    font-weight: 600;
    background-color: #a9a7d4;
    /* color: rgba(0, 0, 0, 0.5); */
    color: white;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
    text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.2);
  }
  button:nth-child(${(props) => props.myPostType}) {
    /* color: rgba(0, 0, 0, 0.4); */
    /* text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2); */
    background-color: #d4a7be;
    /* background-color: #f6f5ff; */
  }
  @media screen and (max-width: 720px) {
    height: 60px;
    /* color: white; */
    /* margin-top: 30px; */
    button {
      font-size: 1em;
    }
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
    font-weight: 600;
    color: rgba(0, 0, 0, 0.7);
  }
  @media screen and (max-width: 720px) {
    font-size: 40px;
    > div {
      font-size: 18px;
    }
  }
`;
const ButtonWrapper = styled.div`
  button {
    font-weight: 600;
  }
`;
const List = styled.div`
  padding: 20px;
  width: 100%;
  height: 0;
  flex-grow: 1;

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
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  &:first-child {
    border-right: solid 2px rgba(0, 0, 0, 0.05);
  }
  @media screen and (max-width: 720px) {
    width: 90%;
    height: 45%;
    &:first-child {
      border: none;
      border-bottom: solid 2px rgba(0, 0, 0, 0.05);
    }
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
const ContentBox = styled.div<{ width: number; padding: number }>`
  width: ${(props) => props.width + "px"};
  height: 650px;
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
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);

    /* box-shadow: none; */
  }
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
    font-weight: 600;
  }
`;
const InfoValue = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 0px;
  height: 36px;
  margin-top: 8px;

  input {
    flex-grow: 1;
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

const MainCat = styled.div<{ selectedMenu: number }>`
  display: flex;
  justify-content: center;
  align-items: end;
  height: 100px;
  width: 100%;
  overflow-x: scroll;
  * {
    flex-shrink: 0;
  }
  button {
    text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
    font-size: 1.6em;
    font-weight: 600;
    color: grey;

    padding: 10px;
  }
  button:nth-child(${(props) => props.selectedMenu + 1}) {
    color: #aaa7d4;
  }
  @media screen and (max-width: 720px) {
    height: 130px;
    button {
      font-size: 1.3em;
    }
  }
`;
const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: #4f4f4f;

  width: 100%;
  height: calc(100vh - 100px);

  @media screen and (max-width: 720px) {
    height: calc(100vh - 130px);
  }
`;
const Posts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  padding-top: 4px;

  width: 100%;
  height: calc(100vh - 170px);
  @media screen and (max-width: 720px) {
    height: calc(100vh - 190px);
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }

  overflow: auto;
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
const RowBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 720px) {
    justify-content: space-around;
    flex-direction: column;
  }
`;
