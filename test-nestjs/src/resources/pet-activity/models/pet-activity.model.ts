import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsDate, IsBoolean, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { $Enums, PetActivity } from "@prisma/client";

export class PetActivityModel implements PetActivity {


  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  id: string;

  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  petId: string;

  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  activityType: string;

  @ApiProperty({ description: '', type: String, nullable: true })
  @IsOptional()
  @IsString()
  description: string | null;

  @ApiProperty({ description: 'minutes', type: Number, nullable: true })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  duration: number | null;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;


}

