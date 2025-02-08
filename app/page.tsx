"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import HomePage from "@/scenes/home-page"

export default function Home() {
  const { data: session } = useSession()

  return ( 
           <HomePage />
  )
}

