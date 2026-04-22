/**
 * 20问角色深度挖掘框架
 * 基于《如何创造完美的角色》中的20个核心问题
 * 用于生成更加立体、真实的角色设定
 */

const CHARACTER_20_QUESTIONS = [
    {
        id: 'q1',
        category: '家庭背景',
        question: '角色的父母是谁？角色是否由他们抚养成人？如果不是的话是因为什么原因？如果不是的话又是由谁抚养的？',
        ziweiMapping: {
            relatedPalaces: ['父母宫', '命宫'],
            impact: '父母宫星曜决定父母关系和抚养方式'
        }
    },
    {
        id: 'q2',
        category: '兄弟姐妹',
        question: '角色有从小时候就是死党的好友吗？有兄弟姐妹吗？他们现在在哪里？角色和他们还有联系吗？还是已经分开了？',
        ziweiMapping: {
            relatedPalaces: ['兄弟宫', '命宫'],
            impact: '兄弟宫星曜决定兄弟姐妹关系和朋友圈'
        }
    },
    {
        id: 'q3',
        category: '童年经历',
        question: '角色的童年是什么样的？平静宁和还是动荡不安深受创伤？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '福德宫'],
            impact: '命宫和福德宫决定童年经历和心理状态'
        }
    },
    {
        id: 'q4',
        category: '偶像崇拜',
        question: '角色有什么钦佩的偶像吗？如果有，是什么样的？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '迁移宫'],
            impact: '命宫决定价值观，迁移宫决定对外界的向往'
        }
    },
    {
        id: 'q5',
        category: '职业背景',
        question: '在这个故事开始之前，角色是干什么的？是谁训练了角色学会现在在做的工作？',
        ziweiMapping: {
            relatedPalaces: ['官禄宫', '命宫'],
            impact: '官禄宫决定职业方向和能力'
        }
    },
    {
        id: 'q6',
        category: '道德信仰',
        question: '角色的道德观和宗教信仰是什么样的？为了维护他的信仰，他会做出多大的努力？是谁或什么事情教会了角色接受这种道德观念和信仰？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '福德宫', '迁移宫'],
            impact: '命宫决定道德观，福德宫决定内心信仰'
        }
    },
    {
        id: 'q7',
        category: '特殊特征',
        question: '角色有什么不同寻常的爱好或者体格特征吗？旁人一般对此有何反应？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '疾厄宫'],
            impact: '命宫决定性格特质，疾厄宫决定外貌体态'
        }
    },
    {
        id: 'q8',
        category: '他人态度',
        question: '别的角色对你的角色的态度如何？从你的角色的观点来看，他们为何会有这种反应？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '迁移宫', '交友宫'],
            impact: '迁移宫决定外界态度，交友宫决定社交关系'
        }
    },
    {
        id: 'q9',
        category: '杀戮与敌人',
        question: '角色能杀人吗？他/她为什么会做出杀戮的行为？他/她有什么敌人吗？角色能杀他们吗？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '官禄宫', '疾厄宫'],
            impact: '命宫决定性格底色，官禄宫决定行动能力'
        }
    },
    {
        id: 'q10',
        category: '人际关系',
        question: '现在角色的人际关系如何？他/她有什么亲密的朋友吗？或是仇敌吗？如果有的话是谁？原因是什么？',
        ziweiMapping: {
            relatedPalaces: ['交友宫', '命宫', '迁移宫'],
            impact: '交友宫决定朋友关系，迁移宫决定社会评价'
        }
    },
    {
        id: 'q11',
        category: '心理恐惧',
        question: '角色在精神心理上有麻烦吗？有什么恐惧症的对象吗？如果有的话是什么？是因为什么原因？',
        ziweiMapping: {
            relatedPalaces: ['福德宫', '命宫', '疾厄宫'],
            impact: '福德宫决定心理健康，命宫决定性格缺陷'
        }
    },
    {
        id: 'q12',
        category: '信任他人',
        question: '角色平素是怎么对待别人的？他/她容易相信别人吗？还是特别不容易相信别人？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '交友宫', '迁移宫'],
            impact: '命宫决定性格，交友宫决定社交方式'
        }
    },
    {
        id: 'q13',
        category: '外貌特征',
        question: '角色看起来是什么样子？他/她有什么伤疤或是纹身吗？如果有的话是因为什么原因？',
        ziweiMapping: {
            relatedPalaces: ['疾厄宫', '命宫'],
            impact: '疾厄宫决定外貌和体格'
        }
    },
    {
        id: 'q14',
        category: '日常生活',
        question: '角色的日常生活是什么样的？如果这种规律的生活因为不同的原因被打断了他会有什么不同的反应？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '福德宫', '官禄宫'],
            impact: '命宫决定生活态度，官禄宫决定生活规律'
        }
    },
    {
        id: 'q15',
        category: '重大事件',
        question: '角色曾经历过这个世界上的什么重大事件吗？他/她的经历对角色有何影响？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '迁移宫', '田宅宫'],
            impact: '迁移宫决定外界经历，田宅宫决定家庭环境'
        }
    },
    {
        id: 'q16',
        category: '祖先声名',
        question: '角色有任何声名狼藉或是名声显赫的祖先吗？他/她做了什么？当人们知道了角色有这样的祖先后他们会有何反应？角色的行为是为了提升这种声誉，降低声誉，还是忽视之？',
        ziweiMapping: {
            relatedPalaces: ['父母宫', '命宫', '迁移宫'],
            impact: '父母宫决定家族背景，迁移宫决定外界看法'
        }
    },
    {
        id: 'q17',
        category: '人生目标',
        question: '角色的理想或者说人生目标是什么？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '官禄宫'],
            impact: '命宫决定人生理想，官禄宫决定事业目标'
        }
    },
    {
        id: 'q18',
        category: '目标追寻',
        question: '他/她是怎样追寻目标的？故事中描述的冒险经历对完成这种梦想有何作用？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '官禄宫', '迁移宫'],
            impact: '命宫决定行动方式，迁移宫决定冒险经历'
        }
    },
    {
        id: 'q19',
        category: '家庭理想',
        question: '角色有过建立家庭的想法吗？如果有的话，他/她心目中理想的伴侣是哪种类型的？',
        ziweiMapping: {
            relatedPalaces: ['夫妻宫', '命宫'],
            impact: '夫妻宫决定情感需求，命宫决定择偶标准'
        }
    },
    {
        id: 'q20',
        category: '死亡观',
        question: '角色考虑过他/她死亡的可能性吗？他/她有什么未了的心愿吗？',
        ziweiMapping: {
            relatedPalaces: ['命宫', '福德宫'],
            impact: '命宫决定生死观，福德宫决定内心遗憾'
        }
    }
];

