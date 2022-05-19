import { Book } from "$lib/models/book";
import type { RequestEvent } from "@sveltejs/kit/types/private";

export async function get(event: RequestEvent) {
    return {
        body: await Book.withId(event.params.id)
    }
}