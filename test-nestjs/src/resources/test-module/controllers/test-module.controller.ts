import { Body, Param, ParseIntPipe, Query } from "@nestjs/common";
import { TestModuleService } from "../test-module.service";
import { NumberIdOnlyResponseDto, NullDataResponseDto } from "src/common/dto/response.dto";
import { CommonController } from "src/common/utils/common.controller";
import { ApiController } from "src/common/decorators/api-controller.decorator";
import { ApiDocs } from "src/common/decorators/api-docs-option.decorator";
import { TestModuleCreateDto } from "../dto/request/test-module-create.dto";
import { TestModuleUpdateDto } from "../dto/request/test-module-update.dto";
import { TestModuleFindManyDto } from "../dto/request/test-module-find.dto";
import {
  TestModuleFindManyResponseDto,
  TestModuleFindUniqueResponseDto,
} from "../dto/response/test-module-find-response.dto";

@ApiController("test-module")
export class TestModuleController extends CommonController {
  constructor(private readonly service: TestModuleService) {
    super(TestModuleService.MODULE_NAME);
  }

  @ApiDocs({ endpoint: ":id", summary: `${TestModuleService.MODULE_NAME} 상세 조회` })
  async findUnique(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TestModuleFindUniqueResponseDto> {
    const res = await this.service.findUnique({ id });
    return this.responseData(this.FIND_UNIQUE, res);
  }

  @ApiDocs({ summary: `${TestModuleService.MODULE_NAME} 목록 조회` })
  async findMany(
    @Query() query: TestModuleFindManyDto,
  ): Promise<TestModuleFindManyResponseDto> {
    const { resources, meta } = await this.service.findMany(query);
    return this.responseData(this.FIND_MANY, resources, meta);
  }

  @ApiDocs({ method: "POST", summary: `${TestModuleService.MODULE_NAME} 생성` })
  async create(@Body() body: TestModuleCreateDto): Promise<NumberIdOnlyResponseDto> {
    const { id } = await this.service.create(body);
    return this.responseData(this.CREATE, { id });
  }

  @ApiDocs({ method: "PATCH", endpoint: ":id", summary: `${TestModuleService.MODULE_NAME} 수정` })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: TestModuleUpdateDto,
  ): Promise<NullDataResponseDto> {
    await this.service.update({ ...body, id });
    return this.responseData(this.UPDATE);
  }

  @ApiDocs({ method: "DELETE", endpoint: ":id", summary: `${TestModuleService.MODULE_NAME} 삭제` })
  async softDelete(@Param("id") id: number): Promise<NullDataResponseDto> {
    await this.service.softDelete(id);
    return this.responseData(this.DELETE);
  }
}

