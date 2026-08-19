import { Get, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponseInterface } from './interfaces/pokemon-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';


@Injectable()
export class SeedService {  

  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
) {}
  
  async create() {
    try {
        
        const data = await this.http.get<PokemonResponseInterface>(
            'https://pokeapi.co/api/v2/pokemon?limit=650'
        );

        const seedData = data.results.map(({ name, url }) => {
            const number = url.split('/').filter(Boolean).at(-1);
            return {
                name,
                no: +number!,
            };
        });

        // for (const pokemon of seedData) {
        //     await this.pokemonService.createPokemon(pokemon);
        // }

        await this.pokemonService.fillWithSeed(seedData);

        return seedData;

    } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Something went wrong seeding the pokemons - check server logs');
    }
}

  
}
