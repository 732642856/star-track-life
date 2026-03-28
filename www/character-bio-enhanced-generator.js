/**
 * 增强版人物小传生成器
 * 结合紫微斗数命理 + 爽点桥段 + 悬念手法 + 编剧理论
 * 生成真正独特、深度的人物小传
 */

// ============================================
// 编剧理论维度 - 基于国外编剧理论
// ============================================
const SCREENWRITING_DIMENSIONS = {
    // 内在动机
    innerMotivation: [
        { id: 'power', name: '权力掌控', desc: '渴望掌控自己的命运和周围的世界，不愿被他人支配' },
        { id: 'love', name: '爱与归属', desc: '追求真挚的爱情和情感连接，害怕孤独和被抛弃' },
        { id: 'freedom', name: '自由', desc: '追求绝对的自由，不愿被规则和期望束缚' },
        { id: 'security', name: '安全感', desc: '渴望稳定和安全，恐惧变化和不确定性' },
        { id: 'revenge', name: '复仇', desc: '对过去的伤害无法释怀，渴望报复和公正' },
        { id: 'redemption', name: '救赎', desc: '想要弥补过去的错误，寻求原谅和内心的平静' },
        { id: 'discovery', name: '发现', desc: '渴望探索未知，追求真理和知识' },
        { id: 'legacy', name: '遗产', desc: '想要留下印记，被后人记住和敬仰' },
        { id: 'justice', name: '正义', desc: '追求公平和正义，不公义的事情无法容忍' },
        { id: 'control', name: '掌控', desc: '想要掌控一切，恐惧失控和无力感' }
    ],

    // 灵魂创伤
    soulWound: [
        { id: 'parent_loss', name: '失去父母', desc: '童年或少年时期失去父母，导致对亲密关系的不信任' },
        { id: 'betrayal', name: '背叛', desc: '被信任的人背叛，从此不再轻易相信他人' },
        { id: 'humiliation', name: '公开受辱', desc: '在众人面前遭受羞辱，导致对他人的极度敏感' },
        { id: 'abuse', name: '遭受虐待', desc: '童年或成年后遭受身体或心理虐待，导致自我价值感极低' },
        { id: 'failure', name: '重大失败', desc: '曾经历过彻底的失败，从此恐惧再次尝试' },
        { id: 'abandonment', name: '被抛弃', desc: '被重要的人抛弃，导致对亲密关系的恐惧' },
        { id: 'guilt', name: '内疚', desc: '因自己的过失伤害了他人，深陷内疚无法自拔' },
        { id: 'helplessness', name: '无力感', desc: '曾经历彻底的无力感，从此过度追求掌控' },
        { id: 'rejection', name: '被拒绝', desc: '不断被拒绝，导致对自我价值的怀疑' },
        { id: 'loss', name: '重大失去', desc: '失去了最重要的人或物，导致无法前行' }
    ],

    // 恐惧
    fear: [
        { id: 'failure', name: '失败', desc: '害怕再次失败，因此不敢尝试新事物' },
        { id: 'abandonment', name: '被抛弃', desc: '害怕被重要的人抛弃，因此过度依赖或保持距离' },
        { id: 'betrayal', name: '背叛', desc: '害怕被背叛，因此不轻易信任他人' },
        { id: 'poverty', name: '贫穷', desc: '害怕再次经历贫穷，因此过度追求财富' },
        { id: 'vulnerability', name: '展露软弱', desc: '害怕被看作软弱，因此过度强硬' },
        { id: 'rejection', name: '被拒绝', desc: '害怕被拒绝，因此不敢表达真实想法' },
        { id: 'helplessness', name: '无能为力', desc: '害怕失去控制，因此过度掌控' },
        { id: 'forgotten', name: '被遗忘', desc: '害怕被遗忘，因此过度追求成就' },
        { id: 'exposure', name: '暴露真相', desc: '害怕真实自我被暴露，因此过度隐藏' },
        { id: 'intimacy', name: '亲密关系', desc: '害怕真正的亲密关系，因此保持距离' }
    ],

    // 价值观冲突
    valueConflict: [
        { id: 'love_duty', name: '爱情vs责任', desc: '在个人情感和社会责任之间难以抉择' },
        { id: 'truth_loyalty', name: '真理vs忠诚', desc: '在说真话和对朋友忠诚之间挣扎' },
        { id: 'individual_collective', name: '个人vs集体', desc: '在个人追求和集体利益之间难以平衡' },
        { id: 'tradition_innovation', name: '传统vs创新', desc: '在尊重传统和推动变革之间冲突' },
        { id: 'revenge_forgiveness', name: '复仇vs宽恕', desc: '在复仇和宽恕之间反复挣扎' },
        { id: 'safety_growth', name: '安全vs成长', desc: '在保持安全和追求成长之间犹豫' },
        { id: 'self_others', name: '自我vs他人', desc: '在满足自己和帮助他人之间失衡' },
        { id: 'past_future', name: '当下vs未来', desc: '在活在当下和规划未来之间矛盾' }
    ],

    // 外部冲突
    externalConflict: [
        { id: 'antagonist', name: '对抗反派', desc: '与主要反派之间的直接冲突' },
        { id: 'society', name: '对抗社会', desc: '与社会规则、期望或偏见对抗' },
        { id: 'nature', name: '对抗自然', desc: '与自然灾害、疾病或环境困境对抗' },
        { id: 'technology', name: '对抗技术', desc: '与科技、机器或技术带来的问题对抗' },
        { id: 'supernatural', name: '对抗超自然', desc: '与超自然力量或神秘现象对抗' },
        { id: 'self', name: '对抗自我', desc: '最大的敌人是自己的弱点或过去的自己' },
        { id: 'time', name: '对抗时间', desc: '在时间压力下完成关键任务' },
        { id: 'fate', name: '对抗命运', desc: '与预定的命运或预言对抗' }
    ],

    // 谎言
    lie: [
        { id: 'unworthy', name: '我不值得被爱', desc: '认为自己不配得到真正的爱' },
        { id: 'must_control', name: '我必须掌控一切', desc: '认为只有掌控一切才能安全' },
        { id: 'cant_trust', name: '我不能信任任何人', desc: '认为信任他人只会带来伤害' },
        { id: 'alone_better', name: '孤独更安全', desc: '认为保持孤独就不会受伤害' },
        { id: 'power_solves_all', name: '权力能解决一切', desc: '认为获得权力就能解决问题' },
        { id: 'past_defines', name: '过去决定未来', desc: '认为过去的问题无法改变' },
        { id: 'must_perfect', name: '我必须完美', desc: '认为只有完美才值得被接受' },
        { id: 'emotions_weak', name: '情绪是弱点', desc: '认为表达情绪是软弱的表现' },
        { id: 'cant_change', name: '我无法改变', desc: '认为自己无法改变现状' },
        { id: 'success_happy', name: '成功等于幸福', desc: '认为只要成功就能获得幸福' }
    ],

    // 真理
    truth: [
        { id: 'worthy', name: '我值得被爱', desc: '发现自己值得真正的爱和尊重' },
        { id: 'control_illusion', name: '掌控是幻觉', desc: '明白无法掌控一切，学会接受' },
        { id: 'trust_possible', name: '可以信任', desc: '学会信任值得信任的人' },
        { id: 'connection_needed', name: '连接是必要的', desc: '意识到与他人连接才能获得真正的幸福' },
        { id: 'power_limited', name: '权力有限', desc: '明白权力不能解决所有问题' },
        { id: 'change_possible', name: '改变可能', desc: '相信自己可以改变现状' },
        { id: 'imperfect_ok', name: '不完美也没关系', desc: '接受自己的不完美' },
        { id: 'emotions_valid', name: '情绪合理', desc: '学会表达和处理情绪' },
        { id: 'growth_possible', name: '成长可能', desc: '相信自己可以成长和改变' },
        { id: 'happiness_internal', name: '幸福来自内心', desc: '明白幸福来自内心而非外物' }
    ],

    // 人物弧光类型
    characterArc: [
        { id: 'positive', name: '正面弧光', desc: '从负面状态（谎言）中成长，最终拥抱真理' },
        { id: 'negative', name: '负面弧光', desc: '从正面状态堕落，最终拥抱谎言' },
        { id: 'flat', name: '扁平弧光', desc: '坚定于真理，通过外在行动影响他人' },
        { id: 'transformation', name: '蜕变弧光', desc: '彻底改变世界观和身份认同' },
        { id: 'growth', name: '成长弧光', desc: '在原有基础上成长，但不改变核心价值观' }
    ]
};

