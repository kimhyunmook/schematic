import { PickType } from "@nestjs/swagger";
import { TestModelModel } from "../../models/test-model.model";
import {
  ITestModelFindUnique,
  ITestModelFindMany,
} from "../../test-model.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class TestModelFindUniqueDto
  extends PickType(TestModelModel, ["id"])
  implements ITestModelFindUnique {}

/** List */
export class TestModelFindManyDto
  extends createPaginationDto([CREATED_AT])
  implements ITestModelFindMany {}

