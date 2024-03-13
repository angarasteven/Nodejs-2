// commands/balance.js
const User = require('../models/user');

module.exports = {
  name: 'balance',
  description: 'Check your current balance.',
  async execute(message, args) {
    const userId = message.author.id;

    const user = await User.findOne({ userId: userId }).exec();

    if (!user) {
      return message.channel.send("You don't have an account yet! Use other commands to start earning!");
    }

    message.channel.send(`${message.author.username}, your current balance is $${user.balance}.`);
  },
};