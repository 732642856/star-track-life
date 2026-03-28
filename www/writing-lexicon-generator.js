/**
 * 写作词库生成器（整合用户本地的写作词库）
 * 基于词库数据增强人物小传的外貌、心理、细节描写
 */

// 外貌描写词库（从词库中提取的核心内容）
const APPEARANCE_LEXICON = {
    // 脸型
    faceShape: [
        '国字脸，棱角分明，透着刚毅',
        '瓜子脸，轮廓优美，显得文雅',
        '圆脸，圆润饱满，给人亲切感',
        '方脸，方正有力，显示稳重',
        '长脸，修长秀气，透着书卷气',
        '椭圆脸，五官协调，气质出众'
    ],
    
    // 眼睛
    eyes: [
        '丹凤眼，眼尾上挑，含情脉脉',
        '杏眼，圆润明亮，清澈如水',
        '桃花眼，眼角含笑，魅力迷人',
        '凤眼，细长有神，威严端庄',
        '柳叶眼，如柳叶般修长，秀美温婉',
        '双眼皮，眼窝深邃，目光炯炯',
        '单眼皮，线条简洁，透着朴实',
        '眼睛略凸，炯炯有神，充满活力'
    ],
    
    // 眉毛
    eyebrows: [
        '剑眉，浓密上扬，英气逼人',
        '柳眉，纤细修长，如柳叶般秀美',
        '弯眉，弯曲优美，温和亲切',
        '浓眉，黑密有力，充满阳刚之气',
        '淡眉，细淡稀疏，文雅清秀',
        '卧蚕眉，浓密弯曲，威严端庄',
        '八字眉，眉尾下垂，显得温和'
    ],
    
    // 鼻子
    nose: [
        '高挺鼻梁，鼻头圆润，贵气十足',
        '鼻梁直挺，鼻尖微翘，聪明伶俐',
        '蒜头鼻，圆润厚实，憨厚朴实',
        '鹰钩鼻，鼻尖微钩，精明能干',
        '朝天鼻，鼻孔微露，活泼开朗',
        '塌鼻子，鼻梁不高，温和友善'
    ],
    
    // 嘴唇
    lips: [
        '嘴唇饱满红润，微微上扬，笑意盈盈',
        '薄唇精致，线条清晰，干练果断',
        '厚唇丰润，亲和力强，给人安全感',
        '樱桃小嘴，精致可爱，娇俏迷人',
        '嘴角微垂，显得严肃认真',
        '嘴角上扬，总是带着笑容'
    ],
    
    // 肤色
    skin: [
        '白皙细腻，如瓷娃娃般精致',
        '健康小麦色，充满阳光活力',
        '肤色黑黄，朴实勤劳',
        '红润光泽，气色极佳',
        '略显黝黑，透着健康',
        '苍白清秀，书卷气十足'
    ],
    
    // 发型
    hair: [
        '乌黑浓密，光亮顺滑',
        '微卷波浪，柔顺飘逸',
        '短发利落，干净清爽',
        '长发披肩，温柔飘逸',
        '花白稀疏，透着智慧',
        '金黄明亮，充满活力'
    ],
    
    // 身材
    body: [
        '身材修长挺拔，如松柏般挺立',
        '身材匀称结实，充满力量',
        '身材微胖，圆润可爱',
        '身材清瘦，文雅清秀',
        '身材高大威猛，气势逼人',
        '身材娇小玲珑，可爱迷人'
    ],
    
    // 整体气质
    temperament: [
        '气质高贵典雅，自带王者风范',
        '气质温文尔雅，如沐春风',
        '气质刚毅坚定，威严正直',
        '气质活泼开朗，阳光灿烂',
        '气质沉稳内敛，深藏不露',
        '气质潇洒飘逸，不拘一格',
        '气质朴实憨厚，亲切可人',
        '气质精致优雅，如艺术品'
    ]
};

