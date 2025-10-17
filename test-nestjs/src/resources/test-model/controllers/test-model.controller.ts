import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { TestModelService } from "../test-model.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { TestModelCreateDto } from "../dto/request/test-model-create.dto";
import { TestModelUpdateDto } from "../dto/request/test-model-update.dto";
import { TestModelFindManyDto } from "../dto/request/test-model-find.dto";
import {
  TestModelFindManyResponseDto,
  TestModelFindUniqueResponseDto,
} from "../dto/response/test-model-find-response.dto";

@ApiController("test-model")
export class TestModelController extends CommonController {
  constructor(private readonly service: TestModelService) {
    super(TestModelService.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${TestModelService.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TestModelFindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${TestModelService.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: TestModelFindManyDto,
  ): Promise<TestModelFindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${TestModelService.MODULE_NAME} 생성` })
  async create(@Body() body: TestModelCreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${TestModelService.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: TestModelUpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${TestModelService.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

