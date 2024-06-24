//hangman repository : https://github.com/Zheoni/Hanger-Bot

const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { deferReply, reply, fetchReply } = require('@utils/interactionUtils.js')
const { createEmbed } = require('@utils/embedUtils.js')

/**
 * Command for playing hangman
 * Two types of games: custom and random
 * Custom: players choose a word
 * Random: bot chooses a word
 */
module.exports = {
    name: 'hangman',
    description: 'Juego del ahorcado',
    options: [
        {
            name: 'type',
            description: 'Tipo de partida',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Custom', value: 'custom' },
                { name: 'Random', value: 'random' },
            ],
        }
    ],
    run: async (client, inter) => {

        //Defer the reply
        await deferReply(inter)

        //Create the game
        const gameInfo = await startGame(inter)

        //Run the game
        await runGame(inter, gameInfo.game, gameInfo.players)

        //Show the result
        await showResult(inter, gameInfo.game, gameInfo.selector)

    }
}

/**
 * Replaces a character in a string at a given index
 * @param {number} index 
 * @param {string} replacement 
 * @returns 
 */
String.prototype.replaceAt = function (index, replacement) {
    return this.slice(0, index) + replacement + this.slice(index + replacement.length)
}

/**
 * Class for the hangman game
 */
class hangman {
    /**
     * Returns a string with n hyphens
     * @param {number} n number of hyphens
     * @returns {string} string with n hyphens
     */
    static hyphenString(n) {
        let str = ""
        for (let i = 0; i < n; ++i) {
            str += "-"
        }
        return str
    }

    /**
     * Represents the status of the game
     */
    static gameStatus = {
        lose: 0,
        inProgress: 1,
        win: 2
    }

    constructor(word) {
        this.word = word //word to guess
        this.lives = 6 //lives
        this.progress = hangman.hyphenString(word.length) //progress
        this.remaining = word.length //remaining letters to guess 
        this.misses = [] //misses
        this.status = hangman.gameStatus.inProgress //game status
    }

    /**
     * Guess a letter
     * @param {string} c - Letter to guess
     */
    guess(c) {
        if (this.progress.includes(c)) { //letter already guessed
            --this.lives
        }
        else if (this.word.includes(c)) { //letter is in the word, update progress
            for (let i = 0; i < this.word.length; ++i) {
                if (this.word[i] === c) {
                    this.progress = this.progress.replaceAt(i, this.word[i])
                    --this.remaining
                }
            }
        }
        else { //letter is not in the word, add to misses
            if (!this.misses.includes(c)) {
                this.misses.push(c)
            }
            --this.lives
        }

        //update game status
        if (this.lives == 0)
            this.status = hangman.gameStatus.lose
        else if (this.remaining == 0)
            this.status = hangman.gameStatus.win
    }

    /**
     * Guess the whole word
     * @param {string} word word to guess
     */
    guessAll(word) {
        if (this.word === word) { //word is guessed
            this.progress = this.word
            this.remaining = 0
            this.status = hangman.gameStatus.win
        }
        else { //word is not guessed
            if (--this.lives == 0)
                this.status = hangman.gameStatus.lose
        }
    }
}

// Hangman figure to show the progress of the game
const figure = [`
 +---+
 |   |      
     |
     |      
     |      
     |
==========  
`, `
 +---+
 |   |      
 O   |
     |      
     |      
     |
==========  
`, `
 +---+
 |   |      
 O   |
 |   |      
     |      
     |
==========  
`, `
 +---+
 |   |      
 O   |
/|   |      
     |      
     |
==========  
`, `
 +---+
 |   |      
 O   |
/|\\  |      
     |      
     |
==========  
`, `
 +---+
 |   |      
 O   |
/|\\  |      
/    |      
     |
==========  
`, `
 +---+
 |   |      
 O   |
/|\\  |      
/ \\  |      
     |
==========  
`]


/**
 * Function to start the game
 * @param {Interaction} inter 
 * @returns {object} game - The game object
 */
