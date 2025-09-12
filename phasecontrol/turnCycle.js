import { upkeepPhase } from "./upkeepPhase.js";
import { drawPhase } from "phases/drawPhase.js";
import { mainPhase } from "./mainPhase.js";
import { combatPhase } from "./combatPhase.js";

function turnCycle(playerState, gameState) {
{
    let currentphase = "upkeep";
    
    while(currentphase)
            switch(currentphase) {
                case "upkeep":
                    upkeepPhase(playerState, gameState);
                    currentphase = "draw";
                    break;

                case "draw":
                    drawPhase(playerState, gameState);
                    currentphase = "main";
                    break;

                case "main":
                    mainPhase(playerState, gameState);
                    currentphase = "combat";
                    break;

                case "combat":
                    combatPhase(playerState, gameState);
                    currentphase = "end";
                    break;
            }
    return { playerState, gameState };
        }
}