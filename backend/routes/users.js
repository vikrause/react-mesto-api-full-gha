const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../utils/urlRegex');

const {
  getMe,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

router.get('/me', getMe);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(urlRegex),
  }),
}), updateAvatar);

module.exports = router;
