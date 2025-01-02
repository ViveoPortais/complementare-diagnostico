import { PatientSignUp } from "@/components/signup/PatientSignUp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientRegister() {
    return (
        <div className="w-full flex flex-col gap-4">
            <PatientSignUp />
            <Link href="/signup" className="w-full">
                <Button
                    size={`lg`}
                    variant={`tertiary`}
                    className="w-full"
                >
                    Voltar
                </Button>
            </Link>
        </div>
    )
}