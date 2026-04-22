/**
 * 星轨人生 · Star Track Life
 * 双语星曜数据层 · Bilingual Star Data Layer
 *
 * 设计原则 · Design Principles:
 * - 中文：命理术语 + 编剧创作语言并重
 * - English: Academic Jyotish-inspired style — precise, evocative, character-driven
 * - 结构支持 i18n 扩展至更多语言
 *
 * 英文措辞参考：
 *   Bangalore Venkata Raman — "How to Judge a Horoscope"
 *   Hart deFouw & Robert Svoboda — "Light on Life"
 */

// ─── i18n 语言选择器 ──────────────────────────────────────────────
// 支持：'zh'（简体中文）| 'zh-TW'（繁體中文）| 'en'（English）
const SUPPORTED_LANGUAGES = ['zh', 'zh-TW', 'en'];

// 从 localStorage 读取上次选择，默认简体中文
let CURRENT_LANG = (typeof localStorage !== 'undefined' && localStorage.getItem('star_track_lang')) || 'zh';

/** 取当前语言文本，降级链：zh-TW→zh，en→zh */
function t(obj) {
    if (!obj) return '';
    return obj[CURRENT_LANG] || obj['zh'] || '';
}

/** 切换语言，并持久化到 localStorage */
function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;
    CURRENT_LANG = lang;
    // 同步到 window 对象，让其他脚本可以访问
    if (typeof window !== 'undefined') {
        window.CURRENT_LANG = lang;
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('star_track_lang', lang);
    }
    // 通知全局刷新
    if (typeof window !== 'undefined') {
        document.documentElement.lang = lang === 'en' ? 'en' : (lang === 'zh-TW' ? 'zh-TW' : 'zh-CN');
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }
}

// 初始化时也同步到 window
if (typeof window !== 'undefined') {
    window.CURRENT_LANG = CURRENT_LANG;
}

// ─── 十二宫位三语定义 ─────────────────────────────────────────────
const PALACES_I18N = [
    {
        index: 0,
        zh: { name: '命宫', alias: '命身之宫', desc: '人格核心、先天运势、性格本质' },
        'zh-TW': { name: '命宮', alias: '命身之宮', desc: '人格核心、先天運勢、性格本質' },
        en: { name: 'Life Palace', alias: 'Palace of the Self', desc: 'The core of identity, innate destiny, and the fundamental nature of character' }
    },
    {
        index: 1,
        zh: { name: '兄弟宫', alias: '手足之宫', desc: '兄弟姐妹、母亲、事业规模' },
        'zh-TW': { name: '兄弟宮', alias: '手足之宮', desc: '兄弟姐妹、母親、事業規模' },
        en: { name: 'Siblings Palace', alias: 'Palace of Brethren', desc: 'Fraternal bonds, the maternal figure, and the scope of enterprise' }
    },
    {
        index: 2,
        zh: { name: '夫妻宫', alias: '姻缘之宫', desc: '婚姻关系、配偶特质、感情发展' },
        'zh-TW': { name: '夫妻宮', alias: '姻緣之宮', desc: '婚姻關係、配偶特質、感情發展' },
        en: { name: 'Spouse Palace', alias: 'Palace of Union', desc: 'The nature of intimate bonds, the quality of partnership, and the arc of romance' }
    },
    {
        index: 3,
        zh: { name: '子女宫', alias: '子息之宫', desc: '子女缘分、桃花位、合作运' },
        'zh-TW': { name: '子女宮', alias: '子息之宮', desc: '子女緣分、桃花位、合作運' },
        en: { name: 'Children Palace', alias: 'Palace of Progeny', desc: 'The bond with children, creative output, romantic allure, and collaborative fortune' }
    },
    {
        index: 4,
        zh: { name: '财帛宫', alias: '财库之宫', desc: '财富结构、收入模式、金钱观念' },
        'zh-TW': { name: '財帛宮', alias: '財庫之宮', desc: '財富結構、收入模式、金錢觀念' },
        en: { name: 'Wealth Palace', alias: 'Palace of Treasure', desc: 'The architecture of wealth, modes of income, and the character\'s relationship with material resources' }
    },
    {
        index: 5,
        zh: { name: '疾厄宫', alias: '健康之宫', desc: '健康状况、体质、工作环境' },
        'zh-TW': { name: '疾厄宮', alias: '健康之宮', desc: '健康狀況、體質、工作環境' },
        en: { name: 'Health Palace', alias: 'Palace of Adversity', desc: 'Bodily constitution, latent vulnerabilities, and the conditions of daily labour' }
    },
    {
        index: 6,
        zh: { name: '迁移宫', alias: '外出之宫', desc: '外部环境、异地发展、社交能力' },
        'zh-TW': { name: '遷移宮', alias: '外出之宮', desc: '外部環境、異地發展、社交能力' },
        en: { name: 'Travel Palace', alias: 'Palace of Migration', desc: 'The outer world\'s reception of the self, fortune in foreign lands, and social reach' }
    },
    {
        index: 7,
        zh: { name: '交友宫', alias: '人际之宫', desc: '朋友人脉、团队合作、社会关系' },
        'zh-TW': { name: '交友宮', alias: '人際之宮', desc: '朋友人脈、團隊合作、社會關係' },
        en: { name: 'Friends Palace', alias: 'Palace of Association', desc: 'The quality of alliances, the nature of peers, and the power of collective endeavour' }
    },
    {
        index: 8,
        zh: { name: '官禄宫', alias: '事业之宫', desc: '职业发展、社会地位、人生成就' },
        'zh-TW': { name: '官祿宮', alias: '事業之宮', desc: '職業發展、社會地位、人生成就' },
        en: { name: 'Career Palace', alias: 'Palace of Vocation', desc: 'The path of ambition, social standing, and the summit of worldly achievement' }
    },
    {
        index: 9,
        zh: { name: '田宅宫', alias: '家宅之宫', desc: '家庭背景、不动产、财富库' },
        'zh-TW': { name: '田宅宮', alias: '家宅之宮', desc: '家庭背景、不動產、財富庫' },
        en: { name: 'Property Palace', alias: 'Palace of Roots', desc: 'Ancestral foundations, accumulated property, and the hidden treasury of fortune' }
    },
    {
        index: 10,
        zh: { name: '福德宫', alias: '精神之宫', desc: '幸福感、价值观、精神生活、福报' },
        'zh-TW': { name: '福德宮', alias: '精神之宮', desc: '幸福感、價值觀、精神生活、福報' },
        en: { name: 'Virtue Palace', alias: 'Palace of Spiritual Fortune', desc: 'Inner contentment, the moral compass, and the depth of karmic merit carried into this life' }
    },
    {
        index: 11,
        zh: { name: '父母宫', alias: '长辈之宫', desc: '原生家庭、学历修养、长辈支持' },
        'zh-TW': { name: '父母宮', alias: '長輩之宮', desc: '原生家庭、學歷修養、長輩支持' },
        en: { name: 'Parents Palace', alias: 'Palace of Elders', desc: 'The shaping influence of origin, educational refinement, and the endowment of those who came before' }
    }
];

