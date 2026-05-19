import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import ModalButtons from "../shared/modal/modal-buttons";
import { useForm } from "@inertiajs/react";

interface Props {
    handleClose: () => void;
    item?: any;
}

export default function ProjectModalContents({ handleClose, item }: Props) {

    const {
        data,
        setData,
        processing,
        post,
        put,
        errors
    } = useForm({
        name: item?.name ?? "",
        description: item?.description ?? "",
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (item) {
            put("/projects/" + item.id, {
                preserveScroll: true,
                onSuccess: () => {
                    handleClose();
                    toast.success("Project updated successfully");
                },
                onError: (errors) => {
                    console.log(errors);
                }
            });
        } else {
            post("/projects", {
                preserveScroll: true,
                onSuccess: () => {
                    handleClose();
                    toast.success("Project created successfully");
                },
                onError: (errors) => {
                    console.log(errors);
                }
            });
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Input
                placeholder="Enter your first name"
                label="First Name"
                required
                value={data.name}
                onChange={e => setData('name', e.target.value)}
                error={errors.name}
            />
            <Textarea
                placeholder="Enter your last name"
                label="Last Name"
                required
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                error={errors.description}
            />
            <ModalButtons
                buttons={[
                    {
                        label: "Cancel",
                        variant: "outline",
                        onClick: handleClose,
                    },
                    {
                        label: "Save",
                        type: "submit",
                        className: "bg-primary hover:bg-primary",
                        loading: processing,
                        disabled: processing,
                    },
                ]}
            />
        </form>
    );
}
