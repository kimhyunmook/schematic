import { TestModelCreateDto } from "./dto/request/test-model-create.dto";
import { TestModelFindManyDto, TestModelFindUniqueDto } from "./dto/request/test-model-find.dto";
import { TestModelUpdateDto } from "./dto/request/test-model-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type ITestModelCreate = TestModelCreateDto;

/** Find */
export type ITestModelFindUnique = TestModelFindUniqueDto;

export type ITestModelFindMany = TestModelFindManyDto;

/** Update */
export type ITestModelUpdate = TestModelUpdateDto;

