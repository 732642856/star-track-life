/**
 * 紫微斗数角色小传生成引擎 v1.0
 * 基于命盘信息生成编剧级人物小传
 * 支持7个核心维度，字数800-1500字
 */

// ==================== 命盘格局映射 ====================

/**
 * 命盘格局类型定义
 * 根据主星、四化、宫位组合定义人物基调
 */
const CHART_PATTERNS = {
    // 权威稳重型
    AUTHORITY: {
        name: '权威稳重型',
        description: '天生领袖，掌控全局，稳重踏实',
        traits: ['果断刚毅', '深谋远虑', '稳重踏实'],
        conflicts: ['渴望掌控 vs 害怕失控', '追求完美 vs 容忍瑕疵', '外在强势 vs 内心孤独'],
        arcs: '从追求绝对控制到学会放手和信任的成长弧',
    },
    
    // 变动冲突型
    CONFLICT: {
        name: '变动冲突型',
        description: '人生跌宕起伏，充满冲突和戏剧性',
        traits: ['灵活机变', '冒险进取', '大起大落'],
        conflicts: ['冲动 vs 谨慎', '自由 vs 责任', '创新 vs 传统'],
        arcs: '从混乱失控到找到内心平衡的觉醒弧',
    },
    
    // 独立孤傲型
    INDEPENDENT: {
        name: '独立孤傲型',
        description: '自我独立，内心孤傲，难以接近',
        traits: ['内敛低调', '自我独立', '情感疏离'],
        conflicts: ['渴望连接 vs 害怕依赖', '追求自由 vs 渴望归属', '展示自我 vs 隐藏真实'],
        arcs: '从自我封闭到学会打开心扉的转变弧',
    },
    
    // 协调平衡型
    HARMONY: {
        name: '协调平衡型',
        description: '善于调和，追求平衡，圆滑世故',
        traits: ['外向开朗', '善于协调', '平衡各方'],
        conflicts: ['讨好他人 vs 真实自我', '追求和平 vs 维护正义', '表面和谐 vs 内心矛盾'],
        arcs: '从讨好世界到找回真实自我的觉醒弧',
    },
    
    // 艺术感性型
    ARTISTIC: {
        name: '艺术感性型',
        description: '感性丰富，才华横溢，情感敏感',
        traits: ['敏感细腻', '富有想象', '情感丰富'],
        conflicts: ['情感 vs 理性', '创作 vs 现实', '自由表达 vs 社会认同'],
        arcs: '从情感泛滥到找到表达方式的成长弧',
    },
    
    // 权谋算计型
    CALCULATING: {
        name: '权谋算计型',
        description: '精于算计，善于谋划，城府深沉',
        traits: ['深谋远虑', '精明能干', '城府深沉'],
        conflicts: ['算计 vs 真诚', '利益 vs 道德', '控制 vs 放手'],
        arcs: '从算计一切到学会真诚的救赎弧',
    }
};

/**
 * 根据命盘信息确定格局类型
 * @param {object} chartData - 完整的命盘数据
 * @returns {string} 格局类型
 */
function determineChartPattern(chartData) {
    const { mainStars, fourTransformations } = chartData;

    // 检测权威稳重型
    if (hasStars(mainStars, ['紫微', '天府', '太阳']) &&
        hasTrans(fourTransformations, ['化权', '化科'])) {
        return 'AUTHORITY';
    }

    // 检测变动冲突型
    if (hasStars(mainStars, ['杀', '破', '狼']) ||
        hasStars(mainStars, ['廉贞', '七杀'])) {
        return 'CONFLICT';
    }

    // 检测独立孤傲型（根据星曜组合判断）
    if (hasStars(mainStars, ['巨门', '天梁']) ||
        hasStars(mainStars, ['七杀', '破军'])) {
        return 'INDEPENDENT';
    }

    // 检测协调平衡型
    if (hasStars(mainStars, ['天相', '文昌', '文曲']) &&
        hasTrans(fourTransformations, ['化禄'])) {
        return 'HARMONY';
    }

    // 检测艺术感性型
    if (hasStars(mainStars, ['文曲', '文昌', '太阴']) &&
        hasTrans(fourTransformations, ['化科'])) {
        return 'ARTISTIC';
    }

    // 检测权谋算计型
    if (hasStars(mainStars, ['廉贞', '天机']) &&
        hasStars(mainStars, ['贪狼', '七杀'])) {
        return 'CALCULATING';
    }

    // 默认返回协调型
    return 'HARMONY';
}

// ==================== 辅助函数 ====================

/**
 * 检测主星组合
 */
function hasStars(mainStars, stars) {
    if (!mainStars) return false;
    // mainStars 是对象，键为星名
    const starNames = Object.keys(mainStars);
    return stars.some(star => starNames.some(name => name.includes(star)));
}

/**
 * 检测四化
 */
function hasTrans(fourTransformations, transTypes) {
    if (!fourTransformations) return false;
    // fourTransformations 是对象，键为四化类型（化禄、化权、化科、化忌）
    const types = Object.keys(fourTransformations);
    return transTypes.some(type => types.includes(type));
}

// ==================== 主生成函数 ====================

/**
 * 生成完整的人物小传
 * @param {object} chartData - 命盘数据
 * @param {object} profile - 人物基本信息
 * @returns {string} 完整的人物小传
 */
