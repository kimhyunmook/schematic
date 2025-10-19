import { Injectable } from "@nestjs/common";
import {
  ITestModuleCreate,
  ITestModuleFindUnique,
  ITestModuleFindMany,
  ITestModuleUpdate,
} from "./test-module.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class TestModuleService extends CommonService {
  public static readonly MODULE_NAME = "test-module";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: TestModuleService.MODULE_NAME });
  }

  async create(data: ITestModuleCreate) {
    return this.prisma.testModule.create({ data });
  }

  async findUnique(data: ITestModuleFindUnique) {
    return this.prisma.testModule.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: ITestModuleFindMany) {
    const option: Prisma.TestModuleFindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.testModule.findMany(option),
      this.prisma.testModule.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: ITestModuleUpdate) {
    const { id, ...rest } = data;
    return this.prisma.testModule.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.testModule.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

