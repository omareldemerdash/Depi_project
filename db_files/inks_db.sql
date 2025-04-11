-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 06, 2023 at 02:14 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inks_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `adds`
--

DROP TABLE IF EXISTS `adds`;
CREATE TABLE IF NOT EXISTS `adds` (
  `Add_id` int NOT NULL AUTO_INCREMENT,
  `Add_quantity` int NOT NULL,
  `Ink_id` int DEFAULT NULL,
  `Add_time` datetime NOT NULL,
  PRIMARY KEY (`Add_id`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adds`
--

INSERT INTO `adds` (`Add_id`, `Add_quantity`, `Ink_id`, `Add_time`) VALUES
(34, 1, 1, '2023-08-02 12:38:20'),
(33, 1, 9, '2023-08-02 12:37:05'),
(32, 1, 5, '2023-08-02 11:28:35'),
(31, 8, 1, '2023-08-01 17:03:46'),
(30, 5, 2, '2023-08-01 10:35:36'),
(29, 3, 9, '2023-07-31 17:19:06'),
(28, 2, 8, '2023-07-31 17:18:51'),
(27, 2, 6, '2021-12-15 17:18:32'),
(26, 3, 1, '2021-07-01 17:16:30'),
(35, 1, 1, '2023-08-02 12:42:37'),
(36, 10, 1, '2023-08-02 12:45:18'),
(37, 2, 2, '2023-08-02 12:51:38'),
(38, 1, 9, '2023-08-02 12:53:29'),
(39, 1, 6, '2023-08-02 12:59:14'),
(40, 2, 3, '2023-08-02 13:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `Department_id` int NOT NULL AUTO_INCREMENT,
  `Department_name` varchar(40) NOT NULL,
  PRIMARY KEY (`Department_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`Department_id`, `Department_name`) VALUES
(1, 'IT'),
(2, 'PUR'),
(3, 'FINANCE'),
(4, 'OPERATION');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `Employee_id` int NOT NULL AUTO_INCREMENT,
  `Employee_name` varchar(40) NOT NULL,
  `Department_id` int DEFAULT NULL,
  PRIMARY KEY (`Employee_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`Employee_id`, `Employee_name`, `Department_id`) VALUES
(1, 'Mohamed Saad', 1),
(2, 'Yasser Elsawy', 2),
(3, 'Amr Mamdouh', 3),
(4, 'Ismail Shokry', 4),
(5, 'Mahmoud Shawkat', 1);

-- --------------------------------------------------------

--
-- Table structure for table `employees_printers`
--

DROP TABLE IF EXISTS `employees_printers`;
CREATE TABLE IF NOT EXISTS `employees_printers` (
  `Employee_id` int DEFAULT NULL,
  `Printer_id` int DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees_printers`
--

INSERT INTO `employees_printers` (`Employee_id`, `Printer_id`) VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Table structure for table `inks`
--

DROP TABLE IF EXISTS `inks`;
CREATE TABLE IF NOT EXISTS `inks` (
  `Ink_id` int NOT NULL AUTO_INCREMENT,
  `Ink_model` varchar(40) NOT NULL,
  `Start_quantity` int NOT NULL,
  `Now_quantity` int NOT NULL,
  `Printer_id` int DEFAULT NULL,
  `Total_requests` tinyint NOT NULL DEFAULT '0',
  `Total_adds` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`Ink_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inks`
--

INSERT INTO `inks` (`Ink_id`, `Ink_model`, `Start_quantity`, `Now_quantity`, `Printer_id`, `Total_requests`, `Total_adds`) VALUES
(1, 'CE741A', 10, 14, 1, -19, 23),
(2, 'CE742A', 5, 7, 1, -5, 7),
(3, 'CE743A', 5, 5, 1, -2, 2),
(4, 'CE744A', 6, 6, 1, 0, 0),
(5, 'GT51', 8, 7, 2, -2, 1),
(6, 'GT52', 6, 8, 2, -1, 3),
(7, 'GT53', 9, 9, 2, 0, 0),
(8, 'DRUM5325', 7, 8, 3, -1, 2),
(9, 'TONER5325', 4, 9, 3, 0, 5);

-- --------------------------------------------------------

--
-- Table structure for table `printers`
--

DROP TABLE IF EXISTS `printers`;
CREATE TABLE IF NOT EXISTS `printers` (
  `Printer_id` int NOT NULL AUTO_INCREMENT,
  `Printer_model` varchar(40) NOT NULL,
  PRIMARY KEY (`Printer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `printers`
--

INSERT INTO `printers` (`Printer_id`, `Printer_model`) VALUES
(1, 'Hp Color laserjet 5225'),
(2, 'Hp Smart Tank 515'),
(3, 'Xerox Workcenter 5325');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
CREATE TABLE IF NOT EXISTS `requests` (
  `Request_id` int NOT NULL AUTO_INCREMENT,
  `Employee_id` int DEFAULT NULL,
  `Printer_id` int DEFAULT NULL,
  `Ink_id` int DEFAULT NULL,
  `Request_quantity` int NOT NULL,
  `Request_time` datetime NOT NULL,
  PRIMARY KEY (`Request_id`)
) ENGINE=MyISAM AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`Request_id`, `Employee_id`, `Printer_id`, `Ink_id`, `Request_quantity`, `Request_time`) VALUES
(100, 1, 1, 3, 2, '2023-08-02 14:01:13'),
(99, 5, 1, 1, 5, '2023-08-02 13:34:20'),
(98, 4, 3, 8, 1, '2023-08-02 12:34:03'),
(97, 1, 1, 1, 1, '2023-08-02 11:45:22'),
(96, 2, 2, 6, 1, '2023-08-02 11:32:14'),
(95, 1, 1, 1, 1, '2023-08-02 11:25:27'),
(94, 1, 1, 1, 10, '2023-08-01 16:59:38'),
(93, 1, 1, 2, 5, '2023-08-01 10:34:47'),
(92, 2, 2, 5, 2, '2023-07-31 17:18:18'),
(91, 1, 1, 1, 2, '2022-08-03 17:15:45');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