// ─── 十四主星双语完整数据 ─────────────────────────────────────────
const MAIN_STARS_I18N = {

    '紫微': {
        zh: {
            name: '紫微',
            title: '帝星、尊星',
            element: '己土（阴土）',
            nature: '北斗主星',
            trait: '尊贵、权威、领导力、稳重',
            personality: '天生具有领导气质，做事稳重有分寸，重视面子和尊严，有强烈的责任感和使命感',
            strength: '领导力强、决策果断、有远见、能服众',
            weakness: '过于自负、听不进意见、好面子、容易独断专行',
            dramaticCore: '孤独的王者——越是站在高处，越难被真正理解。他的弱点不是软弱，而是无人与之并肩',
            palaceDesc: {
                '命宫': '紫微坐命，天生贵气，领导才能出众，一生多得贵人相助。性格稳重，做事有分寸，但易过于自信，难以接受批评。',
                '夫妻宫': '配偶条件优越，可能是权贵之后或事业有成者。婚姻关系稳定，但可能存在地位差距，内心难以平等相待。',
                '官禄宫': '事业运极佳，适合担任领导职务。官运亨通，能爬到高位，但需防孤立无援。',
                '财帛宫': '财源稳定，正财旺盛，适合管理大项目。但花销排场讲究，财聚财散皆有定数。',
                '福德宫': '精神生活富足，有高雅的品味，但内心常有难言的孤独感。',
                '迁移宫': '外出得贵人相助，在外有威望和影响力，适合异地发展。',
                '交友宫': '朋友多为权贵，人脉层次高，但真心相交者甚少。',
                '疾厄宫': '体质较好，但易有脾胃方面的问题，压力过大时尤需注意。',
                '田宅宫': '家宅富贵，不动产丰厚，能守住祖业，置业能力强。',
                '子女宫': '子女聪明有出息，能继承家业或有所成就，子女缘分深厚。',
                '兄弟宫': '兄弟姐妹中有显贵之人，手足关系和睦，可得兄弟助力。',
                '父母宫': '父母有社会地位，家境优渥，能得到长辈的庇护和支持。'
            }
        },
        en: {
            name: 'Zi Wei',
            title: 'The Emperor Star',
            element: 'Yin Earth (己土)',
            nature: 'Primary Star of the Northern Dipper',
            trait: 'Sovereignty, authority, natural leadership, gravitas',
            mentalTendencies: 'Commanding and self-possessed. Those governed by Zi Wei carry an innate sense of purpose that others instinctively recognise — and sometimes resent. They do not seek power; they inhabit it.',
            generalTendencies: 'They are deliberate in action, unwilling to be hurried by lesser urgencies. Their counsel is sought, their disapproval feared. Yet this very eminence isolates them: the higher the throne, the fewer the true companions. They struggle to accept criticism and may mistake stubbornness for principle.',
            dramaticCore: 'The Solitary Sovereign — the deeper tragedy is not defeat, but the impossibility of being truly known at the summit.',
            palaceDesc: {
                'Life Palace': 'Zi Wei in the Life Palace confers an air of inborn distinction. This is a character shaped to lead — steady, deliberate, conscious of dignity. Their flaw is the same as their gift: they cannot easily descend from their own pedestal to meet others as equals.',
                'Spouse Palace': 'The partner is likely to be accomplished, well-born, or formidable in their own right. The union is stable, yet inequality of station can quietly erode genuine intimacy.',
                'Career Palace': 'The ascent to authority is written into the chart. This character is not merely ambitious — they are fated for prominence. The danger lies in the isolation that comes with the summit.',
                'Wealth Palace': 'Wealth flows steadily and through legitimate means. But the standards of living are exacting; the character spends as befits their self-image, and the treasury reflects both fortune and temperament.',
                'Virtue Palace': 'The inner life is rich, cultivated, and marked by refined taste. Yet a persistent undercurrent of loneliness runs beneath the composed exterior — the loneliness of the unreachable.',
                'Travel Palace': 'In the outer world, this character is recognised and assisted by those of consequence. Foreign shores and distant endeavours hold particular promise.',
                'Friends Palace': 'The circle is select and elevated, but the warmth within it is often formal. True friendship is rare; most relationships carry the asymmetry of the admirer and the admired.',
                'Health Palace': 'Constitution is generally robust, but the digestive system is the body\'s barometer of stress. When the burden of command becomes excessive, the body speaks first.',
                'Property Palace': 'Ancestral wealth or accumulated property is substantial. The character is a natural custodian of what has been built.',
                'Children Palace': 'Children are capable and tend toward distinction. The parent-child bond carries mutual pride, though warmth can be formal.',
                'Siblings Palace': 'Among the siblings, at least one rises to prominence. Fraternal relations are generally harmonious and mutually supportive.',
                'Parents Palace': 'The family of origin is socially established. The character inherits both material advantage and the weight of expectation.'
            }
        }
    },

    '天机': {
        zh: {
            name: '天机',
            title: '智慧星、谋臣星',
            element: '乙木（阴木）',
            nature: '北斗主星',
            trait: '智慧、谋略、灵活、机敏',
            personality: '思维敏捷，善于分析，足智多谋，但容易多疑犹豫，思虑过多',
            strength: '聪明机智、善于谋略、学习能力强、适应力好',
            weakness: '多疑犹豫、思虑过多、容易焦虑、缺乏行动力',
            dramaticCore: '活在自己头脑构建的迷宫里——能看清所有人，却看不清自己最该迈出的那一步',
            palaceDesc: {
                '命宫': '天机坐命，聪明过人，善于谋略，但易犹豫不决。思路清晰却难以笃定行动，适合从事策划、参谋类工作。',
                '夫妻宫': '配偶聪明能干，但感情易有波折，双方都善于分析对方，难以放下戒备。',
                '官禄宫': '事业适合策划、技术、咨询类。宜动脑不宜劳力，幕后运筹往往强过台前亮相。',
                '财帛宫': '财运多变，善于理财但易投机，财来财去需稳住心态。',
                '福德宫': '精神生活丰富，喜欢思考和学习，但思虑过重时易失眠焦虑。',
                '迁移宫': '在外机敏灵活，善于应变，适合流动性工作。',
                '交友宫': '朋友多为聪明之人，但交情可能不深，点头之交多于肝胆相照。',
                '疾厄宫': '易有神经系统、肝胆方面的问题，情绪管理是养生关键。',
                '田宅宫': '家宅变动较多，置业需谨慎，搬迁之事或多于常人。',
                '子女宫': '子女聪明好学，但可能较为叛逆，亲子沟通需要技巧。',
                '兄弟宫': '兄弟姐妹聪明伶俐，但关系可能不够亲密。',
                '父母宫': '父母聪明，但可能关系较为疏离，长辈更重智识传授。'
            }
        },
        en: {
            name: 'Tian Ji',
            title: 'The Strategist Star',
            element: 'Yin Wood (乙木)',
            nature: 'Primary Star of the Northern Dipper',
            trait: 'Intellect, strategy, adaptability, acute perception',
            mentalTendencies: 'Ceaselessly analytical. The mind of Tian Ji is never still — it reads between lines, maps consequences, and rehearses ten possible futures before breakfast. This is the counsellor\'s mind, the architect\'s mind, the mind that sees what others miss.',
            generalTendencies: 'They are brilliant advisors but uncertain commanders. The same capacity for analysis that illuminates every situation becomes a trap when the situation demands decisive action. Doubt is the shadow that accompanies their gifts. They thrive behind the throne more comfortably than upon it.',
            dramaticCore: 'The Strategist Who Cannot Commit — they can map every exit from a burning building yet be the last to leave, still reconsidering the optimal route.',
            palaceDesc: {
                'Life Palace': 'Tian Ji in the Life Palace produces a character of exceptional mental agility — perceptive, adaptable, multi-layered. Their tragedy is the paralysis of over-thinking: the architect of perfect plans who delays the laying of the first stone.',
                'Spouse Palace': 'The partner is clever and capable, but both parties are perpetual analysts of the relationship itself. The dynamic is stimulating and exhausting in equal measure.',
                'Career Palace': 'The natural domain is strategy, planning, research, and counsel. This character earns their place through the acuity of their thinking, not the forcefulness of their will.',
                'Wealth Palace': 'Financial fortunes are variable. The analytical mind can identify opportunity, but the same mind can over-complicate simple decisions and drift toward speculative thinking.',
                'Virtue Palace': 'The inner life is rich with thought, curiosity, and the pleasure of ideas. The shadow side is insomnia, low-grade anxiety, and the exhaustion of a mind that cannot be switched off.',
                'Travel Palace': 'In the outer world, adaptability and quick intelligence are assets. Movement suits this character; stasis does not.',
                'Friends Palace': 'Associates are typically intelligent and stimulating, but the bonds tend toward the intellectual rather than the intimate.',
                'Health Palace': 'The nervous system and liver are the most sensitive indicators of imbalance. When the mind is under siege, the body registers the campaign.',
                'Property Palace': 'Residence changes more frequently than average. The character has difficulty putting down permanent roots.',
                'Children Palace': 'Children are bright and questioning, possibly rebellious. The relationship is most nourishing when it remains intellectually engaging.',
                'Siblings Palace': 'Siblings are quick-witted but emotionally somewhat distant. The family bond is characterised by mutual respect rather than deep warmth.',
                'Parents Palace': 'The parental influence is predominantly intellectual. Emotional closeness may have been subordinated to the transmission of ideas and skill.'
            }
        }
    },

    '太阳': {
        zh: {
            name: '太阳',
            title: '日星、光明星',
            element: '丙火（阳火）',
            nature: '北斗主星',
            trait: '热情、光明、名声、博爱',
            personality: '光明磊落，热情大方，有领导魅力，喜欢帮助他人，但有时会过于张扬',
            strength: '光明正大、热情助人、有公众魅力、积极向上',
            weakness: '过于张扬、爱面子、容易操劳过度、有时忽略内心真实需求',
            dramaticCore: '永远向外燃烧的人——给了所有人光和热，却从未有人关心过这颗星是否也会疲倦',
            palaceDesc: {
                '命宫': '太阳坐命，光明磊落，热情大方，有公众魅力。适合公众事业，但易操劳过度，忽略自身需求。',
                '夫妻宫': '配偶热情开朗，但感情易因忙碌疏于经营。需要学会在公与私之间找到平衡。',
                '官禄宫': '事业运光明，适合教育、演艺、公关等行业，名声是最大的资产。',
                '财帛宫': '财运光明正大，正财稳定，适合公开行业求财，但花销慷慨，积蓄需要有意为之。',
                '福德宫': '精神生活积极向上，喜欢帮助他人，但内心深处渴望被人看见与珍视。',
                '迁移宫': '在外名声好，能得贵人相助，异地发展比本地更顺遂。',
                '交友宫': '朋友众多，人脉广泛，但需防因热情而招来是非。',
                '疾厄宫': '体质较好，但易有心血管、眼睛方面的问题，过度操劳是最大隐患。',
                '田宅宫': '家宅光明，但可能因事业忙碌而疏于家庭。',
                '子女宫': '子女孝顺有出息，子女缘分深厚，但可能给予孩子的时间不够。',
                '兄弟宫': '兄弟姐妹关系和睦，能得手足助力。',
                '父母宫': '父亲有地位，家境较好，能得到父亲的支持和期许。'
            }
        },
        en: {
            name: 'Tai Yang',
            title: 'The Solar Star',
            element: 'Yang Fire (丙火)',
            nature: 'Primary Star of the Northern Dipper',
            trait: 'Radiance, generosity, public renown, beneficence',
            mentalTendencies: 'Naturally outward-facing and magnanimous. The Tai Yang character is drawn to the public sphere with the same instinct that turns a sunflower toward the light. They are energised by the giving of themselves — their warmth, their time, their visibility.',
            generalTendencies: 'They are at their best when illuminating others, championing causes, and occupying the stage that fate has prepared for them. The danger is the depletion that comes from perpetual generosity. They may radiate so constantly that they forget to look inward — to ask whether the fire that warms everyone around them has anything left to burn.',
            dramaticCore: 'The Eternal Giver — the most poignant question in their story is never asked aloud: who takes care of the one who takes care of everyone?',
            palaceDesc: {
                'Life Palace': 'Tai Yang in the Life Palace produces a character of genuine warmth and public presence. They are the light in the room — and they know it. The dramatic vulnerability: they may come to confuse their public radiance with their private self, losing the latter in service to the former.',
                'Spouse Palace': 'The partner is likely vivid and outgoing. Yet the relationship can be neglected in the rush of public commitments. The union thrives only when private warmth is given the same attention as public performance.',
                'Career Palace': 'The public arena — education, performance, media, civic leadership — is the natural theatre for this character. Reputation is both the weapon and the wound.',
                'Wealth Palace': 'Income comes through visible, legitimate channels and tends to be steady. Spending is generous, sometimes extravagantly so; accumulation requires deliberate restraint.',
                'Virtue Palace': 'The inner world is fundamentally optimistic and purpose-driven. The hidden longing is to be seen and valued for something beyond the brightness — to be loved, not merely admired.',
                'Travel Palace': 'The outer world receives this character well; reputation precedes them and opens doors. Foreign ventures are particularly favoured.',
                'Friends Palace': 'The social circle is vast but of varying depth. The character must distinguish those who bask in the warmth from those who would tend the fire.',
                'Health Palace': 'Cardiovascular health and the eyes are the most sensitive registers. Overwork is the primary threat; the body pays the bill that the spirit refuses to acknowledge.',
                'Property Palace': 'The home may be bright and welcoming but occasionally neglected in favour of public engagement.',
                'Children Palace': 'Offspring are typically capable and responsive. The tension is one of presence: this character gives abundantly to the world and must consciously reserve enough for those closest.',
                'Siblings Palace': 'Fraternal bonds are warm and mutually supportive.',
                'Parents Palace': 'The father\'s standing in the world shapes the character\'s self-conception. They carry both the gift of that inheritance and its expectations.'
            }
        }
    },

    '武曲': {
        zh: {
            name: '武曲',
            title: '财星、将星',
            element: '辛金（阴金）',
            nature: '北斗主星',
            trait: '财运、刚毅、实干、果断',
            personality: '刚毅果断，实干精神强，重视实际利益，做事雷厉风行，但可能过于固执',
            strength: '果断坚决、执行力强、理财能力佳、吃苦耐劳',
            weakness: '刚愎自用、过于现实、缺乏情趣、容易在感情中显得冷漠',
            dramaticCore: '以行动代替语言的人——他们用成就证明爱，却不知道对方需要的其实只是一句话',
            palaceDesc: {
                '命宫': '武曲坐命，刚毅果断，有实干精神，意志力强。在感情上可能显得冷漠，但内心其实有深沉的责任感。',
                '夫妻宫': '配偶务实能干，但感情可能较淡，两人皆以行动而非言语表达爱意，长期相处需学会开口。',
                '官禄宫': '事业运强，适合金融、军警、工程等行业，执行力是最大竞争力。',
                '财帛宫': '财运极佳，正财偏财皆旺，理财能力一流，是天生的财富管理者。',
                '福德宫': '精神生活务实，重视实际利益，但内心深处渴望一种说不清的满足感。',
                '迁移宫': '在外务实能干，但可能人际关系一般，不善应酬。',
                '交友宫': '朋友多为务实之人，但交情可能不深，点头之交为主。',
                '疾厄宫': '体质强健，但易有呼吸系统、骨骼方面的问题。',
                '田宅宫': '家宅稳固，置业能力强，是家族财产的可靠守护者。',
                '子女宫': '子女可能较少，或关系较为疏离，亲子之间需要有意识地增进情感。',
                '兄弟宫': '兄弟姐妹关系一般，可能有争执，但在关键时刻能共进退。',
                '父母宫': '父母务实，家境可能一般但稳定，家教严格。'
            }
        },
        en: {
            name: 'Wu Qu',
            title: 'The Martial Wealth Star',
            element: 'Yin Metal (辛金)',
            nature: 'Primary Star of the Northern Dipper',
            trait: 'Material fortitude, decisive action, financial mastery, iron will',
            mentalTendencies: 'Resolutely pragmatic. The Wu Qu character measures the world in outcomes, not intentions. They are not cold — they are concentrated. Every ounce of their considerable energy is directed toward the concrete, the achievable, the real.',
            generalTendencies: 'They are the ones who get things done when others are still deliberating. Their word is their bond; their standard is uncompromising. In emotional life, they express devotion through provision and protection rather than tenderness. This is their great misunderstanding with the world: they show love through deeds, but others need it spoken.',
            dramaticCore: 'The One Who Acts Instead of Speaks — they build empires to prove their love, never understanding that what was asked for was simply the words.',
            palaceDesc: {
                'Life Palace': 'Wu Qu in the Life Palace produces a character of formidable will and practical capability. They are the pillar — the one others lean on without question. The wound beneath the armour is an unarticulated hunger for softness, which they would rather die than admit.',
                'Spouse Palace': 'Both parties in this union tend toward action over expression. The relationship is stable and dependable, but emotionally arid without conscious cultivation. What is unspoken accumulates.',
                'Career Palace': 'Finance, military command, engineering, and administration are the natural domains. Execution is the supreme virtue here; strategy serves the act.',
                'Wealth Palace': 'The most fortunate position for this star. Wealth accumulates through disciplined effort and sound judgment. This character is the natural custodian of financial legacies.',
                'Virtue Palace': 'The inner life is spartan — purposeful, disciplined, largely devoid of sentimentality. Beneath this, an unnameable dissatisfaction sometimes surfaces at unexpected hours.',
                'Travel Palace': 'Competent and reliable in the outer world, though social grace may be subordinated to efficiency. Connections are practical rather than warm.',
                'Friends Palace': 'Associations are built on utility and mutual reliability rather than affection. The inner circle is small and trusted.',
                'Health Palace': 'The body is constitutionally strong, but the respiratory system and skeletal structure bear the marks of overexertion over time.',
                'Property Palace': 'A natural accumulator of property and an impeccable steward of material assets.',
                'Children Palace': 'Paternal or maternal bonds may carry a degree of emotional distance. Love is expressed through provision; the child may not always recognise it as love.',
                'Siblings Palace': 'Sibling relations are functional rather than warm, with occasional friction arising from competing wills.',
                'Parents Palace': 'The home of origin was likely orderly, demanding, and materially adequate. Emotional expressiveness was not among its virtues.'
            }
        }
    },

    '天同': {
        zh: {
            name: '天同',
            title: '福星、和合星',
            element: '壬水（阳水）',
            nature: '北斗主星',
            trait: '福气、温和、享受、人缘',
            personality: '温和善良，人缘极佳，懂得享受生活，有福气，但可能缺乏进取心',
            strength: '人缘好、福气深、性格温和、懂得生活',
            weakness: '缺乏进取心、容易满足、有时懒惰、习惯依赖',
            dramaticCore: '活在当下的人——他的快乐是真实的，但当命运需要他站出来时，他发现自己从未真正准备好',
            palaceDesc: {
                '命宫': '天同坐命，福气深厚，人缘极佳，性格温和，懂得享受生活。但在逆境中可能显得力不从心，需要激励才能发挥潜力。',
                '夫妻宫': '婚姻美满，配偶温柔体贴，感情稳定幸福，是最令人羡慕的伴侣格局之一。',
                '官禄宫': '事业运平稳，适合教育、医疗、服务等行业，以和谐为最大优势。',
                '财帛宫': '财运平顺，有积蓄能力，适合稳健投资，不适合高风险冒险。',
                '福德宫': '精神生活富足，懂得享受生活，幸福感高，是真正意义上的有福之人。',
                '迁移宫': '在外人缘好，能得贵人相助，环境对他总是相对友善。',
                '交友宫': '朋友众多，人缘极佳，是圈子里受欢迎的核心人物。',
                '疾厄宫': '体质较好，但易有泌尿系统、肾脏方面的问题，需注意保养。',
                '田宅宫': '家宅和睦，生活安逸，是家中的福气之源。',
                '子女宫': '子女乖巧孝顺，子女缘分深厚，亲子关系温馨。',
                '兄弟宫': '兄弟姐妹关系和睦，手足情深，家庭氛围温馨。',
                '父母宫': '父母和睦，家庭氛围温馨，从小在爱与安全感中长大。'
            }
        },
        en: {
            name: 'Tian Tong',
            title: 'The Star of Blessedness',
            element: 'Yang Water (壬水)',
            nature: 'Primary Star of the Northern Dipper',
            trait: 'Natural fortune, gentleness, the capacity for joy, social ease',
            mentalTendencies: 'Naturally harmonious and content. The Tian Tong character does not strain against the current of life — they flow with it, and find pleasure in the flowing. They are not shallow; they simply carry a genuine ease that others, burdened by ambition or anxiety, may mistake for naivety.',
            generalTendencies: 'They move through the world with an enviable lightness, collecting warmth and goodwill wherever they go. Their gift is the quality of presence — they make others feel at ease simply by being at ease themselves. The dramatic weakness: when fate demands that they stand firm, they discover that a life spent in comfort has not tempered their resolve.',
            dramaticCore: 'The One Who Lives in the Present — their joy is genuine and infectious, but when the reckoning arrives, they must confront the cost of having never truly prepared for it.',
            palaceDesc: {
                'Life Palace': 'Tian Tong in the Life Palace produces a character of genuine warmth, social grace, and a natural attunement to pleasure and ease. The dramatic challenge is the discovery that contentment, for all its virtues, does not equip one for crisis.',
                'Spouse Palace': 'Among the most fortunate configurations for partnership. The union is characterised by mutual tenderness, shared enjoyment, and enduring comfort.',
                'Career Palace': 'Service, education, healthcare, and creative industries resonate. This character\'s contribution is atmospheric: they make institutions gentler and workplaces more human.',
                'Wealth Palace': 'Financial life is stable and unhurried. Prudent accumulation suits this nature; speculative ventures do not.',
                'Virtue Palace': 'The inner life is genuinely contented — perhaps the most unambiguously fortunate placement for inner peace. This is a character who knows what enough feels like.',
                'Travel Palace': 'The outer world tends toward hospitality for this character. Doors open; people are helpful. The environment cooperates.',
                'Friends Palace': 'One of the most socially gifted placements. This character is the warmth at the centre of any gathering.',
                'Health Palace': 'The constitution is sound, with the urogenital system and kidneys as areas requiring occasional attention.',
                'Property Palace': 'The home is harmonious and a source of genuine restoration. This character creates environments of ease.',
                'Children Palace': 'The bond with children is tender and reciprocal. Warmth flows naturally in both directions.',
                'Siblings Palace': 'Familial relations are warm and uncomplicated.',
                'Parents Palace': 'The character was shaped in an environment of genuine affection and security — a foundation of ease they carry forward into every room they enter.'
            }
        }
    },

    '廉贞': {
        zh: {
            name: '廉贞',
            title: '次桃花星、囚星',
            element: '丁火（阴火）',
            nature: '北斗主星',
            trait: '魅力、欲望、竞争、政治手腕',
            personality: '魅力十足，有艺术天赋，感情丰富，但容易冲动，情绪起伏大',
            strength: '魅力十足、有竞争力、艺术天赋、感情丰富',
            weakness: '容易冲动、情绪不稳、桃花过多、易陷入感情漩涡',
            dramaticCore: '欲望与理智之间永恒拉锯的人——他们的魅力来自那份真实的渴望，而他们的悲剧也往往由此而起',
            palaceDesc: {
                '命宫': '廉贞坐命，魅力十足，有艺术天赋，感情丰富。人生充满戏剧性，欲望与理智的博弈贯穿始终。',
                '夫妻宫': '感情浓烈，但易有波折，情绪起伏影响关系稳定。最好的结局需要双方都有足够的成熟度。',
                '官禄宫': '事业适合演艺、艺术、政治等行业，竞争环境中反而更能激发潜力。',
                '财帛宫': '财运起伏不定，有横财运但需节制，情绪化消费是最大隐患。',
                '福德宫': '精神生活丰富，但情绪起伏较大，内心世界充满张力。',
                '迁移宫': '在外魅力十足，但需防感情上的是非与纠纷。',
                '交友宫': '朋友众多，但需防因魅力招来的损友和是非。',
                '疾厄宫': '易有血液、心脏方面的问题，情绪管理是健康关键。',
                '田宅宫': '家宅可能有变动，感情纠纷易波及家庭稳定。',
                '子女宫': '子女可能较为叛逆，亲子之间需要建立信任而非控制。',
                '兄弟宫': '兄弟姐妹关系可能不够和睦，易有争执摩擦。',
                '父母宫': '父母可能有艺术气质，但亲子关系可能缺乏安全感。'
            }
        },
        en: {
            name: 'Lian Zhen',
            title: 'The Star of Desire and Politics',
            element: 'Yin Fire (丁火)',
            nature: 'Primary Star of the Northern Dipper',
            trait: 'Magnetism, desire, political instinct, emotional intensity',
            mentalTendencies: 'Intensely alive to the full spectrum of experience. The Lian Zhen character does not live at half-power. They want — deeply, specifically, with a directness that can be overwhelming. This wanting is the engine of their magnetism and the root of their suffering.',
            generalTendencies: 'They are compelling figures — in a room, in a story, in a life. The arts, politics, and any arena that rewards charisma and nerve are their natural habitats. The recurring dramatic pattern: the collision between what they desire and what wisdom would counsel. They know what is wise; they choose the other thing anyway.',
            dramaticCore: 'The Perpetual Tempest — their greatest quality is their honest, irresistible aliveness; their greatest flaw is the same thing, unrestrained.',
            palaceDesc: {
                'Life Palace': 'Lian Zhen in the Life Palace produces a character of formidable magnetism and emotional complexity. Their life is never without drama — not because drama pursues them, but because they are drawn to the full intensity of every experience.',
                'Spouse Palace': 'Relationships are passionate, transformative, and often turbulent. The bond either forges both parties into something greater or consumes them. There is rarely a middle ground.',
                'Career Palace': 'Performance, politics, the law, and any competitive arena that rewards drive and charisma. Pressure activates rather than diminishes this character.',
                'Wealth Palace': 'Financial life follows the emotional weather. Windfalls occur; so do losses driven by impulsive decisions. Discipline is the one financial virtue that requires active cultivation.',
                'Virtue Palace': 'The inner world is charged, turbulent, and deeply felt. Contentment is available but requires conscious navigation away from the pull of intensity.',
                'Travel Palace': 'The outer world is drawn to this character\'s presence. The risk lies in entanglements born of that same attraction.',
                'Friends Palace': 'The social circle is large and varied. Discriminating between those who are energised by the character\'s vitality and those who would consume it is a recurring challenge.',
                'Health Palace': 'The cardiovascular system and blood are the primary areas of sensitivity. Emotional regulation is the most consequential health practice.',
                'Property Palace': 'Domestic stability is subject to the tides of relational life. The home reflects the emotional temperature of the character.',
                'Children Palace': 'The relationship with children is intense and may carry the character\'s unresolved emotional patterns. Trust, not control, is the bridge.',
                'Siblings Palace': 'Fraternal relations are likely to carry friction alongside genuine affection. The warmth is real; so is the combustibility.',
                'Parents Palace': 'The home of origin may have been emotionally charged. The character absorbed both the vitality and the instability of that atmosphere.'
            }
        }
    },

    '天府': {
        zh: {
            name: '天府',
            title: '财库星、令星',
            element: '戊土（阳土）',
            nature: '南斗主星',
            trait: '财库、稳重、保守、守成',
            personality: '稳重保守，理财能力强，善于守成，有管理能力，但可能缺乏开创精神',
            strength: '理财能力强、稳重可靠、善于守成、有管理才能',
            weakness: '过于保守、缺乏开创精神、有时固执、不善变通',
            dramaticCore: '守护者的困境——他们最擅长保住已有的一切，却可能在时代的浪潮中发现，守住的竟是一座空城',
            palaceDesc: {
                '命宫': '天府坐命，稳重保守，理财能力强，善于守成。人格中有一种天然的可靠感，但在需要冒险的时代可能显得落伍。',
                '夫妻宫': '配偶稳重可靠，婚姻关系稳定，是细水长流的伴侣类型。',
                '官禄宫': '事业运稳定，适合金融、地产、管理等行业，守成有余，开创稍显不足。',
                '财帛宫': '财运极佳，理财能力一流，能守住财富，是天生的财富管理者。',
                '福德宫': '精神生活稳定，重视安全感，但有时缺乏对新鲜感的追求。',
                '迁移宫': '在外稳重可靠，能得他人信任，但可能缺乏开拓精神。',
                '交友宫': '朋友多为稳重之人，交情深厚，但圈子可能较为固定。',
                '疾厄宫': '体质较好，但易有脾胃方面的问题。',
                '田宅宫': '家宅富贵，不动产丰厚，是家族财产的最佳守护者。',
                '子女宫': '子女稳重有成，能继承家业，但亲子之间可能缺乏灵动感。',
                '兄弟宫': '兄弟姐妹关系和睦，手足情深，家庭凝聚力强。',
                '父母宫': '父母稳重，家境较好，给予了良好的物质基础。'
            }
        },
        en: {
            name: 'Tian Fu',
            title: 'The Treasury Star',
            element: 'Yang Earth (戊土)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Accumulated wealth, prudence, institutional authority, the preservation of what is built',
            mentalTendencies: 'Constitutionally steady and oriented toward the preservation of value. The Tian Fu character understands that what is built must be protected — and they take this mandate seriously, perhaps too seriously.',
            generalTendencies: 'They are the administrators, the custodians, the ones entrusted with the continuity of institutions and fortunes. Their reliability is not merely a trait but a form of identity. The dramatic limitation: when the world changes faster than their capacity to accommodate it, they may find themselves guarding something that has already ceased to exist.',
            dramaticCore: 'The Custodian\'s Dilemma — they excel at protecting what has been built; the tragedy arrives when they realise that what they have so carefully preserved is a fortress without an occupant.',
            palaceDesc: {
                'Life Palace': 'Tian Fu in the Life Palace produces a character of inherent dependability and administrative mastery. They are the ones others trust with what matters most. The shadow: the world may outgrow their mode of safekeeping.',
                'Spouse Palace': 'Partnership here is characterised by steady loyalty and mutual reliability. The relationship deepens slowly and endures.',
                'Career Palace': 'Finance, property, administration, and the stewardship of institutions. This character earns their place through the quality of their judgment and the constancy of their presence.',
                'Wealth Palace': 'One of the strongest wealth configurations. The character accumulates through patience, sound judgment, and a constitutionally low appetite for unnecessary risk.',
                'Virtue Palace': 'The inner life values security, continuity, and the deep satisfaction of things in their proper order. A quiet contentment is available — and occasionally, a quiet restlessness.',
                'Travel Palace': 'Trust is the primary social currency. Reliability precedes this character wherever they go.',
                'Friends Palace': 'The circle is loyal, long-established, and somewhat resistant to new additions.',
                'Health Palace': 'Constitution is robust. The digestive system reflects the character\'s relationship to what they have taken in — emotionally as well as physically.',
                'Property Palace': 'The most naturally fortunate placement for property accumulation and family legacy.',
                'Children Palace': 'The bonds with children are solid and responsible, if occasionally in need of greater spontaneity.',
                'Siblings Palace': 'Family solidarity is a fundamental value for this character.',
                'Parents Palace': 'The home of origin provided material security and a clear set of values. The emotional legacy is of dependability rather than demonstrativeness.'
            }
        }
    },

    '太阴': {
        zh: {
            name: '太阴',
            title: '月星、母星',
            element: '癸水（阴水）',
            nature: '南斗主星',
            trait: '细腻、内敛、艺术、感性',
            personality: '温柔细腻，感性内敛，有艺术气质，善于照顾他人，但可能过于敏感',
            strength: '温柔细腻、艺术气质、善于照顾人、感性丰富',
            weakness: '过于敏感、容易多愁善感、缺乏主见、有时依赖性强',
            dramaticCore: '月亮的故事——她是所有光的接收者和反射者，却从不发出自己的光；直到某一天，她终于意识到自己一直在等待一个永远不会来的太阳',
            palaceDesc: {
                '命宫': '太阴坐命，温柔细腻，有艺术气质，善于照顾他人。内心世界极为丰富，但需要学会为自己的感受发声。',
                '夫妻宫': '配偶温柔体贴，感情细腻，婚姻关系稳定，但需防过于依赖对方。',
                '官禄宫': '事业适合文艺、设计、心理、护理等行业，幕后工作往往比台前更顺遂。',
                '财帛宫': '财运阴柔，适合幕后或文艺类求财，正财稳定但偏财少。',
                '福德宫': '精神生活细腻，重视情感体验，内心世界丰富而深邃。',
                '迁移宫': '在外温柔得体，能得贵人相助，但可能缺乏主动争取的魄力。',
                '交友宫': '朋友多为温柔之人，交情深厚，但可能过于在乎他人感受。',
                '疾厄宫': '体质较弱，易有妇科、肾脏方面的问题，情绪对身体影响大。',
                '田宅宫': '家宅温馨，生活安逸，对家的感情特别深厚。',
                '子女宫': '子女温柔乖巧，子女缘分深厚，亲子关系温馨美满。',
                '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
                '父母宫': '母亲温柔，家境较好，从小在细腻的情感环境中成长。'
            }
        },
        en: {
            name: 'Tai Yin',
            title: 'The Lunar Star',
            element: 'Yin Water (癸水)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Sensitivity, artistic depth, nurturing intelligence, the reflective inner life',
            mentalTendencies: 'Inwardly oriented and finely attuned to the emotional register of every room. The Tai Yin character perceives what is unspoken, receives impressions that others miss, and processes experience with a depth and nuance that can be both gift and burden.',
            generalTendencies: 'They are natural carers, artists, and keepers of interior worlds. They give warmth generously and often without condition. The recurring vulnerability: an excess of sensitivity can shade into a susceptibility to absorbing others\' pain, and a habit of subordinating one\'s own needs to the emotional maintenance of the surrounding world.',
            dramaticCore: 'The Moon\'s Story — she receives and reflects every light but generates none of her own. The awakening arrives when she realises she has been waiting for a sun that may never come, and asks: what would it mean to shine, unaided?',
            palaceDesc: {
                'Life Palace': 'Tai Yin in the Life Palace produces a character of exquisite emotional sensitivity and creative depth. Their inner world is vast. The dramatic journey is learning to let that inner world speak in the outer one.',
                'Spouse Palace': 'The partnership is gentle, reciprocally attentive, and rich in unspoken understanding. The shadow: a tendency toward emotional dependency that must be consciously balanced.',
                'Career Palace': 'The arts, design, psychology, healing, and any field that rewards depth of perception over forceful assertion. Behind-the-scenes roles often suit better than public ones.',
                'Wealth Palace': 'Wealth accumulates quietly and through legitimate means. The financial temperament is cautious; windfall speculation is not in character.',
                'Virtue Palace': 'The inner life is where this character is most fully themselves — nuanced, feeling, endlessly receptive to beauty and meaning.',
                'Travel Palace': 'Grace and attentiveness earn goodwill in the outer world, though assertiveness may require deliberate cultivation.',
                'Friends Palace': 'Friendships are deeply felt and long-held. The emotional investment is real, and the risk of carrying others\' pain as one\'s own is constant.',
                'Health Palace': 'The body is sensitive and registers emotional stress readily. Reproductive health and the kidneys are areas requiring care.',
                'Property Palace': 'The home is a sanctuary — lovingly made, deeply felt, and the physical expression of the character\'s inner world.',
                'Children Palace': 'The bond with children is tender and deeply reciprocal.',
                'Siblings Palace': 'Familial bonds are warm and emotionally close.',
                'Parents Palace': 'The maternal influence was formative and continues to resonate. The character carries the emotional inheritance of the home of origin in everything they do.'
            }
        }
    },

    '贪狼': {
        zh: {
            name: '贪狼',
            title: '桃花星、才艺星',
            element: '甲木（阳木）',
            nature: '南斗主星',
            trait: '欲望、才艺、魅力、多元',
            personality: '多才多艺，魅力十足，桃花旺盛，但容易沉迷享乐，欲望强烈',
            strength: '多才多艺、魅力十足、社交能力强、有艺术天赋',
            weakness: '容易沉迷享乐、欲望强烈、桃花过多、难以专注于一件事',
            dramaticCore: '什么都想要的人——他们的丰盛是真实的，但那股子贪婪也是真实的；人生最大的考验是：在什么都能拥有的时候，选择什么值得守护',
            palaceDesc: {
                '命宫': '贪狼坐命，多才多艺，魅力十足，桃花旺盛。人生充满诱惑与机遇，关键在于能否找到值得深耕的方向。',
                '夫妻宫': '感情丰富，但易有桃花劫，需要专一的决心才能维系稳定的关系。',
                '官禄宫': '事业适合艺术、娱乐、设计等行业，多元才能是最大优势。',
                '财帛宫': '财运桃花旺，有偏财运，但消费欲望强，需要节制。',
                '福德宫': '精神生活丰富，但欲望较强，容易在享乐中迷失自我。',
                '迁移宫': '在外魅力十足，社交能力强，异地发展有桃花助力。',
                '交友宫': '朋友众多，圈子广泛，但需防因魅力招来的损友。',
                '疾厄宫': '易有肝胆、生殖系统方面的问题，需注意生活规律。',
                '田宅宫': '家宅可能有变动，欲望驱动下的置业决策需谨慎。',
                '子女宫': '子女聪明有才艺，但可能较为叛逆，亲子关系需要弹性。',
                '兄弟宫': '兄弟姐妹可能有艺术气质，但关系可能不够亲密。',
                '父母宫': '父母可能有艺术气质，但亲子关系可能缺乏稳定的边界。'
            }
        },
        en: {
            name: 'Tan Lang',
            title: 'The Star of Desire and the Arts',
            element: 'Yang Wood (甲木)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Multi-talented magnetism, sensory appetite, creative abundance, the seduction of possibility',
            mentalTendencies: 'Voraciously alive to possibility. The Tan Lang character is drawn to beauty, pleasure, skill, and experience with an appetite that cannot easily be sated. They do not merely appreciate the array of what life offers — they want to possess it, master it, and taste all of it.',
            generalTendencies: 'Their versatility is genuine: they pick up skills with unsettling ease and radiate a magnetism that draws people, opportunities, and complications in equal measure. The dramatic tension: the same appetite that makes them extraordinary makes it nearly impossible for them to be faithful to any single direction. Abundance becomes its own form of destitution.',
            dramaticCore: 'The One Who Wants Everything — their vitality is real, their gifts are real, their appetites are real. The defining test: when the full treasury is open, what will they choose to guard?',
            palaceDesc: {
                'Life Palace': 'Tan Lang in the Life Palace produces a character of extraordinary magnetism and range. They contain multitudes, and they know it. The narrative arc is the discovery that depth requires the sacrifice of breadth.',
                'Spouse Palace': 'The pull toward variety is the primary challenge in intimate partnership. When commitment is chosen consciously, the relationship benefits enormously from the character\'s warmth and creative energy.',
                'Career Palace': 'The arts, entertainment, design, performance, and any field that rewards range and charisma. The discipline to develop mastery within a chosen domain is the critical variable.',
                'Wealth Palace': 'Windfall opportunities are frequent. So is expenditure driven by impulse and the appetite for experience. The financial life mirrors the character\'s fundamental tension: abundance and dispersal.',
                'Virtue Palace': 'The inner world is rich, sensory, and pleasure-seeking. The shadow is the dissatisfaction that follows when every appetite has been indulged and the hunger remains.',
                'Travel Palace': 'The outer world is receptive and stimulating. Romantic and creative complications arrive through the same door as opportunities.',
                'Friends Palace': 'The circle is large, diverse, and entertaining. Discriminating between those who enrich and those who deplete requires the discipline this character must actively cultivate.',
                'Health Palace': 'The liver, gallbladder, and reproductive system are sensitive to the excesses that this character must navigate.',
                'Property Palace': 'The relationship to property reflects the broader pattern: acquisition and dispersal, possibility and impermanence.',
                'Children Palace': 'Children share the character\'s creative energy and independent spirit. Flexible authority serves better than rigid control.',
                'Siblings Palace': 'Sibling dynamics are lively but may lack sustained depth.',
                'Parents Palace': 'The home of origin may have been creatively stimulating but emotionally inconsistent — rich in talent, variable in stability.'
            }
        }
    },

    '巨门': {
        zh: {
            name: '巨门',
            title: '暗曜、口舌星',
            element: '癸水（阴水）',
            nature: '南斗主星',
            trait: '口才、探究、是非、深度',
            personality: '口才极佳，善于表达，有研究精神，但容易惹是非，口舌较多',
            strength: '口才极佳、善于表达、有研究精神、逻辑能力强',
            weakness: '容易惹是非、口舌较多、疑心重、有时言辞犀利伤人',
            dramaticCore: '说出真相的人——他们总能看穿表象，说出别人不敢说的话；但真相有时是双刃剑，说者无惧，却未必无伤',
            palaceDesc: {
                '命宫': '巨门坐命，口才极佳，善于表达，有研究精神。是非也多，但若能善用这股力量，可成为极具影响力的声音。',
                '夫妻宫': '配偶聪明能干，但易有口舌之争，需要多一份包容和少一点批判。',
                '官禄宫': '事业适合法律、传媒、销售等行业，口才是最大的职业资产。',
                '财帛宫': '财运靠口才，适合销售、传媒等行业，言辞即财路。',
                '福德宫': '精神生活丰富，喜欢研究和思考，但思虑过重时易陷入怀疑与不安。',
                '迁移宫': '在外善于表达，但需防是非缠身。',
                '交友宫': '朋友众多，但需防口舌是非，言辞需要更谨慎。',
                '疾厄宫': '易有呼吸系统、肠胃方面的问题，情绪对消化影响大。',
                '田宅宫': '家宅可能有口舌之争，需要多沟通少争论。',
                '子女宫': '子女聪明伶俐，但可能较为叛逆，亲子间需要建立信任式对话。',
                '兄弟宫': '兄弟姐妹可能有口舌之争，需要多沟通。',
                '父母宫': '父母可能有口才，但亲子关系可能因言辞冲突而显得疏远。'
            }
        },
        en: {
            name: 'Ju Men',
            title: 'The Dark Luminary — Star of Inquiry and Speech',
            element: 'Yin Water (癸水)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Penetrating intelligence, oratorical power, the courage — and cost — of speaking truth',
            mentalTendencies: 'Probing and unillusioned. The Ju Men character has a gift for seeing through surfaces — the hidden motive, the unspoken agreement, the thing everyone knows but no one says. They are compelled to say it.',
            generalTendencies: 'They are formidable in any arena that rewards clarity, precision, and the willingness to confront. Law, journalism, research, and persuasion are their native domains. The recurrent complication: the same acuity that illuminates also cuts. They attract controversy not through carelessness but through a fundamental refusal to pretend.',
            dramaticCore: 'The One Who Speaks the Truth — their gift is courage; their wound is the discovery that truth-telling, however necessary, is rarely without consequence for the one who speaks it.',
            palaceDesc: {
                'Life Palace': 'Ju Men in the Life Palace produces a character of penetrating intelligence and powerful expression. They are, in every sense, a voice — and the most interesting question in their story is what they will choose to do with it.',
                'Spouse Palace': 'The partnership is mentally stimulating and occasionally turbulent. The capacity for honest exchange is an asset; the habit of precise criticism requires the development of mercy.',
                'Career Palace': 'The legal world, media, research, and any field that rewards the ability to find and articulate what is true. Speech is the primary instrument of power.',
                'Wealth Palace': 'Earnings come through the voice — through persuasion, communication, and the ability to frame. The financial life is directly linked to the quality and reach of expression.',
                'Virtue Palace': 'The inner life is rich with inquiry and deeply reluctant to accept surfaces at face value. The shadow is a suspicion that can shade into cynicism when the world repeatedly confirms the character\'s darkest assessments.',
                'Travel Palace': 'The outer world can be energising and contentious in equal measure. The character\'s reputation precedes them as either a truth-teller or a troublemaker — often both simultaneously.',
                'Friends Palace': 'Associates respect rather than merely like this character. The bonds are formed through intellectual honesty and tested by it.',
                'Health Palace': 'The respiratory system and gastrointestinal tract are sensitive. Unspoken accumulations register physically.',
                'Property Palace': 'Domestic life benefits from conscious cultivation of ease and gentleness.',
                'Children Palace': 'Children are bright and questioning, shaped by a parent who models intellectual courage. The relationship thrives when authority gives way to dialogue.',
                'Siblings Palace': 'Sibling dynamics may be lively and occasionally contentious. Communication is direct; harmony requires effort.',
                'Parents Palace': 'The family of origin valued intelligence and verbal facility, though emotional warmth may not have been equally emphasised.'
            }
        }
    },

    '天相': {
        zh: {
            name: '天相',
            title: '印星、宰相星',
            element: '壬水（阳水）',
            nature: '南斗主星',
            trait: '协调、贵人、正直、稳重',
            personality: '稳重正直，善于协调，有贵人运，做事谨慎，但可能过于保守',
            strength: '稳重正直、善于协调、贵人运佳、做事谨慎',
            weakness: '过于保守、缺乏开创精神、有时优柔寡断、需要外力推动',
            dramaticCore: '永远在别人的故事里扮演支柱的人——直到某一天，他们意识到自己的故事从来没有人为之书写',
            palaceDesc: {
                '命宫': '天相坐命，稳重正直，善于协调，贵人运佳。是可以依赖的存在，但需要找到属于自己的主线。',
                '夫妻宫': '配偶稳重可靠，婚姻关系稳定，双方都是可信赖的伴侣。',
                '官禄宫': '事业运稳定，适合公务员、行政管理等行业，辅助型岗位往往比主帅位置更顺遂。',
                '财帛宫': '财运稳定，有贵人助财，适合合作求财。',
                '福德宫': '精神生活稳定，重视道德和正义，内心有一把标准的尺。',
                '迁移宫': '在外稳重可靠，能得贵人相助，口碑好。',
                '交友宫': '朋友多为正直之人，交情深厚，人际关系是最大的资产。',
                '疾厄宫': '体质较好，但易有皮肤、泌尿系统方面的问题。',
                '田宅宫': '家宅稳定，生活安逸，是家庭的稳定器。',
                '子女宫': '子女稳重有成，子女缘分深厚，亲子关系融洽。',
                '兄弟宫': '兄弟姐妹关系和睦，手足情深。',
                '父母宫': '父母正直，家境较好，家教重视品德。'
            }
        },
        en: {
            name: 'Tian Xiang',
            title: 'The Prime Minister Star',
            element: 'Yang Water (壬水)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Principled steadiness, the art of mediation, institutional grace, the power of the supporting role',
            mentalTendencies: 'Constitutionally inclined toward order, fairness, and the maintenance of right relationship between all parties. The Tian Xiang character is the civilising presence in any system — the one who holds things together through principle rather than force.',
            generalTendencies: 'They are trusted, consulted, and relied upon. Their gift is the ability to see multiple perspectives and find the ground on which they can be reconciled. The quiet dramatic tension: a lifetime of supporting others\' stories can obscure the question of what this character themselves needs, wants, and might become if they stepped out of the supporting role.',
            dramaticCore: 'The Perennial Pillar — they have held everyone else up for so long that they have never quite asked: who holds me up? And more quietly: whose story is this, finally?',
            palaceDesc: {
                'Life Palace': 'Tian Xiang in the Life Palace produces a character of genuine integrity and administrative excellence. They are the one everyone trusts. The narrative question: will they find a story of their own to inhabit, or spend their life as the essential figure in everyone else\'s?',
                'Spouse Palace': 'Partnership is characterised by mutual reliability and shared principle. Both parties are trustworthy; the relationship endures.',
                'Career Palace': 'Administration, the civil service, mediation, and any role that requires principled stewardship of systems and people. The second-in-command role may suit better than the supreme command.',
                'Wealth Palace': 'Financial life is steady and supported by the goodwill of others. Cooperative ventures are particularly productive.',
                'Virtue Palace': 'Inner life is governed by a clear and consistent moral architecture. Justice and right conduct are not abstractions but lived commitments.',
                'Travel Palace': 'Reputation for integrity travels ahead of this character, opening doors through trustworthiness.',
                'Friends Palace': 'The associations are principled and lasting. Social capital is among the most reliable resources this character possesses.',
                'Health Palace': 'Generally robust, with the skin and urinary system as the more sensitive areas.',
                'Property Palace': 'The domestic environment is stable, orderly, and reassuring.',
                'Children Palace': 'Parent-child bonds are warm and grounded in mutual respect.',
                'Siblings Palace': 'Familial bonds are harmonious and mutually supportive.',
                'Parents Palace': 'The home of origin emphasised moral formation and right conduct. The character carries this inheritance as both virtue and, occasionally, as rigidity.'
            }
        }
    },

    '天梁': {
        zh: {
            name: '天梁',
            title: '荫星、老人星',
            element: '戊土（阳土）',
            nature: '南斗主星',
            trait: '化解、荫护、清高、悲悯',
            personality: '仁慈宽厚，有长辈缘，善于化解危机，清高正直，但可能过于固执',
            strength: '仁慈宽厚、善于化解危机、长辈缘佳、清高正直',
            weakness: '过于固执、有时清高到令人疏远、不善变通、容易孤独',
            dramaticCore: '渡人者的悲哀——他们能帮所有人化解危机，偏偏帮不了自己；他们是人世间最好的摆渡人，却也是最孤独的那个',
            palaceDesc: {
                '命宫': '天梁坐命，仁慈宽厚，善于化解危机，有长辈缘。是有大悲悯心的人，但孤独常伴左右。',
                '夫妻宫': '配偶仁慈宽厚，婚姻关系稳定，但可能因清高而在感情中保有距离。',
                '官禄宫': '事业运稳定，适合教育、医疗、法律等行业，助人是最大的使命感来源。',
                '财帛宫': '财运平顺，有福气带财，适合稳健型理财。',
                '福德宫': '精神生活富足，有宗教信仰或精神追求，能在清净中找到力量。',
                '迁移宫': '在外仁慈宽厚，能得贵人相助，异地发展多有助缘。',
                '交友宫': '朋友多为仁慈之人，交情深厚，但真正理解自己的人并不多。',
                '疾厄宫': '体质较好，但易有脾胃、消化系统方面的问题。',
                '田宅宫': '家宅稳定，生活安逸，是家中长者的精神支柱。',
                '子女宫': '子女孝顺有成，子女缘分深厚，亲子关系是人生重要的慰藉。',
                '兄弟宫': '兄弟姐妹关系和睦，手足情深，是家族的精神凝聚点。',
                '父母宫': '父母仁慈，家境较好，长辈的荫护是人生的底气来源。'
            }
        },
        en: {
            name: 'Tian Liang',
            title: 'The Star of Protection and Compassion',
            element: 'Yang Earth (戊土)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Compassionate authority, the dissolution of crises, moral clarity, the sorrow of the wise',
            mentalTendencies: 'Deeply humane and instinctively oriented toward the alleviation of suffering. The Tian Liang character perceives human frailty without contempt and responds to it with the kind of steady warmth that takes a lifetime to cultivate.',
            generalTendencies: 'They are the counsellors, healers, teachers, and protectors. Their presence stabilises. Others bring them their crises instinctively, knowing they will receive both clarity and compassion. The quiet tragedy: the one who can dissolve every crisis for others cannot always navigate their own. And the very nobility that makes them indispensable also keeps them somewhat alone.',
            dramaticCore: 'The Ferryman\'s Sorrow — they have carried so many others to safety across the river. When the moment comes to ask for passage themselves, they discover they have spent so long on the water that they have forgotten which shore is home.',
            palaceDesc: {
                'Life Palace': 'Tian Liang in the Life Palace produces a character of genuine moral authority and deep compassion. They are among the most admirable of figures — and among the loneliest.',
                'Spouse Palace': 'Partnership is steady and characterised by mutual respect. The character\'s tendency toward a certain noble self-sufficiency can create emotional distance that must be bridged with conscious warmth.',
                'Career Palace': 'Education, medicine, law, social welfare, and any field in which wisdom is brought to bear on human suffering. The sense of vocation is deep and authentic.',
                'Wealth Palace': 'Fortune accompanies this character quietly and without drama. Generosity is instinctive; the financial life is therefore characterised by both blessing and occasional depletion through giving.',
                'Virtue Palace': 'The inner life is rich with meaning, often finding expression through spiritual practice, philosophy, or devotion to a larger purpose. Solitude is not a deprivation but a necessity.',
                'Travel Palace': 'The outer world recognises this character\'s quality and extends its support accordingly.',
                'Friends Palace': 'The circle is small but deeply trusted. The character is appreciated widely but truly known by few.',
                'Health Palace': 'The digestive system reflects the character\'s capacity to metabolise — physically and emotionally — what has been received from the world.',
                'Property Palace': 'The home is a place of genuine refuge and restoration.',
                'Children Palace': 'The parent-child bond is a source of profound meaning. The character models wisdom through their manner of living.',
                'Siblings Palace': 'Familial bonds are warm and the character often serves as a stabilising presence for the wider family.',
                'Parents Palace': 'The home of origin provided moral guidance and emotional protection. The character carries this as both a foundation and an orientation.'
            }
        }
    },

    '七杀': {
        zh: {
            name: '七杀',
            title: '将星、煞星',
            element: '庚金（阳金）',
            nature: '南斗主星',
            trait: '魄力、变动、开创、将才',
            personality: '勇猛果断，有魄力，善于开创，但容易冲动，变动较多',
            strength: '勇猛果断、魄力十足、善于开创、行动力强',
            weakness: '容易冲动、变动较多、有时鲁莽、不善守成',
            dramaticCore: '在战场上找到意义的人——平静的生活对他来说是一种缓慢的死亡；他需要一个值得战斗的东西，否则他会转过身来，和自己过不去',
            palaceDesc: {
                '命宫': '七杀坐命，勇猛果断，有魄力，善于开创。人生多变动，但每次破局都是成长的契机。',
                '夫妻宫': '感情易有波折，需要互相包容，给彼此足够的空间和自由。',
                '官禄宫': '事业适合军警、创业、体育等行业，挑战性越高，发挥越好。',
                '财帛宫': '财运起伏不定，有偏财运但风险大，需要控制冲动消费。',
                '福德宫': '精神生活多变，喜欢冒险和挑战，平静对他来说是一种折磨。',
                '迁移宫': '在外勇猛果断，但需防意外和冲动行事。',
                '交友宫': '朋友多为豪爽之人，但需防因义气而惹麻烦。',
                '疾厄宫': '易有外伤、骨骼、呼吸系统方面的问题，需注意安全。',
                '田宅宫': '家宅可能有变动，置业需谨慎，不适合过早固定。',
                '子女宫': '子女可能较为叛逆，亲子关系需要建立在尊重而非控制之上。',
                '兄弟宫': '兄弟姐妹可能有争执，但关键时刻能并肩作战。',
                '父母宫': '父母可能有威严，家教严格，塑造了坚强的性格底色。'
            }
        },
        en: {
            name: 'Qi Sha',
            title: 'The General Star',
            element: 'Yang Metal (庚金)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Martial courage, the drive to break through, transformative force, the warrior\'s restlessness',
            mentalTendencies: 'Inherently combative in the creative sense — oriented toward challenge, opposition, and the satisfaction of decisive action. The Qi Sha character does not merely tolerate difficulty; they need it. Placidity is, for them, a slow suffocation.',
            generalTendencies: 'They are at their finest in crisis, under pressure, against the odds. The general in the field, the entrepreneur in the burning moment, the athlete in the final seconds — these are their archetypes. The standing danger: when there is no worthy external battle, the warrior\'s energy turns inward, and they become their own worst adversary.',
            dramaticCore: 'The One Who Finds Meaning in Combat — their tragedy is not defeat in battle, but the peacetime in which the sword has no purpose. Give them a worthy cause or watch them manufacture one.',
            palaceDesc: {
                'Life Palace': 'Qi Sha in the Life Palace produces a character of immense drive and transformative capacity. Their life is one of repeated rupture and reconstruction — not as misfortune, but as necessity. Each crisis is the forge.',
                'Spouse Palace': 'Partnership requires a significant degree of mutual independence. The character needs a partner who neither demands constant calm nor mistakes intensity for hostility.',
                'Career Palace': 'Military service, entrepreneurship, athletics, emergency medicine — any domain that requires the capacity to act decisively under pressure. Challenge is the activating condition.',
                'Wealth Palace': 'Financial life is characterised by dramatic swings. Opportunities are real; so are the consequences of impulsive action.',
                'Virtue Palace': 'The inner life is restless and seeking. Meaning is found through exertion, through mastery, through the experience of being fully stretched.',
                'Travel Palace': 'The outer world is engaged with vigour. Caution in the face of the character\'s own impulsiveness is the primary exercise.',
                'Friends Palace': 'Bonds are formed under pressure and proven in difficulty. The circle is small, loyal, and capable.',
                'Health Palace': 'The musculoskeletal system and respiratory capacity are most sensitive to the demands placed on this characteristically high-output constitution.',
                'Property Palace': 'Stability of domicile may be subordinated to the character\'s natural restlessness.',
                'Children Palace': 'Children of this parent are shaped in an atmosphere of intensity and high expectation. Respect rather than control is the healthier mode of relation.',
                'Siblings Palace': 'Sibling dynamics may include friction, but the bonds hold in extremity.',
                'Parents Palace': 'The home of origin was demanding and shaped the character\'s formidable constitution through the rigour of its standards.'
            }
        }
    },

    '破军': {
        zh: {
            name: '破军',
            title: '耗星、先锋星',
            element: '癸水（阴水）',
            nature: '南斗主星',
            trait: '开创、破旧、变革、先锋',
            personality: '开创力强，有魄力，善于变革，但容易破坏，消耗较大',
            strength: '开创力强、魄力十足、善于变革、不拘一格',
            weakness: '容易破坏、消耗较大、不善守成、有时叛逆到令人无法接近',
            dramaticCore: '必须先摧毁旧世界才能建立新世界的人——他们的破坏性和创造性是同一枚硬币的两面，代价是：没有任何一样东西能在他们手中完整地存活太久',
            palaceDesc: {
                '命宫': '破军坐命，开创力强，善于变革，不拘一格。人生是一系列的破局与重建，每次都比上次更勇敢。',
                '夫妻宫': '感情易有波折和变动，需要双方都有足够的包容与理解，才能在风浪中相守。',
                '官禄宫': '事业适合创业、创新、改革等行业，颠覆性思维是最大的竞争优势。',
                '财帛宫': '财运多变，有开创财运但风险大，起落幅度往往超出一般人。',
                '福德宫': '精神生活多变，喜欢创新和变革，无聊是最难忍受的状态。',
                '迁移宫': '在外开创力强，但需防变动过频带来的不稳定。',
                '交友宫': '朋友多为开创型之人，但关系可能不够稳定，聚散无常。',
                '疾厄宫': '易有外伤、消耗性疾病方面的问题，需注意保存元气。',
                '田宅宫': '家宅可能有较大变动，买卖迁移是常态。',
                '子女宫': '子女可能较为叛逆，亲子之间需要建立基于理解而非规则的关系。',
                '兄弟宫': '兄弟姐妹关系可能有变动，不够稳定，但感情在颠簸中积累。',
                '父母宫': '父母可能有开创精神，但家庭可能缺乏稳定感，变动是成长的背景音。'
            }
        },
        en: {
            name: 'Po Jun',
            title: 'The Vanguard Star — Breaker and Builder',
            element: 'Yin Water (癸水)',
            nature: 'Primary Star of the Southern Dipper',
            trait: 'Radical transformation, the pioneer\'s drive, creative destruction, the cost of perpetual renewal',
            mentalTendencies: 'Constitutionally allergic to stasis. The Po Jun character does not merely accept change — they generate it. Old forms do not merely disappoint them; they confine, and the confinement is intolerable. What the hand of Po Jun touches, it breaks open.',
            generalTendencies: 'They are the pioneers, the radicals, the founders of what did not exist before they arrived. Their destructiveness and their creativity are not opposites but expressions of the same irresistible energy. The inevitable complication: nothing that they build entirely escapes the influence of this energy. Permanence, for them, is the hardest kind of achievement.',
            dramaticCore: 'The One Who Must Destroy the Old World Before Building the New One — their genius is inseparable from their restlessness. The cost: nothing survives intact in their hands for very long. The gift: what they build, however temporary, was genuinely new.',
            palaceDesc: {
                'Life Palace': 'Po Jun in the Life Palace produces a character of radical creative force — a life of repeated destruction and renewal, each iteration more daring than the last. The question is always: what is being built in the rubble?',
                'Spouse Palace': 'Intimate partnership requires extraordinary resilience and mutual acceptance of flux. The relationship must be rebuilt continuously or it does not survive.',
                'Career Palace': 'Entrepreneurship, innovation, reform, and any field that rewards the ability to see what does not yet exist and force it into being.',
                'Wealth Palace': 'The financial life reflects the character\'s fundamental dynamic: dramatic accumulations and dramatic dispersals. The arc is wide.',
                'Virtue Palace': 'The inner life is in perpetual motion — rich, restless, and genuinely seeking. Boredom is experienced as a form of dying.',
                'Travel Palace': 'Changeability is a defining feature of the character\'s outer life. Roots do not hold easily; the horizon always beckons.',
                'Friends Palace': 'Associations form intensely and may dissolve with the same velocity. The circle is dynamic rather than stable.',
                'Health Palace': 'The body absorbs the cost of the character\'s high-output, high-velocity existence. Restorative practice is not a luxury but a necessity.',
                'Property Palace': 'Property is acquired and relinquished as part of the character\'s larger pattern of transformation. The concept of a permanent home requires conscious cultivation.',
                'Children Palace': 'The parent-child dynamic is shaped by the character\'s need for autonomy and tolerance of change. Understanding rather than rule-setting is the operating language.',
                'Siblings Palace': 'Sibling bonds are alive and changeable. The emotional accumulation beneath the turbulence is real.',
                'Parents Palace': 'The home of origin may have been creatively vital and structurally unstable. Change was the ambient condition of growing up.'
            }
        }
    }
};

