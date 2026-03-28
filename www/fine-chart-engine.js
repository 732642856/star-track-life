/**
 * 紫微斗数精细排盘引擎 v2.0
 * 支持时辰+8刻的精确排盘,扩展至576盘(3时代×2性别×12时辰×8刻)
 * 包含紫微斗数核心排盘算法和星曜布局逻辑
 * 男女在身宫、四化计算上有差异化处理
 */

// era-data.js 中的变量（ERAS, CAREERS 等）通过全局 script 标签加载，无需 import

// ==================== 精细排盘计算 ====================

/**
 * 根据时间刻度计算精细命盘位置
 * @param {string} eraCode - 时代代码
 * @param {string} gender - 性别
 * @param {number} month - 农历月份(1-12)
 * @param {number} day - 农历日期(1-30)
 * @param {string} timePeriod - 时辰(子丑寅卯辰巳午未申酉戌亥)
 * @param {string} keCut - 刻度(初刻到末刻)
 * @returns {object} 命盘数据
 */
function calculateFineChart(eraCode, gender, month, day, timePeriod, keCut) {
    // 1. 计算命宫位置(紫微斗数安命身宫法)
    const mingPalace = calculateMingPalace(month, day, timePeriod);

    // 2. 计算身宫位置
    const shenPalace = calculateShenPalace(month, day, timePeriod, gender);

    // 3. 计算十二宫位
    const palaces = calculateAllPalaces(mingPalace);

    // 4. 计算十四主星布局
    const mainStars = calculateMainStars(timePeriod, keCut, mingPalace);

    // 5. 计算六吉六煞
    const minorStars = calculateMinorStars(palaces);

    // 6. 计算四化星（加入性别影响）
    const fourTransformations = calculateFourTransformations(eraCode, timePeriod, keCut, gender);

    // 7. 计算时间刻度影响因子
    const keFactor = calculateKeFactor(timePeriod, keCut);

    return {
        eraCode,
        gender,
        month,
        day,
        timePeriod,
        keCut,
        mingPalace,
        shenPalace,
        palaces,
        mainStars,
        minorStars,
        fourTransformations,
        keFactor,
        // 576盘的唯一标识
        chartId: generateChartId(eraCode, gender, month, day, timePeriod, keCut)
    };
}

/**
 * 计算命宫位置
 * 从寅宫起正月,顺时针数到出生月,再逆时针数到出生日
 */
function calculateMingPalace(month, day, timePeriod) {
    // 寅宫索引为2(寅宫在十二宫位中的位置)
    const startPalace = 2; // 寅宫
    const monthOffset = month - 1; // 正月到出生月的偏移
    const dayOffset = day - 1; // 初一到出生日的偏移

    // 命宫位置:寅宫起正月顺时针数到月,再逆时针数到日
    let mingPalace = (startPalace + monthOffset) % 12;

    // 逆时针数到日
    mingPalace = (mingPalace - dayOffset + 12) % 12;

    return mingPalace;
}

/**
 * 计算身宫位置
 */
function calculateShenPalace(month, day, timePeriod, gender) {
    // 身宫位置计算:从命宫起,顺时针数到出生时辰
    // 男命从寅宫起正月,女命从申宫起正月
    const mingPalace = calculateMingPalace(month, day, timePeriod);
    const timeIndex = TIME_PERIODS.findIndex(t => t.name === timePeriod);

    // 性别影响身宫计算：男女起算点不同
    const genderOffset = gender === 'male' ? 0 : 6; // 女命从申宫起，相差6宫
    const shenPalace = (mingPalace + timeIndex + genderOffset) % 12;

    return shenPalace;
}

/**
 * 计算十二宫位
 */
function calculateAllPalaces(mingPalace) {
    const palaceNames = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    const palaces = {};

    for (let i = 0; i < 12; i++) {
        palaces[palaceNames[i]] = {
            index: i,
            position: (mingPalace + i) % 12
        };
    }

    return palaces;
}

