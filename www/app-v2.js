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
    // 内部生成144盘×8刻的精准匹配
    const chartData = generate144Chart(userInputs);
    
    // 保存到全局
    selectedChart = {
        name: chartData.pattern.name,
        stars: chartData.pattern.stars,
        desc: chartData.pattern.desc,
        type: chartData.patternType,
        shiChen: chartData.shiChen,
        ke: chartData.ke,
        chartId: chartData.chartId
    };
    
    // 更新显示
    document.getElementById('main-pattern-name').textContent = chartData.pattern.name;
    document.getElementById('main-pattern-desc').textContent = chartData.pattern.desc;
    document.getElementById('main-star').textContent = chartData.pattern.stars.join('、');
    document.getElementById('pattern-type').textContent = chartData.patternType;
    document.getElementById('era-display').textContent = {ancient:'古代', modern:'近代', contemporary:'现代'}[userInputs.era];
    document.getElementById('match-score').textContent = Math.floor(85 + Math.random() * 15) + '%';
    
    // 生成8种人格类型选项
    generate8PersonalityTypes(chartData);
}

function generate8PersonalityTypes(chartData) {
    const grid = document.getElementById('sub-patterns-grid');
    if (!grid) return;
    
    const personalityTypes = chartData.personalityTypes || Object.keys(window.PERSONALITY_8_TYPES);
    
    grid.innerHTML = personalityTypes.map((type, i) => {
        const desc = generatePersonalityDescription(type, chartData);
        return `
            <div class="star-card ${i === 0 ? 'selected' : ''}" data-personality="${type}">
                <div class="star-name">${type}</div>
                <div class="star-desc">${desc.shortDesc}</div>
                <div style="margin-top: 8px; font-size: 11px; color: #666;">
                    <div>外在：${desc.visibleTrait.substring(0, 20)}...</div>
                    <div>内在：${desc.hiddenNeed.substring(0, 20)}...</div>
                </div>
            </div>
        `;
    }).join('');
    
    // 绑定点击事件
    grid.querySelectorAll('.star-card').forEach(card => {
        card.addEventListener('click', () => {
            grid.querySelectorAll('.star-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedSubPattern = card.dataset.personality;
        });
    });
    
    selectedSubPattern = personalityTypes[0];
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
    let html = markdown;
    
    // 标题
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    
    // 粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // 分割线
    html = html.replace(/^---$/gm, '<hr>');
    
    // 段落
    html = html.split('\n\n').map(para => {
        if (para.startsWith('<h') || para.startsWith('<hr')) {
            return para;
        }
        return `<p>${para}</p>`;
    }).join('');
    
    // 换行
    html = html.replace(/\n/g, '<br>');
    
    return html;
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
    html += `
    <div class="compare-analysis">
        <h3>对比分析</h3>
        <ul>
            <li><strong>格局差异：</strong>${chars.map(c => c.chart.name).join(' vs ')}</li>
            <li><strong>四化差异：</strong>${chars.map(c => c.sihua).join(' vs ')}</li>
            <li><strong>适合场景：</strong>不同格局适合不同的剧情需求和人物关系</li>
        </ul>
    </div>
    `;
    
    return html;
}

function closeCompare() {
    document.getElementById('compare-section').style.display = 'none';
}
