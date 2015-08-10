/**
 * Room Name Generator
 */
function RoomNameGenerator() {}

/**
 * Adjectives
 *
 * @type {Array}
 */
RoomNameGenerator.prototype.adjectives = [
    'awesome',
    'amazing',
    'great',
    'fantastic',
    'super',
    'admirable',
    'famous',
    'fine',
    'gigantic',
    'grand',
    'marvelous',
    'mighty',
    'outstanding',
    'splendid',
    'wonderful',
    'big',
    'super',
    'smashing',
    'sensational'
];

RoomNameGenerator.prototype.nouns = [
    'game',
    'adventure',
    'fun zone',
    'arena',
    'party',
    'tournament',
    'league',
    'gala',
    'gathering',
    'bunch',
    'fight',
    'battle',
    'conflict',
    'encounter',
    'clash',
    'combat',
    'confrontation',
    'challenge'
];

/**
 * Get random name
 *
 * @return {String}
 */
RoomNameGenerator.prototype.getName = function()
{
    return 'The ' + this.getAdjective() + ' ' + this.getNoun();
};

/**
 * Get random adjective
 *
 * @return {String}
 */
RoomNameGenerator.prototype.getAdjective = function ()
{
    return this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
};

/**
 * Get random noun
 *
 * @return {String}
 */
RoomNameGenerator.prototype.getNoun = function ()
{
    return this.nouns[Math.floor(Math.random() * this.nouns.length)];
};
