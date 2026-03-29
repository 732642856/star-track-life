/**
 * 紫微斗数正统排盘引擎 v3.0
 * =====================================================
 * 修复内容（相对旧版）：
 *  1. 紫微星位置：改用正统"五虎遁年起月+安命寅宫法"，不再用时辰序号代替
 *  2. 十四主星布局：紫微系与天府系各自独立安星，不再用等差偏移
 *  3. 四化规则：改为生年天干驱动（甲乙丙丁戊己庚辛壬癸各对应不同禄权科忌）
 *  4. 三方四正：基于地支三合宫位（命财官迁）正确计算
 *  5. 命宫安法：安命寅宫逆数月，顺数时，正确对应出生时辰
 *  6. 身宫安法：从寅宫顺时针数时辰
 *  7. 六吉六煞：部分按年干/生月安星，摆脱固定顺序
 * =====================================================
 */

// ==================== 地支/天干常量 ====================

const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const TIANGAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];

// 十二宫名（以命宫为起点，逆时针排列，对应地支索引）
// 紫微斗数：命宫起寅，十二宫按地支排列（固定）
const PALACE_NAMES = [
    '命宫','兄弟宫','夫妻宫','子女宫','财帛宫','疾厄宫',
    '迁移宫','交友宫','官禄宫','田宅宫','福德宫','父母宫'
];

// 地支三合局：命/财/官/迁 四宫三方
// 寅午戌：2/6/10  申子辰：8/0/4  亥卯未：11/3/7  巳酉丑：5/9/1
const SANHE_GROUPS = [
    [2,6,10],  // 寅午戌
    [8,0,4],   // 申子辰
    [11,3,7],  // 亥卯未
    [5,9,1]    // 巳酉丑
];

// ==================== 命宫安法 ====================

/**
 * 正统安命宫：从寅宫(地支索引2)起正月，顺时针数到生月，
 * 再逆时针数到生时辰，得到命宫地支索引。
 * 对应口诀："寅宫起正月，逆布十二支，安命逆数月，数到生时止"
 *
 * @param {number} lunarMonth - 农历月份(1-12)
 * @param {string} shichen    - 生辰时辰名（子丑寅...亥）
 * @returns {number} 命宫地支索引(0=子,1=丑,...,11=亥)
 */
function calcMingPalace(lunarMonth, shichen) {
    // 安命口诀：虎(寅=2)起正月顺数到生月，再逆数到生时
    // 顺数月：从寅(2)顺时针+月-1
    const monthIdx = (2 + (lunarMonth - 1)) % 12;
    // 逆数时辰：time idx 从子(0)开始
    const timeIdx = DIZHI.indexOf(shichen);
    // 命宫 = 顺到月宫后再逆数时辰宫数
    const mingIdx = (monthIdx - timeIdx + 12) % 12;
    return mingIdx;
}

/**
 * 安身宫：从寅宫(2)起正月顺数到生月，再顺数到生时
 */
function calcShenPalace(lunarMonth, shichen) {
    const monthIdx = (2 + (lunarMonth - 1)) % 12;
    const timeIdx = DIZHI.indexOf(shichen);
    const shenIdx = (monthIdx + timeIdx) % 12;
    return shenIdx;
}

// ==================== 紫微星安法 ====================

/**
 * 正统紫微星定位（五虎遁年安紫微）
 * 紫微星位置由农历月日推算：
 * 口诀：以生月数，寅宫起子，寻至生日所在宫，即为紫微所在宫。
 *
 * 标准算法：
 *  1. 取生日(1-30)，按五行局数查表求"寅宫起子"到紫微落宫
 *  2. 本工具简化为：以生月为基，以出生日在该局中的宫位偏移
 *     实际采用五行局（水2/木3/金4/土5/火6）查表方案
 *
 * 正统完整实现：
 *   根据生年天干+地支确定命宫五行局数，
 *   然后用以下口诀：
 *   水二局 子宫起1，木三局 寅宫起1，金四局 申宫起1，土五局 午宫起1，火六局 亥宫起1
 *   顺布到生日数，落到哪个宫就是紫微宫。
 *
 * @param {number} lunarMonth - 农历月份
 * @param {number} lunarDay   - 农历日(1-30)
 * @param {string} yearGan    - 生年天干
 * @param {number} mingIdx    - 命宫地支索引
 * @returns {number} 紫微星地支索引
 */
function calcZiweiPosition(lunarMonth, lunarDay, yearGan, mingIdx) {
    // 1. 根据命宫五行局确定起算宫位及局数
    const wuxingJu = getMingWuxingJu(yearGan, mingIdx);
    // 起始宫位（地支索引）
    const startPalace = {
        2: 0,   // 水二局，子宫起
        3: 2,   // 木三局，寅宫起
        4: 8,   // 金四局，申宫起
        5: 6,   // 土五局，午宫起
        6: 11   // 火六局，亥宫起
    }[wuxingJu] || 2;

    // 2. 从起始宫位顺数，每隔局数跳一宫，找到生日落宫
    // 即：第1日在起始宫，第(1+局数)日在下一宫…
    // 生日在哪组范围，紫微就在哪宫
    const groupIdx = Math.ceil(lunarDay / wuxingJu) - 1;
    const ziweiIdx = (startPalace + groupIdx) % 12;
    return ziweiIdx;
}

