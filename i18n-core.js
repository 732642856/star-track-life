/**
 * 星轨人生 Pro - 国际化核心模块
 * i18n Core Module for Star Track Life Pro
 * 
 * 支持语言：简体中文 (zh) | 繁體中文 (zh-TW) | English (en)
 */

// ==================== 语言管理器 ====================

const I18nCore = {
    // 当前语言
    currentLang: 'zh',
    
    // 支持的语言列表
    supportedLangs: ['zh', 'zh-TW', 'en'],
    
    // 语言显示名称
    langNames: {
        'zh': '简体中文',
        'zh-TW': '繁體中文',
        'en': 'English'
    },
    
    // 语言切换按钮文案
    langSwitchLabels: {
        'zh': { zh: '简体', 'zh-TW': '繁體', en: 'EN' },
        'zh-TW': { zh: '简体', 'zh-TW': '繁體', en: 'EN' },
        'en': { zh: 'CN', 'zh-TW': 'TW', en: 'EN' }
    },

    /**
     * 初始化语言设置
     * 优先级：localStorage > 浏览器语言 > 默认中文
     */
    init() {
        // 1. 尝试从 localStorage 读取
        const savedLang = localStorage.getItem('startrack-lang');
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            this.currentLang = savedLang;
            console.log(`[i18n] 从存储加载语言: ${savedLang}`);
            return;
        }
        
        // 2. 检测浏览器语言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) {
                this.currentLang = 'zh-TW';
            } else if (browserLang.startsWith('zh')) {
                this.currentLang = 'zh';
            } else if (browserLang.startsWith('en')) {
                this.currentLang = 'en';
            }
            console.log(`[i18n] 检测到浏览器语言: ${browserLang} → ${this.currentLang}`);
        }
        
        // 3. 保存到 localStorage
        localStorage.setItem('startrack-lang', this.currentLang);
    },

    /**
     * 切换语言
     * @param {string} lang - 目标语言 'zh' | 'zh-TW' | 'en'
     */
    setLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) {
            console.error(`[i18n] 不支持的语言: ${lang}`);
            return false;
        }
        
        this.currentLang = lang;
        localStorage.setItem('startrack-lang', lang);
        console.log(`[i18n] 语言切换为: ${lang}`);
        
        // 触发语言变更事件
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang } 
        }));
        
        return true;
    },

    /**
     * 获取当前语言
     * @returns {string}
     */
    getLanguage() {
        return this.currentLang;
    },

    /**
     * 获取 UI 文案
     * @param {string} key - 文案键名，支持点号分隔的路径 如 'appName' 或 'langSwitch.zh'
     * @param {string} lang - 语言（可选，默认当前语言）
     * @returns {string}
     */
    t(key, lang = null) {
        const targetLang = lang || this.currentLang;
        
        // 确保 UI_TEXT 已加载
        if (typeof UI_TEXT === 'undefined') {
            console.warn('[i18n] UI_TEXT 未加载');
            return key;
        }
        
        const langData = UI_TEXT[targetLang];
        if (!langData) {
            console.warn(`[i18n] 未找到语言数据: ${targetLang}`);
            return key;
        }
        
        // 支持点号路径 'langSwitch.zh'
        const keys = key.split('.');
        let value = langData;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // 找不到时回退到简体中文
                if (targetLang !== 'zh') {
                    return this.t(key, 'zh');
                }
                return key;
            }
        }
        
        // 如果是函数（如 toastAttrsPartial），返回原函数
        if (typeof value === 'function') {
            return value;
        }
        
        return value;
    },

    /**
     * 获取星曜名称（多语言）
     * @param {string} starName - 星曜中文名
     * @param {string} lang - 语言（可选）
     * @returns {string}
     */
    getStarName(starName, lang = null) {
        const targetLang = lang || this.currentLang;
        
        // 繁体中文：转换简繁体
        if (targetLang === 'zh-TW') {
            return this.toTraditional(starName);
        }
        
        // 英文：从星曜映射表获取
        if (targetLang === 'en') {
            // 优先从 STAR_NAMES_I18N 获取
            if (typeof STAR_NAMES_I18N !== 'undefined' && STAR_NAMES_I18N[starName]) {
                return STAR_NAMES_I18N[starName];
            }
            
            // 回退到音译
            return this.pinyinTransliterate(starName);
        }
        
        // 简体中文：原样返回
        return starName;
    },

    /**
     * 获取宫位名称（多语言）
     * @param {string} palaceName - 宫位名称
     * @param {string} lang - 语言（可选）
     * @returns {string}
     */
    getPalaceName(palaceName, lang = null) {
        const targetLang = lang || this.currentLang;
        
        // 英文映射
        if (targetLang === 'en') {
            const palaceMap = {
                '命宫': 'Life Palace',
                '兄弟宫': 'Siblings Palace',
                '夫妻宫': 'Spouse Palace',
                '子女宫': 'Children Palace',
                '财帛宫': 'Wealth Palace',
                '疾厄宫': 'Health Palace',
                '迁移宫': 'Travel Palace',
                '交友宫': 'Friends Palace',
                '官禄宫': 'Career Palace',
                '田宅宫': 'Property Palace',
                '福德宫': 'Fortune Palace',
                '父母宫': 'Parents Palace'
            };
            return palaceMap[palaceName] || palaceName;
        }
        
        // 繁体转换
        if (targetLang === 'zh-TW') {
            return this.toTraditional(palaceName);
        }
        
        return palaceName;
    },

    /**
     * 简体转繁体（基础映射）
     * @param {string} text - 简体中文
     * @returns {string}
     */
    toTraditional(text) {
        const s2tMap = {
            '星轨人生': '星軌人生',
            '艺术创作者的人物塑造工具': '藝術創作者的人物塑造工具',
            '命宫': '命宮', '兄弟宫': '兄弟宮', '夫妻宫': '夫妻宮',
            '子女宫': '子女宮', '财帛宫': '財帛宮', '疾厄宫': '疾厄宮',
            '迁移宫': '遷移宮', '交友宫': '交友宮', '官禄宫': '官祿宮',
            '田宅宫': '田宅宮', '福德宫': '福德宮', '父母宫': '父母宮',
            '紫微': '紫微', '天机': '天機', '太阳': '太陽', '武曲': '武曲',
            '天同': '天同', '廉贞': '廉貞', '天府': '天府', '太阴': '太陰',
            '贪狼': '貪狼', '巨门': '巨門', '天相': '天相', '天梁': '天梁',
            '七杀': '七殺', '破军': '破軍',
            '禄': '祿', '权': '權', '科': '科', '忌': '忌',
            '化禄': '化祿', '化权': '化權', '化科': '化科', '化忌': '化忌',
            '庙': '廟', '旺': '旺', '利': '利', '平': '平', '陷': '陷',
            '生成': '生成', '保存': '儲存', '导出': '匯出', '复制': '複製',
            '创建': '創建', '选择': '選擇', '确认': '確認', '取消': '取消',
            '重新开始': '重新開始', '下一步': '下一步', '返回': '返回',
            '古代': '古代', '近代': '近代', '现代': '現代',
            '性别': '性別', '年龄': '年齡', '职业': '職業', '家庭': '家庭',
            '男': '男', '女': '女', '青年': '青年', '中年': '中年', '老年': '老年',
            '时辰': '時辰', '子时': '子時', '丑时': '丑時', '寅时': '寅時',
            '卯时': '卯時', '辰时': '辰時', '巳时': '巳時', '午时': '午時',
            '未时': '未時', '申时': '申時', '酉时': '酉時', '戌时': '戌時', '亥时': '亥時',
            '角色': '角色', '小传': '小傳', '命盘': '命盤', '格局': '格局',
            '显示': '顯示', '隐藏': '隱藏', '展开': '展開', '收起': '收起'
        };
        
        let result = text;
        for (const [s, t] of Object.entries(s2tMap)) {
            result = result.replace(new RegExp(s, 'g'), t);
        }
        return result;
    },

    /**
     * 星曜音译（用于英文）
     * @param {string} starName - 星曜名
     * @returns {string}
     */
    pinyinTransliterate(starName) {
        const pinyinMap = {
            '紫微': 'Zi Wei', '天机': 'Tian Ji', '太阳': 'Tai Yang',
            '武曲': 'Wu Qu', '天同': 'Tian Tong', '廉贞': 'Lian Zhen',
            '天府': 'Tian Fu', '太阴': 'Tai Yin', '贪狼': 'Tan Lang',
            '巨门': 'Ju Men', '天相': 'Tian Xiang', '天梁': 'Tian Liang',
            '七杀': 'Seven Killings', '破军': 'Po Jun',
            '文昌': 'Wen Chang', '文曲': 'Wen Qu', '左辅': 'Zuo Fu',
            '右弼': 'You Bi', '天魁': 'Tian Kui', '天钺': 'Tian Yue',
            '禄存': 'Lu Cun', '擎羊': 'Qing Yang', '陀罗': 'Tuo Luo',
            '火星': 'Huo Xing', '铃星': 'Ling Xing', '地空': 'Di Kong',
            '地劫': 'Di Jie', '天空': 'Tian Kong', '截空': 'Jie Kong',
            '旬空': 'Xun Kong', '化禄': 'Hua Lu', '化权': 'Hua Quan',
            '化科': 'Hua Ke', '化忌': 'Hua Ji'
        };
        return pinyinMap[starName] || starName;
    },

    /**
     * 更新页面语言按钮状态
     */
    updateLangButtons() {
        const buttons = document.querySelectorAll('.lang-btn');
        buttons.forEach(btn => {
            const lang = btn.dataset.lang;
            if (lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    },

    /**
     * 更新整个页面的文案
     */
    updatePageText() {
        // 更新标题
        document.title = this.t('appName') + ' - ' + this.t('appSlogan');
        
        // 更新所有 data-i18n 元素
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const text = this.t(key);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });
        
        // 更新所有 data-i18n-html 元素（含 HTML）
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.dataset.i18nHtml;
            el.innerHTML = this.t(key);
        });
        
        // 更新 HTML lang 属性
        document.documentElement.lang = this.currentLang === 'zh-TW' ? 'zh-TW' : 
                                         this.currentLang === 'en' ? 'en' : 'zh-CN';
        
        console.log(`[i18n] 页面文案已更新为: ${this.currentLang}`);
    }
};

