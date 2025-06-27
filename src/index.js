// 一键出片 - MVP版本主入口文件
console.log('一键出片 MVP版本已加载');

// 导入CSS样式（如果有的话）
// import './styles/main.css';

// 全局配置
window.YIJIANCHU_CONFIG = {
    version: '1.0.0-mvp',
    apiBase: '/api',
    uploadLimit: 500 * 1024 * 1024, // 500MB
    supportedFormats: ['mp4', 'avi', 'mov', 'mkv'],
    freeTrialMinutes: 10
};

// 导出主要功能
export default {
    name: '一键出片',
    version: window.YIJIANCHU_CONFIG.version,
    init() {
        console.log('MVP版本初始化完成');
        return true;
    }
}; 