/**
 * 紫微斗数星曜详细特性数据库
 * 基于144命盘版紫微斗数角色设计skill
 * 包含14主星的完整十二宫含义、入庙落陷特质
 */

const STAR_DETAILS = {
    '紫微': {
        element: '己土',
        attribute: '帝星',
        coreTraits: ['高大上', '领导力', '贵气', '骄傲'],
        keywords: ['帝王', '权威', '自尊', '掌控'],
        
        luckyTraits: [
            '有助力的领导、高级、有号召力',
            '优良的管理才能、能在稳定的公司就职',
            '平台发展较好、影响力佳'
        ],
        
        unluckyTraits: [
            '脾气不好的领导、伤害尊严之事',
            '傲气的碰撞、锋芒毕露',
            '管理不好、关系变差、难以打工',
            '容易创业但不懂得尊重人'
        ],
        
        palaceMeanings: {
            ming: '略带骄傲，喜欢掌权，感情用事，自负、耳根软、多疑；心地仁慈，忠厚耿直',
            xiongdi: '兄弟姐妹自负骄傲，有社会地位或影响力，事业合作遇好平台',
            fuqi: '择偶眼光高易晚婚，伴侣自负有贵气',
            zinv: '子女自负有贵气，教育方式专制',
            caibo: '喜欢挣高大上的钱，不善理财，轻财',
            jie: '肠胃之疾，胸闷气胀，呕吐腹泻',
            qianyi: '外在自负骄傲，心高气傲，出外受人尊重',
            pengyou: '朋友有社会地位，入庙加吉星得贵友',
            shiye: '眼光高、有贵气、能力强，加左辅右弼有管理潜能',
            tianzhai: '易有高端不动产，选择眼光高',
            fude: '内心自我自大，注重物质精神享受，自尊心强',
            fumu: '父母自负有权威，教养方式严厉'
        },
        
        suitableCareers: ['领导', '管理', '政客', '权贵', '老板'],
        suitablePersonality: ['张扬', '谋略', '富贵背景']
    },
    
    '天机': {
        element: '乙木',
        attribute: '善星',
        coreTraits: ['智慧', '变动', '善良', '机敏'],
        keywords: ['机智', '谋士', '变动', '兄弟合作'],
        
        luckyTraits: [
            '朋友兄弟互助、学习能力好',
            '善于举一反三、灵活变动',
            '人际交流关系好、朋友带来财运'
        ],
        
        unluckyTraits: [
            '被朋友连累、同事竞争',
            '因朋友破财、小人陷害',
            '伤脑筋、学习能力不强、精神衰弱',
            '旅程多障碍、车辆事故'
        ],
        
        palaceMeanings: {
            ming: '聪明机智，善良智慧，有神经过敏或多愁善感；适合谋士、公职、策划、助理',
            xiongdi: '兄弟姐妹聪明机智，入庙合作运好，落陷性格多变敏感',
            fuqi: '以貌取人，伴侣聪明，入庙感情融洽，落陷情感多变故',
            zinv: '子女聪明善良，入庙感情融洽，落陷性格多变',
            caibo: '收入来自公职/策划/文化才艺，主变动财来财去',
            jie: '肝、胃方面疾病',
            qianyi: '外在聪明机智，入庙利出门发展，落陷出外不顺、交通安全注意',
            pengyou: '朋友聪明机智，入庙交友广泛，落陷交友不慎',
            shiye: '适合公职、策划、文化才艺、助理秘书',
            tianzhai: '房产变动多，入庙置业顺利',
            fude: '思想活跃，精神生活丰富，落陷思虑过多',
            fumu: '父母聪明善良，入庙关系好，落陷关系多变'
        },
        
        suitableCareers: ['谋士', '策划', '助理', '公职', '秘书'],
        suitablePersonality: ['内敛', '谋略', '顺遂人生']
    },
    
    '太阳': {
        element: '丙火',
        attribute: '官禄宫主星',
        coreTraits: ['光明', '博爱', '公平', '热情'],
        keywords: ['光明', '贵气', '男性缘', '公众'],
        
        luckyTraits: [
            '名气旺、容易被瞩目',
            '善于发挥自己、思想开放',
            '男性助力好（父亲、丈夫、儿子）'
        ],
        
        unluckyTraits: [
            '被损名誉、是非多',
            '多劳心劳力、男性惹麻烦',
            '视力问题、心脏问题'
        ],
        
        palaceMeanings: {
            ming: '热情积极，有正义感，博爱，男性缘好；落陷主劳碌、是非',
            xiongdi: '兄弟姐妹有贵气，男性助力好',
            fuqi: '伴侣热情光明，女命主嫁贵夫',
            zinv: '子女有出息，男性缘好',
            caibo: '财来自名声、公众、男性相关',
            jie: '心脏、眼睛、血压问题',
            qianyi: '外出受欢迎，落陷外出多是非',
            pengyou: '男性朋友多，入庙得贵友',
            shiye: '适合公众、教育、能源、男性相关行业',
            tianzhai: '房产光明正大，落陷房产有纠纷',
            fude: '内心光明磊落，注重名誉',
            fumu: '父亲有地位，男性长辈助力'
        },
        
        suitableCareers: ['政客', '公众人物', '教育', '能源'],
        suitablePersonality: ['张扬', '中年转运', '正义感强']
    },
    
    '武曲': {
        element: '辛金',
        attribute: '财星',
        coreTraits: ['果断', '刚毅', '务实', '财缘'],
        keywords: ['财星', '果断', '实干', '刚直'],
        
        luckyTraits: [
            '财运亨通、理财能力强',
            '果断决策、执行力强',
            '事业成就高、有财有势'
        ],
        
        unluckyTraits: [
            '财运不顺、理财失败',
            '刚愎自用、不懂变通',
            '事业波折、财来财去'
        ],
        
        palaceMeanings: {
            ming: '果断刚毅，务实重财，有领导力；落陷刚愎自用',
            xiongdi: '兄弟姐妹务实重财，合作有财缘',
            fuqi: '伴侣务实，重视物质生活',
            zinv: '子女务实，理财观念强',
            caibo: '财星入财帛，财运佳，擅长理财',
            jie: '肺、呼吸系统、骨骼问题',
            qianyi: '外出务实，重利益，落陷外出破财',
            pengyou: '朋友务实重利，入庙得财友',
            shiye: '适合金融、商业、技术、军警',
            tianzhai: '房产投资有道，落陷房产纠纷',
            fude: '内心重视物质，精神生活务实',
            fumu: '父母务实，重视物质生活'
        },
        
        suitableCareers: ['商人', '金融', '技术', '军警', '武将'],
        suitablePersonality: ['果敢', '务实', '大起大落']
    },
    
    '天同': {
        element: '壬水',
        attribute: '福星',
        coreTraits: ['福气', '温和', '享乐', '小孩性格'],
        keywords: ['福气', '温和', '享乐', '善良'],
        
        luckyTraits: [
            '能享福、能快乐、知足常乐',
            '心胸开阔、不愿意争名夺利',
            '白手创业、公职顺利'
        ],
        
        unluckyTraits: [
            '自寻烦恼、好坐享其成',
            '不知足、贪玩、好逸恶劳',
            '工作压力大、多变动'
        ],
        
        palaceMeanings: {
            ming: '性情温和，思想聪敏，安享福气，好玩乐；落陷懒散',
            xiongdi: '兄弟姐妹温和，感情融洽',
            fuqi: '感情温和，伴侣善良，晚婚较好',
            zinv: '子女缘好，亲子关系融洽',
            caibo: '财来自福气、服务、享受相关行业',
            jie: '肾脏、泌尿系统、耳病',
            qianyi: '外出平和，人缘好，落陷外出懒散',
            pengyou: '朋友温和善良，入庙得福友',
            shiye: '适合服务、医疗、餐饮、娱乐行业',
            tianzhai: '家庭氛围好，享受天伦之乐',
            fude: '能享福，知足常乐，落陷自寻烦恼',
            fumu: '父母温和善良，教养方式宽松'
        },
        
        suitableCareers: ['艺人', '服务', '医疗', '餐饮', '娱乐'],
        suitablePersonality: ['善良', '内敛', '顺遂人生']
    },
    
    '廉贞': {
        element: '丁火',
        attribute: '次桃花',
        coreTraits: ['复杂', '好胜', '冒险', '桃花'],
        keywords: ['复杂', '囚性', '好胜', '艺术'],
        
        luckyTraits: [
            '聪明、能消化复杂系统之学',
            '有创意天赋、空间感好',
            '行政文书流畅有条理、考试运佳',
            '有审美感、设计天赋'
        ],
        
        unluckyTraits: [
            '讨厌复杂麻烦之事',
            '文书行政偷工减料、有赌性',
            '容易败在忽略的小细节',
            '反叛、口舌官司牢狱'
        ],
        
        palaceMeanings: {
            ming: '不拘小节，好胜好辩，好冒险，喜欢新潮；落陷叛逆',
            xiongdi: '兄弟姐妹好胜，入庙合作好，落陷易吵架',
            fuqi: '择偶眼光独特，伴侣好胜，易有桃花',
            zinv: '子女好胜，入庙关系好，落陷有烂桃花',
            caibo: '适合艺术设计、行政文书、互联网行业',
            jie: '心、血、循环系统，生殖系统，落陷注意癌症肿瘤',
            qianyi: '外在好胜冒险，入庙形象好，落陷口舌是非',
            pengyou: '朋友好胜，入庙交友广，落陷交友不慎',
            shiye: '文武兼备，适合军警、艺术设计、互联网行业',
            tianzhai: '注重装修美观，落陷因产业生灾',
            fude: '内心复杂，追求刺激，落陷易有官非',
            fumu: '父母好胜，入庙关系好，落陷关系紧张'
        },
        
        suitableCareers: ['艺人', '艺术设计', '军警', '互联网'],
        suitablePersonality: ['好胜', '复杂性格', '大起大落']
    },
    
    '天府': {
        element: '戊土',
        attribute: '财库星',
        coreTraits: ['稳重', '保守', '包容', '财库'],
        keywords: ['财库', '稳重', '保守', '包容'],
        
        luckyTraits: [
            '财库丰盈、理财保守稳健',
            '包容力强、人缘好',
            '事业稳定、守成有道'
        ],
        
        unluckyTraits: [
            '财库空虚、理财失误',
            '过于保守、错失良机',
            '包容过度、被人利用'
        ],
        
        palaceMeanings: {
            ming: '稳重保守，包容力强，善于守成',
            xiongdi: '兄弟姐妹稳重，合作守成',
            fuqi: '伴侣稳重保守，重视家庭',
            zinv: '子女稳重，教育保守',
            caibo: '财库星入财帛，理财保守，积蓄丰厚',
            jie: '脾胃、消化系统问题',
            qianyi: '外出稳重，不轻易冒险',
            pengyou: '朋友稳重可靠，入庙得益友',
            shiye: '适合管理、财务、守成型事业',
            tianzhai: '房产丰厚，置业保守稳健',
            fude: '内心稳重，追求安定',
            fumu: '父母稳重保守，教养方式稳健'
        },
        
        suitableCareers: ['管理', '财务', '守成型事业'],
        suitablePersonality: ['保守', '富贵背景', '谋略']
    },
    
    '太阴': {
        element: '癸水',
        attribute: '财帛宫主星',
        coreTraits: ['温柔', '内敛', '财帛', '母性'],
        keywords: ['温柔', '财帛', '内敛', '母性'],
        
        luckyTraits: [
            '财运好、理财细腻',
            '温柔体贴、人缘好',
            '房产运佳、家庭和睦'
        ],
        
        unluckyTraits: [
            '财运不顺、理财失误',
            '过于内敛、缺乏主见',
            '房产纠纷、家庭不和'
        ],
        
        palaceMeanings: {
            ming: '温柔内敛，有母性，重感情；落陷优柔寡断',
            xiongdi: '兄弟姐妹温柔，感情细腻',
            fuqi: '感情温柔细腻，伴侣体贴',
            zinv: '子女缘好，亲子关系温柔',
            caibo: '财星入财帛，理财细腻，财运佳',
            jie: '妇科、肾脏、泌尿系统',
            qianyi: '外出温柔，人缘好，落陷外出多是非',
            pengyou: '朋友温柔体贴，入庙得益友',
            shiye: '适合财务、艺术、服务、女性相关行业',
            tianzhai: '房产运佳，家庭和睦',
            fude: '内心温柔，重感情，落陷多愁善感',
            fumu: '母亲影响大，父母温柔'
        },
        
        suitableCareers: ['财务', '艺术', '服务', '女性角色'],
        suitablePersonality: ['内敛', '温柔', '善良']
    },
    
    '贪狼': {
        element: '甲木',
        attribute: '桃花星',
        coreTraits: ['桃花', '欲望', '多才多艺', '交际'],
        keywords: ['桃花', '欲望', '才艺', '交际'],
        
        luckyTraits: [
            '多才多艺、交际手腕高明',
            '桃花旺、人缘好',
            '欲望强烈、追求成功'
        ],
        
        unluckyTraits: [
            '桃花劫、感情纠纷',
            '欲望过度、贪得无厌',
            '交际手腕用于不正途'
        ],
        
        palaceMeanings: {
            ming: '多才多艺，交际强，欲望大；落陷桃花劫',
            xiongdi: '兄弟姐妹多才多艺，交际广',
            fuqi: '感情丰富，伴侣有魅力，易有桃花',
            zinv: '子女多才多艺，入庙关系好',
            caibo: '财来自才艺、交际、欲望相关行业',
            jie: '肝胆、神经系统、性病',
            qianyi: '外出交际广，入庙得贵人，落陷桃花劫',
            pengyou: '朋友多才多艺，入庙得益友',
            shiye: '适合演艺、销售、公关、艺术行业',
            tianzhai: '房产来自交际、才艺',
            fude: '内心欲望大，追求享受',
            fumu: '父母多才多艺，入庙关系好'
        },
        
        suitableCareers: ['艺人', '销售', '公关', '艺术', '社交达人'],
        suitablePersonality: ['张扬', '多才多艺', '复杂性格']
    },
    
    '巨门': {
        element: '癸水',
        attribute: '暗曜',
        coreTraits: ['口才', '是非', '暗曜', '研究'],
        keywords: ['口才', '是非', '研究', '暗曜'],
        
        luckyTraits: [
            '口才好、善于表达',
            '研究能力强、学术成就高',
            '是非分明、正义感强'
        ],
        
        unluckyTraits: [
            '口舌是非多、招小人',
            '过于阴暗、疑心病重',
            '口舌伤人、人际关系差'
        ],
        
        palaceMeanings: {
            ming: '口才好，研究强，是非多；落陷口舌招祸',
            xiongdi: '兄弟姐妹口才好，入庙合作好',
            fuqi: '感情多口舌，伴侣口才好',
            zinv: '子女口才好，入庙关系好',
            caibo: '财来自口才、研究、教育行业',
            jie: '口腔、肠胃、呼吸系统',
            qianyi: '外出多口舌，入庙得贵人',
            pengyou: '朋友口才好，入庙得益友',
            shiye: '适合律师、记者、教师、研究行业',
            tianzhai: '房产多口舌，落陷房产纠纷',
            fude: '内心多思虑，研究心强',
            fumu: '父母口才好，入庙关系好'
        },
        
        suitableCareers: ['律师', '记者', '学者', '教师'],
        suitablePersonality: ['张扬', '中年转运', '正义感强']
    },
    
    '天相': {
        element: '壬水',
        attribute: '印星',
        coreTraits: ['谨慎', '服务', '协调', '印星'],
        keywords: ['谨慎', '服务', '协调', '印信'],
        
        luckyTraits: [
            '谨慎细心、服务周到',
            '协调能力强、人际关系好',
            '重视信用、有责任感'
        ],
        
        unluckyTraits: [
            '过于谨慎、优柔寡断',
            '服务过度、被人利用',
            '协调不当、两边不讨好'
        ],
        
        palaceMeanings: {
            ming: '谨慎细心，服务周到，重视信用',
            xiongdi: '兄弟姐妹谨慎，合作守信',
            fuqi: '感情谨慎，伴侣细心',
            zinv: '子女谨慎细心，入庙关系好',
            caibo: '财来自服务、协调、印信相关行业',
            jie: '皮肤、泌尿系统',
            qianyi: '外出谨慎，入庙得贵人',
            pengyou: '朋友谨慎可靠，入庙得益友',
            shiye: '适合服务、协调、管理、公务员',
            tianzhai: '房产稳定，置业谨慎',
            fude: '内心谨慎，追求安定',
            fumu: '父母谨慎，教养方式稳健'
        },
        
        suitableCareers: ['幕僚', '协调者', '公务员', '管理'],
        suitablePersonality: ['内敛', '谋略', '富贵背景']
    },
    
    '天梁': {
        element: '戊土',
        attribute: '荫星',
        coreTraits: ['荫庇', '解厄', '清高', '老大'],
        keywords: ['荫星', '解厄', '清高', '保护'],
        
        luckyTraits: [
            '有贵人荫庇、逢凶化吉',
            '清高正直、有威望',
            '保护欲强、乐于助人'
        ],
        
        unluckyTraits: [
            '过于清高、孤芳自赏',
            '解厄不成、反招灾祸',
            '老大性格、好为人师'
        ],
        
        palaceMeanings: {
            ming: '清高正直，有威望，乐于助人；落陷孤芳自赏',
            xiongdi: '兄弟姐妹有威望，入庙得助力',
            fuqi: '感情稳定，伴侣有威望',
            zinv: '子女有出息，入庙关系好',
            caibo: '财来自荫庇、解厄、长辈相关行业',
            jie: '脾胃、消化系统',
            qianyi: '外出有贵人，入庙逢凶化吉',
            pengyou: '朋友有威望，入庙得贵人',
            shiye: '适合医疗、教育、宗教、长辈相关行业',
            tianzhai: '房产稳定，有长辈荫庇',
            fude: '内心清高，追求精神',
            fumu: '父母有威望，入庙得荫庇'
        },
        
        suitableCareers: ['长辈', '保护者', '医生', '教育', '宗教'],
        suitablePersonality: ['内敛', '善良', '顺遂人生']
    },
    
    '七杀': {
        element: '庚金',
        attribute: '将星',
        coreTraits: ['冲动', '开创', '冒险', '将星'],
        keywords: ['将星', '冲动', '开创', '冒险'],
        
        luckyTraits: [
            '勇猛果断、开创力强',
            '冒险精神、敢于挑战',
            '领导力强、威望高'
        ],
        
        unluckyTraits: [
            '冲动鲁莽、易招灾祸',
            '过于冒险、损失惨重',
            '刚愎自用、不听劝告'
        ],
        
        palaceMeanings: {
            ming: '勇猛果断，开创力强，冒险精神；落陷冲动鲁莽',
            xiongdi: '兄弟姐妹果断，入庙合作好',
            fuqi: '感情激烈，伴侣果断',
            zinv: '子女有魄力，入庙关系好',
            caibo: '财来自开创、冒险、军警行业',
            jie: '外伤、手术、呼吸系统',
            qianyi: '外出冒险，入庙得贵人',
            pengyou: '朋友果断，入庙得助力',
            shiye: '适合军警、创业、冒险行业',
            tianzhai: '房产来自开创，变动多',
            fude: '内心冲动，追求刺激',
            fumu: '父母果断，入庙得助力'
        },
        
        suitableCareers: ['武将', '创业者', '冒险家', '军警'],
        suitablePersonality: ['果敢', '大起大落', '冒险精神']
    },
    
    '破军': {
        element: '癸水',
        attribute: '耗星',
        coreTraits: ['破坏', '变动', '开创', '消耗'],
        keywords: ['耗星', '破坏', '变动', '改革'],
        
        luckyTraits: [
            '改革开创、破旧立新',
            '变动中求发展、不屈不挠',
            '消耗后重建、浴火重生'
        ],
        
        unluckyTraits: [
            '破坏过度、难以收拾',
            '变动太频、一事无成',
            '消耗过大、元气大伤'
        ],
        
        palaceMeanings: {
            ming: '改革创新，变动中求发展；落陷破坏过度',
            xiongdi: '兄弟姐妹变动多，入庙合作好',
            fuqi: '感情多变动，伴侣有魄力',
            zinv: '子女变动多，入庙关系好',
            caibo: '财来自改革、变动、破坏后重建',
            jie: '消耗性疾病、外伤、手术',
            qianyi: '外出变动多，入庙得发展',
            pengyou: '朋友变动多，入庙得助力',
            shiye: '适合改革、创新、变动行业',
            tianzhai: '房产变动多，破产后重建',
            fude: '内心求变，不甘现状',
            fumu: '父母变动多，入庙得助力'
        },
        
        suitableCareers: ['改革者', '破坏者', '创新者'],
        suitablePersonality: ['果敢', '大起大落', '破坏者']
    }
};

