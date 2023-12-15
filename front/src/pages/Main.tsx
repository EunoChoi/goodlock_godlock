import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

//components
import AppLayout from "../components/AppLayout";
import Home from "../components/mainPage/Home";
import Tips from "../components/mainPage/Tips";
import FreeBoard from "../components/mainPage/FreeBoard";
import Gallery from "../components/mainPage/Gallery";
import Profile from "./Profile";

const Main = () => {
  const params = useParams();
  const type = params.type ? parseInt(params.type) : 0;
  const [toggle, setToggle] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (type >= 0 && type <= 4) {
      setToggle(type);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    } else {
      navigate("/404");
    }
  }, [type]);

  return (
    <AppLayout>
      {toggle === 0 && <Home />}
      {toggle === 1 && <Tips />}
      {toggle === 2 && <FreeBoard />}
      {toggle === 3 && <Gallery />}
      {toggle === 4 && <Profile />}
    </AppLayout>
  );
};

export default Main;
