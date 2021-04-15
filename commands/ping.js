module.exports = {
    
    name: 'ping',

    run: async (interaction) => {

        return interaction.reply({ content: `API Latency is **${interaction.client.ws.ping}ms**\nRound-Trip Latencry is **${Date.now() - interaction.timestamp}ms**` })

    }
}