import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  PinInput,
  PinInputField,
  useToast,
} from "@chakra-ui/react";
import bg from "../assets/img/bg.jpeg";
import { ArrowBackIcon, PhoneIcon } from "@chakra-ui/icons";
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

const LoginPage = ({ showtoast }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileInput, setMobileInput] = useState("");
  const [page, setPage] = useState("login");
  const [otpInput, setOtpInput] = useState("");
  const [secondLeft, setSecondLeft] = useState(4);
  const [showResendButton, setShowResendButton] = useState(false);

  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  const startCount = () => {
    setInterval(() => setSecondLeft((e) => e - 1), 1000);
  };
  useEffect(() => {
    if (secondLeft === 0) {
      clearInterval();
      setShowResendButton(true);
      setSecondLeft(120)
    }
  }, [secondLeft]);

  const validateNumber = (number) => {
    if (
      (number.length === 10 && number[0] === "9") ||
      (number.length === 11 && number.substring(0, 2) === "09")
    ) {
      if (number.length === 10) {
        return "0" + number;
      } else {
        return number;
      }
    } else {
      return false;
    }
  };

  const submit = async () => {
    console.log(mobileInput);
    const validNumber = validateNumber(mobileInput);
    console.log(validNumber);

    if (!!validNumber) {
      const sendingData = { phone: validNumber };
      console.log("sendingData: ", sendingData);
      setIsLoading(true);
      const res = await netCall("otp_request", "post", sendingData);
      setOtpInput("")
      console.log("res: ", res);
      if (!!res.data.Success) {
        showtoast("success", "رمز یک بار مصرف با موفقیت ارسال شد");
        setPage("otp");
        startCount();
      } else if (!!res.data.Error) {
        showtoast("error", res.data.Error);
        setPage("otp");
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
      setIsLoading(true)
      const sendData = { phone: mobileInput, token: validCode };
      const res = await netCall("otp_check", "post", sendData);
      console.log(res);
      
      if (!!res.data.login) {
        const token = res.data.token;
        localStorage.setItem("token", token);
        setIsLoggedIn(true)
      }
    }
    setIsLoading(false)
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
      />
      <img
        src={hyacinth}
        className=" absolute w-28 top-42 right-10 rotate-12 blur-[0.3px] "
      />
      <img
        src={flower}
        className=" absolute w-28 top-42 left-10 -rotate-12 blur-[0.3px] "
      />
      <img
        src={apple}
        className=" absolute w-24 top-13 left-20 -rotate-[25deg] blur-[1.5px] "
      />
      <img
        src={egg}
        className=" absolute w-20 bottom-10 left-20 -rotate-[15deg] blur-[3px] "
      />
      <img
        src={coin}
        className=" absolute w-24 bottom-40 left-20 blur-[1.5px] "
      />
      <img
        src={garlic}
        className=" absolute w-20 bottom-5 right-20 rotate-[15deg] blur-[2px] "
      />
      <img
        src={grass}
        className=" absolute w-28 bottom-40 right-10 rotate-[15deg] z-10 "
      />
      <div className="relative w-4/5 min-w-[300px] min-h-60 bg-white rounded-2xl flex flex-col justify-center px-10 py-4 shadow-2xl ">
        <img src={textLogo} />
        {page === "login" ? (
          <div>
            <p className=" font-bold text-center ">
              آماده ای بازیو شروع کنیم؟ شمارتو وارد کن که بریم
            </p>
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
            </Button>
          </div>
        ) : (
          page === "otp" && (
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
                <PinInput
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
                </PinInput>
              </div>
              {showResendButton ? (
                <p className=" text-blue-600 font-bold underline cursor-pointer text-center " onClick={submit} >ارسال دوباره کد</p>
              ) : (
                <div className=" flex flex-row justify-center items-center w- full ">
                  <p className="w-10">
                    {Math.round(secondLeft / 60)}:{secondLeft % 60}
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
          )
        )}
      </div>
    </div>
  );
};

export default LoginPage;
