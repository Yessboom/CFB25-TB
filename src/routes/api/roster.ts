import type {APIEvent} from '@solidjs/start/server'
import { updateRoster, getRosters, getUserRosters } from '~/lib/rosterApi'
import { getSession } from '~/lib/server'
import type { RosterData } from '~/types'
import { json } from '@solidjs/router'
import { PlayerDB } from '~/lib/PlayerDB'
import { z } from 'zod'


export async function GET(event:APIEvent) {
    return await getRosters()

}

export async function POST(event: APIEvent) {
    const session = await getSession();
    if (!session.data.userId) {
      return json({ error: "Not authenticated" }, { status: 401 });
    }
  
    const body = await event.request.json();
    const { id, data } = body as { id: string; data: RosterData };
  
    if (!id || !data) {
      return json({ error: "Invalid request" }, { status: 400 });
    }
  
    try {
      const roster = await PlayerDB.roster.update({
        where: { id },
        data: { dataRoster: data },
      });
  
      return json({ success: true, roster });
    } catch (err) {
      console.error("Error updating roster:", err);
      return json({ error: "Server error" }, { status: 500 });
    }
  }