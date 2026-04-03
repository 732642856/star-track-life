/**
 * 写作素材库 - 爽点桥段和悬念制造手法
 * 用于增强人物小传生成的丰富性和独特性
 */

// ============================================
// 54个爽点桥段
// ============================================
const SUANGQIAO_BRIDGES = [
    {
        id: 'sq01',
        title: '珍宝唾手可得',
        desc: '对别人很珍贵的宝物对主角而言唾手可得',
        type: '能力展示',
        applicableStars: ['紫微', '天机', '太阳', '天府'],
        arcPosition: '前期'
    },
    {
        id: 'sq02',
        title: '打假冒牌货',
        desc: '小有名气时撞到假装自己招摇撞骗的冒牌货',
        type: '身份认同',
        applicableStars: ['紫微', '天相', '太阳', '廉贞'],
        arcPosition: '前期'
    },
    {
        id: 'sq03',
        title: '大佬出面',
        desc: '隐藏身份时被小弟挑衅，老大连忙出来道歉赔礼',
        type: '身份反转',
        applicableStars: ['紫微', '天相', '天府', '太阴'],
        arcPosition: '前期'
    },
    {
        id: 'sq04',
        title: '事后淡定',
        desc: '做出惊天动地的事情后轻描淡写的跟围观群众谈笑风生',
        type: '能力展示',
        applicableStars: ['紫微', '太阳', '武曲', '七杀'],
        arcPosition: '中期'
    },
    {
        id: 'sq05',
        title: '义气救人',
        desc: '无论用何种代价，哪怕是在旁人眼中直呼不值当的代价也要救下小弟、亲人、朋友等等',
        type: '情感羁绊',
        applicableStars: ['紫微', '天相', '天府', '太阴'],
        arcPosition: '全期'
    },
    {
        id: 'sq06',
        title: '不知情救人',
        desc: '他人寄希望于主角出手救治绝境、病痛，但主角并不知晓',
        type: '命运机缘',
        applicableStars: ['天机', '太阴', '天梁', '天同'],
        arcPosition: '前期'
    },
    {
        id: 'sq07',
        title: '技能发挥',
        desc: '在别人手中名不见经传的技能，在主角手里能派上大用场',
        type: '能力展示',
        applicableStars: ['天机', '天梁', '太阴', '天同'],
        arcPosition: '中期'
    },
    {
        id: 'sq08',
        title: '身份被轻视',
        desc: '明明是被主人费尽心思请来的贵宾，但主角却被看门的/其他客人为难',
        type: '身份反转',
        applicableStars: ['紫微', '天相', '太阳', '武曲'],
        arcPosition: '前期'
    },
    {
        id: 'sq09',
        title: '被忽视的高手',
        desc: '其他人眼里的神秘高手，其实就是被他们一直忽视/轻视/嘲笑的主角',
        type: '身份反转',
        applicableStars: ['天机', '天梁', '太阴', '巨门'],
        arcPosition: '前期'
    },
    {
        id: 'sq10',
        title: '无用变宝物',
        desc: '主角手里有一种自己虽然没什么用但可以跟神秘商人换取宝物的物品',
        type: '机缘巧合',
        applicableStars: ['天机', '天梁', '太阴', '天同'],
        arcPosition: '前期'
    },
    {
        id: 'sq11',
        title: '大佬请教',
        desc: '聚会时，一个个看起来威风八面的人物见到主角路过后纷纷放下颜面，去向主角请教/拜师/称赞',
        type: '能力展示',
        applicableStars: ['紫微', '天相', '天府', '太阳'],
        arcPosition: '中期'
    },
    {
        id: 'sq12',
        title: '严格训练',
        desc: '主角用全力或者极其严格的方法来训练小弟，让人期待小弟训练出师之后的实力和表现',
        type: '领导力',
        applicableStars: ['紫微', '天相', '七杀', '破军'],
        arcPosition: '中期'
    },
    {
        id: 'sq13',
        title: '不被看好取胜',
        desc: '主角拿着所有人都不看好的武器/宠物/功法/其他对战同等条件比他好的敌人，出乎所有人的预料取胜',
        type: '逆袭',
        applicableStars: ['七杀', '破军', '武曲', '贪狼'],
        arcPosition: '中期'
    },
    {
        id: 'sq14',
        title: '化解致命物',
        desc: '有一种东西在别人眼里看来危险致命，但主角可以轻松化解',
        type: '能力展示',
        applicableStars: ['天机', '天梁', '太阴', '天同'],
        arcPosition: '中期'
    },
    {
        id: 'sq15',
        title: '意外回报',
        desc: '被主角帮助的人带来了意料之外的丰厚回报',
        type: '善有善报',
        applicableStars: ['天相', '天梁', '太阴', '天府'],
        arcPosition: '全期'
    },
    {
        id: 'sq16',
        title: '隐藏的危险',
        desc: '设置一些隐藏的危险，让主角和读者一同着急，迫切的想要让主角变强来解决事情',
        type: '危机感',
        applicableStars: ['破军', '贪狼', '巨门', '廉贞'],
        arcPosition: '中期'
    },
    {
        id: 'sq17',
        title: '坚守底线',
        desc: '即使面对强敌、困境，主角也坚守着某种底线和信念，让读者为之钦佩',
        type: '信念',
        applicableStars: ['紫微', '天相', '天梁', '天府'],
        arcPosition: '全期'
    },
    {
        id: 'sq18',
        title: '与怪人为友',
        desc: '主角跟一群性格古怪但实力高强的人称兄道弟',
        type: '社交圈',
        applicableStars: ['贪狼', '天机', '天同', '巨门'],
        arcPosition: '中期'
    },
    {
        id: 'sq19',
        title: '暂存装备',
        desc: '主角获得了暂时用不上但当他提升实力后能够使用的装备',
        type: '伏笔',
        applicableStars: ['天机', '太阴', '天梁', '破军'],
        arcPosition: '前期'
    },
    {
        id: 'sq20',
        title: '变废为宝',
        desc: '主角拥有变废为宝的能力，从别人手中获取破烂再转手变成宝物高价卖出',
        type: '能力展示',
        applicableStars: ['天机', '贪狼', '巨门', '破军'],
        arcPosition: '全期'
    },
    {
        id: 'sq21',
        title: '歪门邪道',
        desc: '能力不一定用在正道，也可以用在各种歪门邪道，让人震惊',
        type: '反套路',
        applicableStars: ['贪狼', '巨门', '廉贞', '破军'],
        arcPosition: '全期'
    },
    {
        id: 'sq22',
        title: '宠物有秘密',
        desc: '获得了一只宠物，本以为是普通的小动物，没想到另有秘密',
        type: '伏笔',
        applicableStars: ['天机', '太阴', '天同', '贪狼'],
        arcPosition: '前期'
    },
    {
        id: 'sq23',
        title: '出头保护',
        desc: '同伴被强者欺压，主角为其出头，不被看好，却出乎意料的影响巨大',
        type: '义气',
        applicableStars: ['紫微', '天相', '武曲', '七杀'],
        arcPosition: '中期'
    },
    {
        id: 'sq24',
        title: '隐藏身份',
        desc: '主角隐藏身份，不知道的人当他是小角色，但知道真相的人期待他可以站出来',
        type: '身份反转',
        applicableStars: ['紫微', '天相', '太阳', '太阴'],
        arcPosition: '前期'
    },
    {
        id: 'sq25',
        title: '劫掠获赞',
        desc: '劫掠恶人的物品不但可以不劳而获，还能收获好评',
        type: '反套路',
        applicableStars: ['武曲', '七杀', '破军', '贪狼'],
        arcPosition: '全期'
    },
    {
        id: 'sq26',
        title: '护短获拥戴',
        desc: '善待小弟，为小弟谋福利，护短，让小弟的态度由不服逐渐变为敬畏、臣服、引以为荣',
        type: '领导力',
        applicableStars: ['紫微', '天府', '天相', '太阳'],
        arcPosition: '全期'
    },
    {
        id: 'sq27',
        title: '危机获益',
        desc: '在别人看来是遭遇了危机，但主角非但没有大碍，还能从中获取好处',
        type: '逆袭',
        applicableStars: ['天机', '天梁', '七杀', '破军'],
        arcPosition: '中期'
    },
    {
        id: 'sq28',
        title: '误会救人',
        desc: '主角和无法战胜的敌人战斗，只为去救兄弟或者女人。殊不知女主角或兄弟并非被绑架，而是因为那是他们自己的家族',
        type: '误会',
        applicableStars: ['紫微', '武曲', '天相', '太阴'],
        arcPosition: '中期'
    },
    {
        id: 'sq29',
        title: '顽强站起',
        desc: '尽管被轻易击倒，但主角依旧顽强站起，周围的哄笑声越来越小，知情者/被救者在暗处大为感动，两眼含泪',
        type: '意志',
        applicableStars: ['紫微', '武曲', '七杀', '天梁'],
        arcPosition: '全期'
    },
    {
        id: 'sq30',
        title: '涌泉相报',
        desc: '滴水之恩以涌泉相报，对于曾经帮助过自己的人，主角往往能回报让人吃惊的贵重物品或者帮助',
        type: '善有善报',
        applicableStars: ['天相', '天府', '太阴', '天梁'],
        arcPosition: '全期'
    },
    {
        id: 'sq31',
        title: '小弟力量',
        desc: '不知情者用小弟的强大贬低主角，却不知小弟的力量是主角赐予的',
        type: '身份反转',
        applicableStars: ['紫微', '天相', '七杀', '天府'],
        arcPosition: '中期'
    },
    {
        id: 'sq32',
        title: '不愿分离',
        desc: '被派到主角身边打探情报、不情不愿的小弟或者美女，主角得知真相以后让其离开，前者却不愿分离',
        type: '情感羁绊',
        applicableStars: ['天相', '天府', '太阴', '天同'],
        arcPosition: '全期'
    },
    {
        id: 'sq33',
        title: '震惊轻视者',
        desc: '一直轻视主角的人被为主角办事的小弟、朋友或者关系所震惊',
        type: '身份反转',
        applicableStars: ['太阳', '武曲', '七杀', '破军'],
        arcPosition: '中期'
    },
    {
        id: 'sq34',
        title: '看戏心态',
        desc: '只有主角得知了真相、事情原委，一直都在看一场好戏',
        type: '掌控感',
        applicableStars: ['紫微', '天机', '天梁', '太阴'],
        arcPosition: '中期'
    },
    {
        id: 'sq35',
        title: '解谜高手',
        desc: '别人感觉深奥到无法完成、解开的谜题，主角可以完成',
        type: '能力展示',
        applicableStars: ['天机', '天梁', '太阴', '巨门'],
        arcPosition: '中期'
    },
    {
        id: 'sq36',
        title: '势力联合',
        desc: '相互敌对的势力因为主角的影响而联合到一起',
        type: '领导力',
        applicableStars: ['紫微', '天相', '天府', '太阳'],
        arcPosition: '中期'
    },
    {
        id: 'sq37',
        title: '完善传承',
        desc: '来自神秘世家的美女获得了残缺的传承，而主角可以帮她完善能力、功法',
        type: '能力展示',
        applicableStars: ['天机', '天梁', '太阴', '天府'],
        arcPosition: '中期'
    },
    {
        id: 'sq38',
        title: '快速完成',
        desc: '短时间内完成让别人绝望的事情',
        type: '能力展示',
        applicableStars: ['天机', '武曲', '七杀', '破军'],
        arcPosition: '中期'
    },
    {
        id: 'sq39',
        title: '被欺骗的忠犬',
        desc: '被欺骗的忠犬至死都在等待将它抛弃的人归来',
        type: '悲剧',
        applicableStars: ['天相', '天梁', '太阴', '天同'],
        arcPosition: '全期'
    },
    {
        id: 'sq40',
        title: '对敌狠对友善',
        desc: '主角对敌人阴险狡诈、不择手段、玩弄心术，但对朋友诚挚且慷慨',
        type: '双重性格',
        applicableStars: ['紫微', '武曲', '廉贞', '贪狼'],
        arcPosition: '全期'
    },
    {
        id: 'sq41',
        title: '化解致命一击',
        desc: '将别人视为不可抵挡的致命一击轻松化解，甚至拿来做烧烤',
        type: '能力展示',
        applicableStars: ['天机', '天梁', '七杀', '破军'],
        arcPosition: '中期'
    },
    {
        id: 'sq42',
        title: '特长发挥作用',
        desc: '主角的某个特长在某个关键时刻可以派上大用场',
        type: '能力展示',
        applicableStars: ['天机', '太阴', '天同', '巨门'],
        arcPosition: '中期'
    },
    {
        id: 'sq43',
        title: '努力回报',
        desc: '不单是奇遇和外挂，主角通过付出远超常人的努力和汗水得到的回报更有说服力和期望',
        type: '努力',
        applicableStars: ['武曲', '七杀', '天梁', '紫微'],
        arcPosition: '全期'
    },
    {
        id: 'sq44',
        title: '认真搞笑',
        desc: '主角去严肃认真的搞笑',
        type: '反套路',
        applicableStars: ['天同', '太阴', '贪狼', '巨门'],
        arcPosition: '全期'
    },
    {
        id: 'sq45',
        title: '蚍蜉撼树',
        desc: '在别人看来好笑的蚍蜉撼树，对主角来说其实是有好处',
        type: '反套路',
        applicableStars: ['天机', '天梁', '七杀', '破军'],
        arcPosition: '中期'
    },
    {
        id: 'sq46',
        title: '平凡中的不平凡',
        desc: '平凡中见不平凡，比如每次考试都一分不差的考到60分',
        type: '隐藏实力',
        applicableStars: ['天机', '太阴', '天同', '天梁'],
        arcPosition: '全期'
    },
    {
        id: 'sq47',
        title: '只赢一点点',
        desc: '主角每次都只赢别人一点点，但别人怎么也追不上',
        type: '能力展示',
        applicableStars: ['天机', '太阴', '天梁', '七杀'],
        arcPosition: '全期'
    },
    {
        id: 'sq48',
        title: '反教训',
        desc: '想要让老大教训主角的小弟反过来被知情的老大教训了一遍',
        type: '身份反转',
        applicableStars: ['紫微', '天相', '天府', '太阳'],
        arcPosition: '前期'
    },
    {
        id: 'sq49',
        title: '聪明的手下',
        desc: '聪明人会让自己的手下不去招惹主角，不聪明的人要么消失了，要么在尝试过后也变聪明了',
        type: '能力展示',
        applicableStars: ['紫微', '天机', '天梁', '太阳'],
        arcPosition: '全期'
    },
    {
        id: 'sq50',
        title: '幕后掌控者',
        desc: '谁都不知道那个势力明面上的掌控者，其实是听命于主角的傀儡',
        type: '身份反转',
        applicableStars: ['紫微', '天机', '贪狼', '巨门'],
        arcPosition: '中期'
    },
    {
        id: 'sq51',
        title: '高岭之花',
        desc: '无人能及的高岭之花，因为一件小事对主角产生了好感，但主角并不知情',
        type: '情感',
        applicableStars: ['太阴', '天同', '贪狼', '天相'],
        arcPosition: '全期'
    },
    {
        id: 'sq52',
        title: '升级后的第一件事',
        desc: '刻苦努力、升级之后的第一件事最让读者感到期待',
        type: '伏笔',
        applicableStars: ['武曲', '七杀', '破军', '天梁'],
        arcPosition: '全期'
    },
    {
        id: 'sq53',
        title: '大小智慧',
        desc: '有小聪明，也有大智慧',
        type: '能力展示',
        applicableStars: ['天机', '天梁', '巨门', '贪狼'],
        arcPosition: '全期'
    },
    {
        id: 'sq54',
        title: '隐藏身份发展',
        desc: '被强大的势力抛弃，隐瞒身份从零发展，在大势力有难时施以援手',
        type: '身份反转',
        applicableStars: ['紫微', '天相', '七杀', '破军'],
        arcPosition: '全期'
    }
];

