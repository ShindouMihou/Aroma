import { Book } from "$lib/models/book";
import AromaticRouteResponses from "$lib/templates/responses";
import type { RequestEvent } from "@sveltejs/kit/types/private";

export async function del(event: RequestEvent) {
    try {
        if (!event.locals.user) {
            return AromaticRouteResponses.permitNotGranted;
        }
        const book = await Book.withId(event.params.id)
    
        if (!book) {
            return AromaticRouteResponses.invalidResourceIdentifier;
        }
    
        if (book.author != event.locals.user._id) {
            return AromaticRouteResponses.permitNotGranted;
        }
    
        await book.delete()
        
        return { status: 204 }
    } catch (err: any) {
        console.error(err)
        return AromaticRouteResponses.internalError;
    }
}