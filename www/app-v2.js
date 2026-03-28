/**
 * 紫微斗数时代差异化版 v2.0 主程序(增强版)
 * 编剧级别的人物小传生成
 */

// ==================== 全局状态 ====================

/**
 * 格式化 Markdown 文本为 HTML
 */
function formatMarkdown(text) {
    if (!text) return '';

    return text
        // 标题
        .replace(/^### (.*)$/gm, '<h4>$1</h4>')
        .replace(/^## (.*)$/gm, '<h3>$1</h3>')
        .replace(/^# (.*)$/gm, '<h2>$1</h2>')
        // 加粗
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 列表
        .replace(/^- (.*)$/gm, '<li>$1</li>')
        // 换行
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

// ==================== 全局状态 ====================

const appState = {
    currentStep: 1,
    characterType: null,      // 角色类型：leader, strategist, warrior, artist, mediator, socialite
    coreTraits: [],          // 核心特质（2-3个）
    actionStyle: null,       // 行动风格
    dimensions: {            // 性格维度滑块
        introversion: 50,
        emotional: 50,
        strict: 50,
        stability: 50
    },
    useBirthTime: false,     // 是否使用出生时间微调
    birthInfo: {
        year: null,
        month: null,
        day: null,
        timePeriod: null
    },
    eightAttributes: {},     // 8个细致属性
    skipEightAttributes: false, // 是否跳过8属性选择
    chartData: null,
    characterData: null,
    savedCharacters: []
};

// ==================== 工具函数 ====================

/**
 * 从数组中随机选择一个元素
 */
function randomPick(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return array;
    }
    return array[Math.floor(Math.random() * array.length)];
}

// ==================== 角色类型映射到紫微斗数 ====================

const CHARACTER_TYPE_TO_STARS = {
    'leader': ['紫微', '天府', '太阳'],          // 领导者
    'strategist': ['天机', '天梁', '天相'],      // 谋略家
    'warrior': ['七杀', '武曲', '破军'],          // 开创者
    'artist': ['天同', '太阴', '廉贞'],          // 艺术家
    'mediator': ['天相', '天梁', '天同'],        // 协调者
    'socialite': ['贪狼', '廉贞', '太阳']        // 社交达人
};

const CORE_TRAITS_MAPPING = {
    // 领导者特质
    '威严': '紫微',
    '稳重': '天府',
    '权威': '紫微',

    // 谋略家特质
    '智慧': '天机',
    '洞察': '天机',
    '谨慎': '天相',

    // 开创者特质
    '勇敢': '七杀',
    '果断': '武曲',
    '冒险': '破军',

    // 艺术家特质
    '感性': '太阴',
    '创意': '廉贞',
    '温柔': '天同',

    // 协调者特质
    '温和': '天同',
    '平衡': '天相',
    '包容': '天府',

    // 社交达人特质
    '魅力': '贪狼',
    '交际': '贪狼',
    '热情': '太阳'
};

const ACTION_STYLE_TO_PATTERNS = {
    'direct': ['七杀独坐', '破军独坐'],                    // 直接行动
    'planning': ['天机独坐', '天梁独坐'],                // 精心策划
    'adaptive': ['天同独坐', '太阴独坐'],                // 灵活应变
    'cautious': ['天府独坐', '天相独坐'],                // 谨慎保守
    'bold': ['紫微破军', '武曲贪狼'],                  // 冒险突破
    'cooperative': ['天同太阴', '紫微天相']               // 团队协作
};

// ==================== 8个细致属性选择 ====================

/**
 * 初始化8属性选择步骤
 */
function initStep6_8Attributes() {
    const attributesSection = document.getElementById('step-6-attributes');
    if (!attributesSection) return;

    // 8个属性维度
    const attributes = [
        {
            id: 'appearance',
            name: '外貌特征',
            options: ['威严霸气', '温和儒雅', '锐利干练', '柔和亲和', '独特个性', '普通平凡']
        },
        {
            id: 'speech',
            name: '说话方式',
            options: ['简洁有力', '温和委婉', '热情洋溢', '沉稳冷静', '幽默风趣', '寡言少语']
        },
        {
            id: 'behavior',
            name: '行为习惯',
            options: ['雷厉风行', '深思熟虑', '随性而为', '谨慎小心', '有条不紊', '自由散漫']
        },
        {
            id: 'emotion',
            name: '情感表达',
            options: ['外露直白', '内敛含蓄', '丰富多变', '稳定平和', '理性克制', '感性冲动']
        },
        {
            id: 'social',
            name: '社交风格',
            options: ['主动热情', '被动等待', '理性交往', '感性相交', '圆滑世故', '直率真诚']
        },
        {
            id: 'response',
            name: '应对危机',
            options: ['冷静分析', '果断行动', '寻求帮助', '逃避回避', '慌乱无措', '坚定抵抗']
        },
        {
            id: 'learning',
            name: '学习适应',
            options: ['快速学习', '稳步积累', '依赖经验', '善于应变', '固执己见', '灵活调整']
        },
        {
            id: 'growth',
            name: '成长方向',
            options: ['追求成功', '追求自由', '追求安稳', '追求真理', '追求情感', '追求平衡']
        }
    ];

    // 生成HTML
    let html = '<div class="attributes-8-grid">';
    attributes.forEach(attr => {
        html += `
            <div class="attribute-group" data-attr="${attr.id}">
                <div class="attribute-label">${attr.name}</div>
                <div class="attribute-options">
                    ${attr.options.map(opt => `
                        <div class="attribute-option" data-value="${opt}">${opt}</div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    html += '</div>';

    // 添加跳过选项
    html += `
        <div class="skip-attributes-section">
            <label class="checkbox-label">
                <input type="checkbox" id="skip-8-attributes">
                <span>跳过8属性选择，让系统自动生成</span>
            </label>
        </div>
    `;

    attributesSection.innerHTML = html;

    // 绑定事件
    attributesSection.querySelectorAll('.attribute-option').forEach(option => {
        option.addEventListener('click', function() {
            const group = this.closest('.attribute-group');
            const attrId = group.dataset.attr;

            // 移除同组其他选中状态
            group.querySelectorAll('.attribute-option').forEach(opt => {
                opt.classList.remove('selected');
            });

            // 添加选中状态
            this.classList.add('selected');

            // 保存到state
            if (!appState.eightAttributes) {
                appState.eightAttributes = {};
            }
            appState.eightAttributes[attrId] = this.dataset.value;
        });
    });

    // 跳过选项
    document.getElementById('skip-8-attributes').addEventListener('change', function(e) {
        appState.skipEightAttributes = e.target.checked;
        if (e.target.checked) {
            attributesSection.querySelectorAll('.attribute-options').forEach(options => {
                options.style.opacity = '0.5';
                options.style.pointerEvents = 'none';
            });
        } else {
            attributesSection.querySelectorAll('.attribute-options').forEach(options => {
                options.style.opacity = '1';
                options.style.pointerEvents = 'auto';
            });
        }
    });
}

// ==================== 步骤1：角色类型选择 ====================

function initStep1() {
    const typeCards = document.querySelectorAll('.character-type-card');
    typeCards.forEach(card => {
        card.addEventListener('click', () => {
            typeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            appState.characterType = card.dataset.type;
            loadCoreTraits(card.dataset.type);
        });
    });
}

function loadCoreTraits(characterType) {
    const grid = document.getElementById('core-traits-grid');
    const traits = getCoreTraitsByType(characterType);

    grid.innerHTML = traits.map(trait => `
        <div class="trait-card" data-trait="${trait.name}" onclick="toggleCoreTrait('${trait.name}')">
            <div class="trait-name">${trait.name}</div>
            <div class="trait-desc">${trait.desc}</div>
        </div>
    `).join('');

    updateSelectedTraitsCount();
}

function getCoreTraitsByType(characterType) {
    const traitsByType = {
        'leader': [
            { name: '威严', desc: '气场强大，不怒自威' },
            { name: '果断', desc: '决策快速，不犹豫' },
            { name: '责任感', desc: '承担责任，有担当' },
            { name: '高傲', desc: '眼界高，择友挑剔' },
            { name: '统御', desc: '善于管理和统筹' },
            { name: '独立', desc: '不依赖他人，自主性强' }
        ],
        'strategist': [
            { name: '智慧', desc: '思维敏捷，学习能力强' },
            { name: '洞察', desc: '看透本质，有预见性' },
            { name: '谨慎', desc: '小心谨慎，不冒风险' },
            { name: '理性', desc: '以逻辑为主，少情绪' },
            { name: '谋略', desc: '善于策划和布局' },
            { name: '变通', desc: '灵活应变，不固执' }
        ],
        'warrior': [
            { name: '勇敢', desc: '无畏无惧，敢于挑战' },
            { name: '刚毅', desc: '性格坚毅，不屈服' },
            { name: '果断', desc: '说干就干，执行力强' },
            { name: '冒险', desc: '敢于冒险，不循规蹈矩' },
            { name: '开创', desc: '善于开创，不畏困难' },
            { name: '霸气', desc: '气势逼人，有压迫感' }
        ],
        'artist': [
            { name: '感性', desc: '情感丰富，容易动情' },
            { name: '创意', desc: '有独特审美和创造力' },
            { name: '温柔', desc: '性情温柔，善解人意' },
            { name: '细腻', desc: '注重细节，追求完美' },
            { name: '神秘', desc: '内心复杂，有深度' },
            { name: '敏感', desc: '感知敏锐，容易受伤' }
        ],
        'mediator': [
            { name: '温和', desc: '性情温和，不喜冲突' },
            { name: '平衡', desc: '追求平衡，不走极端' },
            { name: '包容', desc: '心胸宽广，能容人' },
            { name: '协调', desc: '善于调解，化解矛盾' },
            { name: '得体', desc: '行事得体，分寸感好' },
            { name: '辅佐', desc: '善于辅助，做好副手' }
        ],
        'socialite': [
            { name: '魅力', desc: '有吸引力，招人喜欢' },
            { name: '交际', desc: '善于社交，朋友众多' },
            { name: '热情', desc: '充满活力，感染力强' },
            { name: '大方', desc: '不拘小节，乐于分享' },
            { name: '适应', desc: '环境适应能力强' },
            { name: '欲望', desc: '追求欲望，有野心' }
        ]
    };

    return traitsByType[characterType] || traitsByType['leader'];
}

function toggleCoreTrait(trait) {
    const index = appState.coreTraits.indexOf(trait);

    if (index > -1) {
        appState.coreTraits.splice(index, 1);
    } else {
        if (appState.coreTraits.length < 3) {
            appState.coreTraits.push(trait);
        } else {
            alert('最多选择3个核心特质');
            return;
        }
    }

    // 更新UI
    document.querySelectorAll('#core-traits-grid .trait-card').forEach(card => {
        card.classList.remove('selected');
        if (appState.coreTraits.includes(card.dataset.trait)) {
            card.classList.add('selected');
        }
    });

    updateSelectedTraitsCount();
}

function updateSelectedTraitsCount() {
    document.getElementById('selected-traits-count').textContent = appState.coreTraits.length;
}

// ==================== 步骤3：行动风格选择 ====================

function initStep3() {
    const styleCards = document.querySelectorAll('.action-style-card');
    styleCards.forEach(card => {
        card.addEventListener('click', () => {
            styleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            appState.actionStyle = card.dataset.style;
        });
    });
}

// ==================== 步骤4：性格维度 ====================

function initStep4() {
    const sliders = document.querySelectorAll('.range-slider');
    sliders.forEach((slider, index) => {
        slider.addEventListener('input', (e) => {
            const values = ['introversion', 'emotional', 'strict', 'stability'];
            appState.dimensions[values[index]] = parseInt(e.target.value);
        });
    });

    const skipCheckbox = document.getElementById('skip-dimensions');
    skipCheckbox.addEventListener('change', (e) => {
        sliders.forEach(slider => {
            slider.disabled = e.target.checked;
        });
    });
}

// ==================== 步骤5：精确定位 ====================

function initStep5() {
    // 切换出生时间显示
    const birthTimeCheckbox = document.getElementById('use-birth-time');
    const birthTimeForm = document.getElementById('birth-time-form');

    birthTimeCheckbox.addEventListener('change', (e) => {
        appState.useBirthTime = e.target.checked;
        birthTimeForm.style.display = e.target.checked ? 'block' : 'none';

        if (e.target.checked) {
            initBirthTimeForm();
        }
    });

    // 更新角色预览
    updateCharacterPreview();
}

function initBirthTimeForm() {
    const timeCards = document.querySelectorAll('#birth-time-form .time-card');
    timeCards.forEach(card => {
        card.addEventListener('click', () => {
            timeCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            appState.birthInfo.timePeriod = card.dataset.time;
        });
    });
}

function updateCharacterPreview() {
    const preview = document.getElementById('character-preview');
    const typeNames = {
        'leader': '领导者',
        'strategist': '谋略家',
        'warrior': '开创者',
        'artist': '艺术家',
        'mediator': '协调者',
        'socialite': '社交达人'
    };

    const styleNames = {
        'direct': '直接行动型',
        'planning': '精心策划型',
        'adaptive': '灵活应变型',
        'cautious': '谨慎保守型',
        'bold': '冒险突破型',
        'cooperative': '团队协作型'
    };

    let html = `
        <div class="preview-item">
            <strong>角色类型：</strong>${typeNames[appState.characterType] || '未选择'}
        </div>
        <div class="preview-item">
            <strong>核心特质：</strong>${appState.coreTraits.join('、') || '未选择'}
        </div>
        <div class="preview-item">
            <strong>行动风格：</strong>${styleNames[appState.actionStyle] || '未选择'}
        </div>
    `;

    preview.innerHTML = html;
}

// ==================== 生成角色 ====================

function generateCharacter() {
    // 1. 根据角色类型和核心特质推断主星
    const mainStar = inferMainStar();

    // 2. 根据行动风格推断格局
    const pattern = inferPattern();

    // 3. 如果有出生时间，使用出生时间微调
    let chartData;
    if (appState.useBirthTime && appState.birthInfo.timePeriod) {
        // TODO: 调用精细排盘引擎
        chartData = generateFineChart();
    } else {
        // 使用推断的结果生成命盘
        chartData = generateInferredChart(mainStar, pattern);
    }

    appState.chartData = chartData;

    // 4. 生成人物小传
    const characterBio = generateCharacterBio(chartData);

    appState.characterData = {
        chartData,
        bio: characterBio
    };

    // 5. 显示结果
    showResults();
}

function inferMainStar() {
    // 从角色类型匹配主星
    const possibleStars = CHARACTER_TYPE_TO_STARS[appState.characterType] || ['紫微'];

    // 从核心特质进一步缩小范围
    let matchedStar = possibleStars[0];
    let maxMatches = 0;

    for (const star of possibleStars) {
        const starTraits = getTraitsForStar(star);
        const matches = appState.coreTraits.filter(trait =>
            starTraits.some(t => t.name.includes(trait))
        ).length;

        if (matches > maxMatches) {
            maxMatches = matches;
            matchedStar = star;
        }
    }

    return matchedStar;
}

function inferPattern() {
    const patterns = ACTION_STYLE_TO_PATTERNS[appState.actionStyle] || ['紫微独坐'];
    return randomPick(patterns);
}

function generateInferredChart(mainStar, pattern) {
    return {
        mainStars: [mainStar],
        pattern: pattern,
        birthTime: null,
        method: 'inferred' // 标记为推断得出
    };
}

function showResults() {
    // 跳转到结果页面（这里需要根据实际需求调整）
    // 简单实现：显示一个弹窗或跳转到新页面
    alert(`角色已生成！\n主星：${appState.chartData.mainStars.join('、')}\n格局：${appState.chartData.pattern}`);

    // TODO: 实现完整的结果展示页面
}

    if (mode === 'birth') {
        birthContent.style.display = 'block';
        reverseContent.style.display = 'none';
        appState.chartMode = 'birth';
    } else {
        birthContent.style.display = 'none';
        reverseContent.style.display = 'block';
        appState.chartMode = 'reverse';
        initReverseMode();
    }
}

// 反向命盘状态
let reverseState = {
    currentStep: 1,
    selectedMainStar: null,
    selectedTraits: [],
    selectedPattern: null
};

/**
 * 初始化反向命盘模式
 */
function initReverseMode() {
    loadMainStars();
    reverseState = {
        currentStep: 1,
        selectedMainStar: null,
        selectedTraits: [],
        selectedPattern: null
    };
}

/**
 * 加载主星选项
 */
function loadMainStars() {
    const grid = document.getElementById('main-stars-grid');
    const stars = [
        { name: '紫微', desc: '帝王之象，威严霸气，有领导才能' },
        { name: '天机', desc: '智慧之星，思维敏捷，善谋划' },
        { name: '太阳', desc: '光明磊落，热情大方，男子气质' },
        { name: '武曲', desc: '刚毅果断，财运之星，执行力强' },
        { name: '天同', desc: '温和福气，性情平顺，善于协调' },
        { name: '廉贞', desc: '桃花之星，感情丰富，有艺术天分' },
        { name: '天府', desc: '南斗帝王，稳重踏实，有福气' },
        { name: '太阴', desc: '阴柔之美，感情细腻，女性特质' },
        { name: '贪狼', desc: '桃花主星，欲望强烈，善于交际' },
        { name: '巨门', desc: '口舌之星，思辨能力强，适合研究' },
        { name: '天相', desc: '印星辅助，温和得体，善辅佐' },
        { name: '天梁', desc: '监察之星，正直刚正，有责任感' },
        { name: '七杀', desc: '将星霸气，行动力强，适合开创' },
        { name: '破军', desc: '破坏重建，变化激烈，敢于冒险' }
    ];

    grid.innerHTML = stars.map(star => `
        <div class="star-card" data-star="${star.name}" onclick="selectMainStar('${star.name}')">
            <div class="star-name">${star.name}</div>
            <div class="star-desc">${star.desc}</div>
        </div>
    `).join('');
}

/**
 * 选择主星
 */
function selectMainStar(star) {
    reverseState.selectedMainStar = star;

    // 更新UI
    document.querySelectorAll('.star-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.star === star) {
            card.classList.add('selected');
        }
    });

    // 延迟后进入下一步
    setTimeout(() => {
        document.getElementById('reverse-step-2').style.display = 'block';
        loadTraits(star);
    }, 300);
}

/**
 * 加载性格特质
 */
function loadTraits(star) {
    const grid = document.getElementById('traits-grid');

    // 根据主星提供相关的性格特质
    const traits = getTraitsForStar(star);

    grid.innerHTML = traits.map(trait => `
        <div class="trait-card" data-trait="${trait.name}" onclick="toggleTrait('${trait.name}')">
            <div class="trait-name">${trait.name}</div>
            <div class="trait-desc">${trait.desc}</div>
        </div>
    `).join('');
}

/**
 * 根据主星获取性格特质
 */
function getTraitsForStar(star) {
    const traitsMap = {
        '紫微': [
            { name: '威严', desc: '有权威感，不怒自威，受人敬畏' },
            { name: '领导力', desc: '天生的领导者，善于决策和统筹' },
            { name: '自尊心强', desc: '看重面子，需要被尊重和认可' },
            { name: '责任感', desc: '承担重任，不轻易推诿' },
            { name: '高傲', desc: '心高气傲，眼界高，择友挑剔' },
            { name: '耳根软', desc: '容易被他人影响，缺乏主见' }
        ],
        '天机': [
            { name: '智慧', desc: '思维敏捷，反应快速，学习能力强' },
            { name: '好奇心', desc: '对新鲜事物充满兴趣，求知欲强' },
            { name: '多变', desc: '想法多变，难以专注，容易改变' },
            { name: '理性', desc: '以逻辑分析为主，少情绪化决策' },
            { name: '善谋略', desc: '善于策划和布局，适合幕僚角色' },
            { name: '多愁善感', desc: '神经过敏，容易想太多' }
        ],
        '太阳': [
            { name: '热情', desc: '充满活力，积极向上，感染力强' },
            { name: '大方', desc: '不拘小节，乐于分享和帮助他人' },
            { name: '直率', desc: '有话直说，不隐瞒，光明磊落' },
            { name: '正义感', desc: '嫉恶如仇，维护公平，有担当' },
            { name: '博爱', desc: '心怀天下，关心公众和他人' },
            { name: '多劳心', desc: '操劳过度，付出多但收获不一' }
        ],
        '武曲': [
            { name: '果断', desc: '决断力强，不拖泥带水，执行力好' },
            { name: '务实', desc: '注重实际，脚踏实地，不务虚' },
            { name: '执行力', desc: '行动力强，说到做到，信守承诺' },
            { name: '刚毅', desc: '性格坚毅，不易妥协，坚持原则' },
            { name: '财缘', desc: '财运好，善于理财和积累财富' },
            { name: '刚愎自用', desc: '固执己见，不容易接受建议' }
        ],
        '天同': [
            { name: '温和', desc: '性情温和，不喜冲突，容易相处' },
            { name: '福气', desc: '一生平顺，少波折，有贵人相助' },
            { name: '协调', desc: '善于调解，平衡各方，化解矛盾' },
            { name: '随和', desc: '容易相处，不设防，心胸开阔' },
            { name: '享乐', desc: '懂得享受生活，不追求权力和财富' },
            { name: '懒散', desc: '缺乏动力，容易坐享其成' }
        ],
        '廉贞': [
            { name: '艺术感', desc: '对美有独特感知，有创意和审美' },
            { name: '感情丰富', desc: '情绪细腻，容易动情，感情多变' },
            { name: '神秘', desc: '内心复杂，难以捉摸，有深度' },
            { name: '魅力', desc: '有吸引力，招人喜欢，桃花旺' },
            { name: '好胜', desc: '争强好胜，不服输，有野心' },
            { name: '复杂', desc: '内心矛盾，情感复杂，难以理解' }
        ],
        '天府': [
            { name: '稳重', desc: '性格沉稳，不易冲动，值得信赖' },
            { name: '踏实', desc: '做事踏实，一步一个脚印，不急躁' },
            { name: '包容', desc: '心胸宽广，能容人，不记仇' },
            { name: '福气', desc: '有福缘，生活安稳，财库丰盈' },
            { name: '保守', desc: '喜欢稳定，不喜欢冒险和变化' },
            { name: '守成', desc: '善于守成，但不善于开创' }
        ],
        '太阴': [
            { name: '温柔', desc: '性情温柔，善解人意，有母性' },
            { name: '敏感', desc: '感知敏锐，容易受伤，情感细腻' },
            { name: '内敛', desc: '不善表达，内心丰富，善于倾听' },
            { name: '细致', desc: '注重细节，追求完美，做事精准' },
            { name: '财缘', desc: '财运好，善于理财，财运细腻' },
            { name: '优柔', desc: '性格优柔寡断，容易犹豫不决' }
        ],
        '贪狼': [
            { name: '交际', desc: '善于社交，朋友众多，人脉广' },
            { name: '欲望强', desc: '追求欲望，不知足，有野心' },
            { name: '适应力', desc: '环境适应能力强，善于融入' },
            { name: '魅力', desc: '有吸引异性的魅力，桃花旺' },
            { name: '多才多艺', desc: '才艺丰富，善于表现和创造' },
            { name: '贪得无厌', desc: '欲望过度，容易贪多不消化' }
        ],
        '巨门': [
            { name: '辩才', desc: '口才好，善于辩论，表达力强' },
            { name: '思辨', desc: '思考深入，逻辑清晰，有洞察力' },
            { name: '怀疑', desc: '不轻易信任，多疑虑，谨慎' },
            { name: '研究', desc: '适合钻研，做学术研究，探索精神' },
            { name: '是非', desc: '口舌是非多，容易招小人' },
            { name: '阴暗', desc: '内心阴暗，不阳光，多疑' }
        ],
        '天相': [
            { name: '温和', desc: '性格温和，不尖锐，容易相处' },
            { name: '辅佐', desc: '善于辅助，做好副手，服务精神' },
            { name: '得体', desc: '行事得体，分寸感好，知进退' },
            { name: '平衡', desc: '追求平衡，不走极端，中庸之道' },
            { name: '谨慎', desc: '小心谨慎，不冒险，稳妥行事' },
            { name: '优柔', desc: '过于谨慎，容易优柔寡断' }
        ],
        '天梁': [
            { name: '正直', desc: '为人正直，不偏私，有原则' },
            { name: '负责', desc: '有责任感，敢担当，值得信赖' },
            { name: '严厉', desc: '对自己他人要求严格，高标准' },
            { name: '智慧', desc: '有智慧，善于指导，受人尊重' },
            { name: '荫庇', desc: '有贵人荫庇，逢凶化吉' },
            { name: '清高', desc: '孤芳自赏，不随波逐流' }
        ],
        '七杀': [
            { name: '霸气', desc: '气势逼人，有压迫感，威严' },
            { name: '行动', desc: '行动力强，不犹豫，说到做到' },
            { name: '开创', desc: '适合开创，不畏困难，敢于冒险' },
            { name: '刚强', desc: '性格刚强，不易屈服，有韧性' },
            { name: '冲动', desc: '冲动鲁莽，容易招灾祸' },
            { name: '冒险', desc: '敢于冒险，不循规蹈矩，敢于挑战' }
        ],
        '破军': [
            { name: '变化', desc: '变化频繁，难以预测，充满变数' },
            { name: '破坏', desc: '有破坏力，打破现状，敢于革新' },
            { name: '重建', desc: '破后而立，重新开始，浴火重生' },
            { name: '冒险', desc: '敢于冒险，不循规蹈矩，勇于挑战' },
            { name: '消耗', desc: '消耗大，元气消耗，需要时间恢复' },
            { name: '改革', desc: '改革能力强，善于破旧立新' }
        ]
    };

    return traitsMap[star] || traitsMap['紫微'];
}

/**
 * 切换性格特质
 */
function toggleTrait(trait) {
    const index = reverseState.selectedTraits.indexOf(trait);

    if (index > -1) {
        reverseState.selectedTraits.splice(index, 1);
    } else {
        if (reverseState.selectedTraits.length < 3) {
            reverseState.selectedTraits.push(trait);
        } else {
            alert('最多选择3个性格特质');
            return;
        }
    }

    // 更新UI
    document.querySelectorAll('.trait-card').forEach(card => {
        card.classList.remove('selected');
        if (reverseState.selectedTraits.includes(card.dataset.trait)) {
            card.classList.add('selected');
        }
    });

    // 选择完成后进入下一步
    if (reverseState.selectedTraits.length >= 2) {
        setTimeout(() => {
            document.getElementById('reverse-step-3').style.display = 'block';
            loadPatterns();
            document.getElementById('reverse-actions').style.display = 'flex';
        }, 300);
    }
}

/**
 * 加载命盘格局
 */
function loadPatterns() {
    const grid = document.getElementById('patterns-grid');

    // 根据主星提供相关格局
    const patterns = getPatternsForStar(reverseState.selectedMainStar);

    grid.innerHTML = patterns.map(pattern => `
        <div class="pattern-card" data-pattern="${pattern.name}" onclick="selectPattern('${pattern.name}')">
            <div class="pattern-name">${pattern.name}</div>
            <div class="pattern-composition">主星：${pattern.mainStar}</div>
            <div class="pattern-desc">${pattern.desc}</div>
        </div>
    `).join('');
}

/**
 * 根据主星获取格局
 */
function getPatternsForStar(star) {
    const patternsMap = {
        '紫微': [
            { name: '紫微独坐', mainStar: '紫微', desc: '孤君独坐，凡事亲力亲为，成就有限' },
            { name: '紫微天府', mainStar: '紫微+天府', desc: '帝星加财库，既有权力又有财富，富贵双全' },
            { name: '紫微贪狼', mainStar: '紫微+贪狼', desc: '帝星加桃花，欲望强烈，名利双收' },
            { name: '紫微天相', mainStar: '紫微+天相', desc: '帝星加印星，谨慎领导，稳步上升' },
            { name: '君臣庆会格', mainStar: '紫微+左辅+右弼', desc: '雄才大略，既有个人能力又有统御力' }
        ],
        '天机': [
            { name: '天机独坐', mainStar: '天机', desc: '聪明机智，谋士之相，善策划' },
            { name: '机月同梁格', mainStar: '天机+太阴+天梁', desc: '清贵之格，智慧过人，适合文职' }
        ],
        '太阳': [
            { name: '太阳独坐', mainStar: '太阳', desc: '光明磊落，公众人物，名声显赫' },
            { name: '巨门太阳', mainStar: '巨门+太阳', desc: '口才加光明，正义感最强，适合律师政客' },
            { name: '日月双璧格', mainStar: '太阳+太阴', desc: '日月同辉，阴阳调和，事业家庭双全' }
        ],
        '武曲': [
            { name: '武曲独坐', mainStar: '武曲', desc: '财星，果断刚毅，财运起伏' },
            { name: '武曲贪狼', mainStar: '武曲+贪狼', desc: '财星加欲望，冒险求财，大起大落' }
        ],
        '天同': [
            { name: '天同独坐', mainStar: '天同', desc: '福气深厚，温和享乐，知足常乐' }
        ],
        '廉贞': [
            { name: '廉贞独坐', mainStar: '廉贞', desc: '复杂好胜，次桃花，艺术成就高' }
        ],
        '天府': [
            { name: '天府独坐', mainStar: '天府', desc: '稳重保守，善于守成，财库丰盈' },
            { name: '紫微天府', mainStar: '天府+紫微', desc: '南斗帝王，富贵双全，成就极高' }
        ],
        '太阴': [
            { name: '太阴独坐', mainStar: '太阴', desc: '温柔内敛，母性特质，财运细腻' },
            { name: '日月双璧格', mainStar: '太阴+太阳', desc: '日月同辉，阴阳调和' }
        ],
        '贪狼': [
            { name: '贪狼独坐', mainStar: '贪狼', desc: '多才多艺，欲望强烈，桃花旺' },
            { name: '七杀贪狼', mainStar: '七杀+贪狼', desc: '勇猛加欲望，冒险求财' },
            { name: '破军贪狼', mainStar: '破军+贪狼', desc: '变动加欲望，创新求变' },
            { name: '紫微贪狼', mainStar: '紫微+贪狼', desc: '帝星加桃花，欲望强烈' }
        ],
        '巨门': [
            { name: '巨门独坐', mainStar: '巨门', desc: '口才好，研究能力强，是非分明' },
            { name: '巨门太阳', mainStar: '巨门+太阳', desc: '口才加光明，正义感最强' }
        ],
        '天相': [
            { name: '天相独坐', mainStar: '天相', desc: '印星，谨慎服务，协调能力强' },
            { name: '紫微天相', mainStar: '紫微+天相', desc: '帝星加印星，谨慎领导' }
        ],
        '天梁': [
            { name: '天梁独坐', mainStar: '天梁', desc: '清高正直，荫星解厄，有威望' }
        ],
        '七杀': [
            { name: '七杀独坐', mainStar: '七杀', desc: '勇猛无比，将星特质最明显' },
            { name: '七杀破军', mainStar: '七杀+破军', desc: '开创力最强，冲动冒险' },
            { name: '七杀贪狼', mainStar: '七杀+贪狼', desc: '勇猛加欲望，冒险求财' }
        ],
        '破军': [
            { name: '破军独坐', mainStar: '破军', desc: '破坏开创，变动中求发展' },
            { name: '七杀破军', mainStar: '七杀+破军', desc: '开创力最强，冲动冒险' },
            { name: '破军贪狼', mainStar: '破军+贪狼', desc: '变动加欲望，创新求变' }
        ]
    };

    return patternsMap[star] || patternsMap['紫微'];
}

/**
 * 选择格局
 */
function selectPattern(pattern) {
    reverseState.selectedPattern = pattern;

    // 更新UI
    document.querySelectorAll('.pattern-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.pattern === pattern) {
            card.classList.add('selected');
        }
    });
}

