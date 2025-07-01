// --- DOM Elements ---
const startBtn = document.getElementById('start-btn');
const introContainer = document.getElementById('intro-container');
const quizContainer = document.getElementById('quiz-container');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const choicesContainer = document.getElementById('choices-container');
const moneyStat = document.getElementById('money-stat');
const messageBox = document.getElementById('message-box');
const restartBtn = document.getElementById('restart-btn');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');

// --- Game State & Data ---
let stats = {}; 
let scores = {};
let currentQuestionIndex = 0;

function initializeStats() {
    stats = {
        money: 10.00,
        hasGun: false,
        hasHorse: false,
        isArrested: false
    };

    scores = {
        rancher: 0, // Ray -- family, stability, animals
        gunslinger: 0, // Chowder -- smooth talker, volatile, addictive 
        prospector: 0, // Dr. Jerry -- wealth, intelligence, future-thinking
        gambler: 0, // Michael --  
        sheriff: 0, // Donald -- power, influence, 
        outlaw: 0, // Jerry? -- 
        drifter: 0, // V? -- 
        wrangler: 0, // Arjun -- improving, one-track, 
        sidekick: 0, // Ed -- loyalty, novelty, living in the moment
        entertainer: 0 // Kelley -- center of attention, games
    };

}

const questions = [
    {
        imageUrl: "assets/bar.png",
        text: "You stumble into the saloon, your flask empty and your mouth parched, and make your way to the bar. </br></br><i>\"What'll it be, pardner?\"</i>",
        choices: [
            { text: "Clean drinkin' <b><u>water</u></b>'s what I need right now.", cost: 0.50, effects: [['sidekick', 1], ['wrangler', 1]] },
            { text: "Your finest <b><u>whiskey</u></b>", cost: 0.30, effects: [['gunslinger', 1], ['prospector', 1]] },
            { text: "Gotta stay sharp... gimme a hot <b><u>coffee</u></b>.", cost: 0.10, effects: [['rancher', 1], ['wrangler', 1]] },
            { text: "A sarsaparilla <b><u>soda</u></b> sounds refreshing...", cost: 0.10, effects: [['drifter', 1], ['entertainer', 1], ['gambler', 1], ['outlaw', 1]] },
            { text: "Got <b><u>milk</u></b>?", cost: 0.20, effects: [['sidekick', 1], ['sheriff', 1]] }
        ]
    },
    {
        imageUrl: "assets/buckles2.png",
        text: "Feeling refreshed, you head to the general store—you need a new belt buckle to complete your look.",
        choices: [
            { text: "The silver <b><u>Eagle</u></b>", cost: 1.50, effects: [['entertainer', 1], ['drifter', 1], ['gambler', 1], ['prospector', 1]] },
            { text: "The bronze <b><u>Longhorn</u></b>", cost: 1, effects: [['rancher', 2], ['sheriff', 1], ['sidekick', 1]] },
            { text: "The gold <b><u>Rattlesnake</u></b>", cost: 2, effects: [['gunslinger', 1], ['outlaw', 1], ['prospector', 1]] },
            { text: "The iron <b><u>Wolf</u></b>", cost: 1, effects: [['drifter', 1], ['wrangler', 1], ['sheriff', 1]] },
        ]
    },
    {
        text: "A town ain't safe for a traveler without protection. What'll you arm yourself with?",
        choices: [
            { text: "A trusty <b><u>Revolver</u></b>", cost: 7, effects: [['gunslinger', 1], ['riskiness', 1]], setsFlag: 'hasGun' },
            { text: "A formidable Sawn-off <b><u>shotgun</u></b>", cost: 6, effects: [['strength', 1], ['tradition', 1]], setsFlag: 'hasGun' },
            { text: "A sharp <b><u>Whip</u></b>", cost: 4, effects: [['strength', 1]] },
            { text: "These bare <b><u>fists</u></b> are all I need", cost: 0, effects: [['strength', 1], ['frugality', 1]] },
            { text: "I'm a <b><u>pacifist</u></b>, friend.", cost: 0, effects: [['community', 1], ['frugality', 1], ['strength', 1]] }
        ]
    },
     {
        text: "Your pockets are feelin' light. A person's gotta make a livin' somehow.",
        choices: [
            { text: "Toil as a cattle hand at the local ranch. (earn $20.00)", earning: 20, effects: [['workEthic', 3], ['strength', 2], ['tradition', 1]] },
            { text: "Try your luck mining for gold.", earning: 20, effects: [['workEthic', 3], ['riskiness', 1]] },
            { text: "Gamble your savings at the saloon.", earning: 30, effects: [['riskiness', 3], ['workEthic', -2], ['social', 1]], check: () => stats.money >= 5 },
            { text: "Hunt a wanted man for a bounty.", earning: 30, effects: [['riskiness', 2], ['community', 1], ['tradition', 2]], check: () => stats.hasGun },
            { text: "Rob a lone traveler on the road.", earning: 60, effects: [['community', -4], ['tradition', -4], ['riskiness', 2]], check: () => stats.hasGun },
            { text: "Compete in the local rodeo.", earning: 30, effects: [['riskiness', 2], ['strength', 1], ['social', 2]]}
        ]
    },
    {
        text: "A good horse is worth its weight in gold. Which steed will you buy?",
        choices: [
            { text: "A magnificent, powerful Golden Stallion", cost: 40, effects: [['strength', 1], ['social', 1], ['frugality', -2]], setsFlag: 'hasHorse'},
            { text: "A sturdy, reliable Brown Mule", cost: 20, effects: [['workEthic', 1], ['frugality', 1]], setsFlag: 'hasHorse'},
            { text: "A swift, silent Black Mare", cost: 30, effects: [['riskiness', 1]], setsFlag: 'hasHorse' },
            { text: "I'd rather walk, thanks.", cost: 0, effects: [['frugality', 2], ['strength', 1]] }
        ]
    },
    {
        text: "As you're leaving the general store, the stern-faced Sheriff stops you. \"Hold it right there. You're new in town. What's your business here?\"",
        choices: [
            { text: "Grease his palm with a 'donation'.", cost: 10, effects: [['tradition', -2], ['community', -1], ['frugality', -2]] },
            { text: "Calmly explain you're just passin' through.", effects: [['tradition', 1], ['social', 1]] },
            { text: "Shove him aside and make a run for it.", effects: [['tradition', -3], ['riskiness', 2]], action: 'getArrested' },
            { text: "Spit on the ground and tell him it's none of his business.", effects: [['tradition', -2], ['riskiness', 1]], action: 'getArrested' }
        ]
    },
    {
        condition: () => stats.isArrested, // This question only appears if the player is arrested.
        text: "You wake up in a dusty jail cell. The key is hanging on a hook just out of reach. The sun is setting.",
        choices: [
             { text: "Wait to see the judge in the morning.", effects: [['tradition', 2], ['riskiness', -2]] },
             { text: "Try to sweet-talk the deputy when he brings dinner.", effects: [['social', 2], ['community', -1]] },
             { text: "Use a loose belt buckle to try and pick the lock.", effects: [['riskiness', 2], ['workEthic', 1], ['tradition', -2]], action: 'escapeJail' },
             { text: "Break the cot and use a leg to try and reach the keys.", effects: [['strength', 2], ['riskiness', 1], ['tradition', -2]], action: 'escapeJail' }
        ]
    }
];

