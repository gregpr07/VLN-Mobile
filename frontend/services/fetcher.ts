const API = "http://localhost:8000/api/";

export const fetcher = (url: string) => fetch(API + url).then((r) => r.json());
