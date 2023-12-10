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
import { AuthService } from '@auth0/auth0-angular';
import { tap } from 'rxjs/operators';

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
  user: import('@auth0/auth0-angular').User | null | undefined;

  constructor(
    private route: ActivatedRoute,
    private idService: NewIdService,
    private secretSantaService: SecretSantaService,
    private fb: FormBuilder,
    private router: Router,
    public auth: AuthService
  ) {
    this.secretSantaFormGroup = this.fb.group({
      eventName: ['', Validators.required],
      participantName: ['', Validators.required],
      participants: this.fb.array([]),
      eventDate: ['', Validators.required],
      eventLocation: ['', Validators.required],
      dollarLimit: ['', Validators.required],
    });
    this.auth.handleRedirectCallback();
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
    this.auth.error$.pipe(tap((error) => console.log(error)));
    this.auth.isLoading$.pipe(tap((loading) => console.log(loading)));
    this.auth.isAuthenticated$.subscribe({
      next: (a) => {
        console.log('isAuthenticated', a);
      },
      error: (err) => console.log(err),
      complete: () => console.log('isAuthenticated complete'),
    });
    this.auth.user$.subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => console.log(err),
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
    const participantName =
      this.secretSantaFormGroup.get('participantName')!.value;

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
  login() {
    this.auth.loginWithRedirect().subscribe({
      next: (result) => {
        console.log(result);
        let x = this.auth.user$;
      },
      error: (err) => console.log(err),
      complete: () => console.log('complete'),
    });
  }
  logout() {
    this.auth.logout({ logoutParams: { returnTo: document.location.origin } });
  }
}