// --- Result Definitions ---
// Each result has a name, description, and a condition function.
// The first result whose condition returns 'true' will be the player's outcome.
const results = [
    {
        name: "Outlaw",
        description: "You live by your own rules, taking what you need and letting no one stand in your way. The law is just a suggestion, and the frontier is your kingdom.",
        condition: () => stats.tradition <= -4 && stats.community <= -2
    },
    {
        name: "Marshal",
        description: "Justice and order are your creed. You're a beacon of law in the untamed west, protecting the innocent and punishing the wicked. Your word is the law.",
        condition: () => stats.tradition >= 4 && stats.community >= 2
    },
    {
        name: "Gunslinger",
        description: "You're known for your steady hand and quick draw. Whether for justice or for coin, your reputation with a firearm precedes you. You're a legend in the making.",
        condition: () => stats.riskiness >= 3 && stats.strength >= 3 && stats.hasGun
    },
    {
        name: "Wrangler",
        description: "You're a hard-working soul, connected to the land and the animals. You find peace in an honest day's labor and the simple rhythm of ranch life.",
        condition: () => stats.workEthic >= 4 && stats.strength >= 2 && !stats.isArrested
    },
     {
        name: "Prospector",
        description: "You're drawn by the siren song of gold and hidden riches. You're willing to work hard and get your hands dirty for the chance at a life-changing discovery.",
        condition: () => stats.workEthic >= 4 && stats.frugality >= 1
    },
    {
        name: "Gambler",
        description: "Life's a game of chance, and you're not afraid to go all-in. You thrive on risk and reward, always ready to bet it all on the turn of a card or the roll of a die.",
        condition: () => stats.riskiness >= 4 && stats.workEthic <= -2
    },
    {
        name: "Pioneer",
        description: "You're a builder, a dreamer, forging a new life in a new land. You face hardship with resilience, driven by the promise of a better future for yourself and your family.",
        condition: () => stats.community >= 2 && stats.workEthic >= 2 && stats.frugality >= 1
    },
     {
        name: "Drifter",
        description: "You're a wanderer, belonging to no place and no one. The open road is your home, and the horizon is your only destination. The journey IS the destination.",
        // Default if no other condition is met
        condition: () => true
    }
];


// --- Functions ---

/**
 * Hides the intro, shows the quiz, and starts the game from the first question.
 */
function startGame() {
    initializeStats();
    currentQuestionIndex = 0;
    introContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    displayQuestion();
}

/**
 * Displays the current question and its choices.
 */
