// backend/user-service/src/validators/authValidator.js
import { body, oneOf } from 'express-validator'

export const registerValidator = [
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin','restaurant','delivery','customer']),

  // Restaurant fields
  body('role')
    .equals('restaurant')
    .if(body('role').equals('restaurant'))
    .withMessage('Restaurant profile required')
    .bail(),
  body('restaurantName').if(body('role').equals('restaurant')).notEmpty(),
  body('restaurantOwner').if(body('role').equals('restaurant')).notEmpty(),
  body('address').if(body('role').equals('restaurant')).notEmpty(),
  body('phone').if(body('role').equals('restaurant')).notEmpty(),
  body('category').if(body('role').equals('restaurant')).notEmpty(),
  body('items').if(body('role').equals('restaurant')).isArray(),

  // Delivery fields
  body('vehicleNumber').if(body('role').equals('delivery')).notEmpty(),
  body('license').if(body('role').equals('delivery')).notEmpty(),
  body('phone').if(body('role').equals('delivery')).notEmpty(),

  // Customer fields
  body('address').if(body('role').equals('customer')).notEmpty(),
  body('phone').if(body('role').equals('customer')).notEmpty()
]
