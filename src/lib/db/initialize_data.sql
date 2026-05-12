-- =============================================================================
-- ReviewIT Database Initialization Script
-- =============================================================================
-- This script populates the database with sample data for development and
-- testing. Each table contains at least 15 entries with all fields populated
-- (no NULL values in required fields).
--
-- IMPORTANT: Run create_schema.sql first to create the database structure.
--
-- Run this script with:
--   psql $DATABASE_URL -f src/lib/db/initialize_data.sql
--
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Insert Users (15 entries)
-- -----------------------------------------------------------------------------
-- Password for all users is 'password123' (bcrypt hash: $2a$10$xVqKJd3f...)
-- In production, use proper bcrypt hashes generated with bcrypt library.
-- This uses a consistent hash for demonstration purposes only.

INSERT INTO users (email, username, password_hash) VALUES
  ('alice@example.com', 'alice', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('bob@example.com', 'bob', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('charlie@example.com', 'charlie', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('diana@example.com', 'diana', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('evan@example.com', 'evan', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('fiona@example.com', 'fiona', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('george@example.com', 'george', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('hannah@example.com', 'hannah', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('ivan@example.com', 'ivan', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('julia@example.com', 'julia', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('kevin@example.com', 'kevin', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('lisa@example.com', 'lisa', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('mike@example.com', 'mike', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('nancy@example.com', 'nancy', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8'),
  ('oscar@example.com', 'oscar', '$2a$10$xVqKJd3fEhXvKqjJjEHhXuWZyDxJ5G5YvHGQZ5hH8h8h8h8h8h8h8')
ON CONFLICT (email) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Insert Categories (15 entries)
-- -----------------------------------------------------------------------------

INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Devices and gadgets like phones, laptops, and accessories'),
  ('Restaurants', 'Places to eat dining out or order delivery'),
  ('Movies', 'Feature films and theatrical releases'),
  ('Books', 'Fiction and non-fiction literature'),
  ('Video Games', 'Interactive entertainment software'),
  ('Hotels', 'Accommodations and lodging options'),
  ('Airlines', 'Commercial airlines and flight services'),
  ('Music', 'Albums, singles, and musical artists'),
  ('TV Shows', 'Television series and streaming shows'),
  ('Software', 'Applications and computer programs'),
  ('Fitness', 'Gym equipment and fitness services'),
  ('Automobiles', 'Cars, motorcycles, and vehicles'),
  ('Beauty', 'Skincare, makeup, and personal care products'),
  ('Sports', 'Professional and amateur sports teams'),
  ('Travel', 'Travel destinations and tourism')
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Insert Items (20 entries)
-- -----------------------------------------------------------------------------

INSERT INTO items (name, description, category_id, created_by) VALUES
  ('iPhone 15 Pro', 'The latest flagship phone from Apple with A17 chip and titanium design', 1, 1),
  ('MacBook Air M3', 'Lightweight laptop with Apple Silicon for exceptional performance', 1, 1),
  ('Samsung Galaxy S24', 'Premium Android smartphone with advanced AI features', 1, 2),
  ('Sony WH-1000XM5', 'Premium noise-canceling wireless headphones', 1, 3),
  ('The Cheesecake Factory', 'Wide variety of dishes in a casual dining atmosphere', 2, 2),
  ('In-N-Out Burger', 'Classic California burger joint with secret menu', 2, 2),
  ('Shake Shack', 'Fast-casual burger chain known for quality ingredients', 2, 3),
  ('Chipotle', 'Mexican grill offering burritos, bowls, and tacos', 2, 4),
  ('Oppenheimer', 'Christopher Nolan biographical drama about the father of the atomic bomb', 3, 1),
  ('Dune: Part Two', 'Epic sci-fi sequel continuing the story of Paul Atreides', 3, 2),
  ('Barbie', 'Greta Gerwig film exploring the iconic doll world', 3, 3),
  ('The Batman', 'Matt Reeves dark reimagining of the iconic superhero', 3, 4),
  ('Project Hail Mary', 'Andy Weir science fiction novel about space exploration', 4, 1),
  ('Atomic Habits', 'James Clear book on building good habits and breaking bad ones', 4, 2),
  ('The Midnight Library', 'Matt Haig novel about choices and parallel lives', 4, 3),
  ('Educated', 'Tara Westover memoir about escaping a survivalist family', 4, 4),
  ('The Legend of Zelda', 'Nintendo action-adventure game for Switch', 5, 1),
  ('Baldurs Gate 3', 'RPG game of the year with deep narrative and character customization', 5, 3),
  ('Elden Ring', 'Open-world action RPG from FromSoftware', 5, 4),
  ('Minecraft', 'Sandbox game with infinite creativity and exploration', 5, 5)
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- Insert Reviews (20 entries)
-- -----------------------------------------------------------------------------

INSERT INTO reviews (item_id, user_id, rating, title, body) VALUES
  -- iPhone 15 Pro reviews
  (1, 2, 5, 'Best iPhone yet', 'The titanium build makes it so light and the camera is incredible.'),
  (1, 3, 4, 'Great phone expensive', 'Amazing performance but the price is tough to justify.'),
  (1, 4, 5, 'Worth the upgrade', 'Upgraded from 13 and the difference is night and day.'),
  (1, 5, 3, 'Good but not great', 'Solid phone but feels like a minor iteration.'),

  -- MacBook Air M3 reviews
  (2, 2, 5, 'Perfect laptop for work', 'Battery lasts all day and the M3 chip handles everything.'),
  (2, 6, 5, 'Best MacBook value', 'Powerful enough for development and the price is right.'),
  (2, 7, 4, 'Great but limited ports', 'Performance is amazing but I wish it had more ports.'),

  -- Samsung Galaxy S24 reviews
  (3, 3, 4, 'Excellent Android phone', 'Best Android experience with great camera.'),
  (3, 8, 5, 'Best Samsung yet', 'AI features are actually useful and the screen is beautiful.'),

  -- Sony WH-1000XM5 reviews
  (4, 1, 5, 'Best noise canceling ever', 'These headphones are incredible for travel and focus.'),
  (4, 9, 4, 'Great but pricey', 'Amazing sound quality but very expensive.'),
  (4, 10, 5, 'Worth every penny', 'Best headphones I have ever owned.'),

  -- The Cheesecake Factory reviews
  (5, 1, 4, 'Good food long wait', 'The menu is huge and options are great but expect to wait.'),
  (5, 3, 3, 'Overpriced for quality', 'Food is okay but not worth the premium prices.'),
  (5, 11, 4, 'Consistent quality', 'Always reliable and the portions are generous.'),

  -- In-N-Out Burger reviews
  (6, 1, 5, 'Best burger for the price', 'Fresh ingredients and amazing secret sauce.'),
  (6, 12, 5, 'California staple', 'Nothing beats a fresh animal style burger.'),
  (6, 13, 4, 'Simple and delicious', 'Not fancy but everything is fresh and tasty.'),

  -- Oppenheimer reviews
  (7, 2, 5, 'A masterpiece of cinema', 'Cillian Murphy delivers an Oscar-worthy performance.'),
  (7, 3, 4, 'Intense and thought-provoking', 'Not an easy watch but very important story.'),
  (7, 14, 5, 'Must see in theaters', 'The visual and audio experience is incredible.'),

  -- Dune Part Two reviews
  (8, 1, 5, 'Even better than the first', 'The scale and visuals are mind-blowing.'),
  (8, 15, 5, 'Epic filmmaking', 'A rare sequel that exceeds the original.'),
  (8, 4, 4, 'Masterful adaptation', 'Faithful to the book and visually stunning.'),

  -- Project Hail Mary reviews
  (9, 3, 5, 'Another winner from Andy Weir', 'Science feels real and the story is engaging.'),
  (9, 5, 4, 'Great sci-fi read', 'Educational and entertaining at the same time.'),

  -- Atomic Habits reviews
  (10, 1, 5, 'Life-changing book', 'The 1% better concept has transformed my approach.'),
  (10, 3, 4, 'Practical and useful', 'Actionable advice without the fluff.'),

  -- The Legend of Zelda reviews
  (11, 2, 5, 'Nintendo at its best', 'The open world is incredible and there is so much to discover.'),
  (11, 6, 5, 'Perfect game', 'A new standard for open world games.'),

  -- Baldurs Gate 3 reviews
  (12, 1, 5, 'The RPG of the generation', 'Unprecedented player freedom and storytelling.'),
  (12, 7, 5, 'A triumph of gaming', 'This is what games should be.'),

  -- Elden Ring reviews
  (13, 4, 5, 'FromSoftware at peak', 'Challenging but fair with incredible world design.'),
  (13, 8, 4, 'Beautiful and brutal', 'Great game but very difficult for casual players.'),

  -- Minecraft reviews
  (14, 9, 5, 'Endless creativity', 'The only game I keep coming back to after all these years.'),
  (14, 10, 5, 'Timeless classic', 'Simple yet infinitely deep gameplay.')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- Verify Data Insertion
-- -----------------------------------------------------------------------------

SELECT 'Users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Items', COUNT(*) FROM items
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;

-- =============================================================================
-- End of Initialization Data
-- =============================================================================