import { Component, inject, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, FormModule } from '@coreui/angular';
import { ListGroupDirective, ListGroupItemDirective } from '@coreui/angular';
import { ItemService } from "../../../services/item.service";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, interval, switchMap, takeWhile } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule,
    FormModule, FormsModule, ReactiveFormsModule, ListGroupDirective, ListGroupItemDirective, MatAutocompleteModule],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.scss'
})
export class QuoteListComponent implements OnInit {
  itemList: any[] = [];
  quoteList: any[] = [];
  itemForm!: FormGroup;
  disableGenerate = false;
  quoteCode = "";
  service = inject(ItemService);
  fb = inject(FormBuilder);
  editMode = false;
  itemIndex!: number;
  @Input() clientCode!: string;


  isRecording = false;
  mediaRecorder: any;
  audioChunks: any[] = [];
  status = 'Idle';
  result: any = null;

  level: number = 0; // 0 to 100
  private audioContext!: AudioContext;
  private rafId!: number;

  private audioCtx!: AudioContext;
  private analyser!: AnalyserNode;
  private mic!: MediaStreamAudioSourceNode;
  private data!: Uint8Array;
  private raf!: number;
  processing: boolean = false;

  private ngZone = inject(NgZone);

  addItem() {
    if (this.itemForm.valid) {
      this.quoteList.push(this.itemForm.value);
      this.itemForm.reset();
      this.itemForm.get("itemName")?.setValue("");
      this.service.saveQuotes(this.clientCode, this.quoteList);
    }
  }

   uploadAudio(file: File) {
     const formData = new FormData();
     formData.append('audio', file);
     this.service.transcribeVoice(formData).subscribe();
     this.pollTranscriptionStatus();
   }
  
  pollTranscriptionStatus() {
  interval(2000) // poll every 2 seconds
    .pipe(
      switchMap(() => this.service.checkTranscription()),
      takeWhile((res: any) => res.status !== 'done', true)
    )
    .subscribe((res: any) => {
      this.ngZone.run(() => {
        if (res.status === 'processing') {
          this.status = 'Processing...';
        }

        if (res.status === 'done') {
          this.status = 'Done';
          this.result = res?.result?.formatted;
          console.log(this.result, "Result")
          this.processing = false;
          if (this.result && this.result.length > 0) {
            this.result.forEach((element: any) => {
              if (element.itemName && element.quantity) {
                console.log("pushing")
                this.quoteList.push(element);
              }
            });
          }
        }
      });
    });
}
  
  async toggleRecording() {
    if (!this.isRecording) {
      await this.startRecording();
    } else {
      await this.stopRecording();
    }
  }

  async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];
    this.status = 'Recording...';

    this.mediaRecorder.start();
    this.isRecording = true;

    this.mediaRecorder.ondataavailable = (e: any) => {
      this.audioChunks.push(e.data);
    };    

     this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;

    this.mic = this.audioCtx.createMediaStreamSource(stream);
    this.mic.connect(this.analyser);

    this.data = new Uint8Array(this.analyser.fftSize);

    this.loop();
  }

    loop() {
    // Reads raw waveform instead of frequency
    (this.analyser.getByteTimeDomainData as any)(this.data);

    // Compute average deviation from center (128)
    let sum = 0;
    for (let i = 0; i < this.data.length; i++) {
      sum += Math.abs(this.data[i] - 128);
    }

    const avg = sum / this.data.length;

    // Convert to 0–100 scale
      this.level = Math.min(100, Math.round((avg / 128) * 100));
      
  

    this.raf = requestAnimationFrame(() => this.loop());
  }

  async stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
    this.status = 'Uploading...';
    this.processing = true;
    this.mediaRecorder.onstop = async () => {
      const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const file = new File([blob], 'audio.webm');
      this.uploadAudio(file);
      cancelAnimationFrame(this.rafId);
      cancelAnimationFrame(this.raf);
      if (this.audioContext) this.audioContext.close();
    }
  }



  initForm() {
    this.itemForm = this.fb.group({
      itemName: ["", Validators.required],
      quantity: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadItems("");
    this.initForm();
    this.itemForm.get("itemName")?.valueChanges.pipe(
      debounceTime(300)
    )
      .subscribe({
        next: (response: any) => {
          this.loadItems(response);
        }
      });
    
  }

  loadDraftQuotes() {
    this.quoteList = this.service.getQuotes(this.clientCode) || [];
  }

  loadItems(searchText = "") {
    this.service.getAllItems(0, searchText).subscribe({
      next: (response: any) => {
        this.itemList = response;
      }
    });
  }

  generateQuote() {
    this.disableGenerate = true;
    this.service.generateQuote({
      id: this.quoteCode,
      clientCode: this.clientCode,
      items: this.quoteList
    }).subscribe({
      next: (response: any) => {
        this.disableGenerate = false;
        this.quoteList = [];
        this.service.removeQuotes(this.clientCode);
        if (response.filePath) {
          window.open(environment.baseUrl + response.filePath);
        }
      }, error: () => {
        this.disableGenerate = false;
      }
    });

  }
  deleteItem(index: number) {
    this.quoteList.splice(index, 1);
    this.service.saveQuotes(this.clientCode, this.quoteList);
  }

   ngOnDestroy(): void {
     cancelAnimationFrame(this.rafId);
     cancelAnimationFrame(this.raf);
     if (this.audioContext) this.audioContext.close();
   }
  
  editItem(item: any, index: number) {
    if (!item) {
      return;
    }
    this.itemForm.patchValue(item);
    this.editMode = true;
    this.itemIndex = index;
  }


  updateItem() {
    if (this.itemIndex !== undefined && this.itemForm.valid) { 
      this.quoteList[this.itemIndex] = this.itemForm.value;
      this.service.saveQuotes(this.clientCode, this.quoteList);
      this.editMode = false;
      this.itemForm.reset();
    }
  }
  cancelEdit() {
    this.editMode = false;
    this.itemForm.reset();
  }


}
