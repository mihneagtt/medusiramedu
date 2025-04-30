import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/Constants";

const AddClient = () => {
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

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Transform the data to match the API's expected format
      const clientData = {
        name: data.name,
        email: data.email,
        address: data.address,
        createdAt: data.creationDate.toISOString(),
        isActive: true, // Setting default as active
        warrantyContract: data.contractType === "garantie" ? "true" : "false",
        contractNumber: data.contractNumber,
      };

      // Send data to the API
      const response = await fetch(
        "https://tiny-lizard-94.telebit.io/api/Client/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add client: ${errorText}`);
      }

      // Success - redirect to clients list
      alert("Client a fost adăugat cu succes");
      navigate(ROUTES.CLIENTS);
    } catch (error) {
      console.error("Error adding client:", error);
      setError(
        error instanceof Error
          ? error.message
          : "A apărut o eroare la adăugarea clientului"
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
        title="Adaugare Client Nou"
        schema={formSchema}
        fields={formFields}
        onSubmit={(data) => handleSubmit(data as z.infer<typeof formSchema>)}
        submitLabel={isSubmitting ? "Se adaugă..." : "Adauga Client"}
        // isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddClient;