/**
 * 反向流程上一步
 */
function reversePrevStep() {
    if (reverseState.currentStep === 2) {
        // 从性格特质回到主星
        document.getElementById('reverse-step-2').style.display = 'none';
        reverseState.selectedTraits = [];
        reverseState.currentStep = 1;
    } else if (reverseState.currentStep === 3) {
        // 从格局回到性格特质
        document.getElementById('reverse-step-3').style.display = 'none';
        document.getElementById('reverse-actions').style.display = 'none';
        reverseState.selectedPattern = null;
        reverseState.currentStep = 2;
    }
}

/**
 * 确认反向命盘
 */
function confirmReverseChart() {
    if (!reverseState.selectedMainStar) {
        alert('请选择主星');
        return;
    }
    if (reverseState.selectedTraits.length === 0) {
        alert('请至少选择1个性格特质');
        return;
    }

    // 生成命盘数据
    const chartData = generateChartFromReverse();

    appState.chartData = chartData;

    // 继续下一步
    appState.currentStep = 3;
    updateStepUI(appState.currentStep);
}

/**
 * 根据反向选择生成命盘
 */
function generateChartFromReverse() {
    const eras = {
        ancient: '古代',
        modern: '近代',
        contemporary: '现代'
    };

    // 根据主星和特质生成命盘
    const pattern = {
        mainStars: [reverseState.selectedMainStar],
        auspiciousStars: [],
        malignantStars: []
    };

    const chartData = {
        era: appState.selectedEra,
        gender: appState.userInfo.gender,
        age: appState.userInfo.age,
        birthTime: {
            year: null,
            month: null,
            day: null,
            timePeriod: '反向确定',
            keCut: null
        },
        pattern: pattern,
        mainStars: pattern.mainStars,
        palaces: [],
        sanfangSizheng: {},
        sihua: {},
        palaceAnalysis: {},
        options: appState.selectedOptions,
        chartNumber: Math.floor(Math.random() * 288) + 1,
        reverseMode: true,
        selectedMainStar: reverseState.selectedMainStar,
        selectedTraits: reverseState.selectedTraits,
        selectedPattern: reverseState.selectedPattern
    };

    console.log('反向命盘生成成功:', chartData);

    return chartData;
}

