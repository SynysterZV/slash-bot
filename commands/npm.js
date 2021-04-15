const fetch = require('node-fetch').default

module.exports = {
    
    name: 'npm',

    run: async (interaction, args) => {

        const res = await fetch(`http://localhost/npm?q=${args.query}`).then(res=>res.json()).catch(() => null)
        if(res?.error) return interaction.reply({ content: `No match found for ${args.query}`}, true)
        return interaction.reply({ embeds: res })

    }
}