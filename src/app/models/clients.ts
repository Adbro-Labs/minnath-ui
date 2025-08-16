import { Banks } from "./banks";

export interface Clients {
    clientCode: string;
    clientName: string;
    locationCode: string;
    currentBalance: number;
    creditLimit: number;
    contactPersonName: string;
    contactNumber: string;
    locationName: string;
    invoiceCode: string;
}

export interface ClientsWithBankDetails extends Clients, Banks {
    
}