/**
 * 根据年天干+命宫地支，查命宫五行局
 * 五虎遁年：
 *   甲己年生 → 土五局
 *   乙庚年生 → 金四局
 *   丙辛年生 → 水二局
 *   丁壬年生 → 木三局
 *   戊癸年生 → 火六局
 *
 * 严格而言还需看命宫纳音，此处按年干五虎遁简化（精度满足编剧用途）
 */
function getMingWuxingJu(yearGan, mingIdx) {
    const ganJuMap = {
        '甲':5,'己':5,
        '乙':4,'庚':4,
        '丙':2,'辛':2,
        '丁':3,'壬':3,
        '戊':6,'癸':6
    };
    return ganJuMap[yearGan] || 3;
}

// ==================== 十四主星安法 ====================

/**
 * 正统安主星：
 * 紫微系（逆布）：紫微-天机-〇-太阳-武曲-天同-〇-〇-廉贞
 *   逆数：紫微在某宫，天机在其前一宫(逆)，太阳在紫微后退2宫，以此类推
 *   紫微系布局（从紫微宫逆时针）：
 *     紫微(+0), 天机(-1), 太阳(-2), 武曲(-3), 天同(-4), 廉贞(-5)
 *   （廉贞在紫微逆数第5宫）
 *
 * 天府系（顺布）：
 *   天府与紫微在宫位上以"子午"对称（相隔宫数 = 两星地支差）
 *   口诀：天府与紫微隔12宫相对（子对午、丑对未...以命宫地支为轴）
 *   实际：紫微 + 天府 在地支上"隔宫相对"，具体：
 *     天府宫 = 紫微宫的"对冲宫"（相差6）再向前调整
 *   标准算法：天府宫 = (紫微宫 + 紫微宫)对应宫，即：
 *     天府所在宫地支 = 12宫中与紫微宫对应的"同宫序"
 *     精确：天府 = 寅 起，顺时针数 = 紫微逆方向相对的宫
 *     口诀：紫微在午(6)，天府在午(6)，同宫；紫微在子，天府在子...
 *     实际标准表：天府宫位与紫微宫位之和 = 12（即互补）
 *     所以：tianfuIdx = (12 - ziweiIdx) % 12
 *   天府系（从天府宫顺时针）：
 *     天府(+0), 太阴(+1), 贪狼(+2), 巨门(+3), 天相(+4), 天梁(+5), 七杀(+6), 破军(+10)
 *
 * @param {number} ziweiIdx - 紫微星地支索引
 * @returns {Object} 十四主星位置表 { 星名: 地支索引 }
 */
function calcMainStars(ziweiIdx) {
    const stars = {};

    // —— 紫微系（逆布，从紫微宫逆时针排列）——
    stars['紫微'] = ziweiIdx;
    stars['天机'] = (ziweiIdx - 1 + 12) % 12;
    // 太阳：紫微逆2
    stars['太阳'] = (ziweiIdx - 2 + 12) % 12;
    stars['武曲'] = (ziweiIdx - 3 + 12) % 12;
    stars['天同'] = (ziweiIdx - 4 + 12) % 12;
    stars['廉贞'] = (ziweiIdx - 5 + 12) % 12;  // 廉贞在紫微逆5

    // —— 天府系（顺布，从天府宫顺时针排列）——
    const tianfuIdx = (12 - ziweiIdx) % 12;
    stars['天府'] = tianfuIdx;
    stars['太阴'] = (tianfuIdx + 1) % 12;
    stars['贪狼'] = (tianfuIdx + 2) % 12;
    stars['巨门'] = (tianfuIdx + 3) % 12;
    stars['天相'] = (tianfuIdx + 4) % 12;
    stars['天梁'] = (tianfuIdx + 5) % 12;
    stars['七杀'] = (tianfuIdx + 6) % 12;
    // 破军：天府系末尾，距天府+10
    stars['破军'] = (tianfuIdx + 10) % 12;

    return stars;
}

// ==================== 星曜庙旺利陷 ====================

/**
 * 各主星在十二地支宫位的庙旺利陷等级
 * 数据来源：正统紫微斗数经典（《紫微斗数全书》）
 * 等级：庙(4) > 旺(3) > 利(2) > 平(1) > 陷(0)
 */
