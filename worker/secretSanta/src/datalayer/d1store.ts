import { SecretSantaEventV1, SecretSantaParticipant, SecretSantaParticipantAssignment } from "../types";
import { DataStore } from "./DataStore";

export class d1store implements DataStore {
    
    constructor(private d1: D1Database) {}
    async getEvent(eventId: string): Promise<SecretSantaEventV1> {
        const results = await this.d1.prepare("SELECT * FROM events WHERE shortCode = ?").bind(eventId).all();
        if (results.error) {
            throw new Error(results.error);
        }
        console.debug(`Results: ${JSON.stringify(results)}`) ;       
        const topResult = results.results[0];
        const event :SecretSantaEventV1 = {
            dollarLimit: 0,
            eventDate: new Date(),
            eventLocation: "",
            eventName: "",
            eventOwnerName: "",
            id: "",
            participants: [],
            qrCodeUrl: ""
        }
        return event;
    }

    createEvent(event: SecretSantaEventV1): Promise<SecretSantaEventV1> {
        throw new Error("Method not implemented.");
    }

    getParticipant(eventId: string, participantName: string): Promise<SecretSantaParticipant> {
        throw new Error("Method not implemented.");
    }

    createParticipant(eventId: string, participant: SecretSantaParticipant): Promise<SecretSantaParticipant> {
        throw new Error("Method not implemented.");
    }

    getParticipantAssignment(eventId: string, participantName: string): Promise<SecretSantaParticipantAssignment | undefined> {
        throw new Error("Method not implemented.");
    }

    createParticipantAssignment(eventId: string, assignment: SecretSantaParticipantAssignment): Promise<SecretSantaParticipantAssignment> {
        throw new Error("Method not implemented.");
    }

}