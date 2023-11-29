import { useMutation } from "@tanstack/react-query";
import Axios from "../../apis/Axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface CustomError extends Error {
  response?: {
    data: { message: string };
    status: number;
    headers: string;
  };
}
interface CustomError2 extends Error {
  response?: {
    data: string;
    status: number;
    headers: string;
  };
}
interface props {
  setIsPostInputOpen: (b: boolean) => void;
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

          toast.success("게시글 등록이 완료되었습니다.");
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
          });
        },
        onError: () => {
          toast.warning("글 등록 중 에러 발생!!");
        }
      }
    );
  },
  edit: (id: number) => {
    const queryClient = useQueryClient();
    return useMutation((data: localPostData) => Axios.patch<localPostData>(`/post/${id}`, data), {
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

        toast.success("게시글 수정이 완료되었습니다.");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  delete: (id: number) => {
    const queryClient = useQueryClient();

    return useMutation(() => Axios.delete(`post/${id}`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["thisweek/end/liked"]);

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

        queryClient.invalidateQueries(["thisweek/new/1"]);
        queryClient.invalidateQueries(["thisweek/new/2"]);
        toast.success("게시글 삭제 완료");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  like: (id: number) => {
    const queryClient = useQueryClient();

    return useMutation(() => Axios.patch(`post/${id}/like`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);

        queryClient.invalidateQueries(["thisweek/end/liked"]);

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
      },
      onError: (err: CustomError2) => {
        toast.error(err.response?.data);
        // alert(err.response?.data);
      }
    });
  },
  disLike: (id: number) => {
    const queryClient = useQueryClient();
    return useMutation(() => Axios.delete(`post/${id}/like`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);

        queryClient.invalidateQueries(["thisweek/end/liked"]);

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
      },
      onError: (err: CustomError2) => {
        toast.error(err.response?.data);
        // alert(err.response?.data);
      }
    });
  }
};

export default Post;
