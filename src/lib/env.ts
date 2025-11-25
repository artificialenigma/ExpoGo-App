import Constants from 'expo-constants';

// `process` may not be available in all RN environments; declare to avoid TS errors
declare const process: any;

export type EnvConfig = {
  API_URL: string;
  SECRET_KEY?: string;
  VAR_NUMBER?: number;
  VAR_BOOL?: boolean;
  NAME?: string;
  VERSION?: string;
  WEATHER_API_KEY?: string;
};

const extra =
  (Constants.expoConfig && (Constants.expoConfig as any).extra) || {};

export const Env: EnvConfig = {
  API_URL:
    extra.API_URL ||
    (typeof process !== 'undefined' ? process.env.API_URL : undefined) ||
    'https://dummyjson.com/',
  SECRET_KEY:
    extra.SECRET_KEY ||
    (typeof process !== 'undefined' ? process.env.SECRET_KEY : undefined) ||
    undefined,
  VAR_NUMBER: extra.VAR_NUMBER
    ? Number(extra.VAR_NUMBER)
    : typeof process !== 'undefined' && process.env.VAR_NUMBER
      ? Number(process.env.VAR_NUMBER)
      : 0,
  VAR_BOOL: extra.VAR_BOOL
    ? String(extra.VAR_BOOL) === 'true'
    : typeof process !== 'undefined' && process.env.VAR_BOOL
      ? String(process.env.VAR_BOOL) === 'true'
      : false,
  NAME:
    (Constants.expoConfig && (Constants.expoConfig as any).name) ||
    (typeof process !== 'undefined' ? process.env.APP_NAME : undefined) ||
    'expo-go-villa-sample',
  VERSION:
    (Constants.expoConfig && (Constants.expoConfig as any).version) ||
    (typeof process !== 'undefined' ? process.env.APP_VERSION : undefined) ||
    '1.0.0',
  WEATHER_API_KEY:
    extra.WEATHER_API_KEY ||
    (typeof process !== 'undefined'
      ? process.env.WEATHER_API_KEY
      : undefined) ||
    '5dd736d8fe77f0e377e460972c727c4c',
};

export default Env;
