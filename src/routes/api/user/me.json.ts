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

    return {
        body: {
            user: event.locals.user
        }
    }

    return {
        body: {
            error: "You are not authenticated."
        },
        status: 401
    }
}