import {
  SecretSantaEventV1,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment,
} from "../types";
import { DataStore } from "./DataStore";

export class R2DataStore implements DataStore {
  constructor(private bucket: R2Bucket) {}

  async getEvent(eventId: string): Promise<SecretSantaEventV1> {
    return (await (await this.bucket.get(eventId))?.json()) as SecretSantaEventV1;
  }

  async createEvent(event: SecretSantaEventV1): Promise<SecretSantaEventV1> {
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
    console.log(`Creating assignment for ${assignment.participant.name}`);
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
