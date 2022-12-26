export enum PersonType {
    Fisical = 0,
    Legal = 1
}
export interface AuditMetadata {
    createdById?: string | undefined;
    createdOn?: moment.Moment;
    lastUpdatedById?: string | undefined;
    lastUpdatedOn?: moment.Moment | undefined;
}
export interface Address extends AuditMetadata {
    id?: string;
    address1?: string | undefined;
    address2?: string | undefined;
    number?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
}

export interface AddressRequest {
    address1?: string | undefined;
    address2?: string | undefined;
    addressNumber?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    postalCode?: string | undefined;
}

export interface Person extends AuditMetadata {
    id?: string;
    address?: Address | undefined;
    name?: string | undefined;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    mobilePhoneNumber?: string | undefined;
    nickname?: string | undefined;
    taxNumber?: string | undefined;
    idNumber?: string | undefined;
    type: PersonType;
}

export interface PersonRequest extends AddressRequest {
    name?: string | undefined;
    email?: string | undefined;
    phoneNumber?: string | undefined;
    mobilePhoneNumber?: string | undefined;
    nickname?: string | undefined;
    taxNumber?: string | undefined;
    idNumber?: string | undefined;
    type: PersonType;
}