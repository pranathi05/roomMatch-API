import User from '../models/user.mjs';

const isValidNumberInput = (number) =>
  number !== undefined && number !== null && !Number.isNaN(number);
export const getUserInfo = (req, res) => {
  const userId = req?.user?.userId;
  User.findOne({ _id: userId })
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch(() => res.status(404).json({ message: 'User does not exist.' }));
};
export const updateUserInfo = (req, res) => {
  const { name, preferences } = req?.body;
  const {
    age,
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
  if (
    name &&
    isValidNumberInput(age) &&
    residence &&
    isValidNumberInput(rent?.from) &&
    isValidNumberInput(rent?.to) &&
    rent?.from <= rent?.to &&
    isValidNumberInput(joining) &&
    idealLocation
  ) {
    User.findOneAndUpdate(
      { _id: req?.user?.userId },
      {
        name,
        preferences: {
          age,
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
      }
    )
      .then(() =>
        res.status(200).json({ message: 'User info updated successfully.' })
      )
      .catch(() => res.status(500).json({ message: 'Some error occurred.' }));
  } else {
    return res.status(400).json({ message: 'Invalid inputs.' });
  }
};
export const getUsers = async (req, res) => {
  const userId = req?.user?.userId;
  const scoreStart = req?.query?.from;
  const scoreEnd = req?.query?.to;
  const currentUser = await User.findOne({ _id: userId });
  User.find({ _id: { $ne: userId } })
    .then((users) => {
      const usersWithScore = users?.map(({ name, email, preferences }) => {
        const {
          age,
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
        let score = 0;
        if (Math.abs(currentUser?.preferences?.age - age) <= 5) {
          score++;
        }
        if (
          currentUser?.preferences?.residence
            ?.toLowerCase()
            ?.includes(residence?.toLowerCase()) ||
          residence
            ?.toLowerCase()
            ?.includes(currentUser?.preferences?.residence?.toLowerCase())
        ) {
          score++;
        }
        if (currentUser?.preferences?.rent?.to <= rent?.to) {
          score++;
        }
        if (currentUser?.preferences?.guestsAllowed === guestsAllowed) {
          score++;
        }
        if (currentUser?.preferences?.smokingAllowed === smokingAllowed) {
          score++;
        }
        if (currentUser?.preferences?.isStudent === isStudent) {
          score++;
        }
        if (currentUser?.preferences?.mealStatus === mealStatus) {
          score++;
        }
        if (Math.abs(currentUser?.preferences?.joining - joining) <= 2) {
          score++;
        }
        if (currentUser?.preferences?.mealStatus === mealStatus) {
          score++;
        }
        if (currentUser?.preferences?.sleepTime === sleepTime) {
          score++;
        }
        if (
          currentUser?.preferences?.idealLocation
            ?.toLowerCase()
            ?.includes(idealLocation?.toLowerCase()) ||
          idealLocation
            ?.toLowerCase()
            ?.includes(currentUser?.preferences?.idealLocation?.toLowerCase())
        ) {
          score++;
        }
        return { score, preferences, name, email };
      });

      res
        .status(200)
        .json(
          scoreStart && scoreEnd
            ? usersWithScore?.filter(
                ({ score }) =>
                  score <= parseInt(scoreStart) && score >= parseInt(scoreEnd)
              )
            : usersWithScore
        );
    })
    .catch(() => res.status(500).json({ message: 'Some error occured.' }));
};
