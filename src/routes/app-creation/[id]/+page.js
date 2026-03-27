import { error } from '@sveltejs/kit';
import { appCreationIdList } from '$lib/data/app-creation/index';

export function load({ params }) {
	const { id } = params;

	if (!appCreationIdList.includes(id)) {
		throw error(404, 'アプリ制作が見つかりません。');
	}

	return {
		projectId: id
	};
}
