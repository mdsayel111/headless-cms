import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ActionItem = {
    label: string;
    Icon?: any;
    iconClassName?: string;
    onClick: () => void;
    actionItemClassName?: string;
    color?: string;
};

type ActionDropdownProps = {
    actions: ActionItem[];
};

export default function ActionDropdown({ actions }: ActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="text-[13px] rounded font-medium h-[34px] border border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    Actions
                    <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                    <DropdownMenuItem
                        key={index}
                        onClick={action.onClick}
                        className={cn("action.className", action.actionItemClassName, action.color)}
                    >
                        {/* {action.icon} */}
                        {action.Icon && <action.Icon className={cn("mr-2 h-4 w-4", action.iconClassName, action.color)} />}
                        {action.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}