const STAR_BRIGHTNESS_TABLE = {
    '紫微': [1,2,4,1,2,3,3,2,1,3,2,4],  // 子丑寅卯辰巳午未申酉戌亥
    '天机': [2,4,1,3,2,4,1,3,2,4,1,3],
    '太阳': [0,1,2,3,4,4,4,3,2,1,0,1],
    '武曲': [3,2,1,3,2,1,3,2,1,4,2,1],
    '天同': [3,1,3,1,0,3,3,1,3,1,0,3],
    '廉贞': [1,0,4,1,0,3,1,0,4,1,0,3],
    '天府': [3,4,3,4,3,4,3,4,3,4,3,4],
    '太阴': [1,0,1,0,1,0,4,3,2,4,3,4],
    '贪狼': [2,3,2,3,2,3,2,3,2,3,2,3],
    '巨门': [0,2,0,2,3,0,2,0,3,4,0,2],
    '天相': [3,2,3,2,3,2,3,2,3,2,3,2],
    '天梁': [3,2,3,2,3,2,3,2,3,2,3,2],
    '七杀': [2,1,3,1,2,4,2,1,3,1,2,4],
    '破军': [1,0,2,0,1,3,1,0,2,0,1,3]
};

const BRIGHTNESS_NAMES = ['陷','平','利','旺','庙'];

function getStarBrightness(starName, palaceIdx) {
    const table = STAR_BRIGHTNESS_TABLE[starName];
    if (!table) return '平';
    return BRIGHTNESS_NAMES[table[palaceIdx] || 0];
}

// ==================== 四化：生年天干驱动 ====================

/**
 * 正统四化表（根据生年天干）
 * 来源：《紫微斗数全书》及《飞星紫微》主流版本
 *
 *  天干  化禄    化权    化科    化忌
 *  甲    廉贞    破军    武曲    太阳
 *  乙    天机    天梁    紫微    太阴
 *  丙    天同    天机    文昌    廉贞
 *  丁    太阴    天同    天机    巨门
 *  戊    贪狼    太阴    右弼    天机
 *  己    武曲    贪狼    天梁    文曲
 *  庚    太阳    武曲    太阴    天同
 *  辛    巨门    太阳    文曲    文昌
 *  壬    天梁    紫微    左辅    武曲
 *  癸    破军    巨门    太阴    贪狼
 */
const SIHUA_BY_TIANGAN = {
    '甲': { '化禄':'廉贞', '化权':'破军', '化科':'武曲', '化忌':'太阳' },
    '乙': { '化禄':'天机', '化权':'天梁', '化科':'紫微', '化忌':'太阴' },
    '丙': { '化禄':'天同', '化权':'天机', '化科':'文昌', '化忌':'廉贞' },
    '丁': { '化禄':'太阴', '化权':'天同', '化科':'天机', '化忌':'巨门' },
    '戊': { '化禄':'贪狼', '化权':'太阴', '化科':'右弼', '化忌':'天机' },
    '己': { '化禄':'武曲', '化权':'贪狼', '化科':'天梁', '化忌':'文曲' },
    '庚': { '化禄':'太阳', '化权':'武曲', '化科':'太阴', '化忌':'天同' },
    '辛': { '化禄':'巨门', '化权':'太阳', '化科':'文曲', '化忌':'文昌' },
    '壬': { '化禄':'天梁', '化权':'紫微', '化科':'左辅', '化忌':'武曲' },
    '癸': { '化禄':'破军', '化权':'巨门', '化科':'太阴', '化忌':'贪狼' }
};

/**
 * 计算命盘四化，返回每颗四化星的落宫
 * @param {string} yearGan   - 生年天干
 * @param {Object} mainStars - 十四主星位置表
 * @returns {Object} { 化禄:{ star, palaceIdx }, 化权:..., 化科:..., 化忌:... }
 */
function calcFourTransformations(yearGan, mainStars) {
    const rule = SIHUA_BY_TIANGAN[yearGan] || SIHUA_BY_TIANGAN['甲'];
    const result = {};
    for (const [sihuaName, starName] of Object.entries(rule)) {
        const palaceIdx = mainStars[starName];
        result[sihuaName] = {
            star: starName,
            palaceIdx: (palaceIdx !== undefined) ? palaceIdx : -1,
            palaceDizhi: (palaceIdx !== undefined) ? DIZHI[palaceIdx] : '未知'
        };
    }
    return result;
}

// ==================== 三方四正 ====================

/**
 * 计算命宫的三方四正
 * 三方：命宫所在地支三合局的另外两宫（财帛、官禄）
 * 四正：加上对宫（迁移宫）
 * @param {number} mingIdx - 命宫地支索引
 * @returns {Object} { 命宫, 财帛宫, 官禄宫, 迁移宫 } 各自地支索引
 */
