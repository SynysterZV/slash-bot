const fetch = require('node-fetch')
const embedcache = new Map()

module.exports = {
    route: '/mdn',
    methods: [
        {
            verb: 'GET',
            callback: async (req, res) => {
                if(!req.query.q) return res.status(400).json({ error: 'You need to provide a query'})

                if(embedcache.get(req.query.q)) {
                    return res.status(200).json(embedcache.get(req.query.q))
                }
        
                const base = 'https://developer.mozilla.org'
                const url = `${base}/api/v1/search?q=${req.query.q}`
                const result = await fetch(url).then(res=>res.json())
                if(result.errors || !result.documents.length) return res.status(404).json({ error: 'No Match Found'})
        
                const {
                    title,
                    mdn_url,
                    summary
                } = result.documents[0]
        
                const embed = {
                    title: title,
                    url: base + mdn_url,
                    author: {
                        name: 'MDN',
                        icon_url: 'https://avatars.githubusercontent.com/u/7565578?s=280&v=4',
                        url: base
                    },
                    description: summary.replace(/\n/g, '')
                }
        
                embedcache.set(req.query.q, embed)
                return res.status(200).json(embed)
            }
        }
    ]
}