function generateCharacterBio(chartData, profile) {
    // 1. 确定格局类型
    const pattern = determineChartPattern(chartData);
    
    // 2. 生成7个维度的小传内容
    let bio = '';
    bio += `# ${profile.name || '人物'}小传\n\n`;
    bio += generateBasicSetting(profile, pattern);
    bio += generateDesiresAndNeeds(pattern, profile);
    bio += generateWoundsAndBackstory(profile, pattern, chartData);
    bio += generatePersonalityAndParadoxes(pattern, profile);
    bio += generateDramaticFunctionAndRelationships(pattern, profile);
    bio += generateBehaviorAndDialogueStyle(pattern, profile);
    bio += generateCharacterArc(pattern, profile);
    
    bio += `\n---\n\n*（全文约${Math.round(bio.length/5)}字）*`;
    
    return bio;
}

// ==================== 基础设定生成 ====================

/**
 * 生成基础设定
 */
function generateBasicSetting(profile, pattern) {
    const { gender, age, career, familyBackground } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    // 生成外貌特征
    const appearance = generateAppearance(profile, pattern);
    
    // 生成标志性细节
    const signature = generateSignature(pattern, career, he);
    
    return `
## 一、基础设定

**标签：** ${age}岁，${gender === 'male' ? '男性' : '女性'}，${familyBackground}出身的${career}

**外貌特征：** ${appearance}

**职业阶级与地位：** ${generateCareerStatus(profile, pattern)}

**标志性细节（签名）：**
${signature}
`;
}

/**
 * 生成外貌特征描述
 */
function generateAppearance(profile, pattern) {
    const { gender, age } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    const descriptions = {
        AUTHORITY: `身姿挺拔如松，眉宇间透着不容置疑的威严。${he}的眼神坚定有力，说话时习惯直视对方，仿佛能洞穿人心。常年紧抿的嘴角显示出${he}对完美的苛刻追求，每一根发丝都打理得一丝不苟。`,
        CONFLICT: `面容轮廓分明，眼神中带着一丝不羁和狂放。${he}的表情常常在一笑之间从温和转为冷冽，像天气一样难以捉摸。眉间有一道浅浅的伤疤——那是${he}${age > 30 ? '年轻时' : '少年时'}某次意外留下的印记。`,
        INDEPENDENT: `清瘦而精致，总是保持着礼貌而疏离的微笑。${he}的眼睛像深潭，看似平静却让人读不出情绪。习惯微微低头，避免与他人直接对视，仿佛在与人保持一个安全的心理距离。`,
        HARMONY: `面容和善，带着恰到好处的笑容。${he}的眼睛总是弯成月牙，说话时身体微微前倾，表现出倾听的姿态。衣着总是符合场合却不张扬，像一滴水融入大海般自然。`,
        ARTISTIC: `眼神中总带着若有所思的迷离，${he}的五官精致得像画中人。手指修长，说话时喜欢不自觉地比划，仿佛在空气中描绘着看不见的线条。偶尔发呆的样子，像是在与另一个世界对话。`,
        CALCULATING: `面容平静得让人心生敬畏，眼神却锐利如刀。${he}很少大笑，最多只是嘴角微微上扬——那是算计得逞时的表情。说话时习惯微微眯眼，在评估对方是否值得信任。`
    };
    
    return descriptions[pattern] || descriptions.HARMONY;
}

/**
 * 生成标志性细节
 */
function generateSignature(pattern, career, he) {
    const signatures = {
        AUTHORITY: [
            "- 做决定前习惯性用手指有节奏地敲击桌面",
            "- 永远提前15分钟到达约定地点",
            "- 笔记本上用三种颜色标注重要等级",
            "- 睡前一定要检查一遍所有工作"
        ],
        CONFLICT: [
            "- 愤怒时会用力捏碎手中的纸杯",
            "- 手机永远静音，因为不想被打断",
            "- 颈链上挂着一个铜币——生死攸关时唯一的护身符",
            "- 说话前喜欢轻笑一声，像是在嘲笑命运的安排"
        ],
        INDEPENDENT: [
            "- 走路时总是戴着耳机，无论是否放音乐",
            "- 随身带着一本旧书，已经翻到掉页",
            "- 拒绝用微信语音，只发文字",
            "- 每天固定时间去同一家咖啡馆，坐在同一位置"
        ],
        HARMONY: [
            "- 对谁都是「您」「您好」「多谢」的礼貌用语",
            "- 包里永远备着糖果，给遇到的孩子",
            "- 说话前先笑，像在给每句话包糖衣",
            "- 善于记住每个人的小细节，在节日送上贴心问候"
        ],
        ARTISTIC: [
            "- 随身带着速写本，随时随地记录灵感",
            "- 左手腕上戴着不同颜色的编织手环",
            "- 看到美的东西会忍不住拍照，哪怕只是路边的花",
            "- 说话时喜欢用比喻，抽象概念被说成画面"
        ],
        CALCULATING: [
            "- 每次见面都要先环视周围，确认安全",
            "- 从不轻易透露自己的信息",
            "- 笔记本里记录着每个人的弱点",
            "- 喝东西时总是先观察对方是否有异样"
        ]
    };
    
    return signatures[pattern].join('\n');
}

/**
 * 生成职业阶级与地位
 */
function generateCareerStatus(profile, pattern) {
    const { career, familyBackground, lifeExperience } = profile;
    
    let status = '';
    if (lifeExperience?.includes('富裕') || lifeExperience?.includes('大起大落')) {
        status += `经历过人生起伏，见过繁华也尝过失落。`;
    }
    
    status += `在${career}领域有专业能力，${familyBackground?.includes('富贵') ? '出生优渥' : '靠自己打拼'}。`;
    
    if (pattern === 'AUTHORITY') {
        status += `在行业内有一定话语权，是他人眼中的专家或领导者。`;
    } else if (pattern === 'INDEPENDENT') {
        status += `技术能力强但社交圈子较小，更专注于专业本身。`;
    } else if (pattern === 'HARMONY') {
        status += `人缘不错，是同事和朋友圈中的"润滑剂"。`;
    }
    
    return status;
}

