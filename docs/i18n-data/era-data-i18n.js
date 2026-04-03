/**
 * 紫微斗数时代差异化版本 v2.0
 * 包含三个时代(古代/近代/现代)的完整数据体系
 * 精细时间排盘(时辰+8刻),扩展至576盘(3时代×2性别×12时辰×8刻)
 */

// ==================== 时代定义 ====================

const ERAS = {
    ANCIENT: {
        name: '古代',
        code: 'ancient',
        desc: '明清以前,以农业社会为主,科举制度,封建等级',
        timeRange: '1840年以前',
        characteristics: [
            '科举仕途为最高追求',
            '官本位思想浓厚',
            '家族宗族制度严格',
            '农业生产为主',
            '手工业和商业地位较低'
        ]
    },
    MODERN: {
        name: '近代',
        code: 'modern',
        desc: '1840-1949年,西学东渐,社会转型,新旧交替',
        timeRange: '1840-1949年',
        characteristics: [
            '科举废除,新式教育兴起',
            '西方文化传入,思想解放',
            '工商业开始发展',
            '传统与现代并存',
            '军阀混战,社会动荡'
        ]
    },
    CONTEMPORARY: {
        name: '现代',
        code: 'contemporary',
        desc: '1949年至今,工业化、信息化、全球化',
        timeRange: '1949年至今',
        characteristics: [
            '市场经济主导',
            '教育普及,职业多元化',
            '互联网时代,信息爆炸',
            '全球化竞争',
            '创新创业成为主流'
        ]
    }
};

// ==================== 职业体系(三个时代) ====================

