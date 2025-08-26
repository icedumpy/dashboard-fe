import z from "zod";

import { loginSchema } from "./schema";

export type LoginFormType = z.infer<typeof loginSchema>;
