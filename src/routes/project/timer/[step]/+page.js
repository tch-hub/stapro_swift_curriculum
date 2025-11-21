import { error } from "@sveltejs/kit";
import { timerSteps } from "../steps-config";

const markdownFiles = import.meta.glob("../steps/*.md", { as: "raw" });

export async function load({ params }) {
    const stepId = params.step;
    const stepIndex = timerSteps.findIndex((step) => step.id === stepId);

    if (stepIndex === -1) {
        throw error(404, "ステップが見つかりません。");
    }

    const loader = markdownFiles[`../steps/${stepId}.md`];

    if (!loader) {
        throw error(404, "マークダウンが読み込めません。");
    }

    const content = await loader();

    return {
        stepId,
        title: timerSteps[stepIndex].title,
        summary: timerSteps[stepIndex].summary,
        content,
        prevStep: stepIndex > 0 ? timerSteps[stepIndex - 1] : null,
        nextStep: stepIndex < timerSteps.length - 1 ? timerSteps[stepIndex + 1] : null
    };
}
