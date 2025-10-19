import { Injectable } from "@nestjs/common";
import {
  IPetActivityCreate,
  IPetActivityFindUnique,
  IPetActivityFindMany,
  IPetActivityUpdate,
} from "./pet-activity.interface";
import { PrismaService } from "src/core/prisma/prisma.service";
import { CommonService } from "src/common/utils/common.service";
import { createPaginationOptions } from "src/common/helpers/pagination.helper";
import { Prisma } from "@prisma/client";

@Injectable()
export class PetActivityService extends CommonService {
  public static readonly MODULE_NAME = "pet-activity";

  constructor(private readonly prisma: PrismaService) {
    super({ NAME: PetActivityService.MODULE_NAME });
  }

  async create(data: IPetActivityCreate) {
    return this.prisma.petActivity.create({ data });
  }

  async findUnique(data: IPetActivityFindUnique) {
    return this.prisma.petActivity.findUnique({
      where: {
        ...data,
      },
    });
  }

  async findMany({ page, take, sort, ...rest }: IPetActivityFindMany) {
    const option: Prisma.PetActivityFindManyArgs = {
      where: { ...rest },
      ...createPaginationOptions({ page, take, sort }),
    };

    const [resources, totalCount] = await this.prisma.$transaction([
      this.prisma.petActivity.findMany(option),
      this.prisma.petActivity.count({ where: option.where }),
    ]);

    const meta = this.getMetaData({
      page,
      take,
      totalCount,
    });

    return { resources, meta };
  }

  async update(data: IPetActivityUpdate) {
    const { id, ...rest } = data;
    return this.prisma.petActivity.update({
      where: {
        id,
      },
      data: {
        ...rest,
      },
    });
  }

  async softDelete(id: number) {
    return this.prisma.petActivity.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

