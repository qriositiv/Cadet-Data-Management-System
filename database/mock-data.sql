INSERT INTO UserAuthentication (cadetId, nationalId)
VALUES ('LKA12345678901', 5001226);

INSERT INTO `Location` (location) VALUES 
('Vilnius'), ('Pabradė'), ('Rūdninkai');

INSERT INTO `UserProfileData` (
    cadetId, 
    dateOfBirth, 
    fullName, 
    photoUrl, 
    phoneNumber, 
    email, 
    address, 
    bloodType, 
    gender, 
    heightCm, 
    weightKg, 
    allergies, 
    medicalConditions, 
    baseLocation, 
    status
)
VALUES (
    'LKA12345678901',                       
    '2000-12-26',                          
    'Antanas Antanaitis',                   
    'https://media.istockphoto.com/id/482417564/vector/captain-line-icon.jpg?s=612x612&w=0&k=20&c=UUcjc08MjP_VGwp5g6qOgtT0TtuLcGRiEpaX2JvmBgg=', 
    '+37067777777',                        
    'antanaitis.a@gmail.com',              
    'Minijos g. XX / XX, Vilnius, Vilniaus apsk.',
    'O+',                                  
    'Vyras',                               
    180.00,                                 
    75.70,                                 
    'Žuvys, riešutai',                     
    'Astma',                               
    'Vilnius',                             
    'ppkt'                                 
);

INSERT INTO Event (eventId, title, dateFrom, dateTo, location) VALUES
(1, 'Paskaita – diskusija „Lietuvos žvalgybos veiksmai prijungiant Klaipėdos kraštą”', 
    NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 1 HOUR, 'LITEXPO, Vilnius'),
(2, 'Karo istoriko prof. dr. Valdo Rakučio knygos PRIEŠ PANYRANT Į SUTEMAS pristatymas', 
    NOW() + INTERVAL 2 HOUR, NOW() + INTERVAL 3 HOUR, 'Poligonas, Kaunas');

INSERT INTO `CarEnterPermission` (
    cadetId, 
    status, 
    location, 
    dateFrom, 
    dateTo, 
    carNumber, 
    carBrand, 
    additionalInformation
) VALUES
('LKA12345678901', 'Patvirtintas', 'Vilnius', '2024-11-01 08:00:00', '2024-11-01 18:00:00', 'AA1234', 'Audi', 'Svečias atvyksta į susitikimą'),
('LKA12345678901', 'Nepatvirtintas', 'Pabradė', '2024-11-02 09:00:00', '2024-11-02 17:00:00', 'BB2345', 'BMW', 'Dokumentų pateikimas'),
('LKA12345678901', 'Atšauktas', 'Rūdninkai', '2024-11-03 10:00:00', '2024-11-03 15:00:00', 'CC3456', 'Mercedes', 'Būsena atšaukta dėl netikėtų aplinkybių');

INSERT INTO `ExemptionFromPhysicalActivity` (
    cadetId, 
    status,
    dateFrom, 
    dateTo, 
    documentPhotoUrl, 
    additionalInformation
) VALUES (
    'LKA12345678901',
    'Patvirtintas',
    '2023-11-01 00:00:00',
    '2023-11-05 00:00:00',
    'https://example.com/document.jpg',
    'Sulaužita ranka.'
);

