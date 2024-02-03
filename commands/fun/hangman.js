//hangman repository : https://github.com/Zheoni/Hanger-Bot

const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');


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

        let game, players, selector;
        const gameInfo = await startGame(inter);
        if (gameInfo) {
            game = gameInfo.game;
            players = gameInfo.players;
            selector = gameInfo.selector;
            await runGame(inter, game, players);
            await showResult(inter, game, selector);
        }
    }
}

String.prototype.replaceAt = function (index, replacement) {
    return this.slice(0, index) + replacement + this.slice(index + replacement.length);
}


//class hangman
class hangman {
    constructor(word) {
        this.word = word;
        this.lives = 6;
        this.progress = hangman.hyphenString(word.length);
        this.remaining = word.length;
        this.misses = [];
        this.status = "in progress";
    }

    static hyphenString(n) {
        let str = "";
        for (let i = 0; i < n; ++i) {
            str += "-";
        }
        return str;
    }

    guess(c) {
        if (this.progress.includes(c)) {
            --this.lives;
        } else if (this.word.includes(c)) {
            for (let i = 0; i < this.word.length; ++i) {
                if (this.word[i] === c) {
                    this.progress = this.progress.replaceAt(i, this.word[i]);
                    --this.remaining;
                }
            }
        } else {
            if (!this.misses.includes(c)) {
                this.misses.push(c);
            }
            --this.lives;
        }

        if (this.lives == 0) {
            this.status = "lost";
        } else if (this.remaining == 0) {
            this.status = "won";
        }
        return {
            status: this.status,
            progress: this.progress,
            misses: this.misses,
            lifes: this.lives
        };
    }

    guessAll(word) {
        if (this.word === word) {
            this.progress = this.word;
            this.status = "won";
        } else {
            --this.lives;
        }
        return this.status === "won";
    }
}

const figure = [`
 +---+
 |   |      wordHere
     |
     |      numerOfLives
     |      missC
     |
==========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
     |      numerOfLives
     |      missC
     |
==========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
 |   |      numerOfLives
     |      missC
     |
==========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|   |      numerOfLives
     |      missC
     |
==========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
     |      missC
     |
==========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
/    |      missC
     |
==========  gameStatus
`, `
 +---+
 |   |      wordHere
 O   |
/|\\  |      numerOfLives
/ \\  |      missC
     |
==========  gameStatus
`];


//START GAME
async function startGame(inter) {

    const players = await gatherPlayers(inter);
    const gameType = await inter.options.getString('type');

    if (players.length == 0) {
        await inter.editReply({ content: "Nadie se ha unido al juego...", embeds: [], components: [] });
        return;
    }

    if (gameType === "custom" && players.length < 2) {
        await inter.editReply({ content: "Para una partida custom, se necesitan al menos 2 jugadores.", embeds: [], components: [] });
        return;
    }

    let word;
    let selector;
    switch (gameType) {
        case "random":
            word = wordList[Math.floor(Math.random() * wordList.length)]
            break;

        case "custom":
            await inter.editReply({ content: players.length + " jugadores se han unido. Seleccionando a un jugador para que elija la palabra. Mirad los DMs!!", embeds: [], components: [] });

            let userSelection = await getWordFromPlayers(players, inter);

            if (!userSelection) return;
            else {
                word = userSelection.word;
                selector = userSelection.selector;
            }

            break;
    }
    const game = new hangman(word);

    return {
        game,
        players,
        selector
    };
}
async function gatherPlayers(inter) {

    const embed = new EmbedBuilder()
        .setTitle('Hangman')
        .setColor(0x36393e)
        .setDescription('Interaccionad con el bot para jugar al ahorcado!');

    const participar = new ButtonBuilder()
        .setLabel('Participar')
        .setCustomId(JSON.stringify({ type: 'participar' }))
        .setStyle('Primary');

    const no_participar = new ButtonBuilder()
        .setLabel('No Participar')
        .setCustomId(JSON.stringify({ type: 'no_participar' }))
        .setStyle('Danger');

    const row = new ActionRowBuilder().addComponents(participar, no_participar);

    let msg = await inter.reply({ embeds: [embed], components: [row] });
    const filter = (i) => JSON.parse(i.customId).type === 'participar' || JSON.parse(i.customId).type === 'no_participar';
    const collector = msg.createMessageComponentCollector({ filter, time: 10000 });


    return new Promise((resolve, reject) => {
        let players = [];
        collector.on('collect', async i => {
            if (JSON.parse(i.customId).type === 'participar') {
                if (!players.find(p => p.id === i.user.id))
                    players.push(i.user);

                await i.reply({ content: 'Te has unido al juego!', ephemeral: true })
                    .then(setTimeout(() => i.deleteReply(), 3000));


            }
            else if (JSON.parse(i.customId).type === 'no_participar') {
                players = players.filter(p => p.id != i.user.id);
                await i.reply({ content: 'Has abandonado el juego!', ephemeral: true })
                    .then(setTimeout(() => i.deleteReply(), 3000));
            }

        });

        collector.on('end', async collected => {
            await inter.editReply({ embeds: [embed], components: [] });
            resolve(players);
        });
    });
}
async function getWordFromPlayers(players, inter) {
    let word;
    let chosenOne;
    while (!word && players.length > 1) {

        let index = Math.floor((Math.random() * 1000) % players.length);
        chosenOne = players[index];
        players = players.splice(index, 1);

        const dm = await chosenOne.createDM();
        await dm.send("Eres el elegido!! Escribe tu palabra. Tienes 30 segundos. Recuerda, no participas en la partida.");

        let finish = false;
        let tries = 0;
        let msgCollection;

        while (!finish && tries < 3) {
            try {
                msgCollection = await getNextMessage(dm, 30000);

            } catch (collected) {
                await dm.send("Se ha acabado el tiempo, estás descalificado.");
                await inter.editReply({ content: "El elegido no ha respondido a tiempo, eligiendo a otro jugador." });
                finish = true;
                continue;
            }

            const msg = msgCollection.first().content;
            if (msg.match(`^[A-Za-zÀ-ú]{3,}$`)) {
                word = msg.toLowerCase();
                finish = true;
                dm.send("Buena palabra!, volviendo al server.");
            } else {
                await dm.send("Palabra invalida. Sin espacios y con al menos 3 caracteres.");
                ++tries;
                if (tries == 3) {
                    await dm.send("Muchas palabras invalidas. Estás descalificado.");
                }
            }
        }
    }

    if (!word && players.length <= 1) {
        inter.editReply({ content: "Nos hemos quedado sin jugadores... try again." });
        return;
    }

    return {
        word: word,
        selector: chosenOne
    }
}
async function getNextMessage(channel, maxTime) {
    const filter = msg => !msg.author.bot;
    return await channel.awaitMessages({
        filter,
        max: 1,
        time: maxTime,
        errors: ['time']
    })
        .catch((collected) => {
            throw collected
        });
}