/**
 * 反向选择上一步
 */
function reversePrevStep() {
    const currentStep = reverseState.currentStep;
    const steps = ['reverse-step-1', 'reverse-step-2', 'reverse-step-3'];

    if (currentStep > 1) {
        reverseState.currentStep--;
        document.getElementById(steps[currentStep]).style.display = 'none';
    }
}

/**
 * 根据时代获取对应的数组
 */
function getEraBasedData(dataMap, era) {
    const eraMap = {
        'ancient': 'ancient',
        'modern': 'modern',
        'contemporary': 'contemporary'
    };
    return dataMap[eraMap[era]] || dataMap['ancient'];
}

/**
 * 获取年龄中文标签
 */
function getAgeLabel(ageValue) {
    const ageMap = {
        'youth': '少年',
        'young': '青年',
        'middle': '中年',
        'old': '老年'
    };
    return ageMap[ageValue] || ageValue;
}

/**
 * 获取家庭背景中文标签
 */
function getFamilyLabel(familyValue) {
    return familyValue || '未定义';
}

/**
 * 获取职业中文标签
 */
function getCareerLabel(careerValue) {
    return careerValue || '未定义';
}

// ==================== 页面初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成,初始化UI...');
    initializeUI();
    updateStepUI(1);
    loadCoreTraits('leader'); // 默认加载领导者的特质
    initializeStep1(); // 初始化角色类型选择
});