// ============================================
// 星曜与编剧维度映射
// ============================================
const STAR_TO_SCREENWRITING_MAP = {
    '紫微': {
        innerMotivations: ['power', 'control', 'legacy'],
        soulWounds: ['abandonment', 'failure', 'loss'],
        fears: ['helplessness', 'exposure', 'forgotten'],
        lies: ['must_control', 'power_solves_all'],
        truths: ['control_illusion', 'power_limited'],
        arcTypes: ['positive', 'growth']
    },
    '天机': {
        innerMotivations: ['discovery', 'justice', 'truth_loyalty'],
        soulWounds: ['humiliation', 'helplessness', 'guilt'],
        fears: ['failure', 'exposure', 'abandonment'],
        lies: ['must_perfect', 'cant_trust'],
        truths: ['imperfect_ok', 'trust_possible'],
        arcTypes: ['positive', 'transformation']
    },
    '太阳': {
        innerMotivations: ['power', 'justice', 'legacy'],
        soulWounds: ['failure', 'rejection', 'loss'],
        fears: ['failure', 'forgotten', 'exposure'],
        lies: ['must_perfect', 'success_happy'],
        truths: ['imperfect_ok', 'happiness_internal'],
        arcTypes: ['positive', 'flat']
    },
    '武曲': {
        innerMotivations: ['power', 'justice', 'revenge'],
        soulWounds: ['failure', 'humiliation', 'abuse'],
        fears: ['vulnerability', 'helplessness', 'failure'],
        lies: ['emotions_weak', 'must_control'],
        truths: ['emotions_valid', 'control_illusion'],
        arcTypes: ['positive', 'growth']
    },
    '天同': {
        innerMotivations: ['love', 'security', 'freedom'],
        soulWounds: ['abandonment', 'betrayal', 'parent_loss'],
        fears: ['abandonment', 'rejection', 'poverty'],
        lies: ['alone_better', 'unworthy'],
        truths: ['worthy', 'connection_needed'],
        arcTypes: ['positive', 'growth']
    },
    '廉贞': {
        innerMotivations: ['revenge', 'justice', 'control'],
        soulWounds: ['betrayal', 'humiliation', 'abuse'],
        fears: ['betrayal', 'exposure', 'failure'],
        lies: ['cant_trust', 'must_control'],
        truths: ['trust_possible', 'control_illusion'],
        arcTypes: ['negative', 'transformation']
    },
    '天府': {
        innerMotivations: ['security', 'legacy', 'power'],
        soulWounds: ['loss', 'failure', 'abandonment'],
        fears: ['poverty', 'loss', 'helplessness'],
        lies: ['past_defines', 'success_happy'],
        truths: ['change_possible', 'happiness_internal'],
        arcTypes: ['positive', 'flat']
    },
    '太阴': {
        innerMotivations: ['love', 'security', 'redemption'],
        soulWounds: ['abandonment', 'betrayal', 'parent_loss'],
        fears: ['abandonment', 'exposure', 'intimacy'],
        lies: ['unworthy', 'alone_better'],
        truths: ['worthy', 'connection_needed'],
        arcTypes: ['positive', 'transformation']
    },
    '贪狼': {
        innerMotivations: ['power', 'love', 'freedom'],
        soulWounds: ['rejection', 'betrayal', 'humiliation'],
        fears: ['rejection', 'intimacy', 'failure'],
        lies: ['success_happy', 'cant_trust'],
        truths: ['happiness_internal', 'trust_possible'],
        arcTypes: ['positive', 'negative', 'transformation']
    },
    '巨门': {
        innerMotivations: ['discovery', 'justice', 'truth_loyalty'],
        soulWounds: ['humiliation', 'betrayal', 'guilt'],
        fears: ['exposure', 'failure', 'rejection'],
        lies: ['must_perfect', 'cant_trust'],
        truths: ['imperfect_ok', 'trust_possible'],
        arcTypes: ['positive', 'transformation']
    },
    '天相': {
        innerMotivations: ['justice', 'love', 'redemption'],
        soulWounds: ['betrayal', 'guilt', 'abuse'],
        fears: ['betrayal', 'failure', 'exposure'],
        lies: ['unworthy', 'cant_trust'],
        truths: ['worthy', 'trust_possible'],
        arcTypes: ['positive', 'flat']
    },
    '天梁': {
        innerMotivations: ['justice', 'redemption', 'legacy'],
        soulWounds: ['failure', 'guilt', 'loss'],
        fears: ['failure', 'helplessness', 'forgotten'],
        lies: ['past_defines', 'cant_change'],
        truths: ['change_possible', 'growth_possible'],
        arcTypes: ['positive', 'growth']
    },
    '七杀': {
        innerMotivations: ['power', 'revenge', 'justice'],
        soulWounds: ['failure', 'humiliation', 'abuse'],
        fears: ['helplessness', 'failure', 'vulnerability'],
        lies: ['must_control', 'emotions_weak'],
        truths: ['control_illusion', 'emotions_valid'],
        arcTypes: ['positive', 'negative', 'transformation']
    },
    '破军': {
        innerMotivations: ['freedom', 'power', 'discovery'],
        soulWounds: ['failure', 'rejection', 'abandonment'],
        fears: ['helplessness', 'failure', 'exposure'],
        lies: ['cant_change', 'past_defines'],
        truths: ['change_possible', 'growth_possible'],
        arcTypes: ['transformation', 'negative']
    }
};

