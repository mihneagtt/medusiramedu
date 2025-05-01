import React, { useState, useEffect } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import logo from "../assets/logo-black.jpg";
import * as z from "zod";
import { api_GET } from "@/utilities";
import {
  IClient,
  IEquipment,
  IPart,
  IStandardProcedure,
} from "@/types/entitites";

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  logo: {
    width: "30vw",
    marginBottom: 40,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "1px solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingBottom: 5,
    paddingTop: 5,
    fontSize: 12,
  },
  labelColumn: {
    width: "30%",
    fontWeight: "bold",
  },
  valueColumn: {
    width: "70%",
  },
  image: {
    marginVertical: 10,
    width: 150,
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    width: "40%",
    borderTop: "1px solid #000",
    paddingTop: 5,
  },
  signatureLabel: {
    fontWeight: "bold",
    fontSize: 12,
  },
});

export interface ServiceReportData {
  // Client Information
  client: string;
  clientName?: string;
  representative: string;

  // Equipment Information
  equipment: string;
  equipmentName?: string;
  serialNumber?: string;
  contractNumber?: string;
  clientEmail?: string;
  problemDescription: string;

  // Service Details
  beforePhotos?: string[];
  standardProcedures: string[];
  additionalProcedures?: string[];
  replacedParts?: {
    partNumber: string;
    description: string;
    quantity: number;
  }[];

  // Work Metrics
  workHours: number;
  travelDistance?: number;
  conclusions: string;
  afterPhotos?: string[];

  // Signatures
  clientSignature: string;
  engineerSignature: string;

  // Optional metadata
  reportId?: string;
  serviceDate?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "draft" | "submitted" | "approved" | "completed";
}

