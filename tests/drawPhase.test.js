const { drawForPlayer } = require('../controllers/drawPhase');

describe('drawForPlayer helper', () => {
  test('draws top card into hand and mutates deck', () => {
    const playerState = { deck: ['top-card', 'second'], hand: [] };
    const drawn = drawForPlayer(playerState);
    expect(drawn).toBe('top-card');
    expect(playerState.hand).toEqual(['top-card']);
    expect(playerState.deck).toEqual(['second']);
  });

  test('returns null when deck empty', () => {
    const p = { deck: [], hand: [] };
    const drawn = drawForPlayer(p);
    expect(drawn).toBeNull();
    expect(p.hand.length).toBe(0);
  });
});