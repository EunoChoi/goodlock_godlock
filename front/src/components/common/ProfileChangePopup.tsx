import React, { useEffect } from "react";
import styled from "styled-components";
import Axios from "../../apis/Axios";
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

//style
import Animation from "../../styles/Animation";

//mui
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@mui/material";

interface state {
  image: boolean;
  usertext: boolean;
  nickname: boolean;
}

interface setStateProps {
  setToggles: (s: state) => void;
}
interface CustomError extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

const ProfileChangePopup = ({ setToggles }: setStateProps) => {
  const queryClient = useQueryClient();
  const BACK_SERVER = process.env.REACT_APP_BACK_URL;

  const [image, setImage] = useState<string>("");
  const imageInput = useRef<HTMLInputElement>(null);

  //useQuery
  const user = useQuery(["user"], () => Axios.get("user/current").then((res) => res.data), {
    staleTime: 60 * 1000
  }).data;
  //useMutation
  const editProfilePic = useMutation((data: { profilePic: string }) => Axios.patch("user/edit/profilepic", data), {
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      queryClient.invalidateQueries(["noticePosts"]);
      queryClient.invalidateQueries(["infoPosts"]);
      queryClient.invalidateQueries(["communityPosts"]);
      toast.success("프로필 이미지 변경이 완료되었습니다.");
      setToggles({ image: false, nickname: false, usertext: false });
      // alert("프로필 이미지 변경이 완료되었습니다.");
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
      Axios.post("post/images", imageFormData).then((res) => setImage(res.data[0]));
    }
  };
  useEffect(() => {
    setImage(user.profilePic);
  }, []);

  return (
    <PopupBackBlur onClick={() => setToggles({ image: false, nickname: false, usertext: false })}>
      <PopupBox
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <input ref={imageInput} type="file" accept="image/*" name="image" hidden onChange={onChangeImages} />
        <span>프로필 이미지 변경</span>
        <ProfileImageBox>
          {image ? (
            <ProfileImage src={`${BACK_SERVER}/${image}`} alt="프로필 이미지" />
          ) : (
            <ProfileImage src={`${process.env.PUBLIC_URL}/img/defaultProfilePic.png`} alt="프로필 이미지" />
          )}
          <Button
            color="error"
            onClick={() => {
              setImage("");
            }}
          >
            <DeleteForeverIcon />
          </Button>
        </ProfileImageBox>

        <ButtonArea>
          <Button onClick={() => setToggles({ image: false, nickname: false, usertext: false })}>
            <CancelIcon />
            <span>취소</span>
          </Button>
          <FlexBox>
            <Button onClick={() => imageInput.current?.click()}>
              <InsertPhotoIcon />
              <span>이미지 업로드</span>
            </Button>
            <Button
              onClick={() => {
                editProfilePic.mutate({ profilePic: image });
                console.log(image);
              }}
            >
              <CheckCircleIcon />
              <span>확인</span>
            </Button>
          </FlexBox>
        </ButtonArea>
      </PopupBox>
    </PopupBackBlur>
  );
};

export default ProfileChangePopup;
const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileImageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const ButtonArea = styled.div`
  width: 100%;
  height: 50px;
  background-color: #cbdbf3;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0px 10px;

  button {
    display: flex;
    justify-content: center;
    align-items: center;

    /* font-weight: 600; */
    font-size: 18px;
    color: rgba(0, 0, 0, 0.7);
    span {
      margin-left: 6px;
    }
  }
`;
const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 200px;

  object-fit: cover;

  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);

  margin-bottom: 5px;
`;
const PopupBox = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 500px;
  width: 400px;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-color: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);

  animation: ${Animation.smoothAppear} 1s;

  > span {
    font-size: 24px;
    color: rgba(0, 0, 0, 0.8);
    /* font-weight: 600; */
    margin-top: 50px;
  }
  @media screen and (max-width: 720px) {
    width: 95vw;
  }
`;
const PopupBackBlur = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;

  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
`;
