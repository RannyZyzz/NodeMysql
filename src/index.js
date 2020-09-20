const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const router = express.Router();
router.get('/', (req,res) => res.json ({ message : 'Funcionando!'}));
app.use('/', router);

const connection = mysql.createConnection({
    host : 'INSERT',
    port : '3306',
    user : 'INSERT',
    password : 'INSERT',
    database : 'INSERT'
});

connection.connect(function(err){
    if(err){
        return console.log(err);
    }
    console.log('Conectou!');
})

function execSQLQuery (sqlQry, res){
    const connection = mysql.createConnection({
    host : 'INSERT',
    port : '3306',
    user : 'INSERT',
    password : 'INSERT',
    database : 'INSERT'
    });

connection.query(sqlQry, function( error, results, fields){
    if(error){
        res.json(error);
    }else{
        res.json(results);
        connection.end();
        console.log('executou!');
    }
});
}

router.get('/countUsers/:id?', (req,res) =>{
    let filter = '';
    if(req.params.id) filter = 'id_operadora =' + parseInt(req.params.id);
    execSQLQuery("select count(*) \
    FROM (SELECT distinct localizador \
    FROM thweb_mob.tokens as tokens where "+ filter + " \
    AND id_aplicacao = 4 \
    AND localizador is not null and localizador <> '' \
    and token is not null and token <> '' \
    and (optout_push = 0 OR optout_push is null) \
    group by localizador) as t", res);
})

router.get('/listUsers/:id?', (req,res) =>{
    let filter = '';
    if(req.params.id) filter = 'id_operadora =' + parseInt(req.params.id);
    execSQLQuery("select localizador, nome, email, telefone, sexo, estado, cidade, matricula, data_nascimento, plataforma, plataforma_versao \
    FROM (SELECT distinct localizador, nome, email, telefone, sexo, estado, cidade, matricula, data_nascimento, plataforma, plataforma_versao \
    FROM thweb_mob.tokens as tokens where "+ filter + " \
    AND id_aplicacao = 4 \
    AND localizador is not null and localizador <> '' \
    and token is not null and token <> '' \
    and (optout_push = 0 OR optout_push is null) \
    group by localizador) as t", res);
})

app.listen(3000);
console.log('API Funcionando!');


