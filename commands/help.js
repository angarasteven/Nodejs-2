// commands/help.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'List all commands or info about a specific command.',
  execute(message, args) {
    const { commands } = message.client;

    if (!args.length) {
      // General help embed
      const helpEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Bot Commands')
        .setDescription('Here is a list of all available commands:')
        .addFields(
          commands.map(command => ({
            name: `!${command.name}`,
            value: command.description
          }))
        )
        .setTimestamp()
        .setFooter('Use !help <commandName> to get help on a specific command');

      message.channel.send(helpEmbed);
    } else {
      // Specific command help
      const name = args[0].toLowerCase();
      const command = commands.get(name);

      if (!command) {
        return message.reply('that\'s not a valid command!');
      }

      const commandEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`!${command.name}`)
        .setDescription(command.description)
        .addFields(
          { name: 'Usage', value: command.usage || `!${command.name}`, inline: true }
        )
        // Optionally, include more fields for examples, parameters, etc.
        .setTimestamp()
        .setFooter('Learn and have fun!');

      message.channel.send(commandEmbed);
    }
  },
};