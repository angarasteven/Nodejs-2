// commands/trade.js
const User = require('../models/user');
const Item = require('../models/item');
// Assuming a model or method to track trades, which could be part of the User model or a separate model

module.exports = {
  name: 'trade',
  description: 'Trade items with another user. Use !trade propose <yourItemName> <theirUsername> <theirItemName> to propose a trade.',
  async execute(message, args) {
    if (args[0] === 'propose' && args.length === 4) {
      const [_, yourItemName, theirUsername, theirItemName] = args;
      const theirUser = message.mentions.users.first();

      if (!theirUser) {
        return message.channel.send("You need to mention a user to propose a trade with.");
      }

      // Simplified: check if both users own the specified items
      // Real implementation should securely verify ownership and lock items for trade
      const yourItem = await Item.findOne({ name: yourItemName });
      const theirItem = await Item.findOne({ name: theirItemName });

      if (!yourItem || !theirItem) {
        return message.channel.send("One or both specified items don't exist.");
      }

      // Here, add logic to record the proposed trade, requiring confirmation from the other user
      // This could involve creating a Trade model/document, notifying the other user, and implementing accept/decline commands

      return message.channel.send(`Trade proposed: Your ${yourItemName} for ${theirUsername}'s ${theirItemName}. Waiting for their response.`);
    }

    // Implementations for accepting, declining trades, etc.

    return message.channel.send("Invalid trade command. Use !trade propose <yourItemName> <theirUsername> <theirItemName>.");
  },
};