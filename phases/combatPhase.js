// phases/combatPhase.js
const GameSession = require('../models/GameSession');
const Card = require('../models/Cards');

async function combatPhase(gameId, playerId, action) {
  const { attackerId, defenderId, targetPlayerId } = action;

  const game = await GameSession.findById(gameId);
  if (!game) throw new Error('Game not found');

  // Ensure state structure exists
  game.state = game.state || {};
  game.state.playerStates = game.state.playerStates || {};

  const playerState = game.state.playerStates[playerId];
  const opponentState = game.state.playerStates[targetPlayerId];

  if (!playerState || !opponentState) {
    throw new Error('Player state not found');
  }

  // Ensure basic fields exist
  playerState.board = playerState.board || [];
  opponentState.board = opponentState.board || [];
  playerState.graveyard = playerState.graveyard || [];
  opponentState.graveyard = opponentState.graveyard || [];
  playerState.life = playerState.life ?? 8000;
  opponentState.life = opponentState.life ?? 8000;

  // (Optional) enforce that it's actually combat phase and the right player's turn
  // if (game.state.phase !== 'combat') {
  //   throw new Error(`Cannot attack during ${game.state.phase} phase`);
  // }

  let message = '';

  // 🔹 Make sure the attacker is on the active player's board
  const attackerIndex = playerState.board.findIndex(
    (id) => id.toString() === attackerId.toString()
  );
  if (attackerIndex === -1) {
    throw new Error('Attacker is not on the board');
  }

  const attackerCard = await Card.findById(attackerId);
  if (!attackerCard) throw new Error('Attacker card not found');

  // ======================
  // 1) DIRECT ATTACK
  // ======================
  if (!defenderId) {
    // No defender: direct attack to life points
    opponentState.life -= attackerCard.ATK_PTS;

    message = `${attackerCard.Card_Names} attacked directly for ${attackerCard.ATK_PTS} damage.`;


    // Check win condition: opponent LP <= 0
    if (opponentState.life <= 0) {
      game.winner = playerId;
      game.state.phase = 'finished';
      await game.save();
      return {
        game,
        nextPhase: game.state.phase,
        message: `${message} ${playerId} wins the game!`,
      };
    }

    // Not game over → you can decide what nextPhase is
    game.state.phase = 'main';
    await game.save();
    return {
      game,
      nextPhase: game.state.phase,
      message,
    };
  }

  // ======================
  // 2) ATTACKING A MONSTER
  // ======================

  // Defender must be on opponent's board
  const defenderIndex = opponentState.board.findIndex(
    (id) => id.toString() === defenderId.toString()
  );
  if (defenderIndex === -1) {
    throw new Error('Defender is not on the board');
  }

  const defenderCard = await Card.findById(defenderId);
  if (!defenderCard) throw new Error('Defender card not found');

  // 🧮 ATK vs ATK (attack-position vs attack-position)
  const diff = attackerCard.ATK_PTS - defenderCard.ATK_PTS;

  if (diff > 0) {
    // Attacker wins:
    // - Defender card destroyed
    // - Opponent loses LP equal to the difference
    opponentState.board.splice(defenderIndex, 1);
    opponentState.graveyard.push(defenderId);

    opponentState.life -= diff;

    message = `${attackerCard.Card_Names} destroyed ${defenderCard.Card_Names} and dealt ${diff} damage to the opponent.`;


    // Win check
    if (opponentState.life <= 0) {
      game.winner = playerId;
      game.state.phase = 'finished';
      await game.save();
      return {
        game,
        nextPhase: game.state.phase,
        message: `${message} ${playerId} wins the game!`,
      };
    }
  } else if (diff < 0) {
    // Defender wins:
    // - Attacker card destroyed
    // - Attacking player loses LP equal to the difference
    playerState.board.splice(attackerIndex, 1);
    playerState.graveyard.push(attackerId);

    const damage = Math.abs(diff);
    playerState.life -= damage;

    message = `${defenderCard.Card_Names} destroyed ${attackerCard.Card_Names} and dealt ${damage} damage to the attacker.`;


    // Win check
    if (playerState.life <= 0) {
      game.winner = targetPlayerId;
      game.state.phase = 'finished';
      await game.save();
      return {
        game,
        nextPhase: game.state.phase,
        message: `${message} ${targetPlayerId} wins the game!`,
      };
    }
  } else {
    // Equal ATK: both destroyed, no LP damage
    opponentState.board.splice(defenderIndex, 1);
    opponentState.graveyard.push(defenderId);

    playerState.board.splice(attackerIndex, 1);
    playerState.graveyard.push(attackerId);

    message = `${attackerCard.Card_Names} and ${defenderCard.Card_Names} destroyed each other. No life point damage.`;

  }

  // Not finished → move back to main phase (or end phase, up to you)
  game.state.phase = 'main';
  await game.save();

  return {
    game,
    nextPhase: game.state.phase,
    message,
  };
}

module.exports = { combatPhase };
