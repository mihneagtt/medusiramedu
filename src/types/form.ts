import { UseFormReturn } from "react-hook-form";
import { ZodTypeAny } from "zod";

// types/form.ts
export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "date"
  | "toggle"
  | "combobox"
  | "quantityCombobox"
  | "image"
  | "signature"
  | "number";

// Base interface for all field configurations
interface BaseFieldConfig {
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue: unknown;
}

type MultiFieldConfig = {
  multiple?: boolean;
  maxFields?: number;
  addButtonLabel?: string;
};

// Specific field type configurations
interface TextFieldConfig extends BaseFieldConfig, MultiFieldConfig {
  type: "text";
  defaultValue: string;
}

interface TextAreaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  defaultValue: string;
}

interface EmailFieldConfig extends BaseFieldConfig, MultiFieldConfig {
  type: "email";
  defaultValue: string;
}

interface NumberFieldConfig extends BaseFieldConfig, MultiFieldConfig {
  type: "number";
  defaultValue: string;
}

interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  defaultValue: Date | undefined;
}

interface ToggleFieldConfig extends BaseFieldConfig {
  type: "toggle";
  defaultValue: string;
  options: Array<{
    value: string;
    label: string;
  }>;
}

interface ComboboxFieldConfig extends BaseFieldConfig, MultiFieldConfig {
  type: "combobox";
  defaultValue: string | number;
  options: Array<{
    value: string;
    label: string;
  }>;
}
interface QuantityComboboxFieldConfig
  extends BaseFieldConfig,
    MultiFieldConfig {
  type: "quantityCombobox";
  defaultValue: string | number;
  options: Array<{
    value: string;
    label: string;
  }>;
}

interface ImageUploadFieldConfig extends BaseFieldConfig {
  type: "image";
  defaultValue: string[] | null;
  maxFiles?: number;
  acceptedFileTypes?: string[];
}

interface SignatureFieldConfig extends BaseFieldConfig {
  type: "signature";
}

// Union type for all field configurations
export type FieldConfig =
  | TextFieldConfig
  | TextAreaFieldConfig
  | EmailFieldConfig
  | DateFieldConfig
  | ToggleFieldConfig
  | ComboboxFieldConfig
  | ImageUploadFieldConfig
  | SignatureFieldConfig
  | NumberFieldConfig
  | QuantityComboboxFieldConfig;

// Form fields configuration
export interface FormFields {
  [key: string]: FieldConfig;
}

// Props for the FormFieldComponent
export interface FormFieldComponentProps {
  field: string;
  form: UseFormReturn;
  fieldConfig: FieldConfig;
}

// Props for the ReusableForm component
export interface ReusableFormProps {
  title: string;
  schema: ZodTypeAny;
  fields: FormFields;
  onSubmit: (data: unknown) => void;
  submitLabel?: string;
}
