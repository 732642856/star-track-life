/**
 * 144种命盘格局详解数据库
 * 基于紫微斗数角色设计skill的chart_patterns.md
 */

var CHART_PATTERNS = {
    // 杀破狼格局系列
    '七杀独坐': {
        category: '杀破狼',
        description: '勇猛无比，将星特质最明显',
        suitableRoles: ['武将', '军人', '警察', '冒险家'],
        lifeCurve: '大起大落，30岁前多磨练',
        traits: ['勇猛果断', '开创力强', '冒险精神', '威望高'],
        earlyLife: '少年磨砺，性格刚强',
        middleLife: '中年事业有成，声望建立',
        lateLife: '晚年功成身退，受人尊敬'
    },
    '破军独坐': {
        category: '杀破狼',
        description: '破坏开创，变动中求发展',
        suitableRoles: ['改革者', '创业者', '革命家'],
        lifeCurve: '先破后立，消耗后重建',
        traits: ['改革创新', '变动求发展', '不屈不挠', '浴火重生'],
        earlyLife: '少年不安分，喜欢挑战',
        middleLife: '中年破旧立新，经历变革',
        lateLife: '晚年稳定，成就事业'
    },
    '贪狼独坐': {
        category: '杀破狼',
        description: '多才多艺，欲望强烈，桃花旺',
        suitableRoles: ['艺人', '公关', '销售', '艺术家'],
        lifeCurve: '欲望驱动，交际中求发展',
        traits: ['多才多艺', '交际手腕高明', '欲望强烈', '桃花旺'],
        earlyLife: '少年才艺出众，受人瞩目',
        middleLife: '中年交际广泛，人脉深厚',
        lateLife: '晚年享受名声，生活富足'
    },
    '七杀破军': {
        category: '杀破狼',
        description: '开创力最强，冲动冒险',
        suitableRoles: ['军事家', '冒险家', '极限运动员'],
        lifeCurve: '极端起伏，成败分明',
        traits: ['勇猛果断', '开创力强', '冒险精神', '冲动冒险'],
        earlyLife: '少年叛逆，挑战传统',
        middleLife: '中年冒险开拓，大起大落',
        lateLife: '晚年功成或一败涂地，成败分明'
    },
    '七杀贪狼': {
        category: '杀破狼',
        description: '勇猛加欲望，冒险求财',
        suitableRoles: ['商人', '投资人', '探险家'],
        lifeCurve: '冒险求财，大起大落',
        traits: ['勇猛果断', '欲望强烈', '冒险精神', '财缘佳'],
        earlyLife: '少年财商高，敢想敢做',
        middleLife: '中年冒险求财，财务起伏',
        lateLife: '晚年财务稳定或破产，贫富分明'
    },
    '破军贪狼': {
        category: '杀破狼',
        description: '变动加欲望，创新求变',
        suitableRoles: ['艺术家', '设计师', '改革者'],
        lifeCurve: '变动中求发展，不稳定',
        traits: ['改革创新', '多才多艺', '欲望强烈', '变动求发展'],
        earlyLife: '少年思维活跃，喜欢新潮',
        middleLife: '中年改革创新，事业变动',
        lateLife: '晚年稳定或持续变革'
    },
    
    // 紫府廉武相格局系列
    '紫微独坐': {
        category: '紫府廉武相',
        description: '孤君，凡事亲力亲为，无法成就大事业',
        suitableRoles: ['技术专家', '独立工作者'],
        lifeCurve: '单打独斗，成就有限',
        traits: ['孤傲', '亲力亲为', '高傲', '单打独斗'],
        earlyLife: '少年独立，不依赖他人',
        middleLife: '中年专业能力强，但人脉有限',
        lateLife: '晚年技术精湛，但成就有限'
    },
    '君臣庆会格': {
        category: '紫府廉武相',
        description: '既有个人能力又有统御力，雄才大略',
        suitableRoles: ['领导', '老板', '权贵'],
        lifeCurve: '富贵显达，成就非凡',
        traits: ['雄才大略', '统御力强', '领导力', '富贵显达'],
        earlyLife: '少年聪慧，有领导潜质',
        middleLife: '中年事业有成，身居要职',
        lateLife: '晚年功成名就，受人尊敬'
    },
    '天府独坐': {
        category: '紫府廉武相',
        description: '稳重保守，善于守成',
        suitableRoles: ['管理者', '财务', '守成者'],
        lifeCurve: '平稳发展，守成有余',
        traits: ['稳重保守', '善于守成', '财库丰盈', '包容力强'],
        earlyLife: '少年稳重，不喜冒险',
        middleLife: '中年稳健发展，积蓄丰厚',
        lateLife: '晚年守成有余，生活稳定'
    },
    '廉贞独坐': {
        category: '紫府廉武相',
        description: '复杂好胜，次桃花',
        suitableRoles: ['艺术家', '复杂性格人物'],
        lifeCurve: '复杂多变，艺术成就',
        traits: ['复杂好胜', '次桃花', '有创意', '好胜好辩'],
        earlyLife: '少年敏感，喜欢艺术',
        middleLife: '中年复杂多变，艺术成熟',
        lateLife: '晚年艺术成就，性格独特'
    },
    '武曲独坐': {
        category: '紫府廉武相',
        description: '财星，果断刚毅',
        suitableRoles: ['商人', '实干家', '军警'],
        lifeCurve: '财运起伏，实干成就',
        traits: ['财星', '果断刚毅', '务实重财', '执行力强'],
        earlyLife: '少年务实，财商高',
        middleLife: '中年财运起伏，实干成就',
        lateLife: '晚年财务稳定，事业有成'
    },
    '天相独坐': {
        category: '紫府廉武相',
        description: '印星，谨慎服务',
        suitableRoles: ['公务员', '幕僚', '协调者'],
        lifeCurve: '稳定发展，服务他人',
        traits: ['谨慎细心', '服务周到', '协调能力强', '重视信用'],
        earlyLife: '少年谨慎，守规矩',
        middleLife: '中年稳定发展，服务他人',
        lateLife: '晚年受人尊敬，生活安稳'
    },
    '紫微天府': {
        category: '紫府廉武相',
        description: '帝星加财库，既有权力又有财富',
        suitableRoles: ['权贵', '大企业家'],
        lifeCurve: '富贵双全，成就极高',
        traits: ['权力与财富并存', '统御力强', '财库丰盈', '雄才大略'],
        earlyLife: '少年富贵，地位尊崇',
        middleLife: '中年权倾一方，财富丰厚',
        lateLife: '晚年功成名就，享受富贵'
    },
    '紫微贪狼': {
        category: '紫府廉武相',
        description: '帝星加桃花，欲望强烈',
        suitableRoles: ['演艺界大佬', '社交名流'],
        lifeCurve: '名利双收，桃花纠纷',
        traits: ['权力加桃花', '欲望强烈', '交际广泛', '名气旺'],
        earlyLife: '少年出众，受人瞩目',
        middleLife: '中年名利双收，桃花纠纷',
        lateLife: '晚年名声显赫，但情感复杂'
    },
    '紫微天相': {
        category: '紫府廉武相',
        description: '帝星加印星，谨慎领导',
        suitableRoles: ['政府官员', '企业高管'],
        lifeCurve: '稳步上升，守成有余',
        traits: ['权力加谨慎', '领导力强', '谨慎细心', '稳步上升'],
        earlyLife: '少年谨慎，有领导潜质',
        middleLife: '中年稳步上升，身居要职',
        lateLife: '晚年功成身退，受人尊敬'
    },
    
    // 机月同梁格局系列
    '天机独坐': {
        category: '机月同梁',
        description: '聪明机智，谋士之相',
        suitableRoles: ['谋士', '策划', '助理'],
        lifeCurve: '平稳发展，智力成就',
        traits: ['聪明机智', '善于策划', '灵活变动', '智慧'],
        earlyLife: '少年聪慧，学习能力强',
        middleLife: '中年智力成就，事业稳定',
        lateLife: '晚年智囊角色，受人尊重'
    },
    '太阴独坐': {
        category: '机月同梁',
        description: '温柔内敛，母性特质',
        suitableRoles: ['女性角色', '理财者', '艺术'],
        lifeCurve: '温柔平稳，情感丰富',
        traits: ['温柔内敛', '母性', '财帛', '重感情'],
        earlyLife: '少年温柔，感情细腻',
        middleLife: '中年情感丰富，财运平稳',
        lateLife: '晚年家庭和睦，享受生活'
    },
    '天同独坐': {
        category: '机月同梁',
        description: '福气深厚，温和享乐',
        suitableRoles: ['艺术家', '享受型人物'],
        lifeCurve: '平稳幸福，知足常乐',
        traits: ['福气深厚', '温和善良', '享乐', '知足常乐'],
        earlyLife: '少年福运好，生活顺遂',
        middleLife: '中年享受生活，事业平稳',
        lateLife: '晚年知足常乐，享受福气'
    },
    '天梁独坐': {
        category: '机月同梁',
        description: '清高正直，长辈风范',
        suitableRoles: ['长辈', '保护者', '医生'],
        lifeCurve: '稳定发展，受人尊重',
        traits: ['清高正直', '荫星', '解厄', '保护欲强'],
        earlyLife: '少年正直，受人爱护',
        middleLife: '中年受人尊重，事业稳定',
        lateLife: '晚年威望高，受人尊敬'
    },
    
    // 巨日格局系列
    '巨门独坐': {
        category: '巨日',
        description: '口才好，研究能力强',
        suitableRoles: ['律师', '记者', '学者'],
        lifeCurve: '是非分明，学术成就',
        traits: ['口才好', '研究能力强', '是非分明', '正义感强'],
        earlyLife: '少年口才好，思维活跃',
        middleLife: '中年学术成就，是非分明',
        lateLife: '晚年受人尊敬，学问深厚'
    },
    '太阳独坐': {
        category: '巨日',
        description: '光明磊落，公众人物',
        suitableRoles: ['政客', '公众人物', '理想主义者'],
        lifeCurve: '光明正大，名声显赫',
        traits: ['光明磊落', '博爱', '正义感强', '公众关注'],
        earlyLife: '少年热情，受人瞩目',
        middleLife: '中年名声显赫，事业有成',
        lateLife: '晚年德高望重，受人尊敬'
    },
    '巨门太阳': {
        category: '巨日',
        description: '口才加光明，正义感最强',
        suitableRoles: ['律师', '政客', '公众人物'],
        lifeCurve: '正义之路，名声显赫',
        traits: ['口才加光明', '正义感最强', '是非分明', '名声显赫'],
        earlyLife: '少年正义感强，口才出众',
        middleLife: '中年名声显赫，事业有成',
        lateLife: '晚年德高望重，受人尊敬'
    },
    
    // 命无正曜
    '命无正曜': {
        category: '命无正曜',
        description: '主观意识弱，随波逐流',
        suitableRoles: ['平民', '工薪', '配角'],
        lifeCurve: '被动发展，随波逐流',
        traits: ['主观意识弱', '随波逐流', '易受影响', '被动'],
        earlyLife: '少年缺乏主见，随大流',
        middleLife: '中年被动发展，受环境影响',
        lateLife: '晚年平淡无奇，随遇而安'
    }
};

