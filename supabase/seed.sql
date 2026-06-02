insert into categories (name, slug, description, sort_order) values
('Oud Intenso', 'oud', 'Legni profondi, resine e scie persistenti.', 1),
('Musk Bianco', 'musk', 'Morbidezza pulita e vellutata.', 2),
('Attar Concentrato', 'attar', 'Oli profumati ad alta concentrazione.', 3),
('Bakhoor Premium', 'bakhoor', 'Incensi e legni aromatici per la casa.', 4),
('Set Regalo', 'set-regalo', 'Box eleganti pronte da donare.', 5),
('Profumi Unisex', 'unisex', 'Fragranze versatili e contemporanee.', 6);

insert into products (name, slug, brand, status, price, stock, short_description, top_notes, heart_notes, base_notes, intensity, longevity, gender, tags, is_featured, is_bestseller, is_new, is_gift_idea) values
('Oud Sultan', 'oud-sultan', 'OUDÉ Selection', 'published', 89, 12, 'Oud caldo e regale con ambra, spezie scure e legno levigato.', array['Zafferano','Pepe rosa'], array['Oud','Rosa damascena'], array['Ambra','Sandalo'], 'Intenso', '8-10 ore', 'unisex', array['bestseller','luxury'], true, true, false, false),
('Musk Al Tahara', 'musk-al-tahara', 'Maison D’Oriente', 'published', 34, 30, 'Musk bianco pulito, cremoso e delicato.', array['Cotone bianco'], array['Musk puro'], array['Vaniglia chiara','Talco'], 'Morbido', '5-7 ore', 'unisex', array['nuovo','daily'], true, false, true, false),
('Amber Night', 'amber-night', 'OUDÉ Selection', 'published', 59, 9, 'Ambra resinosa, vaniglia scura e spezie dolci da sera.', array['Cannella','Dattero'], array['Ambra'], array['Vaniglia','Benzoino'], 'Caldo', '7-9 ore', 'unisex', array['sera','gift'], true, false, false, true);
