import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  CardComponent, 
  CardBodyComponent, 
  CardHeaderComponent,
  TableDirective,
  ButtonDirective,
  BadgeComponent,
  CarouselComponent,
  CarouselItemComponent,
  CarouselIndicatorsComponent,
  CarouselControlComponent,
  RowComponent,
  ColComponent,
  ContainerComponent
} from '@coreui/angular';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LpoService } from '../../services/lpo.service';
import { ItemService } from '../../services/item.service';
import { environment } from '../../../environments/environment';

export interface Quote {
  id: string;
  quoteNumber: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  date: Date;
  dueDate: Date;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'document';
  title: string;
  url: string;
  thumbnailUrl?: string;
  fileType?: string;
  size?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  date: Date;
  type: 'update' | 'milestone' | 'note';
}
@Component({
  selector: 'app-work-log',
  standalone: true,
  imports: [ CommonModule,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    TableDirective,
    ButtonDirective,
    UploadFilesComponent,
    RowComponent,
    ColComponent,
    ContainerComponent],
  templateUrl: './work-log.component.html',
  styleUrl: './work-log.component.scss'
})
export class WorkLogComponent implements OnInit  {

  @ViewChild('uploader') uploader: UploadFilesComponent | undefined;
  route = inject(ActivatedRoute);
  service = inject(LpoService);
  quote = inject(ItemService);
  invoiceList: any[] = [];
  clientCode: string = "";
  documents = [];

  showUploader() {
    if (this.uploader) {
      this.uploader.visible = true;
    }
  }

  getDocuments() {
    this.service.getAllLPO(this.clientCode).subscribe({
      next: (response: any) => {
        this.invoiceList = response?.filter((x: any) => x.fileCategory == 'INVOICE');
        this.mediaItems = response?.filter((x: any) => x.fileCategory == 'DOCUMENT');
        this.mediaItems = this.mediaItems.map(x => {
          x.fileName = environment.assetUrl + "/" + x.fileName;
          return x;
        })
      }
    });
  }

  getQuotes(index = 0) {
    this.quote.getAllQuotes(this.clientCode, index).subscribe({
      next: (response: any) => {
        this.quotes = response?.data;
      }
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (response) => {
        if (response["clientCode"]) {
          this.clientCode = response["clientCode"];
          this.getDetails();
        }
      }
    })
  }

  getDetails() {
    this.getQuotes();
    this.getDocuments();
  }

  // Mock Data
  quotes: any[] = [];

  invoices: Invoice[] = [];

  mediaItems: any[] = [];

  notes: Note[] = [
    {
      id: '1',
      title: 'Project Kickoff Meeting',
      content: 'Initial project requirements discussed. Stakeholders aligned on timeline and deliverables.',
      author: 'John Smith',
      date: new Date('2024-01-15'),
      type: 'milestone'
    },
    {
      id: '2',
      title: 'Design Phase Complete',
      content: 'All wireframes and mockups approved by client. Ready to proceed with development.',
      author: 'Sarah Johnson',
      date: new Date('2024-02-10'),
      type: 'milestone'
    },
    {
      id: '3',
      title: 'Weekly Progress Update',
      content: 'Frontend development is 70% complete. API integration testing in progress.',
      author: 'Mike Wilson',
      date: new Date('2024-02-20'),
      type: 'update'
    },
    {
      id: '4',
      title: 'Client Feedback Session',
      content: 'Received feedback on beta version. Minor UI adjustments requested.',
      author: 'Emily Davis',
      date: new Date('2024-02-25'),
      type: 'note'
    }
  ];

  constructor() {}


  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'approved':
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning'; 
      case 'rejected':
      case 'overdue':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getFileIcon(fileType: string): string {
    switch (fileType?.toLowerCase()) {
      case 'pdf':
        return 'cil-description';
      case 'docx':
      case 'doc':
        return 'cil-notes';
      case 'xlsx':
      case 'xls':
        return 'cil-spreadsheet';
      default:
        return 'cil-file';
    }
  }

  getNoteIcon(type: string): string {
    switch (type) {
      case 'milestone':
        return 'cil-star';
      case 'update':
        return 'cil-info';
      case 'note':
        return 'cil-notes';
      default:
        return 'cil-circle';
    }
  }

  downloadQuote(quote: Quote): void {
    console.log('Downloading quote:', quote.quoteNumber);
    // Implement download logic
  }

  previewQuote(quote: any): void {
    console.log('Previewing quote:', quote.quoteNumber);
    window.open(`${environment.baseUrl}/quotes/${quote?.fileName}`, "_Blank");
  }

  downloadInvoice(invoice: any): void {
    console.log('Downloading invoice:', invoice);
    window.open(`${environment.assetUrl}/${invoice?.fileName}`, "_Blank");
    // Implement download logic
  }

  downloadMedia(media: MediaItem): void {
    console.log('Downloading media:', media.title);
    // Implement download logic
  }

  downloadFullReport(): void {
    console.log('Downloading full report');
    // Implement full report download logic
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  lightboxItem: any = null;

  openLightbox(item: any, type: string) {
    if (type == 'image' || type == 'video') {
      item.type = type;
      this.lightboxItem = item;
    } else {
      window.open(item.fileName, '_Blank');
    }    
  }

  closeLightbox() {
    this.lightboxItem = null;
  }
}
