const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authMiddleware = require("./middlewares/auth.middleware");
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const User = require('./user');
const Resume = require('./resume');
const Letter = require('./letter');
const app = express();

dotenv.config();

app.use('/uploads', express.static('uploads'));

app.use(cors());
app.use(bodyParser.json()); // application/json
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/signup', async (req, res, next) => {
    const requestBody = req.body;
    console.log("SIGN UP request");
    const email = requestBody['email'];
    const name = requestBody['name'];
    const password = requestBody['password'];
    console.log({ email: email, name: name, password: password });
    try {
        const hashedPw = await bcrypt.hash(password, 10);

        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
        const result = await user.save();
        const token = jwt.sign(
            {
                email: result.email,
                userId: result._id.toString()
            },
            process.env.JWT_SECRET
        );
        const userWithoutPassword = {
            email: result.email,
            name: result.name,
            id: result._id,
        }
        res.status(201).json({ message: 'User created!', user: userWithoutPassword, token: token });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
})

app.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Wrong password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
            process.env.JWT_SECRET
        );
        const userWithoutPassword = {
            email: loadedUser.email,
            name: loadedUser.name,
            id: loadedUser._id,
        }
        res.status(200).json({ token: token, user: userWithoutPassword });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(err.statusCode).json({ message: err.message });
    }
});


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, file.fieldname + '-' + Date.now() + "." + ext)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

var imageUploader = multer({ storage: storage, fileFilter: fileFilter }).single("image");

app.post('/resume', authMiddleware, imageUploader, async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const jobTitle = req.body.jobTitle;
    const image = req.file.filename;
    const address = req.body.address;
    const summary = req.body.summary;
    const phone = req.body.phone;
    const email = req.body.email;
    const skills = req.body.skills;
    const languages = req.body.languages;
    const experiences = req.body.experiences;
    const educations = req.body.educations;
    try {
        const resume = new Resume({
            user_id: req.user._id,
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            image: image,
            address: address,
            summary: summary,
            phone: phone,
            email: email,
            skills: skills,
            languages: languages,
            experiences: experiences,
            educations: educations
        });
        const result = await resume.save();
        res.status(200).json({ resume: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(err.statusCode).json({ message: err.message });
    }
});


app.get('/resumes', authMiddleware, async (req, res) => {
    const resumes = await Resume.find({ user_id: req.user._id });
    res.status(200).send({ resumes: resumes });
});


app.get('/resume/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const resume = await Resume.findById(id);
    res.status(200).send({ resume: resume });
});



app.post('/letter', authMiddleware, async (req, res) => {
    console.log(req.body);
    const name = req.body.name;
    const jobTitle = req.body.jobTitle;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;
    const yourName = req.body.yourName;
    const paragraphs = req.body.paragraphs;
    try {
        const letter = new Letter({
            user_id: req.user._id,
            name: name,
            jobTitle: jobTitle,
            address: address,
            phone: phone,
            email: email,
            yourName: yourName,
            paragraphs: paragraphs
        });

        const result = await letter.save();
        res.status(200).json({ letter: result });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        res.status(err.statusCode).json({ message: err.message });
    }
});


app.get('/letters', authMiddleware, async (req, res) => {
    const letters = await Letter.find({ user_id: req.user._id });
    res.status(200).send({ letters: letters });
});


app.get('/letter/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const letter = await Letter.findById(id);
    res.status(200).send({ letter: letter });
});



app.use((req, res, next) => {
    res.send("Hi");
    console.log('Hi');
})
mongoose
    .connect(process.env.DB_URL)
    .then(result => {
        console.log("DATABASE connected");
        app.listen(8080, () => {
            console.log("Server is running on port 8080");
        });
    })
    .catch(err => console.log(err));
