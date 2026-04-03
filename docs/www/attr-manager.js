// 8属性统一管理器
var AttrManager = {
    data: {
        cn: {
            appearance: ['威严', '温和', '锐利', '柔和', '独特', '普通'],
            speech: ['简洁', '温和', '热情', '沉稳', '幽默', '寡言'],
            behavior: ['果断', '深思', '随性', '谨慎', '有序', '自由'],
            emotion: ['外露', '内敛', '多变', '稳定', '克制', '冲动'],
            social: ['主动', '被动', '理性', '感性', '圆滑', '直率'],
            crisis: ['冷静', '果断', '求助', '逃避', '慌乱', '坚定'],
            learning: ['快速', '稳步', '依赖', '应变', '固执', '灵活'],
            growth: ['成就', '自由', '安稳', '真理', '情感', '平衡']
        },
        en: {
            appearance: ['Commanding', 'Gentle', 'Sharp', 'Warm', 'Distinctive', 'Unassuming'],
            speech: ['Direct', 'Tactful', 'Enthusiastic', 'Calm', 'Humorous', 'Reserved'],
            behavior: ['Decisive', 'Thoughtful', 'Spontaneous', 'Cautious', 'Methodical', 'Free-spirited'],
            emotion: ['Expressive', 'Reserved', 'Changeable', 'Stable', 'Controlled', 'Impulsive'],
            social: ['Leader', 'Supportive', 'Observer', 'Connector', 'Independent', 'Group-oriented'],
            crisis: ['Confront', 'Analyze', 'Seek help', 'Hide', 'Charge', 'Adapt'],
            learning: ['Practical', 'Theoretical', 'Intuitive', 'Methodical', 'Experimental', 'Traditional'],
            growth: ['Achievement', 'Freedom', 'Connection', 'Knowledge', 'Balance', 'Wisdom']
        },
        tw: {
            appearance: ['威嚴', '溫和', '銳利', '柔和', '獨特', '普通'],
            speech: ['簡潔', '溫和', '熱情', '沉穩', '幽默', '寡言'],
            behavior: ['果斷', '深思', '隨性', '謹慎', '有序', '自由'],
            emotion: ['外露', '內斂', '多變', '穩定', '克制', '衝動'],
            social: ['主動', '被動', '理性', '感性', '圓滑', '直率'],
            crisis: ['冷靜', '果斷', '求助', '逃避', '慌亂', '堅定'],
            learning: ['快速', '穩步', '依賴', '應變', '固執', '靈活'],
            growth: ['成就', '自由', '連結', '知識', '平衡', '智慧']
        }
    },
    getLang: function() {
        if (typeof CURRENT_LANG !== 'undefined') return CURRENT_LANG;
        if (typeof window.CURRENT_LANG !== 'undefined') return window.CURRENT_LANG;
        return 'cn';
    },
    get: function(attr) {
        var lang = this.getLang();
        if (lang === 'en') return this.data.en[attr] || this.data.cn[attr] || [];
        if (lang === 'tw' || lang === 'zh-TW') return this.data.tw[attr] || this.data.cn[attr] || [];
        return this.data.cn[attr] || [];
    }
};
