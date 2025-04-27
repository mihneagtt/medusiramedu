import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";

const AddSupplier = () => {
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
    contractNumber: z
      .string()
      .min(1, { message: "Numărul contractului este obligatoriu" })
      .max(20, {
        message: "Numărul contractului nu poate depăși 20 de caractere",
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

    contractNumber: {
      type: "text",
      label: "Numar Contract",
      placeholder: "Introduceti numarul contractului",
      defaultValue: "",
    },
  };

  const handleSubmit = (data: unknown) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <ReusableForm
      title="Adaugare Furnizor Nou"
      schema={formSchema}
      fields={formFields}
      onSubmit={handleSubmit}
      submitLabel="Adauga Furnizor"
    />
  );
};

export default AddSupplier;
