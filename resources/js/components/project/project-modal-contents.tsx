import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import ModalButtons from "../shared/modal/modal-buttons";
import { useForm } from "@inertiajs/react";

interface Props {
    handleClose: () => void;
}

export default function ProjectModalContents({ handleClose }: Props) {

    const {
        data,
        setData,
        post,
        errors
    } = useForm({
        name: "",
        description: "",
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/projects", {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
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
                        // loading: isSubmitting,
                        // disabled: isSubmitting,
                    },
                ]}
            />
        </form>
    );
}