async function startGame(inter) {

    //gather players and game type
    const players = await gatherPlayers(inter)
    const gameType = await inter.options.getString('type')

    //check if enough players have joined
    if (players.length == 0)
        return await reply(inter, { content: "Nadie se ha unido al juego", embeds: [], components: [], deleteTime: 2 })
    if (gameType === "custom" && players.length < 2)
        return await reply(inter, { content: "Para una partida custom, se necesitan al menos 2 jugadores", embeds: [], components: [], deleteTime: 2 })


    //choose word according to game type
    let word, selector
    switch (gameType) {
        //random word
        case "random":
            word = wordList[Math.floor(Math.random() * wordList.length)]
            break

        //ask a player to choose a word
        case "custom":
            await reply(inter, { content: players.length + " jugadores se han unido. Seleccionando a un jugador para que elija la palabra. Mirad los DMs!!", embeds: [], components: [] })

            //get word from players
            let userSelection = await getWordFromPlayers(players, inter)

            //check if a word was chosen
            if (!userSelection || !userSelection.word || !userSelection.selector) return

            //set word and selector
            word = userSelection.word
            selector = userSelection.selector

            break
    }

    //create the game
    const game = new hangman(word)

    //If created successfully, run the game, else show error message
    if (!(game && players))
        return await reply(inter, { content: "Ha ocurrido un error al iniciar el juego", embeds: [], deleteTime: 2 })

    //return the game object
    return {
        game,
        players,
        selector
    }
}

/**
 * Function to gather players
 * @param {Interaction} inter
 * @returns {Promise<Array>} The players that have joined the game
 */
async function gatherPlayers(inter) {

    //Initial message and buttons to join the game
    const embed = createEmbed({
        color: 0x36393e,
        footer: { text: 'Hangman: Teneis 10 segundos para uniros al juego', iconURL: inter.user.displayAvatarURL() }
    })

    const join = new ButtonBuilder()
        .setLabel('Unirse al juego')
        .setCustomId(JSON.stringify({ type: 'join' }))
        .setStyle('Primary')

    const exit = new ButtonBuilder()
        .setLabel('Salir del juego')
        .setCustomId(JSON.stringify({ type: 'exit' }))
        .setStyle('Secondary')

    const row = new ActionRowBuilder().addComponents(join, exit)

    //Send initial message
    await reply(inter, { embeds: [embed], components: [row] })
    let msg = await fetchReply(inter)

    //Create a collector to gather players
    const filter = (i) => JSON.parse(i.customId).type === 'join' || JSON.parse(i.customId).type === 'exit'
    const collector = await msg.createMessageComponentCollector({ filter, time: 10000 })

    //Return a promise that resolves with the list of players when the collector ends
    return await new Promise((resolve, reject) => {

        //List of players
        let players = []

        collector.on('collect', async i => {

            try {
                //Player wants to join
                if (JSON.parse(i.customId).type === 'join') {

                    //Add player to the list if they haven't joined yet
                    if (!players.find(p => p.id === i.user.id))
                        players.push(i.user)

                    //Reply to the player
                    await reply(i, { content: 'Te has unido al juego!', ephemeral: true, deleteTime: 2, propagate: false })
                }

                //Player doesn't want to join
                else if (JSON.parse(i.customId).type === 'exit') {

                    //Remove player from the list
                    players = players.filter(p => p.id != i.user.id)

                    //Reply to the player
                    await reply(i, { content: 'Has abandonado el juego!', ephemeral: true, deleteTime: 2, propagate: false })
                }
            } catch (error) {
                reject(error)
                collector.stop()
            }

        })

        //Resolve the promise when the collector ends
        collector.on('end', () => {
            resolve(players)
        })
    })
}

