const {Router}= require('express');
const { getUsers, postUser, login } = require('../controllers/user');

const router= new Router();


router.get('/api/users',getUsers);
router.post('/api/user',postUser);
router.post('/api/login',login);

module.exports=router;