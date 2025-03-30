import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  PinInput,
  PinInputField,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import bg from "../assets/img/bg.jpeg";
import { ArrowBackIcon, AtSignIcon, PhoneIcon } from "@chakra-ui/icons";
import textLogo from "../assets/img/HappyNowruz.png";
import clock from "../assets/img/clock.svg";
import apple from "../assets/img/apple.svg";
import coin from "../assets/img/coin.svg";
import egg from "../assets/img/egg.svg";
import flower from "../assets/img/flower.svg";
import garlic from "../assets/img/garlic.svg";
import grass from "../assets/img/grass.svg";
import hyacinth from "../assets/img/hyacinth.svg";
import { useContext, useEffect, useState } from "react";
import { netCall } from "../lib/netCall";
import { UserContext } from "../context/provider";
import { isAllEnglishNumbers, toEnglishNumber } from "../components/toolbox";
import OTPInput from "react-otp-input";
import "../App.css";

const LoginPage = ({ showtoast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [page, setPage] = useState("login");
  const [otpInput, setOtpInput] = useState("");
  const [secondLeft, setSecondLeft] = useState(120);
  const [showResendButton, setShowResendButton] = useState(false);
  const [reservedToken, setReservedToken] = useState("");
  const [selectedIconId, setSelectedIconId] = useState(4)

  const { isLoggedIn, setIsLoggedIn, isNewUser, setIsNewUser, setUserData, vectors } =
    useContext(UserContext);

    const { isOpen, onToggle, onClose, onOpen } = useDisclosure()

    useEffect(()=>{
      onOpen()
      // setTimeout(() => {
      //   onClose()
      // }, 1000);
    },[])

  const startCount = () => {
    setInterval(() => setSecondLeft((e) => e - 1), 1000);
  };
  useEffect(() => {
    if (secondLeft === 0) {
      clearInterval();
      setShowResendButton(true);
      setSecondLeft(120);
    }
  }, [secondLeft]);

  const validateNumber = (number) => {
    const isEnglish = isAllEnglishNumbers(number);
    let validNumber = "";
    if (isEnglish) {
      validNumber = number;
    } else {
      validNumber = toEnglishNumber(number);
    }
    if (
      (validNumber.length === 10 && validNumber[0] === "9") ||
      (validNumber.length === 11 && validNumber.substring(0, 2) === "09")
    ) {
      if (validNumber.length === 10) {
        return "0" + validNumber;
      } else {
        return validNumber;
      }
    } else {
      return false;
    }
  };

  const submit = async () => {
    console.log(toEnglishNumber(mobileInput));
    const validNumber = validateNumber(mobileInput);
    console.log(validNumber);

    if (!!validNumber) {
      const sendingData = { phone: validNumber };
      console.log("sendingData: ", sendingData);
      setIsLoading(true);
      const res = await netCall("otp_request", "post", sendingData);
      setOtpInput("");
      console.log("res: ", res);
      if (!!res.data?.Success) {
        showtoast("success", "رمز یک بار مصرف با موفقیت ارسال شد");
        setPage("otp");
        startCount();
      } else if (!!res.data?.Error) {
        showtoast("error", res.data.Error);
        // setPage("otp");
      } else {
        showtoast(
          "error",
          "به نظر میاد یک مشکلی پیش اومده، دوباره امتحان کنید"
        );
      }
    } else {
      showtoast("warning", "شماره موبایل وارد شده صحیح نیست");
    }
    setIsLoading(false);
  };

  const codeSubmit = async (code) => {
    const validCode = code ? code : otpInput;
    console.log(validCode);
    if (validCode && validCode.length === 5) {
      setIsLoading(true);
      const sendData = { phone: mobileInput, token: validCode };
      const res = await netCall("otp_check", "post", sendData);
      console.log(res);

      if (!!res.data?.login) {
        console.log(res.data);
        const token = res.data.token;
        if (!!res.data.user.name && !!res.data.user.vector) {
          localStorage.setItem("token", token);
          setIsLoggedIn(true);
          setUserData(res.data.user);
        } else {
          console.log("my name: ",res.data.user.name);
          
          if(res.data.user.name){
            setNameInput(res.data.user.name)
          }
          setIsNewUser(true);
          setPage("getName");
          setReservedToken(token);
        }
      } else if (!!res.data?.Error) {
        showtoast("error", res.data.Error);
      } else {
        showtoast("error", "مشکلی در ارتباط با سرور به وجود آمده");
      }
    }
    setIsLoading(false);
  };

  const submitName = async () => {
    const validateName = () => {
      // Clean the name input by trimming and reducing multiple spaces
      const cleanedName = nameInput.trim().replace(/\s+/g, " ");
      return cleanedName;
    };

    const cleanedName = validateName();
    // Now you can use cleanedName to send to the database
    console.log("Cleaned Name: ", cleanedName.length);
    // Add your database submission logic here

    if (!!cleanedName && cleanedName.length > 2) {
      const sendData = { name: cleanedName, vector: selectedIconId };
      const res = await netCall("user_name", "patch", sendData, reservedToken);
      if (res.status === 200) {
        setUserData(res.data);
        localStorage.setItem("token", reservedToken);
        setIsLoggedIn(true);
      }
      console.log("res: ", res);
    } else {
      showtoast("warning", "لطفا نام درستی را وارد کنید");
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center font-[peyda] ">
      <div
        style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}
        className="absolute inset-0 w-full h-full blur-xs"
      ></div>
      <img
        src={clock}
        className=" absolute w-20 top-10 right-15 rotate-12 blur-[3px] animate-floating "
        style={{
          animation: "float1 30s ease-in-out infinite",
        }}
      />
      <img
        src={hyacinth}
        className=" absolute w-28 top-42 right-10 rotate-12 blur-[0.3px] "
        style={{
          animation: "float3 25s ease-in-out infinite",
        }}
      />
      <img
        src={flower}
        className=" absolute w-28 top-42 left-10 -rotate-12 blur-[0.3px] "
        style={{
          animation: "float3 20s ease-in-out infinite",
        }}
      />
      <img
        src={apple}
        className=" absolute w-24 top-13 left-20 -rotate-[25deg] blur-[1.5px] "
        style={{
          animation: "float2 25s ease-in-out infinite",
        }}
      />
      <img
        src={egg}
        className=" absolute w-20 bottom-10 left-20 -rotate-[15deg] blur-[3px] "
        style={{
          animation: "float2 25s ease-in-out infinite",
        }}
      />
      <img
        src={coin}
        className=" absolute w-24 bottom-40 left-20 blur-[1.5px] "
        style={{
          animation: "float3 20s ease-in-out infinite",
        }}
      />
      <img
        src={garlic}
        className=" absolute w-20 bottom-5 right-20 rotate-[15deg] blur-[2px] "
        style={{
          animation: "float1 25s ease-in-out infinite",
        }}
      />
      <div className="relative w-4/5 min-w-[300px] min-h-60 bg-white rounded-2xl flex flex-col justify-center px-10 py-4 shadow-2xl ">
        <img
          src={grass}
          className=" absolute w-28 bottom-[-100px] right-0 rotate-[15deg] z-10 "
          style={{
            animation: "float4 20s ease-in-out infinite",
          }}
        />
        <img src={textLogo} />
        {page === "login" ? (
          <div>
            <p className=" font-bold text-center "> فرصت بازی تموم شده، ممنون که تو این مدت اومدی و بازی کردی </p>
            <p className=" font-bold text-center " style={{direction: "rtl"}} > سال نوتون مبارک ☺️ </p>
            {/* <p className=" font-bold text-center ">آماده ای بازیو شروع کنیم؟</p>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <PhoneIcon color="gray.300" />
              </InputLeftElement>
              <Input
                type="tel"
                placeholder="شماره موبایل"
                value={mobileInput}
                onChange={(e) => setMobileInput(e.target.value)}
                isDisabled={isLoading}
              />
            </InputGroup>
            <Button
              isLoading={isLoading}
              colorScheme="teal"
              width="100%"
              marginTop="3"
              onClick={submit}
            >
              بزن بریم
            </Button> */}
          </div>
        ) : page === "otp" ? (
          <div>
            <p className=" font-bold text-center ">
              کدی که از طریق پیامک براتون ارسال شده رو اینجا وارد کنید
            </p>
            <div className=" w-full flex flex-row justify-center items-center ">
              <ArrowBackIcon />
              <p onClick={() => setPage("login")}>ویرایش</p>
              <p className=" text-center bg-gray-100 px-2 py-1 rounded-2xl w-fit text-sm ">
                {mobileInput}
              </p>
            </div>
            <div className=" w-full mt-3 flex justify-center items-center ">
              {/* <PinInput
                  onChange={(e) => setOtpInput(e)}
                  onComplete={(e) => codeSubmit(e)}
                  otp={true}
                  isDisabled={isLoading}
                  placeholder="-"
                  value={otpInput}
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput> */}
              <OTPInput
                value={otpInput}
                onChange={(val) => {
                  if (val.length === 5) {
                    codeSubmit(val);
                  } else {
                    setOtpInput(val);
                  }
                }}
                shouldAutoFocus
                numInputs={5}
                inputType="number"
                // renderSeparator={<span>-</span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    disabled={isLoading}
                    style={{
                      width: "40px",
                      height: "40px",
                      padding: 0,
                      textAlign: "center",
                      marginRight: "0.25rem",
                      marginLeft: "0.25rem",
                      background: "inherit",
                      border: "1px gray solid",
                      borderRadius: "10px",
                    }}
                  />
                )}
              />
            </div>
            {showResendButton ? (
              <p
                className=" text-blue-600 font-bold underline cursor-pointer text-center "
                onClick={submit}
              >
                ارسال دوباره کد
              </p>
            ) : (
              <div className=" flex flex-row justify-center items-center w- full ">
                <p className="w-10">
                  {Math.floor(secondLeft / 60)}:{secondLeft % 60}
                </p>
                <p>تا درخواست مجدد ارسال کد</p>
              </div>
            )}
            <Button
              isLoading={isLoading}
              colorScheme="teal"
              width="100%"
              marginTop="3"
              onClick={() => codeSubmit(null)}
            >
              ادامه
            </Button>
          </div>
        ) : (
          page === "getName" && (
            <div>
              <p className=" font-bold text-center ">
                اسمتو اینجا وارد کن که شروع کنیم
              </p>
              <div className=" flex flex-row gap-3 ">
                <InputGroup style={{ direction: "rtl" }}>
                  <Input
                    type="text"
                    placeholder="نام و نام خانوادگی"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    isDisabled={isLoading}
                    textAlign="right"
                  />
                </InputGroup>
                <Popover
                isOpen={isOpen}
                onClose={onClose}
                >
                  <PopoverTrigger>
                  <img style={{ width: "40px", height: "40px" }} src={vectors[selectedIconId].img} onClick={onOpen} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    {/* <PopoverCloseButton />
                    <PopoverHeader>Confirmation!</PopoverHeader> */}
                    <PopoverBody>
                      <div className=" flex flex-row gap-3 w-full overflow-x-auto scrollbar-hidden " >
                        {vectors.map((item)=>{
                          return(
                            <img style={ selectedIconId === item.id ? { width: "40px", height: "40px", border:"2px green solid", borderRadius: "10px" } : { width: "40px", height: "40px" }} src={item.img} onClick={() => setSelectedIconId(item.id)} />
                          )
                        })}
                      </div>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                isLoading={isLoading}
                colorScheme="teal"
                width="100%"
                marginTop="3"
                onClick={submitName}
              >
                بزن بریم
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LoginPage;
