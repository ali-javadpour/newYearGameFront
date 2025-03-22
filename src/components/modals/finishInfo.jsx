import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { netCall } from "../../lib/netCall";
import { UserContext } from "../../context/provider";

function FinishInfo({ handler, data, scoreModal, setFinishDatas }) {
  const [difference, setDifference] = useState("");

  const { setUserData, setScoreData } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false)

  const closeHandle = async () => {
    setIsLoading(true)
    const getScores = await netCall("scores", "get");
      console.log("score: ", getScores);
      if (getScores.status === 200) {
        setScoreData(getScores.data.scores);
        handler.onClose();
        setTimeout(scoreModal.onOpen(), 1000);
        setFinishDatas({})
      }
      setIsLoading(false)
  };

  const submitScore = async () => {
    const res = await netCall("new_score", "patch", {
      score: data.time,
    });
    console.log("res: ", res);
    if (res.status === 200) {
      setUserData(res.data);
      
    }
  }

  useEffect(() => {
    console.log("time: ", data.time);
    console.log("user: ", data.best_score);
    const handleScore = async () => {
      if (data.time) {
        if (data.best_score) {
          const userDifference = data.time - data.best_score;
          setDifference(userDifference);
          if (userDifference < 0) {
            submitScore()
          }
        } else {
          submitScore()
        }
      }
    };
    handleScore();
  }, [data]);

  const timeRenderer = (time) => {
    // const time = data.time;
    let text = "";
    if (time > 60000) {
      text = text + `${Math.floor(Math.floor(time / 1000) % 60)} دقیقه و`;
    }
    text = text + `${Math.floor(time / 1000)} ثانیه و`;
    text = text + " ";
    text = text + `${time % 1000} صدم ثانیه`;
    return text;
  };

  return (
    <>
      {/* <Button onClick={handler.onOpen}>Open Modal</Button> */}

      <Modal isOpen={handler.isOpen} onClose={closeHandle} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="peyda" textAlign="right">
            جزئیات این دور
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody fontFamily="peyda" textAlign="right">
            {data.time ? <>
              <p className=" text-2xl font-bold ">{data.name} عزیز</p>
              <p style={{ direction: "rtl" }}>
                تو تونستی تو {timeRenderer(data.time)} این دور رو تموم کنی{" "}
              </p>
              {difference &&
                (difference > 0 ? (
                  <p>
                    رکورد الانت {timeRenderer(difference)} از رکورد قبلی کمتر بود
                    برای همین رکورد قبلیت رو نگه میداریم
                  </p>
                ) : (
                  <p>
                    الان تونستی رکوردت رو {timeRenderer(difference * -1)} بهتر کنی{" "}
                  </p>
                ))}
              {/* <p style={{ direction: "rtl" }}>
              تا الان تو رتبه بندی امروز نفر n ام هستی
            </p> */}
            </> : <div className="flex justify-center items-center h-full" >

              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#007067"
                size="xl"
              />
            </div>}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={closeHandle}
              fontFamily="peyda"
              disabled={isLoading}
              isDisabled={isLoading}
            >
              بستن
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FinishInfo;
