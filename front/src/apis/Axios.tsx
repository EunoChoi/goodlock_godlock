import axios from "axios";

const BACK_SERVER = process.env.REACT_APP_BACK_URL;

const Axios = axios.create({
  baseURL: BACK_SERVER,
  responseType: "json",
  // headers: { accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true, //쿠키를 첨부해서 요청
  timeout: 5000
});

export default Axios;
