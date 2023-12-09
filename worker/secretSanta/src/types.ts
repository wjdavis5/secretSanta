export interface SecretSantaEvent {
  id: string;
  eventName: string;
  participants: SecretSantaParticipant[];
  eventDate: Date | string;
  eventLocation: string;
  dollarLimit: number;
  qrCodeUrl: string;
  eventOwnerName: string;
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
