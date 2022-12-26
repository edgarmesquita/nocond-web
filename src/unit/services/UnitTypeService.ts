import axios from 'axios';
import { UnitTypeRequest } from "../models";

export class UnitTypeService {

    private baseUrl: string | undefined;
    /**
     *
     */
    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL;

    }

    public async update(request: UnitTypeRequest): Promise<string | null> {
        const url = '/v1/unit-types';
        const response = await axios.post<string>(`${this.baseUrl}${url}`, request);
        return response.data;
    }
}