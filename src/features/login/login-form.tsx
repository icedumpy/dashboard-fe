import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { loginSchema } from "./schema";
import { useAuth } from "@/shared/hooks/auth/use-auth";
import { cn } from "@/lib/utils";

import type { LoginForm } from "./types";

export default function LoginCard() {
  const { login, isLoginLoading, loginError } = useAuth();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginForm) {
    login(values);
  }

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p
          className={cn(
            "text-destructive h-0 overflow-hidden",
            loginError?.message && "h-fit"
          )}
        >
          {loginError?.message}
        </p>
        <Button type="submit" className="w-full" disabled={isLoginLoading}>
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
