export const API = "http://192.168.1.115:8000/api/";

export const fetcher = (url: string) => fetch(API + url).then((r) => r.json());
