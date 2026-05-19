import { cn } from "@/lib/utils";

export default function SearchBox({ containerClassName, value, onChange }: { containerClassName?: string, value: string, onChange: (value: string) => void }) {
    return (
        <div className={cn("relative w-full lg:w-xs", containerClassName)}>
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                    className="w-4 h-4 text-body text-primary"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                </svg>
            </div>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                type="text"
                id="input-group-1"
                className="block w-full ps-9 pe-3 py-2 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-sm focus:ring-brand focus:border-brand shadow-xs placeholder:text-body border-primary"
                placeholder="Search"
            />
        </div>
    )
}
