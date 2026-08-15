import { Body, Controller, Post } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}
    

    @Post()
    create(@Body() createPokemonDto: CreatePokemonDto) {
        return this.pokemonService.createPokemon(createPokemonDto);
    }

}
