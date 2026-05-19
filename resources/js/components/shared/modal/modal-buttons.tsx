import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LoaderCircle } from "lucide-react"


export default function ModalButtons(
    { buttons }:
        {
            buttons:
            {
                label: string,
                variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
                type?: "button" | "submit" | "reset" | undefined,
                className?: string,
                onClick?: () => void,
                loading?: boolean,
                disabled?: boolean,
            }[]
        }
) {
    return (
        <div className="flex justify-end gap-3 pt-3">
            {buttons.map((btn, index) => (
                <Button
                    key={index}
                    type={btn.type ?? "button"}
                    variant={btn.variant}
                    className={cn("disabled:opacity-50", btn.className)}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                >
                    {
                        btn.loading ? (
                            <span className='relative'>
                                <LoaderCircle className="animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                                <span className='opacity-0'>{btn.label}</span>
                            </span>
                        ) : (
                            btn.label
                        )
                    }
                </Button>
            ))}
        </div>
    )
}
