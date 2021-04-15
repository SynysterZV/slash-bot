module.exports = [
    {
        name: 'ping',
        description: 'pong!'
    },
    {
        name: 'e621',
        description: 'Search e621',
        options: [
            {
                type: 3,
                name: 'query',
                description: 'Search term',
                required: true
            }
        ]
    },
    {
        name: 'docs',
        description: 'Search DJS Docs',
        options: [
            {
                type: 3,
                name: 'query',
                description: 'Search term',
                required: true
            },
            {
                type: 3,
                name: 'source',
                description: 'Project/Docs to serch from',
                choices: [
                    {
                        name: 'master',
                        value: 'master',
                    },
                    {
                        name: 'stable',
                        value: 'stable',
                    },
                    {
                        name: 'collection',
                        value: 'colleciton'
                    }
                ]
            }
        ]
    },
    {
        name: 'mdn',
        description: 'Search MDN Docs',
        options: [
            {
                type: 3,
                name: 'query',
                description: 'Search term',
                required: true
            }
        ]
    },
    {
        name: 'npm',
        description: 'Search NPM Registry',
        options: [
            {
                type: 3,
                name: 'query',
                description: 'Search term',
                required: true
            }
        ]
    },
    {
        name: 'reddit',
        description: 'Search Reddit',
        options: [
            {
                name: "random",
                description: 'Get random post from a subreddit (defaults to r/memes)',
                type: 1,
                options: [
                    {
                        name: 'subreddit',
                        description: 'Subreddit to get random post from',
                        type: 3
                    }
                ]
            },
            {
                name: 'latest',
                description: 'Get latest post from a subreddit (defaults to r/memes)',
                type: 1,
                options: [
                    {
                        name: 'subreddit',
                        description: 'Subreddit to get lastest post from',
                        type: 3
                    }
                ]
            }
        ]
    }
]