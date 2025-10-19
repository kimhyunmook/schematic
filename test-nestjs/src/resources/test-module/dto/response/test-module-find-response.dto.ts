import { OmitType } from "@nestjs/swagger";
import { TestModuleModel } from "../../models/test-module.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class TestModuleResponseData extends OmitType(TestModuleModel, []) {}

/** Unique */
export class TestModuleFindUniqueResponseDto extends ResponseDto {
  data: TestModuleResponseData;
}

/** List */
export class TestModuleFindManyResponseDto extends ListResponseDto {
  data: TestModuleResponseData[];
}

