import { query } from "@solidjs/router";
import { PlayerDB } from "./PlayerDB";
import { getSession } from "./server";
import type { RosterEntry, RosterData } from '../types';

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


  