/**
 * 根据命盘数据回答20个问题
 */
function answer20QuestionsWithChart(chartData, characterData, era) {
    const answers = [];

    // 获取主星
    const mainStar = chartData.mainStars[0] || '紫微';

    // 获取各宫位数据
    const getPalace = (palaceName) => {
        return chartData.palaces.find(p => p.name === palaceName) ||
               chartData.twelvePalaces[palaceName];
    };

    const mingPalace = getPalace('命宫');
    const fuDePalace = getPalace('福德宫');
    const parentsPalace = getPalace('父母宫');
    const careerPalace = getPalace('官禄宫');
    const spousePalace = getPalace('夫妻宫');
    const friendsPalace = getPalace('交友宫');
    const siblingsPalace = getPalace('兄弟宫');
    const healthPalace = getPalace('疾厄宫');
    const migrationPalace = getPalace('迁移宫');

    // 问题1：父母
    answers.push({
        questionId: 'q1',
        answer: generateAnswerQ1(parentsPalace, era, characterData.family)
    });

    // 问题2：兄弟姐妹
    answers.push({
        questionId: 'q2',
        answer: generateAnswerQ2(siblingsPalace, era)
    });

    // 问题3：童年
    answers.push({
        questionId: 'q3',
        answer: generateAnswerQ3(mingPalace, fuDePalace, characterData.experience)
    });

    // 问题4：偶像
    answers.push({
        questionId: 'q4',
        answer: generateAnswerQ4(mingPalace, migrationPalace)
    });

    // 问题5：职业背景
    answers.push({
        questionId: 'q5',
        answer: generateAnswerQ5(careerPalace, characterData.career)
    });

    // 问题6：道德信仰
    answers.push({
        questionId: 'q6',
        answer: generateAnswerQ6(mingPalace, fuDePalace, migrationPalace)
    });

    // 问题7：特殊特征
    answers.push({
        questionId: 'q7',
        answer: generateAnswerQ7(mingPalace, healthPalace)
    });

    // 问题8：他人态度
    answers.push({
        questionId: 'q8',
        answer: generateAnswerQ8(mingPalace, migrationPalace, friendsPalace)
    });

    // 问题9：杀戮与敌人
    answers.push({
        questionId: 'q9',
        answer: generateAnswerQ9(mingPalace, careerPalace)
    });

    // 问题10：人际关系
    answers.push({
        questionId: 'q10',
        answer: generateAnswerQ10(friendsPalace, mingPalace)
    });

    // 问题11：心理恐惧
    answers.push({
        questionId: 'q11',
        answer: generateAnswerQ11(fuDePalace, mingPalace)
    });

    // 问题12：信任他人
    answers.push({
        questionId: 'q12',
        answer: generateAnswerQ12(mingPalace, friendsPalace)
    });

    // 问题13：外貌特征
    answers.push({
        questionId: 'q13',
        answer: generateAnswerQ13(healthPalace, mingPalace)
    });

    // 问题14：日常生活
    answers.push({
        questionId: 'q14',
        answer: generateAnswerQ14(mingPalace, careerPalace)
    });

    // 问题15：重大事件
    answers.push({
        questionId: 'q15',
        answer: generateAnswerQ15(mingPalace, migrationPalace, characterData.experience)
    });

    // 问题16：祖先声名
    answers.push({
        questionId: 'q16',
        answer: generateAnswerQ16(parentsPalace, characterData.family, era)
    });

    // 问题17：人生目标
    answers.push({
        questionId: 'q17',
        answer: generateAnswerQ17(mingPalace, careerPalace)
    });

    // 问题18：目标追寻
    answers.push({
        questionId: 'q18',
        answer: generateAnswerQ18(mingPalace, careerPalace, migrationPalace)
    });

    // 问题19：家庭理想
    answers.push({
        questionId: 'q19',
        answer: generateAnswerQ19(spousePalace, mingPalace)
    });

    // 问题20：死亡观
    answers.push({
        questionId: 'q20',
        answer: generateAnswerQ20(mingPalace, fuDePalace)
    });

    return answers;
}

