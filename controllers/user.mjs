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
    gender , 
    hometown ,
    currentcity ,
    needroommate ,
    otherbranch ,
    workex ,
    distuni ,
    apttype ,
    rentbudget ,
    alcohol ,
    foodpref ,
    smoking ,
    culskills ,
    lookingforroommate ,
    dept ,
    hall ,
    maxppr
  } = preferences;
  if (
    name &&
    isValidNumberInput(workex) && gender &&
    isValidNumberInput(distuni)
  ) {
    User.findOneAndUpdate(
      { _id: req?.user?.userId },
      {
        name,
        preferences: {
          gender , 
          hometown ,
          currentcity ,
          needroommate ,
          otherbranch ,
          workex ,
          distuni ,
          apttype ,
          rentbudget ,
          alcohol ,
          foodpref ,
          smoking ,
          culskills ,
          lookingforroommate ,
          dept ,
          hall ,
          maxppr
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
          gender,
          hometown,
          currentcity,
          needroommate,
          otherbranch,
          workex,
          distuni,
          apttype,
          rentbudget,
          alcohol,
          foodpref,
          smoking,
          culskills,
          lookingforroommate,
          dept,
          hall,
          maxppr
        } = preferences;
        let score = Math.floor(Math.random()*10);
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

export const getUserById =  (req, res) => {
  User.findOne({ email: req.params.email })
    .then((user) => {
      return res.status(200).json(user);
    })
    .catch(() => res.status(404).json({ message: 'User does not exist.' }));
};