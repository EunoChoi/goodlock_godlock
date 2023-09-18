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

  const PostInputHelpText = ["공지사항 입력 설명", "모집 공고 입력 설명", "소통글 입력 설명"];
  const placeholders = ["공지사항 입력", "모집 공고 입력", "소통글 입력"];
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  const [optionToggle, setOptionToggle] = useState<number>(0);
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [link, setLink] = useState<string>("");
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
        if (window.location.pathname.split("/")[2] === "0") queryClient.invalidateQueries(["noticePosts"]);
        if (window.location.pathname.split("/")[2] === "1") queryClient.invalidateQueries(["infoPosts"]);
        if (window.location.pathname.split("/")[2] === "2") queryClient.invalidateQueries(["communityPosts"]);
        if (window.location.pathname.split("/")[1] === "userinfo") {
          queryClient.invalidateQueries(["userLikedPosts"]);
          queryClient.invalidateQueries(["userInfoPosts"]);
          queryClient.invalidateQueries(["userCommPosts"]);
        }
        queryClient.invalidateQueries(["likedPosts"]);
        queryClient.invalidateQueries(["myCommPosts"]);
        queryClient.invalidateQueries(["myInfoPosts"]);

        queryClient.invalidateQueries(["todayinfo"]);

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

  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFormData = new FormData();
      Array.from(e.target.files).forEach((file) => {
        imageFormData.append("image", file);
      });
      Axios.post("post/images", imageFormData).then((res) => setImages([...images, ...res.data]));
    }
  };

  console.log(link);

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
      {isMobile || <PostInputHelp>{PostInputHelpText[inputType]}</PostInputHelp>}
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
                  <CustomDatePicker
                    locale={ko}
                    dateFormat="yy년 MM월 dd일"
                    selectsStart
                    selected={start}
                    startDate={start}
                    endDate={end}
                    onChange={(date: Date) => setStart(date)}
                  />
                  <MoreHorizIcon />
                  <CustomDatePicker
                    locale={ko}
                    dateFormat="yy년 MM월 dd일"
                    selectsEnd
                    selected={end}
                    startDate={start}
                    endDate={end}
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
          placeholder={placeholders[inputType]}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        ></InputForm.TextArea>
        {images.length > 0 && (
          <InputForm.InputImageWrapper>
            {images.map((v, i) => (
              <InputForm.InputImageBox key={i}>
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
                if (content.length < 8 || content.length > 2200) {
                  toast.warning("게시글은 최소 8자 최대 2200자 작성이 가능합니다.");
                } else addPost.mutate({ content, images, type: inputType, start, end, link });
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

const CustomDatePicker = styled(DatePicker)`
  font-size: 16px;
  width: 100%;
  height: 32px;
  border: 2px solid #cbdbf3;
  border-radius: 8px;
  outline: none;

  text-align: center;
`;
const PostOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  width: 100%;
  height: 130px;
  padding: 0 40px;

  @media screen and (max-width: 720px) {
    padding: 0 20px;
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
