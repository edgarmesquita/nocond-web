import axios from 'axios';
import { Meeting } from "../models";

export class MeetingService {

    private baseUrl: string | undefined;
    private url: string;
    /**
     *
     */
    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL;
        this.url = '/v1/meetings';
    }

    public async get(id: string): Promise<Meeting | null> {

        const response = await axios.get<Meeting>(`${this.baseUrl}${this.url}/${id}`);
        return response.data;
    }
} 