const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const UserModel = require('./model/userModel')
const AdimModel = require('./model/adimModel')
const bcrypt = require('bcryptjs')


mongoose.connect('mongodb+srv://abbas:adnanabbas@nodeapplication.wywl28e.mongodb.net/?retryWrites=true&w=majority').then(()=>console.log("Datebase is connected")).catch((error)=>console.log("Error: " + error))

app.use(cors())
app.use(express.json())


app.post('/api/user/register', async (req,res)=>{
    console.log(req.body)

    try {
        const newPassword = await bcrypt.hash(req.body.password,10)
        const user = await AdimModel.create({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            gender: req.body.gender,
            password: newPassword,
        })
        user.save()
    } catch (error) {
        console.log(error.message)
    }


    res.json({status : 'ok'})
})


app.post('/api/user/login', async (req,res)=>{
    // console.log(req.body)
    // res.send(req.body)

    try {
        const user = await AdimModel.findOne({
            email: req.body.email,
        })

        const isPassword = await bcrypt.compare(req.body.password,user.password)
        console.log(isPassword)
        if(isPassword) {
            const token = jwt.sign({
                name: user.name,
                email: user.email
            },'secret123')
            return res.json({status: 'ok',user : token})
        }
        else {
            return res.json({status: 'error', user: false})
        }
    } catch (error) {
        console.log(error.message)
    }


    res.json({status : 'ok'})
})


app.post('/api/admin/login', async (req,res)=>{
    // console.log(req.body)
    // res.send(req.body)

    try {
        const user = await UserModel.findOne({
            email: req.body.email,
        })

        const isPassword = await bcrypt.compare(req.body.password,user.password)
        console.log(isPassword)
        if(isPassword) {
            const token = jwt.sign({
                name: user.name,
                email: user.email
            },'secret123')
            return res.json({status: 'ok',user : token})
        }
        else {
            return res.json({status: 'error', user: false})
        }
    } catch (error) {
        console.log(error.message)
    }


    res.json({status : 'ok'})
})


app.get('/api/admin/home', async (req,res)=>{
    // console.log(req.body)
    // res.send(req.body)

    const token = req.headers['x-access-token']

    try {
        const decode =  jwt.verify(token,'secret123')
        const email = decode.email
        // const user = await UserModel.findOne({email: email})
        const user = await AdimModel.find({},{password: 0})

        return res.json({status : 'ok', user})
    } catch (error) {
        console.log(error)
        res.json({status: 'error', error:'Invalid Token' })
    }


    res.json({status : 'ok'})
})


app.get('/api/user/home', async (req,res)=>{
    // console.log(req.body)
    // res.send(req.body)

    const token = req.headers['x-access-token']

    try {
        const decode =  jwt.verify(token,'secret123')
        const email = decode.email
        const user = await AdimModel.findOne({email: email})
        // const user = await AdimModel.find({},{password: 0})

        return res.json({status : 'ok', user})
    } catch (error) {
        console.log(error)
        res.json({status: 'error', error:'Invalid Token' })
    }


    res.json({status : 'ok'})
})

// Add a new endpoint to delete a user
app.delete('/api/admin/delete-user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await AdimModel.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.json({ status: 'error', error: 'User not found' });
        }

        return res.json({ status: 'ok', message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'Error deleting user' });
    }
});


// Add a new endpoint to modify a user
app.put('/api/admin/modify-user/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, age,gender } = req.body;

    try {
        const updatedUser = await AdimModel.findByIdAndUpdate(
            userId,
            { name, age,gender },
            { new: true }
        );

        if (!updatedUser) {
            return res.json({ status: 'error', error: 'User not found' });
        }

        return res.json({ status: 'ok', user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'Error modifying user' });
    }
});



app.post('/api/admin/logout', (req, res) => {
    res.json({ status: 'logout', message: 'User logged out successfully' });
});
app.post('/api/user/logout', (req, res) => {
    res.json({ status: 'logout', message: 'User logged out successfully' });
});

app.listen(6232,()=>console.log("Server is running in port 6232"))