/**
 * 计算十四主星布局
 * 根据时辰和刻度精细计算
 */
function calculateMainStars(timePeriod, keCut, mingPalace) {
    const timeIndex = TIME_PERIODS.findIndex(t => t.name === timePeriod);
    const keIndex = TIME_KE_CUTS.findIndex(k => k.name === keCut);

    // 紫微星位置计算(紫微斗数核心算法)
    const ziweiPosition = calculateZiweiPosition(timeIndex, keIndex);

    // 其他主星根据紫微星位置计算
    const stars = {};
    const mainStarNames = ['紫微', '天机', '太阳', '武曲', '天同', '廉贞',
                           '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'];

    mainStarNames.forEach((starName, index) => {
        stars[starName] = {
            position: calculateStarPosition(starName, ziweiPosition, mingPalace),
            brightness: calculateStarBrightness(starName, ziweiPosition)
        };
    });

    return stars;
}

/**
 * 计算紫微星位置
 * 根据时辰和刻度计算(精确排盘核心)
 */
function calculateZiweiPosition(timeIndex, keIndex) {
    // 基础位置:根据时辰
    const basePosition = timeIndex;

    // 刻度调整:每刻影响一个宫位偏移
    const keOffset = Math.floor(keIndex / 2); // 每两刻偏移一宫

    // 紫微星最终位置
    const ziweiPosition = (basePosition + keOffset) % 12;

    return ziweiPosition;
}

/**
 * 计算各主星位置
 */
function calculateStarPosition(starName, ziweiPosition, mingPalace) {
    const starRules = {
        '紫微': ziweiPosition,
        '天机': (ziweiPosition + 1) % 12,
        '太阳': (ziweiPosition + 2) % 12,
        '武曲': (ziweiPosition + 3) % 12,
        '天同': (ziweiPosition + 4) % 12,
        '廉贞': (ziweiPosition + 5) % 12,
        '天府': (ziweiPosition + 6) % 12,
        '太阴': (ziweiPosition + 7) % 12,
        '贪狼': (ziweiPosition + 8) % 12,
        '巨门': (ziweiPosition + 9) % 12,
        '天相': (ziweiPosition + 10) % 12,
        '天梁': (ziweiPosition + 11) % 12,
        '七杀': (ziweiPosition + 11) % 12, // 七杀与天梁特殊关系
        '破军': ziweiPosition // 破军与紫微特殊关系
    };

    return starRules[starName] || 0;
}

/**
 * 计算星曜亮度
 */
function calculateStarBrightness(starName, position) {
    // 简化版:根据位置判断庙旺利陷
    const brightnessLevels = ['陷', '平', '平', '利', '利', '旺', '旺', '庙'];
    return brightnessLevels[position % brightnessLevels.length];
}

/**
 * 计算六吉六煞
 */
function calculateMinorStars(palaces) {
    // 六吉星:文昌、文曲、左辅、右弼、天魁、天钺
    // 六煞星:擎羊、陀罗、火星、铃星、地空、地劫

    const luckyStars = ['文昌', '文曲', '左辅', '右弼', '天魁', '天钺'];
    const unluckyStars = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];

    const minorStars = {};

    // 六吉星布局(简化算法)
    luckyStars.forEach((star, index) => {
        minorStars[star] = {
            position: index, // 简化:按顺序分布
            type: '吉'
        };
    });

    // 六煞星布局(简化算法)
    unluckyStars.forEach((star, index) => {
        minorStars[star] = {
            position: (index + 6) % 12, // 简化:分布在后半部分
            type: '煞'
        };
    });

    return minorStars;
}

/**
 * 计算四化星(化禄、化权、化科、化忌)
 */
