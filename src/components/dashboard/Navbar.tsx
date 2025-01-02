"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { HiChevronDoubleLeft } from "react-icons/hi";

import { useLateralMenu } from "@/hooks/useMenus";
import { routes } from "@/helpers/routes";
import useSession from "@/hooks/useSession";

import { MenuIcon } from "../custom/Icon";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isMenuOpen, changeMenu } = useLateralMenu();
  const auth = useSession();
  const role = auth.role;

  function handleLogout() {
    router.push("/");
    auth.onLogout();
    api.defaults.headers.Authorization = "";
  }

  return (
    <nav
      className={`${isMenuOpen ? "w-1/4" : "w-[100px]"
        } hidden lg:flex relative h-full transition-all border-r border-zinc-200 shadow-lg px-4 pb-6  flex-col items-center text-zinc-800`}
    >
      <div className="w-full h-28 important-color-nav flex items-center justify-center gap-2 mt-8 pb-8">
        <Image
          src="/images/bms_logo_300.jpg"
          width={250}
          height={90}
          alt="logo"
          className={`hidden mt-2 ${isMenuOpen && "lg:flex"}`}
        />
      </div>

      <ul
        className={`flex flex-col mt-12 ${!isMenuOpen && "items-center"
          } gap-4 w-full px-4`}
      >
        {role !== "" &&
          routes[role].map((profileRoutes) => {
            return (
              <Link
                key={profileRoutes.route}
                href={`${profileRoutes.route}`}
                className={`flex gap-x-2 items-center cursor-pointer hover:bg-zinc-100 rounded-lg p-6 ${pathname === `${profileRoutes.route}` &&
                  "important-color text-white hover:text-zinc-800"
                  }`}
              >
                <MenuIcon icon={profileRoutes.icon} size={24} />
                {isMenuOpen && profileRoutes.text}
              </Link>
            );
          })}
      </ul>
      <ul className={`flex flex-col ${!isMenuOpen && "items-center"} gap-4 w-full px-4`}>
        <div
          className="flex items-start gap-2 cursor-pointer text-zinc-800 p-6 rounded-lg bg-white hover:bg-zinc-100 mt-2"
          onClick={() => handleLogout()}>

          <IoLogOutOutline size={24} className={` ${!isMenuOpen && "rotate-180"} transition-all`}></IoLogOutOutline>
          {isMenuOpen && <span>Sair</span>}

        </div>
      </ul >

      <div className={`flex flex-col ${!isMenuOpen && "items-center"} items-end absolute bottom-10 gap-4 w-full px-4 mb-10`}>
        <div
          className="flex items-end gap-x-2 cursor-pointer text-zinc-800 p-6 rounded-lg bg-white hover:bg-zinc-100 mt-2"
          onClick={() => changeMenu(isMenuOpen)}>
          <HiChevronDoubleLeft
            size={24}
            className={` ${!isMenuOpen && "rotate-180"} transition-all`}
          />
          {isMenuOpen && <span>Fechar</span>}

        </div>
      </div>
    </nav>
  );
}
