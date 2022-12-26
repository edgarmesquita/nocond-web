import axios from 'axios';
import { VotingTopic, VotingTopicRequest } from "../../models";

export class VotingTopicService {

    private baseUrl: string | undefined;
    private url: string;
    /**
     *
     */
    constructor(votingSessionId: string) {
        this.baseUrl = process.env.REACT_APP_API_URL;
        this.url = `/v1/voting-sessions/${votingSessionId}/voting-topics`;
    }

    public async get(id: string): Promise<VotingTopic | null> {

        const response = await axios.get<VotingTopic>(`${this.baseUrl}${this.url}/${id}`);
        return response.data;
    }

    public async add(request: VotingTopicRequest): Promise<string | null> {

        const response = await axios.post<string>(`${this.baseUrl}${this.url}`, request);
        return response.data;
    }

    public async update(id: string, request: VotingTopicRequest) {

        await axios.put(`${this.baseUrl}${this.url}/${id}`, request);
    }
}