function calculateFourTransformations(eraCode, timePeriod, keCut, gender) {
    const timeIndex = TIME_PERIODS.findIndex(t => t.name === timePeriod);
    const keIndex = TIME_KE_CUTS.findIndex(k => k.name === keCut);
    const genderOffset = gender === 'male' ? 0 : 1; // 性别影响偏移

    // 根据时代和时辰计算四化
    // 不同时代四化规则可能有所不同
    const transformations = {};

    if (eraCode === 'ancient') {
        // 古代四化规则
        transformations['化禄'] = { star: '紫微', position: (timeIndex + genderOffset) % 12 };
        transformations['化权'] = { star: '武曲', position: (timeIndex + 1 + genderOffset) % 12 };
        transformations['化科'] = { star: '天相', position: (timeIndex + 2 + genderOffset) % 12 };
        transformations['化忌'] = { star: '破军', position: (timeIndex + 3 + genderOffset) % 12 };
    } else if (eraCode === 'modern') {
        // 近代四化规则
        transformations['化禄'] = { star: '贪狼', position: (timeIndex + genderOffset) % 12 };
        transformations['化权'] = { star: '七杀', position: (timeIndex + 1 + genderOffset) % 12 };
        transformations['化科'] = { star: '天机', position: (timeIndex + 2 + genderOffset) % 12 };
        transformations['化忌'] = { star: '廉贞', position: (timeIndex + 3 + genderOffset) % 12 };
    } else {
        // 现代四化规则
        transformations['化禄'] = { star: '天同', position: (timeIndex + genderOffset) % 12 };
        transformations['化权'] = { star: '天梁', position: (timeIndex + 1 + genderOffset) % 12 };
        transformations['化科'] = { star: '文昌', position: (timeIndex + 2 + genderOffset) % 12 };
        transformations['化忌'] = { star: '火星', position: (timeIndex + 3 + genderOffset) % 12 };
    }

    // 刻度微调
    const keOffset = keIndex % 4;
    Object.keys(transformations).forEach(key => {
        transformations[key].position = (transformations[key].position + keOffset) % 12;
    });

    return transformations;
}

/**
 * 计算时间刻度影响因子
 * 刻度对命盘的细微影响
 */
function calculateKeFactor(timePeriod, keCut) {
    const keIndex = TIME_KE_CUTS.findIndex(k => k.name === keCut);

    // 刻度影响因子(0-1)
    const factor = keIndex / 8;

    return {
        value: factor,
        influence: factor < 0.25 ? '轻微' : factor < 0.5 ? '适中' : factor < 0.75 ? '显著' : '强烈',
        description: `刻度影响:${TIME_KE_CUTS[keIndex].name},对命盘产生${factor < 0.5 ? '温和' : '强烈'}的影响`
    };
}

/**
 * 生成576盘的唯一标识
 * 时代(3) × 性别(2) × 时辰(12) × 刻度(8) = 576种核心命盘
 */
function generateChartId(eraCode, gender, month, day, timePeriod, keCut) {
    const eraIndex = Object.values(ERAS).findIndex(e => e.code === eraCode);
    const genderIndex = gender === 'male' ? 0 : 1;
    const timeIndex = TIME_PERIODS.findIndex(t => t.name === timePeriod);
    const keIndex = TIME_KE_CUTS.findIndex(k => k.name === keCut);

    // 576盘ID计算: 时代(3) × 性别(2) × 时辰(12) × 刻度(8)
    // 每个时代192盘(2×12×8)，共3×192=576盘
    const chartId = eraIndex * 192 + genderIndex * 96 + timeIndex * 8 + keIndex;

    return {
        chartId,
        type: chartId < 192 ? '古代命盘' : chartId < 384 ? '近代命盘' : '现代命盘',
        gender: gender === 'male' ? '男命' : '女命',
        description: `${ERAS[eraIndex].name}·${gender === 'male' ? '男' : '女'}·${timePeriod}·${keCut}·第${chartId + 1}盘`
    };
}

// ==================== 人物生成引擎 ====================

/**
 * 根据命盘生成人物设定
 */
