import { CardModel } from "../models/card.model";

async function getAllCards() {
  const cardsCount = await CardModel.countDocuments();
  return await CardModel.aggregate([{ $sample: { size: cardsCount } }]);
}

module.exports = {
  getAllCards,
};
