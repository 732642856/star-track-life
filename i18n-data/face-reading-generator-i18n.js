/**
 * 面相学与外貌生成器
 * 基于紫微斗数命盘生成角色外貌描述
 */

// 主星对应的面相特征
const STAR_FACE_FEATURES = {
    '紫微': {
        face: {
            forehead: '宽广饱满，天庭高耸，显示出非凡的智慧和领导力',
            eyebrows: '浓密有型，眉尾微微上扬，自带威严感',
            eyes: '深邃有神，目光如炬，看人时有一种穿透力',
            nose: '高挺，鼻头圆润有肉，显示出权力和财富',
            lips: '厚薄适中，嘴角微微上扬，既有亲和力又不失威严',
            chin: '方圆饱满，显示出决断力和晚年运势'
        },
        body: {
            height: '高大挺拔，约180cm左右',
            build: '身材匀称或偏高大，站姿挺拔',
            posture: '举止优雅从容，动作不疾不徐'
        },
        temperament: '高贵典雅，自带王者风范，气场强大',
        voice: '洪亮磁性，语速适中'
    },
    '天机': {
        face: {
            forehead: '高而宽，但略窄于紫微，代表智慧但不过分张扬',
            eyebrows: '清秀细长，眉尾略下垂，显得温和',
            eyes: '灵动有神，目光流转快，显示思维活跃',
            nose: '鼻梁直但不过分高挺，鼻头适中',
            lips: '薄而有型，嘴角常带微笑，显得亲切',
            chin: '略尖或适中，显示灵活而非固执'
        },
        body: {
            height: '偏瘦或中等',
            build: '身材偏瘦或中等，动作灵活',
            posture: '举止文雅，手势较多，喜欢比划'
        },
        temperament: '温文尔雅，聪明机敏，亲和力强',
        voice: '柔和，语速较快'
    },
    '太阳': {
        face: {
            forehead: '明亮开阔，有光泽，代表光明正大',
            eyebrows: '粗而有型，眉尾上扬，显得阳光',
            eyes: '明亮有神，目光热情，有感染力',
            nose: '挺直，鼻头有肉，代表正直',
            lips: '厚而红润，嘴角上扬，笑容灿烂',
            chin: '方正有力，代表正义感'
        },
        body: {
            height: '健壮或魁梧',
            build: '身材健壮或魁梧，站姿挺拔',
            posture: '举止大方，动作有力，充满活力'
        },
        temperament: '阳光开朗，热情洋溢，正气凛然',
        voice: '洪亮，语速快'
    },
    '武曲': {
        face: {
            forehead: '方正有力，代表务实和决断',
            eyebrows: '粗浓，眉形直，显示刚毅',
            eyes: '锐利有神，目光专注，有穿透力',
            nose: '高挺，鼻头大而有肉，代表财运',
            lips: '薄而紧抿，显示果断',
            chin: '方而有力，代表坚毅'
        },
        body: {
            height: '健壮',
            build: '身材健壮，肌肉结实，站姿稳重',
            posture: '举止利落，动作干脆，不拖泥带水'
        },
        temperament: '刚毅果断，务实稳重，有商业头脑',
        voice: '低沉有力，语速适中'
    },
    '天同': {
        face: {
            forehead: '圆润饱满，有光泽，代表福气',
            eyebrows: '柔和弯曲，眉尾下垂，显得温和',
            eyes: '柔和有神，目光温暖，有亲和力',
            nose: '鼻梁适中，鼻头圆润，代表享受',
            lips: '厚而红润，嘴角常带微笑',
            chin: '圆润有肉，代表晚年享福'
        },
        body: {
            height: '偏丰满或圆润',
            build: '身材偏丰满或圆润，显得富态',
            posture: '举止悠闲，动作缓慢，不慌不忙'
        },
        temperament: '温和善良，福气满满，亲和力强',
        voice: '柔和，语速慢'
    },
    '廉贞': {
        face: {
            forehead: '宽窄适中，但纹路较多，显示复杂心思',
            eyebrows: '眉形不规则，或眉尾散乱，显示多变',
            eyes: '深邃有神，目光复杂，难以捉摸',
            nose: '鼻梁高但鼻头尖，显示敏感',
            lips: '薄而紧抿，或嘴角不对称，显示内心矛盾',
            chin: '尖或略凹，显示敏感多疑'
        },
        body: {
            height: '偏瘦',
            build: '身材偏瘦，动作优雅但略显神经质',
            posture: '举止独特，有个性，不拘一格'
        },
        temperament: '复杂多变，神秘莫测，有艺术气质',
        voice: '多变，语速时快时慢'
    },
    '天府': {
        face: {
            forehead: '宽广饱满，代表稳重和包容',
            eyebrows: '浓密整齐，眉尾略下垂，显示温和',
            eyes: '温和有神，目光稳重，有包容力',
            nose: '鼻梁适中，鼻头大而有肉，代表财库',
            lips: '厚而适中，嘴角平和，显示稳重',
            chin: '方圆饱满，代表守成能力'
        },
        body: {
            height: '偏丰满',
            build: '身材偏丰满，显得富态稳重',
            posture: '举止稳重，动作缓慢，不慌不忙'
        },
        temperament: '稳重保守，包容力强，有长者风范',
        voice: '低沉温和，语速慢'
    },
    '太阴': {
        face: {
            forehead: '圆润适中，代表温柔和智慧',
            eyebrows: '细长弯曲，眉尾下垂，显示温柔',
            eyes: '温柔有神，目光柔和，有母性光辉',
            nose: '鼻梁适中，鼻头圆润，代表细腻',
            lips: '薄而红润，嘴角微微上扬，显示善良',
            chin: '圆润，代表温柔和包容'
        },
        body: {
            height: '柔美',
            build: '身材偏柔美，曲线优美',
            posture: '举止优雅，动作轻柔，有女性魅力'
        },
        temperament: '温柔内敛，母性十足，细腻体贴',
        voice: '柔和甜美，语速慢'
    },
    '贪狼': {
        face: {
            forehead: '适中但有光泽，显示聪明',
            eyebrows: '眉形优美，眉毛浓密，显示魅力',
            eyes: '妩媚有神，目光流转，有吸引力',
            nose: '鼻梁适中，鼻头略尖，显示敏感',
            lips: '厚而红润，嘴角上扬，笑容迷人',
            chin: '略尖，显示多才多艺'
        },
        body: {
            height: '匀称或偏瘦',
            build: '身材匀称或偏瘦，有魅力',
            posture: '举止优雅，动作迷人，有表演欲'
        },
        temperament: '魅力四射，多才多艺，交际能力强',
        voice: '甜美，语速适中'
    },
    '巨门': {
        face: {
            forehead: '高而宽，代表智慧和口才',
            eyebrows: '眉形清晰，眉毛适中，显示理性',
            eyes: '锐利有神，目光专注，有穿透力',
            nose: '鼻梁直，鼻头适中，显示正直',
            lips: '厚而有型，嘴角紧抿，显示善于言辞',
            chin: '方而有力，显示坚持'
        },
        body: {
            height: '偏瘦或中等',
            build: '身材偏瘦或中等，显得精干',
            posture: '举止利落，手势多，喜欢表达'
        },
        temperament: '口才好，理性冷静，有研究精神',
        voice: '洪亮，语速快'
    },
    '天相': {
        face: {
            forehead: '适中，代表谨慎',
            eyebrows: '眉毛整齐，眉尾略下垂，显示温和',
            eyes: '温和有神，目光稳重，有服务意识',
            nose: '鼻梁适中，鼻头圆润，代表谨慎',
            lips: '薄而适中，嘴角平和，显示稳重',
            chin: '适中，代表协调能力'
        },
        body: {
            height: '适中',
            build: '身材适中，举止得体',
            posture: '举止谨慎，动作得体，注重礼仪'
        },
        temperament: '谨慎细心，服务周到，有协调能力',
        voice: '温和，语速适中'
    },
    '天梁': {
        face: {
            forehead: '宽广，代表智慧和荫庇',
            eyebrows: '眉毛浓密，眉尾上扬，显示威严',
            eyes: '慈祥有神，目光温和，有保护欲',
            nose: '鼻梁高，鼻头有肉，代表正直',
            lips: '厚而适中，嘴角平和，显示善良',
            chin: '方而有力，代表老大性格'
        },
        body: {
            height: '偏高大',
            build: '身材偏高大，站姿挺拔',
            posture: '举止威严，动作有力，有保护欲'
        },
        temperament: '清高正直，有威望，乐于助人',
        voice: '洪亮，语速适中'
    },
    '七杀': {
        face: {
            forehead: '高而宽，代表勇猛',
            eyebrows: '粗浓，眉尾上扬，显示刚毅',
            eyes: '锐利有神，目光凶狠，有杀气',
            nose: '高挺，鼻头尖，显示果断',
            lips: '薄而紧抿，显示冷酷',
            chin: '方而有力，代表坚毅'
        },
        body: {
            height: '健壮',
            build: '身材健壮，肌肉发达，站姿挺拔',
            posture: '举止利落，动作迅速，有爆发力'
        },
        temperament: '勇猛果断，有杀气，冒险精神',
        voice: '洪亮，语速快'
    },
    '破军': {
        face: {
            forehead: '宽窄不一，显示变动',
            eyebrows: '眉形不规则，显示破坏',
            eyes: '不定有神，目光游离，显示变动',
            nose: '鼻梁起伏，鼻头尖，显示消耗',
            lips: '薄而紧抿，或嘴角下垂，显示破坏',
            chin: '尖或凹陷，显示消耗'
        },
        body: {
            height: '偏瘦',
            build: '身材偏瘦，动作敏捷',
            posture: '举止不定，动作快速，有破坏力'
        },
        temperament: '变动不定，有破坏力，开创精神',
        voice: '多变，语速快'
    }
};

