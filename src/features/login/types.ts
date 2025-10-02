import z from "zod";

import { loginSchema } from "./schema";

export type LoginForm = z.infer<typeof loginSchema>;
