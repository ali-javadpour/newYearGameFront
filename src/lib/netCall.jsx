import axios from "axios";

const apiUrl = "http://localhost:3000/";
// const apiUrl = "https://api.libertoes.ir/";
// const apiUrl = "https://testapi.libertoes.ir/";

export const netCall = (url, method, body, forceToken) => {
  const token = localStorage.getItem("token");

    return new Promise((resolve, reject) => {
      (async () => {
        try {
          // const res = fetch(apiUrl + url, {
          //     method: method,
          //     headers: { "Content-Type": "application/json" },
          //     body: body,
          //   });
          const res = await axios({
            method: method,
            url: apiUrl + url,
            headers: {
              // "Cache-Control": "no-cache",
              // "Content-Type": "application/json",
              "access-token": forceToken ? forceToken : token,
            },
            data: body,
            //params: JSON.stringify(args)
            //data: bodyPreparer(args)
          });
  
          const result = res.data;
          resolve({ status: res.status, data: result });
        } catch (err) {
          if (err.response && err.response.status) {
            console.log(err.response);
            resolve({status: err.response.status, data: err.response.data})
            
          } else {
            resolve(["381", "Network error: " + err]);
          }
        }
      })();
    })
}