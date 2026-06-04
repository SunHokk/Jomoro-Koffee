-- ============================================
-- DATABASE: jomoro_koffee
-- Project: Jomoro Koffee - COSC6093
-- ============================================

CREATE DATABASE IF NOT EXISTS jomoro_koffee;
USE jomoro_koffee;

-- ============================================
-- AUTH SERVICE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id          INT             NOT NULL AUTO_INCREMENT,
    first_name  VARCHAR(255)    NOT NULL,
    last_name   VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    password    VARCHAR(255)    NOT NULL,
    role        VARCHAR(25)     NOT NULL,
    PRIMARY KEY (id)
);

-- ============================================
-- PRODUCT SERVICE
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
    id      INT             NOT NULL AUTO_INCREMENT,
    name    VARCHAR(255)    NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS products (
    id          INT             NOT NULL AUTO_INCREMENT,
    name        VARCHAR(255)    NOT NULL,
    description VARCHAR(255)    NOT NULL,
    price       DOUBLE          NOT NULL,
    stock       INT             NOT NULL,
    image_url   VARCHAR(255)    NULL,
    category_id INT             NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ============================================
-- TRANSACTION SERVICE
-- ============================================

CREATE TABLE IF NOT EXISTS carts (
    id      INT     NOT NULL AUTO_INCREMENT,
    user_id INT     NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id          INT     NOT NULL AUTO_INCREMENT,
    cart_id     INT     NOT NULL,
    product_id  INT     NOT NULL,
    quantity    INT     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (cart_id) REFERENCES carts(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id          INT         NOT NULL AUTO_INCREMENT,
    user_id     INT         NOT NULL,
    created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS order_details (
    id          INT     NOT NULL AUTO_INCREMENT,
    order_id    INT     NOT NULL,
    product_id  INT     NOT NULL,
    price       DOUBLE  NOT NULL,
    quantity    INT     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

