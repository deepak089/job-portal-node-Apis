const userModel = require('../model/userModel');

exports.loginController = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next('Please Provide All Details');
    }

    const user = await userModel.findOne({ email }).select("+password");;

    if (!user) {
        next('Invalid username or password');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        next('Invalid username or password');
    }
    const token = user.createJwt();

    res.status(201).send({
        message: 'User logged in !!!',
        user,
        token,
        success: true
    });
}

exports.registerController = async (req, res, next) => {
    const { name, email, password, location } = req.body;
    if (!name) { next(' Name is required') }
    if (!email) { next(' Email is required') }
    if (!password) { next('Password is required') }

    // check existing user
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        next('User Already Exists');
    }

    const user = await userModel.create({ name, email, password });

    const token = user.createJwt();

    res.status(201).send({
        message: 'User saved !!!',
        user,
        token,
        success: true
    });
}