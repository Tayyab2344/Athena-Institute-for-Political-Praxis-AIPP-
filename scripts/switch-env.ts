import fs from "fs";

const mode = process.argv[2];

if (mode !== "test" && mode !== "prod") {
  console.error("Usage: npx tsx scripts/switch-env.ts <test|prod>");
  process.exit(1);
}

const envVarName = mode === "test" ? "AIPP_TEST_DATABASE_URL" : "AIPP_PROD_DATABASE_URL";
const fallbackVarName = mode === "test" ? "TEST_DATABASE_URL" : "PROD_DATABASE_URL";
const targetUrl = process.env[envVarName] || process.env[fallbackVarName];

if (!targetUrl) {
  console.error(`Error: Environment variable ${envVarName} (or ${fallbackVarName}) is not set in process.env.`);
  process.exit(1);
}

if (!fs.existsSync(".env")) {
  console.error("Error: .env file not found.");
  process.exit(1);
}

const envContent = fs.readFileSync(".env", "utf8");
const lines = envContent.split("\n");
let replaced = false;

const newLines = lines.map((line) => {
  if (line.startsWith("DATABASE_URL=")) {
    replaced = true;
    return `DATABASE_URL="${targetUrl}"`;
  }
  return line;
});

if (!replaced) {
  newLines.push(`DATABASE_URL="${targetUrl}"`);
}

fs.writeFileSync(".env", newLines.join("\n"));
console.log(`Switched .env DATABASE_URL to ${mode.toUpperCase()} environment successfully.`);
