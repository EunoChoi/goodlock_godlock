import React, { useEffect, useState } from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import GlobalStyle from "./styles/GlobalStyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRoute from "./components/AuthRoute";

import { ToastContainer } from "react-toastify";
import { useMediaQuery } from "react-responsive";

//external css
import "react-toastify/dist/ReactToastify.css";
// import "react-confirm-alert/src/react-confirm-alert.css";
import "./styles/react-confirm.css";

//Pages
const Start = lazy(() => import("./pages/Start"));
const Main = lazy(() => import("./pages/Main"));
const Profile = lazy(() => import("./pages/Profile"));
const UserInfo = lazy(() => import("./pages/UserInfo"));
const PostView = lazy(() => import("./pages/PostView"));
const NotFound = lazy(() => import("./pages/NotFound"));

import Loading from "./pages/Loading";

function App() {
  console.log("===== App 리렌더 =====");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const updateMobileViewport = () => {
    // console.log("visual viewport resized");
    const vh = window.visualViewport?.height;
    if (vh) {
      document.documentElement.style.setProperty("--vh", `${vh * 0.01}px`);
    }
  };

  useEffect(() => {
    visualViewport?.addEventListener("resize", () => updateMobileViewport());
    updateMobileViewport();
    return () => {
      visualViewport?.removeEventListener("resize", () => updateMobileViewport());
    };
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
            <Route path="profile/:cat" element={<AuthRoute accessType="login" component={<Profile />} />} />
            <Route path="userinfo/:id/cat/:cat" element={<AuthRoute accessType="login" component={<UserInfo />} />} />
            <Route path="/" element={<Start />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
