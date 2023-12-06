import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NewIdService } from '../../services/new-id.service';
import { SecretSantaService } from '../../services/secret-santa.service';
import { SecretSantaEvent, SecretSantaParticipant } from '../../../../../../worker/secretSanta/src/types';
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
  public eventNameFormGroup: FormGroup;
  public participantsFormGroup: FormGroup;
  public eventDetailsFormGroup: FormGroup;
  public secretSantaFormGroup: FormGroup; // Single form group for the new form
  public participants: SecretSantaParticipant[] = [];
  public eventOwner: string = ''; // Store the selected event owner
  public event!: SecretSantaEvent;
  public form: number = 1;

  constructor(
    private route: ActivatedRoute,
    private idService: NewIdService,
    private secretSantaService: SecretSantaService,
    private _formBuilder: FormBuilder
  ) {
    // Initialize form groups for both forms
    this.eventNameFormGroup = this._formBuilder.group({
      eventName: ['', Validators.required],
    });
    this.participantsFormGroup = this._formBuilder.group({
      participantName: [''],
      eventOwner: ['', Validators.required],
    });
    this.eventDetailsFormGroup = this._formBuilder.group({
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      dollarLimit: ['', Validators.required],
    });
    this.secretSantaFormGroup = this._formBuilder.group({
      // All controls for the single form
    });
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
    const participantName = this.participantsFormGroup.get('participantName')?.value;
    if (participantName) {
      this.participants.push({
        name: participantName,
        password: '',
        passwordIsSet: false,
        isOwner: (this.participantsFormGroup.get('eventOwner')?.value === participantName),
        wishlist: []
      });
      this.participantsFormGroup.reset({
        eventOwner: this.participantsFormGroup.get('eventOwner')?.value,
      });
    }
  }

  submit(): void {
    this.newId = this.idService.generateRandomString(5);
    this.qrCodeUrl = `${environment.uiUrl}main/${this.newId}`;
    this.id = this.newId;

    this.event = {
      id: this.newId,
      eventName: this.eventNameFormGroup.get('eventName')?.value,
      participants: this.participants,
      eventDate: this.eventDetailsFormGroup.get('eventDate')?.value,
      eventLocation: this.eventDetailsFormGroup.get('eventLocation')?.value,
      dollarLimit: this.eventDetailsFormGroup.get('dollarLimit')?.value,
      qrCodeUrl: this.qrCodeUrl,
      eventOwnerName: this.participantsFormGroup.get('eventOwner')?.value,
    };

    this.secretSantaService.addEvent(this.event).subscribe((event) => {
      console.log('Event Submitted:', this.event);
    });
  }

  ToggleForm() {
    this.form = this.form * -1;
  }
}
