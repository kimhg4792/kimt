const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const expressLayouts = require('express-ejs-layouts');
const ps = require('@prisma/client');
const { title } = require('process');
const internal = require('stream');
const prisma = new ps.PrismaClient();
const tensorflow = require('@tensorflow/tfjs');

const port = 3000;



//----------------------------------------function---------------------------------//
const findUser = (user_id, user) => {
    return user.find( v => (v.user_id === user_id) );
}

const findUserT = (user_id, user_pass, user) => {
    return user.find( v => (v.user_id === user_id && bcrypt.compareSync(user_pass, v.user_pass) ) );
}

const findUserIndex = (user_id, user_pass, user) => {
    return user.findIndex( v => (v.user_id === user_id && bcrypt.compareSync(user_pass, v.user_pass) ) );
}


//-----------------------------------------app.set--------------------------------------------//
app.set('views',path.join(__dirname,'views')); // JOIN‗未使用code: 「app.set('views', __dirname + '/views');」
app.set('view engine', 'ejs');
app.set('layout', 'layout');               // ejs-layouts
app.set("layout extractScripts", true);    // ejs-layouts



//-----------------------------------------app.use --------------------------------------------//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(express.static(path.join(__dirname, 'public'))); // public ポルダー内のファイルを使えるように設定
app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false,
    saveUninitialized: true
}));
//app.use(expressLayouts); // ejs-layouts




// ----------------------------------------Router---------------------------------------------- //

//main
app.get('/', (req, res) => {
    if(req.session.user_uid == undefined) {
        req.session.user_uid = {
            user_id: '',
            auth: ''
        };
    }
    
    res.render('index', req.session.user_uid);
});


//--login_logout--//
app.get('/login', async function(req, res, next)  {
    res.render('login', req.session.user_uid);
});

app.post('/login', async function(req, res, next) {
    const body = req.body;
    const users = await prisma.users.findMany();
    const cont = findUserT( body.user_id, body.user_pass, users );

    if( cont ) {
        req.session.user_uid = { 
            user_id: cont.user_id,
            auth: cont.auth
         }
    
        res.redirect('/');
    } else {
        res.render('error', req.session.user_uid);
    }

});

app.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/');
});
//--//



//--join--//
app.get('/join', async function(req, res, next) {
    res.render('join');
});

app.post('/join', async function(req, res, next) {
    const users = await prisma.users.findMany();
    const body = req.body;
    if( !findUser(body.user_id, users)) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.user_pass, salt);
        await prisma.users.create({
            data: {user_id: body.user_id, user_pass: hash}
        })
        res.redirect('/login');
    } else {
        res.send('DONT JOIN');
    }
       
});
//--//




//--dbCheck--//
app.get('/dbCheck', async function(req, res, next) {
    const user = await prisma.users.findMany();
    const a = req.session.user_uid;

    if(a.auth !== 1) {
        res.send('権限がありません。');
    } else {
        res.send(user);
    }

});
//--//


//--paint--//
app.get('/paint',async function(req, res, next) {
    res.render('paint', req.session.user_uid);
});
//--//

//--tetris--//
app.get('/tetris', async function(req, res, next) {
    res.render('tetris', req.session.user_uid);
});

//--//





app.get('/study', async function(req, res, next) {
    res.render('study', req.session.user_uid);
})


//* deepLearning Study example *//
app.get('/study/linearRegression', async function(req, res, next) {
    res.render('linearRegression');
});

app.get('/study/cnn', async function(req, res, next) {
    res.render('cnn');
})

app.get('/study/imageTrace', async function(req, res, next) {
    res.render('imageTrace');
})

//--//


app.listen(port);
console.log('start nodejs!');