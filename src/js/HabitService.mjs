export default class HabitService {
    constructor(userId, apiToken) {
        this.userId = userId;
        this.apiToken = apiToken;
        this.baseUrl = 'https://habitica.com/api/v3';
    }

    getHeaders() {
        return {
            'x-api-user': String(this.userId).trim(), 
            'x-api-key': String(this.apiToken).trim(),
            'Content-Type': 'application/json',
            'x-client': 'AAAA-AtomicTracker-v1.0'
        };
    }

    async getUserStats() {
        const response = await fetch(`${this.baseUrl}/user`, {
            headers: this.getHeaders()
        });
        
        if (!response.ok) {
            throw new Error(`Error Habitica: ${response.status} - No se pudo obtener stats`);
        }

        const data = await response.json();
        return data.data.stats; 
    }

    async getHabits() {
        const response = await fetch(`${this.baseUrl}/tasks/user?type=habits`, {
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error Habitica: ${response.status} - No se pudieron obtener hábitos`);
        }

        const data = await response.json();
        return data.data;
    }

    async scoreTask(taskId, direction = 'up') {
        const response = await fetch(`${this.baseUrl}/tasks/${taskId}/score/${direction}`, {
            method: 'POST',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error(`No se pudo actualizar el hábito hacia: ${direction}`);
        }

        const data = await response.json();
        return data.data;
    }
}