/**
 * 星轨人生 v2.0 - 核心应用逻辑修复补丁
 * 
 * 修复内容：
 * 1. getFallbackOptions() 函数 - 添加三语言支持
 * 2. initEightAttributes() 函数 - 修复从 UI_DYNAMIC.attr 获取选项的逻辑
 * 
 * 将此补丁合并到 app-v2.js 中相应位置
 */

// ==================== 辅助函数：获取兜底选项（已修复 i18n）====================
/**
 * 获取8属性维度的兜底选项（支持三语言）
 * 当动态词库和 UI_DYNAMIC 都不可用时，使用此兜底
 * @param {string} attrId - 属性ID，如 'appearance', 'speech' 等
 * @returns {string[]} 选项数组（当前语言）
 */
function getFallbackOptions(attrId) {
    // 从 UI_DYNAMIC 获取当前语言的选项
    const dyn = (typeof getDynamic === 'function') ? getDynamic() : null;
    
    // UI_DYNAMIC.attr 现在是数组格式：[{id, name, options}, ...]
    if (dyn && dyn.attr && Array.isArray(dyn.attr)) {
        const attrDef = dyn.attr.find(function(a) { return a.id === attrId; });
        if (attrDef && attrDef.options && attrDef.options.length > 0) {
            return attrDef.options;
        }
    }
    
    // 最终硬编码兜底（三语言）
    const lang = (typeof CURRENT_LANG !== 'undefined') ? CURRENT_LANG : 'zh';
    
    const FALLBACK_OPTIONS = {
        zh: {
            appearance: ['威严霸气', '温和儒雅', '锐利干练', '柔和亲和', '独特个性', '低调朴素'],
            speech: ['简洁有力', '温和委婉', '热情洋溢', '沉稳冷静', '幽默风趣', '寡言内敛'],
            behavior: ['雷厉风行', '深思熟虑', '随性而为', '谨慎小心', '有条不紊', '自由随性'],
            emotion: ['外露直白', '内敛含蓄', '丰富多变', '稳定平和', '理性克制', '感性冲动'],
            social: ['主动热情', '被动等待', '理性交往', '感性相交', '圆滑世故', '直率真诚'],
            crisis: ['冷静分析', '果断行动', '寻求帮助', '逃避回避', '慌乱无措', '坚定抵抗'],
            learning: ['快速学习', '稳步积累', '依赖经验', '善于应变', '固执己见', '灵活调整'],
            growth: ['追求成功', '追求自由', '追求安稳', '追求真理', '追求情感', '追求平衡']
        },
        'zh-TW': {
            appearance: ['威嚴霸氣', '溫和儒雅', '銳利幹練', '柔和親和', '獨特個性', '低調樸素'],
            speech: ['簡潔有力', '溫和委婉', '熱情洋溢', '沉穩冷靜', '幽默風趣', '寡言內斂'],
            behavior: ['雷厲風行', '深思熟慮', '隨性而為', '謹慎小心', '有條不紊', '自由隨性'],
            emotion: ['外露直白', '內斂含蓄', '豐富多變', '穩定平和', '理性克制', '感性衝動'],
            social: ['主動熱情', '被動等待', '理性交往', '感性相交', '圓滑世故', '直率真誠'],
            crisis: ['冷靜分析', '果斷行動', '尋求幫助', '逃避回避', '慌亂無措', '堅定抵抗'],
            learning: ['快速學習', '穩步積累', '依賴經驗', '善於應變', '固執己見', '靈活調整'],
            growth: ['追求成功', '追求自由', '追求安穩', '追求真理', '追求情感', '追求平衡']
        },
        en: {
            appearance: ['Commanding', 'Gentle & Refined', 'Sharp & Capable', 'Warm & Approachable', 'Distinctive', 'Unassuming'],
            speech: ['Direct & Concise', 'Tactful & Soft', 'Enthusiastic', 'Calm & Measured', 'Humorous', 'Reserved'],
            behavior: ['Decisive', 'Thoughtful', 'Spontaneous', 'Cautious', 'Methodical', 'Free-spirited'],
            emotion: ['Openly Expressive', 'Reserved', 'Changeable', 'Stable', 'Rationally Controlled', 'Impulsive'],
            social: ['Proactive', 'Passive', 'Rational', 'Emotionally Guided', 'Diplomatic', 'Frank & Honest'],
            crisis: ['Calm Analysis', 'Swift Action', 'Seeks Help', 'Avoidance', 'Panic', 'Firm Resistance'],
            learning: ['Fast Learner', 'Steady Accumulator', 'Experience-reliant', 'Highly Adaptive', 'Stubborn', 'Flexible'],
            growth: ['Achievement', 'Freedom', 'Stability', 'Truth', 'Connection', 'Balance']
        }
    };
    
    const langOptions = FALLBACK_OPTIONS[lang] || FALLBACK_OPTIONS['zh'];
    return langOptions[attrId] || langOptions.appearance;
}