function generateCharacter(chart, selectedOptions) {
    const era = ERAS[Object.keys(ERAS).find(key => ERAS[key].code === chart.eraCode)];

    // 1. 基础信息
    const basicInfo = generateBasicInfo(chart, era, selectedOptions);

    // 2. 核心特质
    const coreTraits = generateCoreTraits(chart, era);

    // 3. 面相外貌
    const appearance = generateAppearance(chart, era);

    // 4. 家庭背景
    const family = generateFamily(chart, era, selectedOptions);

    // 5. 人生经历
    const lifeExperience = generateLifeExperience(chart, era, selectedOptions);

    // 6. 事业财运
    const career = generateCareer(chart, era, selectedOptions);

    // 7. 三方四正
    const threeAspects = generateThreeAspects(chart);

    // 8. 十二宫位详解
    const palaceDetails = generatePalaceDetails(chart, era);

    return {
        basicInfo,
        coreTraits,
        appearance,
        family,
        lifeExperience,
        career,
        threeAspects,
        palaceDetails
    };
}

/**
 * 生成基础信息
 */
function generateBasicInfo(chart, era, selectedOptions) {
    const mainStar = getMainStarInPalace(chart.mainStars, chart.mingPalace);
    const ageOptions = ['少年', '青年', '中年', '老年'];
    const age = ageOptions[Math.floor(Math.random() * ageOptions.length)];

    return {
        name: '角色名称',
        gender: chart.gender,
        age: age,
        era: era.name,
        eraCode: chart.eraCode,
        mainStar: mainStar,
        career: selectedOptions.career || '待定',
        timeInfo: {
            period: chart.timePeriod,
            ke: chart.keCut,
            description: `${chart.timePeriod}${chart.keCut}生`
        }
    };
}

/**
 * 获取指定宫位的主星
 */
function getMainStarInPalace(stars, palaceIndex) {
    for (const [starName, starData] of Object.entries(stars)) {
        if (starData.position === palaceIndex) {
            return {
                name: starName,
                brightness: starData.brightness
            };
        }
    }
    return { name: '无主星', brightness: '平' };
}

/**
 * 生成核心特质
 */
function generateCoreTraits(chart, era) {
    const mainStar = getMainStarInPalace(chart.mainStars, chart.mingPalace);
    const starData = getStarData(mainStar.name);

    // 根据时代调整性格描述
    const eraAdjustment = getEraPersonalityAdjustment(chart.eraCode);

    return {
        personality: eraAdjustment.personality || starData.personality,
        talent: starData.strength,
        weakness: eraAdjustment.weakness || starData.weakness,
        suitableCareer: eraAdjustment.career || starData.career
    };
}

/**
 * 生成面相外貌
 */
function generateAppearance(chart, era) {
    const mainStar = getMainStarInPalace(chart.mainStars, chart.mingPalace);
    const starData = getStarData(mainStar.name);

    // 根据时代调整外貌描述
    const eraAdjustment = getEraAppearanceAdjustment(chart.eraCode);

    return {
        face: eraAdjustment.face || starData.face,
        body: eraAdjustment.body || starData.body,
        expression: eraAdjustment.expression || starData.expression,
        voice: eraAdjustment.voice || starData.voice
    };
}

/**
 * 生成家庭背景
 */
function generateFamily(chart, era, selectedOptions) {
    const familyOptions = FAMILY_BACKGROUNDS[chart.eraCode.toUpperCase()];
    const family = familyOptions.find(f => f.id === selectedOptions.family) ||
                   familyOptions[Math.floor(Math.random() * familyOptions.length)];

    return {
        type: family.name,
        description: family.description,
        characteristics: family.characteristics
    };
}

/**
 * 生成人生经历
 */
function generateLifeExperience(chart, era, selectedOptions) {
    const experienceOptions = LIFE_EXPERIENCES[chart.eraCode.toUpperCase()];
    const experience = experienceOptions.find(e => e.id === selectedOptions.experience) ||
                      experienceOptions[Math.floor(Math.random() * experienceOptions.length)];

    return {
        type: experience.name,
        description: experience.description,
        characteristics: experience.characteristics,
        keyEvents: generateKeyEvents(experience, era)
    };
}

