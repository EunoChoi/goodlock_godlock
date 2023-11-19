import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Axios from "../../apis/Axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface LoginValue {
  email: string;
  password: string;
}
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

const User = {
  login: () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation(
      ({ email, password }: LoginValue) =>
        Axios.post("/user/login", {
          email: email,
          password: password
        }),
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["user"]);
          navigate("/main/0");
          window.location.reload();
        },
        onError: (err: CustomError) => {
          toast.error(err.response?.data?.message);
          if (err.response?.data?.message) {
            console.log(err.response?.data?.message);
          } else {
            toast.error("로그인 중 에러 발생");
          }
          console.log(err);
          console.log("로그인 중 에러 발생");
        }
      }
    );
  },
  logout: () => {
    const queryClient = useQueryClient();

    return useMutation(() => Axios.get("user/logout"), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        location.reload();
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  editPic: () => {
    const queryClient = useQueryClient();

    return useMutation((data: { profilePic: string }) => Axios.patch("user/edit/profilepic", data), {
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
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  editNick: () => {
    const queryClient = useQueryClient();

    return useMutation((data: { nickname: string }) => Axios.patch("user/edit/nickname", data), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
        // alert(err.response?.data);
      }
    });
  },
  editText: () => {
    const queryClient = useQueryClient();

    return useMutation((data: { usertext: string }) => Axios.patch("user/edit/usertext", data), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  follow: (id: number) => {
    const queryClient = useQueryClient();

    return useMutation(() => Axios.patch(`user/${id}/follow`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["targetUser"]);
        toast.success("팔로우 완료");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  unFollow: () => {
    const queryClient = useQueryClient();

    return useMutation((data: { userId: number }) => Axios.delete(`user/${data.userId}/follow`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        queryClient.invalidateQueries(["targetUser"]);
        toast.success("언팔로우 완료");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  },
  deleteFollower: () => {
    const queryClient = useQueryClient();

    return useMutation((data: { userId: number }) => Axios.delete(`user/${data.userId}/follower`), {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
        toast.success("팔로워 삭제 완료");
      },
      onError: (err: CustomError2) => {
        toast.warning(err.response?.data);
      }
    });
  }
};

export default User;
