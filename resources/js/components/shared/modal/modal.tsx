import { Dialog, DialogContent } from '@/components/ui/dialog';
import './modal.css';
import { X } from 'lucide-react';

export default function Modal({
    isOpen,
    setIsOpen,
    children,
    icon,
}: {
    isOpen: boolean;
    setIsOpen: any;
    children: any;
    icon: any;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
            <DialogContent className="shadow-[1px_1px_7px_rgba(154,154,204,0.1)] border border-(--border100) h-fit p-0 md:max-w-4xl rounded-md">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary p-2 lg:p-2.5 rounded-full border-5 border-white">
                    {icon}
                </div>
                <button
                    className="fixed right-0 top-0 bg-primary p-1.5 rounded-full transform translate-x-[25%] -translate-y-[25%] hover:scale-110 cursor-pointer transition-all"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="text-white w-5 h-5 lg:w-6 lg:h-6" />
                </button>
                <div className=" pt-10 md:pt-12 " />
                <div className=" max-h-[65vh] custom-scrollbar  overflow-y-auto px-4 pb-4 md:px-10 md:pb-6">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
