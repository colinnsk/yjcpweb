// 通知系统
class NotificationSystem {
    constructor() {
        this.createNotificationContainer();
        this.setupEventListeners();
    }

    createNotificationContainer() {
        // 创建通知容器
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }

    setupEventListeners() {
        // 监听通知事件
        document.addEventListener('notification', (event) => {
            this.show(event.detail.message, event.detail.type);
        });
    }

    show(message, type = 'info', duration = 4000) {
        const notification = this.createNotification(message, type);
        const container = document.getElementById('notification-container');
        
        container.appendChild(notification);

        // 添加显示动画
        setTimeout(() => {
            notification.classList.add('translate-x-0', 'opacity-100');
            notification.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        // 自动移除
        setTimeout(() => {
            this.remove(notification);
        }, duration);
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `
            transform transition-all duration-300 translate-x-full opacity-0
            max-w-sm w-full bg-white border border-gray-200 rounded-lg shadow-lg pointer-events-auto
            ${this.getTypeStyles(type)}
        `;

        const icon = this.getTypeIcon(type);
        const bgColor = this.getTypeBgColor(type);

        notification.innerHTML = `
            <div class="flex p-4">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 ${bgColor} rounded-full flex items-center justify-center">
                        <i class="${icon} text-white text-sm"></i>
                    </div>
                </div>
                <div class="ml-3 w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">
                        ${message}
                    </p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times text-sm"></i>
                    </button>
                </div>
            </div>
        `;

        return notification;
    }

    getTypeStyles(type) {
        switch (type) {
            case 'success':
                return 'border-green-200';
            case 'error':
                return 'border-red-200';
            case 'warning':
                return 'border-yellow-200';
            default:
                return 'border-blue-200';
        }
    }

    getTypeIcon(type) {
        switch (type) {
            case 'success':
                return 'fas fa-check';
            case 'error':
                return 'fas fa-exclamation-circle';
            case 'warning':
                return 'fas fa-exclamation-triangle';
            default:
                return 'fas fa-info-circle';
        }
    }

    getTypeBgColor(type) {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            default:
                return 'bg-blue-500';
        }
    }

    remove(notification) {
        notification.classList.add('translate-x-full', 'opacity-0');
        notification.classList.remove('translate-x-0', 'opacity-100');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// 初始化通知系统
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();
}); 