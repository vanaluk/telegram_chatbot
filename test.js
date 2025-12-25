// Script for testing business bot

const BotUtils = require('./utils');
const config = require('./config');
require('dotenv').config();

console.log('🧪 Testing business bot...\n');

// Test 1: Configuration check
console.log('1️⃣ Configuration check:');
console.log(`   ✅ Bot token: ${config.bot.token ? 'Specified' : '❌ NOT SPECIFIED'}`);
console.log(`   ✅ Admin ID: ${config.bot.adminId ? 'Specified' : '❌ NOT SPECIFIED'}`);
console.log(`   ✅ Company name: ${config.company.name}`);
console.log(`   ✅ Contacts: ${config.company.phone}, ${config.company.email}`);
console.log(`   ✅ Products in catalog: ${config.products.length}`);
console.log(`   ✅ FAQ questions: ${config.faq.length}\n`);

// Test 2: Utilities check
console.log('2️⃣ Testing utilities:');
console.log(`   ✅ Price formatting: ${BotUtils.formatPrice(5000)}`);
console.log(`   ✅ Date formatting: ${BotUtils.formatDate(new Date())}`);
console.log(`   ✅ Email validation: test@email.com - ${BotUtils.isValidEmail('test@email.com') ? '✅' : '❌'}`);
console.log(`   ✅ Phone validation: +7(495)123-45-67 - ${BotUtils.isValidPhone('+7(495)123-45-67') ? '✅' : '❌'}`);
console.log(`   ✅ ID generation: ${BotUtils.generateId().substring(0, 10)}...`);
console.log(`   ✅ Working hours: ${BotUtils.isWorkingHours() ? '✅' : '❌'}\n`);

// Test 3: Products check
console.log('3️⃣ Products catalog check:');
config.products.forEach(product => {
    console.log(`   📦 ${product.name} - ${BotUtils.formatPrice(product.price)} (${product.available ? '✅ Available' : '❌ Unavailable'})`);
});
console.log();

// Test 4: FAQ check
console.log('4️⃣ FAQ check:');
config.faq.forEach((item, index) => {
    console.log(`   ❓ ${index + 1}. ${item.question}`);
});
console.log();

// Test 5: Statistics check
console.log('5️⃣ Testing statistics calculation:');
const mockOrders = [
    { price: 5000, status: 'completed', createdAt: new Date() },
    { price: 8000, status: 'pending', createdAt: new Date() },
    { price: 3000, status: 'completed', createdAt: new Date(Date.now() - 86400000) } // yesterday
];
const mockUsers = new Map([
    ['1', { name: 'Test user', orders: [], lastActivity: new Date() }],
    ['2', { name: 'Another user', orders: [], lastActivity: new Date() }]
]);

const stats = BotUtils.calculateStats(mockOrders, mockUsers);
console.log(`   📊 Total orders: ${stats.totalOrders}`);
console.log(`   💰 Total revenue: ${BotUtils.formatPrice(stats.revenue)}`);
console.log(`   👥 Total users: ${stats.totalUsers}`);
console.log(`   📦 Completed orders: ${stats.completedOrders}\n`);

// Test 6: Dependencies check
console.log('6️⃣ Dependencies check:');
try {
    const TelegramBot = require('node-telegram-bot-api');
    console.log('   ✅ node-telegram-bot-api: installed');
} catch (error) {
    console.log('   ❌ node-telegram-bot-api: NOT INSTALLED');
}

try {
    require('dotenv');
    console.log('   ✅ dotenv: installed');
} catch (error) {
    console.log('   ❌ dotenv: NOT INSTALLED');
}

console.log('\n🎉 Testing completed!');

// Launch instructions
if (!config.bot.token) {
    console.log('\n⚠️  IMPORTANT:');
    console.log('   1. Create a bot in @BotFather (https://t.me/botfather)');
    console.log('   2. Copy example.env to .env');
    console.log('   3. Specify bot token in TELEGRAM_BOT_TOKEN');
    console.log('   4. Specify your Telegram ID in ADMIN_CHAT_ID');
    console.log('   5. Run the bot: npm start');
} else {
    console.log('\n🚀 To run the bot, execute: npm start');
}
