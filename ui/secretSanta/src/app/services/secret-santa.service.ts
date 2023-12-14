import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  SecretSantaEventV1,
  SecretSantaParticipant,
  WishListEntry,
} from '../../../../../worker/secretSanta/src/types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SecretSantaService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getEvent(id: string): Observable<SecretSantaEventV1> {
    return this.httpClient.get<SecretSantaEventV1>(
      `${this.baseUrl}api/secretSanta/${id}`
    );
  }
  getEventV2(id: string): Observable<SecretSantaEventV1> {
    return this.httpClient.get<SecretSantaEventV1>(
      `${this.baseUrl}api/v2/secretSanta/${id}`
    );
  }
  addEvent(event: SecretSantaEventV1): Observable<SecretSantaEventV1> {
    return this.httpClient.post<SecretSantaEventV1>(
      `${this.baseUrl}api/secretSanta/${event.id}`,
      event
    );
  }
  getParticipant(eventId: string, participantId: string) {
    return this.httpClient.get<SecretSantaParticipant>(
      `${this.baseUrl}api/secretSanta/${eventId}/${participantId}`
    );
  }
  updateParticipantPassword(
    eventId: string,
    participantId: string,
    newPassword: string
  ) {
    return this.httpClient.put(
      `${this.baseUrl}api/secretSanta/${eventId}/${participantId}/password`,
      newPassword
    );
  }
  updateParticipantWishList(
    eventId: string,
    participantId: string,
    participantPassword: string,
    wishList: WishListEntry[]
  ) {
    return this.httpClient.put(
      `${this.baseUrl}api/secretSanta/${eventId}/${participantId}/wishList`,
      wishList,
      {
        headers: new HttpHeaders({
          'x-participant-password': participantPassword,
        }),
      }
    );
  }
  getParticipantAssignment(
    eventId: string,
    participantId: string,
    participantPassword: string
  ) {
    return this.httpClient.get<SecretSantaParticipant>(
      `${this.baseUrl}api/secretSanta/${eventId}/${participantId}/assignment`,
      {
        headers: new HttpHeaders({
          'x-participant-password': participantPassword,
        }),
      }
    );
  }
  login(eventId: string, participantId: string, participantPassword: string) {
    return this.httpClient.post(
      `${this.baseUrl}api/secretSanta/${eventId}/${participantId}/login`,
      participantPassword,
      {
        headers: new HttpHeaders({
          'x-participant-password': participantPassword,
        }),
        observe: 'response'
      }
    );
  }
}
