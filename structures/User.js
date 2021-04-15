class User {
    constructor(u) {
        
        this.username = u.username
        this.publicFlags = u.public_flags,
        this.id = u.id,
        this.discriminator = u.discriminator
        this.avatar = u.avatar
    }

    get avatarURL() {
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`
    }
}

module.exports = User