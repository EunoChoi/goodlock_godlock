import React, { useEffect, useRef, useState } from "react";
import InputForm from "../../styles/InputForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Axios from "../../apis/Axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import Animation from "../../styles/Animation";

//mui
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PostAddIcon from "@mui/icons-material/PostAdd";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CancelIcon from "@mui/icons-material/Cancel";

import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

interface serverImages {
  src: string;
}
interface serverPostData {
  type: number;
  id: number;
  content: string;
  images: serverImages[];
}
interface localPostData {
  type: number;
  id: number;
  content: string;
  images: string[];
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
  const params = useParams();
  const inputType = params.type ? parseInt(params.type) : 0;
  const isMobile = useMediaQuery({ maxWidth: 720 });

  const editPost = useMutation((data: localPostData) => Axios.patch<localPostData>(`/post/${postProps.id}`, data), {
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
      setPostEdit(false);
      toast.success("게시글 수정이 완료되었습니다.");
    },
    onError: (err: CustomError) => {
      toast.warning(err.response?.data);
      // alert(err.response?.data);
    }
  });

  const PostInputHelpText = ["공지사항 입력 설명", "모집 공고 입력 설명", "소통글 입력 설명"];
  const placeholders = ["공지사항 입력", "모집 공고 입력", "소통글 입력"];
  const [content, setContent] = useState<string>(postProps.content);
  const [images, setImages] = useState<string[]>(postProps.images.map((v) => v.src));
  const imageInput = useRef<HTMLInputElement>(null);

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
        // const isCancel = confirm("게시글 수정을 중단하시겠습니까?");
        // if (isCancel) setPostEdit(false);

        confirmAlert({
          // title: "",
          message: "게시글 수정을 중단하시겠습니까?",
          buttons: [
            {
              label: "확인",
              onClick: () => setPostEdit(false)
            },
            {
              label: "취소",
              onClick: () => console.log("취소")
            }
          ]
        });
      }}
    >
      {isMobile || <PostInputHelp>{PostInputHelpText[postProps.type]}</PostInputHelp>}
      <InputForm.InputWrapper onClick={(e) => e.stopPropagation()}>
        <InputForm.TextArea
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
              // const isCancel = confirm("게시글 수정을 중단하시겠습니까?");
              // if (isCancel) setPostEdit(false);

              confirmAlert({
                // title: "",
                message: "게시글 수정을 중단하시겠습니까?",
                buttons: [
                  {
                    label: "확인",
                    onClick: () => setPostEdit(false)
                  },
                  {
                    label: "취소",
                    onClick: () => console.log("취소")
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
                } else editPost.mutate({ content, images, type: postProps.type, id: postProps.id });
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
