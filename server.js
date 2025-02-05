// Importando Fastify
import { fastify } from "fastify";
// Importando database
import { DatabaseMemory } from "./database-memory.js";

// Criando o Database
const database = new DatabaseMemory();

// Criando servidor Fastify
const server = fastify();

// Rota para criar um imóvel
server.post('/imovel', (request, reply) => {
    const { endereco, tipo, area, valor } = request.body; // Recebe os dados do imóvel a partir do corpo da requisição

    database.create({
        endereco: endereco,
        tipo: tipo,
        area: area,
        valor: valor
    }); // Salva o imóvel no banco de dados em memória

    return reply.status(201).send(); // Retorna status de criação bem-sucedida
});

// Rota para listar imóveis cadastrados com filtro opcional
server.get('/imoveis', (request) => {
    const search = request.query.search; // Obtém o parâmetro de pesquisa, se houver
    const imoveis = database.list(search); // Lista os imóveis com base no filtro
    return { imoveis }; // Retorna a lista de imóveis
});

// Rota para atualizar totalmente um imóvel
server.put('/imoveis/:id', (request, reply) => {
    const imovelId = request.params.id; // Obtém o ID do imóvel a partir dos parâmetros da URL
    const { endereco, tipo, area, valor } = request.body; // Obtém os dados atualizados

    database.update(imovelId, {
        endereco: endereco,
        tipo: tipo,
        area: area,
        valor: valor
    }); // Atualiza o imóvel no banco de dados

    return reply.status(204).send(); // Retorna status indicando que a operação foi concluída sem conteúdo adicional
});

// Rota para atualizar parcialmente um imóvel
server.patch('/imoveis/:id', (request, reply) => {
    const imovelId = request.params.id; // Obtém o ID do imóvel a partir dos parâmetros da URL
    const update = request.body; // Obtém os dados a serem atualizados

    const imovelExistente = database.getByID(imovelId); // Busca o imóvel atual pelo ID

    if (!imovelExistente) { // Verifica se o imóvel existe
        return reply.status(404).send({ error: "Imóvel não encontrado" }); // Retorna erro caso não seja encontrado
    }

    const novoImovel = { ...imovelExistente, ...update }; // Atualiza os campos mantendo os dados existentes

    database.update(imovelId, novoImovel); // Salva as alterações no banco de dados

    return reply.status(204).send(); // Retorna status indicando sucesso
});

// Rota para excluir um imóvel
server.delete('/imoveis/:id', (request, reply) => {
    const imovelId = request.params.id; // Obtém o ID do imóvel a partir dos parâmetros da URL
    database.delete(imovelId); // Remove o imóvel do banco de dados
    return reply.status(204).send(); // Retorna status indicando que a operação foi concluída sem conteúdo adicional
});

// Inicia o servidor na porta 3333
server.listen({ port: 3333 }, () => {
    console.log("Servidor rodando em http://localhost:3333"); // Exibe mensagem indicando que o servidor está em execução
});
