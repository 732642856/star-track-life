/**
 * 紫微斗数完整命盘排盘系统
 * 包含：十二宫位排布、十四主星落宫、三方四正、禄权科忌、逐宫详解
 */

// ==================== 紫微斗数核心数据 ====================

// 十二宫位定义
const PALACES = [
    { name: '命宫', alias: '命身之宫', element: '水', direction: '北', desc: '人格核心、先天运势、性格本质' },
    { name: '兄弟宫', alias: '手足之宫', element: '木', direction: '东', desc: '兄弟姐妹、母亲、事业规模、现金存放' },
    { name: '夫妻宫', alias: '姻缘之宫', element: '火', direction: '南', desc: '婚姻关系、配偶特质、感情发展' },
    { name: '子女宫', alias: '子息之宫', element: '土', direction: '中央', desc: '子女缘分、桃花位、合作运、驿马' },
    { name: '财帛宫', alias: '财库之宫', element: '金', direction: '西', desc: '财富结构、收入模式、金钱观念' },
    { name: '疾厄宫', alias: '健康之宫', element: '水', direction: '北', desc: '健康状况、体质、家运、工作环境' },
    { name: '迁移宫', alias: '外出之宫', element: '木', direction: '东', desc: '外部环境、异地发展、社交能力' },
    { name: '交友宫', alias: '人际之宫', element: '火', direction: '南', desc: '朋友人脉、团队合作、婚姻状况' },
    { name: '官禄宫', alias: '事业之宫', element: '土', direction: '中央', desc: '职业发展、社会地位、整体运气' },
    { name: '田宅宫', alias: '家宅之宫', element: '金', direction: '西', desc: '家庭背景、不动产、财富库、阳宅' },
    { name: '福德宫', alias: '精神之宫', element: '水', direction: '北', desc: '幸福感、价值观、精神生活、福报' },
    { name: '父母宫', alias: '长辈之宫', element: '木', direction: '东', desc: '原生家庭、学历修养、长辈支持' }
];

