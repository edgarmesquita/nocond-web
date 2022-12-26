import { UnitGroup } from "../../unit/models";

export interface MeetingType {
    id: string;
    name: string;
    createdOn: Date;
}

export interface MeetingTypeRequest {
    name: string;
}

export interface MeetingRequest {
    name: string;
    description: string;
    startsOn: Date;
    endsOn: Date;
    meetingTypeId: string;
    unitGroupId: string;
}
export interface Meeting {
    id: string;
    name: string;
    description: string;
    startsOn: Date;
    type: MeetingType;
    unitGroup: UnitGroup;
}