import { UnitGroup } from "../unit/models";

export interface PagedListResult<T> {
    pageIndex: number;
    pageSize: number;
    items: T[];
    totalCount: number;
}
export interface InputStatus {
    valid: boolean;
    error?: string;
}
export interface EmailTemplate {
    id: string;
    name: string;
    code: string;
    createdOn: Date;
}
export interface EmailTemplateRequest {
    name: string;
    code: string;
}

export interface OwnerType {
    id: string;
    name: string;
    description: string;
    createdOn: Date;
}

export interface OwnerTypeRequest {
    name: string;
    description: string;
}

export interface MeetingSettings {
    creationEmailTemplate: EmailTemplate | null;
    beforeNotificationEmailTemplate: EmailTemplate | null;
}
export interface MeetingSettingsRequest {
    creationEmailTemplateId: string | null;
    beforeNotificationEmailTemplateId: string | null;
}

export enum VotingTopicOptionType {
    Undefined = 0,
    Person = 1
}

export interface VotingSession {
    id: string;
    startsOn: Date;
    endsOn: Date;
    topics?: VotingTopic[];
}

export interface VotingSessionRequest {
    startsOn: Date;
    endsOn: Date;
    topics?: VotingTopic[];
}

export interface VotingTopic {
    id: string;
    introduction?: string;
    text: string;
    duration: number;
    answerLimit: number;
    order: number;
    options?: VotingTopicOption[]
}

export interface VotingTopicRequest {
    introduction?: string;
    text: string;
    duration: number;
    answerLimit: number;
    order: number;
    options?: VotingTopicOptionRequest[]
}

export interface VotingTopicOption {
    id: string;
    label: string;
    editable: boolean;
    personId?: string;
    type: VotingTopicOptionType;
    isFillableOption: boolean;
}

export interface VotingTopicOptionRequest {
    label: string;
    editable: boolean;
    personId?: string;
    type: VotingTopicOptionType;
}