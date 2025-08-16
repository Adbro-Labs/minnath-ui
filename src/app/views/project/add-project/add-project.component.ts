import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { ProjectService } from 'src/app/services/project.service';
import { ClientService } from 'src/app/services/client.service';
import { Clients } from 'src/app/models/clients';
import { Locations } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss'
})
export class AddProjectComponent implements OnInit{
  visible = false;
  projectForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();
  clientList: Clients[] = [];
  locationList: Locations[] = [];
  projectTypes = [
    {
      code: 'WIRING',
      label: 'Wiring'
    }
  ];

  fb = inject(FormBuilder);
  projectService = inject(ProjectService);
  clientService = inject(ClientService);
  locationService = inject(LocationService);

  ngOnInit(): void {
    this.initProjectForm();
    this.getActiveClients();
    this.getActiveLocations();
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  initProjectForm() {
    this.projectForm = this.fb.group({
      projectCode: [''],
      projectName: ['', Validators.required],
      projectType: [''],
      locationCode: ['', Validators.required],
      clientCode: ['', Validators.required]
    });
  }

  getActiveClients() {
    this.clientService.getAllActiveClients().subscribe({
      next: (response) => {
        this.clientList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getActiveLocations() {
    this.locationService.getAllActiveLocations().subscribe({
      next: (response) => {
        this.locationList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  saveProject() {
    if (this.projectForm?.valid) {
      this.projectService.saveProject(this.projectForm?.value).subscribe({
        next: (response) => {
          console.log(response);
          this.visible = false;
          this.projectForm.reset();
          this.updated.emit(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
