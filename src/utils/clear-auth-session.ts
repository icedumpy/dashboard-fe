import Cookies from "js-cookie";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/contants/auth";

export default function clearAuthSession() {
  Cookies.remove(ACCESS_TOKEN);
  Cookies.remove(REFRESH_TOKEN);
}
