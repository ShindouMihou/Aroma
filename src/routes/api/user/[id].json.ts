import type { RequestEvent } from "@sveltejs/kit/types/private";
import Account from "$lib/models/user"
import AromaticRouteResponses from "$lib/templates/responses";

export async function get(event: RequestEvent) {
    const user = await Account.withId(event.params.id)

    if (user) {
        return {
            body: user.without('email')
        }
    }

    return AromaticRouteResponses.invalidResourceIdentifier;
}