INSERT INTO `UserAuthentication` (cadetId, nationalId)
VALUES
('ABC12345678901', '12345678901'),
('DEF98765432109', '98765432109'),
('GHI45678912345', '45678912345');

INSERT INTO Event (eventId, title, dateFrom, dateTo, location) VALUES
(1, 'Paskaita – diskusija „Lietuvos žvalgybos veiksmai prijungiant Klaipėdos kraštą”', 
    NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 1 HOUR, 'LITEXPO, Vilnius'),
(2, 'Karo istoriko prof. dr. Valdo Rakučio knygos PRIEŠ PANYRANT Į SUTEMAS pristatymas', 
    NOW() + INTERVAL 2 HOUR, NOW() + INTERVAL 3 HOUR, 'Poligonas, Kaunas');

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
