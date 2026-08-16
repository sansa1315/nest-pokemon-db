import { Get, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokemonResponseInterface } from './interfaces/pokemon-response.interface';


@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  
  async create() {
    try {
        const { data } = await this.axios.get<PokemonResponseInterface>(
            'https://pokeapi.co/api/v2/pokemon?limit=650'
        );

        const seedData = data.results.map(({ name, url }) => {
            const number = url.split('/').filter(Boolean).at(-1);
            return {
                name,
                no: +number!,
            };
        });

        return seedData;

    } catch (error) {
        console.log(error);
        throw new InternalServerErrorException('Something went wrong seeding the pokemons - check server logs');
    }
}

  
}
