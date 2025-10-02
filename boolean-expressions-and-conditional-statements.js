/*

Objective:
You will practice creating and combining boolean expressions
to drive logic and outcomes in you program.

Instructions:
If you are not familiar with the concept of a text-based adventure game,
let's set the scene...
Example: "You wake up in a dark forest. There are two paths ahead of you:
one leading to the mountains and one to a village.
Your choices will determine your fate!"

Define the Requirements: You must:
  - Write conditional statements to handle player choices.
  - Use boolean expressions to combine multiple conditions.
  - Include at least one use of logical operators (&&, ||, !).

Starter Code:
  - Run the following command in your terminal to install the readline-sync module:
    npm install readline-sync

Paste the following code into your editor:

*/

const readline = require('readline-sync');

// Player state / inventory (start values)
let hasTorch = true;
let hasMap = false;
let hasSword = false;
let hasCompass = false;
let gold = 5; // small amount to buy items
let health = 10;

console.log("Welcome to the Adventure of Boolean Forks!");
console.log("Your choices will determine your fate. Inventory: torch, map, sword, compass.");

// Helper to normalize input
function ask(prompt, autoValue) {
  if (process.env.AUTO_PLAY === '1') {
    // In automated mode, return the provided autoValue (string) so the script can be tested non-interactively
    console.log(prompt + " " + `(auto: ${autoValue})`);
    return autoValue;
  }
  const ans = readline.question(prompt + " ");
  return ans.trim().toLowerCase();
}

// Show inventory
function showInventory() {
  console.log("-- Inventory --");
  console.log(`Torch: ${hasTorch}, Map: ${hasMap}, Sword: ${hasSword}, Compass: ${hasCompass}, Gold: ${gold}, Health: ${health}`);
}

// Start scene
console.log("You wake up at a crossroads. To the north are the mountains; to the east is a small village.");
let choice = ask("Do you go to the 'mountains', the 'village', or 'stay' to look around?", 'village');

// normalize possible input forms
choice = choice.toLowerCase();

if (choice === 'stay') {
  console.log("You look around and find a small compass half-buried in the dirt.");
  hasCompass = true;
  gold += 2;
  console.log("You pocket the compass and find 2 gold coins.");
  showInventory();
  // After staying, prompt again
  choice = ask("Now do you go to the 'mountains' or the 'village'?", 'mountains');
}

if (choice === 'mountains') {
  console.log("You head toward the mountains. The path narrows and a cave mouth yawns ahead.");
  const mountainChoice = ask("Do you 'enter' the cave, 'climb' the peak, or 'return' to the crossroads?", 'enter');

  if (mountainChoice === 'enter') {
    // Cave requires torch or map (you might navigate with a map)
    if (hasTorch || hasMap) {
      console.log("Light guides you through the cave. You discover a sleeping wolf guarding a chest.");
      // nested conditional: decide to sneak or fight
      const action = ask("Do you try to 'sneak' past, 'fight' the wolf, or 'take' the chest quietly?", 'fight');
      if (action === 'sneak' && !hasTorch) {
        // sneaking without torch has a chance to fail
        console.log("You try to sneak but trip over a stone in the dark and wake the wolf. You get injured.");
        health -= 4;
      } else if (action === 'fight' && hasSword) {
        console.log("With your sword you slay the wolf and open the chest. It's full of gold!");
        gold += 20;
      } else if (action === 'fight' && !hasSword) {
        console.log("You have no sword. You try to fight with your hands and barely escape.");
        health -= 6;
      } else if (action === 'take' && (hasTorch || hasCompass)) {
        // using torch or compass to time the move
        console.log("You carefully time the wolf's breaths and slip the chest away without waking it.");
        gold += 10;
      } else {
        console.log("Your attempt fails and you are forced to flee the cave.");
        health -= 2;
      }
    } else {
      // cannot enter safely
      console.log("The cave is pitch black. Without a torch or a map you decide it's too risky and turn back.");
    }
  } else if (mountainChoice === 'climb') {
    // climbing requires compass OR map; demonstrate || operator
    if (hasCompass || hasMap) {
      console.log("Using your sense of direction you climb to the peak and find a panoramic view. You spot a ruined tower with a sign of treasure.");
      // if you also have torch AND sword, you get the best ending for this branch
      if (hasTorch && hasSword) {
        console.log("With light and a weapon you explore the tower and recover a legendary amulet. You win glory!");
        gold += 50;
      } else if (hasTorch && !hasSword) {
        console.log("You explore the tower by torchlight but a collapsed beam blocks the treasure. You return with knowledge but no treasure.");
      } else {
        console.log("You decide not to enter the risky tower and descend safely.");
      }
    } else {
      console.log("Without a compass or map the climb is too dangerous — you get lost and come back down.");
      health -= 1;
    }
  } else {
    console.log("You return to the crossroads.");
    // fall-through to village if returning
    choice = 'village';
  }

} 