// 核心格局分类
const PATTERN_CATEGORIES = {
    '杀破狼': {
        stars: ['七杀', '破军', '贪狼'],
        traits: ['不安分', '喜欢挑战', '横冲直撞', '生命周期起伏大'],
        suitableFor: {
            career: ['武将', '江湖', '创业者'],
            personality: ['果敢', '大起大落'],
            background: ['平民', '工薪']
        }
    },
    '紫府廉武相': {
        stars: ['紫微', '天府', '廉贞', '武曲', '天相'],
        traits: ['高贵', '谋略', '稳重', '领导力'],
        suitableFor: {
            career: ['政客', '权贵', '管理'],
            personality: ['谋略', '张扬'],
            background: ['富贵', '权贵']
        }
    },
    '机月同梁': {
        stars: ['天机', '太阴', '天同', '天梁'],
        traits: ['温和', '安逸', '心思细密', '安分守己'],
        suitableFor: {
            career: ['文人', '工薪', '服务'],
            personality: ['内敛', '善良'],
            background: ['工薪', '富贵']
        }
    },
    '巨日': {
        stars: ['巨门', '太阳'],
        traits: ['外向', '爽朗', '乐观', '正义感强'],
        suitableFor: {
            career: ['政客', '公众人物', '律师'],
            personality: ['张扬', '正义感强'],
            background: ['富贵', '权贵']
        }
    },
    '命无正曜': {
        stars: [],
        traits: ['主观意识弱', '随波逐流', '易受环境影响'],
        suitableFor: {
            career: ['平民', '工薪'],
            personality: ['被动', '随波逐流'],
            background: ['平民', '工薪']
        }
    }
};