INSERT INTO `Equipment` (photoUrl, name) VALUES
('https://lpromo.lt/media/catalog/product/cache/1/thumbnail/600x/17f82f742ffe127f42dca9de82fb58b1/3/8/38081600001005.jpg', 'Žygio kuprinė'),
('https://tyditiao.com/wp-content/uploads/2022/06/fast-Sand-color-Bulletproof-Kevlar-Helmet-main-view.jpg', 'Šalmas'),
('https://ksd-images.lt/display/aikido/store/ed10d37fd1169ccc4a8f9b684ab44b8a.jpg', 'Žibintuvėlis'),
('https://www.lankava.lt/image/cache/mechanix-taktiniai-akiniai-type-x-juodi-skaidri-linze_202312120855481-1000x1000.jpg', 'Taktiniai akiniai'),
('https://balticshooter.lt/image/cache/data/products_s_1/taktine-liemene-perun-4-20-rb-su-greito-atsegimo-sagtimis-v-pc-p4-20rocrg-321-625x625_0.jpg', 'Taktinė liemenė'),
('https://www.aic.lt/14387-medium_default/palapinsiauste-mil-tec-rip-stop-woodland.jpg', 'Palapinsiaustė'),
('https://matuza-tactical.lt/wp-content/uploads/2020/11/5-1-scaled.jpg', 'Gertuvė'),
('https://www.aic.lt/8044-medium_default/metalinis-puodukas-gertuvei.jpg', 'Maisto katilukas'),
('https://www.aic.lt/5240-large_default/taktines-pirstines-arsenal-swat-be-pirstu-l.jpg', 'Taktinės pirštines'),
('https://edesys.lt/image/cache/catalog/start-riding/4525-600x600.jpg', 'Žieminės pirštines'),
('https://www.aic.lt/22324-large_default/zieminiai-batai-demar-caribou-pro-40.jpg', 'Žieminiai batai'),
('', 'Vasariniai batai');

INSERT INTO `EquipmentSize` (equipmentId, size) VALUES
(1, '-'),
(2, 'xs'), (2, 's'), (2, 'm'), (2, 'l'), (2, 'xl'),
(3, '-'),
(4, 'xs'), (4, 's'), (4, 'm'), (4, 'l'), (4, 'xl'),
(5, 'xs'), (5, 's'), (5, 'm'), (5, 'l'), (5, 'xl'),
(6, '-'),
(7, '-'),
(8, 'xs'), (8, 's'), (8, 'm'), (8, 'l'), (8, 'xl'),
(9, 'xs'), (9, 's'), (9, 'm'), (9, 'l'), (9, 'xl'),
(10, '37'), (10, '38'), (10, '39'), (10, '40'), (10, '41'), (10, '42'), (10, '43'),
(11, '37'), (11, '38'), (11, '39'), (11, '40'), (11, '41'), (11, '42'), (11, '43');

INSERT INTO `UserEquipment` (cadetId, equipmentId, status, size, dateGiven) VALUES
('LKA12345678901', 1, 'Negauta', '-', '2024-11-14'),
('LKA12345678901', 2, 'Negauta', 'm', '2024-11-14'),
('LKA12345678901', 3, 'Negauta', '-', '2024-11-14'),
('LKA12345678901', 4, 'Negauta', 'l', '2024-11-14'),
('LKA12345678901', 5, 'Paruošta', 'xs', '2024-11-14'),
('LKA12345678901', 6, 'Negauta', '-', '2024-11-14'),
('LKA12345678901', 7, 'Gauta', '-', '2024-11-14'),
('LKA12345678901', 8, 'Apdorojama', 'm', '2024-11-14'),
('LKA12345678901', 9, 'Negauta', 'm', '2024-11-14'),
('LKA12345678901', 10, 'Negauta', '40', '2024-11-14'),
('LKA12345678901', 11, 'Negauta', '40', '2024-11-14');

INSERT INTO `Discipline` (name, controlForMale, controlForFemale, needMore) VALUES
    ('Atsispaudimai (kartai per 2 min.)', 57, 31, TRUE),
    ('Atsilenkimai (kartai per 2 min.)', 66, 66, TRUE),
    ('Begimas 3 km. (laikas, min., s)', 13.33, 16.21, FALSE);

INSERT INTO `UserDisciplineResult` (cadetId, disciplineId, result) VALUES
    ('LKA12345678901', 1, 85),
    ('LKA12345678901', 2, 72),
    ('LKA12345678901', 3, 15.0);
