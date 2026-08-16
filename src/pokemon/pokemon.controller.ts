import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { PokemonService } from './pokemon.service';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}
    

    @Post()
    create(@Body() createPokemonDto: CreatePokemonDto) {
        return this.pokemonService.createPokemon(createPokemonDto);
    }

    @Get()
    findAll() {
        return this.pokemonService.findAll();
    }

    @Get(':term')
    findOne(@Param('term') term: string) {
        return this.pokemonService.findOneBy(term);
    }

    @Put(':term')
    update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
        return this.pokemonService.update(term, updatePokemonDto);
    } 

    @Delete(':term')
    remove(@Param('term', ParseMongoIdPipe) term: string) {
        console.log("entro aki")
        // return this.pokemonService.delete();
    }

}