// ==================== 欲望与需求生成 ====================

/**
 * 生成欲望与需求部分
 */
function generateDesiresAndNeeds(pattern, profile) {
    const { gender, career, lifeExperience } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    const wants = generateWants(pattern, profile, he);
    const needs = generateNeeds(pattern, profile, he);
    
    return `
## 二、欲望与需求（Want vs. Need）——剧作核心

**外在欲望（想要）：**

${wants}

**内在需求（需要）：**

${needs}
`;
}

/**
 * 生成外在欲望
 */
function generateWants(pattern, profile, he) {
    const wantsByPattern = {
        AUTHORITY: `${he}表面上极力追求的是"掌控"。${he}渴望在${profile.career}领域获得绝对的话语权，渴望被他人仰视和尊重，渴望证明"我是对的"。${he}想要建立自己的事业帝国，让所有人知道${he}的名字。`,
        CONFLICT: `${he}表面上追求的是"刺激"和"自由"。${he}渴望打破常规，渴望冒险，渴望体验人生的极致——无论是成功还是失败，至少要活得痛快。${he}想要证明自己不会被任何人或事束缚。`,
        INDEPENDENT: `${he}表面上追求的是"独立"和"距离"。${he}渴望掌控自己的时间和空间，不被任何人打扰，不为任何人改变。${he}想要证明一个人也可以过得很好，甚至更好。`,
        HARMONY: `${he}表面上追求的是"被喜欢"和"归属感"。${he}渴望被所有人接纳，渴望成为朋友圈里的那个"好人"，渴望自己说话时有人听，做事时有人帮。`,
        ARTISTIC: `${he}表面上追求的是"表达"和"认可"。${he}渴望创作出打动人心的作品，渴望自己的才华被看见，渴望证明自己的存在有特殊价值。`,
        CALCULATING: `${he}表面上追求的是"利益"和"控制"。${he}渴望掌握更多资源，渴望在权力游戏中获胜，渴望证明自己永远比别人聪明一步。`
    };
    
    return wantsByPattern[pattern];
}

/**
 * 生成内在需求
 */
function generateNeeds(pattern, profile, he) {
    const needsByPattern = {
        AUTHORITY: `${he}真正需要的是"学会信任"和"放下控制"。${he}需要明白，真正的强大不是什么都掌控，而是敢于把一部分权力交给别人；${he}需要学会接受不完美，接受"失控"也是人生的一部分。这是${he}成长的核心动力，也是${he}最难以跨越的心理门槛。`,
        CONFLICT: `${he}真正需要的是"找到意义"和"承担责任"。${he}需要明白，真正的自由不是想做什么就做什么，而是想不做什么就能不做什么；${he}需要学会为一个比自己更大的目标承担责任，而不是一直飘在空中。`,
        INDEPENDENT: `${he}真正需要的是"允许依赖"和"被需要"。${he}需要明白，独立不代表要一个人扛着所有事；${he}需要学会放下戒备，允许一些人靠近，允许自己向别人求助——这才是真正的强大。`,
        HARMONY: `${he}真正需要的是"找回自我"和"设立边界"。${he}需要明白，被人喜欢不是存在的唯一价值；${he}需要学会说"不"，学会为自己争取，学会即使不被所有人喜欢也活得坦然。`,
        ARTISTIC: `${he}真正需要的是"落地"和"连接"。${he}需要明白，艺术不是空中楼阁，需要扎根生活；${he}需要学会与人真实连接，而不只是通过作品。`,
        CALCULATING: `${he}真正需要的是"真诚"和"信任"。${he}需要明白，算计无法换来真心，利益无法填满内心；${he}需要学会放下防备，真正信任一个人。`
    };
    
    return needsByPattern[pattern];
}

// ==================== 灵魂伤痕与前史生成 ====================

/**
 * 生成灵魂伤痕与前史
 */
function generateWoundsAndBackstory(profile, pattern, chartData) {
    const { familyBackground, lifeExperience, gender } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    return `
## 三、灵魂伤痕与前史（幽灵/背景故事）

${generateBackstoryText(profile, pattern, he)}

**致命缺陷的形成：**

${generateFatalFlawText(pattern, he)}
`;
}

/**
 * 生成前史文本
 */
