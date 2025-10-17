import { Injectable } from "@nestjs/common";
import {
  IPetCreate,
  IPetFindUnique,
  IPetFindMany,
  IPetUpdate,
} from "./pet.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class PetService extends CommonService {
  public static readonly MODULE_NAME = "pet";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: PetService.MODULE_NAME });
  }

  async create(data: IPetCreate) {
    return this.prisma.pet.create({ data });
  }

  async findUnique(data: IPetFindUnique) {
    return this.prisma.pet.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: IPetFindMany) {
    const option: Prisma.PetFindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.pet.findMany(option),
      this.prisma.pet.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: IPetUpdate) {
    const { id, ...rest } = data;
    return this.prisma.pet.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.pet.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

