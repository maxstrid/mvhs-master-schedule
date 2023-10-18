import { json } from '@sveltejs/kit'
import { Schedule } from '../../../lib/Schedule'

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { filename } = await request.json();
	return json(filename);
}

export async function GET() {
    return new Response();
}