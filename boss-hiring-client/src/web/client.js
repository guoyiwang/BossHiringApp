import axios from "axios";
import { serverConfig } from "../app/config";

const baseURL = serverConfig.url; 
/**
 *
 * @param {String} url
 * @param {Object} date             body object for http request
 * @param {Object} customConfig     costom config like params
 */
export async function client(url, { body, ...customConfig } = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const config = {
    url: baseURL + url,
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    withCredentials: true, // CORS request should be made with credentials(cookies)
  };
  if (body) {
    config.data = body;
  }
  return axios(config);
}

client.get = function (url, customConfig = {}) {
  return client(url, customConfig);
};

client.post = function (url, body, customConfig = {}) {
  return client(url, { body, ...customConfig });
};
