import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, FormModule } from '@coreui/angular';
import { AddProjectComponent } from "../add-project/add-project.component";
import { ProjectService } from '../../../services/project.service';
import { ClientService } from "../../../services/client.service";
import { Project } from '../../../models/project';
import { Router } from '@angular/router';
import { Clients } from '../../../models/clients';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-list-project',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, FormModule,
    AddProjectComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './list-project.component.html',
  styleUrl: './list-project.component.scss'
})
export class ListProjectComponent implements OnInit {
  @ViewChild('addproject') addproject: AddProjectComponent | undefined;
  ProjectService = inject(ProjectService);
  clientService = inject(ClientService);
  router = inject(Router);
  clientList: Clients[] = [];
  clientCode = "";

  projectDetails: Project[] = [];

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllProjects() {
    this.ProjectService.getAllProjects({clientCode: this.clientCode}).subscribe({
      next: (response) => {
        this.projectDetails = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  addprojects() {
    if (this.addproject) {
      this.addproject.visible = true;
    }
  }
  editProject(item: any) {
    if (this.addproject) {
      this.addproject.projectForm.patchValue(item);
      this.addproject.visible = true;
    }
  }

  viewProject(projectCode: string) {
    this.router.navigate(['/project/byId', projectCode]);
  }

  getAllClients() {
    this.clientService.getAllActiveClients().subscribe({
      next: (response: any) => {
        this.clientList = response;
      }
    })
  }
}
