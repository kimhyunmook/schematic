import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { TestModel3Service } from "../test-model3.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { TestModel3CreateDto } from "../dto/request/test-model3-create.dto";
import { TestModel3UpdateDto } from "../dto/request/test-model3-update.dto";
import { TestModel3FindManyDto } from "../dto/request/test-model3-find.dto";
import {
  TestModel3FindManyResponseDto,
  TestModel3FindUniqueResponseDto,
} from "../dto/response/test-model3-find-response.dto";

@ApiController("test-model3")
export class TestModel3Controller extends CommonController {
  constructor(private readonly service: TestModel3Service) {
    super(TestModel3Service.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${TestModel3Service.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TestModel3FindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${TestModel3Service.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: TestModel3FindManyDto,
  ): Promise<TestModel3FindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${TestModel3Service.MODULE_NAME} 생성` })
  async create(@Body() body: TestModel3CreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${TestModel3Service.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: TestModel3UpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${TestModel3Service.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

