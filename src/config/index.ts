import axios, {AxiosPromise, AxiosResponse, Method} from 'axios';
import DataBase from './DataBase';
export const URL = 'https://video.themysteryman.com';
export const instance = axios.create();

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return new Promise(async (resolve, reject) => {
      try {
        if (error.response.status !== 401) {
          return reject(error);
        }
        const userInfo: AxiosResponse<any, any> = await axios.post(
          '/oauth/token',
          {
            grant_type: 'client_credentials',
            client_id: '1',
            client_secret: 'zUT73RBg6DDtfT4s4MxhMW6No6Op2jeMPwl9vwQA',
            scope: '*',
          },
        );
        await DataBase.saveToken(userInfo.data.token.access_token);
        const config = error.config;
        config.headers.authorization = `Bearer ${userInfo.data.token.access_token}`;
        const response = await axios.request(config);
        resolve(response);
      } catch (e) {
        reject(error);
      }
    });
  },
);

export const axiosPostJSONToken = (
  method: Method,
  url: string,
  body: string,
  token: string,
) =>
  instance({
    method,
    url,
    data: body,
    headers: {authorization: token, 'Content-Type': 'application/json'},
  });

export const axiosPostFormDataToken = (
  method: Method,
  url: string,
  body: FormData,
  token: string,
) =>
  instance({
    method,
    url,
    data: body,
    headers: {authorization: token, 'Content-Type': 'multipart/form-data'},
  });

export const axiosGetToken = <T>(
  url: string,
  headers: {
    Authorization: string;
    'Content-Type'?: string;
    Accept?: 'application/json';
  },
): AxiosPromise<T> =>
  instance({
    method: 'GET',
    url,
    headers,
  });

export const axiosPostFormData = (
  method: Method,
  url: string,
  body: FormData,
) =>
  axios({
    method,
    url,
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const axiosPostJSON = (
  method: Method,
  url: string,
  body: any,
  timeout?: number,
) =>
  instance({
    method,
    url,
    data: body,
    headers: {'Content-Type': 'application/json'},
    timeout: timeout,
  });
