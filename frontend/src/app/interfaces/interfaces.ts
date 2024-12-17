/**
 * Represents user credentials for authentication.
 */
export interface UserAuthenticationData {
    cadetId: string; // Unique identifier for the user.
    password: string; // User's password.
}

/**
 * Response returned after a successful login.
 */
export interface LoginResponse {
    access_token: string; // Token for authenticating subsequent requests.
    isIntendant: boolean; // Flag indicating if the user is an intendant.
}

/**
 * Represents a base location.
 */
export interface Location {
    location: string; // Name of the location.
}

/**
 * Detailed data about a user profile.
 */
export interface UserProfileData {
    authentication: UserAuthenticationData; // Authentication details.
    basicData: UserProfileBasicData; // Basic profile information.
    contactData: UserProfileContactData; // Contact details.
    healthData: UserProfileHealthData; // Health-related data.
    serviceData: UserProfileServiceData; // Information related to service.
}

/**
 * Basic information about a user.
 */
interface UserProfileBasicData {
    dateOfBirth: Date; // Date of birth.
    fullName: string; // Full name of the user.
    photoUrl: string; // URL of the user's profile picture.
}

/**
 * Contact details of a user.
 */
interface UserProfileContactData {
    phoneNumber: string; // User's phone number.
    email: string; // User's email address.
    address: string; // User's residential address.
}

/**
 * Health data associated with a user.
 */
interface UserProfileHealthData {
    bloodType: string; // User's blood type.
    gender: string; // Gender of the user.
    heightCm: number; // User's height in centimeters.
    weightKg: number; // User's weight in kilograms.
    allergies: string; // Known allergies of the user.
    medicalConditions: string; // Existing medical conditions.
}

/**
 * Service-related data for a user.
 */
interface UserProfileServiceData {
    location: string; // Current base location.
    status: string; // Service status of the user.
}

/**
 * Represents an event in the system.
 */
export interface Event {
    eventId: number; // Unique identifier for the event.
    readonly title: string; // Title of the event.
    dateFrom: Date; // Start date and time.
    dateTo: Date; // End date and time.
    location: string; // Location of the event.
}

/**
 * Permission for car entry into a restricted area.
 */
export interface CarEnterPermission {
    permissionId: number; // Unique ID for the permission.
    cadetId: string; // ID of the cadet requesting the permission.
    status: string; // Current status of the permission.
    location: string; // Location for the permission.
    dateFrom: Date; // Start date of the permission.
    dateTo: Date; // End date of the permission.
    carNumber: string; // Number plate of the car.
    carBrand: string; // Brand of the car.
    additionalInformation?: string; // Optional additional notes.
}

/**
 * Represents an exemption from physical activity.
 */
export interface ExemptionFromPhysicalActivity {
    permissionId: number; // Unique ID for the exemption.
    cadetId: string; // ID of the cadet requesting the exemption.
    status: string; // Current status of the exemption.
    dateFrom: Date; // Start date of the exemption.
    dateTo: Date; // End date of the exemption.
    documentPhotoUrl: string; // URL of the uploaded exemption document.
    additionalInformation?: string; // Optional additional notes.
}

/**
 * Represents a piece of equipment assigned to a cadet.
 */
export interface Equipment {
    equipmentId: number; // Unique ID for the equipment.
    cadetId: string; // ID of the cadet assigned the equipment.
    photoUrl: string; // Image URL of the equipment.
    status: string; // Current status of the equipment (e.g., received, pending).
    name: string; // Name of the equipment.
    sizes: EquipmentSize[]; // Available sizes for the equipment.
    size: string; // Selected size of the equipment.
    dateGiven: Date; // Date when the equipment was given.
}

/**
 * Represents the size and remaining quantity of an equipment item.
 */
interface EquipmentSize {
    equipmentLeft: number; // Quantity of the equipment left.
    size: string; // Size of the equipment.
}

/**
 * Represents a notification for a cadet.
 */
export interface Notification {
    notificationId: number; // Unique ID for the notification.
    cadetId: string; // ID of the cadet receiving the notification.
    type: string; // Type of notification (e.g., info, alert).
    readonly title: string; // Notification title.
    message: string; // Notification content.
    hidden: boolean; // Visibility status of the notification.
}

/**
 * Discipline results for a user.
 */
export interface UserDisciplineResults {
    username: string; // Name of the user.
    gender: string; // Gender of the user.
    age: number; // Age of the user.
    results: DisciplineResult[]; // Results for each discipline.
}

/**
 * Represents the result of a specific discipline.
 */
interface DisciplineResult {
    name: string; // Name of the discipline.
    result: number; // User's result in the discipline.
    controlValue: number; // Control value for the discipline.
    needMore: boolean; // Whether the result should exceed the control value.
}

/**
 * Represents a discipline with its control values.
 */
export interface Discipline {
    disciplineId: number; // Unique ID for the discipline.
    name: string; // Name of the discipline.
    controlForMale: number; // Control value for male cadets.
    controlForFemale: number; // Control value for female cadets.
    controlValue: number; // General control value.
}
