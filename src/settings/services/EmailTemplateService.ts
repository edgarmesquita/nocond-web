import axios from 'axios';
import AxiosGlobalConfig from '../../config/axios.config';
import { EmailTemplateRequest } from "../../models";

export class EmailTemplateService {

    private baseUrl: string | undefined;
    /**
     *
     */
    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL;
        AxiosGlobalConfig.setup();
    }

    public async update(request: EmailTemplateRequest): Promise<string | null> {
        const url = '/v1/emails/templates';
        const response = await axios.post<string>(`${this.baseUrl}${url}`, request);
        return response.data;
    }
} 