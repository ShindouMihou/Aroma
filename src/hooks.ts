import * as authenticator from '$lib/auth/authentication'
import configuration from '$lib/configuration'
import { parse } from 'cookie'
import cookieSignature from 'cookie-signature'
import * as UserBase from '$lib/models/user'

export async function handle({ event, resolve }: any) {
    const cookies = parse(event.request.headers.get('cookie') || '')
    let url = new URL(event.request.url);

    event.locals = {
        user: false
    }

    if (cookies.session) {
        const session = cookieSignature.unsign(cookies.session, configuration('APP_SIGNATURE') || '')

        if (session) {
            const userId = authenticator.get(session)

            if (userId) {
                const user = await UserBase.get(userId)

                if (user) {
                    event.locals = {
                        user: user
                    }
                }
            }
        }
    }

    const response = await resolve(event)

    if (!event.locals.user && !url.pathname.toLowerCase().startsWith('/api/auth')) {
        response.headers.append('Set-Cookie', 'session=; Path=/; Max-Age=-1')
    }

    return response
}

export async function getSession(event: any) {
    return {
        user: event.locals.user._id
    }
}