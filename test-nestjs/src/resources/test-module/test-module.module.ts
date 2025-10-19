import { Module } from "@nestjs/common";
import { TestModuleService } from "./test-module.service";
import { TestModuleController } from "./controllers/test-module.controller";

@Module({
  controllers: [TestModuleController],
  providers: [TestModuleService],
  exports: [TestModuleService],
})
export class TestModuleModule {}

