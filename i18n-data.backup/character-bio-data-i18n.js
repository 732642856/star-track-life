/**
 * 星轨人生 - 人物小传数据
 */

var CharacterBioData = {
    getBioTemplate: function(patternType) {
        return {
            structure: [
                '人物概述',
                '性格特质',
                '人生轨迹',
                '情感世界',
                '命运走向'
            ]
        };
    }
};

if (typeof window !== 'undefined') {
    window.CharacterBioData = CharacterBioData;
}