// 格局到人生节点的映射
const LIFE_NODES_BY_PATTERN = {
    '杀破狼': {
        childhood: {
            event: '少年磨砺',
            description: '少年时期经历磨练，性格刚强，喜欢挑战传统',
            traits: ['叛逆', '挑战性', '不安分']
        },
        youth: {
            event: '青年冒险',
            description: '青年时期大胆冒险，敢于开创，经历大起大落',
            traits: ['冒险', '开创', '冲动']
        },
        middle: {
            event: '中年转折',
            description: '中年时期事业转折，成败分明，要么一飞冲天，要么一败涂地',
            traits: ['成败', '转折', '起伏']
        },
        late: {
            event: '晚年归宿',
            description: '晚年时期功成身退或一败涂地，人生轨迹分明',
            traits: ['归宿', '结果', '成败']
        }
    },
    '紫府廉武相': {
        childhood: {
            event: '少年聪慧',
            description: '少年时期聪慧过人，有领导潜质，家世可能不错',
            traits: ['聪慧', '有潜质', '家世好']
        },
        youth: {
            event: '青年发展',
            description: '青年时期稳步发展，事业基础扎实，贵人相助',
            traits: ['发展', '贵人', '基础']
        },
        middle: {
            event: '中年成就',
            description: '中年时期事业有成，身居要职，权力或财富丰厚',
            traits: ['成就', '权力', '财富']
        },
        late: {
            event: '晚年尊崇',
            description: '晚年时期功成名就，受人尊敬，享受富贵',
            traits: ['尊崇', '富贵', '享受']
        }
    },
    '机月同梁': {
        childhood: {
            event: '少年温和',
            description: '少年时期性格温和，学习能力强，家庭氛围好',
            traits: ['温和', '学习', '家庭']
        },
        youth: {
            event: '青年稳定',
            description: '青年时期事业稳定，适合文职工作，人际关系好',
            traits: ['稳定', '文职', '人缘']
        },
        middle: {
            event: '中年平稳',
            description: '中年时期事业平稳，家庭和睦，享受安稳生活',
            traits: ['平稳', '和睦', '安稳']
        },
        late: {
            event: '晚年安乐',
            description: '晚年时期家庭和睦，享受天伦之乐，生活安乐',
            traits: ['安乐', '和睦', '享受']
        }
    },
    '巨日': {
        childhood: {
            event: '少年正义',
            description: '少年时期正义感强，口才好，受人瞩目',
            traits: ['正义', '口才', '瞩目']
        },
        youth: {
            event: '青年成长',
            description: '青年时期事业成长，名声渐起，关注度高',
            traits: ['成长', '名声', '关注']
        },
        middle: {
            event: '中年显赫',
            description: '中年时期名声显赫，事业有成，公众关注',
            traits: ['显赫', '名声', '公众']
        },
        late: {
            event: '晚年德望',
            description: '晚年时期德高望重，受人尊敬，影响力持续',
            traits: ['德望', '尊敬', '影响']
        }
    },
    '命无正曜': {
        childhood: {
            event: '少年随波',
            description: '少年时期缺乏主见，随波逐流，受环境影响',
            traits: ['被动', '随波', '影响']
        },
        youth: {
            event: '青年顺从',
            description: '青年时期被动发展，顺从环境，缺乏主动性',
            traits: ['被动', '顺从', '缺乏']
        },
        middle: {
            event: '中年平淡',
            description: '中年时期生活平淡，无大起大落，安稳但无成就',
            traits: ['平淡', '安稳', '无成就']
        },
        late: {
            event: '晚年随遇',
            description: '晚年时期随遇而安，平淡无奇，平静生活',
            traits: ['随遇', '平淡', '平静']
        }
    }
};

