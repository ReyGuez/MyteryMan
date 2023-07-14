import moment from 'moment';
import {URL} from '../config';
import DataBase from '../config/DataBase';
import {VideoInfo} from '../Screens/VideoRecording/VideoRecording';

/**
 * Function to send video remotely.
 * @param attachment: Objet with video info: {name: string, type: string, uri}.
 * @returns fetch Promise<Response>.
 */
export const sendVideo = (attachment: VideoInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authToken = await DataBase.getToken();
      const body = new FormData();
      body.append('path', {
        name: attachment.name,
        type: attachment.type,
        uri: attachment.uri,
      });
      const response = await fetch(`${URL}/api/videos/store`, {
        method: 'POST',
        headers: {
          Authorization: authToken,
          'Content-Type': 'multipart/form-data',
        },
        body,
      });
      console.log('response sendVideo', response);
      resolve(response);
    } catch (e: any) {
      console.log(e);
      reject(e);
    }
  });
};

/**
 * Function to get the Bearer Token access.
 * at the moment all body params are statics.
 * The token will save at local storage.
 * @returns fetch Promise<Response>
 */
export const getToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = new FormData();
      body.append('grant_type', 'client_credentials');
      body.append('client_id', '1');
      body.append('client_secret', 'zUT73RBg6DDtfT4s4MxhMW6No6Op2jeMPwl9vwQA');
      body.append('scope', '*');
      const response = await fetch(`${URL}/oauth/token`, {
        method: 'POST',
        body,
      });
      const data = await response.json();
      console.log('data', data);
      await DataBase.saveToken(data.access_token);
      resolve(response);
    } catch (e: any) {
      console.log(e);
      reject(e);
    }
  });
};

/**
 *
 * @param type: String Log type (Error, Success, Info) etc.
 * @param message: String description of log, What happen?
 * @returns fetch Promise<Response>
 */
export const sendLogs = (type: string, message: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = {
        version: '1.0.4',
        type,
        environment: URL,
        message: JSON.stringify({
          message: message,
          user: '',
        }),
        occurred_on: moment().toISOString(),
      };
      const response = await fetch(
        'https://log.articketing.com/quakki/app/log',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
