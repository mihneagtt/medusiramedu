import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Edit, Trash, Eye, Filter } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/Constants";
import { api_GET, api_DELETE } from "@/utilities";
import { IEquipment } from "@/types/entitites";

const Equipment: React.FC = () => {
  const [equipment, setEquipment] = useState<IEquipment[]>([]);
  const [allEquipment, setAllEquipment] = useState<IEquipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api_GET("Device/all");
        const devices = JSON.parse(data);
        // Transform data if needed to match our interface
        const formattedData: IEquipment[] = devices.map((item: IEquipment) => ({
          id: item.serialNumber.toString(),
          serialNumber: item.serialNumber,
          description: item.description || "N/A", // Add model with fallback
          softwareVersion: item.softwareVersion,
          clientId: item.clientId?.toString() || "",
          clientName: item.clientName || "N/A",
          supplierId: item.supplierId.toString() || "",
          supplierName: item.supplierName || "N/A",
        }));
        console.log(formattedData);

        setEquipment(formattedData);
        setAllEquipment(formattedData);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setError(
          err instanceof Error
            ? err.message
            : "A apărut o eroare la încărcarea aparatelor"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  // Get unique suppliers for filter
  const suppliers = [
    ...new Set(allEquipment.map((item) => item.supplierName).filter(Boolean)),
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterEquipment(term, filterSupplier);
  };

  const handleFilterChange = (supplier: string) => {
    setFilterSupplier(supplier);
    filterEquipment(searchTerm, supplier);
  };

  const filterEquipment = (term: string, supplier: string) => {
    let filtered = [...allEquipment];

    if (term) {
      filtered = filtered.filter(
        (item) =>
          item.serialNumber.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.clientName.toLowerCase().includes(term) ||
          item.softwareVersion.toLowerCase().includes(term)
      );
    }

    if (supplier) {
      filtered = filtered.filter((item) => item.supplierName === supplier);
    }

    setEquipment(filtered);
  };

  const handleDelete = async (serialNumber: string) => {
    if (window.confirm("Sunteți sigur că doriți să ștergeți acest aparat?")) {
      try {
        await api_DELETE(`Device/${serialNumber}`);

        // Update the local state after successful deletion
        setEquipment(
          equipment.filter((item) => item.serialNumber !== serialNumber)
        );
        setAllEquipment(
          allEquipment.filter((item) => item.serialNumber !== serialNumber)
        );

        alert("Aparatul a fost șters cu succes");
      } catch (err) {
        console.error("Error deleting equipment:", err);
        alert("A apărut o eroare la ștergerea aparatului");
      }
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Aparate</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cauta aparat..."
              className="pl-8 bg-slate-800 border-slate-700 text-slate-100"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-800 text-slate-100 border-slate-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                {filterSupplier ? filterSupplier : "Toti furnizorii"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 text-slate-100 border-slate-700">
              <DropdownMenuLabel>Furnizor</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterChange("")}
              >
                Toti furnizorii
              </DropdownMenuItem>
              {suppliers.map((supplier) => (
                <DropdownMenuItem
                  key={supplier}
                  className="focus:bg-slate-700"
                  onClick={() => handleFilterChange(supplier)}
                >
                  {supplier}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to={ROUTES.ADD_EQUIPMENT}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adauga Aparat
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-800 text-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="rounded-md border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="text-slate-200">Serie</TableHead>
              <TableHead className="text-slate-200">Model</TableHead>
              <TableHead className="text-slate-200">Client</TableHead>
              <TableHead className="text-slate-200">Furnizor</TableHead>
              <TableHead className="text-slate-200">Versiune</TableHead>
              <TableHead className="text-slate-200 text-right">
                Actiuni
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-400"
                >
                  Se încarcă...
                </TableCell>
              </TableRow>
            ) : equipment.length > 0 ? (
              equipment.map((item) => (
                <TableRow
                  key={item.serialNumber}
                  className="border-slate-800 hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {item.serialNumber}
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.clientName}</TableCell>
                  <TableCell>{item.supplierName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-slate-700 text-slate-100"
                    >
                      {item.softwareVersion}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-300 hover:bg-slate-700"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-slate-800 text-slate-100 border-slate-700"
                      >
                        <DropdownMenuLabel>Actiuni</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Link
                            to={`/equipment/${item.serialNumber}`}
                            className="flex items-center w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Link
                            to={`/equipment/${item.serialNumber}/edit`}
                            className="flex items-center w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="focus:bg-slate-700 text-red-400 focus:text-red-400"
                          onClick={() => handleDelete(item.serialNumber)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Sterge</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-400"
                >
                  Nu s-au găsit aparate.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Equipment;
