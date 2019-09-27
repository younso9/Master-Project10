const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const enableGlobalErrorLogging = false;
const { check, validationResult } = require('express-validator');
const auth = require('basic-auth');
const cors = require('cors');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
const bcrypt = require('bcryptjs');

const User = require('../models').User;
const Course = require('../models').Course;

// This is the User authentication Middleware
const authenticateUser = async (req, res, next) => {
    let message;
    
// This parses the user's credentials from the Authorization header.
    const credentials = auth(req);
    if (credentials) {      // This will find the users with matching email address
        const user = await User.findOne({
            raw: true,
            where: {
                emailAddress: credentials.name,
            },
        });
        // If user matches email - the bcryptjs npm package is used to compare the user's password (from the Authorization header)
        if (user) {
          
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            
            if (authenticated) {  // If password matches
                console.log(`Authentication successful for user: ${user.firstName} ${user.lastName}`);
                if (req.originalUrl.includes('courses')) { //If route has a courses endpoint, set request userId to matched user id
                    req.body.userId = user.id;
                } else if (req.originalUrl.includes('users')) { //If route has a users endpoint, set request id to matched user id
                    req.body.id = user.id;
                }
            } else { // Otherwise the Authentication failed
                
                message = `Authentication failed for user: ${user.firstName} ${user.lastName}`;
            }
        } else { // No email matching the Authorization header
                message = `User not found for email address: ${credentials.name}`;
        }
    } else {    // No user credentials/authorization header available
        
        message = 'Authorization header not found';
    }
                // Deny Access if there is anything stored in message
    if (message) {
        console.warn(message);
        const err = new Error('Access Denied');
        err.status = 401;
        next(err);
    } else {    //User authenticated
        next();
    }
}

// GET request to /api/users / Returns HTTP - 200 Status Code 
router.get('/users', authenticateUser, async (req, res) => {
    const userData = await User.findByPk(req.body.id)
    res.json(userData);
});

// POST request to /api/users ~ create a user / Returns HTTP - 201 Status Code/ Returns a 400 error  

router.post('/users', (req, res, next) => {
    const user = req.body;

    const errors = [];

    if (!user.firstName) {
        errors.push('Please provide a "firstName"');
    }
    if (!user.lastName) {
        errors.push('Please provide a "lastName"');
    }
    if (!user.emailAddress) {
        errors.push('Please provide an "emailAddress"');
    }
    if (!user.password) {
        errors.push('Please provide a "password"');
    }

    if (errors.length != 0) {
        res.status(400);
        res.json(errors);
    }
    else {
        user.password = bcrypt.hashSync(user.password, 8);
        const User = require('../models').User;

        User.create(user)
            .then(() => {
                res.set('Location', "/");
                res.status(201);
                res.send();
            })
            .catch((err) => {
                if (err.name === "SequelizeUniqueConstraintError") {
                    res.json(err.errors)
                } else { next(new Error(err)); }
            });
    }
});

// GET request to /api/courses to list courses / Returns HTTP---- Status Code 200 

router.get('/courses', (req, res) => {

    const Course = require('../models').Course;
    const User = require('../models').User;
 
    // This will get a list of courses
    Course.findAll({
        order: [
            ['id', 'ASC'],
        ],
        include: [
            { model: User, as: 'user' }
        ]
    })
        .then((courseList) => {
            res.status(200);
            res.json(courseList);
        });
});

// GET request to /api/courses/:id to show course / Will returns an HTTP - 200 Status Code
router.get('/courses/:id', (req, res) => {
    const Course = require('../models').Course;
    const User = require('../models').User;
    Course.findByPk(req.params.id, {
        include: [
            { model: User, as: 'user' }
        ]
    }
    ).then((foundCourse) => {
        if (foundCourse) {
            res.status(200);
            res.json(foundCourse);
        }
        else { // This will render 404 if :id is not in the database
            res.status(404);
            res.json({ "message": "Course Not Found " + req.params.id });
        }
    })
        .catch((err) => {
            next(new Error(err));
        });

});

// POST request to /api/courses to create courses / Will return an HTTP - 201 Status Code
router.post('/courses', authenticateUser, async (req, res, next) => {
    try {

        const course = req.body;

        const errors = [];

        if (!course.title) {
            errors.push('Please provide a valid "title"');
        }
        if (!course.description) {
            errors.push('Please provide a valid "description"');
        }

        if (errors.length != 0) {
            res.status(400);
            res.json(errors);
        }
        else {

            const newCourse = await Course.create(course)
            res.location(`/api/courses/${newCourse.id}`)
            res.status(201).end()
        }
    } catch (err) {
        console.log("500 internal server error")
        next(err)
    }
});

// PUT request to /api/courses/:id to update courses / Will returns an HTTP- 204 Status Code

router.put('/courses/:id', authenticateUser, async (req, res, next) => {
    const course = req.body;

    const errors = [];

    if (!course.title) {
        errors.push('Please provide a valid "title"');
    }
    if (!course.description) {
        errors.push('Please provide a valid "description"');
    }

    if (errors.length != 0) {
        res.status(400);
        res.json(errors);
    }
    else {

        await Course.update(req.body,
            {
                where: { id: req.params.id }
            })
            .then(() => {
                res.status(204);
                res.send();
            })
            .catch(err)
        console.log("500 internal server error")
        next(err)
    }
});

// DELETE request to /api/courses/:id to delete courses

router.delete('/courses/:id', authenticateUser, async (req, res, next) => {
    
    try {
        const deleteCourse = await Course.findByPk(req.params.id)

        if (deleteCourse.userId === req.body.userId) {
            await deleteCourse.destroy()
            res.status(204).end()
        } else {
            res.status(403);
            res.json({ "MESSAGE": "FORBIDDEN you dont have permission" });
        }
    } catch (err) {
        console.log("500 internal server error")
        next(err)
    }
});

// This sets a greeting for the root route
router.get('/', (req, res) => {
    const sql = new Sequelize({
        dialect: 'sqlite',
        storage: 'fsjstd-restapi.db'
    });

    const test = sql.authenticate()
        .then(function () {
            console.log("CONNECTED! ");
        })
        .catch(function (err) {
            console.log("FAILED");
        })
        .done();
    res.json({
        message: 'Welcome to the REST API project!',
    });
});

// This will send a 404 status code if other route does not match
router.use((req, res, next) => {
    res.status(404).json({
        message: 'Route Not Found',
    });
});

// This is the global error handler
router.use((err, req, res, next) => {
    if (enableGlobalErrorLogging) {
        console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
    }

    res.status(err.status || 500).json({
        message: err.message,
        error: {}
    });
});

module.exports = router;