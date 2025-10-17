import { Injectable } from "@nestjs/common";
import {
  ITestModel3Create,
  ITestModel3FindUnique,
  ITestModel3FindMany,
  ITestModel3Update,
} from "./test-model3.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class TestModel3Service extends CommonService {
  public static readonly MODULE_NAME = "TestModule";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: TestModel3Service.MODULE_NAME });
  }

  async create(data: ITestModel3Create) {
    return this.prisma.testModel3.create({ data });
  }

  async findUnique(data: ITestModel3FindUnique) {
    return this.prisma.testModel3.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: ITestModel3FindMany) {
    const option: Prisma.TestModel3FindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.testModel3.findMany(option),
      this.prisma.testModel3.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: ITestModel3Update) {
    const { id, ...rest } = data;
    return this.prisma.testModel3.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.testModel3.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

