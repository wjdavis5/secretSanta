import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewIdService } from '../../services/new-id.service';
import { SecretSantaService } from '../../services/secret-santa.service';
import {
  SecretSantaEvent,
  SecretSantaParticipant,
} from '../../../../../../worker/secretSanta/src/types';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  public id: string | undefined;
  public newId: string | undefined;
  public qrCodeUrl: string | undefined;
  public loading: boolean = false;
  public secretSantaFormGroup: FormGroup; // Single form group for the new form
  public participants: SecretSantaParticipant[] = [];
  public eventOwner: string = ''; // Store the selected event owner
  public event!: SecretSantaEvent;

  constructor(
    private route: ActivatedRoute,
    private idService: NewIdService,
    private secretSantaService: SecretSantaService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.secretSantaFormGroup = this.fb.group({
      eventName: ['', Validators.required],
      participantName: ['', Validators.required],
      participants: this.fb.array([]),
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      dollarLimit: ['', Validators.required],
    });
  }
  get participantsFormArray(): FormArray {
    return this.secretSantaFormGroup.get('participants') as FormArray;
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventId');
      if (eventId === 'new' || eventId === null || eventId === undefined) {
        this.id = 'new';
      } else {
        this.getExistingEvent(eventId);
      }
    });
  }

  getExistingEvent(id: string) {
    this.secretSantaService.getEvent(id).subscribe((event) => {
      this.event = event;
    });
  }

  isNew(): boolean {
    return this.id === 'new';
  }

  addParticipant(): void {
    const participantName = this.secretSantaFormGroup.get('participantName')!.value;

    const participantFormGroup = this.fb.group({
      name: [participantName, Validators.required],
      password: [''], // Add other necessary fields
      passwordIsSet: [false],
      isOwner: [false],
      wishlist: [[]],
    });
    this.participantsFormArray.push(participantFormGroup);
  }

  removeParticipant(index: number): void {
    this.participantsFormArray.removeAt(index);
  }

  submit(): void {
    this.newId = this.idService.generateRandomString(5);
    this.qrCodeUrl = `${environment.uiUrl}main/${this.newId}`;
    this.id = this.newId;

    const formValue = this.secretSantaFormGroup.value;

    const event = {
      id: this.newId,
      eventName: formValue.eventName,
      participants: formValue.participants.map((participant: any) => ({
        ...participant,
        isOwner: participant.name === formValue.eventOwner,
      })),
      eventDate: formValue.eventDate,
      eventLocation: formValue.eventLocation,
      dollarLimit: formValue.dollarLimit,
      qrCodeUrl: this.qrCodeUrl,
      eventOwnerName: formValue.eventOwner,
    };

    this.secretSantaService.addEvent(event).subscribe({
      next: (event) => {
        console.log('Event Submitted:', this.event);
        this.router.navigate(['/main/' + event.id]);
        this.event = event;

      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
  }
}
