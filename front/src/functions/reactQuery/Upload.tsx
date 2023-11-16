import { useMutation } from "@tanstack/react-query";
import Axios from "../../apis/Axios";

const Upload = {
  images: () => {
    return useMutation(
      (images: any) => {
        return Axios.post("post/images", images);
      },
      {
        onSuccess: (res) => {
          console.log(res.data);
        }
        // onError: () => { }
      }
    );
  }
};

export default Upload;
