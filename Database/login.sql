-- MySQL dump 10.13  Distrib 8.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: login
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `career`
--

DROP TABLE IF EXISTS `career`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `career` (
  `career_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`career_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `career`
--

LOCK TABLES `career` WRITE;
/*!40000 ALTER TABLE `career` DISABLE KEYS */;
INSERT INTO `career` VALUES (1,'Ingenieria Civill'),(2,'Ingenieria Comercial'),(3,'Derecho'),(4,'Periodismo'),(5,'Psicologia');
/*!40000 ALTER TABLE `career` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate`
--

DROP TABLE IF EXISTS `certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate` (
  `certificate_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`certificate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate`
--

LOCK TABLES `certificate` WRITE;
/*!40000 ALTER TABLE `certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificate_career`
--

DROP TABLE IF EXISTS `certificate_career`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificate_career` (
  `certificate_id` int NOT NULL,
  `career_id` int NOT NULL,
  KEY `certificate_id_idx` (`certificate_id`),
  KEY `career_id_idx` (`career_id`),
  CONSTRAINT `fk_career_id_certificates` FOREIGN KEY (`career_id`) REFERENCES `career` (`career_id`),
  CONSTRAINT `fk_certificate_id_carrers` FOREIGN KEY (`certificate_id`) REFERENCES `certificate` (`certificate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificate_career`
--

LOCK TABLES `certificate_career` WRITE;
/*!40000 ALTER TABLE `certificate_career` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificate_career` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'alumno'),(2,'profesor'),(3,'administrador');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_certificate`
--

DROP TABLE IF EXISTS `user_certificate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_certificate` (
  `user_id` int NOT NULL,
  `certificate_id` int NOT NULL,
  `approved` char(1) DEFAULT NULL,
  KEY `user_id_idx` (`user_id`),
  KEY `certificate_id_idx` (`certificate_id`),
  CONSTRAINT `fk_certificate_id_users` FOREIGN KEY (`certificate_id`) REFERENCES `certificate` (`certificate_id`),
  CONSTRAINT `fk_user_id_certificates` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_certificate`
--

LOCK TABLES `user_certificate` WRITE;
/*!40000 ALTER TABLE `user_certificate` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_certificate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `career_id` int NOT NULL,
  `role_id` int NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `entry_year` smallint NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,1,'ejemplo@alumnos.uai.cl','hola',2024),(2,1,1,'paco@alumnos.uai.cl','paco',2011),(3,1,1,'gil@alumnos.uai.cl','mono',2011);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-23 21:48:44
