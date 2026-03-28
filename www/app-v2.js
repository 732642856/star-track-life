/**
 * 星轨人生 v2.0 - 核心应用逻辑
 * 解决问题: 1)内容差异化 2)Markdown排版 3)角色保存
 */

// ==================== 全局状态 ====================
let currentStep = 1;
let selectedChart = null;
let userInputs = {};
let eightAttributes = {};
let selectedEra = null;
let selectedSubPattern = null;
let currentCharacterBio = '';
let savedCharacters = [];

// ==================== 8种人物驱动力 ====================
// 每个选项是小传差异化的核心触发器，选哪个决定角色叙事方向
var DRIVE_8_TYPES = [
    { label: '野心者', keIdx: 0, desc: '想要更多，永不满足，代价是很难真正停下来' },
    { label: '执念者', keIdx: 1, desc: '有一件事/一个人放不下，整个人生都在绕着它转' },
    { label: '谋局者', keIdx: 2, desc: '凡事都在布局，极少暴露真实意图，连身边人也未必读得懂' },
    { label: '享乐者', keIdx: 3, desc: '活在当下，本能地回避痛苦，不太愿意为明天透支今天' },
    { label: '守护者', keIdx: 4, desc: '为某人或某件事活着，习惯把自己放在最后' },
    { label: '破局者', keIdx: 5, desc: '天生看不惯既有秩序，不打破什么就浑身难受' },
    { label: '漂泊者', keIdx: 6, desc: '找不到真正意义上的根，永远在路上，停下来反而迷茫' },
    { label: '隐忍者', keIdx: 7, desc: '能扛，扛到极限才会爆发，平时看起来比任何人都稳' },
];

// ==================== 144盘数据库 ====================
const CHART_DATABASE = {
    // 杀破狼系列 (36盘)
    '杀破狼': {
        patterns: [
            { name: '七杀独坐', stars: ['七杀'], desc: '勇猛无比，将星特质最明显' },
            { name: '破军独坐', stars: ['破军'], desc: '破坏开创，变动中求发展' },
            { name: '贪狼独坐', stars: ['贪狼'], desc: '多才多艺，欲望强烈，桃花旺' },
            { name: '七杀破军', stars: ['七杀', '破军'], desc: '开创力最强，冲动冒险' },
            { name: '七杀贪狼', stars: ['七杀', '贪狼'], desc: '勇猛加欲望，冒险求财' },
            { name: '破军贪狼', stars: ['破军', '贪狼'], desc: '变动加欲望，创新求变' }
        ],
        traits: {
            positive: ['勇敢果断', '开创力强', '冒险精神', '威望高', '执行力强'],
            negative: ['冲动', '急躁', '缺乏耐心', '好胜心强', '不服输'],
            psychology: '追求突破和变革，内心渴望征服和掌控'
        }
    },
    // 紫府廉武相系列 (36盘)
    '紫府廉武相': {
        patterns: [
            { name: '紫微独坐', stars: ['紫微'], desc: '孤君，凡事亲力亲为' },
            { name: '天府独坐', stars: ['天府'], desc: '稳重保守，善于守成' },
            { name: '廉贞独坐', stars: ['廉贞'], desc: '复杂好胜，次桃花' },
            { name: '武曲独坐', stars: ['武曲'], desc: '财星，果断刚毅' },
            { name: '天相独坐', stars: ['天相'], desc: '印星，谨慎服务' },
            { name: '紫微天府', stars: ['紫微', '天府'], desc: '帝星加财库，权力财富并存' },
            { name: '紫微贪狼', stars: ['紫微', '贪狼'], desc: '帝星加桃花，欲望强烈' },
            { name: '紫微天相', stars: ['紫微', '天相'], desc: '帝星加印星，谨慎领导' },
            { name: '武曲天府', stars: ['武曲', '天府'], desc: '财库双星，富贵双全' },
            { name: '廉贞贪狼', stars: ['廉贞', '贪狼'], desc: '桃花极旺，多才多艺' }
        ],
        traits: {
            positive: ['稳重', '有领导力', '务实', '有计划', '执行力强'],
            negative: ['过于保守', '控制欲强', '不够灵活', '压力大'],
            psychology: '追求稳定和掌控，内心渴望成就和认可'
        }
    },
    // 机月同梁系列 (36盘)
    '机月同梁': {
        patterns: [
            { name: '天机独坐', stars: ['天机'], desc: '聪明机智，谋士之相' },
            { name: '太阴独坐', stars: ['太阴'], desc: '温柔内敛，母性特质' },
            { name: '天同独坐', stars: ['天同'], desc: '福气深厚，温和享乐' },
            { name: '天梁独坐', stars: ['天梁'], desc: '清高正直，长辈风范' },
            { name: '天机太阴', stars: ['天机', '太阴'], desc: '聪明细腻，适合幕后' },
            { name: '天同天梁', stars: ['天同', '天梁'], desc: '仁慈福气，有长辈缘' }
        ],
        traits: {
            positive: ['温和', '善良', '有同情心', '人缘好', '适应力强'],
            negative: ['优柔寡断', '过于敏感', '缺乏主见', '容易妥协'],
            psychology: '追求和谐和安稳，内心渴望被理解和接纳'
        }
    },
    // 巨日系列 (36盘)
    '巨日': {
        patterns: [
            { name: '巨门独坐', stars: ['巨门'], desc: '口才好，研究能力强' },
            { name: '太阳独坐', stars: ['太阳'], desc: '光明磊落，公众人物' },
            { name: '巨门太阳', stars: ['巨门', '太阳'], desc: '口才加光明，正义感最强' }
        ],
        traits: {
            positive: ['正义感强', '表达能力强', '有理想', '光明磊落'],
            negative: ['过于理想化', '容易争议', '固执己见'],
            psychology: '追求正义和表达，内心渴望改变世界'
        }
    }
};

