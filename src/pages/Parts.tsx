import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Package,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/Constants";
import { api_GET, api_DELETE } from "@/utilities";
import { IPart, IStock } from "@/types/entitites";

// Part type definition with price field
interface IPartQuantity {
  partNumber: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const PartsList: React.FC = () => {
  const [parts, setParts] = useState<IPartQuantity[]>([]);
  const [allParts, setAllParts] = useState<IPartQuantity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch parts data from API
  useEffect(() => {
    const fetchParts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch parts data
        const partsData = await api_GET("Part/all");
        const parts = JSON.parse(partsData);

        // Fetch stock data
        const stockData = await api_GET("Stock/all");
        const stock = JSON.parse(stockData);

        // Map stock quantities to parts
        const stockMap = new Map();
        stock.forEach((stock: IStock) => {
          stockMap.set(stock.partNumber, stock.quantity);
        });

        // Combine data
        const combinedParts: IPartQuantity[] = parts.map((part: IPart) => ({
          partNumber: part.partNumber,
          name: part.description || "Unnamed Part", // Using description as name
          description: part.description,
          price: part.price,
          quantity: stockMap.get(part.partNumber) || 0,
        }));

        setParts(combinedParts);
        setAllParts(combinedParts);
        setError(null);
      } catch (err) {
        console.error("Error fetching parts:", err);
        setError(
          err instanceof Error
            ? err.message
            : "A apărut o eroare la încărcarea pieselor"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchParts();
  }, []);

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = allParts.filter(
        (part) =>
          part.partNumber.toLowerCase().includes(term) ||
          part.name.toLowerCase().includes(term) ||
          part.description.toLowerCase().includes(term)
      );
      setParts(filtered);
    } else {
      setParts(allParts);
    }
  };

  const handleDeletePart = async (partNumber: string) => {
    if (window.confirm("Sigur doriți să ștergeți această piesă?")) {
      try {
        // Delete the part
        await api_DELETE(`Part/${partNumber}`);

        // Update the local state
        setParts(parts.filter((part) => part.partNumber !== partNumber));
        setAllParts(allParts.filter((part) => part.partNumber !== partNumber));

        alert("Piesa a fost ștearsă cu succes!");
      } catch (err) {
        console.error("Error deleting part:", err);
        alert("A apărut o eroare la ștergerea piesei. Încercați din nou.");
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
    }).format(price);
  };

  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Piese</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cauta piesa..."
              className="pl-8 bg-slate-800 border-slate-700 text-slate-100"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Link to={ROUTES.ADD_PART}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Adauga Piesa
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-800 text-red-100 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="rounded-md border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="text-slate-200">Serie</TableHead>
              <TableHead className="text-slate-200">Nume</TableHead>
              <TableHead className="text-slate-200">Cantitate</TableHead>
              <TableHead className="text-slate-200">Preț</TableHead>
              <TableHead className="text-slate-200 text-right">
                Actiuni
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-400"
                >
                  Se încarcă piesele...
                </TableCell>
              </TableRow>
            ) : parts.length > 0 ? (
              parts.map((part) => (
                <TableRow
                  key={part.partNumber}
                  className="border-slate-800 hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {part.partNumber}
                  </TableCell>
                  <TableCell>{part.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-slate-400" />
                      <span>{part.quantity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-slate-400" />
                      <span>{formatPrice(part.price)}</span>
                    </div>
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
                            to={`/parts/${part.partNumber}`}
                            className="flex items-center w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Link
                            to={`/parts/${part.partNumber}/edit`}
                            className="flex items-center w-full"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="focus:bg-slate-700 text-red-400 focus:text-red-400"
                          onClick={() => handleDeletePart(part.partNumber)}
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
                  colSpan={5}
                  className="h-24 text-center text-slate-400"
                >
                  Nu s-au găsit piese.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PartsList;