/**
 * 初始化UI交互
 */
function initializeUI() {
    // 时代选择
    document.querySelectorAll('.era-card').forEach(card => {
        card.addEventListener('click', () => {
            selectEra(card.dataset.era);
        });
    });

    // 性别选择
    document.querySelectorAll('.option-card[data-group="gender"]').forEach(card => {
        card.addEventListener('click', () => {
            selectOption('gender', card.dataset.value);
        });
    });

    // 年龄选择
    document.querySelectorAll('.option-card[data-group="age"]').forEach(card => {
        card.addEventListener('click', () => {
            selectOption('age', card.dataset.value);
        });
    });

    // 时辰选择
    document.querySelectorAll('.time-card').forEach(card => {
        card.addEventListener('click', () => {
            selectTime(card.dataset.time);
        });
    });

    // 刻度选择
    document.querySelectorAll('.ke-card').forEach(card => {
        card.addEventListener('click', () => {
            selectKe(card.dataset.ke);
        });
    });

    console.log('UI初始化完成');
}

// ==================== 选择逻辑 ====================

/**
 * 选择时代
 */
function selectEra(era) {
    appState.selectedEra = era;
    
    // 更新UI
    document.querySelectorAll('.era-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.era === era) {
            card.classList.add('selected');
        }
    });

    // 加载对应时代的属性
    loadAttributesForEra(era);
    
    console.log('选择时代:', era);
}

/**
 * 选择选项(性别/年龄)
 */
function selectOption(group, value) {
    if (group === 'gender') {
        appState.userInfo.gender = value;
    } else if (group === 'age') {
        appState.userInfo.age = value;
    } else if (group === 'career') {
        appState.selectedOptions.career = value;
    } else if (group === 'family') {
        appState.selectedOptions.family = value;
    } else if (group === 'experience') {
        appState.selectedOptions.experience = value;
    } else if (group === 'personality') {
        // 性格可以多选
        const index = appState.selectedOptions.personality.indexOf(value);
        if (index > -1) {
            appState.selectedOptions.personality.splice(index, 1);
        } else {
            appState.selectedOptions.personality.push(value);
        }
    }

    // 更新UI
    document.querySelectorAll(`.option-card[data-group="${group}"]`).forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.value === value) {
            card.classList.add('selected');
        }
    });
    
    // 性格多选特殊处理
    if (group === 'personality') {
        appState.selectedOptions.personality.forEach(val => {
            const card = document.querySelector(`.option-card[data-group="personality"][data-value="${val}"]`);
            if (card) card.classList.add('selected');
        });
    }

    console.log(`选择${group}:`, value);
}

/**
 * 选择时辰
 */
function selectTime(time) {
    appState.userInfo.timePeriod = time;
    
    // 更新UI
    document.querySelectorAll('.time-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.time === time) {
            card.classList.add('selected');
        }
    });

    console.log('选择时辰:', time);
}

/**
 * 选择刻度
 */
function selectKe(ke) {
    appState.userInfo.keCut = ke;
    
    // 更新UI
    document.querySelectorAll('.ke-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.ke === ke) {
            card.classList.add('selected');
        }
    });

    console.log('选择刻度:', ke);
}

// ==================== 属性加载 ====================

/**
 * 根据时代加载属性选项
 */
function loadAttributesForEra(era) {
    const attributesSection = document.getElementById('attributes-section');
    if (!attributesSection) return;

    let eraName = '';
    let careerOptions = [];
    let familyOptions = [];
    let experienceOptions = [];

    // 根据时代获取对应的数据
    if (era === 'ancient') {
        eraName = '古代';
        careerOptions = [
            { value: '仕途官宦', title: '仕途官宦', desc: '科举为官,掌权一方' },
            { value: '商贾富豪', title: '商贾富豪', desc: '经商致富,财源广进' },
            { value: '文人学者', title: '文人学者', desc: '治学著述,传道授业' },
            { value: '军武将帅', title: '军武将帅', desc: '征战沙场,建功立业' },
            { value: '平民百姓', title: '平民百姓', desc: '耕田劳作,安居乐业' },
            { value: '权贵世家', title: '权贵世家', desc: '门第显赫,地位尊崇' },
            { value: '江湖人士', title: '江湖人士', desc: '闯荡江湖,行侠仗义' },
            { value: '宗教人士', title: '宗教人士', desc: '修道问佛,超然物外' }
        ];
        familyOptions = [
            { value: '皇室宗亲', title: '皇室宗亲', desc: '皇亲国戚,富贵荣华' },
            { value: '官宦世家', title: '官宦世家', desc: '世代为官,门第显赫' },
            { value: '富商巨贾', title: '富商巨贾', desc: '家财万贯,富甲一方' },
            { value: '乡绅地主', title: '乡绅地主', desc: '田连阡陌,衣食无忧' },
            { value: '贫寒农家', title: '贫寒农家', desc: '家徒四壁,生活艰辛' },
            { value: '小商小贩', title: '小商小贩', desc: '小本经营,勉强糊口' },
            { value: '孤苦伶仃', title: '孤苦伶仃', desc: '无亲无故,流落街头' },
            { value: '家仆下人', title: '家仆下人', desc: '服侍他人,地位低下' }
        ];
        experienceOptions = [
            { value: '一帆风顺', title: '一帆风顺', desc: '事事顺心,少有波折' },
            { value: '历经磨难', title: '历经磨难', desc: '艰难困苦,百折不挠' },
            { value: '大起大落', title: '大起大落', desc: '跌宕起伏,波澜壮阔' },
            { value: '闯荡江湖', title: '闯荡江湖', desc: '行走江湖,见多识广' },
            { value: '战乱流离', title: '战乱流离', desc: '战火纷飞,颠沛流离' },
            { value: '隐居山林', title: '隐居山林', desc: '远离尘世,潜心修行' },
            { value: '起义造反', title: '起义造反', desc: '揭竿而起,反抗暴政' },
            { value: '屡试不中', title: '屡试不中', desc: '科举落第,壮志难酬' },
            { value: '贬谪边疆', title: '贬谪边疆', desc: '遭贬谪居,远走边疆' },
            { value: '继承家业', title: '继承家业', desc: '承袭家业,光宗耀祖' }
        ];
    } else if (era === 'modern') {
        eraName = '近代';
        careerOptions = [
            { value: '政府官员', title: '政府官员', desc: '从政为官,管理一方' },
            { value: '实业家', title: '实业家', desc: '兴办实业,振兴民族' },
            { value: '新式学者', title: '新式学者', desc: '西学东渐,传播新知' },
            { value: '军政要员', title: '军政要员', desc: '从军从政,身居要职' },
            { value: '工人店员', title: '工人店员', desc: '做工经商,自食其力' },
            { value: '旧贵族', title: '旧贵族', desc: '世袭爵位,地位尊崇' },
            { value: '江湖人士', title: '江湖人士', desc: '行走江湖,行侠仗义' },
            { value: '宗教人物', title: '宗教人物', desc: '修身养性,超然物外' }
        ];
        familyOptions = [
            { value: '官宦家庭', title: '官宦家庭', desc: '父母从政,家境优渥' },
            { value: '实业世家', title: '实业世家', desc: '兴办实业,家财万贯' },
            { value: '旧贵族', title: '旧贵族', desc: '世袭爵位,门第显赫' },
            { value: '知识分子', title: '知识分子', desc: '书香门第,重视教育' },
            { value: '小康之家', title: '小康之家', desc: '生活小康,温饱无忧' },
            { value: '工人家庭', title: '工人家庭', desc: '做工为生,生活拮据' },
            { value: '乱世孤儿', title: '乱世孤儿', desc: '战乱失去亲人,孤苦无依' },
            { value: '流亡难民', title: '流亡难民', desc: '战乱流离,背井离乡' }
        ];
        experienceOptions = [
            { value: '顺遂发展', title: '顺遂发展', desc: '事业发展顺利,步步高升' },
            { value: '艰难奋斗', title: '艰难奋斗', desc: '历尽艰辛,终有所成' },
            { value: '战乱年代', title: '战乱年代', desc: '生于乱世,历经磨难' },
            { value: '投身革命', title: '投身革命', desc: '参加革命,推翻旧制' },
            { value: '创业经商', title: '创业经商', desc: '经商致富,实业兴邦' },
            { value: '文化运动', title: '文化运动', desc: '参与运动,传播新思想' },
            { value: '战争难民', title: '战争难民', desc: '战火纷飞,流离失所' },
            { value: '地主家庭', title: '地主家庭', desc: '土地改革,家道中落' },
            { value: '工人运动', title: '工人运动', desc: '参加工运,争取权利' },
            { value: '知识救国', title: '知识救国', desc: '求学救国,以教育振兴国家' }
        ];
    } else if (era === 'contemporary') {
        eraName = '现代';
        careerOptions = [
            { value: '企业管理', title: '企业管理', desc: '现代管理,职业经理人' },
            { value: '科技人才', title: '科技人才', desc: '互联网,程序员,研发' },
            { value: '专业人士', title: '专业人士', desc: '医生,律师,会计师' },
            { value: '创意产业', title: '创意产业', desc: '设计,媒体,广告' },
            { value: '公务员', title: '公务员', desc: '政府机关,事业单位' },
            { value: '商业贸易', title: '商业贸易', desc: '经商,销售,贸易' },
            { value: '自由职业', title: '自由职业', desc: '作家,摄影师,咨询' },
            { value: '普通劳动者', title: '普通劳动者', desc: '工人,服务行业' }
        ];
        familyOptions = [
            { value: '富裕家庭', title: '富裕家庭', desc: '家境优越,衣食无忧' },
            { value: '官宦家庭', title: '官宦家庭', desc: '父母从政,家境优渥' },
            { value: '中产家庭', title: '中产家庭', desc: '典型城市中产阶级' },
            { value: '城市贫民', title: '城市贫民', desc: '城市底层,生活拮据' },
            { value: '农村家庭', title: '农村家庭', desc: '农村出身,进城打工' },
            { value: '单亲家庭', title: '单亲家庭', desc: '父母离异,单亲抚养' },
            { value: '孤儿', title: '孤儿', desc: '父母双亡,自幼孤苦' },
            { value: '外来家庭', title: '外来家庭', desc: '外来务工人员家庭' }
        ];
        experienceOptions = [
            { value: '人生赢家', title: '人生赢家', desc: '事业有成,家庭美满' },
            { value: '奋斗打拼', title: '奋斗打拼', desc: '为理想奋斗,努力拼搏' },
            { value: '创业梦想', title: '创业梦想', desc: '创业初期,艰难探索' },
            { value: '职场内卷', title: '职场内卷', desc: '职场竞争,身心疲惫' },
            { value: '自由职业', title: '自由职业', desc: '追求自由,自主创业' },
            { value: '互联网时代', title: '互联网时代', desc: '享受互联网红利' },
            { value: '失业危机', title: '失业危机', desc: '经济下滑,失业待业' },
            { value: '离婚重建', title: '离婚重建', desc: '经历离异,重新开始' },
            { value: '职业转型', title: '职业转型', desc: '放弃原有职业,重新选择' },
            { value: '二代接班', title: '二代接班', desc: '继承父业,发展创新' }
        ];
    }

    const personalityOptions = [
        { value: '果断刚毅', title: '果断刚毅', desc: '雷厉风行,说干就干' },
        { value: '深谋远虑', title: '深谋远虑', desc: '谋定后动,深思熟虑' },
        { value: '稳重踏实', title: '稳重踏实', desc: '一步一个脚印' },
        { value: '外向开朗', title: '外向开朗', desc: '善于交际,人脉广泛' },
        { value: '内敛低调', title: '内敛低调', desc: '不善社交,但朋友质量高' },
        { value: '灵活机变', title: '灵活机变', desc: '随机应变,适应力强' }
    ];

    // 生成HTML
    let html = '';

    // 职业类型
    html += `
        <div class="form-group">
            <label class="form-label">职业类型 (${eraName})</label>
            <div class="option-grid">
                ${careerOptions.map(opt => `
                    <div class="option-card" data-group="career" data-value="${opt.value}">
                        <div class="option-title">${opt.title}</div>
                        <div class="option-desc">${opt.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // 性格特点
    html += `
        <div class="form-group">
            <label class="form-label">性格特点</label>
            <div class="option-grid">
                ${personalityOptions.map(opt => `
                    <div class="option-card" data-group="personality" data-value="${opt.value}">
                        <div class="option-title">${opt.title}</div>
                        <div class="option-desc">${opt.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // 家庭背景
    html += `
        <div class="form-group">
            <label class="form-label">家庭背景 (${eraName})</label>
            <div class="option-grid">
                ${familyOptions.map(opt => `
                    <div class="option-card" data-group="family" data-value="${opt.value}">
                        <div class="option-title">${opt.title}</div>
                        <div class="option-desc">${opt.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // 人生经历
    html += `
        <div class="form-group">
            <label class="form-label">人生经历 (${eraName})</label>
            <div class="option-grid">
                ${experienceOptions.map(opt => `
                    <div class="option-card" data-group="experience" data-value="${opt.value}">
                        <div class="option-title">${opt.title}</div>
                        <div class="option-desc">${opt.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    attributesSection.innerHTML = html;

    // 重新绑定事件
    attributesSection.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            selectOption(card.dataset.group, card.dataset.value);
        });
    });

    console.log(`已加载${eraName}时代的属性选项`);
}

