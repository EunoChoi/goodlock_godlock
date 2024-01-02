import { useQuery } from "@tanstack/react-query";
import Axios from "../../apis/Axios";

const Hashtag = {
  get: ({ type, limit }: { type: number; limit: number }) => {
    return useQuery(
      [`hash?type=${type}&limit${limit}`],
      () => Axios.get(`hashtag?type=${type}&limit=${limit}`).then((res) => res.data),
      {
        refetchInterval: 60 * 1000,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        onSuccess: () => {
          //
        },
        onError: () => {
          //
        }
      }
    );
  }
};

export default Hashtag;