// 导出全局变量
window.CHART_DATABASE = CHART_DATABASE;

// ==================== 四化类型详细定义 ====================
const SIHUA_TYPES = {
    '化禄型': {
        desc: '天赋优势型，天生感到轻松愉悦',
        mingEffect: '天赋优势明显，做事轻松自然',
        fudeEffect: '精神富足，内心满足',
        fuqiEffect: '感情丰富，浪漫主义',
        traits: ['天赋优势', '轻松愉悦', '多情善感', '情感满足']
    },
    '化权型': {
        desc: '掌控欲强型，有强烈的掌控欲望',
        mingEffect: '主导性强，掌控欲明显',
        fudeEffect: '精神掌控，完美主义',
        fuqiEffect: '占有欲强，控制欲强',
        traits: ['掌控欲', '主导性', '防御机制', '占有欲']
    },
    '化科型': {
        desc: '名誉驱动型，极度在乎面子体面',
        mingEffect: '注重形象，理性克制',
        fudeEffect: '精神追求，理想主义',
        fuqiEffect: '理性择偶，精神恋爱',
        traits: ['声誉管理', '理性克制', '理想化', '面子体面']
    },
    '化忌型': {
        desc: '执念深重型，有深层的灵魂伤疤',
        mingEffect: '执念深重，难以放手',
        fudeEffect: '精神创伤，内心纠结',
        fuqiEffect: '感情执念，婚姻创伤',
        traits: ['灵魂伤疤', '执念', '不安全感', '强迫症']
    },
    '禄权叠加型': {
        desc: '财富权力双驱动，欲望强烈',
        mingEffect: '天赋加掌控，能力强',
        fudeEffect: '精神富足且强势',
        fuqiEffect: '感情丰富且占有欲强',
        traits: ['天赋+掌控', '财富权力', '欲望强烈']
    },
    '权忌冲突型': {
        desc: '掌控与执念冲突，内心纠结',
        mingEffect: '掌控欲与执念的矛盾',
        fudeEffect: '完美主义与创伤的冲突',
        fuqiEffect: '占有欲与恐惧的矛盾',
        traits: ['掌控vs执念', '内心冲突', '矛盾性格']
    },
    '科忌矛盾型': {
        desc: '面子与执念矛盾，情感复杂',
        mingEffect: '理性与执念的矛盾',
        fudeEffect: '理想与创伤的冲突',
        fuqiEffect: '精神恋爱与执念的矛盾',
        traits: ['面子vs执念', '理性冲突', '情感复杂']
    },
    '禄忌纠缠型': {
        desc: '享受与执念纠缠，情感波动',
        mingEffect: '天赋与执念的纠缠',
        fudeEffect: '满足与创伤的交织',
        fuqiEffect: '浪漫与执念的纠缠',
        traits: ['享受vs执念', '情感波动', '纠缠不清']
    }
};

// 导出全局变量
window.SIHUA_TYPES = SIHUA_TYPES;

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    showStep(1);
    initEraCards();
    initOptionCards();
    loadSavedCharacters();
});

// ==================== 步骤控制 ====================
function showStep(step) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`step-${step}`).classList.add('active');
    document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    
    currentStep = step;
}

function nextStep() {
    if (currentStep < 5) showStep(currentStep + 1);
}

function prevStep() {
    if (currentStep > 1) showStep(currentStep - 1);
}

