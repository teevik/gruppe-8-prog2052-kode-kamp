import type { Participant } from "../../../shared/types";
import { GAME_MODES } from "../../../shared/const";
import type { GameMode } from "../../../shared/const";

/**
 * Function that updates the scoreboard based on the results of the new
 * scoreboard-entry (game-participant with corresponding game results) by inserting
 * the scoreboard-entry into the correct position regarding the execution time of the code
 *
 * Time complexity
 * Best: O(log n)
 * Worst: O(n)
 *
 * Space complexity O(n)
 *
 * @param scoreboardEntry
 * @param currentScoreboard
 * @return The updated scoreboard
 */
export function binaryUpdateScoreboard(
  currentScoreboard: Participant[],
  scoreboardEntry: Participant
): Participant[] {
  let left = 0;
  let right = currentScoreboard.length - 1;
  let mid;

  while (left <= right) {
    mid = Math.floor((left + right) / 2);

    if (
      currentScoreboard[mid].stats.executionTime ===
      scoreboardEntry.stats.executionTime
    ) {
      left = mid + 1; // If the element is already in the array, we can decide to insert it next to it
      break;
    } else if (
      currentScoreboard[mid].stats.executionTime <
      scoreboardEntry.stats.executionTime
    ) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Insert the element at the correct position
  currentScoreboard.splice(left, 0, scoreboardEntry);

  return currentScoreboard;
}

/**
 * Function that updates the scoreboard based on the results of the new
 * scoreboard-entry (game-participant with corresponding game results) by inserting
 * the scoreboard-entry into the correct position regarding the execution time of the code
 *
 * Time complexity
 * Best: O(n)
 * Worst: O(n)
 *
 * Space complexity O(n)
 *
 * @param scoreboardEntry
 * @param currentScoreboard
 * @return The updated scoreboard
 */
export function updateScoreboard(
  currentScoreboard: Participant[],
  scoreboardEntry: Participant,
  gameMode: GameMode
): Participant[] {
  let newScoreboard: Participant[] = [];
  let scoreboardEntryInserted: boolean = false;

  if (currentScoreboard.length == 0) {
    newScoreboard.push(scoreboardEntry);
  } else {
    for (let participant of currentScoreboard) {
      let gameCondition: boolean;
      if (gameMode == GAME_MODES[0]) {
        gameCondition =
          scoreboardEntry.stats.executionTime < participant.stats.executionTime;
      } else {
        gameCondition =
          scoreboardEntry.stats.usedTime < participant.stats.usedTime;
      }

      if (
        !scoreboardEntryInserted &&
        scoreboardEntry.results.passedTests > participant.results.passedTests
      ) {
        newScoreboard.push(scoreboardEntry);
        scoreboardEntryInserted = true;
      } else if (
        !scoreboardEntryInserted &&
        scoreboardEntry.results.passedTests == participant.results.passedTests
      ) {
        if (gameCondition) {
          newScoreboard.push(scoreboardEntry);
          scoreboardEntryInserted = true;
        }
      }
      newScoreboard.push(participant);
    }
    if (!scoreboardEntryInserted) {
      newScoreboard.push(scoreboardEntry);
    }
  }

  console.log("new scoreboard", newScoreboard);

  return newScoreboard;
}
