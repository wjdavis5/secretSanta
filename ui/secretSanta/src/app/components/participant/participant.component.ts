import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecretSantaService } from '../../services/secret-santa.service';
import { SecretSantaParticipant } from '../../../../../../worker/secretSanta/src/types';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrl: './participant.component.css',
})
export class ParticipantComponent {
  public participant!: SecretSantaParticipant;
  public eventId!: string;
  public newPassword!: string;
  public newWishListItem!: string;
  public disabledButton: boolean = true;
  public assignment!: SecretSantaParticipant;
  public isSelf: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private secretSantaService: SecretSantaService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const eventId = params.get('eventId');
      const participantId = params.get('participantId');

      if (
        eventId === null ||
        eventId === undefined ||
        participantId === null ||
        participantId === undefined
      ) {
        throw new Error('Event ID or Participant ID is null or undefined');
      }
      this.eventId = eventId;
      this.getParticipant(eventId, participantId);
    });
  }

  getParticipant(eventId: string, participantId: string) {
    this.secretSantaService
      .getParticipant(eventId, participantId)
      .subscribe((participant) => {
        this.participant = participant;
      });
  }

  addToWishList() {
    this.participant.wishlist.push({ link: this.newWishListItem });
    this.secretSantaService
      .updateParticipantWishList(
        this.eventId,
        this.participant.name,
        this.newPassword,
        this.participant.wishlist
      )
      .subscribe((participant) => {
        console.log('wishlist updated');
        this.getParticipant(this.eventId, this.participant.name);
      });
  }
  removeFromWishList(_t21: number) {
    this.participant.wishlist.splice(_t21, 1);
    this.secretSantaService
      .updateParticipantWishList(
        this.eventId,
        this.participant.name,
        this.newPassword,
        this.participant.wishlist
      )
      .subscribe((participant) => {
        console.log('wishlist updated');
        this.getParticipant(this.eventId, this.participant.name);
      });
  }

  updatePassword() {
    this.secretSantaService
      .updateParticipantPassword(
        this.eventId,
        this.participant.name,
        this.newPassword
      )
      .subscribe((participant) => {
        console.log('password updated');
        this.getParticipant(this.eventId, this.participant.name);
      });
  }

  getParticipantAssignment() {
    this.secretSantaService
      .getParticipantAssignment(
        this.eventId,
        this.participant.name,
        this.newPassword
      )
      .subscribe((participant) => {
        this.assignment = participant;
      });
  }
  toggleSelf() {
    this.isSelf = !this.isSelf;
  }
}
