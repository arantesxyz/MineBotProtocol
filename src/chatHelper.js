const color = require("ansi-color").set;
const util = require("util");

const colors = {
    black: "black+white_bg",
    dark_blue: "blue",
    dark_green: "green",
    dark_aqua: "cyan",
    dark_red: "red",
    dark_purple: "magenta",
    gold: "yellow",
    gray: "black+white_bg",
    dark_gray: "black+white_bg",
    blue: "blue",
    green: "green",
    aqua: "cyan",
    red: "red",
    light_purple: "magenta",
    yellow: "yellow",
    white: "white",
    obfuscated: "blink",
    bold: "bold",
    strikethrough: "",
    underlined: "underlined",
    italic: "",
    reset: "white+black_bg",
};

const dictionary = {
    "chat.stream.emote": "(%s) * %s %s",
    "chat.stream.text": "(%s) <%s> %s",
    "chat.type.achievement": "%s has just earned the achievement %s",
    "chat.type.admin": "[%s: %s]",
    "chat.type.announcement": "[%s] %s",
    "chat.type.emote": "* %s %s",
    "chat.type.text": "<%s> %s",
};

module.exports = function parseChat(chatObj, parentState) {
    function getColorize(parentState) {
        let myColor = "";
        if ("color" in parentState) myColor += colors[parentState.color] + "+";
        if (parentState.bold) myColor += "bold+";
        if (parentState.underlined) myColor += "underline+";
        if (parentState.obfuscated) myColor += "obfuscated+";
        if (myColor.length > 0) myColor = myColor.slice(0, -1);
        return myColor;
    }

    if (typeof chatObj === "string") {
        return color(chatObj, getColorize(parentState));
    } else {
        let chat = "";
        if ("color" in chatObj) parentState.color = chatObj.color;
        if ("bold" in chatObj) parentState.bold = chatObj.bold;
        if ("italic" in chatObj) parentState.italic = chatObj.italic;
        if ("underlined" in chatObj)
            parentState.underlined = chatObj.underlined;
        if ("strikethrough" in chatObj)
            parentState.strikethrough = chatObj.strikethrough;
        if ("obfuscated" in chatObj)
            parentState.obfuscated = chatObj.obfuscated;

        if ("text" in chatObj) {
            chat += color(chatObj.text, getColorize(parentState));
        } else if (
            "translate" in chatObj &&
            dictionary[chatObj.translate] !== undefined
        ) {
            const args = [dictionary[chatObj.translate]];
            chatObj.with.forEach(function (s) {
                args.push(parseChat(s, parentState));
            });

            chat += color(
                util.format.apply(this, args),
                getColorize(parentState)
            );
        }
        if (chatObj.extra) {
            chatObj.extra.forEach(function (item) {
                chat += parseChat(item, parentState);
            });
        }
        return chat;
    }
};