// 生成各个问题的答案（简化版，实际应该更详细）
function generateAnswerQ1(parentsPalace, era, familyBackground) {
    const stars = parentsPalace ? parentsPalace.mainStars.join('、') : '无主星';
    return `父母的星曜组合为${stars}，家庭背景为${familyBackground}。` +
           `父母对孩子的影响${stars.includes('紫微') || stars.includes('天府') ? '积极正向，给予支持' : '复杂多变，可能有代沟'}。`;
}

function generateAnswerQ2(siblingsPalace, era) {
    const stars = siblingsPalace ? siblingsPalace.mainStars.join('、') : '无主星';
    return `兄弟姐妹宫主星为${stars}，` +
           `兄弟姐妹关系${stars.includes('天同') || stars.includes('太阴') ? '和睦，彼此扶持' : '一般，各有追求'}。`;
}

function generateAnswerQ3(mingPalace, fuDePalace, experience) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const fuDeStars = fuDePalace ? fuDePalace.mainStars.join('、') : '无主星';
    return `命宫主星${mingStars}，福德宫主星${fuDeStars}，` +
           `童年经历${experience === '平顺安康' ? '平静宁和' : experience === '坎坷磨难' ? '动荡不安' : '起伏不定'}，` +
           `内心状态${fuDeStars.includes('天同') || fuDeStars.includes('天梁') ? '相对平和' : '可能有所压抑'}。`;
}

