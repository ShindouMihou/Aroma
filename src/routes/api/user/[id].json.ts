import type { RequestEvent } from "@sveltejs/kit/types/private";
import * as UserBase from "$lib/models/user"

export async function get(event: RequestEvent) {
    const user = await UserBase.get(event.params.id)

    if (user) {
        return {
            body: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    avatar_hash: user.avatar_hash,
                    about_me: user.about_me,
                    verified: user.verified
                }
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