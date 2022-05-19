import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as UserBase from "$lib/models/user"
import { verification } from "$lib/auth/authentication";

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
        name: body.name,
        email: body.email,
        password: body.password
    }

    try {
        const user = await UserBase.create(request.name, request.email, request.password)
        const token = await verification(user)

        return {
            body: {
                user: user,
                token: token
            }
        }
    } catch (err: any) {
        return {
            body: err,
            status: 400
        }
    }
}