// 心理描写词库
const PSYCHOLOGY_LEXICON = {
    // 喜悦
    joy: [
        '眼睛弯成月牙，嘴角不住地上扬',
        '嘴角不自觉地微微上扬，眉眼间满是笑意',
        '眼中闪烁着喜悦的光芒，整个人都明亮起来',
        '脸上洋溢着幸福的光彩，如春风拂面'
    ],
    
    // 愤怒
    anger: [
        '眉毛紧皱，眼中怒火中烧',
        '拳头紧紧握住，青筋暴起',
        '脸色铁青，眼神锐利如刀',
        '胸口剧烈起伏，压抑着怒火'
    ],
    
    // 悲伤
    sadness: [
        '眼眶微红，眸中水雾弥漫',
        '嘴角紧抿，眼角滑落晶莹泪珠',
        '脸色苍白，神情黯然，整个人仿佛失去了光彩',
        '低头沉默，眼中满是哀伤'
    ],
    
    // 恐惧
    fear: [
        '瞳孔放大，眼中满是惊恐',
        '手微微颤抖，身体僵硬',
        '脸色煞白，嘴唇发抖',
        '呼吸急促，不住地四处张望'
    ],
    
    // 紧张
    nervous: [
        '手心出汗，手指无意识地绞在一起',
        '喉结滚动，吞咽口水',
        '眼神游离，不敢直视对方',
        '呼吸急促，心跳加速'
    ],
    
    // 思考
    thinking: [
        '眉头微皱，手指轻敲桌面',
        '眼神深邃，仿佛陷入沉思',
        '下意识地点头，时而摇头',
        '轻咬嘴唇，专注思考'
    ],
    
    // 惊讶
    surprise: [
        '眼睛瞪大，嘴巴微张',
        '眉毛高高扬起，难以置信',
        '身体猛地一震，如触电般',
        '眨了眨眼，不敢相信眼前所见'
    ],
    
    // 轻蔑
    contempt: [
        '嘴角勾起一抹冷笑，眼中满是轻蔑',
        '眼皮微抬，从鼻腔发出冷哼',
        '下巴微扬，高傲地看着对方',
        '眼中不屑，仿佛在看什么不值得看的东西'
    ]
};

// 细节描写词库（动作、习惯等）
const DETAIL_LEXICON = {
    // 手势
    gestures: [
        '手指修长纤细，动作优雅',
        '双手粗糙有力，充满劳动痕迹',
        '手指圆润，指甲修剪整齐',
        '手心有茧，显示常年劳作',
        '手指修长，关节分明，适合弹琴作画'
    ],
    
    // 走路姿势
    walking: [
        '步伐轻盈，如风拂过',
        '步伐稳健，每一步都踏实有力',
        '步伐急促，仿佛在追赶什么',
        '步伐缓慢，优雅从容',
        '步伐拖沓，懒散随意'
    ],
    
    // 站姿
    standing: [
        '站姿笔直，如松柏挺立',
        '站姿随意，放松自然',
        '站姿优雅，姿态优美',
        '站姿稳重，给人安全感',
        '站姿懒散，有些驼背'
    ],
    
    // 坐姿
    sitting: [
        '坐姿端正，背部挺直',
        '坐姿随意，半躺在椅子上',
        '坐姿优雅，双腿并拢',
        '坐姿稳重，双手放在膝盖上',
        '坐姿懒散，身体歪斜'
    ],
    
    // 声音
    voice: [
        '声音洪亮如钟，充满力量',
        '声音温润如玉，如春风拂面',
        '声音清脆悦耳，如珠落玉盘',
        '声音低沉磁性，充满魅力',
        '声音沙哑粗糙，透着沧桑',
        '声音轻柔婉转，如涓涓细流'
    ],
    
    // 微笑
    smile: [
        '嘴角微微上扬，如春风拂面',
        '笑起来眼睛弯成月牙，满是笑意',
        '笑容灿烂，如阳光般温暖',
        '微笑含蓄，嘴角轻轻勾起',
        '开怀大笑，笑声爽朗'
    ]
};

/**
 * 生成外貌描写（基于词库）
 * @param {string} star - 主星
 * @param {string} gender - 性别
 * @param {number} age - 年龄
 * @returns {string} 外貌描写
 */
