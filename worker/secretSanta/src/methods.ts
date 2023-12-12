import {
  SecretSantaEventV1,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment,
} from "./types";

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateAssignments(
  event: SecretSantaEventV1
): SecretSantaParticipantAssignment[] {
  console.log("Generating assignments");
  let participants = [...event.participants];
  let assignments: SecretSantaParticipantAssignment[] = [];
  participants.sort(() => Math.random() - 0.5);
  for (let i = 0; i < participants.length; i++) {
    const giver = participants[i];
    const next = participants.length - 1 === i ? 0 : i + 1;
    const receiver = participants[next];
    assignments.push({ participant: giver, assignment: receiver });
  }

  return assignments;
}

export async function oneWayHash(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const inputData = encoder.encode(input);
  const hashAlgorithm = "SHA-3-256";
  const digest = await crypto.subtle.digest(hashAlgorithm, inputData);
  const hashArray = Array.from(new Uint8Array(digest));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  console.debug(`Hashed value (${hashAlgorithm}): ${hashHex}`);
  return hashHex;
}
