import React, { useState } from "react";
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
import { Search, MoreVertical, Edit, Trash, Eye, Package } from "lucide-react";
import { Link } from "react-router";
import { ROUTES } from "@/Constants";

// Part type definition
interface IPart {
  id: string;
  serialNumber: string;
  name: string;
  quantity: number;
  compatibleWith?: string[];
}

const PartsList: React.FC<{ parts: IPart[] }> = ({ parts: initialParts }) => {
  // Sample parts data - replace with your actual data
  const defaultParts: IPart[] = [
    {
      id: "1",
      serialNumber: "P-2023-001",
      name: "Filtru de aer",
      quantity: 15,
      compatibleWith: ["XR-2023-001", "XR-2023-002"],
    },
    {
      id: "2",
      serialNumber: "P-2023-002",
      name: "Placă electronică",
      quantity: 5,
      compatibleWith: ["XR-2023-003"],
    },
    {
      id: "3",
      serialNumber: "P-2023-003",
      name: "Senzor temperatură",
      quantity: 20,
      compatibleWith: ["XR-2023-001", "XR-2023-003", "XR-2023-004"],
    },
    {
      id: "4",
      serialNumber: "P-2023-004",
      name: "Compresor",
      quantity: 2,
      compatibleWith: ["XR-2023-002", "XR-2023-005"],
    },
    {
      id: "5",
      serialNumber: "P-2023-005",
      name: "Panou control",
      quantity: 8,
      compatibleWith: ["XR-2023-001", "XR-2023-005"],
    },
  ];

  const allParts = initialParts || defaultParts;

  const [parts, setParts] = useState(allParts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term) {
      const filtered = allParts.filter(
        (part) =>
          part.serialNumber.toLowerCase().includes(term) ||
          part.name.toLowerCase().includes(term)
      );
      setParts(filtered);
    } else {
      setParts(allParts);
    }
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

      <div className="rounded-md border border-slate-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow>
              <TableHead className="text-slate-200">Serie</TableHead>
              <TableHead className="text-slate-200">Nume</TableHead>
              <TableHead className="text-slate-200">Cantitate</TableHead>
              <TableHead className="text-slate-200 text-right">
                Actiuni
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.length > 0 ? (
              parts.map((part) => (
                <TableRow
                  key={part.id}
                  className="border-slate-800 hover:bg-slate-800/50"
                >
                  <TableCell className="font-medium">
                    {part.serialNumber}
                  </TableCell>
                  <TableCell>{part.name}</TableCell>
                  <TableCell className="flex items-center">
                    <Package className="h-4 w-4 mr-2 text-slate-400" />
                    {part.quantity}
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
                            to={`/parts/${part.id}`}
                            className="flex items-center w-full"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Vizualizare</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-slate-700">
                          <Link
                            to={`/parts/${part.id}/edit`}
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
                  colSpan={4}
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
