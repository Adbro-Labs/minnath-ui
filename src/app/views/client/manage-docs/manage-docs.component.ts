import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
} from "@angular/forms";

import { ClientService } from "../../../services/client.service";
import {
  ButtonCloseDirective,
  ButtonModule,
  FormModule,
  ToastBodyComponent,
  ToastComponent,
} from "@coreui/angular";
import { DocsService } from "../../../services/docs.service";
import { environment } from "../../../../environments/environment";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { debounceTime } from "rxjs";

@Component({
  selector: "app-manage-docs",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    MatAutocompleteModule,
    FormsModule,
    ToastComponent,
    ToastBodyComponent,
    ButtonCloseDirective,
  ],
  templateUrl: "./manage-docs.component.html",
  styleUrls: ["./manage-docs.component.scss"],
})
export class ManageDocsComponent {
  clientService = inject(ClientService);
  docsService = inject(DocsService);
  clients: any[] = [];
  fb = inject(FormBuilder);
  applicationLink: string = "";
  testCertLink: string = "";
  serviceRequestLink: string = "";
  showToaster = false;
  form: FormGroup = this.fb.group({
    selectedClient: [""],
    applicantName: [""],
    street: [""],
    place: [""],
    district: [""],
    village: [""],
    houseName: [""],
    houseNumber: [""],
    pincode: [""],
    communicationHouseName: [""],
    communicationHouseNumber: [""],
    communicationStreet: [""],
    communicationPlace: [""],
    communicationDistrict: [""],
    communicationPincode: [""],
    communicationPhoneNumber: [""],
    communicationMobile: [""],
    useOfConnection: [""],
    connectedLoad: [""],
    aadhaarNo: [""],
    parentName: [""],
    contractor: [""],
    licenseNo: [""],
    completionCertNo: [""],
    insulationResistance: [""],
    insulationWithEarth: [""],
    earthResistance: [""],
    email: [""],
    organization: [""],
    designation: [""],
    declarationName: [""],
    declarationDate: [""],
    declarationPlace: [""],
    items: this.fb.array([]),
    purpose: [""],
    tarrif: [""],
    connectedLoadKw: [""],
    connectedLoadKva: [""],
    consumerNumber: [""],
  });
  searchControl = this.fb.control("");

  ngOnInit(): void {
    this.loadClients();
    // initialize with one empty row
    this.addRow();
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        if (typeof value === "string") {
          console.log("Search term changed:", value, this.searchControl.value);
          this.loadClients();
        }
      });
    this.form.get("selectedClient")?.valueChanges.subscribe((clientCode) => {
      console.log("Selected client code:", clientCode);
      if (clientCode) {
        this.docsService.getclientDetails(clientCode).subscribe({
          next: (res) => {
            const details = res?.clientDetails;
            delete details?.selectedClient;
            this.form.patchValue(details);
            this.applicationLink =
              environment.baseUrl +
              "/applications/" +
              details?.applicationFileName;
            this.testCertLink =
              environment.baseUrl +
              "/applications/" +
              details?.testCertificateFileName;
            this.serviceRequestLink =
              environment.baseUrl +
              "/applications/" +
              details?.serviceRequestFileName;
          },
          error: (err) => {
            console.error("Failed to load client details", err);
            if (err.status === 404 && this.form.get("applicantName")?.value) {
              this.form.reset();
              this.applicationLink = "";
              this.testCertLink = "";
            }
          },
        });
      }
    });
  }

  displayFn(user: any): string {
    return user && user.clientName ? user.clientName : "";
  }

  onClientSelected(clientDetails: any) {
    this.form.get("selectedClient")?.setValue(clientDetails.clientCode);
  }

  loadClients() {
    this.clientService
      .getAllClients(0, this.searchControl.value || "")
      .subscribe({
        next: (res) => (this.clients = res),
        error: (err) => console.error("Failed to load clients", err),
      });
  }

  onSubmit() {
    // placeholder submit handler - wire to a service as needed
    console.log("Manage Docs form submitted", this.form.value);

    this.docsService.saveClientDetails(this.form.value).subscribe({
      next: (res) => {
        {
          this.applicationLink =
            environment.baseUrl + "/applications/" + res?.applicationFileName;
          this.testCertLink =
            environment.baseUrl +
            "/applications/" +
            res?.testCertificateFileName;
          this.serviceRequestLink =
            environment.baseUrl +
            "/applications/" +
            res?.serviceRequestFileName;
          this.showToaster = true;
          setTimeout(() => {
            this.showToaster = false;
          }, 2500);
        }
      },
      error: (err) => {
        console.error("Failed to generate document", err);
      },
    });
  }

  get items(): FormArray {
    return this.form.get("items") as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      particulars: [""],
      points: [0],
      rating: [0],
      total: [0],
    });
    this.items.push(row);
  }

  removeRow(index: number) {
    this.items.removeAt(index);
  }

  updateRowTotal(index: number) {
    const row = this.items.at(index) as FormGroup;
    const points = Number(row.get("points")?.value) || 0;
    const rating = Number(row.get("rating")?.value) || 0;
    const total = points * rating;
    row.get("total")?.setValue(total, { emitEvent: false });
  }
}
