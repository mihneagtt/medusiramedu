import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";

const AddReport = () => {
  const formSchema = z.object({
    client: z.string({
      required_error: "Selectați clientul",
    }),
    representative: z.string().min(2, {
      message: "Numele reprezentantului trebuie să aibă cel puțin 2 caractere",
    }),
    equipment: z.string({
      required_error: "Selectați aparatul",
    }),
    problemDescription: z.string().min(10, {
      message: "Descrierea trebuie să aibă cel puțin 10 caractere",
    }),
    beforePhotos: z.array(z.string()).optional(),
    standardProcedures: z.array(z.string()).min(1, {
      message: "Selectați cel puțin o procedură standard",
    }),
    additionalProcedures: z.array(z.string()).optional(),
    replacedParts: z.array(z.string()).optional(),
    workHours: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, {
        message: "Introduceți un număr valid (ex: 2.5)",
      })
      .transform((val) => parseFloat(val)),
    travelDistance: z
      .string()
      .regex(/^\d+$/, {
        message: "Introduceți un număr valid de kilometri",
      })
      .optional()
      .transform((val) => (val ? parseInt(val) : 0)),
    conclusions: z.string().min(10, {
      message: "Concluziile trebuie să aibă cel puțin 10 caractere",
    }),
    afterPhotos: z.array(z.string()).optional(),
    clientSignature: z.string({
      required_error: "Semnătura clientului este necesară",
    }),
    engineerSignature: z.string({
      required_error: "Semnătura inginerului este necesară",
    }),
  });

  // Form fields configuration
  const formFields: FormFields = {
    client: {
      type: "combobox",
      label: "Client",
      placeholder: "Selectați clientul",
      defaultValue: "",
      options: [
        // These would be populated from your database
        { value: "client1", label: "Client 1" },
        { value: "client2", label: "Client 2" },
      ],
    },
    representative: {
      type: "text",
      label: "Reprezentant",
      placeholder: "Introduceți numele reprezentantului",
      defaultValue: "",
    },
    equipment: {
      type: "combobox",
      label: "Aparat",
      placeholder: "Selectați aparatul",
      defaultValue: "",
      options: [
        // These would be populated from your database
        { value: "equip1", label: "Aparat 1" },
        { value: "equip2", label: "Aparat 2" },
      ],
    },
    problemDescription: {
      type: "textarea",
      label: "Descriere problemă",
      placeholder: "Descrieți problema în detaliu",
      defaultValue: "",
    },
    beforePhotos: {
      type: "image",
      label: "Poze înainte de intervenție",
      defaultValue: [],
      maxFiles: 5,
    },
    standardProcedures: {
      type: "combobox",
      label: "Proceduri standard",
      placeholder: "Selectați procedura",
      defaultValue: "",
      multiple: true,
      maxFields: 5,
      addButtonLabel: "Adaugă procedură standard",
      options: [
        // These would be populated from your database
        { value: "proc1", label: "Procedură 1" },
        { value: "proc2", label: "Procedură 2" },
      ],
    },
    additionalProcedures: {
      type: "text",
      label: "Proceduri suplimentare",
      placeholder: "Introduceți procedura",
      defaultValue: "",
      multiple: true,
      maxFields: 5,
      addButtonLabel: "Adaugă procedură suplimentară",
    },
    replacedParts: {
      type: "combobox",
      label: "Piese înlocuite",
      placeholder: "Selectați piesa",
      defaultValue: "",
      multiple: true,
      maxFields: 10,
      addButtonLabel: "Adaugă piesă înlocuită",
      options: [
        // These would be populated from your database
        { value: "part1", label: "Piesă 1" },
        { value: "part2", label: "Piesă 2" },
      ],
    },
    workHours: {
      type: "text",
      label: "Timp de lucru (ore)",
      placeholder: "Ex: 2.5",
      defaultValue: "",
    },
    travelDistance: {
      type: "text",
      label: "Km deplasare",
      placeholder: "Introduceți numărul de kilometri",
      defaultValue: "",
    },
    conclusions: {
      type: "textarea",
      label: "Concluzii",
      placeholder: "Introduceți concluziile intervenției",
      defaultValue: "",
    },
    afterPhotos: {
      type: "image",
      label: "Poze după intervenție",
      defaultValue: [],
      maxFiles: 5,
    },
    clientSignature: {
      type: "signature",
      label: "Semnătura client",
      defaultValue: "",
    },
    engineerSignature: {
      type: "signature",
      label: "Semnătura inginer",
      defaultValue: "",
    },
  };

  const handleSubmit = (data: unknown) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <ReusableForm
      title="Adaugare Raport Service Nou"
      schema={formSchema}
      fields={formFields}
      onSubmit={handleSubmit}
      submitLabel="Adauga Raport Service"
    />
  );
};

export default AddReport;
