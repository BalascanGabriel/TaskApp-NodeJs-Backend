const User = require('../models/user')

class UserController {
    //Create new user
    async createUser(req, res) {
        const user = new User(req.body)
        try {
            await user.save()
            res.status(201).send(user)
        } catch (error) {
            res.status(500).json({ error: 'Server Error' })
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).send(users);
        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }
    }

    async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const user = await User.findById(userId);
            if (!user) {
                res.status(404).send();
            }
            res.status(201).send(user);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

}

module.exports = new UserController();