function displayQuestion() {
    // Check if we've run out of questions. If so, show the result.
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    let currentQuestion = questions[currentQuestionIndex];

    // Skip conditional questions if their condition function returns false.
    if (currentQuestion.condition && !currentQuestion.condition()) {
        currentQuestionIndex++;
        displayQuestion();
        return;
    }

    updateStatsDisplay();

    // Display image if available
    if (currentQuestion.imageUrl) {
        // Create an image element if it doesn't exist, or update its source
        let imgElement = document.getElementById('current-question-image');
        if (!imgElement) {
            imgElement = document.createElement('img');
            imgElement.id = 'current-question-image';
            imgElement.classList.add('w-full', 'max-h-96', 'object-cover', 'mb-4', 'rounded-lg'); // Add some styling
            // Insert the image before the question text
            questionContainer.insertBefore(imgElement, questionText);
        }
        imgElement.src = currentQuestion.imageUrl;
        imgElement.alt = "Scene from the Wild West quiz"; // Add alt text for accessibility
        imgElement.classList.remove('hidden'); // Ensure image is visible
    } else {
        // Hide the image if no URL is provided for the current question
        let imgElement = document.getElementById('current-question-image');
        if (imgElement) {
            imgElement.classList.add('hidden');
        }
    }

    questionText.innerHTML = currentQuestion.text;
    choicesContainer.innerHTML = ''; // Clear out choices from the previous question.

    // Create a button for each choice in the current question.
    currentQuestion.choices.forEach(choice => {
        const button = document.createElement('button');
        button.classList.add('choice-button', 'w-full', 'p-4', 'bg-amber-100', 'border-amber-700', 'rounded-lg', 'text-left', 'hover:bg-amber-200');
        
        let buttonText = choice.text;
        if (choice.cost) {
            buttonText += ` ($${choice.cost.toFixed(2)})`;
        }
        // } else if (choice.earning) {
        //      buttonText += ` (Earn ~$${choice.earning.toFixed(2)})`;
        // }
        button.innerHTML = buttonText;

        // Disable button if player can't afford it or a special check fails (e.g., needs a gun).
        const canAfford = choice.cost === undefined || stats.money >= choice.cost;
        const checkPasses = choice.check === undefined || choice.check();
        if (!canAfford || !checkPasses) {
            button.disabled = true;
            if (!canAfford) {
                button.title = "You can't afford this.";
            } else {
                 button.title = "You can't do this right now.";
            }
        }
        
        button.onclick = () => selectChoice(choice);
        choicesContainer.appendChild(button);
    });
}

/**
 * Handles the logic when a player clicks a choice.
 * @param {object} choice The choice object that was clicked.
 */
function selectChoice(choice) {
    // Update money based on cost or earning.
    if (choice.cost) stats.money -= choice.cost;
    if (choice.earning) stats.money += choice.earning;

    // Apply all personality trait effects.
    if (choice.effects) {
        choice.effects.forEach(([trait, value]) => {
            stats[trait] += value;
        });
    }

    // Set any special flags (e.g., 'hasGun').
    if (choice.setsFlag) {
        stats[choice.setsFlag] = true;
    }
    
    // Trigger any special actions (e.g., 'getArrested').
    if (choice.action) {
        handleAction(choice.action);
    }

    // Show a temporary message about money spent or earned.
    let message = '';
    if (choice.cost) message = `You spent $${choice.cost.toFixed(2)}.`;
    if (choice.earning) message = `You earned $${choice.earning.toFixed(2)}!`;
    
    if (message) {
        showMessage(message, 'info');
    }

    // Move to the next question after a short delay.
    setTimeout(() => {
        currentQuestionIndex++;
        hideMessage();
        displayQuestion();
    }, 1000);
}

/**
 * Executes special, non-stat actions based on a choice.
 * @param {string} actionName The name of the action to perform.
 */
function handleAction(actionName) {
    if(actionName === 'getArrested') {
        stats.isArrested = true;
         showMessage('The Sheriff throws you in jail!', 'warning');
    }
     if(actionName === 'escapeJail') {
        stats.isArrested = false;
         showMessage('You managed to escape!', 'success');
    }
}

/**
 * Updates the money display on the screen.
 */
function updateStatsDisplay() {
    moneyStat.textContent = `Money: $${stats.money.toFixed(2)}`;
}

/**
 * Shows a message at the bottom of the question area.
 * @param {string} text The message to display.
 * @param {string} type The type of message ('info', 'warning', 'success') for styling.
 */
function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.classList.remove('hidden');
    messageBox.classList.remove('bg-blue-200', 'bg-red-200', 'bg-green-200'); // Clear old colors
    if (type === 'info') messageBox.classList.add('bg-blue-200');
    if (type === 'warning') messageBox.classList.add('bg-red-200');
    if (type === 'success') messageBox.classList.add('bg-green-200');
}

/**
 * Hides the message box.
 */
function hideMessage() {
    messageBox.classList.add('hidden');
}

/**
 * Hides the question container and displays the final result screen.
 */
function showResult() {
    questionContainer.classList.add('hidden');
    
    // Find the first result whose condition is met.
    const finalResult = results.find(result => result.condition());

    resultTitle.textContent = finalResult.name;
    resultDescription.textContent = finalResult.description;
    
    resultContainer.classList.remove('hidden');
}

// --- Event Listeners ---
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// --- Initial Call ---
// On page load, initialize the stats but wait for the user to click "start".
initializeStats();
