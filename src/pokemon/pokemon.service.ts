import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
    private defaultLimit: number
    private defaultOffset: number
    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly configService: ConfigService
    ) {
        this.defaultLimit = this.configService.get<number>('DEFAULT_LIMIT')!;
        this.defaultOffset = this.configService.get<number>('DEFAULT_OFFSET')!;
    }
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

    async findAll( paginationDto : PaginationDto ) {
        const { limit = this.defaultLimit || 10, offset = this.defaultOffset || 0 } = paginationDto;
        return this.pokemonModel.find()
            .limit(limit)
            .skip(offset)
            .sort({ no: 1 })
            .select('-__v');
    }

    async fillWithSeed(seed) {        
        await this.pokemonModel.deleteMany({}); //borramos todos
        await this.pokemonModel.insertMany(seed);
    }
}
