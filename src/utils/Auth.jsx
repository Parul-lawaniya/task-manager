import Cookies from "js-cookie";

export const setToken = (token) => {
  Cookies.set("authToken", token, { expires: 1 }); // 1 day
};

export const getToken = () => {
  return Cookies.get("authToken");
};

export const removeToken = () => {
  Cookies.remove("authToken");
};
