import React, { useEffect, useRef, useState } from "react";
import InputForm from "../../styles/InputForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "../../apis/Axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import Animation from "../../styles/Animation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import styled from "styled-components/macro";
import { useMediaQuery } from "react-responsive";

//mui
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface serverImages {
  src: string;
}
interface serverPostData {
  type: number;
  id: number;
  content: string;
  images: serverImages[];
  start: Date;
  end: Date;
  link: string;
}
interface localPostData {
  type: number;
  id: number;
  content: string;
  images: string[];
  start: Date;
  end: Date;
  link: string;
}
interface props {
  setPostEdit: (b: boolean) => void;
  postProps: serverPostData;
}

interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

const PostEditPopup = ({ setPostEdit, postProps }: props) => {
  const queryClient = useQueryClient();
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const isMobile = useMediaQuery({ maxWidth: 720 });

  const PostInputHelpText = ["공지사항 입력 설명", "모집 공고 입력 설명", "소통글 입력 설명"];
  const placeholders = ["공지사항 입력", "모집 공고 입력", "소통글 입력"];
  const [content, setContent] = useState<string>(postProps.content);
  const [images, setImages] = useState<string[]>(postProps.images.map((v) => v.src));
  const imageInput = useRef<HTMLInputElement>(null);

  const [optionToggle, setOptionToggle] = useState<number>(0);
  console.log(postProps.start);
  const [start, setStart] = useState<Date>(new Date(postProps.start));
  const [end, setEnd] = useState<Date>(new Date(postProps.end));

  const [link, setLink] = useState<string>("");
  const isInfoPost = postProps.type === 1;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const editPost = useMutation((data: localPostData) => Axios.patch<localPostData>(`/post/${postProps.id}`, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["thisweek/end/liked"]);
      queryClient.invalidateQueries(["thisweek/new/1"]);
      queryClient.invalidateQueries(["thisweek/new/2"]);

      queryClient.invalidateQueries(["noticePosts"]);
      queryClient.invalidateQueries(["infoPosts"]);
      queryClient.invalidateQueries(["searchInfo"]);
      queryClient.invalidateQueries(["communityPosts"]);
      queryClient.invalidateQueries(["searchComm"]);
      queryClient.invalidateQueries(["activinfo"]);
      queryClient.invalidateQueries(["feed"]);

      queryClient.invalidateQueries(["userLikedPosts"]);
      queryClient.invalidateQueries(["userInfoPosts"]);
      queryClient.invalidateQueries(["userCommPosts"]);

      queryClient.invalidateQueries(["likedPosts"]);
      queryClient.invalidateQueries(["myCommPosts"]);
      queryClient.invalidateQueries(["myInfoPosts"]);
      setPostEdit(false);
      toast.success("게시글 수정이 완료되었습니다.");
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });

  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFormData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        imageFormData.append("image", file);
      });
      Axios.post("post/images", imageFormData).then((res) => {
        console.log(res.data);
        setImages([...images, ...res.data]);
      });
    }
  };

  return (
    <InputForm.EditBG
      onClick={() => {
        confirmAlert({
          // title: "",
          message: "게시글 수정을 중단하시겠습니까?",
          buttons: [
            {
              label: "취소",
              onClick: () => console.log("취소")
            },
            {
              label: "확인",
              onClick: () => setPostEdit(false)
            }
          ]
        });
      }}
    >
      {/* {isMobile || <PostInputHelp>{PostInputHelpText[postProps.type]}</PostInputHelp>} */}
      <InputForm.InputWrapper onClick={(e) => e.stopPropagation()}>
        {isInfoPost && (
          <PostOptionWrapper>
            <div>
              <button onClick={() => setOptionToggle(0)}>
                <CalendarMonthIcon />
                모집 기간
              </button>{" "}
              <button onClick={() => setOptionToggle(1)}>
                <InsertLinkIcon />
                링크
              </button>
            </div>

            {
              //start, end date
              optionToggle === 0 && (
                <div>
                  <DatePicker
                    calendarStartDay={1}
                    locale={ko}
                    dateFormat="yy년 MM월 dd일"
                    selectsStart
                    selected={start}
                    startDate={start}
                    endDate={end}
                    customInput={
                      <DateButton>
                        {start.getFullYear()}년 {start.getMonth() + 1}월 {start.getDate()}일
                      </DateButton>
                    }
                    onChange={(date: Date) => setStart(date)}
                  />
                  <MoreHorizIcon />
                  <DatePicker
                    calendarStartDay={1}
                    locale={ko}
                    dateFormat="yy년 MM월 dd일"
                    selectsEnd
                    selected={end}
                    startDate={start}
                    endDate={end}
                    customInput={
                      <DateButton>
                        {end.getFullYear()}년 {end.getMonth() + 1}월 {end.getDate()}일
                      </DateButton>
                    }
                    onChange={(date: Date) => setEnd(date)}
                  />
                </div>
              )
            }
            {
              //link
              optionToggle === 1 && (
                <div>
                  <input
                    placeholder="추가할 링크를 입력하세요"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  ></input>
                </div>
              )
            }
          </PostOptionWrapper>
        )}
        <InputForm.TextArea
          ref={inputRef}
          minLength={12}
          placeholder={placeholders[postProps.type]}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        ></InputForm.TextArea>
        {images?.length > 0 && (
          <InputForm.InputImageWrapper>
            {images.map((v, i) => (
              <InputForm.InputImageBox key={i + v}>
                <InputForm.InputImage src={`${BACK_SERVER}/${v}`} alt={v}></InputForm.InputImage>
                <InputForm.ImageDeleteButton
                  onClick={() => {
                    const tempImages = [...images];
                    tempImages.splice(i, 1);
                    setImages(tempImages);
                  }}
                >
                  <ColorIcon>
                    <DeleteForeverIcon />
                  </ColorIcon>
                </InputForm.ImageDeleteButton>
              </InputForm.InputImageBox>
            ))}
          </InputForm.InputImageWrapper>
        )}
        <InputForm.ButtonArea>
          <input ref={imageInput} type="file" accept="image/*" name="image" multiple hidden onChange={onChangeImages} />
          <FlexButton
            onClick={() => {
              confirmAlert({
                // title: "",
                message: "게시글 수정을 중단하시겠습니까?",
                buttons: [
                  {
                    label: "취소",
                    onClick: () => console.log("취소")
                  },
                  {
                    label: "확인",
                    onClick: () => setPostEdit(false)
                  }
                ]
              });
            }}
          >
            <CancelIcon />
            <span>취소</span>
          </FlexButton>
          <ButtonWrapper>
            <FlexButton onClick={() => imageInput.current?.click()}>
              <InsertPhotoIcon />
              <span>이미지 삽입</span>
            </FlexButton>
            <FlexButton
              onClick={() => {
                if (start > end) {
                  toast.warning("기간 설정이 잘못되었습니다.");
                } else if (content.length < 8 || content.length > 2200) {
                  toast.warning("게시글은 최소 8자 최대 2200자 작성이 가능합니다.");
                } else {
                  const startY = start.getFullYear();
                  const startM = start.getMonth();
                  const startD = start.getDate();

                  const endY = end.getFullYear();
                  const endM = end.getMonth();
                  const endD = end.getDate();

                  editPost.mutate({
                    content,
                    images,
                    type: postProps.type,
                    id: postProps.id,
                    start: new Date(startY, startM, startD, 0, 0, 0),
                    end: new Date(endY, endM, endD, 0, 0, 0),
                    link
                  });
                }
              }}
            >
              <PostAddIcon />
              <span>수정</span>
            </FlexButton>
          </ButtonWrapper>
        </InputForm.ButtonArea>
      </InputForm.InputWrapper>
    </InputForm.EditBG>
  );
};

