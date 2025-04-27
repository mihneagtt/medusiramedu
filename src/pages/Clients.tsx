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
import { Search, MoreVertical, Edit, Trash, Eye, Filter } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/Constants";
interface IClient {
  id: string;
  name: string;
  email: string;
  address: string;
  contractNumber: string;
  contractType: "garantie" | "contract";
  creationDate: string; // ISO date format like "2023-11-03"
  phone?: string; // Optional phone number
  representative?: string; // Optional company representative
  fiscalCode?: string; // Optional fiscal/tax code
  registrationNumber?: string; // Optional company registration number
  notes?: string; // Optional additional notes
}
const ClientList: React.FC<{ clients: IClient[] }> = ({
  clients: initialClients,
}) => {
  // Sample client data - replace with your actual data
  const defaultClients = [
    {
      id: "1",
      name: "SC Example Tech SRL",
      email: "contact@exampletech.ro",
      address: "Str. Victoriei nr. 24, București",
      contractNumber: "CT-2023-001",
      contractType: "garantie",
      creationDate: "2023-07-15",
    },
    {
      id: "2",
      name: "Petrica Ionescu PFA",
      email: "petrica@example.com",
      address: "Str. Libertății nr. 10, Cluj-Napoca",
      contractNumber: "CT-2023-002",
      contractType: "contract",
      creationDate: "2023-08-22",
    },
    {
      id: "3",
      name: "Mega Engineering SRL",
      email: "office@megaeng.ro",
      address: "Bd. Timișoara nr. 55, București",
      contractNumber: "CT-2023-003",
      contractType: "garantie",
      creationDate: "2023-09-05",
    },
    {
      id: "4",
      name: "Construct Solutions SA",
      email: "info@constructsolutions.ro",
      address: "Str. Aviatorilor nr. 32, Iași",
      contractNumber: "CT-2023-004",
      contractType: "contract",
      creationDate: "2023-10-18",
    },
    {
      id: "5",
      name: "Medical Services Group",
      email: "office@medicalservices.ro",
      address: "Bd. Carol I nr. 12, Brașov",
      contractNumber: "CT-2023-005",
      contractType: "garantie",
      creationDate: "2023-11-03",
    },
  ];

  const allClients = initialClients || defaultClients;

  const [clients, setClients] = useState(allClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (e: any) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    let filtered = allClients;

    if (term) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.contractNumber.toLowerCase().includes(term)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(
        (client) => client.contractType === filterType
      );
    }

    setClients(filtered);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (type: any) => {
    setFilterType(type);

    let filtered = allClients;

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm) ||
          client.contractNumber.toLowerCase().includes(searchTerm)
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((client) => client.contractType === type);
    }

    setClients(filtered);
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
                onClick={() => handleFilterChange("all")}
              >
                Toate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterChange("garantie")}
              >
                Garantie
              </DropdownMenuItem>
              <DropdownMenuItem
                className="focus:bg-slate-700"
                onClick={() => handleFilterChange("contract")}
              >
                Contract
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
              <TableHead className="text-slate-200">Email</TableHead>
              <TableHead className="text-slate-200">Contract</TableHead>
              <TableHead className="text-slate-200">Tip</TableHead>
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
                  <TableCell>{client.email}</TableCell>
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
                  colSpan={5}
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