function resetForm() {
    userInputs = {};
    eightAttributes = {};
    selectedEra = null;
    selectedChart = null;
    selectedSubPattern = null;
    document.getElementById('character-name').value = '';
    document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.era-card').forEach(c => c.classList.remove('selected'));
    showStep(1);
}

// ==================== 步骤1: 时代选择 ====================
function initEraCards() {
    document.querySelectorAll('.era-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.era-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedEra = card.dataset.era;
        });
    });
}

function confirmEra() {
    if (!selectedEra) {
        alert('请选择一个时代背景');
        return;
    }
    userInputs.era = selectedEra;
    showStep(2);
}

// ==================== 步骤2: 基础信息 ====================
function initOptionCards() {
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            const field = card.dataset.field;
            const value = card.dataset.value;
            
            document.querySelectorAll(`.option-card[data-field="${field}"]`).forEach(c => {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            userInputs[field] = value;
        });
    });
}

function confirmBasicInfo() {
    const name = document.getElementById('character-name').value.trim();
    if (!name) {
        alert('请输入角色名字');
        return;
    }
    if (!userInputs.gender) {
        alert('请选择性别');
        return;
    }
    if (!userInputs.age) {
        alert('请选择年龄');
        return;
    }
    
    userInputs.name = name;
    matchChart();
    showStep(3);
}

// ==================== 步骤3: 星盘匹配 ====================
function matchChart() {
    // 首次进入步骤3，keIdx默认0（后续用户选子类型时会更新）
    const chartData = generate144Chart({ ...userInputs, keIdx: userInputs.keIdx || 0 });
    
    // 保存到全局（使用统一代理结构）
    selectedChart = buildChartProxy(chartData);
    
    // 更新显示
    var _setEl = function(id, val) { var el = document.getElementById(id); if (el) el.textContent = val; };
    _setEl('main-pattern-name', chartData.pattern.name);
    _setEl('main-pattern-desc', chartData.pattern.desc);
    _setEl('main-star', (chartData.pattern.stars || []).join('、'));
    _setEl('pattern-type', chartData.patternType);
    _setEl('era-display', ({ancient:'古代', modern:'近代', contemporary:'现代'}[userInputs.era] || userInputs.era));
    _setEl('match-score', Math.floor(85 + Math.random() * 15) + '%');
    
    // 生成8种人格类型选项（每项=一个时辰刻坐标）
    generate8PersonalityTypes(chartData);
}

