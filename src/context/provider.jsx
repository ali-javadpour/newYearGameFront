import React, { createContext, useId, useState } from "react";

export const UserContext = createContext();

const MyProvider = ({ children }) => {
  // const mainUrl = "https://testapi.libertoe.ir/"
  const mainUrl = "https://api.libertoe.ir/"

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [userData, setUserData] = useState({})
  
  return (
    <UserContext.Provider
      value={{
        isLoggedIn, setIsLoggedIn,
        userData, setUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default MyProvider;
