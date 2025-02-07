var chatgpt = require("./chatgpt.js");

module.exports.AIMessage = async function AIMessage(message){
  return await chatgpt.chatWithGPT(message);
}
