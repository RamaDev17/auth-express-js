import Joi from "joi";

const UpdateUsers = Joi.object({
  name: Joi.string().max(50).optional(),
  email: Joi.string().max(50).optional(),
});

export {
    UpdateUsers
}