export default PostEditPopup;

const DateButton = styled.button`
  font-size: 16px;
  width: 150px;
  height: 32px;
  border: 2px solid #cbdbf3;
  border-radius: 8px;
  outline: none;

  text-align: center;
  @media screen and (max-width: 720px) {
    width: calc((90vw - 40px - 24px) / 2);
  }
`;
const PostOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 130px;
  padding: 0 40px;
  padding-top: 40px;
  padding-bottom: 10px;

  @media screen and (max-width: 720px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  > div:first-child {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;

    button {
      display: flex;
      justify-content: center;
      align-items: center;

      font-size: 18px;
      color: rgba(0, 0, 0, 0.7);
      background-color: #cbdbf3;
      border-radius: 32px;
      padding: 4px 12px;
      margin-right: 8px;
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
      * {
        margin-right: 4px;
      }
    }
  }
  > div:nth-child(2) {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;

    input {
      font-size: 16px;
      width: 100%;

      height: 32px;
      border: 2px solid #cbdbf3;
      border-radius: 8px;
      outline: none;
      padding: 0 8px;

      &::placeholder {
        text-align: center;
      }
    }

    @media screen and (max-width: 720px) {
      justify-content: center;
    }
  }
`;

const PostInputHelp = styled.div`
  width: calc(100vw - 500px);
  height: 100vh;
  font-size: 1.7em;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5%;
`;

const FlexButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0px 8px;
  color: rgba(0, 0, 0, 0.7);
  /* font-weight: 600; */
  font-size: 1.1em;
  span {
    padding-left: 5px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColorIcon = styled.span`
  color: white;
`;
