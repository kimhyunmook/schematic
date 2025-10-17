import { OmitType } from "@nestjs/swagger";
import { AnimalModel } from "../../models/animal.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class AnimalResponseData extends OmitType(AnimalModel, []) {}

/** Unique */
export class AnimalFindUniqueResponseDto extends ResponseDto {
  data: AnimalResponseData;
}

/** List */
export class AnimalFindManyResponseDto extends ListResponseDto {
  data: AnimalResponseData[];
}

