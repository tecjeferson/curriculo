const express = require('express')
const sqlite = require('sqlite')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')

const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), {
    Promise
})

//redirect to a local por 3000 or external 80
const port = process.env.PORT || 3000

//Se estiver local== acesso a area admin, seNão == sem acesso
app.use('/admin', (req, res, next) => {
    if (req.hostname === 'localhost') {
        next()
    } else {
        res.send('Not allowed')
    }
})


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// If cannot find some file on /, tries by Public folder
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: true
}))



//Render  the index "home.ejs" on Browser
app.get('/', async (request, response) => {
    const db = await dbConnection
    const contato = await db.all('select * from contato;')
    const experiencia = await db.all('select * from experiencia')
    const idiomas = await db.all('select * from idiomas')
    const formacao = await db.all('select * from formacao')
    response.render('index', {
        contato,
        experiencia,
        idiomas,
        formacao
    })
})
app.get('/new', async (request, response) => {
    const db = await dbConnection
    const contato = await db.all('select * from contato;')
    const experiencia = await db.all('select * from experiencia')
    const idiomas = await db.all('select * from idiomas')
    const formacao = await db.all('select * from formacao')
    response.render('indexnew', {
        contato,
        experiencia,
        idiomas,
        formacao
    })
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({
    extended: true
}))
//It creates a render for a new page /admin
app.get('/admin', async (req, res) => {
    res.render('admin/home')
})
app.get('/admin/editar-contato', async (req, res) => {
    const db = await dbConnection
    const contato = await db.all('select * from contato;')
    res.render('admin/editar-contato', {
        contato
    })
})
app.get('/admin/editar-experiencia', async (req, res) => {
    res.render('admin/editar-experiencia')
})

// It's send the dates to browser/database 
app.post('/show', (req, res) => {

    res.send(req.body)
})

const init = async () => {
    //verify if the connection is done, as it is a promise we can use 'await' to wait for
    const db = await dbConnection
    await db.run('create table if not exists contato (id INTEGER PRIMARY KEY, telefone INTEGER, email TEXT, site TEXT, linkedin TEXT, skype TEXT);')
    await db.run('create table if not exists experiencia(id INTEGER PRIMARY KEY, empresa TEXT, startDate TEXT, endDate TEXT, descricao TEXT, cargo TEXT);')
    await db.run('create table if not exists idiomas(id INTEGER PRIMARY KEY, idioma TEXT, level TEXT);')
    await db.run('create table if not exists formacao(id INTEGER PRIMARY KEY, instituicao TEXT, curso TEXT, inicio TEXT, fim TEXT);')

    //await db.run(`insert into formacao(instituicao, curso, inicio, fim) values('UNOPAR', 'Analise e Desenvolvimento de Sistemas', '2013', '2016') `)
    //await db.run(`insert into idiomas(idioma, level) values('Português', 'Nativo') `)
    //const categoria = 'contato'
    //await db.run(`insert into experiencia(empresa, startDate, endDate, descricao, cargo) values('AVEVA Engineering software for the Plant and Marine',
    //'Agosto - 2014', 'Atual', 'Trabalho em equipe de administração do Configuration Manager, com foco em Deployment,
    // Applications (Uninstall,Install,Collections, Criação de Script...), Software Center entregando serviço
    // para todos os escritórios no mundo. Trabalho em time global compartilhando informações e documentando tickets através do sistema de
    //chamados.   Responsável pelo suporte de toda América Latina com Office365, Hyper-V, VPN, atuando também com Microsoft
    //Server, roteadores, switch, aplicações internas de RH, Financeiro e equipe técnica.    
    //Suporte a usuários locais, home office e aos usuários de vários países da empresa.', 'IT Support Analyst - Administrador Configuration Manager')`)

    //await db.run(`insert into experiencia(empresa, startDate, endDate, descricao, cargo) values('Kaistudo',
    //'Outubro - 2013', 'Agosto - 2014', ' Responsável por toda TI da e fazendo a ligação entre tecnologia x negócio com os sócios da empresa,
    //sugerindo novos procedimentos e investimentos.  Implementação de um sistema de comunicação interno. Manter, atualizar e customizar sistemas ERP
    //(Winthor \ Totvs) em funcionamento para as áreas da empresa e para os mais de 45 Representantes Comerciais da empresa (RCA) Manter, atualizar e 
    //customizar sistema de Vendas Maxima Sistemas em funcionamento para toda a equipe de RCAs da empresa. Treinamento de funcionários nas ferramentas
    //de vendas e ERP Treinamento de estagiário, gestão de contratos de prestação de serviços de TI', 'Analista de Sistemas ERP')`)

    //await db.run(`insert into contato(telefone, email, site, linkedin, skype ) values('55 21 97384 2858', 'tecjeferson@gmail.com',
    //            'www.jefersonvrocha.com', 'www.linkedin.com/in/jefersonvrocha', 'jeferson.vieira.da.rocha')`)
}
init()

//Using express to run on Port 3000
app.listen(port, (err) => {
    if (err) {
        console.log('Não foi possivel iniciar o servidor')

    } else {
        console.log('Servidor foi iniciado com sucesso na porta 3000...')
    }
})