const CAREERS = {
    ANCIENT: [
        {
            id: 'ancient_official',
            name: '仕途官宦',
            description: '科举出身,从县令到丞相,追求功名利禄',
            socialStatus: '高',
            income: '高',
            examples: ['县令', '知府', '尚书', '丞相', '御史', '翰林', '状元', '榜眼'],
            requirements: ['科举及第', '出身清白', '有文采', '有功名']
        },
        {
            id: 'ancient_merchant',
            name: '商贾富豪',
            description: '商人地主,经营盐铁丝绸,富甲一方',
            socialStatus: '中低',
            income: '极高',
            examples: ['盐商', '丝绸商人', '钱庄主', '票号掌柜', '富商大贾', '地主'],
            requirements: ['经商头脑', '本钱', '门路', '运气']
        },
        {
            id: 'ancient_scholar',
            name: '文人学者',
            description: '读书人,诗词文章,教书育人',
            socialStatus: '中',
            income: '中低',
            examples: ['教书先生', '私塾老师', '诗人', '书法家', '画家', '琴师'],
            requirements: ['学问深厚', '文采斐然', '品德高尚', '有名声']
        },
        {
            id: 'ancient_military',
            name: '军武将帅',
            description: '武举出身,驻守边疆,征战沙场',
            socialStatus: '中',
            income: '中',
            examples: ['武将', '守将', '将军', '统帅', '武官', '捕头'],
            requirements: ['武艺高强', '有胆识', '忠诚', '有战功']
        },
        {
            id: 'ancient_commoner',
            name: '平民百姓',
            description: '农民手工业者,日出而作,日落而息',
            socialStatus: '低',
            income: '低',
            examples: ['农民', '手工艺人', '铁匠', '木匠', '织布工', '渔民'],
            requirements: ['勤劳肯干', '身体好', '有手艺', '吃苦耐劳']
        },
        {
            id: 'ancient_noble',
            name: '权贵世家',
            description: '公侯伯子男,世袭爵位,权倾朝野',
            socialStatus: '极高',
            income: '极高',
            examples: ['王爷', '侯爷', '伯爷', '世袭伯爵', '尚书公子'],
            requirements: ['出身显赫', '世袭爵位', '有人脉', '有功勋']
        },
        {
            id: 'ancient_jianghu',
            name: '江湖人士',
            description: '游侠镖师,武林高手,行走江湖',
            socialStatus: '中低',
            income: '中低',
            examples: ['游侠', '镖师', '武林高手', '郎中', '算命先生', '道士'],
            requirements: ['武艺高强', '有过人之处', '江湖经验', '有道义']
        },
        {
            id: 'ancient_religious',
            name: '宗教人士',
            description: '僧人道士,寺院主持,清修佛法',
            socialStatus: '中',
            income: '中低',
            examples: ['方丈', '住持', '高僧', '道士', '卦师', '堪舆师'],
            requirements: ['信仰虔诚', '有法力', '有名声', '清心寡欲']
        }
    ],

    MODERN: [
        {
            id: 'modern_official',
            name: '政府官员',
            description: '民国政府任职,从科员到部长',
            socialStatus: '高',
            income: '中高',
            examples: ['县长', '市长', '厅长', '部长', '科长', '科员'],
            requirements: ['新式教育', '有背景', '有能力', '有人脉']
        },
        {
            id: 'modern_business',
            name: '实业家',
            description: '创办实业,开工厂,做外贸,买办',
            socialStatus: '中高',
            income: '极高',
            examples: ['工厂主', '买办', '外贸商人', '银行家', '实业家'],
            requirements: ['有本钱', '有眼光', '有背景', '有胆识']
        },
        {
            id: 'modern_intellectual',
            name: '新式学者',
            description: '留学归国,大学教授,报刊编辑',
            socialStatus: '中高',
            income: '中',
            examples: ['大学教授', '记者', '编辑', '作家', '翻译', '律师'],
            requirements: ['新式教育', '有才华', '有见识', '有名声']
        },
        {
            id: 'modern_military',
            name: '军政要员',
            description: '军官出身,军阀混战,民国将领',
            socialStatus: '高',
            income: '中高',
            examples: ['将军', '师长', '旅长', '团长', '军官'],
            requirements: ['军校出身', '有战功', '有实力', '有靠山']
        },
        {
            id: 'modern_worker',
            name: '工人店员',
            description: '工厂工人,商店店员,码头苦力',
            socialStatus: '中低',
            income: '低',
            examples: ['工厂工人', '码头工人', '店员', '人力车夫', '纺织女工'],
            requirements: ['身体好', '能吃苦', '有力气', '听指挥']
        },
        {
            id: 'modern_old_noble',
            name: '旧贵族',
            description: '清朝遗老,世袭爵位,没落贵族',
            socialStatus: '中高',
            income: '中',
            examples: ['亲王', '贝勒', '贝子', '格格', '满洲贵族', '遗老遗少'],
            requirements: ['世袭爵位', '有祖产', '有名气', '有人脉']
        },
        {
            id: 'modern_underground',
            name: '江湖人士',
            description: '帮会成员,地下组织,土匪流寇',
            socialStatus: '低',
            income: '中低',
            examples: ['帮会成员', '青帮', '土匪', '流寇', '地下工作者'],
            requirements: ['有胆量', '有手段', '有人', '讲义气']
        },
        {
            id: 'modern_religious',
            name: '宗教人物',
            description: '寺院僧人,道教高士,天主教神父',
            socialStatus: '中',
            income: '中低',
            examples: ['方丈', '高僧', '道士', '神父', '牧师'],
            requirements: ['有信仰', '有学识', '有名声', '有德行']
        }
    ],

    CONTEMPORARY: [
        {
            id: 'contemporary_manager',
            name: '企业管理',
            description: '公司高管,职业经理人,创业者',
            socialStatus: '高',
            income: '极高',
            examples: ['CEO', '总经理', '副总', '部门总监', '创业者'],
            requirements: ['管理能力', '领导力', '商业头脑', '教育背景']
        },
        {
            id: 'contemporary_tech',
            name: '科技人才',
            description: '程序员,工程师,技术专家',
            socialStatus: '中高',
            income: '高',
            examples: ['程序员', '算法工程师', '产品经理', '架构师', '技术专家'],
            requirements: ['技术能力', '学习能力', '逻辑思维', '创新精神']
        },
        {
            id: 'contemporary_professional',
            name: '专业人士',
            description: '医生律师会计金融,高端服务行业',
            socialStatus: '高',
            income: '高',
            examples: ['医生', '律师', '会计师', '金融分析师', '投资顾问'],
            requirements: ['专业资质', '专业知识', '服务精神', '沟通能力']
        },
        {
            id: 'contemporary_creative',
            name: '创意产业',
            description: '设计师,自媒体,艺人,创意工作者',
            socialStatus: '中',
            income: '中高',
            examples: ['设计师', '编剧', '导演', '自媒体人', '演员', '歌手'],
            requirements: ['创意能力', '审美能力', '表现力', '个人品牌']
        },
        {
            id: 'contemporary_civil_servant',
            name: '公务员',
            description: '政府机关,事业单位,国企编制',
            socialStatus: '高',
            income: '中',
            examples: ['公务员', '事业单位人员', '国企员工', '政府官员'],
            requirements: ['考试通过', '政治正确', '稳定可靠', '有学历']
        },
        {
            id: 'contemporary_business',
            name: '商业贸易',
            description: '企业家,商人,销售,电商',
            socialStatus: '中高',
            income: '高',
            examples: ['企业家', '商人', '销售主管', '电商老板', '微商'],
            requirements: ['商业头脑', '资源整合', '人脉网络', '市场洞察']
        },
        {
            id: 'contemporary_freelancer',
            name: '自由职业',
            description: '自由撰稿人,独立开发者,咨询顾问',
            socialStatus: '中',
            income: '中高',
            examples: ['自由撰稿人', '独立开发者', '咨询顾问', '翻译', '培训师'],
            requirements: ['专业技能', '自律能力', '时间管理', '客户资源']
        },
        {
            id: 'contemporary_worker',
            name: '普通劳动者',
            description: '快递员,外卖员,工人,服务业',
            socialStatus: '中低',
            income: '中低',
            examples: ['快递员', '外卖员', '工人', '服务员', '司机'],
            requirements: ['体力好', '吃苦耐劳', '服务意识', '守时']
        }
    ]
};

