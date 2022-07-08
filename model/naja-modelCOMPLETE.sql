-- MySQL Workbench Synchronization
-- Generated: 2022-06-30 21:52
-- Model: ModelComplete_Naja_v1
-- Version: 1.0
-- Project: Naja
-- Author: Bruno Santos

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER TABLE `uq5ens43vefj6udx`.`requests` 
DROP FOREIGN KEY `fk_pedidos_usuarios1`;

ALTER TABLE `uq5ens43vefj6udx`.`products` 
CHANGE COLUMN `create_time` `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `price`;

ALTER TABLE `uq5ens43vefj6udx`.`requests` 
DROP COLUMN `create_date`,
ADD COLUMN `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `quantity`,
CHANGE COLUMN `id_client` `id_client` INT(11) NOT NULL AFTER `id_product`,
CHANGE COLUMN `id_request` `id_request` INT(11) NOT NULL ,
ADD INDEX `fk_pedidos_produtos_idx` (`id_product` ASC) ,
DROP INDEX `fk_requests_clients1_idx` ,
ADD INDEX `fk_requests_clients1_idx` (`id_client` ASC) ,
DROP INDEX `fk_requests_products_idx` ;
;

ALTER TABLE `uq5ens43vefj6udx`.`categories` 
CHANGE COLUMN `create_time` `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;

ALTER TABLE `uq5ens43vefj6udx`.`clients` 
DROP COLUMN `update_time`,
CHANGE COLUMN `birthdate` `birthdate` DATE NOT NULL AFTER `password`,
CHANGE COLUMN `gender` `gender` CHAR(1) NOT NULL AFTER `birthdate`,
CHANGE COLUMN `id_client` `id_client` INT(11) NOT NULL AUTO_INCREMENT ,
CHANGE COLUMN `create_time` `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
CHANGE COLUMN `phone` `phone` VARCHAR(17) NULL DEFAULT NULL ;

ALTER TABLE `uq5ens43vefj6udx`.`users` 
CHANGE COLUMN `email` `email` VARCHAR(255) NULL DEFAULT NULL ;

ALTER TABLE `uq5ens43vefj6udx`.`requests` 
ADD CONSTRAINT `fk_requests_clients1`
  FOREIGN KEY (`id_client`)
  REFERENCES `uq5ens43vefj6udx`.`clients` (`id_client`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