function generateBackstoryText(profile, pattern, he) {
    const { familyBackground, lifeExperience, gender, age } = profile;
    
    const backstories = {
        AUTHORITY: `${he}出生在一个严格的家庭，父母对${he}的期望就是"必须优秀"。

**决定性创伤：** ${lifeExperience?.includes('磨难') ? 
    `${age}岁时的一次重大挫折彻底改变了${he}——${he}拼尽全力准备的项目，却在最后关头被一个"有关系"的人顶替了。那次打击让${he}明白：在这个世界上，光有才华是不够的，还必须握住权力的刀柄。` :
    `成长的路上，${he}的父母从不吝啬表扬，但从不拥抱${he}。他们的爱是"条件"的——必须优秀，才配被爱。这让${he}从小就学会了用成绩和成就来证明自己值得存在。`}`,
        
        CONFLICT: `${he}的童年充满不安和动荡。

**决定性创伤：** ${familyBackground === '贫困' ?
    `${age}岁那年，家里遭遇了一场变故——父亲生病，母亲独自撑起整个家庭。那段时间，${he}看到了太多人情冷暖，也第一次明白了"活下去"需要多大的勇气。那次经历让${he}明白：稳定是谎言，冒险才是活着的证明。` :
    `${age}岁时的一次冒险让${he}付出了惨痛代价——${he}违背父母安排的道路，选择了一条看似自由的路，结果摔得头破血流。那次打击让${he}决定：以后只按自己的规则行事，别人怎么看，无所谓。`}`,
        
        INDEPENDENT: `${he}从小就知道自己是一个人。

**决定性创伤：** ${familyBackground?.includes('单亲') || familyBackground?.includes('孤儿') ?
    `${age}岁那年，${he}终于明白了一个事实：没有人会一直陪着你。那次经历让${he}学会了一个道理：与其期待被爱，不如学会不需要爱。` :
    `${age}岁那年的一次失望彻底改变了${he}——${he}满怀期待地展示自己最珍视的画（或作品），得到的却是父母一句"这有什么用"。那一刻，${he}决定：以后只做自己认为重要的事，不再取悦任何人。`}`,
        
        HARMONY: `${he}从小就是那个"听话的孩子"。

**决定性创伤：** ${age}岁那年，${he}终于意识到一个问题：别人喜欢的是"那个善解人意的你"，而不是真实的你。那次经历让${he}明白：讨好所有人，意味着必须牺牲自己。`,
        
        ARTISTIC: `${he}从小就活在自己的世界里。

**决定性创伤：** ${age}岁那年的一次经历彻底改变了${he}——${he}最信任的人说"你总是想太多，现实点吧"。那句话像一把刀，让${he}决定：从此只和懂自己的人说话，其他人，不值得。`,
        
        CALCULATING: `${he}很早就明白了一个道理：只有聪明人才能活得好。

**决定性创伤：** ${familyBackground?.includes('贫困') ?
    `${age}岁那年，家里因为一次"信任"遭遇重大损失。那次经历让${he}明白：信任是奢侈品，算计才是生存之道。` :
    `${age}岁那年的一次背叛让${he}彻底改变——${he}真心对待的人，却在背后捅了${he}一刀。那次经历让${he}决定：以后只信任自己，别人，都只是棋子。`}`
    };
    
    return backstories[pattern];
}

/**
 * 生成致命缺陷文本
 */
function generateFatalFlawText(pattern, he) {
    const flaws = {
        AUTHORITY: `这段经历造就了${he}的核心性格缺陷——**控制狂与无法接受失败**。${he}害怕失控，因为失控意味着失去价值；${he}无法接受失败，因为失败意味着不被爱。${he}把"优秀"当作盾牌，用来抵御内心深处那个"不被喜欢"的小孩。`,
        CONFLICT: `这段经历造就了${he}的核心性格缺陷——**冲动逃避与自我毁灭倾向**。${he}害怕稳定，因为稳定意味着死亡；${he}拒绝承担责任，因为责任意味着束缚。${he}用"自由"来掩盖内心深处对"失去"的恐惧。`,
        INDEPENDENT: `这段经历造就了${he}的核心性格缺陷——**情感隔离与无法依赖**。${he}害怕展露脆弱，因为脆弱意味着会被伤害；${he}不敢相信他人，因为相信意味着风险。${he}把自己活成了一座孤岛，用"不需要任何人"来保护那个渴望被爱的小孩。`,
        HARMONY: `这段经历造就了${he}的核心性格缺陷——**讨好型人格与自我牺牲**。${he}害怕让别人失望，因为失望意味着被抛弃；${he}不敢表达自己，因为表达意味着可能被拒绝。${he}用"好人"的面具来掩盖那个不敢说出"我想要"的自己。`,
        ARTISTIC: `这段经历造就了${he}的核心性格缺陷——**情感泛滥与难以落地**。${he}害怕现实，因为现实会伤害内心；${he}难以连接他人，因为连接意味着可能被误解。${he}用"艺术"来逃避与世界的真实接触。`,
        CALCULATING: `这段经历造就了${he}的核心性格缺陷——**多疑算计与无法信任**。${he}害怕被骗，因为被骗意味着愚蠢；${he}不敢真心待人，因为真心意味着可能被利用。${he}把所有人都当成潜在威胁，用算计来掩盖内心深处对"孤独"的恐惧。`
    };
    
    return flaws[pattern];
}

// ==================== 性格与矛盾点生成 ====================

/**
 * 生成性格与矛盾点
 */
