BEGIN;
TRUNCATE pakd_users,
pakd_lists,
pakd_templates,
pakd_list_items,
pakd_template_items RESTART IDENTITY CASCADE;
INSERT INTO pakd_users (id, username, first_name, last_name, password)
VALUES
  (
    '8de080e8-92f6-4689-a671-2f3a256eeb83',
    'dunder',
    'Dunder',
    'Mifflin',
    '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne'
  ),
  (
    'df593d1a-212e-407f-a46d-464800e8c1be',
    'b.deboop',
    'Bodeep Deboop',
    'Bo',
    '$2a$12$VQ5HgWm34QQK2rJyLc0lmu59cy2jcZiV6U1.bE8rBBnC9VxDf/YQO'
  ),
  (
    '983cdfb1-aab9-4de4-b81a-4bf1b3640235',
    'c.bloggs',
    'Charlie Bloggs',
    'Charlie',
    '$2a$12$2fv9OPgM07xGnhDbyL6xsuAeQjAYpZx/3V2dnu0XNIR27gTeiK2gK'
  ),
  (
    '34a215f5-bb7d-41fd-bf26-890108a8fa83',
    's.smith',
    'Sam Smith',
    'Sam',
    '$2a$12$/4P5/ylaB7qur/McgrEKwuCy.3JZ6W.cRtqxiJsYCdhr89V4Z3rp.'
  ),
  (
    'ba464bf9-2fbd-418e-8080-e462de8543d6',
    'lexlor',
    'Alex Taylor',
    'Lex',
    '$2a$12$Hq9pfcWWvnzZ8x8HqJotveRHLD13ceS7DDbrs18LpK6rfj4iftNw.'
  ),
  (
    '6a583bf6-e06b-46ce-94bd-0d3b410ce521',
    'wippy',
    'Ping Won In',
    'Ping',
    '$2a$12$ntGOlTLG5nEXYgDVqk4bPejBoJP65HfH2JEMc1JBpXaVjXo5RsTUu'
  );
INSERT INTO pakd_lists (id, name, user_id)
VALUES
  (
    '523420ad-8c59-4a18-941a-9bb1392b63ee',
    'Weekend Camping Trip',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    'c0bdbe48-71dd-46de-a686-088a5f3de784',
    'School Daypack',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    'c60f7338-7279-42e1-a72b-2ce3d47af657',
    'Wedding Photo Shoot',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    'cb92504d-a8f0-4409-aaa0-d5d95562c096',
    'Work Presentation',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4',
    'Surfing Trip',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  );
INSERT INTO pakd_templates (id, name, user_id)
VALUES
  (
    '494fca8d-e68b-410f-a132-6244fe0c7f8c',
    'Overnight Trip',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    '553fd36b-c93e-46cc-a75a-bbc22b99f820',
    'Daily Necessities',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    'c9c40c29-1013-4642-a4d2-e6e05eac66c4',
    'Photography Gig-Basic Package',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    '194bd5ae-26f0-486a-ad79-368b57d4b90a',
    'Computer Bag',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  ),
  (
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67',
    'Beach Trip',
    '8de080e8-92f6-4689-a671-2f3a256eeb83'
  );
INSERT INTO pakd_list_items (name, packed, list_id)
VALUES
  (
    'Wood',
    false,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Hiking Boots',
    false,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Jacket',
    false,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Chocolate',
    false,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Graham Crackers',
    false,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Marshmallows',
    true,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Sleeping Bag',
    true,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Outdoor Speaker',
    true,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Ukelele',
    true,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Tent',
    true,
    '523420ad-8c59-4a18-941a-9bb1392b63ee'
  ),
  (
    'Laptop',
    true,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'Laptop Charger',
    false,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'External Battery Pack',
    true,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'Headphones',
    true,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'Lunch',
    false,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'Calculator',
    false,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'Calculus Book',
    false,
    'c0bdbe48-71dd-46de-a686-088a5f3de784'
  ),
  (
    'Camera',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Lens 1',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Lens 2',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Wide-angle Lens Adapter',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    '3 Camera Batteries',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Camcorder',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Backdrop',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Backlight',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Umberlla',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Tripod',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Flash',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Lenscap',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Remote',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Map of area',
    false,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Gimbal',
    true,
    'c60f7338-7279-42e1-a72b-2ce3d47af657'
  ),
  (
    'Laptop',
    false,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Projector',
    false,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'HDMI Cable',
    true,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Flash Drive',
    false,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Laptop Charger',
    true,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Projector Screen',
    false,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Presentation Remote',
    true,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Laptop Stand',
    false,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Pens',
    true,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'iPad',
    true,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Notebook',
    false,
    'cb92504d-a8f0-4409-aaa0-d5d95562c096'
  ),
  (
    'Surfboard',
    false,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Fishing Pole',
    false,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Swim Trunks',
    true,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Sunscreen',
    true,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Flip-flops',
    false,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Hat',
    true,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Towel',
    false,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  ),
  (
    'Goggles',
    true,
    'fae5a7a6-afd7-4013-9b4b-b888dae4dbb4'
  );
INSERT INTO pakd_template_items (name, template_id)
VALUES
  ('Shoes', '494fca8d-e68b-410f-a132-6244fe0c7f8c'),
  ('Socks', '494fca8d-e68b-410f-a132-6244fe0c7f8c'),
  ('Shirt', '494fca8d-e68b-410f-a132-6244fe0c7f8c'),
  ('Pants', '494fca8d-e68b-410f-a132-6244fe0c7f8c'),
  ('Jacket', '494fca8d-e68b-410f-a132-6244fe0c7f8c'),
  ('Laptop', '553fd36b-c93e-46cc-a75a-bbc22b99f820'),
  (
    'Laptop Charger',
    '553fd36b-c93e-46cc-a75a-bbc22b99f820'
  ),
  (
    'Phone Charger',
    '553fd36b-c93e-46cc-a75a-bbc22b99f820'
  ),
  (
    'Headphones',
    '553fd36b-c93e-46cc-a75a-bbc22b99f820'
  ),
  (
    'External Battery',
    '553fd36b-c93e-46cc-a75a-bbc22b99f820'
  ),
  ('Lunch', '553fd36b-c93e-46cc-a75a-bbc22b99f820'),
  ('Lens', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  ('Camera', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  ('Tripod', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  (
    'Exra Batteries',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  (
    'Extra Memory Cards',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  ('Remote', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  (
    'Backlighting',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  ('Laptop', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  (
    'Headphones',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  ('iPad', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  (
    'Phone Charger',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  ('Pens', '194bd5ae-26f0-486a-ad79-368b57d4b90a'),
  (
    'Notebook',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  (
    'Flash Drive',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  (
    'USB-C Adapter',
    '194bd5ae-26f0-486a-ad79-368b57d4b90a'
  ),
  (
    'Swim Trunks',
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'
  ),
  (
    'Flip Flops',
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'
  ),
  ('Towel', '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'),
  (
    'Sunscreen',
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'
  ),
  (
    'Umbrella',
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'
  ),
  ('Camera', '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'),
  ('Cooler', '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'),
  (
    'Firewood',
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'
  ),
  (
    'Rechargeable Speaker',
    '83fa0b55-81c8-4ffc-9d0b-9f68592d0f67'
  );
COMMIT;