import React, { useState } from "react";
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
import {
  Search,
  MoreVertical,
  Edit,
  Trash,
  Eye,
  Filter,
  Calendar,
} from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/Constants";

// Equipment type definition
interface IEquipment {
  id: string;
  serialNumber: string;
  importDate: string;
  installDate: string;
  softwareVersion: string;
  client: {
    id: string;
    name: string;
  };
  supplier: {
    id: string;
    name: string;
  };
}

const Equipment: React.FC = () => {
  // Sample equipment data - replace with your actual data
  const defaultEquipment: IEquipment[] = [
    {
      id: "1",
      serialNumber: "XR-2023-001",
      importDate: "2023-06-10",
      installDate: "2023-06-15",
      softwareVersion: "v3.2.1",
      client: {
        id: "1",
        name: "SC Example Tech SRL",
      },
      supplier: {
        id: "1",
        name: "TechSupply Inc.",
      },
    },
    {
      id: "2",
      serialNumber: "XR-2023-002",
      importDate: "2023-07-05",
      installDate: "2023-07-12",
      softwareVersion: "v3.2.1",
      client: {
        id: "2",
        name: "Petrica Ionescu PFA",
      },
      supplier: {
        id: "2",
        name: "Equipment Providers SRL",
      },
    },
    {
      id: "3",
      serialNumber: "XR-2023-003",
      importDate: "2023-08-15",
      installDate: "2023-08-20",
      softwareVersion: "v3.3.0",
      client: {
        id: "3",
        name: "Mega Engineering SRL",
      },
      supplier: {
        id: "1",
        name: "TechSupply Inc.",
      },
    },
    {
      id: "4",
      serialNumber: "XR-2023-004",
      importDate: "2023-09-22",
      installDate: "2023-09-30",
      softwareVersion: "v3.3.0",
      client: {
        id: "4",
        name: "Construct Solutions SA",
      },
      supplier: {
        id: "3",
        name: "Industrial Equipment SA",
      },
    },
    {
      id: "5",
      serialNumber: "XR-2023-005",
      importDate: "2023-10-10",
      installDate: "2023-10-15",
      softwareVersion: "v3.4.0",
      client: {
        id: "5",
        name: "Medical Services Group",
      },
      supplier: {
        id: "2",
        name: "Equipment Providers SRL",
      },
    },
  ];

  const allEquipment = defaultEquipment;

  const [equipment, setEquipment] = useState(allEquipment);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSupplier, setFilterSupplier] = useState("");

  // Get unique suppliers for filter
  const suppliers = [
    ...new Set(allEquipment.map((item) => item.supplier.name)),
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    let filtered = allEquipment;

    if (term) {
      filtered = filtered.filter(
        (item) =>
          item.serialNumber.toLowerCase().includes(term) ||
          item.client.name.toLowerCase().includes(term) ||
          item.softwareVersion.toLowerCase().includes(term)
      );
    }

    if (filterSupplier) {
      filtered = filtered.filter(
        (item) => item.supplier.name === filterSupplier
      );
    }

    setEquipment(filtered);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (supplier: any) => {
    setFilterSupplier(supplier);

    let filtered = allEquipment;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.serialNumber.toLowerCase().includes(searchTerm) ||
          item.client.name.toLowerCase().includes(searchTerm) ||
          item.softwareVersion.toLowerCase().includes(searchTerm)
      );
    }

    if (supplier) {
      filtered = filtered.filter((item) => item.supplier.name === supplier);
    }

    setEquipment(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO");
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

      <div className="rounded-md border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="text-slate-200">Serie</TableHead>
              <TableHead className="text-slate-200">Client</TableHead>
              <TableHead className="text-slate-200">Furnizor</TableHead>
              <TableHead className="text-slate-200">Data Instalare</TableHead>
              <TableHead className="text-slate-200">Versiune</TableHead>
              <TableHead className="text-slate-200 text-right">
                Actiuni
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.length > 0 ? (
              equipment.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-slate-800 hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {item.serialNumber}
                  </TableCell>
                  <TableCell>{item.client.name}</TableCell>
                  <TableCell>{item.supplier.name}</TableCell>
                  <TableCell className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {formatDate(item.installDate)}
                  </TableCell>
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
                            to={`/equipment/${item.id}`}
                            className="flex items-center w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Link
                            to={`/equipment/${item.id}/edit`}
                            className="flex items-center w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700 text-red-400 focus:text-red-400">
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
