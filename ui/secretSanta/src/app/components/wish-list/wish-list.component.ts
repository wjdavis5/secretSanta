import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SecretSantaParticipant } from '../../../../../../worker/secretSanta/src/types';
import { SecretSantaService } from '../../services/secret-santa.service';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.css'],
})
export class WishListComponent implements OnInit {
  @Input() eventId!: string;
  @Input() participantId!: string;
  @Input() isAuthorized!: boolean;
  @Input() password!: string;
  participant!: SecretSantaParticipant;

  constructor(
    private secretSantaService: SecretSantaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    const participantId = this.route.snapshot.paramMap.get('participantId');

    if (eventId && participantId) {
      this.getParticipant(eventId, participantId);
    }
  }

  addToWishList(item: any) {
    this.participant!.wishlist.push({ link: item.value });
    this.secretSantaService
      .updateParticipantWishList(
        this.eventId,
        this.participant!.name,
        this.password,
        this.participant!.wishlist
      )
      .subscribe({
        next: (participant) => {
          console.log('wishlist updated');
          this.getParticipant(this.eventId, this.participant!.name);
          item.value = '';
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  removeFromWishList(_t21: number) {
    this.participant.wishlist.splice(_t21, 1);
    this.secretSantaService
      .updateParticipantWishList(
        this.eventId,
        this.participant.name,
        this.password,
        this.participant.wishlist
      )
      .subscribe((participant) => {
        console.log('wishlist updated');
        this.getParticipant(this.eventId, this.participant.name);
      });
  }

  getParticipant(eventId: string, name: string) {
    this.secretSantaService
      .getParticipant(eventId, name)
      .subscribe((participant) => (this.participant = participant));
  }
}
