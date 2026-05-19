import { useForm } from "@inertiajs/react";
import SelectInput from "../ui/select-input";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { DatePickerDemo } from "../ui/date-input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";

const fieldTypeOptions = [
    { label: "String", value: "string" },

    { label: "Integer", value: "integer" },

    { label: "Float", value: "float" },

    { label: "Boolean", value: "boolean" },

    { label: "Date", value: "date" },

    { label: "JSON", value: "json" },

    { label: "Enum", value: "enum" },

    { label: "Foreign ID", value: "foreignId" },
];

export default function DynamicTableModalContents({ handleClose }: Props) {
    // const { data, setData, post, errors } = useForm({
    //     name: "",
    //     fieldType: "string",
    //     default: "",
    //     nullable: false,
    //     unique: false,
    // });

    const [fields, setFields] = useState([]);
    const [currentField, setCurrentField] = useState({
        name: "",
        fieldType: "string",
        default: "",
        // nullable: false,
        // unique: false,
    });

    const handleChange = (key: string, value: any) => {
        setCurrentField({ ...currentField, [key]: value });
    };



    return (
        <div className="space-y-4">
            <Input
                label="Field Name"
                placeholder="Enter your field name"
                required
                value={currentField.name}
                onChange={e => handleChange('name', e.target.value)}
            // error={errors.name}
            />
            <div className="grid grid-cols-2 gap-4">
                <SelectInput
                    label="Field Type"
                    required
                    options={fieldTypeOptions}
                    value={currentField.fieldType}
                    onChange={e => handleChange('fieldType', e)}
                // error={errors.fieldType}
                />
                <DefaultInput
                    value={currentField.default}
                    onChange={e => handleChange('default', e)}
                    type={currentField.fieldType}
                    // error={errors.default}
                    label="Default Value"
                    placeholder="Default value"
                />
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
                <div className="flex items-center gap-2">
                    <Checkbox />
                    <label className="block font-medium text-gray-700">
                        Unique
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox />
                    <label className="block font-medium text-gray-700">
                        Nullable
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox />
                    <label className="block font-medium text-gray-700">
                        Nullable
                    </label>
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox />
                    <label className="block text-sm font-medium text-gray-700">
                        Nullable
                    </label>
                </div>
            </div>
        </div>
    )
}


const DefaultInput = ({ value, onChange, type, label, placeholder }: any) => {
    switch (type) {
        case "string":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} />
        case "integer":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} type="number" />
        case "float":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} type="number" />
        case "boolean":
            return <SelectInput
                value={value}
                onChange={onChange}
                label={label}
                placeholder={placeholder}
                options={
                    [
                        { label: "True", value: true },
                        { label: "False", value: false }
                    ]
                }
            />
        case "date":
            return <DatePickerDemo label={label} />
        case "json":
            return <Textarea
                value={value}
                onChange={onChange}
                label={label}
                placeholder={placeholder}
                className="h-11 min-h-11"
            />
        case "enum":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} />
        case "foreignId":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} />
    }

}