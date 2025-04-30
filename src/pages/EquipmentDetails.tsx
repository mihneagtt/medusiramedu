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
  Server,
  Tag,
  Users,
  Truck,
  Edit,
  Trash,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { api_DELETE, api_GET } from "@/utilities";
import { IEquipment } from "@/types/entitites";
import { ROUTES } from "@/Constants";

const EquipmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<IEquipment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!id) return;

      setIsLoading(true);

      api_GET(`Device/${id}`)
        .then((result) => {
          // Parse and use the complete data
          const data = JSON.parse(result) as IEquipment;
          setEquipment(data);
          setError(null);
        })
        .catch((error) => {
          console.error("Error fetching equipment:", error);
          setError("Failed to load equipment details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchEquipment();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDeleteEquipment = async () => {
    if (!equipment) return;

    if (!window.confirm("Sigur doriți să ștergeți acest aparat?")) {
      return;
    }

    api_DELETE(`Device/${id}`)
      .then(() => {
        alert("Aparat șters cu succes!");
        navigate(ROUTES.EQUIPMENT);
      })
      .catch((error) => {
        console.error("Error deleting equipment:", error);
        alert("A apărut o eroare la ștergerea aparatului. Încercați din nou.");
      });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-900 rounded-lg">
        <div className="text-slate-200">Se încarcă datele aparatului...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-lg p-6">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-slate-200 text-center mb-4">{error}</div>
        <Button variant="outline" onClick={() => navigate(ROUTES.EQUIPMENT)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista de aparate
        </Button>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-lg p-6">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <div className="text-slate-200 text-center mb-4">Aparat negăsit</div>
        <Button variant="outline" onClick={() => navigate(ROUTES.EQUIPMENT)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista de aparate
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
          onClick={() => navigate(ROUTES.EQUIPMENT)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Înapoi la lista de aparate
        </Button>
      </div>

      <Card className="bg-slate-900 text-slate-100 border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">
                {equipment.serialNumber}
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                {equipment.description}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className="bg-blue-600 hover:bg-blue-700 px-3 py-1">
                {equipment.softwareVersion}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-slate-800" />

        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-200">
                Informații generale
              </h3>

              <div className="flex items-start space-x-3">
                <Tag className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Serie</p>
                  <p className="text-slate-400">{equipment.serialNumber}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Server className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Versiune Software</p>
                  <p className="text-slate-400">{equipment.softwareVersion}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Client</p>
                  <p className="text-slate-400">{equipment.clientName}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Truck className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Furnizor</p>
                  <p className="text-slate-400">{equipment.supplierName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-200">
                Detalii date
              </h3>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Data Import</p>
                  <p className="text-slate-400">
                    {formatDate(equipment.importDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Data Instalare</p>
                  <p className="text-slate-400">
                    {formatDate(equipment.installationDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium">Descriere</p>
                  <p className="text-slate-400">
                    {equipment.description || "Nu există descriere disponibilă"}
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
            onClick={() => navigate(`/devices/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editare
          </Button>
          <Button variant="destructive" onClick={handleDeleteEquipment}>
            <Trash className="mr-2 h-4 w-4" />
            Șterge
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EquipmentDetails;
