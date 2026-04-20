-- ReviewIT Sample Data Seed Script
-- Run with: psql $DATABASE_URL -f src/lib/db/seed.sql

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Devices and gadgets like phones, laptops, and accessories'),
  ('Restaurants', 'Places to eat dining out or order delivery'),
  ('Movies', 'Feature films and theatrical releases'),
  ('Books', 'Fiction and non-fiction literature'),
  ('Video Games', 'Interactive entertainment software')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users (password is 'password123' hashed with bcrypt)
-- Using a simple hash for demo purposes - in production use proper bcrypt
INSERT INTO users (email, username, password_hash) VALUES
  ('alice@example.com', 'alice', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('bob@example.com', 'bob', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('charlie@example.com', 'charlie', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8')
ON CONFLICT (email) DO NOTHING;

-- Insert sample items
INSERT INTO items (name, description, category_id, created_by) VALUES
  ('iPhone 15 Pro', 'The latest flagship phone from Apple with A17 chip and titanium design', 1, 1),
  ('MacBook Air M3', 'Lightweight laptop with Apple Silicon for exceptional performance', 1, 1),
  ('The Cheesecake Factory', 'Wide variety of dishes in a casual dining atmosphere', 2, 2),
  ('In-N-Out Burger', 'Classic California burger joint with secret menu', 2, 2),
  ('Oppenheimer', 'Christopher Nolan biographical drama about the father of the atomic bomb', 3, 1),
  ('Dune: Part Two', 'Epic sci-fi sequel continuing the story of Paul Atreides', 3, 2),
  ('Project Hail Mary', 'Andy Weir science fiction novel about space exploration', 4, 1),
  ('Atomic Habits', 'James Clear book on building good habits and breaking bad ones', 4, 2),
  ('The Legend of Zelda', 'Nintendo action-adventure game for Switch', 5, 1),
  ('Baldur''s Gate 3', 'RPG game of the year with deep narrative and character customization', 5, 3)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (item_id, user_id, rating, title, body) VALUES
  -- iPhone 15 Pro reviews
  (1, 2, 5, 'Best iPhone yet!', 'The titanium build makes it so light and the camera is incredible.'),
  (1, 3, 4, 'Great phone, expensive', 'Amazing performance but the price is tough to justify.'),
  
  -- MacBook Air M3 reviews
  (2, 2, 5, 'Perfect laptop for work', 'Battery lasts all day and the M3 chip handles everything seamlessly.'),
  
  -- The Cheesecake Factory reviews
  (3, 1, 4, 'Good food, long wait', 'The menu is huge and options are great but expect to wait.'),
  (3, 3, 3, 'Overpriced for quality', 'Food is okay but not worth the premium prices.'),
  
  -- In-N-Out Burger reviews
  (4, 1, 5, 'Best burger for the price', 'Fresh ingredients and amazing secret sauce. A California staple.'),
  
  -- Oppenheimer reviews
  (5, 2, 5, 'A masterpiece of cinema', 'Cillian Murphy delivers an Oscar-worthy performance. Must watch.'),
  (5, 3, 4, 'Intense and thought-provoking', 'Not an easy watch but very important story told brilliantly.'),
  
  -- Dune: Part Two reviews
  (6, 1, 5, 'Even better than the first!', 'The scale and visuals are mind-blowing. Zendaya is perfect.'),
  
  -- Project Hail Mary reviews
  (7, 3, 5, 'Another winner from Andy Weir', 'Science feels real and the story is so engaging. Couldnt put it down.'),
  
  -- Atomic Habits reviews
  (8, 1, 5, 'Life-changing book', 'The 1% better every day concept has genuinely transformed my approach.'),
  (8, 3, 4, 'Practical and useful', 'Actionable advice without the fluff. Highly recommend.'),
  
  -- The Legend of Zelda reviews
  (9, 2, 5, 'Nintendo at its best', 'The open world is incredible and there is so much to discover. Perfect game.'),
  
  -- Baldur's Gate 3 reviews
  (10, 1, 5, 'The RPG of the generation', 'Unprecedented player freedom and storytelling. A triumph of gaming.')
ON CONFLICT (item_id, user_id) DO NOTHING;

-- Verify data was inserted
SELECT 'Categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Items', COUNT(*) FROM items
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;