// ==================== 辅助函数 ====================

/**
 * 快捷翻译函数
 * @param {string} key - 文案键名
 * @returns {string}
 */
function t(key) {
    return I18nCore.t(key);
}

/**
 * 获取星曜名称（快捷方式）
 * @param {string} starName - 星曜中文名
 * @returns {string}
 */
function tStar(starName) {
    return I18nCore.getStarName(starName);
}

/**
 * 获取宫位名称（快捷方式）
 * @param {string} palaceName - 宫位名
 * @returns {string}
 */
function tPalace(palaceName) {
    return I18nCore.getPalaceName(palaceName);
}

// ==================== 星曜英文名称映射 ====================

const STAR_NAMES_I18N = {
    // 14 主星
    '紫微': 'Zi Wei (Emperor)',
    '天机': 'Tian Ji (Strategist)',
    '太阳': 'Tai Yang (Sun)',
    '武曲': 'Wu Qu (Finance)',
    '天同': 'Tian Tong (Fortune)',
    '廉贞': 'Lian Zhen (Passion)',
    '天府': 'Tian Fu (Treasury)',
    '太阴': 'Tai Yin (Moon)',
    '贪狼': 'Tan Lang (Ambition)',
    '巨门': 'Ju Men (Gatekeeper)',
    '天相': 'Tian Xiang (Minister)',
    '天梁': 'Tian Liang (Shelter)',
    '七杀': 'Seven Killings',
    '破军': 'Po Jun (Breaker)',
    
    // 六吉星
    '文昌': 'Wen Chang (Arts)',
    '文曲': 'Wen Qu (Literature)',
    '左辅': 'Zuo Fu (Assistant)',
    '右弼': 'You Bi (Supporter)',
    '天魁': 'Tian Kui (Noble)',
    '天钺': 'Tian Yue (Elegant)',
    
    // 六煞星
    '擎羊': 'Qing Yang (Sword)',
    '陀罗': 'Tuo Luo (Spin)',
    '火星': 'Huo Xing (Fire)',
    '铃星': 'Ling Xing (Bell)',
    '地空': 'Di Kong (Void)',
    '地劫': 'Di Jie (Loss)',
    
    // 四化
    '化禄': 'Hua Lu (Wealth)',
    '化权': 'Hua Quan (Power)',
    '化科': 'Hua Ke (Fame)',
    '化忌': 'Hua Ji (Obsession)',
    
    // 其他常用星
    '禄存': 'Lu Cun (Stored Wealth)',
    '天马': 'Tian Ma (Horse)',
    '红鸾': 'Hong Luan (Romance)',
    '天喜': 'Tian Xi (Joy)',
    '天官': 'Tian Guan (Official)',
    '天福': 'Tian Fu (Blessing)',
    '天空': 'Tian Kong (Sky)',
    '截空': 'Jie Kong (Cut Void)',
    '旬空': 'Xun Kong (Period Void)'
};