// ─── 四化三语定义 ─────────────────────────────────────────────────
const FOUR_TRANSFORMATIONS_I18N = {
    '化禄': {
        zh: { name: '化禄', trait: '财富、机遇、人缘', desc: '化禄主财富增长，机遇良好，人缘旺盛，所落之宫得到滋养' },
        'zh-TW': { name: '化祿', trait: '財富、機遇、人緣', desc: '化祿主財富增長，機遇良好，人緣旺盛，所落之宮得到滋養' },
        en: { name: 'Hua Lu (Prosperity)', trait: 'Abundance, opportunity, social grace', desc: 'Hua Lu activates the palace it enters with nourishing energy — opportunities multiply, goodwill flows, and the themes of that palace are enhanced with favour and increase.' }
    },
    '化权': {
        zh: { name: '化权', trait: '权力、掌控、晋升', desc: '化权主权力掌控，决策力强，易有晋升，所落之宫事务强化' },
        'zh-TW': { name: '化權', trait: '權力、掌控、晉升', desc: '化權主權力掌控，決策力強，易有晉升，所落之宮事務強化' },
        en: { name: 'Hua Quan (Authority)', trait: 'Power, decisiveness, ascendancy', desc: 'Hua Quan concentrates force in the palace it occupies. The themes of that palace become dominant, assertive, and charged with the will to command.' }
    },
    '化科': {
        zh: { name: '化科', trait: '名声、学业、贵人', desc: '化科主名声远播，学业有成，贵人相助，所落之宫带来声誉' },
        'zh-TW': { name: '化科', trait: '名聲、學業、貴人', desc: '化科主名聲遠播，學業有成，貴人相助，所落之宮帶來聲譽' },
        en: { name: 'Hua Ke (Reputation)', trait: 'Renown, scholarly distinction, benefic assistance', desc: 'Hua Ke confers a refined lustre upon the palace it enters — reputation, learning, and the support of those in a position to elevate.' }
    },
    '化忌': {
        zh: { name: '化忌', trait: '阻碍、压力、损耗', desc: '化忌主阻碍压力，需谨慎应对，所落之宫出现漏洞与牵绊' },
        'zh-TW': { name: '化忌', trait: '阻礙、壓力、損耗', desc: '化忌主阻礙壓力，需謹慎應對，所落之宮出現漏洞與牽絆' },
        en: { name: 'Hua Ji (Obstruction)', trait: 'Impediment, pressure, the wound in the palace', desc: 'Hua Ji creates a point of vulnerability in the palace it enters — not necessarily destruction, but a leak, a recurring difficulty, a place where the life\'s energy meets its greatest resistance. In narrative terms: the fault line of the character.' }
    }
};