function generatePersonalityAndParadoxes(pattern, profile) {
    const { gender } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    const paradoxesByPattern = {
        AUTHORITY: `${he}是一个充满矛盾的人物：

- **${he}极度渴望掌控一切，却又在内心深处渴望有人能接住${he}的疲惫。** 当有人试图关心${he}时，${he}的第一反应是"我能搞定"，而不是"谢谢你"。

- **${he}追求绝对理性，却总在深夜被孤独和空虚吞噬。** 所有人都羡慕${he}的成功，但很少有人知道，${he}醒来时的第一句话总是"又熬过来了"。

- **${he}用高标准要求所有人，却又在心里偷偷原谅每一个"失败"的人。** ${he}嘴上说着"必须优秀"，却在看到别人跌倒时，第一个伸出援手。`,
        
        CONFLICT: `${he}是一个充满矛盾的人物：

- **${he}表面上狂放不羁，却比谁都渴望一个稳定的港湾。** 每次冒险归来，${he}都会站在窗前发呆——那是${he}在想：如果有一个地方永远亮着灯，会是什么感觉。

- **${he}宣称不需要任何人，却又在关键时刻冲在最前面保护别人。** ${he}说"我一个人也挺好"，却会在朋友遇到困难时，毫不犹豫地把自己豁出去。

- **${he}害怕束缚，却给自己定下了最严苛的规则——"绝不让身边的人受伤"。** 这个承诺像一条锁链，把${he}牢牢拴在了"责任"上。`,
        
        INDEPENDENT: `${he}是一个充满矛盾的人物：

- **${he}极力避免与人建立连接，却比谁都渴望被理解。** ${he}的所有作品和言行，都是在向世界发出"懂我吗"的信号，但真正靠近时，${he}又本能地后退。

- **${he}害怕被看穿，却在深夜的社交媒体上写下最真实的文字。** 那些仅自己可见的日记，是${he}唯一敢展露脆弱的地方。

- **${he}用"独立"来防御世界，却在内心深处留着一个"如果"的空间。** 如果有人真的愿意等，愿意听，愿意不评判——${he}会不会打开那扇门？`,
        
        HARMONY: `${he}是一个充满矛盾的人物：

- **${he}极力讨好所有人，却在内心深处觉得自己是"冒牌货"。** 每个人都说"你人真好"，但${he}自己知道：那个"好"字背后藏着多少委屈。

- **${he}害怕得罪人，却又在一些小问题上寸步不让。** 大事上${he}总是妥协，但有人踩了${he}的底线时，${he}会突然爆发出让人意外的强硬。

- **${he}总是"没关系""都行""听你的"，却在深夜反复咀嚼那些没说出口的"我想要"。** 那些未完成的句子，是${he}心里最深的遗憾。`,
        
        ARTISTIC: `${he}是一个充满矛盾的人物：

- **${he}情感丰富得像大海，却常常不知道如何表达。** ${he}能写出打动人心的文字，却在面对真实的人时，变得笨拙而沉默。

- **${he}渴望自由表达，却害怕被误解。** ${he}的作品大胆热烈，但每次发布后，都会紧张地等待反馈——不是期待赞美，而是害怕被说"想多了"。

- **${he}活在幻想和现实之间，却总是觉得两者都够不着。** 在幻想里${he}是自由的，在现实里${he}是孤独的——两种状态的中间地带，是${he}永恒的困境。`,
        
        CALCULATING: `${he}是一个充满矛盾的人物：

- **${he}用算计保护自己，却又在内心深处渴望真诚。** ${he}说"没有人值得信任"，却又在深夜反复问自己：如果真的有一个人，我敢不敢放下算计？

- **${he}把所有关系都量化，却在某些瞬间意外地感性。** ${he}习惯评估每个人的价值，却在看到孩子或弱者时，突然放下所有防备。

- **${he}追求利益最大化，却在某些原则问题上寸步不让。** ${he}说"什么都不过是一场游戏"，但有人触碰${he}的底线时，${he}会毫不犹豫地掀翻桌子。`
    };
    
    return `
## 四、性格与矛盾点（Paradox）

${paradoxesByPattern[pattern]}
`;
}

// ==================== 剧作功能与社会关系生成 ====================

/**
 * 生成剧作功能与社会关系
 */
function generateDramaticFunctionAndRelationships(pattern, profile) {
    const { gender } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    return `
## 五、剧作功能与社会关系（Relationships & Function）

**剧作功能：**

${generateFunctionDescription(pattern, he)}

**核心关系网：**

${generateRelationships(pattern, he)}
`;
}

/**
 * 生成剧作功能描述
 */
function generateFunctionDescription(pattern, he) {
    const functions = {
        AUTHORITY: `${he}在故事中承担**"导师/权威人物"**的功能——${he}的存在迫使主角（以及观众）思考：在权力和责任之间，应该如何选择？${he}是主角成长路上的重要试炼，也是主角最终超越的对象。

${he}也可以承担**"反派"**的功能——${he}的价值观（权力至上）与主角（可能是平等、自由）形成对立，${he}的失败为主角证明"什么才是真正的强大"提供了机会。`,
        CONFLICT: `${he}在故事中承担**"催化剂"**的功能——${he}的出现打破了主角原本平静的生活，把主角拖入一个全新的世界。${he}是主角必须面对的挑战，也是主角成长的催化剂。

${he}也可以承担**"镜像人物"**的功能——${he}是主角"如果当初选择了另一条路"的另一种可能性。通过${he}，观众可以看到主角没有选择的那条路是什么样子。`,
        INDEPENDENT: `${he}在故事中承担**"镜像人物"**的功能——${he}是主角的另一种可能性，是"如果不敢爱"的参照系。${he}的存在迫使主角思考：在爱与被爱之间，应该如何选择？

${he}也可以承担**"催化剂"**的功能——${he}某次意外的展露脆弱或开放心扉，可能成为推动主角改变的关键事件。`,
        HARMONY: `${he}在故事中承担**"调解者/配角"**的功能——${he}是主角和世界的桥梁，也是冲突的缓冲带。${he}的存在让观众看到"如果选择妥协，会是什么样子"。

${he}也可以承担**"镜像人物"**的功能——${he}是主角"如果不敢做自己"的参照系。通过${he}，观众可以看到主角没有选择的"讨好"之路。`,
        ARTISTIC: `${he}在故事中承担**"情感向导"**的功能——${he}的存在让主角学会感受和表达。${he}的作品或言行，常常成为主角思考人生的触媒。

${he}也可以承担**"催化剂"**的功能——${he}某次创作或表达的突破，可能成为推动主角觉醒的关键事件。`,
        CALCULATING: `${he}在故事中承担**"反派的镜像"**或**"复杂反派"**的功能——${he}不是纯粹的恶，而是"另一种生存方式"的极端呈现。${he}的存在迫使主角思考：为了活下去，底线可以退到什么程度？

${he}也可以承担**"救赎对象"**的功能——通过主角的影响，${he}逐渐学会信任和真诚，最终找到内心的救赎。`
    };
    
    return functions[pattern];
}

/**
 * 生成核心关系网
 */