// ============================================
// 生成器核心函数
// ============================================

/**
 * 根据命盘生成增强版人物小传
 */
function generateEnhancedCharacterBio(chartData, era, characterData) {
    // ── 从 _fullChart 提取真实命盘坐标 ──
    const fc = chartData._fullChart || chartData;
    // mainStars 兼容多种数据结构
    const mainStarsArr = chartData.mainStars
        || (fc.mingGong && fc.mingGong.stars)
        || (chartData.pattern && chartData.pattern.stars)
        || [];
    const mainStar = mainStarsArr[0] || '紫微';
    const starMapping = STAR_TO_SCREENWRITING_MAP[mainStar] || STAR_TO_SCREENWRITING_MAP['紫微'];

    // 把命盘坐标挂到 chartData 上，供 generateScreenwritingDimensions 使用
    chartData._fullChart = fc;
    chartData.name   = characterData.name || '';
    chartData.gender = characterData.gender || '';

    // 生成编剧理论维度（已接入 sihuaType/mingDizhi/确定性选词）
    const dimensions = generateScreenwritingDimensions(mainStar, chartData, era);

    // 生成爽点桥段和悬念手法
    const storyElements = generateStoryElements(mainStar, era);

    // 生成20问角色深度挖掘
    const questions20Answers = typeof window.Character20Questions !== 'undefined' ?
        window.Character20Questions.answer20QuestionsWithChart(chartData, characterData, era) : [];

    // 组合所有维度
    const bio = {
        // 基本信息
        basicInfo: {
            name: characterData.name || generateName(era, characterData.gender),
            nickname: characterData.nickname || generateNickname(era, characterData.gender),
            era: era,
            gender: characterData.gender,
            age: characterData.age,
            career: characterData.career,
            family: characterData.family,
            personality: characterData.personality
        },

        // 紫微斗数维度
        ziweiData: {
            mainStar: mainStar,
            pattern: chartData.pattern,
            palaces: chartData.twelvePalaces,
            fourTransformations: chartData.fourTransformations
        },

        // 编剧理论维度
        screenwritingDimensions: dimensions,

        // 故事元素
        storyElements: storyElements,

        // 20问角色深度挖掘
        questions20: questions20Answers,

        // 完整小传
        fullBio: generateFullBio(dimensions, storyElements, era, questions20Answers, {
            mainStar: mainStar,
            auspiciousStars: [],
            malignantStars: [],
            pattern: chartData.pattern,
            patternType: chartData.patternType
        }, {
            name: characterData.name || generateName(era, characterData.gender),
            gender: characterData.gender,
            age: characterData.age,
            career: characterData.career,
            family: characterData.family
        })
    };

    return bio;
}

