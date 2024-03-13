const User = require('../models/user');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'Bet currency on a coin flip. Usage: !coinflip <heads|tails> <amount>',
  async execute(message, args) {
    if (args.length !== 2 || !['heads', 'tails'].includes(args[0]) || isNaN(args[1])) {
      return message.channel.send('Usage: !coinflip <heads|tails> <amount>');
    }

    const [choice, betAmountString] = args;
    const betAmount = parseInt(betAmountString, 10);
    if (betAmount <= 0) {
      return message.channel.send('Please enter a valid bet amount greater than 0.');
    }

    const user = await User.findOne({ userId: message.author.id });
    if (!user || user.balance < betAmount) {
      return message.channel.send('💀 Insufficient funds for this bet.');
    }

    // Initial message with spinning animation
    let coinflipMessage = await message.channel.send('🪙 Coin is spinning...');
    const spins = ['🪙', '🔄', '🪙', '🔄']; // Emojis to simulate spinning

    // Simulate coin spinning
    for (const spin of spins) {
      await new Promise(resolve => setTimeout(resolve, 750)); // Delay between spins
      await coinflipMessage.edit(`${spin}`);
    }

    // Determine the result
    const result = Math.random() < 0.5 ? 'heads' : 'tails'; // 50% chance for simplicity

    if (result === choice) {
      user.balance += betAmount; // Win
      await user.save();
      const winEmbed = new MessageEmbed()
        .setColor('#76b900')
        .setTitle('Result: You Won!')
        .setDescription(`The coin landed on ${result}. You won $${betAmount}!`)
        .addField('New Balance', `$${user.balance}`, false)
        .setFooter(message.author.username, message.author.displayAvatarURL());
      await coinflipMessage.edit('', { embed: winEmbed });
    } else {
      user.balance -= betAmount; // Lose
      await user.save();
      const loseEmbed = new MessageEmbed()
        .setColor('#c70000')
        .setTitle('Result: You Lost')
        .setDescription(`The coin landed on ${result}. You lost $${betAmount}.`)
        .addField('New Balance', `$${user.balance}`, false)
        .setFooter(message.author.username, message.author.displayAvatarURL());
      await coinflipMessage.edit('', { embed: loseEmbed });
    }
  },
};