// 导出所有数据
window.ZIWEI_PATTERNS = {
    CHART_PATTERNS,
    LIFE_NODES_BY_PATTERN,
    
    // 辅助函数：获取格局详细信息
    getPatternDetails: function(patternName) {
        return CHART_PATTERNS[patternName] || null;
    },
    
    // 辅助函数：根据主星组合判断格局
    getPatternByStars: function(mainStars) {
        if (!mainStars || mainStars.length === 0) {
            return '命无正曜';
        }
        
        // 检查杀破狼
        if (mainStars.some(s => ['七杀', '破军', '贪狼'].includes(s))) {
            if (mainStars.length === 1) {
                return `${mainStars[0]}独坐`;
            } else if (mainStars.length === 2) {
                if (mainStars.includes('紫微')) {
                    return `紫微${mainStars.find(s => s !== '紫微')}`;
                } else {
                    return `${mainStars[0]}${mainStars[1]}`;
                }
            }
        }
        
        // 检查紫府廉武相
        if (mainStars.some(s => ['紫微', '天府', '廉贞', '武曲', '天相'].includes(s))) {
            if (mainStars.length === 1) {
                return `${mainStars[0]}独坐`;
            } else if (mainStars.length === 2) {
                if (mainStars.includes('紫微') && mainStars.includes('天府')) {
                    return '紫微天府';
                } else if (mainStars.includes('紫微')) {
                    return `紫微${mainStars.find(s => s !== '紫微')}`;
                }
            } else if (mainStars.includes('紫微') && mainStars.includes('左辅') && mainStars.includes('右弼')) {
                return '君臣庆会格';
            }
        }
        
        // 检查机月同梁
        if (mainStars.some(s => ['天机', '太阴', '天同', '天梁'].includes(s))) {
            if (mainStars.length === 1) {
                return `${mainStars[0]}独坐`;
            }
        }
        
        // 检查巨日
        if (mainStars.some(s => ['巨门', '太阳'].includes(s))) {
            if (mainStars.length === 1) {
                return `${mainStars[0]}独坐`;
            } else if (mainStars.length === 2) {
                return `${mainStars[0]}${mainStars[1]}`;
            }
        }
        
        return '其他';
    },
    
    // 辅助函数：获取人生节点
    getLifeNodes: function(patternName) {
        const pattern = CHART_PATTERNS[patternName];
        if (!pattern) {
            return null;
        }
        
        return LIFE_NODES_BY_PATTERN[pattern.category] || null;
    },
    
    // 辅助函数：生成完整人生轨迹
    generateLifeTrajectory: function(patternName, gender) {
        const lifeNodes = this.getLifeNodes(patternName);
        if (!lifeNodes) {
            return null;
        }
        
        const genderText = gender === '女' ? '她' : '他';
        
        return {
            childhood: `少年时期，${genderText}${lifeNodes.childhood.description}`,
            youth: `青年时期，${genderText}${lifeNodes.youth.description}`,
            middle: `中年时期，${genderText}${lifeNodes.middle.description}`,
            late: `晚年时期，${genderText}${lifeNodes.late.description}`
        };
    }
};