function generateAnswerQ4(mingPalace, migrationPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const migStars = migrationPalace ? migrationPalace.mainStars.join('、') : '无主星';
    return `向往的形象与${migStars.includes('太阳') || migStars.includes('紫微') ? '权力、地位' : '自由、艺术'}相关，` +
           `偶像类型${mingStars.includes('紫微') || mingStars.includes('太阳') ? '是强权人物或领袖' : '是艺术家或智者'}。`;
}

function generateAnswerQ5(careerPalace, career) {
    const stars = careerPalace ? careerPalace.mainStars.join('、') : '无主星';
    return `职业宫主星${stars}，从事${career}相关工作，` +
           `能力来源${stars.includes('紫微') || stars.includes('太阳') ? '是系统训练和天赋' : '是实践经验和个人摸索'}。`;
}

function generateAnswerQ6(mingPalace, fuDePalace, migrationPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const fuDeStars = fuDePalace ? fuDePalace.mainStars.join('、') : '无主星';
    return `道德观念${mingStars.includes('天相') || mingStars.includes('天梁') ? '传统保守' : '相对开放'}，` +
           `信仰体系${fuDeStars.includes('天梁') || fuDeStars.includes('天机') ? '有深刻思考' : '相对随性'}，` +
           `会为了维护信仰${mingStars.includes('紫微') || mingStars.includes('武曲') ? '做出极大牺牲' : '保持一定底线'}。`;
}

function generateAnswerQ7(mingPalace, healthPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const healthStars = healthPalace ? healthPalace.mainStars.join('、') : '无主星';
    return `性格特质${mingStars.includes('贪狼') || mingStars.includes('廉贞') ? '热情张扬' : mingStars.includes('天同') || mingStars.includes('太阴') ? '温和内敛' : '稳重踏实'}，` +
           `外貌体格${healthStars.includes('紫微') || healthStars.includes('天府') ? '端庄大气' : '普通大众'}，` +
           `旁人对${mingStars.includes('贪狼') || mingStars.includes('廉贞') ? '其热情张扬的特质' : ''}${mingStars.includes('天同') || mingStars.includes('太阴') ? '其温和内敛的气质' : ''}印象深刻。`;
}

function generateAnswerQ8(mingPalace, migrationPalace, friendsPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const migStars = migrationPalace ? migrationPalace.mainStars.join('、') : '无主星';
    const friStars = friendsPalace ? friendsPalace.mainStars.join('、') : '无主星';
    return `他人态度${migStars.includes('太阳') || migStars.includes('紫微') ? '尊敬仰望' : migStars.includes('太阴') || migStars.includes('天同') ? '亲切友好' : '平平常常'}，` +
           `原因在于${mingStars.includes('紫微') || mingStars.includes('太阳') ? '其能力和领导力' : mingStars.includes('天同') || mingStars.includes('太阴') ? '其温和友善的性格' : '其平和稳重的为人'}。`;
}

function generateAnswerQ9(mingPalace, careerPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const careerStars = careerPalace ? careerPalace.mainStars.join('、') : '无主星';
    return `是否会杀人：${mingStars.includes('七杀') || mingStars.includes('武曲') || mingStars.includes('廉贞') ? '是，在必要情况下会动手' : '否，除非绝对必要'}，` +
           `原因${mingStars.includes('七杀') || mingStars.includes('武曲') ? '与性格和职业有关' : '与道德观有关'}。`;
}