// ============================================
// 四化类型 → 价值观冲突 映射（8种四化各有专属冲突）
// ============================================
var SIHUA_VALUE_CONFLICT_MAP = {
    '化禄格': 'love_duty',         // 得禄者：爱情与责任的张力
    '化权格': 'individual_collective', // 掌权者：个人意志 vs 集体规则
    '化科格': 'tradition_innovation',  // 化科：守旧知识体系 vs 新知突破
    '化忌格': 'truth_loyalty',     // 化忌入命：说真话 vs 忠于关系
    '禄权叠加': 'self_others',      // 禄权双全：自我野心 vs 照顾他人
    '权忌冲突': 'revenge_forgiveness', // 权忌相克：报仇 vs 放下
    '科忌矛盾': 'past_future',      // 科忌：活在证明 vs 活在当下
    '禄忌纠缠': 'safety_growth',   // 禄忌：守住已有 vs 冒险成长
};

// 宫位地支 → 外部冲突 映射（12地支各有倾向）
var DIZHI_EXTERNAL_CONFLICT_MAP = {
    '子': 'antagonist',  // 子水：直接对抗
    '丑': 'society',     // 丑土：与规范体制冲突
    '寅': 'nature',      // 寅木：与环境/自然博弈
    '卯': 'society',     // 卯木：与流言礼教冲突
    '辰': 'fate',        // 辰土：对抗命运
    '巳': 'supernatural',// 巳火：神秘宿命
    '午': 'antagonist',  // 午火：激烈正面对决
    '未': 'self',        // 未土：最大的战场在自己内部
    '申': 'technology',  // 申金：与规则/机器/体制冲突
    '酉': 'society',     // 酉金：与权威正统冲突
    '戌': 'fate',        // 戌土：不可逆的命运齿轮
    '亥': 'time',        // 亥水：与时间/遗忘博弈
};

/**
 * 生成编剧理论维度
 * chartData 里取：sihuaType / mingIdx / mingDizhi / name / gender
 */
