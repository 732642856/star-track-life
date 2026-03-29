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

// ==================== 全局 Toast 提示 ====================
function showToast(msg, type) {
    var bg = (type === 'success') ? 'rgba(39,174,96,0.92)' : 'rgba(220,50,50,0.92)';
    var icon = (type === 'success') ? '✅ ' : '⚠️ ';
    var t = document.createElement('div');
    t.textContent = icon + msg;
    t.style.cssText = [
        'position:fixed',
        'top:50%',
        'left:50%',
        'transform:translate(-50%,-50%) scale(0.8)',
        'background:' + bg,
        'color:#fff',
        'padding:14px 28px',
        'border-radius:14px',
        'font-size:16px',
        'z-index:99999',
        'pointer-events:none',
        'box-shadow:0 6px 30px rgba(0,0,0,0.35)',
        'transition:transform 0.18s ease,opacity 0.18s ease',
        'max-width:80vw',
        'text-align:center',
        'line-height:1.5'
    ].join(';');
    document.body.appendChild(t);
    // 弹入
    requestAnimationFrame(function() {
        t.style.transform = 'translate(-50%,-50%) scale(1)';
    });
    // 弹出
    setTimeout(function() {
        t.style.opacity = '0';
        t.style.transform = 'translate(-50%,-50%) scale(0.8)';
        setTimeout(function() { if (t.parentNode) t.remove(); }, 200);
    }, type === 'success' ? 2000 : 2500);
}

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
        showToast('请选择一个时代背景');
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
    var name = document.getElementById('character-name').value.trim();

    // --- inline 提示工具函数 ---
    function showFieldError(elId, msg) {
        var errEl = document.getElementById(elId);
        var inputEl = document.getElementById('character-name');
        if (errEl) {
            errEl.textContent = '⚠️ ' + msg;
            errEl.style.display = 'inline-block';
            setTimeout(function() { errEl.style.display = 'none'; }, 4000);
        }
        // 滚动到提示处
        var target = errEl || inputEl;
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function showToast(msg) {
        var t = document.createElement('div');
        t.textContent = msg;
        t.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(220,50,50,0.92);color:#fff;padding:14px 28px;border-radius:12px;font-size:16px;z-index:9999;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
        document.body.appendChild(t);
        setTimeout(function() { t.remove(); }, 2500);
    }

    if (!name) {
        showFieldError('name-error', '请填写角色名字');
        var inp = document.getElementById('character-name');
        if (inp) {
            inp.focus();
            inp.style.borderColor = '#e74c3c';
            inp.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.25)';
            setTimeout(function() {
                inp.style.borderColor = '';
                inp.style.boxShadow = '';
            }, 3000);
        }
        return;
    }
    if (!userInputs.gender) {
        showToast('⚠️ 请选择性别');
        var genderEl = document.querySelector('[data-field="gender"]');
        if (genderEl) genderEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!userInputs.age) {
        showToast('⚠️ 请选择年龄段');
        var ageEl = document.querySelector('[data-field="age"]');
        if (ageEl) ageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!userInputs.profession) {
        showToast('⚠️ 请选择职业');
        var profEl = document.querySelector('[data-field="profession"]');
        if (profEl) profEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!userInputs.family) {
        showToast('⚠️ 请选择家庭背景');
        var famEl = document.querySelector('[data-field="family"]');
        if (famEl) famEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!userInputs.social) {
        showToast('⚠️ 请选择社会地位');
        var socEl = document.querySelector('[data-field="social"]');
        if (socEl) socEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!userInputs.parents) {
        showToast('⚠️ 请选择父母关系');
        var parEl = document.querySelector('[data-field="parents"]');
        if (parEl) parEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    if (!userInputs.siblings) {
        showToast('⚠️ 请选择手足关系');
        var sibEl = document.querySelector('[data-field="siblings"]');
        if (sibEl) sibEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        { id: 'crisis', name: '应对危机', options: ['冷静分析', '果断行动', '寻求帮助', '逃避回避', '慌乱无措', '坚定抵抗'] },
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
            showToast('请先完成星盘匹配');
            showStep(3);
            return;
        }
        if (!selectedSubPattern) {
            showToast('请选择四化类型');
            showStep(3);
            return;
        }

        // 8属性软处理：漏选的用主星推导，不拦截，只轻提示
        var missingAttrs = ['appearance','speech','behavior','emotion','social','crisis','learning','growth']
            .filter(function(id) { return !eightAttributes[id]; });
        if (missingAttrs.length > 0 && missingAttrs.length < 8) {
            showToast('💡 ' + missingAttrs.length + ' 项未选择，对应内容将以模糊风格呈现');
        }

        // ── 先跳到步骤5，显示loading动效 ──
        showStep(5);
        var resultDiv = document.getElementById('result-content');
        resultDiv.innerHTML = _buildLoadingHTML();

        // ── 双 rAF + setTimeout 确保loading先完整渲染到屏幕，再执行生成 ──
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                setTimeout(function() {
                    try {
                        var bio = generateZiweiCharacterBio(userInputs, selectedChart, eightAttributes, selectedSubPattern);
                        currentCharacterBio = bio;
                        resultDiv.innerHTML = renderMarkdown(bio);
                    } catch (err) {
                        resultDiv.innerHTML = '';
                        showToast('生成出错，请重试（' + err.message + '）');
                    }
                }, 300);
            });
        });

    } catch (error) {
        console.error('生成人物小传时出错:', error);
        showToast('生成出错，请重试（' + error.message + '）');
    }
}

