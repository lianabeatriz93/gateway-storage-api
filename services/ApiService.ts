import axios from "axios";

const ApiServiceInstance = axios.create({
  baseURL: process.env.API_BASE,
});

ApiServiceInstance.interceptors.request.use(
  (request) => {
    request.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    };
    return request;
  },
  (error) => {
    Promise.resolve(error);
  }
);

ApiServiceInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    return Promise.resolve(error.response);
  }
);

export default ApiServiceInstance;
