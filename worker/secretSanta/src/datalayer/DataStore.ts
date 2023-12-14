import {
  SecretSantaEventV1,
  SecretSantaEventV2,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment
} from "../types";


export interface DataStore {
  getEvent(eventId: string, email: string): Promise<SecretSantaEventV2>;
  createEvent(event: SecretSantaEventV2): Promise<SecretSantaEventV2>;
  getParticipant(
    eventId: string,
    participantName: string
  ): Promise<boolean>;
  createParticipant(
    event: SecretSantaEventV2,
    email: string
  ): Promise<boolean>;
  getParticipantAssignment(
    eventId: string,
    participantName: string
  ): Promise<SecretSantaParticipantAssignment | undefined>;
  createParticipantAssignment(
    eventId: string,
    assignment: SecretSantaParticipantAssignment
  ): Promise<SecretSantaParticipantAssignment>;
}
