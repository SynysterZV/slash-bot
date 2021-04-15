const fetch = require('node-fetch')
const langs = require('../langs.json')

module.exports = {

    name: 'eval',

    run: async (interaction, args ) => {


        const lang = args.lang ? langs.find(({ name }) => name == args.lang) : langs.find(({ name }) => name == 'javascript')
        if(!lang) return interaction.reply({ content: `Lang Not Found: ${args.lang}`}, true)  

        let code
        if(args.code) {
            if(Number(args.code)) {
                code = (await interaction.client.channels.cache.get(interaction.channelID).messages.fetch(args.code)).content.replace(/^```\w*\n|^`{1,3}|`{1,3}$/g, '')
            } else {
                code = args.code
            }
        }

        if(!code?.length) return interaction.reply({ content: 'You need to provide code!' })

        if(interaction.member.user.id == '372516983129767938' && !args.lang ) {

            let evaled
            let time

            try {
                time = Date.now()
                evaled = await eval(`( async () => {
                    ${code}
                })()`)
            } catch (e) {
                return interaction.reply({ content: `\`ERROR\`\n\`\`\`xl\n${e}\n\`\`\``})
            }

            time = Date.now() - time

            if(typeof evaled != 'string') evaled = require('util').inspect(evaled, { depth: 0 })

            const embed = {
                title: 'EVAL',
                fields: [
                    {
                        name: 'Elapsed',
                        value: `${time}ms`
                    }
                ],
                description: `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n**Output:**\n\`\`\`js\n${evaled || 'No Output'}\n\`\`\`` 
            }

            return interaction.reply({ embeds: embed })
        } else {

            await module.exports.get(interaction, code, lang)
        }

    },

    get: async function got(interaction, code, lang) {

        await interaction.defer()

        const start = Date.now()
        const evaled = await fetch(`${lang.url}/latest`, {
            method: 'POST',
            headers: {
                Authorization: `Token 64d23a01-6c23-4b48-b0d7-ebe6a98aa468`,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                files: [
                    {
                        name: `main.${lang.ext}`,
                        content: code
                    }
                ]
            })
        })
            .then(res=>res.json())

            console.log(evaled)

            if(evaled.message) return interaction.edit({ content: `ERROR: ${evaled.message}` })
    
            const embed = {
                title: 'EVAL',
                fields: [
                    {
                        name: 'Elapsed',
                        value: `${(Date.now() - start) - 600}ms`
                    }
                ],
                description: evaled.stdout ? `**Input:**\n\`\`\`${lang.name}\n${code}\n\`\`\`\n**Output:**\n\`\`\`${evaled.stdout.replace(/\n+/g, '').length ? lang.name : ''}\n${evaled.stdout.replace(/\n+/g, '') ? evaled.stdout : 'No Output'}\n\`\`\`` : `**Input:**\n\`\`\`${lang.name}\n${code}\n\`\`\`\n**ERROR:**\n\`\`\`xl\n${evaled.stderr || 'No Output'}\n\`\`\``
            }

    
            interaction.edit({ embeds: embed })

            return evaled
    
    }
}