import {
  SecretSantaEventV1,
  SecretSantaEventV2,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment
} from "../types";


export interface DataStore<T> {
  getEvent<T>(eventId: string): Promise<T>;
  createEvent(event: SecretSantaEventV1): Promise<SecretSantaEventV1 | SecretSantaEventV2>;
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