// ─── 辅星三语（六吉六煞）─────────────────────────────────────────
const AUXILIARY_STARS_I18N = {
    '左辅': {
        zh: { name: '左辅', trait: '助力、贵人、协作', desc: '助力之星，主贵人相助，凡事有人帮衬，团队中的重要支柱' },
        'zh-TW': { name: '左輔', trait: '助力、貴人、協作', desc: '助力之星，主貴人相助，凡事有人幫衬，團隊中的重要支柱' },
        en: { name: 'Zuo Fu', trait: 'Support, benefic assistance, collaborative strength', desc: 'The star of the left-hand aide — its presence signals that the character moves through the world with the support of capable allies and the goodwill of those in a position to assist.' }
    },
    '右弼': {
        zh: { name: '右弼', trait: '助力、贵人、协作', desc: '助力之星，与左辅同宫力量更强，主贵人相助，事成有望' },
        'zh-TW': { name: '右弼', trait: '助力、貴人、協作', desc: '助力之星，與左輔同宮力量更強，主貴人相助，事成有望' },
        en: { name: 'You Bi', trait: 'Support, benefic assistance, complementary strength', desc: 'The star of the right-hand aide — its presence amplifies the support available to the character. When Zuo Fu and You Bi appear together, the endorsement of the heavens is at its most generous.' }
    },
    '文昌': {
        zh: { name: '文昌', trait: '文采、学业、功名', desc: '文曲之星，主文采出众，学业有成，文字是命运的武器' },
        'zh-TW': { name: '文昌', trait: '文采、學業、功名', desc: '文昌之星，主文采出眾，學業有成，文字是命運的武器' },
        en: { name: 'Wen Chang', trait: 'Literary distinction, scholarly achievement, the power of the written word', desc: 'Where Wen Chang falls, words carry weight. The character is gifted in expression, learning, and the cultivation of a reputation through the quality of their mind.' }
    },
    '文曲': {
        zh: { name: '文曲', trait: '才艺、口才、艺术', desc: '才艺之星，主口才出众，艺术天赋，表达是最有力的武器' },
        'zh-TW': { name: '文曲', trait: '才藝、口才、藝術', desc: '才藝之星，主口才出眾，藝術天賦，表達是最有力的武器' },
        en: { name: 'Wen Qu', trait: 'Artistic talent, eloquence, creative and performative gifts', desc: 'Where Wen Qu falls, creative expression flourishes. The character possesses natural gifts for performance, oratory, and artistic making.' }
    },
    '天魁': {
        zh: { name: '天魁', trait: '男性贵人、机遇、幸运', desc: '贵人星，主男性贵人相助，机遇良好，关键时刻有人出手相助' },
        'zh-TW': { name: '天魁', trait: '男性貴人、機遇、幸運', desc: '貴人星，主男性貴人相助，機遇良好，關鍵時刻有人出手相助' },
        en: { name: 'Tian Kui', trait: 'Male benefactors, timely opportunity, the grace of auspicious intervention', desc: 'Tian Kui signals the presence of a significant male ally or benefactor in the domain of the palace it occupies — someone who appears at the necessary moment.' }
    },
    '天钺': {
        zh: { name: '天钺', trait: '女性贵人、机遇、幸运', desc: '贵人星，主女性贵人相助，机遇良好，贵人相扶于关键时刻' },
        'zh-TW': { name: '天鉞', trait: '女性貴人、機遇、幸運', desc: '貴人星，主女性貴人相助，機遇良好，貴人相扶於關鍵時刻' },
        en: { name: 'Tian Yue', trait: 'Female benefactors, timely opportunity, the grace of protective influence', desc: 'Tian Yue signals the presence of a significant female ally or benefactor — a figure of protective influence who intercedes at the critical hour.' }
    }
};

