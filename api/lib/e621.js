const fetch = require('node-fetch')

const blacklist = [
    'sonic_the_hedgehog_(series)'
]

function select(posts, num) {
    let bin = []
    for(let i = 0; i <= num; i++) {
        posts = posts.filter(p => !blacklist.some(b => p.tags.copyright.includes(b) || p.tags.general.includes(b)))
        bin.push(posts[~~(Math.random() * posts.length)])
    }
    bin = bin.filter(c => typeof c != 'undefined')
    if(!bin.length) return null
    const sort = bin.sort((a,b)=>b.score.total-a.score.total)
    return  sort[0] || null
}

module.exports = {
    route: '/e621',
    methods: [
        {
            verb: 'GET',
            callback: async (req, res) => {

                let uri = `https://e621.net/posts.json?tags=${req.query.q.split(' ').join('+')}+-loli+-shota`
                if(req.query.safe) uri += `+rating:s`
                else uri += `+-rating:s`

                const result = await fetch(uri, { headers: { "User-Agent": `${req.query.ua || `BoBoSlA/${~~(Math.random() * 10000)}`}` }}).then(res=>res.json())
                if(result.success == false) return res.status(404).json({ error: `No Match Found: ${req.query.q}` })

                const post = select(result.posts, 5)

                if(!post) return res.status(404).json({ error: `No Match Found: ${req.query.q}`})
            
                const url = post.file.url || `http://static1.e621.net/data/${post.file.md5.slice(0, 2)}/${post.file.md5.slice(2, 4)}/${post.file.md5}.${post.file.ext}`
                
                const embed = {
                    author: {
                        name: 'E621',
                        icon_url: 'https://en.wikifur.com/w/images/d/dd/E621Logo.png',
                        url: 'https://e621.net'
                    },
                    title: `Result for ${req.query.q}`,
                    description: `Image not loading? Click [here](${url})`,
                    image: {
                        url: url
                    },
                    footer: {
                        text: `❤️ ${String(post.fav_count)} | Score: ${String(post.score.total)} | Artist: ${post.tags.artist[0] || 'Unknown'} | Post ID: ${post.id}`
                    }
                }
            
                return res.status(200).json(embed)
            }
        }
    ]
}