// ==================== 步骤导航 ====================

/**
 * 下一步
 */
function nextStep() {
    if (appState.currentStep < 5) {
        // 验证必填项
        if (!validateCurrentStep()) {
            return;
        }

        appState.currentStep++;
        updateStepUI(appState.currentStep);

        // 特殊处理
        if (appState.currentStep === 4) {
            generateChart();
        }
    }
}

/**
 * 上一步
 */
function prevStep() {
    if (appState.currentStep > 1) {
        appState.currentStep--;
        updateStepUI(appState.currentStep);
    }
}

/**
 * 验证当前步骤
 */
function validateCurrentStep() {
    switch (appState.currentStep) {
        case 1:
            if (!appState.selectedEra) {
                alert('请选择时代');
                return false;
            }
            break;
        case 2:
            if (!appState.userInfo.gender || !appState.userInfo.age) {
                alert('请填写完整基础信息');
                return false;
            }

            // 检查是否选择了命盘确定方式
            if (appState.chartMode === 'reverse') {
                if (!reverseState.selectedMainStar) {
                    alert('请在反向确定命盘中选择主星');
                    return false;
                }
                if (reverseState.selectedTraits.length === 0) {
                    alert('请在反向确定命盘中选择性格特质');
                    return false;
                }
            }
            break;
        case 3:
            if (!appState.selectedOptions.career || !appState.selectedOptions.family || !appState.selectedOptions.experience) {
                alert('请选择所有属性');
                return false;
            }
            break;
    }
    return true;
}

/**
 * 更新步骤UI
 */
function updateStepUI(step) {
    // 更新步骤指示器
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active');
        if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });

    // 更新步骤内容
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeContent = document.getElementById(`step-${step}`);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // 根据步骤初始化相应的功能
    switch(step) {
        case 2:
            // 步骤2在角色类型选择后自动加载特质
            if (appState.characterType) {
                loadCoreTraits(appState.characterType);
            }
            break;
        case 3:
            initStep3();
            break;
        case 4:
            initStep4();
            break;
        case 5:
            initStep5();
            break;
    }

    if (activeContent) {
        activeContent.classList.add('active');
    }

    console.log('当前步骤:', step);
}

// ==================== 命盘生成 ====================

/**
 * 生成命盘（使用完整紫微斗数系统）
 */
function generateChart() {
    console.log('开始生成星盘...');
    console.log('当前状态:', appState);

    // 如果是反向命盘模式，使用已生成的数据
    if (appState.chartMode === 'reverse' && appState.chartData) {
        console.log('使用反向命盘数据');
        showChartOverview(appState.chartData);
        return;
    }

    // 获取生日输入
    const yearInput = document.getElementById('birth-year');
    const monthInput = document.getElementById('birth-month');
    const dayInput = document.getElementById('birth-day');

    if (yearInput && monthInput && dayInput) {
        appState.userInfo.year = parseInt(yearInput.value) || 1988;
        appState.userInfo.month = parseInt(monthInput.value) || 1;
        appState.userInfo.day = parseInt(dayInput.value) || 1;
    }

    // 获取人物属性选择
    const selectedCareer = appState.selectedOptions.career || '管理';
    const selectedPersonality = appState.selectedOptions.personality || '稳重';
    const selectedFamily = appState.selectedOptions.family || '富贵';
    const selectedLife = appState.selectedOptions.life || '顺遂';

    console.log('使用完整紫微斗数系统生成命盘...');

    // 使用完整紫微斗数系统生成命盘
    try {
        // 生成基础命盘
        const pattern = generatePattern(
            appState.selectedOptions.shichen || 'zi',
            appState.userInfo.month,
            appState.userInfo.day
        );

        console.log('命盘格局:', pattern);

        // 生成宫位
        const palaces = generatePalaces(pattern);

        // 生成三方四正
        const sanfangSizheng = calculateSanfangSizheng(palaces);

        // 生成四化
        const sihua = calculateSihua(palaces, pattern);

        // 生成逐宫解读
        const palaceAnalysis = generatePalaceAnalysis(
            palaces,
            appState.userInfo.gender,
            appState.userInfo.age,
            selectedCareer,
            selectedPersonality,
            selectedFamily,
            selectedLife
        );

        // 组装完整命盘数据
        const chartData = {
            era: appState.selectedEra,
            gender: appState.userInfo.gender,
            age: appState.userInfo.age,
            birthTime: {
                year: appState.userInfo.year,
                month: appState.userInfo.month,
                day: appState.userInfo.day,
                timePeriod: appState.userInfo.timePeriod,
                keCut: appState.userInfo.keCut
            },
            pattern: pattern,
            mainStars: pattern.mainStars,
            palaces: palaces,
            sanfangSizheng: sanfangSizheng,
            sihua: sihua,
            palaceAnalysis: palaceAnalysis,
            options: {
                career: selectedCareer,
                personality: selectedPersonality,
                family: selectedFamily,
                life: selectedLife
            },
            chartNumber: Math.floor(Math.random() * 288) + 1
        };

        appState.chartData = chartData;

        console.log('完整命盘生成成功:', chartData);

    } catch (error) {
        console.error('命盘生成失败，使用降级方案:', error);
        // 降级：使用简单数据
        const chartData = {
            era: appState.selectedEra,
            gender: appState.userInfo.gender,
            age: appState.userInfo.age,
            birthTime: {
                year: appState.userInfo.year,
                month: appState.userInfo.month,
                day: appState.userInfo.day,
                timePeriod: appState.userInfo.timePeriod,
                keCut: appState.userInfo.keCut
            },
            pattern: { mainStars: ['紫微'] },
            mainStars: ['紫微'],
            palaces: [],
            sanfangSizheng: {},
            sihua: {},
            palaceAnalysis: [],
            options: {
                career: selectedCareer,
                personality: selectedPersonality,
                family: selectedFamily,
                life: selectedLife
            },
            chartNumber: Math.floor(Math.random() * 288) + 1
        };

        appState.chartData = chartData;
    }

    // 生成人物数据
    generateCharacter(appState.chartData);

    // 生成增强版人物小传
    generateEnhancedBio(appState.chartData);

    // 显示命盘概览
    showChartOverview(appState.chartData);

    // 跳转到步骤6显示完整解读
    appState.currentStep = 6;
    updateStepUI(6);

    console.log('命盘生成完成:', chartData);
}

/**
 * 生成人物
 */
function generateCharacter(chartData) {
    const character = {
        name: '待生成',
        gender: chartData.gender,
        age: getAgeLabel(chartData.age), // 转换为中文
        ageValue: chartData.age, // 保留原始值用于其他用途
        era: chartData.era,
        career: getCareerLabel(chartData.options.career), // 转换为中文
        careerValue: chartData.options.career, // 保留原始值
        family: getFamilyLabel(chartData.options.family), // 转换为中文
        familyBackground: getFamilyLabel(chartData.options.family), // 添加 familyBackground 字段
        familyValue: chartData.options.family, // 保留原始值
        experience: chartData.options.experience,
        lifeExperience: chartData.options.experience, // character-bio-generator.js 期望的字段名
        personality: chartData.options.personality,
        // 根据时代和职业生成详细特征
        traits: generateTraits(chartData),
        // 生成人生时间线
        timeline: generateTimeline(chartData)
    };

    appState.characterData = character;
}

/**
 * 生成性格特征
 */
function generateTraits(chartData) {
    const eraTraits = {
        ancient: '受封建礼教影响,重视家族荣誉,有传统的忠孝观念',
        modern: '处于新旧交替时期,既接受新思想又保留传统观念',
        contemporary: '现代思维方式,重视个人发展,追求自我实现'
    };

    return {
        personality: chartData.options.personality.join('、'),
        eraCharacteristic: eraTraits[chartData.era],
        careerCharacteristic: `从事${chartData.options.career},在${chartData.options.family}环境中成长`,
        lifeCharacteristic: chartData.options.experience
    };
}

/**
 * 生成人生时间线
 */
