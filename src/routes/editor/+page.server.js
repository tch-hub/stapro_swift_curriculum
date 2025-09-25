import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fail } from '@sveltejs/kit';

const TUTORIAL_JSON_PATH = join(process.cwd(), 'src/lib/data/tutorial.json');

export async function load() {
    try {
        const data = readFileSync(TUTORIAL_JSON_PATH, 'utf-8');
        return { jsonContent: data };
    } catch (error) {
        return { jsonContent: '', error: error.message };
    }
}

export const actions = {
    save: async ({ request }) => {
        try {
            const data = await request.formData();
            const jsonContent = data.get('jsonContent');

            // JSONの妥当性をチェック
            JSON.parse(jsonContent);

            writeFileSync(TUTORIAL_JSON_PATH, jsonContent, 'utf-8');
            return { success: true };
        } catch (error) {
            return fail(400, { error: error.message });
        }
    }
};