function generateRelationships(pattern, he) {
    const relationships = {
        AUTHORITY: `- **对主角的态度：** ${he}对主角一开始是轻视的，认为主角"太理想主义""不懂规则"。但随着故事发展，${he}开始承认主角身上有${he}所没有的东西——那种不顾一切的勇气。

- **对反派的态度：** 如果反派代表"纯粹的邪恶"，${he}会鄙视反派"没有底线"；如果反派代表"另一种权力"，${he}会把反派当作对手，甚至可能短暂合作。

- **如何推动主角改变：** ${he}的某些行为（比如牺牲自己、放下权力）会成为主角的震撼教育，让主角重新思考"什么是真正的强大"。`,
        CONFLICT: `- **对主角的态度：** ${he}对主角是复杂的——既羡慕主角的"有人可依靠"，又嘲笑主角的"不够自由"。${he}和主角从对立到理解，再到相互影响，是整个故事的重要线索。

- **对反派的态度：** 如果反派代表"绝对的秩序"，${he}会天然站在反派对立面；如果反派也代表"打破规则"，${he}会和反派有短暂的同盟，但最终会因为原则破裂。

- **如何推动主角改变：** ${he}某次的"为别人牺牲自己"，会成为主角的重要转折点——让主角明白：自由不是无所顾忌，而是有愿意守护的东西。`,
        INDEPENDENT: `- **对主角的态度：** ${he}对主角是疏离的，表面上"不关心"，实际上在默默观察。${he}对主角的某些选择感到不解，但又会暗中伸出援手。

- **对反派的态度：** ${he}对反派是警惕的，认为反派是"不可信任的人"。但如果反派触犯${he}的底线，${he}会毫不犹豫地站在反派对面。

- **如何推动主角改变：** ${he}某次意外的"展露脆弱"或"寻求帮助"，会成为主角的震撼教育——让主角明白：即使是最独立的人，也需要连接。`,
        HARMONY: `- **对主角的态度：** ${he}对主角是友好的，经常在幕后帮助主角，但很少主动提要求。${he}是主角和团队之间的润滑剂，也是冲突时的缓冲带。

- **对反派的态度：** ${he}对反派是回避的，倾向于"不正面冲突"。但如果反派伤害到${he}在乎的人，${he}会爆发出让人意外的强硬。

- **如何推动主角改变：** ${he}某次勇敢地说出"我想要"，会成为主角的重要启示——让主角明白：为自己争取，不是自私。`,
        ARTISTIC: `- **对主角的态度：** ${he}对主角是好奇的，常常用作品或言语来引导主角思考人生。${he}是主角的"情感向导"，帮助主角找到自己内心的声音。

- **对反派的态度：** ${he}对反派是批判的，认为反派"失去了人性"。但${he}也理解反派的某些选择——毕竟，每个人的背后都有自己的故事。

- **如何推动主角改变：** ${he}某次创作的突破或表达的觉醒，会成为主角的重要触媒——让主角明白：表达是重要的，被理解是可能的。`,
        CALCULATING: `- **对主角的态度：** ${he}对主角是评估的，一开始就把主角当成"棋子"。但随着故事发展，${he}开始动摇——主角的"真诚"让${he}看到了另一种可能。

- **对反派的态度：** ${he}对反派是警惕的，把反派当成对手或潜在的威胁。但如果反派的目标和${he}一致，${he}会短暂合作。

- **如何推动主角改变：** ${he}某次的"放下算计"或"真心相待"，会成为主角的震撼教育——让主角明白：真诚的力量，比算计更强大。`
    };
    
    return relationships[pattern];
}

// ==================== 行为模式与台词风格生成 ====================

/**
 * 生成行为模式与台词风格
 */
function generateBehaviorAndDialogueStyle(pattern, profile) {
    const { gender } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    return `
## 六、行为模式与台词风格（Action & Dialogue Style）

${generateCrisisReaction(pattern, he)}

**台词风格：**

${generateDialogueStyle(pattern, he)}

**典型台词示例：**

${generateTypicalDialogue(pattern)}
`;
}

/**
 * 生成危机时的反应
 */
function generateCrisisReaction(pattern, he) {
    const crisisReactions = {
        AUTHORITY: `**遇到危机时的第一反应：**

**立刻掌控局面。** ${he}会迅速评估局势，分配任务，制定计划，像指挥官一样带领所有人走出困境。即使内心慌张，表面上${he}也永远镇定自若——这是${he}多年的训练和伪装。`,
        CONFLICT: `**遇到危机时的第一反应：**

**冲动行动或逃避。** ${he}要么直接冲上去解决，要么转身就跑——没有中间地带。${he}讨厌等待和犹豫，认为"要么做，要么死"。`,
        INDEPENDENT: `**遇到危机时的第一反应：**

**自我消化。** ${he}不会主动寻求帮助，而是选择一个人扛着。如果有人试图插手，${he}的第一反应是"我自己能行"。`,
        HARMONY: `**遇到危机时的第一反应：**

**试图调和。** ${he}会尝试让所有人满意，避免冲突升级。如果不行，${he}会选择牺牲自己，让事情过去。`,
        ARTISTIC: `**遇到危机时的第一反应：**

**情感爆发或创作。** ${he}要么陷入强烈的情绪波动，要么用创作来转移注意力——${he}很少用"理性"的方式处理危机。`,
        CALCULATING: `**遇到危机时的第一反应：**

**冷静分析。** ${he}会迅速计算利弊，找出最优解。即使是最亲密的人，${he}也会先考虑"值不值得救"。`
    };
    
    return crisisReactions[pattern];
}

/**
 * 生成台词风格
 */
