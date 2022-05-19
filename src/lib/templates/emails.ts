
/*
 * This class is automatically generated when running `npm run generate:mails` and is used to compile emails 
 * from /resources/emails to their specified function located here.
 * 
 * Please do not modify this file but instead modify the template file under `resources/compiler/aromatic.js`.
 */


export default class AromaticEmailTemplates {
    
  public static verification(link: string) { return `<html>
    <body class="px-6 py-8 font-sans" style="padding-left: 24px; padding-right: 24px; padding-top: 32px; padding-bottom: 32px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'; color: #fff; background-color: #1E293B;">
        <nav>
            <h1 class="text-lg font-bold leading-none m-0" style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1;">Aroma</h1>
            <p class="leading-none m-0" style="margin: 0; line-height: 1;">Taste the sweetness of books.</p>
        </nav>
        <hr class="my-4" style="margin-top: 16px; margin-bottom: 16px;">
        <div id="message" class="m-0" style="margin: 0;">
            <p>
                Your account is almost ready, in order to complete the process, please verify that this account belongs to this 
                email address.
            </p>
            <br>
            <div class="flex flex-col gap-2 m-0" style="margin: 0; display: flex; flex-direction: column; gap: 8px;">
                <a href="${link}" class="p-4 font-bold w-fit hover:opacity-90 no-underline transition" style="width: -webkit-fit-content; width: -moz-fit-content; width: fit-content; padding: 16px; font-weight: 700; -webkit-text-decoration-line: none; text-decoration-line: none; transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter; transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; background-color: #EF4444; color: #fff;">
                    Verify Email Address
                </a>
            </div>
            <br>
            <p class="mb-0" style="margin-bottom: 0;">
                Are you unable to interact with the button, please use this link instead!
            </p>
            <br>
            <a class="no-underline mb-12 mt-0" href="${link}" style="margin-bottom: 48px; margin-top: 0; -webkit-text-decoration-line: none; text-decoration-line: none;">${link}</a>
        </div>
        <br>
        <footer style="color: #d4d4d4">
            <h3 class="m-0 mt-1 leading-none" style="margin: 0; margin-top: 4px; line-height: 1;">From Aroma</h3>
            <p class="m-0 mt-1 leading-none" style="margin: 0; margin-top: 4px; line-height: 1;">Aroma is an open-source web-novel platform produced by Shindou Mihou. It is not associated with any other entities whatsoever.</p>
        </footer>
    </body>
</html>
`; }

}
    