// ==================== 家庭背景体系(三个时代) ====================

const FAMILY_BACKGROUNDS = {
    ANCIENT: [
        {
            id: 'ancient_imperial',
            name: '皇室宗亲',
            description: '皇亲国戚,爵位显赫,权倾朝野',
            characteristics: ['世袭爵位', '有权有势', '婚姻政治联姻', '家规森严']
        },
        {
            id: 'ancient_official',
            name: '官宦世家',
            description: '书香门第,世代为官,家风严谨',
            characteristics: ['科举出身', '有功名', '家教严格', '重视教育']
        },
        {
            id: 'ancient_merchant',
            name: '富商巨贾',
            description: '家财万贯,富甲一方,注重门面',
            characteristics: ['家财丰厚', '社会地位不高', '重视商业', '买官求荣']
        },
        {
            id: 'ancient_gentry',
            name: '乡绅地主',
            description: '地方豪强,有田有地,乡里望族',
            characteristics: ['拥有田地', '在乡里有威望', '租佃经营', '宗族势力']
        },
        {
            id: 'ancient_peasant',
            name: '贫寒农家',
            description: '自耕农或佃户,勤劳朴实,日出而作',
            characteristics: ['土地有限', '经济拮据', '勤劳质朴', '生活艰辛']
        },
        {
            id: 'ancient_merchant_family',
            name: '小商小贩',
            description: '做小生意,勉强度日,流动性大',
            characteristics: ['本钱小', '收入不稳定', '社会地位低', '四处奔波']
        },
        {
            id: 'ancient_orphan',
            name: '孤苦伶仃',
            description: '父母双亡,亲戚疏远,自力更生',
            characteristics: ['无亲无故', '生活困苦', '早熟懂事', '命运坎坷']
        },
        {
            id: 'ancient_servant',
            name: '家仆下人',
            description: '大户人家佣人,依附主人,地位低下',
            characteristics: ['依附主人', '地位低下', '收入微薄', '无自由']
        }
    ],

    MODERN: [
        {
            id: 'modern_government',
            name: '官宦家庭',
            description: '民国政府官员,有权有势,地位显赫',
            characteristics: ['政府任职', '有势力', '重视教育', '社交活跃']
        },
        {
            id: 'modern_industrialist',
            name: '实业世家',
            description: '办工厂开企业,家财万贯,影响力大',
            characteristics: ['家财丰厚', '有企业', '重视经营', '西方影响']
        },
        {
            id: 'modern_old_money',
            name: '旧贵族',
            description: '清朝遗老,世袭爵位,家道中落',
            characteristics: ['世袭爵位', '家道中落', '讲究排场', '思想保守']
        },
        {
            id: 'modern_scholar',
            name: '知识分子',
            description: '大学教授,文人学者,思想进步',
            characteristics: ['新式教育', '有学问', '思想开放', '重视精神']
        },
        {
            id: 'modern_middle_class',
            name: '小康之家',
            description: '中产阶级,稳定收入,生活体面',
            characteristics: ['收入稳定', '生活体面', '重视教育', '小资情调']
        },
        {
            id: 'modern_worker',
            name: '工人家庭',
            description: '工厂工人,收入微薄,生活艰辛',
            characteristics: ['工资低', '工作辛苦', '收入不稳定', '生活艰难']
        },
        {
            id: 'modern_orphan',
            name: '乱世孤儿',
            description: '战乱失去亲人,流离失所,命运多舛',
            characteristics: ['无依无靠', '生活困苦', '早熟懂事', '命运坎坷']
        },
        {
            id: 'modern_refugee',
            name: '流亡难民',
            description: '战乱逃难,背井离乡,居无定所',
            characteristics: ['背井离乡', '居无定所', '生活困苦', '颠沛流离']
        }
    ],

    CONTEMPORARY: [
        {
            id: 'contemporary_rich',
            name: '富裕家庭',
            description: '企业高管,成功商人,家财万贯',
            characteristics: ['家财丰厚', '社会地位高', '重视教育', '生活优越']
        },
        {
            id: 'contemporary_official',
            name: '官宦家庭',
            description: '政府官员,事业单位,权力在握',
            characteristics: ['有权力', '社会地位高', '重视稳定', '资源丰富']
        },
        {
            id: 'contemporary_middle_class',
            name: '中产家庭',
            description: '城市白领,专业人士,生活稳定',
            characteristics: ['收入稳定', '生活体面', '重视教育', '有房贷']
        },
        {
            id: 'contemporary_urban_poor',
            name: '城市贫民',
            description: '农民工,底层劳动者,收入微薄',
            characteristics: ['收入低', '工作辛苦', '生活困难', '流动性大']
        },
        {
            id: 'contemporary_rural',
            name: '农村家庭',
            description: '农民家庭,土地有限,勤劳朴实',
            characteristics: ['有土地', '收入有限', '勤劳朴实', '重视家庭']
        },
        {
            id: 'contemporary_single_parent',
            name: '单亲家庭',
            description: '父母离异或一方去世,由单方抚养',
            characteristics: ['家庭不完整', '经济压力', '早熟懂事', '敏感独立']
        },
        {
            id: 'contemporary_orphan',
            name: '孤儿',
            description: '父母双亡,由亲戚或福利院抚养',
            characteristics: ['无父母', '生活困苦', '早熟懂事', '命运坎坷']
        },
        {
            id: 'contemporary_immigrant',
            name: '外来家庭',
            description: '外来务工人员,流动人口,立足未稳',
            characteristics: ['外来人口', '流动性大', '收入不稳定', '融入困难']
        }
    ]
};

