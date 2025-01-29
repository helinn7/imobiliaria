import {randomUUID} from "node:crypto"
export class DatabaseMemory{
    #livros = new Map()
    // criando livro
    create(livro){
        const livroId = randomUUID()
        this.#livros.set(livroId, livro)
    }
    // Atualizar livro
    update(id, livro){
        this.#livros.set(id, livro)
    }
    getByID(id){
        return this.#livros.get(id)
    }
    list(search){
        return Array.from(this.#livros.entries()).map((livroArray) => {
            //primeira posição ID
            const id = livroArray[0]
            //segunda posição
            const data = livroArray[1]

            return{
                id,
                ...data
            }
        })
        // retornando apenas o resultado da pesquisa
        .filter(livro => {
            if(search){
                return livro.titulo.includes(search)
            }
            return true
        })
    }
    delete(id){
        this.#livros.delete(id)
    }
}