//RUN GAME
async function runGame(inter, game, players) {


    let buttons = [];
    let letters = ['a', 'á', 'b', 'c', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'ó', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'v', 'w', 'x', 'y', 'z'];
    letters.forEach(letter => {
        let button = new ButtonBuilder()
            .setLabel(letter)
            .setCustomId(JSON.stringify({ letter: letter }))
            .setStyle('Primary');
        buttons.push(button);
    });

    let nextButton = new ButtonBuilder()
        .setLabel('>>')
        .setCustomId(JSON.stringify({ letter: 'next' }))
        .setStyle('Secondary');


    buttonsObject = {
        buttons: buttons,
        nextButton: nextButton,
        nextPage: false
    }

    await showProgress(inter, buttonsObject, game, false);

    //button collector
    let msg = await inter.fetchReply();
    const filter = ((m) => players.find((p) => (p.id === inter.user.id)));
    const buttonCollector = msg.createMessageComponentCollector({ filter: filter });



    //message collector
    const filterM = (m) => !m.author.bot && players.find(p => p.id === m.author.id);
    const collector = inter.channel.createMessageCollector({ filter: filterM, time: (15 * 1000 * 60) }); // max of 15 minutes per game


    return new Promise((resolve, reject) => {


        //button collectorhangm
        buttonCollector.on('collect', async i => {
            let letter = await JSON.parse(i.customId).letter;

            if (letter == 'next') buttonsObject.nextPage = !buttonsObject.nextPage;
            else {
                buttonsObject.buttons = buttonsObject.buttons.filter(b => JSON.parse(b.data.custom_id).letter !== letter);
                game.guess(letter);
            }

            await i.reply({ content: `Has seleccionado la letra '${letter}'`, ephemeral: true })
                .then(setTimeout(() => i.deleteReply(), 1000));

            await showProgress(inter, buttonsObject, game, false);

            if (game.status !== "in progress") {
                collector.stop();
                buttonCollector.stop();
            } else if (players.length < 1) {
                collector.stop();
                buttonCollector.stop();
                game.status = "lost";
            }
        });


        //message collector
        collector.on('collect', async (m) => {
            const c = m.content.toLowerCase();

            m.delete();
            if (m.content.match(`^[A-Za-zÀ-ú]{2,}$`)) {
                if (game.guessAll(c) == false) {
                    players = players.splice(players.find(p => m.author.id == p.id), 1);
                }
            } else return;

            await showProgress(inter, buttonsObject, game, false);

            if (game.status !== "in progress") {
                collector.stop();
                buttonCollector.stop();
            } else if (players.length < 1) {
                collector.stop();
                buttonCollector.stop();
                game.status = "lost";
            }
        });


        collector.on('end', async (collected) => {
            await showProgress(inter, {}, game, true);
            resolve();
        });
    });
}
async function showProgress(inter, buttonsObject, game, gameOver) {
    const figureStep = figure[6 - game.lives];
    let progress = game.progress;
    let lives = "";
    for (let i = 0; i < 6; ++i) {
        if (i < game.lives) {
            lives += "❤️";
        } else {
            lives += "🖤";
        }
    }
    let misses = "Fallos: ";
    for (let i = 0; i < game.misses.length; ++i) {
        misses += (game.misses[i] + " ");
    }

    let screen = figureStep.replace("wordHere", progress)
        .replace("numerOfLives", lives)
        .replace("missC", misses);

    const embed = new EmbedBuilder();
    if (gameOver) {
        if (game.status === "won") {
            embed.setColor(0x00CC00);
            screen = screen.replace("gameStatus", "Has ganado!");
        } else {
            embed.setColor(0xE50000);
            screen = screen.replace("gameStatus", "Game over");
        }
    } else {
        screen = screen.replace("gameStatus", " ");
        embed.setColor(0xFFD700);
    }
    embed.setDescription("```\n" + screen + "```");


    if (!buttonsObject.buttons || buttonsObject.buttons.length === 0) {
        await inter.editReply({ embeds: [embed], components: [] });
        return;
    }

    let length = buttonsObject.buttons.length;
    let rowLength = 5;
    let pageLength = 25;


    let components = [];

    if (length > 25) { // mas de una pagina de botones

        if (!buttonsObject.nextPage) { // pagina 1, se añaden 24 botones y el boton de siguiente pagina
            for (let i = 0; i < pageLength - rowLength; i += rowLength) { // 4 rows enteras
                let row = new ActionRowBuilder()
                    .addComponents(buttonsObject.buttons.slice(i, i + rowLength));
                components.push(row);
            }

            let row = new ActionRowBuilder() //4 botones + next button
                .addComponents(buttonsObject.buttons.slice(pageLength - rowLength, pageLength - rowLength + 4)).addComponents(buttonsObject.nextButton);
            components.push(row);

        }
        else { // pagina 2, se añaden los botones restantes y el boton de pagina anterior
            let numRows = Math.ceil(((length - 24) / 5)); //rows necesarias para mostrar los botones restantes
            for (let i = 0; i < numRows; i++) {
                let ini = 24 + i * 5; //indice inicial de los botones de la fila
                let row = new ActionRowBuilder();
                if (i === numRows - 1) //ultima fila, se añaden los botones restantes y el boton de pagina anterior
                    row.addComponents(buttonsObject.buttons.slice(ini, ini + (length - ini))).addComponents(buttonsObject.nextButton);
                else //se añaden 5 botones
                    row.addComponents(buttonsObject.buttons.slice(ini, ini + 5));

                components.push(row);
            }
        }

    }
    else { // una sola pagina de botones, se añaden todos
        let numRows = Math.ceil((length / 5)); //rows necesarias para mostrar los botones restantes
        for (let i = 0; i < numRows; i++) {
            let ini = i * 5; //indice inicial de los botones de la fila
            let row = new ActionRowBuilder();
            if (i === numRows - 1) //ultima fila, se añaden los botones restantes y el boton de pagina anterior
                row.addComponents(buttonsObject.buttons.slice(ini, ini + (length - ini)));
            else //se añaden 5 botones
                row.addComponents(buttonsObject.buttons.slice(ini, ini + 5));

            components.push(row);
        }
    }
    await inter.editReply({ embeds: [embed], components: components });

}


//SHOW RESULT
async function showResult(inter, game, selector) {
    if (game.status === "won") {
        if (selector) {
            await inter.editReply({ content: `Has ganado !! ${selector.username}... intenta elegir una palabra mas dificil la próxima vez.`, embeds: [], components: [] });
        } else {
            await inter.editReply({ content: "Esta vez has ganado, pero no te confies, la proxima vez puede ser diferente.", embeds: [], components: [] });
        }
    } else if (game.status === "lost") {
        if (selector) {
            await inter.editReply({ content: `${selector.username} ha ganado!!. La palabra era ${game.word}.`, embeds: [], components: [] });
        } else {
            await inter.editReply({ content: `He ganado !!. La palabra era ${game.word}.`, embeds: [], components: [] });
        }
    } else {
        await inter.editReply({ content: "El juego ha acabado, se ha alcanzado el limite de 15 minutos.", embeds: [], components: [] });
    }
}

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