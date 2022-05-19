import { readdirSync, readFileSync, writeFileSync } from "fs"
import { minify } from 'html-minifier'

const TEMPLATES = {}
const FUNCTIONS = []

function functionTemplates() {
    /**
     * ----------------
     * Email template functions
     * You can add your email template functions here as specified by the README.md
     * ----------------
     */
    FUNCTIONS.push(`verification(link: string) { return \`${TEMPLATES['verification']}\`; }`);
}









/*
 * Beyond this section lies the internal code of the Aromatic file where the file generation and 
 * other details that you may not be interested in are located.
 * 
 * If all you are doing is adding a new template then please limit yourself to the method above.
 */


const WARNING = `
/*
 * This class is automatically generated when running \`npm run generate:mails\` and is used to compile emails 
 * from /resources/emails to their specified function located here.
 * 
 * Please do not modify this file but instead modify the template file under \`resources/compiler/aromatic.js\`.
 */
`

main()

async function main() {
    const compiled = readdirSync('./resources/emails/build', {
        withFileTypes: true
    }).filter(element => element.name.endsWith('.html'))

    for (const template of compiled) {
        console.log('Reading ' + template.name + "...")
        TEMPLATES[template.name.replace('.html', '')] = minify(readFileSync('./resources/emails/build/' + template.name, {
            encoding: 'utf8'
        }), {
            collapseWhitespace: true,
            removeComments: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeTagWhitespace: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true,
            sortAttributes: true,
            sortClassName: true
        })
    }

    functionTemplates()

    console.log('Generating ./src/lib/templates/emails.ts')

    let compiledFile = WARNING;
    compiledFile += "\n"

    let compiledFunctions = ""

    for (const entry of FUNCTIONS) {
        compiledFunctions += "\n"
        compiledFunctions += "  public static " + entry
        compiledFunctions += "\n"
    }

    compiledFile += "export default class AromaticEmailTemplates {\n"
    compiledFile += "   " + compiledFunctions + "\n"
    compiledFile += "}"

    writeFileSync('./src/lib/templates/emails.ts', compiledFile)
}