// 十四主星详细数据
const MAIN_STARS = {
    '紫微': {
        name: '紫微',
        title: '帝星、尊星',
        element: '己土（阴土）',
        trait: '尊贵、权威、领导力、稳重',
        nature: '北斗主星',
        brightness: { '子': '庙', '午': '庙', '卯': '旺', '酉': '旺', '寅': '利', '申': '利', '巳': '平', '亥': '平', '辰': '陷', '戌': '陷', '丑': '陷', '未': '陷' },
        career: ['管理', '政治', '大型企业高管', '领导岗位'],
        personality: '天生具有领导气质，做事稳重有分寸，重视面子和尊严，有强烈的责任感和使命感',
        strength: '领导力强、决策果断、有远见、能服众',
        weakness: '过于自负、听不进意见、好面子、容易独断专行',
        face: '面容方正，天庭饱满，眼神威严，自带王者气场',
        palaceDesc: {
            '命宫': '紫微坐命，天生贵气，有领导才能，一生多得贵人相助。性格稳重，做事有分寸，但易过于自信。',
            '兄弟宫': '兄弟姐妹中有显贵之人，手足关系和睦，可得兄弟助力。',
            '夫妻宫': '配偶条件优越，可能是权贵之后或事业有成。婚姻关系稳定，但可能存在地位差距。',
            '子女宫': '子女聪明有出息，能继承家业或有所成就。子女缘分深厚。',
            '财帛宫': '财源稳定，正财旺盛，适合管理大项目或投资。有理财天赋，能守住财富。',
            '疾厄宫': '体质较好，但易有脾胃方面的问题。注意消化系统保养。',
            '迁移宫': '外出得贵人相助，在外有威望和影响力。适合异地发展。',
            '交友宫': '朋友多权贵，人脉层次高。能得有力人士相助。',
            '官禄宫': '事业运极佳，适合担任领导职务。官运亨通，能爬到高位。',
            '田宅宫': '家宅富贵，不动产丰厚。能守住祖业，置业能力强。',
            '福德宫': '精神生活富足，有高雅的品味。重视精神层面的享受。',
            '父母宫': '父母有社会地位，家境优渥。能得到长辈的庇护和支持。'
        }
    },
    '天机': {
        name: '天机',
        title: '智慧星、谋臣星',
        element: '乙木（阴木）',
        trait: '智慧、谋略、灵活、机敏',
        nature: '北斗主星',
        brightness: { '卯': '庙', '酉': '庙', '寅': '旺', '戌': '旺', '子': '利', '午': '利', '丑': '平', '未': '平', '辰': '陷', '戌': '陷', '巳': '陷', '亥': '陷' },
        career: ['策划', '咨询', '技术', '研究', '参谋'],
        personality: '思维敏捷，善于分析，足智多谋，但容易多疑犹豫，思虑过多',
        strength: '聪明机智、善于谋略、学习能力强、适应力好',
        weakness: '多疑犹豫、思虑过多、容易焦虑、缺乏行动力',
        face: '面容清秀，眼神灵动，给人聪明伶俐之感',
        palaceDesc: {
            '命宫': '天机坐命，聪明过人，善于谋略，但易犹豫不决。适合从事策划、技术类工作。',
            '兄弟宫': '兄弟姐妹聪明伶俐，但关系可能不够亲密。',
            '夫妻宫': '配偶聪明能干，但感情易有波折。需要多沟通理解。',
            '子女宫': '子女聪明好学，但可能较为叛逆。',
            '财帛宫': '财运多变，善于理财但易投机。适合技术性求财。',
            '疾厄宫': '易有神经系统、肝胆方面的问题。注意情绪管理。',
            '迁移宫': '在外机敏灵活，善于应变。适合流动性工作。',
            '交友宫': '朋友多为聪明之人，但交情可能不深。',
            '官禄宫': '事业适合策划、技术、咨询类。宜动脑不宜劳力。',
            '田宅宫': '家宅变动较多，置业需谨慎。',
            '福德宫': '精神生活丰富，喜欢思考和学习。',
            '父母宫': '父母聪明，但可能关系较为疏离。'
        }
    },
    '太阳': {
        name: '太阳',
        title: '日星、光明星',
        element: '丙火（阳火）',
        trait: '热情、光明、名声、博爱',
        nature: '北斗主星',
        brightness: { '巳': '庙', '午': '庙', '未': '庙', '寅': '旺', '卯': '旺', '辰': '旺', '子': '陷', '丑': '陷', '亥': '陷' },
        career: ['教育', '演艺', '公关', '政治', '公益'],
        personality: '光明磊落，热情大方，有领导魅力，喜欢帮助他人，但有时会过于张扬',
        strength: '光明正大、热情助人、有公众魅力、积极向上',
        weakness: '过于张扬、爱面子、容易操劳、有时虚伪',
        face: '面容饱满，气色红润，眼神明亮，给人阳光之感',
        palaceDesc: {
            '命宫': '太阳坐命，光明磊落，热情大方，有领导魅力。适合公众事业，但易操劳。',
            '兄弟宫': '兄弟姐妹关系和睦，能得手足助力。',
            '夫妻宫': '配偶热情开朗，但感情易有波动。需要互相包容。',
            '子女宫': '子女孝顺有出息，子女缘分深厚。',
            '财帛宫': '财运光明正大，正财稳定。适合公开行业求财。',
            '疾厄宫': '体质较好，但易有心血管、眼睛方面的问题。',
            '迁移宫': '在外名声好，能得贵人相助。适合异地发展。',
            '交友宫': '朋友众多，人脉广泛。但需防损友。',
            '官禄宫': '事业运光明，适合教育、演艺、公关等行业。',
            '田宅宫': '家宅光明，但可能有变动。',
            '福德宫': '精神生活积极，喜欢帮助他人，有公益心。',
            '父母宫': '父亲有地位，家境较好。能得到父亲的支持。'
        }
    },
    '武曲': {
        name: '武曲',
        title: '财星、将星',
        element: '辛金（阴金）',
        trait: '财运、刚毅、实干、果断',
        nature: '北斗主星',
        brightness: { '辰': '庙', '戌': '庙', '丑': '庙', '未': '庙', '子': '旺', '午': '旺', '寅': '利', '申': '利', '卯': '平', '酉': '平', '巳': '陷', '亥': '陷' },
        career: ['金融', '军警', '工程', '企业管理', '技术'],
        personality: '刚毅果断，实干精神强，重视实际利益，做事雷厉风行，但可能过于固执',
        strength: '果断坚决、执行力强、理财能力佳、吃苦耐劳',
        weakness: '刚愎自用、过于现实、缺乏情趣、容易孤独',
        face: '面容刚毅，线条分明，眼神坚定，给人可靠之感',
        palaceDesc: {
            '命宫': '武曲坐命，刚毅果断，有实干精神。适合金融、军警、工程等行业。',
            '兄弟宫': '兄弟姐妹关系一般，可能有争执。',
            '夫妻宫': '配偶务实能干，但感情可能较淡。需要多培养感情。',
            '子女宫': '子女可能较少，或关系较为疏离。',
            '财帛宫': '财运极佳，正财偏财皆旺。理财能力强。',
            '疾厄宫': '体质强健，但易有呼吸系统、骨骼方面的问题。',
            '迁移宫': '在外务实能干，但可能人际关系一般。',
            '交友宫': '朋友多为务实之人，但交情可能不深。',
            '官禄宫': '事业运强，适合金融、军警、工程等行业。',
            '田宅宫': '家宅稳固，置业能力强。',
            '福德宫': '精神生活务实，重视实际利益。',
            '父母宫': '父母务实，家境可能一般但稳定。'
        }
    },
    '天同': {
        name: '天同',
        title: '福星、和合星',
        element: '壬水（阳水）',
        trait: '福气、温和、享受、人缘',
        nature: '北斗主星',
        brightness: { '子': '庙', '申': '庙', '酉': '庙', '亥': '旺', '卯': '旺', '寅': '利', '午': '利', '辰': '平', '戌': '平', '丑': '陷', '未': '陷', '巳': '陷' },
        career: ['教育', '医疗', '服务', '艺术', '娱乐'],
        personality: '温和善良，人缘极佳，懂得享受生活，有福气，但可能缺乏进取心',
        strength: '人缘好、福气深、性格温和、懂得生活',
        weakness: '缺乏进取心、容易满足、有时懒惰、依赖性强',
        face: '面容圆润，笑容可掬，给人亲切温和之感',
        palaceDesc: {
            '命宫': '天同坐命，福气深厚，人缘极佳。性格温和，懂得享受生活，但需防缺乏进取心。',
            '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
            '夫妻宫': '婚姻美满，配偶温柔体贴。感情稳定幸福。',
            '子女宫': '子女乖巧孝顺，子女缘分深厚。',
            '财帛宫': '财运平顺，有积蓄能力。适合稳健投资。',
            '疾厄宫': '体质较好，但易有泌尿系统、肾脏方面的问题。',
            '迁移宫': '在外人缘好，能得贵人相助。',
            '交友宫': '朋友众多，人缘极佳。',
            '官禄宫': '事业运平稳，适合教育、医疗、服务等行业。',
            '田宅宫': '家宅和睦，生活安逸。',
            '福德宫': '精神生活富足，懂得享受生活。',
            '父母宫': '父母和睦，家庭氛围温馨。'
        }
    },
    '廉贞': {
        name: '廉贞',
        title: '次桃花星、囚星',
        element: '丁火（阴火）',
        trait: '感情、政治、竞争、魅力',
        nature: '北斗主星',
        brightness: { '寅': '庙', '申': '庙', '子': '旺', '午': '旺', '卯': '利', '酉': '利', '辰': '平', '戌': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['政治', '演艺', '艺术', '竞技', '公关'],
        personality: '魅力十足，有艺术天赋，感情丰富，但容易冲动，情绪起伏大',
        strength: '魅力十足、艺术天赋、有竞争力、感情丰富',
        weakness: '容易冲动、情绪不稳、桃花过多、易惹是非',
        face: '面容俊美，眼神勾人，自带桃花气质',
        palaceDesc: {
            '命宫': '廉贞坐命，魅力十足，有艺术天赋。感情丰富，但易冲动。',
            '兄弟宫': '兄弟姐妹关系可能不够和睦，易有争执。',
            '夫妻宫': '感情丰富，但易有波折。需要控制情绪。',
            '子女宫': '子女可能较为叛逆，需要多沟通。',
            '财帛宫': '财运起伏不定，有横财运但需节制。',
            '疾厄宫': '易有血液、心脏方面的问题。注意情绪管理。',
            '迁移宫': '在外魅力十足，但需防桃花劫。',
            '交友宫': '朋友众多，但需防损友和是非。',
            '官禄宫': '事业适合演艺、艺术、政治等行业。',
            '田宅宫': '家宅可能有变动，置业需谨慎。',
            '福德宫': '精神生活丰富，但情绪起伏较大。',
            '父母宫': '父母可能有艺术气质，但关系可能不够亲密。'
        }
    },
    '天府': {
        name: '天府',
        title: '财库星、令星',
        element: '戊土（阳土）',
        trait: '财库、稳重、保守、守成',
        nature: '南斗主星',
        brightness: { '丑': '庙', '未': '庙', '辰': '旺', '戌': '旺', '巳': '利', '亥': '利', '寅': '平', '申': '平', '子': '陷', '午': '陷', '卯': '陷', '酉': '陷' },
        career: ['金融', '地产', '管理', '行政', '财务'],
        personality: '稳重保守，理财能力强，善于守成，有管理能力，但可能缺乏开创精神',
        strength: '理财能力强、稳重可靠、善于守成、有管理才能',
        weakness: '过于保守、缺乏开创精神、有时固执、不善变通',
        face: '面容方正，气质稳重，给人可靠之感',
        palaceDesc: {
            '命宫': '天府坐命，稳重保守，理财能力强。善于守成，但需防缺乏开创精神。',
            '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
            '夫妻宫': '配偶稳重可靠，婚姻关系稳定。',
            '子女宫': '子女稳重有成，能继承家业。',
            '财帛宫': '财运极佳，理财能力一流。能守住财富。',
            '疾厄宫': '体质较好，但易有脾胃方面的问题。',
            '迁移宫': '在外稳重可靠，能得信任。',
            '交友宫': '朋友多为稳重之人，交情深厚。',
            '官禄宫': '事业运稳定，适合金融、地产、管理等行业。',
            '田宅宫': '家宅富贵，不动产丰厚。',
            '福德宫': '精神生活稳定，重视安全感。',
            '父母宫': '父母稳重，家境较好。'
        }
    },
    '太阴': {
        name: '太阴',
        title: '月星、母星',
        element: '癸水（阴水）',
        trait: '细腻、内敛、艺术、感性',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '亥': '旺', '巳': '旺', '酉': '利', '卯': '利', '寅': '平', '申': '平', '辰': '陷', '戌': '陷', '丑': '陷', '未': '陷' },
        career: ['文艺', '设计', '心理', '护理', '幕后工作'],
        personality: '温柔细腻，感性内敛，有艺术气质，善于照顾他人，但可能过于敏感',
        strength: '温柔细腻、艺术气质、善于照顾人、感性丰富',
        weakness: '过于敏感、容易多愁善感、缺乏主见、依赖性强',
        face: '面容柔和，气质温婉，给人温柔之感',
        palaceDesc: {
            '命宫': '太阴坐命，温柔细腻，有艺术气质。善于照顾他人，但需防过于敏感。',
            '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
            '夫妻宫': '配偶温柔体贴，感情细腻。婚姻关系稳定。',
            '子女宫': '子女温柔乖巧，子女缘分深厚。',
            '财帛宫': '财运阴柔，适合幕后或文艺类求财。',
            '疾厄宫': '体质较弱，易有妇科、肾脏方面的问题。',
            '迁移宫': '在外温柔得体，能得贵人相助。',
            '交友宫': '朋友多为温柔之人，交情深厚。',
            '官禄宫': '事业适合文艺、设计、心理、护理等行业。',
            '田宅宫': '家宅温馨，生活安逸。',
            '福德宫': '精神生活细腻，重视情感体验。',
            '父母宫': '母亲温柔，家境较好。'
        }
    },
    '贪狼': {
        name: '贪狼',
        title: '桃花星、才艺星',
        element: '甲木（阳木）',
        trait: '桃花、才艺、欲望、魅力',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '卯': '旺', '酉': '旺', '寅': '利', '申': '利', '辰': '平', '戌': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['艺术', '娱乐', '设计', '销售', '公关'],
        personality: '多才多艺，魅力十足，桃花旺盛，但容易沉迷享乐，欲望强烈',
        strength: '多才多艺、魅力十足、社交能力强、有艺术天赋',
        weakness: '容易沉迷享乐、欲望强烈、桃花过多、不够专注',
        face: '面容俊美，眼神勾人，自带艺术气质',
        palaceDesc: {
            '命宫': '贪狼坐命，多才多艺，魅力十足。桃花旺盛，但需防沉迷享乐。',
            '兄弟宫': '兄弟姐妹可能有艺术气质，但关系可能不够亲密。',
            '夫妻宫': '感情丰富，但易有桃花劫。需要专一。',
            '子女宫': '子女聪明有才艺，但可能较为叛逆。',
            '财帛宫': '财运桃花旺，有偏财运。适合艺术、娱乐行业求财。',
            '疾厄宫': '易有肝胆、生殖系统方面的问题。',
            '迁移宫': '在外魅力十足，社交能力强。',
            '交友宫': '朋友众多，但需防损友。',
            '官禄宫': '事业适合艺术、娱乐、设计等行业。',
            '田宅宫': '家宅可能有变动，置业需谨慎。',
            '福德宫': '精神生活丰富，但欲望较强。',
            '父母宫': '父母可能有艺术气质，但关系可能不够亲密。'
        }
    },
    '巨门': {
        name: '巨门',
        title: '暗曜、口舌星',
        element: '癸水（阴水）',
        trait: '口才、是非、研究、学问',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '辰': '旺', '戌': '旺', '酉': '利', '卯': '利', '寅': '平', '申': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['法律', '传媒', '销售', '教育', '研究'],
        personality: '口才极佳，善于表达，有研究精神，但容易惹是非，口舌较多',
        strength: '口才极佳、善于表达、有研究精神、逻辑能力强',
        weakness: '容易惹是非、口舌较多、疑心重、有时刻薄',
        face: '面容严肃，眼神锐利，给人精明之感',
        palaceDesc: {
            '命宫': '巨门坐命，口才极佳，善于表达。有研究精神，但需防口舌是非。',
            '兄弟宫': '兄弟姐妹可能有口舌之争，需要多沟通。',
            '夫妻宫': '配偶聪明能干，但易有口舌之争。需要多包容。',
            '子女宫': '子女聪明伶俐，但可能较为叛逆。',
            '财帛宫': '财运靠口才，适合销售、传媒等行业。',
            '疾厄宫': '易有呼吸系统、肠胃方面的问题。',
            '迁移宫': '在外善于表达，但需防是非。',
            '交友宫': '朋友众多，但需防口舌是非。',
            '官禄宫': '事业适合法律、传媒、销售等行业。',
            '田宅宫': '家宅可能有口舌之争，需要多沟通。',
            '福德宫': '精神生活丰富，喜欢研究和思考。',
            '父母宫': '父母可能有口才，但关系可能不够亲密。'
        }
    },
    '天相': {
        name: '天相',
        title: '印星、宰相星',
        element: '壬水（阳水）',
        trait: '贵人、协调、印信、稳重',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '卯': '旺', '酉': '旺', '寅': '利', '申': '利', '辰': '平', '戌': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['公务员', '行政管理', '秘书', '协调', '服务'],
        personality: '稳重正直，善于协调，有贵人运，做事谨慎，但可能过于保守',
        strength: '稳重正直、善于协调、贵人运佳、做事谨慎',
        weakness: '过于保守、缺乏开创精神、有时优柔寡断、依赖性强',
        face: '面容端正，气质稳重，给人正直之感',
        palaceDesc: {
            '命宫': '天相坐命，稳重正直，善于协调。贵人运佳，但需防过于保守。',
            '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
            '夫妻宫': '配偶稳重可靠，婚姻关系稳定。',
            '子女宫': '子女稳重有成，子女缘分深厚。',
            '财帛宫': '财运稳定，有贵人助财。适合合作求财。',
            '疾厄宫': '体质较好，但易有皮肤、泌尿系统方面的问题。',
            '迁移宫': '在外稳重可靠，能得贵人相助。',
            '交友宫': '朋友多为正直之人，交情深厚。',
            '官禄宫': '事业运稳定，适合公务员、行政管理等行业。',
            '田宅宫': '家宅稳定，生活安逸。',
            '福德宫': '精神生活稳定，重视道德和正义。',
            '父母宫': '父母正直，家境较好。'
        }
    },
    '天梁': {
        name: '天梁',
        title: '荫星、老人星',
        element: '戊土（阳土）',
        trait: '化解、荫护、长辈、清高',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '寅': '旺', '申': '旺', '卯': '利', '酉': '利', '辰': '平', '戌': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['教育', '医疗', '法律', '社会福利', '宗教'],
        personality: '仁慈宽厚，有长辈缘，善于化解危机，清高正直，但可能过于固执',
        strength: '仁慈宽厚、善于化解、长辈缘佳、清高正直',
        weakness: '过于固执、有时清高、不善变通、容易孤独',
        face: '面容慈祥，气质清高，给人可靠之感',
        palaceDesc: {
            '命宫': '天梁坐命，仁慈宽厚，有长辈缘。善于化解危机，但需防过于固执。',
            '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
            '夫妻宫': '配偶仁慈宽厚，婚姻关系稳定。',
            '子女宫': '子女孝顺有成，子女缘分深厚。',
            '财帛宫': '财运平顺，有福气带财。适合稳健型理财。',
            '疾厄宫': '体质较好，但易有脾胃、消化系统方面的问题。',
            '迁移宫': '在外仁慈宽厚，能得贵人相助。',
            '交友宫': '朋友多为仁慈之人，交情深厚。',
            '官禄宫': '事业运稳定，适合教育、医疗、法律等行业。',
            '田宅宫': '家宅稳定，生活安逸。',
            '福德宫': '精神生活富足，有宗教信仰或精神追求。',
            '父母宫': '父母仁慈，家境较好。'
        }
    },
    '七杀': {
        name: '七杀',
        title: '将星、煞星',
        element: '庚金（阳金）',
        trait: '魄力、变动、开创、将才',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '寅': '旺', '申': '旺', '辰': '利', '戌': '利', '卯': '平', '酉': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['军警', '创业', '体育', '工程', '冒险行业'],
        personality: '勇猛果断，有魄力，善于开创，但容易冲动，变动较多',
        strength: '勇猛果断、魄力十足、善于开创、行动力强',
        weakness: '容易冲动、变动较多、有时鲁莽、不善守成',
        face: '面容刚毅，眼神锐利，给人威严之感',
        palaceDesc: {
            '命宫': '七杀坐命，勇猛果断，有魄力。善于开创，但需防冲动鲁莽。',
            '兄弟宫': '兄弟姐妹可能有争执，关系不够和睦。',
            '夫妻宫': '感情易有波折，需要互相包容。',
            '子女宫': '子女可能较为叛逆，需要多沟通。',
            '财帛宫': '财运起伏不定，有偏财运但风险大。',
            '疾厄宫': '易有外伤、骨骼、呼吸系统方面的问题。',
            '迁移宫': '在外勇猛果断，但需防意外。',
            '交友宫': '朋友多为豪爽之人，但需防损友。',
            '官禄宫': '事业适合军警、创业、体育等行业。',
            '田宅宫': '家宅可能有变动，置业需谨慎。',
            '福德宫': '精神生活多变，喜欢冒险和挑战。',
            '父母宫': '父母可能有威严，但关系可能不够亲密。'
        }
    },
    '破军': {
        name: '破军',
        title: '耗星、先锋星',
        element: '癸水（阴水）',
        trait: '开创、破坏、变革、消耗',
        nature: '南斗主星',
        brightness: { '子': '庙', '午': '庙', '卯': '旺', '酉': '旺', '寅': '利', '申': '利', '辰': '平', '戌': '平', '丑': '陷', '未': '陷', '巳': '陷', '亥': '陷' },
        career: ['创业', '创新', '改革', '冒险', '艺术'],
        personality: '开创力强，有魄力，善于变革，但容易破坏，消耗较大',
        strength: '开创力强、魄力十足、善于变革、不拘一格',
        weakness: '容易破坏、消耗较大、不善守成、有时叛逆',
        face: '面容独特，气质不凡，给人先锋之感',
        palaceDesc: {
            '命宫': '破军坐命，开创力强，有魄力。善于变革，但需防破坏和消耗。',
            '兄弟宫': '兄弟姐妹关系可能有变动，不够稳定。',
            '夫妻宫': '感情易有波折和变动，需要互相理解。',
            '子女宫': '子女可能较为叛逆，需要多沟通。',
            '财帛宫': '财运多变，有开创财运但风险大。',
            '疾厄宫': '易有外伤、消耗性疾病方面的问题。',
            '迁移宫': '在外开创力强，但需防变动和消耗。',
            '交友宫': '朋友多为开创型之人，但关系可能不够稳定。',
            '官禄宫': '事业适合创业、创新、改革等行业。',
            '田宅宫': '家宅可能有较大变动，置业需谨慎。',
            '福德宫': '精神生活多变，喜欢创新和变革。',
            '父母宫': '父母可能有开创精神，但关系可能不够稳定。'
        }
    }
};

