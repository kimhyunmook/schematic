import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsDate, IsBoolean, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { $Enums, Pet } from "@prisma/client";

export class PetModel implements Pet {


  @ApiProperty({ description: '', type: Number, nullable: false })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  name: string;

  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  species: string;

  @ApiProperty({ description: '', type: String, nullable: true })
  @IsOptional()
  @IsString()
  breed: string | null;

  @ApiProperty({ description: '', type: Number, nullable: true })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  age: number | null;

  @ApiProperty({ description: '', type: Number, nullable: false })
  @IsNumber()
  @Type(() => Number)
  ownerId: number;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;


}