// ==================== 人生经历体系(三个时代) ====================

const LIFE_EXPERIENCES = {
    ANCIENT: [
        {
            id: 'ancient_smooth',
            name: '一帆风顺',
            description: '家境优渥,科举及第,仕途亨通,人生圆满',
            characteristics: ['家境好', '科举成功', '仕途顺利', '家庭幸福']
        },
        {
            id: 'ancient_hardship',
            name: '历经磨难',
            description: '少年贫苦,科举落榜,屡战屡败,终成大器',
            characteristics: ['出身贫寒', '多次失败', '坚持不懈', '终获成功']
        },
        {
            id: 'ancient_ups_downs',
            name: '大起大落',
            description: '官场沉浮,时起时落,几起几落,命运多舛',
            characteristics: ['事业起伏', '几起几落', '命运多舛', '终归平淡']
        },
        {
            id: 'ancient_adventure',
            name: '闯荡江湖',
            description: '离开家乡,四处游历,闯荡江湖,见多识广',
            characteristics: ['离家出走', '四处漂泊', '见多识广', '经历丰富']
        },
        {
            id: 'ancient_war',
            name: '战乱流离',
            description: '遭遇战乱,背井离乡,颠沛流离,命运坎坷',
            characteristics: ['遭遇战乱', '背井离乡', '颠沛流离', '命运坎坷']
        },
        {
            id: 'ancient_recluse',
            name: '隐居山林',
            description: '看破红尘,隐居山林,不问世事,清修自得',
            characteristics: ['看破红尘', '隐居山林', '不问世事', '清修自得']
        },
        {
            id: 'ancient_rebellion',
            name: '起义造反',
            description: '不满现状,起义造反,征战四方,成败难料',
            characteristics: ['不满现状', '起义造反', '征战四方', '成败难料']
        },
        {
            id: 'ancient_examination',
            name: '屡试不中',
            description: '科举落榜,屡试不中,终老林泉,一事无成',
            characteristics: ['科举失败', '屡试不中', '终老林泉', '一事无成']
        },
        {
            id: 'ancient_exile',
            name: '贬谪边疆',
            description: '得罪权贵,被贬边疆,谪居他乡,郁郁不得志',
            characteristics: ['得罪权贵', '被贬边疆', '谪居他乡', '郁郁不得志']
        },
        {
            id: 'ancient_successor',
            name: '继承家业',
            description: '家族兴旺,继承家业,发扬光大,光宗耀祖',
            characteristics: ['家族兴旺', '继承家业', '发扬光大', '光宗耀祖']
        }
    ],

    MODERN: [
        {
            id: 'modern_smooth',
            name: '顺遂发展',
            description: '新式教育,留学海外,事业有成,人生圆满',
            characteristics: ['新式教育', '留学海外', '事业有成', '人生圆满']
        },
        {
            id: 'modern_hardship',
            name: '艰难奋斗',
            description: '家境贫寒,半工半读,白手起家,终获成功',
            characteristics: ['家境贫寒', '半工半读', '白手起家', '终获成功']
        },
        {
            id: 'modern_war',
            name: '战乱年代',
            description: '军阀混战,社会动荡,颠沛流离,命运多舛',
            characteristics: ['军阀混战', '社会动荡', '颠沛流离', '命运多舛']
        },
        {
            id: 'modern_revolution',
            name: '投身革命',
            description: '思想进步,投身革命,投身救国,生死未卜',
            characteristics: ['思想进步', '投身革命', '投身救国', '生死未卜']
        },
        {
            id: 'modern_business',
            name: '创业经商',
            description: '下海经商,创业致富,实业救国,报效国家',
            characteristics: ['下海经商', '创业致富', '实业救国', '报效国家']
        },
        {
            id: 'modern_cultural',
            name: '文化运动',
            description: '新文化运动,思想启蒙,著书立说,影响深远',
            characteristics: ['新文化运动', '思想启蒙', '著书立说', '影响深远']
        },
        {
            id: 'modern_war_refugee',
            name: '战争难民',
            description: '抗日战争,流离失所,家破人亡,命运悲惨',
            characteristics: ['抗日战争', '流离失所', '家破人亡', '命运悲惨']
        },
        {
            id: 'modern_landlord',
            name: '地主家庭',
            description: '拥有土地,租佃经营,土地改革,家道中落',
            characteristics: ['拥有土地', '租佃经营', '土地改革', '家道中落']
        },
        {
            id: 'modern_worker',
            name: '工人运动',
            description: '工厂工人,参加罢工,追求进步,团结抗争',
            characteristics: ['工厂工人', '参加罢工', '追求进步', '团结抗争']
        },
        {
            id: 'modern_intellectual',
            name: '知识救国',
            description: '知识分子,科学救国,教育救国,培育英才',
            characteristics: ['知识分子', '科学救国', '教育救国', '培育英才']
        }
    ],

    CONTEMPORARY: [
        {
            id: 'contemporary_elite',
            name: '人生赢家',
            description: '名校毕业,进入名企,快速晋升,事业成功',
            characteristics: ['名校毕业', '进入名企', '快速晋升', '事业成功']
        },
        {
            id: 'contemporary_struggle',
            name: '奋斗打拼',
            description: '农村出身,进城务工,努力奋斗,改变命运',
            characteristics: ['农村出身', '进城务工', '努力奋斗', '改变命运']
        },
        {
            id: 'contemporary_startup',
            name: '创业梦想',
            description: '辞职创业,经历失败,最终成功,实现梦想',
            characteristics: ['辞职创业', '经历失败', '最终成功', '实现梦想']
        },
        {
            id: 'contemporary_burnout',
            name: '职场内卷',
            description: '996工作,高压生活,身心俱疲,迷失方向',
            characteristics: ['996工作', '高压生活', '身心俱疲', '迷失方向']
        },
        {
            id: 'contemporary_freelance',
            name: '自由职业',
            description: '不想上班,自由职业,收入不稳定,追求自由',
            characteristics: ['不想上班', '自由职业', '收入不稳定', '追求自由']
        },
        {
            id: 'contemporary_internet',
            name: '互联网时代',
            description: '互联网从业者,程序员,快速变化,技术迭代',
            characteristics: ['互联网从业者', '程序员', '快速变化', '技术迭代']
        },
        {
            id: 'contemporary_layoff',
            name: '失业危机',
            description: '中年失业,家庭负担,重新开始,困难重重',
            characteristics: ['中年失业', '家庭负担', '重新开始', '困难重重']
        },
        {
            id: 'contemporary_divorce',
            name: '离婚重建',
            description: '婚姻失败,离婚重建,重新开始,寻找幸福',
            characteristics: ['婚姻失败', '离婚重建', '重新开始', '寻找幸福']
        },
        {
            id: 'contemporary_career_change',
            name: '职业转型',
            description: '工作不顺,职业转型,学习新技能,重新出发',
            characteristics: ['工作不顺', '职业转型', '学习新技能', '重新出发']
        },
        {
            id: 'contemporary_succession',
            name: '二代接班',
            description: '富二代,官二代,接班家族,压力巨大',
            characteristics: ['富二代', '官二代', '接班家族', '压力巨大']
        }
    ]
};

