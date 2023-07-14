import AsyncStorage from '@react-native-async-storage/async-storage';

export class DataBase {
  saveToken(token: string) {
    return new Promise<string>(async (resolve, reject) => {
      try {
        await AsyncStorage.setItem('TOKEN', JSON.stringify(token));
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }
  getToken() {
    return new Promise<string>(async (resolve, reject) => {
      try {
        let token = await AsyncStorage.getItem('TOKEN');
        resolve(token ? JSON.parse(token) : '');
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new DataBase();
