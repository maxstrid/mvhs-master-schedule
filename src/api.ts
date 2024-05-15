export type ScheduleResponse = {
    body: {
        grade: number;
        schedule: {
            period: number;
            classes: string[][];
        }[]
    };
}

export class FlaskBackend {
    id: string;
    backend_url: string;

    constructor(id: string, backend_url = import.meta.env.VITE_BACKEND_URL) {
        this.id = id;
        this.backend_url = backend_url
    }

    async calculate_conflicts(classes: { id: string, name: string }[]): Promise<number> {
        const conflict_response = await this.call(
            `/api/calculate_conflicts?id=${this.id}`, 'POST', JSON.stringify(classes)
        ).then(res => res.json());

        return conflict_response.conflicts;
    }

    async generate_schedule(grade: number): Promise<ScheduleResponse> {
        const schedule_response = await this.call(
            `/api/generate_schedule?grade=${grade}&id=${this.id}`, 'GET', undefined
        ).then(res => res.json());

        return schedule_response
    }

    async call(url: string, method: string, data?: string): Promise<Response> {
        return fetch(
            this.backend_url + url,
            {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: data
            }
        );
    }
}
