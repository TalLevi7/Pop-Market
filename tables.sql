-- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15), -- Optional
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pop Catalog Table
CREATE TABLE pop_catalog (
    pop_id INT AUTO_INCREMENT PRIMARY KEY,
    pop_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., sports, anime, etc.
    sub_category VARCHAR(50) NOT NULL, -- e.g., basketball, One Piece
    picture VARCHAR(255) -- URL or path to the picture
);

-- 3. Market Table
CREATE TABLE market (
    market_id INT AUTO_INCREMENT PRIMARY KEY,
    pop_id INT NOT NULL, -- From pop_catalog
    seller_id INT NOT NULL, -- From users
    price DECIMAL(10, 2) NOT NULL,
    date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    market_picture VARCHAR(255), -- Optional: a picture of the specific pop being sold
    details TEXT, -- Optional: seller's description of the item
    FOREIGN KEY (pop_id) REFERENCES pop_catalog(pop_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Personal Collection Table
CREATE TABLE personal_collection (
    collection_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- From users
    pop_id INT NOT NULL, -- From pop_catalog
    acquired_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the pop was added to the collection
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pop_id) REFERENCES pop_catalog(pop_id) ON DELETE CASCADE
);

-- 5. Wishlist Table
CREATE TABLE wishlist (
    wish_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- From users
    pop_id INT NOT NULL, -- From pop_catalog
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the pop was added to the wishlist
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (pop_id) REFERENCES pop_catalog(pop_id) ON DELETE CASCADE
);

-- 6. Market Feedback Table
CREATE TABLE market_feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    market_id INT NOT NULL,  -- The transaction being reviewed
    buyer_id INT NOT NULL,  -- The user giving feedback
    seller_id INT NOT NULL,  -- The user receiving feedback
    rating TINYINT CHECK (rating BETWEEN 1 AND 5) NOT NULL,  -- 1-5 stars rating
    review TEXT,  -- Optional written review
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the feedback was given
    FOREIGN KEY (market_id) REFERENCES market(market_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE CASCADE
);