function generateAnswerQ10(friendsPalace, mingPalace) {
    const stars = friendsPalace ? friendsPalace.mainStars.join('、') : '无主星';
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    return `人际关系${stars.includes('天同') || stars.includes('太阴') ? '和睦，朋友众多' : '一般，知交好友不多'}，` +
           `朋友圈质量${mingStars.includes('紫微') || mingStars.includes('天相') ? '较高，多为能人志士' : '一般，各色人等都有'}。`;
}

function generateAnswerQ11(fuDePalace, mingPalace) {
    const fuDeStars = fuDePalace ? fuDePalace.mainStars.join('、') : '无主星';
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    return `心理状态${fuDeStars.includes('天同') || fuDeStars.includes('天梁') ? '相对健康' : '可能有所焦虑'}，` +
           `恐惧对象${fuDeStars.includes('太阴') || mingStars.includes('太阴') ? '被抛弃、孤独' : fuDeStars.includes('紫微') || mingStars.includes('紫微') ? '失控、失败' : '未知、变化'}，` +
           `原因与童年经历和性格有关。`;
}

function generateAnswerQ12(mingPalace, friendsPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const friStars = friendsPalace ? friendsPalace.mainStars.join('、') : '无主星';
    return `对待他人${mingStars.includes('天同') || mingStars.includes('太阴') || mingStars.includes('天相') ? '友善温和，容易信任' : mingStars.includes('巨门') || mingStars.includes('七杀') ? '较为谨慎，不易信任' : '平和有度，适度信任'}，` +
           `社交方式${friStars.includes('天同') || friStars.includes('太阴') ? '主动交往' : '被动等待'}。`;
}

function generateAnswerQ13(healthPalace, mingPalace) {
    const stars = healthPalace ? healthPalace.mainStars.join('、') : '无主星';
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    return `外貌特征${stars.includes('紫微') || stars.includes('天府') ? '端正大气' : stars.includes('太阴') || stars.includes('天同') ? '温润柔和' : '普通自然'}，` +
           `伤疤或纹身${mingStars.includes('七杀') || mingStars.includes('武曲') || mingStars.includes('廉贞') ? '可能有，与过往经历有关' : '无或很少'}。`;
}

function generateAnswerQ14(mingPalace, careerPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const careerStars = careerPalace ? careerPalace.mainStars.join('、') : '无主星';
    return `日常生活${mingStars.includes('天同') || mingStars.includes('太阴') ? '悠闲自在' : mingStars.includes('紫微') || mingStars.includes('太阳') ? '规律有序' : '忙碌充实'}，` +
           `生活被打断时${mingStars.includes('天机') || mingStars.includes('太阴') ? '会感到不安' : mingStars.includes('紫微') || mingStars.includes('武曲') ? '会积极应对' : '会尽力适应'}。`;
}

function generateAnswerQ15(mingPalace, migrationPalace, experience) {
    const migStars = migrationPalace ? migrationPalace.mainStars.join('、') : '无主星';
    return `重大经历${migStars.includes('紫微') || migStars.includes('太阳') ? '涉及权力或地位' : migStars.includes('天机') || migStars.includes('太阴') ? '涉及知识或情感' : '涉及生活或职业'}，` +
           `对角色的影响${experience === '大起大落' ? '深远，改变了人生观' : '一般，只是人生经历'}。`;
}

function generateAnswerQ16(parentsPalace, familyBackground, era) {
    const stars = parentsPalace ? parentsPalace.mainStars.join('、') : '无主星';
    return `祖先声名${stars.includes('紫微') || stars.includes('太阳') ? '显赫，家族有影响力' : '普通，没什么特别'}，` +
           `角色态度${stars.includes('紫微') || stars.includes('太阳') ? '引以为荣，努力提升' : stars.includes('天机') || stars.includes('太阴') ? '理性看待，不过分在意' : '基本忽视，过自己的生活'}。`;
}