/**
 * 生成关键事件时间线
 */
function generateKeyEvents(experience, era) {
    const events = [];

    // 根据经历类型生成关键事件
    const ageMarkers = [10, 20, 30, 40, 50, 60, 70];

    ageMarkers.forEach(age => {
        events.push({
            age: age,
            event: generateEventAtAge(age, experience, era)
        });
    });

    return events;
}

/**
 * 根据年龄生成事件
 */
function generateEventAtAge(age, experience, era) {
    // 简化版:根据年龄和经历类型生成事件
    const eventTypes = [
        '学业有成', '初次工作', '事业转折', '婚姻大事', '子女出生', '事业高峰', '退休生活'
    ];

    return eventTypes[Math.floor(age / 10)] || '重要事件';
}

/**
 * 生成事业财运
 */
function generateCareer(chart, era, selectedOptions) {
    const careerOptions = CAREERS[chart.eraCode.toUpperCase()];
    const career = careerOptions.find(c => c.id === selectedOptions.career) ||
                   careerOptions[Math.floor(Math.random() * careerOptions.length)];

    return {
        type: career.name,
        description: career.description,
        socialStatus: career.socialStatus,
        income: career.income,
        examples: career.examples,
        requirements: career.requirements
    };
}

/**
 * 生成三方四正
 */
function generateThreeAspects(chart) {
    const threeAspects = [];
    const mingPalace = chart.mingPalace;

    // 财帛、官禄、迁移三方
    const aspects = ['财帛', '官禄', '迁移'];
    const offsets = [4, 8, 10]; // 财帛宫、官禄宫、迁移宫相对于命宫的偏移

    aspects.forEach((aspect, index) => {
        const palaceIndex = (mingPalace + offsets[index]) % 12;
        const mainStar = getMainStarInPalace(chart.mainStars, palaceIndex);

        threeAspects.push({
            aspect: aspect,
            mainStar: mainStar,
            description: `${aspect}宫${mainStar.name}${mainStar.brightness}`
        });
    });

    return threeAspects;
}

/**
 * 生成十二宫位详解
 */
function generatePalaceDetails(chart, era) {
    const palaceNames = ['命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
                         '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'];

    const details = [];

    palaceNames.forEach((palaceName, index) => {
        const mainStar = getMainStarInPalace(chart.mainStars, index);
        const starData = getStarData(mainStar.name);

        details.push({
            palace: palaceName,
            mainStar: mainStar,
            description: starData.palaceDesc && starData.palaceDesc[palaceName] || `${palaceName}有${mainStar.name}坐守`
        });
    });

    return details;
}

// ==================== 辅助函数 ====================

/**
 * 获取主星数据(简化版,实际应从主数据文件读取)
 */
function getStarData(starName) {
    const starData = {
        '紫微': {
            personality: '天生具有领导气质,做事稳重有分寸',
            strength: '领导力强、决策果断、有远见',
            weakness: '过于自负、听不进意见',
            career: ['管理', '政治', '领导'],
            face: '面容方正,天庭饱满,眼神威严',
            body: '身形端正,体态稳重',
            expression: '神情庄重,目光坚定',
            voice: '声音洪亮有力,语速适中',
            palaceDesc: {}
        }
    };

    return starData[starName] || {
        personality: '性格温和,为人友善',
        strength: '适应能力强,善于学习',
        weakness: '缺乏主见,易受影响',
        career: ['普通职业'],
        face: '面容清秀,五官端正',
        body: '身材匀称,体态自然',
        expression: '表情平和,眼神友善',
        voice: '声音温和,语调平稳',
        palaceDesc: {}
    };
}

/**
 * 获取时代性格调整
 */
