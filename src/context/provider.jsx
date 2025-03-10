import React, { createContext, useId, useState } from "react";
import image0 from "../assets/img/vector/image0.png";
import image1 from "../assets/img/vector/image1.png";
import image2 from "../assets/img/vector/image2.png";
import image3 from "../assets/img/vector/image3.png";
import image4 from "../assets/img/vector/image4.png";
import image5 from "../assets/img/vector/image5.png";
import image6 from "../assets/img/vector/image6.png";
import image7 from "../assets/img/vector/image7.png";
import image8 from "../assets/img/vector/image8.png";
import image9 from "../assets/img/vector/image9.png";
import image10 from "../assets/img/vector/image10.png";
import image11 from "../assets/img/vector/image11.png";

export const UserContext = createContext();

const MyProvider = ({ children }) => {
  // const mainUrl = "https://testapi.libertoe.ir/"
  const mainUrl = "https://api.libertoe.ir/"

  const vectors = [{img:image0, id:0},{img:image1, id:1},{img:image2, id:2},{img:image3, id:3},
    {img:image4, id:4},{img:image5, id:5},{img:image6, id:6},{img:image7, id:7},{img:image8, id:8},
    {img:image9, id:9},{img:image10, id:10}, {img:image11, id:11}
  ]

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [userData, setUserData] = useState({})

  const [showTimer, setShowTimer] = useState(false)
  const [timer, setTimer] = useState(0)
  const [intervalId, setIntervalId] = useState(null)
  const [isNewUser, setIsNewUser] = useState(false)

  const [isGameEnable, setIsGameEnable] = useState(false)

  const [scoreData, setScoreData] = useState([])

  const startTimer = () => {
    var startTime = Date.now();
    const id = setInterval(function () {
      var delta = Date.now() - startTime; // milliseconds elapsed since start
      setTimer(delta); // in seconds
    }, 10);
    setIntervalId(id);
  }

  const stopTimer = () => {
    clearInterval(intervalId);
    setTimer(0);
  }
  return (
    <UserContext.Provider
      value={{
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        showTimer, setShowTimer,
        startTimer, stopTimer,
        timer,
        isGameEnable, setIsGameEnable,
        isNewUser, setIsNewUser,
        scoreData, setScoreData,
        vectors
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default MyProvider;