// ==================== 宫位英文名称映射 ====================

const PALACE_NAMES_I18N = {
    '命宫': 'Life Palace',
    '兄弟宫': 'Siblings Palace',
    '夫妻宫': 'Spouse Palace',
    '子女宫': 'Children Palace',
    '财帛宫': 'Wealth Palace',
    '疾厄宫': 'Health Palace',
    '迁移宫': 'Travel Palace',
    '交友宫': 'Friends Palace',
    '官禄宫': 'Career Palace',
    '田宅宫': 'Property Palace',
    '福德宫': 'Fortune Palace',
    '父母宫': 'Parents Palace'
};

// ==================== 初始化 ====================

// 页面加载完成后自动初始化
if (typeof window !== 'undefined') {
    // DOM 加载完成后初始化
    document.addEventListener('DOMContentLoaded', () => {
        I18nCore.init();
        console.log('[i18n] 核心模块已初始化，当前语言:', I18nCore.getLanguage());
    });
}

// 导出（供模块化使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18nCore, t, tStar, tPalace, STAR_NAMES_I18N, PALACE_NAMES_I18N };
}

// ==================== 全局语言切换函数 ====================

/**
 * 切换语言（按钮 onclick 调用）
 * @param {string} lang - 目标语言 'zh' | 'zh-TW' | 'en'
 */
