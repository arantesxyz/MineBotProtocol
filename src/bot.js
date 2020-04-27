const protocol = require("minecraft-protocol");
const parseChat = require("./chatHelper");

module.exports = class Bot {
    constructor({ name, host = "localhost", port = 25565, password }) {
        if (!name || !name.length) {
            throw new Error("Bot name is required!");
        }

        this.name = name;
        this.host = host;
        this.port = port;
        this.password = password;
        this.autoReconnect = true;

        this.isConnected = false;
    }

    connect() {
        console.info("Trying to connect now!");
        if (this.isConnected) {
            console.info("Already connected!");
            clearInterval(this.intervalId);
            return;
        }

        this._client = protocol.createClient({
            host: this.host,
            port: this.port,
            username: this.name,
            password: this.password,
        });

        this._registerEvents();
    }

    reconnect() {
        this.intervalId = setInterval(() => this.connect(), 1000);
    }

    respawn() {
        this._client.write("client_command", { payload: 0 });
    }

    chat(message = "") {
        this._client.write("chat", { message });
    }

    quit() {
        this.autoReconnect = false;
        this._client.end("Quit");
    }

    _registerEvents() {
        this._client.on("login", () => {
            this.isConnected = true;

            console.info("Bot logado.");
            this.respawn();
        });

        this._client.on("disconnect", (packet) => {
            this.isConnected = false;

            console.info("Disconnected: " + packet.reason);
        });

        this._client.on("end", () => {
            this.isConnected = false;

            console.info("Disconnected!");
            if (this.autoReconnect) {
                console.info("Trying to reconnect...");
                this.reconnect();
            }
        });

        this._client.once("update_health", (packet) => {
            if (packet.health > 0) {
                console.info("Estou vivo.");
                this.chat("Pronto!");
            }
        });

        this._client.on("update_health", (packet) => {
            if (packet.health <= 0) {
                this.respawn();
            }
        });

        this._client.on("error", function (err) {
            console.info("Error occured");
            console.info(err);
            process.exit(1);
        });

        this._client.on("chat", function (packet) {
            const json = JSON.parse(packet.message);
            const chat = parseChat(json, {});
            console.info(chat);
        });
    }
};
