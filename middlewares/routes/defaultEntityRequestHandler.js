module.exports = (res, next, handler) => {
  return (err, entity) => {
    if (err) {
      if (err.name === 'CastError') {
        res.sendStatus(404);
      } else if (err.name === 'ValidationError') {
        res.sendStatus(400);
      } else {
        next(err);
      }
    } else if (!entity) {
      res.sendStatus(404);
    } else {
      handler(entity);
    }
  }
}
