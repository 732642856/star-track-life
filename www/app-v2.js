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

    // 下滑箭头：点击跳到已保存角色区
    var scrollHint = document.getElementById('scroll-hint-step4');
    if (scrollHint) {
        scrollHint.addEventListener('click', function() {
            var s = document.getElementById('saved-characters-section');
            if (s && s.style.display !== 'none') {
                var top = s.getBoundingClientRect().top + window.pageYOffset - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    }
});

// ==================== 步骤控制 ====================
function showStep(step) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    document.getElementById('step-' + step).classList.add('active');
    document.querySelector('.step[data-step="' + step + '"]').classList.add('active');
    
    currentStep = step;

    // 所有步骤切换后立即归到顶部（iOS 习惯：新页面从头开始）
    requestAnimationFrame(function() {
        window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // 引导钩子：进入步骤4时触发第2步引导
    if (step === 4) { if (typeof obOnStep4Shown === 'function') obOnStep4Shown(); }
    // 非步骤5时隐藏下拉箭头
    if (step !== 5) {
        var _arr = document.getElementById('bio-scroll-arrow');
        if (_arr) _arr.classList.add('hidden');
    }

    // 步骤4：仅当有已保存角色时显示跳转箭头
    if (step === 4) {
        var hint = document.getElementById('scroll-hint-step4');
        if (hint) {
            var savedSection = document.getElementById('saved-characters-section');
            if (savedSection && savedSection.style.display !== 'none') {
                hint.classList.remove('hidden');
            } else {
                hint.classList.add('hidden');
            }
        }
    }
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
    if (typeof obOnEraConfirmed === 'function') obOnEraConfirmed();
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
                        if (typeof obOnBioGenerated === 'function') obOnBioGenerated();
                        if (typeof _showBioScrollArrow === 'function') _showBioScrollArrow();
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
    if (savedCharacters.length >= 10) {
        showToast('最多只能保存10个角色，请先删除一些');
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
    
    showToast('「' + name + '」已保存 (' + savedCharacters.length + '/10)', 'success');
    displaySavedCharacters();
    if (typeof obOnCharacterSaved === 'function') obOnCharacterSaved();
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
    // 同步步骤4跳转箭头
    var _hint = document.getElementById('scroll-hint-step4');
    if (_hint) { _hint.classList.remove('hidden'); }
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
    // iOS WKWebView 会屏蔽 confirm()，改用 Toast + 内联二次确认
    var char = savedCharacters.find(function(c) { return c.id === id; });
    var name = char ? char.name : '该角色';

    // 若已有待确认提示，直接执行删除
    if (window._pendingDeleteId === id) {
        window._pendingDeleteId = null;
        savedCharacters = savedCharacters.filter(function(c) { return c.id !== id; });
        localStorage.setItem('starTrackCharacters', JSON.stringify(savedCharacters));
        displaySavedCharacters();
        if (savedCharacters.length === 0) {
            document.getElementById('saved-characters-section').style.display = 'none';
            var _hint2 = document.getElementById('scroll-hint-step4');
            if (_hint2) { _hint2.classList.add('hidden'); }
        }
        showToast('「' + name + '」已删除', 'success');
        return;
    }

    // 第一次点击：标记待确认，提示用户再点一次
    window._pendingDeleteId = id;
    showToast('再次点击「删除」确认删除「' + name + '」');
    // 3秒后清除待确认状态
    setTimeout(function() {
        if (window._pendingDeleteId === id) window._pendingDeleteId = null;
    }, 3000);
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
    if (typeof obOnCompareShown === 'function') obOnCompareShown();

    // 注入右上角浮动关闭按钮（iOS 悬浮圆形风格）
    var existFab = document.getElementById('cmp-close-fab');
    if (existFab) existFab.remove();
    var fab = document.createElement('button');
    fab.id = 'cmp-close-fab';
    fab.className = 'cmp-close-fab';
    fab.innerHTML = '&#x2715;'; // ×
    fab.setAttribute('aria-label', '关闭对比');
    fab.onclick = closeCompare;
    document.body.appendChild(fab);
}

function generateComparison(chars) {
    var eraMap = {ancient:'古代', modern:'近代', contemporary:'现代'};
    var ageMap = {youth:'青年', middle:'中年', senior:'老年'};

    // ── 顶部摘要条：固定标题，不重复显示角色名（列头已有）──
    var summaryItems = '<span class="cmp-summary-title">角色对比分析</span>';

    // ── 戏剧关系分析（聚焦关系原型 + 剧情建议，不重复相性卡片内容）──
    var sihuaList = chars.map(function(c) { return c.sihua || '未知'; });
    var genderList = chars.map(function(c) { return c.inputs.gender === 'female' ? '女' : '男'; });
    var ageList  = chars.map(function(c) { return ageMap[c.inputs.age] || c.inputs.age || '未知'; });
    var eraList  = chars.map(function(c) { return eraMap[c.inputs.era] || c.inputs.era || '未知'; });
    var nameList = chars.map(function(c) { return c.name || '角色'; });

    // 关系原型：基于四化组合，给出剧本创作层面的关系定型
    var archetypeMap = {
        '谋局者_谋局者': { name: '双谋对弈', tip: '两个人都在下棋，谁也不是棋子。冲突来自信息战，合作本质是暂时的同盟。建议设计"共同敌人消失后立刻反目"的结构。' },
        '野心者_野心者': { name: '双雄角力', tip: '目标高度重叠，天然竞争。建议在同一利益场景里制造"合则两利、斗则俱损"的困境，迫使他们反复选择。' },
        '享乐者_享乐者': { name: '同频共振', tip: '两人都追求当下满足，矛盾往往来自外部压力而非内部。建议用"大难临头"或"各自被迫成长"破坏这种平衡。' },
        '执念者_执念者': { name: '两败俱伤型', tip: '两个人都死磕，谁也不肯松手。建议设计一个他们共同在意却只有一个人能得到的东西，让冲突彻底化。' },
        '谋局者_野心者': { name: '棋手与剑客', tip: '一个算，一个冲。前期谋局者占优，中后期野心者容易突破算计。建议在第三幕让野心者做一件"完全不在预案里"的事，打破谋局者的掌控感。' },
        '野心者_谋局者': { name: '棋手与剑客', tip: '一个算，一个冲。前期谋局者占优，中后期野心者容易突破算计。建议在第三幕让野心者做一件"完全不在预案里"的事，打破谋局者的掌控感。' },
        '谋局者_享乐者': { name: '猎人与猎物', tip: '谋局者看穿享乐者的欲望并加以利用，享乐者往往不自知。建议设计"享乐者被唤醒"的转折点——一旦他不再好骗，谋局者将失去最大棋子。' },
        '享乐者_谋局者': { name: '猎人与猎物', tip: '谋局者看穿享乐者的欲望并加以利用，享乐者往往不自知。建议设计"享乐者被唤醒"的转折点——一旦他不再好骗，谋局者将失去最大棋子。' },
        '谋局者_执念者': { name: '利用与失控', tip: '谋局者把执念者当变量纳入棋局，但执念者的不理性恰恰是最大的变数。建议在关键节点让执念者的偏执"刚好"拆了谋局者最精密的一步棋。' },
        '执念者_谋局者': { name: '利用与失控', tip: '谋局者把执念者当变量纳入棋局，但执念者的不理性恰恰是最大的变数。建议在关键节点让执念者的偏执"刚好"拆了谋局者最精密的一步棋。' },
        '野心者_享乐者': { name: '驱动与阻力', tip: '野心者往前冲，享乐者拉着不走。两人关系的核心冲突是"为什么要那么拼"。建议让享乐者在某个节点选择放弃，迫使野心者面对孤独。' },
        '享乐者_野心者': { name: '驱动与阻力', tip: '野心者往前冲，享乐者拉着不走。两人关系的核心冲突是"为什么要那么拼"。建议让享乐者在某个节点选择放弃，迫使野心者面对孤独。' },
        '野心者_执念者': { name: '扩张与深挖', tip: '野心者要占领更多，执念者只盯着一件事。目标不同，路线交叉时冲突爆发。建议设计"那件事"同时是两人的关键——让目标物重叠。' },
        '执念者_野心者': { name: '扩张与深挖', tip: '野心者要占领更多，执念者只盯着一件事。目标不同，路线交叉时冲突爆发。建议设计"那件事"同时是两人的关键——让目标物重叠。' },
        '享乐者_执念者': { name: '轻与重的拉锯', tip: '享乐者觉得执念者太沉，执念者觉得享乐者不可信任。两人的互相吸引和互相嫌弃可以同时存在。建议在关系最好的时刻安排一次关于"值不值得"的选择。' },
        '执念者_享乐者': { name: '轻与重的拉锯', tip: '享乐者觉得执念者太沉，执念者觉得享乐者不可信任。两人的互相吸引和互相嫌弃可以同时存在。建议在关系最好的时刻安排一次关于"值不值得"的选择。' },
    };
    var sihuaKey2 = sihuaList.slice(0,2).join('_');
    var archetype = archetypeMap[sihuaKey2] || { name: '多元混局', tip: '多种驱动类型并存，关系结构复杂。建议先确定谁是主视角，再设计其他角色对其构成的具体压力。' };

    // 场景建议：基于时代/年龄给出具体场景切入点（不重复相性卡片的"跨时代""年龄相近"判断）
    var sceneTip = '';
    var allSameEra = eraList.every(function(e){ return e === eraList[0]; });
    var allSameAge = ageList.every(function(a){ return a === ageList[0]; });
    var hasFemaleMale = genderList.indexOf('女') > -1 && genderList.indexOf('男') > -1;

    if (!allSameEra) {
        var eraCombo = [...new Set(eraList)].join('→');
        var eraTipMap = {
            '古代→近代': '建议以"物件/秘密/血脉传承"为跨时代纽带，让古代角色的选择直接影响近代角色的命运。',
            '近代→现代': '建议以"历史遗留问题"为切入点——近代的未竟之事，在现代角色身上形成回响或债务。',
            '古代→现代': '时代跨度最大，建议只保留精神/价值观层面的呼应，避免强行物理同框。',
            '古代→近代→现代': '三代并存，天然史诗结构。建议设计一条贯穿三代的"执念或遗物"作为主线锚点。',
        };
        sceneTip = eraTipMap[eraCombo] || ('跨越' + eraCombo + '的时代跨度，叙事上需要一个横贯时代的核心意象或命题来统一。');
    } else if (!allSameAge) {
        var ageCombo = nameList.map(function(n,i){ return n + '（' + ageList[i] + '）'; }).join('、');
        sceneTip = ageCombo + '——建议设计一个"共同在场"的场景：同一空间里，青年角色的冲劲与老年角色的经验形成对位，中年角色承接两端的压力。';
    } else if (hasFemaleMale) {
        sceneTip = '性别构成有男有女，建议在' + eraList[0] + '社会结构下设计至少一个"性别带来不同处境"的具体场景——同样的选择，男女角色面对的代价不同。';
    } else {
        sceneTip = '背景高度相近，外部差异极小。建议把场景聚焦在"一个只有一个人能得到的东西"上，用稀缺性制造内部摩擦。';
    }

    // ── 预先计算所有两两配对的相性 HTML（每列只显示自己参与的那一对）──
    // 建立 charIndex → 与下一个角色的配对映射：2人时 0→0×1；3人时 0→0×1，1→1×2，2→2×0
    var pairMap = {};  // key: charIndex, value: { nameA, nameB, compatHtml }
    if (chars.length === 2) {
        var nameA0 = chars[0].inputs.name || '角色1';
        var nameB0 = chars[1].inputs.name || '角色2';
        var h = _calcCompat(chars[0], chars[1]);
        pairMap[0] = { title: nameA0 + ' × ' + nameB0, html: h };
        pairMap[1] = { title: nameA0 + ' × ' + nameB0, html: h };
    } else if (chars.length === 3) {
        // 3人：A×B / A×C / B×C，每列显示自己"第一次出现"的那对
        // A列：A×B，B列：B×C，C列：A×C（让每列配对不重复）
        var pairs3 = [
            [0, 1],
            [1, 2],
            [0, 2]
        ];
        var assigned = [0, 1, 2]; // colIndex → pairsIndex
        assigned.forEach(function(colIdx, i) {
            var pi = pairs3[i][0], pj = pairs3[i][1];
            var nA = chars[pi].inputs.name || ('角色' + (pi + 1));
            var nB = chars[pj].inputs.name || ('角色' + (pj + 1));
            pairMap[colIdx] = { title: nA + ' × ' + nB, html: _calcCompat(chars[pi], chars[pj]) };
        });
    }

    // ── 三列完整小传（每列末尾只显示该列对应的那一对相性）──
    var colsHtml = chars.map(function(char, colIdx) {
        var meta = [
            eraMap[char.inputs.era] || '',
            char.inputs.gender === 'female' ? '女' : '男',
            ageMap[char.inputs.age] || '',
            char.chart.name || ''
        ].filter(Boolean).join(' · ');
        var sihuaTag = char.sihua ? '<span class="cmp-sihua-tag">' + char.sihua + '</span>' : '';
        var colCompatHtml = '';
        if (pairMap[colIdx]) {
            colCompatHtml = '<div class="cmp-compat">' +
                '<div class="cmp-compat-pair-title">' + pairMap[colIdx].title + '</div>' +
                pairMap[colIdx].html +
            '</div>';
        }
        return '<div class="cmp-bio-col">' +
            '<div class="cmp-bio-col-header">' +
                '<div class="cmp-col-name-row">' +
                    '<p class="cmp-bio-name">' + (char.name || '角色') + '</p>' +
                    sihuaTag +
                '</div>' +
                '<p class="cmp-bio-meta">' + meta + '</p>' +
            '</div>' +
            '<div class="cmp-bio-col-body">' +
                renderMarkdown(char.bio) +
                colCompatHtml +
            '</div>' +
        '</div>';
    }).join('');

    return (
        '<div class="cmp-summary-bar">' +
            '<button class="cmp-back-btn" onclick="closeCompare()">← 返回</button>' +
            summaryItems +
        '</div>' +
        '<div class="cmp-analysis">' +
            '<span class="cmp-archetype-tag">' + archetype.name + '</span>' +
            '<p class="cmp-archetype-tip">' + archetype.tip + '</p>' +
            (sceneTip ? '<p class="cmp-scene-tip"><strong>场景切入：</strong>' + sceneTip + '</p>' : '') +
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

    // 标签和颜色
    var label = score >= 85 ? '高度契合' : score >= 70 ? '关系良好' : score >= 50 ? '张力显著' : '冲突型组合';
    var labelColor = score >= 85 ? '#27ae60' : score >= 70 ? '#2980b9' : score >= 50 ? '#e67e22' : '#e74c3c';

    // 只取最核心的一句评语（四化决定性格，优先级最高；其余取第一条）
    var mainReason = reasons[0] || '';

    var barFill = '<div style="height:6px;border-radius:3px;background:linear-gradient(90deg,' + labelColor + ',rgba(108,99,255,0.25));' +
        'width:' + score + '%;transition:width 0.6s ease;"></div>';

    return '<div style="padding:10px 0 4px;">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">' +
            '<span style="font-size:12px;color:#999;">命盘相性</span>' +
            '<span style="font-size:20px;font-weight:700;color:' + labelColor + ';">' + score + '</span>' +
            '<span style="font-size:11px;color:' + labelColor + ';font-weight:600;padding:2px 7px;' +
                'background:' + labelColor + '18;border-radius:8px;">' + label + '</span>' +
        '</div>' +
        '<div style="background:#ebebeb;border-radius:3px;overflow:hidden;margin-bottom:7px;">' + barFill + '</div>' +
        (mainReason ? '<p style="font-size:12px;color:#666;margin:0;line-height:1.5;">' + mainReason + '</p>' : '') +
    '</div>';
}

function closeCompare() {
    document.getElementById('compare-section').style.display = 'none';
    document.body.style.overflow = '';
    // 移除浮动关闭按钮
    var fab = document.getElementById('cmp-close-fab');
    if (fab) fab.remove();
}

// showBioCompare / closeBioCompare 已并入新版 generateComparison，保留空实现以防旧引用
function showBioCompare() {}
function closeBioCompare() {}

// ==================== 快速演示引导 ====================
var OB_STORAGE_KEY = 'xingguirensheng_onboarding_done_v4';
var _obDemoStep = 0;
var _obDemoTotal = 4;
var _obDemoTimer = null;

// 开机动画结束后启动演示
(function initOnboarding() {
    if (localStorage.getItem(OB_STORAGE_KEY)) return;
    setTimeout(function() {
        var demo = document.getElementById('ob-demo');
        if (!demo) return;
        _obDemoStep = 0;
        _obRenderDemoStep(0);
        demo.classList.add('ob-visible');
        _obDemoAutoPlay();
    }, 3200);
})();

function _obRenderDemoStep(step) {
    // 切换幕
    for (var i = 0; i < _obDemoTotal; i++) {
        var s = document.getElementById('ob-scene-' + i);
        if (s) s.classList.toggle('ob-scene-active', i === step);
    }
    // 切换进度点
    for (var j = 0; j < _obDemoTotal; j++) {
        var d = document.getElementById('ob-ddot-' + j);
        if (d) d.classList.toggle('ob-ddot-active', j === step);
    }
    // 更新按钮文字
    var nextBtn = document.getElementById('ob-demo-next');
    if (nextBtn) nextBtn.textContent = (step === _obDemoTotal - 1) ? '开始使用' : '下一步';
    // 更新标题
    var label = document.getElementById('ob-demo-step-label');
    if (label) label.textContent = (step + 1) + ' / ' + _obDemoTotal;
}

// 每2.5秒自动推进（到最后一幕停下，等用户点「开始使用」）
function _obDemoAutoPlay() {
    if (_obDemoTimer) clearInterval(_obDemoTimer);
    _obDemoTimer = setInterval(function() {
        if (_obDemoStep >= _obDemoTotal - 1) {
            // 已经是最后一幕，停止自动播放，等用户主动点「开始使用」
            clearInterval(_obDemoTimer);
            return;
        }
        _obDemoStep++;
        _obRenderDemoStep(_obDemoStep);
    }, 2500);
}

// 手动点「下一步 / 开始使用」
function obDemoNext() {
    if (_obDemoTimer) clearInterval(_obDemoTimer);
    _obDemoStep++;
    if (_obDemoStep >= _obDemoTotal) {
        obDone();
    } else {
        _obRenderDemoStep(_obDemoStep);
        // 最后一幕不再重启自动播放，等用户主动点「开始使用」
        if (_obDemoStep < _obDemoTotal - 1) {
            _obDemoAutoPlay();
        }
    }
}

function obDone() {
    if (_obDemoTimer) clearInterval(_obDemoTimer);
    localStorage.setItem(OB_STORAGE_KEY, '1');
    var demo = document.getElementById('ob-demo');
    if (demo) {
        demo.style.opacity = '0';
        demo.style.pointerEvents = 'none';
        setTimeout(function() { demo.style.display = 'none'; }, 350);
    }
}

// 空钩子（业务代码里有调用，保留避免报错）
function obOnEraConfirmed() {}
function obOnStep4Shown() {}
function obOnBioGenerated() {}
function obOnCharacterSaved() {}
function obOnCompareShown() {}

// 对比角色按钮：平滑滚到「已保存的角色」区域（不切步骤）
function goToSavedForCompare() {
    var savedSection = document.getElementById('saved-characters-section');
    if (savedSection && savedSection.style.display !== 'none') {
        savedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showToast('请先保存角色，再进行对比');
    }
}

// 人物小传页箭头：滚到「保存角色」按钮
function scrollToSaved() {
    var btn = document.getElementById('save-char-btn');
    if (btn) {
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ==================== 人物小传下拉箭头 ====================
function _initBioScrollArrow() {
    var arrow = document.getElementById('bio-scroll-arrow');
    if (!arrow) return;
    // 监听页面滚动：有内容时显示，接近底部时隐藏
    var _scrollHandler = function() {
        var btn = document.getElementById('save-char-btn');
        if (!btn) { arrow.classList.add('hidden'); return; }
        var rect = btn.getBoundingClientRect();
        if (rect.top <= window.innerHeight) {
            // 保存按钮已进入视口，隐藏箭头
            arrow.classList.add('hidden');
        }
    };
    window.addEventListener('scroll', _scrollHandler, { passive: true });
}

// 步骤5显示时初始化箭头
var _origShowStep = showStep;
// 注：不覆盖showStep，而是在generateFinalBio完成后直接调用
function _showBioScrollArrow() {
    var arrow = document.getElementById('bio-scroll-arrow');
    if (!arrow) return;
    setTimeout(function() {
        // 只要 action-bar 不在视口内，就显示箭头
        var btn = document.getElementById('save-char-btn');
        if (btn) {
            var rect = btn.getBoundingClientRect();
            // 保存按钮不在视口内（底部不可见），才显示引导箭头
            if (rect.top > window.innerHeight) {
                arrow.classList.remove('hidden');
            }
        } else {
            arrow.classList.remove('hidden');
        }
        _initBioScrollArrow();
    }, 500);
}
// 挂到 generateFinalBio 完成后（已有钩子位置）
// 在 obOnBioGenerated 里调用（虽然现在是空函数，但我们直接在 generateFinalBio 里额外处理）

