import { error } from "@sveltejs/kit";
import { base } from '$app/paths';
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

    let content = await loader();

    // When markdown is loaded as raw HTML, image/link paths that start with "/"
    // point to the site root and will break if the site is served from a subpath
    // (for example GitHub Pages: https://user.github.io/repo/). Prefix those
    // paths with the app `base` so they resolve correctly.
    const normalizedBase = (base || '').replace(/\/$/, '');
    if (normalizedBase) {
        // Replace src="/... and src='/... and href="/... and url('/... and so on.
        content = content.replace(/(src|href)=(['"])\/(?!\/)([^'\"]*)/g, (m, attr, q, rest) => {
            return `${attr}=${q}${normalizedBase}/${rest}`;
        });

        content = content.replace(/url\((['"]?)\/(?!\/)([^)'\"]*)\)/g, (m, q, rest) => {
            return `url(${q}${normalizedBase}/${rest})`;
        });
    }

    return {
        stepId,
        title: timerSteps[stepIndex].title,
        summary: timerSteps[stepIndex].summary,
        content,
        prevStep: stepIndex > 0 ? timerSteps[stepIndex - 1] : null,
        nextStep: stepIndex < timerSteps.length - 1 ? timerSteps[stepIndex + 1] : null
    };
}
