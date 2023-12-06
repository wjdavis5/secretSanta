import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  SecretSantaEvent,
  SecretSantaParticipant,
  WishListEntry,
} from "./types";
import { generateAssignments } from "./methods";

type Bindings = {
  SecretSanta: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());
app.get("/api/secretSanta/:eventId", async (c) => {
  const eventId = c.req.param("eventId");
  const existingEventRaw = await c.env.SecretSanta.get(eventId);
  const existingEvent: SecretSantaEvent = JSON.parse(existingEventRaw!);
  if (!existingEvent) {
    return new Response("Event not found", {
      status: 404,
    });
  }
  for (const participant of existingEvent.participants) {
    const participantRaw = await c.env.SecretSanta.get(
      `${eventId}:${participant.name}`
    );
    const participantObj: SecretSantaParticipant = JSON.parse(participantRaw!);
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
  console.log(eventObj);

  const existingEvent = await c.env.SecretSanta.get(eventId);
  if (existingEvent) {
    return new Response("Cannot overwrite duplicate event", {
      status: 400,
    });
  }
  await c.env.SecretSanta.put(eventId, JSON.stringify(eventObj));
  for (const participant of eventObj.participants) {
    participant.password = "";
    await c.env.SecretSanta.put(
      `${eventId}:${participant.name}`,
      JSON.stringify(participant)
    );
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
  const participantRaw = await c.env.SecretSanta.get(
    `${eventId}:${participantName}`
  );
  const participantObj: SecretSantaParticipant = JSON.parse(participantRaw!);
  if (!participantObj) {
    return new Response("Participant not found", {
      status: 404,
    });
  }
  participantObj.password = "";
  return c.json(participantObj);
});

/* Get an existing participants Participant Assignment */
app.get("/api/secretSanta/:eventId/:participantName/assignment", async (c) => {
  console.log("getting assignment");
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const xParticipantPassword = c.req.header("x-participant-password");
  const participantRaw = await c.env.SecretSanta.get(
    `${eventId}:${participantName}`
  );
  const participantObj: SecretSantaParticipant = JSON.parse(participantRaw!);
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
  const assignmentRaw = await c.env.SecretSanta.get(
    `${eventId}:${participantObj.name}:assignment`
  );
  let assignmentObj: SecretSantaParticipant = JSON.parse(assignmentRaw!);
  if (!assignmentObj) {
    const existingEventRaw = await c.env.SecretSanta.get(eventId);
    const existingEvent: SecretSantaEvent = JSON.parse(existingEventRaw!);
    const assignments = generateAssignments(existingEvent);
    for (const assignment of assignments) {
      if (assignment.participant.name === participantName) {
        assignmentObj = assignment.assignment;
      }
      await c.env.SecretSanta.put(
        `${eventId}:${participantName}:assignment`,
        JSON.stringify(assignment.assignment)
      );
      return c.json(assignment.assignment);
    }
  }
  assignmentObj.password = "";
  return c.json(assignmentObj);
});

/*Set password for a participant*/
app.put("/api/secretSanta/:eventId/:participantName/password", async (c) => {
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const participantRaw = await c.env.SecretSanta.get(
    `${eventId}:${participantName}`
  );
  const participantObj: SecretSantaParticipant = JSON.parse(participantRaw!);
  if (!participantObj) {
    return new Response("Participant not foundd", {
      status: 404,
    });
  }
  if (participantObj.passwordIsSet) {
    return new Response("Password already set", {
      status: 400,
    });
  }
  participantObj.password = await c.req.text();
  participantObj.passwordIsSet = true;
  c.env.SecretSanta.put(
    `${eventId}:${participantName}`,
    JSON.stringify(participantObj)
  );
  const res = { message: "Password set" };
  return c.json(res);
});

/*Update wishlist for participant */
app.put("/api/secretSanta/:eventId/:participantName/wishList", async (c) => {
  console.log("adding wishlist");
  const eventId = c.req.param("eventId");
  const participantName = c.req.param("participantName");
  const xParticipantPassword = c.req.header("x-participant-password");
  const participantRaw = await c.env.SecretSanta.get(
    `${eventId}:${participantName}`
  );
  const participantObj: SecretSantaParticipant = JSON.parse(participantRaw!);

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
  c.env.SecretSanta.put(
    `${eventId}:${participantName}`,
    JSON.stringify(participantObj)
  );
  const res = { message: "Wishlist updated" };
  return c.json(res);
});

export default app;
