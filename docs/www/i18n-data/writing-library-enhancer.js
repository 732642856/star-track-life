/**
 * writing-library-enhancer.js
 * ─────────────────────────────────────────────────────────────────────
 * 写作词库扩充器 - 基于词库分类扩展紫微斗数词库
 * 
 * 设计原则：
 * 1. 基于词库文件名的分类信息，扩展动态词库
 * 2. 为紫微斗数体系提供更丰富的创作词汇
 * 3. 支持多语言扩展
 * 
 * 版本：v1.0  日期：2026-03-30
 */

;(function(global) {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────
    // 词库分类映射
    // ─────────────────────────────────────────────────────────────────────

    const WRITING_LIBRARY_CATEGORIES = {
        // 基础版词库分类
        '爱情描写': {
            dimensions: ['emotion', 'social', 'speech'],
            keywords: ['心动', '相思', '眷恋', '缠绵', '刻骨', '浪漫', '甜蜜', '痛苦', '分离', '重逢'],
            description: '恋爱相关的情感表达和关系描写'
        },
        '男性描写': {
            dimensions: ['appearance', 'behavior', 'speech'],
            keywords: ['阳刚', '坚毅', '果断', '豪迈', '粗犷', '沉稳', '担当', '力量', '责任', '果敢'],
            description: '男性角色的外貌、行为和语言特征'
        },
        '女性描写': {
            dimensions: ['appearance', 'behavior', 'emotion'],
            keywords: ['柔美', '婉约', '细腻', '优雅', '温婉', '妩媚', '灵动', '敏感', '坚韧', '包容'],
            description: '女性角色的外貌、行为和情感特征'
        },
        '外貌描写': {
            dimensions: ['appearance'],
            keywords: ['五官', '身形', '气质', '仪态', '衣着', '神态', '眼神', '微笑', '举止', '风韵'],
            description: '人物外貌特征的详细描写'
        },
        '心理描写': {
            dimensions: ['emotion', 'behavior', 'growth'],
            keywords: ['内心', '思绪', '感受', '矛盾', '挣扎', '决断', '释然', '顿悟', '转变', '成长'],
            description: '人物心理活动和情感变化的描写'
        },
        '景色描写': {
            dimensions: [], // 环境描写，不属于八大维度
            keywords: ['山水', '四季', '气候', '昼夜', '自然', '人文', '氛围', '意境', '画面', '色彩'],
            description: '自然环境和社会环境的描写'
        },
        '声音描写': {
            dimensions: ['speech'],
            keywords: ['音色', '语调', '节奏', '语气', '音量', '音质', '韵律', '回响', '寂静', '嘈杂'],
            description: '声音和各种声响的描写'
        },
        '天象描写': {
            dimensions: [], // 环境描写
            keywords: ['天空', '云霞', '日月', '星辰', '风雨', '雷电', '雾霭', '虹霓', '昼夜', '季节'],
            description: '天空和天气现象的描写'
        },
        '色彩描写': {
            dimensions: ['appearance'],
            keywords: ['色调', '明暗', '对比', '搭配', '象征', '情感', '氛围', '光影', '质感', '层次'],
            description: '颜色和视觉效果的描写'
        },
        '场面描写': {
            dimensions: ['social', 'behavior', 'crisis'],
            keywords: ['紧张', '激烈', '恢弘', '细腻', '动态', '静态', '冲突', '和谐', '转折', '高潮'],
            description: '各种场景和场面的描写'
        },

        // 进阶版词库分类
        '措辞词库': {
            dimensions: ['speech', 'behavior'],
            keywords: ['精炼', '生动', '准确', '优美', '有力', '含蓄', '直白', '幽默', '严肃', '诗意'],
            description: '语言表达和措辞技巧'
        },
        '分类词库': {
            dimensions: ['appearance', 'behavior', 'emotion', 'social'],
            keywords: ['系统', '全面', '详细', '分类', '归纳', '对比', '分析', '总结', '典型', '特殊'],
            description: '按类别分类的描写词汇'
        },
        '名著描写': {
            dimensions: ['appearance', 'speech', 'behavior', 'emotion'],
            keywords: ['经典', '深刻', '传神', '隽永', '意境', '象征', '隐喻', '哲理', '人文', '艺术'],
            description: '文学名著中的经典描写'
        },
        '文艺描写': {
            dimensions: ['appearance', 'emotion', 'growth'],
            keywords: ['艺术', '美感', '情感', '意境', '象征', '隐喻',  '诗意', '哲思', '人文', '审美'],
            description: '文艺作品中的艺术性描写'
        },
        '细节描写': {
            dimensions: ['appearance', 'behavior'],
            keywords: ['细致', '入微', '具体', '生动', '真实', '鲜活', '细腻', '精准', '独特', '传神'],
            description: '细节和细微之处的描写'
        },
        '四季描写': {
            dimensions: [], // 环境描写
            keywords: ['春生', '夏长', '秋收', '冬藏', '轮回', '变迁', '生机', '繁盛', '萧瑟', '寂静'],
            description: '四季变化和季节特征的描写'
        },
        '景物描写': {
            dimensions: [], // 环境描写
            keywords: ['山川', '草木', '建筑', '街巷', '室内', '自然', '人工', '动态', '静态', '意境'],
            description: '各种景物和环境的描写'
        },
        '成语描写': {
            dimensions: ['speech', 'behavior', 'emotion'],
            keywords: ['典故', '凝练', '形象', '生动', '概括', '精辟', '传神', '深刻', '隽永', '智慧'],
            description: '成语典故在描写中的应用'
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // 紫微斗数与词库分类的映射
    // ─────────────────────────────────────────────────────────────────────

    const STAR_TO_LIBRARY_MAPPING = {
        // 紫微星 - 帝王气质，适合宏大、权威的描写
        '紫微': ['名著描写', '措辞词库', '场面描写', '外貌描写'],
        // 天机星 - 机智灵动，适合精细、分析的描写
        '天机': ['细节描写', '分类词库', '心理描写', '措辞词库'],
        // 太阳星 - 阳光热情，适合积极、光明的描写
        '太阳': ['文艺描写', '色彩描写', '天象描写', '场面描写'],
        // 武曲星 - 刚毅果断，适合力量、行动的描写
        '武曲': ['男性描写', '场面描写', '细节描写', '措辞词库'],
        // 天同星 - 温和包容，适合柔和、情感的描写
        '天同': ['女性描写', '爱情描写', '心理描写', '文艺描写'],
        // 廉贞星 - 深刻执着，适合深刻、情感的描写
        '廉贞': ['心理描写', '爱情描写', '名著描写', '文艺描写'],
        // 天府星 - 稳重富态，适合稳重、富足的描写
        '天府': ['外貌描写', '场面描写', '措辞词库', '细节描写'],
        // 太阴星 - 温柔婉约，适合柔和、细腻的描写
        '太阴': ['女性描写', '爱情描写', '心理描写', '细节描写'],
        // 贪狼星 - 魅力多变，适合魅力、变化的描写
        '贪狼': ['爱情描写', '外貌描写', '场面描写', '措辞词库'],
        // 巨门星 - 深沉内敛，适合深刻、沉思的描写
        '巨门': ['心理描写', '名著描写', '措辞词库', '细节描写'],
        // 天相星 - 得体优雅，适合得体、和谐的描写
        '天相': ['外貌描写', '措辞词库', '场面描写', '文艺描写'],
        // 天梁星 - 稳重老成，适合稳重、智慧的描写
        '天梁': ['名著描写', '措辞词库', '心理描写', '细节描写'],
        // 七杀星 - 锐利果敢，适合力量、冲突的描写
        '七杀': ['男性描写', '场面描写', '措辞词库', '细节描写'],
        // 破军星 - 不羁变革，适合变革、创新的描写
        '破军': ['场面描写', '措辞词库', '文艺描写', '心理描写']
    };

    // ─────────────────────────────────────────────────────────────────────
    // 核心函数
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 根据主星获取相关的词库分类
     * @param {string} mainStar - 主星名称
     * @returns {Array} 相关词库分类名称
     */
    function getRelevantLibraryCategories(mainStar) {
        return STAR_TO_LIBRARY_MAPPING[mainStar] || 
               ['措辞词库', '外貌描写', '心理描写', '场面描写'];
    }

    /**
     * 从词库分类中提取关键词
     * @param {Array} categories - 词库分类数组
     * @param {string} dimension - 八大维度之一
     * @param {number} count - 返回关键词数量
     * @returns {Array} 关键词数组
     */
    function extractKeywordsFromCategories(categories, dimension, count = 5) {
        var keywords = new Set();
        
        categories.forEach(function(categoryName) {
            var category = WRITING_LIBRARY_CATEGORIES[categoryName];
            if (category && category.keywords) {
                // 如果这个分类包含目标维度，或者没有指定维度限制
                if (category.dimensions.length === 0 || category.dimensions.indexOf(dimension) >= 0) {
                    category.keywords.forEach(function(keyword) {
                        keywords.add(keyword);
                    });
                }
            }
        });
        
        return Array.from(keywords).slice(0, count);
    }

    /**
     * 为特定维度生成增强词汇
     * @param {string} mainStar - 主星名称
     * @param {string} dimension - 八大维度
     * @param {string} sihuaType - 四化类型
     * @returns {Array} 增强词汇数组
     */
    function generateEnhancedVocabulary(mainStar, dimension, sihuaType) {
        sihuaType = sihuaType || '化禄型';
        
        // 获取相关词库分类
        var relevantCategories = getRelevantLibraryCategories(mainStar);
        
        // 从词库分类中提取关键词
        var libraryKeywords = extractKeywordsFromCategories(relevantCategories, dimension, 4);
        
        // 根据四化类型调整词汇
        var sihuaModifiers = {
            '化禄': ['丰润的', '和谐的', '滋养的', '满足的'],
            '化权': ['有力的', '掌控的', '权威的', '决断的'],
            '化科': ['优雅的', '得体的', '文雅的', '完美的'],
            '化忌': ['深刻的', '挣扎的', '压抑的', '转化的']
        };
        
        var sihuaKey = sihuaType.indexOf('化') >= 0 ? sihuaType.replace('型', '') : '化禄';
        var modifiers = sihuaModifiers[sihuaKey] || sihuaModifiers['化禄'];
        
        // 组合词汇：四化修饰 + 词库关键词
        var enhancedWords = [];
        libraryKeywords.forEach(function(keyword) {
            var modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
            enhancedWords.push(modifier + keyword);
            
            // 有时也添加未修饰的原始关键词
            if (Math.random() > 0.5) {
                enhancedWords.push(keyword);
            }
        });
        
        return enhancedWords;
    }

    /**
     * 生成完整的增强词库
     * @param {object} chartData - 命盘数据
     * @returns {object} 八大维度的增强词库
     */
    function generateEnhancedWordLibrary(chartData) {
        var mainStar = chartData.mainStar || '紫微';
        var sihuaType = chartData.sihuaType || '化禄型';
        
        var dimensions = ['appearance', 'speech', 'behavior', 'emotion', 'social', 'crisis', 'learning', 'growth'];
        var result = {};
        
        dimensions.forEach(function(dimension) {
            var enhancedWords = generateEnhancedVocabulary(mainStar, dimension, sihuaType);
            result[dimension] = enhancedWords;
        });
        
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────
    // 与现有词库系统集成
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 与ZiweiWordLibrary集成，提供增强版词库
     * @param {object} chartData - 命盘数据
     * @param {string} dimension - 维度
     * @param {number} count - 数量
     * @returns {Array} 组合词库（原词库 + 增强词库）
     */
    function getCombinedVocabulary(chartData, dimension, count) {
        count = count || 8;
        var allWords = [];
        
        // 1. 获取原始紫微斗数词库
        if (global.ZiweiWordLibrary && typeof global.ZiweiWordLibrary.generateDynamicVocabulary === 'function') {
            var originalWords = global.ZiweiWordLibrary.generateDynamicVocabulary(chartData, dimension, count);
            originalWords.forEach(function(word) {
                allWords.push(word);
            });
        }
        
        // 2. 获取增强词库
        var enhancedWords = generateEnhancedVocabulary(
            chartData.mainStar || '紫微',
            dimension,
            chartData.sihuaType || '化禄型'
        );
        enhancedWords.forEach(function(word) {
            if (allWords.indexOf(word) < 0) {
                allWords.push(word);
            }
        });
        
        // 3. 去重并限制数量
        var uniqueWords = [];
        allWords.forEach(function(word) {
            if (uniqueWords.indexOf(word) < 0) {
                uniqueWords.push(word);
            }
        });
        return uniqueWords.slice(0, Math.min(count, uniqueWords.length));
    }

    // ─────────────────────────────────────────────────────────────────────
    // 导出到全局
    // ─────────────────────────────────────────────────────────────────────

    global.WritingLibraryEnhancer = {
        getRelevantLibraryCategories: getRelevantLibraryCategories,
        extractKeywordsFromCategories: extractKeywordsFromCategories,
        generateEnhancedVocabulary: generateEnhancedVocabulary,
        generateEnhancedWordLibrary: generateEnhancedWordLibrary,
        getCombinedVocabulary: getCombinedVocabulary,
        
        // 常量导出
        WRITING_LIBRARY_CATEGORIES: WRITING_LIBRARY_CATEGORIES,
        STAR_TO_LIBRARY_MAPPING: STAR_TO_LIBRARY_MAPPING
    };

})(typeof window !== 'undefined' ? window : this);
