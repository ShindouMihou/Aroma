import type { RequestEvent } from "@sveltejs/kit/types/private";
import Account from "$lib/models/user"
import { authenticate, sign } from "$lib/auth/authentication";
import cookieSignature from 'cookie-signature'
import configuration from "$lib/configuration";

export async function post(event: RequestEvent) {
    if (event.locals.user) {
        return {
            body: {
                error: "You cannot perform this action."
            },
            status: 401
        }
    }

    const body = await event.request.json()
    const request = {
        email: body.email,
        password: body.password
    }

    try {
        const result = await authenticate(request.email, request.password)

        if (result) {
            const cookie = await cookieSignature.sign(sign((await Account.withEmail(request.email))!), configuration('APP_SIGNATURE') || '')

            return {
                status: 204,
                headers: {
                    'set-cookie': `session=${cookie}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}`
                }
            }
        }

        return {
            status: 400
        }
    } catch (err: any) {
        console.error(err)
        return {
            body: {
                error: "An internal error occurred while trying to authenticate."
            },
            status: 500
        }
    }
}