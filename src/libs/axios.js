// libs/axios.jsx
import axios from "axios";
import { API_URL, JWT_TOKEN, SUPER_JWT_TOKEN } from "config";
import Storage from "./storage";

class Axios {
  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: 4 * 60 * 1000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  base() {
    return this.instance;
  }

  authenticated() {
    if (Storage.getItem(SUPER_JWT_TOKEN)) {
      this.instance.defaults.headers.common.Authorization = `Bearer ${Storage.getItem(
        SUPER_JWT_TOKEN
      )}`;
    } else {
      this.instance.defaults.headers.common.Authorization = `Bearer ${Storage.getItem(
        JWT_TOKEN
      )}`;
    }
    return this.instance;
  }
}

const axiosInstance = new Axios();
export default axiosInstance;