function _buildLoadingHTML() {
    return '<div id="bio-loading" style="' +
        'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
        'padding:60px 20px;gap:20px;">' +

        // 星盘旋转图
        '<div style="position:relative;width:80px;height:80px;">' +
            '<div style="position:absolute;inset:0;border-radius:50%;border:3px solid rgba(108,99,255,0.15);"></div>' +
            '<div style="position:absolute;inset:0;border-radius:50%;border:3px solid transparent;' +
                'border-top-color:#6c63ff;animation:bioSpinOuter 1.1s linear infinite;"></div>' +
            '<div style="position:absolute;inset:12px;border-radius:50%;border:2px solid transparent;' +
                'border-bottom-color:#a78bfa;animation:bioSpinInner 0.8s linear infinite reverse;"></div>' +
            '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;' +
                'font-size:26px;">✦</div>' +
        '</div>' +

        // 文字动效
        '<div id="bio-loading-text" style="' +
            'font-size:15px;color:#6c63ff;font-weight:500;letter-spacing:0.05em;' +
            'animation:bioTextPulse 1.4s ease-in-out infinite;">推算命盘星曜中…</div>' +

        '<style>' +
            '@keyframes bioSpinOuter{to{transform:rotate(360deg)}}' +
            '@keyframes bioSpinInner{to{transform:rotate(360deg)}}' +
            '@keyframes bioTextPulse{0%,100%{opacity:0.5}50%{opacity:1}}' +
        '</style>' +
    '</div>';
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
        profession: inputs.career || inputs.profession || 'other',
        family:     inputs.family   || '',
        socialClass:inputs.social   || '',   // 注意：步骤2的"社会地位"叫social，8属性里的"社交风格"也叫social，这里用socialClass区分
        parents:    inputs.parents  || '',
        siblings:   inputs.siblings || ''
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
        showToast('最多只能保存5个角色，请先删除一些');
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
    
    showToast('「' + name + '」已保存 (' + savedCharacters.length + '/5)', 'success');
    displaySavedCharacters();
}

