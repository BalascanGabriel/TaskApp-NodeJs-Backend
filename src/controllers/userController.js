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
                return res.status(404).send({ error: 'User not found' });
            }
    
            res.status(200).send(user);
        } catch (error) {
            console.error('Error in getUserById:', error);
    
            // Handle specific errors
            if (error.name === 'CastError') {
                return res.status(400).send({ error: 'Invalid user ID' });
            }
    
            // Handle other errors
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    

    async updateUser(req, res) {
        const userId = req.params.id;
        //Adica in updates o sa fie fiecare key din body['name', 'description'....]
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age'];

        //valide sunt doar cele din update care sunt si in allowedUpdates
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: "Invalid updates" })
        }

        //Incepe update-ul
        try{
            //gaseste utilizator
            const user = await User.findById(userId)
            if (!user) {
                //daca user nu exista
                return res.status(404).send();
            }
            updates.forEach((update) => (user[update] = req.body[update]));
            await user.save();
            res.status(200).send(user);

        }catch(error){
            res.status(500).json({error: error})
        }

    }

    async shortUpdateUser(req, res){
        const userId = req.params.id;
        
        try {
            // Find the user by ID and update the fields in the request body
            const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });

            if (!user) {
                return res.status(404).send();
            }

            res.status(200).send(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteUserById(req, res){
        const userId = req.params.id

        try{
            const user = await User.findByIdAndDelete(userId)
            if (!user) {
                return res.status(404).send();
            }

            res.status(200).send(user);

        }catch(error){
            res.status(500).json({error: error.message})
        }
    }
}

module.exports = new UserController();