import { useContext, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes, Navigate } from "react-router";
import Layout from "./components/Layout";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import OTPPage from "./pages/otp";
import { Spinner, useToast } from "@chakra-ui/react";
import { UserContext } from "./context/provider";
import { netCall } from "./lib/netCall";

function PrivateRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ isAuthenticated, children }) {
  return isAuthenticated ? <Navigate to="/" /> : children;
}

function App() {
  const { isLoggedIn, setIsLoggedIn, setUserData } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   async function authenticate() {
  //     setIsLoading(true);
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       const res = await netCall("checkauth", "get");
  //       if (res.status === 200) {
  //           setIsLoggedIn(true);
  //           setUserData(res.data);
  //           // navigate("/");
  //       }
  //     }
  //     setIsLoading(false);
  //   }

  //   authenticate();
  // }, []);

  const toast = useToast();
  const showtoast = (status, text) => {
    // const statuses = ['success', 'error', 'warning', 'info']
    toast({
      title: text,
      position: "top",
      containerStyle: {
        fontFamily: "peyda",
      },
      // description: "We've created your account for you.",
      status: status,
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute isAuthenticated={isLoggedIn}>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="login"
            element={
              <PublicRoute isAuthenticated={isLoggedIn}>
                {isLoading ? (
                  <div className="flex justify-center items-center h-full" >

                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#007067"
                    size="xl"
                    />
                    </div>
                ) : (
                  <LoginPage showtoast={showtoast} />
                )}
              </PublicRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
