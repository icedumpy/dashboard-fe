import Cookies from "js-cookie";

export default function setCookie(name: string, value: string) {
  console.log("Setting cookie:", name, value);
  Cookies.set(name, value);
}
