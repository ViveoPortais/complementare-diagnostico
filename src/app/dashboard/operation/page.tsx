"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { CgSpinner } from "react-icons/cg";

import { routes } from "@/helpers/routes";
import useSession from "@/hooks/useSession";

export default function DoctorDashboard() {
  const auth = useSession();
  const router = useRouter();
  const role = auth.role;

  useEffect(() => {
    router.push(`${routes[role][0].route}`);
  }, []);

  return (
    <section className="h-full w-full flex flex-col items-center">
      <CgSpinner size={36} className="text-white animate-spin" />
    </section>
  );
}
