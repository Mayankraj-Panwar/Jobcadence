import { API_BASE_URL } from "./api";

export interface RubricBreakdown {
  technical_accuracy: number;
  practical_depth: number;
  edge_case_reasoning: number;
  communication_clarity: number;
}

export interface InterviewEvaluationResult {
  score: number;
  rubric: RubricBreakdown;
  feedback: string;
  recalibrate_plan: boolean;
  remediation_tasks: string[];
}

export async function generateSkillQuestions(
  skill: string,
  targetRole: string
): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/generate-questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill,
        target_role: targetRole,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.questions || [];
  } catch (err) {
    console.warn("Falling back to client questions:", err);
    return [
      `In a production system for ${targetRole}, how do you architect and tune ${skill} to handle high concurrency and avoid latency degradation?`,
      `Describe a complex edge case you would encounter with ${skill} in a production environment and how you would mitigate it.`,
      `How do you establish automated evaluation benchmarks and guardrails to ensure reliability for ${skill}?`
    ];
  }
}

export async function evaluateFullInterview(
  questions: string[],
  answers: string[],
  context: {
    skill: string;
    type?: string;
  }
): Promise<InterviewEvaluationResult> {
  console.log("📡 Sending interview to backend evaluation");

  const res = await fetch(`${API_BASE_URL}/evaluate-interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      skill: context.skill,
      type: context.type || "technical",
      questions,
      answers,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Backend evaluation failed: " + text);
  }

  const data = await res.json();
  console.log("✅ Backend Gemini result:", data);

  return {
    score: data.score,
    rubric: data.rubric || {
      technical_accuracy: data.score,
      practical_depth: Math.max(40, data.score - 5),
      edge_case_reasoning: Math.max(40, data.score - 8),
      communication_clarity: Math.min(100, data.score + 5),
    },
    feedback: data.feedback || "Evaluation complete.",
    recalibrate_plan: data.recalibrate_plan ?? (data.score < 70),
    remediation_tasks: data.remediation_tasks || [],
  };
}
