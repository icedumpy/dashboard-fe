import z from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty({ message: "Please enter your username" }),
  password: z.string().nonempty({ message: "Please enter your password" }),
});
