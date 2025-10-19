import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { PetActivityService } from "../pet-activity.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { PetActivityCreateDto } from "../dto/request/pet-activity-create.dto";
import { PetActivityUpdateDto } from "../dto/request/pet-activity-update.dto";
import { PetActivityFindManyDto } from "../dto/request/pet-activity-find.dto";
import {
  PetActivityFindManyResponseDto,
  PetActivityFindUniqueResponseDto,
} from "../dto/response/pet-activity-find-response.dto";

@ApiController("pet-activity")
export class PetActivityController extends CommonController {
  constructor(private readonly service: PetActivityService) {
    super(PetActivityService.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${PetActivityService.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PetActivityFindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${PetActivityService.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: PetActivityFindManyDto,
  ): Promise<PetActivityFindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${PetActivityService.MODULE_NAME} 생성` })
  async create(@Body() body: PetActivityCreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${PetActivityService.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: PetActivityUpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${PetActivityService.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

