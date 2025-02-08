"use client";

import { Button } from "./ui/button";
import { SignInDialog } from "@/app/components/SignInDialog";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
export function AppHeader() {
  const { data: session } = useSession();
  
  return (
    <div className="min-h-16 h-16 bg-forgeround border-b border-gray-900 w-full flex items-center justify-center hover:shadow-sm transition-shadow duration-300">
      <div className="flex items-center justify-between h-full px-4 max-w-6xl w-full">
        <h1 className="text-2xl font-bold">FT</h1>
      <div>
        {session ? <span>{session.user?.name}</span> : <SignInDialog />}
      </div>
      </div>
    </div>
  );
}
