import React, { useEffect, useState } from "react";
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

// Updated interface to match API response
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

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<IClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<IClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterActive, setFilterActive] = useState("all");

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://tiny-lizard-94.telebit.io/api/Client/all",
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
        const data = JSON.parse(result) as IClient[];
        setClients(data);
        console.log(data);
        setFilteredClients(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError("Failed to load clients. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

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
    let filtered = [...clients];

    if (term) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(term) ||
          client.contractNumber.toLowerCase().includes(term)
      );
    }

    if (type !== "all") {
      filtered = filtered.filter((client) =>
        type === "garantie"
          ? client.warrantyContract === "true"
          : client.warrantyContract !== "true"
      );
    }

    if (active !== "all") {
      filtered = filtered.filter(
        (client) => client.isActive === (active === "active")
      );
    }

    setFilteredClients(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO");
  };
  // Add this function within your ClientList component
  const handleDeleteClient = async (clientId: number) => {
    if (!window.confirm("Sigur doriți să ștergeți acest client?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://tiny-lizard-94.telebit.io/api/Client/${clientId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted client from state
      const updatedClients = clients.filter(
        (client) => client.clientId !== clientId
      );
      setClients(updatedClients);

      // Also update filtered clients
      setFilteredClients((prevFiltered) =>
        prevFiltered.filter((client) => client.clientId !== clientId)
      );

      alert("Client șters cu succes!");
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("A apărut o eroare la ștergerea clientului. Încercați din nou.");
    }
  };

  // Determine contract type based on warrantyContract field
  const getContractType = (client: IClient) => {
    return client.warrantyContract === "true" ? "garantie" : "contract";
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

          {/* Status Filter */}
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
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">
            Se încarcă datele...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : (
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
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow
                    key={client.clientId}
                    className="border-slate-800 hover:bg-slate-800/50"
                  >
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      {formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell>{client.contractNumber}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          getContractType(client) === "garantie"
                            ? "secondary"
                            : "default"
                        }
                        className="capitalize"
                      >
                        {getContractType(client) === "garantie"
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
                              to={`/clients/${client.clientId}`}
                              className="flex items-center w-full"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Vizualizare</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-slate-700">
                            <Link
                              to={`/clients/${client.clientId}/edit`}
                              className="flex items-center w-full"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editare</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.preventDefault(); // Prevent any link behavior
                              handleDeleteClient(client.clientId);
                            }}
                            className="focus:bg-slate-700 text-red-400 focus:text-red-400"
                            style={{ cursor: "pointer" }}
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
                    Nu s-au găsit clienti.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default ClientList;
