const User = require('../models/user');
const { MessageEmbed } = require('discord.js');

// In-memory cooldown storage
const cooldowns = new Map();

module.exports = {
  name: 'earn',
  description: 'Earn currency with a daily cooldown. Usage: !earn',
  async execute(message, args) {
    const userId = message.author.id;

    // Check cooldown
    const now = Date.now();
    const cooldownAmount = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId) + cooldownAmount;
      
      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000; // Convert to seconds for display
        const hoursLeft = Math.floor(timeLeft / 3600);
        const minutesLeft = Math.floor((timeLeft % 3600) / 60);
        
        return message.channel.send(`⏳ You need to wait ${hoursLeft} hours and ${minutesLeft} minutes before earning again.`);
      }
    }

    // Update cooldown
    cooldowns.set(userId, now);

    // User can earn currency here
    const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10; // Random amount between 10 and 100

    // Fetch the user and update balance
    let user = await User.findOne({ userId: message.author.id });
    if (!user) {
      user = new User({ userId, balance: amount });
    } else {
      user.balance += amount;
    }
    await user.save();

    // Construct the response embed
    const embed = new MessageEmbed()
      .setTitle('Daily Earnings')
      .setColor('#00FF00')
      .setDescription(`${message.author.username}, you've earned $${amount}!`)
      .addField('New Balance', `$${user.balance}`, true)
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() });

    message.channel.send({ embed });
  },
};