// 六吉星
const AUXILIARY_STARS = {
    '左辅': { name: '左辅', element: '土', trait: '辅佐、助力、贵人', desc: '左辅为助力之星，主贵人相助，做事有人帮衬' },
    '右弼': { name: '右弼', element: '水', trait: '辅佐、助力、贵人', desc: '右弼为助力之星，主贵人相助，与左辅同宫力量更强' },
    '文昌': { name: '文昌', element: '金', trait: '文采、学业、功名', desc: '文昌为文曲之星，主文采出众，学业有成' },
    '文曲': { name: '文曲', element: '水', trait: '才艺、口才、艺术', desc: '文曲为才艺之星，主口才出众，艺术天赋' },
    '天魁': { name: '天魁', element: '火', trait: '贵人、机遇、男性贵人', desc: '天魁为贵人星，主男性贵人相助，机遇良好' },
    '天钺': { name: '天钺', element: '火', trait: '贵人、机遇、女性贵人', desc: '天钺为贵人星，主女性贵人相助，机遇良好' }
};

// 六煞星
const MALEVOLENT_STARS = {
    '火星': { name: '火星', element: '火', trait: '冲动、急躁、突发', desc: '火星为冲动之星，主急躁冲动，易有突发状况' },
    '铃星': { name: '铃星', element: '火', trait: '阴沉、记仇、暗伤', desc: '铃星为阴沉之星，主记仇暗伤，易有暗疾' },
    '擎羊': { name: '擎羊', element: '金', trait: '刑伤、冲突、外伤', desc: '擎羊为刑伤之星，主冲突外伤，易有刀伤' },
    '陀罗': { name: '陀罗', element: '金', trait: '拖延、纠结、暗疾', desc: '陀罗为拖延之星，主纠结拖延，易有暗疾' },
    '地空': { name: '地空', element: '火', trait: '空亡、失落、精神', desc: '地空为空亡之星，主失落空虚，精神困扰' },
    '地劫': { name: '地劫', element: '火', trait: '劫夺、破财、突变', desc: '地劫为劫夺之星，主破财突变，易有损失' }
};

