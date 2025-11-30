import {makeAutoObservable} from 'mobx';
import {makePersistable, hydrateStore} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '@/lib/logger';

export type TokenType = {
  access: string;
  refresh: string;
};

export type AuthStatus = 'idle' | 'signOut' | 'signIn';

export class AuthStore {
  token: TokenType | null = null;
  status: AuthStatus = 'idle';
  isFirstTime = true;

  constructor() {
    makeAutoObservable(this);

    // Configure automatic persistence
    makePersistable(this, {
      name: 'AuthStore',
      properties: ['token', 'status', 'isFirstTime'],
    });
  }

  signIn(tokenData: TokenType) {
    logger.debug('signIn called with:', tokenData);
    this.token = tokenData;
    this.status = 'signIn';
    logger.debug('Auth status set to signIn');
  }

  setIsFirstTime(value: boolean) {
    this.isFirstTime = value;
  }

  async signOut() {
    // Clear the persisted data from AsyncStorage
    await AsyncStorage.removeItem('AuthStore');

    // Reset the store state
    this.token = null;
    this.status = 'signOut';
    this.isFirstTime = true;
  }

  hydrate = async (): Promise<void> => {
    await hydrateStore(this);
  };
}