function generateDialogueStyle(pattern, he) {
    const dialogueStyles = {
        AUTHORITY: `**句式：** 偏爱命令句和祈使句，习惯用"必须""应该""我要"等词汇。即使在询问，也带着不容置疑的语气。

**修辞：** 很少用隐喻，喜欢直白的表达。${he}认为清晰比重要，准确比优美重要。

**回避策略：** 当话题触及${he}的脆弱时，${he}会迅速转移话题，用工作或任务来结束对话。`,
        CONFLICT: `**句式：** 短句为主，充满反问和感叹。${he}不喜欢长篇大论，认为"说那么多干嘛，直接上"。

**修辞：** 喜欢用夸张的比喻和直白的粗俗语。${he}的言论常常带有冲击力，要么让人笑，要么让人怒。

**回避策略：** ${he}从不回避，而是选择直接怼回去。如果对方继续纠缠，${he}会选择"不玩了"——直接结束对话。`,
        INDEPENDENT: `**句式：** 偏爱长句，喜欢用"因为……所以……"来解释自己的行为，仿佛每一句话都需要充分的理由支撑。

**修辞：** 喜欢用隐喻和暗示，很少直接表达需求。比如不会说"我需要你"，而是说"你要是有空的话……"

**回避策略：** 当话题触及核心情感问题时，${he}会迅速转移话题，或者用一句"算了，不说了"来终止对话。`,
        HARMONY: `**句式：** 偏爱委婉句，习惯用"可能""或许""您觉得呢"等词汇。${he}的每一句话都带着商量的语气。

**修辞：** 很少用强烈的词汇，喜欢温和的表达。${he}认为"不说比说好"，因此常常用沉默代替表达。

**回避策略：** ${he}从不正面冲突，而是选择"好吧，都听你的"。但内心深处，${he}可能在默默积累不满。`,
        ARTISTIC: `**句式：** 偏爱长句和排比，喜欢用诗意的表达。${he}的每一句话都像在创作，充满了画面和情感。

**修辞：** 喜欢用比喻和象征，常常把抽象概念说成具体画面。${he}认为"说清楚不如说得好"。

**回避策略：** 当话题触及现实问题时，${he}会突然用一句"但这让我想到一个故事……"来转移话题。`,
        CALCULATING: `**句式：** 偏爱条件句，喜欢用"如果……那么……""除非……否则……"等逻辑结构。${he}的每一句话都像在算计。

**修辞：** 很少用情感词汇，喜欢用数据和事实。${he}认为"感情没用，结果才重要"。

**回避策略：** 当话题触及${he}的真心时，${he}会迅速用"这个问题没有意义"来终止对话。`
    };
    
    return dialogueStyles[pattern];
}

/**
 * 生成典型台词
 */
function generateTypicalDialogue(pattern) {
    const dialogues = {
        AUTHORITY: `> "这不是请求，是命令。"

> "我不管过程，只要结果。"

> "失败？在我这里没有这个词。"

> "如果你不想做，我可以找到人。"`,
        CONFLICT: `> "少废话，直接上。"

> "命是你自己的，怎么活自己选。"

> "怕什么，最坏不就是死吗。"

> "有意思，让我试试。"`,
        INDEPENDENT: `> "我知道这听起来可能有点奇怪，但是……算了，没什么。"

> "我不是那个意思，我的意思是……唉，随便吧，你怎么理解都行。"

> "习惯了，真的，一个人挺好的。"

> "你不需要明白，我也不需要解释。"`,
        HARMONY: `> "都可以，看你吧。"

> "我不想给你们添麻烦，真的。"

> "要不……听你的？"

> "没关系，我能理解。"`,
        ARTISTIC: `> "你知道吗，那让我想到一个故事……"

> "有时候我想，如果世界能安静一下就好了。"

> "不是我偏执，是你没看到我看到的东西。"

> "这不是矫情，是感受。"`,
        CALCULATING: `> "这样做，对你对我，都有利。"

> "感情是奢侈品，我们付不起。"

> "我不相信任何人，包括我自己。"

> "要么接受，要么离开。"`
    };
    
    return dialogues[pattern];
}

// ==================== 人物弧光生成 ====================

/**
 * 生成人物弧光
 */
function generateCharacterArc(pattern, profile) {
    const { gender } = profile;
    const he = gender === 'male' ? '他' : '她';
    
    return `
## 七、人物弧光（Character Arc）

**起点：**

${generateArcStart(pattern, he)}

**转折点：**

${generateArcTurningPoint(pattern, he)}

**终点：**

${generateArcEnd(pattern, he)}
`;
}

/**
 * 生成弧光起点
 */
function generateArcStart(pattern, he) {
    const starts = {
        AUTHORITY: `故事开篇时的${he}，是一个用"权力"来定义一切的人。${he}的成功、自信、果断，都是建立在"我必须掌控一切"的执念之上。${he}不懂得信任，不懂得放权，不懂得"失控"也可以是一种人生选择。`,
        CONFLICT: `故事开篇时的${he}，是一个活在"明天"的人。${he}的冒险、冲动、不羁，都是为了逃避"安定"带来的无聊和空虚。${he}不懂得稳定的价值，不懂得责任的意义，不懂得"自由"也需要边界。`,
        INDEPENDENT: `故事开篇时的${he}，是一个把自己活成孤岛的人。${he}的独立、冷静、疏离，都是为了保护内心那个"会被伤害"的自己。${he}不懂得连接，不懂得依赖，不懂得"被需要"也是一种幸福。`,
        HARMONY: `故事开篇时的${he}，是一个活在别人期待中的人。${he}的善解人意、体贴周到、小心翼翼，都是为了让自己"被喜欢"。${he}不懂得拒绝，不懂得为自己争取，不懂得"不被喜欢"也可以活得坦然。`,
        ARTISTIC: `故事开篇时的${he}，是一个活在自己世界里的人。${he}的敏感、想象、创作，都是为了逃避现实的尖锐。${he}不懂得落地，不懂得连接，不懂得"真实"也可以是美丽的。`,
        CALCULATING: `故事开篇时的${he}，是一个活在算计里的人。${he}的精明、警惕、防备，都是为了保护自己"不被欺骗"。${he}不懂得真诚，不懂得信任，不懂得"真心"也可以是一种力量。`
    };
    
    return starts[pattern];
}