function generateTimeline(chartData) {
    const events = [];
    const ageRanges = [
        { age: '10岁', desc: '童年时期,' + getAgeEvent(10, chartData) },
        { age: '20岁', desc: '青年时期,' + getAgeEvent(20, chartData) },
        { age: '30岁', desc: '而立之年,' + getAgeEvent(30, chartData) },
        { age: '40岁', desc: '不惑之年,' + getAgeEvent(40, chartData) },
        { age: '50岁', desc: '知天命,' + getAgeEvent(50, chartData) },
        { age: '60岁', desc: '花甲之年,' + getAgeEvent(60, chartData) },
        { age: '70岁', desc: '古稀之年,' + getAgeEvent(70, chartData) }
    ];

    return ageRanges;
}

/**
 * 获取年龄段事件
 */
function getAgeEvent(age, chartData) {
    const events = {
        ancient: [
            '接受传统教育,学习礼乐',
            '开始科举之路,考取功名',
            '继承家业,娶妻生子',
            '仕途有成,升迁重要职位',
            '成为家族长辈,传承家风',
            '退隐林泉,颐养天年',
            '儿孙满堂,尽享天伦'
        ],
        modern: [
            '接受新式教育,接触西方文化',
            '投身革命或实业救国',
            '在乱世中寻找发展机会',
            '成为社会栋梁,建立事业',
            '经历社会变革,调整人生方向',
            '安享晚年,总结人生经验',
            '见证时代变迁,传承记忆'
        ],
        contemporary: [
            '完成学业,开始探索世界',
            '工作创业,建立自己的事业',
            '在激烈竞争中站稳脚跟',
            '事业有成,家庭稳定',
            '面临职业瓶颈或转型',
            '准备退休,享受生活',
            '安度晚年,儿孙环绕'
        ]
    };

    const eraEvents = events[chartData.era];
    const index = Math.floor(age / 10) - 1;
    return eraEvents[index] || '继续人生旅程';
}

/**
 * 生成增强版人物小传（使用完整紫微斗数数据）
 */
function generateEnhancedBio(chartData) {
    console.log('generateEnhancedBio 开始执行');
    console.log('chartData:', chartData);
    console.log('appState.characterData:', appState.characterData);

    if (!appState.characterData) {
        console.error('人物数据未生成，无法生成小传');
        return;
    }

    try {
        console.log('尝试使用增强版人物生成器...');

        // 检查是否可以使用增强版生成器
        if (typeof window.CharacterBioEnhancedGenerator === 'undefined') {
            console.warn('增强版生成器未加载，使用基础版');
            throw new Error('Enhanced generator not available');
        }

        // 使用增强版生成器
        const era = appState.era || 'modern';
        const enhancedBio = window.CharacterBioEnhancedGenerator.generateEnhancedCharacterBio(
            chartData,
            era,
            appState.characterData
        );

        console.log('增强版人物小传生成成功');
        console.log('enhancedBio:', enhancedBio);

        // 转换为Markdown
        const markdownBio = window.CharacterBioEnhancedGenerator.convertEnhancedBioToMarkdown(enhancedBio);

        appState.enhancedBio = markdownBio;
        console.log('人物小传已保存到 appState.enhancedBio');

    } catch (error) {
        console.error('增强版人物小传生成失败:', error);
        console.log('降级到基础版本...');

        // 降级到基础版本
        try {
            console.log('使用完整紫微斗数数据生成人物小传...');

            // 从完整命盘数据中提取关键信息
            const mainStar = chartData.mainStars[0] || '紫微';
            const mainStarData = typeof MAIN_STARS !== 'undefined' ? MAIN_STARS[mainStar] : null;

            console.log('主星:', mainStar);
            console.log('主星数据:', mainStarData);

            // 命宫数据
            const mingPalace = chartData.palaces.find(p => p.isMing) || chartData.palaces[0];
            console.log('命宫:', mingPalace);

            // 生成人物小传（基于真实命盘数据）
            const bio = generateCharacterBioFromChart(chartData, appState.characterData, mainStarData);

            console.log('人物小传生成成功');
            appState.enhancedBio = bio;
            console.log('人物小传已保存到 appState.enhancedBio');

        } catch (innerError) {
            console.error('基础版人物小传生成也失败:', innerError);
            // 最终降级到简化版本
            console.log('最终降级到简化版本...');
            const simpleBio = generateSimpleBio(chartData);
            appState.enhancedBio = simpleBio;
            console.log('简化版小传已保存');
        }
    }
}

/**
 * 基于完整命盘数据生成人物小传
 */
function generateCharacterBioFromChart(chartData, characterData, mainStarData) {
    const eraNames = {
        ancient: '古代',
        modern: '近代',
        contemporary: '现代'
    };

    const era = eraNames[chartData.era] || '现代';
    const mainStar = chartData.mainStars[0] || '紫微';

    let markdown = `# ${characterData.name}人物小传\n\n`;

    // 一、基础设定
    markdown += `## 一、基础设定\n\n`;
    markdown += `**标签：** ${characterData.age}岁，${characterData.gender === 'male' ? '男' : '女'}，${era}时代${characterData.career}\n\n`;

    // 外貌特征（基于主星）
    if (mainStarData && mainStarData.face) {
        markdown += `**外貌特征：** ${mainStarData.face}\n\n`;
    } else {
        markdown += `**外貌特征：** ${characterData.appearance || '普通外表'}\n\n`;
    }

    markdown += `**职业阶级与地位：** ${chartData.options.career || '普通'}\n\n`;

    markdown += `**标志性细节（签名）：**\n`;
    markdown += `- ${characterData.signature1 || '习惯性动作'}\n`;
    markdown += `- ${characterData.signature2 || '说话特点'}\n\n`;

    markdown += `---\n\n`;

    // 二、欲望与需求
    markdown += `## 二、欲望与需求（Want vs. Need）\n\n`;

    markdown += `**外在欲望（想要）：**\n\n`;
    if (mainStarData && mainStarData.strength) {
        markdown += `${characterData.name}表面上追求的是${mainStarData.strength}。渴望在${chartData.options.career}领域证明自己的价值，渴望获得认可和地位。\n\n`;
    } else {
        markdown += `${characterData.name}追求的是${chartData.options.personality}。渴望在${chartData.options.career}领域有所成就。\n\n`;
    }

    markdown += `**内在需求（需要）：**\n\n`;
    if (mainStarData && mainStarData.weakness) {
        markdown += `但真正需要的，是克服${mainStarData.weakness}。需要学会接纳自己的不完美，需要明白真正的力量来自内心而非外在地位。\n\n`;
    } else {
        markdown += `但真正需要的，是找到内心的平衡。需要学会面对真实的自己，而不是活在别人的期待中。\n\n`;
    }

    markdown += `---\n\n`;

    // 三、灵魂伤痕与前史
    markdown += `## 三、灵魂伤痕与前史（幽灵/背景故事）\n\n`;

    markdown += `${characterData.name}出生在${chartData.options.family}家庭。\n\n`;

    markdown += `**决定性创伤：** `;
    // 根据主星和时代生成不同的创伤
    if (mainStar === '紫微' || mainStar === '七杀') {
        markdown += `被迫过早承担责任的童年，让${characterData.name}学会了隐藏脆弱。从小被寄予厚望，却从未被允许表达软弱。\n\n`;
    } else if (mainStar === '天机' || mainStar === '太阴') {
        markdown += `敏感的天性在${chartData.options.family}环境中得不到理解。总是被告知"想太多"，学会了把真实的想法藏在心里。\n\n`;
    } else if (mainStar === '太阳' || mainStar === '贪狼') {
        markdown += `过度张扬的个性在${era}时代遭遇挫折。因为"不合时宜"的表达方式，被环境打压，学会了谨慎和隐藏。\n\n`;
    } else if (mainStar === '武曲' || mainStar === '破军') {
        markdown += `激烈的性格在成长过程中屡屡碰壁。每一次"不合规矩"的行为都被惩罚，学会了压抑天性。\n\n`;
    } else {
        markdown += `${chartData.options.life}的童年经历，让${characterData.name}形成了某种执念。某个关键事件决定了TA的人生轨迹。\n\n`;
    }

    markdown += `**致命缺陷的形成：**\n\n`;
    markdown += `这段经历造就了核心性格缺陷——${mainStarData ? mainStarData.weakness.split('，')[0] : '过度自我保护'}。TA把自己活成了一座堡垒，用${mainStarData ? mainStarData.strength.split('，')[0] : '表面的强大'}保护着那个渴望被爱的小孩。\n\n`;

    markdown += `---\n\n`;

    // 四、性格与矛盾点
    markdown += `## 四、性格与矛盾点（Paradox）\n\n`;

    markdown += `${characterData.name}是一个充满矛盾的人物：\n\n`;
    markdown += `- **${mainStarData ? mainStarData.strength : '有优势'}，却又${mainStarData ? mainStarData.weakness : '有劣势'}。** 这种矛盾让TA时常陷入自我怀疑。\n\n`;
    markdown += `- **表面${chartData.options.personality}，内心却住着一个${characterData.age}岁的孩子。** 每一个决定都要权衡利弊，因为害怕犯错的代价。\n\n`;
    markdown += `- **追求${chartData.options.career}上的成就，却又渴望平静的生活。** 这种拉扯让TA始终无法真正满足。\n\n`;
    markdown += `- **在${era}时代中格格不入，却又不得不融入。** 独特的个性与环境的冲突，是TA一生的课题。\n\n`;

    markdown += `---\n\n`;

    // 五、剧作功能与社会关系
    markdown += `## 五、剧作功能与社会关系（Relationships & Function）\n\n`;

    markdown += `**剧作功能：**\n\n`;
    markdown += `${characterData.name}在故事中承担**"${mainStar === '紫微' ? '领袖' : mainStar === '七杀' ? '挑战者' : '镜像'}人物"**的功能——TA的存在迫使主角思考什么是真正的${mainStarData ? mainStarData.strength.split('，')[0] : '力量'}。\n\n`;

    markdown += `**核心关系网：**\n\n`;
    markdown += `- **对主角的态度：** 复杂的敬佩与竞争并存。既欣赏主角的某种特质，又因为自卑而保持距离。\n\n`;
    markdown += `- **对反派的态度：** 在道德上${chartData.options.personality === '善良' ? '反对' : '理解'}，却又在内心深处隐秘地羡慕那份${chartData.options.personality === '善良' ? '' : '不顾一切的'}洒脱。\n\n`;
    markdown += `- **如何推动主角改变：** TA的困境是一面镜子，照出主角尚未察觉的盲区。\n\n`;

    markdown += `---\n\n`;

    // 六、行为模式与台词风格
    markdown += `## 六、行为模式与台词风格（Action & Dialogue Style）\n\n`;

    markdown += `**遇到危机时的第一反应：**\n\n`;
    if (mainStar === '紫微' || mainStar === '七杀') {
        markdown += `**迅速掌控局面。** 不会慌乱，而是立即分析局势，做出决策。但这种镇定可能掩盖了内心的焦虑。\n\n`;
    } else if (mainStar === '天机' || mainStar === '太阴') {
        markdown += `**谨慎观察。** 不会轻举妄动，而是先收集信息，权衡利弊。但这种犹豫可能错失最佳时机。\n\n`;
    } else if (mainStar === '太阳' || mainStar === '贪狼') {
        markdown += `**积极应对。** 会直接面对问题，寻求解决方案。但有时过于乐观，低估了困难。\n\n`;
    } else {
        markdown += `**${mainStarData ? mainStarData.strength.split('，')[0] : '稳重应对'}。** \n\n`;
    }

    markdown += `**台词风格：**\n\n`;
    markdown += `- **句式：** ${mainStar === '天机' ? '偏于分析，喜欢用"从…角度来看"' : '简洁有力，不喜欢废话'}\n\n`;
    markdown += `- **修辞：** ${mainStar === '太阳' ? '喜欢用比喻，语言生动' : '直接表达，不绕弯子'}\n\n`;
    markdown += `- **话题回避：** 当触及核心问题时，${mainStar === '武曲' ? '会用沉默代替回答' : '会转移话题'}。\n\n`;

    markdown += `**典型台词示例：**\n\n`;
    markdown += `> "${mainStar === '紫微' ? '这个局面我来掌控，你们按我说的做。' : mainStar === '天机' ? '让我再想想，这件事没那么简单。' : '我不怕困难，我只需要时间。'}"\n\n`;

    markdown += `---\n\n`;

    // 七、人物弧光
    markdown += `## 七、人物弧光（Character Arc）\n\n`;

    markdown += `**起点：**\n\n`;
    markdown += `故事开篇时的${characterData.name}，是一个${mainStarData ? mainStarData.strength.split('，')[0] : '表面强大'}的人。看似${chartData.options.personality}，实则内心${mainStarData ? mainStarData.weakness.split('，')[0] : '隐藏着软弱'}。\n\n`;

    markdown += `**转折点：**\n\n`;
    markdown += `某个关键事件击碎了TA精心维护的假象——可能是${chartData.options.life === '坎坷' ? '重大挫折' : '意外的成功'}。在这个崩溃或觉醒的瞬间，TA被迫面对：**${mainStarData ? mainStarData.weakness.split('，')[0] : '真正的自己是谁'}。**\n\n`;

    markdown += `**终点：**\n\n`;
    markdown += `故事的结尾，${characterData.name}学会了${mainStarData ? mainStarData.weakness.split('，')[1] || '接纳' : '成长'}。TA依然${mainStarData ? mainStarData.strength.split('，')[0] : '优秀'}，但不再用这种方式掩盖脆弱。TA最终明白：**${mainStar === '紫微' ? '真正的领袖不是控制，而是服务' : '真正的强大是敢于真实'}。**\n\n`;

    markdown += `---\n\n`;

    const wordCount = markdown.replace(/\s/g, '').length;
    markdown += `*（全文约${Math.round(wordCount / 100) * 100}字）*`;

    return markdown;
}