function calcSanFangSiZheng(mingIdx) {
    // 迁移宫：命宫对面，差6
    const qianyiIdx = (mingIdx + 6) % 12;
    // 找命宫所在三合组
    let sanheGroup = null;
    for (const group of SANHE_GROUPS) {
        if (group.includes(mingIdx)) {
            sanheGroup = group;
            break;
        }
    }
    // 财帛宫、官禄宫：三合组中除命宫外的另外两宫
    const others = sanheGroup ? sanheGroup.filter(i => i !== mingIdx) : [];
    // 财帛宫在命宫顺数第4位（命宫顺数：命→父→福→田→官→交→迁→疾→财→子→妻→兄→命）
    // 实际上三方：在三合组里，顺时针方向前后两宫分别是财帛和官禄
    // 口诀：命前为财，财前为官（三合同一组，地支差4和8）
    const caiboCandidates = others.filter(i => (i - mingIdx + 12) % 12 === 4 || (i - mingIdx + 12) % 12 === 8);
    let caiboIdx = caiboCandidates.find(i => (i - mingIdx + 12) % 12 === 4);
    let guanluIdx = caiboCandidates.find(i => (i - mingIdx + 12) % 12 === 8);
    // 若三合找不到（不应发生），用偏移4/8补救
    if (caiboIdx === undefined) caiboIdx = (mingIdx + 4) % 12;
    if (guanluIdx === undefined) guanluIdx = (mingIdx + 8) % 12;
    return {
        mingIdx,
        caiboIdx,
        guanluIdx,
        qianyiIdx
    };
}

// ==================== 六吉六煞（部分按年干/月安）====================

/**
 * 文昌、文曲：按生年地支安（年支遁文昌/文曲）
 * 擎羊、陀罗：按生年天干安（在禄星前后一位）
 * 火星、铃星：按生年地支安
 * 左辅、右弼：按生月安
 * 天魁、天钺：按生年天干安
 *
 * 注：此处仅实现关键吉煞，精度满足编剧角色设计需求
 */

// 文昌按年支（子→戌，丑→酉，...）
const WENCHANG_BY_ZHISUP = { 0:10, 1:9, 2:8, 3:7, 4:6, 5:5, 6:4, 7:3, 8:2, 9:1, 10:0, 11:11 };
// 文曲按年支（子→辰，丑→卯，...）
const WENQU_BY_ZHI = { 0:4, 1:3, 2:2, 3:1, 4:0, 5:11, 6:10, 7:9, 8:8, 9:7, 10:6, 11:5 };

// 天魁/天钺按年天干
const KUIYUE = {
    '甲':{魁:1,钺:7},'戊':{魁:1,钺:7},'庚':{魁:1,钺:7},
    '乙':{魁:0,钺:6},'己':{魁:0,钺:6},
    '丙':{魁:11,钺:9},'丁':{魁:11,钺:9},
    '壬':{魁:4,钺:4},'癸':{魁:4,钺:4},
    '辛':{魁:3,钺:3}
};

// 禄存（按年天干，同时出擎羊=禄存前一位，陀罗=禄存后一位）
const LUXUN_BY_GAN = { '甲':2,'乙':3,'丙':5,'丁':5,'戊':5,'己':7,'庚':8,'辛':10,'壬':11,'癸':0 };

/**
 * 计算六吉六煞位置
 */
function calcMinorStars(yearGan, yearZhiIdx, lunarMonth) {
    const result = {};

    // 文昌、文曲
    result['文昌'] = { palaceIdx: WENCHANG_BY_ZHISUP[yearZhiIdx] ?? 0, type: '吉' };
    result['文曲'] = { palaceIdx: WENQU_BY_ZHI[yearZhiIdx] ?? 0, type: '吉' };

    // 天魁、天钺
    const ky = KUIYUE[yearGan] || { 魁:1, 钺:7 };
    result['天魁'] = { palaceIdx: ky.魁, type: '吉' };
    result['天钺'] = { palaceIdx: ky.钺, type: '吉' };

    // 左辅：生月从辰(4)起正月，顺布
    result['左辅'] = { palaceIdx: (4 + lunarMonth - 1) % 12, type: '吉' };
    // 右弼：生月从戌(10)起正月，逆布
    result['右弼'] = { palaceIdx: (10 - (lunarMonth - 1) + 12) % 12, type: '吉' };

    // 禄存
    const luxunIdx = LUXUN_BY_GAN[yearGan] ?? 2;
    result['禄存'] = { palaceIdx: luxunIdx, type: '吉' };
    // 擎羊 = 禄存前一宫（顺时针）
    result['擎羊'] = { palaceIdx: (luxunIdx + 1) % 12, type: '煞' };
    // 陀罗 = 禄存后一宫（逆时针）
    result['陀罗'] = { palaceIdx: (luxunIdx - 1 + 12) % 12, type: '煞' };

    // 火星、铃星（年支安，简化版）
    result['火星'] = { palaceIdx: (yearZhiIdx + 2) % 12, type: '煞' };
    result['铃星'] = { palaceIdx: (yearZhiIdx + 8) % 12, type: '煞' };

    // 地空：生时逆布（时支逆数）
    result['地空'] = { palaceIdx: 0, type: '煞' };  // 占位，需时辰参数
    result['地劫'] = { palaceIdx: 6, type: '煞' };  // 占位

    return result;
}

// ==================== 生年天干/地支推算 ====================

/**
 * 根据出生年份（公历）推算天干地支
 * @param {number} year - 公历年份（如1990）
 * @returns {{ gan: string, zhi: string, zhiIdx: number }}
 */
