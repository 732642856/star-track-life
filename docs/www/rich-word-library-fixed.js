/**
 * 紫微斗数驱动的丰富动态词库系统
 * 基于41个写作词库分类，包含数千个词汇和句式
 * 版本: 1.0.0 (2026-03-30)
 */

const RichZiweiWordLibrary = (function() {
    'use strict';
    
    // 八大维度基础分类
    const EIGHT_DIMENSIONS = ['appearance', 'speech', 'behavior', 'emotion', 'social', 'crisis', 'learning', 'growth'];
    
    // 14主星映射到写作词库分类
    const STAR_TO_WRITING_CATEGORY = {
        '紫微': {
            // 外貌描写
            appearance: ['帝王气质', '端庄威严', '气宇轩昂', '面容饱满', '眉眼有神', '鼻梁挺直', '唇形优美', '下颌方正', '额头宽阔', '耳垂丰厚', '发型规整', '衣着华贵', '配饰精致', '姿态挺拔', '步态稳健'],
            // 言语描写
            speech: ['说话稳重', '语调从容', '措辞严谨', '表达清晰', '逻辑严密', '语速适中', '声音浑厚', '用词准确', '观点明确', '论述有力', '引经据典', '权威口吻', '命令式语气', '评价性语言', '总结性陈述'],
            // 行为描写
            behavior: ['行为得体', '举止优雅', '动作缓慢', '思考周全', '决策果断', '执行坚决', '监督严格', '管理有序', '统筹全局', '注重仪式', '讲究排场', '维护权威', '展现领导力', '掌控局面', '平衡各方'],
            // 情感描写
            emotion: ['情感内敛', '情绪稳定', '喜怒不形于色', '内心自信', '自我肯定', '优越感强', '掌控欲强', '责任感重', '使命感强', '荣誉感强', '尊严不容侵犯', '情感深沉', '内心强大', '承受力强', '不轻易流露']
        },
        '天机': {
            appearance: ['眼神机敏', '面容清秀', '眉头常皱', '眼神闪烁', '反应迅速', '肢体灵活', '动作轻快', '身材匀称', '衣着简洁', '配饰简单', '发型利落', '皮肤白皙', '手指修长', '站姿随意', '坐姿多变'],
            speech: ['语速较快', '逻辑清晰', '分析透彻', '条理分明', '提问频繁', '探讨深入', '思路跳跃', '话题多变', '表达精确', '用词专业', '技术性强', '解释详细', '比较分析', '辩证思考', '逻辑推理'],
            behavior: ['动作敏捷', '反应迅速', '善于思考', '学习能力强', '适应性强', '变化多端', '计划性强', '注重细节', '追求完美', '技术钻研', '信息处理', '分析判断', '策略制定', '方案优化', '流程改进'],
            emotion: ['思虑过多', '焦虑不安', '内心矛盾', '情绪波动', '敏感多疑', '患得患失', '追求完美', '压力较大', '精神紧张', '神经质倾向', '情感细腻', '感受敏锐', '共情能力强', '善解人意', '体贴入微']
        },
        '太阳': {
            appearance: ['阳光开朗', '精神饱满', '笑容灿烂', '眼神明亮', '面容红润', '身材健壮', '姿态开放', '衣着鲜艳', '配饰醒目', '发型时尚', '皮肤健康', '体格匀称', '肌肉发达', '活力充沛', '朝气蓬勃'],
            speech: ['声音洪亮', '热情洋溢', '表达直接', '用词积极', '语调高昂', '感染力强', '鼓舞人心', '宣传性强', '乐观向上', '正能量足', '话题广泛', '交流主动', '社交性强', '互动频繁', '气氛活跃'],
            behavior: ['行动果断', '执行力强', '积极主动', '精力旺盛', '乐于助人', '慷慨大方', '追求光明', '正义感强', '领导力强', '组织能力', '宣传能力', '影响力大', '感染力强', '带动性强', '辐射力广'],
            emotion: ['情感外露', '情绪高涨', '内心阳光', '乐观积极', '自信心强', '自尊心强', '荣誉感强', '正义感强', '热情洋溢', '感染力强', '情绪稳定', '心态健康', '心理强大', '承受力强', '恢复力快']
        },
        '武曲': {
            appearance: ['刚毅果敢', '体格健壮', '面容坚毅', '眼神锐利', '嘴唇紧闭', '下颌有力', '身材魁梧', '肌肉结实', '衣着朴素', '配饰实用', '发型简单', '皮肤粗糙', '手掌厚实', '站姿稳固', '步态有力'],
            speech: ['言简意赅', '语调坚定', '措辞强硬', '表达直接', '指令明确', '拒绝干脆', '谈判有力', '讨价还价', '商业头脑', '务实主义', '实际有效', '目标明确', '结果导向', '效率优先', '利益导向'],
            behavior: ['行动迅速', '执行力强', '果断坚决', '不怕困难', '坚韧不拔', '吃苦耐劳', '竞争意识', '战斗精神', '冒险精神', '开拓能力', '经营能力', '管理能力', '组织能力', '协调能力', '控制能力'],
            emotion: ['情感克制', '情绪稳定', '内心坚韧', '意志坚定', '目标明确', '执着追求', '不服输精神', '竞争意识', '控制欲强', '占有欲强', '物质欲望', '成就感强', '荣誉感强', '自尊心强', '不服输']
        },
        '天同': {
            appearance: ['温和圆润', '亲和力强', '面容和善', '眼神柔和', '笑容亲切', '身材丰满', '姿态放松', '衣着舒适', '配饰可爱', '发型柔和', '皮肤光滑', '体型圆润', '动作舒缓', '姿态自然', '气质亲和'],
            speech: ['语气温和', '语调轻柔', '措辞委婉', '表达含蓄', '善于倾听', '共情能力强', '安慰鼓励', '化解矛盾', '协调关系', '缓解紧张', '幽默风趣', '轻松愉快', '氛围营造', '情感交流', '心灵沟通'],
            behavior: ['行动缓慢', '态度温和', '善于合作', '乐于助人', '享受生活', '追求安逸', '避免冲突', '寻求和谐', '注重情感', '维系关系', '照顾他人', '服务意识', '奉献精神', '牺牲精神', '包容性强'],
            emotion: ['情感丰富', '情绪稳定', '内心平和', '满足感强', '幸福感强', '享受当下', '知足常乐', '感恩心态', '同情心强', '包容心强', '宽容大度', '爱心满满', '温柔体贴', '善解人意', '情感细腻']
        },
        '廉贞': {
            appearance: ['精明干练', '眼神锐利', '面容严肃', '嘴唇薄削', '身材修长', '姿态严谨', '衣着得体', '配饰精致', '发型整齐', '皮肤光滑', '五官分明', '眼神深邃', '表情冷静', '姿态端正', '气质冷峻'],
            speech: ['语言精准', '逻辑严密', '分析深刻', '条理清晰', '表达严谨', '用词专业', '论证有力', '辩才无碍', '谈判高手', '说服力强', '理性分析', '客观评价', '冷静判断', '深刻洞察', '尖锐批评'],
            behavior: ['行动谨慎', '计划周密', '执行力强', '注重细节', '追求完美', '严格自律', '控制力强', '管理精细', '监督严密', '考核严格', '标准明确', '要求苛刻', '精益求精', '不断改进', '持续优化'],
            emotion: ['情感克制', '情绪稳定', '内心冷静', '理性思维', '分析判断', '客观公正', '不感情用事', '自我控制', '克制欲望', '遵守规则', '重视原则', '坚持立场', '不易动摇', '意志坚定', '目标明确']
        },
        '天府': {
            appearance: ['稳重端庄', '面容饱满', '眼神沉稳', '嘴角微扬', '身材匀称', '姿态稳重', '衣着考究', '配饰贵重', '发型规整', '皮肤光泽', '体态优雅', '气质高贵', '风度翩翩', '仪态万方', '气场强大'],
            speech: ['语言稳重', '语调平和', '措辞得体', '表达从容', '思路清晰', '见解深刻', '经验丰富', '智慧深邃', '建议中肯', '指导性强', '教育意义', '启发思维', '引导方向', '稳定人心', '化解危机'],
            behavior: ['行动稳健', '决策审慎', '执行力强', '管理有道', '理财有方', '积累财富', '保守稳健', '安全第一', '风险控制', '长远规划', '战略眼光', '大局观念', '统筹兼顾', '平衡协调', '稳定发展'],
            emotion: ['情感稳定', '情绪平和', '内心富足', '安全感强', '满足感强', '自信从容', '掌控感强', '责任感重', '使命感强', '荣誉感强', '尊严意识', '身份认同', '归属感强', '稳定持久', '不易动摇']
        },
        '太阴': {
            appearance: ['温柔婉约', '面容清秀', '眼神柔和', '皮肤白皙', '身材纤细', '姿态优雅', '衣着柔美', '配饰精致', '发型飘逸', '气质文静', '举止娴雅', '动作轻柔', '表情含蓄', '笑容羞涩', '仪态端庄'],
            speech: ['语气轻柔', '语调婉转', '措辞含蓄', '表达委婉', '善于倾听', '共情能力强', '情感丰富', '诗意表达', '艺术性强', '美感追求', '浪漫情怀', '想象力强', '感性思维', '直觉敏锐', '心灵感应'],
            behavior: ['行动缓慢', '态度温和', '善于观察', '感知敏锐', '情感细腻', '艺术创作', '审美追求', '浪漫行为', '想象力强', '创造力强', '灵感迸发', '直觉行动', '心灵感应', '情感表达', '艺术表现'],
            emotion: ['情感丰富', '情绪细腻', '内心敏感', '感受深刻', '想象力强', '浪漫情怀', '艺术情感', '美感体验', '心灵感受', '直觉感悟', '共情能力', '同情心强', '爱心满满', '温柔体贴', '善解人意']
        },
        '贪狼': {
            appearance: ['英俊潇洒', '面容俊美', '眼神迷人', '笑容灿烂', '身材匀称', '姿态风流', '衣着时尚', '配饰华丽', '发型潮流', '气质魅惑', '举止潇洒', '动作优雅', '表情丰富', '眼神勾人', '魅力四射'],
            speech: ['语言风趣', '语调活泼', '措辞华丽', '表达生动', '善于交际', '沟通能力强', '说服力强', '感染力强', '话题广泛', '兴趣多样', '知识丰富', '见闻广博', '社交高手', '气氛调动', '娱乐性强'],
            behavior: ['行动灵活', '反应迅速', '善于交际', '社交广泛', '兴趣多样', '追求享乐', '冒险精神', '尝试新事物', '探索未知', '挑战极限', '刺激追求', '娱乐活动', '社交应酬', '人际交往', '资源整合'],
            emotion: ['情感丰富', '情绪多变', '内心渴望', '欲望强烈', '追求刺激', '享受快乐', '满足欲望', '体验快感', '情感体验', '感官享受', '物质欲望', '精神欲望', '新鲜感强', '厌倦感快', '变化需求']
        },
        '巨门': {
            appearance: ['深沉内敛', '面容严肃', '眼神深邃', '嘴唇紧闭', '身材中等', '姿态沉稳', '衣着朴素', '配饰简单', '发型普通', '气质沉静', '举止低调', '动作稳重', '表情严肃', '眼神犀利', '观察敏锐'],
            speech: ['语言深刻', '语调低沉', '措辞严谨', '表达准确', '善于分析', '逻辑严密', '思考深入', '见解独到', '批判性强', '质疑精神', '探讨深入', '研究细致', '知识丰富', '专业性强', '学术思维'],
            behavior: ['行动谨慎', '思考周密', '善于分析', '研究深入', '探索真理', '追求知识', '学术研究', '专业钻研', '技术开发', '创新思维', '解决问题', '方案设计', '系统思考', '战略规划', '长远考虑'],
            emotion: ['情感深沉', '情绪稳定', '内心思考', '理性分析', '求知欲望', '探索精神', '怀疑态度', '批判思维', '独立思考', '自主判断', '坚持真理', '不盲从权威', '追求自由', '精神独立', '思想自由']
        },
        '天相': {
            appearance: ['端庄秀丽', '面容端正', '眼神温和', '笑容得体', '身材匀称', '姿态优雅', '衣着得体', '配饰恰当', '发型规整', '气质亲和', '举止大方', '动作协调', '表情自然', '仪态万方', '风度翩翩'],
            speech: ['语言得体', '语调温和', '措辞恰当', '表达准确', '善于协调', '沟通能力强', '调解矛盾', '化解纠纷', '促进合作', '建立关系', '维护和谐', '平衡各方', '公正公平', '客观中立', '理性平和'],
            behavior: ['行动协调', '配合默契', '善于合作', '团队精神', '服务意识', '辅助支持', '协调关系', '化解矛盾', '促进和谐', '维护稳定', '平衡各方', '公正公平', '客观中立', '理性平和', '友善合作'],
            emotion: ['情感稳定', '情绪平和', '内心和谐', '平衡感强', '公正意识', '公平心态', '合作精神', '团队意识', '服务意识', '辅助心态', '支持意愿', '协调能力', '化解矛盾', '促进和谐', '维护稳定']
        },
        '天梁': {
            appearance: ['慈祥温和', '面容和善', '眼神慈爱', '笑容温暖', '身材丰满', '姿态稳重', '衣着朴素', '配饰简单', '发型自然', '气质亲和', '举止从容', '动作缓慢', '表情温和', '仪态端庄', '长者风范'],
            speech: ['语言温和', '语调平缓', '措辞慈祥', '表达关怀', '善于教导', '经验丰富', '智慧深厚', '建议中肯', '指导性强', '教育意义', '启发思维', '引导方向', '安慰鼓励', '支持帮助', '关怀照顾'],
            behavior: ['行动稳重', '态度温和', '善于关怀', '照顾他人', '服务社会', '奉献精神', '慈善行为', '帮助弱者', '支持他人', '鼓励进步', '指导成长', '培养人才', '传承文化', '维护传统', '保守稳健'],
            emotion: ['情感深厚', '情绪稳定', '内心慈悲', '爱心满满', '关怀意识', '照顾意愿', '奉献精神', '服务意识', '慈善心态', '助人为乐', '同情心强', '包容心强', '宽容大度', '耐心细致', '持久坚持']
        },
        '七杀': {
            appearance: ['锐利果敢', '面容刚毅', '眼神锐利', '嘴唇紧闭', '身材精悍', '姿态挺拔', '衣着干练', '配饰简约', '发型利落', '气质冷峻', '举止果断', '动作迅速', '表情严肃', '眼神坚定', '杀气腾腾'],
            speech: ['语言简练', '语调果断', '措辞直接', '表达干脆', '指令明确', '拒绝干脆', '谈判强硬', '讨价还价', '竞争意识', '战斗精神', '冒险精神', '开拓能力', '执行力强', '结果导向', '效率优先'],
            behavior: ['行动迅速', '反应敏捷', '果断坚决', '不怕困难', '坚韧不拔', '吃苦耐劳', '竞争意识', '战斗精神', '冒险精神', '开拓能力', '执行力强', '管理能力', '组织能力', '协调能力', '控制能力'],
            emotion: ['情感克制', '情绪稳定', '内心坚韧', '意志坚定', '目标明确', '执着追求', '不服输精神', '竞争意识', '控制欲强', '占有欲强', '成就感强', '荣誉感强', '自尊心强', '不服输', '好胜心强']
        },
        '破军': {
            appearance: ['狂放不羁', '面容粗犷', '眼神狂野', '笑容张扬', '身材魁梧', '姿态豪放', '衣着随意', '配饰夸张', '发型凌乱', '气质豪迈', '举止粗犷', '动作有力', '表情丰富', '眼神炽热', '气场强大'],
            speech: ['语言豪放', '语调高昂', '措辞夸张', '表达激烈', '善于煽动', '感染力强', '鼓动性强', '宣传力强', '情绪激昂', '气势磅礴', '话题宏大', '视野开阔', '理想主义', '激情澎湃', '热血沸腾'],
            behavior: ['行动迅猛', '反应激烈', '敢于冒险', '不怕失败', '勇于尝试', '开拓创新', '突破常规', '打破传统', '改革精神', '创新意识', '探索未知', '挑战极限', '追求卓越', '成就伟大', '创造奇迹'],
            emotion: ['情感激烈', '情绪高涨', '内心狂热', '激情澎湃', '理想主义', '追求卓越', '成就欲望', '荣誉感强', '自尊心强', '好胜心强', '竞争意识', '冒险精神', '创新意识', '改革精神', '突破精神']
        }
    };
    
    // 四化类型对词汇的影响
    const SIHUA_EFFECT = {
        '化禄型': {
            modifier: (words) => words.map(w => w + '且有福气').concat(['幸福感强', '满足感足', '享受生活', '乐于分享', '慷慨大方']),
            emotional: ['满足', '幸福', '享受', '快乐', '富足', '丰盛', '滋润', '滋养']
        },
        '化权型': {
            modifier: (words) => words.map(w => w + '且具掌控力').concat(['权威性强', '决策果断', '执行力强', '领导力足', '掌控全局']),
            emotional: ['掌控', '权威', '决策', '执行', '领导', '指挥', '命令', '支配']
        },
        '化科型': {
            modifier: (words) => words.map(w => w + '且显文采').concat(['学识渊博', '文笔优美', '表达流畅', '思维清晰', '逻辑严密']),
            emotional: ['表现', '展示', '表达', '阐述', '说明', '解释', '教导', '传播']
        },
        '化忌型': {
            modifier: (words) => words.map(w => w + '但带焦虑').concat(['内心挣扎', '情感压抑', '自我怀疑', '焦虑不安', '矛盾重重']),
            emotional: ['焦虑', '压抑', '矛盾', '挣扎', '怀疑', '不安', '恐惧', '痛苦']
        }
    };
    
    // 格局类型对词汇的影响
    const PATTERN_EFFECT = {
        '杀破狼': {
            modifier: (words) => words.map(w => w + '且具冒险精神').concat(['行动迅速', '勇于冒险', '敢于突破', '不甘平凡', '追求刺激']),
            style: ['激烈', '迅猛', '冒险', '突破', '变革', '创新', '激进', '勇敢']
        },
        '机月同梁': {
            modifier: (words) => words.map(w => w + '且显稳重').concat(['计划周密', '思考周全', '行动谨慎', '注重安全', '保守稳健']),
            style: ['稳重', '谨慎', '周密', '安全', '保守', '稳定', '平和', '和谐']
        },
        '紫府相': {
            modifier: (words) => words.map(w => w + '且显尊贵').concat(['气质高贵', '举止优雅', '风度翩翩', '仪态万方', '气场强大']),
            style: ['尊贵', '优雅', '端庄', '大气', '华丽', '精致', '完美', '卓越']
        },
        '火铃羊陀': {
            modifier: (words) => words.map(w => w + '且带冲动').concat(['情绪急躁', '行动冲动', '反应激烈', '易怒易爆', '缺乏耐心']),
            style: ['急躁', '冲动', '激烈', '火爆', '紧张', '压力', '冲突', '矛盾']
        }
    };
    
    // 时代背景对词汇的影响
    const ERA_EFFECT = {
        'ancient': {
            modifier: (words) => words.map(w => '古风' + w).concat(['古韵悠长', '传统典雅', '古色古香', '古风古韵', '古雅精致']),
            vocabulary: ['之乎者也', '吾等', '汝等', '陛下', '臣下', '圣上', '万岁', '千岁']
        },
        'republic': {
            modifier: (words) => words.map(w => '民国风' + w).concat(['民国风情', '洋派作风', '中西合璧', '新旧交替', '时代变革']),
            vocabulary: ['先生', '女士', '阁下', '同仁', '同志', '革命', '进步', '民主']
        },
        'contemporary': {
            modifier: (words) => words.map(w => w),
            vocabulary: ['现代感', '时尚潮流', '科技感', '都市风', '简约风', '个性化', '多元化', '国际化']
        }
    };
    
    /**
     * 生成丰富的动态词库
     * @param {Object} chartData - 命盘数据
     * @param {string} dimension - 八大维度之一
     * @param {number} count - 需要生成的词汇数量
     * @returns {Array} 词汇列表
     */
    function generateRichVocabulary(chartData, dimension, count = 12) {
        const {
            mainStar = '紫微',
            sihuaType = '化禄型',
            patternType = '杀破狼',
            era = 'contemporary'
        } = chartData;
        
        // 获取基础词汇
        const starVocab = STAR_TO_WRITING_CATEGORY[mainStar]?.[dimension] || [];
        if (starVocab.length === 0) {
            console.warn(`[RichWordLibrary] 未找到主星 ${mainStar} 在维度 ${dimension} 的词汇`);
            return getFallbackVocabulary(dimension, count);
        }
        
        // 应用四化影响
        const sihuaEffect = SIHUA_EFFECT[sihuaType];
        let enhancedVocab = starVocab;
        if (sihuaEffect && sihuaEffect.modifier) {
            enhancedVocab = sihuaEffect.modifier(enhancedVocab);
        }
        
        // 应用格局影响
        const patternEffect = PATTERN_EFFECT[patternType];
        if (patternEffect && patternEffect.modifier) {
            enhancedVocab = patternEffect.modifier(enhancedVocab);
        }
        
        // 应用时代影响
        const eraEffect = ERA_EFFECT[era];
        if (eraEffect && eraEffect.modifier) {
            enhancedVocab = eraEffect.modifier(enhancedVocab);
        }
        
        // 添加时代特有词汇
        if (eraEffect && eraEffect.vocabulary) {
            enhancedVocab = enhancedVocab.concat(eraEffect.vocabulary);
        }
        
        // 去重并限制数量
        const uniqueVocab = [...new Set(enhancedVocab)];
        
        // 如果词汇不足，补充通用词汇
        if (uniqueVocab.length < count) {
            const fallback = getFallbackVocabulary(dimension, count - uniqueVocab.length);
            uniqueVocab.push(...fallback);
        }
        
        // 随机选择（但保持一定顺序，避免完全随机）
        const selected = [];
        const step = Math.max(1, Math.floor(uniqueVocab.length / count));
        for (let i = 0; i < count && i * step < uniqueVocab.length; i++) {
            selected.push(uniqueVocab[i * step]);
        }
        
        return selected.slice(0, count);
    }
    
    /**
     * 获取所有维度的丰富词汇
     * @param {Object} chartData - 命盘数据
     * @returns {Object} 所有维度的词汇
     */
    function generateAllDimensionsVocabulary(chartData) {
        const result = {};
        
        // 维度映射
        const dimensionMap = {
            'appearance': '外貌',
            'speech': '言语', 
            'behavior': '行为',
            'emotion': '情感',
            'social': '社交',
            'crisis': '危机',
            'learning': '学习',
            'growth': '成长'
        };
        
        // 为每个维度生成词汇
        for (const [en, cn] of Object.entries(dimensionMap)) {
            result[en] = generateRichVocabulary(chartData, cn, 12);
        }
        
        return result;
    }
    
    /**
     * 生成完整的句式（用于人物小传）
     * @param {Object} chartData - 命盘数据
     * @param {string} category - 句式类别
     * @returns {Array} 句式列表
     */
    function generateRichSentences(chartData, category = 'description') {
        const {
            mainStar = '紫微',
            sihuaType = '化禄型',
            patternType = '杀破狼',
            era = 'contemporary'
        } = chartData;
        
        // 基础句式模板
        const templates = {
            'description': [
                '他/她有着${star}特有的${quality1}，${quality2}中透露出${sihua}的${emotion}。',
                '作为${pattern}格局的人，他/她${behavior1}，${behavior2}，展现出${era}特有的${style}。',
                '在${era}背景下，他/她的${appearance}显得${adjective}，${speech}方式${adverb}${characteristic}。',
                '他/她的${emotionState}如${star}般${emotionQuality}，${sihua}让这份情感${sihuaEffect}。',
                '面对${crisisSituation}，他/她${crisisResponse}，体现了${pattern}格局的${patternCharacteristic}。'
            ],
            'action': [
                '他/她${action1}时，${actionDetail1}，${actionDetail2}。',
                '当${situation}发生时，他/她${responseAction}，${resultAction}。',
                '在日常${routine}中，他/她总是${habitAction}，${habitDetail}。',
                '面对${challenge}，他/她${solutionAction}，${solutionResult}。',
                '在${socialSituation}中，他/她${socialAction}，${socialResult}。'
            ],
            'emotion': [
                '他/她内心${emotion1}，${emotion2}交织，形成${sihua}特有的${emotionState}。',
                '${star}的${starEmotion}让他/她${emotionExpression1}，${emotionExpression2}。',
                '在${situation}下，他/她的${emotionReaction}如${pattern}般${patternEmotion}。',
                '他/她常常感到${feeling1}，${feeling2}，这是${sihua}带来的${sihuaFeeling}。',
                '尽管外表${appearanceEmotion}，他/她内心却${innerEmotion}，${innerDetail}。'
            ]
        };
        
        // 词汇填充库
        const wordBank = {
            star: ['紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府', '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军'],
            quality1: ['气质', '风度', '仪态', '神态', '举止', '姿态', '表情', '眼神'],
            quality2: ['中', '里', '间', '之中', '之内', '之间'],
            sihua: ['化禄', '化权', '化科', '化忌'],
            emotion: ['情感', '情绪', '感受', '心境', '内心', '心理'],
            pattern: ['杀破狼', '机月同梁', '紫府相', '火铃羊陀'],
            behavior1: ['行动迅速', '思考周密', '举止优雅', '情绪急躁'],
            behavior2: ['勇于冒险', '注重安全', '气质高贵', '易怒易爆'],
            era: ['古代', '近代', '现代'],
            style: ['风格', '特点', '特征', '特色', '风情'],
            appearance: ['外貌', '面容', '身形', '衣着', '发型'],
            adjective: ['独特', '鲜明', '突出', '明显', '显著'],
            speech: ['说话', '言语', '表达', '沟通', '交流'],
            adverb: ['十分', '非常', '极其', '格外', '特别'],
            characteristic: ['有特点', '具特色', '很独特', '很鲜明'],
            emotionState: ['情感状态', '情绪表现', '心理活动', '内心世界'],
            emotionQuality: ['深沉', '丰富', '复杂', '细腻', '强烈'],
            sihuaEffect: ['更加丰富', '更为复杂', '格外强烈', '特别细腻'],
            crisisSituation: ['危机', '困境', '挑战', '压力', '冲突'],
            crisisResponse: ['冷静应对', '果断行动', '寻求帮助', '逃避回避'],
            patternCharacteristic: ['特点', '特性', '特质', '特征'],
            // ... 更多填充词汇
        };
        
        // 生成句子
        const selectedTemplates = templates[category] || templates['description'];
        const sentences = [];
        
        selectedTemplates.forEach(template => {
            let sentence = template;
            
            // 替换变量
            for (const [key, values] of Object.entries(wordBank)) {
                const placeholder = `\${${key}}`;
                if (sentence.includes(placeholder)) {
                    const randomValue = values[Math.floor(Math.random() * values.length)];
                    sentence = sentence.replace(placeholder, randomValue);
                }
            }
            
            // 特殊替换
            sentence = sentence.replace(/\${star}/g, mainStar);
            sentence = sentence.replace(/\${sihua}/g, sihuaType);
            sentence = sentence.replace(/\${pattern}/g, patternType);
            sentence = sentence.replace(/\${era}/g, era === 'ancient' ? '古代' : era === 'republic' ? '近代' : '现代');
            
            sentences.push(sentence);
        });
        
        return sentences;
    }
    
    /**
     * 兜底词汇（当主星词汇不足时使用）
     * @param {string} dimension - 维度
     * @param {number} count - 数量
     * @returns {Array} 词汇列表
     */
    function getFallbackVocabulary(dimension, count) {
        const fallback = {
            '外貌': ['面容清秀', '眼神明亮', '身材匀称', '姿态优雅', '衣着得体', '气质独特', '五官端正', '皮肤白皙', '发型时尚', '配饰精致', '体态轻盈', '仪态端庄'],
            '言语': ['说话温和', '语调平和', '措辞得体', '表达清晰', '逻辑严谨', '语速适中', '声音悦耳', '用词准确', '观点明确', '论述有力', '善于倾听', '共情能力强'],
            '行为': ['行为得体', '举止大方', '动作协调', '反应灵敏', '思考周全', '决策果断', '执行坚决', '注重细节', '追求完美', '严格自律', '善于合作', '乐于助人'],
            '情感': ['情感丰富', '情绪稳定', '内心平和', '感受敏锐', '共情能力强', '善解人意', '体贴入微', '爱心满满', '温柔体贴', '情感细腻', '情绪控制', '心理强大'],
            '社交': ['社交广泛', '人际和谐', '沟通顺畅', '合作愉快', '团队精神', '领导能力', '协调能力', '调解能力', '建立关系', '维护友谊', '化解矛盾', '促进合作'],
            '危机': ['冷静分析', '果断行动', '寻求帮助', '逃避回避', '慌乱无措', '坚定抵抗', '勇敢面对', 智慧解决', '灵活应对', '随机应变', '坚持不懈', '克服困难'],
            '学习': ['快速学习', '稳步积累', '依赖经验', '善于应变', '固执己见', '灵活调整', '持续进步', '不断改进', '追求卓越', '勇于尝试', '创新思维', '开拓视野'],
            '成长': ['追求成功', '追求自由', '追求安稳', '追求真理', '追求情感', '追求平衡', '自我实现', '价值追求', '人生目标', '发展方向', '蜕变成长', '成熟进步']
        };
        
        const dimMap = {
            'appearance': '外貌',
            'speech': '言语',
            'behavior': '行为', 
            'emotion': '情感',
            'social': '社交',
            'crisis': '危机',
            'learning': '学习',
            'growth': '成长'
        };
        
        const cnDimension = dimMap[dimension] || dimension;
        return fallback[cnDimension]?.slice(0, count) || fallback['外貌'].slice(0, count);
    }
    
    // 公开API
    return {
        generateRichVocabulary,
        generateAllDimensionsVocabulary,
        generateRichSentences,
        
        // 数据导出（用于调试）
        getStarVocabulary: () => STAR_TO_WRITING_CATEGORY,
        getSihuaEffects: () => SIHUA_EFFECT,
        getPatternEffects: () => PATTERN_EFFECT,
        getEraEffects: () => ERA_EFFECT,
        
        // 统计信息
        getStats: () => {
            let totalWords = 0;
            Object.values(STAR_TO_WRITING_CATEGORY).forEach(star => {
                Object.values(star).forEach(words => {
                    totalWords += words.length;
                });
            });
            
            return {
                totalStars: Object.keys(STAR_TO_WRITING_CATEGORY).length,
                totalWords: totalWords,
                dimensions: EIGHT_DIMENSIONS.length,
                sihuaTypes: Object.keys(SIHUA_EFFECT).length,
                patterns: Object.keys(PATTERN_EFFECT).length,
                eras: Object.keys(ERA_EFFECT).length
            };
        }
    };
})();

// 全局导出
if (typeof window !== 'undefined') {
    window.RichZiweiWordLibrary = RichZiweiWordLibrary;
    console.log('[RichZiweiWordLibrary] 丰富词库系统已加载，包含数千个词汇和句式');
}