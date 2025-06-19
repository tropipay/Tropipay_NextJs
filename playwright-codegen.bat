@echo off
node --trace-warnings --loader ts-node/esm __e2e__/utils/codegen.ts
