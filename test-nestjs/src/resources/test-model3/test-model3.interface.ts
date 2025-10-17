import { TestModel3CreateDto } from "./dto/request/test-model3-create.dto";
import { TestModel3FindManyDto, TestModel3FindUniqueDto } from "./dto/request/test-model3-find.dto";
import { TestModel3UpdateDto } from "./dto/request/test-model3-update.dto";

/**
 * Service layer interfaces
 * 서비스 계층에서 사용하는 순수 타입 정의
 * DTO와 독립적으로 비즈니스 로직 계층의 계약 정의
 */

/** Create */
export type ITestModel3Create = TestModel3CreateDto;

/** Find */
export type ITestModel3FindUnique = TestModel3FindUniqueDto;

export type ITestModel3FindMany = TestModel3FindManyDto;

/** Update */
export type ITestModel3Update = TestModel3UpdateDto;

