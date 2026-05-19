import { cn } from "@/lib/utils";
import ErrorText from "./error-text";
import { FieldLabel } from "./field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

type Primitive = string | number | boolean;

type Option = {
    label: string;
    value: Primitive;
};

interface SelectInputProps<T extends Primitive = Primitive> {
    label?: string;
    required?: boolean;
    options: Option[];
    value?: T;
    onChange?: (value: T) => void;
    size?: "sm" | "default";
    triggerClassName?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

export default function SelectInput<T extends Primitive = Primitive>({
    label,
    required,
    options,
    value,
    onChange,
    size = "default",
    placeholder = "Select",
    triggerClassName,
    error,
    disabled
}: SelectInputProps<T>) {

    const stringValue = value !== undefined
        ? String(value)
        : undefined;

    const handleChange = (val: string) => {

        const selected = options.find(
            (o) => String(o.value) === val
        );

        if (selected) {
            onChange?.(selected.value as T);
        }
    };

    return (
        <div>

            {label && (
                <FieldLabel className="mb-2 uppercase">
                    {label}
                    {required && (
                        <span className="text-red-500">*</span>
                    )}
                </FieldLabel>
            )}

            <Select
                value={stringValue}
                onValueChange={handleChange}
                disabled={disabled}
            >

                <SelectTrigger
                    className={cn(
                        "w-full ring-0! outline-0!",
                        triggerClassName
                    )}
                    size={"lg"}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>

                    {options.map((option) => (
                        <SelectItem
                            key={String(option.value)}
                            value={String(option.value)}
                        >
                            {option.label}
                        </SelectItem>
                    ))}

                </SelectContent>

            </Select>

            <ErrorText error={error} />

        </div>
    );
}