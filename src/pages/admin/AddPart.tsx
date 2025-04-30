import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api_ADD } from "@/utilities";
import { IPart, IStock } from "@/types/entitites";

const AddPart = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const formSchema = z.object({
    partNumber: z.string().min(1, "Seria de identificare este obligatorie"),
    name: z.string().min(1, "Numele este obligatoriu"),
    description: z.string().optional(),
    price: z.string().min(0, "Prețul trebuie să fie un număr pozitiv"),
    qty: z.string().min(1, "Cantitatea trebuie să fie cel puțin 1"),
  });

  const formFields: FormFields = {
    partNumber: {
      type: "text",
      label: "Serie Identificare",
      placeholder: "Introduceti seria de identificare",
      defaultValue: "",
    },
    name: {
      type: "text",
      label: "Nume",
      placeholder: "Introduceti numele",
      defaultValue: "",
    },
    price: {
      type: "number",
      label: "Pret",
      placeholder: "Introduceti pretul",
      defaultValue: "0",
    },
    qty: {
      type: "number",
      label: "Cantitate",
      placeholder: "Introduceti cantitatea",
      defaultValue: "1",
    },
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // First, create the part
      const partData: IPart = {
        partNumber: data.partNumber,
        description: data.description || data.name, // Use name as description if not provided
        price: Number(data.price),
      };

      // Second, add the stock quantity
      const stockData: IStock = {
        partNumber: data.partNumber,
        quantity: Number(data.qty),
      };

      // Execute both API calls sequentially
      // First add the part
      await api_ADD("Part", partData);

      // Then add the stock
      await api_ADD("Stock/Add", stockData);

      // Success - show alert and redirect
      alert("Piesa a fost adăugată cu succes");
      navigate("/parts"); // Adjust this path to your actual parts list route
    } catch (error) {
      console.error("Error adding part:", error);
      setError(
        error instanceof Error
          ? error.message
          : "A apărut o eroare la adăugarea piesei"
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
        title="Adaugare Piesa Noua"
        schema={formSchema}
        fields={formFields}
        onSubmit={(data) => handleSubmit(data as z.infer<typeof formSchema>)}
        submitLabel={isSubmitting ? "Se adaugă..." : "Adauga Piesa"}
      />
    </div>
  );
};

export default AddPart;
