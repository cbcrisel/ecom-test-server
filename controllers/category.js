const {pool}=require('../database/config');

const getCategories=async(req,res)=>{
    const result=await pool.query('SELECT * FROM categories');
    res.status(200).json(result.rows);
}

const postCategory=async(req,res)=>{
    try {
        const {name}= req.body;
        const result = await pool.query('INSERT INTO categories (name) values ($1)',[name]);
        res.status(200).send('Category Created');
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Server Error'
        });
    }
}

module.exports={
    getCategories, postCategory
}