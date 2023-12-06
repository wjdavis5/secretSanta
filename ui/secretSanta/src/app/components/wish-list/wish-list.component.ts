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
  participant: SecretSantaParticipant | null = null;

  constructor(
    private secretSantaService: SecretSantaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    const participantId = this.route.snapshot.paramMap.get('participantId');

    if (eventId && participantId) {
      this.secretSantaService
        .getParticipant(eventId, participantId)
        .subscribe((participant) => (this.participant = participant));
    }
  }
}
