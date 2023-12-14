INSERT INTO Users (Email, github) VALUES ('user1@example.com', 'github1');
INSERT INTO Users (Email, github) VALUES ('user2@example.com', 'github2');
INSERT INTO Users (Email, github) VALUES ('user3@example.com', 'github3');
INSERT INTO Users (Email, github) VALUES ('user4@example.com', 'github4');
INSERT INTO Users (Email, github) VALUES ('user5@example.com', 'github5');
INSERT INTO Events (shortCode, name, date, location, spendLimit, ownerId) VALUES ('EVT1', 'Event 1', '2022-01-01', 'Location 1', 1000, 1);
INSERT INTO Events (shortCode, name, date, location, spendLimit, ownerId) VALUES ('EVT2', 'Event 2', '2022-01-02', 'Location 2', 1500, 2);
INSERT INTO Events (shortCode, name, date, location, spendLimit, ownerId) VALUES ('EVT3', 'Event 3', '2022-01-03', 'Location 3', 1200, 3);
INSERT INTO eventParticipants (eventId, email) VALUES (1, 'user1@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (1, 'user2@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (1, 'user3@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (2, 'user2@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (2, 'user3@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (2, 'user4@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (3, 'user3@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (3, 'user4@example.com');
INSERT INTO eventParticipants (eventId, email) VALUES (3, 'user5@example.com');
INSERT INTO userWishlist (userId, item) VALUES (1, 'Item 1 for User 1');
INSERT INTO userWishlist (userId, item) VALUES (1, 'Item 2 for User 1');
INSERT INTO userWishlist (userId, item) VALUES (1, 'Item 3 for User 1');

INSERT INTO userWishlist (userId, item) VALUES (2, 'Item 1 for User 2');
INSERT INTO userWishlist (userId, item) VALUES (2, 'Item 2 for User 2');
INSERT INTO userWishlist (userId, item) VALUES (2, 'Item 3 for User 2');

-- Continue for each user
INSERT INTO userWishlist (userId, item) VALUES (3, 'Item 1 for User 3');
INSERT INTO userWishlist (userId, item) VALUES (3, 'Item 2 for User 3');
INSERT INTO userWishlist (userId, item) VALUES (3, 'Item 3 for User 3');
