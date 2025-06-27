// 统一导航栏组件
class UnifiedNavbar {
    constructor(currentPage = '') {
        this.currentPage = currentPage;
        this.navItems = [
            { id: 'home', name: '首页', icon: 'fas fa-home', href: 'index.html' },
            { id: 'workspace', name: '工作台', icon: 'fas fa-magic', href: 'workspace.html' },
            { id: 'tasks', name: '任务', icon: 'fas fa-tasks', href: 'tasks.html' },
            { id: 'billing', name: '账单', icon: 'fas fa-receipt', href: 'billing.html' },
            { id: 'profile', name: '我的', icon: 'fas fa-user', href: 'profile.html' },
            { id: 'pricing', name: '定价', icon: 'fas fa-credit-card', href: 'pricing.html' },
            { id: 'developer', name: '开发', icon: 'fas fa-code', href: 'developer.html' }
        ];
    }

    // 生成导航栏HTML
    generateNavbarHTML() {
        return `
            <!-- 统一导航栏 -->
            <nav class="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <!-- 左侧：品牌和主导航 -->
                        <div class="flex items-center space-x-8">
                            <a href="index.html" class="text-xl font-bold text-white flex items-center">
                                <i class="fas fa-magic mr-2 text-blue-400"></i>一键出片
                                <span class="mvp-badge ml-3">MVP</span>
                            </a>
                            <div class="hidden lg:flex space-x-4">
                                ${this.generateNavItems()}
                            </div>
                        </div>
                        
                        <!-- 右侧：用户信息和操作 -->
                        <div class="flex items-center space-x-3">
                            <!-- 余额显示 -->
                            <div class="hidden sm:flex text-yellow-400 font-medium text-sm">
                                <i class="fas fa-coins mr-1"></i><span id="userBalance">1,580</span>黄豆
                            </div>
                            
                            <!-- 用户信息简化显示 -->
                            <div class="flex items-center space-x-2">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" 
                                     alt="头像" class="w-8 h-8 rounded-full ring-2 ring-blue-400/30">
                                <span class="hidden md:block text-white font-medium">张创作者</span>
                            </div>
                            
                            <!-- 移动端菜单按钮 -->
                            <button class="lg:hidden text-white hover:text-blue-400 p-2" onclick="toggleMobileMenu()">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- 移动端菜单 -->
                    <div id="mobileMenu" class="lg:hidden hidden border-t border-slate-700 py-3">
                        <div class="space-y-1">
                            ${this.generateMobileNavItems()}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    // 生成桌面端导航项
    generateNavItems() {
        return this.navItems.map(item => {
            const isActive = this.currentPage === item.id;
            const activeClass = isActive ? 'text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-blue-400';
            
            return `
                <a href="${item.href}" class="${activeClass} px-3 py-2 text-sm font-medium transition-colors">
                    <i class="${item.icon} mr-1"></i>${item.name}
                </a>
            `;
        }).join('');
    }

    // 生成移动端导航项
    generateMobileNavItems() {
        return this.navItems.map(item => {
            const isActive = this.currentPage === item.id;
            const activeClass = isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white';
            
            return `
                <a href="${item.href}" class="${activeClass} block px-4 py-2 text-sm font-medium rounded-lg transition-colors">
                    <i class="${item.icon} mr-2"></i>${item.name}
                </a>
            `;
        }).join('');
    }

    // 渲染导航栏到指定容器
    render(containerId = 'navbar-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateNavbarHTML();
        } else {
            // 如果没有指定容器，直接插入到body开头
            document.body.insertAdjacentHTML('afterbegin', this.generateNavbarHTML());
        }
    }

    // 更新当前页面
    setCurrentPage(pageId) {
        this.currentPage = pageId;
        this.render();
    }
}

// 移动端菜单切换
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// 全局导航实例
window.unifiedNavbar = new UnifiedNavbar();

// CSS样式补充
const navbarStyles = `
<style>
.mvp-badge {
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
}

/* 导航栏响应式 */
@media (max-width: 768px) {
    .navbar-desktop {
        display: none;
    }
}

/* 活跃状态动画 */
nav a {
    position: relative;
    transition: all 0.3s ease;
}

nav a:hover {
    transform: translateY(-1px);
}

/* Sticky导航栏效果 */
nav.sticky {
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
`;

// 自动添加样式
if (!document.querySelector('#navbar-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'navbar-styles';
    styleElement.innerHTML = navbarStyles;
    document.head.appendChild(styleElement);
} 