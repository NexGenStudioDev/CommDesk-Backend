import fs from "fs";
import path from "path";

export const updateTestJson = (testName: string, status: string) => {
  const filePath = path.join(__dirname, "../../testResults.json");
  let testResults: Record<string, string> = {};

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    testResults = JSON.parse(data) as Record<string, string>;
  }

  testResults[testName] = status;
  fs.writeFileSync(filePath, JSON.stringify(testResults, null, 2));
};
