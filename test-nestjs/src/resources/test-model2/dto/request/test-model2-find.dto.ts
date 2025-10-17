import { PickType } from "@nestjs/swagger";
import { TestModel2Model } from "../../models/test-model2.model";
import {
  ITestModel2FindUnique,
  ITestModel2FindMany,
} from "../../test-model2.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class TestModel2FindUniqueDto
  extends PickType(TestModel2Model, ["id"])
  implements ITestModel2FindUnique {}

/** List */
export class TestModel2FindManyDto
  extends createPaginationDto([CREATED_AT])
  implements ITestModel2FindMany {}

