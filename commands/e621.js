const fetch = require('node-fetch')

module.exports = {
    
    name: 'e621',

    run: async (interaction, { args }, client) => {

        const channel = client.channels.cache.get(interaction.channelID)

        let url = `http://localhost/e621?q=${args.query}&ua=${interaction.member.user.username}/${~~(Math.random() * parseInt(interaction.member.user.discriminator))}`
        if(!channel.nsfw) url += `&safe=1`

        const res = await fetch(url).then(res=>res.json()).catch(() => null)
        if(res?.error) return interaction.reply({ content: res.error || 'No Match found for' + args.query}, true)
        return interaction.reply({ embeds: res })

    }
}