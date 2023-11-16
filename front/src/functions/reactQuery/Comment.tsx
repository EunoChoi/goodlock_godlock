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
interface CommentType {
  content: string;
}

const Comment = {
  add: (id: number, content: string) => {
    const queryClient = useQueryClient();

    return useMutation(() => Axios.post(`post/${id}/comment`, { content }), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);

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

        toast.success("댓글 작성이 완료되었습니다.");
      },
      onError: () => {
        toast.warning("댓글 추가 중 에러 발생!!");
      }
    });
  },
  edit: (postId: number, commentId: number) => {
    const queryClient = useQueryClient();

    return useMutation((data: CommentType) => Axios.patch<CommentType>(`post/${postId}/comment/${commentId}`, data), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);

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

        toast.success("댓글 수정이 완료되었습니다.");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  delete: (postId: number, commentId: number) => {
    const queryClient = useQueryClient();

    return useMutation(() => Axios.delete(`post/${postId}/comment/${commentId}`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);

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

        toast.success("댓글 삭제가 완료되었습니다.");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  }
};

export default Comment;
