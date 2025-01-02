import { Button } from "@/components/ui/button";
import { teamManagementValidationProps } from "@/lib/utils";

interface ActionButtonsProps {
    onLink: () => void;
    linkDisabled: boolean;
    registerDisabled: boolean;
}

export function ActionButtons({ onLink, linkDisabled, registerDisabled }: ActionButtonsProps) {
    return (
        <div className="flex flex-col md:flex-row gap-2">
            <div className="flex 1">
                <Button
                    type="submit"
                    size="lg"
                    className="mt-4 md:mt-3 bg-red-400"
                    disabled={registerDisabled}
                >
                    Cadastrar
                </Button>
            </div>
            <div className="flex 1">
                <Button
                    type="button"
                    size="lg"
                    className="mt-4 md:mt-3 bg-red-400"
                    onClick={onLink}
                    disabled={linkDisabled}
                >
                    Realizar Vínculo
                </Button>
            </div>
        </div>
    );
}
