import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppHeader } from "@/components/header"
import "./globals.css"
import type React from "react" // Added import for React
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { ClientProvider } from "@/components/client-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Soccer App",
  description: "Track soccer competitions and fixtures",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://cdnjs.middleware.io/browser/libs/0.0.2/middleware-rum.min.js"
          type="text/javascript"
        ></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            if (window.Middleware) {
              Middleware.track({
                serviceName: "Soccer App",
                projectName: "Soccer App",
                accountKey: "${process.env.MIDDLEWARE_ACCOUNT_KEY}",
                target: "https://${process.env.MIDDLEWARE_DOMAIN}.middleware.io",
                defaultAttributes: {
                  "app.version": "1.0.0",
                },
            })}`,
          }}
        />
      </head>
      <body className={`${inter.className} flex flex-col dark`}>
        <Suspense>
          <Providers>
            <ClientProvider />
            <SidebarProvider>
              <div className="flex flex-col w-full">
                <div className="min-h-16">
                  <AppHeader />
                </div>
                <div className="w-full flex items-center justify-center max-h-full flex-1">
                  <main className="max-w-6xl w-full flex-1 max-h-full p-4 h-full">
                    <div className="flex flex-col py-2 flex-1">{children}</div>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </Providers>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}

