const wppconnect = require('@wppconnect-team/wppconnect');

var userStages = [];

wppconnect.create({
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) =>
        client.onMessage((message) => {
            console.log('Mensagem digitada pelo usuário: ' + message.body);
            stages(client, message);
        }))
    .catch((error) =>
        console.log(error));


//  Stages = Olá  >>  Nome  >>  CPF  >> Fim
function stages(client, message) {
    stage = userStages[message.from];
    switch (stage) {
        case 'nome':
            const nome = message.body;
            sendWppMessage(client, message.from, 'Muito prazer, ' + message.body);
            sendWppMessage(client, message.from, 'Me conta qual o seu CPF?');
            userStages[message.from] = 'CPF';
            break;
        case 'CPF':
            const cpf = message.body;
            sendWppMessage(client, message.from, 'Obrigada por informar seu CPF, ' + cpf);
            sendWppMessage(client, message.from, 'Tchauzinho!');
            userStages[message.from] = 'fim';
            break;
        case 'fim':
            sendWppMessage(client, message.from, 'fim');
            break;
        default: // Olá 
            console.log('*Usuário atual* from:' + message.from);
            sendWppMessage(client, message.from, 'Bem vinde! Meu nome é Avalon e irei te ajudar por aqui!');
            sendWppMessage(client, message.from, 'Me conta seu *nome*?');
            userStages[message.from] = 'nome';
    }
}

function sendWppMessage(client, sendTo, text) {
    client
        .sendText(sendTo, text)
        .then((result) => {
            // console.log('SUCESSO: ', result); 
        })
        .catch((erro) => {
            console.error('ERRO: ', erro);
        });
}
