import React, { useContext, useEffect, useState } from "react";
import Card from "./Card";
import GameOver from "./GameOver";
import "./styles.scss";
import { UserContext } from "../../context/provider";
import FinishInfo from "../modals/finishInfo";
import { useDisclosure } from "@chakra-ui/react";
import { netCall } from "../../lib/netCall";

// source: https://codesandbox.io/p/sandbox/react-card-flip-game-redi3?file=%2Fsrc%2FCard.jsx%3A1%2C1-20%2C1

const GameBoard = ({ showtoast, finishModal, scoreModal }) => {

  const [finishDatas, setFinishDatas] = useState({})

  const { timer, setShowTimer, stopTimer, isGameEnable, setIsGameEnable, userData, startGameDelay, setStartGameDelay, setUserData } = useContext(UserContext)

  addEventListener("beforeunload", (event) => {
    console.log("page is going to unload!");
    setFinishDatas({ time: timer });
    setIsGameEnable(false);
    stopTimer();
    restartGame();
    setShowTimer(false);
    setStartGameDelay(0)
  });

  const usePageVisibility = (onHide, onShow) => {
    useEffect(() => {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          onHide && onHide();
        } else {
          onShow && onShow();
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }, [onHide, onShow]);
  };

  usePageVisibility(
    () => {
      console.log("page is going to unload!");
      // setFinishDatas({ time: timer });
      setIsGameEnable(false);
      stopTimer();
      restartGame();
      setShowTimer(false);
    },
    () => showtoast("info", "در هنگام بازی، از صفحه بازی خارج نشوید. این کار باعث سوختن آن دور شما می شود")
  );

  useEffect(() => {

    if (timer >= 180000) {
      setFinishDatas({ time: timer })
      setIsGameEnable(false)
      stopTimer()
      restartGame()
      setShowTimer(false)
      showtoast("error", "فرصت شما برای بازی تموم شد!")
    }
  }, [timer])

  const cards = [
    "TV",
    "TV",
    "VT",
    "VT",
    "hbird",
    "hbird",
    "name",
    "name",
    "seal",
    "seal",
    "tracks",
    "tracks"
  ];

  const showFinishModal = async (time) => {
    finishModal.onOpen()
    stopTimer()
    const sendData = { time: Date.now() }
    const res = await netCall("end_time", "post", sendData)
    let finalNumber = 0
    if (res.status === 200) {

      finalNumber = Math.floor(res.data.duration - 4000 - startGameDelay)
      console.log("finalNumber: ", finalNumber);
      console.log("server time:", res);
      console.log("front time:", time);
    } else {
      const editRes = await netCall("trys_left", "patch", { trysLeft: userData.trys_left + 1 });
      if(editRes.status === 200){
        setUserData(res.data);
      }
      showtoast("error", "به نظر میاد مشکلی به وجود اومده")
    }

    const data = { time: finalNumber, ...userData }
    setFinishDatas(data)
    setStartGameDelay(0)
  }

  ///////////// HELPER FUNCTION /////////////

  const shuffle = array => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  ///////////// SETUP /////////////

  const [cardList, setCardList] = useState(
    shuffle(cards).map((name, index) => {
      return {
        id: index,
        name: name,
        flipped: false,
        matched: false
      };
    })
  );

  const [flippedCards, setFlippedCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  ///////////// GAME LOGIC /////////////

  const handleClick = (name, index) => {
    if (isGameEnable) {
      let currentCard = {
        name,
        index
      };

      //update card is flipped
      let updateCards = cardList.map(card => {
        if (card.id === index) {
          card.flipped = true;
        }
        return card;
      });
      let updateFlipped = flippedCards;
      updateFlipped.push(currentCard);
      setFlippedCards(updateFlipped);
      setCardList(updateCards);

      //if 2 cards are flipped, check if they are a match
      if (flippedCards.length === 2) {
        // setTimeout(() => {
        check();
        // }, 750);
      }
    }
  };

  const check = () => {
    let updateCards = cardList;
    if (
      flippedCards[0].name === flippedCards[1].name &&
      flippedCards[0].index !== flippedCards[1].index
    ) {
      setTimeout(() => {
        updateCards[flippedCards[0].index].matched = true;
        updateCards[flippedCards[1].index].matched = true;
        isGameOver();
      }, 300);
    } else {
      setTimeout(() => {
        updateCards[flippedCards[0].index].flipped = false;
        updateCards[flippedCards[1].index].flipped = false;
      }, 750);
    }
    setCardList(updateCards);
    setFlippedCards([]);
  };

  const isGameOver = () => {
    let done = true;
    cardList.forEach(card => {
      if (!card.matched) done = false;
    });
    setGameOver(done);
    setShowTimer(!done)
    if (done) {
      showFinishModal(timer)
      setIsGameEnable(false)
      setTimeout(() => {
        restartGame()
      }, 3000)
    }
  };

  ///////////// RESTART - REDO SETUP /////////////

  const restartGame = () => {
    setCardList(
      shuffle(cards).map((name, index) => {
        return {
          id: index,
          name: name,
          flipped: false,
          matched: false
        };
      })
    );

    setFlippedCards([]);
    setGameOver(false);
  };

  ///////////// DISPLAY /////////////

  return (
    <div className="game-board">
      {
        cardList.map((card, index) => (
          <Card
            key={index}
            id={index}
            name={card.name}
            flipped={card.flipped}
            matched={card.matched}
            clicked={flippedCards.length === 2 ? () => { } : handleClick}
          />
        ))}
      {/* {gameOver && <GameOver restartGame={restartGame} />} */}
      <FinishInfo handler={finishModal} data={finishDatas} scoreModal={scoreModal} />
    </div>
  );
};

export default GameBoard;