const MALEVOLENT_STARS_I18N = {
    '火星': {
        zh: { name: '火星', trait: '冲动、急躁、突发', desc: '冲动之星，主急躁冲动，易有突发状况，破坏性与爆发力并存' },
        'zh-TW': { name: '火星', trait: '衝動、急躁、突發', desc: '衝動之星，主急躁衝動，易有突發狀況，破壞性與爆發力並存' },
        en: { name: 'Huo Xing', trait: 'Impulsive force, sudden eruption, explosive energy', desc: 'Huo Xing introduces an element of volatility into the palace it occupies — events arrive suddenly, decisions are made before thought has had time to intervene, and the character must learn to work with, rather than against, their own intensity.' }
    },
    '铃星': {
        zh: { name: '铃星', trait: '阴沉、暗伤、记仇', desc: '阴沉之星，主记仇暗伤，易有暗疾，伤害往往从内部开始' },
        'zh-TW': { name: '鈴星', trait: '陰沉、暗傷、記仇', desc: '陰沉之星，主記仇暗傷，易有暗疾，傷害往往從內部開始' },
        en: { name: 'Ling Xing', trait: 'Suppressed force, hidden wounds, the slow burn of unresolved resentment', desc: 'Ling Xing\'s fire does not erupt — it smoulders. In the palace it occupies, difficulties tend to be internal, cumulative, and slow to declare themselves.' }
    },
    '擎羊': {
        zh: { name: '擎羊', trait: '刑伤、冲突、外伤', desc: '刑伤之星，主冲突外伤，是磨砺也是考验，意志的边界在此划定' },
        'zh-TW': { name: '擎羊', trait: '刑傷、衝突、外傷', desc: '刑傷之星，主衝突外傷，是磨礪也是考驗，意志的邊界在此劃定' },
        en: { name: 'Qing Yang', trait: 'Conflict, injury, the test of endurance', desc: 'Qing Yang marks a place of friction, opposition, and the possibility of physical or external harm. In narrative terms: the antagonist\'s point of entry, the recurring wound that must be metabolised into strength.' }
    },
    '陀罗': {
        zh: { name: '陀罗', trait: '拖延、纠结、暗疾', desc: '拖延之星，主纠结拖延，磨而不爽，但磨砺之后往往沉潜出大器' },
        'zh-TW': { name: '陀羅', trait: '拖延、糾結、暗疾', desc: '拖延之星，主糾結拖延，磨而不爽，但磨礪之後往往沉潛出大器' },
        en: { name: 'Tuo Luo', trait: 'Delay, entanglement, the grinding resistance of slow obstruction', desc: 'Tuo Luo does not block directly — it slows, it complicates, it ensures that nothing in its domain arrives easily or quickly. The palace it occupies is the arena of the character\'s longest patience.' }
    },
    '地空': {
        zh: { name: '地空', trait: '空亡、失落、精神困境', desc: '空亡之星，主失落空虚，精神困扰，但空能容万物，有时是顿悟的起点' },
        'zh-TW': { name: '地空', trait: '空亡、失落、精神困境', desc: '空亡之星，主失落空虛，精神困擾，但空能容萬物，有時是頓悟的起點' },
        en: { name: 'Di Kong', trait: 'Voidness, loss, the spiritual crisis that precedes illumination', desc: 'Di Kong empties the palace it occupies — material expectations are frustrated, tangible outcomes remain elusive. What remains is the interior. In narrative terms: the dark night of the soul, and potentially its resolution.' }
    },
    '地劫': {
        zh: { name: '地劫', trait: '劫夺、破财、突变', desc: '劫夺之星，主破财突变，易有损失，但有时是逼出转机的那把火' },
        'zh-TW': { name: '地劫', trait: '劫奪、破財、突變', desc: '劫奪之星，主破財突變，易有損失，但有時是逼出轉機的那把火' },
        en: { name: 'Di Jie', trait: 'Sudden loss, external disruption, the catastrophic catalyst', desc: 'Di Jie introduces sudden reversal into the palace it occupies — what was built can be taken, and the character must discover what survives the taking. In narrative terms: the event that forces everything into question.' }
    }
};

// ─── 导出 ─────────────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPPORTED_LANGUAGES,
        CURRENT_LANG,
        t,
        setLanguage,
        PALACES_I18N,
        MAIN_STARS_I18N,
        FOUR_TRANSFORMATIONS_I18N,
        AUXILIARY_STARS_I18N,
        MALEVOLENT_STARS_I18N
    };
}

// 暴露到 window 供其他脚本使用
if (typeof window !== 'undefined') {
    window.MAIN_STARS_I18N = MAIN_STARS_I18N;
}
