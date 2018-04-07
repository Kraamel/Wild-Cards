let heroes = [];
let deck = {};


// on commence par fetch l'API en all.json
const getHeroes = () => {
    return fetch(`https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/all.json`)
        .then(response => response.json())
}


// j'aimerais en selectionner certains à l'aide de l'index. Je dois d'abord créer une fonction random à l'aide de Math.random pour avoir un chiffre au hasard compris entre 1 et la taille du fichier contenant les heros, il sera donc retourné seulement le hero correspondant à l'index (heroes étant un tableau contenant tous les heros sous forme d'objet, il suffit de mettre entre crochet un nombre random pour avoir une valeur contenant les info d'un héro)
const getRandomHero = () => {
    const randomId = parseInt(Math.random() * (heroes.length - 1) + 1)
    return heroes[randomId]
}


// après avoir fait la fonction qui me permettra d'avoir un hero en random, je veux l'afficher. JIl me faut donc un template en html avec les informations que je souhaite afficher (les données dans les clés sont les paths de chaques élément dans l'array heroes de l'api)
const showHero = () => {
    let hero = getRandomHero() // la fonction nous donne un hero random
    deck[hero.id] = hero
    let template = `
        <div data-id="${hero.id}" class="container-hero card covered" onclick="selectCard(this)">
            <p class="hero-name">${hero.name}</p>
            <img class="hero-img" src="${hero.images.sm}" alt="${hero.name}"/>
            <div class="stats">
                <p class="hero-strength stat"><img src="image/001-strength.png" alt="strength"/>${hero.powerstats.strength}</p>
                <p class="hero-speed stat"><img src="image/002-urgency.png" alt="speed"/>${hero.powerstats.speed}</p>
                <p class="hero-intelligence stat"><img src="image/003-brain.png" alt="intelligence"/>${hero.powerstats.intelligence}</p>
                <p class="hero-durability stat"><img src="image/001-shield.png" alt="durability"/>${hero.powerstats.durability}</p>
                <p class="hero-power stat"><img src="image/003-green-energy.png" alt="power"/>${hero.powerstats.power}</p>
                <p class="hero-combat stat"><img src="image/002-swords-crossed.png" alt="combat"/>${hero.powerstats.combat}</p>
            </div>
        </div>
    `
    document.getElementById('container-arena').innerHTML += template; // il faut maintenant utiliser innerHtml pour pouvoir inserer le template (+= car il y en aura plusieurs et donc eviter de les écraser) à l'endroit selectionner par la getElementById
}

// je veux maintenant avoir un deck soit plusieur cartes de hero, il suffit donc de créer une fonction qui va appeler x fois la fonction qui me donne un hero
const showDeck = count => {
    for (let  i of Array(count).keys()) {
        showHero()
    }
}

// ensuite les joueurs devront sélectionner une carte, il faut pouvoir détecter quelle carte a été choisi, de plus seule 2 cartes devront être sélectionné. d'où l'utilité du togge . on doit aussi rajouter un remove si les joueurs choisisent plus de 2 cartes. Ils devront donc recommencer et choisir 2 cartes
const selectCard = element => {
    const selectedCards = document.querySelectorAll('.selected')
    element.classList.toggle('selected')
    element.classList.toggle('selected-' + (selectedCards.length + 1))
    if (selectedCards.length >= 2) {
        selectedCards.forEach(element => {
            element.classList.remove('selected')
            element.classList.remove('selected-1')
            element.classList.remove('selected-2')
        })
    }
}


// ce qui se passent quand on click sur fight
const fight = () => {
    let selectedHeroes = [] // d'abord on initialise un tableau vide

    if (document.querySelectorAll('.selected').length < 2) { // si les joueurs lancent l'action fight sans avoir selctionner 2 joueurs, on envoie une alerte
        alert('Please select two cards')
        return
    }
    document.querySelectorAll('.card').forEach(element => {
        if (element.classList.contains('selected')) {
            const heroId = element.getAttribute('data-id')
            selectedHeroes.push(deck[heroId]) // on va ainsi garder dans le deck seulement les cartes selctionnés
        } else {
            element.remove() // et supprimer les autres
        }
        element.classList.remove('covered') //on retire aussi la classe covered qui avait pour but de cacher les cartes affichées
    })

    const winnerId = getWinner(selectedHeroes)

    document.querySelector(`.card[data-id="${winnerId}"]`).classList.add('winner')

    selectedHeroes = [];
}


const computeScore = hero => {
    return Object.values(hero.powerstats).reduce((x, y) => x + y)
}

const getWinner = heroes => {
    let winner = {
        id: 0,
        score: 0
    };
    Object.values(heroes).forEach(hero => {
        const score = computeScore(hero);
        if (winner.score < score) {
            winner.id = hero.id
            winner.score = score
        }
    })

    const audio = new Audio('music/youWin.mp3');
    audio.play();

    return winner.id
}

const replay = () => {
    document.getElementById('container-arena').innerHTML = ''
    showDeck(5)
}


async function main() {
    heroes = await getHeroes();
    showDeck(5)
}

main()

