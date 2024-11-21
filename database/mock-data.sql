INSERT INTO Event (eventId, title, dateFrom, dateTo, location) VALUES
(1, 'Paskaita – diskusija „Lietuvos žvalgybos veiksmai prijungiant Klaipėdos kraštą”', 
    NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 1 HOUR, 'LITEXPO, Vilnius'),
(2, 'Karo istoriko prof. dr. Valdo Rakučio knygos PRIEŠ PANYRANT Į SUTEMAS pristatymas', 
    NOW() + INTERVAL 2 HOUR, NOW() + INTERVAL 3 HOUR, 'Poligonas, Kaunas');
