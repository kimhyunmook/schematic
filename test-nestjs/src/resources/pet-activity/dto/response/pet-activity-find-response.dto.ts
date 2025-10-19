import { OmitType } from "@nestjs/swagger";
import { PetActivityModel } from "../../models/pet-activity.model";
import { ResponseDto } from "src/common/dto/response.dto";
import { ListResponseDto } from "src/common/dto/list-response.dto";

class PetActivityResponseData extends OmitType(PetActivityModel, []) {}

/** Unique */
export class PetActivityFindUniqueResponseDto extends ResponseDto {
  data: PetActivityResponseData;
}

/** List */
export class PetActivityFindManyResponseDto extends ListResponseDto {
  data: PetActivityResponseData[];
}

