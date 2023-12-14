import { SecretSantaEventV1, SecretSantaEventV2, SecretSantaParticipant, SecretSantaParticipantAssignment } from "../types";
import { DataStore } from "./DataStore";

export class d1store implements DataStore {
    
    constructor(private d1: D1Database) {}
    async getEvent(eventId: string, email: string): Promise<SecretSantaEventV2> {
        const query = `
        SELECT e.*, up.id as participantId, up.Email as participantEmail
        FROM Events e
        JOIN Users u ON e.ownerId = u.id
        LEFT JOIN eventParticipants ep ON e.id = ep.eventId
        LEFT JOIN Users up ON ep.userId = up.id
        WHERE e.shortCode = ?
        AND (u.Email = ? OR EXISTS (
            SELECT 1 
            FROM eventParticipants ep2 
            JOIN Users u2 ON ep2.userId = u2.id 
            WHERE ep2.eventId = e.id AND u2.Email = ?)
        )
        `
        const results = await this.d1.prepare(query).bind(eventId,email,email).all();
        if (results.error) {
            throw new Error(results.error);
        }
        console.debug(`Results: ${JSON.stringify(results)}`) ;       
        const topResult = results.results[0];
        const event :any  = topResult;
        return event;
    }

    createEvent(event: SecretSantaEventV2): Promise<SecretSantaEventV2> {
        for(const participant of event.participants) {
            this.createParticipant(event.shortCode, participant);
        }
    }

    getParticipant(eventId: string, participantName: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async createParticipant(event: SecretSantaEventV2, email: string): Promise<boolean> {
        const query = `
        INSERT INTO eventParticipants (eventId,email) VALUES (?,?)`
        const results = await this.d1.prepare(query).bind(event.id,email).run();
        console.debug(`Results: ${JSON.stringify(results)}`) ;
        if (results?.error) {
            throw new Error(results.error);
        }
        return true;
    }

    getParticipantAssignment(eventId: string, participantName: string): Promise<SecretSantaParticipantAssignment | undefined> {
        throw new Error("Method not implemented.");
    }

    createParticipantAssignment(eventId: string, assignment: SecretSantaParticipantAssignment): Promise<SecretSantaParticipantAssignment> {
        throw new Error("Method not implemented.");
    }

}