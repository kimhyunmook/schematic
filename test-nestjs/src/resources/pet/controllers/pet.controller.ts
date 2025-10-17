import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { PetService } from "../pet.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { PetCreateDto } from "../dto/request/pet-create.dto";
import { PetUpdateDto } from "../dto/request/pet-update.dto";
import { PetFindManyDto } from "../dto/request/pet-find.dto";
import {
  PetFindManyResponseDto,
  PetFindUniqueResponseDto,
} from "../dto/response/pet-find-response.dto";

@ApiController("pet")
export class PetController extends CommonController {
  constructor(private readonly service: PetService) {
    super(PetService.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${PetService.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PetFindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${PetService.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: PetFindManyDto,
  ): Promise<PetFindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${PetService.MODULE_NAME} 생성` })
  async create(@Body() body: PetCreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${PetService.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: PetUpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${PetService.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

