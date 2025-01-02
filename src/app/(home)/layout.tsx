"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import { routes } from "@/helpers/routes";
import { useLateralMenu } from "@/hooks/useMenus";
import useSession from "@/hooks/useSession";

import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import path from "path";
import { Ebook } from "@/components/Ebook";
import { Documents } from "@/components/Documents";
import { usePageHeight } from "@/hooks/usePageHeight";
import { Header } from "@/components/dashboard/Header";
import Terms from "./terms/page";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const { isMenuOpen } = useLateralMenu();
  const { role, isLogged } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const verifyHeight = usePageHeight();

  useEffect(() => {
    role && router.push(routes[role][0].route);
  }, [routes, role, router]);

  useEffect(() => {
    if (
      !isLogged &&
      pathname !== "/terms" 

    ) {
      router.push("/terms");
    }
  }, [isLogged, router, pathname]);


  if (pathname === "/terms") {
    return <Terms />;
  }

 
  return (
    <main className="h-screen w-screen overflow-x-hidden overflow-y-hidden">
      <header id="desktop-header" className="hidden lg:flex h-28 w-full border-b border-zinc-200 items-center px-12">
        <Image
          src="/images/bms_logo_300.jpg"
          width={240}
          height={80}
          alt="logoConecta"
        />
      </header>
      <div className="w-full h-full md:h-screen flex justify-center backgroundHome items-center">
        <div className="flex items-center justify-center xl:col-span-2 mb-10">
          <ScrollArea className="bg-white flex flex-col items-center justify-center p-4 md:p-8 mx-4 max-h-[90vh] md:max-h-[85vh]">
            <div className="w-full flex items-center justify-center">
              <Image
                src="/images/logo-purple.png"
                width={240}
                height={80}
                alt="logoConecta"
                className="mb-7"
              />
            </div>
            {children}
          </ScrollArea>
        </div>
      </div>
      <Footer isTall={verifyHeight} />
    </main>
  );
}
