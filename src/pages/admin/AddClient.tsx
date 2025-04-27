import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";

const AddClient = () => {
  const formSchema = z.object({
    name: z
      .string()
      .min(2, { message: "Numele trebuie să aibă cel puțin 2 caractere" })
      .max(50, { message: "Numele nu poate depăși 50 de caractere" }),
    email: z.string().email({ message: "Email invalid" }),
    address: z
      .string()
      .min(5, { message: "Adresa trebuie să aibă cel puțin 5 caractere" })
      .max(100, { message: "Adresa nu poate depăși 100 de caractere" }),
    creationDate: z.date({
      required_error: "Data creării este obligatorie",
    }),
    contractNumber: z
      .string()
      .min(1, { message: "Numărul contractului este obligatoriu" })
      .max(20, {
        message: "Numărul contractului nu poate depăși 20 de caractere",
      }),
    contractType: z.enum(["garantie", "contract"], {
      required_error: "Selectați tipul contractului",
    }),
  });
  const formFields: FormFields = {
    name: {
      type: "text",
      label: "Nume",
      placeholder: "Introduceti numele",
      defaultValue: "",
    },
    email: {
      type: "email",
      label: "Email",
      placeholder: "Introduceti email-ul",
      defaultValue: "",
    },
    address: {
      type: "text",
      label: "Adresa",
      placeholder: "Introduceti adresa",
      defaultValue: "",
    },
    creationDate: {
      type: "date",
      label: "Data Crearii",
      defaultValue: undefined,
    },
    contractNumber: {
      type: "text",
      label: "Numar Contract",
      placeholder: "Introduceti numarul contractului",
      defaultValue: "",
    },
    contractType: {
      type: "toggle",
      label: "Tip Contract",
      options: [
        { value: "garantie", label: "Garantie" },
        { value: "contract", label: "Contract" },
      ],
      defaultValue: "garantie",
    },
  };

  const handleSubmit = (data: unknown) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <ReusableForm
      title="Adaugare Client Nou"
      schema={formSchema}
      fields={formFields}
      onSubmit={handleSubmit}
      submitLabel="Adauga Client"
    />
  );
};

export default AddClient;
