export interface UserAuthenticationData {
    cadetId: string;
    nationalId: number;
}

export interface LoginResponse {
    access_token: string;
    isIntendant: boolean;
}

export interface Location {
    location: string;
}

export interface UserProfileData {
    authentication: UserAuthenticationData;
    basicData: UserProfileBasicData;
    contactData: UserProfileContactData;
    healthData: UserProfileHealthData;
    serviceData: UserProfileServiceData;
}

interface UserProfileBasicData {
    dateOfBirth: Date;
    fullName: string;
    photoUrl: string;
}

interface UserProfileContactData {
    phoneNumber: string;
    email: string;
    address: string;
}

interface UserProfileHealthData {
    bloodType: string;
    gender: string;
    heightCm: number;
    weightKg: number;
    allergies: string;
    medicalConditions: string;
}

interface UserProfileServiceData {
    location: string;
    status: string;
}

export interface Event {
    eventId: number;
    readonly title: string;
    dateFrom: Date;
    dateTo: Date;
    location: string;
}

export interface CarEnterPermission {
    permissionId: number;
    cadetId: string;
    status: string;
    location: string;
    dateFrom: Date;
    dateTo: Date;
    carNumber: string;
    carBrand: string;
    additionalInformation?: string;
}

export interface ExemptionFromPhysicalActivity {
    permissionId: number;
    cadetId: string;
    status: string;
    dateFrom: Date;
    dateTo: Date;
    documentPhotoUrl: string;
    additionalInformation?: string;
}

export interface Equipment {
    equipmentId: number;
    cadetId: string;
    photoUrl: string;
    status: string;
    name: string;
    sizes: EquipmentSize[];
    size: string;
    dateGiven: Date;
}

interface EquipmentSize {
    equipmentLeft: number;
    size: string;
}

export interface Notification {
    notificationId: number; 
    cadetId: string; 
    type: string; 
    readonly title: string; 
    message: string; 
    hidden: boolean; 
}

export interface UserDisciplineResults {
    username: string;
    gender: string;
    age: number;
    results: DisciplineResult[];
}

interface DisciplineResult {
    name: string;
    result: number;
    controlValue: number;
    needMore: boolean;
}

export interface Discipline {
    disciplineId: number;
    name: string;
    controlForMale: number;
    controlForFemale: number;
    controlValue: number;
}