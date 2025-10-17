import { Module } from "@nestjs/common";
import { TestModelService } from "./test-model.service";
import { TestModelController } from "./controllers/test-model.controller";

@Module({
  controllers: [TestModelController],
  providers: [TestModelService],
  exports: [TestModelService],
})
export class TestModelModule {}

