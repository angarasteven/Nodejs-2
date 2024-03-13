// commands/roulette.js
const User = require('../models/user');

module.exports = {
  name: 'roulette',
  description: 'Bet currency on a roulette spin. Usage: !roulette <betType> <amount>, where betType is red, black, number (0-36), low (1-18), or high (19-36)',
  async execute(message, args) {
    if (args.length !== 2) {
      return message.channel.send('Invalid usage. Correct usage: !roulette <betType> <amount>');
    }

    const [betType, betAmountString] = args;
    const betAmount = parseInt(betAmountString, 10);
    if (isNaN(betAmount) || betAmount <= 0) {
      return message.channel.send('Invalid bet amount. Usage: !roulette <betType> <amount>');
    }

    const user = await User.findOne({ userId: message.author.id });
    if (!user || user.balance < betAmount) {
      return message.channel.send('Insufficient funds for this bet.');
    }

    // Simulate the roulette spin
    const spinResult = Math.floor(Math.random() * 37); // 0-36
    const colors = ['red', 'black'];
    const resultColor = spinResult % 2 === 0 ? 'red' : 'black';

    // Determine if the user won
    let winCondition = false;
    if (colors.includes(betType)) {
      winCondition = betType === resultColor;
    } else if (betType === 'low') {
      winCondition = spinResult >= 1 && spinResult <= 18;
    } else if (betType === 'high') {
      winCondition = spinResult >= 19 && spinResult <= 36;
    } else if (!isNaN(parseInt(betType, 10))) {
      winCondition = spinResult === parseInt(betType, 10);
    } else {
      return message.channel.send('Invalid bet type. Usage: !roulette <betType> <amount>');
    }

    if (winCondition) {
      const winAmount = betType === resultColor ? betAmount : betAmount * 2; // Color bets pay 1:1, number bets pay 35:1
      user.balance += winAmount;
      await user.save();
      message.channel.send(`Roulette landed on ${resultColor} ${spinResult}. You win $${winAmount}! Your new balance is $${user.balance}.`);
    } else {
      user.balance -= betAmount;
      await user.save();
      message.channel.send(`Roulette landed on ${resultColor} ${spinResult}. You lose $${betAmount}. Your new balance is $${user.balance}.`);
    }
  },
};