/**
 * Function to get a word from a player
 * @param {Array} players - The players that have joined the game
 * @param {Interaction} inter
 * @returns {object} The word and the player that chose it
*/
async function getWordFromPlayers(players, inter) {

    //If no word is chosen and there is more than one player, choose a player to select a word
    let word, chosenOne
    while (!word && players.length > 1) {

        //Choose a player
        let index = Math.floor((Math.random() * 1000) % players.length)
        chosenOne = players[index]
        players = players.splice(index, 1)

        //Send a DM to the player
        const dm = await chosenOne.createDM()
        await dm.send("Eres el elegido! Tienes 30 segundos para escribir tu palabra. Recuerda, no participas en la partida")

        //Get the word from the player, if the player doesn't respond in time or makes more than 3 tries, choose another player
        let finish = false
        let tries = 0
        let msgCollection
        while (!finish && tries < 3) {

            //Try to get the word from the player
            try {
                msgCollection = await getNextMessage(dm, 30000)

            } catch (collected) {
                await dm.send("Se ha acabado el tiempo, estás descalificado.")
                await reply(inter, { content: "El elegido no ha respondido a tiempo, eligiendo a otro jugador" })
                finish = true
                continue
            }

            //Check if the message is a valid word, if not, try again up to 3 times
            const msg = msgCollection.first().content
            if (msg.match(`^[A-Za-zÀ-ú]{3,}$`)) {
                word = msg.toLowerCase()
                finish = true
                await dm.send("Buena palabra, volviendo al server")
            }
            else {
                await dm.send("Palabra invalida, no uses caracteres especiales ni espacios y que tenga al menos 3 letras. Intenta de nuevo")
                if (++tries == 3)
                    await dm.send("Muchas palabras invalidas, estás descalificado")

            }
        }
    }

    //If no word is chosen and there is only one player left, return
    if (!word && players.length <= 1)
        return await reply(inter, { content: "Nos hemos quedado sin jugadores", embeds: [], components: [], deleteTime: 2 })


    //Return the word and the player that chose it
    return {
        word: word,
        selector: chosenOne
    }
}

/**
 * Function to get the next message from a channel
 * @param {TextChannel} channel - The channel to get the message from
 * @param {number} maxTime - The maximum time to wait for a message
 * @returns {Promise<Message>} The message
 * 
 */
async function getNextMessage(channel, maxTime) {
    const filter = msg => !msg.author.bot
    return await channel.awaitMessages({
        filter,
        max: 1,
        time: maxTime,
        errors: ['time']
    })
}

/**
 * Function to run the game
 * @param {Interaction} inter
 * @param {hangman} game
 * @param {Array} players
 * @returns {Promise} A promise that resolves when the game ends
 */
async function runGame(inter, game, players) {

    //Show the progress
    await showProgress(inter, game, players)

    //Create a collector for the messages
    const filterM = (m) => !m.author.bot && players.find(p => p.id === m.author.id)
    const collector = await inter.channel.createMessageCollector({ filter: filterM, time: (15 * 1000 * 60) }) // max of 15 minutes per game

    //Return a promise that resolves when the game ends
    return new Promise((resolve, reject) => {

        //Message collector
        collector.on('collect', async (m) => {

            try {
                //Get letter, erase message and check if it's a valid letter
                if (m.content.match(`^[A-Za-zÀ-ú]{1,}$`)) {
                    const c = m.content.toLowerCase()
                    await m.delete()

                    //If the letter is more than one character, guess the whole word and remove the player from the list
                    if (c.length > 1) {
                        game.guessAll(c)
                        players = players.splice(players.find(p => m.author.id == p.id), 1)
                    }
                    else { //Guess the letter e.o.c.
                        game.guess(c)
                    }

                    //Show the progress
                    await showProgress(inter, game, players)

                    //Check if the game has ended, if so, stop the collectors
                    if (game.status !== hangman.gameStatus.inProgress) {
                        collector.stop()
                    } else if (players.length < 1) {
                        collector.stop()
                        game.status = hangman.gameStatus.lose
                    }
                }
            } catch (error) {
                reject(error)
                collector.stop()
            }
        })

        //End the game when the collectors end, resolve the promise and show the result
        collector.on('end', () => {
            resolve()
        })
    })
}

/**
 * Function to show the progress of the game
 * @param {Interaction} inter
 * @param {Array<ButtonBuilder>} buttonsObject
 * @param {hangman} game
 * @param {boolean} gameOver
 */
async function showProgress(inter, game, players) {
    //Set the information to show in the screen and create embed
    const embed = createEmbed({
        description: "```\n" + figure[6 - game.lives] + `\n${game.progress}` + "\n```",
        color: 0xFFD700,
        fields: [
            { name: "Vidas", value: "💖 ".repeat(game.lives) + "🖤 ".repeat(6 - game.lives), inline: true },
            { name: "Fallos", value: game.misses.join(" "), inline: true }
        ],
        footer: { text: `Jugadores: ${players.map(p => p.username).join(", ")}` }
    })

    await reply(inter, { embeds: [embed] })
}