/**
 * 生成弧光转折点
 */
function generateArcTurningPoint(pattern, he) {
    const turningPoints = {
        AUTHORITY: `转折点发生在${he}被迫"失控"的时候——可能是事业上的重大挫折，可能是心爱之人的离去，可能是身体或精神的重创。在那一刻，${he}所有的掌控和权力都失效了，${he}第一次直面自己内心的"无能"和"恐惧"。这次经历让${he}崩溃，也让${he}觉醒——原来，真正强大的人不是什么都掌控，而是敢于面对失控。`,
        CONFLICT: `转折点发生在${he}失去某个东西的时候——可能是最在乎的朋友，可能是冒险后的惨痛代价，可能是突然意识到"自由"的代价。在那一刻，${he}第一次思考：这种自由，真的是我想要的吗？这次经历让${he}迷茫，也让${he}开始寻找——原来，真正的自由不是想做什么就做什么，而是有愿意守护的东西。`,
        INDEPENDENT: `转折点发生在${he}不得不求助的时候——可能是身体的疾病，可能是事业的困境，可能是某个人的真心接近。在那一刻，${he}第一次发现：原来，不是所有靠近的人都想要伤害。这次经历让${he}动摇，也让${he}尝试——原来，允许自己脆弱，不是懦弱，而是勇气。`,
        HARMONY: `转折点发生在${he}终于说"不"的时候——可能是别人越过了${he}的底线，可能是${he}再也撑不住了，可能是某个时刻突然意识到"我累了"。在那一刻，${he}第一次为自己而活，而不是为了别人的期待。这次经历让${he}惊讶，也让${he}明白——原来，被不喜欢也可以活得很好。`,
        ARTISTIC: `转折点发生在${he}的创作陷入瓶颈或遇到真正理解的人的时候——可能是作品被误解，可能是遇见了一个和${he}同样敏感的人，可能是现实的某种打击。在那一刻，${he}第一次意识到：艺术不是逃避，而是理解世界的方式。这次经历让${he}改变，也让${he}开始尝试——原来，落地也可以创造美。`,
        CALCULATING: `转折点发生在${he}真心被回应的时候——可能是某个人的无条件信任，可能是算计失败后的真诚，可能是某个时刻突然意识到"算计也换不来真心"。在那一刻，${he}第一次动摇——原来，真心不是愚蠢，信任不是风险。这次经历让${he}改变，也让${he}开始尝试——原来，放下防备也可以活下去。`
    };
    
    return turningPoints[pattern];
}

/**
 * 生成弧光终点
 */
function generateArcEnd(pattern, he) {
    const ends = {
        AUTHORITY: `故事的结尾，${he}未必会成为一个完全不同的人，但${he}学会了**允许失控**。${he}可能依然强势，但不再把"掌控一切"作为唯一目标；${he}可能依然追求完美，但学会了接受"失败"和"不完美"。

${he}最终明白：**真正的强大，不是掌控一切，而是敢于面对失控——然后依然选择负责任地活着。**`,
        CONFLICT: `故事的结尾，${he}未必会变成一个"安稳"的人，但${he}学会了**承担责任**。${he}可能依然冒险，但每一次冒险都有了意义；${he}可能依然自由，但懂得了"自由"也需要边界和守护。

${he}最终明白：**真正的自由，不是想做什么就做什么，而是有愿意为之牺牲和守护的东西。**`,
        INDEPENDENT: `故事的结尾，${he}未必会变成一个"社交达人"，但${he}学会了**允许依赖**。${he}可能依然独立，但不再拒绝真心的靠近；${he}可能依然谨慎，但学会了向值得信任的人求助。

${he}最终明白：**真正的强大，不是不需要任何人，而是敢于允许自己需要——然后依然选择保持自我。**`,
        HARMONY: `故事的结尾，${he}未必会变得"自私"，但${he}学会了**为自己而活**。${he}可能依然善解人意，但不再为了取悦所有人而牺牲自己；${he}可能依然温和，但学会了说"不"和设立边界。

${he}最终明白：**真正的和谐，不是让所有人都满意，而是允许自己不被某些人喜欢——然后依然活得坦然。**`,
        ARTISTIC: `故事的结尾，${he}未必会放弃创作，但${he}学会了**扎根现实**。${he}可能依然感性，但懂得了如何在现实和想象之间找到平衡；${he}可能依然创作，但学会了通过作品真正连接他人。

${he}最终明白：**真正的艺术，不是逃避现实，而是用另一种方式理解世界——然后落地生根。**`,
        CALCULATING: `故事的结尾，${he}未必会变得"天真"，但${he}学会了**真诚信任**。${he}可能依然谨慎，但不再把所有人都当成威胁；${he}可能依然精明，但学会了放下算计，用真心对待值得的人。

${he}最终明白：**真正的聪明，不是算计一切，而是知道什么时候可以放下算计——然后用真心活一次。**`
    };
    
    return ends[pattern];
}

// ==================== 导出模块 ====================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateCharacterBio,
        determineChartPattern,
        CHART_PATTERNS
    };
}

// 浏览器环境：导出到全局
if (typeof window !== 'undefined') {
    window.CharacterBioGenerator = {
        generateCharacterBio,
        determineChartPattern,
        CHART_PATTERNS
    };
}
