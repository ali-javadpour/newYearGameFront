import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { UserContext } from "../../context/provider";
import { useContext, useEffect, useState } from "react";
import { toFarsiNumber } from "../toolbox";
import crown from "../../assets/img/crown.png"

function ScoreList({ handler }) {
  const { scoreData, vectors } = useContext(UserContext);

  const [timeLeft, setTimeLeft] = useState("");

  // Calculate time left until 23:55
  const calculateTimeLeft = () => {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 0, 0, 0); // Set to 23:55 today

    const timeDiff = end - now; // Difference in milliseconds
    if (timeDiff < 0) return "زمانی باقی نمانده است"; // If time has passed

    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${toFarsiNumber(hours)} ساعت و ${toFarsiNumber(
      minutes
    )} دقیقه و ${toFarsiNumber(seconds)} ثانیه`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* <Button onClick={handler.onOpen}>Open Modal</Button> */}

      <Modal isOpen={handler.isOpen} onClose={handler.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontFamily="peyda" fontSize="2xl">
            🚀 جدول رکورد ها{" "}
          </ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <div className=" flex flex-col gap-2 font-[peyda] font-black ">
              <p className="text-center" style={{ direction: "rtl" }}>
                زمان باقی مانده تا پایان چالش امروز:{" "}
              </p>
              <p className="text-center" style={{ direction: "rtl" }}>
                {" "}
                {timeLeft}{" "}
              </p>
              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto overflow-x-hidden scrollbar-hidden " style={{scrollbarWidth: "none"}} >
                {scoreData.map((item, index) => {
                  return (
                    <div
                      className="relative flex flex-row justify-between items-center bg-gray-300 p-3 rounded-2xl "
                      style={
                        index === 0
                          ? { backgroundColor: "#FFD700" }
                          : index === 1
                          ? { backgroundColor: "#C0C0C0" }
                          : index === 2
                          ? { backgroundColor: "#CD7F32" }
                          : { backgroundColor: "#f2f2f2" }
                      }
                    >
                      <p className="text-xs" style={{ direction: "rtl" }}>
                        {" "}
                        {toFarsiNumber(Math.floor(item.best_score / 1000))},
                        {toFarsiNumber(item.best_score % 1000)} ثانیه
                      </p>
                      <div className=" flex flex-row gap-2 items-center min-h-10 ">
                        <p> {item.name} </p>
                        <Avatar size="sm" name={item.name} src={vectors[item.vector]?.img} />
                        {/* {index === 0 ? */}
                        {/* <img width={25} src={crown} /> : */}
                        <p> {toFarsiNumber(index + 1)}</p>
                        {/* } */}
                      </div>
                      {index < 3 && (
                        <p
                          className=" absolute text-xl left-0.5 top-0.5 opacity-25 "
                          // style={
                          //   index === 0
                          //     ? { color: "#FFD700" }
                          //     : index === 1
                          //     ? { color: "#C0C0C0" }
                          //     : index === 2 && { color: "#CD7F32" }
                          // }
                        >
                          {index === 0
                            ? "۵۰٪"
                            : index === 1
                            ? "۲۰٪"
                            : index === 2 && "۱۰٪"}{" "}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handler.onClose}
              fontFamily="peyda"
            >
              بستن
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ScoreList;