// 四化星
var FOUR_TRANSFORMATIONS = {
    '化禄': { name: '化禄', element: '土', trait: '财富、机遇、人缘', desc: '化禄主财富增长，机遇良好，人缘旺盛' },
    '化权': { name: '化权', element: '火', trait: '权力、掌控、晋升', desc: '化权主权力掌控，决策力强，易有晋升' },
    '化科': { name: '化科', element: '水', trait: '名声、学业、贵人', desc: '化科主名声远播，学业有成，贵人相助' },
    '化忌': { name: '化忌', element: '水', trait: '阻碍、压力、损耗', desc: '化忌主阻碍压力，需谨慎应对，防损耗' }
};

// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 144种命盘组合（简化版，实际根据出生年月日时计算）
const CHART_PATTERNS = [
    { pattern: '紫微天府', mainStars: ['紫微', '天府'], trait: '紫府同宫格', desc: '帝王之相，富贵双全，领导才能出众' },
    { pattern: '紫微贪狼', mainStars: ['紫微', '贪狼'], trait: '桃花犯主格', desc: '多才多艺，桃花旺盛，易沉迷享乐' },
    { pattern: '紫微天相', mainStars: ['紫微', '天相'], trait: '君臣庆会格', desc: '贵人相助，事业稳定，有管理才能' },
    { pattern: '紫微七杀', mainStars: ['紫微', '七杀'], trait: '紫杀同宫格', desc: '权威与魄力兼具，开创力强，但易冲动' },
    { pattern: '紫微破军', mainStars: ['紫微', '破军'], trait: '紫破同宫格', desc: '变革创新，不拘一格，但变动较大' },
    { pattern: '天机太阴', mainStars: ['天机', '太阴'], trait: '机月同梁格', desc: '聪明细腻，适合幕后工作，有艺术气质' },
    { pattern: '天机巨门', mainStars: ['天机', '巨门'], trait: '机巨同宫格', desc: '口才出众，善于谋略，但易有口舌是非' },
    { pattern: '天机天梁', mainStars: ['天机', '天梁'], trait: '善荫朝纲格', desc: '仁慈智慧，善于化解，有长辈缘' },
    { pattern: '太阳太阴', mainStars: ['太阳', '太阴'], trait: '日月并明格', desc: '阴阳调和，内外兼修，事业感情皆顺' },
    { pattern: '太阳巨门', mainStars: ['太阳', '巨门'], trait: '巨日格', desc: '口才出众，善于表达，适合传媒行业' },
    { pattern: '太阳天梁', mainStars: ['太阳', '天梁'], trait: '日照雷门格', desc: '光明磊落，仁慈宽厚，有长辈缘' },
    { pattern: '武曲天府', mainStars: ['武曲', '天府'], trait: '武府同宫格', desc: '理财能力极强，富贵双全，善于守成' },
    { pattern: '武曲贪狼', mainStars: ['武曲', '贪狼'], trait: '武贪格', desc: '财运桃花皆旺，有横财运，但需节制' },
    { pattern: '武曲天相', mainStars: ['武曲', '天相'], trait: '武相格', desc: '稳重可靠，有管理才能，事业稳定' },
    { pattern: '武曲七杀', mainStars: ['武曲', '七杀'], trait: '武杀格', desc: '刚毅果断，有魄力，适合军警行业' },
    { pattern: '武曲破军', mainStars: ['武曲', '破军'], trait: '武破格', desc: '开创力强，善于变革，但变动较大' },
    { pattern: '天同太阴', mainStars: ['天同', '太阴'], trait: '同阴格', desc: '温柔善良，福气深厚，有艺术气质' },
    { pattern: '天同巨门', mainStars: ['天同', '巨门'], trait: '同巨格', desc: '口才出众，温和善良，但易有口舌' },
    { pattern: '天同天梁', mainStars: ['天同', '天梁'], trait: '同梁格', desc: '仁慈福气，有长辈缘，适合服务行业' },
    { pattern: '廉贞天府', mainStars: ['廉贞', '天府'], trait: '廉府格', desc: '稳重有魅力，理财能力强，但需防桃花' },
    { pattern: '廉贞贪狼', mainStars: ['廉贞', '贪狼'], trait: '廉贪格', desc: '桃花极旺，多才多艺，易沉迷享乐' },
    { pattern: '廉贞天相', mainStars: ['廉贞', '天相'], trait: '廉相格', desc: '稳重有魅力，贵人相助，事业稳定' },
    { pattern: '廉贞七杀', mainStars: ['廉贞', '七杀'], trait: '廉杀格', desc: '权威与魅力兼具，有魄力，但易冲动' },
    { pattern: '廉贞破军', mainStars: ['廉贞', '破军'], trait: '廉破格', desc: '变革创新，魅力十足，但变动较大' }
];

