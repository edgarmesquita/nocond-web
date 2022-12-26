import axios from 'axios';
import { MeetingSettingsRequest } from "../../models";

export class MeetingSettingsService {

    private baseUrl: string | undefined;

    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL;
    }

    public async update(request: MeetingSettingsRequest): Promise<boolean> {
        const url = '/v1/settings/meetings';
        try {
            await axios.post(`${this.baseUrl}${url}`, request);
            return true;
        } catch (error) {
            return false;
        }
    }
} 