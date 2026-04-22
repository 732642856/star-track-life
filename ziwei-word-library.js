/**
 * ziwei-word-library.js
 * ─────────────────────────────────────────────────────────────────────
 * 紫微斗数驱动的动态词库系统
 * 基于命盘数据（主星、四化、格局、宫位）动态生成创作词汇
 * 
 * 设计原则：
 * 1. 所有词汇生成基于真实的紫微斗数命盘数据
 * 2. 词汇按八大维度分类：外貌、言语、行为、情感、社交、危机、学习、成长
 * 3. 支持多语言：简体中文、繁体中文、英文
 * 4. 与chart-to-bio-bridge.js紧密集成，使用真实命盘数据
 * 
 * 版本：v1.0  日期：2026-03-30
 */

;(function(global) {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────
    // 常量
    // ─────────────────────────────────────────────────────────────────────

    // 14主星性格特质词库
    const STAR_VOCABULARY = {
        // 紫微星
        '紫微': {
            appearance: ['帝王气质', '端庄威严', '仪态大方', '气宇轩昂', '雍容华贵'],
            speech: ['沉稳有力', '命令式语气', '深思熟虑', '权威口吻', '不容置疑'],
            behavior: ['有条不紊', '注重礼仪', '掌控全局', '决策果断', '领导风范'],
            emotion: ['内敛深沉', '喜怒不形于色', '责任感强', '内心骄傲', '情感克制'],
            social: ['居高临下', '受人尊敬', '社交距离感', '择友谨慎', '圈层分明'],
            crisis: ['临危不乱', '大局为重', '牺牲小我', '沉着应对', '权威压制'],
            learning: ['系统化学习', '博学强记', '善于总结', '经验主义', '传统智慧'],
            growth: ['从权威到亲和', '从孤傲到包容', '责任感的升华', '领导力的成熟']
        },
        // 天机星
        '天机': {
            appearance: ['机敏灵动', '眼神锐利', '身形敏捷', '精明干练', '观察细致'],
            speech: ['语速较快', '逻辑清晰', '分析透彻', '善于说服', '机智幽默'],
            behavior: ['灵活多变', '计划周密', '善于应变', '谋定后动', '心思缜密'],
            emotion: ['内心焦虑', '思虑过多', '敏感细腻', '情绪波动', '追求完美'],
            social: ['善于交际', '信息枢纽', '人脉广泛', '互利共赢', '合作导向'],
            crisis: ['分析利弊', '寻找退路', '智取非力敌', '随机应变', '借力打力'],
            learning: ['快速吸收', '举一反三', '好奇心强', '跨领域学习', '信息整合'],
            growth: ['从多虑到果决', '从机巧到智慧', '焦虑感的转化', '谋略的升华']
        },
        // 太阳星
        '太阳': {
            appearance: ['阳光开朗', '精神饱满', '笑容温暖', '热情洋溢', '充满活力'],
            speech: ['直率坦诚', '音量较大', '感染力强', '积极乐观', '鼓舞人心'],
            behavior: ['积极主动', '乐于助人', '精力旺盛', '追求光明', '坦荡无私'],
            emotion: ['情感外露', '容易激动', '热情奔放', '光明磊落', '少有城府'],
            social: ['广结善缘', '中心人物', '乐于分享', '慷慨大方', '人缘极佳'],
            crisis: ['正面迎击', '不惧困难', '鼓舞士气', '光明正大', '信念支撑'],
            learning: ['从实践中学习', '榜样效应', '正面教育', '经验积累', '乐观心态'],
            growth: ['从冲动到沉稳', '从外显到内敛', '热情的成熟', '光明的智慧']
        },
        // 武曲星
        '武曲': {
            appearance: ['刚毅果敢', '体格健壮', '线条硬朗', '行动有力', '神情专注'],
            speech: ['简洁有力', '直截了当', '不喜废话', '务实坦诚', '执行力强'],
            behavior: ['雷厉风行', '目标导向', '吃苦耐劳', '坚持不懈', '效率至上'],
            emotion: ['情感克制', '不擅表达', '实际务实', '重视行动', '少有浪漫'],
            social: ['以事会友', '实干伙伴', '信用为本', '利益分明', '团队核心'],
            crisis: ['迎难而上', '硬扛到底', '资源整合', '务实应对', '坚韧不拔'],
            learning: ['实践出真知', '技能导向', '专业精深', '经验教训', '实用主义'],
            growth: ['从刚硬到柔韧', '从孤军到协作', '力量的智慧', '坚持的升华']
        },
        // 天同星
        '天同': {
            appearance: ['温和圆润', '亲和力强', '面容和善', '举止优雅', '气质柔和'],
            speech: ['温和委婉', '善解人意', '调解语气', '避免冲突', '和谐导向'],
            behavior: ['随和包容', '追求和谐', '避免竞争', '享受生活', '节奏舒缓'],
            emotion: ['情感丰富', '善感多情', '追求美好', '容易满足', '内心柔软'],
            social: ['和事佬', '人缘良好', '避免争执', '和谐氛围', '情感纽带'],
            crisis: ['回避冲突', '寻求和解', '以柔克刚', '忍耐等待', '和平解决'],
            learning: ['兴趣驱动', '轻松氛围', '感受体验', '艺术审美', '生活智慧'],
            growth: ['从依赖到独立', '从柔弱到坚韧', '和谐的深度', '满足感的升华']
        },
        // 廉贞星
        '廉贞': {
            appearance: ['神秘深邃', '气质独特', '眼神锐利', '举止优雅', '魅力非凡'],
            speech: ['深刻尖锐', '一针见血', '富有哲理', '引人深思', '话语有力'],
            behavior: ['追求极致', '完美主义', '深沉内敛', '情感强烈', '执念深重'],
            emotion: ['情感强烈', '爱恨分明', '内心挣扎', '深刻执着', '自我牺牲'],
            social: ['深度交往', '少而精', '情感羁绊', '精神共鸣', '灵魂伴侣'],
            crisis: ['直面黑暗', '自我剖析', '深刻转化', '置之死地而后生', '灵魂考验'],
            learning: ['深度思考', '哲学探索', '精神成长', '痛苦领悟', '灵魂智慧'],
            growth: ['从执念到超脱', '从黑暗到光明', '痛苦的升华', '灵魂的觉醒']
        },
        // 天府星
        '天府': {
            appearance: ['雍容大气', '富态饱满', '气度从容', '仪态端庄', '稳重厚实'],
            speech: ['稳重缓慢', '深思熟虑', '保守谨慎', '务实稳重', '经验之谈'],
            behavior: ['稳重踏实', '注重积累', '保守谨慎', '按部就班', '耐力持久'],
            emotion: ['情感稳定', '不易波动', '务实理性', '安全感强', '少有激情'],
            social: ['稳重可靠', '长期关系', '保守圈层', '互惠互利', '信誉为本'],
            crisis: ['稳扎稳打', '资源储备', '保守应对', '耐力持久', '根基稳固'],
            learning: ['积累型学习', '经验传承', '传统智慧', '实践验证', '稳中求进'],
            growth: ['从保守到开放', '从稳重到灵动', '积累的智慧', '根基的升华']
        },
        // 太阴星
        '太阴': {
            appearance: ['温柔婉约', '气质优雅', '眼神柔和', '举止娴静', '含蓄内敛'],
            speech: ['轻声细语', '委婉含蓄', '体贴入微', '善解人意', '诗意表达'],
            behavior: ['细腻敏感', '注重细节', '情感丰富', '回避冲突', '寻求安宁'],
            emotion: ['情感细腻', '多愁善感', '内心丰富', '情绪波动', '浪漫情怀'],
            social: ['深度情感', '一对一关系', '避世倾向', '心灵共鸣', '情感依赖'],
            crisis: ['回避对抗', '情感疗愈', '寻求安慰', '向内探索', '心灵成长'],
            learning: ['感性学习', '艺术熏陶', '情感体验', '直觉领悟', '心灵智慧'],
            growth: ['从敏感到坚韧', '从依赖到独立', '情感的深度', '心灵的成熟']
        },
        // 贪狼星
        '贪狼': {
            appearance: ['魅力四射', '风情万种', '性感迷人', '眼神勾人', '气质独特'],
            speech: ['风趣幽默', '能言善辩', '富有魅力', '引人入胜', '甜言蜜语'],
            behavior: ['追求刺激', '多变善变', '享受生活', '社交高手', '善于诱惑'],
            emotion: ['情感丰富', '喜新厌旧', '追求快乐', '自我中心', '少有约束'],
            social: ['社交蝴蝶', '广泛人脉', '表面热闹', '深度有限', '利益交换'],
            crisis: ['灵活应变', '资源利用', '人脉求助', '转危为机', '化险为夷'],
            learning: ['快速上手', '广度优先', '实用技能', '人际智慧', '生存本能'],
            growth: ['从浮华到深刻', '从多变到专注', '欲望的转化', '快乐的智慧']
        },
        // 巨门星
        '巨门': {
            appearance: ['深沉内敛', '眼神锐利', '面容严肃', '气质冷峻', '不善言辞'],
            speech: ['言辞尖锐', '一针见血', '沉默寡言', '话语有力', '洞察深刻'],
            behavior: ['深思熟虑', '疑心较重', '观察细致', '行动谨慎', '保护性强'],
            emotion: ['情感深沉', '不善表达', '内心孤独', '防备心重', '情感压抑'],
            social: ['谨慎交往', '少而精', '深度信任', '防御性强', '界限分明'],
            crisis: ['怀疑一切', '自我保护', '冷静分析', '暗中观察', '伺机而动'],
            learning: ['怀疑精神', '深度思考', '批判性思维', '独立研究', '真相探索'],
            growth: ['从怀疑到信任', '从封闭到开放', '孤独的智慧', '深刻的升华']
        },
        // 天相星
        '天相': {
            appearance: ['端庄得体', '仪态优雅', '穿着考究', '气质温和', '亲和力强'],
            speech: ['得体周到', '善于沟通', '调解斡旋', '语言艺术', '社交辞令'],
            behavior: ['注重形象', '遵守规则', '善于协调', '追求和谐', '服务精神'],
            emotion: ['情感得体', '情绪稳定', '顾及他人', '少有激烈', '温和包容'],
            social: ['社交润滑剂', '人脉桥梁', '团队协调', '关系维护', '和谐导向'],
            crisis: ['协调解决', '寻求共识', '维持秩序', '调解矛盾', '和平化解'],
            learning: ['模仿学习', '规范掌握', '社交技巧', '礼仪修养', '和谐智慧'],
            growth: ['从表面到内在', '从模仿到创造', '和谐的深度', '服务的升华']
        },
        // 天梁星
        '天梁': {
            appearance: ['稳重老成', '气质沉稳', '面容慈祥', '举止庄重', '威严有度'],
            speech: ['语重心长', '教导语气', '经验之谈', '稳重缓慢', '权威感强'],
            behavior: ['稳重可靠', '责任感强', '保护他人', '遵守传统', '长者风范'],
            emotion: ['情感深沉', '慈爱包容', '责任感重', '内心担忧', '少有轻浮'],
            social: ['受人尊敬', '长辈角色', '指导帮助', '保护照顾', '责任担当'],
            crisis: ['挺身而出', '保护他人', '经验指导', '稳重应对', '责任担当'],
            learning: ['经验传承', '传统智慧', '教导他人', '人生哲理', '长者智慧'],
            growth: ['从责任到自在', '从担忧到豁达', '经验的升华', '智慧的传承']
        },
        // 七杀星
        '七杀': {
            appearance: ['锐利锋芒', '眼神坚定', '身形矫健', '气质果敢', '行动力强'],
            speech: ['直接果断', '命令式语气', '不喜废话', '执行力强', '决断有力'],
            behavior: ['雷厉风行', '敢于冒险', '不畏艰难', '目标明确', '行动迅速'],
            emotion: ['情感强烈', '爱恨分明', '急躁冲动', '内心骄傲', '少有柔情'],
            social: ['竞争关系', '强者为尊', '直来直往', '少有迂回', '实力说话'],
            crisis: ['正面硬刚', '果断决策', '冒险一搏', '勇往直前', '不畏牺牲'],
            learning: ['实战学习', '经验教训', '技能提升', '强者思维', '生存智慧'],
            growth: ['从冲动到谋略', '从孤勇到协作', '勇气的智慧', '力量的升华']
        },
        // 破军星
        '破军': {
            appearance: ['不羁洒脱', '气质独特', '眼神叛逆', '举止随意', '不拘小节'],
            speech: ['直言不讳', '叛逆语气', '挑战权威', '颠覆传统', '新颖独特'],
            behavior: ['打破常规', '追求变革', '不畏挑战', '创新突破', '颠覆传统'],
            emotion: ['情感激烈', '追求自由', '反叛精神', '内心动荡', '少有安宁'],
            social: ['边缘群体', '志同道合', '反叛联盟', '挑战主流', '创新圈子'],
            crisis: ['彻底变革', '破而后立', '颠覆传统', '创新突破', '置之死地'],
            learning: ['打破框架', '创新思维', '边缘知识', '反叛智慧', '变革之道'],
            growth: ['从破坏到建设', '从反叛到创造', '变革的智慧', '自由的升华']
        }
    };

    // 四化类型词库
    const SIHUA_VOCABULARY = {
        '化禄': {
            appearance: ['丰润饱满', '和善可亲', '富态雍容', '亲和力强'],
            speech: ['温和友善', '赞美之词', '和谐语气', '善于肯定'],
            behavior: ['慷慨大方', '乐于助人', '追求享受', '和谐导向'],
            emotion: ['满足感强', '幸福感高', '情感丰富', '少有不满'],
            social: ['人缘极佳', '广结善缘', '互利互惠', '和谐关系'],
            crisis: ['化险为夷', '贵人相助', '资源丰富', '顺利解决'],
            learning: ['兴趣驱动', '快乐学习', '广泛涉猎', '享受过程'],
            growth: ['从满足到分享', '从享受到奉献', '幸福的智慧', '富足的升华']
        },
        '化权': {
            appearance: ['威严有力', '气场强大', '神情专注', '掌控姿态'],
            speech: ['命令语气', '权威口吻', '决断有力', '不容置疑'],
            behavior: ['掌控全局', '决策果断', '行动有力', '目标明确'],
            emotion: ['控制欲强', '责任感重', '内心坚定', '少有犹豫'],
            social: ['领导地位', '支配关系', '权威导向', '上下分明'],
            crisis: ['强力掌控', '果断决策', '权威压制', '掌控局面'],
            learning: ['目标导向', '实用技能', '领导艺术', '掌控智慧'],
            growth: ['从控制到引导', '从权力到责任', '权威的智慧', '力量的升华']
        },
        '化科': {
            appearance: ['文雅得体', '气质出众', '仪表堂堂', '风度翩翩'],
            speech: ['文雅得体', '知识渊博', '善于表达', '富有文采'],
            behavior: ['注重形象', '遵守礼仪', '追求完美', '表现优秀'],
            emotion: ['荣誉感强', '注重面子', '内心骄傲', '追求认可'],
            social: ['受人尊敬', '社交明星', '形象良好', '声誉重要'],
            crisis: ['智慧化解', '名誉保全', '理性应对', '优雅解决'],
            learning: ['系统学习', '知识积累', '追求卓越', '学术成就'],
            growth: ['从外在到内在', '从表现到本质', '名誉的智慧', '优雅的升华']
        },
        '化忌': {
            appearance: ['神情凝重', '气质深沉', '眼神忧虑', '心事重重'],
            speech: ['言辞谨慎', '表达困难', '内心纠结', '话语压抑'],
            behavior: ['谨慎小心', '反复思量', '行动迟缓', '顾虑重重'],
            emotion: ['焦虑不安', '内心挣扎', '情感压抑', '少有快乐'],
            social: ['人际关系复杂', '容易误解', '交流困难', '内心孤独'],
            crisis: ['困难重重', '反复纠缠', '内心煎熬', '突破艰难'],
            learning: ['痛苦领悟', '深刻反思', '从失败学习', '挣扎成长'],
            growth: ['从痛苦到智慧', '从挣扎到解脱', '苦难的升华', '深刻的觉醒']
        }
    };

    // 格局类型词库
    const PATTERN_VOCABULARY = {
        '杀破狼': {
            appearance: ['锐气逼人', '行动有力', '眼神坚定', '气质果敢'],
            speech: ['直截了当', '决断有力', '目标明确', '不喜迂回'],
            behavior: ['敢于冒险', '行动迅速', '追求突破', '不畏艰难'],
            emotion: ['情感强烈', '爱恨分明', '内心骄傲', '少有柔情'],
            social: ['竞争导向', '实力说话', '强者为尊', '直来直往'],
            crisis: ['正面迎击', '果断决策', '冒险一搏', '勇往直前'],
            learning: ['实战学习', '经验教训', '强者思维', '生存智慧'],
            growth: ['从冲动到谋略', '从孤勇到协作', '勇气的智慧', '力量的升华']
        },
        '紫府廉武相': {
            appearance: ['威严端庄', '气质高雅', '仪态大方', '稳重得体'],
            speech: ['稳重有力', '权威口吻', '深思熟虑', '得体周到'],
            behavior: ['稳重有序', '掌控全局', '注重形象', '遵守规则'],
            emotion: ['情感克制', '责任感强', '内心骄傲', '少有外露'],
            social: ['权威地位', '受人尊敬', '社交得体', '圈层分明'],
            crisis: ['沉稳应对', '掌控局面', '权威解决', '稳扎稳打'],
            learning: ['系统学习', '传统智慧', '经验积累', '权威知识'],
            growth: ['从权威到亲和', '从掌控到引导', '责任的升华', '权威的智慧']
        },
        '机月同梁': {
            appearance: ['温和文雅', '气质柔和', '眼神温和', '举止优雅'],
            speech: ['温和委婉', '善于沟通', '体贴入微', '和谐语气'],
            behavior: ['温和包容', '追求和谐', '避免冲突', '注重情感'],
            emotion: ['情感丰富', '善感多情', '内心柔软', '追求美好'],
            social: ['和谐关系', '人缘良好', '情感纽带', '避免争执'],
            crisis: ['回避冲突', '寻求和解', '以柔克刚', '和平解决'],
            learning: ['兴趣驱动', '情感体验', '艺术熏陶', '生活智慧'],
            growth: ['从依赖到独立', '从柔弱到坚韧', '和谐的深度', '情感的升华']
        },
        '巨日': {
            appearance: ['阳光深沉', '气质独特', '眼神锐利', '气质矛盾'],
            speech: ['直接深刻', '一针见血', '阳光坦诚', '洞察尖锐'],
            behavior: ['直接行动', '深刻思考', '阳光积极', '内心复杂'],
            emotion: ['情感矛盾', '阳光与阴影', '内心挣扎', '复杂深刻'],
            social: ['复杂关系', '深刻交往', '阳光表面', '阴影内心'],
            crisis: ['直面矛盾', '深刻剖析', '阳光应对', '阴影处理'],
            learning: ['矛盾思考', '深刻领悟', '阳光学习', '阴影智慧'],
            growth: ['从矛盾到统一', '从分裂到完整', '阳光的深度', '阴影的升华']
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // 核心函数
    // ─────────────────────────────────────────────────────────────────────

    /**
     * 根据命盘数据生成动态词库
     * @param {object} chartData - 命盘数据，含主星、四化、格局
     * @param {string} dimension - 维度：appearance/speech/behavior/emotion/social/crisis/learning/growth
     * @param {number} count - 返回词汇数量
     * @returns {Array} 词汇数组
     */
    function generateDynamicVocabulary(chartData, dimension, count = 5) {
        const mainStar = chartData.mainStar || '紫微';
        const sihuaType = chartData.sihuaType || '化禄型';
        const patternType = chartData.patternType || '杀破狼';
        
        // 提取四化关键词（化禄型 -> 化禄）
        const sihuaKey = sihuaType.includes('化') ? sihuaType.replace('型', '') : '化禄';
        
        // 获取主星、四化、格局的词库
        const starWords = STAR_VOCABULARY[mainStar] ? (STAR_VOCABULARY[mainStar][dimension] || []) : [];
        const sihuaWords = SIHUA_VOCABULARY[sihuaKey] ? (SIHUA_VOCABULARY[sihuaKey][dimension] || []) : [];
        const patternWords = PATTERN_VOCABULARY[patternType] ? (PATTERN_VOCABULARY[patternType][dimension] || []) : [];
        
        // 合并词库
        const allWords = [...starWords, ...sihuaWords, ...patternWords];
        
        // 去重
        const uniqueWords = [...new Set(allWords)];
        
        // 如果词汇不足，添加通用词汇
        if (uniqueWords.length < count) {
            const genericWords = getGenericVocabulary(dimension);
            uniqueWords.push(...genericWords.filter(word => !uniqueWords.includes(word)));
        }
        
        // 返回指定数量的词汇
        return uniqueWords.slice(0, Math.min(count, uniqueWords.length));
    }

    /**
     * 获取通用词汇（当紫微词汇不足时使用）
     */
    function getGenericVocabulary(dimension) {
        const GENERIC_VOCAB = {
            appearance: ['普通', '一般', '常见', '标准', '寻常'],
            speech: ['普通说话', '一般表达', '常见语气', '标准交流', '寻常对话'],
            behavior: ['普通行为', '一般动作', '常见习惯', '标准举止', '寻常表现'],
            emotion: ['普通情感', '一般情绪', '常见感受', '标准反应', '寻常心情'],
            social: ['普通社交', '一般交往', '常见关系', '标准互动', '寻常交流'],
            crisis: ['普通应对', '一般处理', '常见解决', '标准反应', '寻常面对'],
            learning: ['普通学习', '一般掌握', '常见理解', '标准吸收', '寻常进步'],
            growth: ['普通成长', '一般发展', '常见进步', '标准成熟', '寻常变化']
        };
        return GENERIC_VOCAB[dimension] || GENERIC_VOCAB.appearance;
    }

    /**
     * 为八大维度生成完整词库描述
     * @param {object} chartData - 命盘数据
     * @returns {object} 八大维度的词库描述
     */
    function generateAllDimensionsVocabulary(chartData) {
        const dimensions = ['appearance', 'speech', 'behavior', 'emotion', 'social', 'crisis', 'learning', 'growth'];
        const result = {};
        
        dimensions.forEach(dimension => {
            const words = generateDynamicVocabulary(chartData, dimension, 8);
            result[dimension] = words;
        });
        
        return result;
    }

    /**
     * 为特定主星生成深度描写词汇
     * @param {string} mainStar - 主星名称
     * @param {string} era - 时代背景
     * @returns {object} 深度描写词汇
     */
    function generateDeepDescription(mainStar, era = 'contemporary') {
        const starData = STAR_VOCABULARY[mainStar] || STAR_VOCABULARY['紫微'];
        
        // 根据时代调整词汇
        const eraModifiers = {
            ancient: ['古风', '传统', '典雅', '古朴', '古韵'],
            modern: ['民国风', '近代感', '新旧交替', '变革气息', '时代感'],
            contemporary: ['现代感', '都市气息', '当代风格', '时尚元素', '时代特征']
        };
        
        const modifier = eraModifiers[era] || eraModifiers.contemporary;
        
        const result = {};
        Object.keys(starData).forEach(dimension => {
            const baseWords = starData[dimension] || [];
            // 为部分词汇添加时代修饰
            const eraWords = baseWords.map(word => {
                if (Math.random() > 0.7) { // 30%的词汇添加时代修饰
                    const randomModifier = modifier[Math.floor(Math.random() * modifier.length)];
                    return `${randomModifier}的${word}`;
                }
                return word;
            });
            result[dimension] = eraWords.slice(0, 5);
        });
        
        return result;
    }

    // ─────────────────────────────────────────────────────────────────────
    // 导出到全局
    // ─────────────────────────────────────────────────────────────────────

    global.ZiweiWordLibrary = {
        generateDynamicVocabulary,
        generateAllDimensionsVocabulary,
        generateDeepDescription,
        
        // 常量导出（供外部访问）
        STAR_VOCABULARY,
        SIHUA_VOCABULARY,
        PATTERN_VOCABULARY
    };

    // 兼容别名
    global.RichZiweiWordLibrary = {
        generateAllDimensionsVocabulary: function(chartData) {
            return global.ZiweiWordLibrary.generateAllDimensionsVocabulary(chartData);
        },
        getStats: function() {
            return { dimensions: 8, wordsPerDimension: 8 };
        }
    };

    global.WritingLibraryEnhancer = {
        getCombinedVocabulary: function(chartData, dimension, count) {
            var allVocab = global.ZiweiWordLibrary.generateAllDimensionsVocabulary(chartData);
            return allVocab[dimension] || [];
        }
    };

})(typeof window !== 'undefined' ? window : this);
