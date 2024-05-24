const express = require('express')/*importaçao da biblioteca express*/

const uuid = require('uuid')/*importaçao da biblioteca uuid*/

const port = 3000 /* criei uma variavel da minha porta se eu precisar altera fica mais facil */

const app = express() /*para facilitar o uso do express criamos uma varialvel */

app.use(express.json())/*informando o padrao usado para express sem colocar antes das rotas */


const orders = [] /* varial para armazenar meu array*/

const checkOrders = (request, response ,next) =>{

     const {id} = request.params /* pegando o id do pedido*/

     const index = orders.findIndex(orde => orde.id === id) /* usei o findindex para encontra a posiçao do pedido no array*/

     if (index < 0) {
        return response.status(404).json({error: "order not found"})  /*se o if nao achar o id do pedido ele retorna uma mensagem de erro */
     }

     request.orderIndex = index
     request.orderId = id

     next()
}

const urlMethod = (request, response ,next) =>{

    console.log (request.method)
    console.log(request.url)

    next()

}


/*criando uma rota do tipo post */
app.post('/order',urlMethod, (request, response) => {
    const { orde, clientName, price } = request.body/* quando a chave e o valor tem o mesmo nome o express intendi o codigo dessa forma */

    const status = "Em Preparação" /* criei uma variavel com o e status do pedido*/

    const order = { id: uuid.v4(), orde, clientName, price, status }  /* incluindo o id e status no pedido*/


    orders.push(order) /* colocando o pedido no meu array*/

    return response.status(201).json(order)

})


/*criando uma rota do tipo get */
app.get('/order', urlMethod, (request, response) => {

    return response.json(orders) /*recebe todos os pedidos feito*/

})


/*criando uma rota do tipo get */
app.put('/order/:id',checkOrders, urlMethod, (request, response) => {
    
    const { orde, clientName, price } = request.body  /*pegando as informações do pedido*/

    const id = request.orderId /*varialvel com as informaçoes do meu id vindo atraves do meu middlewares pelo request  */

    const index = request.orderIndex /*varialvel com as informaçoes do meu index vindo atraves do meu middlewares  */

    

    const status = "Em Preparação"  /* incluindo o status do pedido*/
    const changeOrder = { id, orde, clientName, price, status } /*incluindo  atualizado do pedido*/

    
    orders[index] = changeOrder /* pedido atualizado */


    return response.json(changeOrder)

})


app.delete('/order/:id',checkOrders, urlMethod, (request, response) => {


    const index = request.orderIndex /*varialvel com as informaçoes do meu index vindo atraves do meu middlewares  */
   
    orders.splice(index, 1) /* o splice foi utilizado para excluir um item do meu array */

    return response.status(204).json()

})

/*criando uma rota do tipo get */
app.get('/order/:id',checkOrders, urlMethod, (request, response) => {

    const index = request.orderIndex /*varialvel com as informaçoes do meu index vindo atraves do meu middlewares  */

    const order = orders[index] /* variavel para buscar meu pedido dentro do array */

    return response.status(201).json(order)

})


app.patch('/order/:id',checkOrders, urlMethod, (request, response) => {

    const id = request.orderId /*varialvel com as informaçoes do meu id vindo atraves do meu middlewares pelo request  */

    const index = request.orderIndex /*varialvel com as informaçoes do meu index vindo atraves do meu middlewares  */


    const orderReady = {
        id, orde: orders[index].orde, clientName: orders[index].clientName,
        price: orders[index].price, status: "Pronto"
    } /* variavel para mudar o status do pedido */

    orders[index] = orderReady  

    return response.json(orderReady)
})





app.listen(port, () => {
    console.log(`🚀server started on port ${port} 🚀`)
})/*listem aceita um segundo paramento crie uma funçao para quando meu servidor começao a rodar chegar uma mensagem*/