// 六吉星的影响
const AUSPICIOUS_STARS_EFFECT = {
    '文昌': '书卷气，眼神中有智慧光芒',
    '文曲': '书卷气，眼神中有智慧光芒',
    '左辅': '贵人相助，气场更加强大',
    '右弼': '贵人相助，气场更加强大',
    '天魁': '贵人气质，举止更加得体',
    '天钺': '贵人气质，举止更加得体'
};

// 六煞星的影响
const MALIGNANT_STARS_EFFECT = {
    '擎羊': '可能有刀疤或外伤痕迹，眼神锐利',
    '陀罗': '动作迟缓但有力，眼神深邃',
    '火星': '脾气暴躁，眼神中有火气',
    '铃星': '声音尖锐，眼神闪烁',
    '地空': '眼神空洞或迷茫，气质独特',
    '地劫': '眼神空洞或迷茫，气质独特'
};

// 男女性别调整
const GENDER_ADJUSTMENTS = {
    '男': {
        '紫微': '更加强调领导气质和威严感，声音洪亮，有磁性',
        '太阳': '更加强调阳光和正义感，声音洪亮，充满激情',
        '武曲': '更加强调刚毅和果断，声音低沉有力',
        '七杀': '更加强调勇猛和冒险精神，声音洪亮有威慑力',
        '贪狼': '更加强调魅力和交际能力，声音甜美有吸引力',
        '天机': '更加强调智慧和谋略，声音柔和思维敏捷',
        '太阴': '更加强调温柔和细腻，声音柔和甜美',
        '天同': '更加强调福气和享受，声音柔和语速慢',
        '廉贞': '更加强调复杂和个性，声音多变有磁性',
        '天府': '更加强调稳重和保守，声音低沉温和',
        '巨门': '更加强调口才和理性，声音洪亮语速快',
        '天相': '更加强调谨慎和服务，声音温和有亲和力',
        '天梁': '更加强调威望和保护，声音洪亮有权威感',
        '破军': '更加强调变动和开创，声音多变有冲击力'
    },
    '女': {
        '紫微': '更加强调贵气和优雅，声音甜美有磁性',
        '太阳': '更加强调阳光和正义感，声音洪亮充满活力',
        '武曲': '更加强调刚毅和果断，女强人气质，声音低沉有力',
        '七杀': '更加强调独立和个性，女军人气质，声音洪亮',
        '贪狼': '更加强调魅力和交际能力，美女气质，声音甜美',
        '天机': '更加强调智慧和文雅，声音柔和轻声细语',
        '太阴': '更加强调温柔和母性，声音柔和甜美',
        '天同': '更加强调福气和温柔，声音柔和笑容可掬',
        '廉贞': '更加强调复杂和艺术，声音多变有艺术感',
        '天府': '更加强调稳重和温柔，声音低沉温和',
        '巨门': '更加强调口才和理性，声音洪亮有说服力',
        '天相': '更加强调谨慎和服务，声音温和有亲和力',
        '天梁': '更加强调威望和保护，长辈气质，声音洪亮',
        '破军': '更加强调独立和开创，独立女性气质，声音多变'
    }
};