// ==================== 命盘排盘核心算法 ====================

/**
 * 根据用户输入生成完整命盘
 */
function generateFullChart(gender, age, career, personality, family, life) {
    // 根据输入特征选择命盘格局
    const chartPattern = selectChartPattern(gender, career, personality, family, life);
    
    // 生成十二宫位排布
    const palaces = generatePalaces(chartPattern, gender, age, career, personality, family, life);
    
    // 计算三方四正
    const sanfangSizheng = calculateSanfangSizheng(palaces);
    
    // 计算四化
    const sihua = calculateSihua(palaces, chartPattern);
    
    // 生成逐宫详解
    const palaceAnalysis = generatePalaceAnalysis(palaces, gender, age, career, personality, family, life);
    
    return {
        pattern: chartPattern,
        palaces: palaces,
        sanfangSizheng: sanfangSizheng,
        sihua: sihua,
        analysis: palaceAnalysis
    };
}

/**
 * 根据用户特征选择命盘格局
 */
function selectChartPattern(gender, career, personality, family, life) {
    // 根据职业选择基础格局
    let basePattern;
    switch(career) {
        case 'politician':
            basePattern = CHART_PATTERNS.find(p => p.pattern.includes('紫微')) || CHART_PATTERNS[0];
            break;
        case 'merchant':
            basePattern = CHART_PATTERNS.find(p => p.pattern.includes('武曲') || p.pattern.includes('天府')) || CHART_PATTERNS[11];
            break;
        case 'scholar':
            basePattern = CHART_PATTERNS.find(p => p.pattern.includes('天机') || p.pattern.includes('文昌')) || CHART_PATTERNS[5];
            break;
        case 'artist':
            basePattern = CHART_PATTERNS.find(p => p.pattern.includes('贪狼') || p.pattern.includes('廉贞')) || CHART_PATTERNS[2];
            break;
        case 'military':
            basePattern = CHART_PATTERNS.find(p => p.pattern.includes('七杀') || p.pattern.includes('破军')) || CHART_PATTERNS[14];
            break;
        default:
            basePattern = CHART_PATTERNS[Math.floor(Math.random() * CHART_PATTERNS.length)];
    }
    
    // 根据性格微调
    if (personality === 'decisive' && !basePattern.pattern.includes('七杀') && !basePattern.pattern.includes('破军')) {
        // 果断性格加强开创星
    }
    
    // 根据出身微调
    if (family === 'wealthy' && !basePattern.pattern.includes('紫微') && !basePattern.pattern.includes('天府')) {
        // 富贵出身加强帝星
    }
    
    return basePattern;
}