function generateScreenwritingDimensions(mainStar, chartData, era) {
    const starMapping = STAR_TO_SCREENWRITING_MAP[mainStar] || STAR_TO_SCREENWRITING_MAP['紫微'];

    // ── 提取命盘坐标 ──
    const fc = chartData._fullChart || chartData;
    const sihuaType = fc.sihuaType || chartData.sihuaType || '';
    const mingDizhi = fc.mingDizhi || chartData.mingDizhi || '';
    const mingIdx   = fc.mingIdx !== undefined ? String(fc.mingIdx) : '';
    const nameSeed  = (chartData.name || '') + (chartData.gender || '');

    // ── 确定性种子 = 主星+宫位+四化+名字 ──
    const baseSeed = mainStar + mingIdx + sihuaType + nameSeed;

    // 内在动机（主星驱动）
    const motivation = deterministicPick(
        SCREENWRITING_DIMENSIONS.innerMotivation.filter(m => starMapping.innerMotivations.includes(m.id)),
        SCREENWRITING_DIMENSIONS.innerMotivation,
        baseSeed + 'motivation'
    );

    // 灵魂创伤（主星+宫位驱动）
    const wound = deterministicPick(
        SCREENWRITING_DIMENSIONS.soulWound.filter(w => starMapping.soulWounds.includes(w.id)),
        SCREENWRITING_DIMENSIONS.soulWound,
        baseSeed + 'wound'
    );

    // 恐惧（主星驱动）
    const fear = deterministicPick(
        SCREENWRITING_DIMENSIONS.fear.filter(f => starMapping.fears.includes(f.id)),
        SCREENWRITING_DIMENSIONS.fear,
        baseSeed + 'fear'
    );

    // 价值观冲突（四化类型驱动）
    var vcId = SIHUA_VALUE_CONFLICT_MAP[sihuaType] || null;
    var vcPool = vcId
        ? SCREENWRITING_DIMENSIONS.valueConflict.filter(v => v.id === vcId)
        : SCREENWRITING_DIMENSIONS.valueConflict;
    const valueConflict = deterministicPick(vcPool, SCREENWRITING_DIMENSIONS.valueConflict, baseSeed + 'vc');

    // 外部冲突（宫位地支驱动）
    var ecId = DIZHI_EXTERNAL_CONFLICT_MAP[mingDizhi] || null;
    var ecPool = ecId
        ? SCREENWRITING_DIMENSIONS.externalConflict.filter(e => e.id === ecId)
        : SCREENWRITING_DIMENSIONS.externalConflict;
    const externalConflict = deterministicPick(ecPool, SCREENWRITING_DIMENSIONS.externalConflict, baseSeed + 'ec');

    // 谎言（主星驱动）
    const lie = deterministicPick(
        SCREENWRITING_DIMENSIONS.lie.filter(l => starMapping.lies.includes(l.id)),
        SCREENWRITING_DIMENSIONS.lie,
        baseSeed + 'lie'
    );

    // 真理（主星驱动）
    const truth = deterministicPick(
        SCREENWRITING_DIMENSIONS.truth.filter(t => starMapping.truths.includes(t.id)),
        SCREENWRITING_DIMENSIONS.truth,
        baseSeed + 'truth'
    );

    // 人物弧光（主星+四化驱动）
    const arc = deterministicPick(
        SCREENWRITING_DIMENSIONS.characterArc.filter(a => starMapping.arcTypes.includes(a.id)),
        SCREENWRITING_DIMENSIONS.characterArc,
        baseSeed + 'arc'
    );

    return {
        innerMotivation: motivation,
        soulWound: wound,
        fear: fear,
        valueConflict: valueConflict,
        externalConflict: externalConflict,
        lie: lie,
        truth: truth,
        characterArc: arc,
        // 透传命盘坐标给 fullBio 使用
        _sihuaType: sihuaType,
        _mingDizhi: mingDizhi,
    };
}

/**
 * 生成故事元素（爽点桥段 + 悬念手法）
 */
function generateStoryElements(mainStar, era) {
    // 获取主星列表
    const mainStars = [mainStar];

    // 选择2-3个爽点桥段
    const suangqiao = window.WRITING_RESOURCES ?
        window.WRITING_RESOURCES.selectRandomSuangqiaoBridges(3, mainStars) : [];

    // 选择2-3个悬念手法
    const suspense = window.WRITING_RESOURCES ?
        window.WRITING_RESOURCES.selectRandomSuspenseTechniques(3, mainStars) : [];

    return {
        suangqiaoBridges: suangqiao,
        suspenseTechniques: suspense
    };
}

/**
 * 生成完整小传文本
 */