// ============================================
// 63种悬念制造手法
// ============================================
const SUSPENSE_TECHNIQUES = [
    {
        id: 'xs01',
        title: '信息泄漏',
        desc: '信息屡屡泄漏——可能有卧底',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs02',
        title: '未知卧底',
        desc: '已知有卧底但不知是谁——大家纷纷猜测，人人自危',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs03',
        title: '关键人物死亡',
        desc: '有人莫名死亡/关键人物死亡致使线索断裂——凶手是谁？',
        type: '悬疑',
        applicableStars: ['七杀', '武曲', '廉贞', '破军'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs04',
        title: '模糊遗言',
        desc: '死者临死前留下了含义模糊的遗言',
        type: '悬疑',
        applicableStars: ['巨门', '太阴', '天机', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs05',
        title: '证据指向主角',
        desc: '所有证据指向主角——主角怎样洗清冤屈？',
        type: '悬疑',
        applicableStars: ['天相', '紫微', '太阳', '武曲'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs06',
        title: '知情者接连死亡',
        desc: '知道某秘密的人接连死亡——通常会剩最后一个，主角会找到并保护他',
        type: '悬疑',
        applicableStars: ['天相', '太阴', '天梁', '紫微'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs07',
        title: '诉说真相无人信',
        desc: '某角色发现了真相，不断诉说真相，却没人相信或者搭理他——他将如何取信别人？会不会被反派所杀？',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '天梁', '天相'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs08',
        title: '反派被感化',
        desc: '反派被英雄慢慢感化或是爱上了英雄——会不会改换阵营？',
        type: '情感',
        applicableStars: ['天相', '太阴', '天同', '天府'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs09',
        title: '关系恶化',
        desc: '两人或两派关系不断恶化——最后会不会分裂？',
        type: '情感',
        applicableStars: ['巨门', '廉贞', '七杀', '武曲'],
        conflictType: '关系矛盾'
    },
    {
        id: 'xs10',
        title: '逐步黑化',
        desc: '某角色受尽欺负，逐步黑化——最后会悬崖勒马还是丧心病狂？',
        type: '情感',
        applicableStars: ['巨门', '廉贞', '七杀', '破军'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs11',
        title: '道德困境',
        desc: '某角色陷入了"天理、国法、人情"或是"忠孝难两全"的道德困境中——他会怎样选择？',
        type: '道德',
        applicableStars: ['天相', '天梁', '紫微', '天府'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs12',
        title: '话里有话',
        desc: '某角色忽然说了几句似乎大有深意的话——是我们过度解读了，还是真的话里有话？',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs13',
        title: '难言苦衷',
        desc: '某角色有着难言的苦衷，总是欲言又止',
        type: '情感',
        applicableStars: ['太阴', '天同', '天相', '天府'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs14',
        title: '回忆秘密',
        desc: '某角色不断回忆着过去——可能涉及即将被揭露的惊天秘密',
        type: '悬疑',
        applicableStars: ['太阴', '天梁', '天机', '巨门'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs15',
        title: '失忆拼凑秘密',
        desc: '某角色记忆错乱/记忆受损/失忆——最后这些碎片化的记忆片段会拼凑出一个惊天秘密',
        type: '悬疑',
        applicableStars: ['太阴', '天梁', '天机', '巨门'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs16',
        title: '限时任务',
        desc: '主角被迫接受一项有时间限制的高难度任务——事态将怎样发展？',
        type: '悬疑',
        applicableStars: ['七杀', '武曲', '破军', '紫微'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs17',
        title: '神秘事物',
        desc: '某事物/信息被各色人物不断提及——到底是什么？背后有何秘密？谁会得到它？',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs18',
        title: '被伪君子欺骗',
        desc: '主角被伪君子所欺骗或利用了——是否是主角将计就计？主角何时发现真相？',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs19',
        title: '异常场景',
        desc: '某些场景明显不符合常识——现在发生的可能是"戏中戏"，一场梦，想象出来的',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs20',
        title: '被闯入',
        desc: '某角色的家里/办公室似乎被闯入并翻找过',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs21',
        title: '性情大变',
        desc: '某角色性情大变/忽然暴富/行为古怪/明显有秘密——有异常的事情发生',
        type: '悬疑',
        applicableStars: ['巨门', '廉贞', '天机', '太阴'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs22',
        title: '埋藏事物',
        desc: '某角色神情慌张地埋/藏某事物——牵涉重要线索',
        type: '悬疑',
        applicableStars: ['巨门', '太阴', '天机', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs23',
        title: '甩不掉',
        desc: '某角色卖力地丢掉某事物，却甩不掉此物',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs24',
        title: '从未同时出现',
        desc: '两个角色从未同时出现，且有惊人相似之处——可能是同一个人',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs25',
        title: '神奇魔力',
        desc: '某事物/角色展现出神奇魔力——会成为争夺或拉拢的对象',
        type: '悬疑',
        applicableStars: ['天机', '天梁', '紫微', '太阳'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs26',
        title: '临终托付',
        desc: '主角有奇遇，垂死之人交给他一个东西——主角随后会被卷入正反两派或多派的纷争中',
        type: '悬疑',
        applicableStars: ['紫微', '天相', '太阳', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs27',
        title: '暗中帮助',
        desc: '有神秘人物不断供给主角重要信息/提示，暗中帮助主角',
        type: '悬疑',
        applicableStars: ['太阴', '天梁', '天机', '天相'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs28',
        title: '反派目的不明',
        desc: '反派出现在某场景中，目的不明——反派动机是什么？',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs29',
        title: '被跟踪',
        desc: '主角被不明人士跟踪/监视',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs30',
        title: '朋友有麻烦',
        desc: '主角的朋友神秘失踪/被绑架/入狱/惹上各种麻烦——主角怎样救朋友？',
        type: '情感',
        applicableStars: ['天相', '太阴', '武曲', '七杀'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs31',
        title: '猪队友',
        desc: '主角有个多嘴的朋友/猪队友——一看就迟早要出事',
        type: '情感',
        applicableStars: ['天同', '巨门', '贪狼', '天机'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs32',
        title: '身世之谜',
        desc: '主角发现自己的身世是个谜——涉及重大秘密，或在寻亲过程中发现重大秘密',
        type: '悬疑',
        applicableStars: ['太阴', '天梁', '天机', '天相'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs33',
        title: '陌生环境醒来',
        desc: '主角醒来，发现自己身处陌生的病房/废墟/小岛/破屋（可能还是失忆的）',
        type: '悬疑',
        applicableStars: ['太阴', '天机', '天梁', '巨门'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs34',
        title: '一闪而过的人物',
        desc: '一闪而过的人物——最后可能是关键人物屡次出现的事物（通常是看起来无关紧要的东西）——关键时刻会扭转局势',
        type: '悬疑',
        applicableStars: ['天机', '天梁', '太阴', '巨门'],
        conflictType: '伏笔'
    },
    {
        id: 'xs35',
        title: '奇怪声音',
        desc: '忽然响起的奇怪声音（通常是尖叫声），或者不明飞行物/窗外黑影',
        type: '悬疑',
        applicableStars: ['巨门', '太阴', '天机', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs36',
        title: '神秘关系',
        desc: '两个角色间似乎有着神秘关系',
        type: '悬疑',
        applicableStars: ['太阴', '天机', '天梁', '巨门'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs37',
        title: '大有玄机',
        desc: '大有玄机的眼神或者小动作',
        type: '悬疑',
        applicableStars: ['巨门', '太阴', '天机', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs38',
        title: '知道又不知道',
        desc: 'A似乎知道又似乎不知道B的秘密',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs39',
        title: '装作不知道',
        desc: 'A知道B的秘密，却装作不知道',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs40',
        title: '意义不明的信件',
        desc: '意义不明的信件/地图/信息——隐藏着大秘密',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs41',
        title: '真假难辨',
        desc: '某关键事物或线索真假难辨',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs42',
        title: '预言童谣',
        desc: '恐怖的预言/童谣/传说/梦境——内有隐情，慢慢揭秘',
        type: '悬疑',
        applicableStars: ['太阴', '天梁', '天机', '巨门'],
        conflictType: '伏笔'
    },
    {
        id: 'xs43',
        title: '预言成真',
        desc: '预言不断成为现实，人人自危',
        type: '悬疑',
        applicableStars: ['太阴', '天梁', '天机', '巨门'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs44',
        title: '大灾难即将来临',
        desc: '僵尸/致命病毒/世界末日/外星人/大灾难即将来到',
        type: '悬疑',
        applicableStars: ['七杀', '破军', '廉贞', '武曲'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs45',
        title: '信息出卖',
        desc: '某角色所透露的信息出卖了他（如果他是清白无辜的，不可能知道此信息）',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs46',
        title: '罗生门',
        desc: '几人的说法自相矛盾/罗生门',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs47',
        title: '带着面具',
        desc: '某角色一直带着面具——最后面具会被揭下，让大家大吃一惊',
        type: '悬疑',
        applicableStars: ['巨门', '太阴', '天机', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs48',
        title: '掩盖谎言',
        desc: '某角色说了谎，又不断用更大的谎言掩盖上一个谎言——如何收场？',
        type: '悬疑',
        applicableStars: ['巨门', '廉贞', '天机', '太阴'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs49',
        title: '多重身份',
        desc: '某角色有着不为人知的双重或多重身份',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs50',
        title: '身份伪装',
        desc: '某角色掩盖了自己的真实身份去做事，比如穷人充富/富人装穷，平民冒充官员/官员微服私访——什么时候会被发现？他周围人发现后会有什么反应？',
        type: '悬疑',
        applicableStars: ['紫微', '天机', '天相', '巨门'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs51',
        title: '假装有优点',
        desc: '某角色试图自己或让家人/朋友表现出根本没有的优点——会不会露馅？会怎样露馅？',
        type: '悬疑',
        applicableStars: ['巨门', '天机', '太阴', '天梁'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs52',
        title: '一夜暴富',
        desc: '某角色一夜暴富/成名/破产——他会发生怎样的改变？',
        type: '情感',
        applicableStars: ['贪狼', '武曲', '天府', '破军'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs53',
        title: '神秘实验',
        desc: '有人在做神秘的实验/布局',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs54',
        title: '设套陷害',
        desc: 'B威胁到了A的地位/A设套给B钻/A陷害B——B的结局会是怎样的？',
        type: '悬疑',
        applicableStars: ['巨门', '廉贞', '天机', '武曲'],
        conflictType: '内部矛盾'
    },
    {
        id: 'xs55',
        title: '英雄变老',
        desc: '英雄变老/受伤/遭遇各种变故——还能不能像往常一样打败反派？',
        type: '情感',
        applicableStars: ['天相', '天梁', '太阴', '紫微'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs56',
        title: '能力起伏',
        desc: '某角色的武功/魔法/智力起伏不定，时有时无',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs57',
        title: '不同阶级相遇',
        desc: '两个观点/阶级/背景完全不同的人相遇——会怎样争吵？',
        type: '情感',
        applicableStars: ['紫微', '太阳', '武曲', '贪狼'],
        conflictType: '关系矛盾'
    },
    {
        id: 'xs58',
        title: '致命缺点',
        desc: '某角色有一个致命的缺点——这个缺点最后会不会害死他？',
        type: '情感',
        applicableStars: ['巨门', '廉贞', '破军', '贪狼'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs59',
        title: '穿越时空',
        desc: '某角色穿越时空，打算更改命运',
        type: '悬疑',
        applicableStars: ['天机', '天梁', '太阴', '天同'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs60',
        title: '与反派交易',
        desc: '某角色无奈下与反派做交易——下场会如何？',
        type: '情感',
        applicableStars: ['巨门', '廉贞', '武曲', '天相'],
        conflictType: '内心挣扎'
    },
    {
        id: 'xs61',
        title: '过于顺利',
        desc: '一切过于顺利——明显有诈；如果无诈，那就是主角疑心生暗鬼',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    },
    {
        id: 'xs62',
        title: '恩怨情仇',
        desc: '和主角有着恩怨情仇的角色出现——明显会有故事发生',
        type: '情感',
        applicableStars: ['武曲', '七杀', '廉贞', '破军'],
        conflictType: '关系矛盾'
    },
    {
        id: 'xs63',
        title: '诅咒之物',
        desc: '某物克主人（传说被诅咒过），拥有它的上几任都死于非命',
        type: '悬疑',
        applicableStars: ['天机', '巨门', '太阴', '天梁'],
        conflictType: '外部威胁'
    }
];

// ============================================
// 辅助函数
// ============================================

/**
 * 根据主星筛选合适的爽点桥段
 */
function getSuitableSuangqiaoBridges(mainStars) {
    const suitable = SUANGQIAO_BRIDGES.filter(bridge => {
        // 如果没有指定适用星曜，则适用于所有星曜
        if (!bridge.applicableStars || bridge.applicableStars.length === 0) {
            return true;
        }
        // 检查主星是否在适用列表中
        return mainStars.some(star => bridge.applicableStars.includes(star));
    });
    return suitable;
}

/**
 * 根据主星筛选合适的悬念手法
 */
function getSuitableSuspenseTechniques(mainStars) {
    const suitable = SUSPENSE_TECHNIQUES.filter(tech => {
        // 如果没有指定适用星曜，则适用于所有星曜
        if (!tech.applicableStars || tech.applicableStars.length === 0) {
            return true;
        }
        // 检查主星是否在适用列表中
        return mainStars.some(star => tech.applicableStars.includes(star));
    });
    return suitable;
}

/**
 * 随机选择指定数量的爽点桥段
 */
function selectRandomSuangqiaoBridges(count, mainStars) {
    const suitable = getSuitableSuangqiaoBridges(mainStars);
    // 随机打乱
    const shuffled = suitable.sort(() => Math.random() - 0.5);
    // 返回前count个
    return shuffled.slice(0, count);
}

/**
 * 随机选择指定数量的悬念手法
 */
function selectRandomSuspenseTechniques(count, mainStars) {
    const suitable = getSuitableSuspenseTechniques(mainStars);
    // 随机打乱
    const shuffled = suitable.sort(() => Math.random() - 0.5);
    // 返回前count个
    return shuffled.slice(0, count);
}

/**
 * 根据人物弧光位置筛选爽点桥段
 */
function selectSuangqiaoBridgesByArcPosition(arcPosition, mainStars) {
    const suitable = getSuitableSuangqiaoBridges(mainStars);
    return suitable.filter(bridge => {
        // 全期或者指定位置
        return bridge.arcPosition === '全期' || bridge.arcPosition === arcPosition;
    });
}

// 导出到全局
window.WRITING_RESOURCES = {
    SUANGQIAO_BRIDGES,
    SUSPENSE_TECHNIQUES,
    getSuitableSuangqiaoBridges,
    getSuitableSuspenseTechniques,
    selectRandomSuangqiaoBridges,
    selectRandomSuspenseTechniques,
    selectSuangqiaoBridgesByArcPosition
};
