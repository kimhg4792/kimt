const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt-nodejs');
const expressLayouts = require('express-ejs-layouts');
const ps = require('@prisma/client');
const jquery = require('jquery');
const { add, tensor } = require('@tensorflow/tfjs');
const { endianness } = require('os');
const { resolveSoa } = require('dns');
const prisma = new ps.PrismaClient();

const port = 3000;

//-----------------------------------------app.set--------------------------------------------//
app.set('views',path.join(__dirname,'views')); // JOIN‗未使用code: 「app.set('views', __dirname + '/views');」
app.set('view engine', 'ejs');
//app.set('layout', 'layout');               // ejs-layouts
//app.set("layout extractScripts", true);    // ejs-layouts

//-----------------------------------------app.use --------------------------------------------//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());

app.use(session({
    secret: 'ambc@!vsmkv#!&*!#EDNAnsv#!$()_*#@',
    resave: false,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public')); // public
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
app.use('/bootstrap/', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/jquery/', express.static(path.join(__dirname,'node_modules/jquery/dist')));


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

const makeFirstSession = (req) => {
    if(req.session.user_uid == undefined) {
        req.session.user_uid = {
            user_uid: '',
            auth: ''
        };
    }
}

const makePhone = (phone) => {
    const temp ='';
    for(let i=0; i<phone.length; i++) {
        if(phone.charAt(i) !== '-') temp += phone.charAt(i); 
    }

    return temp;
}

const unionBirth = (year, month, date) => {
    year = year.toString();

    if(month <= 9) {
        month = "0" + month.toString();
    } else {
        month = month.toString();
    }

    if(date <= 9) {
        date = "0" + date.toString();
    } else {
        date = date.toString();
    }

    const result = year+month+date;
    
   return parseInt(result);
}

const findPassword = (userName, email, phone, birth, db) => {
    for(d in db) {
        if(userName === db.user_name && email === db.user_emailAddress ) {

        }
    }

}


// ----------------------------------------Router---------------------------------------------- //

//main
app.get('/', (req, res) => {
    try {
        makeFirstSession(req);
        res.render('pages/index', req.session.user_uid);
    } catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    
});


//--login_logout--//
app.get('/login', async function(req, res, next)  {
    try {
        makeFirstSession(req);
        res.render('pages/login', req.session.user_uid);
    } catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    
});




app.post('/login', async function(req, res, next) {
    try {
        makeFirstSession(req);
        const body = req.body;
        const users = await prisma.users.findMany();
        const cont = findUserT( body.user_id, body.user_pass, users );

        if( cont ) {
            req.session.user_uid = { 
                user_uid: cont.user_id,
                auth: cont.auth
            }
        
            res.redirect('/');
        } else {
            res.render('error', req.session.user_uid);
        }
    } catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    

});





app.get('/logout', (req, res) => {
    try {
        delete req.session.user_uid;
        res.redirect('/');
    } catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    
});





//--join--//
app.get('/sign-up', async function(req, res, next) {
    try {
        makeFirstSession(req);
        res.render('pages/sign-up', req.session.user_uid);
    } catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    
})






app.post('/sign-up', async function(req, res, next) {
    try {
        makeFirstSession(req);
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.user_pass, salt);
        const ymd = unionBirth(req.body.birth_year, req.body.birth_month, req.body.birth_date);
        const user = await prisma.Users.findMany();

        if( !findUser(req.body.user_id , user)) {
            const a = await prisma.Users.create({
                data: {
                    user_id: req.body.user_id,
                    user_pass: hash,
                    user_name: req.body.user_name,
                    user_birth: ymd,
                    user_address: req.body.user_address,
                    user_emailAddress: req.body.user_emailAddress,
                    user_phone: req.body.user_phone
                }
            });
            res.render('pages/login',req.session.user_uid);
        } else {
            res.send("don't");
        }
    } catch(error) {
        res.render('pages/index', req.session.user_uid);
    }
    
      
});





app.get('/findPass', async function(req, res, next) {
    try {
        makeFirstSession(req);
        res.render('pages/findPass', req.session.user_uid);
    } catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    
});






app.post('/findPass', async function(req, res, next) {
    try {
        makeFirstSession(req);
        const body = req.body;
        const user = await prisma.Users.findMany();
        let getUser;
        let count = 0;

        const user_name = body.user_name;
        const user_emailAddress = body.user_emailAddress;
        const user_phone = body.user_phone;
        const user_birth = unionBirth(body.birth_year, body.birth_month, body.birth_date);

        for(let users of user) {
            if(users.user_name === user_name && users.user_emailAddress === user_emailAddress && users.user_phone === user_phone && users.user_birth === user_birth) {
                getUser = users;
                count = 1;
                req.session.user_uid = { 
                    user_uid: getUser.user_id,
                    auth: getUser.auth
                }
            }
        }

        const data = {
            user: getUser
        }
        
        if(count === 1) {
            res.render('pages/alertId', data);
        } else {
            res.render('pages/index', req.session.user_uid);
        }
    }  catch (error) {
        res.render('pages/index', req.session.user_uid);
    }
    

});






app.post('/changePass', async function(req, res, next) {
    try {
        const body = req.body;
        const id = req.session.user_uid;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(body.user_pass, salt);

        if(body.user_pass === body.user_pass_check) {
            const update = await prisma.Users.update({
                where: { user_id: id },
                data: { user_pass: hash},
            });
            delete req.session.user_uid;
            res.render('pages/login');
        } else {
            alert("mistake insert password.");
            res.render('pages/index', req.session.user_uid);
        }
    } catch (error) {
        res.render('pages/login', req.session.user_uid);
    }

    
     
});



//--error--//
app.get('/error', async function(req, res, next) {
    res.render('pages/error');
});



//--dbCheck--//
app.get('/dbCheck', async function(req, res, next) {
    makeFirstSession(req);
    const user = await prisma.users.findMany();
    const a = req.session.user_uid;

    res.render("pages/dbCheck", req.session.user_uid);

});



//--paint--//
app.get('/paint',async function(req, res, next) {
    makeFirstSession(req);
    res.render('pages/paint', req.session.user_uid);
});


//--tetris--//
app.get('/tetris', async function(req, res, next) {
    makeFirstSession(req);
    res.render('pages/tetris', req.session.user_uid);
});



app.get('/chart', async function(req, res, next) {
    makeFirstSession(req);
    res.render('pages/chart', req.session.user_uid);
})

app.get('/chart2', async function(req, res, next) {
    makeFirstSession(req);
    res.render('pages/chart2', req.session.user_uid);
})


app.get('/study', async function(req, res, next) {
    makeFirstSession(req);
    res.render('pages/study', req.session.user_uid);
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

app.get('/study/studyTest', async function(req, res, next) {
    res.render('studyTest');
})

app.get('/study/studyTest2', async function(req, res, next) {
    res.render('studyTest2');
})

app.get('/study/imageLearning', async function(req, res, next) {
    res.render('imageLearning');
})

app.get('/study/recognition', async function(req, res, next) {
    res.render('recognition');
})

app.get('/study/scrollTest', async function(req, res, next) {
    res.render('scrollTest');
})

app.get('/study/bodyPix', async function(req, res, next) {
    res.render('bodyPix');
})

app.get('/study/handpose', async function(req, res, next) {
    res.render('handpose');
})

app.get('/study/graphicTest', async function(req, res, next) {
    res.render('graphicTest');
})

app.get('/study/webglPractice', async function(req, res, next) {
    try {
        const chartData = await prisma.chart.findMany({
            select: {
                xaxis: true,
                yaxis: true,
                zaxis: true,
                size: true,
                r: true,
                g: true,
                b: true,
                a: true,
                width: true,
                opacity: true,
                type: true
            }
        });
    
        res.render('webglPractice', {
            chartdata: chartData
        });
    } catch(err) {
        res.redirect('login');
    }
    
})

app.get('/sessionClear', (req, res) => {
    delete req.session.test;
    res.redirect('/sign-up');
});

app.get('/study/threePractice', async function(req, res, next) {
    res.render('threePractice');
})

app.get('/study/threePractice2', async function(req, res, next) {
    res.render('threePractice2');
})

app.get('/study/threePractice3', async function(req, res, next) {
    res.render('threePractice3');
})

app.get('/study/threePractice4', async function(req, res, next) {
    res.render('threePractice4');
})

app.get('/study/threePractice5', async function(req, res, next) {
    res.render('threePractice5');
})

app.get('/study/threeActure', async function(req, res, next) {
    if(req.session.user_uid == undefined) {
        req.session.user_uid = {
            user_id: '',
            auth: ''
        };
    }
    res.render('threeActure', req.session.user_uid);
})

app.get('/test', async function(req, res, next) {
    
    req_data = {
        test : 'kkkkk'
        
    }
    res.render('test', req_data);
})


app.post('/test', async function(req, res, next) {
    const data = {
        test: req.body.test
    }
    res.redirect('test', data);
})


app.get('/chart/sample', async function(req, res, next) {
    makeFirstSession(req);
    res.render('gltfSample', req.session.user_uid);
})



app.listen(port, () =>  console.log('start nodejs!'));