function generateFullBio(dimensions, storyElements, era, questions20Answers = [], ziweiData = {}, basicInfo = {}) {
    const { innerMotivation, soulWound, fear, valueConflict, externalConflict, lie, truth, characterArc,
            _sihuaType, _mingDizhi } = dimensions;
    const { suangqiaoBridges, suspenseTechniques } = storyElements;
    // 确保 ziweiData 有兜底值
    if (!ziweiData.mainStar) ziweiData.mainStar = '紫微';
    if (!ziweiData.auspiciousStars) ziweiData.auspiciousStars = [];
    if (!ziweiData.malignantStars) ziweiData.malignantStars = [];

    // 时代映射
    const eraMap = { ancient: '古代', modern: '近代', contemporary: '现代' };
    const genderMap = { male: '男', female: '女' };
    const ageMap = { youth: '青年', middle: '中年', senior: '老年' };

        let bio = '';

    // ── 角色档案 ──
    bio += `# 角色档案\n\n`;
    bio += `| 项目 | 内容 |\n`;
    bio += `|------|------|\n`;
    bio += `| **姓名** | ${basicInfo.name || '未命名'} |\n`;
    bio += `| **性别** | ${genderMap[basicInfo.gender] || basicInfo.gender || '未知'} |\n`;
    bio += `| **年龄段** | ${ageMap[basicInfo.age] || basicInfo.age || '未知'} |\n`;
    bio += `| **所处时代** | ${eraMap[era] || era || '未知'} |\n`;
    // 命盘坐标转化为性格化语言（不含命理术语）
    var sihuaReadableMap = {
        '化禄格':   '顺势而为，贵人常在，但容易依赖外部推力',
        '化权格':   '天生主导欲强，凡事要拿主动，代价是难以放手',
        '化科格':   '才华外显，渴望被看见，但也容易陷入证明自己的循环',
        '化忌格':   '多思多虑，执念深，凡事容易卡在某个解不开的死结里',
        '禄权叠加': '野心与好运并行，能量强大，但边界感常常缺失',
        '权忌冲突': '越想掌控越失控，最大的战场在自己内部',
        '科忌矛盾': '越清醒越痛苦，智识是把双刃剑',
        '禄忌纠缠': '得到的怕失去，放不下的偏偏要放，一生在取舍里打转',
    };
    var dizhiReadableMap = {
        '子': '深沉内敛，善于藏锋，平静时最危险',
        '丑': '厚重稳健，不轻易出手，但一动就是大动静',
        '寅': '有开创气，天生往前冲，停下来反而难受',
        '卯': '外柔内刚，感知敏锐，被忽视时比被攻击时更受伤',
        '辰': '复杂多面，让人难以一眼读穿，自己也常常读不穿自己',
        '巳': '聚焦深邃，有种烈火内敛的质感，冷静外表下情绪滚烫',
        '午': '热烈直接，情绪藏不住，进一个房间就能改变气氛',
        '未': '温和表面下心思细密，比任何人都更会观察却不轻易说出口',
        '申': '行动力极强，反应快，但有时候快到跳过了该停下来想的那一步',
        '酉': '标准高、细节控，对自己和别人都容易苛刻到难以接近',
        '戌': '忠义执念深，背负比别人更重的东西，但从不声张',
        '亥': '宽广包容，难以被真正读懂，连自己也常常摸不清自己的边界',
    };
    var sihuaReadable = sihuaReadableMap[_sihuaType] || '';
    var dizhiReadable = dizhiReadableMap[_mingDizhi] || '';
    if (sihuaReadable) bio += `| **命运底色** | ${sihuaReadable} |\\n`;
    if (dizhiReadable) bio += `| **性格底调** | ${dizhiReadable} |\\n`;
    if (basicInfo.career) bio += `| **职业** | ${basicInfo.career} |\n`;
    if (basicInfo.family) bio += `| **家庭背景** | ${basicInfo.family} |\n`;
    bio += `| **命盘主星** | ${ziweiData.mainStar || '未知'} |\n`;
    bio += '\n';

    // 维度1：基本设定
    bio += `## 1. 基本设定\n\n`;
    bio += `**内在动机**：${innerMotivation.name}\n`;
    bio += `${innerMotivation.desc}\n\n`;

    bio += `**灵魂创伤**：${soulWound.name}\n`;
    bio += `${soulWound.desc}\n\n`;

    bio += `**主要恐惧**：${fear.name}\n`;
    bio += `${fear.desc}\n\n`;

    // 维度2：欲求与需要（Want vs Need）
    bio += `## 2. 欲求与需要\n\n`;
    bio += `**表面欲望**：${innerMotivation.desc.split('，')[0]}\n\n`;
    bio += `**深层需求**：${truth.desc}\n\n`;
    bio += `**人物弧光类型**：${characterArc.name}\n`;
    bio += `${characterArc.desc}\n\n`;

    // 维度3：灵魂伤口与前史
    bio += `## 3. 灵魂伤口与前史\n\n`;
    bio += `**核心创伤事件**：${soulWound.name}\n`;
    bio += `${soulWound.desc}\n\n`;
    bio += `**创伤影响**：这一创伤导致他/她${fear.desc}，因此发展出${lie.desc}的信念。\n\n`;

    // 维度4：性格与矛盾
    bio += `## 4. 性格与矛盾\n\n`;
    bio += `**价值观冲突**：${valueConflict.name}\n`;
    bio += `${valueConflict.desc}\n\n`;
    bio += `**外部冲突**：${externalConflict.name}\n`;
    bio += `${externalConflict.desc}\n\n`;

    // 维度5：戏剧功能与关系
    bio += `## 5. 戏剧功能与关系\n\n`;

    // 添加悬念手法
    if (suspenseTechniques && suspenseTechniques.length > 0) {
        bio += `**核心悬念设计**：\n`;
        suspenseTechniques.forEach((tech, index) => {
            bio += `${index + 1}. ${tech.desc}\n`;
        });
        bio += '\n';
    }

    // 维度6：行为与对话风格
    bio += `## 6. 行为与对话风格\n\n`;

    // 添加爽点桥段作为行为模式参考
    if (suangqiaoBridges && suangqiaoBridges.length > 0) {
        bio += `**典型行为模式**：\n`;
        suangqiaoBridges.forEach((bridge, index) => {
            bio += `${index + 1}. ${bridge.desc}\n`;
        });
        bio += '\n';
    }

    // 维度7：人物弧光
    bio += `## 7. 人物弧光\n\n`;
    bio += `**起始点**：${lie.desc}\n\n`;
    bio += `**转折点**：在经历${externalConflict.desc}的过程中，他/她开始质疑自己的信念。\n\n`;
    bio += `**终点**：最终意识到${truth.desc}，完成${characterArc.name}。\n\n`;

    // 维度8：20问角色深度挖掘
    bio += `## 8. 20问角色深度挖掘\n\n`;
    bio += `*（基于紫微斗数命盘系统回答）*\n\n`;

    // 如果有20问答案，添加到小传中
    if (questions20Answers && questions20Answers.length > 0) {
        questions20Answers.forEach((item, index) => {
            const question = window.Character20Questions ?
                window.Character20Questions.CHARACTER_20_QUESTIONS.find(q => q.id === item.questionId) : null;

            if (question) {
                bio += `### 8.${index + 1}. ${question.question}\n\n`;
                bio += `**紫微斗数映射**：${question.ziweiMapping.relatedPalaces.join('、')} - ${question.ziweiMapping.impact}\n\n`;
                bio += `**答案**：${item.answer}\n\n`;
            }
        });
    } else {
        bio += `*20问数据暂未加载或生成失败*\n\n`;
    }

    // 维度9：外貌特征（基于面相学 + 写作词库）
    bio += `## 9. 外貌特征\n\n`;
    
    // 面相学外貌
    if (window.FaceReadingGenerator) {
        bio += `### 9.1 面相学特征\n\n`;
        const appearance = window.FaceReadingGenerator.generateAppearance(
            { mainStars: [ziweiData.mainStar] },
            basicInfo.gender,
            basicInfo.age,
            ziweiData.auspiciousStars || [],
            ziweiData.malignantStars || []
        );
        bio += appearance;
        bio += '\n';
    }
    
    // 写作词库外貌
    if (window.WritingLexiconGenerator) {
        bio += `### 9.2 词库外貌描写\n\n`;
        const lexiconAppearance = window.WritingLexiconGenerator.generateAppearanceFromLexicon(
            ziweiData.mainStar,
            basicInfo.gender,
            basicInfo.age
        );
        bio += lexiconAppearance;
        bio += '\n';
    }

    // 维度10：标志性细节（习惯性动作 + 说话特点）
    bio += `## 10. 标志性细节（签名）\n\n`;
    if (window.SignatureDetailsGenerator) {
        const signature = window.SignatureDetailsGenerator.generateSignatureDetails(
            ziweiData.mainStar,
            ziweiData.auspiciousStars || [],
            ziweiData.malignantStars || []
        );
        bio += signature;
    } else {
        bio += `*标志性细节生成器暂未加载*\n\n`;
    }
    
    // 维度11：细节描写（基于写作词库）
    bio += `## 11. 细节描写（基于写作词库）\n\n`;
    if (window.WritingLexiconGenerator) {
        const detail = window.WritingLexiconGenerator.generateDetailFromLexicon(ziweiData.mainStar);
        bio += detail;
    } else {
        bio += `*细节描写生成器暂未加载*\n\n`;
    }
    
    // 维度12：心理描写（基于写作词库）
    bio += `## 12. 心理描写（基于写作词库）\n\n`;
    if (window.WritingLexiconGenerator) {
        bio += `**不同情绪状态下的心理描写**：\n\n`;
        
        // 生成4种情绪的心理描写
        const emotions = ['喜悦', '愤怒', '思考', '紧张'];
        emotions.forEach(emotion => {
            const psychology = window.WritingLexiconGenerator.generatePsychologyFromLexicon(
                ziweiData.mainStar,
                emotion
            );
            bio += psychology + '\n';
        });
    } else {
        bio += `*心理描写生成器暂未加载*\n\n`;
    }

    return bio;
}

