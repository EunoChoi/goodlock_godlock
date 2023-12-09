import React, { useEffect, useRef, useState } from "react";
import InputForm from "../../styles/InputForm";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import styled from "styled-components/macro";

//mui
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Upload from "../../functions/reactQuery/Upload";
import Post from "../../functions/reactQuery/Post";
import Chip from "@mui/joy/Chip";
import ChipDelete from "@mui/joy/ChipDelete";
import Box from "@mui/joy/Box";
import CircularProgress from "@mui/material/CircularProgress";

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

interface props {
  modalClose: () => void;
  postProps: serverPostData;
}

const PostEditPopup = ({ modalClose, postProps }: props) => {
  const placeholders = ["공지사항 입력", "팁&설정 입력", "소통글 입력"];
  const [content, setContent] = useState<string>(postProps.content);
  const [images, setImages] = useState<string[]>(postProps.images.map((v) => v.src));
  const imageInput = useRef<HTMLInputElement>(null);

  const [postOptionToggle, setPostOptionToggle] = useState<number>(-1);
  const [start, setStart] = useState<Date | null>(postProps.start ? new Date(postProps.start) : null);
  const [end, setEnd] = useState<Date | null>(postProps.end ? new Date(postProps.end) : null);

  const [link, setLink] = useState<string>(postProps.link);
  const isInfoPost = postProps.type === 1;

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  //function
  const cancleConfirm = () => {
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
          onClick: () => modalClose()
        }
      ]
    });
  };
  const postEditSubmit = () => {
    //start, end 둘다 빈 경우
    if (start === null || end === null) {
      editPost.mutate(
        {
          id: postProps.id,
          data: {
            content,
            images,
            type: postProps.type,
            id: postProps.id,
            start: null,
            end: null,
            link
          }
        },
        {
          onSuccess: () => {
            modalClose();
          }
        }
      );
    } else if (start > end) {
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

      editPost.mutate(
        {
          id: postProps.id,
          data: {
            content,
            images,
            type: postProps.type,
            id: postProps.id,
            start: new Date(startY, startM, startD, 0, 0, 0),
            end: new Date(endY, endM, endD, 0, 0, 0),
            link
          }
        },
        {
          onSuccess: () => {
            modalClose();
          }
        }
      );
    }
  };

  //useMutation
  const editPost = Post.edit();
  const uploadImages = Upload.images();

  //로컬에서 이미지 에러 처리
  const onChangeImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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
      uploadImages.mutate(imageFormData, {
        onSuccess: (res) => {
          setImages([...images, ...res.data]);
        }
      });
    }
  };
  useEffect(() => console.log(images), [images]);

  return (
    <InputForm.EditBG onClick={() => cancleConfirm()}>
      <InputForm.InputWrapper onClick={(e) => e.stopPropagation()}>
        <PostOptionWrapper>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {isInfoPost && (
              <Chip
                sx={{
                  "--Chip-minHeight": "36px"
                }}
                startDecorator={<CalendarMonthIcon />}
                onClick={() => {
                  setPostOptionToggle(0);
                }}
                size="lg"
                variant="soft"
                color={postOptionToggle === 0 ? "primary" : "neutral"}
                endDecorator={
                  postOptionToggle === 0 ? (
                    <ChipDelete
                      onDelete={() => {
                        setStart(null);
                        setEnd(null);
                        setPostOptionToggle(-1);
                      }}
                    />
                  ) : (
                    <></>
                  )
                }
              >
                공유 기간
              </Chip>
            )}
            <Chip
              sx={{
                "--Chip-minHeight": "36px"
              }}
              startDecorator={<InsertLinkIcon />}
              onClick={() => {
                setPostOptionToggle(1);
              }}
              size="lg"
              variant="soft"
              color={postOptionToggle === 1 ? "primary" : "neutral"}
              endDecorator={
                postOptionToggle === 1 ? (
                  <ChipDelete
                    onDelete={() => {
                      setLink("");
                      setPostOptionToggle(-1);
                    }}
                  />
                ) : (
                  <></>
                )
              }
            >
              링크
            </Chip>
          </Box>

          {
            //start, end date
            postOptionToggle === 0 && (
              <PostOptionValue>
                <DatePicker
                  calendarStartDay={1}
                  locale={ko}
                  dateFormat="yy년 MM월 dd일"
                  selectsStart
                  selected={start}
                  startDate={start}
                  endDate={end}
                  customInput={
                    start ? (
                      <DateButton>
                        {start?.getFullYear()}년 {start?.getMonth() + 1}월 {start?.getDate()}일
                      </DateButton>
                    ) : (
                      <DateButton>공유 시작일</DateButton>
                    )
                  }
                  onChange={(date: Date) => setStart(date)}
                />
                <MoreHorizIcon color="inherit" />
                <DatePicker
                  calendarStartDay={1}
                  locale={ko}
                  dateFormat="yy년 MM월 dd일"
                  selectsEnd
                  selected={end}
                  startDate={start}
                  endDate={end}
                  customInput={
                    end ? (
                      <DateButton>
                        {end?.getFullYear()}년 {end?.getMonth() + 1}월 {end?.getDate()}일
                      </DateButton>
                    ) : (
                      <DateButton>공유 종료일</DateButton>
                    )
                  }
                  onChange={(date: Date) => setEnd(date)}
                />
              </PostOptionValue>
            )
          }
          {
            //link
            postOptionToggle === 1 && (
              <PostOptionValue>
                <input placeholder="https://www.url.com" value={link} onChange={(e) => setLink(e.target.value)}></input>
              </PostOptionValue>
            )
          }
        </PostOptionWrapper>
        <InputForm.TextArea
          ref={inputRef}
          minLength={12}
          placeholder={placeholders[postProps.type]}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        ></InputForm.TextArea>
        {(images?.length > 0 || uploadImages.isLoading) && (
          <InputForm.InputImageWrapper>
            {images.map((v, i) => (
              <InputForm.InputImageBox key={i + v}>
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
            {uploadImages.isLoading && (
              <LoadingBox>
                <CircularProgress color="inherit" size={64} />
              </LoadingBox>
            )}
          </InputForm.InputImageWrapper>
        )}
        <InputForm.ButtonArea>
          <input ref={imageInput} type="file" accept="image/*" name="image" multiple hidden onChange={onChangeImages} />
          <FlexButton onClick={() => cancleConfirm()}>
            <CancelIcon />
            <span>취소</span>
          </FlexButton>
          <ButtonWrapper>
            <FlexButton onClick={() => imageInput.current?.click()}>
              <InsertPhotoIcon />
              <span>이미지 삽입</span>
            </FlexButton>
            {editPost.isLoading ? (
              <CircularProgress style={{ margin: "0 8px" }} color="inherit" size={24} />
            ) : (
              <FlexButton onClick={() => postEditSubmit()}>
                <PostAddIcon />
                <span>등록</span>
              </FlexButton>
            )}
          </ButtonWrapper>
        </InputForm.ButtonArea>
      </InputForm.InputWrapper>
    </InputForm.EditBG>
  );
};

export default PostEditPopup;

const LoadingBox = styled.div`
  color: white;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DateButton = styled.button`
  font-size: 16px;
  font-weight: 500;
  width: 150px;
  height: 32px;
  border: 2px solid #cbdbf3;
  border: 2px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  outline: none;

  text-align: center;
  @media (orientation: portrait) or (max-height: 480px) {
    width: calc((100vw - 40px - 24px) / 2);
  }
`;
const PostOptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 130px;
  height: auto;

  padding: 30px 40px;
  padding-bottom: 5px;

  color: rgba(0, 0, 0, 0.8);

  @media (orientation: portrait) or (max-height: 480px) {
    padding: 20px;
    padding-bottom: 5px;
    height: 110px;
    height: auto;
  }

  > div:first-child {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;

    span {
      font-weight: 500;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.7);
    }
  }
`;

const PostOptionValue = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;

  margin-top: 12px;
  color: rgba(0, 0, 0, 0.6);

  input {
    color: rgba(0, 0, 0, 0.8);
    font-size: 16px;
    width: 100%;

    height: 32px;
    border: 2px solid #cbdbf3;
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    outline: none;
    padding: 0 8px;

    &::placeholder {
      text-align: center;
    }
  }

  @media (orientation: portrait) or (max-height: 480px) {
    justify-content: center;
  }
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
    font-weight: 500;
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
