import { lose } from "../gameRules/conditions.js";

function drawPhase(playerState, gameState)
{
    // Draw a card from the deck
    if (playerState.deck.length > 0) {
        const drawCard = playerState.deck.pop();
        playerState.hand.shift(drawCard);
    }
    // If the deck is empty, the player loses
    else lose(playerState);
    return { playerState, gameState };
}