import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { Dialog,  DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";

type ConfirmationDeliveryEmailProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export const ConfirmationDialog = ({ open, onClose, onConfirm }: ConfirmationDeliveryEmailProps) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild>
            <div></div>
        </DialogTrigger>
        <DialogContent className="mt-4">
            <DialogTitle className="text-lg md:text-2xl font-semibold">
                Atenção
            </DialogTitle>
            <p className="my-2 md:my-4">
                Deseja utilizar o email cadastrado?
            </p>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button onClick={onConfirm}>Sim</Button>
                {/* <DialogClose asChild>
                    <Button type="button" variant="tertiary" onClick={onClose}>Não</Button>
                </DialogClose> */}
            </DialogFooter>
        </DialogContent>
    </Dialog>
);