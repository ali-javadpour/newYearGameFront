import axios from "axios";

const apiUrl = "http://localhost:8080/";
const token = localStorage.getItem("token");

export const netCall = (url, method, body) => {

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
              "access-token": token,
            },
            data: body,
            //params: JSON.stringify(args)
            //data: bodyPreparer(args)
          });
  
          const result = res.data;
          resolve({ status: res.status, data: result });
        } catch (err) {
          if (err.response && err.response.status) {
            if (err.response.status === 400) {
              resolve([400, "Bad Request"]);
            } else if (err.response.status === 401) {
              resolve([401, "unAuthorized", err.response.data.message]);
            } else if (err.response.status === 404) {
              resolve([404, "not found", err.response.data.message]);
            } else if (err.response.status === 403) {
              resolve([403, "forbidden"]);
            } else if (err.response.status === 406) {
              resolve([406, "Not Acceptable"]);
            } else if (err.response.status === 415) {
              resolve([415, "Unsupported Media Type"]);
            } else {
              alert(err);
              resolve(["381", "Network error: " + err]);
            }
          } else {
            resolve(["381", "Network error: " + err]);
          }
        }
      })();
    })
}