// 年龄段外貌特征
const AGE_FEATURES = {
    '少年': {
        skin: '皮肤光滑，有光泽',
        eyes: '眼神清澈，充满好奇',
        overall: '面容稚嫩，未定型，气质纯真，无邪念'
    },
    '青年': {
        skin: '皮肤紧致，有弹性',
        eyes: '眼神明亮，充满活力',
        overall: '面容定型，气质初显，举止大方，充满自信'
    },
    '中年': {
        skin: '皮肤开始松弛，有皱纹',
        eyes: '眼神深邃，有经验感',
        overall: '面容成熟，气质定型，举止稳重，有权威感'
    },
    '老年': {
        skin: '皮肤松弛，皱纹明显',
        eyes: '眼神慈祥，有智慧感',
        overall: '面容慈祥，气质平和，举止缓慢，有长者风范'
    }
};

// 生成外貌描述
function generateAppearance(chartData, gender, age, luckyStars = [], malignantStars = []) {
    const mainStar = chartData.mainStars[0] || '紫微';
    const starFeatures = STAR_FACE_FEATURES[mainStar] || STAR_FACE_FEATURES['紫微'];
    
    // 基础面相
    let appearance = '';
    
    // 面容特征
    appearance += '【面容】\n';
    appearance += `额头${starFeatures.face.forehead}。\n`;
    appearance += `眉毛${starFeatures.face.eyebrows}。\n`;
    appearance += `眼睛${starFeatures.face.eyes}。\n`;
    appearance += `鼻${starFeatures.face.nose}。\n`;
    appearance += `嘴唇${starFeatures.face.lips}。\n`;
    appearance += `下巴${starFeatures.face.chin}。\n\n`;
    
    // 身材特征
    appearance += '【身材】\n';
    appearance += `身高${starFeatures.body.height}左右，${starFeatures.body.build}。\n`;
    appearance += `${starFeatures.body.posture}。\n\n`;
    
    // 气质特征
    appearance += '【气质】\n';
    appearance += `整体气质${starFeatures.temperaturement}。\n`;
    appearance += `声音${starFeatures.voice}。\n\n`;
    
    // 六吉星影响
    if (luckyStars.length > 0) {
        appearance += '【贵人星影响】\n';
        luckyStars.forEach(star => {
            if (AUSPICIOUS_STARS_EFFECT[star]) {
                appearance += `${AUSPICIOUS_STARS_EFFECT[star]}。\n`;
            }
        });
        appearance += '\n';
    }
    
    // 六煞星影响
    if (malignantStars.length > 0) {
        appearance += '【煞星影响】\n';
        malignantStars.forEach(star => {
            if (MALIGNANT_STARS_EFFECT[star]) {
                appearance += `${MALIGNANT_STARS_EFFECT[star]}。\n`;
            }
        });
        appearance += '\n';
    }
    
    // 性别调整
    const genderAdjustment = GENDER_ADJUSTMENTS[gender] ? 
        GENDER_ADJUSTMENTS[gender][mainStar] : '';
    if (genderAdjustment) {
        appearance += '【性别特征】\n';
        appearance += `${genderAdjustment}。\n\n`;
    }
    
    // 年龄特征
    const ageFeatures = AGE_FEATURES[age] || AGE_FEATURES['青年'];
    appearance += '【年龄特征】\n';
    appearance += `${ageFeatures.skin}。\n`;
    appearance += `${ageFeatures.eyes}。\n`;
    appearance += `${ageFeatures.overall}。\n\n`;
    
    // 细节特征（基于星曜和煞星）
    appearance += '【细节特征】\n';
    appearance += generateDetailFeatures(mainStar, malignantStars, age);
    
    return appearance;
}

