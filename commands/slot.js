const User = require('../models/user');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'slot',
  description: 'Play the slot machine with animation. Usage: !slot <amount>',
  async execute(message, args) {
    if (args.length !== 1 || isNaN(args[0])) {
      return message.channel.send('Usage: !slot <amount>');
    }

    const betAmount = parseInt(args[0], 10);
    if (betAmount <= 0) {
      return message.channel.send('Please enter a valid bet amount greater than 0.');
    }

    const user = await User.findOne({ userId: message.author.id });
    if (!user || user.balance < betAmount) {
      return message.channel.send('💀 Insufficient funds for this bet.');
    }

    // Initial message
    let slotMessage = await message.channel.send('🎰 **Spinning...**');
    const symbols = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣']; // Larger, colored circle emojis for visibility

    // Simulate spinning with updated emojis for visibility
    for (let i = 0; i < 3; i++) {
      const spin = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]).join('  '); // Space added for larger display
      await new Promise(resolve => setTimeout(resolve, 750)); // Delay between spins
      await slotMessage.edit(`🎰 **Spinning...**\n${spin}`);
    }

    // Final spin result
    const result = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
    const resultString = result.join('  '); // Space added for larger display
    const counts = result.reduce((acc, symbol) => acc.set(symbol, (acc.get(symbol) || 0) + 1), new Map());

    // Calculate winnings based on symbol counts
    let winnings = 0, winCondition = '';
    if ([...counts.values()].some(count => count === 3)) {
      winnings = betAmount * 10; // Triple match
      winCondition = '🎉 Triple Match!';
    } else if ([...counts.values()].some(count => count === 2)) {
      winnings = betAmount * 3; // Double match
      winCondition = '🎉 Double Match!';
    }

    if (winnings > 0) {
      user.balance += winnings;
      await user.save();
      const winEmbed = new MessageEmbed()
        .setColor('#76b900')
        .setTitle(winCondition)
        .setDescription(`**Spin Result:**\n${resultString}\n\nYou won **$${winnings}**!`)
        .addField('New Balance', `$${user.balance}`, false)
        .setFooter(message.author.username, message.author.displayAvatarURL());
      await slotMessage.edit('', { embed: winEmbed }); // For Discord.js v12
    } else {
      user.balance -= betAmount;
      await user.save();
      const loseEmbed = new MessageEmbed()
        .setColor('#c70000')
        .setTitle('Better luck next time! 💀')
        .setDescription(`**Spin Result:**\n${resultString}\n\nYou lost **$${betAmount}**.`)
        .addField('New Balance', `$${user.balance}`, false)
        .setFooter(message.author.username, message.author.displayAvatarURL());
      await slotMessage.edit('', { embed: loseEmbed }); // For Discord.js v12
    }
  },
};