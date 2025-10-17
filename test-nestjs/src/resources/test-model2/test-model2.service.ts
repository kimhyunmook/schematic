import { Injectable } from "@nestjs/common";
import {
  ITestModel2Create,
  ITestModel2FindUnique,
  ITestModel2FindMany,
  ITestModel2Update,
} from "./test-model2.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class TestModel2Service extends CommonService {
  public static readonly MODULE_NAME = "TestModel2";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: TestModel2Service.MODULE_NAME });
  }

  async create(data: ITestModel2Create) {
    return this.prisma.testModel2.create({ data });
  }

  async findUnique(data: ITestModel2FindUnique) {
    return this.prisma.testModel2.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: ITestModel2FindMany) {
    const option: Prisma.TestModel2FindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.testModel2.findMany(option),
      this.prisma.testModel2.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: ITestModel2Update) {
    const { id, ...rest } = data;
    return this.prisma.testModel2.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.testModel2.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

