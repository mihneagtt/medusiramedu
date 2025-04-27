import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";

const AddEquipment = () => {
  const formSchema = z.object({
    serialNumber: z.string().min(1, "Seria de identificare este obligatorie"),
    importDate: z.date({
      required_error: "Data importului este obligatorie",
    }),
    installDate: z.date({
      required_error: "Data instalarii este obligatorie",
    }),
    softwareVersion: z
      .string()
      .min(1, "Versiunea de software este obligatorie"),
    client: z.string(),
    furnizor: z.string(),
  });

  const formFields: FormFields = {
    serialNumber: {
      type: "text",
      label: "Serie Identificare",
      placeholder: "Introduceti seria de identificare",
      defaultValue: "",
    },
    importDate: {
      type: "date",
      label: "Data Import",
      defaultValue: undefined,
    },
    installDate: {
      type: "date",
      label: "Data Instalare",
      defaultValue: undefined,
    },
    softwareVersion: {
      type: "text",
      label: "Versiune Software",
      placeholder: "Introduceti versiunea de software",
      defaultValue: "",
    },
    client: {
      type: "combobox",
      label: "Client",
      placeholder: "Selecteaza client",
      defaultValue: "",
      options: [
        // You'll need to populate this with your actual client data
        { value: "client1", label: "Client 1" },
        { value: "client2", label: "Client 2" },
      ],
    },
    furnizor: {
      type: "combobox",
      label: "Furnizor",
      placeholder: "Selecteaza furnizor",
      defaultValue: "",
      options: [
        // You'll need to populate this with your actual supplier data
        { value: "furnizor1", label: "Furnizor 1" },
        { value: "furnizor2", label: "Furnizor 2" },
      ],
    },
  };

  const handleSubmit = (data: unknown) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <ReusableForm
      title="Adaugare Aparat Nou"
      schema={formSchema}
      fields={formFields}
      onSubmit={handleSubmit}
      submitLabel="Adauga Aparat"
    />
  );
};

export default AddEquipment;
