import otpGenerator from 'otp-generator';
import OTP from '../models/OTP.mjs';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user.mjs';
import { validate } from 'email-validator';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
const __dirname = dirname(fileURLToPath(import.meta.url));
const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};
export const sendOTP = async (req, res) => {
  const email = req?.body?.email;
  const alreadSentOTP = await OTP.findOne({ email });
  if (alreadSentOTP) {
    await OTP.deleteOne({ email });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(406)
      .json({ message: 'User with this email already exists.' });
  }
  if (email) {
    const otp = otpGenerator
      .generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
      })
      .toUpperCase();
    readHTMLFile(__dirname + '/mail.html', (err, html) => {
      const template = handlebars.compile(html);
      const replacements = {
        oneTimePassword: otp,
      };
      const htmlToSend = template(replacements);

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      transporter
        .sendMail({
          from: '"Find Roommate" <pranathifinalproject@gmail.com>',
          to: email,
          subject: 'OTP verification',
          html: htmlToSend,
        })
        .then(() => console.log('Email sent.'))
        .catch(() => console.log('Email not sent.'));
    });
    const newOTP = new OTP({
      email,
      otp,
    });
    newOTP
      .save()
      .then(() => {
        return res.status(200).json({ message: 'OTP sent successfully.' });
      })
      .catch(() => {
        return res.status(500).json({ message: 'OTP cannot be sent.Some error occurred' });
      });
  } else {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
};
export const verifyOTP = async (req, res) => {
  const otp = req?.body?.otp;
  if (otp?.length === 4) {
    const otpFromDb = await OTP.findOne({ otp });
    if (otpFromDb) {
      await OTP.deleteOne({ otp });
      return res.status(200).json({ message: 'OTP verified successfully.' });
    } else {
      return res.status(404).json({ message: 'Unable to verify OTP.' });
    }
  } else {
    return res.status(400).json({ message: 'Please enter valid OTP.' });
  }
};

export const registerUser = async (req, res) => {
  const { email, name, password, preferences } = req?.body;
  const {
    age,
    gender,
    residence,
    rent,
    guestsAllowed,
    smokingAllowed,
    joining,
    idealLocation,
    isStudent,
    sleepTime,
    mealStatus,
  } = preferences;
  const saltRounds = 10;

  if (!validate(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  if(joining === 0){
    return res.status(400).json({message: ' Joining days should be more than 0'})
  }
  if (!name?.trim()) {
    return res.status(400).json({ message: 'Name should not be empty.' });
  }
  if (password?.trim()?.length < 6) {
    return res
      .status(400)
      .json({ message: 'Password should be at least 6 characters long.' });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: 'User with given email already exists.' });
  }
  if (email && name && password && preferences) {
    try {
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: 'User cannot be logged in.' });
        }
        const newUser = new User({
          email,
          name,
          password: hashedPassword,
          preferences: {
            age,
            gender,
            residence,
            rent,
            guestsAllowed,
            smokingAllowed,
            joining,
            idealLocation,
            isStudent,
            sleepTime,
            mealStatus,
          },
        });
        newUser
          .save()
          .then((user) => {
            OTP.deleteOne({ email })
              .then(() => {
                console.log('OTP deleted');
              })
              .catch((error) => {
                console.log(error);
              });
            return res.status(201).json({ user });
          })
          .catch(() => {
            return res.status(400).json({ message: 'Signup failed.' });
          });
      });
    } catch {
      return res.status(500).json({ message: 'User cannot be logged in.' });
    }
  }
};

export const userLogin = async (req, res) => {
  console.log('inside user login')
  const { email, password } = req?.body;
  console.log(email, password)
  if (email && password) {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: `User does not exist`,
          });
        } else {
          bcrypt.compare(password, user?.password, (err, result) => {
            if (err) {
              console.log(err);
              return res.status(404).json({
                message: 'Wrong password attempt',
              });
            }
            if (result) {
              const token = jsonwebtoken.sign(
                {
                  email: user?.email,
                  userId: user?._id,
                  name: user?.name,
                },
                process.env.JWT_SECRET
              );
              return res.status(200).json({
                message: 'Auth successful',
                user: {
                  email: user?.email,
                  userId: user?._id,
                  name: user?.name,
                },
                token,
              });
            }
            res.status(404).json({
              message: 'Auth failed',
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json();
      });
  } else {
    return res.status(400).json({
      message: 'Credentials should not be empty.',
    });
  }
};
export const isAuthorized = (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')?.[1];
    if (token !== 'null') {
      const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      if (decoded) {
        return res.status(200).json(true);
      } else {
        return res.status(200).json(false);
      }
    } else {
      return res.status(200).json(false);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json();
  }
};
