-- Insertar usuarios ficticios
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@lacocinajose.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9ovi/9DZT9MxW.', 'ADMIN'),
('John Doe', 'john@example.com', '$2a$10$Xl5U6Fq6Dh5ZBLpnYfzrNe2ZOzQKA0Txr0wgEPOGqOeNs7KV5jXdC', 'COMMON'),
('Jane Smith', 'jane@example.com', '$2a$10$vQcjA2ldgTOpY.Hn8sNOFOUy0Oi0zYNBVdgw5Dj9nqSUu4Uyv0wr2', 'COMMON');

-- Insertar categorías ficticias
INSERT INTO categories (name) VALUES
('Entradas'),
('Platos principales'),
('Postres');

-- Insertar productos ficticios
INSERT INTO products (name, description, price, category_id, image_url) VALUES
('Empanadas', 'Deliciosas empanadas de carne', 500.00, 1, 'https://example.com/empanadas.jpg'),
('Milanesa con puré', 'Clásica milanesa con puré de papas', 1200.00, 2, 'https://example.com/milanesa.jpg'),
('Flan casero', 'Suave flan con dulce de leche y crema', 600.00, 3, 'https://example.com/flan.jpg'),
('Ensalada César', 'Fresca ensalada con pollo grillado', 800.00, 1, 'https://example.com/ensalada.jpg'),
('Asado', 'Tradicional asado argentino', 1800.00, 2, 'https://example.com/asado.jpg'),
('Tiramisú', 'Clásico postre italiano', 700.00, 3, 'https://example.com/tiramisu.jpg');