/**
 * 生成十二宫位排布
 */
function generatePalaces(pattern, gender, age, career, personality, family, life) {
    const palaces = [];
    const mainStars = pattern.mainStars;
    
    // 确定命宫位置（根据出生时辰，这里简化处理）
    const mingIndex = Math.floor(Math.random() * 12);
    
    // 生成十二宫
    for (let i = 0; i < 12; i++) {
        const palaceName = PALACES[i].name;
        const palaceInfo = PALACES[i];
        
        // 确定宫位的主星
        let stars = [];
        let brightness = {};
        
        // 命宫和迁移宫放主星
        if (i === mingIndex) {
            stars = [...mainStars];
            mainStars.forEach(star => {
                const branch = EARTHLY_BRANCHES[i];
                brightness[star] = MAIN_STARS[star].brightness[branch] || '平';
            });
        } else if (i === (mingIndex + 6) % 12) {
            // 迁移宫可能也有主星影响
            if (Math.random() > 0.5) {
                stars.push(mainStars[0]);
                const branch = EARTHLY_BRANCHES[i];
                brightness[mainStars[0]] = MAIN_STARS[mainStars[0]].brightness[branch] || '平';
            }
        }
        
        // 随机添加辅星和煞星
        const auxStars = Object.keys(AUXILIARY_STARS);
        const malStars = Object.keys(MALEVOLENT_STARS);
        
        // 根据人生经历调整吉凶星
        let auxCount = 1;
        let malCount = 0;
        
        if (life === 'smooth') {
            auxCount = 2;
            malCount = 0;
        } else if (life === 'hard') {
            auxCount = 0;
            malCount = 2;
        } else if (life === 'rollercoaster') {
            auxCount = 1;
            malCount = 1;
        }
        
        // 添加辅星
        for (let j = 0; j < auxCount; j++) {
            if (Math.random() > 0.5) {
                const star = auxStars[Math.floor(Math.random() * auxStars.length)];
                if (!stars.includes(star)) {
                    stars.push(star);
                }
            }
        }
        
        // 添加煞星
        for (let j = 0; j < malCount; j++) {
            if (Math.random() > 0.5) {
                const star = malStars[Math.floor(Math.random() * malStars.length)];
                if (!stars.includes(star)) {
                    stars.push(star);
                }
            }
        }
        
        palaces.push({
            index: i,
            name: palaceName,
            branch: EARTHLY_BRANCHES[i],
            element: palaceInfo.element,
            direction: palaceInfo.direction,
            desc: palaceInfo.desc,
            stars: stars,
            brightness: brightness,
            isMing: i === mingIndex,
            isShen: i === mingIndex // 简化：命宫即身宫
        });
    }
    
    return palaces;
}

/**
 * 计算三方四正
 */
function calculateSanfangSizheng(palaces) {
    const result = {};
    
    palaces.forEach((palace, index) => {
        // 三方：本宫 + 财帛宫(顺时针4位) + 官禄宫(逆时针4位)
        const caiboIndex = (index + 4) % 12;
        const guanluIndex = (index + 8) % 12;
        
        // 四正：三方 + 对宫
        const duigongIndex = (index + 6) % 12;
        
        result[palace.name] = {
            sanfang: [palace.name, palaces[caiboIndex].name, palaces[guanluIndex].name],
            sizheng: [palace.name, palaces[caiboIndex].name, palaces[guanluIndex].name, palaces[duigongIndex].name],
            sanfangStars: [...palace.stars, ...palaces[caiboIndex].stars, ...palaces[guanluIndex].stars],
            sizhengStars: [...palace.stars, ...palaces[caiboIndex].stars, ...palaces[guanluIndex].stars, ...palaces[duigongIndex].stars]
        };
    });
    
    return result;
}

/**
 * 计算四化
 */
function calculateSihua(palaces, pattern) {
    const sihua = {
        '化禄': { palace: '', star: '', desc: '' },
        '化权': { palace: '', star: '', desc: '' },
        '化科': { palace: '', star: '', desc: '' },
        '化忌': { palace: '', star: '', desc: '' }
    };
    
    // 根据主星确定四化（简化版）
    const mainStar = pattern.mainStars[0];
    const sihuaMap = {
        '紫微': { hualu: '破军', huaquan: '天梁', huake: '紫微', huaji: '太阳' },
        '天机': { hualu: '天梁', huaquan: '紫微', huake: '武曲', huaji: '贪狼' },
        '太阳': { hualu: '太阴', huaquan: '天梁', huake: '天机', huaji: '巨门' },
        '武曲': { hualu: '贪狼', huaquan: '紫微', huake: '天梁', huaji: '太阳' },
        '天同': { hualu: '太阴', huaquan: '天梁', huake: '天机', huaji: '巨门' },
        '廉贞': { hualu: '武曲', huaquan: '紫微', huake: '天梁', huaji: '太阳' },
        '天府': { hualu: '太阴', huaquan: '天梁', huake: '天机', huaji: '巨门' },
        '太阴': { hualu: '天梁', huaquan: '紫微', huake: '武曲', huaji: '贪狼' },
        '贪狼': { hualu: '太阴', huaquan: '天梁', huake: '天机', huaji: '巨门' },
        '巨门': { hualu: '天梁', huaquan: '紫微', huake: '武曲', huaji: '贪狼' },
        '天相': { hualu: '太阴', huaquan: '天梁', huake: '天机', huaji: '巨门' },
        '天梁': { hualu: '天梁', huaquan: '紫微', huake: '武曲', huaji: '贪狼' },
        '七杀': { hualu: '破军', huaquan: '天梁', huake: '紫微', huaji: '太阳' },
        '破军': { hualu: '破军', huaquan: '天梁', huake: '紫微', huaji: '太阳' }
    };
    
    const map = sihuaMap[mainStar] || sihuaMap['紫微'];
    
    // 随机分配四化到宫位
    const palaceNames = palaces.map(p => p.name);
    sihua['化禄'] = { palace: palaceNames[Math.floor(Math.random() * 12)], star: map.hualu, desc: '主财富增长，机遇良好' };
    sihua['化权'] = { palace: palaceNames[Math.floor(Math.random() * 12)], star: map.huaquan, desc: '主权力掌控，决策力强' };
    sihua['化科'] = { palace: palaceNames[Math.floor(Math.random() * 12)], star: map.huake, desc: '主名声远播，学业有成' };
    sihua['化忌'] = { palace: palaceNames[Math.floor(Math.random() * 12)], star: map.huaji, desc: '主阻碍压力，需谨慎应对' };
    
    return sihua;
}

/**
 * 生成逐宫详细解读
 */
