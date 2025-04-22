import User            from '../models/User.js'
import Restaurant      from '../models/Restaurant.js'
import DeliveryPerson  from '../models/DeliveryPerson.js'
import Customer        from '../models/Customer.js'
import Admin           from '../models/Admin.js'
import ApiError        from '../utils/ApiError.js'
import { generateToken } from '../services/authService.js'
import { dispatchNotification } from '../services/notificationService.js'
import logger          from '../utils/logger.js'

const { info, error } = logger

/**
 * POST /api/users/register
 */
export async function register(req, res, next) {
  try {
    const { name, email, password, role, ...rest } = req.body

    // 1) Prevent duplicate emails
    if (await User.exists({ email })) {
      throw new ApiError(400, 'Email already registered')
    }

    // 2) Create core user
    const user = await User.create({
      name, email, password, role,
      status: role === 'customer' ? 'Active' : 'Pending'
    })

    // 3) Create role‑specific profile
    let profile
    switch (role) {
      case 'restaurant':
        profile = await Restaurant.create({
          userId: user._id,
          restaurantName: rest.restaurantName,
          restaurantOwner: rest.restaurantOwner,
          address: rest.address,
          phone: rest.phone,
          email,
          category: rest.category,
          items: rest.items
        })
        break

      case 'delivery':
        profile = await DeliveryPerson.create({
          userId: user._id,
          name,
          address: rest.address,
          location: rest.location,
          email,
          phone: rest.phone,
          vehicleNumber: rest.vehicleNumber,
          license: rest.license,
          gender: rest.gender
        })
        break

      case 'customer':
        profile = await Customer.create({
          userId: user._id,
          name,
          address: rest.address,
          phone: rest.phone,
          email
        })
        break

      case 'admin':
        profile = await Admin.create({
          userId: user._id,
          name,
          email,
          phone: rest.phone
        })
        break
    }

    info(`✅ New ${role} registered: ${user._id}`)

    // 4) Generate JWT
    const token = generateToken(user)
    const authHeader = `Bearer ${token}`

    // 5) Send welcome / pending notifications
    const title   = role === 'customer'
      ? 'Welcome to FoodApp!'
      : 'Registration Received'
    const message = role === 'customer'
      ? `Hi ${name}, your customer account is active. Enjoy ordering!`
      : `Hi ${name}, your ${role} profile is pending approval.`

    // fire‑and‑forget
    await Promise.all([
      dispatchNotification({
        userId: user._id,
        type: 'in‑app',
        payload: { title, message },
        authHeader
      }),
      dispatchNotification({
        userId: user._id,
        type: 'email',
        payload: { title, message },
        email,
        authHeader
      }),
      dispatchNotification({
        userId: user._id,
        type: 'sms',
        payload: { title, message },
        phone: rest.phone,
        authHeader
      })
    ])

    // 6) Respond
    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, role },
        profile
      }
    })
  } catch (err) {
    error('register error:', err)
    return next(err)
  }
}

/**
 * POST /api/users/login
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, 'Invalid credentials')
    }
    if (user.status !== 'Active') {
      throw new ApiError(403, `Your account is ${user.status}`)
    }

    const token = generateToken(user)
    return res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, role: user.role }
      }
    })
  } catch (err) {
    error('login error:', err)
    return next(err)
  }
}

/**
 * GET /api/users/me
 */
export function getMe(req, res) {
  return res.json({
    success: true,
    data: req.user
  })
}
