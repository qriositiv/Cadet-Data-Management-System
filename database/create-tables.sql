-- Table to store user authentication data.
CREATE TABLE `UserAuthentication` (
    cadetId VARCHAR(14) PRIMARY KEY,     -- Unique cadet ID (3 letters + 11 numbers).
    hashedPassword VARCHAR(128) NOT NULL -- Securely hashed password for authentication.
);

-- Table to store base locations of the organization.
CREATE TABLE `Location` (
    location VARCHAR(50) PRIMARY KEY -- Unique identifier for each location.
);

-- Table to store detailed user profile data.
CREATE TABLE `UserProfileData` (
    cadetId VARCHAR(14) PRIMARY KEY, -- Links to the user in UserAuthentication.
    dateOfBirth DATE NOT NULL,       -- Cadet's date of birth.
    fullName VARCHAR(255) NOT NULL,  -- Cadet's full name.
    photoUrl TEXT,                   -- URL to the cadet's profile photo.
    phoneNumber VARCHAR(12),         -- Contact phone number.
    email VARCHAR(255) UNIQUE,       -- Unique email address.
    address TEXT,                    -- Cadet's home address.
    bloodType ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL, -- Blood type.
    gender ENUM('Vyras', 'Moteris', 'Nenuroditas') DEFAULT 'Nenuroditas' NOT NULL, -- Gender.
    heightCm DECIMAL(5,2),           -- Height in centimeters.
    weightKg DECIMAL(5,2),           -- Weight in kilograms.
    allergies TEXT,                  -- Known allergies.
    medicalConditions TEXT,          -- Medical conditions.
    baseLocation VARCHAR(50),        -- Links to a base location in the Location table.
    status ENUM('-', 'ppkt', 'pkt', 'intendantas') DEFAULT '-', -- Cadet's organizational status.
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId), -- Links to UserAuthentication.
    FOREIGN KEY (baseLocation) REFERENCES Location(location)      -- Links to Location.
);

-- Table to store event details.
CREATE TABLE `Event` (
    eventId INT AUTO_INCREMENT PRIMARY KEY, -- Unique event identifier.
    title VARCHAR(255) NOT NULL,            -- Title of the event.
    dateFrom DATETIME NOT NULL,             -- Start date and time of the event.
    dateTo DATETIME NOT NULL,               -- End date and time of the event.
    location VARCHAR(255) NOT NULL          -- Location where the event takes place.
);

-- Table to manage permissions for entering with a car.
CREATE TABLE `CarEnterPermission` (
    permissionId INT AUTO_INCREMENT PRIMARY KEY, -- Unique permission ID.
    cadetId VARCHAR(14),                         -- Links to the user in UserAuthentication.
    status ENUM('Nepatvirtintas', 'Patvirtintas', 'Atšauktas') DEFAULT 'Nepatvirtintas' NOT NULL, -- Approval status.
    location VARCHAR(50),                        -- Location linked to the permission.
    dateFrom DATETIME NOT NULL,                  -- Start date and time of the permission.
    dateTo DATETIME NOT NULL,                    -- End date and time of the permission.
    carNumber VARCHAR(6),                        -- Car number (6 characters for Lithuania).
    carBrand VARCHAR(50),                        -- Car brand.
    additionalInformation TEXT,                  -- Additional notes.
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId), -- Links to UserAuthentication.
    FOREIGN KEY (location) REFERENCES Location(location)           -- Links to Location.
);

-- Table to manage exemptions from physical activities.
CREATE TABLE `ExemptionFromPhysicalActivity` (
    permissionId INT AUTO_INCREMENT PRIMARY KEY, -- Unique permission ID.
    cadetId VARCHAR(14),                         -- Links to the user in UserAuthentication.
    status ENUM('Nepatvirtintas', 'Patvirtintas', 'Atšauktas') DEFAULT 'Nepatvirtintas' NOT NULL, -- Approval status.
    dateFrom DATETIME NOT NULL,                  -- Start date of the exemption.
    dateTo DATETIME NOT NULL,                    -- End date of the exemption.
    documentPhotoUrl TEXT,                       -- URL to supporting document photo.
    additionalInformation TEXT,                  -- Additional notes.
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId) -- Links to UserAuthentication.
);

-- Table to store equipment details.
CREATE TABLE `Equipment` (
    equipmentId INT AUTO_INCREMENT PRIMARY KEY, -- Unique equipment ID.
    photoUrl TEXT,                              -- URL to equipment photo.
    name VARCHAR(255) NOT NULL                  -- Name of the equipment.
);

-- Table to manage sizes for each equipment.
CREATE TABLE `EquipmentSize` (
    size VARCHAR(5),                           -- Size of the equipment.
    equipmentId INT,                           -- Links to the equipment in Equipment.
    equipmentLeft INT,                         -- Quantity available in this size.
    PRIMARY KEY (equipmentId, size),           -- Composite primary key.
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId) -- Links to Equipment.
);

-- Table to track which equipment is assigned to cadets.
CREATE TABLE `UserEquipment` (
    cadetId VARCHAR(14),                       -- Links to the user in UserAuthentication.
    equipmentId INT,                           -- Links to the equipment in Equipment.
    status ENUM ('Negauta', 'Apdorojama', 'Gauta', 'Paruošta') DEFAULT 'Negauta' NOT NULL, -- Equipment status.
    size VARCHAR(5),                           -- Size assigned to the user.
    dateGiven DATETIME NOT NULL,               -- Date the equipment was issued.
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId), -- Links to UserAuthentication.
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId), -- Links to Equipment.
    FOREIGN KEY (equipmentId, size) REFERENCES EquipmentSize(equipmentId, size), -- Links to EquipmentSize.
    PRIMARY KEY (cadetId, equipmentId)         -- Composite primary key.
);

-- Table to store notifications for users.
CREATE TABLE Notification (
    notificationId INT AUTO_INCREMENT PRIMARY KEY, -- Unique notification ID.
    cadetId VARCHAR(14),                           -- Links to the user in UserAuthentication.
    type ENUM ('info', 'success', 'fail', 'important') DEFAULT 'info' NOT NULL, -- Notification type.
    title VARCHAR(255) NOT NULL,                   -- Notification title.
    message TEXT,                                  -- Notification message.
    hidden BOOLEAN NOT NULL DEFAULT FALSE,         -- Visibility status.
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId) -- Links to UserAuthentication.
);

-- Table to store discipline details.
CREATE TABLE `Discipline` (
    disciplineId INT AUTO_INCREMENT PRIMARY KEY, -- Unique discipline ID.
    name VARCHAR(100),                           -- Name of the discipline.
    controlForMale FLOAT,                        -- Performance benchmark for males.
    controlForFemale FLOAT,                      -- Performance benchmark for females.
    needMore BOOLEAN                             -- Indicates if more training is needed.
);

-- Table to track cadet results in disciplines.
CREATE TABLE `UserDisciplineResult` (
    cadetId VARCHAR(14),                        -- Links to the user in UserAuthentication.
    disciplineId INT,                           -- Links to the discipline in Discipline.
    result FLOAT,                               -- Result achieved by the cadet.
    FOREIGN KEY (cadetId) REFERENCES `UserAuthentication`(cadetId), -- Links to UserAuthentication.
    FOREIGN KEY (disciplineId) REFERENCES `Discipline`(disciplineId), -- Links to Discipline.
    PRIMARY KEY (cadetId, disciplineId)         -- Composite primary key.
);
