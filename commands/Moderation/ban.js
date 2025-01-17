const { MessageEmbed } = require('discord.js');
const config = require("../../configuration/conf.json").bot;

module.exports = {
    name: "ban",
    aliases: ["rekt", "bean"],
    usage: "ban <@user> [reason]",
    description: "Bans a provided user.",
    permsneeded: "BAN_MEMBERS",
    run: async (bot, message, args) => {

        message.delete();

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const BanReason = args.slice(1).join(" ") || "No Reason Provided"; // Ban reason

        // Error Embed
        const ErrorEmbed = new MessageEmbed()
            .setTitle(":x: Error Occured!")
            .setDescription("Failed to ban the user.")
            .setColor("RED")

        // Banned Embed(DM)        
        const banembed = new MessageEmbed()
            .setDescription(`You were **banned** from ${message.guild.name} | **${BanReason}**`)
            .setColor("RED")
            .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setTimestamp()

        if (!user) return message.reply("please mention a user and provide a reason to ban...")

        if (!message.guild.member(user).bannable) return message.reply(ErrorEmbed)


        user.send(banembed
        ).catch(e => console.log("Cannot send message to this user."))
            .then(() => {
                user.ban({
                    reason: `${BanReason}`
                }).then(mem => {

                    const bannedembed = new MessageEmbed()
                        .setDescription(`<@!${mem.user.id}> has been **banned** | **${BanReason}**`)
                        .setColor("RED")
                        .setAuthor(`MEMBER BANNED!`, message.guild.iconURL({ dynamic: true }))
                        .setTimestamp()

                    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("No Perms to do this!!!!");
                    else {
                        message.channel.send(bannedembed);

                    bot.modlogs({
                        Member: user,
                        Action: 'Banned',
                        Color: "RED",
                        Reason: BanReason
                     }, message)

                }
            });
        });
    },
};
