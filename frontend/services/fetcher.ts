import store from "./storage/store";

//export const BASEURL = "http://localhost:8000/";

export const BASEURL = "http://vln-mobile.ijs.si/";

export const API = BASEURL + "api/";

const state = store.getState();

//console.log(state.token.token);

const myHeaders = new Headers();
myHeaders.append("Authorization", `Token ${state.token.token}`);

const requestOptions: any = {
  method: "GET",
  headers: myHeaders,
};

export const fetcher = (url: string) =>
  fetch(API + url, requestOptions).then((r) => r.json());

export const noHeadFetcher = (url: string) =>
  fetch(API + url).then((r) => r.json());
