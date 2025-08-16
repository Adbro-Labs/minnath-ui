import { Banks } from "./banks";

export interface Project extends Banks{
    projectCode: string;
    projectName: string;
    projectType: string;
    locationCode: string;
    locationName: string;
    currentBalance: number;
    clientCode: string;
    clientName: string;
    contactPersonName: string;
    contactNumber: string;
}
