# 🚀 Business Bot Deployment

## 📍 Current Situation
The bot currently works only on your local computer and will be active while:
- Computer is turned on
- Node.js process is running
- Internet connection is stable

## 🖥️ Option 1: VPS Server (Recommended)

### Popular VPS Providers:
- **DigitalOcean** - from $6/month
- **Hetzner** - from €3/month
- **Linode** - from $5/month
- **Vultr** - from $2.50/month

### Настройка VPS:

```bash
# 1. Connect to server via SSH
ssh root@your-server-ip

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Git
sudo apt-get install git

# 4. Clone project
git clone https://github.com/your-username/business-chatbot.git
cd business-chatbot

# 5. Install dependencies
npm install

# 6. Configure environment variables
cp example.env .env
nano .env  # Edit settings

# 7. Run with PM2 (auto-start)
npm install -g pm2
pm2 start bot.js --name "business-bot"
pm2 startup
pm2 save

# 8. Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

## ☁️ Option 2: Cloud Platforms

### Heroku (free tier available):
```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Create application
heroku create your-bot-name

# 3. Configure environment variables
heroku config:set TELEGRAM_BOT_TOKEN=your_token_here
heroku config:set ADMIN_CHAT_ID=your_chat_id_here
heroku config:set NODE_ENV=production

# 4. Deploy
git push heroku main
```

### Railway (simple deployment):
1. Register at railway.app
2. Connect GitHub repository
3. Configure environment variables
4. Deploy with one click

### Render:
1. Register at render.com
2. Create Web Service
3. Connect repository
4. Configure environment variables

## 🔧 Production Configuration

### 1. Change polling to webhooks in bot.js:
```javascript
const bot = new TelegramBot(config.bot.token, {
    webHook: true,
    webHook: {
        port: process.env.PORT || 443,
        key: '/path/to/private-key.pem',    // For HTTPS
        cert: '/path/to/public-cert.pem'    // For HTTPS
    }
});
```

### 2. Configure webhook URL:
```bash
curl -F "url=https://your-domain.com/bot" \
     "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook"
```

### 3. Use database:
```javascript
// Replace arrays with MongoDB/PostgreSQL
const mongoose = require('mongoose');
// Connection to MongoDB Atlas or local DB
```

## 📊 Monitoring and Support

### PM2 commands:
```bash
pm2 list                    # Process list
pm2 restart business-bot    # Restart
pm2 stop business-bot       # Stop
pm2 logs business-bot       # View logs
pm2 monit                   # Real-time monitoring
```

### Status check:
```bash
curl https://api.telegram.org/bot<YOUR_TOKEN>/getMe
```

## 💰 Cost:

- **VPS (minimum)**: $3-6/month
- **Heroku (hobby)**: $7/month (or free with limitations)
- **Railway**: $5/month (free first 512MB)
- **Render**: $7/month

## 🔒 Security:

1. **Don't store tokens in code** - use environment variables
2. **Configure firewall** - open only necessary ports
3. **Use HTTPS** - for webhook
4. **Regularly update** dependencies
5. **Monitor logs** for suspicious activity

## 🚨 Backup:

```bash
# Automatic data backup
crontab -e
# Add: 0 2 * * * pg_dump database > backup.sql
```

## 📞 24/7 Support:

Choose deployment option based on:
- Budget
- Technical skills
- Performance requirements
- Number of users

Recommendation: **start with VPS** for full control or **Railway** for quick start.
