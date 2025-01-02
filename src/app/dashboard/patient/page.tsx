'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { CgSpinner } from "react-icons/cg";

import useSession from "@/hooks/useSession";
import { routes } from "@/helpers/routes";

export default function PatientDashboard() {
    const auth = useSession();
    const router = useRouter();
    const role = auth.role;

    useEffect(() => {
        router.push(`${routes[role][0].route}`)
    }, []);


    return (
        <section className="h-full w-full flex flex-col items-center justify-center">
            <CgSpinner size={36} className="text-white animate-spin" />
        </section>
    )
}