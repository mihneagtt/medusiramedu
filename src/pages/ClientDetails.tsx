import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Mail,
  MapPin,
  FileText,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
// import { ROUTES } from "@/Constants";

interface IClient {
  clientId: number;
  name: string;
  email: string;
  address: string;
  createdAt: string;
  isActive: boolean;
  warrantyContract: string;
  contractNumber: string;
}

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<IClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://tiny-lizard-94.telebit.io/api/Client/${id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable as a stream");
        }

        const decoder = new TextDecoder();
        let result = "";

        // Process the stream
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode the chunk and add to result
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
        }

        // Parse and use the complete data
        const data = JSON.parse(result) as IClient;
        setClient(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching client:", error);
        setError("Failed to load client details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteClient = async () => {
    if (!client) return;

    if (!window.confirm("Sigur doriți să ștergeți acest client?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://tiny-lizard-94.telebit.io/api/Client/${client.clientId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert("Client șters cu succes!");
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("A apărut o eroare la ștergerea clientului. Încercați din nou.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-900 rounded-lg">
        <div className="text-slate-200">Se încarcă datele clientului...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-lg p-6">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-slate-200 text-center mb-4">{error}</div>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista de clienți
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-lg p-6">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-slate-200 text-center mb-4">Client negăsit</div>
        <Button variant="outline" onClick={() => navigate("/clients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista de clienți
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista de clienți
        </Button>
      </div>

      <Card className="bg-slate-900 text-slate-100 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {client.name}
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                Client ID: {client.clientId}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {client.isActive ? (
                <Badge className="bg-green-600 hover:bg-green-700 flex items-center px-3 py-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Activ
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center px-3 py-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Inactiv
                </Badge>
              )}
              <Badge
                variant={
                  client.warrantyContract === "true" ? "secondary" : "default"
                }
                className="px-3 py-1"
              >
                {client.warrantyContract === "true" ? "Garantie" : "Contract"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-slate-800" />

        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-200">
                Informații de contact
              </h3>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-slate-400">{client.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Adresa</p>
                  <p className="text-slate-400">{client.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-200">
                Detalii contract
              </h3>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Număr contract</p>
                  <p className="text-slate-400">{client.contractNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Data creării</p>
                  <p className="text-slate-400">
                    {formatDate(client.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator className="bg-slate-800 mt-6" />

        <CardFooter className="pt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            onClick={() => navigate(`/clients/${client.clientId}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editare
          </Button>
          <Button variant="destructive" onClick={handleDeleteClient}>
            <Trash className="mr-2 h-4 w-4" />
            Șterge
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientDetails;
