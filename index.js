require('dotenv').config()
const Interaction = require('./structures/Interaction')
const { Collection } = require('discord.js')
const fs = require('fs')

new (require ('discord.js').Client)()
.on('ready', async function() {
    this.commands = new Collection()
    fs.readdirSync('commands').filter(f => f.endsWith('.js')).forEach(file => {
        const module = require(`./commands/${file}`)
        this.commands.set(module.name, module)
    })
    console.log(`Ready! Logged in as ${this.user.tag}`)

}).ws.on('INTERACTION_CREATE', async function(int) {

    const interaction = new Interaction(int, this.client)
    const { name, args } = interaction
    const command = this.client.commands.get(name.toLowerCase())
    if(!command) return interaction.reply({ content: 'Command not found' }, true)

    try {
        await command.run(interaction, args, this.client)
    } catch (e) {
        console.log(e)
    }

}).client.login()