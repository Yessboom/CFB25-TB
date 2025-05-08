import {getSession} from '../../lib/server'
import { createSignal } from 'solid-js'


export async function GET() {
    const session = await getSession()
    const isLoggedIn = !!session.data.userId
    return new Response(JSON.stringify({ isLoggedIn }), {
        headers: {
            'Content-Type': 'application/json',
        },
    })

}

const [isLoggedIn, setIsLoggedIn] = createSignal(false);

async function checkAuth() {
    try {
      // no-store so we always hit the server on client navigations
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = await res.json();
      setIsLoggedIn(data.isLoggedIn);
    } catch {
      setIsLoggedIn(false);
    }
  }

export {isLoggedIn, checkAuth, setIsLoggedIn}