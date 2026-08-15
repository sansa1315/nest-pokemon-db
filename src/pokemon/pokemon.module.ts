import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
    controllers: [PokemonController],
    providers: [PokemonService],
    imports: [
        MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }])
    ]
})
export class PokemonModule {

}
