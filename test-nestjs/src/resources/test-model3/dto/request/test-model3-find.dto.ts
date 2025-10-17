import { PickType } from "@nestjs/swagger";
import { TestModel3Model } from "../../models/test-model3.model";
import {
  ITestModel3FindUnique,
  ITestModel3FindMany,
} from "../../test-model3.interface";
import { createPaginationDto } from "src/common/helpers/find-pagination.dto";
import { CREATED_AT } from "src/common/enums/created-at.enum";

/** Unique */
export class TestModel3FindUniqueDto
  extends PickType(TestModel3Model, ["id"])
  implements ITestModel3FindUnique {}

/** List */
export class TestModel3FindManyDto
  extends createPaginationDto([CREATED_AT])
  implements ITestModel3FindMany {}

