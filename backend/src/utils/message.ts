import { messages, messagesModel } from "../models/messages.model";

function formatMessage(msg: messages) {
  return messagesModel.create(msg);
}

module.exports = { formatMessage };
