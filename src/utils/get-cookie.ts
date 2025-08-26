import Cookies from "js-cookie";

export default function getCookie(name: string) {
  return Cookies.get(name);
}
