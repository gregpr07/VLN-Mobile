export const BASEURL = "http://192.168.1.115:8000/";

export const API = BASEURL + "api/";

export const fetcher = (url: string) => fetch(API + url).then((r) => r.json());
