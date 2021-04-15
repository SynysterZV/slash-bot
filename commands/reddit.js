const fetch = require('node-fetch').default

module.exports = {

    name: 'reddit',

    run: async (interaction, args) => {
        
        if(args.random) {

            let subreddit = args.random.subreddit
            subreddit = subreddit.startsWith('r/') ? subreddit.slice(2) : subreddit

            const res = await fetch(`http://localhost/reddit/random?q=${subreddit || 'memes'}`).then(res=>res.json()).catch(() => null)
            if(res?.error) return interaction.reply({ content: 'An Error has occured'}, true)
            return interaction.reply({ content: res.video ,embeds: res.embed })
        }

        if(args.latest) {

            let subreddit = args.latest.subreddit
            subreddit = subreddit.startsWith('r/') ? subreddit.slice(2) : subreddit

            const res = await fetch(`http://localhost/reddit/latest?q=${subreddit || 'memes'}`).then(res=>res.json()).catch(() => null)
            if(res?.error) return interaction.reply({ content: 'An Error has occured'}, true)
            return interaction.reply({ content: res.video, embeds: res.embed })
        }
    }
}