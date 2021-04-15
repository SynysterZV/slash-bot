const Member = require('./Member')
const fetch = require('node-fetch')

function getArgs(ops) {
    if(!ops) return {}

    return Object.fromEntries(
        ops.map(
            ({ name, value, options }) => [ name, value || getArgs(options) || null ]
            )
        )
}

function args(ops, name) {
    if(!ops) return {}
    if(ops[0].options) return args(ops[0].options, `${name}.${ops[0].name}`)
    else return { name, args: Object.fromEntries(
        ops.map(
            ({ name, value }) => [ name, value ]
        )
    )}
}

class Interaction {
    constructor(interaction, client) {

        this.client = client

        this.name = interaction.data.name,
        this.options = interaction.data.options || null
        this.data = interaction.data
        this.type = interaction.type
        this.id = interaction.id
        this.token = interaction.token
        this.timestamp = parseInt(BigInt(this.id) >> 22n) + 1420070400000

        this.member = new Member(interaction.member)
        this.guildID = interaction.guild_id
        this.channelID = interaction.channel_id

        this.cache = new Map()

    }

    get date() {
        const time = new Date(this.timestamp).toLocaleTimeString().replace(' ', '')
        const date = new Date(this.timestamp).toLocaleDateString()
        return `${time} ${date}`
    }

    get args() {
        return getArgs(this.options) || null
    }

    get base() {
        return `https://discord.com/api/v8`
    }

    get uri() {
        return `${this.base}/interactions/${this.id}/${this.token}/callback`
    }

   async reply({ content = '', embeds = [] }, hidden) { 

        const body = JSON.stringify({
            data: {
                content,
                embeds: Array.isArray(embeds) ? embeds : [embeds],
                flags: hidden ? 64 : 0
            },
            type: 4
        })

        return await fetch(this.uri, { 
            method: 'POST', 
            headers: { 
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`, 
                "Content-Type": "application/json" 
            }, 
            body
            })
    }

async defer(hidden) {
    return await fetch(this.uri, { 
        method: 'POST', 
        headers: { 
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`, 
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({
            data: {
                flags: hidden ? 64 : 0
            },
            type: 5
        })
    })
}

async edit({ content = '', embeds = [] }) {
    
    const body = JSON.stringify({
            content,
            embeds: Array.isArray(embeds) ? embeds : [embeds],
    })

    return await fetch(`${this.base}/webhooks/${this.client.user.id}/${this.token}/messages/@original`, { 
        method: 'PATCH', 
        headers: { 
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`, 
            "Content-Type": "application/json" 
        }, 
        body
        })
            .then(res=>res.json())
    }
}

module.exports = Interaction