// 六吉星
const SIX_AUSPICIOUS_STARS = ['文昌', '文曲', '左辅', '右弼', '天魁', '天钺'];

// 六煞星
const SIX_MALIGNANT_STARS = ['擎羊', '陀罗', '火星', '铃星', '地空', '地劫'];

// 四化象
const FOUR_TRANSFORMATIONS = {
    化禄: { meaning: '福禄', effect: '财缘、顺利、增加' },
    化权: { meaning: '权力', effect: '掌控、强势、竞争' },
    化科: { meaning: '贵人', effect: '名声、科甲、缓和' },
    化忌: { meaning: '阻碍', effect: '波折、执着、收藏' }
};

// 导出所有数据
window.ZIWEI_STAR_DETAILS = {
    STAR_DETAILS,
    PATTERN_CATEGORIES,
    SIX_AUSPICIOUS_STARS,
    SIX_MALIGNANT_STARS,
    FOUR_TRANSFORMATIONS,
    
    // 辅助函数：获取主星详细信息
    getStarDetails: function(star) {
        return STAR_DETAILS[star] || null;
    },
    
    // 辅助函数：判断命盘属于哪个格局
    getPatternCategory: function(mainStars) {
        // 命无正曜
        if (!mainStars || mainStars.length === 0) {
            return '命无正曜';
        }
        
        // 检查杀破狼
        if (mainStars.some(s => ['七杀', '破军', '贪狼'].includes(s))) {
            return '杀破狼';
        }
        
        // 检查紫府廉武相
        if (mainStars.some(s => ['紫微', '天府', '廉贞', '武曲', '天相'].includes(s))) {
            return '紫府廉武相';
        }
        
        // 检查机月同梁
        if (mainStars.some(s => ['天机', '太阴', '天同', '天梁'].includes(s))) {
            return '机月同梁';
        }
        
        // 检查巨日
        if (mainStars.some(s => ['巨门', '太阳'].includes(s))) {
            return '巨日';
        }
        
        return '其他';
    },
    
    // 辅助函数：获取宫位含义
    getPalaceMeaning: function(star, palace) {
        const starData = STAR_DETAILS[star];
        if (!starData || !starData.palaceMeanings[palace]) {
            return '';
        }
        return starData.palaceMeanings[palace];
    },
    
    // 辅助函数：判断是入庙还是落陷
    isLucky: function(star, luckyStars) {
        if (!luckyStars || luckyStars.length === 0) {
            return '平';
        }
        
        const auspiciousCount = luckyStars.filter(s => SIX_AUSPICIOUS_STARS.includes(s)).length;
        const malignantCount = luckyStars.filter(s => SIX_MALIGNANT_STARS.includes(s)).length;
        
        if (auspiciousCount > malignantCount) {
            return '入庙';
        } else if (malignantCount > auspiciousCount) {
            return '落陷';
        } else {
            return '平';
        }
    }
};
