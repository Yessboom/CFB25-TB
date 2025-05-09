import { query } from '@solidjs/router'
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

const checkAuth = query(async () => {
    'use server'
    const session = await getSession()
    const isLoggedIn = !!session.data.userId
    return isLoggedIn
  }, 'checkAuth')
export {isLoggedIn, checkAuth, setIsLoggedIn}