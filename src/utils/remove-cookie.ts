import Cookies from "js-cookie";

export default function removeCookie(name: string) {
  Cookies.remove(name);
}
