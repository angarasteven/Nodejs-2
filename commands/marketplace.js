// commands/marketplace.js
const User = require('../models/user');
const Item = require('../models/item');

module.exports = {
  name: 'marketplace',
  description: 'Interact with the marketplace. Use !marketplace list to view items, !marketplace buy <itemName> to purchase, or !marketplace sell <itemName> to sell an item.',
  async execute(message, args) {
    if (args.length === 0 || args[0] === 'list') {
      // List all items in the marketplace
      const items = await Item.find({});
      if (items.length === 0) {
        return message.channel.send('The marketplace is currently empty.');
      }
      const itemList = items.map(item => `${item.name} - $${item.price} - ${item.stock} in stock`).join('\n');
      message.channel.send(`Items available in the marketplace:\n${itemList}`);
    } else if (args[0] === 'buy' && args.length > 1) {
      // Purchase an item
      const itemName = args.slice(1).join(' ');
      const item = await Item.findOne({ name: itemName });
      if (!item) {
        return message.channel.send('Item not found.');
      }
      if (item.stock < 1) {
        return message.channel.send('This item is out of stock.');
      }
      const user = await User.findOne({ userId: message.author.id });
      if (!user || user.balance < item.price) {
        return message.channel.send('Insufficient funds.');
      }
      user.balance -= item.price;
      item.stock -= 1;
      await user.save();
      await item.save();
      message.channel.send(`You have purchased ${item.name} for $${item.price}. Your new balance is $${user.balance}.`);
    } else if (args[0] === 'sell' && args.length > 1) {
      // Sell an item
      const itemName = args.slice(1).join(' ');
      const item = await Item.findOne({ name: itemName });
      if (!item) {
        return message.channel.send('Item not found.');
      }
      const user = await User.findOne({ userId: message.author.id });
      if (!user) {
        return message.channel.send("You don't have an account or balance.");
      }
      // Assume the user can sell the item for its full price
      user.balance += item.price;
      item.stock += 1; // Increase the item's stock
      await user.save();
      await item.save();
      message.channel.send(`You have sold ${item.name} for $${item.price}. Your new balance is $${user.balance}.`);
    } else {
      message.channel.send('Invalid command. Use !marketplace list to view items, !marketplace buy <itemName> to purchase, or !marketplace sell <itemName> to sell an item.');
    }
  },
};