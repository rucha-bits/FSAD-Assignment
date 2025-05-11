// Simulating authentication middleware
module.exports = (req, res, next) => {
  console.log('Simulated Authentication');
  // Mocking a simple user as if authenticated
  req.user = { id: '123', name: 'Admin' };
  next();
};
