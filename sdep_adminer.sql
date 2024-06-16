-- Adminer 4.8.1 MySQL 11.4.2-MariaDB-ubu2404 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

CREATE DATABASE `sdep` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `sdep`;

DROP TABLE IF EXISTS `macchine`;
CREATE TABLE `macchine` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `marca` varchar(40) NOT NULL,
  `modello` varchar(40) NOT NULL,
  `descrizione` varchar(500) NOT NULL,
  `anno` int(11) NOT NULL,
  `kilometri` int(11) NOT NULL,
  `stato` varchar(10) NOT NULL,
  `prezzo` int(11) NOT NULL,
  `venditore` varchar(50) NOT NULL,
  `venduta` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venditore` (`venditore`),
  CONSTRAINT `macchine_ibfk_1` FOREIGN KEY (`venditore`) REFERENCES `user` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

INSERT INTO `macchine` (`id`, `marca`, `modello`, `descrizione`, `anno`, `kilometri`, `stato`, `prezzo`, `venditore`, `venduta`) VALUES
(1,	'FIAT',	'Punto',	'Bellissima punto rosa shock in vendita',	1995,	450000,	'nuova',	25000,	'antonio',	1),
(2,	'Fiat',	'Panda',	'Bellissima pandalmare',	2016,	350000,	'Nuova',	50000,	'antonio',	1),
(3,	'BMW',	'X5',	'Bellissima',	2016,	35000,	'Usata',	25000,	'antonio',	0);

DROP TABLE IF EXISTS `ricambi`;
CREATE TABLE `ricambi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `marca` varchar(40) NOT NULL,
  `modello` varchar(40) NOT NULL,
  `descrizione` varchar(500) NOT NULL,
  `stato` varchar(10) NOT NULL,
  `prezzo` int(11) NOT NULL,
  `venduta` int(11) NOT NULL,
  `venditore` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venditore` (`venditore`),
  CONSTRAINT `ricambi_ibfk_1` FOREIGN KEY (`venditore`) REFERENCES `user` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

INSERT INTO `ricambi` (`id`, `marca`, `modello`, `descrizione`, `stato`, `prezzo`, `venduta`, `venditore`) VALUES
(1,	'ALFA ROMEO',	'GIulietta',	'è un tubo',	'usato',	500,	1,	'antonio'),
(2,	'Alfa',	'Stelvio',	'è un pezzo di fero',	'Nuova',	436,	0,	'antonio');

DROP TABLE IF EXISTS `transazioni`;
CREATE TABLE `transazioni` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `venditore` varchar(50) NOT NULL,
  `cliente` varchar(50) NOT NULL,
  `id-macchine-vendita` int(11) DEFAULT NULL,
  `id-ricambi-vendita` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `venditore` (`venditore`),
  KEY `cliente` (`cliente`),
  KEY `id-macchine-vendita` (`id-macchine-vendita`),
  KEY `id-ricambi-vendita` (`id-ricambi-vendita`),
  CONSTRAINT `transazioni_ibfk_1` FOREIGN KEY (`venditore`) REFERENCES `user` (`username`),
  CONSTRAINT `transazioni_ibfk_2` FOREIGN KEY (`cliente`) REFERENCES `user` (`username`),
  CONSTRAINT `transazioni_ibfk_3` FOREIGN KEY (`id-macchine-vendita`) REFERENCES `macchine` (`id`),
  CONSTRAINT `transazioni_ibfk_4` FOREIGN KEY (`id-ricambi-vendita`) REFERENCES `ricambi` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

INSERT INTO `transazioni` (`id`, `venditore`, `cliente`, `id-macchine-vendita`, `id-ricambi-vendita`) VALUES
(1,	'antonio',	'mario',	1,	NULL),
(4,	'antonio',	'mario',	2,	NULL),
(5,	'antonio',	'mario',	NULL,	1);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `clientevenditore` varchar(10) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

INSERT INTO `user` (`username`, `password`, `clientevenditore`) VALUES
('antonio',	'antonio',	'venditore'),
('filippo',	'filippo',	'cliente'),
('mario',	'mario',	'cliente'),
('nicolo',	'nicolo',	'venditore');

-- 2024-06-16 17:58:59
