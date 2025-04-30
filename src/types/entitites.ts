export interface IClient {
  clientId: number;
  name: string;
  email: string;
  address: string;
  createdAt: string;
  isActive: boolean;
  warrantyContract: string;
  contractNumber: string;
}

export interface IEquipment {
  serialNumber: string;
  description: string;
  importDate: string;
  installationDate: string;
  softwareVersion: string;
  clientId: number;
  clientName: string;
  supplierName: string;
  supplierId: number;
}

export interface ISupplier {
  supplierId: number;
  name: string;
  email: string;
  address: string;
  contractNumber: string;
}

export interface IPart {
  partNumber: string;
  description: string;
  price: number;
}

export interface IStock {
  partNumber: string;
  quantity: number;
}