/**
 * 降级版人物小传（当完整生成器失败时使用）
 */
function generateSimpleBio(chartData) {
    const character = appState.characterData;
    const eraNames = {
        'ancient': '古代',
        'modern': '近代',
        'contemporary': '现代'
    };

    const bio = {
        // 基本信息
        name: character.name || generateName(chartData),
        nickname: generateNickname(chartData),
        era: chartData.era,
        eraName: eraNames[chartData.era] || '现代',
        gender: character.gender === 'male' ? '男' : '女',
        age: character.age,
        career: character.career,
        family: character.familyBackground,

        // 性格深度
        innerMotivation: randomPick([
            '追求权力、地位、成就,渴望被认可',
            '追求真挚的情感,渴望被爱和被理解',
            '追求自由,抗拒束缚和压迫',
            '追求安全感,害怕失去现有的一切',
            '为过去的伤害寻求复仇和正义',
            '寻求救赎,弥补过去的错误',
            '探索未知,寻求真理和意义',
            '希望留下遗产,不被遗忘'
        ]),
        mainFear: randomPick([
            '害怕失败,害怕被证明无能',
            '害怕被抛弃,害怕孤独',
            '害怕被背叛,不敢信任他人',
            '害怕贫穷,害怕失去物质保障',
            '害怕展露软弱,害怕被看穿',
            '害怕被拒绝,害怕不被接纳',
            '害怕无能为力,害怕失控',
            '害怕平庸,害怕被遗忘'
        ]),

        // 外貌特征
        appearance: {
            faceShape: randomPick(['方脸', '圆脸', '长脸', '椭圆脸', '瓜子脸', '国字脸']),
            eyeExpression: randomPick(['锐利', '温和', '忧郁', '热情', '冷漠', '狡黠']),
            noseShape: randomPick(['高挺', '塌鼻', '鹰钩鼻', '蒜头鼻', '直鼻']),
            specialMark: randomPick([
                '左眉上有道伤疤,年轻时打架留下的',
                '右手手腕有道月牙形疤痕,儿时烫伤',
                '脖子后面有个红色胎记',
                '左脸颊有个酒窝,笑起来很明显',
                '右眼下方有颗泪痣',
                '眉心有颗朱砂痣,面相富贵'
            ])
        },

        // 关键事件
        turningPoint: randomPick([
            '科举中第,从此仕途亨通',
            '家道中落,从富贵跌入贫穷',
            '战争爆发,失去家园和亲人',
            '遇到贵人,得到提携和帮助',
            '参加革命,改变人生道路',
            '创业失败,一贫如洗',
            '考试落榜,失去信心',
            '遇到真爱,改变人生观'
        ]),

        biggestRegret: randomPick([
            '没能陪伴在父母身边,尽孝太少',
            '年轻时不懂事,伤害了最爱的人',
            '错失良机,与成功擦肩而过',
            '没有坚持梦想,向现实妥协',
            '背叛朋友,终身愧疚',
            '子女教育失败,现在后悔莫及',
            '没有珍惜青春,虚度光阴',
            '未能报答恩师,恩师已逝'
        ]),

        // 人物完整设定（包含时间线）
        character: character
    };

    return bio;
}

/**
 * 生成姓名
 */
function generateName(chartData) {
    const surnames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
    const ancientNames = ['文轩', '子轩', '子墨', '文博', '浩然', '天宇', '博文', '俊杰', '子涵', '诗涵'];
    const modernNames = ['建国', '国庆', '志强', '文明', '淑华', '秀英', '春华', '建军'];
    const contemporaryNames = ['浩', '宇', '轩', '涵', '俊杰', '梓萱', '子豪', '一诺', '雨桐', '浩然'];
    
    const surname = randomPick(surnames);
    let name;
    
    if (chartData.era === 'ancient') {
        name = randomPick(ancientNames);
    } else if (chartData.era === 'modern') {
        name = randomPick(modernNames);
    } else {
        name = randomPick(contemporaryNames);
    }

    return surname + name;
}

/**
 * 生成人物小传（调用character-bio-generator.js）
 */
function generateCharacterBio(chartData, characterData) {
    // 如果character-bio-generator.js已加载，使用完整生成器
    if (typeof window.CharacterBioGenerator !== 'undefined') {
        return window.CharacterBioGenerator.generateCharacterBio(chartData, characterData);
    }

    // 否则使用简化版本（generateSimpleBio已经返回对象，需要转换为Markdown）
    const bio = generateSimpleBio(chartData);
    return convertBioToMarkdown(bio);
}

/**
 * 将bio对象转换为Markdown
 */
function convertBioToMarkdown(bio) {
    let markdown = `# ${bio.name}人物小传\n\n`;

    markdown += `## 一、基本信息\n\n`;
    markdown += `- **姓名**: ${bio.name}\n`;
    markdown += `- **昵称**: ${bio.nickname}\n`;
    markdown += `- **时代背景**: ${bio.eraName}\n`;
    markdown += `- **性别**: ${bio.gender}\n`;
    markdown += `- **年龄阶段**: ${bio.age}\n`;
    markdown += `- **职业**: ${bio.career}\n`;
    markdown += `- **家庭背景**: ${bio.family}\n\n`;

    markdown += `## 二、深度性格\n\n`;
    markdown += `### 内在动机\n${bio.innerMotivation}\n\n`;
    markdown += `### 主要恐惧\n${bio.mainFear}\n\n`;

    markdown += `## 三、外貌特征\n\n`;
    markdown += `- **脸型**: ${bio.appearance.faceShape}\n`;
    markdown += `- **眼神**: ${bio.appearance.eyeExpression}\n`;
    markdown += `- **鼻型**: ${bio.appearance.noseShape}\n`;
    markdown += `- **特殊标志**: ${bio.appearance.specialMark}\n\n`;

    markdown += `## 四、人生关键事件\n\n`;
    markdown += `### 人生转折点\n${bio.turningPoint}\n\n`;
    markdown += `### 最大遗憾\n${bio.biggestRegret}\n\n`;

    // 添加时间线
    if (bio.character && bio.character.timeline) {
        markdown += `## 五、人生时间线\n\n`;
        bio.character.timeline.forEach(event => {
            markdown += `**${event.age}岁：** ${event.desc}\n\n`;
        });
    }

    const wordCount = markdown.replace(/\s/g, '').length;
    markdown += `---\n\n**字数统计：${wordCount}字**`;

    return markdown;
}

/**
 * 生成昵称
 */
function generateNickname(chartData) {
    if (chartData.era === 'ancient') {
        return randomPick(['老爷', '少爷', '大人', '公子', '先生']);
    } else if (chartData.era === 'modern') {
        return randomPick(['老总', '老师', '同志', '先生']);
    } else {
        return randomPick(['老王', '小李', '张哥', '老板', '大神']);
    }
}

/**
 * 显示命盘概览
 */
