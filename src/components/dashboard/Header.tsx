"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { BsPersonBadge } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { LuLogOut, LuFolder } from "react-icons/lu";

import api from "@/services/api";
import useSession from "@/hooks/useSession";
import { useLateralRightMenu, useMobilelMenu } from "@/hooks/useMenus";
import { routes } from "@/helpers/routes";

import { MenuIcon } from "../custom/Icon";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";

import { isMobile } from 'react-device-detect';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useSession();
  const { isMobileMenuOpen, changeMobileMenu } = useMobilelMenu();
  const { isMenuOpen, changeMenu } = useLateralRightMenu();
  const [currentRoute, setCurrentRoute] = useState("");
  const role = auth.role;

  function handleLogout() {
    router.push("/");
    auth.onLogout();
    api.defaults.headers.Authorization = "";
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      changeMobileMenu(isMobileMenuOpen);
    }

    if (isMenuOpen) {
      changeMenu(isMenuOpen);
    }
  }, [pathname]);

  useEffect(() => {
    if (role !== "") {
      let findRoute = routes[role].find((x) => `${x.route}` === pathname);

      if (pathname.includes("profile")) {
        setCurrentRoute("Meus Dados");
        return;
      }

      if (findRoute) {
        setCurrentRoute(findRoute.text);
      } else {
        setCurrentRoute("");
      }
    }
  }, [auth, pathname]);

  return (
    <>
      <header
        id="mobile-header"
        className="flex lg:hidden h-28 w-full border-b-2 border-zinc-100 items-center justify-between px-8 bg-white text-red-400"
      >
        <div>
          <Image
            src={`/images/logo-purple.png`}
            width={250}
            height={50}
            alt="Programa FenOmenal"
            className="mt-2"
          />
          <span className="text-main-green text-sm lg:hidden font-normal ml-12">
            {currentRoute}
          </span>
        </div>
        <div className="flex items-center justify-center gap-6">
          <span className="text-red-400 font-semibold text-base">
            {auth.name.includes(" ") ? auth.name.split(" ")[0] : auth.name}
          </span>
          <div
            className="hover:opacity-70 cursor-pointer"
            onClick={() => changeMobileMenu(isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <IoClose size={30} />
            ) : (
              <PiDotsThreeVerticalBold size={30} />
            )}
          </div>
        </div>
      </header>

      <nav
        id="mobile-nav"
        className={`absolute top-28 left-0 h-[calc(100vh-102px)] w-screen text-zinc-800 z-50 bg-white ${isMobileMenuOpen ? "flex lg:hidden" : "hidden"
          }`}
      >
        <ul className={`flex flex-col mt-8 gap-2 w-full px-4`}>
          {role !== "" &&
            routes[role].map((profileRoutes) => {
              return (
                <Link
                  key={profileRoutes.route}
                  href={`${profileRoutes.route}`}
                  className={`flex gap-x-2 cursor-pointer hover:bg-zinc-100 rounded-lg p-4 ${pathname === `${profileRoutes.route}` &&
                    "text-red-400 hover:text-zinc-800"
                    }`}
                >
                  <MenuIcon icon={profileRoutes.icon} size={24} />
                  {profileRoutes.text}
                </Link>
              );
            })}

          <Link
            href={`/dashboard/profile`}
            className={`flex gap-x-2 cursor-pointer hover:bg-zinc-100 rounded-lg p-4 ${pathname === `/dashboard/profile` &&
              "text-red-400 hover:text-zinc-800"
              }`}
          >
            <BsPersonBadge size={24} />
            Meus Dados
          </Link>
          <a
            href="/Regulamento_Fenomenal.pdf"
            className={`flex gap-x-2 cursor-pointer hover:bg-zinc-100 rounded-lg p-4`}
            download={isMobile ? true : false}
            target={!isMobile ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            <LuFolder size={24} />
            <span className="text-lg">Regulamento</span>
          </a>
          <Link
            href={`/`}
            className={`flex gap-x-2 cursor-pointer hover:bg-zinc-100 rounded-lg p-4 `}
            onClick={handleLogout}
          >
            <LuLogOut size={24} />
            Logout
          </Link>
        </ul>
      </nav>

      <header
        id="desktop-header"
        className="hidden lg:flex h-28 w-full border-b border-zinc-200 items-center justify-between px-12"
      >
        <div>
          <h1 className="text-lg lg:text-2xl font-semibold important-color-text flex mt-5">
            Bem-vindo(a) {auth.role === "doctor" && "Dr(a)"} {auth.name}!
          </h1>
          <span className="text-xs lg:text-base font-normal">
            {currentRoute}
          </span>
        </div>

        <Image
          src="/images/logo-purple.png"
          width={240}
          height={80}
          alt="logoConecta"
          className="mr-7"
        />
        
      </header>
    </>
  );
}
