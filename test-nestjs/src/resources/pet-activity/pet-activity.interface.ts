import { PetActivityCreateDto } from "./dto/request/pet-activity-create.dto";
import { PetActivityFindManyDto, PetActivityFindUniqueDto } from "./dto/request/pet-activity-find.dto";
import { PetActivityUpdateDto } from "./dto/request/pet-activity-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type IPetActivityCreate = PetActivityCreateDto;

/** Find */
export type IPetActivityFindUnique = PetActivityFindUniqueDto;

export type IPetActivityFindMany = PetActivityFindManyDto;

/** Update */
export type IPetActivityUpdate = PetActivityUpdateDto;