function copyCharacterBio() {
    if (!currentCharacterBio) {
        showToast('请先生成人物小传');
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
        showToast('已复制到剪贴板', 'success');
    }).catch(err => {
        console.error('复制失败:', err);
        showToast('复制失败，请手动长按选择');
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
    
    showToast('角色已删除', 'success');
}

function showCompare() {
    const checkboxes = document.querySelectorAll('.compare-checkbox:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
    
    if (selectedIds.length < 2) {
        showToast('请至少选择2个角色进行对比');
        return;
    }
    
    if (selectedIds.length > 3) {
        showToast('最多对比3个角色');
        return;
    }
    
    const selectedChars = selectedIds.map(id => savedCharacters.find(c => c.id === id));
    
    const compareContent = document.getElementById('compare-content');
    compareContent.innerHTML = generateComparison(selectedChars);
    
    var section = document.getElementById('compare-section');
    section.style.display = 'flex';
    // 全屏：锁定 body 滚动
    document.body.style.overflow = 'hidden';
}

function generateComparison(chars) {
    var eraMap = {ancient:'古代', modern:'近代', contemporary:'现代'};
    var ageMap = {youth:'青年', middle:'中年', senior:'老年'};

    // ── 顶部摘要条 ──
    var summaryItems = chars.map(function(char) {
        var sihua = char.sihua || '';
        var era   = eraMap[char.inputs.era] || '';
        var gender = char.inputs.gender === 'female' ? '女' : '男';
        var age   = ageMap[char.inputs.age] || '';
        return '<div class="cmp-summary-item">' +
            '<span class="cmp-summary-name">' + (char.name || '角色') + '</span>' +
            '<span class="cmp-summary-meta">' + era + ' · ' + gender + ' · ' + age + ' · ' + sihua + '</span>' +
        '</div>';
    }).join('');

    // ── 戏剧关系分析 ──
    var sihuaList = chars.map(function(c) { return c.sihua || '未知'; });
    var genderList = chars.map(function(c) { return c.inputs.gender === 'female' ? '女' : '男'; });
    var ageList  = chars.map(function(c) { return ageMap[c.inputs.age] || c.inputs.age || '未知'; });
    var eraList  = chars.map(function(c) { return eraMap[c.inputs.era] || c.inputs.era || '未知'; });
    var nameList = chars.map(function(c) { return c.name || '角色'; });

    var relationMap = {
        '野心者_执念者': '两人都是目标导向型，容易在同一条路上竞争，甚至互为镜像——外向扩张对内向执着，张力极强。',
        '执念者_野心者': '两人都是目标导向型，容易在同一条路上竞争，甚至互为镜像——外向扩张对内向执着，张力极强。',
        '野心者_隐忍者': '一个主动出击，一个蓄力待发。表面强弱，实则隐忍者的爆发往往比野心者更彻底。适合设计从依附到反转的关系弧。',
        '隐忍者_野心者': '一个主动出击，一个蓄力待发。表面强弱，实则隐忍者的爆发往往比野心者更彻底。适合设计从依附到反转的关系弧。',
        '谋局者_执念者': '一个算计全局，一个死磕一点。前者容易把后者当棋子，后者往往是最后翻盘的变量。适合设计利用与被利用、最终失控的关系。',
        '执念者_谋局者': '一个算计全局，一个死磕一点。前者容易把后者当棋子，后者往往是最后翻盘的变量。适合设计利用与被利用、最终失控的关系。',
        '隐忍者_执念者': '两人都有强烈内驱力，一个向内消化，一个向外固着。放在亲密关系里尤其有戏——彼此理解却互相消耗。',
        '执念者_隐忍者': '两人都有强烈内驱力，一个向内消化，一个向外固着。放在亲密关系里尤其有戏——彼此理解却互相消耗。',
    };
    var sihuaKey = sihuaList[0] + '_' + sihuaList[1];
    var relationDesc = relationMap[sihuaKey] || '这几种类型并置，核心戏剧张力来自各自动机的碰撞——目标交叉时冲突自然产生，合作也带着裂缝。';

    var contextNote = '';
    if (eraList.some(function(e){ return e !== eraList[0]; })) {
        contextNote = '角色处于不同时代（' + eraList.join(' / ') + '），若需同框需设计跨时代叙事结构。';
    } else if (ageList.some(function(a){ return a !== ageList[0]; })) {
        contextNote = '年龄段不同（' + nameList.map(function(n,i){ return n + ageList[i]; }).join('、') + '），适合设计代际传承或对抗关系。';
    } else if (genderList.some(function(g){ return g !== genderList[0]; })) {
        contextNote = '性别构成混合，' + eraList[0] + '背景下，性别带来的社会处境差异本身就是戏剧资源。';
    } else {
        contextNote = '背景相近（' + eraList[0] + '，' + ageList[0] + '），关系张力主要来自内在驱动力与价值观差异，适合设计同类相斥的竞争。';
    }

    // ── 相性评分 HTML（2人/3人均显示，两两配对）──
    var compatHtml = '';
    if (chars.length >= 2) {
        var pairs = [];
        for (var pi = 0; pi < chars.length; pi++) {
            for (var pj = pi + 1; pj < chars.length; pj++) {
                pairs.push([chars[pi], chars[pj]]);
            }
        }
        var pairHtmls = pairs.map(function(pair) {
            var nameA = pair[0].inputs.name || ('角色' + (chars.indexOf(pair[0]) + 1));
            var nameB = pair[1].inputs.name || ('角色' + (chars.indexOf(pair[1]) + 1));
            return '<div class="cmp-compat-pair">' +
                '<div class="cmp-compat-pair-title">' + nameA + ' × ' + nameB + '</div>' +
                _calcCompat(pair[0], pair[1]) +
            '</div>';
        }).join('');
        compatHtml = '<div class="cmp-compat">' + pairHtmls + '</div>';
    }

    // ── 三列完整小传（相性评分追加到每列末尾，随列滚动可见）──
    var colsHtml = chars.map(function(char) {
        var meta = [eraMap[char.inputs.era]||'', char.inputs.gender==='female'?'女':'男', ageMap[char.inputs.age]||'', char.chart.name||''].filter(Boolean).join(' · ');
        return '<div class="cmp-bio-col">' +
            '<div class="cmp-bio-col-header">' +
                '<p class="cmp-bio-name">' + (char.name||'角色') + '</p>' +
                '<p class="cmp-bio-meta">' + meta + '</p>' +
            '</div>' +
            '<div class="cmp-bio-col-body">' +
                renderMarkdown(char.bio) +
                compatHtml +
            '</div>' +
        '</div>';
    }).join('');

    return (
        '<div class="cmp-summary-bar">' + summaryItems + '</div>' +
        '<div class="cmp-analysis">' +
            '<p><strong>四化类型：</strong>' + sihuaList.join(' vs ') + '　<strong>戏剧关系：</strong>' + relationDesc + '</p>' +
            '<p><strong>背景处境：</strong>' + contextNote + '</p>' +
        '</div>' +
        '<div class="cmp-bio-columns">' + colsHtml + '</div>'
    );
}

// ── 相性计算 ──
function _calcCompat(charA, charB) {
    var sihuaA = charA.sihua || '';
    var sihuaB = charB.sihua || '';
    var eraA   = charA.inputs.era || '';
    var eraB   = charB.inputs.era || '';
    var genA   = charA.inputs.gender || '';
    var genB   = charB.inputs.gender || '';
    var ageA   = charA.inputs.age || '';
    var ageB   = charB.inputs.age || '';

    // 基础分：60
    var score = 60;
    var reasons = [];

    // 四化匹配：禄权 / 科忌 / 禄科 / 权科 正向；忌×2负向；忌vs禄冲突最大
    var sihuaScoreMap = {
        '化禄型_化权型': [+12, '禄权相辅，一方给力一方掌局，合作有天然驱动力'],
        '化权型_化禄型': [+12, '禄权相辅，一方给力一方掌局，合作有天然驱动力'],
        '化禄型_化科型': [+10, '禄科组合，务实与理想相得益彰，互相成就'],
        '化科型_化禄型': [+10, '禄科组合，务实与理想相得益彰，互相成就'],
        '化权型_化科型': [+8,  '权科并立，一方主导一方疏通，运转顺畅'],
        '化科型_化权型': [+8,  '权科并立，一方主导一方疏通，运转顺畅'],
        '化忌型_化忌型': [-15, '双忌叠加，两人执念互相放大，容易陷入消耗战'],
        '化禄型_化忌型': [+5,  '禄忌对撞，一方给予一方执念，张力十足但易耗尽'],
        '化忌型_化禄型': [+5,  '禄忌对撞，一方给予一方执念，张力十足但易耗尽'],
        '化权型_化忌型': [-5,  '权忌相遇，掌控欲对执念，双方都不愿妥协'],
        '化忌型_化权型': [-5,  '权忌相遇，掌控欲对执念，双方都不愿妥协'],
        '化科型_化忌型': [+3,  '科忌之间有微妙拉力，理性试图理解执念，难以稳定'],
        '化忌型_化科型': [+3,  '科忌之间有微妙拉力，理性试图理解执念，难以稳定'],
    };
    var sihuaKey = sihuaA + '_' + sihuaB;
    var sihuaResult = sihuaScoreMap[sihuaKey];
    if (sihuaResult) { score += sihuaResult[0]; reasons.push(sihuaResult[1]); }
    else { reasons.push('四化类型各异，关系走向取决于二人的磨合意愿'); }

    // 时代：同代+8，跨代-5
    if (eraA && eraB) {
        if (eraA === eraB) { score += 8; reasons.push('同一时代，共同语境让理解成本低'); }
        else               { score -= 5; reasons.push('跨时代背景，需要额外的叙事设计来支撑同框'); }
    }

    // 年龄：同段+5，相差一段0，相差两段-5
    var ageOrder = {youth:0, middle:1, senior:2};
    var ageDiff = Math.abs((ageOrder[ageA]||0) - (ageOrder[ageB]||0));
    if (ageDiff === 0) { score += 5; reasons.push('年龄相近，处境相似，共鸣感强'); }
    else if (ageDiff === 2) { score -= 5; reasons.push('年龄差距大，人生阶段错位，需设计代际关系'); }

    // 性别异同
    if (genA !== genB) { score += 5; reasons.push('性别互补，在任何时代都能产生天然叙事张力'); }

    // 限制在0-100
    score = Math.max(0, Math.min(100, score));

    // 评语
    var label = score >= 85 ? '高度契合' : score >= 70 ? '关系良好' : score >= 50 ? '张力显著' : '冲突型组合';
    var labelColor = score >= 85 ? '#27ae60' : score >= 70 ? '#2980b9' : score >= 50 ? '#e67e22' : '#e74c3c';

    var barFill = '<div style="height:8px;border-radius:4px;background:linear-gradient(90deg,' + labelColor + ',rgba(108,99,255,0.3));' +
        'width:' + score + '%;transition:width 0.6s ease;"></div>';

    return '<div style="margin-bottom:2px;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">' +
            '<span style="font-size:13px;font-weight:600;color:#333;">命盘相性</span>' +
            '<span style="font-size:22px;font-weight:700;color:' + labelColor + ';">' + score + '</span>' +
            '<span style="font-size:12px;color:' + labelColor + ';font-weight:600;padding:2px 8px;' +
                'background:' + labelColor + '22;border-radius:10px;">' + label + '</span>' +
        '</div>' +
        '<div style="background:#f0f0f0;border-radius:4px;overflow:hidden;margin-bottom:8px;">' + barFill + '</div>' +
        '<ul style="margin:0;padding-left:16px;list-style:disc;">' +
            reasons.map(function(r){ return '<li style="font-size:12px;color:#555;margin-bottom:3px;">' + r + '</li>'; }).join('') +
        '</ul>' +
    '</div>';
}

function closeCompare() {
    document.getElementById('compare-section').style.display = 'none';
    document.body.style.overflow = '';
}

// showBioCompare / closeBioCompare 已并入新版 generateComparison，保留空实现以防旧引用
function showBioCompare() {}
function closeBioCompare() {}
