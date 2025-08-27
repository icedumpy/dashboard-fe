import Cookies from "js-cookie";

export default function setCookie(name: string, value: string) {
  Cookies.set(name, value);
}
