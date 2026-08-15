import { Type } from "class-transformer";
import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    @IsString()    
    @MinLength(1)
    name!: string;

    @Type(() => Number)
    @IsPositive()
    @IsInt()
    @Min(1)
    no!: number;
}