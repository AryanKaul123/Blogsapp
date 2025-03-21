import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate input fields
  if (!username || !email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json('Signup successful');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    // Check if the user exists
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));

    // Validate password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, 'Invalid password'));

    // Generate JWT token
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }  // Token expires in 1 day
    );

    const { password: pass, ...rest } = validUser._doc;

    // Set token as an HTTP-only cookie
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Only secure in production
        sameSite: 'strict',  // Prevent CSRF attacks
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new one
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = new User({
        username: `${name.toLowerCase().replace(/ /g, '')}${Math.random().toString(9).slice(-4)}`,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password, ...rest } = user._doc;

    // Set token as an HTTP-only cookie
    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
