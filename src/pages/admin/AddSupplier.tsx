import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_ADD } from "@/utilities";

export interface ISupplier {
  supplierId: number;
  name: string;
  email: string;
  address: string;
  contractNumber: string;
}

const AddSupplier = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Send data to the API
      const supplierData: Omit<ISupplier, "supplierId"> = {
        name: data.name,
        email: data.email,
        address: data.address,
        contractNumber: data.contractNumber,
      };

      await api_ADD("Supplier/add", supplierData);

      // Success - show alert and redirect
      alert("Furnizorul a fost adăugat cu succes");
      navigate("/"); // Adjust this path to your actual suppliers list route
    } catch (error) {
      console.error("Error adding supplier:", error);
      setError(
        error instanceof Error
          ? error.message
          : "A apărut o eroare la adăugarea furnizorului"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-800 text-red-100 rounded-md">
          {error}
        </div>
      )}
      <ReusableForm
        title="Adaugare Furnizor Nou"
        schema={formSchema}
        fields={formFields}
        onSubmit={(data) => handleSubmit(data as z.infer<typeof formSchema>)}
        submitLabel={isSubmitting ? "Se adaugă..." : "Adauga Furnizor"}
      />
    </div>
  );
};

export default AddSupplier;
