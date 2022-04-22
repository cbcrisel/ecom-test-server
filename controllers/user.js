const bcrypt= require('bcrypt');



const {pool}=require('../database/config');
const { generateJWT } = require('../helpers/jwt');


const getUsers=async(req,res)=>{
    const result= await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
}

const postUser=async(req,res)=>{
    const {fullname,email,password,role}= req.body;
    const salt= bcrypt.genSaltSync();
    let pswd=bcrypt.hashSync(password,salt);
    const result= await pool.query('INSERT INTO users (fullname,email, password, role) values ($1,$2,$3,$4)',[fullname,email,pswd,role]);
    const user= await pool.query('SELECT id FROM users order by id desc LIMIT 1');
    const status='EMPTY'
    const result3= await pool.query('INSERT INTO carts (status, user_id) values ($1,$2)',[status,user.rows[0].id]);
    res.status(200).send('USER CREATED');
}

const login=async(req,res)=>{
    const {email,password}= req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE users.email=$1',[email]);
        if(user.rowCount==0){
            return res.status(400).json({
                msg:'Usuario no existe'
            });
        }
        const validPassword= bcrypt.compareSync(password, user.rows[0].password);
        if(!validPassword){
            return res.status(400).json({
                msg:'Contraseña no existe'
            });
        }
        const token = await generateJWT(user.rows[0].id);
        const logged=user.rows[0];
        res.json({
            logged,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Server Error'
        })
    }
}

module.exports={
    getUsers,postUser,login
}