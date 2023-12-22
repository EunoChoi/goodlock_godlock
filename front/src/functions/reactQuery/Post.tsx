import { useMutation } from "@tanstack/react-query";
import Axios from "../../apis/Axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CustomError2 extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}

interface postDataType {
  type: number;
  content: string;
  images: string[];
  start: Date | null;
  end: Date | null;
  link: string;
}
interface localPostData {
  type: number;
  id: number;
  content: string;
  images: string[];
  start: Date | null;
  end: Date | null;
  link: string;
}

const Post = {
  add: () => {
    const queryClient = useQueryClient();

    return useMutation(
      (data: postDataType) => {
        return Axios.post<postDataType>("/post", data);
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["user"]);
          queryClient.invalidateQueries(["thisweek/end/liked"]);
          queryClient.invalidateQueries(["thisweek/new/1"]);
          queryClient.invalidateQueries(["thisweek/new/2"]);
          queryClient.invalidateQueries(["thisweek/feed"]);
          queryClient.invalidateQueries(["thisweek/activeinfo"]);

          queryClient.invalidateQueries(["topPosts"]);
          queryClient.invalidateQueries(["noticePosts"]);
          queryClient.invalidateQueries(["infoPosts"]);
          queryClient.invalidateQueries(["searchInfo"]);
          queryClient.invalidateQueries(["communityPosts"]);
          queryClient.invalidateQueries(["searchComm"]);
          queryClient.invalidateQueries(["activinfo"]);
          queryClient.invalidateQueries(["tipfeed"]);
          queryClient.invalidateQueries(["freefeed"]);

          queryClient.invalidateQueries(["userLikedPosts"]);
          queryClient.invalidateQueries(["userInfoPosts"]);
          queryClient.invalidateQueries(["userCommPosts"]);

          queryClient.invalidateQueries(["likedPosts"]);
          queryClient.invalidateQueries(["myCommPosts"]);
          queryClient.invalidateQueries(["myInfoPosts"]);

          toast.success("게시글 등록이 완료되었습니다.");
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth"
            });
          }, 200);
        },
        onError: () => {
          toast.warning("글 등록 중 에러 발생!!");
        }
      }
    );
  },
  edit: () => {
    const queryClient = useQueryClient();
    return useMutation(({ id, data }: { id: number; data: localPostData }) => Axios.patch(`/post/${id}`, data), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["thisweek/end/liked"]);
        queryClient.invalidateQueries(["thisweek/new/1"]);
        queryClient.invalidateQueries(["thisweek/new/2"]);
        queryClient.invalidateQueries(["thisweek/feed"]);
        queryClient.invalidateQueries(["thisweek/activeinfo"]);

        queryClient.invalidateQueries(["noticePosts"]);
        queryClient.invalidateQueries(["infoPosts"]);
        queryClient.invalidateQueries(["searchInfo"]);
        queryClient.invalidateQueries(["communityPosts"]);
        queryClient.invalidateQueries(["searchComm"]);
        queryClient.invalidateQueries(["activinfo"]);
        queryClient.invalidateQueries(["tipfeed"]);
        queryClient.invalidateQueries(["freefeed"]);

        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);

        queryClient.invalidateQueries(["likedPosts"]);
        queryClient.invalidateQueries(["myCommPosts"]);
        queryClient.invalidateQueries(["myInfoPosts"]);

        toast.success("게시글 수정이 완료되었습니다.");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  delete: () => {
    const queryClient = useQueryClient();

    return useMutation((id: number) => Axios.delete(`post/${id}`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["thisweek/new/1"]);
        queryClient.invalidateQueries(["thisweek/new/2"]);
        queryClient.invalidateQueries(["thisweek/end/liked"]);
        queryClient.invalidateQueries(["thisweek/feed"]);
        queryClient.invalidateQueries(["thisweek/activeinfo"]);

        queryClient.invalidateQueries(["topPosts"]);
        queryClient.invalidateQueries(["noticePosts"]);
        queryClient.invalidateQueries(["infoPosts"]);
        queryClient.invalidateQueries(["searchInfo"]);
        queryClient.invalidateQueries(["communityPosts"]);
        queryClient.invalidateQueries(["searchComm"]);
        queryClient.invalidateQueries(["activinfo"]);
        queryClient.invalidateQueries(["tipfeed"]);
        queryClient.invalidateQueries(["freefeed"]);

        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);

        queryClient.invalidateQueries(["likedPosts"]);
        queryClient.invalidateQueries(["myCommPosts"]);
        queryClient.invalidateQueries(["myInfoPosts"]);

        queryClient.invalidateQueries(["thisweek/new/1"]);
        queryClient.invalidateQueries(["thisweek/new/2"]);
        toast.success("게시글 삭제 완료");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  like: () => {
    const queryClient = useQueryClient();

    return useMutation((id: number) => Axios.patch(`post/${id}/like`), {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["user"]);

        queryClient.invalidateQueries(["thisweek/end/liked"]);

        queryClient.invalidateQueries(["single"]);
        queryClient.invalidateQueries(["noticePosts"]);
        queryClient.invalidateQueries(["infoPosts"]);
        queryClient.invalidateQueries(["searchInfo"]);
        queryClient.invalidateQueries(["communityPosts"]);
        queryClient.invalidateQueries(["searchComm"]);
        queryClient.invalidateQueries(["activinfo"]);
        queryClient.invalidateQueries(["tipfeed"]);
        queryClient.invalidateQueries(["freefeed"]);
        queryClient.invalidateQueries(["topPosts"]);

        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);

        queryClient.invalidateQueries(["likedPosts"]);
        queryClient.invalidateQueries(["myCommPosts"]);
        queryClient.invalidateQueries(["myInfoPosts"]);

        if (res.data.type === 1) toast.success("북마크 등록 완료");
        else if (res.data.type !== 1) toast.success("좋아요 완료");
      },
      onError: (err: CustomError2) => {
        toast.error(err.response?.data);
      }
    });
  },
  disLike: () => {
    const queryClient = useQueryClient();
    return useMutation((id: number) => Axios.delete(`post/${id}/like`), {
      onSuccess: (res) => {
        queryClient.invalidateQueries(["user"]);

        queryClient.invalidateQueries(["thisweek/end/liked"]);

        queryClient.invalidateQueries(["single"]);
        queryClient.invalidateQueries(["noticePosts"]);
        queryClient.invalidateQueries(["infoPosts"]);
        queryClient.invalidateQueries(["searchInfo"]);
        queryClient.invalidateQueries(["communityPosts"]);
        queryClient.invalidateQueries(["searchComm"]);
        queryClient.invalidateQueries(["activinfo"]);
        queryClient.invalidateQueries(["tipfeed"]);
        queryClient.invalidateQueries(["freefeed"]);
        queryClient.invalidateQueries(["topPosts"]);

        queryClient.invalidateQueries(["userLikedPosts"]);
        queryClient.invalidateQueries(["userInfoPosts"]);
        queryClient.invalidateQueries(["userCommPosts"]);

        queryClient.invalidateQueries(["likedPosts"]);
        queryClient.invalidateQueries(["myCommPosts"]);
        queryClient.invalidateQueries(["myInfoPosts"]);

        if (res.data.type === 1) toast.success("북마크 등록 해제 완료");
        else if (res.data.type !== 1) toast.success("좋아요 해제 완료");
      },
      onError: (err: CustomError2) => {
        toast.error(err.response?.data);
        // alert(err.response?.data);
      }
    });
  }
};

export default Post;
