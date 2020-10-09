export const BASEURL = "http://localhost:8000/";

export const API = BASEURL + "api/";

export const fetcher = (url: string) => fetch(API + url).then((r) => r.json());
