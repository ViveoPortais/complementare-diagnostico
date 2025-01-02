"use client";

import { Loading } from "@/components/custom/Loading";
import { Header } from "@/components/dashboard/Header";
import { Navbar } from "@/components/dashboard/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { routes } from "@/helpers/routes";
import { useLateralMenu } from "@/hooks/useMenus";
import { usePageHeight } from "@/hooks/usePageHeight";
import useSession from "@/hooks/useSession";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isMenuOpen } = useLateralMenu();
  const { role, isLogged, token } = useSession();
  const router = useRouter();
  const verifyHeight = usePageHeight();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLogged) {
        router.push("/");
        return;
      }

      if (token) api.defaults.headers.Authorization = `Bearer ${token}`;

      if (role) {
        router.push(routes[role][0].route);
        setLoading(false);
        return;
      }
    };

    checkAuth();
  }, [isLogged, role, token, router]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center w-screen h-screen bg-gray-200"
        style={{
          // backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7)), url(/images/Cartela_02.jpg)',
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7))",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <Loading size={60} />
      </div>
    );
  }

  return (
    <main className={`h-screen w-screen relative`}>
      <Navbar />

      <div
        className={`lg:absolute lg:right-0 lg:top-0 h-screen overflow-auto ${
          isMenuOpen ? "w-full lg:w-3/4" : "w-full lg:w-[calc(100%-100px)]"
        } transition-all flex flex-col items-center justify-center`}
      >
        <ScrollArea className="w-full min-h-screen">
          <Header />
          <div className="px-4 lg:px-6 py-4 lg:py-8 w-full h-full">
            {children}
          </div>
        </ScrollArea>
      </div>
      <Footer isTall={false}></Footer>
    </main>
  );
}
