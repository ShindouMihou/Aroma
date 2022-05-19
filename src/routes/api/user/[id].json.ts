import type { RequestEvent } from "@sveltejs/kit/types/private";
import Account from "$lib/models/user"

export async function get(event: RequestEvent) {
    const user = await Account.withId(event.params.id)

    if (user) {
        return {
            body: {
                user: user.without('email')
            }
        }
    }

    return {
        body: {
            error: "The user specified does not exist."
        },
        status: 500
    }
}