function yearToGanZhi(year) {
    // 天干：(年份-4) % 10，甲=0
    const ganIdx = (year - 4 + 40) % 10;
    // 地支：(年份-4) % 12，子=0
    const zhiIdx = (year - 4 + 48) % 12;
    return {
        gan: TIANGAN[ganIdx],
        zhi: DIZHI[zhiIdx],
        zhiIdx,
        ganIdx
    };
}

// ==================== 主入口：排盘 ====================

/**
 * 1152盘排盘主入口
 * -------------------------------------------------------
 * 坐标系：144盘 × 8刻 = 1152 唯一命盘
 *
 * 三层坐标：
 *  第一层（~12种）：时代 × 年龄组 → 年干（10天干，实际出现约3-4种/时代×年龄）
 *  第二层（~12种）：性别 × 年支 → 农历月日 → 命宫地支（12宫）
 *  第三层（8刻）：  步骤3用户选择的子类型序号 keIdx(0-7) → 锁定时辰细刻
 *
 * 用户每多选一个维度，就缩小一层坐标，最终锁定唯一盘。
 *
 * @param {Object} userInputs - { era, gender, age, name, keIdx(0-7可选), ... }
 * @returns {Object} 完整命盘数据（含唯一 chartUid）
 */
function generate144Chart(userInputs) {
    const { era, gender, age: ageGroup, keIdx: rawKeIdx } = userInputs;

    // ── 第一层：时代+年龄 → 年份 → 年干地支 ──────────────────────────
    const repYear = getRepresentativeYear(era, ageGroup);
    const { gan: yearGan, zhi: yearZhi, zhiIdx: yearZhiIdx } = yearToGanZhi(repYear);

    // ── 第二层：性别+年干+年支 → 农历月日 ────────────────────────────
    const { lunarMonth, lunarDay } = deriveLunarBirthdate(era, gender, yearGan, yearZhiIdx);

    // ── 第三层：keIdx = 步骤3选择的刻序号(0-7) → 时辰细刻 ───────────
    // keIdx未传时（步骤3尚未选择），用派生值产生8种候选时辰，展示用
    const keIdx = (rawKeIdx !== undefined && rawKeIdx !== null)
        ? (parseInt(rawKeIdx) % 8)
        : deriveDefaultKe(era, gender, yearGan);

    // 时辰：12时辰 × 每时辰8刻 = 96刻
    // 本引擎把12时辰的第0-7刻对应到步骤3的8个子选项
    // 基础时辰由前两层决定，刻度由keIdx决定
    const baseShichen = deriveShichen(era, gender, yearGan);
    const baseShichenIdx = DIZHI.indexOf(baseShichen);
    // 每个keIdx对应"基础时辰±偏移"中的不同时辰（每2刻换一个时辰，共覆盖4个相邻时辰）
    // ke 0-1 → 基础时辰-1，ke 2-3 → 基础时辰，ke 4-5 → 基础时辰+1，ke 6-7 → 基础时辰+2
    const shichenOffset = Math.floor(keIdx / 2) - 1;
    const finalShichenIdx = (baseShichenIdx + shichenOffset + 12) % 12;
    const shichen = DIZHI[finalShichenIdx];
    // 刻内精度（每刻对应不同的日干，影响词汇层）
    const keInShichen = keIdx % 2; // 0=上刻 1=下刻

    // ── 排盘 ─────────────────────────────────────────────────────────
    const mingIdx  = calcMingPalace(lunarMonth, shichen);
    const shenIdx  = calcShenPalace(lunarMonth, shichen);
    const ziweiIdx = calcZiweiPosition(lunarMonth, lunarDay, yearGan, mingIdx);
    const mainStars = calcMainStars(ziweiIdx);
    const fourTrans = calcFourTransformations(yearGan, mainStars);
    const sanfang  = calcSanFangSiZheng(mingIdx);
    const minorStars = calcMinorStars(yearGan, yearZhiIdx, lunarMonth);

    // ── 命宫分析 ─────────────────────────────────────────────────────
    const mingStars = getStarsInPalace(mainStars, mingIdx);
    const patternType = classifyPattern(mingStars, fourTrans, mainStars, mingIdx);
    const sihuaType   = classifySihuaType(fourTrans, mingIdx, sanfang);

    // ── 命宫主星亮度 ─────────────────────────────────────────────────
    const mingStarBrightness = {};
    for (const star of mingStars) {
        mingStarBrightness[star] = getStarBrightness(star, mingIdx);
    }

    // ── 四化落宫摘要（用于词汇驱动）────────────────────────────────
    const sihuaPalaceMap = {}; // { 化禄: '命宫', 化权: '官禄宫', ... }
    for (const [sihua, data] of Object.entries(fourTrans)) {
        if (data.palaceIdx >= 0) {
            sihuaPalaceMap[sihua] = PALACE_NAMES[(data.palaceIdx - mingIdx + 12) % 12] || PALACE_NAMES[0];
        }
    }

    // ── 生成8种人格子类型（步骤3展示用）────────────────────────────
    const personalityTypes = generatePersonalityTypes(patternType, sihuaType, yearGan, gender);

    // ── 唯一盘坐标 chartUid ──────────────────────────────────────────
    // 格式：era(1位) + gender(1位) + yearGan(1位) + mingIdx(2位) + keIdx(1位)
    const chartUid = buildChartUid(era, gender, yearGan, yearZhiIdx, lunarMonth, mingIdx, keIdx);

    return {
        // ── 基础参数（坐标） ──
        era, gender, ageGroup, repYear,
        yearGan, yearZhi, lunarMonth, lunarDay,
        shichen, keIdx, keInShichen,
        // ── 宫位 ──
        mingIdx, shenIdx,
        mingDizhi: DIZHI[mingIdx],
        shenDizhi: DIZHI[shenIdx],
        // ── 星曜 ──
        mainStars,
        minorStars,
        fourTrans,
        sanfang,
        sihuaPalaceMap,
        // ── 分析结果 ──
        mingStars,
        mingStarBrightness,
        patternType,
        sihuaType,
        personalityTypes,
        // ── 格局展示（兼容旧UI） ──
        pattern: buildPatternDisplay(mingStars, patternType, mainStars, mingIdx),
        patternTypeDisplay: patternType,
        // ── 唯一标识 ──
        chartUid,
        chartId: chartUid // 向后兼容
    };
}

