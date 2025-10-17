import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { TestModel2Service } from "../test-model2.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { TestModel2CreateDto } from "../dto/request/test-model2-create.dto";
import { TestModel2UpdateDto } from "../dto/request/test-model2-update.dto";
import { TestModel2FindManyDto } from "../dto/request/test-model2-find.dto";
import {
  TestModel2FindManyResponseDto,
  TestModel2FindUniqueResponseDto,
} from "../dto/response/test-model2-find-response.dto";

@ApiController("test-model2")
export class TestModel2Controller extends CommonController {
  constructor(private readonly service: TestModel2Service) {
    super(TestModel2Service.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${TestModel2Service.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TestModel2FindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${TestModel2Service.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: TestModel2FindManyDto,
  ): Promise<TestModel2FindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${TestModel2Service.MODULE_NAME} 생성` })
  async create(@Body() body: TestModel2CreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${TestModel2Service.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: TestModel2UpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${TestModel2Service.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

