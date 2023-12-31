import React, { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import GlobalStyle from "./styles/GlobalStyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRoute from "./components/AuthRoute";

import { useModalStack } from "./store/modalStack";
import { useBrowserCheck } from "./store/borowserCheck";
import { ToastContainer } from "react-toastify";

//external css
import "react-toastify/dist/ReactToastify.css";

//Pages
const Start = lazy(() => import("./pages/Start"));
const Main = lazy(() => import("./pages/Main"));
const UserInfo = lazy(() => import("./pages/UserInfo"));
const PostView = lazy(() => import("./pages/PostView"));
const NotFound = lazy(() => import("./pages/NotFound"));

import Loading from "./pages/Loading";
import Kakao from "./pages/auth/Kakao";
import Google from "./pages/auth/Google";
import Naver from "./pages/auth/Naver";

function App() {
  const { modalStack } = useModalStack();
  const { setBrowser } = useBrowserCheck();

  // console.log("===== App 리렌더 =====");

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false
          }
        }
      })
  );

  const updateMobileViewport = () => {
    const vh = window.visualViewport?.height;
    const vw = window.visualViewport?.width;

    if (vh && vw) {
      if (vh > vw && vw == window.innerWidth) {
        document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
      }
      if (vw > vh && vh == window.innerHeight) {
        document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
      }
    }
  };

  if (visualViewport) {
    visualViewport.onresize = () => {
      updateMobileViewport();
    };
  }

  useEffect(() => {
    console.log(modalStack);
  }, [modalStack.length]);

  useEffect(() => {
    setBrowser();
    updateMobileViewport();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
      />
      <Router>
        <GlobalStyle />
        <Suspense fallback={<Loading></Loading>}>
          <Routes>
            <Route path="postview/:id" element={<PostView />} />
            <Route path="main/:type" element={<AuthRoute accessType="login" component={<Main />} />} />
            <Route path="main/:type/search/*" element={<AuthRoute accessType="login" component={<Main />} />} />
            <Route path="main/:type/cat/:cat" element={<AuthRoute accessType="login" component={<Main />} />} />
            <Route path="userinfo/:id/cat/:cat" element={<AuthRoute accessType="login" component={<UserInfo />} />} />
            <Route path="/" element={<Start />} />
            <Route path="/auth/kakao" element={<Kakao />} />
            <Route path="/auth/google" element={<Google />} />
            <Route path="/auth/naver" element={<Naver />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