// ==================== 时间刻度体系(精细排盘) ====================

// 十二时辰定义
const TIME_PERIODS = [
    { name: '子时', hours: [23, 0], desc: '23:00-01:00' },
    { name: '丑时', hours: [1, 2], desc: '01:00-03:00' },
    { name: '寅时', hours: [3, 4], desc: '03:00-05:00' },
    { name: '卯时', hours: [5, 6], desc: '05:00-07:00' },
    { name: '辰时', hours: [7, 8], desc: '07:00-09:00' },
    { name: '巳时', hours: [9, 10], desc: '09:00-11:00' },
    { name: '午时', hours: [11, 12], desc: '11:00-13:00' },
    { name: '未时', hours: [13, 14], desc: '13:00-15:00' },
    { name: '申时', hours: [15, 16], desc: '15:00-17:00' },
    { name: '酉时', hours: [17, 18], desc: '17:00-19:00' },
    { name: '戌时', hours: [19, 20], desc: '19:00-21:00' },
    { name: '亥时', hours: [21, 22], desc: '21:00-23:00' }
];

// 每个时辰的8刻划分
const TIME_KE_CUTS = [
    { name: '初刻', range: '前15分钟', code: 'chu' },
    { name: '二刻', range: '15-30分钟', code: 'er' },
    { name: '三刻', range: '30-45分钟', code: 'san' },
    { name: '四刻', range: '45-60分钟', code: 'si' },
    { name: '初正', range: '60-75分钟', code: 'chuzheng' },
    { name: '正二刻', range: '75-90分钟', code: 'zhenger' },
    { name: '正三刻', range: '90-105分钟', code: 'zhengsan' },
    { name: '末刻', range: '105-120分钟', code: 'mo' }
];

// 导出所有数据（浏览器兼容格式）
if (typeof window !== 'undefined') {
    window.ERAS = ERAS;
    window.CAREERS = CAREERS;
    window.FAMILY_BACKGROUNDS = FAMILY_BACKGROUNDS;
    window.LIFE_EXPERIENCES = LIFE_EXPERIENCES;
    window.TIME_PERIODS = TIME_PERIODS;
    window.TIME_KE_CUTS = TIME_KE_CUTS;
}
