import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "react-toastify";
import ModalButtons from "../shared/modal/modal-buttons";
import { Checkbox } from "../ui/checkbox";
import { DatePickerDemo } from "../ui/date-input";
import { Input } from "../ui/input";
import SelectInput from "../ui/select-input";
import { Textarea } from "../ui/textarea";
import { FieldLabel } from "../ui/field";
import { Trash2 } from "lucide-react";

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

export default function DynamicTableModalContents({ handleClose }: any) {
    const params = new URLSearchParams(window.location.search);

    const project_id = params.get('project');
    const { data, setData, post, errors, processing } = useForm<any>({
        project_id: project_id,
        table_name: "",
        fields: [],
    });

    const [currentFieldName, setCurrentFieldName] = useState("")
    const [currentFieldType, setCurrentFieldType] = useState("string")

    const [currentField, setCurrentField] = useState({
        default: "",
        nullable: false,
        unique: false,
        index: false,
    });

    const handleChange = (key: string, value: any) => {
        setCurrentField({ ...currentField, [key]: value });
    };

    const [relation, setRelation] = useState({
        table: "",
        column: "",
    });

    const handleRelationChange = (key: string, value: any) => {
        setRelation({ ...relation, [key]: value });
    };


    function isValidFieldName(name: string) {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
    }

    const handleAddField = () => {

        if (currentFieldType === "" || currentFieldName === "") {
            toast.error("Field name and type are required");

            return;
        }

        if (!isValidFieldName(currentFieldName)) {
            toast.error("Invalid field name");

            return;
        }

        if (data?.fields?.find((field: any) => field.name === currentFieldName.trim().toLowerCase())) {
            toast.error("Field already exists");

            return;
        }

        let formatData: any = {};

        if (currentFieldType !== "foreignId") {

            formatData = {
                name: currentFieldName,
                type: currentFieldType,
            };

            if (currentField?.default) {
                formatData.default = currentField.default;
            }

            if (currentField?.nullable) {
                formatData.nullable = currentField.nullable;
            }

            if (currentField?.unique) {
                formatData.unique = currentField.unique;
            }

            if (currentField?.index) {
                formatData.index = currentField.index;
            }

        } else {
            formatData = {
                name: currentFieldName,
                type: currentFieldType,
                relation: {
                    table: relation.table,
                    column: relation.column,
                }
            };
        }

        console.log(formatData)
        setData('fields', [
            ...data.fields,
            {
                name: currentFieldName,
                type: currentFieldType,
                ...(currentFieldType === "foreignId"
                    ? relation
                    : currentField
                ),
            }
        ]);

        setCurrentField({
            default: "",
            nullable: false,
            unique: false,
            index: false,
        });
        setRelation({
            table: "",
            column: "",
        });
        setCurrentFieldName("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidFieldName(data?.name)) {
            toast.error("Invalid table name");

            return;
        }
        if (data?.fields?.length === 0) {
            toast.error("Fields are required");
            return;
        }

        post("/dynamic-tables", {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
                toast.success("Table created successfully");
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };


    console.log(data)

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
                label="Table Name"
                placeholder="Enter your table name"
                required
                value={data.name}
                onChange={e => setData('table_name', e.target.value)}
                error={errors.name}
            />
            {
                data?.fields?.length > 0 &&
                <div>
                    <FieldLabel htmlFor="date-required" className="mb-2 uppercase">Fields</FieldLabel>
                    <div className="space-y-4 ">
                        {data.fields.map((field: any, index: number) => (
                            <div key={index} className="flex items-center justify-between border border-primary p-4 rounded-lg">
                                <div
                                    className="grid gap-2 flex-1"
                                    style={field?.type === "foreignId" ? { gridTemplateColumns: "1fr 1fr" } : { gridTemplateColumns: "1fr 1fr 1fr" }}
                                >
                                    <span><b>Name: </b>{field.name}</span>
                                    <span><b>Type: </b>{field.type}</span>
                                    {field.type === "foreignId" ? (
                                        <>
                                            <span><b>Table: </b>{field.relation.table}</span>
                                            <span><b>Column: </b>{field.relation.column}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span><b>default: </b>{field.default || "N/A"}</span>
                                            <span><b>Nullable: </b>{field.nullable ? "True" : "False"}</span>
                                            <span><b>Unique: </b>{field.unique ? "True" : "False"}</span>
                                        </>
                                    )
                                    }
                                </div>
                                <button
                                    className="bg-red-500 hover:bg-red-400 cursor-pointer text-white p-2 rounded-sm"
                                    onClick={() => setData('fields', data.fields.filter((f: any) => f.name !== field.name))}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            }
            <FieldLabel htmlFor="date-required" className="mb-2 uppercase">Add Fields</FieldLabel>
            <div className="space-y-4 border border-primary p-4 rounded-lg">
                <Input
                    label="Field Name"
                    placeholder="Enter your field name"
                    required
                    value={currentFieldName}
                    onChange={e => setCurrentFieldName(e.target.value)}
                // error={errors.name}
                />
                <SelectInput
                    label="Field Type"
                    required
                    options={fieldTypeOptions}
                    value={currentFieldType}
                    onChange={e => setCurrentFieldType(e)}
                // error={errors.fieldType}
                />
                {
                    currentFieldType === "foreignId" ?
                        <RelationInputs
                            value={relation}
                            onChange={handleRelationChange}
                            relationOptions={[]}
                        /> : <DefaultInput
                            value={currentField.default}
                            onChange={(e: any) => handleChange('default', (currentFieldType !== "integer" && currentFieldType !== "float") ? e.target.value : parseInt(e.target.value))}
                            type={currentFieldType}
                            // error={errors.default}
                            label="Default Value"
                            placeholder="Default value"
                        />
                }
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={currentField.unique}
                                onCheckedChange={checked => handleChange('unique', checked)}
                            />
                            <label className="block font-medium text-gray-700">
                                Unique
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={currentField.nullable}
                                onCheckedChange={checked => handleChange('nullable', checked)}
                            />
                            <label className="block font-medium text-gray-700">
                                Nullable
                            </label>
                        </div>
                    </div>
                    <ModalButtons
                        buttons={[
                            {
                                label: "Cancel",
                                variant: "outline",
                                onClick: handleClose,
                            },
                            {
                                label: "Add Field",
                                type: "button",
                                onClick: handleAddField,
                                className: "bg-primary hover:bg-primary",
                            },
                        ]}
                    />
                </div>
            </div>

            <ModalButtons
                buttons={[
                    {
                        label: "Cancel",
                        variant: "outline",
                        onClick: handleClose,
                    },
                    {
                        label: "Add Table",
                        type: "submit",
                        className: "bg-primary hover:bg-primary",
                        loading: processing,
                        disabled: processing,
                    },
                ]}
            />
        </form >
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
                className="h-30 min-h-30"
            />
        case "enum":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} />
        case "foreignId":
            return <Input value={value} onChange={onChange} label={label} placeholder={placeholder} />
    }

}

const RelationInputs = ({ value, onChange, relationOptions }: any) => {
    return (
        <div className="space-y-4">
            <SelectInput
                label={"Relation Table"}
                placeholder={"Select relation table"}
                options={relationOptions}
                value={value?.table}
                onChange={e => onChange('table', e)}
            />
            <SelectInput
                label={"Relation Field"}
                placeholder={"Select relation field"}
                options={relationOptions}
                value={value?.column}
                onChange={e => onChange('column', e)}
            />
        </div>
    )
}