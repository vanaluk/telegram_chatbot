const TelegramBot = require('node-telegram-bot-api');
const BotUtils = require('./utils');
const config = require('./config');
require('dotenv').config();

// Create bot
// For production, webhooks are recommended instead of polling
const bot = new TelegramBot(config.bot.token, {
    polling: config.bot.polling,
    // webHook: true, // Uncomment for production
    // webHook: { port: process.env.PORT || 443 } // And specify port
});

// Data storage (use database in production)
let orders = [];
let users = new Map();

// Class for managing business logic
class BusinessBot {
    constructor() {
        this.mainMenu();
        this.catalogMenu();
        this.orderManagement();
        this.supportSystem();
    }

    // Main menu
    mainMenu() {
        bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            const userName = msg.from.first_name || 'Dear customer';

            users.set(chatId, {
                name: userName,
                username: msg.from.username,
                orders: [],
                lastActivity: new Date()
            });

            BotUtils.log('user_started_bot', { chatId, userName });

            const welcomeMessage = `
🌟 *Welcome to ${config.company.name}!*

Hello, ${userName}! 👋

I am your personal assistant. How can I help you?

📋 *Our services:*
• Consultations and support
• Product and service orders
• Company information
• Frequently asked questions

Choose an action below:
            `;

            const options = {
                reply_markup: BotUtils.createMainMenuKeyboard(),
                parse_mode: 'Markdown'
            };

            bot.sendMessage(chatId, welcomeMessage, options);
        });

        // Handle main menu buttons
        bot.on('callback_query', (query) => {
            const chatId = query.message.chat.id;
            const data = query.data;

            BotUtils.log('callback_query', { chatId, data });

            switch(data) {
                case 'catalog':
                    this.showCatalog(chatId);
                    break;
                case 'order':
                    this.showOrderForm(chatId);
                    break;
                case 'about':
                    this.showAbout(chatId);
                    break;
                case 'faq':
                    this.showFAQ(chatId);
                    break;
                case 'contacts':
                    this.showContacts(chatId);
                    break;
                case 'support':
                    this.showSupport(chatId);
                    break;
                case 'menu':
                    this.showMainMenu(chatId);
                    break;
            }

            bot.answerCallbackQuery(query.id);
        });
    }

    showMainMenu(chatId) {
        const message = `
🏠 *Main Menu*

Choose the desired section:
        `;

        const options = {
            reply_markup: BotUtils.createMainMenuKeyboard(),
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    // Product catalog
    catalogMenu() {
        this.products = config.products;
    }

    showCatalog(chatId) {
        let message = '🛍️ *Our products and services catalog*\n\n';

        // Group products by categories
        const categories = {};
        this.products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = [];
            }
            categories[product.category].push(product);
        });

        // Display products by categories
        Object.keys(categories).forEach(category => {
            message += `📂 *${category}:*\n`;
            categories[category].forEach(product => {
                const status = product.available ? '✅' : '❌';
                message += `${status} ${product.name} - ${BotUtils.formatPrice(product.price)}\n`;
            });
            message += '\n';
        });

        message += 'Select a product for detailed information:';

        const keyboard = BotUtils.createProductKeyboard(
            this.products.filter(p => p.available)
        );

        const options = {
            reply_markup: {
                inline_keyboard: keyboard
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    // Order system
    orderManagement() {
        bot.on('callback_query', (query) => {
            const chatId = query.message.chat.id;
            const data = query.data;

            if (data.startsWith('product_')) {
                const productId = parseInt(data.split('_')[1]);
                this.showProductDetail(chatId, productId);
            } else if (data.startsWith('order_')) {
                const productId = parseInt(data.split('_')[1]);
                this.createOrder(chatId, productId);
            }
        });
    }

    // Support system
    supportSystem() {
        // Support logic is already implemented in showSupport and processSupportRequest
    }

    showProductDetail(chatId, productId) {
        const product = this.products.find(p => p.id === productId);

        if (!product) {
            bot.sendMessage(chatId, '❌ Product not found');
            return;
        }

        if (!product.available) {
            bot.sendMessage(chatId, '❌ This product is temporarily unavailable');
            return;
        }

        const message = `
📦 *${product.name}*

💰 *Price:* ${BotUtils.formatPrice(product.price)}
📂 *Category:* ${product.category}
⏱️ *Completion time:* ${product.duration}
📝 *Description:* ${product.description}

Would you like to order this service?
        `;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '✅ Order', callback_data: `order_${product.id}` },
                        { text: '⬅️ Back to catalog', callback_data: 'catalog' }
                    ]
                ]
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    showOrderForm(chatId) {
        const message = `
📝 *Order placement*

Please describe your order in detail:
• What exactly are you interested in?
• What budget do you plan?
• Completion deadlines?
• Contact information?

Send a message with order details.
        `;

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

        // Wait for user response
        bot.once('message', (msg) => {
            if (msg.chat.id === chatId && !msg.text.startsWith('/')) {
                this.processOrder(chatId, msg.text, msg.from);
            }
        });
    }

    createOrder(chatId, productId) {
        const product = this.products.find(p => p.id === productId);
        const user = users.get(chatId);

        const order = {
            id: BotUtils.generateId(),
            productId: product.id,
            productName: product.name,
            price: product.price,
            customerId: chatId,
            customerName: user.name,
            status: 'pending',
            createdAt: new Date(),
            description: `Заказ товара: ${product.name}`,
            category: product.category
        };

        orders.push(order);

        // Log order creation
        BotUtils.log('order_created', {
            orderId: order.id,
            productId: product.id,
            customerId: chatId,
            price: product.price
        });

        // Send notification to admin
        if (config.notifications.newOrder) {
            BotUtils.sendAdminNotification(
                bot,
                config.bot.adminId,
                `🆕 *Новый заказ*\n\n📦 ${product.name}\n👤 ${user.name}\n💰 ${BotUtils.formatPrice(product.price)}\n🆔 #${order.id}`,
                'success'
            );
        }

        const message = `
✅ *Order successfully created!*

📦 *${product.name}*
💰 Cost: ${BotUtils.formatPrice(product.price)}
🆔 Order number: #${order.id}
⏰ Creation date: ${BotUtils.formatDate(order.createdAt)}

${BotUtils.getResponseTimeMessage()}.

Would you like to order something else?
        `;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🛍️ Continue shopping', callback_data: 'catalog' },
                        { text: '🏠 Main menu', callback_data: 'menu' }
                    ]
                ]
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    processOrder(chatId, orderText, userInfo) {
        const order = {
            id: BotUtils.generateId(),
            customerId: chatId,
            customerName: userInfo.first_name + ' ' + (userInfo.last_name || ''),
            description: orderText,
            status: 'pending',
            createdAt: new Date(),
            type: 'custom'
        };

        orders.push(order);

        // Log custom order
        BotUtils.log('custom_order_created', {
            orderId: order.id,
            customerId: chatId,
            descriptionLength: orderText.length
        });

        // Send notification to admin
        if (config.notifications.newOrder) {
            BotUtils.sendAdminNotification(
                bot,
                config.bot.adminId,
                `🆕 *Пользовательский заказ*\n\n👤 ${order.customerName}\n📝 ${orderText.substring(0, 200)}${orderText.length > 200 ? '...' : ''}\n🆔 #${order.id}`,
                'info'
            );
        }

        const message = `
✅ *Thank you for your order!*

🆔 Order number: #${order.id}
👤 Customer: ${order.customerName}
📝 Description: ${order.description}

${BotUtils.getResponseTimeMessage()}.

Would you like to clarify anything else?
        `;

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }

    // Information sections
    showAbout(chatId) {
        const message = `
🏢 *About our company*

${config.company.name} - leading business solutions provider.

🎯 *Our mission:*
To help businesses grow and develop through innovative solutions and quality service.

💼 *What we offer:*
• Business consulting and audit
• IT solutions and development
• Marketing strategies
• Training and personnel development
• Legal support
• Financial analysis

🚀 *Why choose us:*
• Professional team of experts
• Individual approach to each client
• Modern technologies and methods
• Quality and deadline guarantee
• Competitive prices

📈 *Our clients' results:*
• Profit growth up to 150%
• Cost optimization up to 30%
• Process efficiency increase
• Customer satisfaction improvement
        `;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '⬅️ Back', callback_data: 'menu' }]
                ]
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    showFAQ(chatId) {
        let message = '❓ *Часто задаваемые вопросы*\n\n';

        config.faq.forEach((item, index) => {
            message += `🔸 *${item.question}*\n${item.answer}\n\n`;
        });

        message += 'Остались вопросы? Напишите нам!';

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🆘 Поддержка', callback_data: 'support' },
                        { text: '⬅️ Назад', callback_data: 'menu' }
                    ]
                ]
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    showContacts(chatId) {
        const message = `
📞 *Contact information*

🏢 *Address:*
${config.company.address}

📱 *Phone:*
${config.company.phone}

📧 *Email:*
${config.company.email}

🌐 *Website:*
${config.company.website}

🕒 *Working hours:*
${config.company.workingHours}
Sat-Sun: closed

💬 *Online chat:*
Available 24/7 through this bot

🚗 *How to get here:*
By public transport / personal car
        `;

        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📞 Call', url: `tel:${config.company.phone.replace(/\s/g, '')}` },
                        { text: '📧 Write', url: `mailto:${config.company.email}` }
                    ],
                    [
                        { text: '🌐 Website', url: config.company.website },
                        { text: '🗺️ Map', url: `https://maps.google.com/?q=${encodeURIComponent(config.company.address)}` }
                    ],
                    [{ text: '⬅️ Back', callback_data: 'menu' }]
                ]
            },
            parse_mode: 'Markdown'
        };

        bot.sendMessage(chatId, message, options);
    }

    showSupport(chatId) {
        const message = `
🆘 *Technical support*

If you have any questions or problems, we are always ready to help!

💬 *How to get help:*
1. Describe your problem
2. Provide contact information
3. Our specialist will contact you

📝 *Send a message describing the problem:*
        `;

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });

        // Wait for user message
        bot.once('message', (msg) => {
            if (msg.chat.id === chatId && !msg.text.startsWith('/')) {
                this.processSupportRequest(chatId, msg.text, msg.from);
            }
        });
    }

    processSupportRequest(chatId, message, userInfo) {
        const supportRequest = {
            id: BotUtils.generateId(),
            customerId: chatId,
            customerName: userInfo.first_name + ' ' + (userInfo.last_name || ''),
            username: userInfo.username,
            message: message,
            createdAt: new Date(),
            status: 'new'
        };

        // Log support request
        BotUtils.log('support_request', {
            requestId: supportRequest.id,
            customerId: chatId,
            messageLength: message.length
        });

        const responseMessage = `
✅ *Thank you for your inquiry!*

Your message has been accepted for processing.
🆔 Request number: #${supportRequest.id}

${BotUtils.getResponseTimeMessage()}.

📝 *Your message:*
${message}
        `;

        bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });

        // Send notification to administrator
        if (config.notifications.newSupportRequest) {
            BotUtils.sendAdminNotification(
                bot,
                config.bot.adminId,
                `🚨 *Новое обращение в поддержку*\n\n👤 ${supportRequest.customerName}${supportRequest.username ? ` (@${supportRequest.username})` : ''}\n🆔 #${supportRequest.id}\n📝 ${message.substring(0, 300)}${message.length > 300 ? '...' : ''}\n⏰ ${BotUtils.formatDate(supportRequest.createdAt)}`,
                'warning'
            );
        }
    }

    // Admin functions (for bot management)
    adminFunctions() {
        bot.onText(/\/admin/, (msg) => {
            const chatId = msg.chat.id;

            // Admin check
            if (chatId.toString() === config.bot.adminId) {
                const stats = BotUtils.calculateStats(orders, users);

                const message = `
🔧 *Admin panel*

📊 *Today's statistics:*
• Orders: ${stats.todayOrders}
• Revenue: ${BotUtils.formatPrice(stats.todayRevenue)}
• New users: ${Array.from(users.values()).filter(u => u.lastActivity.toDateString() === new Date().toDateString()).length}

📈 *Overall statistics:*
• Total orders: ${stats.totalOrders}
• Completed orders: ${stats.completedOrders}
• Active users: ${stats.totalUsers}
• Total revenue: ${BotUtils.formatPrice(stats.revenue)}

⚙️ *Management:*
                `;

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '📋 Все заказы', callback_data: 'admin_orders' },
                                { text: '👥 Пользователи', callback_data: 'admin_users' }
                            ],
                            [
                                { text: '📈 Подробная статистика', callback_data: 'admin_stats' },
                                { text: '🔄 Обновить', callback_data: 'admin_refresh' }
                            ]
                        ]
                    },
                    parse_mode: 'Markdown'
                };

                bot.sendMessage(chatId, message, options);
            } else {
                bot.sendMessage(chatId, '❌ Access denied');
                BotUtils.log('unauthorized_admin_access', { chatId });
            }
        });

        // Handle admin callbacks
        bot.on('callback_query', (query) => {
            const chatId = query.message.chat.id;
            const data = query.data;

            if (chatId.toString() !== config.bot.adminId) return;

            switch(data) {
                case 'admin_orders':
                    this.showAdminOrders(chatId);
                    break;
                case 'admin_users':
                    this.showAdminUsers(chatId);
                    break;
                case 'admin_stats':
                    this.showAdminStats(chatId);
                    break;
                case 'admin_refresh':
                    // Just restart admin panel
                    this.adminFunctions();
                    break;
            }
        });
    }

    showAdminOrders(chatId) {
        if (orders.length === 0) {
            bot.sendMessage(chatId, '📋 No orders yet');
            return;
        }

        let message = '📋 *All orders*\n\n';

        // Show last 10 orders
        const recentOrders = orders.slice(-10).reverse();

        recentOrders.forEach(order => {
            const statusEmoji = {
                'pending': '⏳',
                'confirmed': '✅',
                'in_progress': '🔄',
                'completed': '✅',
                'cancelled': '❌'
            };

            message += `${statusEmoji[order.status] || '❓'} #${order.id}\n`;
            message += `👤 ${order.customerName}\n`;
            message += `📦 ${order.productName || order.description.substring(0, 50)}\n`;
            message += `💰 ${BotUtils.formatPrice(order.price || 0)}\n`;
            message += `📅 ${BotUtils.formatDate(order.createdAt)}\n\n`;
        });

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }

    showAdminUsers(chatId) {
        if (users.size === 0) {
            bot.sendMessage(chatId, '👥 No users yet');
            return;
        }

        let message = '👥 *Users*\n\n';

        Array.from(users.values()).slice(-10).reverse().forEach(user => {
            message += `👤 ${user.name}`;
            if (user.username) message += ` (@${user.username})`;
            message += '\n';
            message += `📅 Последняя активность: ${BotUtils.formatDate(user.lastActivity)}\n`;
            message += `🛒 Заказов: ${user.orders?.length || 0}\n\n`;
        });

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }

    showAdminStats(chatId) {
        const stats = BotUtils.calculateStats(orders, users);

        const message = `
📈 *Detailed statistics*

💰 *Finance:*
• Total revenue: ${BotUtils.formatPrice(stats.revenue)}
• Today's revenue: ${BotUtils.formatPrice(stats.todayRevenue)}
• Average check: ${BotUtils.formatPrice(stats.totalOrders > 0 ? stats.revenue / stats.totalOrders : 0)}

📦 *Orders:*
• Total orders: ${stats.totalOrders}
• Today's orders: ${stats.todayOrders}
• Pending: ${stats.pendingOrders}
• Completed: ${stats.completedOrders}

👥 *Users:*
• Total users: ${stats.totalUsers}
• Active today: ${Array.from(users.values()).filter(u => u.lastActivity.toDateString() === new Date().toDateString()).length}

⏰ *Working time:*
• Current time: ${BotUtils.formatDate(new Date())}
• Working hours: ${BotUtils.isWorkingHours() ? '✅ Yes' : '❌ No'}
        `;

        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    }
}

// Configuration check before startup
if (!config.bot.token) {
    console.error('❌ Error: TELEGRAM_BOT_TOKEN not specified in environment variables');
    console.log('📝 Create .env file based on example.env and specify bot token');
    process.exit(1);
}

// Bot startup
console.log(`🤖 ${config.company.name} - bot started...`);
console.log(`📊 Admin ID: ${config.bot.adminId || 'not specified'}`);
console.log(`📦 Products in catalog: ${config.products.length}`);
console.log(`❓ FAQ questions: ${config.faq.length}`);

const businessBot = new BusinessBot();
businessBot.adminFunctions();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Bot stopped');
    BotUtils.log('bot_shutdown', { reason: 'SIGINT' });
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Bot stopped');
    BotUtils.log('bot_shutdown', { reason: 'SIGTERM' });
    process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('💥 Unhandled error:', error);
    BotUtils.log('uncaught_exception', { error: error.message, stack: error.stack });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled promise rejection:', reason);
    BotUtils.log('unhandled_rejection', { reason: reason.toString() });
});
