import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api_ADD, api_GET } from "@/utilities";
import { IClient, IEquipment, ISupplier } from "@/types/entitites";
import { ROUTES } from "@/Constants";

const AddEquipment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<IClient[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const navigate = useNavigate();

  // Fetch clients and suppliers when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch clients and suppliers concurrently
        const [clientsResponse, suppliersResponse] = await Promise.all([
          api_GET("Client/all"),
          api_GET("Supplier/all"),
        ]);

        setClients(JSON.parse(clientsResponse));
        setSuppliers(JSON.parse(suppliersResponse));
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "A apărut o eroare la încărcarea datelor"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formSchema = z.object({
    serialNumber: z.string().min(1, "Seria de identificare este obligatorie"),
    model: z.string().min(1, "Modelul este obligatoriu"),
    importDate: z.date({
      required_error: "Data importului este obligatorie",
    }),
    installDate: z.date({
      required_error: "Data instalarii este obligatorie",
    }),
    softwareVersion: z
      .string()
      .min(1, "Versiunea de software este obligatorie"),
    client: z.string().min(1, "Selectarea clientului este obligatorie"),
    furnizor: z.string().min(1, "Selectarea furnizorului este obligatorie"),
  });

  // Generate client and supplier options for comboboxes
  const clientOptions = clients.map((client) => ({
    value: client.clientId.toString(),
    label: client.name,
  }));

  const supplierOptions = suppliers.map((supplier) => ({
    value: supplier.supplierId.toString(),
    label: supplier.name,
  }));

  const formFields: FormFields = {
    serialNumber: {
      type: "text",
      label: "Serie Identificare",
      placeholder: "Introduceti seria de identificare",
      defaultValue: "",
    },
    model: {
      type: "text",
      label: "Model",
      placeholder: "Introduceti modelul",
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
      options: clientOptions,
    },
    furnizor: {
      type: "combobox",
      label: "Furnizor",
      placeholder: "Selecteaza furnizor",
      defaultValue: "",
      options: supplierOptions,
    },
  };

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    // Transform the data to match the API's expected format
    const deviceData: Partial<IEquipment> = {
      serialNumber: data.serialNumber,
      description: data.model,
      importDate: data.importDate.toISOString(),
      installationDate: data.installDate.toISOString(),
      softwareVersion: data.softwareVersion,
      clientId: Number(data.client),
      supplierId: Number(data.furnizor),
    };

    try {
      // Send data to the API
      await api_ADD("Device/add", deviceData);

      // Success - show alert and redirect
      alert("Aparatul a fost adăugat cu succes");
      navigate(ROUTES.EQUIPMENT);
    } catch (error) {
      console.error("Error adding device:", error);
      setError(
        error instanceof Error
          ? error.message
          : "A apărut o eroare la adăugarea aparatului"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Se încarcă datele...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-800 text-red-100 rounded-md">
          {error}
        </div>
      )}
      {clients.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-800 text-yellow-100 rounded-md">
          Nu există clienți disponibili. Vă rugăm să adăugați clienți înainte de
          a adăuga echipamente.
        </div>
      )}
      {suppliers.length === 0 && (
        <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-800 text-yellow-100 rounded-md">
          Nu există furnizori disponibili. Vă rugăm să adăugați furnizori
          înainte de a adăuga echipamente.
        </div>
      )}
      {clients.length > 0 && suppliers.length > 0 ? (
        <ReusableForm
          title="Adaugare Aparat Nou"
          schema={formSchema}
          fields={formFields}
          onSubmit={(data) => handleSubmit(data as z.infer<typeof formSchema>)}
          submitLabel={isSubmitting ? "Se adaugă..." : "Adauga Aparat"}
        />
      ) : (
        <div className="mt-4">
          <button
            onClick={() => navigate(ROUTES.ADD_CLIENT)}
            className="mr-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Adaugă Client
          </button>
          <button
            onClick={() => navigate(ROUTES.ADD_SUPPLIER)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Adaugă Furnizor
          </button>
        </div>
      )}
    </div>
  );
};

export default AddEquipment;
