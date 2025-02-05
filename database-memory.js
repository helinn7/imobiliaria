import { randomUUID } from "node:crypto";

export class DatabaseMemory {
    #imoveis = new Map();

    // Cria um novo imóvel e armazena no banco de dados em memória
    create(imovel) {
        const imovelId = randomUUID(); // Gera um identificador único para o imóvel
        this.#imoveis.set(imovelId, imovel); // Adiciona o imóvel ao mapa com o ID gerado
    }

    // Atualiza completamente os dados de um imóvel existente
    update(id, imovel) {
        this.#imoveis.set(id, imovel); // Sobrescreve o imóvel com os novos dados fornecidos
    }

    // Busca um imóvel específico pelo seu ID
    getByID(id) {
        return this.#imoveis.get(id); // Retorna o imóvel correspondente ao ID ou undefined se não encontrado
    }

    // Lista todos os imóveis com a opção de aplicar um filtro por endereço ou tipo
    list(search) {
        return Array.from(this.#imoveis.entries()).map((imovelArray) => {
            const id = imovelArray[0]; // Primeira posição: ID do imóvel
            const data = imovelArray[1]; // Segunda posição: Dados do imóvel

            return {
                id,
                ...data
            };
        })
        // Filtra os imóveis com base no valor de pesquisa, se fornecido
        .filter(imovel => {
            if (search) {
                return imovel.endereco.includes(search) || imovel.tipo.includes(search);
            }
            return true; // Retorna todos os imóveis caso não haja filtro
        });
    }

    // Remove um imóvel do banco de dados em memória pelo seu ID
    delete(id) {
        this.#imoveis.delete(id); // Exclui o imóvel associado ao ID fornecido
    }
}