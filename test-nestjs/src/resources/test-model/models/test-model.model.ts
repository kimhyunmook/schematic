import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsDate, IsBoolean, IsNumber, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { $Enums, TestModel } from "@prisma/client";

export class TestModelModel implements TestModel {


  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  id: string;

  @ApiProperty({ description: '', type: String, nullable: false })
  @IsString()
  name: string;

  @ApiProperty({ description: '', type: String, nullable: true })
  @IsOptional()
  @IsString()
  email: string | null;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: '', type: Date, nullable: false })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;


}

