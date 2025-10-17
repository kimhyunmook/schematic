import { TestModel2CreateDto } from "./dto/request/test-model2-create.dto";
import { TestModel2FindManyDto, TestModel2FindUniqueDto } from "./dto/request/test-model2-find.dto";
import { TestModel2UpdateDto } from "./dto/request/test-model2-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type ITestModel2Create = TestModel2CreateDto;

/** Find */
export type ITestModel2FindUnique = TestModel2FindUniqueDto;

export type ITestModel2FindMany = TestModel2FindManyDto;

/** Update */
export type ITestModel2Update = TestModel2UpdateDto;

