import { readdirSync, readFileSync, writeFileSync } from "fs"

const TEMPLATES = {}
const FUNCTIONS = {}


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
        TEMPLATES[template.name.replace('.html', '')] = readFileSync('./resources/emails/build/' + template.name, {
            encoding: 'utf8'
        })
    }

    FUNCTIONS['verification'] = `function verification(link: string) { return \`${TEMPLATES['verification']}\`; }`
    console.log('Generating ./src/lib/templates/emails.ts')

    let compiledFile = WARNING;
    compiledFile += "\n"
    
    for (const entry of Object.entries(FUNCTIONS)) {
        compiledFile += "export " + entry[1]
    }

    writeFileSync('./src/lib/templates/emails.ts', compiledFile)
}