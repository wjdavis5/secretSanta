import {
  SecretSantaEvent,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment,
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

export class R2DataStore implements DataStore {
  constructor(private bucket: R2Bucket) {}

  async getEvent(eventId: string): Promise<SecretSantaEvent> {
    return (await (await this.bucket.get(eventId))?.json()) as SecretSantaEvent;
  }

  async createEvent(event: SecretSantaEvent): Promise<SecretSantaEvent> {
    await this.bucket.put(event.id, JSON.stringify(event));
    return event;
  }

  async getParticipant(
    eventId: string,
    participantName: string
  ): Promise<SecretSantaParticipant> {
    return (await (
      await this.bucket.get(`${eventId}:${participantName}`)
    )?.json()) as SecretSantaParticipant;
  }
  async createParticipant(
    eventId: string,
    participant: SecretSantaParticipant
  ): Promise<SecretSantaParticipant> {
    const result = await this.bucket.put(
      `${eventId}:${participant.name}`,
      JSON.stringify(participant)
    );
    if (!result) {
      throw new Error("Failed to create or update participant");
    }
    return participant;
  }
  async getParticipantAssignment(
    eventId: string,
    participantName: string
  ): Promise<SecretSantaParticipantAssignment | undefined> {
    const assignment = (await (
      await this.bucket.get(`${eventId}:${participantName}:assignment`)
    )?.json()) as SecretSantaParticipantAssignment;
    if (!assignment) {
      return undefined;
    }
    return assignment;
  }
  async createParticipantAssignment(
    eventId: string,
    assignment: SecretSantaParticipantAssignment
  ): Promise<SecretSantaParticipantAssignment> {
    let result = await this.bucket.put(
      `${eventId}:${assignment.participant.name}:assignment`,
      JSON.stringify(assignment)
    );
    if (!result) {
      throw new Error("Failed to create or update participant assignment");
    }
    return assignment;
  }
}