function getEraPersonalityAdjustment(eraCode) {
    const adjustments = {
        'ancient': {
            personality: '性格沉稳,重视传统,讲究礼法',
            career: ['仕途', '经商', '务农', '从武']
        },
        'modern': {
            personality: '思想开放,追求进步,接受新事物',
            career: ['实业', '教育', '军政', '自由职业']
        },
        'contemporary': {
            personality: '思维活跃,适应时代,追求创新',
            career: ['企业管理', '科技', '创意', '自由职业']
        }
    };

    return adjustments[eraCode] || {};
}

/**
 * 获取时代外貌调整
 */
function getEraAppearanceAdjustment(eraCode) {
    const adjustments = {
        'ancient': {
            face: '面容端庄,五官端正,气质古朴',
            body: '身形匀称,体态优雅,举止得体',
            expression: '表情平和,神态安详',
            voice: '声调平和,语速适中,言辞文雅'
        },
        'modern': {
            face: '面容清秀,带有时代气息',
            body: '身形挺拔,体态健康',
            expression: '表情丰富,神态活泼',
            voice: '声音清亮,语速较快'
        },
        'contemporary': {
            face: '面容现代,气质时尚',
            body: '身形匀称,体态自然',
            expression: '表情生动,富有感染力',
            voice: '声音洪亮,语速富有节奏'
        }
    };

    return adjustments[eraCode] || {};
}

// ==================== 人物小传生成（新增）====================

/**
 * 生成完整的人物小传
 * @param {object} chart - 命盘数据
 * @param {object} character - 人物信息
 * @returns {string} 完整的人物小传
 */
function generateCharacterBio(chart, character) {
    // 导入人物小传生成器（实际使用时需要正确导入）
    // 这里提供一个简单的实现框架
    
    // 根据命盘信息确定人物格局类型
    const pattern = determineCharacterPattern(chart);
    
    // 生成人物小传的7个维度内容
    return generateBioContent(pattern, character, chart);
}

/**
 * 根据命盘确定人物格局类型
 */
function determineCharacterPattern(chart) {
    const { mainStars, fourTransformations } = chart;
    
    // 检查主星分布
    const starNames = Object.keys(chart.mainStars || {});
    
    // 检查四化
    const transTypes = Object.values(chart.fourTransformations || {}).map(t => t?.star);
    
    // 判断格局类型
    if (starNames.some(s => s.includes('紫微')) && transTypes.includes('紫微')) {
        return 'AUTHORITY';
    }
    if (starNames.some(s => s.includes('七杀') || s.includes('破军') || s.includes('贪狼'))) {
        return 'CONFLICT';
    }
    if (starNames.some(s => s.includes('孤辰') || s.includes('寡宿'))) {
        return 'INDEPENDENT';
    }
    if (starNames.some(s => s.includes('天相') || s.includes('文昌') || s.includes('文曲'))) {
        return 'HARMONY';
    }
    if (starNames.some(s => s.includes('天姚') || s.includes('红鸾'))) {
        return 'ARTISTIC';
    }
    if (starNames.some(s => s.includes('廉贞') || s.includes('天机'))) {
        return 'CALCULATING';
    }
    
    return 'HARMONY'; // 默认类型
}

/**
 * 生成小传内容
 */
function generateBioContent(pattern, character, chart) {
    const { gender, age, career, family } = character;
    const he = gender === 'male' ? '他' : '她';
    
    // 这里调用独立的小传生成器文件中的函数
    // 为了简化，这里提供一个示例框架
    // 实际使用时应该导入 character-bio-generator.js
    
    return `
# ${character.name || '人物'}小传

## 一、基础设定

**标签：** ${age}，${gender === 'male' ? '男性' : '女性'}，${family?.type || '普通家庭'}出身的${career}

**格局类型：** ${pattern}

（完整的小传内容由 character-bio-generator.js 生成）
`;
}

// 以上函数均为全局函数，直接通过 script 标签供其他文件访问，无需 export
