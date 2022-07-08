-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.24-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para naja-db
CREATE DATABASE IF NOT EXISTS `naja-db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `naja-db`;

-- Copiando estrutura para tabela naja-db.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `create_time` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela naja-db.categories: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela naja-db.clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id_client` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `gender` char(1) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `phone` bigint(14) DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_client`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela naja-db.clients: ~1 rows (aproximadamente)
INSERT INTO `clients` (`id_client`, `name`, `email`, `password`, `create_time`, `gender`, `birthdate`, `phone`, `update_time`) VALUES
	(1, 'Bruno Santos de Oliveira', 'bruno.santos@gmail.com', '@brunosantos12345', '2022-06-30 23:18:20', 'M', '2001-03-21', 5531980145601, NULL);

-- Copiando estrutura para tabela naja-db.products
CREATE TABLE IF NOT EXISTS `products` (
  `id_product` int(11) NOT NULL AUTO_INCREMENT,
  `id_categorie` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `image_product` varchar(255) DEFAULT NULL,
  `create_time` date NOT NULL DEFAULT curdate(),
  `productscol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id_product`),
  KEY `fk_produtos_categorias1_idx` (`id_categorie`),
  CONSTRAINT `fk_produtos_categorias1` FOREIGN KEY (`id_categorie`) REFERENCES `categories` (`id_categorie`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela naja-db.products: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela naja-db.requests
CREATE TABLE IF NOT EXISTS `requests` (
  `id_request` int(11) NOT NULL AUTO_INCREMENT,
  `id_product` int(11) NOT NULL,
  `quantity` smallint(6) NOT NULL,
  `id_client` int(11) NOT NULL,
  `create_date` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id_request`),
  KEY `fk_pedidos_produtos_idx` (`id_product`),
  KEY `fk_pedidos_usuarios1_idx` (`id_client`),
  CONSTRAINT `fk_pedidos_produtos` FOREIGN KEY (`id_product`) REFERENCES `products` (`id_product`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedidos_usuarios1` FOREIGN KEY (`id_client`) REFERENCES `clients` (`id_client`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela naja-db.requests: ~0 rows (aproximadamente)

-- Copiando estrutura para tabela naja-db.users
CREATE TABLE IF NOT EXISTS `users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela naja-db.users: ~2 rows (aproximadamente)
INSERT INTO `users` (`id_user`, `email`, `password`) VALUES
	(1, 'brunohashtagfox@gmail.com', '$2b$10$XGiDo0AlTDIPnPG17B8w0uKQJR2uN4wNOS5FEgoCrUT/ghc79drqm'),
	(2, 'email.teste@gmail.com', '$2b$10$mPvRB9K8SN/d2haqzTURxeBJHBBN2jw51rHvMqi7bHJkSBfIGytz6');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
