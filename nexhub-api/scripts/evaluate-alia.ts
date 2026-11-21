import "dotenv/config";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import {
  retrieve,
  tokenize,
  localAnalysis,
  generateGemini,
  Topic,
  VERSION,
} from "../src/ai/core";
import { knowledge } from "../src/ai/knowledge";
async function main() {
  const cases = JSON.parse(
    readFileSync(resolve("evaluation/cases.json"), "utf8"),
  );
  const rows = cases.map((c: any) => {
    const ranked = retrieve(c.question),
      filtered = retrieve(c.question, c.topic);
    const words = new Set(tokenize(c.question));
    const baseline = [...knowledge].sort(
      (a, b) =>
        tokenize(b.text + " " + b.title + " " + b.advice).filter((t) =>
          words.has(t),
        ).length -
          tokenize(a.text + " " + a.title + " " + a.advice).filter((t) =>
            words.has(t),
          ).length || a.id.localeCompare(b.id),
    )[0];
    return {
      id: c.id,
      expected: c.expected,
      predicted: ranked[0].id,
      top2: ranked.map((x) => x.id),
      top1: ranked[0].id === c.expected,
      hit2: ranked.some((x) => x.id === c.expected),
      withTopic: filtered[0].id === c.expected,
      baseline: baseline.id === c.expected,
      answer: localAnalysis(c.question, c.topic, null).answer,
    };
  });
  const rate = (key: string) =>
    rows.filter((r: any) => r[key]).length / rows.length;
  const report: any = {
    version: VERSION,
    createdAt: new Date().toISOString(),
    dataset:
      "24 perguntas sintéticas de desenvolvimento, não validação independente",
    corpus: knowledge.length,
    metrics: {
      top1: rate("top1"),
      hitAt2: rate("hit2"),
      top1WithUserTopic: rate("withTopic"),
      keywordBaselineTop1: rate("baseline"),
    },
    acceptance: { targetTop1: 0.75, passed: rate("top1") >= 0.75 },
    cases: rows,
  };
  if (process.argv.includes("--gemini")) {
    if (!process.env.GEMINI_API_KEY)
      throw new Error(
        "Configure GEMINI_API_KEY no ambiente; não registre a chave no relatório.",
      );
    report.gemini = [];
    for (const c of cases.filter(
      (_: unknown, index: number) => index < 12 && index % 2 === 0,
    )) {
      const start = Date.now();
      try {
        const result = await generateGemini(c.question, c.topic as Topic, null);
        report.gemini.push({
          id: c.id,
          ...result,
          durationMs: Date.now() - start,
          humanReview: "PENDENTE",
        });
      } catch {
        report.gemini.push({
          id: c.id,
          error: "Falha na geração ou validação do JSON",
          humanReview: "PENDENTE",
        });
      }
    }
  }
  mkdirSync(resolve("evaluation/results"), { recursive: true });
  const filename = process.argv.includes("--gemini")
    ? "gemini.json"
    : "local.json";
  writeFileSync(
    resolve("evaluation/results", filename),
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      {
        metrics: report.metrics,
        acceptance: report.acceptance,
        cases: rows.length,
        report: "evaluation/results/" + filename,
      },
      null,
      2,
    ),
  );
}
main().catch(() => {
  console.error(
    "Avaliação não concluída. Verifique configuração, diretório e disponibilidade do provedor.",
  );
  process.exitCode = 1;
});
