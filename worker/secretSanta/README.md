# Secret Santa API Documentation

## Types Overview
### `Bindings`
- `SecretSanta`: KVNamespace used for data storage.

### `SecretSantaEvent`
- `id`: Unique identifier of the event.
- `eventName`: Name of the Secret Santa event.
- `participants`: Array of `SecretSantaParticipant`.
- `eventDate`: Date of the event. Can be a `Date` object or a string.
- `eventLocation`: Location of the event.
- `dollarLimit`: Budget limit for gifts.
- `qrCodeUrl`: URL of the QR code associated with the event.

### `SecretSantaParticipant`
- `name`: Name of the participant.
- `password`: Password of the participant (for privacy, not returned in GET requests).
- `passwordIsSet`: Boolean indicating if the participant's password is set.
- `wishlist`: Array of `WishListEntry` or `undefined`.

### `WishListEntry`
- `link`: URL link to a wishlist item.

## API Endpoints

### 1. GET `/api/secretSanta/:eventId`
Retrieves details of a specific Secret Santa event.

#### Parameters
- `eventId`: The unique identifier of the Secret Santa event.

#### Responses
- **200 OK**: Event details including `eventName`, `participants`, `eventDate`, `eventLocation`, `dollarLimit`, and `qrCodeUrl`.
- **404 Not Found**: Event not found.

### 2. POST `/api/secretSanta/:eventId`
Creates a new Secret Santa event.

#### Parameters
- `eventId`: Unique identifier for the new event.

#### Request Body
- JSON object representing `SecretSantaEvent`.

#### Responses
- **200 OK**: Event created successfully.
- **400 Bad Request**: Event with the same `eventId` already exists.

### 3. GET `/api/secretSanta/:eventId/:participantName`
Retrieves details of a specific participant in an event.

#### Parameters
- `eventId`: Identifier of the Secret Santa event.
- `participantName`: Name of the participant.

#### Responses
- **200 OK**: Participant details excluding the `password`.
- **404 Not Found**: Participant not found.

### 4. PUT `/api/secretSanta/:eventId/:participantName/password`
Sets or updates the password for a participant.

#### Parameters
- `eventId`: Identifier of the Secret Santa event.
- `participantName`: Name of the participant.

#### Request Body
- Plain text representing the new password.

#### Responses
- **200 OK**: Password set successfully.
- **400 Bad Request**: Password already set.
- **404 Not Found**: Participant not found.

## General Notes
- CORS is enabled for all routes.
- All endpoints handle JSON data.
- Participant passwords are handled securely and are not exposed via the API.
