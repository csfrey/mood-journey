import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/options";
import SignIn from "./components/SignIn";
import AuthProvider from "./context/AuthProvider";
import QueryProvider from "./context/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const matemasie = localFont({
  src: "../public/fonts/Matemasie-Regular.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-matemasie",
});

export const metadata: Metadata = {
  title: "Mood Journey",
  description: "Visualize your mood",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable} ${matemasie.variable}`}>
      <body className="font-sans text-white bg-slate-900 max-w-[1000px] mx-auto px-4">
        <header className="font-brand p-4 flex rounded-b-lg bg-gradient-to-r g-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="mr-16">
            <Link href="/" className="text-4xl">
              Mood Journey
            </Link>
          </div>
          <div className="flex-grow flex">
            {!!session ? (
              <>
                <Link
                  href="/graph"
                  className="my-auto mr-8 p-2 rounded-lg hover:bg-blue-500"
                >
                  Graph
                </Link>
                <Link
                  href="/journal"
                  className="my-auto p-2 rounded-lg hover:bg-blue-500"
                >
                  Journal
                </Link>
              </>
            ) : null}
          </div>
          {!!session ? (
            <div className="my-auto flex">
              <div className="mr-2 my-auto">
                <div className="text-xs text-right">Signed in as:</div>
                <div className="text-sm text-right">{session?.user?.email}</div>
              </div>
              <Link
                href="/api/auth/signout"
                className="my-auto p-2 rounded-lg bg-blue-400 hover:bg-blue-500"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <SignIn />
          )}
        </header>
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
