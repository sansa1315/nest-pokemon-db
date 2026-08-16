import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>
    ) {}
    async createPokemon(createPokemonDto: CreatePokemonDto) {
        try {
            const pokemon = await this.pokemonModel.create(createPokemonDto);
            return `Pokemon ${pokemon.name} created successfully`;
            
        } catch (error: any) {
            if(error?.code === 11000) {
                throw new BadRequestException(`Pokemon with ${JSON.stringify(error.keyValue)} already exists`);
            }
            console.log(error);
            throw new InternalServerErrorException(`Pokemon with name ${createPokemonDto.name} already exists`);
        }
    }

    async findOneBy(term: string) {
        let pokemon: Pokemon | null;
        if(!isNaN(+term)) {
            pokemon = await this.pokemonModel.findOne({ no: +term });
        } else {
            pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
        }
        if(!pokemon) {
            throw new BadRequestException(`Pokemon with ${term} not found`);
        }
        return pokemon;

    }

    async update(term: string, updatePokemonDto: UpdatePokemonDto) {
        const pokemon = await this.findOneBy(term);
        if(updatePokemonDto.name) {
            updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
        }
        try {
            await pokemon.updateOne(updatePokemonDto);
            return {...pokemon.toJSON(), ...updatePokemonDto};
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(`Pokemon with name ${updatePokemonDto.name} already exists`);
        }
    }

    async delete(term: string) {
        // const pokemon = await this.findOneBy(term);
        // await pokemon.deleteOne();
        // return `Pokemon ${pokemon.name} deleted successfully`;
    }

    async findAll() {
        return this.pokemonModel.find();
    }
}
