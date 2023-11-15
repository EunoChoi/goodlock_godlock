import React, { useEffect, useRef, useState } from "react";
import InputForm from "../../styles/InputForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "../../apis/Axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";

//mui
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface props {
  setIsPostInputOpen: (b: boolean) => void;
}
interface postDataType {
  type: number;
  content: string;
  images: string[];
  start: Date;
  end: Date;
  link: string;
}

const InputPopup = ({ setIsPostInputOpen }: props) => {
  const queryClient = useQueryClient();
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;
  const params = useParams();
  const inputType = params.type ? parseInt(params.type) : 0;
  const isMobile = useMediaQuery({ maxWidth: 720 });

  const placeholders = ["공지사항 입력", "팁&설정 입력", "소통글 입력"];
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  const [optionToggle, setOptionToggle] = useState<number>(0);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [link, setLink] = useState<string>("https://");
  const isInfoPost =
    window.location.pathname.split("/")[2] === "1" && window.location.pathname.split("/")[1] === "main";

  const imageInput = useRef<HTMLInputElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addPost = useMutation(
    (data: postDataType) => {
      return Axios.post<postDataType>("/post", data);
    },
    {
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

        setIsPostInputOpen(false);
        toast.success("게시글 등록이 완료되었습니다.");
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      },
      onError: () => {
        toast.warning("글 등록 중 에러 발생!!");
        // alert("글 등록 중 에러 발생!!");
      }
    }
  );

  const uploadImages = useMutation(
    (images: any) => {
      return Axios.post("post/images", images);
      // return Axios.post("post/images", images).then((res) => setImages([...images, ...res.data]));
    },
    {
      onSuccess: (res) => {
        console.log(res.data);
        setImages([...images, ...res.data]);
      }
      // onError: () => { }
    }
  );

  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0].size);
      const imageFormData = new FormData();

      //게시글 최대 이미지 개수 제한
      if (images.length + e.target.files.length > 10) {
        toast.error("이미지 파일은 최대 10개까지 삽입 가능합니다.");
        return null;
      }

      //개별 이미지 크기 제한
      const isOverSize = Array.from(e.target.files).find((file) => {
        if (file.size <= 5 * 1024 * 1024) {
          imageFormData.append("image", file);
        } else {
          return true;
        }
      });

      if (isOverSize) {
        toast.error("선택된 이미지 중 5MB를 초과하는 이미지가 존재합니다.");
        return null;
      }

      uploadImages.mutate(imageFormData);
      // Axios.post("post/images", imageFormData).then((res) => setImages([...images, ...res.data]));
    }
  };

  return (
    <InputForm.InputBG
      onClick={() => {
        confirmAlert({
          // title: "",
          message: "게시글 작성을 중단하시겠습니까?",
          buttons: [
            {
              label: "취소",
              onClick: () => console.log("취소")
            },
            {
              label: "확인",
              onClick: () => setIsPostInputOpen(false)
            }
          ]
        });
      }}
    >
      {/* {isMobile || <PostInputHelp>{PostInputHelpText[inputType]}</PostInputHelp>} */}
      <InputForm.InputWrapper onClick={(e) => e.stopPropagation()}>
        {isInfoPost && (
          <PostOptionWrapper>
            <div>
              <button onClick={() => setOptionToggle(0)}>
                <CalendarMonthIcon />
                공유 기간
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
                    placeholder="https://www.url.com"
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
          placeholder={placeholders[inputType]}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        ></InputForm.TextArea>

        {(images.length > 0 || uploadImages.isLoading) && (
          <InputForm.InputImageWrapper>
            {images.map((v, i) => (
              <InputForm.InputImageBox key={i}>
                <InputForm.InputImage
                  src={`${v}`}
                  alt={v}
                  onError={(e) => {
                    e.currentTarget.src = `${v?.replace(/\/thumb\//, "/original/")}`;
                  }}
                ></InputForm.InputImage>
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
            {uploadImages.isLoading && <img src={`${process.env.PUBLIC_URL}/img/loading2.gif`}></img>}
          </InputForm.InputImageWrapper>
        )}
        <InputForm.ButtonArea>
          <input ref={imageInput} type="file" accept="image/*" name="image" multiple hidden onChange={onChangeImages} />
          <FlexButton
            onClick={() => {
              confirmAlert({
                // title: "",
                message: "게시글 작성을 중단하시겠습니까?",
                buttons: [
                  {
                    label: "취소",
                    onClick: () => console.log("취소")
                  },
                  {
                    label: "확인",
                    onClick: () => setIsPostInputOpen(false)
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

                  addPost.mutate({
                    content,
                    images,
                    type: inputType,
                    start: new Date(startY, startM, startD, 0, 0, 0),
                    end: new Date(endY, endM, endD, 0, 0, 0),
                    link
                  });
                }
              }}
            >
              <PostAddIcon />
              <span>등록</span>
            </FlexButton>
          </ButtonWrapper>
        </InputForm.ButtonArea>
      </InputForm.InputWrapper>
    </InputForm.InputBG>
  );
};

export default InputPopup;

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
