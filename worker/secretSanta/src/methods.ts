import {
  SecretSantaEvent,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment,
} from "./types";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateAssignments(
  event: SecretSantaEvent
): SecretSantaParticipantAssignment[] {
  console.log("Generating assignments");
  let participants = [...event.participants];
  let assignments: SecretSantaParticipantAssignment[] = [];
  participants.sort(() => (Math.random() > 0.5 ? 1 : -1));
  for (let i = 0; i < participants.length; i++) {
    const giver = participants[i];
    const receiver = participants[(i + 1) % participants.length];
    assignments.push({ participant: giver, assignment: receiver });
  }

  return assignments;
}
