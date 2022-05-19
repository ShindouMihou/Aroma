import { Book } from "$lib/models/book";
import AromaticRouteResponses from "$lib/templates/responses";
import type { RequestEvent } from "@sveltejs/kit/types/private";

const ALLOWED_PROPERTIES = [
    "description",
    "title"
]

const MAXIMUM_LENGTH: Map<string, number> = new Map()
    .set('title', 128)
    .set('description', 5128)

export async function post(event: RequestEvent) {
    if (!event.locals.user || !event.locals.user.verified) {
        return AromaticRouteResponses.permitNotGranted;
    }

    try {
        const body = await event.request.json()

        const safeClone: any = {}
        Object.entries(body).forEach(entry => {
            if (entry[1] !instanceof String) {
                return;
            }

            if (!ALLOWED_PROPERTIES.includes(entry[0].toLowerCase())) {
                return;
            }

            const value = (entry[1] as string)

            if (value.length <= MAXIMUM_LENGTH.get(entry[0].toLowerCase())!) {
                safeClone[entry[0].toLowerCase()] = value
                return;
            }

            safeClone[entry[0].toLowerCase()] = value.substring(0, MAXIMUM_LENGTH.get(entry[0].toLowerCase()))
        })

        if (Object.entries(safeClone).length == 0) {
            return AromaticRouteResponses.invalidRequest;
        }

        try {
            return {
                body: await Book.create(safeClone.title, safeClone.description, event.locals.user)
            }
        } catch (error: any) {
            console.error(error)

            return AromaticRouteResponses.internalError;
        }
    } catch (jsonError: any) {
        return AromaticRouteResponses.invalidResourceContentType;
    }
}