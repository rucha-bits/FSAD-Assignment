// Simulated login
exports.login = (req, res) => {
res.json({
message: 'Simulated login successful',
user: {
name: 'Coordinator',
role: 'admin',
},
});
};