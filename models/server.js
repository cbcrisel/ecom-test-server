const express= require('express');
const cors= require('cors');

class Server{
    constructor(){
        this.app=express();
        this.port=3000;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
        this.app.use('/public',express.static('public'));
    }

    routes(){
        this.app.use(require('../routes/user'));
        this.app.use(require('../routes/category'));
        this.app.use(require('../routes/product'));
        this.app.use(require('../routes/cart'));
    }

    start(){
        this.app.listen(this.port,()=>{
            console.log('Servidor levantado en : ', this.port);
        })
    }
}

module.exports= Server;