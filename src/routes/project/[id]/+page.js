import { error } from '@sveltejs/kit';
import { projectIdList } from '$lib/data/projects';

export function load({ params }) {
	const { id } = params;

	if (!projectIdList.includes(id)) {
		throw error(404, 'プロジェクトが見つかりません。');
	}

	return {
		projectId: id
	};
}
