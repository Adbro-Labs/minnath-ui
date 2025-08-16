import { DatePipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, TooltipDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { StatementService } from '../../../services/statement.service';
import { PageItemDirective, PageLinkDirective, PaginationComponent } from '@coreui/angular';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statement-list',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent,
      CardBodyComponent, TableDirective, ButtonModule, DatePipe, CommonModule,
       IconDirective, TooltipDirective, PageItemDirective, PageLinkDirective, PaginationComponent],
    providers: [DatePipe],
  templateUrl: './statement-list.component.html',
  styleUrl: './statement-list.component.scss'
})
export class StatementListComponent implements OnInit {
  
  statementService = inject(StatementService);
  router = inject(Router);
  statementList: any[] = [];
  index = 0;

  ngOnInit(): void {
    this.getAccountStatement();
  }

  getAccountStatement() {
    this.statementService.getAccountStatement(this.index).subscribe({
      next: (response: any) => {
        this.statementList = response;
      }
    });
  }

  viewInvoice(statementCode: string) {
    statementCode = statementCode.split("/").join("-");
    window.open(environment.baseUrl + `/statements/${statementCode}.pdf`);
  }

  viewLetterHeadInvoice(statementCode: string) {
    statementCode = statementCode.split("/").join("-");
    window.open(environment.baseUrl + `/statements/${statementCode}-letterhead.pdf`);
  }

  paginate(operation: number) {
    const check = this.index + operation;
    console.log(check, this.index)
    if (check >= 0) {
      this.index = check;
      this.getAccountStatement();
    }
  }

  createStatement() {
    this.router.navigate(["/project/manage-statement"])
  }
}
