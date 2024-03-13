// commands/history.js
const Transaction = require('../models/transaction');

module.exports = {
  name: 'history',
  description: 'View your transaction history.',
  async execute(message, args) {
    const userId = message.author.id;

    // Retrieve the last 10 transactions for the user
    const transactions = await Transaction.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    if (transactions.length === 0) {
      return message.channel.send("You don't have any transactions yet.");
    }

    // Create a response message that lists the transactions
    const historyMessage = transactions.map((t, index) => {
      const type = t.type.charAt(0).toUpperCase() + t.type.slice(1);
      const targetUserPart = t.targetUserId ? ` to <@${t.targetUserId}>` : '';
      return `${index + 1}. ${type} of $${t.amount}${targetUserPart} on ${t.createdAt.toDateString()}`;
    }).join('\n');

    message.channel.send(`Here's your last 10 transactions:\n${historyMessage}`);
  },
};