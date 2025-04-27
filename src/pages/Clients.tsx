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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/Constants";

interface IClient {
  id: string;
  name: string;
  email: string;
  address: string;
  contractNumber: string;
  contractType: "garantie" | "contract";
  creationDate: string;
  isActive: boolean;
}

const ClientList: React.FC = () => {
  // Updated client data with isActive field
  const defaultClients: IClient[] = [
    {
      id: "1",
      name: "SC Example Tech SRL",
      email: "contact@exampletech.ro",
      address: "Str. Victoriei nr. 24, București",
      contractNumber: "CT-2023-001",
      contractType: "garantie",
      creationDate: "2023-07-15",
      isActive: true,
    },
    {
      id: "2",
      name: "Petrica Ionescu PFA",
      email: "petrica@example.com",
      address: "Str. Libertății nr. 10, Cluj-Napoca",
      contractNumber: "CT-2023-002",
      contractType: "contract",
      creationDate: "2023-08-22",
      isActive: true,
    },
    {
      id: "3",
      name: "Mega Engineering SRL",
      email: "office@megaeng.ro",
      address: "Bd. Timișoara nr. 55, București",
      contractNumber: "CT-2023-003",
      contractType: "garantie",
      creationDate: "2023-09-05",
      isActive: false,
    },
    {
      id: "4",
      name: "Construct Solutions SA",
      email: "info@constructsolutions.ro",
      address: "Str. Aviatorilor nr. 32, Iași",
      contractNumber: "CT-2023-004",
      contractType: "contract",
      creationDate: "2023-10-18",
      isActive: true,
    },
    {
      id: "5",
      name: "Medical Services Group",
      email: "office@medicalservices.ro",
      address: "Bd. Carol I nr. 12, Brașov",
      contractNumber: "CT-2023-005",
      contractType: "garantie",
      creationDate: "2023-11-03",
      isActive: false,
    },
  ];

  const allClients = defaultClients;

  const [clients, setClients] = useState(allClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterActive, setFilterActive] = useState("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filterType, filterActive);
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    applyFilters(searchTerm, type, filterActive);
  };

  const handleFilterActiveChange = (active: string) => {
    setFilterActive(active);
    applyFilters(searchTerm, filterType, active);
  };

  const applyFilters = (term: string, type: string, active: string) => {
    let filtered = allClients;

    if (term) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.contractNumber.toLowerCase().includes(term)
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((client) => client.contractType === type);
    }

    if (active !== "all") {
      filtered = filtered.filter(
        (client) => client.isActive === (active === "active")
      );
    }

    setClients(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO");
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Clienti</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cauta client..."
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
                {filterType === "all"
                  ? "Toate"
                  : filterType === "garantie"
                  ? "Garantie"
                  : "Contract"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 text-slate-100 border-slate-700">
              <DropdownMenuLabel>Tip Contract</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterTypeChange("all")}
              >
                Toate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterTypeChange("garantie")}
              >
                Garantie
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterTypeChange("contract")}
              >
                Contract
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-slate-800 text-slate-100 border-slate-700"
              >
                {filterActive === "all" ? (
                  <>
                    <Filter className="h-4 w-4 mr-2" />
                    Toate
                  </>
                ) : filterActive === "active" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Activ
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Inactiv
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 text-slate-100 border-slate-700">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterActiveChange("all")}
              >
                Toate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterActiveChange("active")}
              >
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Activ
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterActiveChange("inactive")}
              >
                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                Inactiv
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to={ROUTES.ADD_CLIENT}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adauga Client
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="text-slate-200">Nume</TableHead>
              <TableHead className="text-slate-200">Data Crearii</TableHead>
              <TableHead className="text-slate-200">Contract</TableHead>
              <TableHead className="text-slate-200">Tip</TableHead>
              <TableHead className="text-slate-200">Status</TableHead>
              <TableHead className="text-slate-200 text-right">
                Actiuni
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length > 0 ? (
              clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="border-slate-800 hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                    {formatDate(client.creationDate)}
                  </TableCell>
                  <TableCell>{client.contractNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        client.contractType === "garantie"
                          ? "secondary"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {client.contractType === "garantie"
                        ? "Garantie"
                        : "Contract"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {client.isActive ? (
                      <span className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activ
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <XCircle className="h-4 w-4 mr-2" />
                        Inactiv
                      </span>
                    )}
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
                            to={`/clients/${client.id}`}
                            className="flex items-center w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Link
                            to={`/clients/${client.id}/edit`}
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
                  Nu s-au găsit clienti.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientList;