function generateAppearanceFromLexicon(star, gender, age) {
    let appearance = '';
    
    // 根据主星选择不同的描写风格
    const styles = {
        '紫微': '高贵',
        '天机': '文雅',
        '太阳': '阳光',
        '武曲': '刚毅',
        '天同': '温和',
        '廉贞': '神秘',
        '天府': '稳重',
        '太阴': '温柔',
        '贪狼': '迷人',
        '巨门': '精明',
        '天相': '谦逊',
        '天梁': '威严',
        '七杀': '威慑',
        '破军': '多变'
    };
    
    const style = styles[star] || '普通';
    
    // 随机选择各个部位
    const faceShape = _randomPickLocal(APPEARANCE_LEXICON.faceShape);
    const eyes = _randomPickLocal(APPEARANCE_LEXICON.eyes);
    const eyebrows = _randomPickLocal(APPEARANCE_LEXICON.eyebrows);
    const nose = _randomPickLocal(APPEARANCE_LEXICON.nose);
    const lips = _randomPickLocal(APPEARANCE_LEXICON.lips);
    const skin = _randomPickLocal(APPEARANCE_LEXICON.skin);
    const hair = _randomPickLocal(APPEARANCE_LEXICON.hair);
    const body = _randomPickLocal(APPEARANCE_LEXICON.body);
    const temperament = _randomPickLocal(APPEARANCE_LEXICON.temperament);
    
    // 根据性别调整
    const genderPrefix = gender === 'male' ? '他' : '她';
    const genderDesc = gender === 'male' ? '英俊' : '美丽';
    
    // 根据年龄调整
    let ageDesc = '';
    if (age < 30) {
        ageDesc = '青春年少';
    } else if (age < 50) {
        ageDesc = '正值壮年';
    } else {
        ageDesc = '年岁渐长';
    }
    
    appearance += `**外貌描写（基于写作词库）**\n\n`;
    appearance += `${genderPrefix}是${ageDesc}的${genderDesc}人物，${genderDesc}的外貌给人留下深刻印象。\n\n`;
    
    appearance += `**面容特征**：\n`;
    appearance += `- ${genderPrefix}长着一副${style}的${faceShape}\n`;
    appearance += `- ${eyes}，${eyebrows}\n`;
    appearance += `- ${nose}，${lips}\n`;
    appearance += `- ${skin}，${hair}\n\n`;
    
    appearance += `**身材气质**：\n`;
    appearance += `- ${genderPrefix}${body}，${temperament}\n`;
    appearance += `- ${genderDesc}的${style}气质，让人难以忘怀\n\n`;
    
    // 随机添加1-2个细节
    const gesture = _randomPickLocal(DETAIL_LEXICON.gestures);
    const voice = _randomPickLocal(DETAIL_LEXICON.voice);
    
    appearance += `**细节特征**：\n`;
    appearance += `- ${genderPrefix}${gesture}\n`;
    appearance += `- ${genderPrefix}${voice}\n`;
    
    return appearance;
}

/**
 * 生成心理描写（基于词库）
 * @param {string} star - 主星
 * @param {string} emotion - 情绪类型
 * @returns {string} 心理描写
 */
function generatePsychologyFromLexicon(star, emotion) {
    let psychology = '';
    
    const gender = ['他', '她'][Math.floor(Math.random() * 2)];
    
    psychology += `**心理描写（${emotion}）**\n\n`;
    
    // 根据情绪选择描写
    const emotionMap = {
        '喜悦': PSYCHOLOGY_LEXICON.joy,
        '愤怒': PSYCHOLOGY_LEXICON.anger,
        '悲伤': PSYCHOLOGY_LEXICON.sadness,
        '恐惧': PSYCHOLOGY_LEXICON.fear,
        '紧张': PSYCHOLOGY_LEXICON.nervous,
        '思考': PSYCHOLOGY_LEXICON.thinking,
        '惊讶': PSYCHOLOGY_LEXICON.surprise,
        '轻蔑': PSYCHOLOGY_LEXICON.contempt
    };
    
    const descriptions = emotionMap[emotion] || emotionMap['思考'];
    
    // 随机选择1-2条描写
    const selected = descriptions.slice(0, Math.floor(Math.random() * 2) + 1);
    
    selected.forEach(desc => {
        psychology += `- ${gender}${desc}\n`;
    });
    
    return psychology;
}

/**
 * 生成细节描写（基于词库）
 * @param {string} star - 主星
 * @returns {string} 细节描写
 */
function generateDetailFromLexicon(star) {
    let detail = '';
    
    const gender = ['他', '她'][Math.floor(Math.random() * 2)];
    
    detail += `**细节描写**\n\n`;
    
    const walking = _randomPickLocal(DETAIL_LEXICON.walking);
    const standing = _randomPickLocal(DETAIL_LEXICON.standing);
    const sitting = _randomPickLocal(DETAIL_LEXICON.sitting);
    const smile = _randomPickLocal(DETAIL_LEXICON.smile);
    
    detail += `- ${gender}${walking}\n`;
    detail += `- ${gender}${standing}\n`;
    detail += `- ${gender}${sitting}\n`;
    detail += `- ${gender}${smile}\n`;
    
    return detail;
}

// 随机选择工具
// 私有 randomPick，避免覆盖 character-bio-enhanced-generator.js 里带 fallback 的同名全局函数
function _randomPickLocal(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

// 导出
window.WritingLexiconGenerator = {
    generateAppearanceFromLexicon,
    generatePsychologyFromLexicon,
    generateDetailFromLexicon,
    APPEARANCE_LEXICON,
    PSYCHOLOGY_LEXICON,
    DETAIL_LEXICON
};
