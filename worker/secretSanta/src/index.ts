import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  SecretSantaEvent,
  SecretSantaParticipant,
  SecretSantaParticipantAssignment,
  WishListEntry,
} from "./types";
import { generateAssignments } from "./methods";
import { R2DataStore } from "./datalayer/R2DataStore";
import { DataStore } from "./datalayer/DataStore";

type Bindings = {
  SecretSantaBucket: R2Bucket;
  DataStore: DataStore;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());
app.use("*", async (c, next) => {
  c.env.DataStore = new R2DataStore(c.env.SecretSantaBucket);
  await next();
});

app.get("/api/secretSanta/:eventId", async (c) => {
  const eventId = c.req.param("eventId");
  const existingEvent: SecretSantaEvent = await c.env.DataStore.getEvent(eventId);
  if (!existingEvent) {
    return new Response("Event not found", {
      status: 404,
    });
  }
  for (const participant of existingEvent.participants) {
    const participantObj: SecretSantaParticipant = await c.env.DataStore.getParticipant(
      eventId,
      participant.name
    );
    if (!participantObj) {
      return new Response("Participant not found", {
        status: 404,
      });
    }
    participant.password = "";
  }
  return c.json(existingEvent);
});

/* Create a new event
    Will return 400 if event already exists.
 */
app.post("/api/secretSanta/:eventId", async (c) => {
  const eventId = c.req.param("eventId");
  console.log(`Creating event ${eventId}`);
  const eventObj: SecretSantaEvent = await c.req.json();
  const existingEvent = await c.env.DataStore.getEvent(eventId);
  if (existingEvent) {
    return new Response("Cannot overwrite duplicate event", {
      status: 400,
    });
  }
  await c.env.DataStore.createEvent(eventObj);
  for (const participant of eventObj.participants) {
    participant.password = "";
    await c.env.DataStore.createParticipant(eventId, participant);
  }
  const assignments = generateAssignments(eventObj);
  console.log(assignments);
  for (const assignment of assignments) {
    await c.env.DataStore.createParticipantAssignment(eventId, assignment);
  }
  return c.json(eventObj);
});

/* Get an existing participant for a given event
    does not return their password.
    Will return 404 if participant not found.
    If their password has been set it indicates they have 'signed in' to the event.
 */
app.get("/api/secretSanta/:eventId/:participantName", async (c) => {
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const participantObj: SecretSantaParticipant = await c.env.DataStore.getParticipant(
    eventId,
    participantName
  );
  if (!participantObj) {
    return new Response("Participant not found", {
      status: 404,
    });
  }
  participantObj.password = "";
  console.log(participantObj);
  return c.json(participantObj);
});

/* Get an existing participants Participant Assignment */
app.get("/api/secretSanta/:eventId/:participantName/assignment", async (c) => {
  console.log("getting assignment");
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const xParticipantPassword = c.req.header("x-participant-password");
  const participantObj: SecretSantaParticipant = await c.env.DataStore.getParticipant(
    eventId,
    participantName
  );
  if (!participantObj) {
    return new Response("Participant not found", {
      status: 404,
    });
  }
  if (participantObj.password !== xParticipantPassword) {
    return new Response("Incorrect password", {
      status: 401,
    });
  }

  let thisAssignment = await c.env.DataStore.getParticipantAssignment(
    eventId,
    participantName
  );
  console.log(thisAssignment);
  if (!thisAssignment) {
    return new Response("Assignment not found", {
      status: 404,
    });
  }
  thisAssignment!.assignment.password = "";
  return c.json(thisAssignment!.assignment);
});

/*Set password for a participant*/
app.put("/api/secretSanta/:eventId/:participantName/password", async (c) => {
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const password = await c.req.text();
  if (password.length < 4) {
    return new Response("Password must be at least 4 characters", {
      status: 400,
    });
  }

  const participantObj: SecretSantaParticipant = await c.env.DataStore.getParticipant(
    eventId,
    participantName
  );
  if (!participantObj) {
    return new Response("Participant not found", {
      status: 404,
    });
  }
  if (participantObj.passwordIsSet) {
    return new Response("Password already set", {
      status: 400,
    });
  }
  participantObj.password = password;
  participantObj.passwordIsSet = true;
  console.log(participantObj);
  await c.env.DataStore.createParticipant(eventId, participantObj);
  console.log("password set");
  const res = { message: "Password set" };
  return c.json(res);
});

app.post("/api/secretSanta/:eventId/:participantName/login", async (c) => {
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");

  const participantObj: SecretSantaParticipant = await c.env.DataStore.getParticipant(eventId, participantName);

  if (!participantObj) {
    return new Response("Participant not foundd", {
      status: 404,
    });
  }
  const inputPassword = await c.req.text();
  console.log(inputPassword);
  console.log(participantObj.password);
  if (participantObj.password !== inputPassword) {
    return new Response("Incorrect password", {
      status: 401,
    });
  }
  return new Response("{}", { status: 200 });
});

/*Update wishlist for participant */
app.put("/api/secretSanta/:eventId/:participantName/wishList", async (c) => {
  console.log("adding wishlist");
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const xParticipantPassword = c.req.header("x-participant-password");

  const participantObj: SecretSantaParticipant = await c.env.DataStore.getParticipant(eventId, participantName);

  if (!participantObj) {
    return new Response("Participant not found", {
      status: 404,
    });
  }
  if (participantObj.password !== xParticipantPassword) {
    return new Response("Incorrect password", {
      status: 401,
    });
  }
  const wishlist: WishListEntry[] = await c.req.json();
  participantObj.wishlist = wishlist;
  await c.env.DataStore.createParticipant(eventId, participantObj);
  const res = { message: "Wishlist updated" };
  return c.json(res);
});

export default app;
