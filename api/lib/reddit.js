const fetch = require('node-fetch')

function random(c) {
    return c[~~(Math.random() * c.length)]
}

function makeEmbed(result , rand) {
                    let body
                    if(rand) {
                        try {
                            body = Array.isArray(result) ? random(result[0].data.children).data : random(result.data.children).data
                            } catch {
    
                            }
    
                    } else {
                        try {
                        body = Array.isArray(result) ? result[0].data.children[0].data : result.data.children[0].data
                        } catch {

                        }
                    }

                    if(typeof body == 'undefined') return { error: 'No Posts found' }
                    
                    let {
                        author,
                        title,
                        subreddit_name_prefixed,
                        selftext,
                        thumbnail,
                        score,
                        num_comments,
                        url,
                        created_utc,
                        permalink,
                        url_overridden_by_dest,
                        gallery_data,
                        is_video
                    } = body

                    if(url?.match(/imgur|gfycat/)) url += '.gif'
                    if(url_overridden_by_dest?.match(/imgur|gfycat/)) url_overridden_by_dest += '.gif'

                    const embed = {
                        author: {
                            name: subreddit_name_prefixed,
                            icon_url: 'https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_reddit-512.png',
                            url: `https://reddit.com/${subreddit_name_prefixed}`
                        },
                        title: title.replace('&amp;', '&'),
                        url: `https://reddit.com${permalink}`,
                        image: {
                            url: (thumbnail == 'self') ? '' : gallery_data ? `https://i.redd.it/${gallery_data.items[0].media_id}.jpg` : url_overridden_by_dest || url
                        },
                        footer: {
                            text: `${ score >= 0 ? `👍 ${score}` : `👎 ${score}`} ◈ 💬 ${num_comments} ◈ Author: ${author}`,
                        },
                        color: 0xFF5700,
                        timestamp: new Date(parseInt(created_utc + '000')),
                        description: selftext ? `${selftext.substr(0, 2000)}...` : ''
                    }

                    return { embed, is_video, url }

}

module.exports = [
    {
        route: '/reddit/random',
        methods: [
            {
                verb: 'GET',
                callback: async (req, res) => {
                    if(!req.query.q) return res.status(400).json({ error: 'You need to provide a query!'})

                    const result = await fetch(`https://reddit.com/r/${req.query.q}/random/.json`).then(res=>res.json()).catch(() => null)
                    if(!result) return res.status(404).json({ error: `Subreddit Not Found: ${req.query.q}`})

                    const embed = makeEmbed(result, true)
                    if(embed.error) return res.status(404).json(embed)

                    if(embed.is_video) {
                        return res.status(200).json({ embed: embed.embed, video: embed.video })
                    } else {
                        return res.status(200).json({ embed: embed.embed, video: null })
                    }
                }
            }
        ]
    },
    {
        route: '/reddit/latest',
        methods: [
            {
                verb: 'GET',
                callback: async (req, res) => {
                    if(!req.query.q) return res.status(400).json({ error: 'You need to provide a query!'})

                    const result = await fetch(`https://reddit.com/r/${req.query.q}/new/.json`).then(res=>res.json()).catch(() => null)
                    if(!result) return res.status(404).json({ error: `Subreddit Not Found: ${req.query.q}`})

                    const embed = makeEmbed(result)
                    if(embed.error) return res.status(404).json(embed)

                    if(embed.is_video) {
                        return res.status(200).json({ embed: embed.embed, video: embed.video })
                    } else {
                        return res.status(200).json({ embed: embed.embed, video: null })
                    }
                }
            }
        ] 
    }
]