import configuration from "$lib/configuration";
import logger from "$lib/logger";
import { Book } from "$lib/models/book";
import type Account from "$lib/models/user";
import AromaticRouteResponses from "$lib/templates/responses";
import type { RequestEvent } from "@sveltejs/kit/types/private";
import axios from "axios";

const SUPPORTED_REQUESTS = [
    "book/avatar",
    "user/avatar"
]

const SUPPORTED_MIMETYPES = [
    "image/jpeg",
    "image/png"
]

export async function put(event: RequestEvent) {
    if (!event.locals.user) return AromaticRouteResponses.permitNotGranted;

    try {
        const body = await event.request.json();

        if (!body.type || !body.mimetype) return AromaticRouteResponses.invalidRequest;
        if (!SUPPORTED_MIMETYPES.includes(body.mimetype.toLowercase())) return AromaticRouteResponses.invalidRequest;
        if (!SUPPORTED_REQUESTS.includes(body.type.toLowercase())) return AromaticRouteResponses.invalidRequest;

        let mimetype: 'image/jpeg' | 'image/png' = 'image/jpeg';
        if (body.mimetype.toLowercase() === 'image/png') mimetype = 'image/png'

        let type: 'book/avatar' | 'user/avatar' = 'book/avatar';

        if (body.type.toLowercase() === 'user/avatar') type = 'user/avatar'
        if (type === 'book/avatar' && !body.bookId) return AromaticRouteResponses.invalidRequest;

        let entity = event.locals.user._id

        if (type === 'book/avatar' && body.bookId) {
            let bookId = body.bookId;
            const book = await Book.withId(bookId)

            if (!book) return AromaticRouteResponses.invalidResourceIdentifier;
            if (book.author !== event.locals.user._id) return AromaticRouteResponses.permitNotGranted;

            entity = book._id;
        }

        let mediaServer = configuration('AROMA_MEDIA_SERVER')

        if (!mediaServer) {
            logger.error({
                error: 'The AROMA_MEDIA_SERVER location is not configured.'
            })

            return {
                body: {
                    error: "The media server is unavailable right now, please try again later."
                },
                status: 500
            }
        }

        if (!(mediaServer.startsWith('http://') || mediaServer.startsWith('https://'))) {
            mediaServer = 'http://' + mediaServer
        }

        try {
            const response = await axios.put(mediaServer + "/sign", createSignRequestBody(mimetype, type, event.locals.user, entity), {
                headers: {
                    Authorization: configuration('AROMA_SECRET') || ''
                }
            })

            if (!response.data.token) {
                return {
                    body: {
                        error: "The media server is unavailable right now, please try again later."
                    },
                    status: 500
                }
            }

            return {
                body: {
                    reportTo: configuration('AROMA_PUBLIC_MEDIA_SERVER') + "/?token=" + response.data.token
                }
            }
        } catch (axiosError: any) {
            console.error(axiosError);
            return {
                body: {
                    error: "The media server is unavailable right now, please try again later."
                },
                status: 500
            }
        }
    } catch (jsonError: any) {
        return AromaticRouteResponses.invalidResourceContentType;
    }
}

function createSignRequestBody(
    mimetype: 'image/jpeg' | 'image/png',
    type: 'book/avatar' | 'user/avatar',
    responsiblity: Account,
    entityId: string
) {
    let fileName;
    if (type === 'book/avatar') fileName = 'cover'
    if (type === 'user/avatar') fileName = 'avatar'

    fileName += '.'
    fileName += mimetype.replace('image/', '')

    let directory;
    if (type === 'book/avatar') directory = `books/${entityId}/`
    if (type === 'user/avatar') directory = `users/${entityId}/`

    return {
        "fileName": fileName,
        "directory": directory,
        "textback": "",
        "responsiblity": responsiblity._id
    }
}