function generate8PersonalityTypes(chartData) {
    const grid = document.getElementById('sub-patterns-grid');
    if (!grid) return;
    
    // 始终使用8种驱动力，personalityTypes字段为备选
    const personalityTypes = (chartData.personalityTypes && chartData.personalityTypes.length > 0)
        ? chartData.personalityTypes
        : DRIVE_8_TYPES;
    
    grid.innerHTML = personalityTypes.map((type, i) => {
        const label = (typeof type === 'object') ? type.label : type;
        const keIdx = (typeof type === 'object') ? (type.keIdx !== undefined ? type.keIdx : i) : i;
        const desc  = (typeof type === 'object' && type.desc) ? type.desc : label;
        return `
            <div class="star-card ${i === 0 ? 'selected' : ''}" data-personality="${label}" data-ke-idx="${keIdx}">
                <div class="star-name">${label}</div>
                <div class="star-desc">${desc}</div>
            </div>
        `;
    }).join('');
    
    // 绑定点击事件：选中即锁定keIdx，重新精确排盘
    grid.querySelectorAll('.star-card').forEach(card => {
        card.addEventListener('click', () => {
            grid.querySelectorAll('.star-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedSubPattern = card.dataset.personality;
            
            // 把keIdx存入userInputs，锁定时辰刻 → 精确到1152分之一的命盘
            const keIdx = parseInt(card.dataset.keIdx || '0');
            userInputs.keIdx = keIdx;
            
            // 用keIdx重新排出精确命盘，更新selectedChart
            const refined = generate144Chart({ ...userInputs, keIdx });
            selectedChart = buildChartProxy(refined);
        });
    });
    
    // 默认选第0个
    const firstType = personalityTypes[0];
    selectedSubPattern = (typeof firstType === 'object') ? firstType.label : (firstType || '');
    userInputs.keIdx = 0;
}

/** 把排盘结果包装为selectedChart格式（兼容旧UI字段） */
function buildChartProxy(chartData) {
    return {
        ...chartData,
        name: chartData.pattern.name,
        stars: chartData.pattern.stars,
        desc: chartData.pattern.desc,
        type: chartData.patternType,
        chartId: chartData.chartUid || chartData.chartId,
        _fullChart: chartData,
    };
}

function generateSubPatterns() {
    // 这个函数已被generate8PersonalityTypes替代
    matchChart();
}

function confirmSubPattern() {
    initEightAttributes();
    showStep(4);
}

// ==================== 步骤4: 8属性细化 ====================
function initEightAttributes() {
    const container = document.getElementById('step-4-content');
    
    const attributes = [
        { id: 'appearance', name: '外貌特征', options: ['威严霸气', '温和儒雅', '锐利干练', '柔和亲和', '独特个性', '普通平凡'] },
        { id: 'speech', name: '说话方式', options: ['简洁有力', '温和委婉', '热情洋溢', '沉稳冷静', '幽默风趣', '寡言少语'] },
        { id: 'behavior', name: '行为习惯', options: ['雷厉风行', '深思熟虑', '随性而为', '谨慎小心', '有条不紊', '自由散漫'] },
        { id: 'emotion', name: '情感表达', options: ['外露直白', '内敛含蓄', '丰富多变', '稳定平和', '理性克制', '感性冲动'] },
        { id: 'social', name: '社交风格', options: ['主动热情', '被动等待', '理性交往', '感性相交', '圆滑世故', '直率真诚'] },
        { id: 'response', name: '应对危机', options: ['冷静分析', '果断行动', '寻求帮助', '逃避回避', '慌乱无措', '坚定抵抗'] },
        { id: 'learning', name: '学习适应', options: ['快速学习', '稳步积累', '依赖经验', '善于应变', '固执己见', '灵活调整'] },
        { id: 'growth', name: '成长方向', options: ['追求成功', '追求自由', '追求安稳', '追求真理', '追求情感', '追求平衡'] }
    ];
    
    container.innerHTML = attributes.map(attr => `
        <div class="attribute-group">
            <div class="attribute-label">${attr.name}</div>
            <div class="attribute-options">
                ${attr.options.map(opt => `
                    <div class="attribute-option" data-attr="${attr.id}" data-value="${opt}">${opt}</div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.attribute-option').forEach(option => {
        option.addEventListener('click', () => {
            const attrId = option.dataset.attr;
            const value = option.dataset.value;
            const group = option.closest('.attribute-group');
            
            group.querySelectorAll('.attribute-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            eightAttributes[attrId] = value;
        });
    });
}

// ==================== 步骤5: 生成人物小传 ====================
function generateFinalBio() {
    try {
        if (!selectedChart) {
            alert('请先完成星盘匹配');
            showStep(3);
            return;
        }
        if (!selectedSubPattern) {
            alert('请选择四化类型');
            showStep(3);
            return;
        }
        
        const bio = generateZiweiCharacterBio(userInputs, selectedChart, eightAttributes, selectedSubPattern);
        currentCharacterBio = bio;
        
        // 使用Markdown渲染
        const resultDiv = document.getElementById('result-content');
        resultDiv.innerHTML = renderMarkdown(bio);
        
        showStep(5);
    } catch (error) {
        console.error('生成人物小传时出错:', error);
        alert('生成人物小传时出错: ' + error.message);
    }
}

// ==================== Markdown渲染器 ====================
function renderMarkdown(markdown) {
    if (!markdown) return '';
    var lines = markdown.split('\n');
    var html = '';
    var i = 0;

    while (i < lines.length) {
        var line = lines[i];

        // 标题
        if (/^### (.+)/.test(line)) {
            html += '<h3>' + line.replace(/^### /, '') + '</h3>';
            i++; continue;
        }
        if (/^## (.+)/.test(line)) {
            html += '<h2>' + line.replace(/^## /, '') + '</h2>';
            i++; continue;
        }
        if (/^# (.+)/.test(line)) {
            html += '<h1>' + line.replace(/^# /, '') + '</h1>';
            i++; continue;
        }

        // 分割线
        if (/^---$/.test(line.trim())) {
            html += '<hr>';
            i++; continue;
        }

        // 表格（连续 | 开头的行）
        if (/^\|/.test(line)) {
            var tableLines = [];
            while (i < lines.length && /^\|/.test(lines[i])) {
                tableLines.push(lines[i]);
                i++;
            }
            // 过滤掉分隔行 |---|---|
            var dataRows = tableLines.filter(function(l) { return !/^\|[-| :]+\|$/.test(l.trim()); });
            html += '<table class="bio-table">';
            dataRows.forEach(function(row, idx) {
                var cells = row.split('|').filter(function(c, ci) { return ci > 0 && ci < row.split('|').length - 1; });
                var tag = idx === 0 ? 'th' : 'td';
                html += '<tr>' + cells.map(function(c) {
                    return '<' + tag + '>' + renderInline(c.trim()) + '</' + tag + '>';
                }).join('') + '</tr>';
            });
            html += '</table>';
            continue;
        }

        // 无序列表
        if (/^- (.+)/.test(line)) {
            html += '<ul>';
            while (i < lines.length && /^- (.+)/.test(lines[i])) {
                html += '<li>' + renderInline(lines[i].replace(/^- /, '')) + '</li>';
                i++;
            }
            html += '</ul>';
            continue;
        }

        // 有序列表
        if (/^\d+\. (.+)/.test(line)) {
            html += '<ol>';
            while (i < lines.length && /^\d+\. (.+)/.test(lines[i])) {
                html += '<li>' + renderInline(lines[i].replace(/^\d+\. /, '')) + '</li>';
                i++;
            }
            html += '</ol>';
            continue;
        }

        // 空行
        if (line.trim() === '') {
            i++; continue;
        }

        // 普通段落
        html += '<p>' + renderInline(line) + '</p>';
        i++;
    }

    return html;
}

function renderInline(text) {
    // 粗体
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // 斜体
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // 行内代码
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    return text;
}

// ==================== 桥接新排盘引擎 ====================

/**
 * generate144Chart：调用 FineChartEngine（新排盘引擎）生成精准命盘
 * 向后兼容旧版 CHART_DATABASE 数据结构
 */
function generate144Chart(inputs) {
  // 优先使用新排盘引擎
  if (window.FineChartEngine) {
    try {
      const engine = window.FineChartEngine;
      const result = engine.generateChart({
        birthYear: inputs.birthYear || new Date().getFullYear() - (parseInt(inputs.age) || 25),
        birthMonth: inputs.birthMonth || 6,
        birthDay: inputs.birthDay || 15,
        birthHour: inputs.birthHour || 12,
        gender: inputs.gender || '男',
        era: inputs.era || '当代都市',
      });

      // 适配旧版数据结构
      const mainStars = result.mingGong?.stars || [];
      const patternName = mainStars.join('') || '命主格局';
      return {
        pattern: {
          name: patternName,
          stars: mainStars,
          desc: result.mingGong?.desc || '命盘格局独特',
        },
        patternType: result.patternType || '主星格',
        shiChen: result.shiChen || '未知',
        ke: result.ke || 0,
        chartId: result.chartId || Math.random().toString(36).slice(2),
        personalityTypes: result.personalityTypes || DRIVE_8_TYPES,
        sihua: result.sihua || {},
        mingGong: result.mingGong || {},
        fuqiGong: result.fuqiGong || {},
        _fullChart: result,
      };
    } catch (e) {
      console.warn('新排盘引擎出错，回退旧逻辑:', e);
    }
  }

  // 回退：使用旧版 CHART_DATABASE
  const typeKeys = Object.keys(CHART_DATABASE);
  const idx = Math.abs((inputs.name || '').charCodeAt(0) || 0) % typeKeys.length;
  const typeKey = typeKeys[idx];
  const typeData = CHART_DATABASE[typeKey];
  const patterns = typeData.patterns;
  const patternIdx = Math.floor(Math.random() * patterns.length);
  const pattern = patterns[patternIdx];

  return {
    pattern,
    patternType: typeKey,
    shiChen: '午',
    ke: 0,
    chartId: `legacy-${idx}-${patternIdx}`,
    personalityTypes: DRIVE_8_TYPES,
    sihua: {},
    mingGong: { stars: pattern.stars, desc: pattern.desc },
    fuqiGong: { stars: [] },
    _fullChart: null,
  };
}

/**
 * generateZiweiCharacterBio：人物小传生成引擎调度
 * 优先走增强版（面相+词库+20问+爽点桥段+悬念手法），回退基础版
 */
function generateZiweiCharacterBio(inputs, chart, eightAttrs, subPattern) {
  // ── 优先：新版8模块 2400字+ 核心引擎（ziwei-bio-core.js → window._ziweiCoreGenerateBio）──
  if (typeof window._ziweiCoreGenerateBio === 'function') {
    try {
      var userData = {
        name:       inputs.name || '',
        gender:     inputs.gender || 'male',
        era:        inputs.era || 'contemporary',
        age:        inputs.age || 'youth',
        profession: inputs.career || inputs.profession || 'other'
      };
      // 解析四化类型：subPattern 可能是驱动力名称，需映射到四化
      var sihuaType = _resolveSihuaType(subPattern, chart);
      // chart 整形：保证 stars/type/name/desc/mainStar 字段存在
      var chartObj = _normalizeChart(chart);
      return window._ziweiCoreGenerateBio(userData, chartObj, eightAttrs || {}, sihuaType);
    } catch (e) {
      console.warn('新版8模块引擎出错，回退增强版:', e);
    }
  }

  // ── 次选：增强版 ──
  var era = inputs.era || 'contemporary';
  var characterData = {
    name: inputs.name || '', gender: inputs.gender || 'male',
    age: inputs.age || 'youth', driveType: subPattern || '',
    eightAttributes: eightAttrs,
  };
  if (typeof generateEnhancedCharacterBio === 'function') {
    try {
      var bioObj = generateEnhancedCharacterBio(chart, era, characterData);
      if (bioObj && bioObj.fullBio) return bioObj.fullBio;
    } catch (e) {
      console.warn('增强版小传引擎出错，回退兜底:', e);
    }
  }

  // ── 兜底 ──
  var pr = inputs.gender === '男' ? '他' : '她';
  var nm = inputs.name || (pr === '他' ? '男主' : '女主');
  var stars = ((chart.pattern && chart.pattern.stars) || []).join('、') || '命主';
  return '【人物小传：' + nm + '】\n\n' + pr + '命盘主星为' + stars + '\n\n驱动力：' + (subPattern || '未选择');
}

// 将 subPattern（驱动力名称）映射到四化类型
function _resolveSihuaType(subPattern, chart) {
  if (!subPattern) return '化禄型';
  // 直接是四化类型名
  if (/化禄|化权|化科|化忌/.test(subPattern)) {
    var m = subPattern.match(/化[禄权科忌]/);
    return m ? m[0] + '型' : '化禄型';
  }
  // 驱动力名称 → 四化映射
  var map = {
    '野心者':'化权型', '执念者':'化忌型', '谋局者':'化科型',
    '天才型':'化禄型', '流浪者':'化权型', '救赎者':'化科型',
    '复仇者':'化忌型', '守护者':'化科型',
    '天赋优势型':'化禄型', '掌控主导型':'化权型',
    '声誉理想型':'化科型', '执念深重型':'化忌型',
    '天赋内秀型':'化禄型', '掌控内敛型':'化权型',
    '声誉内修型':'化科型', '执念内化型':'化忌型'
  };
  for (var key in map) {
    if (subPattern.indexOf(key) !== -1) return map[key];
  }
  return '化禄型';
}

// 整形 chart 对象，保证字段统一
function _normalizeChart(chart) {
  if (!chart) return {stars:['紫微'], type:'杀破狼', name:'紫微独坐', desc:'', mainStar:'紫微'};
  var pattern = chart.pattern || {};
  var stars   = pattern.stars || chart.stars || (chart.mainStar ? [chart.mainStar] : ['紫微']);
  var type    = chart.patternType || chart.type || (pattern.name ? _guessPatternType(stars) : '杀破狼');
  return {
    stars:    stars,
    type:     type,
    name:     pattern.name  || chart.name  || stars[0] + '格局',
    desc:     pattern.desc  || chart.desc  || '',
    mainStar: stars[0]
  };
}

function _guessPatternType(stars) {
  var killStars = ['七杀','破军','贪狼'];
  var purpleStars = ['紫微','天府','廉贞','武曲','天相'];
  var moonStars = ['天机','太阴','天同','天梁'];
  var sunStars = ['太阳','巨门'];
  for (var i = 0; i < stars.length; i++) {
    if (killStars.indexOf(stars[i]) !== -1) return '杀破狼';
    if (purpleStars.indexOf(stars[i]) !== -1) return '紫府廉武相';
    if (moonStars.indexOf(stars[i]) !== -1) return '机月同梁';
    if (sunStars.indexOf(stars[i]) !== -1) return '巨日';
  }
  return '杀破狼';
}

// ==================== 角色保存系统 ====================
function saveCharacter() {
    if (savedCharacters.length >= 5) {
        alert('最多只能保存5个角色进行对比，请先删除一些角色');
        return;
    }
    
    const name = userInputs.name || '未命名角色';
    const timestamp = new Date().toLocaleString('zh-CN');
    
    const character = {
        id: Date.now(),
        name: name,
        timestamp: timestamp,
        inputs: { ...userInputs },
        chart: { ...selectedChart },
        attributes: { ...eightAttributes },
        sihua: selectedSubPattern,
        bio: currentCharacterBio
    };
    
    savedCharacters.push(character);
    localStorage.setItem('starTrackCharacters', JSON.stringify(savedCharacters));
    
    alert(`角色 "${name}" 已保存！(${savedCharacters.length}/5)`);
    displaySavedCharacters();
}

function copyCharacterBio() {
    if (!currentCharacterBio) {
        alert('请先生成人物小传');
        return;
    }
    
    // 转换为纯文本格式
    const plainText = currentCharacterBio
        .replace(/\*\*(.*?)\*\*/g, '$1')  // 移除粗体标记
        .replace(/^# (.*?)$/gm, '$1\n' + '='.repeat(50))  // 标题
        .replace(/^## (.*?)$/gm, '\n$1\n' + '-'.repeat(30))  // 二级标题
        .replace(/^### (.*?)$/gm, '\n$1')  // 三级标题
        .replace(/^---$/gm, '\n' + '='.repeat(50) + '\n');  // 分割线
    
    navigator.clipboard.writeText(plainText).then(() => {
        alert('人物小传已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择文本复制');
    });
}

function loadSavedCharacters() {
    const saved = localStorage.getItem('starTrackCharacters');
    if (saved) {
        savedCharacters = JSON.parse(saved);
        if (savedCharacters.length > 0) {
            displaySavedCharacters();
        }
    }
}

function displaySavedCharacters() {
    const section = document.getElementById('saved-characters-section');
    const list = document.getElementById('saved-characters-list');
    const compareBtn = document.getElementById('compare-btn-section');
    
    if (savedCharacters.length === 0) {
        section.style.display = 'none';
        compareBtn.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    compareBtn.style.display = savedCharacters.length >= 2 ? 'block' : 'none';
    
    list.innerHTML = savedCharacters.map(char => `
        <div class="saved-character-item">
            <input type="checkbox" class="compare-checkbox" data-id="${char.id}" style="margin-right: 10px;">
            <div class="character-info">
                <div class="character-name-display">${char.name}</div>
                <div class="character-meta">${char.chart.name} · ${char.sihua} · ${char.timestamp}</div>
            </div>
            <div class="character-actions">
                <button class="btn btn-small" onclick="loadCharacter(${char.id})">查看</button>
                <button class="btn btn-small btn-outline" onclick="deleteCharacter(${char.id})">删除</button>
            </div>
        </div>
    `).join('');
}

function loadCharacter(id) {
    const char = savedCharacters.find(c => c.id === id);
    if (!char) return;
    
    userInputs = { ...char.inputs };
    selectedChart = { ...char.chart };
    eightAttributes = { ...char.attributes };
    selectedSubPattern = char.sihua;
    currentCharacterBio = char.bio;
    
    document.getElementById('result-content').innerHTML = renderMarkdown(char.bio);
    showStep(5);
    
    // 滚动到顶部
    window.scrollTo(0, 0);
}

function deleteCharacter(id) {
    console.log('删除角色ID:', id);
    
    if (!confirm('确定要删除这个角色吗？')) {
        console.log('用户取消删除');
        return;
    }
    
    console.log('删除前角色数量:', savedCharacters.length);
    savedCharacters = savedCharacters.filter(c => c.id !== id);
    console.log('删除后角色数量:', savedCharacters.length);
    
    localStorage.setItem('starTrackCharacters', JSON.stringify(savedCharacters));
    displaySavedCharacters();
    
    if (savedCharacters.length === 0) {
        document.getElementById('saved-characters-section').style.display = 'none';
    }
    
    alert('角色已删除！');
}

function showCompare() {
    const checkboxes = document.querySelectorAll('.compare-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    
    if (selectedIds.length < 2) {
        alert('请至少选择2个角色进行对比');
        return;
    }
    
    if (selectedIds.length > 3) {
        alert('最多只能对比3个角色');
        return;
    }
    
    const selectedChars = selectedIds.map(id => savedCharacters.find(c => c.id === id));
    
    const compareContent = document.getElementById('compare-content');
    compareContent.innerHTML = generateComparison(selectedChars);
    
    document.getElementById('compare-section').style.display = 'block';
    document.getElementById('compare-section').scrollIntoView({ behavior: 'smooth' });
}

function generateComparison(chars) {
    let html = '<div class="compare-grid">';
    
    chars.forEach(char => {
        html += `
        <div class="compare-card">
            <h3 class="compare-name">${char.name}</h3>
            <div class="compare-item">
                <strong>格局：</strong>${char.chart.name}
            </div>
            <div class="compare-item">
                <strong>四化：</strong>${char.sihua}
            </div>
            <div class="compare-item">
                <strong>主星：</strong>${char.chart.stars.join('、')}
            </div>
            <div class="compare-item">
                <strong>时代：</strong>${{ancient:'古代', modern:'近代', contemporary:'现代'}[char.inputs.era]}
            </div>
            <div class="compare-item">
                <strong>性别：</strong>${char.inputs.gender === 'female' ? '女' : '男'}
            </div>
            <div class="compare-item">
                <strong>年龄：</strong>${{youth:'青年', middle:'中年', senior:'老年'}[char.inputs.age]}
            </div>
            <div class="compare-summary">
                ${char.bio.substring(0, 200)}...
            </div>
            <button class="btn btn-small" onclick="loadCharacter(${char.id})">查看完整小传</button>
        </div>
        `;
    });
    
    html += '</div>';
    
    // 添加对比分析
    var sihuaList = chars.map(function(c) { return c.sihua || '未知'; });
    var genderList = chars.map(function(c) { return c.inputs.gender === 'female' ? '女' : '男'; });
    var ageMap2 = {youth:'青年', middle:'中年', senior:'老年'};
    var ageList  = chars.map(function(c) { return ageMap2[c.inputs.age] || c.inputs.age || '未知'; });
    var eraMap2  = {ancient:'古代', modern:'近代', contemporary:'现代'};
    var eraList  = chars.map(function(c) { return eraMap2[c.inputs.era] || c.inputs.era || '未知'; });
    var nameList = chars.map(function(c) { return c.name || '角色'; });

    // 根据四化组合推断戏剧关系
    var relationMap = {
        '野心者_执念者': '两人都是目标导向型，容易在同一条路上形成竞争，甚至互为镜像——一个代表外向扩张，一个代表内向执着，放在同一场戏里张力极强。',
        '执念者_野心者': '两人都是目标导向型，容易在同一条路上形成竞争，甚至互为镜像——一个代表外向扩张，一个代表内向执着，放在同一场戏里张力极强。',
        '野心者_隐忍者': '一个主动出击，一个蓄力待发。表面上是强弱关系，实际上隐忍者的爆发往往比野心者更彻底。适合设计一段从依附到反转的关系弧。',
        '隐忍者_野心者': '一个主动出击，一个蓄力待发。表面上是强弱关系，实际上隐忍者的爆发往往比野心者更彻底。适合设计一段从依附到反转的关系弧。',
        '谋局者_执念者': '一个算计全局，一个死磕一点。前者容易把后者当棋子，后者往往是最后翻盘的变量。适合设计利用与被利用、最终失控的关系。',
        '执念者_谋局者': '一个算计全局，一个死磕一点。前者容易把后者当棋子，后者往往是最后翻盘的变量。适合设计利用与被利用、最终失控的关系。',
        '隐忍者_执念者': '两人都有强烈的内驱力，但一个向内消化，一个向外固着。这种组合放在亲密关系里尤其有戏——彼此理解却互相消耗。',
        '执念者_隐忍者': '两人都有强烈的内驱力，但一个向内消化，一个向外固着。这种组合放在亲密关系里尤其有戏——彼此理解却互相消耗。',
    };
    var sihuaKey = sihuaList[0] + '_' + sihuaList[1];
    var relationDesc = relationMap[sihuaKey] || '这两种类型并置，核心戏剧张力来自各自核心动机的碰撞——当两人的目标出现交叉，冲突自然产生，合作也会带着裂缝。';

    // 时代/年龄差异分析
    var contextNote = '';
    if (eraList[0] !== eraList[1]) {
        contextNote = `两人处于不同时代（${eraList.join(' / ')}），若需同框，需要设计跨时代叙事结构或平行时间线。`;
    } else if (ageList[0] !== ageList[1]) {
        contextNote = `年龄段不同（${nameList[0]}${ageList[0]}，${nameList[1]}${ageList[1]}），适合设计代际关系：传承、对抗、或同一段历史的不同切面。`;
    } else if (genderList[0] !== genderList[1]) {
        contextNote = `一男一女，${eraList[0]}背景下${ageList[0]}阶段，性别带来的社会处境差异本身就是戏剧资源。`;
    } else {
        contextNote = `背景相近（${eraList[0]}，${ageList[0]}），关系张力主要来自内在驱动力和价值观的差异，适合设计同类相斥的竞争或镜像关系。`;
    }

    html += `
    <div class="compare-analysis">
        <h3>对比分析</h3>
        <p><strong>命盘差异：</strong>${chars.map(function(c){ return (c.name||'角色') + '（' + (c.chart.pattern && c.chart.pattern.name || c.chart.name || '未知格局') + '）'; }).join(' vs ')}</p>
        <p><strong>四化类型：</strong>${sihuaList.join(' vs ')}</p>
        <p><strong>两人之间的戏剧关系：</strong>${relationDesc}</p>
        <p><strong>背景处境：</strong>${contextNote}</p>
    </div>
    `;
    
    return html;
}

function closeCompare() {
    document.getElementById('compare-section').style.display = 'none';
}
