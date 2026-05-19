import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


type PaginationProps = {
    page: number;
    totalPages: number;
    className?: string;
    links?: any;
};

export function Pagination({
    page,
    totalPages,
    className,
    links
}: PaginationProps) {
    const isFirst = page === 1;
    const isLast = page === totalPages;

    return (
        <div className={cn("flex justify-end gap-2", className)}>
            {/* Previous */}
            <Button
                variant="outline"
                size="sm"
                disabled={isFirst}
                onClick={() => router.visit(links[page - 1]?.url)}
                className="rounded border border-gray-200 shadow-[1px_1px_7px_rgba(154,154,204,0.1)]"
            >
                Previous
            </Button>

            {/* Current Page */}
            <Button
                variant="outline"
                size="sm"
                disabled
                className="bg-primary text-white hover:bg-primary rounded border border-gray-200 shadow-[1px_1px_7px_rgba(154,154,204,0.1)]"
            >
                {page}
            </Button>

            {/* Next */}
            <Button
                variant="outline"
                size="sm"
                disabled={isLast}
                onClick={() => router.visit(links[page + 1]?.url)}
                className="rounded border border-gray-200 shadow-[1px_1px_7px_rgba(154,154,204,0.1)]"
            >
                Next
            </Button>
        </div>
    );
}
