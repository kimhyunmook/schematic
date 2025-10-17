import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsDate, IsBoolean, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { $Enums, TestModel2 } from "@prisma/client";

export class TestModel2Model implements TestModel2 {


  @ApiProperty({ description: '', type: Number, nullable: false })
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  email: string;

  @ApiProperty({ description: '', type: String, nullable: true })
  @IsOptional()
  @IsString()
  name: string | null;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;


}

