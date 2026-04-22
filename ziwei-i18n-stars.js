/**
 * 星轨人生 - 简化版星曜国际化
 */

// 当前语言
var CURRENT_LANG = localStorage.getItem('star_track_lang') || 'zh';

// 主星三语言映射
var MAIN_STARS_I18N = {
    '紫微': { 'zh': '紫微', 'zh-TW': '紫微', 'en': 'Zi Wei' },
    '天机': { 'zh': '天机', 'zh-TW': '天機', 'en': 'Tian Ji' },
    '太阳': { 'zh': '太阳', 'zh-TW': '太陽', 'en': 'Tai Yang' },
    '武曲': { 'zh': '武曲', 'zh-TW': '武曲', 'en': 'Wu Qu' },
    '天同': { 'zh': '天同', 'zh-TW': '天同', 'en': 'Tian Tong' },
    '廉贞': { 'zh': '廉贞', 'zh-TW': '廉貞', 'en': 'Lian Zhen' },
    '天府': { 'zh': '天府', 'zh-TW': '天府', 'en': 'Tian Fu' },
    '太阴': { 'zh': '太阴', 'zh-TW': '太陰', 'en': 'Tai Yin' },
    '贪狼': { 'zh': '贪狼', 'zh-TW': '貪狼', 'en': 'Tan Lang' },
    '巨门': { 'zh': '巨门', 'zh-TW': '巨門', 'en': 'Ju Men' },
    '天相': { 'zh': '天相', 'zh-TW': '天相', 'en': 'Tian Xiang' },
    '天梁': { 'zh': '天梁', 'zh-TW': '天梁', 'en': 'Tian Liang' },
    '七杀': { 'zh': '七杀', 'zh-TW': '七殺', 'en': 'Qi Sha' },
    '破军': { 'zh': '破军', 'zh-TW': '破軍', 'en': 'Po Jun' }
};

// 宫位三语言映射
var PALACES_I18N = {
    '命宫': { 'zh': '命宫', 'zh-TW': '命宮', 'en': 'Life Palace' },
    '兄弟宫': { 'zh': '兄弟宫', 'zh-TW': '兄弟宮', 'en': 'Siblings Palace' },
    '夫妻宫': { 'zh': '夫妻宫', 'zh-TW': '夫妻宮', 'en': 'Spouse Palace' },
    '子女宫': { 'zh': '子女宫', 'zh-TW': '子女宮', 'en': 'Children Palace' },
    '财帛宫': { 'zh': '财帛宫', 'zh-TW': '財帛宮', 'en': 'Wealth Palace' },
    '疾厄宫': { 'zh': '疾厄宫', 'zh-TW': '疾厄宮', 'en': 'Health Palace' },
    '迁移宫': { 'zh': '迁移宫', 'zh-TW': '遷移宮', 'en': 'Travel Palace' },
    '奴仆宫': { 'zh': '奴仆宫', 'zh-TW': '奴僕宮', 'en': 'Servants Palace' },
    '官禄宫': { 'zh': '官禄宫', 'zh-TW': '官祿宮', 'en': 'Career Palace' },
    '田宅宫': { 'zh': '田宅宫', 'zh-TW': '田宅宮', 'en': 'Property Palace' },
    '福德宫': { 'zh': '福德宫', 'zh-TW': '福德宮', 'en': 'Fortune Palace' },
    '父母宫': { 'zh': '父母宫', 'zh-TW': '父母宮', 'en': 'Parents Palace' }
};

// 四化三语言映射
var SIHUA_I18N = {
    '化禄': { 'zh': '化禄', 'zh-TW': '化祿', 'en': 'Lu (Prosperity)' },
    '化权': { 'zh': '化权', 'zh-TW': '化權', 'en': 'Quan (Authority)' },
    '化科': { 'zh': '化科', 'zh-TW': '化科', 'en': 'Ke (Wisdom)' },
    '化忌': { 'zh': '化忌', 'zh-TW': '化忌', 'en': 'Ji (Obstruction)' }
};

/**
 * 获取星曜名称的当前语言版本
 */
function getStarName(zhName) {
    if (MAIN_STARS_I18N[zhName]) {
        return MAIN_STARS_I18N[zhName][CURRENT_LANG] || zhName;
    }
    return zhName;
}

/**
 * 获取宫位名称的当前语言版本
 */
function getPalaceName(zhName) {
    if (PALACES_I18N[zhName]) {
        return PALACES_I18N[zhName][CURRENT_LANG] || zhName;
    }
    return zhName;
}

/**
 * 设置当前语言
 */
function setLanguage(lang) {
    CURRENT_LANG = lang;
    localStorage.setItem('star_track_lang', lang);
    // 触发语言变更事件
    window.dispatchEvent(new Event('langchange'));
}

// 导出
if (typeof window !== 'undefined') {
    window.CURRENT_LANG = CURRENT_LANG;
    window.MAIN_STARS_I18N = MAIN_STARS_I18N;
    window.PALACES_I18N = PALACES_I18N;
    window.SIHUA_I18N = SIHUA_I18N;
    window.getStarName = getStarName;
    window.getPalaceName = getPalaceName;
    window.setLanguage = setLanguage;
}