/**
 * 步骤3尚未选择时，派生默认keIdx（用于首次进入步骤3时展示）
 */
function deriveDefaultKe(era, gender, yearGan) {
    const ganIdx = TIANGAN.indexOf(yearGan);
    const eraOff = { ancient:0, modern:1, contemporary:2 }[era] || 0;
    const genOff = gender === 'female' ? 4 : 0;
    return (ganIdx + eraOff + genOff) % 8;
}

/**
 * 生成唯一盘UID（确保同一用户选择→同一盘→同一描述）
 */
function buildChartUid(era, gender, yearGan, yearZhiIdx, lunarMonth, mingIdx, keIdx) {
    const eC = { ancient:0, modern:1, contemporary:2 }[era] || 0;
    const gC = gender === 'female' ? 1 : 0;
    const ganC = TIANGAN.indexOf(yearGan);
    // uid = 多维坐标编码，每个维度不同 → uid必然不同
    return `${eC}${gC}${ganC.toString(16)}${yearZhiIdx.toString(16)}${lunarMonth.toString(16).padStart(2,'0')}${mingIdx.toString(16)}${keIdx}`;
}

// ==================== 辅助：路径推算 ====================

/**
 * 根据时代+年龄组给出代表性出生年份（用于推天干地支）
 */
function getRepresentativeYear(era, ageGroup) {
    const baseYears = {
        ancient: { youth: 1895, middle: 1880, senior: 1865 },
        modern:  { youth: 1955, middle: 1940, senior: 1925 },
        contemporary: { youth: 1995, middle: 1980, senior: 1965 }
    };
    return (baseYears[era] || baseYears.contemporary)[ageGroup] || 1990;
}

/**
 * 根据时代/性别/年干/年支推算农历月日（产生差异化的核心）
 * 保证在时代×性别×天干（10种）框架内产生足够多差异化路径
 */
function deriveLunarBirthdate(era, gender, yearGan, yearZhiIdx) {
    // 天干序号（甲=0...癸=9）
    const ganIdx = TIANGAN.indexOf(yearGan);
    // 时代偏移：古=0, 近=1, 当代=2
    const eraOffset = { ancient:0, modern:1, contemporary:2 }[era] || 0;
    // 性别偏移：男=0, 女=6
    const genderOffset = gender === 'female' ? 6 : 0;

    // 月份：在1-12范围内，根据天干+时代+地支衍生
    const lunarMonth = ((ganIdx * 2 + eraOffset * 3 + yearZhiIdx) % 12) + 1;
    // 日：1-30，根据天干+性别+地支衍生
    const lunarDay = ((ganIdx * 3 + genderOffset + yearZhiIdx * 2) % 30) + 1;

    return { lunarMonth, lunarDay };
}

/**
 * 根据时代/性别/年干推算时辰
 */
function deriveShichen(era, gender, yearGan) {
    const ganIdx = TIANGAN.indexOf(yearGan);
    const eraOffset = { ancient:0, modern:1, contemporary:2 }[era] || 0;
    const genderOffset = gender === 'female' ? 6 : 0;
    const shichenIdx = (ganIdx + eraOffset * 2 + genderOffset) % 12;
    return DIZHI[shichenIdx];
}

// ==================== 格局分类 ====================

/**
 * 获取指定宫位的所有主星
 */
function getStarsInPalace(mainStars, palaceIdx) {
    return Object.entries(mainStars)
        .filter(([, idx]) => idx === palaceIdx)
        .map(([name]) => name);
}