// ==================== 步骤4: 8属性细化（已修复 i18n）====================
/**
 * 初始化8属性细化界面
 * 
 * 修复说明：
 * 1. UI_DYNAMIC.attr 现在统一使用数组格式：[{id, name, options}, ...]
 * 2. 不再区分 attr（对象格式）和 attributes（数组格式）
 * 3. 兜底选项 getFallbackOptions() 已支持三语言
 */
function initEightAttributes() {
    const container = document.getElementById('step-4-content');
    
    // 从 i18n 动态数据层取8属性（三语言）
    const dyn = (typeof getDynamic === 'function') ? getDynamic() : null;
    
    // ── ★ 修复：统一从 dyn.attr 获取（数组格式）────────────────────────
    let attributeDefs = [];
    
    if (dyn && dyn.attr && Array.isArray(dyn.attr) && dyn.attr.length > 0) {
        // 从 UI_DYNAMIC.attr 获取（现在是统一数组格式）
        attributeDefs = dyn.attr.map(function(attr) {
            return {
                id: attr.id,
                name: attr.name
            };
        });
    } else {
        // 兜底：硬编码定义
        attributeDefs = [
            { id: 'appearance', name: tUI('step4Title') || '外貌特征' },
            { id: 'speech',     name: tUI('step4Title') || '说话方式' },
            { id: 'behavior',   name: tUI('step4Title') || '行为习惯' },
            { id: 'emotion',    name: tUI('step4Title') || '情感表达' },
            { id: 'social',     name: tUI('step4Title') || '社交风格' },
            { id: 'crisis',     name: tUI('step4Title') || '应对危机' },
            { id: 'learning',   name: tUI('step4Title') || '学习适应' },
            { id: 'growth',     name: tUI('step4Title') || '成长方向' },
        ];
        
        // 尝试从 dyn.attr 获取名称（如果存在）
        if (dyn && dyn.attr && Array.isArray(dyn.attr)) {
            attributeDefs = dyn.attr.map(function(attr) {
                return { id: attr.id, name: attr.name };
            });
        }
    }
    
    // ── ★ 紫微斗数丰富动态词库：根据命盘生成丰富选项 ────────────────────────────
    let dynamicOptions = {};
    try {
        if (selectedChart) {
            // 提取命盘数据
            const chartData = {
                mainStar: selectedChart.mainStar || '紫微',
                sihuaType: selectedChart.sihuaType || '化禄型',
                patternType: selectedChart.patternType || '杀破狼',
                era: selectedEra || 'contemporary'
            };
            
            // 优先使用丰富词库系统
            let allVocab = {};
            if (window.RichZiweiWordLibrary && typeof window.RichZiweiWordLibrary.generateAllDimensionsVocabulary === 'function') {
                allVocab = window.RichZiweiWordLibrary.generateAllDimensionsVocabulary(chartData);
                console.log('[initEightAttributes] 丰富词库已生成（包含数千词汇）:', allVocab);
                
                // 显示统计信息
                const stats = window.RichZiweiWordLibrary.getStats();
                console.log('[initEightAttributes] 词库统计:', stats);
            }
            // 降级到原始词库
            else if (window.ZiweiWordLibrary && typeof window.ZiweiWordLibrary.generateAllDimensionsVocabulary === 'function') {
                allVocab = window.ZiweiWordLibrary.generateAllDimensionsVocabulary(chartData);
                console.log('[initEightAttributes] 动态词库已生成:', allVocab);
            }
            // 降级到增强词库
            else if (window.WritingLibraryEnhancer && typeof window.WritingLibraryEnhancer.getCombinedVocabulary === 'function') {
                const dimensions = ['appearance', 'speech', 'behavior', 'emotion', 'social', 'crisis', 'learning', 'growth'];
                dimensions.forEach(function(dimension) {
                    const words = window.WritingLibraryEnhancer.getCombinedVocabulary(chartData, dimension, 8);
                    allVocab[dimension] = words;
                });
                console.log('[initEightAttributes] 增强词库已生成:', allVocab);
            }
            
            // 转换格式
            attributeDefs.forEach(function(attr) {
                if (allVocab[attr.id] && allVocab[attr.id].length > 0) {
                    dynamicOptions[attr.id] = allVocab[attr.id];
                }
            });
        }
    } catch (e) {
        console.warn('[initEightAttributes] 词库生成出错:', e);
    }
    
    // ── ★ 合并选项：动态词库 > UI_DYNAMIC.attr > 兜底 ─────────────────────────
    const attributes = attributeDefs.map(function(attr) {
        let options = [];
        
        // 1. 动态词库（最高优先级）
        if (dynamicOptions[attr.id] && dynamicOptions[attr.id].length > 0) {
            options = dynamicOptions[attr.id];
        }
        // 2. UI_DYNAMIC.attr（i18n数据，现在是数组格式）
        else if (dyn && dyn.attr && Array.isArray(dyn.attr)) {
            const dynAttr = dyn.attr.find(function(a) { return a.id === attr.id; });
            if (dynAttr && dynAttr.options && dynAttr.options.length > 0) {
                options = dynAttr.options;
            }
        }
        // 3. 兜底选项（已支持三语言）
        if (options.length === 0) {
            options = getFallbackOptions(attr.id);
        }
        
        return {
            id: attr.id,
            name: attr.name,
            options: options.slice(0, 6) // 最多显示6个选项
        };
    });

    // ── ★ 命盘算法驱动：获取8属性命盘推荐 ────────────────────────────
    let attrRec = null;
    try {
        const fullChart = selectedChart && (selectedChart._fullChart || selectedChart._creativeParams && selectedChart);
        const fc = selectedChart && selectedChart._fullChart;
        if (
            fc && fc.palaces &&
            window.ChartBridge &&
            typeof window.ChartBridge.calcAttributeRecommendations === 'function'
        ) {
            const mingIdx = fc.mingPalace && fc.mingPalace.index !== undefined ? fc.mingPalace.index : 0;
            attrRec = window.ChartBridge.calcAttributeRecommendations(
                fc, mingIdx, selectedChart.patternType || ''
            );
        }
    } catch (e) {
        console.warn('[initEightAttributes] 命盘推荐计算出错（非致命）:', e);
    }
    
    container.innerHTML = attributes.map(function(attr) {
        const rec = attrRec && attrRec[attr.id];
        const _dyn2 = (typeof getDynamic === 'function') ? getDynamic() : {};
        const badgeSrc = (_dyn2.badgeSource && typeof _dyn2.badgeSource === 'function') ? _dyn2.badgeSource(rec && rec.source) : ((rec && rec.source || 'Chart') + ': ');
        const badgeAttrLabel = _dyn2.badgeAttr || 'Chart Tendency';
        return `
        <div class="attribute-group">
            <div class="attribute-label">
                ${attr.name}
                ${rec ? `<span style="font-size:10px;color:#B8860B;font-weight:400;margin-left:6px;opacity:0.85;">✦ ${badgeSrc}${rec.recommend}</span>` : ''}
            </div>
            <div class="attribute-options">
                ${attr.options.map(function(opt) {
                    const isRecommended = rec && rec.recommend === opt;
                    const recStyle = isRecommended
                        ? 'border-color:rgba(139,0,0,0.5);box-shadow:0 0 0 2px rgba(139,0,0,0.1);position:relative;'
                        : '';
                    const recBadge = isRecommended
                        ? `<span style="position:absolute;top:-7px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#8B0000,#B8860B);color:#fff;font-size:8px;padding:1px 5px;border-radius:10px;white-space:nowrap;font-weight:600;pointer-events:none;">${badgeAttrLabel}</span>`
                        : '';
                    return `
                    <div class="attribute-option" data-attr="${attr.id}" data-value="${opt}"
                         title="${isRecommended && rec ? rec.reason : ''}"
                         style="${recStyle}">
                        ${recBadge}
                        ${opt}
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    }).join('');
    
    container.querySelectorAll('.attribute-option').forEach(function(option) {
        option.addEventListener('click', function() {
            const attrId = option.dataset.attr;
            const value = option.dataset.value;
            const group = option.closest('.attribute-group');
            
            group.querySelectorAll('.attribute-option').forEach(function(o) { o.classList.remove('selected'); });
            option.classList.add('selected');
            eightAttributes[attrId] = value;
        });
    });
}

// ==================== 导出说明 ====================
/**
 * 应用此补丁的步骤：
 * 
 * 1. 在 app-v2.js 中找到 getFallbackOptions 函数（约第549行）
 *    替换为上面的修复版本
 * 
 * 2. 在 app-v2.js 中找到 initEightAttributes 函数（约第570-650行）
 *    替换为上面的修复版本
 * 
 * 3. 确保 i18n-ui.js 已更新（UI_DYNAMIC.attr 统一为数组格式）
 * 
 * 关键修复点：
 * - UI_DYNAMIC.zh.attr、UI_DYNAMIC['zh-TW'].attr、UI_DYNAMIC.en.attr 统一为数组格式
 * - getFallbackOptions() 支持三语言返回
 * - initEightAttributes() 正确从 dyn.attr 数组中查找选项
 */