// PDF Document component
const ServiceReportPDF = ({ data }: { data: ServiceReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Image src={logo} style={styles.logo} />
      <View style={{ gap: "15px" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: 14,
          }}
        >
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text>RAPORT DE SERVICE:</Text>
            <Text>ID</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>
            <Text>DATA:</Text>
            <Text>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Client Information */}
        <View style={{ gap: 5 }}>
          <Text
            wrap={false}
            style={{
              padding: "5px",
              backgroundColor: "#5eb6ff",
              border: "1px solid black",
              fontSize: 14,
            }}
          >
            INFORMATII GENERALE
          </Text>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Beneficiar:</Text>
            <Text style={styles.valueColumn}>
              {data.clientName || data.client}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Reprezentat de:</Text>
            <Text style={styles.valueColumn}>{data.representative}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Model analizor:</Text>
            <Text style={styles.valueColumn}>
              {data.equipmentName || data.equipment}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>S/N:</Text>
            <Text style={styles.valueColumn}>{data.serialNumber || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Contract de service:</Text>
            <Text style={styles.valueColumn}>
              {data.contractNumber || "N/A"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Contact:</Text>
            <Text style={styles.valueColumn}>{data.clientEmail || "N/A"}</Text>
          </View>
        </View>

        {/* Problem Description */}
        <View style={{ gap: 5 }}>
          <Text
            wrap={false}
            style={{
              padding: "5px",
              backgroundColor: "#5eb6ff",
              border: "1px solid black",
              fontSize: 14,
            }}
          >
            DESCRIEREA PROBLEMEI
          </Text>
          <Text style={{ fontSize: 12 }}>{data.problemDescription}</Text>
          {data.beforePhotos && data.beforePhotos.length > 0 && (
            <View style={styles.photoGrid}>
              {data.beforePhotos.map((photo, index) => (
                <Image
                  key={`before-${index}`}
                  style={styles.image}
                  src={photo}
                />
              ))}
            </View>
          )}
        </View>

        {/* Standard procedures  */}
        <View style={{ gap: 5 }}>
          <Text
            wrap={false}
            style={{
              padding: "5px",
              backgroundColor: "#5eb6ff",
              border: "1px solid black",
              fontSize: 14,
            }}
          >
            PROCEDURI DE MENTENANTA STANDARD EFECTUATE:
          </Text>
          <View style={{ gap: 10, fontSize: "12px" }}>
            {data.standardProcedures.map((procedure) => (
              <Text key={procedure}>{procedure}</Text>
            ))}
          </View>
        </View>

        {/* Additional procedures  */}
        {data.additionalProcedures && data.additionalProcedures.length > 0 && (
          <View style={{ gap: 5 }}>
            <Text
              wrap={false}
              style={{
                padding: "5px",
                backgroundColor: "#5eb6ff",
                border: "1px solid black",
                fontSize: 14,
              }}
            >
              PROCEDURI DE MENTENANTA SUPLIMENTARE EFECTUATE:
            </Text>
            <View style={{ gap: 10, fontSize: "12px" }}>
              {data.additionalProcedures.map((procedure) => (
                <Text key={procedure}>{procedure}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Parts Replaced */}
        {data.replacedParts && data.replacedParts.length > 0 && (
          <View style={{ gap: 5 }}>
            <Text
              wrap={false}
              style={{
                padding: "5px",
                backgroundColor: "#5eb6ff",
                border: "1px solid black",
                fontSize: 14,
              }}
            >
              PIESE DE SCHIMB UTILIZATE
            </Text>
            <View wrap={false}>
              <View
                style={{
                  flexDirection: "row",
                  fontSize: 12,
                  borderBottom: "1px solid black",
                }}
              >
                <Text
                  style={{
                    padding: "5px",
                    width: "50%",
                    borderRight: "1px solid black",
                    fontWeight: "bold",
                  }}
                >
                  DENUMIRE REPER (CANTITATE)
                </Text>
                <Text
                  style={{ padding: "5px", width: "50%", fontWeight: "bold" }}
                >
                  PART NUMBER
                </Text>
              </View>
              {data.replacedParts.map((part) => (
                <View
                  key={part.partNumber}
                  style={{
                    flexDirection: "row",
                    fontSize: 12,
                    borderBottom: "1px solid black",
                  }}
                >
                  <Text
                    style={{
                      padding: "5px",
                      width: "50%",
                      borderRight: "1px solid black",
                    }}
                  >
                    {part.description} ({part.quantity})
                  </Text>
                  <Text style={{ padding: "5px", width: "50%" }}>
                    {part.partNumber}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 12 }}>
              Nr. Bon de consum (daca este cazul) : N/A
            </Text>
          </View>
        )}

        {/* Additional Information */}
        <View style={{ gap: 5 }}>
          <Text
            wrap={false}
            style={{
              padding: "5px",
              backgroundColor: "#5eb6ff",
              border: "1px solid black",
              fontSize: 14,
            }}
          >
            INFORMATII SUPLIMENTARE
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 5,
              fontSize: 12,
            }}
          >
            <Text>TIMP DE LUCRU: {data.workHours} ore</Text>
            <Text>
              (pretul orelor de manopera este conform contractului de service)
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 5,
              fontSize: 12,
            }}
          >
            <Text>
              CHELTUIELI DE TRANSPORT/KM: {data.travelDistance || 0} km
            </Text>
            <Text>(daca este cazul)</Text>
          </View>
        </View>

        {/* Conclusions */}
        <View style={{ gap: 5 }}>
          <Text
            wrap={false}
            style={{
              padding: "5px",
              backgroundColor: "#5eb6ff",
              border: "1px solid black",
              fontSize: 14,
            }}
          >
            CONCLUZII
          </Text>
          <Text style={{ fontSize: 12 }}>{data.conclusions}</Text>
          {data.afterPhotos && data.afterPhotos.length > 0 && (
            <View style={styles.photoGrid}>
              {data.afterPhotos.map((photo, index) => (
                <Image
                  key={`after-${index}`}
                  style={styles.image}
                  src={photo}
                />
              ))}
            </View>
          )}
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection} wrap={false}>
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Semnatura client:</Text>
            <Image
              style={{ width: 150, height: 50 }}
              src={data.clientSignature}
            />
          </View>
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Semnatura inginer:</Text>
            <Image
              style={{ width: 150, height: 50 }}
              src={data.engineerSignature}
            />
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Modified AddReport component with PDF generation and API data
const AddReport: React.FC = () => {
  const [formData, setFormData] = useState<ServiceReportData | null>(null);
  const [clients, setClients] = useState<IClient[]>([]);
  const [equipment, setEquipment] = useState<IEquipment[]>([]);
  const [parts, setParts] = useState<IPart[]>([]);
  const [standardProcedures, setStandardProcedures] = useState<
    IStandardProcedure[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [selectedClient] = useState<string>("");
  // const [clientEquipment, setClientEquipment] = useState<IEquipment[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all required data concurrently
        const [
          clientsResponse,
          equipmentResponse,
          partsResponse,
          proceduresResponse,
        ] = await Promise.all([
          api_GET("Client/all"),
          api_GET("Device/all"),
          api_GET("Part/all"),
          api_GET("StandardProcedure/all"),
        ]);

        // Parse responses if they are strings
        const parsedClients =
          typeof clientsResponse === "string"
            ? JSON.parse(clientsResponse)
            : clientsResponse;
        const parsedEquipment =
          typeof equipmentResponse === "string"
            ? JSON.parse(equipmentResponse)
            : equipmentResponse;
        const parsedParts =
          typeof partsResponse === "string"
            ? JSON.parse(partsResponse)
            : partsResponse;
        const parsedProcedures =
          typeof proceduresResponse === "string"
            ? JSON.parse(proceduresResponse)
            : proceduresResponse;

        setClients(parsedClients);
        setEquipment(parsedEquipment);
        setParts(parsedParts);
        setStandardProcedures(parsedProcedures);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "A apărut o eroare la încărcarea datelor"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter equipment by selected client
  // useEffect(() => {
  //   if (selectedClient && equipment.length > 0) {
  //     const filteredEquipment = equipment.filter(
  //       (equip) => equip.clientId.toString() === selectedClient
  //     );
  //     setClientEquipment(filteredEquipment);
  //   } else {
  //     setClientEquipment([]);
  //   }
  // }, [selectedClient, equipment]);

  const formSchema = z.object({
    client: z.string({
      required_error: "Selectați clientul",
    }),
    representative: z.string().min(2, {
      message: "Numele reprezentantului trebuie să aibă cel puțin 2 caractere",
    }),
    equipment: z.string({
      required_error: "Selectați aparatul",
    }),
    problemDescription: z.string().min(10, {
      message: "Descrierea trebuie să aibă cel puțin 10 caractere",
    }),
    beforePhotos: z.array(z.string()).optional(),
    standardProcedures: z.array(z.string()).min(1, {
      message: "Selectați cel puțin o procedură standard",
    }),
    additionalProcedures: z.array(z.string()).optional(),
    replacedParts: z
      .array(
        z.object({
          value: z.string(),
          quantity: z.number().default(1),
        })
      )
      .optional(),
    workHours: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, {
        message: "Introduceți un număr valid (ex: 2.5)",
      })
      .transform((val) => parseFloat(val)),
    travelDistance: z
      .string()
      .regex(/^\d+$/, {
        message: "Introduceți un număr valid de kilometri",
      })
      .optional()
      .transform((val) => (val ? parseInt(val) : 0)),
    conclusions: z.string().min(10, {
      message: "Concluziile trebuie să aibă cel puțin 10 caractere",
    }),
    afterPhotos: z.array(z.string()).optional(),
    clientSignature: z.string({
      required_error: "Semnătura clientului este necesară",
    }),
    engineerSignature: z.string({
      required_error: "Semnătura inginerului este necesară",
    }),
  });

  // Transform API data to form options
  const clientOptions = clients.map((client) => ({
    value: client.clientId.toString(),
    label: client.name,
  }));

  const equipmentOptions = equipment.map((equip) => ({
    value: equip.serialNumber,
    label: `${equip.description} (${equip.serialNumber})`,
  }));

  const partOptions = parts.map((part) => ({
    value: part.partNumber,
    label: `${part.description} - ${part.price} RON`,
    quantity: 5,
  }));

  const procedureOptions = standardProcedures.map((proc) => ({
    value: `${proc.procedureId}`,
    label: proc.name,
  }));

  const formFields: FormFields = {
    client: {
      type: "combobox",
      label: "Client",
      placeholder: "Selectați clientul",
      defaultValue: "",
      options: clientOptions,
      // onChange: (value) => setSelectedClient(value as string),
    },
    representative: {
      type: "text",
      label: "Reprezentant",
      placeholder: "Introduceți numele reprezentantului",
      defaultValue: "",
    },
    equipment: {
      type: "combobox",
      label: "Aparat",
      placeholder: "Selectați aparatul",
      defaultValue: "",
      options: equipmentOptions,
    },
    problemDescription: {
      type: "textarea",
      label: "Descriere problemă",
      placeholder: "Descrieți problema în detaliu",
      defaultValue: "",
    },
    beforePhotos: {
      type: "image",
      label: "Poze înainte de intervenție",
      defaultValue: [],
      maxFiles: 5,
    },
    standardProcedures: {
      type: "combobox",
      label: "Proceduri standard",
      placeholder: "Selectați procedura",
      defaultValue: "",
      multiple: true,
      maxFields: 5,
      addButtonLabel: "Adaugă procedură standard",
      options: procedureOptions,
    },
    additionalProcedures: {
      type: "text",
      label: "Proceduri suplimentare",
      placeholder: "Introduceți procedura",
      defaultValue: "",
      multiple: true,
      maxFields: 5,
      addButtonLabel: "Adaugă procedură suplimentară",
    },
    replacedParts: {
      type: "quantityCombobox",
      label: "Piese înlocuite",
      placeholder: "Selectați piesa",
      defaultValue: "",
      multiple: true,
      maxFields: 10,
      addButtonLabel: "Adaugă piesă înlocuită",
      options: partOptions,
    },
    workHours: {
      type: "number",
      label: "Timp de lucru (ore)",
      placeholder: "Ex: 2.5",
      defaultValue: "",
    },
    travelDistance: {
      type: "number",
      label: "Km deplasare",
      placeholder: "Introduceți numărul de kilometri",
      defaultValue: "",
    },
    conclusions: {
      type: "textarea",
      label: "Concluzii",
      placeholder: "Introduceți concluziile intervenției",
      defaultValue: "",
    },
    afterPhotos: {
      type: "image",
      label: "Poze după intervenție",
      defaultValue: [],
      maxFiles: 5,
    },
    clientSignature: {
      type: "signature",
      label: "Semnătura client",
      defaultValue: "",
    },
    engineerSignature: {
      type: "signature",
      label: "Semnătura inginer",
      defaultValue: "",
    },
  };

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Enhance data with names and details from API data
    console.log("data", data);
    const selectedClientData = clients.find(
      (c) => c.clientId.toString() === data.client
    );
    const selectedEquipmentData = equipment.find(
      (e) => e.serialNumber === data.equipment
    );
    const selectedProcedures = data.standardProcedures.map((procId) => {
      const proc = standardProcedures.find(
        (p) => p.procedureId.toString() === procId
      );
      return proc ? proc.name : procId;
    });
    const selectedParts = data.replacedParts
      ? data.replacedParts.map((part) => {
          const partInfo = parts.find((p) => p.partNumber === part.value);
          return {
            partNumber: part.value,
            description: partInfo ? partInfo.description : part.value,
            quantity: part.quantity || 1,
          };
        })
      : [];

    const enhancedData: ServiceReportData = {
      ...data,
      clientName: selectedClientData?.name,
      clientEmail: selectedClientData?.email,
      contractNumber: selectedClientData?.contractNumber,
      equipmentName: selectedEquipmentData?.description,
      serialNumber: selectedEquipmentData?.serialNumber,
      standardProcedures: selectedProcedures,
      replacedParts: selectedParts,
    };

    setFormData(enhancedData);
  };

  if (isLoading) {
    return <div className="p-4">Se încarcă datele...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-800 text-red-100 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <>
      <ReusableForm
        title="Adaugare Raport Service Nou"
        schema={formSchema}
        fields={formFields}
        onSubmit={(data) => handleSubmit(data as z.infer<typeof formSchema>)}
        submitLabel="Adauga Raport Service"
      />

      {formData && (
        <>
          {/* <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Previzualizare PDF</h2>
            <PDFViewer width={"100%"} height={"700px"}>
              <ServiceReportPDF data={formData} />
            </PDFViewer>
          </div> */}

          <div className="mt-4 mb-8">
            <PDFDownloadLink
              document={<ServiceReportPDF data={formData} />}
              fileName={`service-report-${
                formData.clientName || formData.client
              }-${new Date().toISOString().split("T")[0]}.pdf`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {({ loading }) =>
                loading ? "Se generează PDF..." : "Descarcă PDF"
              }
            </PDFDownloadLink>
          </div>
        </>
      )}
    </>
  );
};

export default AddReport;
