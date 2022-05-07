export const testServer = (req, res) => {
  res.status(200).json({ message: 'API seems fine.' });
};
