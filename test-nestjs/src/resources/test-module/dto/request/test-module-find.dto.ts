import { PickType } from "@nestjs/swagger";
import { TestModuleModel } from "../../models/test-module.model";
import {
  ITestModuleFindUnique,
  ITestModuleFindMany,
} from "../../test-module.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class TestModuleFindUniqueDto
  extends PickType(TestModuleModel, ["id"])
  implements ITestModuleFindUnique {}

/** List */
export class TestModuleFindManyDto
  extends createPaginationDto([CREATED_AT])
  implements ITestModuleFindMany {}

