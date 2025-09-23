import { ORDER_BY } from "@/constants/order";

export type OrderBy = (typeof ORDER_BY)[keyof typeof ORDER_BY];
