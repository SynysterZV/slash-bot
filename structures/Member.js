const User = require('./User')

class Member {
    constructor(m) {

        this.user = new User(m.user)
        this.roles = m.roles
        this.premiumSince = m.premium_since
        this.permissions = m.permissions
        this.pending = m.pending
        this.nick = m.nick
        this.mute = m.mute
        this.joinedAt = m.joined_at
        this.deaf = m.deaf

    }

    get avatarURL() {
        return `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
    }
}

module.exports = Member