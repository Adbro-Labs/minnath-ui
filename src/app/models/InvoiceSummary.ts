import { Transaction } from "./transaction";

export interface InvoiceSummary {
    invoiceDetails: any;
    invoiceSummary: Transaction[];
}