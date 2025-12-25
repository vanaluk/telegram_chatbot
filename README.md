# 🤖 Business Telegram Bot

Modern chat bot for business process automation in Telegram. Designed for handling orders, consultations, and customer support.

## ✨ Features

### For clients:
- 🛍️ **Product catalog** - browse available products and services
- 📝 **Order placement** - simple ordering process for products/services
- ℹ️ **Company information** - detailed business information
- ❓ **FAQ** - frequently asked questions
- 📞 **Contacts** - all contact methods
- 🆘 **Support** - 24/7 technical assistance

### For administrators:
- 📊 **Statistics** - order and user analytics
- 📋 **Order management** - view and process orders
- 👥 **User management** - customer information
- 🚨 **Notifications** - automatic notifications about new inquiries

## 🚀 Quick Start

### 1. Creating a bot in Telegram

1. Open [@BotFather](https://t.me/botfather) in Telegram
2. Send the `/newbot` command
3. Follow the instructions to create the bot:
   - Enter a name for your bot (e.g., "My Business Bot")
   - Enter a username for your bot (must end with "bot", e.g., "mybusinessbot")
4. Save the received **bot token** (it looks like: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

**⚠️ IMPORTANT: Never share your bot token with anyone! It gives full access to your bot.**

### 2. Getting your Telegram Chat ID

1. Open [@userinfobot](https://t.me/userinfobot) in Telegram
2. Send the `/start` command
3. The bot will reply with your information including your **Telegram ID** (a number like `123456789`)
4. Save this **Chat ID** - it will be your `ADMIN_CHAT_ID`

**This ID allows you to access admin functions of the bot. Only use your own Chat ID here.**

### 3. Project setup

```bash
# Clone the repository
git clone <repository-url>
cd business-chatbot

# Install dependencies
npm install

# Copy configuration file
cp example.env .env

# Configure environment variables
nano .env  # or use any text editor
```

### 4. Environment Variables Configuration

Fill in the `.env` file with the values you obtained:

```env
# Your bot token from BotFather (step 1)
# Example: 123456789:AAFoobarBaz1234567890ABCDEFGHIJ
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here

# Your company information
COMPANY_NAME=Your Company Name
COMPANY_ADDRESS=123 Business St, City, Country
COMPANY_PHONE=+1 (555) 123-4567
COMPANY_EMAIL=info@yourcompany.com
COMPANY_WEBSITE=https://yourcompany.com

# Your Telegram ID from userinfobot (step 2)
# Example: 123456789
ADMIN_CHAT_ID=your_telegram_chat_id_here
```

### 5. Running the bot

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 6. Testing the bot

1. Find your bot in Telegram using the username you created (e.g., `@mybusinessbot`)
2. Send `/start` to begin
3. Try the main menu options:
   - 🛍️ **Catalog** - view available products/services
   - 📝 **Order** - test the ordering process
   - ❓ **FAQ** - check frequently asked questions
   - 🆘 **Support** - test support request
4. Send `/admin` to access admin panel (only works for your Chat ID)

### 7. Verification

To verify everything is working:

```bash
# Run the test suite
npm test

# Check bot status
npm run status  # if configured
```

**Expected output:**
- ✅ Bot configuration: OK
- ✅ Dependencies: OK
- ✅ Telegram connection: OK

**Congratulations! Your business bot is now running and ready to use.**

## 📁 Project Structure

```
business-chatbot/
├── bot.js              # Main bot file
├── package.json        # Dependencies and scripts
├── example.env         # Configuration file example
├── README.md          # Documentation
└── .env               # Settings (create manually)
```

## 🎛️ Bot Commands

### User commands:
- `/start` - Start bot and main menu

### Admin commands:
- `/admin` - Admin panel (admins only)

## 🔧 Product and Service Configuration

Edit the `products` array in the `config.js` file to add your products:

```javascript
this.products = [
    {
        id: 1,
        name: 'Service Name',
        price: 1000, // price in rubles
        description: 'Service description',
        category: 'Category'
    },
    // Add more products...
];
```

## 📊 Monitoring and Analytics

The bot keeps track of:
- Number of orders
- Active users
- Last visit time
- Support request statistics

## 🔒 Security

- Use a strong bot token
- Don't store sensitive data in code
- Regularly update dependencies
- Configure firewall for the server

## 🚀 Deployment

### On VPS server:
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <your-repo>
cd business-chatbot
npm install
cp example.env .env
# Configure .env file

# Run with PM2
npm install -g pm2
pm2 start bot.js --name "business-bot"
pm2 startup
pm2 save
```

### Using Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

## 📈 Feature Expansion

Possible improvements:
- 🗄️ **Database** - PostgreSQL/MongoDB for data storage
- 💳 **Payment integration** - connecting payment systems
- 📱 **Web interface** - admin panel in browser
- 📊 **Advanced analytics** - charts and reports
- 🤖 **AI assistant** - ChatGPT integration for smart responses
- 📧 **Email integration** - sending notifications to email
- 📅 **Calendar** - appointment scheduling

## 🐛 Troubleshooting

### Bot not responding:
1. Check bot token
2. Make sure bot is running
3. Check console logs

### Connection error:
1. Check internet connection
2. Ensure token correctness
3. Check firewall settings

## 📄 License

MIT License - free use and modification.

---