/**
 * Function to show the result of the game
 * @param {Interaction} inter
 * @param {hangman} game
 * @param {User} selector
 */
async function showResult(inter, game, selector) {

    //Set the message and color according to the game status
    let msg = ''
    let color = 0xFFD700
    if (game.status === hangman.gameStatus.win) {
        color = 0x13f857
        if (selector)
            msg = `Has ganado!! ${selector.username}... intenta elegir una palabra mas dificil la próxima vez`
        else
            msg = "Esta vez has ganado, pero no te confies, la proxima vez puede ser diferente"
    } else if (game.status === hangman.gameStatus.lose) {
        color = 0xff2222
        if (selector)
            msg = `${selector.username} ha ganado!! La palabra era '${game.word}'`
        else
            msg = `He ganado!! La palabra era '${game.word}'`
    } else
        msg = "El juego ha acabado, se ha alcanzado el limite de 15 minutos."

    //Create embed
    const embed = createEmbed({
        footer: { text: msg, iconURL: selector ? selector.displayAvatarURL() : inter.client.user.displayAvatarURL() },
        color: color
    })

    //Show the result
    await reply(inter, { embeds: [embed], components: [] })
}

// Word list
let wordList = ['a', 'abajo', 'abandonar', 'abrir', 'absoluta', 'absoluto', 'abuelo', 'acabar', 'acaso', 'acciones',
    'acción', 'aceptar', 'acercar', 'acompañar', 'acordar', 'actitud', 'actividad', 'acto', 'actual', 'actuar',
    'acudir', 'acuerdo', 'adelante', 'además', 'adquirir', 'advertir', 'afectar', 'afirmar', 'agua', 'ahora',
    'ahí', 'aire', 'al', 'alcanzar', 'alejar', 'alemana', 'alemán', 'algo', 'alguien', 'alguna',
    'alguno', 'algún', 'allá', 'allí', 'alma', 'alta', 'alto', 'altura', 'amar', 'ambas',
    'ambos', 'americana', 'americano', 'amiga', 'amigo', 'amor', 'amplia', 'amplio', 'andar', 'animal',
    'ante', 'anterior', 'antigua', 'antiguo', 'anunciar', 'análisis', 'aparecer', 'apenas', 'aplicar', 'apoyar',
    'aprender', 'aprovechar', 'aquel', 'aquella', 'aquello', 'aquí', 'arma', 'arriba', 'arte', 'asegurar',
    'aspecto', 'asunto', 'así', 'atenciones', 'atención', 'atreverse', 'atrás', 'aumentar', 'aun', 'aunque',
    'autor', 'autora', 'autoridad', 'auténtica', 'auténtico', 'avanzar', 'ayer', 'ayuda', 'ayudar', 'azul',
    'añadir', 'año', 'aún', 'baja', 'bajar', 'barrio', 'base', 'bastante', 'bastar', 'beber',
    'bien', 'blanca', 'blanco', 'boca', 'brazo', 'buen', 'buscar', 'caballo', 'caber', 'cabeza',
    'cabo', 'cada', 'cadena', 'caer', 'calle', 'cama', 'cambiar', 'cambio', 'caminar', 'camino',
    'campaña', 'campo', 'cantar', 'cantidad', 'capaces', 'capacidad', 'capaz', 'capital', 'cara', 'caracteres',
    'carne', 'carrera', 'carta', 'carácter', 'casa', 'casar', 'casi', 'caso', 'catalán', 'causa',
    'celebrar', 'central', 'centro', 'cerebro', 'cerrar', 'chica', 'chico', 'cielo', 'ciencia', 'ciento',
    'científica', 'científico', 'cierta', 'cierto', 'cinco', 'cine', 'circunstancia', 'ciudad', 'ciudadana', 'ciudadano',
    'civil', 'clara', 'claro', 'clase', 'coche', 'coger', 'colocar', 'color', 'comentar', 'comenzar',
    'comer', 'como', 'compañera', 'compañero', 'compañía', 'completo', 'comprar', 'comprender', 'comprobar', 'comunes',
    'comunicaciones', 'comunicación', 'común', 'con', 'concepto', 'conciencia', 'concreto', 'condición', 'condisiones', 'conducir',
    'conjunto', 'conocer', 'conocimiento', 'consecuencia', 'conseguir', 'conservar', 'considerar', 'consistir', 'constante', 'constituir',
    'construir', 'contacto', 'contar', 'contemplar', 'contener', 'contestar', 'continuar', 'contra', 'contrario', 'control',
    'controlar', 'convencer', 'conversación', 'convertir', 'corazón', 'correr', 'corresponder', 'corriente', 'cortar', 'cosa',
    'costumbre', 'crear', 'crecer', 'creer', 'crisis', 'cruzar', 'cuadro', 'cual', 'cualquier', 'cuando',
    'cuanto', 'cuarta', 'cuarto', 'cuatro', 'cubrir', 'cuenta', 'cuerpo', 'cuestiones', 'cuestión', 'cultura',
    'cultural', 'cumplir', 'cuya', 'cuyo', 'cuál', 'cuánto', 'célula', 'cómo', 'dar', 'dato',
    'de', 'deber', 'decidir', 'decir', 'decisión', 'declarar', 'dedicar', 'dedo', 'defender', 'defensa',
    'definir', 'definitivo', 'dejar', 'del', 'demasiado', 'democracia', 'demostrar', 'demás', 'depender', 'derecha',
    'derecho', 'desaparecer', 'desarrollar', 'desarrollo', 'desconocer', 'descubrir', 'desde', 'desear', 'deseo', 'despertar',
    'después', 'destino', 'detener', 'determinar', 'diaria', 'diario', 'diez', 'diferencia', 'diferente', 'dificultad',
    'difícil', 'dinero', 'dios', 'diosa', 'dirección', 'directo', 'director', 'directora', 'dirigir', 'disponer',
    'distancia', 'distinto', 'diverso', 'doble', 'doctor', 'doctora', 'dolor', 'don', 'donde', 'dormir',
    'dos', 'duda', 'durante', 'duro', 'día', 'dónde', 'e', 'echar', 'económico', 'edad',
    'efecto', 'ejemplo', 'ejército', 'el', 'elección', 'elegir', 'elemento', 'elevar', 'ella', 'empezar',
    'empresa', 'en', 'encender', 'encima', 'encontrar', 'encuentro', 'energía', 'enfermedad', 'enfermo', 'enorme',
    'enseñar', 'entender', 'enterar', 'entonces', 'entrada', 'entrar', 'entre', 'entregar', 'enviar', 'equipo',
    'error', 'esa', 'escapar', 'escribir', 'escritor', 'escritora', 'escuchar', 'ese', 'esfuerzo', 'eso',
    'espacio', 'espalda', 'españa', 'español', 'española', 'especial', 'especie', 'esperanza', 'esperar', 'espíritu',
    'esta', 'establecer', 'estado', 'estar', 'este', 'esto', 'estrella', 'estructura', 'estudiar', 'estudio',
    'etapa', 'europa', 'europea', 'europeo', 'evidente', 'evitar', 'exacta', 'exacto', 'exigir', 'existencia',
    'existir', 'experiencia', 'explicar', 'expresión', 'extender', 'exterior', 'extranjera', 'extranjero', 'extraño', 'extremo',
    'falta', 'faltar', 'familia', 'familiar', 'famoso', 'fenómeno', 'fiesta', 'figura', 'fijar', 'fin',
    'final', 'flor', 'fondo', 'forma', 'formar', 'francesa', 'francia', 'francés', 'frase', 'frecuencia',
    'frente', 'fría', 'frío', 'fuego', 'fuente', 'fuerte', 'fuerza', 'funcionar', 'función', 'fundamental',
    'futuro', 'fácil', 'físico', 'fútbol', 'ganar', 'general', 'gente', 'gesto', 'gobierno', 'golpe',
    'gracia', 'gran', 'grande', 'grave', 'gritar', 'grupo', 'guardar', 'guerra', 'gustar', 'gusto',
    'haber', 'habitación', 'habitual', 'hablar', 'hacer', 'hacia', 'hallar', 'hasta', 'hecha', 'hecho',
    'hermana', 'hermano', 'hermosa', 'hermoso', 'hija', 'hijo', 'historia', 'histórico', 'hombre', 'hombro',
    'hora', 'hoy', 'humana', 'humano', 'idea', 'iglesia', 'igual', 'imagen', 'imaginar', 'impedir',
    'imponer', 'importancia', 'importante', 'importar', 'imposible', 'imágenes', 'incluir', 'incluso', 'indicar', 'individuo',
    'informaciones', 'información', 'informar', 'inglesa', 'inglés', 'iniciar', 'inmediata', 'inmediato', 'insistir', 'instante',
    'intentar', 'interesar', 'intereses', 'interior', 'internacional', 'interés', 'introducir', 'ir', 'izquierda', 'jamás',
    'jefa', 'jefe', 'joven', 'juego', 'jugador', 'jugar', 'juicio', 'junto', 'justo', 'labio',
    'lado', 'lanzar', 'largo', 'lector', 'lectora', 'leer', 'lengua', 'lenguaje', 'lento', 'levantar',
    'ley', 'libertad', 'libre', 'libro', 'limitar', 'literatura', 'llamar', 'llegar', 'llenar', 'lleno',
    'llevar', 'llorar', 'lo', 'loca', 'loco', 'lograr', 'lucha', 'luego', 'lugar', 'luz',
    'línea', 'madre', 'mal', 'mala', 'malo', 'mandar', 'manera', 'manifestar', 'mano', 'mantener',
    'mar', 'marcar', 'marcha', 'marchar', 'marido', 'mas', 'masa', 'matar', 'materia', 'material',
    'mayor', 'mayoría', 'mañana', 'media', 'mediante', 'medida', 'medio', 'mejor', 'memoria', 'menor',
    'menos', 'menudo', 'mercado', 'merecer', 'mes', 'mesa', 'meter', 'metro', 'mi', 'miedo',
    'miembro', 'mientras', 'mil', 'militar', 'millón', 'ministra', 'ministro', 'minuto', 'mirada', 'mirar',
    'mis', 'mismo', 'mitad', 'modelo', 'moderna', 'moderno', 'modo', 'momento', 'moral', 'morir',
    'mostrar', 'motivo', 'mover', 'movimiento', 'muchacha', 'muchacho', 'mucho', 'muerte', 'mujer', 'mujeres',
    'mundial', 'mundo', 'muy', 'máquina', 'más', 'máximo', 'médica', 'médico', 'método', 'mí',
    'mía', 'mínima', 'mínimo', 'mío', 'música', 'nacer', 'nacional', 'nada', 'nadie', 'natural',
    'naturaleza', 'necesaria', 'necesario', 'necesidad', 'necesitar', 'negar', 'negocio', 'negra', 'negro', 'ni',
    'ninguna', 'ninguno', 'ningún', 'nivel', 'niña', 'niño', 'no', 'noche', 'nombre', 'normal',
    'norteamericana', 'norteamericano', 'notar', 'noticia', 'novela', 'nuestra', 'nuestro', 'nueva', 'nuevo', 'nunca',
    'número', 'o', 'objetivo', 'objeto', 'obligar', 'obra', 'observar', 'obtener', 'ocasiones', 'ocasión',
    'ocho', 'ocupar', 'ocurrir', 'oficial', 'ofrecer', 'ojo', 'olvidar', 'operación', 'opinión', 'origen',
    'oro', 'orígenes', 'oscura', 'oscuro', 'otra', 'otro', 'oír', 'paciente', 'padre', 'pagar',
    'palabra', 'papel', 'par', 'para', 'parar', 'parecer', 'pared', 'pareja', 'parte', 'participar',
    'particular', 'partido', 'partir', 'pasa', 'pasado', 'pasar', 'paso', 'paz', 'país', 'países',
    'pecho', 'pedir', 'peligro', 'pelo', 'película', 'pena', 'pensamiento', 'pensar', 'peor', 'pequeña',
    'pequeño', 'perder', 'perfecto', 'periodista', 'periódica', 'periódico', 'permanecer', 'permitir', 'pero', 'perra',
    'perro', 'persona', 'personaje', 'personal', 'pertenecer', 'pesar', 'peso', 'pie', 'piedra', 'piel',
    'pierna', 'piso', 'placer', 'plan', 'plantear', 'plaza', 'pleno', 'poblaciones', 'población', 'pobre',
    'poca', 'poco', 'poder', 'policía', 'política', 'político', 'poner', 'por', 'porque', 'poseer',
    'posibilidad', 'posible', 'posiciones', 'posición', 'precio', 'precisa', 'preciso', 'preferir', 'pregunta', 'preguntar',
    'prensa', 'preocupar', 'preparar', 'presencia', 'presentar', 'presente', 'presidente', 'pretender', 'primer', 'primera',
    'primero', 'principal', 'principio', 'privar', 'probable', 'problema', 'proceso', 'producir', 'producto', 'profesional',
    'profesor', 'profesora', 'profunda', 'profundo', 'programa', 'pronta', 'pronto', 'propia', 'propio', 'proponer',
    'provocar', 'proyecto', 'prueba', 'práctico', 'próxima', 'próximo', 'publicar', 'pueblo', 'puerta', 'pues',
    'puesto', 'punto', 'pura', 'puro', 'página', 'pública', 'público', 'que', 'quedar', 'querer',
    'quien', 'quitar', 'quizá', 'quién', 'qué', 'radio', 'rato', 'razones', 'razón', 'real',
    'realidad', 'realizar', 'recibir', 'reciente', 'recoger', 'reconocer', 'recordar', 'recorrer', 'recuerdo', 'recuperar',
    'reducir', 'referir', 'regresar', 'relaciones', 'relación', 'religiosa', 'religioso', 'repetir', 'representar', 'resolver',
    'responder', 'responsable', 'respuesta', 'resto', 'resultado', 'resultar', 'reuniones', 'reunir', 'reunión', 'revista',
    'rey', 'reír', 'rica', 'rico', 'riesgo', 'rodear', 'roja', 'rojo', 'romper', 'ropa',
    'rostro', 'rápida', 'rápido', 'régimen', 'río', 'saber', 'sacar', 'sala', 'salida', 'salir',
    'sangre', 'secreta', 'secreto', 'sector', 'seguir', 'segundo', 'segura', 'seguridad', 'seguro', 'según',
    'seis', 'semana', 'semejante', 'sensaciones', 'sensación', 'sentar', 'sentida', 'sentido', 'sentimiento', 'sentir',
    'separar', 'ser', 'seria', 'serie', 'serio', 'servicio', 'servir', 'sexo', 'sexual', 'señalar',
    'señor', 'señora', 'si', 'sido', 'siempre', 'siete', 'siglo', 'significar', 'siguiente', 'silencio',
    'simple', 'sin', 'sino', 'sistema', 'sitio', 'situaciones', 'situación', 'situar', 'sobre', 'social',
    'socialista', 'sociedad', 'sol', 'sola', 'solo', 'soluciones', 'solución', 'sombra', 'someter', 'sonar',
    'sonreír', 'sonrisa', 'sorprender', 'sostener', 'su', 'subir', 'suceder', 'suelo', 'suerte', 'sueño',
    'suficiente', 'sufrir', 'superar', 'superior', 'suponer', 'surgir', 'suya', 'suyo', 'sí', 'sólo',
    'tal', 'también', 'tampoco', 'tan', 'tanta', 'tanto', 'tarde', 'tarea', 'televisiones', 'televisión',
    'tema', 'temer', 'tender', 'tener', 'teoría', 'tercer', 'terminar', 'texto', 'tiempo', 'tierra',
    'tipa', 'tipo', 'tirar', 'tocar', 'toda', 'todavía', 'todo', 'tomar', 'tono', 'total',
    'trabajar', 'trabajo', 'traer', 'tras', 'tratar', 'tres', 'tu', 'técnica', 'técnico', 'término',
    'tía', 'tío', 'título', 'un', 'una', 'unidad', 'unir', 'uno', 'usar', 'uso',
    'usted', 'utilizar', 'vacía', 'vacío', 'valer', 'valor', 'varias', 'varios', 'veces', 'vecina',
    'vecino', 'veinte', 'velocidad', 'vender', 'venir', 'ventana', 'ver', 'verano', 'verdad', 'verdadera',
    'verdadero', 'verde', 'vestir', 'vez', 'viaje', 'vida', 'vieja', 'viejo', 'viento', 'violencia',
    'vista', 'viva', 'vivir', 'vivo', 'voces', 'voluntad', 'volver', 'voz', 'vuelta', 'y',
    'ya', 'yo', 'zona', 'árbol', 'él', 'época', 'ésta', 'éste', 'éxito', 'última',
    'último', 'única', 'único']