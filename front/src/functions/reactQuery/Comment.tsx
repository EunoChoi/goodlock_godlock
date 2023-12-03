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

const Comment = {
  add: () => {
    const queryClient = useQueryClient();

    return useMutation(
      ({ postId, content }: { postId: number; content: string }) => Axios.post(`post/${postId}/comment`, { content }),
      {
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
      }
    );
  },
  edit: () => {
    const queryClient = useQueryClient();

    return useMutation(
      ({ postId, commentId, content }: { postId: number; commentId: number; content: string }) =>
        Axios.patch(`post/${postId}/comment/${commentId}`, { content }),
      {
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
      }
    );
  },
  delete: () => {
    const queryClient = useQueryClient();

    return useMutation(
      ({ postId, commentId }: { postId: number; commentId: number }) =>
        Axios.delete(`post/${postId}/comment/${commentId}`),
      {
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
      }
    );
  }
};

export default Comment;