function showChartOverview(chartData) {
    const chartOverview = document.getElementById('chart-overview');
    if (!chartOverview) return;

    const eraNames = {
        ancient: '古代',
        modern: '近代',
        contemporary: '现代'
    };

    chartOverview.innerHTML = `
        <div class="chart-pattern">
            <div class="pattern-name">命盘 #${chartData.chartNumber}</div>
            <div class="pattern-desc">${eraNames[chartData.era]} · ${chartData.gender === 'male' ? '男' : '女'} · ${chartData.options.career}</div>
        </div>

        <div class="chart-info-grid">
            <div class="info-item">
                <div class="info-label">时代</div>
                <div class="info-value">${eraNames[chartData.era]}</div>
            </div>
            <div class="info-item">
                <div class="info-label">性别</div>
                <div class="info-value">${chartData.gender === 'male' ? '男' : '女'}</div>
            </div>
            <div class="info-item">
                <div class="info-label">职业</div>
                <div class="info-value">${chartData.options.career}</div>
            </div>
            <div class="info-item">
                <div class="info-label">出生时间</div>
                <div class="info-value">${chartData.birthTime.timePeriod}${chartData.birthTime.keCut}</div>
            </div>
        </div>

        <div class="chart-palaces-preview">
            <h4>十二宫位概览</h4>
            <div class="palaces-grid">
                ${['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫', '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'].map((palace, index) => `
                    <div class="palace-item ${palace === '命宫' ? 'ming' : ''}">
                        <div class="palace-name">${palace}</div>
                        <div class="palace-branch">${['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][index]}</div>
                        <div class="palace-stars">${['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁'][index]}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

/**
 * 显示完整解读
 */
function showFullResult() {
    console.log('showFullResult 被调用');
    console.log('appState.characterData:', appState.characterData);
    console.log('appState.enhancedBio:', appState.enhancedBio);

    const resultContent = document.getElementById('result-content');
    if (!resultContent) {
        console.error('找不到 result-content 元素');
        return;
    }
    if (!appState.characterData) {
        console.error('characterData 未准备好');
        resultContent.innerHTML = '<p class="error">人物数据未生成，请重试</p>';
        return;
    }
    if (!appState.enhancedBio) {
        console.error('enhancedBio 未准备好');
        resultContent.innerHTML = '<p class="error">人物小传未生成，请重试</p>';
        return;
    }

    const character = appState.characterData;
    const bio = appState.enhancedBio;

    console.log('bio 类型:', typeof bio);
    console.log('bio 内容:', bio);

    // 判断 bio 是字符串（完整小传）还是对象（简化版）
    if (typeof bio === 'string') {
        // 完整编剧级小传 - 直接显示 Markdown
        resultContent.innerHTML = `
            <div class="result-section">
                <div class="markdown-content">${formatMarkdown(bio)}</div>
            </div>
        `;
    } else {
        // 简化版小传 - 使用 HTML 格式化
        const eraNames = {
            ancient: '古代',
            modern: '近代',
            contemporary: '现代'
        };

        resultContent.innerHTML = `
            <div class="result-section">
                <h3 class="result-title">基本信息</h3>
                <p><strong>姓名:</strong> ${bio.name}</p>
                <p><strong>昵称:</strong> ${bio.nickname}</p>
                <p><strong>时代背景:</strong> ${bio.eraName || eraNames[character.era]}</p>
                <p><strong>性别:</strong> ${bio.gender || (character.gender === 'male' ? '男' : '女')}</p>
                <p><strong>年龄阶段:</strong> ${bio.age || character.age}</p>
                <p><strong>职业:</strong> ${bio.career || character.career}</p>
                <p><strong>家庭背景:</strong> ${bio.family || character.familyBackground}</p>
            </div>

            <div class="result-section">
                <h3 class="result-title">深度性格</h3>
                <p><strong>内在动机:</strong> ${bio.innerMotivation}</p>
                <p><strong>主要恐惧:</strong> ${bio.mainFear}</p>
                <p><strong>性格特点:</strong> ${character.traits.personality}</p>
                <p><strong>时代特征:</strong> ${character.traits.eraCharacteristic}</p>
                <p><strong>职业特征:</strong> ${character.traits.careerCharacteristic}</p>
                <p><strong>人生特征:</strong> ${character.traits.lifeCharacteristic}</p>
            </div>

            <div class="result-section">
                <h3 class="result-title">外貌特征</h3>
                <p><strong>脸型:</strong> ${bio.appearance.faceShape}</p>
                <p><strong>眼神:</strong> ${bio.appearance.eyeExpression}</p>
                <p><strong>鼻型:</strong> ${bio.appearance.noseShape}</p>
                <p><strong>特殊标志:</strong> ${bio.appearance.specialMark}</p>
            </div>

            <div class="result-section">
                <h3 class="result-title">人生关键事件</h3>
                <p><strong>人生转折点:</strong> ${bio.turningPoint}</p>
                <p><strong>最大遗憾:</strong> ${bio.biggestRegret}</p>
            </div>

            <div class="result-section">
                <h3 class="result-title">人生时间线</h3>
                <div class="timeline">
                    ${character.timeline.map(event => `
                        <div class="timeline-event">
                            <div class="timeline-age">${event.age}</div>
                            <div class="timeline-desc">${event.desc}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="result-section">
                <h3 class="result-title">命盘解读</h3>
                <p>此命盘为${eraNames[character.era]}时代的第${appState.chartData.chartNumber}号命盘,出生时间为${appState.chartData.birthTime.timePeriod}${appState.chartData.birthTime.keCut}。根据紫微斗数排盘系统,结合时代特征、时间刻度和人物属性,生成了以上完整的人物设定。</p>
            </div>
        `;
    }
}

/**
 * 格式化 Markdown 为 HTML
 */
function formatMarkdown(markdown) {
    if (!markdown) return '';

    // 简单的 Markdown 转 HTML
    let html = markdown
        // 标题
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // 粗体
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 斜体
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // 列表
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
        // 段落
        .replace(/\n\n/g, '</p><p>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');

    return html;
}

// ==================== 导出和重置 ====================

/**
 * 导出结果
 */
function exportResult() {
    if (!appState.characterData || !appState.enhancedBio) {
        alert('请先生成星盘');
        return;
    }

    const character = appState.characterData;
    const bio = appState.enhancedBio;

    // 判断 bio 是字符串（完整小传）还是对象（简化版）
    let markdownContent = '';

    if (typeof bio === 'string') {
        // 完整编剧级小传
        markdownContent = bio;
    } else {
        // 简化版小传，转换为 Markdown
        const eraNames = {
            ancient: '古代',
            modern: '近代',
            contemporary: '现代'
        };

        markdownContent = `# 紫微斗数人物小传

## 一、基本信息

- **姓名**: ${bio.name}
- **昵称**: ${bio.nickname}
- **时代背景**: ${bio.eraName || eraNames[character.era]}
- **性别**: ${bio.gender || (character.gender === 'male' ? '男' : '女')}
- **年龄阶段**: ${bio.age || character.age}
- **职业**: ${bio.career || character.career}
- **家庭背景**: ${bio.family || character.familyBackground}

## 二、深度性格

### 内在动机
${bio.innerMotivation}

### 主要恐惧
${bio.mainFear}

### 性格特点
${character.traits.personality}

### 时代特征
${character.traits.eraCharacteristic}

### 职业特征
${character.traits.careerCharacteristic}

### 人生特征
${character.traits.lifeCharacteristic}

## 三、外貌特征

- **脸型**: ${bio.appearance.faceShape}
- **眼神**: ${bio.appearance.eyeExpression}
- **鼻型**: ${bio.appearance.noseShape}
- **特殊标志**: ${bio.appearance.specialMark}

## 四、人生关键事件

### 人生转折点
${bio.turningPoint}

### 最大遗憾
${bio.biggestRegret}

## 五、人生时间线

${character.timeline.map(event => `### ${event.age}
${event.desc}`).join('\n\n')}

## 六、命盘信息

- **命盘编号**: #${appState.chartData.chartNumber}
- **出生时间**: ${appState.chartData.birthTime.timePeriod}${appState.chartData.birthTime.keCut}
- **时间精度**: 时辰+刻度
- **命盘类型**: 288盘之一

---
生成时间: ${new Date().toLocaleString('zh-CN')}
`;
    }

    // 复制到剪贴板
    navigator.clipboard.writeText(markdownContent).then(() => {
        alert('人物小传已复制到剪贴板!');
    }).catch(() => {
        // 备用方案: 创建临时文本域
        const textarea = document.createElement('textarea');
        textarea.value = markdownContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('人物小传已复制到剪贴板!');
    });
}

/**
 * 重置表单
 */
function resetForm() {
    if (confirm('确定要重新排盘吗?')) {
        appState.currentStep = 1;
        appState.selectedOptions = {
            career: '',
            personality: [],
            family: '',
            experience: ''
        };
        appState.chartData = null;
        appState.characterData = null;
        appState.enhancedBio = null;

        // 重置所有选择
        document.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // 重新加载古代时代
        selectEra('ancient');

        // 更新UI
        updateStepUI(1);
    }
}

// ==================== 命盘保存管理 ====================

/**
 * 保存当前命盘
 */
function saveChart() {
    if (!appState.chartData || !appState.characterData || !appState.enhancedBio) {
        alert('请先生成命盘');
        return;
    }

    // 弹出对话框让用户输入命盘名称
    const defaultName = `${appState.chartData.era === 'ancient' ? '古代' : appState.chartData.era === 'modern' ? '近代' : '现代'}命盘_${new Date().toLocaleDateString()}`;
    const chartName = prompt('请为这个命盘起个名字：', defaultName);

    if (!chartName || chartName.trim() === '') {
        return;
    }

    // 创建保存的命盘对象
    const savedChart = {
        id: Date.now(),
        name: chartName.trim(),
        createdAt: new Date().toISOString(),
        data: {
            chartData: appState.chartData,
            characterData: appState.characterData,
            enhancedBio: appState.enhancedBio
        }
    };

    // 添加到保存列表
    appState.savedCharts.push(savedChart);

    // 保存到 localStorage
    try {
        localStorage.setItem('zidouSavedCharts', JSON.stringify(appState.savedCharts));
        alert(`命盘 "${chartName}" 保存成功！`);
        updateSavedChartsUI();
    } catch (e) {
        console.error('保存失败：', e);
        alert('保存失败，可能是存储空间不足');
    }
}

/**
 * 加载已保存的命盘
 */
function loadSavedChart(chartId) {
    const savedChart = appState.savedCharts.find(chart => chart.id === chartId);
    if (!savedChart) {
        alert('找不到该命盘');
        return;
    }

    // 恢复数据
    appState.chartData = savedChart.data.chartData;
    appState.characterData = savedChart.data.characterData;
    appState.enhancedBio = savedChart.data.enhancedBio;

    if (savedChart.data.chartData.userInfo) {
        appState.userInfo = savedChart.data.chartData.userInfo;
    }
    if (savedChart.data.chartData.selectedOptions) {
        appState.selectedOptions = savedChart.data.chartData.selectedOptions;
    }

    // 显示结果
    appState.currentStep = 6;
    updateStepUI(6);
    showFullResult();

    alert(`已加载命盘：${savedChart.name}`);
}

/**
 * 删除已保存的命盘
 */
function deleteSavedChart(chartId) {
    if (!confirm('确定要删除这个命盘吗？')) {
        return;
    }

    appState.savedCharts = appState.savedCharts.filter(chart => chart.id !== chartId);

    try {
        localStorage.setItem('zidouSavedCharts', JSON.stringify(appState.savedCharts));
        updateSavedChartsUI();
        alert('命盘已删除');
    } catch (e) {
        console.error('删除失败：', e);
        alert('删除失败');
    }
}

/**
 * 修改命盘名称
 */
function renameSavedChart(chartId) {
    const savedChart = appState.savedCharts.find(chart => chart.id === chartId);
    if (!savedChart) {
        alert('找不到该命盘');
        return;
    }

    const newName = prompt('请输入新的命盘名称：', savedChart.name);
    if (!newName || newName.trim() === '') {
        return;
    }

    savedChart.name = newName.trim();
    savedChart.renamedAt = new Date().toISOString();

    try {
        localStorage.setItem('zidouSavedCharts', JSON.stringify(appState.savedCharts));
        updateSavedChartsUI();
        alert('名称修改成功！');
    } catch (e) {
        console.error('重命名失败：', e);
        alert('重命名失败');
    }
}

/**
 * 更新保存列表UI
 */
function updateSavedChartsUI() {
    const container = document.getElementById('saved-charts-container');
    if (!container) return;

    if (appState.savedCharts.length === 0) {
        container.innerHTML = '<p class="empty-message">暂无保存的命盘</p>';
        return;
    }

    let html = '<div class="saved-charts-list">';
    appState.savedCharts.forEach(chart => {
        const createdAt = new Date(chart.createdAt).toLocaleString();
        html += `
            <div class="saved-chart-item" data-id="${chart.id}">
                <div class="chart-info">
                    <h4 class="chart-name">${chart.name}</h4>
                    <p class="chart-date">保存时间：${createdAt}</p>
                    <p class="chart-era">时代：${chart.data.chartData.era === 'ancient' ? '古代' : chart.data.chartData.era === 'modern' ? '近代' : '现代'}</p>
                </div>
                <div class="chart-actions">
                    <button class="btn btn-sm btn-primary" onclick="loadSavedChart(${chart.id})">加载</button>
                    <button class="btn btn-sm btn-secondary" onclick="renameSavedChart(${chart.id})">重命名</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSavedChart(${chart.id})">删除</button>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

/**
 * 初始化保存列表
 */
function initializeSavedCharts() {
    try {
        const saved = localStorage.getItem('zidouSavedCharts');
        if (saved) {
            appState.savedCharts = JSON.parse(saved);
        }
        updateSavedChartsUI();
    } catch (e) {
        console.error('加载保存列表失败：', e);
        appState.savedCharts = [];
    }
}
