function lose(playerState)
{
    if (playerState.deck.length === 0) 
        return true;

    if (playerState.health <= 0)
        return true;

    else return false;
}