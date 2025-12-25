// Business bot configuration
require('dotenv').config();

module.exports = {
    // Bot settings
    bot: {
        token: process.env.TELEGRAM_BOT_TOKEN,
        adminId: process.env.ADMIN_CHAT_ID,
        polling: true
    },

    // Company information
    company: {
        name: process.env.COMPANY_NAME || 'Ваша Компания',
        address: process.env.COMPANY_ADDRESS || 'г. Москва, ул. Примерная, д. 1',
        phone: process.env.COMPANY_PHONE || '+7 (495) 123-45-67',
        email: process.env.COMPANY_EMAIL || 'info@company.com',
        website: process.env.COMPANY_WEBSITE || 'www.company.com',
        workingHours: 'Пн-Пт: 9:00 - 18:00'
    },

    // Product and services catalog
    products: [
        {
            id: 1,
            name: 'Бизнес-консультация',
            price: 5000,
            description: 'Комплексная оценка и оптимизация бизнес-процессов вашей компании. Включает анализ текущего состояния, выявление проблемных зон и разработку рекомендаций по улучшению.',
            category: 'Консультации',
            duration: '2-4 часа',
            available: true
        },
        {
            id: 2,
            name: 'Веб-разработка корпоративного сайта',
            price: 25000,
            description: 'Создание современного корпоративного сайта с адаптивным дизайном. Включает до 10 страниц, CMS систему управления контентом и базовую SEO оптимизацию.',
            category: 'Разработка',
            duration: '2-3 недели',
            available: true
        },
        {
            id: 3,
            name: 'Маркетинговая стратегия',
            price: 15000,
            description: 'Разработка комплексной маркетинговой стратегии для роста бизнеса. Анализ конкурентов, целевой аудитории, выбор каналов продвижения и бюджетное планирование.',
            category: 'Маркетинг',
            duration: '1-2 недели',
            available: true
        },
        {
            id: 4,
            name: 'Обучение персонала',
            price: 8000,
            description: 'Курс повышения квалификации для сотрудников вашей компании. Включает тренинги по эффективной коммуникации, управлению временем и командной работе.',
            category: 'Обучение',
            duration: '1 неделя',
            available: true
        },
        {
            id: 5,
            name: 'Аудит безопасности',
            price: 12000,
            description: 'Комплексный аудит информационной безопасности вашей компании. Проверка систем, выявление уязвимостей и разработка плана по их устранению.',
            category: 'Безопасность',
            duration: '3-5 дней',
            available: true
        },
        {
            id: 6,
            name: 'Юридическое сопровождение',
            price: 10000,
            description: 'Юридическая поддержка бизнеса. Консультации по корпоративному праву, сопровождение сделок, разработка договоров и защита интересов в спорах.',
            category: 'Юридические услуги',
            duration: 'По запросу',
            available: true
        },
        {
            id: 7,
            name: 'Финансовый анализ',
            price: 7000,
            description: 'Анализ финансового состояния компании. Оценка платежеспособности, рентабельности, анализ денежных потоков и разработка рекомендаций по оптимизации.',
            category: 'Финансы',
            duration: '1 неделя',
            available: true
        },
        {
            id: 8,
            name: 'CRM система',
            price: 35000,
            description: 'Внедрение системы управления отношениями с клиентами. Настройка под нужды вашей компании, интеграция с существующими системами, обучение персонала.',
            category: 'Автоматизация',
            duration: '3-4 недели',
            available: true
        }
    ],

    // FAQ settings
    faq: [
        {
            question: 'Как оформить заказ?',
            answer: 'Выберите интересующий товар в каталоге или опишите ваш запрос в разделе "Сделать заказ". Наши менеджеры свяжутся с вами для уточнения деталей.'
        },
        {
            question: 'Какие способы оплаты вы принимаете?',
            answer: 'Мы принимаем оплату банковским переводом, платежными картами (Visa, MasterCard, Мир) и наличными при личной встрече.'
        },
        {
            question: 'Как долго выполняются заказы?',
            answer: 'Сроки выполнения зависят от сложности проекта. Для консультаций - от 1 дня, для разработки - от 2 недель. Точные сроки оговариваются индивидуально.'
        },
        {
            question: 'Предоставляете ли вы гарантию на услуги?',
            answer: 'Да, мы предоставляем гарантию на все наши услуги. Срок гарантии зависит от типа услуги и оговаривается в договоре.'
        },
        {
            question: 'Можно ли получить консультацию бесплатно?',
            answer: 'Первичная консультация по телефону бесплатна. Для детального анализа и рекомендаций предусмотрены платные услуги.'
        },
        {
            question: 'Работаете ли вы с индивидуальными предпринимателями?',
            answer: 'Да, мы работаем как с юридическими лицами, так и с индивидуальными предпринимателями. Условия сотрудничества аналогичны.'
        }
    ],

    // Order status settings
    orderStatuses: {
        pending: 'Ожидает обработки',
        confirmed: 'Подтвержден',
        in_progress: 'В работе',
        completed: 'Завершен',
        cancelled: 'Отменен'
    },

    // Notification settings
    notifications: {
        newOrder: true,
        newSupportRequest: true,
        orderStatusChange: true,
        dailyStats: false // daily statistics
    },

    // Limits and restrictions
    limits: {
        maxOrdersPerDay: 50,
        maxSupportRequestsPerDay: 20,
        messageLengthLimit: 1000,
        fileSizeLimit: 10 * 1024 * 1024 // 10MB
    }
};