if (choice === 'village') {
  console.log("You walk into the village. People bustle through a market and a friendly blacksmith hammers at his forge.");
  const villageChoice = ask("Do you visit the 'market', the 'blacksmith', or the 'inn'?", 'blacksmith');

  if (villageChoice === 'market') {
    console.log("The market sells a map for 7 gold and a sturdy sword for 12 gold. You can also trade.");
    // combine conditions: can buy map if you have gold OR if you persuade a merchant (simulated by having compass)
    if (gold >= 7 || hasCompass) {
      if (gold >= 7) {
        gold -= 7;
        hasMap = true;
        console.log("You purchase a map. It feels reassuring to have one.");
      } else {
        // trade: give compass to get map
        hasCompass = false;
        hasMap = true;
        console.log("You trade your compass for a wide map. You feel conflicted but prepared.");
      }
    } else {
      console.log("You don't have enough gold to buy anything here.");
    }

  } else if (villageChoice === 'blacksmith') {
    console.log("The blacksmith offers to sharpen your blade or sell you a sword for 12 gold.");
    if (hasSword) {
      console.log("He sharpens your sword and gives you a minor health tonic (+2 health).");
      health += 2;
    } else if (gold >= 12) {
      gold -= 12;
      hasSword = true;
      console.log("You buy a fine sword from the blacksmith.");
    } else {
      console.log("You can't afford a sword, but the blacksmith gives you some advice on fighting.");
    }

  } else if (villageChoice === 'inn') {
    console.log("At the inn you hear tales of a hidden treasure in the mountains and a band of thieves nearby.");
    const talk = ask("Do you 'listen' to the rumor or 'sleep' at the inn to recover?", 'listen');
    if (talk === 'listen') {
      console.log("You learn that a map exists in the ruins above the mountain caves.");
      // nested condition: if you don't have map, you can now seek the ruins
      if (!hasMap) {
        console.log("Armed with new knowledge, you decide to try to acquire the map.");
      }
    } else {
      console.log("You sleep and recover some health.");
      health += 3;
    }
  }

  // chance encounter: thieves attack if you have gold and no sword
  if (gold > 0 && !hasSword) {
    console.log("On your way out, a gang of thieves tries to mug you.");
    if (hasTorch && hasMap) {
      console.log("Using your torch and map distraction, you manage to escape with some gold.");
      gold = Math.max(0, gold - 2);
    } else if (hasSword) {
      console.log("You fend them off with your sword.");
    } else {
      console.log("You are overwhelmed and lose some health and gold.");
      health -= 3;
      gold = Math.max(0, gold - 3);
    }
  }
}

// Final outcome evaluation using boolean expressions and logical operators
console.log('\n-- Final Evaluation --');
showInventory();

if ((gold >= 30 && hasSword) || (hasMap && hasCompass && health > 5)) {
  console.log("You finish your adventure triumphant: wealth and gear ensure your legend.");
} else if (health <= 0) {
  console.log("You fought bravely, but your wounds were too severe. The adventure ends here.");
} else if (!hasTorch && !hasMap && !hasCompass) {
  // use of ! operator to check lack of items
  console.log("Though you survived, you learned the hard way that preparation matters. Try again with better gear.");
} else {
  console.log("You survive and have stories to tell, but your quest is far from complete.");
}

console.log('Thank you for playing!');

/* 

Add Customization and expand the game:
  - Add more choices and scenarios.
  - Include additional items (e.g., a sword, a compass).
  - Use nested conditionals and logical operators to create complex outcomes.

*/