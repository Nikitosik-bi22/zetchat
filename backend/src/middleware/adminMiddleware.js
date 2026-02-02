module.exports = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: 'Доступ запрещён. Требуются права администратора.' });
  }
  next();
};