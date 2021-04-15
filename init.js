require('dotenv').config()
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fetch = require('node-fetch')
const id = '829588310158213150'

const model = require('./model')
const guildModel = require('./guildModel')

yargs(hideBin(process.argv))
    .command('load [id] [-a | -g] [-v]', 'Load slash commands', yargs => {
        yargs
            .positional('id', {
                describe: 'ID of guilds commands to load',
                description: 'ID of guilds commands to load'
            })
    }, argv => {
        if(argv.all) {
            guildModel.forEach(g => {
                request(makeUri(g.id), g.model, argv.verbose)
            })
            return request(makeUri(), model, argv.verbose)
        }
        if(argv.global) {
            return request(makeUri(), model, args.verbose)
        }
        if(argv.id) {
            const m = guildModel.find(({ id }) => id == argv.id)
            if(!m) return console.log('Guild Not Found')
            return request(makeUri(m.id), m.model, argv.verbose)
        }
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run in verbose mode',
    })
    .option('all', {
        alias: 'a',
        type: 'boolean',
        description: 'Load all commands'
    })
    .option('global', {
        alias: 'g',
        type: 'boolean',
        description: 'Load all global commands',
        default: true
    })
    .strictCommands()
    .demandCommand(1)
    .argv


function makeUri(gid) {
    const base = `https://discord.com/api/v8/applications/${id}`
    if(gid) {
        return `${base}/guilds/${gid}/commands`
    }
    return `${base}/commands`
}


async function request(uri, model, log) {
        const res = await fetch(uri, {
            method: 'PUT',
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(model)
        })
            .then(res => res.json() )
        
        if(log) console.log(res)
        return res
}