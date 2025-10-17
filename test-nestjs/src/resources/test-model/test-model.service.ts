import { Injectable } from "@nestjs/common";
import {
  ITestModelCreate,
  ITestModelFindUnique,
  ITestModelFindMany,
  ITestModelUpdate,
} from "./test-model.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class TestModelService extends CommonService {
  public static readonly MODULE_NAME = "TestModule";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: TestModelService.MODULE_NAME });
  }

  async create(data: ITestModelCreate) {
    return this.prisma.testModel.create({ data });
  }

  async findUnique(data: ITestModelFindUnique) {
    return this.prisma.testModel.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: ITestModelFindMany) {
    const option: Prisma.TestModelFindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.testModel.findMany(option),
      this.prisma.testModel.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: ITestModelUpdate) {
    const { id, ...rest } = data;
    return this.prisma.testModel.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.testModel.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

