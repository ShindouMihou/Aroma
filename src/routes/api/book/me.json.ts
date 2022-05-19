import { Book } from "$lib/models/book";
import AromaticRouteResponses from "$lib/templates/responses";
import type { RequestEvent } from "@sveltejs/kit/types/private";

export async function get(event: RequestEvent) {
    if (!event.locals.user) {
        return AromaticRouteResponses.permitNotGranted;
    }

    return {
        body: {
            books: await Book.withAuthor(event.locals.user._id)
        }
    }
}