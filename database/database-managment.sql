-- Create database
CREATE DATABASE CadetDatabase;

-- Join database
USE CadetDatabase;

-- Create the user 'admin' with password 'admin'
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
-- Grant all privileges to the user on the CadetDatabase
GRANT ALL PRIVILEGES ON CadetDatabase.* TO 'admin'@'localhost';
-- Apply the changes
FLUSH PRIVILEGES;

