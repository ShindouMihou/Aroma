import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as UserBase from "$lib/models/user"
import { authenticate } from "$lib/auth/authentication";

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
            return {
                status: 204
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