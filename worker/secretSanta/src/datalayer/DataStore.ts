import {
  SecretSantaEvent,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment
} from "../types";


export interface DataStore {
  getEvent(eventId: string): Promise<SecretSantaEvent>;
  createEvent(event: SecretSantaEvent): Promise<SecretSantaEvent>;
  getParticipant(
    eventId: string,
    participantName: string
  ): Promise<SecretSantaParticipant>;
  createParticipant(
    eventId: string,
    participant: SecretSantaParticipant
  ): Promise<SecretSantaParticipant>;
  getParticipantAssignment(
    eventId: string,
    participantName: string
  ): Promise<SecretSantaParticipantAssignment | undefined>;
  createParticipantAssignment(
    eventId: string,
    assignment: SecretSantaParticipantAssignment
  ): Promise<SecretSantaParticipantAssignment>;
}
