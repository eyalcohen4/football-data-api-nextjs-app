"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SignInDialog() {
  const [isRegister, setIsRegister] = useState(false);
  const searchParams = useSearchParams();
  const showSignIn = searchParams.get("showSignIn");
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open || showSignIn === "true"} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {session ? (
          <Button variant="outline">Sign Out</Button>
        ) : (
          <Button variant="outline">Sign In</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRegister ? "Register" : "Sign In"}</DialogTitle>
        </DialogHeader>
        {isRegister ? (
          <RegisterForm
            onSuccess={() => setOpen(false)}
            onSignInClick={() => setIsRegister(false)}
          />
        ) : (
          <SignInForm
            onSuccess={() => setOpen(false)}
            onRegisterClick={() => setIsRegister(true)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
interface SignInFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
}

export function SignInForm({ onSuccess, onRegisterClick }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      onSuccess();
      router.push("/");
    } else {
      console.error("Sign in failed");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button onClick={onRegisterClick} variant="ghost">
          <span className="text-sm text-muted-foreground">
            Don't have an account? Sign up
          </span>
        </Button>
      </div>
    </>
  );
}


interface RegisterFormProps {
  onSuccess: () => void;
  onSignInClick: () => void;
}

export function RegisterForm({ onSuccess, onSignInClick }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        onSuccess();
        router.push("/");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Button onClick={onSignInClick} variant="ghost">
          <span className="text-sm text-muted-foreground">
            Don't have an account? Sign up
          </span>
        </Button>
      </div>
    </>
  );
}