function generatePalaceAnalysis(palaces, gender, age, career, personality, family, life) {
    const analysis = [];
    
    palaces.forEach(palace => {
        const palaceName = palace.name;
        const stars = palace.stars;
        const mainStar = stars.find(s => MAIN_STARS[s]);
        
        let interpretation = '';
        
        // 基础宫位含义
        interpretation += `【${palaceName}】${PALACES.find(p => p.name === palaceName).desc}。`;
        
        // 主星解读
        if (mainStar) {
            const starData = MAIN_STARS[mainStar];
            const brightness = palace.brightness[mainStar] || '平';
            interpretation += `${mainStar}星入${palaceName}，${starData.palaceDesc[palaceName]} `;
            interpretation += `星曜亮度为"${brightness}"，${getBrightnessDesc(brightness)} `;
        }
        
        // 辅星解读
        const auxStars = stars.filter(s => AUXILIARY_STARS[s]);
        if (auxStars.length > 0) {
            interpretation += `得${auxStars.join('、')}相助，${auxStars.map(s => AUXILIARY_STARS[s].desc).join('；')} `;
        }
        
        // 煞星解读
        const malStars = stars.filter(s => MALEVOLENT_STARS[s]);
        if (malStars.length > 0) {
            interpretation += `受${malStars.join('、')}影响，${malStars.map(s => MALEVOLENT_STARS[s].desc).join('；')} `;
        }
        
        // 结合人物背景
        interpretation += generateBackgroundLink(palaceName, gender, age, career, personality, family, life);
        
        analysis.push({
            palace: palaceName,
            branch: palace.branch,
            stars: stars,
            interpretation: interpretation
        });
    });
    
    return analysis;
}

/**
 * 获取星曜亮度描述
 */
function getBrightnessDesc(brightness) {
    const desc = {
        '庙': '星曜能量最强，吉星最吉，凶星不凶',
        '旺': '星曜能量旺盛，吉利程度很高',
        '利': '星曜能量平顺，能发挥正面作用',
        '平': '星曜能量一般，吉凶参半',
        '陷': '星曜能量最弱，吉星无力，凶星更凶'
    };
    return desc[brightness] || '能量一般';
}

/**
 * 生成人物背景联动解读
 */
function generateBackgroundLink(palaceName, gender, age, career, personality, family, life) {
    let link = '';
    
    // 根据人物背景添加联动解读
    if (palaceName === '命宫') {
        link += `结合其${family === 'wealthy' ? '富贵' : family === 'poor' ? '贫寒' : '普通'}出身，`;
        link += `${personality === 'decisive' ? '果断坚毅' : personality === 'strategic' ? '深谋远虑' : '稳重踏实'}的性格特质在命盘中得到充分体现。`;
        link += `其${life === 'smooth' ? '平顺' : life === 'hard' ? '坎坷' : '起伏'}的人生经历，与命宫星曜组合相互印证。`;
    }
    
    if (palaceName === '财帛宫') {
        link += `${career === 'merchant' ? '从商求财' : career === 'politician' ? '仕途经济' : '职业收入'}的财运特征明显，`;
        link += `${family === 'wealthy' ? '家境优渥带来的理财观念' : '白手起家的财富积累'}在财帛宫中有所体现。`;
    }
    
    if (palaceName === '官禄宫') {
        link += `${career === 'politician' ? '仕途发展' : career === 'artist' ? '艺术成就' : career === 'military' ? '军功业绩' : '事业发展'}的轨迹，`;
        link += `与其${personality === 'decisive' ? '雷厉风行' : '稳健务实'}的行事风格高度契合。`;
    }
    
    if (palaceName === '夫妻宫') {
        link += `${gender === 'male' ? '男性' : '女性'}命主的婚姻模式，`;
        link += `受到${family === 'wealthy' ? '家族联姻' : '自由恋爱'}背景的深刻影响。`;
    }
    
    if (palaceName === '疾厄宫') {
        link += `${age === 'old' ? '年事已高' : '当前年龄'}阶段的健康状况，`;
        link += `与其${life === 'hard' ? '历经磨难' : '生活平顺'}的人生经历密切相关。`;
    }
    
    return link;
}

// ==================== UI 交互函数 ====================

// 当前步骤
let currentStep = 1;
let selectedChart = null;
let userInputs = {};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    showStep(1);
    initOptionCards();
});

