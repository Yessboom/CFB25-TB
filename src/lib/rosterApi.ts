import { query, action} from "@solidjs/router";
import { PlayerDB } from "./PlayerDB";
import { getSession } from "./server";
import type { RosterEntry, RosterData } from '../types';
import { z } from "zod";
import {Prisma} from "@prisma/client";

// Get all rosters
export const getRosters = query(async () => {
  "use server";
  
  // Check if the user is authenticated
  const session = await getSession();
  if (!session.data.userId) {
    throw new Error("Not authenticated");
  }
  
  // Fetch all rosters
  const rosters = await PlayerDB.initRoster.findMany({
    select: {
      id: true,
      name: true
    }
  });
  
  return rosters;
}, "rosters");

// Get roster by ID
export const getRosterById = query(async (id: string) => {
  "use server";
  
  // Check if the user is authenticated
  const session = await getSession();
  if (!session.data.userId) {
    throw new Error("Not authenticated");
  }
  
  // Validate the ID
  if (!id) {
    throw new Error("Roster ID is required");
  }
  
  // Fetch the roster
  const roster = await PlayerDB.initRoster.findUnique({
    where: { id },
    select: {
      dataRoster: true
    }
  });
  
  if (!roster) {
    throw new Error("Roster not found");
  }
  
  return roster.dataRoster as RosterData;
}, "roster");




const createRosterSchema = z.object({
  initRosterId: z.string(),
  name: z.string().min(1),
});
export const createRosterFromInit = async (form: FormData) => {
  'use server';

  const parsed = createRosterSchema.parse({
    initRosterId: form.get('initRosterId'),
    name: form.get('name'),
  });

  const session = await getSession();
  const userId = session?.data?.userId;

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const initRoster = await PlayerDB.initRoster.findUnique({
    where: { id: parsed.initRosterId },
  });

  if (!initRoster) {
    throw new Error('InitRoster not found');
  }

  const newRoster = await PlayerDB.roster.create({
    data: {
      name: parsed.name,
      userId,
      dataRoster: initRoster.dataRoster === null ? Prisma.JsonNull : initRoster.dataRoster,
      dataVisual: initRoster.dataVisual === null ? Prisma.JsonNull : initRoster.dataVisual,
    },
  });

  return newRoster;
};


//Get the rosters created by the user
export const getUserRosters = query(async () => {
  "use server";
  const session = await getSession();
  if (!session.data.userId) {
    throw new Error("Not authenticated");
  }

  return await PlayerDB.roster.findMany({
    where: { userId: session.data.userId },
    select: {
      id: true,
      name: true,
    },
  });
}, "userRosters");

export const getUserRosterById = query(async (id: string) => {
  "use server";
  const session = await getSession();
  if (!session.data.userId) {
    throw new Error("Not authenticated");
  }
  if (!id) {
    throw new Error("Roster ID is required");
  }
  const roster = await PlayerDB.roster.findUnique({
    where: { id },
    select: {
      dataRoster: true,
    },
  });
  if (!roster) {
    throw new Error("Roster not found");
  }
  return roster.dataRoster as RosterData;
}, "userRoster");