function generateAnswerQ17(mingPalace, careerPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const careerStars = careerPalace ? careerPalace.mainStars.join('、') : '无主星';
    return `人生目标${mingStars.includes('紫微') || mingStars.includes('太阳') ? '追求权力、地位' : mingStars.includes('天机') || mingStars.includes('太阴') ? '追求知识、真理' : mingStars.includes('武曲') || mingStars.includes('七杀') ? '追求成就、事业' : '追求平静、幸福'}，` +
           `事业目标${careerStars.includes('紫微') || careerStars.includes('太阳') ? '成为行业领袖' : careerStars.includes('天机') || careerStars.includes('太阴') ? '在专业领域有所建树' : '在事业上稳定发展'}。`;
}

function generateAnswerQ18(mingPalace, careerPalace, migrationPalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const careerStars = careerPalace ? careerPalace.mainStars.join('、') : '无主星';
    const migStars = migrationPalace ? migrationPalace.mainStars.join('、') : '无主星';
    return `追寻方式${mingStars.includes('紫微') || mingStars.includes('武曲') ? '积极行动，果断决策' : mingStars.includes('天机') || mingStars.includes('太阴') ? '深思熟虑，稳步前进' : '随机应变，灵活应对'}，` +
           `冒险经历${migStars.includes('七杀') || migStars.includes('破军') ? '频繁，刺激' : migStars.includes('天同') || migStars.includes('天梁') ? '较少，稳定' : '适度，可控'}，` +
           `对完成梦想的作用${migStars.includes('紫微') || migStars.includes('太阳') ? '关键，提供了机会' : migStars.includes('天机') || migStars.includes('太阴') ? '重要，积累了经验' : '一般，只是人生插曲'}。`;
}

function generateAnswerQ19(spousePalace, mingPalace) {
    const stars = spousePalace ? spousePalace.mainStars.join('、') : '无主星';
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    return `家庭观念${stars.includes('天同') || stars.includes('太阴') ? '强烈，向往家庭' : stars.includes('七杀') || stars.includes('破军') ? '较弱，更重视个人' : '一般，看缘分'}，` +
           `理想伴侣类型${mingStars.includes('紫微') || mingStars.includes('太阳') ? '有能力、有地位' : mingStars.includes('天同') || mingStars.includes('太阴') ? '温柔、善解人意' : mingStars.includes('天机') || mingStars.includes('巨门') ? '聪明、有思想' : '稳重、可靠'}。`;
}

function generateAnswerQ20(mingPalace, fuDePalace) {
    const mingStars = mingPalace ? mingPalace.mainStars.join('、') : '无主星';
    const fuDeStars = fuDePalace ? fuDePalace.mainStars.join('、') : '无主星';
    return `死亡观${mingStars.includes('天同') || mingStars.includes('太阴') ? '恐惧死亡' : mingStars.includes('紫微') || mingStars.includes('天机') ? '理性看待' : '自然接受'}，` +
           `未了心愿${fuDeStars.includes('天同') || fuDeStars.includes('太阴') ? '与家人朋友有关' : fuDeStars.includes('紫微') || fuDeStars.includes('天机') ? '与事业成就有关' : '与个人成长有关'}。`;
}

/**
 * 转换为Markdown格式
 */
function convert20QuestionsToMarkdown(answers) {
    let md = `## 20问角色深度挖掘\n\n`;

    answers.forEach((item, index) => {
        const question = CHARACTER_20_QUESTIONS.find(q => q.id === item.questionId);
        if (question) {
            md += `### ${index + 1}. ${question.question}\n\n`;
            md += `**紫微斗数映射**：${question.ziweiMapping.relatedPalaces.join('、')} - ${question.ziweiMapping.impact}\n\n`;
            md += `**答案**：${item.answer}\n\n`;
        }
    });

    return md;
}

// 导出到全局
window.Character20Questions = {
    CHARACTER_20_QUESTIONS,
    answer20QuestionsWithChart,
    convert20QuestionsToMarkdown
};
