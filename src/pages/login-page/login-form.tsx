import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema } from "./schema";
import { useAuth } from "@/hooks/auth/use-auth";

import type { LoginFormType } from "./types";

export default function LoginCard() {
  const { login, isLoading, error } = useAuth();
  const form = useForm({
    defaultValues: {
      username: "OPTH03A",
      password: "133Abc###",
    },
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(values: LoginFormType) {
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
        {error && <p className="text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          Login
        </Button>
      </form>
    </FormProvider>
  );
}
