//export const BASEURL = "http://localhost:8000/";
export const BASEURL = "https://backend.videolectures.net/";
export const API = BASEURL + "api/";

//console.log(state.token.token);

const requestOptions = (token: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Token ${token}`);
  return {
    method: "GET",
    headers: myHeaders,
  };
};

export const fetcher = (url: string, token: string) =>
  fetch(API + url, requestOptions(token)).then((r) => r.json());

export const noHeadFetcher = (url: string) =>
  fetch(API + url).then((r) => r.json());
