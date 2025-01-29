// Importando Fastify
import { fastify } from "fastify";
// Importando database
import { DatabaseMemory } from "./database-memory.js";

// Criando o Database
const database = new DatabaseMemory();

// Criando servidor
const server = fastify();

// Criando um livro
server.post('/livro', (request, reply) => {
    const { titulo, autor, npaginas, editora } = request.body;

    database.create({
        titulo: titulo,
        autor: autor,
        npaginas: npaginas,
        editora: editora
    });

    return reply.status(201).send();
});

// Lendo livros cadastrados com filtro opcional
server.get('/livros', (request) => {
    const search = request.query.search;
    const livros = database.list(search);
    return { livros };
});

// Atualiza livro totalmente
server.put('/livros/:id', (request, reply) => {
    const livroId = request.params.id;
    const { titulo, autor, npaginas, editora } = request.body;

    database.update(livroId, {
        titulo: titulo,
        autor: autor,
        npaginas: npaginas,
        editora: editora
    });

    return reply.status(204).send();
});

// Atualiza livro parcialmente
server.patch('/livros/:id', (request, reply) => {
    const livroId = request.params.id;
    const update = request.body;

    const livroExistente = database.getByID(livroId);

    if (!livroExistente) {
        return reply.status(404).send({ error: "Livro não encontrado" });
    }

    const novoLivro = { ...livroExistente, ...update };

    database.update(livroId, novoLivro);

    return reply.status(204).send();
});

// Exclui livro
server.delete('/livros/:id', (request, reply) => {
    const livroId = request.params.id;
    database.delete(livroId);
    return reply.status(204).send();
});

// Criando o servidor na porta 3333
server.listen({ port: 3333 }, () => {
    console.log("Servidor rodando em http://localhost:3333");
});