function switchLanguage(lang) {
    console.log('[i18n] 切换语言请求:', lang);
    
    if (!I18nCore.setLanguage(lang)) {
        console.error('[i18n] 语言切换失败');
        return;
    }
    
    // 更新按钮状态
    I18nCore.updateLangButtons();
    
    // 更新页面文案
    I18nCore.updatePageText();
    
    // 显示切换提示
    showLangToast(lang);
    
    console.log('[i18n] 语言已切换为:', lang);
}

/**
 * 显示语言切换提示
 * @param {string} lang - 语言代码
 */
function showLangToast(lang) {
    const messages = {
        'zh': '已切换为简体中文',
        'zh-TW': '已切換為繁體中文',
        'en': 'Switched to English'
    };
    
    // 移除旧的 toast
    const oldToast = document.querySelector('.lang-toast');
    if (oldToast) {
        oldToast.remove();
    }
    
    // 创建新的 toast
    const toast = document.createElement('div');
    toast.className = 'lang-toast';
    toast.textContent = messages[lang] || messages.zh;
    document.body.appendChild(toast);
    
    // 显示动画
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// ==================== 页面加载初始化 ====================

// 确保 DOM 加载后初始化并更新页面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化语言
    I18nCore.init();
    
    // 更新按钮状态
    I18nCore.updateLangButtons();
    
    // 更新页面文案
    I18nCore.updatePageText();
    
    console.log('[i18n] 页面初始化完成，语言:', I18nCore.getLanguage());
});
