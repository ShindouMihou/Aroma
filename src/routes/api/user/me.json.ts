import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as UserBase from "$lib/models/user"

export async function get(event: RequestEvent) {
    if (!event.locals.user) {
        return {
            body: {
                error: "You are not authenticated."
            },
            status: 401
        }
    }

    const user = await UserBase.get(event.locals.user._id)

    if (user) {
        return {
            body: {
                user: user
            }
        }
    }

    return {
        body: {
            error: "You are not authenticated."
        },
        status: 401
    }
}