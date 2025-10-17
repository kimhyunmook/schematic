import { Injectable } from "@nestjs/common";
import {
  IAnimalCreate,
  IAnimalFindUnique,
  IAnimalFindMany,
  IAnimalUpdate,
} from "./animal.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class AnimalService extends CommonService {
  public static readonly MODULE_NAME = "Animal";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: AnimalService.MODULE_NAME });
  }

  async create(data: IAnimalCreate) {
    return this.prisma.animal.create({ data });
  }

  async findUnique(data: IAnimalFindUnique) {
    return this.prisma.animal.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: IAnimalFindMany) {
    const option: Prisma.AnimalFindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.animal.findMany(option),
      this.prisma.animal.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: IAnimalUpdate) {
    const { id, ...rest } = data;
    return this.prisma.animal.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.animal.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

