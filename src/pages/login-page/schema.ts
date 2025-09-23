import z from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty({ error: "Please enter your username" }),
  password: z.string().nonempty({ error: "Please enter your password" }),
});
