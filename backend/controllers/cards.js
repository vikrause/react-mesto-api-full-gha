const Card = require('../models/card');
const NotFound = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send(card))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  return Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Некорректные данные');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail(() => {
      throw new NotFound('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(cardId)
          .then(() => res.send(card));
      }
      throw new ForbiddenError('Нет доступа');
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFound('Карточка не найдена');
  })
    .then((card) => res.send(card))

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      }
      if (err.message === 'NotFound') {
        next(new NotFound('Карточка не найдена'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => new Error('NotFound'))
    .then((card) => res.send(card))

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные'));
      }
      if (err.message === 'NotFound') {
        next(new NotFound('Карточка не найдена'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
