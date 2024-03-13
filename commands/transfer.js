// Require the User model
const User = require('../models/user');

module.exports = {
  name: 'transfer',
  description: 'Transfer currency to another user.',
  async execute(message, args) {
    if (args.length < 2) {
      return message.channel.send('Usage: !transfer <user> <amount>');
    }

    const recipient = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!recipient) {
      return message.channel.send('Please mention a user to transfer currency to.');
    }

    if (isNaN(amount) || amount <= 0) {
      return message.channel.send('Please specify a valid amount to transfer.');
    }

    const senderId = message.author.id;
    const recipientId = recipient.id;

    // Ensure sender isn't trying to transfer to themselves
    if (senderId === recipientId) {
      return message.channel.send("You can't transfer currency to yourself.");
    }

    // Transaction logic
    const session = await User.startSession();
    session.startTransaction();
    try {
      const sender = await User.findOne({ userId: senderId }).session(session);
      if (!sender || sender.balance < amount) {
        await session.abortTransaction();
        session.endSession();
        return message.channel.send('Insufficient funds.');
      }

      const recipientUser = await User.findOneAndUpdate(
        { userId: recipientId },
        { $inc: { balance: amount } },
        { new: true, upsert: true, session }
      );

      sender.balance -= amount;
      await sender.save({ session });

      await session.commitTransaction();
      session.endSession();

      message.channel.send(`Successfully transferred $${amount} to ${recipient.username}. Your new balance is $${sender.balance}.`);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      message.channel.send('An error occurred during the transaction.');
    }
  },
};