import { SecretSantaEvent, SecretSantaParticipantAssignment } from "./types";

export function generateAssignments(event: SecretSantaEvent): SecretSantaParticipantAssignment[] {
    const participants = [...event.participants];
    const assignments: SecretSantaParticipantAssignment[] = [];
  
    // Shuffle the participants array
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }
  
    // Assign each participant to the next one in the shuffled list
    participants.forEach((participant, index) => {
      const assignment = participants[(index + 1) % participants.length];
      assignments.push({ participant, assignment });
    });
  
    return assignments;
  }
  