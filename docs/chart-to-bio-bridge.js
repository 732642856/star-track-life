/**
 * chart-to-bio-bridge.js
 * ─────────────────────────────────────────────────────────────────────
 * 骨架→肉通道：将 fine-chart-engine.js (ZiweiEngine v3.0) 生成的
 * 真实命盘数据，转化为 ziwei-bio-core.js 能直接使用的"创作参数对象"
 *
 * 解决的核心断层：
 *   旧：app-v2.js → generate144Chart() 走随机/回退逻辑 → _resolveSihuaType() 硬编码
 *   新：app-v2.js → generateEnrichedChart() → 真实飞星/大限/三方四正 → 小传
 *
 * 依赖：
 *   - fine-chart-engine.js 已加载 (window.ZiweiEngine)
 *   - ziwei-bio-core.js 已加载 (window.STAR_DETAILED_DESCRIPTIONS 等)
 *
 * 版本：v1.0  日期：2026-03-30
 */

;(function(global) {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────
    // 常量
    // ─────────────────────────────────────────────────────────────────────

    const PALACE_NAMES = [
        '命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫',
        '迁移宫','交友宫','官禄宫','田宅宫','福德宫','父母宫'
    ];

    const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

    // keIdx(0-7) → 时辰中的刻（一时辰8刻，每刻15分钟）
    const KE_NAMES = ['初刻','一刻','二刻','三刻','正刻','正一刻','正二刻','末刻'];

    // 命宫主星 → 格局类型
    const STAR_TO_PATTERN = {
        '七杀':'杀破狼', '破军':'杀破狼', '贪狼':'杀破狼',
        '紫微':'紫府廉武相', '天府':'紫府廉武相', '廉贞':'紫府廉武相',
        '武曲':'紫府廉武相', '天相':'紫府廉武相',
        '天机':'机月同梁', '太阴':'机月同梁', '天同':'机月同梁', '天梁':'机月同梁',
        '太阳':'巨日', '巨门':'巨日'
    };

    // 喜剧机制：14主星的认知盲点（卡普兰"非英雄"武器）
    const STAR_BLIND_SPOT = {
        '紫微':'过于相信自己的判断，对别人的建议置若罔闻——那顶皇冠其实很重，他从不让人看见',
        '天机':'分析过度，反而错失行动的最佳时机——知道一切，却总是最后一个出发的人',
        '太阳':'付出太多给别人，忘记自己的需要——发光太久，熄灭时没有人注意到他已经精疲力竭',
        '武曲':'以为金钱能解决一切感情问题——用行动代替语言的人，最怕有一天行动无效',
        '天同':'太追求平和，反而无法做出真正重要的决定——说"随你"的人，其实内心有强烈的意见',
        '廉贞':'欲望太多，每样都想要，结果每样都浅尝辄止——越是风情万种，越是渴望一个真正懂他的人',
        '天府':'过于保守，错失每一次变革机会——守着一座城池，却忘了城里的人需要看见远方',
        '太阴':'感受太细腻，连别人毫不在意的事都能伤到自己——那些沉默是最深的委屈',
        '贪狼':'同时追求太多，结果一事无成——在所有舞台上都发了光，唯独不知道自己在哪个角落',
        '巨门':'把疑虑说出来伤了所有人，说不出口又觉得委屈——他的嘴是最诚实的，也是让他最孤独的',
        '天相':'太想让所有人都满意，结果让所有人都不满意——夹在中间的人，有时候比两边都累',
        '天梁':'自认为是救世主，但被帮助者只觉得被干涉——他们不需要答案，只需要有人听',
        '七杀':'以为强悍就是一切，其实在最需要温柔的时候失控了——铁面下面藏着那个从没被人安慰过的孩子',
        '破军':'破坏了所有规则，但忘了建立新规则之前要先站稳脚跟——自由的代价是，没有地方停下来'
    };

    // 英文版认知盲点
    const STAR_BLIND_SPOT_EN = {
        '紫微':'Over-trusts own judgment, dismisses others\' advice — that crown is heavier than anyone knows',
        '天机':'Over-analyses and misses the moment — knows everything, always the last to move',
        '太阳':'Gives too much to others, forgets own needs — shone so long, no one noticed when the flame burned out',
        '武曲':'Thinks money solves all emotional problems — actions over words, until one day action fails',
        '天同':'Pursues harmony so hard that real decisions become impossible — "whatever you want" hides strong opinions',
        '廉贞':'Wants everything, gets nothing deeply — the more dazzling, the deeper the hunger to be truly known',
        '天府':'Too conservative, misses every change — guarding the fortress while forgetting people inside need horizons',
        '太阴':'Feels too much, wounded by things others don\'t notice — those silences are the deepest grievances',
        '贪狼':'Chases everything, achieves nothing — shines on every stage, doesn\'t know which corner is home',
        '巨门':'Speaking doubts hurts everyone, silence feels unjust — the honest mouth is also the loneliest',
        '天相':'Tries to please everyone, pleases no one — caught in the middle, more exhausted than either side',
        '天梁':'Thinks self a saviour, those "helped" feel interfered with — they didn\'t need answers, just someone to listen',
        '七杀':'Believes strength is everything, loses control when softness is most needed — under the iron face, a child never comforted',
        '破军':'Breaks every rule, forgets to stand firm before building new ones — freedom\'s cost: nowhere to stop'
    };

    // 福德宫主星 → 弗洛伊德防御机制映射
    const STAR_DEFENSE_MECHANISM = {
        '紫微':'理智化（将痛苦经验理性包装，拒绝感受情绪）',
        '天机':'理性化（用逻辑为一切行为找到合理解释）',
        '太阳':'投射（把内心未承认的感受投射到他人身上）',
        '武曲':'反应形成（表面最强硬处，藏着最软弱的恐惧）',
        '天同':'退行（压力下退回孩子式的依赖和回避）',
        '廉贞':'升华（将本能冲动转化为才华和创造力）',
        '天府':'隔离（将情感与事实分开，不让感受干扰判断）',
        '太阴':'压抑（把不能承受的记忆推入潜意识，"忘记"了）',
        '贪狼':'转移（把一种关系的渴望转移到另一个目标上）',
        '巨门':'投射（觉得别人在批评他的话，往往是他对自己说的）',
        '天相':'顺从（通过迎合他人来回避内心的冲突与焦虑）',
        '天梁':'合理化（为"我应该帮助别人"的执念找到道德依据）',
        '七杀':'否认（用强势和攻击来否认内心的脆弱和恐惧）',
        '破军':'行动化（把内心冲突直接转为行动，不经消化就爆发）'
    };

    // 英文版防御机制
    const STAR_DEFENSE_MECHANISM_EN = {
        '紫微':'Intellectualization (wrapping painful experiences in rationality, refusing to feel)',
        '天机':'Rationalization (finding logical explanations for all behaviours)',
        '太阳':'Projection (projecting unacknowledged feelings onto others)',
        '武曲':'Reaction formation (where the hardest surface hides the softest fear)',
        '天同':'Regression (under pressure, retreating to childlike dependence)',
        '廉贞':'Sublimation (transforming instinctual impulses into talent and creativity)',
        '天府':'Isolation (separating emotion from fact, keeping feelings from judgment)',
        '太阴':'Repression (pushing unbearable memories into the unconscious, "forgetting")',
        '贪狼':'Displacement (shifting desire from one relationship to another target)',
        '巨门':'Projection (what feels like criticism from others is often what they tell themselves)',
        '天相':'Compliance (avoiding inner conflict by迎合 others)',
        '天梁':'Rationalization (finding moral grounds for the "I should help others" compulsion)',
        '七杀':'Denial (using dominance and aggression to deny inner fragility and fear)',
        '破军':'Acting out (converting inner conflict directly into action, exploding without digestion)'
    };

    // 夫妻宫主星 → 依恋类型
    const STAR_ATTACHMENT_TYPE = {
        '天府':'安全型——信任、有界限、能独处也能共处',
        '天同':'安全型——温暖、包容、以稳定的关系为根基',
        '太阳':'安全型——坦诚、付出、把伴侣当成光一样守护',
        '太阴':'焦虑型——怕被抛弃、感受细腻、情绪化',
        '贪狼':'焦虑型——渴望关注、害怕失去、容易吃醋',
        '廉贞':'焦虑型——情感复杂、爱得投入也控制不住',
        '武曲':'回避型——情感疏离、过度独立、难以接受依赖',
        '七杀':'回避型——把独立视为保护、伴侣走近了反而退',
        '破军':'回避型——不断更换、逃离"稳定"、以为自由是情感的全部',
        '天机':'混乱型——头脑里算过一切可能，反而不知道自己想要什么',
        '巨门':'混乱型——既渴望被理解，又用怀疑把人推开',
        '天梁':'混乱型——想照顾别人，但内心其实极度需要被照顾',
        '紫微':'混乱型——渴望对等的关系，但又害怕真正意义上的平等',
        '天相':'焦虑型——以调和为名，实则是回避面对真实的情感冲突'
    };

    // 英文版依恋类型
    const STAR_ATTACHMENT_TYPE_EN = {
        '天府':'Secure — trusts, has boundaries, comfortable alone or together',
        '天同':'Secure — warm, inclusive, grounded in stable relationships',
        '太阳':'Secure — open, giving, guards their partner like light itself',
        '太阴':'Anxious — fears abandonment, finely sensitive, emotional',
        '贪狼':'Anxious — craves attention, fears loss, easily jealous',
        '廉贞':'Anxious — emotionally complex, loves intensely yet uncontrollably',
        '武曲':'Avoidant — emotionally distant, overly independent, struggles with dependence',
        '七杀':'Avoidant — sees independence as protection, retreats when partners approach',
        '破军':'Avoidant — constantly changing, fleeing "stability", mistaking freedom for love',
        '天机':'Disorganized — calculates every possibility, yet doesn\'t know what they want',
        '巨门':'Disorganized — craves understanding yet pushes people away with suspicion',
        '天梁':'Disorganized — wants to care for others, but deeply needs care themselves',
        '紫微':'Disorganized — craves equal partnership, yet fears true equality',
        '天相':'Anxious — uses harmony as an excuse to avoid facing real emotional conflict'
    };

    // ─────────────────────────────────────────────────────────────────────
    // 核心函数：生成增强版命盘（带完整飞星数据）
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 从用户输入推算排盘参数
     * userInputs: { age, gender, era, name, career/profession, keIdx, ... }
     * 返回 fine-chart-engine.js 的 generateFullChart() 所需的 input 对象
     */
    function deriveChartInput(userInputs, keIdx) {
        const age     = parseInt(userInputs.age) || 25;
        const gender  = (userInputs.gender === '女' || userInputs.gender === 'female') ? 'female' : 'male';
        const keIdxN  = typeof keIdx === 'number' ? keIdx : (parseInt(userInputs.keIdx) || 0);
        const era     = userInputs.era || 'contemporary';

        // 用确定性hash将用户输入映射到农历日期（保证同输入=同命盘）
        const seedStr = [
            userInputs.name || '', gender, age, era,
            userInputs.career || userInputs.profession || '',
            userInputs.family || '', userInputs.parents || ''
        ].join('|');
        const seed = _hashCode(seedStr);

        // 农历年/月/日：从种子确定性推导
        const birthYear    = new Date().getFullYear() - age;
        const lunarMonth   = (Math.abs(seed) % 12) + 1;          // 1-12
        const lunarDay     = (Math.abs(seed >> 4) % 30) + 1;      // 1-30
        // 时辰：keIdx 0-7 对应一天中某个时辰的某一刻
        // 将 keIdx 映射到12时辰之一（让不同驱动力对应不同时辰）
        const shichenList = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        const shichenIdx  = (Math.abs(seed >> 8) + keIdxN) % 12;
        const shichen     = shichenList[shichenIdx];

        return {
            year:       birthYear,
            lunarMonth,
            lunarDay,
            shichen,
            shichenIdx,
            gender,
            keIdx:      keIdxN,
            keName:     KE_NAMES[keIdxN] || '初刻',
            _seedStr:   seedStr
        };
    }

    /**
     * 主入口：生成完整的命盘+编创参数
     * @param {Object} userInputs - app-v2.js 中的 userInputs
     * @param {number} keIdx - 0-7，用户选择的驱动力序号（对应8刻）
     * @returns {Object} 完整命盘+编创参数（供 ziwei-bio-core.js 使用）
     */
    function generateEnrichedChart(userInputs, keIdx) {
        const ZiweiEngine = global.ZiweiEngine;
        if (!ZiweiEngine) {
            console.warn('[bridge] ZiweiEngine 未加载，使用简化命盘逻辑');
            // 回退：返回简化命盘数据
            return generateSimplifiedChart(userInputs, keIdx);
        }

        try {
            const chartInput = deriveChartInput(userInputs, keIdx);
            const fullChart  = ZiweiEngine.generateFullChart({
                year:       chartInput.year,
                lunarMonth: chartInput.lunarMonth,
                lunarDay:   chartInput.lunarDay,
                shichen:    chartInput.shichen,
                gender:     chartInput.gender,
            });

            // 提取命宫/福德宫/夫妻宫的主星
            const mingIdx     = fullChart.mingPalace.index;
            const fudeIdx     = (mingIdx + 10) % 12;  // 福德宫 = 命宫逆数第3 = +10
            const fuqiIdx     = (mingIdx + 2) % 12;   // 夫妻宫 = 命宫顺数第3

            const mingPalace  = fullChart.palaces[mingIdx];
            const fudePalace  = fullChart.palaces[fudeIdx];
            const fuqiPalace  = fullChart.palaces[fuqiIdx];
            const guanluPalace = fullChart.palaces[(mingIdx + 8) % 12];  // 官禄宫

            const mingMainStar  = (mingPalace.mainStars  || [])[0]  || '紫微';
            const fudeMainStar  = (fudePalace.mainStars  || [])[0]  || mingMainStar;
            const fuqiMainStar  = (fuqiPalace.mainStars  || [])[0]  || '天同';
            const guanluMainStar = (guanluPalace.mainStars || [])[0] || mingMainStar;

            // ── 真实四化：从飞星宫干飞化数据提取命宫飞出的四化 ──
            const sihuaProfile = extractSihuaProfile(fullChart, mingIdx);

            // ── 大限节点：取第一大限和第二大限（用于小传的"人生阶段"描写）──
            const daxianProfile = extractDaxianProfile(fullChart);

            // ── 三方四正摘要 ──
            const sanfangProfile = extractSanfangProfile(fullChart, mingIdx);

            // ── 格局类型 ──
            const patternType = STAR_TO_PATTERN[mingMainStar] || '杀破狼';

            // ── 编创参数（骨架→肉的翻译层）──
            const creativeParams = buildCreativeParams({
                mingMainStar, fudeMainStar, fuqiMainStar, guanluMainStar,
                sihuaProfile, daxianProfile, sanfangProfile,
                patternType, chartInput, era: userInputs.era || 'contemporary',
                fullChart, mingIdx   // 人际关系分析所需
            });

            return {
                // 兼容旧版 selectedChart 字段
                pattern: {
                    name: mingMainStar + '命格',
                    stars: mingPalace.mainStars || [mingMainStar],
                    desc: creativeParams.blindSpot
                },
                patternType,
                shiChen:    chartInput.shichen,
                ke:         chartInput.keIdx,
                keName:     chartInput.keName,
                chartId:    _hashCode(chartInput._seedStr).toString(36),
                personalityTypes: null,  // 保持DRIVE_8_TYPES驱动力标签UI不变
                sihua:      sihuaProfile,
                mingGong:   { stars: mingPalace.mainStars, desc: '' },
                fuqiGong:   { stars: fuqiPalace.mainStars },
                // 新增：完整增强数据
                _fullChart:     fullChart,
                _creativeParams: creativeParams,
                _palaces: {
                    ming:   mingPalace,
                    fude:   fudePalace,
                    fuqi:   fuqiPalace,
                    guanlu: guanluPalace
                },
                _sihuaProfile:   sihuaProfile,
                _daxianProfile:  daxianProfile,
                _sanfangProfile: sanfangProfile,
            };
        } catch (err) {
            console.error('[bridge] generateEnrichedChart 异常:', err);
            return generateSimplifiedChart(userInputs, keIdx);
        }
    }

    /**
     * 简化命盘生成（ZiweiEngine 未加载时的回退方案）
     * 基于用户输入推导主星和格局
     */
    function generateSimplifiedChart(userInputs, keIdx) {
        // 基于用户输入推导命盘参数
        const chartInput = deriveChartInput(userInputs, keIdx);
        
        // 简化：根据时代/性别/职业推导主星
        const starMap = {
            'ancient': { 'male': ['紫微', '天府'], 'female': ['太阴', '天相'] },
            'modern': { 'male': ['七杀', '破军'], 'female': ['贪狼', '廉贞'] },
            'contemporary': { 'male': ['武曲', '天梁'], 'female': ['天同', '天机'] }
        };
        const era = userInputs.era || 'contemporary';
        const gender = userInputs.gender || 'male';
        const mainStars = (starMap[era] && starMap[era][gender]) || ['紫微'];
        
        // 根据主星确定格局类型
        const starToPattern = {
            '紫微': '紫府廉武相', '天府': '紫府廉武相', '太阳': '紫府廉武相',
            '七杀': '杀破狼', '破军': '杀破狼', '贪狼': '杀破狼', '廉贞': '杀破狼',
            '天机': '机月同梁', '太阴': '机月同梁', '天同': '机月同梁', '天梁': '机月同梁',
            '巨门': '巨日', '天相': '紫府廉武相',
            '武曲': '紫府廉武相'
        };
        const patternType = starToPattern[mainStars[0]] || '杀破狼';
        
        return {
            pattern: {
                name: mainStars[0] + '命格',
                stars: mainStars,
                desc: mainStars[0] + '坐命，格局独特'
            },
            patternType: patternType,
            shiChen: chartInput.shichen,
            ke: chartInput.keIdx,
            keName: chartInput.keName,
            chartId: _hashCode(chartInput._seedStr || Date.now().toString()).toString(36),
            personalityTypes: null,
            sihua: { mingHua: '化禄', defaultType: '化禄型' },
            mingGong: { stars: mainStars, desc: '' },
            fuqiGong: { stars: ['天同'] },
            _fullChart: null,
            _creativeParams: {
                mingMainStar: mainStars[0],
                fudeMainStar: mainStars[0],
                fuqiMainStar: '天同',
                patternType: patternType,
                sihuaType: '化禄型',
                era: era
            }
        };
    }

    // ─────────────────────────────────────────────────────────────────────
    // 提取函数：从 fullChart 中取出编创所需的结构化数据
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 提取命宫四化情况
     * 返回：{ hasLu, hasQuan, hasKe, hasJi, luStar, quanStar, keStar, jiStar,
     *         sihuaType, sihuaDesc }
     */
    function extractSihuaProfile(fullChart, mingIdx) {
        const fs = fullChart.flyingStars || {};
        const result = { hasLu:false, hasQuan:false, hasKe:false, hasJi:false,
                         luStar:'', quanStar:'', keStar:'', jiStar:'' };

        // 遍历宫干飞化，找落入命宫的四化
        for (const [palaceLabel, palaceFs] of Object.entries(fs)) {
            if (!palaceFs) continue;
            for (const [sihuaName, sihuaData] of Object.entries(palaceFs)) {
                if (!sihuaData) continue;
                const targetIdx = sihuaData.targetIdx !== undefined ? sihuaData.targetIdx : -1;
                if (targetIdx !== mingIdx) continue;
                if (sihuaName === '化禄' || sihuaName === 'lu')  { result.hasLu   = true; result.luStar   = sihuaData.star || ''; }
                if (sihuaName === '化权' || sihuaName === 'quan') { result.hasQuan = true; result.quanStar = sihuaData.star || ''; }
                if (sihuaName === '化科' || sihuaName === 'ke')  { result.hasKe   = true; result.keStar   = sihuaData.star || ''; }
                if (sihuaName === '化忌' || sihuaName === 'ji')  { result.hasJi   = true; result.jiStar   = sihuaData.star || ''; }
            }
        }

        // 也检查生年四化（本命四化落命宫）
        const fourTrans = fullChart.fourTransformations || {};
        for (const [tname, tdata] of Object.entries(fourTrans)) {
            if (!tdata || tdata.palaceIdx !== mingIdx) continue;
            if (tname === '化禄')  { result.hasLu   = true; result.luStar   = tdata.star || ''; }
            if (tname === '化权')  { result.hasQuan = true; result.quanStar = tdata.star || ''; }
            if (tname === '化科')  { result.hasKe   = true; result.keStar   = tdata.star || ''; }
            if (tname === '化忌')  { result.hasJi   = true; result.jiStar   = tdata.star || ''; }
        }

        // 推断四化主类型（优先级：忌>权>禄>科）
        let sihuaType = '化禄型';
        let sihuaDesc = '';
        if (result.hasJi) {
            sihuaType = '化忌型';
            sihuaDesc = '命宫有化忌落入——命运总在他最用力的地方崩裂，越执着越失去，越放手越回来。这就是他的宿命——不是命运残忍，是他不肯松手。';
        } else if (result.hasQuan) {
            sihuaType = '化权型';
            sihuaDesc = '命宫有化权落入——掌控是安全感的来源，失控是最大的恐惧。他以为自己在保护你，其实他在害怕。';
        } else if (result.hasLu) {
            sihuaType = '化禄型';
            sihuaDesc = '命宫有化禄落入——天赋如流水，自然流淌。他生命里所有好事都来得太轻松，这才是他真正的问题。';
        } else if (result.hasKe) {
            sihuaType = '化科型';
            sihuaDesc = '命宫有化科落入——理性是盾牌，名誉是铠甲。他活在别人的评价里，连镜子都不敢正眼看。';
        }

        result.sihuaType = sihuaType;
        result.sihuaDesc = sihuaDesc;
        return result;
    }

    /**
     * 提取大限概况
     * 返回：{ totalDaxian, firstDaxian, secondDaxian, forwardMode }
     */
    function extractDaxianProfile(fullChart) {
        const seq = fullChart.daxianSequence || [];
        if (!seq.length) return { totalDaxian: 0, firstDaxian: null, secondDaxian: null };
        return {
            totalDaxian:  seq.length,
            firstDaxian:  seq[0]  || null,
            secondDaxian: seq[1]  || null,
            forwardMode:  seq[0]  ? seq[0].forward : true,
            daxianSummary: seq.slice(0, 4).map(d => ({
                startAge: d.startAge,
                palaceIdx: d.palaceIdx,
                palaceName: PALACE_NAMES[(d.palaceIdx - (fullChart.mingPalace.index || 0) + 12) % 12],
                dizhi: DIZHI[d.palaceIdx] || '',
                palaceGan: d.palaceGan || ''
            }))
        };
    }

    /**
     * 提取三方四正摘要
     */
    function extractSanfangProfile(fullChart, mingIdx) {
        const sf = fullChart.sanFangSiZheng || {};
        const result = { mingIdx, sanfangStars: [], zhengYaoStars: [] };
        // 三方宫索引 = 命宫 + 4 + 8 (mod 12)
        const sanfangIdxList = [mingIdx, (mingIdx + 4) % 12, (mingIdx + 8) % 12];
        // 正曜（对宫）= 命宫 + 6
        const duiGongIdx = (mingIdx + 6) % 12;

        for (const idx of sanfangIdxList) {
            const palace = fullChart.palaces[idx];
            if (palace && palace.mainStars) {
                result.sanfangStars.push(...palace.mainStars);
            }
        }
        const duiPalace = fullChart.palaces[duiGongIdx];
        if (duiPalace && duiPalace.mainStars) {
            result.zhengYaoStars.push(...duiPalace.mainStars);
        }

        // 三方四正内是否有对冲主星（直线/波浪线的戏剧张力来源）
        result.hasInternalConflict = result.sanfangStars.length >= 2;
        result.conflictDesc = result.hasInternalConflict
            ? `三方宫位有${result.sanfangStars.join('+')}，${_getSanfangConflictDesc(result.sanfangStars)}`
            : '三方较为单纯，人生格局较稳定';

        return result;
    }

    function _getSanfangConflictDesc(stars) {
        const killGroup = ['七杀','破军','贪狼'];
        const moonGroup = ['太阴','天同','天机','天梁'];
        const hasKill = stars.some(s => killGroup.includes(s));
        const hasMoon = stars.some(s => moonGroup.includes(s));
        if (hasKill && hasMoon) return '兼具破坏力与温柔，内心住着两种截然不同的人';
        if (hasKill) return '行动力强，但冲动与理智常常拉锯';
        if (hasMoon) return '感受细腻，但有时过于感性而犹豫不决';
        return '格局多元，需在不同面向中找到平衡';
    }

    // ─────────────────────────────────────────────────────────────────────
    // 编创参数构建：骨架 → 肉的翻译层
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 将命盘结构化数据翻译为小传生成参数
     * 这是创作资源（喜剧理论/心理学/特质词库）与命盘数据的融合点
     */
    function buildCreativeParams(p) {
        const {
            mingMainStar, fudeMainStar, fuqiMainStar, guanluMainStar,
            sihuaProfile, daxianProfile, sanfangProfile,
            patternType, chartInput, era,
            fullChart, mingIdx   // 人际关系分析所需
        } = p;

        // ── 喜剧武器一：认知盲点（卡普兰"非英雄"机制）──
        var lang = (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : 'zh');
        var blindSpot = lang === 'en' 
            ? (STAR_BLIND_SPOT_EN[mingMainStar] || 'Has unique blind spots')
            : (STAR_BLIND_SPOT[mingMainStar] || '有自己独特的人生局限');

        // ── 弗洛伊德防御机制（福德宫=潜意识）──
        const defenseMechanism = lang === 'en'
            ? (STAR_DEFENSE_MECHANISM_EN[fudeMainStar || mingMainStar] || 'Has a unique self-protection style')
            : (STAR_DEFENSE_MECHANISM[fudeMainStar || mingMainStar] || '有独特的自我保护方式');

        // ── 依恋类型（夫妻宫）──
        const attachmentType = lang === 'en'
            ? (STAR_ATTACHMENT_TYPE_EN[fuqiMainStar || mingMainStar] || 'Needs to find balance in relationships')
            : (STAR_ATTACHMENT_TYPE[fuqiMainStar || mingMainStar] || '需要在关系中找到平衡');

        // ── 官禄宫：事业/使命维度 ──
        const careerMission = _getCareerMission(guanluMainStar, patternType);

        // ── 四化生命主题 ──
        const lifeTheme = _getLifeTheme(sihuaProfile.sihuaType, mingMainStar);

        // ── 三方四正：内在张力描述（直线/波浪线武器）──
        const internalTension = sanfangProfile.conflictDesc;

        // ── 大限叙事节点 ──
        const daxianNarrative = _buildDaxianNarrative(daxianProfile, era);

        // ── 时辰刻度：★ 优先使用宫干飞化驱动的精细状态（calcKeFlowState）──
        const keState = calcKeFlowState(fullChart, mingIdx, chartInput.keIdx, mingMainStar, sihuaProfile.sihuaType);

        // ── 人际关系宫位分析（飞星×宫位×心理占星融合）──
        const interpersonalProfile = _buildInterpersonalProfile(fullChart, mingIdx, p);

        return {
            blindSpot,
            defenseMechanism,
            attachmentType,
            careerMission,
            lifeTheme,
            internalTension,
            daxianNarrative,
            keState,
            interpersonalProfile,  // 新增：人际关系深度分析
            sihuaType:    sihuaProfile.sihuaType,
            sihuaDesc:    sihuaProfile.sihuaDesc,
            era,
            // 原始引用
            mingMainStar, fudeMainStar, fuqiMainStar, guanluMainStar,
            patternType
        };
    }

    /**
     * 人际关系宫位深度分析
     * 基于紫微斗数的宫位人际逻辑 + 鲁道夫心理占星人际合盘理论
     *
     * 核心思想（来自《人际合盘占星全书》）：
     * - 你的命宫四化落入什么宫 → 你会对那个宫代表的"关系维度"产生强烈影响
     * - 夫妻宫主星 = 你"投影"出去的阴影（你在伴侣身上寻找自己缺失的那部分）
     * - 交友宫主星 = 你在社交圈中真实的互动方式
     * - 兄弟宫主星 = 你在平等关系（朋友/同事/合作者）中的模式
     *
     * @param {Object} fullChart - ZiweiEngine.generateFullChart() 的返回值
     * @param {number} mingIdx - 命宫宫位索引
     * @param {Object} p - 已提取的宫位主星对象
     */
    function _buildInterpersonalProfile(fullChart, mingIdx, p) {
        if (!fullChart || typeof mingIdx !== 'number') return null;

        const palaces = fullChart.palaces || [];

        // 各人际宫位主星
        const fuqiIdx    = (mingIdx + 2) % 12;   // 夫妻宫 (命宫顺数第3，偏移+2)
        const xiongdiIdx = (mingIdx + 1) % 12;   // 兄弟宫 (+1)
        const jiaoYouIdx = (mingIdx + 5) % 12;   // 交友宫/仆役宫 (+5)
        const tianYiIdx  = (mingIdx + 4) % 12;   // 疾厄宫 (+4，身体/他人给予的压力)
        const gianluIdx  = (mingIdx + 8) % 12;   // 官禄宫 (+8)

        const getMainStar = (idx) => {
            const pal = palaces[idx];
            if (!pal) return null;
            return (pal.mainStars && pal.mainStars[0]) || null;
        };

        const fuqiStar    = getMainStar(fuqiIdx);
        const xiongdiStar = getMainStar(xiongdiIdx);
        const jiaoYouStar = getMainStar(jiaoYouIdx);

        // 夫妻宫飞化（命宫宫干→哪颗星化忌/化权落入夫妻宫）
        let fuqiFlyDesc = '';
        if (fullChart.flyingStars) {
            const fuqiPalGan = palaces[fuqiIdx] && palaces[fuqiIdx].gan;
            if (fuqiPalGan && fullChart.flyingStars[fuqiPalGan]) {
                const fs = fullChart.flyingStars[fuqiPalGan];
                if (fs.huaji) fuqiFlyDesc = `夫妻宫宫干（${fuqiPalGan}）飞化忌落入宫内——感情中有执念与伤，${STAR_ATTACHMENT_TYPE[fuqiStar] || '关系模式复杂'}`;
                else if (fs.huaquan) fuqiFlyDesc = `夫妻宫宫干飞化权——在感情中有强烈的主导欲，习惯掌控关系走向`;
                else if (fs.hualu) fuqiFlyDesc = `夫妻宫宫干飞化禄——感情滋润，但容易在关系中付出过多`;
            }
        }

        // 夫妻宫主星→依恋模式描述（心理占星"投影"概念：伴侣是你阴影的镜子）
        const fuqiProjection = _getFuqiProjection(fuqiStar, fuqiIdx, mingIdx);

        // 交友宫主星→社交动力
        const jiaoYouStyle = _getJiaoYouStyle(jiaoYouStar);

        // 兄弟宫主星→平等关系模式
        const xiongdiPattern = _getXiongdiPattern(xiongdiStar);

        // 飞星落宫人际分析（命宫化忌/化权飞出→影响哪个宫）
        const mingFlyImpact = _getMingFlyImpact(fullChart, mingIdx);

        return {
            fuqiStar,
            fuqiProjection,   // 夫妻宫投影（心理占星核心）
            fuqiFlyDesc,      // 夫妻宫飞化描述
            jiaoYouStar,
            jiaoYouStyle,     // 交友宫社交动力
            xiongdiStar,
            xiongdiPattern,   // 兄弟宫平等关系模式
            mingFlyImpact,    // 命宫飞化落入哪个人际宫的影响
        };
    }

    function _getFuqiProjection(fuqiStar, fuqiIdx, mingIdx) {
        // 心理占星核心：夫妻宫 = 你寻找的"另一半阴影"
        // 命宫与夫妻宫相对（卯-酉，子-午等），这在西方占星对应"上升-下降轴"
        const projections = {
            '紫微': '你在伴侣身上寻找王者气质——那份你自己未必敢展现的权威和担当。关系中的权力结构是核心矛盾。',
            '天机': '你在伴侣身上寻找聪明和灵活——喜欢被人引导思考，但会对"思维不在线"的伴侣失去耐心。',
            '太阳': '你在伴侣身上寻找温暖和可靠——一个照亮你的人。但小心：太需要阳光，容易依赖。',
            '武曲': '你在伴侣身上寻找行动力和安全感——需要一个能做事的人，但也容易在感情中变得过于现实。',
            '天同': '你在伴侣身上寻找包容和温柔——但这也意味着你可能被惯坏，或在关系中丧失边界。',
            '廉贞': '你在伴侣身上寻找复杂和激情——无趣的关系维持不了多久。戏剧性是这段关系的底色。',
            '天府': '你在伴侣身上寻找稳定和保护——夫妻宫天府的人，对关系安全感需求极高，宁可保守也不冒险。',
            '太阴': '你在伴侣身上寻找细腻和情感共鸣——需要被理解，甚至有点需要被宠。',
            '贪狼': '你在伴侣身上寻找魅力和多面性——这是最容易遭遇"对方表里不一"困境的命盘之一。',
            '巨门': '你在伴侣身上寻找真实和深度——无法接受表面关系，但也容易在亲密中"审讯"对方。',
            '天相': '你在伴侣身上寻找公正和担当——需要一个愿意遵守规则的伴侣，若被辜负会有深度失望。',
            '天梁': '你在伴侣身上寻找智慧和保护——比实际年龄老成的伴侣对你有吸引力，代际关系或师生情有可能出现。',
            '七杀': '你在伴侣身上寻找强大和独立——弱者和依赖者对你没有吸引力，但"两强相遇"也意味着长期拉锯。',
            '破军': '你在伴侣身上寻找改变和刺激——你的关系注定不太平，但平静的关系也会让你主动制造波澜。'
        };
        return projections[fuqiStar] || '夫妻宫空宫，感情受命宫主星影响更大，对关系模式有独特的自我定义。';
    }

    function _getJiaoYouStyle(jiaoYouStar) {
        const styles = {
            '紫微': '社交圈中自带领导气场，朋友们遇事习惯找你拿主意——但真正亲密的人不多',
            '天机': '在朋友圈中是信息中枢和智囊，但也容易因为想太多而在社交中保持距离',
            '太阳': '社交能量旺盛，人缘好，但"好人缘"有时意味着关系流于表面',
            '武曲': '朋友不多但极为可靠，在圈子里以执行力和靠谱著称',
            '天同': '随和好相处，社交中几乎没有敌人，但也因此容易被人轻视',
            '廉贞': '社交圈复杂，与人的关系容易走极端——要么深交，要么毫无往来',
            '天府': '在圈子里是稳定的核心，大家遇事都会依靠你，但你也因此背负了很多',
            '太阴': '社交圈不大但质量高，倾向于深度关系，对表面应酬感到疲惫',
            '贪狼': '桃花极旺，认识的人多，但真正深入的关系少，圈子里容易有是非',
            '巨门': '言语是社交的核心工具，容易因为说话太直被误解，也容易因此树敌',
            '天相': '在圈子里担任协调者，喜欢化解矛盾，但也容易变成两边不讨好的夹心人',
            '天梁': '圈子里的老大哥/老大姐角色，经验丰富，容易吸引需要指引的人',
            '七杀': '朋友圈极少但极忠诚，不喜欢人情往来，社交对你是消耗而非补充',
            '破军': '社交圈变动频繁，认识很多人，但关系来来去去，少有长期稳定的友谊'
        };
        return styles[jiaoYouStar] || '交友宫空宫，社交模式受其他宫星影响，关系走向较为随机';
    }

    function _getXiongdiPattern(xiongdiStar) {
        const patterns = {
            '紫微': '在平等关系中无法真正"平等"——你的气场会让合作者自然形成上下级感',
            '天机': '合作中是最好的策划者，但执行上容易半途而废或被更好的方案诱惑改变方向',
            '太阳': '在合作中习惯付出更多，有时会被人理所当然，需要学会界定贡献边界',
            '武曲': '最可靠的合作伙伴，但合作中容易争权，因为你对"做对的方式"有强烈执念',
            '天同': '合作中以和为贵，不喜争执，但有时会为了维持和谐而委屈自己',
            '廉贞': '合作关系复杂，既有极高的忠诚度，也有潜在的竞争与摩擦',
            '天府': '是最好的守成型合伙人，在稳定的合作中如鱼得水，但不擅长开疆拓土',
            '太阴': '在合作中敏感细腻，能察觉细微的人际变化，但也容易因情绪波动影响判断',
            '贪狼': '合作中充满魅力但不可预测，好时加倍好，出现分歧时容易彻底决裂',
            '巨门': '合作中直言不讳，是最好的"问题发现者"，但也因此容易让合作氛围紧张',
            '天相': '在团体中扮演规则的守护者，但有时过于讲规矩会让协作失去灵活性',
            '天梁': '是团体的精神领袖，用智慧和经验影响他人，但有时过于"老成"会与年轻的合作者产生代沟',
            '七杀': '合作中是最强的执行者，但在决策上容易独断，不擅长接受他人意见',
            '破军': '最有创造力的合作者，擅长打破旧有格局，但也容易把自己的团队也一起打破'
        };
        return patterns[xiongdiStar] || '兄弟宫空宫，在平等关系中的模式较为灵活，受时势影响较大';
    }

    function _getMingFlyImpact(fullChart, mingIdx) {
        if (!fullChart || !fullChart.flyingStars) return null;
        // 找到命宫宫干，看它飞化出去落到哪个人际宫
        const palaces = fullChart.palaces || [];
        const mingPalace = palaces[mingIdx];
        if (!mingPalace || !mingPalace.gan) return null;
        
        const mingGan = mingPalace.gan;
        const fs = fullChart.flyingStars[mingGan];
        if (!fs) return null;

        // 检查飞化忌落入哪个宫（对小传最有价值的是化忌）
        const PALACE_NAMES_ARR = ['命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫','迁移宫','仆役宫','官禄宫','田宅宫','福德宫','父母宫'];
        const interpersonalPalaces = {1:'兄弟宫', 2:'夫妻宫', 4:'疾厄宫', 7:'仆役宫', 8:'官禄宫'};
        
        if (fs.huaji) {
            const jiStar = fs.huaji;
            // 找化忌落在哪个宫
            for (let i = 0; i < palaces.length; i++) {
                const pal = palaces[i];
                if (pal && pal.mainStars && pal.mainStars.includes(jiStar)) {
                    const palName = PALACE_NAMES_ARR[i] || `第${i+1}宫`;
                    const isInterpersonal = interpersonalPalaces[i];
                    if (isInterpersonal) {
                        return `命宫宫干（${mingGan}）化忌（${jiStar}）落入${palName}——这是一生中在${isInterpersonal}上反复纠缠、难以释怀的执念所在，对应凯龙星"无法治愈的伤口"`;
                    }
                }
            }
        }
        return null;
    }

    function _getCareerMission(guanluStar, patternType) {
        var lang = (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : 'zh');
        if (lang === 'en') {
            const missionsEN = {
                '紫微':'Born with a sense of mission — even if he won\'t admit it, others can feel it in his presence',
                '天机':'Navigating the labyrinth of information and strategy — his perfect position is where no one else has thought to look',
                '太阳':'Lighting the way for others is his calling, but he needs to learn to sometimes turn off his own light and rest',
                '武曲':'Building achievements through action, not words — his success is written in everything he\'s done, not in a résumé',
                '天同':'Giving tired people a reason to pause — his very existence is a kind of healing',
                '廉贞':'Walking the boundary between desire and morality, eventually finding his own unique path',
                '天府':'Guarding and passing on — he is the one who ensures wealth and wisdom continue',
                '太阴':'Building bridges between beauty and feeling — he transforms inner landscapes into language others can read',
                '贪狼':'Exploring all life\'s possibilities through talent and charm — he is destined to be multifaceted, not defined by one thing',
                '巨门':'Using language to reveal truth — whatever the cost',
                '天相':'Holding to fairness in unfairness — even if sometimes all he can do is hold the middle line',
                '天梁':'Helping others cross over is his lesson, but he too needs someone to help him cross',
                '七杀':'Opening new frontiers, standing alone — but he needs to learn that after victory, rest is also permitted',
                '破军':'Disruption and rebuilding — his mission is to break what needs to be broken'
            };
            return missionsEN[guanluStar] || 'Finding unique meaning within his own field';
        }
        const missions = {
            '紫微':'生来就带着某种使命感，哪怕他自己不承认，旁人也能感受到那种气场',
            '天机':'在信息与策略的迷宫里穿行——他最适合的位置，是所有人都还没想到的地方',
            '太阳':'用光照亮他人是他的天命，但他需要学会有时候关掉自己的光，休息一下',
            '武曲':'用行动而非语言建立功业——他的成就写在每一件做成的事上，不在简历里',
            '天同':'给疲惫的人一个停下来的理由——他的存在本身，就是一种治愈',
            '廉贞':'在欲望与道德的边界上行走，最终找到那条独属于自己的路',
            '天府':'守护和传承——他是让财富和智慧延续下去的那个人',
            '太阴':'在美与感受之间建立桥梁——他能把内心的风景变成别人能读懂的语言',
            '贪狼':'用才华和魅力探索人生所有可能——他注定是多面的，不该被一个定义框住',
            '巨门':'用语言揭示真相——不管付出什么代价',
            '天相':'在不公正中坚持公正——哪怕有时只能做到保住中间那条线',
            '天梁':'渡人是他的课题，但他也需要有人渡他',
            '七杀':'开疆拓土，独当一面——但他需要学会，胜利之后也要允许自己休息',
            '破军':'颠覆与重建——他的使命就是打破那些本该被打破的东西'
        };
        return missions[guanluStar] || '在自己的领域内，找到独特的生命意义';
    }

    function _getLifeTheme(sihuaType, mingMainStar) {
        var lang = (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : 'zh');
        if (lang === 'en') {
            const themesEN = {
                '化禄型': 'The flow and waste of talent — he has more than anyone, the question is whether he\'s ever truly owned it',
                '化权型': 'A life of control and letting go — he spends his entire life learning the word "release"',
                '化科型': 'The gulf between image and reality — someday he\'ll discover the self he performs for others hasn\'t shown up in a long time',
                '化忌型': 'The weight of obsession — every time he thinks he can let go, he ends up back at the starting point'
            };
            return themesEN[sihuaType] || 'Finding his own answer between fate and choice';
        }
        const themes = {
            '化禄型': '天赋的流动与浪费——他拥有的比任何人都多，问题是他从未真正拥有过',
            '化权型': '掌控与放手的一生——他用整个人生来学习"松手"这两个字',
            '化科型': '形象与真实之间的鸿沟——某天他会发现，活给别人看的那个自己已经很久没出现了',
            '化忌型': '执念的重量——每一次以为可以放下，每一次又回到了原点'
        };
        const base = themes[sihuaType] || '在命运与选择之间寻找自己的答案';
        return base;
    }

    function _buildDaxianNarrative(daxianProfile, era) {
        var lang = (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : 'zh');
        if (lang === 'en') {
            if (!daxianProfile || !daxianProfile.firstDaxian) return 'The first chapter of fate quietly begins in uncertainty.';
            const first = daxianProfile.firstDaxian;
            const eraPrefixEN = { ancient:'In the chaos of war', modern:'In the tide of the times', contemporary:'In this present era' }[era] || 'On life\'s journey';
            const forward = daxianProfile.forwardMode;
            const directionEN = forward ? 'Forward cycle — destiny unfolds from within outward' : 'Reverse cycle — life accumulates from without inward';
            return `${eraPrefixEN}, ${directionEN}. The first major cycle begins at age ${first.startAge}, entering ${first.palaceGan || ''} Palace — ${_getDaxianPalaceNoteEN(first)}`;
        }
        if (!daxianProfile || !daxianProfile.firstDaxian) return '命运的第一章，在懵懂中悄然开启。';
        const first = daxianProfile.firstDaxian;
        const eraPrefix = { ancient:'乱世中', modern:'时代浪潮里', contemporary:'当下这个时代' }[era] || '人生路上';
        const forward = daxianProfile.forwardMode;
        const direction = forward ? '顺行大限，命运的节奏由内向外展开' : '逆行大限，生命的积累从外向内沉淀';
        return `${eraPrefix}，${direction}。第一个大限从${first.startAge}岁开启，走入${first.palaceGan || ''}宫——${_getDaxianPalaceNote(first)}`;
    }

    function _getDaxianPalaceNote(daxian) {
        const idx = daxian.palaceIdx;
        const notes = {
            0: '命运进入命宫大限，本命特质全面激活，自我面临重塑',
            1: '兄弟宫大限，六亲情谊和同伴关系是这段岁月的主旋律',
            2: '夫妻宫大限，关系与感情是这段人生最重要的课题',
            3: '子女宫大限，创造与传承的力量被激活',
            4: '财帛宫大限，物质与资源的积累成为命运的重心',
            5: '疾厄宫大限，身体和心理的磨砺期',
            6: '迁移宫大限，走出去，在外部世界找到自己的坐标',
            7: '交友宫大限，人脉与社会网络是这段岁月的财富',
            8: '官禄宫大限，事业与志向在这段岁月中定型',
            9: '田宅宫大限，家庭根基与安全感是这段时间的核心',
            10: '福德宫大限，内心世界与精神追求被激活，向内探索',
            11: '父母宫大限，与原生家庭的和解与传承'
        };
        return notes[idx] || '命运进入新的宫位，人生翻开新的一章。';
    }

    function _getDaxianPalaceNoteEN(daxian) {
        const idx = daxian.palaceIdx;
        const notesEN = {
            0: 'Destiny enters the Ming Palace cycle — core fate fully activates, selfhood faces reconstruction',
            1: 'Siblings Palace cycle — family bonds and companionship define this chapter',
            2: 'Spouse Palace cycle — relationships and intimacy are the central lessons',
            3: 'Children Palace cycle — creative and generative powers awaken',
            4: 'Wealth Palace cycle — material and resource accumulation becomes the focus',
            5: 'Health Palace cycle — a period of physical and psychological refinement',
            6: 'Migration Palace cycle — stepping out, finding one\'s coordinates in the external world',
            7: 'Friends Palace cycle — networks and social connections are this period\'s wealth',
            8: 'Career Palace cycle — ambition and vocation take shape in these years',
            9: 'Property Palace cycle — home foundation and security are at the core',
            10: 'Fortune Palace cycle — inner world and spiritual pursuits awaken, journey inward',
            11: 'Parents Palace cycle — reconciliation and legacy with family of origin'
        };
        return notesEN[idx] || 'Destiny enters a new palace, life turns a fresh page.';
    }

    /**
     * 8刻精细状态——结合主星特质+刻度节律+四化类型，输出命盘最精细的时间层状态
     * 这是紫微斗数"刻"的创作化应用：每刻15分钟，8刻对应一个时辰内的能量节律
     * 对应凯龙星概念：每个刻度都有其"伤口深度"——生于哪一刻，决定了这个伤是藏着的还是外露的
     *
     * @param {number} keIdx 0-7
     * @param {string} mainStar 命宫主星
     * @param {string} sihuaType 四化类型（可选，用于进一步细化）
     */
    function _getKeState(keIdx, mainStar, sihuaType) {
        // 刻度节律（参考鲁道夫心理占星：行星能量有"上升/高峰/转折/回落"节律）
        const KE_RHYTHM = [
            { phase: '潜伏期', rhythm: '初刻', quality: '种子尚未破土，能量内藏' },
            { phase: '萌发期', rhythm: '一刻', quality: '第一缕光线透出，还很脆弱' },
            { phase: '显现期', rhythm: '二刻', quality: '轮廓清晰，开始被人识别' },
            { phase: '强化期', rhythm: '三刻', quality: '特质被放大，优缺点同时凸显' },
            { phase: '高峰期', rhythm: '正刻', quality: '能量顶点，影响力最大，但也最难驾驭' },
            { phase: '转折期', rhythm: '正一刻', quality: '峰回路转，外表与内在开始分离' },
            { phase: '收敛期', rhythm: '正二刻', quality: '能量向内聚合，沉默中积蓄力量' },
            { phase: '归本期', rhythm: '末刻', quality: '回归本质，以最简单的方式存在' }
        ];

        // 主星×刻度的核心叙事（创作语言版，结合心理占星"行星伤口"概念）
        const STAR_KE_CORE = {
            '紫微': ['王者的自我认知尚未建立，需要时间才能接受自己的重量',
                     '开始感受到某种与生俱来的责任感，但还在抗拒',
                     '气场已然形成，但仍在学习如何不压垮身边的人',
                     '帝星特质全开，强烈的使命感与孤独感并驾齐驱',
                     '最王者的状态——也是最孤独的状态',
                     '意识到王冠既是荣耀也是枷锁，开始思考"为何而王"',
                     '将权力收归内心，不再需要外在证明',
                     '王者最终回归普通人，用平凡的方式完成不平凡的使命'],
            '天机': ['聪明尚未发育，思维在安静中生长',
                     '开始对"为什么"产生强烈兴趣，凡事必要追根究底',
                     '谋略已具雏形，但有时想太多反而行动迟缓',
                     '思维进入高速运转，分析能力达到峰值，但也容易钻牛角尖',
                     '最聪明也最疲惫——大脑从不休息是一种慢性消耗',
                     '聪明开始往内看，思考"这些计谋到底为了什么"',
                     '智慧沉淀为直觉，不再需要那么多分析',
                     '大智若愚，以"不算计"作为最高的算计'],
            '太阳': ['光芒尚在孕育，温暖但还不稳定',
                     '开始有发光的冲动，但还在寻找自己的方向',
                     '光芒可见，但在学习区分"照耀他人"和"消耗自己"的边界',
                     '太阳在中天——给所有人温暖，却忘了给自己',
                     '最耀眼的状态，也是最容易燃尽自己的时刻',
                     '光开始往内收，发现照亮自己同样重要',
                     '暖而不灼，不再需要成为所有人的太阳',
                     '以余晖之姿存在——温柔而深远'],
            '武曲': ['财星的气质刚刚启动，做事认真但还缺经验',
                     '开始展现执行力，凡事亲力亲为是本能',
                     '果断已成型，但有时过于强硬会推开需要柔软的人',
                     '意志力达到顶峰，但情感的铁门也关得最紧',
                     '成就最高的时刻，孤独感也最强',
                     '开始意识到"能做到"和"值不值得"是两回事',
                     '将刚硬收进心里，外表开始有了弹性',
                     '以沉默代替证明，成就早已不需要被看见'],
            '天同': ['平和温柔，但还没学会如何为自己争取',
                     '开始感受到助人的满足，但边界意识尚未建立',
                     '温和是真实的，但有时过度善良会让自己成为软柿子',
                     '最宽容的状态，但也最需要警惕被人利用',
                     '爱人的能力达到顶峰，但该学会把一些爱留给自己了',
                     '开始学习"拒绝"这个词，发现它比想象中难',
                     '平静已非逃避，而是真正的内在安定',
                     '以无为而治的方式存在，最简单却最有力量'],
            '廉贞': ['欲望与道德的拉锯尚在形成，复杂性格初具雏形',
                     '开始感受到自己的与众不同，但还不确定这是优势还是负担',
                     '内心的矛盾已经清晰——规则与本能哪个更真实？',
                     '复杂性达到顶峰，用规则压制本能的代价是极度内耗',
                     '最有张力的状态——火焰与冰山并存，能量巨大也危险',
                     '开始接纳自己的复杂，不再试图消灭其中任何一面',
                     '欲望变成创造力，道德变成自律——两者终于和解',
                     '廉贞回归纯粹，用一生的复杂，换来最简单的明白'],
            '天府': ['稳健气质初现，但还在学习如何不把所有重量都扛在自己身上',
                     '开始展现守护本能，凡事以稳为先',
                     '安全感是真实的，但有时过于保守会错过变化带来的礼物',
                     '守护力最强，但也需要检查：你守护的是真实的爱，还是对失去的恐惧？',
                     '最稳定的状态，也是最难被推动的时刻',
                     '开始思考"守住"与"放手"哪个需要更大的勇气',
                     '将稳健内化为弹性，不再害怕变化',
                     '以传承代替守护——让好的东西流动，而非锁住'],
            '太阴': ['感受力尚在发育，内心世界比外表丰富得多',
                     '开始感受到美的存在，以及美的易碎',
                     '情感细腻已然展现，但有时过于敏感会让自己的世界很小',
                     '最感性的时刻，创造力达到顶峰，但情绪的浮动也最剧烈',
                     '美丽与忧郁并存——月亮从不只有明面',
                     '开始学习把感受变成作品，让内心的重量变成可以分享的东西',
                     '情感变得深邃而安静，不再需要被理解，因为已经理解了自己',
                     '以温柔之眼看世界，最后的太阴是一片沉静的夜海'],
            '贪狼': ['欲望的种子刚刚落地，还不知道自己想要什么',
                     '开始感受到对人生多种可能的渴望，一颗心同时指向多个方向',
                     '魅力已经显现，但游荡的本性也开始给自己惹麻烦',
                     '欲望最旺盛的状态，桃花最盛，诱惑最多，也最容易迷失',
                     '最耀眼的贪狼——光芒万丈，但光芒背后是从未停止的饥渴',
                     '开始质疑：追了这么多，有什么是真正属于我的？',
                     '欲望开始收缩，变成一种专注的热情',
                     '以一当十——用一颗真心，替代了所有的欲望'],
            '巨门': ['言语力量尚在积蓄，对真相有强烈好奇但还不知如何表达',
                     '开始感受到"话语的重量"，某些话说出口会改变关系',
                     '洞察力已经形成，说话已有穿透力，但容易在不经意间刺伤人',
                     '最真实也最犀利的状态——巨门说出的话，会成为别人难以遗忘的伤或礼物',
                     '言语的力量达到顶峰，但也最需要克制"非说不可"的冲动',
                     '开始学习沉默——发现有时最有力量的话，是没说出口的那一句',
                     '真相不再是武器，而是一种慈悲',
                     '以听代说，以沉默代替揭示，巨门的末刻是深邃的宁静'],
            '天相': ['规则感和公正感已具雏形，习惯站在弱者一侧',
                     '开始扮演调停者角色，喜欢化解冲突',
                     '谨慎稳重已成型，但有时过于谨慎会让行动力打折',
                     '公正感最强烈——有时会因为别人不公平对待他人而比当事人更愤怒',
                     '最守规矩也最疲惫——维持公正是一种消耗',
                     '开始意识到：有些"不公正"，是别人的功课',
                     '将公正内化为智慧，不再需要为每一件不公平的事出头',
                     '天相的末刻：以平衡者的身份退场，世界自有其规则'],
            '天梁': ['长辈气质初现，对比自己弱小的人有天然的保护本能',
                     '开始感受到某种古老的智慧在身体里，但还不知道如何使用',
                     '洞察老人与命运的能力已显，但有时过于"先知"的言论会让人敬而远之',
                     '渡人的使命感达到顶峰，但也需要检查：我是在渡人，还是在回避渡自己？',
                     '最像导师的状态，但也是最孤独的位置——渡了所有人，独自站在此岸',
                     '开始思考：谁来渡我？',
                     '将智慧收归内心，不再主动给答案，开始等待真正需要的人来问',
                     '天梁末刻：以传道者的沉默，完成了最后的教化'],
            '七杀': ['刚强气质初现，但还不知如何驾驭这股力量',
                     '开始表现出强烈的独立意识，不愿被任何人管束',
                     '意志力已成型，凡事非赢不可，但"输不起"也是隐形的软肋',
                     '最锋利的状态——砍得了荆棘，也伤得了旁人',
                     '将星特质全开，影响力最大，孤独感也最重',
                     '开始反思：征服之后，然后呢？',
                     '刚硬开始有了弹性，发现柔软不是软弱',
                     '七杀末刻：放下武器，发现不战而胜才是最高境界'],
            '破军': ['破坏本能已在，但还不知道"打破什么"——有时候连自己也在破坏范围内',
                     '开始感受到对旧秩序的强烈不满，改变的冲动越来越难压制',
                     '破坏力已经形成，旧的东西在他周围很难存活',
                     '最有破坏力也最有创造力的状态——打破是手段，重建才是目的',
                     '破局能量达到顶峰，但需要方向，否则破坏的是自己的人生',
                     '开始思考：打破一切之后，我想建立什么？',
                     '破坏力转化为重建力，开始有了建设者的耐心',
                     '破军末刻：以建设者的心态，完成了破坏者的使命']
        };

        const starDesc = (STAR_KE_CORE[mainStar] && STAR_KE_CORE[mainStar][keIdx])
            || `${mainStar}的特质在此刻（${KE_NAMES[keIdx] || '初刻'}）呈现独特状态`;
        const rhythm = KE_RHYTHM[keIdx] || KE_RHYTHM[0];
        
        // 四化类型的刻度叠加描述（参考《凯龙星》的"伤口与礼物"双重性）
        const sihuaKeNote = {
            '化禄型': { peak: '天赋在高峰刻最为耀眼，但也最容易被浪费', valley: '天赋在潜伏刻深藏，需要时间才能被自己和他人发现' },
            '化权型': { peak: '掌控欲在高峰刻达到极致，最难被接近', valley: '权威感在潜伏刻收藏，外表更平易近人，但内核一样强' },
            '化科型': { peak: '形象意识在高峰刻最强，最在意别人的眼光', valley: '理想主义在潜伏刻沉淀，更接近真实的自己' },
            '化忌型': { peak: '执念在高峰刻最沉，像一块压在胸口的石头', valley: '伤口在潜伏刻被压藏，看似平静，其实从未消失' }
        };
        const sihuaPhase = keIdx >= 4 ? 'peak' : 'valley';
        const sihuaNote = sihuaType && (sihuaKeNote[sihuaType] || {})[sihuaPhase] || '';

        return `【${rhythm.rhythm}·${rhythm.phase}】${starDesc}。${sihuaNote ? sihuaNote + '。' : ''}（节律：${rhythm.quality}）`;
    }

    // ─────────────────────────────────────────────────────────────────────
    // 工具函数
    // ─────────────────────────────────────────────────────────────────────

    function _hashCode(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(31, h) + str.charCodeAt(i) | 0;
        }
        return h;
    }

    // ═════════════════════════════════════════════════════════════════════
    // ★ 命盘算法驱动的动态生成模块 v2.0
    //   所有变量（驱动力亲和度 / 刻度飞化状态 / 8属性推荐）
    //   均由飞宫四化、三方四正、格局、夹宫、大限流年数学函数交叉计算
    //   不再使用硬编码静态词表
    // ═════════════════════════════════════════════════════════════════════

    /**
     * ── 1. 驱动力亲和度向量 ──────────────────────────────────────────────
     * 输入：fullChart（ZiweiEngine.generateFullChart 输出）+ mingIdx
     * 输出：8元素亲和度数组（0-100），对应 DRIVE_8_TYPES 的顺序
     *   [野心者, 执念者, 谋局者, 享乐者, 守护者, 破局者, 漂泊者, 隐忍者]
     *
     * 算法来源（ziwei-engine skill 知识库）：
     *   - 三方四正主星组合 → 格局系数
     *   - 命宫/迁移宫/官禄宫四化落宫 → 四化增益
     *   - 夹宫效应（左右邻宫主星） → 夹宫修正
     *   - 大限宫干飞化 → 时间轴权重
     */
    function calcDriveAffinityVector(fullChart, mingIdx) {
        const palaces   = fullChart.palaces || [];
        const sanfang   = [mingIdx, (mingIdx + 4) % 12, (mingIdx + 8) % 12];
        const duiGong   = (mingIdx + 6) % 12;   // 迁移宫（对宫）
        const guanluIdx = (mingIdx + 8) % 12;   // 官禄宫

        // 初始分（等权基线 50分）
        const score = [50, 50, 50, 50, 50, 50, 50, 50];
        // 下标映射
        const DI = {
            '野心者':0, '执念者':1, '谋局者':2, '享乐者':3,
            '守护者':4, '破局者':5, '漂泊者':6, '隐忍者':7
        };

        // ── A. 三方四正主星格局系数 ──────────────────────────────────────
        // 杀破狼系：野心+破局增益；机月同梁：守护+隐忍增益；紫府廉武相：谋局+享乐；巨日：执念+漂泊
        const PATTERN_BONUS = {
            '七杀': {0:+20, 5:+15},
            '破军': {5:+20, 6:+10},
            '贪狼': {0:+10, 3:+15, 6:+10},
            '紫微': {2:+20, 4:+10},
            '天府': {4:+20, 7:+10},
            '廉贞': {1:+15, 3:+10},
            '武曲': {0:+10, 7:+10},
            '天相': {4:+15, 7:+15},
            '天机': {2:+20, 6:+10},
            '太阴': {7:+15, 4:+10},
            '天同': {3:+20, 4:+10},
            '天梁': {4:+15, 7:+15},
            '太阳': {4:+15, 3:+10},
            '巨门': {1:+20, 6:+10}
        };

        for (const idx of sanfang) {
            const pal = palaces[idx];
            if (!pal) continue;
            for (const star of (pal.mainStars || [])) {
                const bonus = PATTERN_BONUS[star] || {};
                for (const [dIdx, val] of Object.entries(bonus)) {
                    // 三方权重：命宫×1.0，财帛/官禄×0.7
                    const w = idx === mingIdx ? 1.0 : 0.7;
                    score[parseInt(dIdx)] += Math.round(val * w);
                }
            }
        }
        // 对宫（迁移宫）补充
        const duiPal = palaces[duiGong];
        if (duiPal) {
            for (const star of (duiPal.mainStars || [])) {
                const bonus = PATTERN_BONUS[star] || {};
                for (const [dIdx, val] of Object.entries(bonus)) {
                    score[parseInt(dIdx)] += Math.round(val * 0.5);
                }
            }
        }

        // ── B. 生年四化落宫增益 ──────────────────────────────────────────
        // 四化落命宫/三方四正宫 → 对应驱动力权重
        const fourTrans = fullChart.fourTransformations || {};
        for (const [tname, tdata] of Object.entries(fourTrans)) {
            if (!tdata) continue;
            const tIdx = tdata.palaceIdx !== undefined ? tdata.palaceIdx : -1;
            const isMing     = tIdx === mingIdx;
            const isSanfang  = sanfang.includes(tIdx);
            const isGuanlu   = tIdx === guanluIdx;
            if (!isMing && !isSanfang && !isGuanlu) continue;
            const w = isMing ? 1.0 : isSanfang ? 0.6 : 0.5;
            if (tname === '化忌') {
                score[DI['执念者']] += Math.round(25 * w);
                score[DI['隐忍者']] += Math.round(15 * w);
            } else if (tname === '化权') {
                score[DI['野心者']] += Math.round(25 * w);
                score[DI['谋局者']] += Math.round(15 * w);
                score[DI['破局者']] += Math.round(10 * w);
            } else if (tname === '化禄') {
                score[DI['享乐者']] += Math.round(20 * w);
                score[DI['守护者']] += Math.round(15 * w);
            } else if (tname === '化科') {
                score[DI['谋局者']] += Math.round(20 * w);
                score[DI['隐忍者']] += Math.round(10 * w);
            }
        }

        // ── C. 命宫宫干飞化链（飞星体系核心增益） ──────────────────────
        const flyingStars = fullChart.flyingStars || {};
        const mingGan = (palaces[mingIdx] && palaces[mingIdx].gan) || '';
        const mingFs  = flyingStars[mingGan] || flyingStars[mingIdx] || {};

        // 飞化落宫判断（飞化出去落入哪类宫 → 哪种驱动力）
        const _flyGain = (sihuaKey, bonus) => {
            const sd = mingFs[sihuaKey] || mingFs[sihuaKey.replace('hua','')];
            if (!sd) return;
            const targetIdx = sd.targetIdx !== undefined ? sd.targetIdx :
                              (typeof sd === 'number' ? sd : -1);
            if (targetIdx < 0) return;
            const relIdx = ((targetIdx - mingIdx) + 12) % 12;
            // 落入官禄宫/迁移宫/命宫 → 野心/漂泊/执念
            for (const [dIdx, val] of Object.entries(bonus)) {
                score[parseInt(dIdx)] += val;
            }
        };
        _flyGain('huaji',   {[DI['执念者']]: +15, [DI['漂泊者']]: +10});
        _flyGain('化忌',    {[DI['执念者']]: +15, [DI['漂泊者']]: +10});
        _flyGain('huaquan', {[DI['野心者']]: +15, [DI['破局者']]: +10});
        _flyGain('化权',    {[DI['野心者']]: +15, [DI['破局者']]: +10});
        _flyGain('hualu',   {[DI['享乐者']]: +15, [DI['守护者']]: +10});
        _flyGain('化禄',    {[DI['享乐者']]: +15, [DI['守护者']]: +10});

        // ── D. 夹宫效应（左右邻宫主星修正）─────────────────────────────
        // 紫府夹命 → 谋局+守护；羊陀夹命 → 执念+隐忍；煞星夹命 → 野心+破局
        const leftIdx  = (mingIdx - 1 + 12) % 12;
        const rightIdx = (mingIdx + 1) % 12;
        const jiaPalStars = [
            ...(palaces[leftIdx]  && palaces[leftIdx].mainStars  || []),
            ...(palaces[rightIdx] && palaces[rightIdx].mainStars || []),
            ...(palaces[leftIdx]  && palaces[leftIdx].evilStars  || []),
            ...(palaces[rightIdx] && palaces[rightIdx].evilStars || [])
        ];
        for (const s of jiaPalStars) {
            if (s === '紫微' || s === '天府') { score[DI['谋局者']] += 8; score[DI['守护者']] += 8; }
            if (s === '擎羊' || s === '陀罗') { score[DI['执念者']] += 10; score[DI['隐忍者']] += 8; }
            if (s === '火星' || s === '铃星') { score[DI['野心者']] += 8; score[DI['破局者']] += 8; }
            if (s === '地空' || s === '地劫') { score[DI['漂泊者']] += 12; score[DI['执念者']] += 8; }
        }

        // ── E. 大限当下宫干飞化（时间轴权重） ──────────────────────────
        const daxianSeq = fullChart.daxianSequence || [];
        if (daxianSeq.length > 0) {
            const nowDX   = fullChart.flow && fullChart.flow.currentDaxian
                            ? fullChart.flow.currentDaxian : daxianSeq[0];
            const dxGan   = nowDX && (nowDX.palaceGan || '');
            const dxFs    = flyingStars[dxGan] || {};
            for (const [sihuaKey, sd] of Object.entries(dxFs)) {
                if (!sd) continue;
                if (sihuaKey.includes('忌') || sihuaKey === 'huaji') { score[DI['执念者']] += 8; score[DI['隐忍者']] += 6; }
                if (sihuaKey.includes('权') || sihuaKey === 'huaquan') { score[DI['野心者']] += 8; score[DI['破局者']] += 6; }
                if (sihuaKey.includes('禄') || sihuaKey === 'hualu') { score[DI['享乐者']] += 8; score[DI['守护者']] += 6; }
                if (sihuaKey.includes('科') || sihuaKey === 'huake') { score[DI['谋局者']] += 8; score[DI['隐忍者']] += 5; }
            }
        }

        // ── 归一化到 0-100 ────────────────────────────────────────────────
        const maxS = Math.max(...score);
        const minS = Math.min(...score);
        const range = maxS - minS || 1;
        return score.map(s => Math.round(((s - minS) / range) * 100));
    }

    /**
     * ── 2. 宫干飞化驱动的刻度动态状态（覆盖原静态 _getKeState） ────────
     * 输入：fullChart + mingIdx + keIdx(0-7) + mainStar + sihuaType
     * 新增：流时宫干飞化落宫方向 → 刻度叙事的"宿命感"层级
     *
     * 算法：
     *   - 用 keIdx 推算该刻所在时辰 shichenIdx = _baseShichenIdx + keIdx（mod 12）
     *   - 取当前流时命宫宫干（五鼠遁日起时）→ 查飞化表 → 落宫方向
     *   - 落入命宫本宫 → 自化：刻度叙事走"自我消耗"向
     *   - 落入夫妻宫/官禄宫/迁移宫 → 对应关系/事业/漂泊叙事层
     *   - 飞化忌 → 加"执念伤口"；飞化权 → 加"掌控张力"；飞化禄 → 加"天赋流淌"
     */
    function calcKeFlowState(fullChart, mingIdx, keIdx, mainStar, sihuaType) {
        // 基础刻度节律（来自原 _getKeState，保留不变）
        const baseState = _getKeState(keIdx, mainStar, sihuaType);

        // ── 流时飞化层（新增） ────────────────────────────────────────────
        const palaces = fullChart.palaces || [];
        const mingPalace = palaces[mingIdx];
        if (!mingPalace) return baseState;

        // 推算流时宫干：用 keIdx 偏移到对应的时辰
        // 五鼠遁：以日干起子时，每宫一时辰顺布10天干
        // 这里用命宫宫干 + keIdx 偏移（近似：一时辰8刻，不同刻对应宫干向量不同）
        const GAN_LIST = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
        const mingGanIdx = GAN_LIST.indexOf(mingPalace.gan || '');
        if (mingGanIdx < 0) return baseState;

        // 流时宫干 = 命宫宫干 + keIdx（顺布10干，循环）
        const shiGan = GAN_LIST[(mingGanIdx + keIdx) % 10];

        // 查生年四化表（用于近似流时四化）
        const SHICHEN_SIHUA = {
            '甲': { lu:'廉贞', quan:'破军', ke:'武曲', ji:'太阳' },
            '乙': { lu:'天机', quan:'天梁', ke:'紫微', ji:'太阴' },
            '丙': { lu:'天同', quan:'天机', ke:'文昌', ji:'廉贞' },
            '丁': { lu:'太阴', quan:'天同', ke:'天机', ji:'巨门' },
            '戊': { lu:'贪狼', quan:'太阴', ke:'右弼', ji:'天机' },
            '己': { lu:'武曲', quan:'贪狼', ke:'天梁', ji:'文曲' },
            '庚': { lu:'太阳', quan:'武曲', ke:'太阴', ji:'天同' },
            '辛': { lu:'巨门', quan:'太阳', ke:'文曲', ji:'文昌' },
            '壬': { lu:'天梁', quan:'紫微', ke:'左辅', ji:'武曲' },
            '癸': { lu:'破军', quan:'巨门', ke:'太阴', ji:'贪狼' }
        };
        const shiSihua = SHICHEN_SIHUA[shiGan] || {};

        // 判断流时四化落命宫/三方 → 叙事层
        let flowNote = '';
        const sanfang = [mingIdx, (mingIdx + 4) % 12, (mingIdx + 8) % 12];
        const jiStar  = shiSihua.ji;
        const luStar  = shiSihua.lu;
        const quanStar = shiSihua.quan;

        // 找化忌/化禄所在宫
        let jiPalIdx = -1, luPalIdx = -1, quanPalIdx = -1;
        for (let i = 0; i < palaces.length; i++) {
            const pal = palaces[i];
            if (!pal || !pal.mainStars) continue;
            if (jiStar   && pal.mainStars.includes(jiStar))   jiPalIdx   = i;
            if (luStar   && pal.mainStars.includes(luStar))   luPalIdx   = i;
            if (quanStar && pal.mainStars.includes(quanStar)) quanPalIdx = i;
        }

        // 飞化忌落入三方四正：刻度加"执念线"
        if (jiPalIdx >= 0 && (sanfang.includes(jiPalIdx) || jiPalIdx === (mingIdx + 6) % 12)) {
            const palName = PALACE_NAMES[((jiPalIdx - mingIdx) + 12) % 12] || '某宫';
            flowNote += `此刻流时${shiGan}干化忌（${jiStar}）落${palName}——执念的重量在这一刻最重，内心某条裂缝被光照见。`;
        } else if (jiPalIdx === mingIdx) {
            flowNote += `此刻流时化忌（${jiStar}）落命宫自化——执念与自我消耗在此刻达到顶点，是撕裂也是清醒。`;
        }
        // 飞化禄落命宫/三方：刻度加"天赋流淌"
        if (luPalIdx >= 0 && sanfang.includes(luPalIdx)) {
            flowNote += flowNote ? ' ' : '';
            flowNote += `同时化禄（${luStar}）流淌三方，此刻天赋最易被激发。`;
        }
        // 飞化权落官禄/命宫：刻度加"掌控张力"
        if (quanPalIdx === guanluIdx || quanPalIdx === mingIdx) {
            flowNote += flowNote ? ' ' : '';
            const guanluIdx2 = (mingIdx + 8) % 12;
            flowNote += `化权（${quanStar}）落${quanPalIdx === guanluIdx2 ? '官禄宫' : '命宫'}，这一刻的掌控欲最强，行动力极旺。`;
        }

        if (!flowNote) {
            return baseState;  // 无额外飞化影响，返回原基础刻状态
        }

        return baseState + '\n  ↳ 【流时飞化层】' + flowNote;
    }

    /**
     * ── 3. 8属性命盘推荐权重 ─────────────────────────────────────────────
     * 输入：fullChart + mingIdx + patternType
     * 输出：8个属性维度，每维度返回 { recommend: '推荐选项名', reason: '命盘理由', score: 0-100 }
     *   维度：appearance/speech/behavior/emotion/social/crisis/learning/growth
     *
     * 算法：
     *   命宫主星 → 外貌/行为基准
     *   官禄宫主星 → 危机应对/成长方向
     *   夫妻宫飞化 → 情感/社交
     *   福德宫主星 → 情绪/内在
     *   三方格局 → 学习风格
     *   大限方向 → 成长偏向
     */
    function calcAttributeRecommendations(fullChart, mingIdx, patternType) {
        const palaces    = fullChart.palaces || [];
        const guanluIdx  = (mingIdx + 8) % 12;
        const fuqiIdx    = (mingIdx + 2) % 12;
        const fudeIdx    = (mingIdx + 10) % 12;

        const mingMainStar  = ((palaces[mingIdx]  || {}).mainStars || [])[0]  || '';
        const guanluStar    = ((palaces[guanluIdx] || {}).mainStars || [])[0] || '';
        const fuqiStar      = ((palaces[fuqiIdx]   || {}).mainStars || [])[0] || '';
        const fudeStar      = ((palaces[fudeIdx]   || {}).mainStars || [])[0] || '';

        // 主星→属性建议映射表（基于 ziwei-engine skill 主星星情）
        const STAR_ATTR_MAP = {
            '紫微': {
                appearance: {r:'威严霸气', reason:'紫微帝星，气场自带威压感'},
                speech:     {r:'沉稳冷静', reason:'紫微说话有分量，不急不躁'},
                behavior:   {r:'深思熟虑', reason:'帝星行事不轻率，谋定后动'},
                emotion:    {r:'内敛含蓄', reason:'紫微情感不外露，王者不轻易示弱'},
                social:     {r:'被动等待', reason:'紫微坐镇，让人来求，不主动凑近'},
                crisis:     {r:'冷静分析', reason:'遇事先推演，是帝星的本能'},
                learning:   {r:'稳步积累', reason:'紫微重体系，不跳跃，一步一步'},
                growth:     {r:'追求成功', reason:'紫微命格的核心驱动是成就感'}
            },
            '天机': {
                appearance: {r:'锐利干练', reason:'天机思维快，眼神中透着计算感'},
                speech:     {r:'幽默风趣', reason:'天机语言灵活，信息密度高'},
                behavior:   {r:'随性而为', reason:'天机变动星，随势而走'},
                emotion:    {r:'理性克制', reason:'天机总在分析情绪，不是真正冷静'},
                social:     {r:'理性交往', reason:'天机在社交中是信息节点'},
                crisis:     {r:'冷静分析', reason:'天机第一反应是推演最优解'},
                learning:   {r:'快速学习', reason:'天机吸收信息的速度是主星里最快的'},
                growth:     {r:'追求自由', reason:'天机是变动星，被框住就失去能量'}
            },
            '太阳': {
                appearance: {r:'温和儒雅', reason:'太阳光芒温暖，外貌自带亲和力'},
                speech:     {r:'热情洋溢', reason:'太阳说话有感染力，天生的鼓励者'},
                behavior:   {r:'雷厉风行', reason:'太阳行动力强，做事不拖拉'},
                emotion:    {r:'外露直白', reason:'太阳不藏情绪，喜怒都摆在脸上'},
                social:     {r:'主动热情', reason:'太阳是最主动的主星，见谁都打招呼'},
                crisis:     {r:'果断行动', reason:'太阳遇事冲在前，救人是本能'},
                learning:   {r:'快速学习', reason:'太阳接受新事物快，热情是学习的燃料'},
                growth:     {r:'追求情感', reason:'太阳最终渴望的是真实的连接'}
            },
            '武曲': {
                appearance: {r:'威严霸气', reason:'武曲财星，气质坚毅，带有金属质感'},
                speech:     {r:'简洁有力', reason:'武曲说话直接，不废话'},
                behavior:   {r:'雷厉风行', reason:'武曲执行力是主星里最强的'},
                emotion:    {r:'理性克制', reason:'武曲把情感锁在金属盒里'},
                social:     {r:'直率真诚', reason:'武曲没有圆滑，有就是有没有就是没有'},
                crisis:     {r:'果断行动', reason:'危急时刻武曲冲在最前面'},
                learning:   {r:'稳步积累', reason:'武曲不求速成，扎实推进'},
                growth:     {r:'追求成功', reason:'武曲的成就感来自可量化的结果'}
            },
            '天同': {
                appearance: {r:'柔和亲和', reason:'天同福星，面相柔和，让人放松'},
                speech:     {r:'温和委婉', reason:'天同不喜对抗，说话绕弯子'},
                behavior:   {r:'自由散漫', reason:'天同活在当下，计划是什么东西'},
                emotion:    {r:'感性冲动', reason:'天同情绪外露，感受比逻辑快'},
                social:     {r:'主动热情', reason:'天同是人群润滑剂'},
                crisis:     {r:'寻求帮助', reason:'天同第一反应是找人，不是自己扛'},
                learning:   {r:'灵活调整', reason:'天同随环境而动'},
                growth:     {r:'追求安稳', reason:'天同最终想要的是平静的生活'}
            },
            '廉贞': {
                appearance: {r:'独特个性', reason:'廉贞气质复杂，很难一眼看穿'},
                speech:     {r:'热情洋溢', reason:'廉贞情绪起伏大，说话有时激昂'},
                behavior:   {r:'随性而为', reason:'廉贞的本能和规则永远在战斗，行为不稳定'},
                emotion:    {r:'丰富多变', reason:'廉贞情绪是主星里最复杂的'},
                social:     {r:'圆滑世故', reason:'廉贞在规则边界上行走，人际极老练'},
                crisis:     {r:'坚定抵抗', reason:'廉贞的本能是不退，哪怕逆境'},
                learning:   {r:'善于应变', reason:'廉贞的复杂性让她在变化中如鱼得水'},
                growth:     {r:'追求自由', reason:'廉贞的欲望本质是对束缚的反抗'}
            },
            '天府': {
                appearance: {r:'温和儒雅', reason:'天府稳重，气质内敛，不张扬'},
                speech:     {r:'沉稳冷静', reason:'天府说话有分量，不紧不慢'},
                behavior:   {r:'谨慎小心', reason:'天府的本能是先保护存量'},
                emotion:    {r:'稳定平和', reason:'天府情绪稳定是主星里最高的'},
                social:     {r:'被动等待', reason:'天府是磁场型，不主动，但让人放心找他'},
                crisis:     {r:'冷静分析', reason:'天府遇事先评估，不慌'},
                learning:   {r:'稳步积累', reason:'天府重积累，反对冒进'},
                growth:     {r:'追求安稳', reason:'天府的终极目标是守护一个稳定的家'}
            },
            '太阴': {
                appearance: {r:'柔和亲和', reason:'太阴月亮感，外貌柔美细腻'},
                speech:     {r:'温和委婉', reason:'太阴说话细腻，像月光一样柔软'},
                behavior:   {r:'深思熟虑', reason:'太阴敏感，做事前想太多'},
                emotion:    {r:'感性冲动', reason:'太阴情绪是内在世界的晴雨表'},
                social:     {r:'感性相交', reason:'太阴在关系中靠感受判断'},
                crisis:     {r:'逃避回避', reason:'太阴遇到冲突的第一反应是退'},
                learning:   {r:'依赖经验', reason:'太阴的学习靠感受积累'},
                growth:     {r:'追求情感', reason:'太阴最深的渴望是真正的情感共鸣'}
            },
            '贪狼': {
                appearance: {r:'独特个性', reason:'贪狼桃花旺，外貌有种不寻常的吸引力'},
                speech:     {r:'热情洋溢', reason:'贪狼说话有魅力，是天生的表演者'},
                behavior:   {r:'随性而为', reason:'贪狼本性漂移，不受框架约束'},
                emotion:    {r:'丰富多变', reason:'贪狼的欲望让情绪起伏剧烈'},
                social:     {r:'主动热情', reason:'贪狼社交能量旺，认识人的速度极快'},
                crisis:     {r:'灵活调整', reason:'贪狼在危机中能迅速转换策略'},
                learning:   {r:'快速学习', reason:'贪狼好奇心强，什么都想试试'},
                growth:     {r:'追求自由', reason:'贪狼的成长本质是对多元可能的探索'}
            },
            '巨门': {
                appearance: {r:'锐利干练', reason:'巨门是非星，眼神中透着洞察一切的锐利'},
                speech:     {r:'简洁有力', reason:'巨门说话直指要害，绕不开真相'},
                behavior:   {r:'谨慎小心', reason:'巨门是非多，行事格外谨慎'},
                emotion:    {r:'内敛含蓄', reason:'巨门把情感藏在语言后面'},
                social:     {r:'直率真诚', reason:'巨门不说谎话，代价是经常得罪人'},
                crisis:     {r:'冷静分析', reason:'巨门危机时先说出问题所在'},
                learning:   {r:'稳步积累', reason:'巨门重深度，不喜浅尝辄止'},
                growth:     {r:'追求真理', reason:'巨门毕生在追问：什么是真的？'}
            },
            '天相': {
                appearance: {r:'温和儒雅', reason:'天相印星，气质中正，让人信任'},
                speech:     {r:'温和委婉', reason:'天相调停者，说话永远照顾各方感受'},
                behavior:   {r:'有条不紊', reason:'天相按规矩来，不走偏锋'},
                emotion:    {r:'稳定平和', reason:'天相情绪稳定，是关系中的安全锚'},
                social:     {r:'圆滑世故', reason:'天相深谙人情世故，夹缝中的老手'},
                crisis:     {r:'寻求帮助', reason:'天相的本能是协调所有人一起解决'},
                learning:   {r:'稳步积累', reason:'天相重规矩，循序渐进'},
                growth:     {r:'追求平衡', reason:'天相的终极追求是所有关系的和谐'}
            },
            '天梁': {
                appearance: {r:'威严霸气', reason:'天梁老灵魂气场，年龄越大越有说服力'},
                speech:     {r:'沉稳冷静', reason:'天梁说话有智慧，让人信服'},
                behavior:   {r:'深思熟虑', reason:'天梁行事以经验为本，不冒进'},
                emotion:    {r:'内敛含蓄', reason:'天梁情感深沉，不轻易表露'},
                social:     {r:'被动等待', reason:'天梁等待真正需要他的人找来'},
                crisis:     {r:'坚定抵抗', reason:'天梁荫星，越是危机越不退'},
                learning:   {r:'依赖经验', reason:'天梁的智慧来自积累而非速成'},
                growth:     {r:'追求真理', reason:'天梁最终的使命是理解命运的规律'}
            },
            '七杀': {
                appearance: {r:'威严霸气', reason:'七杀将星气质，自带不怒自威'},
                speech:     {r:'简洁有力', reason:'七杀说话斩钉截铁，容不得废话'},
                behavior:   {r:'雷厉风行', reason:'七杀行动力是主星里最强的之一'},
                emotion:    {r:'理性克制', reason:'七杀把情绪视为弱点，极力压制'},
                social:     {r:'直率真诚', reason:'七杀不玩心眼，是什么说什么'},
                crisis:     {r:'果断行动', reason:'七杀的本能是冲，而不是等'},
                learning:   {r:'快速学习', reason:'七杀学习靠实战，理论只是工具'},
                growth:     {r:'追求成功', reason:'七杀的成长动力是征服感'}
            },
            '破军': {
                appearance: {r:'独特个性', reason:'破军气质特立独行，很难用普通词形容'},
                speech:     {r:'热情洋溢', reason:'破军说话能量高，充满变革感'},
                behavior:   {r:'随性而为', reason:'破军不受约束，行为让人难以预测'},
                emotion:    {r:'丰富多变', reason:'破军情绪随破坏力起伏'},
                social:     {r:'直率真诚', reason:'破军没有伪装，真实到有时让人不适应'},
                crisis:     {r:'果断行动', reason:'破军的危机响应是打破，然后重建'},
                learning:   {r:'善于应变', reason:'破军在混乱中反而学得最好'},
                growth:     {r:'追求自由', reason:'破军的成长本质是不断打破枷锁'}
            }
        };

        const rec = {};
        const starMap = STAR_ATTR_MAP[mingMainStar] || STAR_ATTR_MAP['七杀'];

        // 基础推荐来自命宫主星
        for (const [attr, data] of Object.entries(starMap)) {
            rec[attr] = { recommend: data.r, reason: data.reason, source: '命宫主星', score: 80 };
        }

        // 官禄宫主星覆盖：危机应对/成长方向
        const guanluMap = STAR_ATTR_MAP[guanluStar];
        if (guanluMap) {
            if (guanluMap.crisis) rec.crisis = { ...guanluMap.crisis, recommend: guanluMap.crisis.r, reason: '官禄宫' + guanluStar + '：' + guanluMap.crisis.reason, source: '官禄宫', score: 85 };
            if (guanluMap.growth) rec.growth = { ...guanluMap.growth, recommend: guanluMap.growth.r, reason: '官禄宫' + guanluStar + '：' + guanluMap.growth.reason, source: '官禄宫', score: 85 };
        }

        // 福德宫主星覆盖：情绪表达/社交
        const fudeMap = STAR_ATTR_MAP[fudeStar];
        if (fudeMap) {
            if (fudeMap.emotion) rec.emotion = { ...fudeMap.emotion, recommend: fudeMap.emotion.r, reason: '福德宫' + fudeStar + '（潜意识层）：' + fudeMap.emotion.reason, source: '福德宫', score: 90 };
            if (fudeMap.social)  rec.social  = { ...fudeMap.social,  recommend: fudeMap.social.r,  reason: '福德宫' + fudeStar + '：' + fudeMap.social.reason,          source: '福德宫', score: 90 };
        }

        // 夫妻宫主星覆盖：外貌/情感
        const fuqiMap = STAR_ATTR_MAP[fuqiStar];
        if (fuqiMap) {
            if (fuqiMap.appearance) rec.appearance = { ...fuqiMap.appearance, recommend: fuqiMap.appearance.r, reason: '夫妻宫' + fuqiStar + '（他者投影）：' + fuqiMap.appearance.reason, source: '夫妻宫', score: 75 };
        }

        // 生年四化修正：化忌落命宫 → 行为谨慎；化权落官禄 → 危机强势
        const fourTrans = fullChart.fourTransformations || {};
        for (const [tname, tdata] of Object.entries(fourTrans)) {
            if (!tdata) continue;
            const tIdx = tdata.palaceIdx !== undefined ? tdata.palaceIdx : -1;
            if (tIdx === mingIdx && tname === '化忌') {
                rec.behavior = { recommend: '谨慎小心', reason: '命宫化忌：行事格外谨慎，怕触碰那条执念的线', source: '四化', score: 95 };
            }
            if (tIdx === guanluIdx && tname === '化权') {
                rec.crisis = { recommend: '果断行动', reason: '官禄宫化权：危机时刻冲劲最强', source: '四化', score: 95 };
            }
            if (tIdx === mingIdx && tname === '化禄') {
                rec.behavior = { recommend: '随性而为', reason: '命宫化禄：天赋如流水，行事自然随性', source: '四化', score: 95 };
            }
        }

        // 大限方向修正：逆行大限 → 学习方向偏"依赖经验"；顺行大限 → 偏"快速学习"
        const daxianSeq = fullChart.daxianSequence || [];
        if (daxianSeq.length > 0) {
            const forwardMode = daxianSeq[0] && daxianSeq[0].forward;
            if (forwardMode === false) {
                rec.learning = { recommend: '依赖经验', reason: '逆行大限：生命由外而内积累，经验是最深的智慧', source: '大限方向', score: 70 };
            }
        }

        return rec;
    }

    // ─────────────────────────────────────────────────────────────────────
    // 将真实四化类型注入 _resolveSihuaType（覆盖旧逻辑）
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 从增强命盘中获取真实四化类型（替代硬编码的驱动力→四化映射）
     * @param {Object} enrichedChart - generateEnrichedChart() 的返回值
     * @returns {string} '化禄型'|'化权型'|'化科型'|'化忌型'
     */
    function resolveSihuaTypeFromChart(enrichedChart) {
        if (enrichedChart && enrichedChart._sihuaProfile) {
            return enrichedChart._sihuaProfile.sihuaType || '化禄型';
        }
        return '化禄型';
    }

    // ─────────────────────────────────────────────────────────────────────
    // 对外导出
    // ─────────────────────────────────────────────────────────────────────

    global.ChartBridge = {
        generateEnrichedChart,
        resolveSihuaTypeFromChart,
        extractSihuaProfile,
        extractDaxianProfile,
        extractSanfangProfile,
        buildCreativeParams,
        deriveChartInput,
        // ★ v2.0 新增：命盘算法驱动的动态生成函数
        calcDriveAffinityVector,
        calcKeFlowState,
        calcAttributeRecommendations,
        STAR_BLIND_SPOT,
        STAR_BLIND_SPOT_EN,
        STAR_DEFENSE_MECHANISM,
        STAR_ATTACHMENT_TYPE,
        KE_NAMES
    };

    console.log('[chart-to-bio-bridge] 骨架→肉通道已加载 v2.0（命盘算法驱动）');

})(typeof window !== 'undefined' ? window : global);
