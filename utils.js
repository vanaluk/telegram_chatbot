// Utility functions for business bot

class BotUtils {
    // Price formatting
    static formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    }

    // Date formatting
    static formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    // Email validation
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Phone validation
    static isValidPhone(phone) {
        const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return phoneRegex.test(phone);
    }

    // Generate unique ID
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Statistics calculation
    static calculateStats(orders, users) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const todayOrders = orders.filter(order =>
            new Date(order.createdAt) >= today
        );

        const pendingOrders = orders.filter(order =>
            order.status === 'pending'
        );

        const completedOrders = orders.filter(order =>
            order.status === 'completed'
        );

        return {
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            pendingOrders: pendingOrders.length,
            completedOrders: completedOrders.length,
            totalUsers: users.size,
            revenue: orders.reduce((sum, order) => sum + (order.price || 0), 0),
            todayRevenue: todayOrders.reduce((sum, order) => sum + (order.price || 0), 0)
        };
    }

    // Create keyboard for products
    static createProductKeyboard(products, callbackPrefix = 'product_') {
        return products.map(product => [{
            text: `${product.name} - ${this.formatPrice(product.price)}`,
            callback_data: `${callbackPrefix}${product.id}`
        }]);
    }

    // Create main menu
    static createMainMenuKeyboard() {
        return {
            inline_keyboard: [
                [
                    { text: '🛍️ Каталог товаров', callback_data: 'catalog' },
                    { text: '📝 Сделать заказ', callback_data: 'order' }
                ],
                [
                    { text: 'ℹ️ О компании', callback_data: 'about' },
                    { text: '❓ FAQ', callback_data: 'faq' }
                ],
                [
                    { text: '📞 Контакты', callback_data: 'contacts' },
                    { text: '🆘 Поддержка', callback_data: 'support' }
                ]
            ]
        };
    }

    // Send notification to administrator
    static async sendAdminNotification(bot, adminId, message, type = 'info') {
        if (!adminId) return;

        const emoji = {
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌',
            success: '✅'
        };

        const formattedMessage = `
${emoji[type] || '📢'} *Уведомление*

${message}

⏰ ${this.formatDate(new Date())}
        `;

        try {
            await bot.sendMessage(adminId, formattedMessage, {
                parse_mode: 'Markdown',
                disable_notification: type === 'info'
            });
        } catch (error) {
            console.error('Error sending notification to admin:', error);
        }
    }

    // Action logging
    static log(action, data = {}) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            action,
            ...data
        };

        console.log(`[${timestamp}] ${action}:`, JSON.stringify(data, null, 2));

        // In production, save logs to file or database
        return logEntry;
    }

    // Check working hours
    static isWorkingHours() {
        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay(); // 0 - Sunday, 6 - Saturday

        // Working days: Monday (1) - Friday (5), time: 9:00 - 18:00
        return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
    }

    // Response time formatting
    static getResponseTimeMessage() {
        const isWorking = this.isWorkingHours();

        if (isWorking) {
            return 'We will respond within 2 hours';
        } else {
            return 'We will respond within 24 hours after the start of the working day';
        }
    }
}

module.exports = BotUtils;
