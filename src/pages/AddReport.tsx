import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import { FormFields } from "@/types/form";
import ReusableForm from "@/components/ui/custom components/ReusableForm";
import logo from "../assets/logo.png";
import * as z from "zod";

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
  representative: string;

  // Equipment Information
  equipment: string;
  problemDescription: string;

  // Service Details
  beforePhotos?: string[];
  standardProcedures: string[];
  additionalProcedures?: string[];
  replacedParts?: string[];

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
// Base64 placeholder for signature (this is just a minimal example - real signatures would be longer)
const signaturePlaceholder =
  "data:image/png;base64,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";

// Example image data URL (a small transparent PNG)
const imagePlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// Single service report example
const sampleServiceReport: ServiceReportData = {
  // Client Information
  client: "SC Mega Industries SRL",
  representative: "Ion Popescu",

  // Equipment Information
  equipment: "Compresor industrial AR-7500",
  problemDescription:
    "Echipamentul emite un zgomot puternic în timpul functionarii si se opreste automat dupa aproximativ 10 minute de utilizare.",

  // Service Details
  beforePhotos: [imagePlaceholder, imagePlaceholder],
  standardProcedures: [
    "Verificare conexiuni electrice",
    "Curățare filtre de aer",
    "Testare presiune de lucru",
  ],
  additionalProcedures: [
    "Înlocuire garnituri uzate",
    "Calibrare senzor de temperatură",
  ],
  replacedParts: [
    "Filtru de aer FLT-1200",
    "Garnitură compresor GRN-452",
    "Senzor de presiune SNZ-889",
  ],

  // Work Metrics
  workHours: 3.5,
  travelDistance: 45,
  conclusions:
    "Compresorul a fost reparat cu succes. Cauza principala a defectiunii a fost o garnitura uzata care permitea scurgerea de aer si supraincalzirea motorului. După inlocuirea pieselor si recalibrarea senzorilor, echipamentul functioneaza la parametri normali.",
  afterPhotos: [imagePlaceholder, imagePlaceholder, imagePlaceholder],

  // Signatures
  clientSignature: signaturePlaceholder,
  engineerSignature: signaturePlaceholder,

  // Metadata
  reportId: "SRV-20250428-001",
  serviceDate: "2025-04-28",
  createdAt: "2025-04-28T10:15:30Z",
  updatedAt: "2025-04-28T14:20:45Z",
  status: "completed",
};

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
            <Text style={styles.valueColumn}>{data.client}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Reprezentat de:</Text>
            <Text style={styles.valueColumn}>{data.representative}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Model analizor:</Text>
            <Text style={styles.valueColumn}>{data.equipment}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>S/N:</Text>
            <Text style={styles.valueColumn}>SERIAL NUMBER</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Contract de service:</Text>
            <Text style={styles.valueColumn}>CONTRACT_NO</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelColumn}>Contact:</Text>
            <Text style={styles.valueColumn}>EMAIL</Text>
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
              {[1, 2, 3, 4, 5].map((photo, index) => (
                <Image
                  key={`after-${index}`}
                  style={styles.image}
                  src={
                    "https://medgill.co.uk/cdn/shop/collections/image_d428c745-7b12-4c6b-bc3d-3ac49ec57673.jpg?v=1722875051&width=1500"
                  }
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
            {[
              "DECONTAMINARE INTERNA SI EXTERNA",
              "UNGERE PARTI MECANICE",
              "VERIFICARE SISTEM HIDRAULIC, VACCUM =",
              "VERIFICARE ANSAMBLU ASPIRATIE",
              "VERIFICARE SISTEM OPTIC, ADJUST LED =",
              "TESTARE LA ELECTROSECURITATE",
            ].map((procedure) => (
              <Text>{procedure}</Text>
            ))}
          </View>
        </View>

        {/* Additional procedures  */}
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
            {[
              "DECONTAMINARE",
              "VERIFICARE VACCUM",
              "VERIFICARE ASPIRATIE",
              "ADJUST LED ",
              "TESTARE",
              "MANEVRARE",
              "DEBITARE",
            ].map((procedure) => (
              <Text>{procedure}</Text>
            ))}
          </View>
        </View>

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
                    {part} ({part.length})
                  </Text>
                  <Text style={{ padding: "5px", width: "50%" }}>
                    SERIAL_NO{part.length}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={{ fontSize: 12 }}>
              Nr. Bon de consum (daca este cazul) : NUMERO_CONSUMERO
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
            <Text>TIMP DE LUCRU: {data.workHours}</Text>
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
            <Text>CHELTUIELI DE TRANSPORT/KM: {data.workHours}</Text>
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
              {[1, 2, 3, 4, 5].map((photo, index) => (
                <Image
                  key={`after-${index}`}
                  style={styles.image}
                  src={
                    "https://images.stockcake.com/public/2/7/8/2786aaa1-66ae-4360-8af3-160232beced6_large/medical-equipment-stand-stockcake.jpg"
                  }
                />
              ))}
            </View>
          )}
        </View>

        {/* Before Photos Section */}
        {/* {data.beforePhotos && data.beforePhotos.length > 0 && (
          <View style={styles.photoSection}>
            <Text style={styles.photoTitle}>Poze inainte de interventie:</Text>
            <View style={styles.photoGrid}>
              {data.beforePhotos.map((photo, index) => (
                <Image
                  key={`before-${index}`}
                  style={styles.image}
                  src={photo}
                />
              ))}
            </View>
          </View>
        )} */}

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

// Modified AddReport component with PDF generation
const AddReport = () => {
  const [formData, setFormData] = React.useState<ServiceReportData>();

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
    replacedParts: z.array(z.string()).optional(),
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

  const formFields: FormFields = {
    client: {
      type: "combobox",
      label: "Client",
      placeholder: "Selectați clientul",
      defaultValue: "",
      options: [
        // These would be populated from your database
        { value: "client1", label: "Client 1" },
        { value: "client2", label: "Client 2" },
      ],
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
      options: [
        // These would be populated from your database
        { value: "equip1", label: "Aparat 1" },
        { value: "equip2", label: "Aparat 2" },
      ],
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
      options: [
        // These would be populated from your database
        { value: "proc1", label: "Procedură 1" },
        { value: "proc2", label: "Procedură 2" },
      ],
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
      type: "combobox",
      label: "Piese înlocuite",
      placeholder: "Selectați piesa",
      defaultValue: "",
      multiple: true,
      maxFields: 10,
      addButtonLabel: "Adaugă piesă înlocuită",
      options: [
        // These would be populated from your database
        { value: "part1", label: "Piesă 1" },
        { value: "part2", label: "Piesă 2" },
      ],
    },
    workHours: {
      type: "text",
      label: "Timp de lucru (ore)",
      placeholder: "Ex: 2.5",
      defaultValue: "",
    },
    travelDistance: {
      type: "text",
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

  const handleSubmit = (data: ServiceReportData) => {
    console.log(data);
    setFormData(data); // Store form data for PDF generation
    console.log(formData);
  };

  return (
    <>
      <ReusableForm
        title="Adaugare Raport Service Nou"
        schema={formSchema}
        fields={formFields}
        onSubmit={(data) => handleSubmit(data as ServiceReportData)}
        submitLabel="Adauga Raport Service"
      />
      <PDFViewer width={"100%"} height={"700px"}>
        <ServiceReportPDF data={sampleServiceReport} />
      </PDFViewer>
      <PDFDownloadLink
        document={<ServiceReportPDF data={sampleServiceReport} />}
        fileName={`service-report-${sampleServiceReport.client}-${
          new Date().toISOString().split("T")[0]
        }.pdf`}
        // className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {({ loading }) => (loading ? "Se generează PDF..." : "Descarcă PDF")}
      </PDFDownloadLink>
    </>
  );
};

export default AddReport;
