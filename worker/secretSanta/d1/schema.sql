-- Delete all records from tables
DELETE FROM userWishlist;
DELETE FROM eventParticipants;
DELETE FROM Events;
DELETE FROM Users;

-- Drop tables
DROP TABLE IF EXISTS userWishlist;
DROP TABLE IF EXISTS eventParticipants;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Users;


drop table if exists Users;
CREATE TABLE 
IF NOT EXISTS
Users (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    Email  TEXT    UNIQUE,
    github TEXT
);
drop table if exists Events;
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
Drop table if exists eventParticipants;
CREATE TABLE 
IF NOT EXISTS
eventParticipants (
    eventId INTEGER REFERENCES Events (id) 
                    NOT NULL,
    email   TEXT    NOT NULL
);
Drop table if exists userWishlist;
CREATE TABLE
IF NOT EXISTS
userWishlist (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    userId         REFERENCES Users (id),
    item   TEXT    NOT NULL
);

