import { OmitType } from "@nestjs/swagger";
import { TestModelModel } from "../../models/test-model.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class TestModelResponseData extends OmitType(TestModelModel, []) {}

/** Unique */
export class TestModelFindUniqueResponseDto extends ResponseDto {
  data: TestModelResponseData;
}

/** List */
export class TestModelFindManyResponseDto extends ListResponseDto {
  data: TestModelResponseData[];
}