// 显示指定步骤
function showStep(step) {
    // 隐藏所有步骤
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // 显示当前步骤
    const currentStepEl = document.getElementById(`step-${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    // 更新步骤指示器
    document.querySelectorAll('.step').forEach((el, index) => {
        if (index + 1 === step) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
    
    currentStep = step;
}

// 初始化选项卡片
function initOptionCards() {
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
            const group = card.dataset.group;
            const value = card.dataset.value;
            
            // 移除同组其他选中状态
            document.querySelectorAll(`.option-card[data-group="${group}"]`).forEach(c => {
                c.classList.remove('selected');
            });
            
            // 选中当前卡片
            card.classList.add('selected');
            
            // 保存选择
            userInputs[group] = value;
        });
    });
}

// 下一步
function nextStep() {
    if (currentStep === 1) {
        // 验证第一步输入
        const required = ['gender', 'age', 'career'];
        for (let field of required) {
            if (!userInputs[field]) {
                alert(`请选择${getFieldLabel(field)}`);
                return;
            }
        }
        
        // 生成命盘
        generateChart();
        showStep(2);
    } else if (currentStep === 2) {
        showStep(3);
        generateFullResult();
    }
}

// 上一步
function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

// 获取字段标签
function getFieldLabel(field) {
    const labels = {
        'gender': '性别',
        'age': '年龄段',
        'career': '职业类型',
        'personality': '性格特点',
        'family': '家庭出身',
        'life': '人生经历'
    };
    return labels[field] || field;
}

// 生成命盘
function generateChart() {
    const chart = generateFullChart(
        userInputs.gender,
        userInputs.age,
        userInputs.career,
        userInputs.personality || 'steady',
        userInputs.family || 'normal',
        userInputs.life || 'normal'
    );
    
    selectedChart = chart;
    
    // 显示命盘概览
    displayChartOverview(chart);
}

// 显示命盘概览
function displayChartOverview(chart) {
    const container = document.getElementById('chart-overview');
    
    // 命盘格局
    const pattern = chart.pattern;
    
    // 找出命宫
    const mingPalace = chart.palaces.find(p => p.isMing);
    
    // 找出主星
    const mainStars = mingPalace.stars.filter(s => MAIN_STARS[s]);
    
    // 生成HTML
    container.innerHTML = `
        <div class="chart-pattern">
            <div class="pattern-name">${pattern.trait}</div>
            <div class="pattern-desc">${pattern.desc}</div>
        </div>
        
        <div class="chart-info-grid">
            <div class="info-item">
                <div class="info-label">命宫主星</div>
                <div class="info-value">${mainStars.join('、')}</div>
            </div>
            <div class="info-item">
                <div class="info-label">命宫地支</div>
                <div class="info-value">${mingPalace.branch}</div>
            </div>
            <div class="info-item">
                <div class="info-label">五行属性</div>
                <div class="info-value">${mingPalace.element}</div>
            </div>
            <div class="info-item">
                <div class="info-label">方位</div>
                <div class="info-value">${mingPalace.direction}</div>
            </div>
        </div>
        
        <div class="chart-palaces-preview">
            <h4>十二宫位排布</h4>
            <div class="palaces-grid">
                ${chart.palaces.map(p => `
                    <div class="palace-item ${p.isMing ? 'ming' : ''}">
                        <div class="palace-name">${p.name}</div>
                        <div class="palace-branch">${p.branch}</div>
                        <div class="palace-stars">${p.stars.slice(0, 3).join(' ')}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="chart-sihua">
            <h4>四化飞星</h4>
            <div class="sihua-grid">
                ${Object.entries(chart.sihua).map(([name, data]) => `
                    <div class="sihua-item">
                        <div class="sihua-name">${name}</div>
                        <div class="sihua-location">${data.palace} · ${data.star}</div>
                        <div class="sihua-desc">${data.desc}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 生成完整结果
function generateFullResult() {
    const container = document.getElementById('result-content');
    const chart = selectedChart;
    
    // 生成详细解读
    let html = '';
    
    // 1. 命盘总览
    html += `
        <div class="result-section">
            <div class="result-title">命盘总览</div>
            <div class="result-content">
                <p><strong>命盘格局。</strong>${chart.pattern.trait}——${chart.pattern.desc}</p>
                <p><strong>主星组合。</strong>${chart.pattern.mainStars.join('、')}同宫，形成${chart.pattern.pattern}格局。</p>
                <p><strong>命身定位。</strong>命宫位于${chart.palaces.find(p => p.isMing).branch}位，五行属${chart.palaces.find(p => p.isMing).element}，主${PALACES[0].desc}。</p>
            </div>
        </div>
    `;
    
    // 2. 三方四正
    const mingPalaceName = chart.palaces.find(p => p.isMing).name;
    const sanfang = chart.sanfangSizheng[mingPalaceName];
    html += `
        <div class="result-section">
            <div class="result-title">三方四正</div>
            <div class="result-content">
                <p><strong>三方宫位。</strong>${sanfang.sanfang.join('、')}——此三方构成命宫的三合局，共同决定命主的性格特质与人生走向。</p>
                <p><strong>四正宫位。</strong>${sanfang.sizheng.join('、')}——加上对宫，四正宫位形成完整的命盘分析体系，缺一不可。</p>
                <p><strong>星曜分布。</strong>三方四正共汇聚${sanfang.sizhengStars.length}颗星曜，主星${sanfang.sizhengStars.filter(s => MAIN_STARS[s]).join('、')}相互作用，形成${chart.pattern.trait}。</p>
            </div>
        </div>
    `;
    
    // 3. 逐宫详解
    html += `
        <div class="result-section">
            <div class="result-title">十二宫位详解</div>
            <div class="palace-analysis">
                ${chart.analysis.map(a => `
                    <div class="palace-analysis-item">
                        <div class="palace-analysis-header">
                            <span class="palace-analysis-name">${a.palace}</span>
                            <span class="palace-analysis-branch">${a.branch}位</span>
                            <span class="palace-analysis-stars">${a.stars.join(' ')}</span>
                        </div>
                        <div class="palace-analysis-content">${a.interpretation}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 4. 四化详解
    html += `
        <div class="result-section">
            <div class="result-title">四化飞星详解</div>
            <div class="result-content">
                ${Object.entries(chart.sihua).map(([name, data]) => `
                    <p><strong>${name}。</strong>${data.star}化${name.replace('化', '')}入${data.palace}，${data.desc}。此象显示命主在${data.palace}方面将有显著变化，需结合大限流年具体分析。</p>
                `).join('')}
            </div>
        </div>
    `;
    
    // 5. 人物设定联动
    html += generateCharacterProfile(chart);
    
    container.innerHTML = html;
}

// 生成人物设定
function generateCharacterProfile(chart) {
    const mingPalace = chart.palaces.find(p => p.isMing);
    const mainStar = mingPalace.stars.find(s => MAIN_STARS[s]);
    const starData = MAIN_STARS[mainStar] || MAIN_STARS['紫微'];
    
    return `
        <div class="result-section">
            <div class="result-title">人物设定联动解读</div>
            <div class="result-content">
                <p><strong>核心特质。</strong>${starData.personality} 结合其${userInputs.family === 'wealthy' ? '富贵' : userInputs.family === 'poor' ? '贫寒' : '普通'}出身，形成了${userInputs.personality === 'decisive' ? '果断坚毅、雷厉风行' : userInputs.personality === 'strategic' ? '深谋远虑、谋定后动' : '稳重踏实、一步一个脚印'}的行事风格。</p>
                
                <p><strong>行事风格。</strong>${starData.trait}，做事${userInputs.personality === 'strategic' ? '深思熟虑，善于谋划，不打无准备之仗' : userInputs.personality === 'decisive' ? '雷厉风行，说干就干，不拖泥带水' : '稳重踏实，一步一个脚印，稳扎稳打'}。其${userInputs.life === 'smooth' ? '平顺' : userInputs.life === 'hard' ? '坎坷' : '起伏'}的人生经历，在命盘中${userInputs.life === 'smooth' ? '多吉星相助，少煞星干扰' : userInputs.life === 'hard' ? '煞星较多，需经历磨难方能成功' : '吉凶参半，大起大落'}。</p>
                
                <p><strong>天赋与短板。</strong>天赋是${starData.strength}，在${starData.career.join('、')}等领域有独特优势。短板是${starData.weakness}，需要在生活中注意调整。</p>
                
                <p><strong>外貌特征。</strong>${starData.face}。${userInputs.gender === 'male' ? '男性' : '女性'}命主面容${userInputs.age === 'youth' ? '年轻' : userInputs.age === 'old' ? '成熟' : '稳重'}，${userInputs.life === 'hard' ? '眼角有细纹，显示出岁月的沧桑' : '气色良好，显示出生活的优渥'}。</p>
                
                <p><strong>事业财运。</strong>适合从事${starData.career.join('、')}等相关工作。${userInputs.career === 'politician' ? '仕途发展' : userInputs.career === 'merchant' ? '经商求财' : '职业发展'}方面，${chart.pattern.desc}</p>
                
                <p><strong>人际关系。</strong>${userInputs.personality === 'outgoing' ? '外向开朗，善于交际，人脉广泛' : userInputs.personality === 'reserved' ? '内敛低调，不善于社交，但朋友质量高' : '谨慎选择，社交圈子精致但不大'}。命盘中${mingPalace.stars.filter(s => AUXILIARY_STARS[s]).length > 0 ? '有吉星相助，贵人运佳' : '需防小人暗算'}。</p>
            </div>
        </div>
    `;
}

// 重新匹配
function resetChart() {
    selectedChart = null;
    userInputs = {};
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    showStep(1);
}

// 复制结果
function copyResult() {
    const resultContent = document.getElementById('result-content');
    if (resultContent) {
        const text = resultContent.innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert('已复制到剪贴板');
        });
    }
}