/**
 * 生成姓名（时代差异化）
 */
function generateName(era, gender) {
    const surnames = ['李', '王', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴'];

    let givenNames = [];
    if (era === 'ancient') {
        givenNames = gender === 'male'
            ? ['文轩', '子墨', '浩然', '明轩', '天宇', '志强', '建中', '鸿志']
            : ['雅婷', '思雨', '梦琪', '欣怡', '晓雪', '诗涵', '雨萱', '婉儿'];
    } else if (era === 'modern') {
        givenNames = gender === 'male'
            ? ['明', '强', '伟', '磊', '洋', '浩', '博', '宇']
            : ['婷', '雪', '慧', '静', '雨', '敏', '琳', '晶'];
    } else {
        givenNames = gender === 'male'
            ? ['建国', '卫国', '和平', '胜利', '建军', '国庆', '志勇', '洪波']
            : ['秀英', '玉兰', '春华', '秋月', '淑芬', '桂英', '梅花', '玉华'];
    }

    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const givenName = givenNames[Math.floor(Math.random() * givenNames.length)];

    return surname + givenName;
}

/**
 * 生成昵称
 */
function generateNickname(era, gender) {
    const nicknames = ['小强', '小美', '阿明', '阿红', '小伟', '小丽', '老张', '小李'];
    return nicknames[Math.floor(Math.random() * nicknames.length)];
}

/**
 * 随机选择一个元素（仅用于无法确定性选择的场景）
 */
function randomPick(array, fallbackArray) {
    if (!array || array.length === 0) {
        const src = (fallbackArray && fallbackArray.length > 0) ? fallbackArray : null;
        if (!src) return { id: 'fallback', name: '未知', desc: '——' };
        return src[Math.floor(Math.random() * src.length)];
    }
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * 确定性选词：同一种子永远选同一个结果
 * seed: 字符串种子（由主星+宫位+四化类型+名字等拼接）
 */
function deterministicPick(array, fallbackArray, seed) {
    const src = (array && array.length > 0) ? array : ((fallbackArray && fallbackArray.length > 0) ? fallbackArray : null);
    if (!src) return { id: 'fallback', name: '未知', desc: '——' };
    // djb2 哈希
    let hash = 5381;
    const s = String(seed || '');
    for (let i = 0; i < s.length; i++) {
        hash = ((hash << 5) + hash) + s.charCodeAt(i);
        hash = hash & hash; // 转int32
    }
    return src[Math.abs(hash) % src.length];
}

/**
 * 转换为Markdown格式
 */
function convertEnhancedBioToMarkdown(bio) {
    let md = `# ${bio.basicInfo.name} 人物小传\n\n`;

    md += `**基本信息**\n`;
    md += `- 姓名：${bio.basicInfo.name}（${bio.basicInfo.nickname}）\n`;
    md += `- 性别：${bio.basicInfo.gender === 'male' ? '男' : '女'}\n`;
    md += `- 年龄：${bio.basicInfo.age}\n`;
    md += `- 职业：${bio.basicInfo.career}\n`;
    md += `- 家庭背景：${bio.basicInfo.family}\n`;
    md += `- 性格特点：${Array.isArray(bio.basicInfo.personality) ? bio.basicInfo.personality.join('、') : (bio.basicInfo.personality || '未知')}\n\n`;

    md += `**命盘信息**\n`;
    md += `- 主星：${bio.ziweiData.mainStar}\n`;
    md += `- 命盘格局：${bio.ziweiData.pattern}\n\n`;

    md += `---\n\n`;

    md += bio.fullBio;

    return md;
}

// 导出到全局
window.CharacterBioEnhancedGenerator = {
    SCREENWRITING_DIMENSIONS,
    STAR_TO_SCREENWRITING_MAP,
    generateEnhancedCharacterBio,
    generateFullBio,
    convertEnhancedBioToMarkdown
};
