// 极简导航栏组件 - UI优化版
class SimplifiedNavbar {
    constructor(currentPage = '') {
        this.currentPage = currentPage;
        // 精简到4个核心页面
        this.navItems = [
            { id: 'home', name: '首页', icon: 'fas fa-home', href: 'index.html' },
            { id: 'workspace', name: '工作台', icon: 'fas fa-magic', href: 'workspace.html' },
            { id: 'tasks', name: '任务', icon: 'fas fa-tasks', href: 'tasks.html' },
            { id: 'profile', name: '我的', icon: 'fas fa-user', href: 'profile.html' }
        ];
        
        // 次要功能收纳到用户菜单
        this.userMenuItems = [
            { id: 'billing', name: '消费记录', icon: 'fas fa-receipt', href: 'billing.html' },
            { id: 'pricing', name: '套餐定价', icon: 'fas fa-credit-card', href: 'pricing.html' },
            { id: 'developer', name: '开发者', icon: 'fas fa-code', href: 'developer.html' }
        ];
    }

    generateNavbarHTML() {
        return `
            <!-- 极简导航栏 -->
            <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
                <div class="max-w-6xl mx-auto px-4">
                    <div class="flex justify-between items-center h-14">
                        <!-- 品牌区域 -->
                        <div class="flex items-center space-x-6">
                            <a href="index.html" class="flex items-center text-white font-bold">
                                <i class="fas fa-magic mr-2 text-blue-400"></i>
                                <span class="text-lg">一键出片</span>
                                <span class="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">MVP</span>
                            </a>
                            
                            <!-- 桌面端主导航 -->
                            <div class="hidden md:flex space-x-1">
                                ${this.generateMainNavItems()}
                            </div>
                        </div>
                        
                        <!-- 用户区域 -->
                        <div class="flex items-center space-x-3">
                            <!-- 余额 -->
                            <div class="hidden sm:flex items-center text-yellow-400 text-sm">
                                <i class="fas fa-coins mr-1"></i>
                                <span id="userBalance">1,580</span>
                            </div>
                            
                            <!-- 用户菜单 -->
                            <div class="relative">
                                <button onclick="toggleUserMenu()" class="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-800">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                                         alt="头像" class="w-8 h-8 rounded-full">
                                    <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
                                </button>
                                
                                <!-- 用户下拉菜单 -->
                                <div id="userMenu" class="hidden absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
                                    <div class="p-3 border-b border-slate-700">
                                        <div class="text-white font-medium">张创作者</div>
                                        <div class="text-yellow-400 text-sm">余额: 1,580黄豆</div>
                                    </div>
                                    ${this.generateUserMenuItems()}
                                </div>
                            </div>
                            
                            <!-- 移动端菜单按钮 -->
                            <button class="md:hidden text-white p-2" onclick="toggleMobileMenu()">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 移动端导航 -->
                    <div id="mobileMenu" class="md:hidden hidden border-t border-slate-800 py-2">
                        ${this.generateMobileNavItems()}
                    </div>
                </div>
            </nav>
        `;
    }

    generateMainNavItems() {
        return this.navItems.map(item => {
            const isActive = this.currentPage === item.id;
            const activeClass = isActive ? 'bg-slate-800 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-800';
            
            return `
                <a href="${item.href}" class="${activeClass} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
                    <i class="${item.icon} mr-1.5"></i>${item.name}
                </a>
            `;
        }).join('');
    }

    generateUserMenuItems() {
        return this.userMenuItems.map(item => `
            <a href="${item.href}" class="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors">
                <i class="${item.icon} mr-3 w-4"></i>${item.name}
            </a>
        `).join('');
    }

    generateMobileNavItems() {
        const allItems = [...this.navItems, ...this.userMenuItems];
        return `
            <div class="grid grid-cols-2 gap-2 p-2">
                ${allItems.map(item => {
                    const isActive = this.currentPage === item.id;
                    const activeClass = isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-300 hover:text-white';
                    
                    return `
                        <a href="${item.href}" class="${activeClass} flex items-center justify-center p-3 rounded-lg transition-colors">
                            <i class="${item.icon} mr-2"></i>
                            <span class="text-sm">${item.name}</span>
                        </a>
                    `;
                }).join('')}
            </div>
        `;
    }

    render(containerId = 'navbar-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateNavbarHTML();
        }
    }
}

// 菜单切换函数
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('hidden');
    
    // 点击外部关闭菜单
    document.addEventListener('click', function closeMenu(e) {
        if (!e.target.closest('#userMenu') && !e.target.closest('button[onclick="toggleUserMenu()"]')) {
            menu.classList.add('hidden');
            document.removeEventListener('click', closeMenu);
        }
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// 全局简化导航实例
window.simplifiedNavbar = new SimplifiedNavbar();

// 极简样式
const simplifiedStyles = `
<style>
/* 极简导航样式 */
nav {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 移动端底部导航栏概念 */
@media (max-width: 768px) {
    .mobile-bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(10px);
        border-top: 1px solid #334155;
        z-index: 50;
    }
}

/* 简化动画 */
.transition-all {
    transition: all 0.2s ease;
}

/* 用户菜单动画 */
#userMenu {
    transform-origin: top right;
    animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
`;

// 添加样式
if (!document.querySelector('#simplified-navbar-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'simplified-navbar-styles';
    styleElement.innerHTML = simplifiedStyles;
    document.head.appendChild(styleElement);
} 