export interface SecretSantaEventV1 {
  id: string;
  eventName: string;
  participants: SecretSantaParticipant[];
  eventDate: Date | string;
  eventLocation: string;
  dollarLimit: number;
  qrCodeUrl: string;
  eventOwnerName: string;
}
export interface SecretSantaEventV2 {
  id: number;
  shortCode: string,
  name: string,
  date: Date | string,
  location: string,
  spendLimit: number,
  ownerId: number,
}

export interface RequestState{
  email: string;
}

export interface SecretSantaParticipant {
  name: string;
  isOwner: boolean;
  password: string;
  passwordIsSet: boolean;
  wishlist: WishListEntry[];
}

export interface WishListEntry {
  link: string;
}

export interface SecretSantaParticipantAssignment {
  participant: SecretSantaParticipant;
  assignment: SecretSantaParticipant;
}

export interface jwt {
  aud: string;
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
}