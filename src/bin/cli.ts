#!/usr/bin/env node

import { execSync } from "child_process";
import { join } from "path";
import { existsSync } from "fs";
import { config as loadEnv } from "dotenv";
import chalk from "chalk";

// .env 파일 로드 (있으면)
loadEnv();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      chalk.cyan.bold("\n🚀 NestJS CRUD 모듈 생성기") +
      chalk.gray(" (Enhanced v2.0)")
    );
    console.log("");
    console.log(
      chalk.white("사용법:") + chalk.yellow(" schematic <모델명> [도메인] [옵션]")
    );
    console.log(chalk.dim("       또는: ") + chalk.yellow("crud <모델명> [도메인] [옵션]"));
    console.log("");
    console.log(chalk.white("예시:"));
    console.log(
      chalk.gray("  schematic User              ") +
      chalk.dim("# User CRUD 모듈 생성 (기본 default 도메인)")
    );
    console.log(
      chalk.gray("  crud Product default        ") +
      chalk.dim("# default 도메인으로 생성")
    );
    console.log(
      chalk.gray("  crud Order custom           ") +
      chalk.dim("# custom 도메인으로 생성")
    );
    console.log("");
    console.log(chalk.white("옵션:"));
    console.log(
      chalk.yellow("  --path") +
      chalk.gray("=<경로>              생성할 경로 지정 ") +
      chalk.dim("(기본: src/resources)")
    );
    console.log(
      chalk.yellow("  --prismaPath") +
      chalk.gray("=<경로>        Prisma 스키마 경로 ") +
      chalk.dim("(기본: prisma/schema.prisma)")
    );
    console.log("");
    console.log(chalk.white("도메인:"));
    console.log(
      chalk.magenta("  사용 가능: default, custom 등 ") + chalk.dim("(기본: default)")
    );
    console.log("");
    console.log(chalk.gray("도움말: ") + chalk.cyan("schematic --help"));
    return;
  }

  const command = args[0];

  if (command === "help" || command === "--help" || command === "-h") {
    console.log(
      chalk.cyan.bold("\n🚀 NestJS CRUD 모듈 생성기") +
      chalk.gray(" (Enhanced v2.0)")
    );
    console.log("");
    console.log(chalk.blue("도메인별 템플릿 지원 & 환경변수 설정 가능"));
    console.log("");
    console.log(
      chalk.white("사용법:") + chalk.yellow(" schematic <모델명> [도메인] [옵션]")
    );
    console.log(chalk.dim("       또는: ") + chalk.yellow("crud <모델명> [도메인] [옵션]"));
    console.log("");
    console.log(chalk.white("예시:"));
    console.log(
      chalk.gray("  schematic User                  ") +
      chalk.dim("# 기본 default 도메인")
    );
    console.log(
      chalk.gray("  crud Product default            ") + chalk.dim("# default 도메인")
    );
    console.log(
      chalk.gray("  crud Order custom               ") + chalk.dim("# custom 도메인")
    );
    console.log(chalk.gray("  crud Payment default --path=src/api"));
    console.log("");
    console.log(chalk.white("옵션:"));
    console.log(
      chalk.yellow("  --path") +
      chalk.gray("=<경로>              생성할 경로 지정")
    );
    console.log(
      chalk.yellow("  --prismaPath") +
      chalk.gray("=<경로>        Prisma 스키마 파일 경로")
    );
    console.log("");
    console.log(chalk.white("도메인:"));
    console.log(
      chalk.magenta("  사용 가능: default, custom 등 ") + chalk.dim("(기본: default)")
    );
    console.log("");
    console.log(chalk.white.bold("특징:"));
    console.log(chalk.green("  ✅ 도메인별 템플릿 지원"));
    console.log(chalk.green("  ✅ 환경변수 설정 (.env)"));
    console.log(chalk.green("  ✅ 자동 app.module.ts 업데이트"));
    console.log(chalk.green("  ✅ Prettier 자동 포맷팅"));
    console.log(chalk.green("  ✅ 향상된 Prisma 파일 검색"));
    console.log("");
    console.log(
      chalk.dim("Alias: ") +
      chalk.cyan("crud") +
      chalk.dim(" (짧은 버전)")
    );
    console.log("");
    return;
  }

  // 모델명을 직접 첫 번째 인자로 받음
  const modelName = command;

  // 두 번째 인자가 도메인인지 확인 (--로 시작하지 않으면 도메인)
  let domain: string | undefined = undefined;
  let optionStartIndex = 1;

  if (args.length > 1 && args[1] && !args[1].startsWith("--")) {
    domain = args[1];
    optionStartIndex = 2;
  }

  // 나머지 인자에서 옵션 파싱
  const options: Record<string, string> = {};
  for (let i = optionStartIndex; i < args.length; i++) {
    const arg = args[i];
    if (arg?.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      if (key && value) {
        options[key] = value;
      }
    }
  }

  // .env에서 기본값 가져오기 (CLI 인자가 없을 때만)
  if (!domain && process.env["SC_DEFAULT_DOMAIN"]) {
    domain = process.env["SC_DEFAULT_DOMAIN"];
  }

  if (!options["path"] && process.env["SC_DEFAULT_PATH"]) {
    options["path"] = process.env["SC_DEFAULT_PATH"];
  }

  // Check if we're in a NestJS project
  const packageJsonPath = join(process.cwd(), "package.json");
  if (!existsSync(packageJsonPath)) {
    console.error(
      chalk.red.bold("\n❌ 오류:") +
      chalk.red(" package.json 파일을 찾을 수 없습니다.")
    );
    console.log(
      chalk.yellow("   💡 NestJS 프로젝트 디렉토리에서 실행해주세요.\n")
    );
    process.exit(1);
  }

  try {
    const packageJson = require(packageJsonPath);
    if (
      !packageJson.dependencies ||
      !packageJson.dependencies["@nestjs/core"]
    ) {
      console.error(
        chalk.red.bold("\n❌ 오류:") + chalk.red(" NestJS 프로젝트가 아닙니다.")
      );
      console.log(
        chalk.yellow("   💡 @nestjs/core 의존성을 찾을 수 없습니다.\n")
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      chalk.red.bold("\n❌ 오류:") +
      chalk.red(" package.json 파일을 읽을 수 없습니다.\n")
    );
    process.exit(1);
  }

  // Get the schematic collection path
  const collectionPath = join(__dirname, "../collection.json");

  try {
    // 로딩 애니메이션
    const dots = [".  ", ".. ", "..."];
    let dotIndex = 0;

    const baseMessage = domain
      ? chalk.cyan.bold(`🔄 ${modelName}`) + chalk.white(" CRUD 모듈을 생성하고 있습니다") + chalk.magenta(` (도메인: ${domain})`)
      : chalk.cyan.bold(`🔄 ${modelName}`) + chalk.white(" CRUD 모듈을 생성하고 있습니다");

    console.log("");
    process.stdout.write(baseMessage + chalk.white(dots[0]));

    const loadingInterval = setInterval(() => {
      dotIndex = (dotIndex + 1) % dots.length;
      process.stdout.write("\r" + baseMessage + chalk.white(dots[dotIndex]));
    }, 300);

    // 애니메이션을 최소 1초 보여주기 위해 setTimeout 사용
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 애니메이션 정지 및 줄바꿈
    clearInterval(loadingInterval);
    process.stdout.write("\r" + " ".repeat(100) + "\r"); // 줄 지우기
    console.log("");

    // Build the schematic command
    let schematicCmd = `npx @angular-devkit/schematics-cli ${collectionPath}:crud-module --name=${modelName}`;

    // Add domain (사용자가 지정했을 때만)
    if (domain) {
      schematicCmd += ` --domain=${domain}`;
    }

    // Add other options
    if (options["path"]) {
      schematicCmd += ` --path=${options["path"]}`;
    }

    if (options["prismaPath"]) {
      schematicCmd += ` --prismaPath=${options["prismaPath"]}`;
    }

    schematicCmd += " --dry-run=false --verbose=false";

    // Run the schematic using Angular CLI
    execSync(schematicCmd, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: {
        ...process.env,
        FORCE_COLOR: "1", // 색상 유지
      },
    });

    console.log("");
    console.log(
      chalk.green.bold(`✅ ${modelName}`) +
      chalk.green(" CRUD 모듈이 성공적으로 생성되었습니다!")
    );
    console.log("");
    console.log(chalk.white.bold("📁 생성된 파일들:"));
    const lowerName = modelName?.toLowerCase();
    console.log(chalk.blue(`  • ${lowerName}.module.ts`));
    console.log(chalk.blue(`  • ${lowerName}.service.ts`));
    console.log(chalk.blue(`  • ${lowerName}.interface.ts (또는 repository/type)`));
    console.log(chalk.blue(`  • ${lowerName}.constant.ts`));
    console.log(chalk.blue(`  • controllers/`));
    console.log(
      chalk.blue(`  • dto/`) +
      chalk.dim(" (create, update, find 및 response 포함)")
    );
    console.log(chalk.blue(`  • models/${lowerName}.model.ts`));
    console.log("");
    console.log(chalk.yellow.bold("✨ 추가 작업 완료:"));
    console.log(chalk.green("  ✅ app.module.ts 자동 업데이트"));
    console.log(chalk.green("  ✅ Prettier 자동 포맷팅"));
    console.log("");
  } catch (error) {
    console.log("");
    console.error(
      chalk.red.bold("❌ CRUD 모듈 생성 중 오류가 발생했습니다:"),
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    console.log("");
    process.exit(1);
  }
}

main();
