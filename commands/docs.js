const fetch = require('node-fetch').default

module.exports = {

    name: 'docs',

    run: async (interaction, args) => {
        
        const base = 'https://djsdocs.sorta.moe/v2'
        const qs = `?src=${args.source || 'stable'}&q=${encodeURIComponent(args.query)}`

        let res = await fetch(`${base}/embed${qs}`).then(res => res.json()).catch(() => null)
        if(!res) return interaction.reply({ content: 'No Match Found!'}, true)

        await interaction.reply({ embeds: res })

    }
}