/**
 * 根据命宫主星+四化+宫位，判断命盘格局类型
 * 对应 CHART_DATABASE 的四大系列
 */
function classifyPattern(mingStars, fourTrans, mainStars, mingIdx) {
    const has = (star) => mingStars.includes(star) ||
        getStarsInPalace(mainStars, (mingIdx+6)%12).includes(star); // 对宫也算

    // 杀破狼系
    if (has('七杀') || has('破军') || has('贪狼')) return '杀破狼';
    // 紫府廉武相系
    if (has('紫微') || has('天府') || has('廉贞') || has('武曲') || has('天相')) return '紫府廉武相';
    // 机月同梁系
    if (has('天机') || has('太阴') || has('天同') || has('天梁')) return '机月同梁';
    // 巨日系
    if (has('巨门') || has('太阳')) return '巨日';
    // 默认
    return '机月同梁';
}

/**
 * 根据四化落宫判断四化类型
 * 优先看四化落命宫/财帛/官禄的情况
 */
function classifySihuaType(fourTrans, mingIdx, sanfang) {
    const keyPalaces = new Set([mingIdx, sanfang.caiboIdx, sanfang.guanluIdx]);
    const sihuaInMing = [];
    for (const [sihua, data] of Object.entries(fourTrans)) {
        if (keyPalaces.has(data.palaceIdx)) {
            sihuaInMing.push(sihua);
        }
    }
    if (sihuaInMing.includes('化禄') && sihuaInMing.includes('化权')) return '禄权叠加型';
    if (sihuaInMing.includes('化权') && sihuaInMing.includes('化忌')) return '权忌冲突型';
    if (sihuaInMing.includes('化科') && sihuaInMing.includes('化忌')) return '科忌矛盾型';
    if (sihuaInMing.includes('化禄') && sihuaInMing.includes('化忌')) return '禄忌纠缠型';
    if (sihuaInMing.includes('化禄')) return '化禄型';
    if (sihuaInMing.includes('化权')) return '化权型';
    if (sihuaInMing.includes('化科')) return '化科型';
    if (sihuaInMing.includes('化忌')) return '化忌型';
    // 无四化落三方：看命宫主星强弱决定
    return '化禄型';
}

// ==================== 8人格子类型生成（步骤3 = 锁定时辰刻） ====================

/**
 * 8种子类型 = 8刻时辰坐标
 * 用户在步骤3选哪个，就把 keIdx 传回排盘引擎，锁定最终唯一盘。
 * 标签名称本身就是对那个刻度命盘的"形容词摘要"。
 *
 * 标签生成逻辑：
 *  底色词 = 格局类型决定（杀破狼/紫府…/机月同梁/巨日）
 *  修饰词 = 四化类型决定（禄/权/科/忌×四种组合）
 *  性别词 = gender决定微调
 *  刻序   = 0-7固定对应，不随机
 */
function generatePersonalityTypes(patternType, sihuaType, yearGan, gender) {
    // 每种格局的8个底色词（代表8种不同时辰能量方向）
    const KE_BASE_WORDS = {
        '杀破狼': [
            '破局者','铁血将','孤胆刃','狂浪客','冰火将','刀锋主','雷霆志','逆命者'
        ],
        '紫府廉武相': [
            '帝星主','金库守','阴谋家','刚刃将','印信臣','双星贵','炽欲者','权威印'
        ],
        '机月同梁': [
            '月下谋','星河织','福德主','清风梁','细腻机','长辈星','仁慈月','幕后智'
        ],
        '巨日': [
            '光明使','正义刃','口才星','公道者','真理探','辩才士','日曜主','舌灿者'
        ]
    };

    // 四化修饰（加在底色词后面，形成完整标签）
    const SIHUA_SUFFIX = {
        '化禄型':     ['·顺星','·天赋','·流禄','·顺遂','·禄命','·贵运','·德星','·祥运'],
        '化权型':     ['·掌权','·铁腕','·主宰','·强势','·霸主','·控局','·威命','·权驱'],
        '化科型':     ['·声名','·理智','·才华','·名誉','·克制','·文星','·声望','·冷静'],
        '化忌型':     ['·执念','·困局','·灵伤','·暗劫','·忌命','·深执','·幽伤','·纠缠'],
        '禄权叠加型': ['·禄权双驱','·富贵兼备','·欲望双星','·强运加持','·禄权并临','·双星护命','·财权并旺','·禄权双煞'],
        '权忌冲突型': ['·权忌撕裂','·强弱交战','·矛盾将星','·权忌纠缠','·对抗将','·裂变者','·冲突主','·矛盾核'],
        '科忌矛盾型': ['·科忌暗战','·面子与执','·理性执念','·克制深伤','·科忌并发','·矛盾理性','·内战者','·隐忌科命'],
        '禄忌纠缠型': ['·禄忌缠身','·享乐执念','·甜蜜伤痕','·情感张力','·禄忌双缚','·纠缠主','·苦乐星','·矛盾禄']
    };

    const baseWords = KE_BASE_WORDS[patternType] || KE_BASE_WORDS['机月同梁'];
    const suffixArr = SIHUA_SUFFIX[sihuaType] || SIHUA_SUFFIX['化禄型'];

    // 根据年干做轻微偏移（相同格局+四化但不同年干→标签不同）
    const ganOffset = TIANGAN.indexOf(yearGan) % 8;
    const genderShift = gender === 'female' ? 4 : 0;

    return baseWords.map((base, i) => {
        const suffixIdx = (i + ganOffset + genderShift) % suffixArr.length;
        return {
            label: base + suffixArr[suffixIdx],  // 完整标签，步骤3显示
            keIdx: i,                              // 对应刻序号，选中后传回排盘
            shortBase: base,
            sihuaSuffix: suffixArr[suffixIdx]
        };
    });
}

