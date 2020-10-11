import store from "./store";

export const BASEURL = "http://192.168.1.115:8000/";

export const API = BASEURL + "api/";

const state = store.getState();

console.log(state.token.token);

var myHeaders = new Headers();
myHeaders.append("Authorization", `Token ${state.token.token}`);

const requestOptions: any = {
  method: "GET",
  headers: myHeaders,
};

export const fetcher = (url: string) =>
  fetch(API + url, requestOptions).then((r) => r.json());

export const noHeadFetcher = (url: string) =>
  fetch(API + url).then((r) => r.json());
