import { Component, OnInit } from '@angular/core';
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
    BadgeComponent,
    CarouselComponent,
    CarouselItemComponent,
    CarouselIndicatorsComponent,
    CarouselControlComponent,
    RowComponent,
    ColComponent,
    ContainerComponent],
  templateUrl: './work-log.component.html',
  styleUrl: './work-log.component.scss'
})
export class WorkLogComponent implements OnInit  {
   // Header Information
  clientInfo = {
    companyLogo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    clientName: 'Acme Corporation',
    projectTitle: 'Digital Transformation Project',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-12-15')
  };

  // Mock Data
  quotes: Quote[] = [
    {
      id: '1',
      quoteNumber: 'QT-2024-001',
      amount: 15000,
      description: 'Frontend Development - Phase 1',
      status: 'approved',
      date: new Date('2024-01-10')
    },
    {
      id: '2',
      quoteNumber: 'QT-2024-002', 
      amount: 22500,
      description: 'Backend API Development',
      status: 'pending',
      date: new Date('2024-02-01')
    },
    {
      id: '3',
      quoteNumber: 'QT-2024-003',
      amount: 8750,
      description: 'UI/UX Design Consultation',
      status: 'approved',
      date: new Date('2024-01-20')
    }
  ];

  invoices: Invoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      amount: 15000,
      status: 'paid',
      date: new Date('2024-02-01'),
      dueDate: new Date('2024-02-15')
    },
    {
      id: '2', 
      invoiceNumber: 'INV-2024-002',
      amount: 8750,
      status: 'paid',
      date: new Date('2024-02-15'),
      dueDate: new Date('2024-03-01')
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      amount: 11250,
      status: 'pending',
      date: new Date('2024-03-01'),
      dueDate: new Date('2024-03-15')
    }
  ];

  mediaItems: MediaItem[] = [
    {
      id: '1',
      type: 'image',
      title: 'Homepage Mockup',
      url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      thumbnailUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '2',
      type: 'image', 
      title: 'Dashboard Design',
      url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      thumbnailUrl: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '3',
      type: 'video',
      title: 'Demo Video - User Flow',
      url: '#',
      thumbnailUrl: 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=200'
    },
    {
      id: '4',
      type: 'document',
      title: 'Technical Specification',
      url: '#',
      fileType: 'PDF',
      size: '2.3 MB'
    },
    {
      id: '5',
      type: 'document',
      title: 'Project Requirements',
      url: '#', 
      fileType: 'DOCX',
      size: '1.8 MB'
    }
  ];

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

  ngOnInit(): void {}

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

  previewQuote(quote: Quote): void {
    console.log('Previewing quote:', quote.quoteNumber);
    // Implement preview logic
  }

  downloadInvoice(invoice: Invoice): void {
    console.log('Downloading invoice:', invoice.invoiceNumber);
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
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}
