export interface UnitGroup {
    id: string;
    name: string;
    createdOn: Date;
}

export interface UnitGroupRequest {
    name: string;
}

export interface UnitType {
    id: string;
    name: string;
    description: string;
    createdOn: Date;
}

export interface UnitTypeRequest {
    name: string;
    description: string;
}

export enum FloorType {
    Underground = 0,
    GroundFloor = 1,
    Floor = 2,
    Roof = 3
}

export interface Unit {
    id: string;
    floor: number;
    floorType: FloorType;
    block: string;
    blockDescription: string;
    side: string;
    code: string;
    codePrefix: string;
    codeSuffix: string;
    createdOn: Date;
    unitGroup: UnitGroup;
}

export interface UnitRequest {
    floor: number;
    floorType: FloorType;
    block: string;
    blockDescription: string;
    side: string;
    code: string;
    codePrefix: string;
    codeSuffix: string;
    unitTypeId: string;
}

export interface UnitRangeRequest {
    floor: number;
    floorType: FloorType;
    block: string;
    blockDescription: string;
    side: string;
    codeStart: number;
    codeEnd: number;
    codePrefix?: string;
    codeSuffix?: string;
    unitTypeId: string;
}

export interface Owner {
    id: string;
    name: string;
    createdOn: Date;
}

export interface OwnerRequest {
    name: string;
}