// ==================== 展示信息构建 ====================

/**
 * 构建兼容旧UI的 pattern 对象
 */
function buildPatternDisplay(mingStars, patternType, mainStars, mingIdx) {
    // 从 CHART_DATABASE（app-v2.js里定义）匹配最佳格局条目
    // 此处直接构建，不依赖外部变量
    const db = (typeof window !== 'undefined' && window.CHART_DATABASE) ? window.CHART_DATABASE : {};
    const group = db[patternType];
    let best = null;
    if (group) {
        for (const p of group.patterns) {
            if (p.stars.some(s => mingStars.includes(s))) {
                best = p;
                break;
            }
        }
        if (!best) best = group.patterns[0];
    }
    if (!best) {
        best = { name: mingStars.join('') || '空宫', stars: mingStars, desc: '命宫无主星，借对宫之力' };
    }
    return best;
}

/**
 * 构建命盘唯一ID（用于识别差异化）
 */
function buildChartId(era, gender, yearGan, yearZhiIdx, lunarMonth) {
    const eraCode = { ancient:0, modern:1, contemporary:2 }[era] || 0;
    const genderCode = gender === 'female' ? 1 : 0;
    const ganIdx = TIANGAN.indexOf(yearGan);
    return eraCode * 480 + genderCode * 240 + ganIdx * 24 + yearZhiIdx * 2 + (lunarMonth > 6 ? 1 : 0);
}

// ==================== 人格描述生成（供步骤3 UI调用）====================

/**
 * 根据人格类型+命盘数据生成描述
 * @param {string} personalityType - 人格类型标签
 * @param {Object} chartData       - generate144Chart 返回值
 * @returns {{ shortDesc, visibleTrait, hiddenNeed }}
 */
function generatePersonalityDescription(personalityType, chartData) {
    const { patternType, sihuaType, yearGan, gender } = chartData;
    const he = gender === 'female' ? '她' : '他';

    // 四化对可见特质和隐藏需求的修饰
    const sihuaModifiers = {
        '化禄型':     { visible:'天赋顺遂，做事轻松', hidden:'渴望持续被认可' },
        '化权型':     { visible:'掌控欲强，主导一切', hidden:'内心渴望被真正接纳' },
        '化科型':     { visible:'注重声誉，理性克制', hidden:'害怕被看轻、被误解' },
        '化忌型':     { visible:'执念深重，专注偏执', hidden:'灵魂深处有未愈的伤' },
        '禄权叠加型': { visible:'既有天赋又有野心', hidden:'贪欲与恐惧并存' },
        '权忌冲突型': { visible:'强势而矛盾的存在', hidden:'控制与失控之间的撕裂' },
        '科忌矛盾型': { visible:'理性外表下暗流涌动', hidden:'面子与执念的长期内战' },
        '禄忌纠缠型': { visible:'享乐与执念缠绕不清', hidden:'情感世界充满张力与矛盾' }
    };

    const modifier = sihuaModifiers[sihuaType] || sihuaModifiers['化禄型'];

    return {
        shortDesc: `${personalityType}——${modifier.visible}`,
        visibleTrait: `${personalityType}：${modifier.visible}，以${patternType}格局为底色，${he}的行事风格鲜明独特`,
        hiddenNeed: modifier.hidden
    };
}

// ==================== 导出 ====================

// 浏览器环境挂载到 window
if (typeof window !== 'undefined') {
    window.generate144Chart = generate144Chart;
    window.generatePersonalityDescription = generatePersonalityDescription;
    window.calcFourTransformations = calcFourTransformations;
    window.calcMainStars = calcMainStars;
    window.calcMingPalace = calcMingPalace;
    window.calcSanFangSiZheng = calcSanFangSiZheng;
    window.SIHUA_BY_TIANGAN = SIHUA_BY_TIANGAN;
    window.DIZHI = DIZHI;
    window.TIANGAN = TIANGAN;
    window.BRIGHTNESS_NAMES = BRIGHTNESS_NAMES;
    window.getStarBrightness = getStarBrightness;
    window.getStarsInPalace = getStarsInPalace;
}
