-- Root data to indeficate the user.
CREATE TABLE `UserAuthentication` (
    cadetId VARCHAR(14) PRIMARY KEY,    -- 3 letters and 11 numbers.
    nationalId VARCHAR(11) UNIQUE NOT NULL  -- https://lt.wikipedia.org/wiki/Asmens_kodas -> civilId exactly 11 digits.
);

-- Cadet organisation has several base locations. 
CREATE TABLE `Location` (
    location VARCHAR(50) PRIMARY KEY
);

-- User profile data. The data by design is not editable.
CREATE TABLE `UserProfileData` (
    cadetId VARCHAR(14) PRIMARY KEY,
    dateOfBirth DATE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    photoUrl TEXT,
    phoneNumber VARCHAR(12),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    bloodType ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    -- https://en.wikipedia.org/wiki/Blood_type -> All blood types.
    gender ENUM('Vyras', 'Moteris', 'Nenuroditas') DEFAULT 'Nenuroditas' NOT NULL,
    heightCm DECIMAL(5,2),
    weightKg DECIMAL(5,2),
    allergies TEXT,
    medicalConditions TEXT,
    baseLocation VARCHAR(50),
    status ENUM('-', 'ppkt', 'pkt', 'intendantas') DEFAULT '-',
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId),
    FOREIGN KEY (baseLocation) REFERENCES Location(location)
);

-- Events table - undependent, doesn't reference anything
CREATE TABLE `Event` (
    eventId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    dateFrom DATETIME NOT NULL,
    dateTo DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL
);

-- Represents form for enter teritory with a car.
CREATE TABLE `CarEnterPermission` (
    permissionId INT AUTO_INCREMENT PRIMARY KEY,
    cadetId VARCHAR(14),
    status ENUM('Nepatvirtintas', 'Patvirtintas', 'Atšauktas') DEFAULT 'Nepatvirtintas' NOT NULL,
    location VARCHAR(50),
    dateFrom DATETIME NOT NULL,
    dateTo DATETIME NOT NULL,
    carNumber VARCHAR(6), -- 6 for Lithuania registered cars.
    carBrand VARCHAR(50),
    additionalInformation TEXT,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId),
    FOREIGN KEY (location) REFERENCES Location(location)
);

-- Represents form for exemption from physical activity.
CREATE TABLE `ExemptionFromPhysicalActivity` (
    permissionId INT AUTO_INCREMENT PRIMARY KEY,
    cadetId VARCHAR(14),
    status ENUM('Nepatvirtintas', 'Patvirtintas', 'Atšauktas') DEFAULT 'Nepatvirtintas' NOT NULL,
    dateFrom DATETIME NOT NULL,
    dateTo DATETIME NOT NULL,
    documentPhotoUrl TEXT,
    additionalInformation TEXT,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId)
);

-- Cadet's equipment.
CREATE TABLE `Equipment` (
    equipmentId INT AUTO_INCREMENT PRIMARY KEY,
    photoUrl TEXT, 
    name VARCHAR(255) NOT NULL
);

-- Equipment has sizes to choose.
CREATE TABLE `EquipmentSize` (
    size VARCHAR(5),
    equipmentId INT,
    PRIMARY KEY (equipmentId, size),
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId)
);

-- Information about equipment which user has.
CREATE TABLE `UserEquipment` (
    cadetId VARCHAR(14), 
    equipmentId INT,
    status ENUM ('Negauta', 'Apdorojama', 'Gauta', 'Paruošta') DEFAULT 'Negauta' NOT NULL, 
    size VARCHAR(5), 
    dateGiven DATETIME NOT NULL,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId),
    FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId),
    FOREIGN KEY (equipmentId, size) REFERENCES EquipmentSize(equipmentId, size),
    PRIMARY KEY (cadetId, equipmentId)
);

-- For user notification about updates.
CREATE TABLE Notification (
    notificationId INT AUTO_INCREMENT PRIMARY KEY,
    cadetId VARCHAR(14),
    type VARCHAR(14),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId)
);

CREATE TABLE `Discipline` (
    disciplineId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) ,
    controlForMale FLOAT,
    controlForFemale FLOAT,
    needMore BOOLEAN
);


CREATE TABLE `UserDisciplineResult` (
    cadetId VARCHAR(14),
    disciplineId INT,
    result FLOAT,
    FOREIGN KEY (cadetId) REFERENCES `UserAuthentication`(cadetId),
    FOREIGN KEY (disciplineId) REFERENCES `Discipline`(disciplineId),
    PRIMARY KEY (cadetId, disciplineId)
);