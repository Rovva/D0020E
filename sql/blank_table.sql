-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jan 21, 2018 at 11:01 AM
-- Server version: 8.0.3-rc-log
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db`
--

-- --------------------------------------------------------

--
-- Table structure for table `datareceiver_roadeyedata`
--

CREATE TABLE `datareceiver_roadeyedata` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp NULL DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `surface_condition` int(11) DEFAULT NULL,
  `signal1` int(11) DEFAULT NULL,
  `signal2` int(11) DEFAULT NULL,
  `signal3` int(11) DEFAULT NULL,
  `friction` float DEFAULT NULL,
  `road_temperature` float DEFAULT NULL,
  `air_temperature` float DEFAULT NULL,
  `air_humidity` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `datareceiver_roadeyedata`
--
ALTER TABLE `datareceiver_roadeyedata`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `datareceiver_roadeyedata`
--
ALTER TABLE `datareceiver_roadeyedata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
