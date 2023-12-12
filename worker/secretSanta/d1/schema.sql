CREATE TABLE 
IF NOT EXISTS
Users (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    Email  TEXT    UNIQUE,
    github TEXT
);
CREATE TABLE 
IF NOT EXISTS
Events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    shortCode  TEXT    UNIQUE,
    name       TEXT    NOT NULL,
    date       TEXT    NOT NULL,
    location   TEXT    NOT NULL,
    spendLimit INTEGER NOT NULL,
    ownerId    INTEGER REFERENCES Users (id) 
);
CREATE TABLE 
IF NOT EXISTS
eventParticipants (
    eventId INTEGER REFERENCES Events (id) 
                    NOT NULL,
    userId  INTEGER REFERENCES Users (id) 
                    NOT NULL,
    id      INTEGER PRIMARY KEY AUTOINCREMENT
);
CREATE TABLE
IF NOT EXISTS
userWishlist (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    userId         REFERENCES Users (id),
    item   TEXT    NOT NULL
);

