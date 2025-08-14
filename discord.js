const Discord = require("discord.js");
const {Client, Collection} = require("discord.js");
const client = new Client({ intents : 3276799});
const {loadSlash} = require("./handlers/slashHandler");
require("dotenv").config();

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return;
    const args = [];
    for (let option of interaction.options.data) {
        if (option.type === 1) {
            if (option.name) args.push(option.name);
            if (option.options) {
                option.options.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            }
        } else if (option.value) {
            args.push(option.value);
        }
    }
    cmd.execute(client, interaction, args);
});

client.slashCommands = new Discord.Collection();
(async () => {
    try {
        await client.login(process.env.TOKEN);
    } catch (err) {
        console.log("Error al iniciar el bot: ", err);
    }
})();


client.on("messageCreate", (message) => {
    if (message.author.bot) return; // Ignora mensajes de bots
    if (message.content === "ping") {
        message.channel.send("pong");
    } else if (message.content === "hola") {
        message.channel.send("Hola, ¿cómo estás?");
    } else if (["ping", "hola"].every(cmd => message.content !== cmd)) {
        message.channel.send("Comando no reconocido.");
    }
});

client.on("ready", async() => {
    await loadSlash(client)
    .then(() => {
        console.log("Comandos cargados correctamente");   
    })
    .catch((err) => {
        console.log("Error al cargar los comandos: ", err);
    });  
    console.log("Bot encendido con la cuenta de: ", client.user.tag);
});
