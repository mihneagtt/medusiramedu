import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";

const AddPart = () => {
  const formSchema = z.object({
    partNumber: z.string().min(1, "Seria de identificare este obligatorie"),
    name: z.string().min(1, "Numele este obligatoriu"),
    qty: z.number().min(1, "Cantitatea este obligatorie"),
  });

  const formFields: FormFields = {
    partNumber: {
      type: "text",
      label: "Serie Identificare",
      placeholder: "Introduceti seria de identificare",
      defaultValue: "",
    },
    softwareVersion: {
      type: "text",
      label: "Nume",
      placeholder: "Introduceti numele",
      defaultValue: "",
    },
    qty: {
      type: "text",
      label: "Cantitate",
      placeholder: "Introduceti cantitatea",
      defaultValue: "",
    },
  };

  const handleSubmit = (data: unknown) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <ReusableForm
      title="Adaugare Piesa Noua"
      schema={formSchema}
      fields={formFields}
      onSubmit={handleSubmit}
      submitLabel="Adauga Piesa"
    />
  );
};

export default AddPart;
