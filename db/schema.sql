--   * Create the `burgers_db`.
--   * Switch to or use the `burgers_db`.
--   * Create a `burgers` table with these fields:
--     * **id**: an auto incrementing int that serves as the primary key.
--     * **burger_name**: a string.
--     * **devoured**: a boolean.


CREATE DATABASE IF NOT EXISTS BURGER_DB;

USE BURGER_DB;

DROP TABLE `burgers`;

DROP TABLE `burgers`;


CREATE TABLE `burgers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `BURGER_NAME` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `WINNER_NAME` varchar(100) COLLATE utf8_unicode_ci NULL,
  `DEVOURED` tinyint(1) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


DELETE from burgers;

Select * from burgers;