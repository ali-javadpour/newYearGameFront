import GameBoard from "../components/gameBoard/GameBoard";
import bg from "../assets/img/bg.jpeg";
import logo from "../assets/img/logo.png";
import winner from "../assets/img/winner.png";
import account from "../assets/img/account.png";
import game from "../assets/img/gameIcon.png";
import { Avatar, useDisclosure } from "@chakra-ui/react";
import { InfoOutlineIcon, TimeIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/provider";
import GameInfo from "../components/modals/GameInfo";
import ScoreList from "../components/modals/ScoreList";
import { toFarsiNumber } from "../components/toolbox";
import { netCall } from "../lib/netCall";

const HomePage = ({ showtoast }) => {
  //   const [timer, setTimer] = useState(0);
  const [gameStartTimer, setGameStartTimer] = useState(4);
  const [showGameTimer, setShowGameTimer] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    timer,
    showTimer,
    setShowTimer,
    startTimer,
    stopTimer,
    setIsGameEnable,
    isGameEnable,
    userData,
    setUserData,
    isNewUser,
    setScoreData,
    vectors,
    setStartGameDelay
  } = useContext(UserContext);

  const infoModal = useDisclosure();
  const scoreModal = useDisclosure();
  const finishModal = useDisclosure();

  const start = async () => {
    if (userData.trys_left > 0) {
      // setIsLoading(true);
      setShowGameTimer(true);
      const sendData = { trysLeft: userData.trys_left - 1 };
      const res = await netCall("trys_left", "patch", sendData);
      if(res.status === 200){
        const startReq = Date.now()
        const timeSendData = {time: Date.now()}
        const startRes = await netCall("start_time", "post", timeSendData)
        if(startRes.status === 200){
          const endReq = Date.now()
          const reqDelay = (endReq - startReq)/2
          setStartGameDelay(reqDelay)
          console.log("reqDelay: ",reqDelay);
          
          setUserData(res.data);
          const id = setInterval(function () {
            // milliseconds elapsed since start
            setGameStartTimer((e) => e - 1); // in seconds
          }, 1000);
          setIntervalId(id);
        }else{
          // give user chance back
          await netCall("trys_left", "patch", { trysLeft: userData.trys_left + 1 });
          showtoast("error", "به نظر میاد مشکلی به وجود اومده")
          setShowGameTimer(false);
        }
      }else{
        showtoast("error", "به نظر میاد مشکلی به وجود اومده")
        setShowGameTimer(false);
      }
    }else{
      showtoast("info", "فرصتت واسه بازی امروز تموم شده، فردا ۵ تا شانس دیگه داری!")
    }
  };

  useEffect(() => {
    if (gameStartTimer <= 0) {
      setShowGameTimer(false);
      clearInterval(intervalId);
      setIsGameEnable(true);
      setShowTimer(true);
      startTimer(); // update about every second
      setGameStartTimer(4);
    }
  }, [gameStartTimer]);

  useEffect(()=>{
    const getScores = async () => {
      const res = await netCall("scores", "get")
      console.log("score: ", res);
      if(res.status === 200){
        setScoreData(res.data.scores)
      }
    }
    getScores()
  },[])

  useEffect(() => {
    if (!!isNewUser) {
      infoModal.onOpen();
    }
  }, [isNewUser]);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center font-[peyda] bg-[#cb6d28] ">
      {/* <div
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
        className="absolute inset-0 w-full h-full blur-xl"
      ></div> */}
      <div className=" w-full h-full relative ">
        <div className=" w-full h-16 flex flex-row justify-between items-center px-6 bg-[#007067] rounded-b-2xl ">
          <div className=" flex flex-row justify-center items-center gap-2 w-[20%] ">
            <img src={game} className=" rounded-2xl w-10 " />
            <p className=" text-white text-2xl ">:</p>
            <p className=" text-white text-2xl font-black ">
              {toFarsiNumber(userData.trys_left)}
            </p>
          </div>
          <div className=" flex flex-row justify-center items-center gap-3 ">
            <p className=" text-white font-[1000] text-lg ">{userData.name}</p>
            <Avatar size="md" name={userData.name} src={vectors[userData.vector].img} />
            {/* <img src={vectors[userData.vector].img} /> */}
          </div>
        </div>
        <GameBoard showtoast={showtoast} finishModal={finishModal} scoreModal={scoreModal} />
      </div>
      <div className="fixed z-50 w-[80%] h-12 bg-white rounded-full bottom-1 flex flex-row justify-between items-center px-5 ">
        <img src={winner} onClick={scoreModal.onOpen} className=" my-1 w-8 " />
        <div className="bg-[#007067] px-7 rounded-xl flex justify-center items-center h-4/5 ">
          {showTimer ? (
            <div className=" flex flex-row gap-3 justify-center items-center ">
              <TimeIcon color="white" />
              <p className=" text-white p-0 m-0 pt-1 ">
                {Math.floor(Math.floor(timer / 1000) / 60)}:
                {Math.floor(timer / 1000) % 60}
              </p>
            </div>
          ) : (
            <p
              className=" text-3xl text-white pb-1 m-0 text-center cursor-pointer "
              onClick={start}
            >
              شروع
            </p>
          )}
        </div>
        <InfoOutlineIcon h="100%" w={6} onClick={infoModal.onOpen} />
      </div>
      <div className=" absolute w-full h-full flex justify-center items-center " style={showGameTimer ? {zIndex:10} : {zIndex:-10}} >
        {showGameTimer && (
          <p className=" text-[150px] bg-[#ffffff90] px-8 pt-4 rounded-2xl ">
            {gameStartTimer > 1 ? toFarsiNumber(gameStartTimer - 1) : "شروع"}
          </p>
        )}
      </div>
      <GameInfo handler={infoModal} />
      <ScoreList handler={scoreModal} />
    </div>
  );
};

export default HomePage;