// 生成细节特征
function generateDetailFeatures(star, malignantStars, age) {
    let details = '';
    
    // 眼神细节
    const eyeDetails = {
        '紫微': '眼角有轻微的鱼尾纹，显示出岁月的沉淀和智慧。',
        '天机': '眼神灵动，思维敏捷，总是带着探索的欲望。',
        '太阳': '目光热情，充满正义感，看人时真诚直接。',
        '武曲': '眼神锐利，透着商业头脑和决断力。',
        '天同': '眼神温和，笑容可掬，让人感觉亲切。',
        '廉贞': '眼神深邃复杂，难以捉摸，透着神秘感。',
        '天府': '眼神稳重温和，透着包容和慈悲。',
        '太阴': '眼神温柔，带着母性光辉，让人如沐春风。',
        '贪狼': '眼神妩媚，充满魅力，吸引着周围的目光。',
        '巨门': '眼神锐利，透着理性，善于洞察人心。',
        '天相': '眼神温和谨慎，透着服务的意识。',
        '天梁': '眼神慈祥威严，透着长者的风范。',
        '七杀': '眼神锐利凶狠，透着杀气和威慑力。',
        '破军': '眼神不定，透着对变动的渴望和不满足。'
    };
    
    details += eyeDetails[star] || eyeDetails['紫微'] + '\n';
    
    // 手势特征
    const gestureDetails = {
        '紫微': '手指修长有力，手势优雅，说话时喜欢用手势强调重点。',
        '天机': '手指修长，手势较多，喜欢比划，显示思维活跃。',
        '太阳': '手势大方有力，充满自信，说话时动作幅度大。',
        '武曲': '手指有力，关节明显，手势干脆利落，不拖泥带水。',
        '天同': '手势轻柔缓慢，动作悠闲，不慌不忙。',
        '廉贞': '手势独特多变，有个性，不拘一格。',
        '天府': '手势稳重缓慢，动作从容，透着长者的风范。',
        '太阴': '手指修长纤细，手势轻柔优雅，充满女性魅力。',
        '贪狼': '手势迷人优雅，有表演欲，吸引周围目光。',
        '巨门': '手势多且有力，喜欢表达，善于辩论。',
        '天相': '手势得体适度，注重礼仪，给人舒适感。',
        '天梁': '手势威严有力，透着保护欲和权威感。',
        '七杀': '手势迅速有力，充满爆发力，透着武将风范。',
        '破军': '手势快速多变，透着变动和开创的欲望。'
    };
    
    details += gestureDetails[star] || gestureDetails['紫微'] + '\n';
    
    // 身体气味（基于煞星）
    if (malignantStars.length > 0) {
        const smellDetails = malignantStars.map(star => {
            const smellMap = {
                '擎羊': '身上有淡淡的汗水味道，充满阳刚之气。',
                '火星': '身上有火药味或烟味，脾气暴躁。',
                '铃星': '身上有刺鼻的味道，声音尖锐。',
                '地空': '身上有种空灵的味道，气质独特。',
                '地劫': '身上有种飘忽的味道，难以捉摸。'
            };
            return smellMap[star] || '';
        }).filter(s => s);
        
        if (smellDetails.length > 0) {
            details += smellDetails[0] + '\n';
        }
    } else {
        // 默认气味
        const defaultSmells = {
            '紫微': '身上有淡淡的古龙水味道，品味高雅。',
            '天机': '身上有淡淡的墨香或书香味道，显示出爱读书的习惯。',
            '太阳': '身上有阳光的味道，充满活力。',
            '武曲': '身上有淡淡的烟草味或古龙水味，透着成熟男性的魅力。',
            '天同': '身上有淡淡的茶香，给人舒适感。',
            '廉贞': '身上有种独特的味道，难以形容。',
            '天府': '身上有淡淡的檀香味，透着稳重和智慧。',
            '太阴': '身上有淡淡的花香，温柔可人。',
            '贪狼': '身上有淡淡的香水味，充满魅力。',
            '巨门': '身上有种理性的味道，透着智慧。',
            '天相': '身上有种干净的味道，给人舒适感。',
            '天梁': '身上有种药草味，透着医者的慈悲。',
            '七杀': '身上有淡淡的血腥味，透着武将的杀气。',
            '破军': '身上有种变动的味道，难以捉摸。'
        };
        details += defaultSmells[star] || defaultSmells['紫微'] + '\n';
    }
    
    // 疤痕或特殊标记（基于煞星）
    if (malignantStars.includes('擎羊')) {
        details += '左眉上有一道浅浅的疤痕，是年轻时打架或冒险留下的纪念。';
    }
    
    return details;
}

// 转换为Markdown格式
function convertAppearanceToMarkdown(appearance) {
    return `## 9. 外貌特征（基于面相学）\n\n${appearance}`;
}

// 导出所有函数
window.FaceReadingGenerator = {
    generateAppearance,
    generateDetailFeatures,
    convertAppearanceToMarkdown,
    STAR_FACE_FEATURES,
    AUSPICIOUS_STARS_EFFECT,
    MALIGNANT_STARS_EFFECT,
    GENDER_ADJUSTMENTS,
    AGE_FEATURES
};
