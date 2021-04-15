const fetch = require('node-fetch')
const embedcache = new Map()

module.exports = {
    route: '/npm',
    methods: [
        {
            verb: 'GET',
            callback: async (req, res) => {
                
                if(!req.query.q) return res.status(400).json({ error: 'You need to provide a query'})

                if(embedcache.get(req.query.q)) {
                    res.status(200).json(embedcache.get(req.query.q))
                }

                const result = await fetch(`https://registry.npmjs.org/${req.query.q}`).then(res=>res.json())
                if(result.error) return res.status(404).json({ error: result.error })

                const {
                    name,
                    time: {
                        modified,
                        created
                    },
                    maintainers,
                    description,
                    author,
                    license,
                    versions
                } = result

                const latest = versions[result['dist-tags'].latest]


                const embed = {
                    author: {
                        name: 'NPM',
                        icon_url: 'https://images-ext-2.discordapp.net/external/3Cuh51nny9guvBRgO7FlskPbsaBIoZRbm4toUA9ba7U/https/i.imgur.com/ErKf5Y0.png',
                        url: 'https://www.npmjs.com/'
                    },
                    title: name,
                    url: `https://npmjs.com/package/${name}`,
                    color: 0x0000ff,
                    description,
                    fields: [
                        {
                            name: 'Version',
                            value: latest.version,
                            inline: true
                        },
                        {
                            name: 'License',
                            value: license || 'Unlicensed',
                            inline: true
                        },
                        {
                            name: 'Author',
                            value: author.name,
                            inline: true
                        },
                        {
                            name: 'Creation Date',
                            value: new Date(created).toLocaleDateString(),
                            inline: true,
                        },
                        {
                            name: 'Modification Date',
                            value: new Date(modified).toLocaleDateString(),
                            inline: true
                        },
                        {
                            name: 'Types',
                            value: latest.types || 'None',
                            inline: true
                        },
                        {
                            name: 'Dependencies',
                            value: Object.keys(latest.dependencies).join(', ') || 'None',
                            inline: true
                        },
                        {
                            name: 'Maintainers',
                            value: maintainers.map(c => c.name).join(', '),
                        }
                    ]

                }

                embedcache.set(req.query.q, embed)
                return res.status(200).json(embed)

            }
        }
    ]
}