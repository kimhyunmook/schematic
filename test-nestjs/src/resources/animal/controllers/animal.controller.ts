import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { AnimalService } from "../animal.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { AnimalCreateDto } from "../dto/request/animal-create.dto";
import { AnimalUpdateDto } from "../dto/request/animal-update.dto";
import { AnimalFindManyDto } from "../dto/request/animal-find.dto";
import {
  AnimalFindManyResponseDto,
  AnimalFindUniqueResponseDto,
} from "../dto/response/animal-find-response.dto";

@ApiController("animal")
export class AnimalController extends CommonController {
  constructor(private readonly service: AnimalService) {
    super(AnimalService.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${AnimalService.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<AnimalFindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${AnimalService.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: AnimalFindManyDto,
  ): Promise<AnimalFindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${AnimalService.MODULE_NAME} 생성` })
  async create(@Body() body: AnimalCreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${AnimalService.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: AnimalUpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${AnimalService.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

