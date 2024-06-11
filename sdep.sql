-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Jun 11, 2024 at 05:20 PM
-- Server version: 8.0.30
-- PHP Version: 8.0.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sdep`
--

-- --------------------------------------------------------

--
-- Table structure for table `macchine`
--

CREATE TABLE `macchine` (
  `id` int NOT NULL,
  `marca` varchar(40) NOT NULL,
  `modello` varchar(40) NOT NULL,
  `descrizione` varchar(500) NOT NULL,
  `anno` int NOT NULL,
  `kilometri` int NOT NULL,
  `stato` varchar(10) NOT NULL,
  `prezzo` int NOT NULL,
  `venditore` varchar(50) NOT NULL,
  `venduta` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `macchine`
--

INSERT INTO `macchine` (`id`, `marca`, `modello`, `descrizione`, `anno`, `kilometri`, `stato`, `prezzo`, `venditore`, `venduta`) VALUES
(1, 'FIAT', 'Punto', 'Bellissima punto rosa shock in vendita', 1995, 450000, 'nuova', 25000, 'antonio', 1);

-- --------------------------------------------------------

--
-- Table structure for table `ricambi`
--

CREATE TABLE `ricambi` (
  `id` int NOT NULL,
  `marca` varchar(40) NOT NULL,
  `modello` varchar(40) NOT NULL,
  `descrizione` varchar(500) NOT NULL,
  `stato` varchar(10) NOT NULL,
  `prezzo` int NOT NULL,
  `venduta` int NOT NULL,
  `venditore` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ricambi`
--

INSERT INTO `ricambi` (`id`, `marca`, `modello`, `descrizione`, `stato`, `prezzo`, `venduta`, `venditore`) VALUES
(1, 'ALFA ROMEO', 'GIulietta', 'è un tubo', 'usato', 500, 0, 'antonio');

-- --------------------------------------------------------

--
-- Table structure for table `transazioni`
--

CREATE TABLE `transazioni` (
  `id` int NOT NULL,
  `venditore` varchar(50) NOT NULL,
  `cliente` varchar(50) NOT NULL,
  `id-macchine-vendita` int DEFAULT NULL,
  `id-ricambi-vendita` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transazioni`
--

INSERT INTO `transazioni` (`id`, `venditore`, `cliente`, `id-macchine-vendita`, `id-ricambi-vendita`) VALUES
(1, 'antonio', 'mario', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `clientevenditore` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `password`, `clientevenditore`) VALUES
('antonio', 'antonio', 'venditore'),
('mario', 'mario', 'cliente');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `macchine`
--
ALTER TABLE `macchine`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venditore` (`venditore`);

--
-- Indexes for table `ricambi`
--
ALTER TABLE `ricambi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venditore` (`venditore`);

--
-- Indexes for table `transazioni`
--
ALTER TABLE `transazioni`
  ADD PRIMARY KEY (`id`),
  ADD KEY `venditore` (`venditore`),
  ADD KEY `cliente` (`cliente`),
  ADD KEY `id-macchine-vendita` (`id-macchine-vendita`),
  ADD KEY `id-ricambi-vendita` (`id-ricambi-vendita`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `macchine`
--
ALTER TABLE `macchine`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ricambi`
--
ALTER TABLE `ricambi`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transazioni`
--
ALTER TABLE `transazioni`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `macchine`
--
ALTER TABLE `macchine`
  ADD CONSTRAINT `macchine_ibfk_1` FOREIGN KEY (`venditore`) REFERENCES `user` (`username`);

--
-- Constraints for table `ricambi`
--
ALTER TABLE `ricambi`
  ADD CONSTRAINT `ricambi_ibfk_1` FOREIGN KEY (`venditore`) REFERENCES `user` (`username`);

--
-- Constraints for table `transazioni`
--
ALTER TABLE `transazioni`
  ADD CONSTRAINT `transazioni_ibfk_1` FOREIGN KEY (`venditore`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `transazioni_ibfk_2` FOREIGN KEY (`cliente`) REFERENCES `user` (`username`),
  ADD CONSTRAINT `transazioni_ibfk_3` FOREIGN KEY (`id-macchine-vendita`) REFERENCES `macchine` (`id`),
  ADD CONSTRAINT `transazioni_ibfk_4` FOREIGN KEY (`id-ricambi-vendita`) REFERENCES `ricambi` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
