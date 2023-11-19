import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Axios from "../apis/Axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//components
import AppLayout from "../components/AppLayout";
import Post from "../components/common/Post";

//mui
import ShareIcon from "@mui/icons-material/Share";

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(typeof Number(id));

  //리액트 쿼리 id로 단일 포스트 값 불러오기
  //this week
  const single = useQuery(
    ["single"],
    () => Axios.get("post/single", { params: { id: Number(id) } }).then((v) => v.data),
    {
      staleTime: 60 * 1000
    }
  );

  useEffect(() => {
    if (single.isError) {
      toast.error("공유 링크가 올바르지 않습니다.");
      navigate("/");
    }
  }, [single.isError]);

  return (
    <AppLayout>
      <SingePostText>
        <ShareIcon />
        <span> 공유 게시글</span>
      </SingePostText>
      {single.data && <Post key={"singlePost"} postProps={single.data} />}
    </AppLayout>
  );
};

export default PostView;

const SingePostText = styled.div`
  width: 100%;
  padding-top: 64px;
  padding-left: calc(35vw - 285px);
  padding-bottom: 32px;

  color: rgba(0, 0, 0, 0.7);
  font-size: 30px;
  span {
    color: rgba(0, 0, 0, 0.7);
    font-weight: 600;
  }

  @media (orientation: portrait) or (max-height: 480px) {
    /* background-color: #fff; */
    padding-left: 5vw;
    padding-top: 100px;
  }
  @media (orientation: landscape) and (max-height: 480px) {
    width: 60vw;
    padding-top: 60px;
  }
`;
