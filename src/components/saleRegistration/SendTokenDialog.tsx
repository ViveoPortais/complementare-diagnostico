import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Controller } from "react-hook-form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CgSpinner } from "react-icons/cg";

type SendTokenDialogProps = {
  control: any,
  errors: any,
  open: boolean,
  isLoading: boolean,
  onClose: (open: boolean) => void,
  onConfirm: () => void,
  token: string
}

export const SendTokenDialog = ({ control, errors, open, isLoading, onClose, onConfirm, token }: SendTokenDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="mt-4">
      <div className="text-viveo-primary text-sm md:text-xl text-main-purple">
        Insira o número do token para prosseguir.
      </div>

      <form noValidate onSubmit={onConfirm}>
        <div className="grid grid-cols-1 gap-3">
          <Controller control={control} defaultValue={token} name="token" render={({ field }) => (
            <div className="flex flex-col w-full">
              <Input {...field} placeholder="Token" value={field.value} />
              {errors.token &&
                <span className="text-xs text-red-400 mt-1">
                  {errors.token.message}
                </span>
              }
            </div>
          )} />

          <Button className="lg:w-[200px]" size="lg" type="submit" variant={`default`}>
            {isLoading ? (<CgSpinner size={20} className="text-white animate-spin" />) : ("Salvar Dados")}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
)
