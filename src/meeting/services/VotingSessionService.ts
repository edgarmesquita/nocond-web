import axios from 'axios';
import { VotingSessionRequest } from "../../models";

export class VotingSessionService {

    private baseUrl: string | undefined;
    private url: string;
    /**
     *
     */
    constructor(meetingId: string) {
        this.baseUrl = process.env.REACT_APP_API_URL;
        this.url = `/v1/meetings/${meetingId}/voting-sessions`;
    }

    public async add(request: VotingSessionRequest): Promise<string | null> {

        const response = await axios.post<string>(`${this.baseUrl}${this.url}`, request);
        return response.data;
    }

    public async update(id: string, request: VotingSessionRequest) {

        await axios.put(`${this.baseUrl}${this.url}/${id}`, request);
    }
} 