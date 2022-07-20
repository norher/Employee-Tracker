USE employee_db;

INSERT IGNORE INTO department (name)
VALUES ('Administration'),
    ('Teaching'),
    ('Counseling'),
    ('Maintenance');

INSERT IGNORE INTO role (title, salary, department_id)
VALUES ('Headmaster', 150000, 1), 
    ('House Head', 125000, 1),
    ('Dark Arts Instructor', 115000, 2),
    ('Muggle Studies', 10000, 3),
    ('Carataker', 85000, 4),
    ('Librarian', 85000, 4),
    ('Teacher', 110000, 2),
    ('Potions Instructor', 95000, 3),
    ('Matron', 110000, 1);

INSERT IGNORE INTO employee (first_name, last_name, role_id)
VALUES ("Albus", "Dumbledore", 1),
     ("Alastor", "Moody", 3),
     ("Algus", "Filch", 5),
     ("Cuthbert", "Binns", 4),
     ("Dolores", "Umbridge", 3),
     ("Gilderoy", "Lockhart", 3),
     ("Horace", "Slughorn", 8),
     ("Irma", "Prince", 6),
     ("Minerva", "McGonagall", 2),
     ("Pomona", "Sprout", 7),
     ("Poppy", "Pomfrey", 9),
     ("Remus", "Lupin", 3),
     ("Rolanda", "Hooch", 7),
     ("Rebeus", "Hagrid", 5),
     ("Severus", "Snape", 2);