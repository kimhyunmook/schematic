#!/usr/bin/env node

import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('🚀 NestJS CRUD 모듈 생성기');
        console.log('');
        console.log('사용법: schematic <모델명>');
        console.log('');
        console.log('예시:');
        console.log('  schematic User      # User CRUD 모듈 생성');
        console.log('  schematic Product   # Product CRUD 모듈 생성');
        console.log('');
        console.log('도움말: schematic --help');
        return;
    }

    const command = args[0];

    if (command === 'help' || command === '--help' || command === '-h') {
        console.log('🚀 NestJS CRUD 모듈 생성기');
        console.log('');
        console.log('사용법: schematic <모델명>');
        console.log('');
        console.log('예시:');
        console.log('  schematic User      # User CRUD 모듈 생성');
        console.log('  schematic Product   # Product CRUD 모듈 생성');
        console.log('');
        console.log('설명:');
        console.log('  지정된 모델명으로 NestJS CRUD 모듈을 자동 생성합니다.');
        console.log('  Controller, Service, Module, DTO, Model 파일들이 생성됩니다.');
        return;
    }

    // 모델명을 직접 첫 번째 인자로 받음 (generate 명령어 제거)
    const modelName = command;

    // Check if we're in a NestJS project
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
        console.error('❌ 오류: package.json 파일을 찾을 수 없습니다.');
        console.log('   NestJS 프로젝트 디렉토리에서 실행해주세요.');
        process.exit(1);
    }

    try {
        const packageJson = require(packageJsonPath);
        if (!packageJson.dependencies || !packageJson.dependencies['@nestjs/core']) {
            console.error('❌ 오류: NestJS 프로젝트가 아닙니다.');
            console.log('   @nestjs/core 의존성을 찾을 수 없습니다.');
            process.exit(1);
        }
    } catch (error) {
        console.error('❌ 오류: package.json 파일을 읽을 수 없습니다.');
        process.exit(1);
    }

    // Get the schematic collection path
    const collectionPath = join(__dirname, '../collection.json');

    try {
        console.log(`🔄 ${modelName} CRUD 모듈을 생성하고 있습니다...`);

        // Run the schematic using Angular CLI
        const command = `npx @angular-devkit/schematics-cli ${collectionPath}:crud --name=${modelName} --dry-run=false`;
        execSync(command, {
            stdio: 'inherit',
            cwd: process.cwd()
        });

        console.log(`✅ ${modelName} CRUD 모듈이 성공적으로 생성되었습니다!`);
        console.log('');
        console.log('생성된 파일들:');
        console.log(`  - ${modelName?.toLowerCase()}.controller.ts`);
        console.log(`  - ${modelName?.toLowerCase()}.service.ts`);
        console.log(`  - ${modelName?.toLowerCase()}.module.ts`);
        console.log(`  - ${modelName?.toLowerCase()}.interface.ts`);
        console.log(`  - ${modelName?.toLowerCase()}.model.ts`);
        console.log(`  - dto/ (request/response 폴더 포함)`);
    } catch (error) {
        console.error('❌ CRUD 모듈 생성 중 오류가 발생했습니다:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main();
