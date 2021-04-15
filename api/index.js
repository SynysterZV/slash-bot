const app = require('express')()
app.listen(80)

const fs = require('fs')
const path = require('path')

fs.readdirSync('lib').filter(c=>c.endsWith('.js')).forEach(file => {
    const module = require(`../api/lib/${file}`)
    if(Array.isArray(module)) {
        return module.forEach(mod => {
            mod.methods.forEach(method => {
                app.route(mod.route)[method.verb.toLowerCase()](method.callback)
            })
        })
    }
    module.methods.forEach(method => {
        app.route(module.route)[method.verb.toLowerCase()](method.callback)
    })
})

require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, 'keys', 'api.key')),
    cert: fs.readFileSync(path.join(__dirname, 'keys', 'api.crt'))
}, app).listen(443, () => console.log('HTTPS Server Started'));
