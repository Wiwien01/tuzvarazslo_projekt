let player = {

    skill: 10,
    stamina: 20,
    luck: 9,
    gold: 5,

    inventory: [
        "Kard",
        "Pajzs",
        "Lámpás",
        "10 adag élelem"
    ]

};

let currentChapter = 1;

const chapters = {

    1: {

        text:
        "Két nap gyaloglás után végre megérkezel a Tűzhegyhez. A hatalmas hegy gyomrában rejtőzik Zagor, a rettegett varázsló kincse. Előtted sötétlik a barlang bejárata.",

        choices: [

            {
                text: "Belépsz a barlangba",
                next: 2
            },

            {
                text: "Pihensz egyet",
                next: 3
            }

        ]
    },

    2: {

        text:
        "A sötét folyosón lépteid visszhangoznak. Hirtelen egy Goblin ugrik elő és rozsdás kardjával rád támad!",

        enemy: {

            name: "Goblin",
            skill: 5,
            stamina: 6
        }
    },

    3: {

        text:
        "Leülsz egy sziklára és elfogyasztasz egy adag élelmet. Erőd lassan visszatér.",

        effect: {
            stamina: 4
        },

        choices: [

            {
                text: "Belépsz a barlangba",
                next: 2
            }

        ]
    },

    4: {

        text:
        "A Goblin holtan rogy a földre. Az övében 3 aranypénzt találsz.",

        reward: {
            gold: 3
        },

        choices: [

            {
                text: "Továbbmész",
                next: 5
            }

        ]
    },

    5: {

        text:
        "Egy elágazáshoz érsz. Balról hideg levegő áramlik, jobbról furcsa morgást hallasz.",

        choices: [

            {
                text: "Bal oldali folyosó",
                next: 6
            },

            {
                text: "Jobb oldali folyosó",
                next: 7
            }

        ]
    },

    6: {

        text:
        "A padló hirtelen beszakad alattad. Bár sikerül megkapaszkodnod, megsérülsz.",

        effect: {
            stamina: -3
        },

        choices: [

            {
                text: "Kimászol és továbbmész",
                next: 8
            }

        ]
    },

    7: {

        text:
        "Egy régi ládára bukkansz. Benne egy mágikus kard lapul, amely növeli harci tudásodat.",

        effect: {
            skill: 2
        },

        item: "Varázskard",

        choices: [

            {
                text: "Felveszed és továbbmész",
                next: 8
            }

        ]
    },

    8: {

        text:
        "Megérkezel a Tűzhegy mélyebb járataihoz. A kaland innen még veszélyesebbé válik...",

        choices: []
    }

};

function updateStats(){

    document.getElementById("skill").innerText = player.skill;

    document.getElementById("stamina").innerText = player.stamina;

    document.getElementById("luck").innerText = player.luck;

    document.getElementById("gold").innerText = player.gold;

    updateInventory();
}

function updateInventory(){

    let inventory = document.getElementById("inventory");

    inventory.innerHTML = "";

    player.inventory.forEach(item => {

        let li = document.createElement("li");

        li.innerText = item;

        inventory.appendChild(li);

    });

}

function showChapter(){

    let chapter = chapters[currentChapter];

    document.getElementById("chapterNumber").innerText =
        currentChapter;

    document.getElementById("story").innerText =
        chapter.text;

    let buttons = document.getElementById("buttons");

    buttons.innerHTML = "";

    if(chapter.effect){

        if(chapter.effect.stamina){

            player.stamina += chapter.effect.stamina;

        }

        if(chapter.effect.skill){

            player.skill += chapter.effect.skill;

        }

    }

    if(chapter.reward){

        player.gold += chapter.reward.gold;

    }

    if(chapter.item){

        if(!player.inventory.includes(chapter.item)){

            player.inventory.push(chapter.item);

        }

    }

    updateStats();

    if(chapter.enemy){

        let fightButton =
            document.createElement("button");

        fightButton.innerText =
            "Harc indul";

        fightButton.onclick = function(){

            fight(chapter.enemy);

        };

        buttons.appendChild(fightButton);

    }

    else{

        chapter.choices.forEach(choice => {

            let button =
                document.createElement("button");

            button.innerText =
                choice.text;

            button.onclick = function(){

                currentChapter = choice.next;

                showChapter();

            };

            buttons.appendChild(button);

        });

    }

}

function dice(){

    return Math.floor(Math.random() * 6) + 1;

}

function addLog(text){

    let log = document.getElementById("log");

    let line = document.createElement("div");

    line.innerText = text;

    log.prepend(line);

}

function fight(enemy){

    let playerAttack =
        dice() + dice() + player.skill;

    let enemyAttack =
        dice() + dice() + enemy.skill;

    addLog(
        "Te: " + playerAttack +
        " | " +
        enemy.name + ": " +
        enemyAttack
    );

    if(playerAttack > enemyAttack){

        enemy.stamina -= 2;

        addLog(
            "Megsebzed az ellenfelet!"
        );

    }

    else if(enemyAttack > playerAttack){

        player.stamina -= 2;

        addLog(
            "Sebződtél! -2 ÉLETERŐ"
        );

    }

    else{

        addLog(
            "Döntetlen forduló."
        );

    }

    updateStats();

    if(enemy.stamina <= 0){

        addLog(
            enemy.name +
            " meghalt."
        );

        currentChapter = 4;

        showChapter();

    }

    if(player.stamina <= 0){

        alert("Meghaltál!");

        restartGame();

    }

}

function saveGame(){

    let saveData = {

        player: player,
        currentChapter: currentChapter

    };

    localStorage.setItem(
        "firetopSave",
        JSON.stringify(saveData)
    );

    alert("Játék elmentve!");

}

function loadGame(){

    let saveData =
        JSON.parse(
            localStorage.getItem("firetopSave")
        );

    if(saveData){

        player = saveData.player;

        currentChapter =
            saveData.currentChapter;

        updateStats();

        showChapter();

        alert("Mentés betöltve!");

    }

}

function restartGame(){

    location.reload();

}

updateStats();

showChapter();