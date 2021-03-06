const express = require('express');

const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the Api~!!'
    })
});


app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created....',
                authData
            })
        }
    });
});

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        username: 'minchanwoo',
        email: 'min@gmail.com'
    }

    //최초 로그인 할때 회원 정보 넣어서 헤더(header).내용(payload).서명(signature) 만듬
    jwt.sign({user}, 'secretkey', {expiresIn: '1m'}, (err, token) => {
        res.json({
            token
        })
    });
});

//Format of Token
//Authorization: Bearer <access_token>

// 이 미들웨어에서 sign된 유저가 다른 요청 할때 맞는지 아닌지 검증하기 위해 만들어놓은 
// 미들웨어이다, 
// Verify Token
function verifyToken(req, res, next) {
    console.log('HAHA~!!', req.headers)
    //Get auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undifined
    if(typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ')[1];
        //Set the token
        //여기서 토큰세팅해주고 위에서 조건문 통과하면 위의 /api/posts라우팅에서 미들웨어 통과하면서
        //req.token에 jwt를 넣어주고 jwt.verify함수를 통해 검증한다~!!
        req.token = bearer;
        // Next middleware
        next();
    } else {
        //Forbidden
        res.sendStatus(403);
    }
}


app.listen(5000, () => {
    console.log('5000번 포트에서 실행중~~!!')
});