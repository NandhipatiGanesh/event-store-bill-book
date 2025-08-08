import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getString(key: string) {
  return AsyncStorage.getItem(key);
}

export async function setString(key: string, val: string) {
  return AsyncStorage.setItem(key, val);
}

export async function remove(key: string) {
  return AsyncStorage.removeItem(key);
}
