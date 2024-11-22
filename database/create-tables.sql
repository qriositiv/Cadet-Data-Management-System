CREATE TABLE `UserAuthentication` (
    cadetId VARCHAR(14) PRIMARY KEY,
    -- 3 letters and 11 numbers.
    nationalId VARCHAR(11) UNIQUE NOT NULL
    -- https://lt.wikipedia.org/wiki/Asmens_kodas -> civilId exactly 11 digits.
);

CREATE TABLE `UserProfileData` (
    cadetId VARCHAR(14) PRIMARY KEY,
    dateOfBirth DATE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    photoUrl TEXT,
    phoneNumber VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    bloodType ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
    gender ENUM('Vyras', 'Moteris', 'Nenuroditas') NOT NULL,
    heightCm DECIMAL(5,2),
    weightKg DECIMAL(5,2),
    allergies TEXT,
    medicalConditions TEXT,
    baseLocation VARCHAR(50),
    status ENUM('ppkt/pkt', 'intendantas') DEFAULT 'ppkt/pkt',
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId)
);

CREATE TABLE `Event` (
    eventId INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    dateFrom DATETIME NOT NULL,
    dateTo DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL
);

CREATE TABLE CarEnterPermission (
    permissionId INT AUTO_INCREMENT PRIMARY KEY,
    cadetId VARCHAR(14),
    status VARCHAR(14) NOT NULL,
    location VARCHAR(255),
    dateFrom DATETIME NOT NULL,
    dateTo DATETIME NOT NULL,
    carNumber VARCHAR(20),
    carBrand VARCHAR(14),
    additionalInformation TEXT,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId)
);

CREATE TABLE ExemptionFromPhysicalActivity (
    permissionId INT AUTO_INCREMENT PRIMARY KEY,
    cadetId VARCHAR(14),
    status VARCHAR(14) NOT NULL,
    location VARCHAR(255),
    dateFrom DATETIME NOT NULL,
    dateTo DATETIME NOT NULL,
    documentPhotoUrl TEXT,
    additionalInformation TEXT,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId)
);

-- CREATE TABLE Equipment (
--     equipmentId INT AUTO_INCREMENT PRIMARY KEY,
--     photoUrl TEXT, 
--     name VARCHAR(255) NOT NULL,  
--     cadetId VARCHAR(14), 
--     FOREIGN KEY (cadetId) REFERENCES UserEquipment(cadetId)
-- );

-- CREATE TABLE UserEquipment (
--     cadetId VARCHAR(14), 
--     status VARCHAR(14), 
--     size VARCHAR(10), 
--     dateGiven DATETIME NOT NULL,
--     FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId),
--     FOREIGN KEY (equipmentId) REFERENCES Equipment(equipmentId)
-- );

-- CREATE TABLE EquipmentSize (
--     sizeId INT AUTO_INCREMENT PRIMARY KEY,  
--     size VARCHAR(5) NOT NULL UNIQUE
-- );


CREATE TABLE Notification (
    notificationId INT AUTO_INCREMENT PRIMARY KEY,
    cadetId VARCHAR(14),
    type VARCHAR(14),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    hidden BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (cadetId) REFERENCES UserAuthentication(cadetId)
);
